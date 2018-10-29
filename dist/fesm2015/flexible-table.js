import { Injectable, Component, Input, Output, ViewChild, ViewContainerRef, EventEmitter, ElementRef, Renderer, Directive, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntoPipeModule } from 'into-pipes';
import { DragDropModule } from 'drag-enabled';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class TableHeadersGenerator {
    constructor() {
        this.headers = [];
    }
    /**
     * @param {?} root
     * @param {?} path
     * @param {?} maxVisible
     * @param {?} filteringEnabled
     * @return {?}
     */
    generateHeadersFor(root, path, maxVisible, filteringEnabled) {
        if (root !== null) {
            Object.keys(root).map((key) => {
                /** @type {?} */
                const innerPath = (path.length ? (path + "." + key) : key);
                if (typeof root[key] === "string" || typeof root[key] === "number" || typeof root[key] === "boolean") {
                    /** @type {?} */
                    const header = {
                        key: innerPath,
                        value: this.makeWords(innerPath),
                        sortable: true,
                        dragable: true,
                        present: (path.length === 0 && this.headers.length < maxVisible)
                    };
                    if (filteringEnabled) {
                        header.filter = "";
                    }
                    this.headers.push(header);
                }
                else if (root[key] instanceof Array) {
                    /** @type {?} */
                    const node = root[key];
                    if (node.length && !(node[0] instanceof Array) && (typeof node[0] !== "string")) {
                        this.generateHeadersFor(node[0], innerPath, maxVisible, filteringEnabled);
                    }
                    else {
                        this.headers.push({
                            key: innerPath,
                            value: this.makeWords(innerPath)
                        });
                    }
                }
                else {
                    this.generateHeadersFor(root[key], innerPath, maxVisible, filteringEnabled);
                }
            });
        }
        return this.headers;
    }
    /**
     * @param {?} key
     * @param {?} trackingkey
     * @return {?}
     */
    retreiveHeaders(key, trackingkey) {
        /** @type {?} */
        let result;
        try {
            result = localStorage.getItem(trackingkey);
            if (!result || result != key) {
                result = undefined; // we have a newer version and it will override saved data.
            }
            else {
                result = localStorage.getItem(key);
                result = result ? JSON.parse(result) : result;
            }
        }
        catch (e) {
        }
        return result;
    }
    /**
     * @param {?} key
     * @param {?} trackingkey
     * @param {?} headers
     * @return {?}
     */
    persistHeaders(key, trackingkey, headers) {
        try {
            localStorage.removeItem(trackingkey);
            localStorage.setItem(trackingkey, key);
            localStorage.setItem(key, JSON.stringify(headers));
        }
        catch (e) {
        }
    }
    /**
     * @param {?} name
     * @return {?}
     */
    makeWords(name) {
        return name
            .replace(/\./g, ' ~ ')
            .replace(/([A-Z])/g, ' $1')
            .replace(/-/g, " ")
            .replace(/_/g, " ")
            .replace(/^./, (str) => str.toUpperCase());
    }
}
TableHeadersGenerator.decorators = [
    { type: Injectable }
];
/** @nocollapse */
TableHeadersGenerator.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class TableViewComponent {
    /**
     * @param {?} el
     */
    constructor(el) {
        this.el = el;
        this.dragging = false;
        this.printMode = false;
        this.filteredItems = [];
        this.vocabulary = {
            configureTable: "Configure Table",
            configureColumns: "Configure Columns",
            clickSort: "Click to Sort",
            setSize: "Set Size",
            firstPage: "First",
            lastPage: "Last",
            previousPage: "Previous"
        };
        this.tableClass = 'default-flexible-table';
        this.onaction = new EventEmitter();
        this.onchange = new EventEmitter();
        this.onfilter = new EventEmitter();
        this.onCellContentEdit = new EventEmitter();
    }
    /**
     * @param {?} id
     * @return {?}
     */
    findColumnWithID(id) {
        /** @type {?} */
        const list = this.headerColumnElements();
        /** @type {?} */
        let column = null;
        for (let i = 0; i < list.length; i++) {
            if (list[i].getAttribute("id") === id) {
                column = list[i];
                break;
            }
        }
        return column;
    }
    /**
     * @param {?} source
     * @param {?} destination
     * @return {?}
     */
    swapColumns(source, destination) {
        if (source.node.parentNode === destination.node.parentNode) {
            /** @type {?} */
            const srcIndex = this.getColumnIndex(source.medium.key);
            /** @type {?} */
            const desIndex = this.getColumnIndex(destination.medium.key);
            if (srcIndex < 0 || desIndex < 0) {
                console.log("invalid drop id", source.medium.key, destination.medium.key);
                return;
            }
            /** @type {?} */
            const x = this.filteredItems;
            this.filteredItems = [];
            setTimeout(() => {
                /** @type {?} */
                const sobj = this.headers[srcIndex];
                this.headers[srcIndex] = this.headers[desIndex];
                this.headers[desIndex] = sobj;
                this.filteredItems = x;
                this.onfilter.emit(this.filteredItems);
                this.onchange.emit(this.headers);
            }, 33);
        }
        else if (source.medium.locked || destination.medium.locked) {
            /** @type {?} */
            const x = this.filteredItems;
            this.filteredItems = [];
            this.onfilter.emit(this.filteredItems);
            setTimeout(() => {
                source.medium.locked = !source.medium.locked;
                destination.medium.locked = !destination.medium.locked;
                this.filteredItems = x;
                this.onfilter.emit(this.filteredItems);
                this.onchange.emit(this.headers);
            }, 33);
        }
    }
    /**
     * @param {?} id
     * @return {?}
     */
    getColumnIndex(id) {
        /** @type {?} */
        let index = -1;
        for (let i = 0; i < this.headers.length; i++) {
            if (this.headers[i].key === id) {
                index = i;
                break;
            }
        }
        return index;
    }
    /**
     * @param {?} item
     * @param {?} hpath
     * @return {?}
     */
    itemValue(item, hpath) {
        /** @type {?} */
        let subitem = item;
        hpath.map((subkey) => {
            if (subitem) {
                subitem = subitem[subkey];
            }
        });
        return subitem === undefined || subitem === null || subitem === "null" ? "" : subitem;
    }
    /**
     * @return {?}
     */
    initVisibleRows() {
        /** @type {?} */
        const result = [];
        for (let i = 0; i < this.filteredItems.length; i++) {
            if (i >= this.pageInfo.from && i <= this.pageInfo.to) {
                result.push(this.filteredItems[i]);
            }
        }
        this.filteredItems = result;
    }
    /**
     * @param {?} header
     * @param {?} event
     * @return {?}
     */
    lock(header, event) {
        event.stopPropagation();
        event.preventDefault();
        header.locked = !header.locked;
        this.onchange.emit(this.headers);
    }
    /**
     * @param {?} header
     * @param {?} icon
     * @return {?}
     */
    sort(header, icon) {
        if (header.sortable && this.items && this.items.length) {
            for (let i = 0; i < this.headers.length; i++) {
                /** @type {?} */
                const h = this.headers[i];
                if (h.key !== header.key) {
                    /** @type {?} */
                    const item = this.findColumnWithID(h.key);
                    if (item) {
                        item.classList.remove("ascending");
                        item.classList.remove("descending");
                        item.classList.add("sortable");
                    }
                    h.descending = false;
                    h.ascending = false;
                }
            }
            icon.classList.remove("fa-sort");
            if (header.ascending || (!header.ascending && !header.descending)) {
                header.descending = true;
                header.ascending = false;
                icon.classList.remove("fa-sort-asc");
                icon.classList.add("fa-sort-desc");
            }
            else {
                header.descending = false;
                header.ascending = true;
                icon.classList.remove("fa-sort-desc");
                icon.classList.add("fa-sort-asc");
            }
            /** @type {?} */
            const hpath = header.key.split(".");
            if (this.enableFiltering) {
                this.filterItems();
            }
            else {
                this.filteredItems = this.items ? this.items : [];
            }
            this.filteredItems.sort((a, b) => {
                /** @type {?} */
                const v1 = this.itemValue(a, hpath);
                /** @type {?} */
                const v2 = this.itemValue(b, hpath);
                if (header.ascending) {
                    return v1 > v2 ? 1 : -1;
                }
                return v1 < v2 ? 1 : -1;
            });
            this.initVisibleRows();
        }
    }
    /**
     * @return {?}
     */
    offsetWidth() {
        return this.table.element.nativeElement.offsetWidth;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        // if (changes.items) {
        // 	this.evaluateRows();
        // }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.pageInfo) {
            if (!this.pageInfo.to) {
                this.pageInfo.to = this.pageInfo.pageSize;
            }
        }
        else {
            this.pageInfo = {
                contentSize: 100000,
                pageSize: 100000,
                pages: 1,
                from: 0,
                to: 100000,
                currentPage: 1,
                maxWidth: "0"
            };
        }
        if (!this.headers) {
            this.headers = [];
        }
        this.evaluateRows();
        if (this.actionKeys) {
            this.actionKeys = this.actionKeys.split(",");
        }
        if (!this.rowDetailer && this.expandable) {
            this.rowDetailer = function (item) {
                return { data: item, headers: [] };
            };
        }
        if (!this.expandable) {
            this.expandable = function (item, showIcon) { return showIcon; };
        }
        if (!this.rowDetailerHeaders) {
            this.rowDetailerHeaders = (item) => [];
        }
    }
    /**
     * @return {?}
     */
    evaluateRows() {
        if (this.enableFiltering) {
            this.filterItems();
        }
        else {
            this.filteredItems = this.items ? this.items : [];
        }
        this.initVisibleRows();
    }
    /**
     * @return {?}
     */
    headerColumnElements() {
        /** @type {?} */
        let result = [];
        if (this.table.element.nativeElement.children) {
            /** @type {?} */
            const list = this.table.element.nativeElement.children;
            result = this.caption ? list[1].children[0].children : list[0].children[0].children;
        }
        return result;
    }
    /**
     * @param {?} id
     * @return {?}
     */
    headerById(id) {
        /** @type {?} */
        let h;
        for (const i in this.headers) {
            if (this.headers[i].key === id) {
                h = this.headers[i];
                break;
            }
        }
        return h;
    }
    /**
     * @return {?}
     */
    columnsCount() {
        /** @type {?} */
        let count = 0;
        this.headers.map((item) => {
            if (item.present) {
                count++;
            }
        });
        if (this.action) {
            count++;
        }
        return count;
    }
    /**
     * @param {?} item
     * @param {?} flag
     * @return {?}
     */
    hover(item, flag) {
        if (flag) {
            item.hover = true;
        }
        else {
            delete item.hover;
        }
    }
    /**
     * @param {?} header
     * @return {?}
     */
    toCssClass(header) {
        return header.key.replace(/\./g, '-');
    }
    /**
     * @param {?} event
     * @param {?} item
     * @return {?}
     */
    keydown(event, item) {
        /** @type {?} */
        const code = event.which;
        if ((code === 13) || (code === 32)) {
            item.click();
        }
    }
    /**
     * @param {?} item
     * @return {?}
     */
    offScreenMessage(item) {
        /** @type {?} */
        let message = this.action;
        if (this.actionKeys) {
            this.actionKeys.map((key) => { message = message.replace(key, item[key.substring(1, key.length - 1)]); });
        }
        return message;
    }
    /**
     * @param {?} item
     * @param {?} header
     * @return {?}
     */
    cellContent(item, header) {
        /** @type {?} */
        let content = this.itemValue(item, header.key.split("."));
        return (content !== undefined && content != null && String(content).length) ? content : '&nbsp;';
    }
    /**
     * @param {?} item
     * @return {?}
     */
    rowDetailerContext(item) {
        return {
            data: item,
            tableInfo: this.tableInfo,
            headers: this.rowDetailerHeaders(item)
        };
    }
    /**
     * @param {?} event
     * @param {?} header
     * @return {?}
     */
    changeFilter(event, header) {
        /** @type {?} */
        const code = event.which;
        header.filter = event.target.value;
        if (this.filterwhiletyping || code === 13) {
            if (this.filteringTimerId) {
                clearTimeout(this.filteringTimerId);
            }
            this.filteringTimerId = setTimeout(() => {
                this.filterItems();
                this.initVisibleRows();
                this.filteringTimerId = undefined;
            }, 123);
        }
    }
    /**
     * @param {?} event
     * @param {?} item
     * @return {?}
     */
    actionClick(event, item) {
        event.stopPropagation();
        if (this.rowDetailer && (this.expandIf || this.expandable(item, false))) {
            if (item.expanded) {
                delete item.expanded;
            }
            else {
                item.expanded = true;
            }
        }
        else {
            this.onaction.emit(item);
        }
        return false;
    }
    /**
     * @return {?}
     */
    print() {
        this.printMode = true;
        setTimeout(() => {
            /** @type {?} */
            const content = this.el.nativeElement.innerHTML;
            this.printMode = false;
            /** @type {?} */
            const popupWin = window.open('', '_blank', 'width=300,height=300');
            popupWin.document.open();
            popupWin.document.write('<html><body onload="window.print()">' + content + '</html>');
            popupWin.document.close();
        }, 3);
    }
    /**
     * @param {?} value
     * @param {?} filterBy
     * @return {?}
     */
    shouldSkipItem(value, filterBy) {
        /** @type {?} */
        let result = false;
        if (value !== undefined && value !== null && String(value).length) {
            /** @type {?} */
            const v = String(value);
            if (filterBy[0] === '<') {
                result = filterBy.length > 1 && parseFloat(v) >= parseFloat(filterBy.substring(1));
            }
            else if (filterBy[0] === '>') {
                result = filterBy.length > 1 && parseFloat(v) <= parseFloat(filterBy.substring(1));
            }
            else if (filterBy[0] === '!') {
                result = filterBy.length > 1 && parseFloat(v) == parseFloat(filterBy.substring(1));
            }
            else if (filterBy[0] === '=') {
                result = filterBy.length == 1 || parseFloat(v) !== parseFloat(filterBy.substring(1));
            }
            else if (filterBy[0] === '*' && filterBy[filterBy.length - 1] !== '*') {
                /** @type {?} */
                const f = filterBy.substring(1);
                result = v.indexOf(f) !== v.length - f.length;
            }
            else if (filterBy[0] !== '*' && filterBy[filterBy.length - 1] === '*') {
                /** @type {?} */
                const f = filterBy.substring(0, filterBy.length - 1);
                result = v.indexOf(f) !== 0;
            }
            else if (filterBy[0] === '*' && filterBy[filterBy.length - 1] === '*') {
                result = filterBy.length > 1 && v.indexOf(filterBy.substring(1, filterBy.length - 1)) < 0;
            }
            else {
                result = v.indexOf(filterBy) < 0;
            }
        }
        return result;
    }
    /**
     * @return {?}
     */
    filterItems() {
        this.filteredItems = this.items ? this.items.filter((item) => {
            /** @type {?} */
            let keepItem = true;
            for (let i = 0; i < this.headers.length; i++) {
                /** @type {?} */
                const header = this.headers[i];
                if (header.filter && header.filter.length) {
                    /** @type {?} */
                    const v = this.itemValue(item, header.key.split("."));
                    if (this.shouldSkipItem(v, header.filter)) {
                        keepItem = false;
                        break;
                    }
                }
            }
            return keepItem;
        }) : [];
        this.onfilter.emit(this.filteredItems);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onTableCellEdit(event) {
        /** @type {?} */
        const id = event.id.split("-");
        /** @type {?} */
        const n = event.name;
        /** @type {?} */
        const v = event.value;
        /** @type {?} */
        const t = this.items[parseInt(id[1])];
        if (t) {
            /** @type {?} */
            const list = id[0].split(".");
            /** @type {?} */
            let subitem = t[list[0]];
            for (let i = 1; i < (list.length - 1); i++) {
                subitem = subitem[list[i]];
            }
            if (subitem && list.length > 1) {
                subitem[list[list.length - 1]] = v;
            }
            this.onCellContentEdit.emit({ name: n, value: v, item: t });
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    dragEnabled(event) {
        return event.medium.dragable;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    dropEnabled(event) {
        return event.destination.medium.dragable;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onDragStart(event) {
        //        this.dragging = true;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onDragEnd(event) {
        //       this.dragging = false;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onDrop(event) {
        this.swapColumns(event.source, event.destination);
    }
}
TableViewComponent.decorators = [
    { type: Component, args: [{
                selector: 'table-view',
                template: "\r\n<table [class]=\"tableClass\"  #flexible>\r\n    <caption *ngIf=\"caption\" [textContent]=\"caption\"></caption>\r\n    <thead>\r\n        <tr>\r\n            <th scope=\"col\" *ngIf=\"enableIndexing && !printMode\" id=\"indexable\" class=\"indexable\"></th>\r\n            <th scope=\"col\" *ngFor=\"let header of headers\" #th\r\n                [dragEnabled]=\"dragEnabled.bind(this)\"\r\n                [dropEnabled]=\"dropEnabled.bind(this)\"\r\n                [medium]=\"header\"\r\n                (onDragStart)=\"onDragStart($event)\"\r\n                (onDragEnd)=\"onDragEnd($event)\"\r\n                (onDrop)=\"onDrop($event)\"\r\n                [id]=\"header.key\"\r\n                [attr.width]=\"header.width ? header.width : null\" \r\n                [style.min-width]=\"header.minwidth ? header.minwidth : ''\" \r\n                [attr.tabindex]=\"header.sortable ? 0 : -1\"\r\n                (keydown)=\"keydown($event, th)\" (click)=\"sort(header, icon)\">\r\n                <span *ngIf=\"!printMode && header.sortable\" class=\"off-screen\"  [textContent]=\"vocabulary.clickSort\"></span>\r\n                <span class=\"locker icon fa\" #locker\r\n                        *ngIf=\"!printMode && lockable && (headers.length > 1 || header.locked)\"\r\n                        tabindex=\"0\"\r\n                        title=\"lock/unlock this column\"\r\n                        (keydown)=\"keydown($event, locker)\" (click)=\"lock(header, $event)\"\r\n                        [class.fa-lock]=\"header.locked\"\r\n                        [class.fa-unlock]=\"!header.locked\"></span>\r\n                <span class=\"title\"\r\n                        [class.dragable]=\"header.dragable\"\r\n                        [textContent]=\"header.value\"></span>\r\n                <span class=\"icon fa\" [class.hidden]=\"printMode || !items || items.length === 0\" #icon\r\n                        [class.fa-sort]=\"header.sortable\"\r\n                        [class.fa-sort-asc]=\"header.assending\"\r\n                        [class.fa-sort-desc]=\"header.desending\"></span>\r\n            </th>\r\n            <th scope=\"col\" *ngIf=\"action && !printMode\" id=\"actionable\" class=\"actionable\"></th>\r\n        </tr>\r\n    </thead>\r\n    <tbody>\r\n        <tr *ngIf=\"!printMode && enableFiltering && items && items.length\">\r\n            <td scope=\"row\" *ngIf=\"enableIndexing && !printMode\" class=\"index filter\">\r\n                <input type=\"text\" disabled style=\"opacity:0\" />\r\n            </td>\r\n            <td scope=\"row\" \r\n                        *ngFor=\"let header of headers; let i=index\" \r\n                        [attr.data-label]=\"header.value\" \r\n                        class=\"filter\">\r\n                <span *ngIf=\"header.filter === undefined\">&nbsp;</span>\r\n                <input  *ngIf=\"header.filter !== undefined\"\r\n                        id=\"filter-{{i}}\"\r\n                        type=\"text\" \r\n                        (keyup)=\"changeFilter($event, header)\"\r\n                        [value]=\"header.filter ? header.filter : ''\" />\r\n                <label *ngIf=\"header.filter !== undefined\" for=\"filter-{{i}}\" ><span class=\"off-screen\" >Filter \"{{header.value}}\"</span><span class=\"fa fa-search\"></span></label>\r\n            </td>\r\n            <td scope=\"row\" *ngIf=\"action && !printMode\"></td>\r\n        </tr>\r\n       <ng-template ngFor let-item [ngForOf]=\"filteredItems\" let-i=\"index\">\r\n            <tr (click)=\"actionClick($event, item)\"\r\n                (mouseover)=\"hover(item, true)\"\r\n                (mouseout)=\"hover(item, false)\"\r\n                [class.pointer]=\"action\"\r\n                [class.hover]=\"item.hover\"\r\n                [class.expanded]=\"item.expanded\"\r\n                [class.odd]=\"i%2\">\r\n                <td scope=\"row\" class=\"index\" *ngIf=\"enableIndexing && !printMode\">\r\n                    <span [textContent]=\"i + pageInfo.from + 1\"></span></td>\r\n                <td scope=\"row\" \r\n                    *ngFor=\"let header of headers\" \r\n                    [class]=\"toCssClass(header)\"\r\n                    [attr.data-label]=\"header.value\" \r\n                    [intoName]=\"header.value\"\r\n                    [intoId]=\"header.key + '-' + i\"\r\n                    [into]=\"header.format\"\r\n                    [intoData]=\"item\"\r\n                    [rawContent]=\"cellContent(item, header)\"\r\n                    [onComponentChange]=\"onTableCellEdit.bind(this)\"></td>\r\n                <td scope=\"row\" *ngIf=\"action && !printMode\">\r\n                    <a class=\"actionable\"\r\n                        *ngIf=\"expandable(item, true)\"\r\n                        tabindex=\"0\"\r\n                        role=\"button\"\r\n                        style=\"cursor:pointer\"\r\n                        [class.expanded]=\"item.expanded\" #clicker\r\n                        (keydown)=\"keydown($event, clicker)\" (click)=\"actionClick($event, item)\">\r\n                        <span\r\n                            class=\"icon fa\"\r\n                            [class.fa-angle-right]=\"!rowDetailer\"\r\n                            [class.fa-minus-square-o]=\"rowDetailer && item.expanded\"\r\n                            [class.fa-plus-square-o]=\"rowDetailer && !item.expanded\"\r\n                            aria-hidden=\"true\"></span>\r\n                        <span class=\"off-screen\" [textContent]=\"offScreenMessage(item)\"></span>\r\n                    </a>\r\n                </td>\r\n            </tr>\r\n            <tr *ngIf=\"rowDetailer && item.expanded\" class=\"detail\" [class.odd]=\"i%2\">\r\n                <td scope=\"row\" class=\"index\" *ngIf=\"enableIndexing && !printMode\"></td>\r\n                <td [attr.colspan]=\"columnsCount()\">\r\n                    <ng-container [ngTemplateOutlet]=\"rowDetailer\" [ngTemplateOutletContext]=\"rowDetailerContext(item)\"></ng-container>\r\n                </td>\r\n            </tr>\r\n        </ng-template>\r\n    </tbody>\r\n</table>\r\n",
                styles: [":host{display:inline-block!important;width:100%;position:relative;margin:0 auto;border-spacing:0;border-collapse:collapse}:host .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host table{margin:1rem auto;padding:0;width:100%;table-layout:fixed;max-width:99%;background-color:transparent;border-collapse:collapse}:host table caption{background-color:#c3e5e2;border-radius:2px;color:#1b1b1b;caption-side:top;font-size:14px;padding:5px 6px;margin-bottom:15px;text-align:left}:host table thead{border-top:1px solid #bbb;border-bottom:1px solid #bbb;background-color:#eee}:host table tr{border:0}:host table tr.expanded td{font-weight:700}:host table td{padding-left:3px;min-height:23px}:host table td.index span{display:block;height:23px}:host table td:first-child{padding-left:5px}:host table td ::ng-deep input-component .locked,:host table td ::ng-deep input-component input{width:99%}:host table td .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host table td.filter{padding:0;position:relative}:host table td.filter input{box-sizing:border-box;width:100%;margin:0}:host table td.filter .fa{position:absolute;top:4px;right:2px;color:#bad}:host table td ::ng-deep img{height:24px}:host table td.index{background-color:#eee;border-right:1px solid #bbb}:host table th{cursor:default;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none;height:24px;position:relative;white-space:nowrap;font-weight:400;text-transform:uppercase;font-size:14px;padding-top:6px;padding-bottom:6px;text-align:left}:host table th.drag-over{background-color:#9b9b9b}:host table th.drag-over .icon,:host table th.drag-over .title{color:#eee}:host table th:first-child{padding-left:5px}:host table th.ascending,:host table th.descending,:host table th.sortable{cursor:pointer;height:12px}:host table th.indexable{width:33px}:host table th.actionable{width:24px}:host table th .hidden{display:none}:host table th .title{color:#254a4d;display:inline-block;height:20px;white-space:nowrap}:host table th .dragable{cursor:move}:host table th .icon{width:22px;display:inline-block;height:20px;color:#254a4d}:host .fa.fa-angle-right{font-size:18px}table tr.expanded td{border-bottom:0}table tr.detail td{border-top:0;cursor:default}table tr.expanded td a.expanded{background-position:right 2px}table tbody tr.hover,table tbody tr:hover{background-color:#ffeed2}table tbody tr.detail.hover,table tbody tr.detail.hover td table thead tr,table tbody tr.detail:hover,table tbody tr.detail:hover td table thead tr{background-color:inherit}table tr td a.actionable{display:inline-table;height:32px;vertical-align:middle;width:25px;line-height:30px;color:#254a4d}table tbody tr.detail.hover td:last-child,table tbody tr.detail:hover td:last-child{border-right:0}table tbody tr.detail.hover td:first-child,table tbody tr.detail:hover td:first-child{border-left:0}table tr td{border-bottom:1px solid #b1b3b3;color:#254a5d;font-size:15px;text-transform:capitalize}table tbody tr.pointer{cursor:pointer}table.alert-danger{border:0}table.alert-danger caption{background-color:transparent;font-weight:700;margin-bottom:0}table.alert-danger td{border-bottom:0;display:block}table.alert-danger td:first-child{padding-left:0}table.alert-danger td:last-child{border-bottom:0}table.alert-danger td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase;width:20%}table.alert-danger td a span.icon{width:100%}table.alert-danger thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}table.alert-danger tr{border:2px solid #fff;display:block;margin-bottom:.625em;padding:5px;border-radius:5px}table.alert-danger tr th.actionable{width:inherit}table.alert-danger tr td{border-bottom:0}@media screen and (max-width:600px){table{border:0}table td{border-bottom:0;display:block;text-align:right}table td:first-child{padding-left:0}table td:last-child{border-bottom:0}table td.filter input{width:50%!important}table td.filter .fa{right:7px!important}table td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase}table td a span.icon{width:100%}table thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}table tr{border-bottom:3px solid #ddd;display:block;margin-bottom:.625em}table tr th.actionable{width:inherit}table tr td{border-bottom:0}table.alert-danger td:before{width:inherit}}"]
            }] }
];
/** @nocollapse */
TableViewComponent.ctorParameters = () => [
    { type: ElementRef }
];
TableViewComponent.propDecorators = {
    vocabulary: [{ type: Input, args: ["vocabulary",] }],
    lockable: [{ type: Input, args: ["lockable",] }],
    caption: [{ type: Input, args: ["caption",] }],
    action: [{ type: Input, args: ["action",] }],
    pageInfo: [{ type: Input, args: ["pageInfo",] }],
    actionKeys: [{ type: Input, args: ["actionKeys",] }],
    tableClass: [{ type: Input, args: ["tableClass",] }],
    headers: [{ type: Input, args: ["headers",] }],
    items: [{ type: Input, args: ["items",] }],
    tableInfo: [{ type: Input, args: ["tableInfo",] }],
    enableIndexing: [{ type: Input, args: ["enableIndexing",] }],
    enableFiltering: [{ type: Input, args: ["enableFiltering",] }],
    rowDetailer: [{ type: Input, args: ["rowDetailer",] }],
    expandable: [{ type: Input, args: ["expandable",] }],
    expandIf: [{ type: Input, args: ["expandIf",] }],
    filterwhiletyping: [{ type: Input, args: ["filterwhiletyping",] }],
    rowDetailerHeaders: [{ type: Input, args: ["rowDetailerHeaders",] }],
    onaction: [{ type: Output, args: ['onaction',] }],
    onchange: [{ type: Output, args: ['onchange',] }],
    onfilter: [{ type: Output, args: ['onfilter',] }],
    onCellContentEdit: [{ type: Output, args: ['onCellContentEdit',] }],
    table: [{ type: ViewChild, args: ['flexible', { read: ViewContainerRef },] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class FlexibleTableComponent {
    /**
     * @param {?} generator
     */
    constructor(generator) {
        this.generator = generator;
        this.vocabulary = {
            printTable: "Print Table",
            configureTable: "Configure Table",
            configureColumns: "Configure Columns",
            clickSort: "Click to Sort",
            setSize: "Set Size",
            firstPage: "First",
            lastPage: "Last",
            previousPage: "Previous"
        };
        this.tableClass = 'default-flexible-table';
        this.onaction = new EventEmitter();
        this.onCellContentEdit = new EventEmitter();
        this.onconfigurationchange = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.persistenceKey) {
            /** @type {?} */
            const headers = this.generator.retreiveHeaders(this.persistenceKey, this.persistenceId);
            if (headers) {
                this.headers = headers;
            }
        }
        if (!this.headers || this.headers.length === 0) {
            this.headers = this.generator.generateHeadersFor(this.items[0], "", 5, this.enableFiltering);
            if (this.persistenceKey) {
                this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
            }
        }
        if (!this.rowDetailer && this.expandable) {
            this.rowDetailer = function (item) {
                return { data: item, headers: [] };
            };
        }
        if (this.pageInfo) {
            if (!this.pageInfo.to) {
                this.pageInfo.to = this.pageInfo.pageSize;
            }
            this.pageInfo.contentSize = this.items.length;
        }
        else {
            this.pageInfo = {
                contentSize: 100000,
                pageSize: 100000,
                pages: 1,
                from: 0,
                to: 100000,
                currentPage: 1,
                maxWidth: "0"
            };
        }
        this.updateLimits();
    }
    /**
     * @return {?}
     */
    updateLimits() {
        this.subHeaders = this.headers.filter((header) => header.present === true);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    reconfigure(event) {
        this.headers = event;
        this.updateLimits();
        this.onconfigurationchange.emit(event);
        if (this.persistenceKey) {
            this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onPaginationChange(event) {
        this.pageInfo = event;
        this.viewTable.evaluateRows();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    tableAction(event) {
        this.onaction.emit(event);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onDrop(event) {
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onCellEdit(event) {
        this.onCellContentEdit.emit(event);
    }
}
FlexibleTableComponent.decorators = [
    { type: Component, args: [{
                selector: 'flexible-table',
                template: "\r\n<div class=\"flexible-table\">\r\n    <table-configuration\r\n        *ngIf=\"configurable && items && items.length\"\r\n        class=\"table-configuration\" \r\n        [headers]=\"headers\" \r\n        [title]=\"vocabulary.configureColumns\" \r\n        [printTable]=\"vocabulary.printTable\"\r\n        [action]=\"vocabulary.configureTable\"\r\n        [configAddon]=\"configAddon\"\r\n        (onprint)=\"viewTable.print()\"\r\n        (onchange)=\"reconfigure($event)\"></table-configuration>\r\n        \r\n    <table-view #viewTable\r\n        [action]=\"action\"\r\n        [actionKeys]=\"actionKeys\"\r\n\t\t[tableClass]=\"tableClass\"\r\n\t\t[tableInfo]=\"tableInfo\"\r\n\t\t[caption]=\"caption\" \r\n\t\t[headers]=\"subHeaders\" \r\n        [items]=\"items\" \r\n        [filterwhiletyping]=\"filterwhiletyping\"\r\n        [pageInfo]=\"pageInfo\"\r\n        [vocabulary]=\"vocabulary\"\r\n\t\t[enableIndexing]=\"enableIndexing\"\r\n\t\t[enableFiltering]=\"enableFiltering\"\r\n        [rowDetailer]=\"rowDetailer\"\r\n        [rowDetailerHeaders]=\"rowDetailerHeaders\"\r\n        [expandable]=\"expandable\"\r\n        [expandIf]=\"expandIf\"\r\n        (onDrop)=\"onDrop($event)\"\r\n\t\t(onCellContentEdit)=\"onCellEdit($event)\"\r\n        (onchange)=\"reconfigure($event)\"\r\n\t\t(onaction)=\"tableAction($event)\"></table-view>\r\n</div>\r\n<table-pagination \r\n    [info]=\"pageInfo\" \r\n    [vocabulary]=\"vocabulary\"\r\n    (onchange)=\"onPaginationChange($event)\"></table-pagination>\r\n",
                styles: [":host{display:inline-block!important;width:100%}.flexible-table{position:relative;margin:0 auto;display:table;border-spacing:0;border-collapse:collapse}.flexible-table .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table{margin:1rem auto;padding:0;width:100%;table-layout:fixed;max-width:99%;background-color:transparent;border-collapse:collapse}.flexible-table table caption{background-color:#c3e5e2;border-radius:2px;color:#1b1b1b;caption-side:top;font-size:14px;padding:5px 6px;margin-bottom:15px;text-align:left}.flexible-table table thead{border-top:1px solid #bbb;border-bottom:1px solid #bbb;background-color:#eee}.flexible-table table tr{border:0}.flexible-table table tr.expanded td{font-weight:700;border-bottom:0}.flexible-table table td{padding-left:3px}.flexible-table table td:first-child{padding-left:5px}.flexible-table table td .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table td.index{background-color:#eee;border-right:1px solid #bbb}.flexible-table table th{cursor:default;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none;height:24px;position:relative;white-space:nowrap;font-weight:400;text-transform:uppercase;font-size:14px;padding-top:6px;padding-bottom:6px;text-align:left}.flexible-table table th.drag-over{background-color:#9b9b9b}.flexible-table table th.drag-over .icon,.flexible-table table th.drag-over .title{color:#eee}.flexible-table table th:first-child{padding-left:5px}.flexible-table table th.ascending,.flexible-table table th.descending,.flexible-table table th.sortable{cursor:pointer;height:12px}.flexible-table table th.indexable{width:33px}.flexible-table table th.actionable{width:24px}.flexible-table table th .title{color:#254a4d;display:inline-block;height:20px;white-space:nowrap}.flexible-table table th .dragable{cursor:move}.flexible-table table th .icon{width:22px;display:inline-block;height:20px;color:#254a4d}.flexible-table .fa.fa-angle-right{font-size:18px}.flexible-table table tr.detail td{border-top:0;cursor:default}.flexible-table table tr.expanded td a.expanded{background-position:right 2px}.flexible-table table tbody tr:hover{background-color:#ffeed2}.flexible-table table tbody tr.detail:hover,.flexible-table table tbody tr.detail:hover td table thead tr{background-color:inherit}.flexible-table table tr td a.actionable{display:inline-table;height:32px;vertical-align:middle;width:25px;line-height:30px;color:#254a4d}.flexible-table table tbody tr.detail:hover td:last-child{border-right:0}.flexible-table table tbody tr.detail:hover td:first-child{border-left:0}.flexible-table table tr td{border-bottom:1px solid #b1b3b3;color:#254a5d;font-size:15px;text-transform:capitalize}.flexible-table table tbody tr.pointer{cursor:pointer}.flexible-table table.alert-danger{border:0}.flexible-table table.alert-danger caption{background-color:transparent;font-weight:700;margin-bottom:0}.flexible-table table.alert-danger td{border-bottom:0;display:block}.flexible-table table.alert-danger td:first-child{padding-left:0}.flexible-table table.alert-danger td:last-child{border-bottom:0}.flexible-table table.alert-danger td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase;width:20%}.flexible-table table.alert-danger td a span.icon{width:100%}.flexible-table table.alert-danger thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table.alert-danger tr{border:2px solid #fff;display:block;margin-bottom:.625em;padding:5px;border-radius:5px}.flexible-table table.alert-danger tr th.actionable{width:inherit}.flexible-table table.alert-danger tr td{border-bottom:0}@media screen and (max-width:600px){.flexible-table table{border:0}.flexible-table table td{border-bottom:0;display:block;text-align:right}.flexible-table table td:first-child{padding-left:0}.flexible-table table td:last-child{border-bottom:0}.flexible-table table td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase}.flexible-table table td a span.icon{width:100%}.flexible-table table thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table tr{border-bottom:3px solid #ddd;display:block;margin-bottom:.625em}.flexible-table table tr th.actionable{width:inherit}.flexible-table table tr td{border-bottom:0}.flexible-table table.alert-danger td:before{width:inherit}}"]
            }] }
];
/** @nocollapse */
FlexibleTableComponent.ctorParameters = () => [
    { type: TableHeadersGenerator }
];
FlexibleTableComponent.propDecorators = {
    vocabulary: [{ type: Input, args: ["vocabulary",] }],
    persistenceId: [{ type: Input, args: ["persistenceId",] }],
    persistenceKey: [{ type: Input, args: ["persistenceKey",] }],
    caption: [{ type: Input, args: ["caption",] }],
    action: [{ type: Input, args: ["action",] }],
    actionKeys: [{ type: Input, args: ["actionKeys",] }],
    tableClass: [{ type: Input, args: ["tableClass",] }],
    headers: [{ type: Input, args: ["headers",] }],
    items: [{ type: Input, args: ["items",] }],
    pageInfo: [{ type: Input, args: ["pageInfo",] }],
    tableInfo: [{ type: Input, args: ["tableInfo",] }],
    configurable: [{ type: Input, args: ["configurable",] }],
    configAddon: [{ type: Input, args: ["configAddon",] }],
    enableIndexing: [{ type: Input, args: ["enableIndexing",] }],
    enableFiltering: [{ type: Input, args: ["enableFiltering",] }],
    rowDetailer: [{ type: Input, args: ["rowDetailer",] }],
    expandable: [{ type: Input, args: ["expandable",] }],
    expandIf: [{ type: Input, args: ["expandIf",] }],
    filterwhiletyping: [{ type: Input, args: ["filterwhiletyping",] }],
    rowDetailerHeaders: [{ type: Input, args: ["rowDetailerHeaders",] }],
    onaction: [{ type: Output, args: ['onaction',] }],
    onCellContentEdit: [{ type: Output, args: ['onCellContentEdit',] }],
    onconfigurationchange: [{ type: Output, args: ['onconfigurationchange',] }],
    viewTable: [{ type: ViewChild, args: ['viewTable',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class PaginationComponent {
    constructor() {
        this.vocabulary = { setSize: "", firstPage: "", nextPage: "", lastPage: "", previousPage: "" };
        this.info = { contentSize: 0, pageSize: 0, maxWidth: "0" };
        this.onchange = new EventEmitter();
        this.onready = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (!this.info) {
            this.info = {
                contentSize: 1000,
                pageSize: 1000,
                pages: 1,
                from: 0,
                to: 1000,
                currentPage: 1,
                maxWidth: "0"
            };
        }
        if (this.info.contentSize && this.info.pageSize) {
            this.info.pages = Math.ceil(this.info.contentSize / this.info.pageSize);
            this.info.from = 0;
            this.info.to = this.info.pageSize - 1;
            this.info.currentPage = 1;
            setTimeout(() => this.ready(), 66);
        }
    }
    /**
     * @param {?} width
     * @return {?}
     */
    setWidth(width) {
        this.info.maxWidth = width + "px";
    }
    /**
     * @return {?}
     */
    ready() {
        this.onready.emit(this);
        this.onchange.emit(this.info);
    }
    /**
     * @return {?}
     */
    selectFirst() {
        if (this.info.currentPage > 1) {
            this.info.from = 0;
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage = 1;
            this.onchange.emit(this.info);
        }
    }
    /**
     * @return {?}
     */
    selectNext() {
        if (this.info.currentPage < this.info.pages) {
            this.info.from = this.info.to + 1;
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage++;
            this.onchange.emit(this.info);
        }
    }
    /**
     * @return {?}
     */
    selectPrev() {
        if (this.info.currentPage > 1) {
            this.info.from -= this.info.pageSize;
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage--;
            this.onchange.emit(this.info);
        }
    }
    /**
     * @return {?}
     */
    selectLast() {
        if (this.info.currentPage < this.info.pages) {
            this.info.from = this.info.pageSize * (this.info.pages - 1);
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage = this.info.pages;
            this.onchange.emit(this.info);
        }
    }
    /**
     * @param {?} ranger
     * @return {?}
     */
    changeCurrent(ranger) {
        /** @type {?} */
        const v = parseInt(ranger.value, 10);
        if (this.info.currentPage < v && v > 0 && v < this.info.pages) {
            this.info.from = v * (this.info.pageSize - 1);
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage = v;
            this.onchange.emit(this.info);
        }
        else {
            ranger.value = this.info.currentPage;
        }
    }
    /**
     * @param {?} sizer
     * @return {?}
     */
    changeSize(sizer) {
        /** @type {?} */
        const v = parseInt(sizer.value, 10);
        if (this.info.contentSize >= v && v > 1) {
            this.info.pageSize = v;
            this.info.pages = Math.ceil(this.info.contentSize / v);
            this.info.from = 0;
            this.info.to = this.info.pageSize - 1;
            this.info.currentPage = 1;
            this.onchange.emit(this.info);
        }
        else {
            sizer.value = this.info.pageSize;
        }
    }
}
PaginationComponent.decorators = [
    { type: Component, args: [{
                selector: 'table-pagination',
                template: "<div *ngIf=\"info && info.pages > 1\" [style.width]=\"info.maxWidth\" class=\"table-pagination\" #paginationWrapper>\r\n    <div class=\"fa fa-angle-left\"\r\n         (click)=\"selectPrev()\"\r\n         [class.disabled]=\"info.currentPage==1\">\r\n        <span class=\"prev\" [textContent]=\"vocabulary.previousPage\"></span>\r\n    </div>\r\n    <div class=\"fa fa-angle-double-left\"\r\n         (click)=\"selectFirst()\"\r\n         [class.disabled]=\"info.currentPage==1\">\r\n        <span class=\"first\" [textContent]=\"vocabulary.firstPage\"></span>\r\n    </div>\r\n    <div class=\"current\">\r\n        <input  #ranger [value]=\"info.currentPage\" (keydown.Enter)=\"changeCurrent(ranger)\" />\r\n        <span [textContent]=\"' / ' + info.pages\"></span>\r\n\t</div>\r\n    <div class=\"fa fa-angle-double-right\"\r\n         (click)=\"selectLast()\"\r\n         [class.disabled]=\"info.currentPage==info.pages\">\r\n        <span class=\"last\" [textContent]=\"vocabulary.lastPage\"></span>\r\n    </div>\r\n    <div class=\"fa fa-angle-right\"\r\n         (click)=\"selectNext()\"\r\n         [class.disabled]=\"info.currentPage==info.pages\">\r\n        <span class=\"next\" [textContent]=\"vocabulary.nextPage\"></span>\r\n    </div>\r\n    <div class=\"reset-size\" *ngIf=\"info.resetSize\">\r\n        <label for=\"pagination-set-size\">\r\n            <span class=\"off-screen\" [textContent]=\"vocabulary.setSize\"></span>\r\n            <input id=\"pagination-set-size\" [value]=\"info.pageSize\" (keydown.Enter)=\"changeSize(sizer)\" #sizer />\r\n        </label>\r\n    </div>\r\n</div>\r\n",
                styles: [".table-pagination{box-sizing:border-box;background-color:#fff;border:1px solid #254a5d;border-radius:2px;color:#254a5d;bottom:5px;clear:both;display:flex;font-size:1em;height:38px;max-width:100%;margin:0 auto;position:fixed;left:40%;z-index:55}.table-pagination .fa{padding:4px 8px;margin-top:5px}.table-pagination .first,.table-pagination .last,.table-pagination .next,.table-pagination .prev{background-repeat:no-repeat;cursor:pointer;width:auto;display:block;height:39px;text-indent:-99999px;box-sizing:border-box}.table-pagination .reset-size{padding:0;height:35px;border-radius:4px}.table-pagination .reset-size input{border:0;border-left:1px solid #4c5854;height:34px;text-align:center;width:30px;margin-right:2px;margin-left:8px}.table-pagination .current{padding:1px 5px}.table-pagination .current input{padding:0 3px;width:14px;height:35px;border:none;text-align:center}.table-pagination .disabled{opacity:.4}@media screen and (max-width:992px){.table-pagination{left:4px}}"]
            }] }
];
PaginationComponent.propDecorators = {
    vocabulary: [{ type: Input, args: ["vocabulary",] }],
    info: [{ type: Input, args: ["info",] }],
    onchange: [{ type: Output, args: ['onchange',] }],
    onready: [{ type: Output, args: ['onready',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class ConfigurationComponent {
    constructor() {
        this.onchange = new EventEmitter();
        this.onprint = new EventEmitter();
    }
    /**
     * @param {?} item
     * @param {?} header
     * @return {?}
     */
    reconfigure(item, header) {
        header.present = item.checked;
        this.onchange.emit(this.headers);
    }
    /**
     * @param {?} item
     * @param {?} header
     * @return {?}
     */
    enableFilter(item, header) {
        if (header.filter === undefined) {
            header.filter = "";
        }
        else {
            delete header.filter;
        }
        this.onchange.emit(this.headers);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    print(event) {
        this.onprint.emit(true);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    keyup(event) {
        /** @type {?} */
        const code = event.which;
        if (code === 13) {
            event.target.click();
        }
    }
}
ConfigurationComponent.decorators = [
    { type: Component, args: [{
                selector: 'table-configuration',
                template: "\r\n<div class=\"shim\"\r\n    [style.display]=\"showConfigurationView ? 'block':'none'\"\r\n    (click)=\"showConfigurationView = !showConfigurationView\"></div>\r\n\r\n<a  [attr.tabindex]=\"0\" *ngIf=\"printTable\"\r\n    class=\"print-table\"\r\n    (keyup)=\"keyup($event)\"\r\n    (click)=\"print($event)\">\r\n    <span class=\"icon fa fa-print\" aria-hidden=\"true\"></span>\r\n    <span class=\"off-screen\" [textContent]=\"print\"></span>\r\n</a>\r\n<a  [attr.tabindex]=\"0\"\r\n    class=\"configure-table\"\r\n    (keyup)=\"keyup($event)\"\r\n    (click)=\"showConfigurationView = !showConfigurationView\">\r\n    <span class=\"icon fa fa-gear\" aria-hidden=\"true\"></span>\r\n    <span class=\"off-screen\" [textContent]=\"action\"></span>\r\n</a>\r\n<ng-container *ngIf=\"configAddon\" [ngTemplateOutlet]=\"configAddon\"></ng-container>\r\n\r\n<ul role=\"list\" [style.display]=\"showConfigurationView ? 'block':'none'\">\r\n    <p [textContent]=\"title\"></p>\r\n    <li  *ngFor=\"let header of headers\" role=\"listitem\">\r\n        <label for=\"{{header.key ? header.key+'f':'f'}}\">\r\n            <input type=\"checkbox\" #filter\r\n                    [id]=\"header.key ? header.key+'f':'f'\"\r\n                    [checked]=\"header.filter !== undefined\"\r\n                    (keyup)=\"keyup($event)\"\r\n                    (click)=\"enableFilter(filter, header)\" />\r\n            <span>Filter</span>\r\n        </label>\r\n        <label for=\"{{header.key ? header.key+'c':'c'}}\">\r\n            <input type=\"checkbox\" #checkbox\r\n                    [id]=\"header.key ? header.key+'c':'c'\"\r\n                    [value]=\"header.key\"\r\n                    [checked]=\"header.present\"\r\n                    (keyup)=\"keyup($event)\"\r\n                    (click)=\"reconfigure(checkbox, header)\" />\r\n            <span>Show</span>\r\n        </label>\r\n        <span class=\"title\" [textContent]=\"header.value | uppercase\"></span>\r\n    </li>\r\n</ul>\r\n",
                styles: [":host{box-sizing:border-box;padding:2px;position:absolute;right:8px;top:18px;z-index:2}:host a{display:block;float:left;padding:0 0 0 10px;cursor:pointer;z-index:5}:host a .icon{color:#00925b}:host a .off-screen{display:block;text-indent:-9999px;width:0;height:0;overflow:hidden}:host .shim{background-color:rgba(255,255,255,.2);width:100vw;height:100vh;position:fixed;top:0;left:0;z-index:2}:host ul{background-color:#fff;border:1px solid #999;border-radius:4px;display:flex;list-style:none;max-height:200px;margin:0 2px;min-width:200px;overflow-y:auto;position:absolute;padding:0 0 8px;right:0;box-shadow:6px 8px 6px -6px #1b1b1b;z-index:6}:host ul p{margin:0;padding:1px 5px;background-color:#5f9ea0;color:#fff}:host ul li{white-space:nowrap;text-align:left;flex-direction:row;padding:1px 5px}:host ul li label input{flex:0 0 30%;margin-top:4px}:host ul li .title{flex:0 0 30%;font-weight:700}"]
            }] }
];
ConfigurationComponent.propDecorators = {
    title: [{ type: Input, args: ["title",] }],
    action: [{ type: Input, args: ["action",] }],
    printTable: [{ type: Input, args: ["printTable",] }],
    headers: [{ type: Input, args: ["headers",] }],
    configAddon: [{ type: Input, args: ["configAddon",] }],
    onchange: [{ type: Output, args: ['onchange',] }],
    onprint: [{ type: Output, args: ['onprint',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class LockTableComponent {
    /**
     * @param {?} generator
     * @param {?} renderer
     */
    constructor(generator, renderer) {
        this.generator = generator;
        this.renderer = renderer;
        this.filteredItems = [];
        this.vocabulary = {
            configureTable: "Configure Table",
            configureColumns: "Configure Columns",
            clickSort: "Click to Sort",
            setSize: "Set Size",
            firstPage: "First",
            lastPage: "Last",
            previousPage: "Previous"
        };
        this.tableClass = 'default-flexible-table';
        this.onaction = new EventEmitter();
        this.onCellContentEdit = new EventEmitter();
        this.onconfigurationchange = new EventEmitter();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    scroll(event) {
        this.renderer.setElementStyle(this.lockedTable.el.nativeElement, "left", event.target.scrollLeft + "px");
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.pageInfo) {
            if (!this.pageInfo.to) {
                this.pageInfo.to = this.pageInfo.pageSize;
            }
        }
        else {
            this.pageInfo = {
                contentSize: 100000,
                pageSize: 100000,
                pages: 1,
                from: 0,
                to: 100000,
                currentPage: 1,
                maxWidth: "0"
            };
        }
        if (this.persistenceKey) {
            /** @type {?} */
            const headers = this.generator.retreiveHeaders(this.persistenceKey, this.persistenceId);
            if (headers) {
                this.headers = headers;
            }
        }
        if (!this.headers) {
            this.headers = this.generator.generateHeadersFor(this.items[0], "", 5, this.enableFiltering);
            if (this.persistenceKey) {
                this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
            }
        }
        this.filteredItems = this.items;
        this.pageInfo.contentSize = this.items.length;
        this.reconfigure(this.headers);
    }
    /**
     * @return {?}
     */
    evaluatePositioning() {
        this.renderer.setElementStyle(this.unlockedTable.el.nativeElement, "margin-left", this.lockedTable.offsetWidth() + "px");
    }
    /**
     * @param {?} event
     * @return {?}
     */
    reconfigure(event) {
        this.headers = event;
        this.lockedHeaders = this.headers.filter((item) => item.locked === true && item.present);
        this.unlockedHeaders = this.headers.filter((item) => item.locked !== true && item.present);
        this.onconfigurationchange.emit(event);
        if (this.persistenceKey) {
            this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
        }
        setTimeout(this.evaluatePositioning.bind(this), 111);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onlock(event) {
        this.lockedHeaders = this.headers.filter((item) => item.locked === true && item.present);
        this.unlockedHeaders = this.headers.filter((item) => item.locked !== true && item.present);
        this.onconfigurationchange.emit(event);
        if (this.persistenceKey) {
            this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
        }
        setTimeout(this.evaluatePositioning.bind(this), 111);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    changeLockedTableFilteredItems(event) {
        if (this.lockedTable) {
            this.lockedTable.filteredItems = event;
            this.lockedTable.initVisibleRows();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    changeUnlockedTableFilteredItems(event) {
        if (this.unlockedTable) {
            this.unlockedTable.filteredItems = event;
            this.unlockedTable.initVisibleRows();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onPaginationChange(event) {
        this.pageInfo = event;
        this.unlockedTable.evaluateRows();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    tableAction(event) {
        this.onaction.emit(event);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onDrop(event) {
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onCellEdit(event) {
        this.onCellContentEdit.emit(event);
    }
}
LockTableComponent.decorators = [
    { type: Component, args: [{
                selector: 'lock-table',
                template: "<div class=\"caption\">\n\t<table-configuration\n\t\t*ngIf=\"configurable\" \n\t\t[headers]=\"headers\" \n\t\t[title]=\"vocabulary.configureColumns\" \n\t\t[action]=\"vocabulary.configureTable\"\n\t\t[configAddon]=\"configAddon\"\n\t\t(onchange)=\"reconfigure($event)\"></table-configuration>\n\n\t<div *ngIf=\"caption\" [textContent]=\"caption\"></div>\n</div>\n<div class=\"smart-table-wrap\" (scroll)=\"scroll($event)\">\n\t<table-view #lockedTable\n\t\tclass=\"locked-table\"\n\t\tlockable=\"true\"\n\t\t[headers]=\"lockedHeaders\" \n\t\t[items]=\"filteredItems\" \n        [pageInfo]=\"pageInfo\"\n        [vocabulary]=\"vocabulary\"\n        [filterwhiletyping]=\"filterwhiletyping\"\n\t\t[enableFiltering]=\"enableFiltering\"\n\t\t[enableIndexing]=\"enableIndexing\"\n        \n\t\t(onchange)=\"onlock($event)\"\n\t\t(onDrop)=\"onDrop($event)\"\n\t\t(onCellContentEdit)=\"onCellEdit($event)\"\n\t\t(onfilter)=\"changeUnlockedTableFilteredItems($event)\"\n\t\t(onaction)=\"tableAction($event)\"></table-view>\n\n    <table-view #unlockedTable\n\t\tclass=\"unlocked-table\"\n\t\tlockable=\"true\"\n\t\t[headers]=\"unlockedHeaders\" \n\t\t[items]=\"filteredItems\" \n        [pageInfo]=\"pageInfo\"\n        [vocabulary]=\"vocabulary\"\n        [filterwhiletyping]=\"filterwhiletyping\"\n\t\t[enableFiltering]=\"enableFiltering\"\n\n\t\t(onDrop)=\"onDrop($event)\"\n\t\t(onchange)=\"onlock($event)\"\n\t\t(onCellContentEdit)=\"onCellEdit($event)\"\n\t\t(onfilter)=\"changeLockedTableFilteredItems($event)\"\n\t\t(onaction)=\"tableAction($event)\"></table-view>\n\t\n</div>\n<table-pagination #pager\n\t[info]=\"pageInfo\" \n\t[vocabulary]=\"vocabulary\" \n    (onchange)=\"onPaginationChange($event)\"></table-pagination>\n",
                styles: [":host{width:100%;position:relative;margin:0 auto;display:table}:host .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host .caption{background-color:#c3e5e2;border-radius:2px;box-sizing:border-box;color:#1b1b1b;caption-side:top;font-size:14px;margin-bottom:15px;padding:5px 6px;text-align:left;width:100%}:host .caption table-configuration{display:inline-block;float:right;position:unset}:host .smart-table-wrap{border-spacing:0;border-collapse:collapse;border-right:1px solid #aaa;border-bottom:1px solid #aaa;box-sizing:border-box;width:100%;position:relative;overflow-x:auto}:host .smart-table-wrap .unlocked-table ::ng-deep table{max-width:100%;margin-bottom:0;margin-top:0}:host .smart-table-wrap .unlocked-table ::ng-deep table th td{white-space:nowrap}:host .smart-table-wrap .unlocked-table ::ng-deep table th .locker{cursor:pointer;color:#00925b;text-align:center}:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr{background-color:#fff}:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr.hover,:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr:hover{background-color:#ffeed2}:host .smart-table-wrap .unlocked-table ::ng-deep table img{height:14px}:host .smart-table-wrap .locked-table{position:absolute;margin:0 auto;display:inline-table;border-spacing:0;border-collapse:collapse;float:left;z-index:2;width:auto}:host .smart-table-wrap .locked-table ::ng-deep table{display:inline-block;border-right:1px solid #aaa;margin:0;width:auto}:host .smart-table-wrap .locked-table ::ng-deep table th td{white-space:nowrap}:host .smart-table-wrap .locked-table ::ng-deep table th .locker{cursor:pointer;color:#8b0224;text-align:center}:host .smart-table-wrap .locked-table ::ng-deep table tbody tr{background-color:#fff}:host .smart-table-wrap .locked-table ::ng-deep table tbody tr.hover,:host .smart-table-wrap .locked-table ::ng-deep table tbody tr:hover{background-color:#ffeed2}:host .smart-table-wrap .locked-table ::ng-deep table img{height:14px}@media screen and (max-width:600px){.smart-table-wrap{border:0!important;position:unset;overflow-x:unset}.smart-table-wrap .unlocked-table{margin-left:0!important}.smart-table-wrap .unlocked-table ::ng-deep table td,.smart-table-wrap .unlocked-table ::ng-deep table th{white-space:unset}.smart-table-wrap .unlocked-table ::ng-deep table img{height:30px}.smart-table-wrap .locked-table{position:unset!important;margin:0!important;display:table;left:0!important}.smart-table-wrap .locked-table ::ng-deep table{display:table!important;margin:0!important;width:100%!important}.smart-table-wrap .locked-table ::ng-deep table td,.smart-table-wrap .locked-table ::ng-deep table th{white-space:unset}.smart-table-wrap .locked-table ::ng-deep table img{height:30px}}"]
            }] }
];
/** @nocollapse */
LockTableComponent.ctorParameters = () => [
    { type: TableHeadersGenerator },
    { type: Renderer }
];
LockTableComponent.propDecorators = {
    vocabulary: [{ type: Input, args: ["vocabulary",] }],
    persistenceId: [{ type: Input, args: ["persistenceId",] }],
    persistenceKey: [{ type: Input, args: ["persistenceKey",] }],
    caption: [{ type: Input, args: ["caption",] }],
    action: [{ type: Input, args: ["action",] }],
    actionKeys: [{ type: Input, args: ["actionKeys",] }],
    tableClass: [{ type: Input, args: ["tableClass",] }],
    headers: [{ type: Input, args: ["headers",] }],
    items: [{ type: Input, args: ["items",] }],
    pageInfo: [{ type: Input, args: ["pageInfo",] }],
    tableInfo: [{ type: Input, args: ["tableInfo",] }],
    configurable: [{ type: Input, args: ["configurable",] }],
    configAddon: [{ type: Input, args: ["configAddon",] }],
    enableFiltering: [{ type: Input, args: ["enableFiltering",] }],
    enableIndexing: [{ type: Input, args: ["enableIndexing",] }],
    filterwhiletyping: [{ type: Input, args: ["filterwhiletyping",] }],
    onaction: [{ type: Output, args: ['onaction',] }],
    onCellContentEdit: [{ type: Output, args: ['onCellContentEdit',] }],
    onconfigurationchange: [{ type: Output, args: ['onconfigurationchange',] }],
    lockedTable: [{ type: ViewChild, args: ['lockedTable',] }],
    unlockedTable: [{ type: ViewChild, args: ['unlockedTable',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class TableSortDirective {
    /**
     * @param {?} renderer
     * @param {?} el
     */
    constructor(renderer, el) {
        this.renderer = renderer;
        this.el = el;
        this.dropEffect = "move";
        this.tableSort = (path) => { };
    }
    /**
     * @return {?}
     */
    headerColumnElements() {
        return this.el.nativeElement.parentNode.children;
    }
    /**
     * @param {?} id
     * @return {?}
     */
    findColumnWithID(id) {
        /** @type {?} */
        const list = this.headerColumnElements();
        /** @type {?} */
        let column = null;
        for (let i = 0; i < list.length; i++) {
            if (list[i].getAttribute("id") === id) {
                column = list[i];
                break;
            }
        }
        return column;
    }
    /**
     * @param {?} icon
     * @return {?}
     */
    sort(icon) {
        if (this.medium.sortable) {
            for (let i = 0; i < this.headers.length; i++) {
                /** @type {?} */
                const h = this.headers[i];
                if (h.key !== this.medium.key) {
                    /** @type {?} */
                    const item = this.findColumnWithID(h.key);
                    if (item) {
                        this.renderer.setElementClass(item, "ascending", false);
                        this.renderer.setElementClass(item, "descending", false);
                        this.renderer.setElementClass(item, "sortable", true);
                    }
                    h.descending = false;
                    h.ascending = false;
                }
            }
            this.renderer.setElementClass(icon, "fa-sort", false);
            if (this.medium.ascending || (!this.medium.ascending && !this.medium.descending)) {
                this.medium.descending = true;
                this.medium.ascending = false;
                this.renderer.setElementClass(icon, "fa-sort-asc", false);
                this.renderer.setElementClass(icon, "fa-sort-desc", true);
            }
            else {
                this.medium.descending = false;
                this.medium.ascending = true;
                this.renderer.setElementClass(icon, "fa-sort-desc", false);
                this.renderer.setElementClass(icon, "fa-sort-asc", true);
            }
            this.tableSort(this.medium.key.split("."));
        }
    }
}
TableSortDirective.decorators = [
    { type: Directive, args: [{
                selector: '[tableSort]'
            },] }
];
/** @nocollapse */
TableSortDirective.ctorParameters = () => [
    { type: Renderer },
    { type: ElementRef }
];
TableSortDirective.propDecorators = {
    medium: [{ type: Input, args: ['medium',] }],
    headers: [{ type: Input, args: ['headers',] }],
    dropEffect: [{ type: Input }],
    tableSort: [{ type: Input, args: ["tableSort",] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class FlexibleTableModule {
}
FlexibleTableModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    DragDropModule,
                    IntoPipeModule
                ],
                declarations: [
                    FlexibleTableComponent,
                    LockTableComponent,
                    ConfigurationComponent,
                    PaginationComponent,
                    TableViewComponent,
                    TableSortDirective
                ],
                exports: [
                    FlexibleTableComponent,
                    LockTableComponent
                ],
                entryComponents: [],
                providers: [
                    TableHeadersGenerator
                ],
                schemas: [CUSTOM_ELEMENTS_SCHEMA]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { FlexibleTableComponent, FlexibleTableModule, ConfigurationComponent as ɵc, PaginationComponent as ɵd, TableHeadersGenerator as ɵa, TableViewComponent as ɵe, TableSortDirective as ɵf, LockTableComponent as ɵb };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxleGlibGUtdGFibGUuanMubWFwIiwic291cmNlcyI6WyJuZzovL2ZsZXhpYmxlLXRhYmxlL3NyYy9hcHAvZmxleGlibGUtdGFibGUvY29tcG9uZW50cy90YWJsZS1oZWFkZXJzLWdlbmVyYXRvci50cyIsIm5nOi8vZmxleGlibGUtdGFibGUvc3JjL2FwcC9mbGV4aWJsZS10YWJsZS9jb21wb25lbnRzL3RhYmxlLmNvbXBvbmVudC50cyIsIm5nOi8vZmxleGlibGUtdGFibGUvc3JjL2FwcC9mbGV4aWJsZS10YWJsZS9mbGV4aWJsZS50YWJsZS5jb21wb25lbnQudHMiLCJuZzovL2ZsZXhpYmxlLXRhYmxlL3NyYy9hcHAvZmxleGlibGUtdGFibGUvY29tcG9uZW50cy9wYWdpbmF0aW9uLmNvbXBvbmVudC50cyIsIm5nOi8vZmxleGlibGUtdGFibGUvc3JjL2FwcC9mbGV4aWJsZS10YWJsZS9jb21wb25lbnRzL2NvbmZpZ3VyYXRpb24uY29tcG9uZW50LnRzIiwibmc6Ly9mbGV4aWJsZS10YWJsZS9zcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2xvY2sudGFibGUuY29tcG9uZW50LnRzIiwibmc6Ly9mbGV4aWJsZS10YWJsZS9zcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2RpcmVjdGl2ZXMvdGFibGUtc29ydC5kaXJlY3RpdmUudHMiLCJuZzovL2ZsZXhpYmxlLXRhYmxlL3NyYy9hcHAvZmxleGlibGUtdGFibGUvZmxleGlibGUtdGFibGUtbW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIFRoaXMgb2JqZWN0IHdpbGwgdHJhdmVyc2UgdGhyb3VnaCBhIGdpdmVuIGpzb24gb2JqZWN0IGFuZCBmaW5kcyBhbGwgdGhlIGF0dHJpYnV0ZXMgb2YgXHJcbiAqIHRoZSBvYmplY3QgYW5kIGl0cyByZWxhdGVkIGFzc29jaWF0aW9ucyB3aXRoaW4gdGhlIGpzb24uIFRoZSByZXN1bHRpbmcgc3RydWN0dXJlIHdvdWxkIGJlIFxyXG4gKiBuYW1lIG9mIGF0dHJpYnV0ZXMgYW5kIGEgcGF0aHdheSB0byByZWFjaCB0aGUgYXR0cmlidXRlIGRlZXAgaW4gb2JqZWN0IGhlaXJhcmNoeS5cclxuICovXHJcblxyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFZpc3VhbGl6YXRpb25Qb2ludCB7XHJcbiAga2V5OiBzdHJpbmcsXHJcbiAgdmFsdWU6IHN0cmluZ1xyXG59XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUYWJsZUhlYWRlcnNHZW5lcmF0b3Ige1xyXG4gIHByaXZhdGUgaGVhZGVycyA9IFtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICB9XHJcblxyXG4gIGdlbmVyYXRlSGVhZGVyc0Zvcihyb290OiB7fSwgcGF0aDogc3RyaW5nLCBtYXhWaXNpYmxlOiBudW1iZXIsIGZpbHRlcmluZ0VuYWJsZWQ6IGJvb2xlYW4pIHtcclxuXHJcbiAgICBpZiAocm9vdCAhPT0gbnVsbCkge1xyXG4gICAgICBPYmplY3Qua2V5cyhyb290KS5tYXAoIChrZXkpID0+IHtcclxuICAgICAgICBjb25zdCBpbm5lclBhdGggPSAocGF0aC5sZW5ndGggPyAocGF0aCArIFwiLlwiICsga2V5KSA6IGtleSk7XHJcbiAgXHJcbiAgICAgICAgaWYgKHR5cGVvZiByb290W2tleV0gPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHJvb3Rba2V5XSA9PT0gXCJudW1iZXJcIiB8fCB0eXBlb2Ygcm9vdFtrZXldID09PSBcImJvb2xlYW5cIikge1xyXG4gICAgICAgICAgY29uc3QgaGVhZGVyOiBhbnkgPSB7XHJcbiAgICAgICAgICAgIGtleTogaW5uZXJQYXRoLFxyXG4gICAgICAgICAgICB2YWx1ZTogdGhpcy5tYWtlV29yZHMoaW5uZXJQYXRoKSxcclxuICAgICAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGRyYWdhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBwcmVzZW50OiAocGF0aC5sZW5ndGggPT09IDAgJiYgdGhpcy5oZWFkZXJzLmxlbmd0aCA8IG1heFZpc2libGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoZmlsdGVyaW5nRW5hYmxlZCkge1xyXG4gICAgICAgICAgICBoZWFkZXIuZmlsdGVyID0gXCJcIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuaGVhZGVycy5wdXNoKGhlYWRlcik7XHJcbiAgICAgICAgfSBlbHNlIGlmIChyb290W2tleV0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgY29uc3Qgbm9kZSA9IHJvb3Rba2V5XTtcclxuICAgICAgICAgIGlmIChub2RlLmxlbmd0aCAmJiAhKG5vZGVbMF0gaW5zdGFuY2VvZiBBcnJheSkgJiYgKHR5cGVvZiBub2RlWzBdICE9PSBcInN0cmluZ1wiKSkge1xyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlSGVhZGVyc0Zvcihub2RlWzBdLCBpbm5lclBhdGgsIG1heFZpc2libGUsIGZpbHRlcmluZ0VuYWJsZWQpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5oZWFkZXJzLnB1c2goe1xyXG4gICAgICAgICAgICAgIGtleTogaW5uZXJQYXRoLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0aGlzLm1ha2VXb3Jkcyhpbm5lclBhdGgpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuZ2VuZXJhdGVIZWFkZXJzRm9yKHJvb3Rba2V5XSwgaW5uZXJQYXRoLCBtYXhWaXNpYmxlLCBmaWx0ZXJpbmdFbmFibGVkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuaGVhZGVycztcclxuICB9XHJcblxyXG4gIHJldHJlaXZlSGVhZGVycyhrZXksIHRyYWNraW5na2V5KSB7XHJcbiAgICBsZXQgcmVzdWx0OiBhbnk7XHJcbiAgICB0cnkge1xyXG4gICAgICByZXN1bHQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0cmFja2luZ2tleSk7XHJcblxyXG4gICAgICBpZiAoIXJlc3VsdCB8fCByZXN1bHQgIT0ga2V5KSB7XHJcbiAgICAgICAgcmVzdWx0ID0gdW5kZWZpbmVkOyAvLyB3ZSBoYXZlIGEgbmV3ZXIgdmVyc2lvbiBhbmQgaXQgd2lsbCBvdmVycmlkZSBzYXZlZCBkYXRhLlxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc3VsdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0ID8gSlNPTi5wYXJzZShyZXN1bHQpIDogcmVzdWx0O1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgcGVyc2lzdEhlYWRlcnMoa2V5LCB0cmFja2luZ2tleSwgaGVhZGVycykge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odHJhY2tpbmdrZXkpO1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0cmFja2luZ2tleSwga2V5KTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShoZWFkZXJzKSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG1ha2VXb3JkcyhuYW1lKSB7XHJcbiAgICByZXR1cm4gbmFtZVxyXG4gICAgICAgICAgICAucmVwbGFjZSgvXFwuL2csJyB+ICcpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAucmVwbGFjZSgvLS9nLFwiIFwiKVxyXG4gICAgICAgICAgICAucmVwbGFjZSgvXy9nLFwiIFwiKVxyXG4gICAgICAgICAgICAucmVwbGFjZSgvXi4vLCAoc3RyKSA9PiBzdHIudG9VcHBlckNhc2UoKSk7XHJcbiAgfVxyXG59XHJcbiIsIi8qXHJcbiogUHJvdmlkZXMgcmVuZGVyaW5nIG9mIGEgdGFibGUgd2hpY2ggaXMgdXNpbmcgdGhlIGdpdmVuIEZsZXhpYmxlVGFibGVIZWFkZXIgc2V0IGluXHJcbiogb3JkZXIgdG8gdGFidWxhdGUgdGhlIGdpdmVuIGRhdGEuIEFzIHBlciBkZWZpbml0aW9uIG9mIGVhcmNoIGhlYWRlciBjb21wb25lbnQsXHJcbiogYSBjb2x1bW4gY291bGQgYmUgaGlkZGVuLCBzb3J0YWJsZSwgb3IgZHJhZ2dhYmxlLiBFYWNoIHRhYmxlIHJvdyBjYW4gZXhwYW5kL2NvbGxhcHNlXHJcbiogb3IgcmVzcG9uZCB0byBhIGNsaWNrIGFjdGlvbi5cclxuKi9cclxuaW1wb3J0IHtcclxuICAgIENvbXBvbmVudCxcclxuXHRJbnB1dCxcclxuXHRPdXRwdXQsXHJcblx0Vmlld0NoaWxkLFxyXG5cdFZpZXdDb250YWluZXJSZWYsXHJcblx0T25Jbml0LFxyXG5cdE9uQ2hhbmdlcyxcclxuXHRFdmVudEVtaXR0ZXIsXHJcblx0RWxlbWVudFJlZlxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgRHJvcEV2ZW50LCBEcmFnRXZlbnQgfSBmcm9tICdkcmFnLWVuYWJsZWQnO1xyXG5pbXBvcnQgeyBUaW1lb3V0cyB9IGZyb20gJy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AdHlwZXMvc2VsZW5pdW0td2ViZHJpdmVyJztcclxuaW1wb3J0IHsgVGltZSB9IGZyb20gJy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AYW5ndWxhci9jb21tb24nO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBGbGV4aWJsZVRhYmxlSGVhZGVyIHtcclxuXHRrZXk6IHN0cmluZyxcclxuXHR2YWx1ZTogc3RyaW5nLFxyXG5cdHByZXNlbnQ6IGJvb2xlYW4sXHJcblx0d2lkdGg/OiBzdHJpbmcsXHJcblx0bWlud2lkdGg/OiBzdHJpbmcsXHJcblx0Zm9ybWF0Pzogc3RyaW5nLFxyXG5cdGZpbHRlcj86IHN0cmluZyxcclxuXHRkcmFnYWJsZT86IGJvb2xlYW4sXHJcblx0c29ydGFibGU/OiBib29sZWFuLFxyXG5cdGNsYXNzPzpzdHJpbmcsXHJcblx0bG9ja2VkPzpib29sZWFuLFxyXG5cdGFzY2VuZGluZz86IGJvb2xlYW4sXHJcblx0ZGVzY2VuZGluZz86IGJvb2xlYW5cclxufVxyXG5cclxuQENvbXBvbmVudCh7XHJcblx0c2VsZWN0b3I6ICd0YWJsZS12aWV3JyxcclxuXHR0ZW1wbGF0ZVVybDogJy4vdGFibGUuY29tcG9uZW50Lmh0bWwnLFxyXG5cdHN0eWxlVXJsczogWycuL3RhYmxlLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIFRhYmxlVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcclxuXHRkcmFnZ2luZyA9IGZhbHNlO1xyXG5cdHByaW50TW9kZSA9IGZhbHNlO1xyXG5cdGZpbHRlcmVkSXRlbXMgPSBbXTtcclxuXHRmaWx0ZXJpbmdUaW1lcklkOiBhbnk7XHJcblxyXG4gICAgQElucHV0KFwidm9jYWJ1bGFyeVwiKVxyXG4gICAgcHVibGljIHZvY2FidWxhcnkgPSB7XHJcblx0XHRjb25maWd1cmVUYWJsZTogXCJDb25maWd1cmUgVGFibGVcIixcclxuXHRcdGNvbmZpZ3VyZUNvbHVtbnM6IFwiQ29uZmlndXJlIENvbHVtbnNcIixcclxuXHRcdGNsaWNrU29ydDogXCJDbGljayB0byBTb3J0XCIsXHJcblx0XHRzZXRTaXplOiBcIlNldCBTaXplXCIsXHJcblx0XHRmaXJzdFBhZ2U6IFwiRmlyc3RcIixcclxuXHRcdGxhc3RQYWdlOiBcIkxhc3RcIixcclxuXHRcdHByZXZpb3VzUGFnZTogXCJQcmV2aW91c1wiXHJcblx0fTtcclxuXHJcblx0QElucHV0KFwibG9ja2FibGVcIilcclxuXHRsb2NrYWJsZTpib29sZWFuO1xyXG5cclxuXHRASW5wdXQoXCJjYXB0aW9uXCIpXHJcbiAgICBwdWJsaWMgY2FwdGlvbjogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dChcImFjdGlvblwiKVxyXG4gICAgcHVibGljIGFjdGlvbjogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dChcInBhZ2VJbmZvXCIpXHJcbiAgICBwdWJsaWMgcGFnZUluZm87XHJcblxyXG4gICAgQElucHV0KFwiYWN0aW9uS2V5c1wiKVxyXG4gICAgcHVibGljIGFjdGlvbktleXM7XHJcblxyXG4gICAgQElucHV0KFwidGFibGVDbGFzc1wiKVxyXG4gICAgcHVibGljIHRhYmxlQ2xhc3MgPSAnZGVmYXVsdC1mbGV4aWJsZS10YWJsZSc7XHJcblxyXG5cdEBJbnB1dChcImhlYWRlcnNcIilcclxuXHRwdWJsaWMgaGVhZGVyczogYW55W107XHJcblxyXG5cdEBJbnB1dChcIml0ZW1zXCIpXHJcblx0cHVibGljIGl0ZW1zOiBhbnlbXTtcclxuXHJcblx0QElucHV0KFwidGFibGVJbmZvXCIpXHJcblx0cHVibGljIHRhYmxlSW5mbzogYW55O1xyXG5cclxuICAgIEBJbnB1dChcImVuYWJsZUluZGV4aW5nXCIpXHJcbiAgICBwdWJsaWMgZW5hYmxlSW5kZXhpbmc6IGJvb2xlYW47XHJcblxyXG4gICAgQElucHV0KFwiZW5hYmxlRmlsdGVyaW5nXCIpXHJcbiAgICBwdWJsaWMgZW5hYmxlRmlsdGVyaW5nOiBib29sZWFuO1xyXG5cclxuICAgIEBJbnB1dChcInJvd0RldGFpbGVyXCIpXHJcbiAgICBwdWJsaWMgcm93RGV0YWlsZXI6IGFueTtcclxuXHJcbiAgICBASW5wdXQoXCJleHBhbmRhYmxlXCIpXHJcbiAgICBwdWJsaWMgZXhwYW5kYWJsZTogYW55O1xyXG5cclxuICAgIEBJbnB1dChcImV4cGFuZElmXCIpXHJcbiAgICBwdWJsaWMgZXhwYW5kSWY6IGJvb2xlYW47XHJcblxyXG4gICAgQElucHV0KFwiZmlsdGVyd2hpbGV0eXBpbmdcIilcclxuICAgIHB1YmxpYyBmaWx0ZXJ3aGlsZXR5cGluZzogYm9vbGVhbjtcclxuXHJcbiAgICBASW5wdXQoXCJyb3dEZXRhaWxlckhlYWRlcnNcIilcclxuICAgIHB1YmxpYyByb3dEZXRhaWxlckhlYWRlcnM6IGFueTtcclxuXHJcblx0QE91dHB1dCgnb25hY3Rpb24nKVxyXG5cdHByaXZhdGUgb25hY3Rpb24gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBPdXRwdXQoJ29uY2hhbmdlJylcclxuXHRwcml2YXRlIG9uY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHRAT3V0cHV0KCdvbmZpbHRlcicpXHJcblx0cHJpdmF0ZSBvbmZpbHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0QE91dHB1dCgnb25DZWxsQ29udGVudEVkaXQnKVxyXG5cdHByaXZhdGUgb25DZWxsQ29udGVudEVkaXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBWaWV3Q2hpbGQoJ2ZsZXhpYmxlJywge3JlYWQ6IFZpZXdDb250YWluZXJSZWZ9KSBwcml2YXRlIHRhYmxlOiBWaWV3Q29udGFpbmVyUmVmO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDpFbGVtZW50UmVmKSB7fVxyXG5cclxuXHJcblx0cHJpdmF0ZSBmaW5kQ29sdW1uV2l0aElEKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBsaXN0ID0gdGhpcy5oZWFkZXJDb2x1bW5FbGVtZW50cygpO1xyXG5cdFx0bGV0IGNvbHVtbiA9IG51bGw7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKGxpc3RbaV0uZ2V0QXR0cmlidXRlKFwiaWRcIikgPT09IGlkKSB7XHJcblx0XHRcdFx0Y29sdW1uID0gbGlzdFtpXTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNvbHVtbjtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgc3dhcENvbHVtbnMoc291cmNlOiBhbnksIGRlc3RpbmF0aW9uOiBhbnkpIHtcclxuXHJcblx0XHRpZiAoc291cmNlLm5vZGUucGFyZW50Tm9kZSA9PT0gZGVzdGluYXRpb24ubm9kZS5wYXJlbnROb2RlKSB7XHJcblx0XHRcdGNvbnN0IHNyY0luZGV4ID0gdGhpcy5nZXRDb2x1bW5JbmRleChzb3VyY2UubWVkaXVtLmtleSk7XHJcblx0XHRcdGNvbnN0IGRlc0luZGV4ID0gdGhpcy5nZXRDb2x1bW5JbmRleChkZXN0aW5hdGlvbi5tZWRpdW0ua2V5KTtcclxuXHRcdFx0aWYgKHNyY0luZGV4IDwgMCB8fCBkZXNJbmRleCA8IDApIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcImludmFsaWQgZHJvcCBpZFwiLCBzb3VyY2UubWVkaXVtLmtleSwgZGVzdGluYXRpb24ubWVkaXVtLmtleSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNvbnN0IHggPSB0aGlzLmZpbHRlcmVkSXRlbXM7XHJcblx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IFtdO1xyXG5cclxuXHRcdFx0c2V0VGltZW91dCgoKT0+e1xyXG5cdFx0XHRcdGNvbnN0IHNvYmogPSB0aGlzLmhlYWRlcnNbc3JjSW5kZXhdO1xyXG5cdFx0XHRcdHRoaXMuaGVhZGVyc1tzcmNJbmRleF0gPSB0aGlzLmhlYWRlcnNbZGVzSW5kZXhdO1xyXG5cdFx0XHRcdHRoaXMuaGVhZGVyc1tkZXNJbmRleF0gPSBzb2JqO1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IHg7XHJcblxyXG5cdFx0XHRcdHRoaXMub25maWx0ZXIuZW1pdCh0aGlzLmZpbHRlcmVkSXRlbXMpO1xyXG5cdFx0XHRcdHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzLmhlYWRlcnMpO1xyXG5cdFx0XHR9LCAzMyk7XHJcblx0XHJcblx0XHR9IGVsc2UgaWYgKHNvdXJjZS5tZWRpdW0ubG9ja2VkIHx8IGRlc3RpbmF0aW9uLm1lZGl1bS5sb2NrZWQpIHtcclxuXHRcdFx0Y29uc3QgeCA9IHRoaXMuZmlsdGVyZWRJdGVtcztcclxuXHRcdFx0dGhpcy5maWx0ZXJlZEl0ZW1zID0gW107XHJcblx0XHRcdHRoaXMub25maWx0ZXIuZW1pdCh0aGlzLmZpbHRlcmVkSXRlbXMpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KCgpPT57XHJcblx0XHRcdFx0c291cmNlLm1lZGl1bS5sb2NrZWQgPSAhc291cmNlLm1lZGl1bS5sb2NrZWQ7XHJcblx0XHRcdFx0ZGVzdGluYXRpb24ubWVkaXVtLmxvY2tlZCA9ICFkZXN0aW5hdGlvbi5tZWRpdW0ubG9ja2VkO1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IHg7XHJcblx0XHRcdFx0dGhpcy5vbmZpbHRlci5lbWl0KHRoaXMuZmlsdGVyZWRJdGVtcyk7XHJcblx0XHRcdFx0dGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaGVhZGVycyk7XHJcblx0XHRcdH0sMzMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBnZXRDb2x1bW5JbmRleChpZDogc3RyaW5nKSB7XHJcblx0XHRsZXQgaW5kZXggPSAtMTtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWFkZXJzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmICh0aGlzLmhlYWRlcnNbaV0ua2V5ID09PSBpZCkge1xyXG5cdFx0XHRcdGluZGV4ID0gaTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGluZGV4O1xyXG5cdH1cclxuXHRwcml2YXRlIGl0ZW1WYWx1ZShpdGVtLCBocGF0aCkge1xyXG5cdFx0bGV0IHN1Yml0ZW0gPSBpdGVtO1xyXG5cdFx0aHBhdGgubWFwKCAoc3Via2V5KSA9PiB7XHJcblx0XHRcdGlmIChzdWJpdGVtKSB7XHJcblx0XHRcdFx0c3ViaXRlbSA9IHN1Yml0ZW1bc3Via2V5XTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHRcdHJldHVybiBzdWJpdGVtID09PSB1bmRlZmluZWQgfHwgc3ViaXRlbSA9PT0gbnVsbCB8fCBzdWJpdGVtID09PSBcIm51bGxcIiA/IFwiXCIgOiBzdWJpdGVtO1xyXG5cdH1cclxuXHRpbml0VmlzaWJsZVJvd3MoKSB7XHJcblx0XHRjb25zdCByZXN1bHQgPSBbXTtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5maWx0ZXJlZEl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmIChpID49IHRoaXMucGFnZUluZm8uZnJvbSAmJiBpIDw9IHRoaXMucGFnZUluZm8udG8pIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaCh0aGlzLmZpbHRlcmVkSXRlbXNbaV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSByZXN1bHQ7XHJcblx0fVxyXG5cclxuXHRsb2NrKGhlYWRlcjogRmxleGlibGVUYWJsZUhlYWRlciwgZXZlbnQpIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcdFxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRoZWFkZXIubG9ja2VkID0gIWhlYWRlci5sb2NrZWQ7XHJcblx0XHR0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5oZWFkZXJzKTtcclxuXHR9XHJcblx0c29ydChoZWFkZXI6IEZsZXhpYmxlVGFibGVIZWFkZXIsIGljb24pIHtcclxuXHRcdGlmIChoZWFkZXIuc29ydGFibGUgJiYgdGhpcy5pdGVtcyAmJiB0aGlzLml0ZW1zLmxlbmd0aCkge1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVhZGVycy5sZW5ndGggOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGggPSB0aGlzLmhlYWRlcnNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGgua2V5ICE9PSBoZWFkZXIua2V5KSB7XHJcblx0XHRcdFx0XHRjb25zdCBpdGVtID0gdGhpcy5maW5kQ29sdW1uV2l0aElEKGgua2V5KTtcclxuXHJcblx0XHRcdFx0XHRpZiAoaXRlbSkge1xyXG5cdFx0XHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJhc2NlbmRpbmdcIik7XHJcblx0XHRcdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LnJlbW92ZShcImRlc2NlbmRpbmdcIik7XHJcblx0XHRcdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LmFkZChcInNvcnRhYmxlXCIpO1xyXG5cdFx0XHRcdFx0fVxyXG4gICAgICAgICAgICAgICAgICAgIGguZGVzY2VuZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGguYXNjZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcbiAgICAgICAgICAgIGljb24uY2xhc3NMaXN0LnJlbW92ZShcImZhLXNvcnRcIik7XHJcblx0XHRcdGlmIChoZWFkZXIuYXNjZW5kaW5nIHx8ICghaGVhZGVyLmFzY2VuZGluZyAmJiAhaGVhZGVyLmRlc2NlbmRpbmcpKSB7XHJcblx0XHRcdFx0aGVhZGVyLmRlc2NlbmRpbmcgPSB0cnVlO1xyXG5cdFx0XHRcdGhlYWRlci5hc2NlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRpY29uLmNsYXNzTGlzdC5yZW1vdmUoXCJmYS1zb3J0LWFzY1wiKTtcclxuXHRcdFx0XHRpY29uLmNsYXNzTGlzdC5hZGQoXCJmYS1zb3J0LWRlc2NcIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aGVhZGVyLmRlc2NlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRoZWFkZXIuYXNjZW5kaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHRpY29uLmNsYXNzTGlzdC5yZW1vdmUoXCJmYS1zb3J0LWRlc2NcIik7XHJcblx0XHRcdFx0aWNvbi5jbGFzc0xpc3QuYWRkKFwiZmEtc29ydC1hc2NcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0Y29uc3QgaHBhdGggPSBoZWFkZXIua2V5LnNwbGl0KFwiLlwiKTtcclxuXHJcblx0XHRcdGlmICh0aGlzLmVuYWJsZUZpbHRlcmluZykge1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVySXRlbXMoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSB0aGlzLml0ZW1zID8gdGhpcy5pdGVtcyA6IFtdO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcy5zb3J0KChhLCBiKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgdjEgPSB0aGlzLml0ZW1WYWx1ZShhLCBocGF0aCk7XHJcblx0XHRcdFx0Y29uc3QgdjIgPSB0aGlzLml0ZW1WYWx1ZShiLCBocGF0aCk7XHJcblxyXG5cdFx0XHRcdGlmIChoZWFkZXIuYXNjZW5kaW5nKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdjEgPiB2MiA/IDEgOiAtMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHYxIDwgdjIgPyAxIDogLTE7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR0aGlzLmluaXRWaXNpYmxlUm93cygpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0b2Zmc2V0V2lkdGgoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy50YWJsZS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XHJcblx0fVxyXG5cclxuXHRuZ09uQ2hhbmdlcyhjaGFuZ2VzOmFueSkge1xyXG5cdFx0Ly8gaWYgKGNoYW5nZXMuaXRlbXMpIHtcclxuXHRcdC8vIFx0dGhpcy5ldmFsdWF0ZVJvd3MoKTtcclxuXHRcdC8vIH1cclxuXHR9XHJcblxyXG5cdG5nT25Jbml0KCkge1xyXG5cdFx0aWYgKHRoaXMucGFnZUluZm8pIHtcclxuXHRcdFx0aWYgKCF0aGlzLnBhZ2VJbmZvLnRvKSB7XHJcblx0XHRcdFx0dGhpcy5wYWdlSW5mby50byA9IHRoaXMucGFnZUluZm8ucGFnZVNpemU7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMucGFnZUluZm8gPSB7IFxyXG4gICAgICAgICAgICAgICAgY29udGVudFNpemU6IDEwMDAwMCwgXHJcbiAgICAgICAgICAgICAgICBwYWdlU2l6ZTogMTAwMDAwLCBcclxuICAgICAgICAgICAgICAgIHBhZ2VzOiAxLCBcclxuICAgICAgICAgICAgICAgIGZyb206IDAsIFxyXG4gICAgICAgICAgICAgICAgdG86IDEwMDAwMCwgXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFnZTogMSwgXHJcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogXCIwXCIgXHJcbiAgICAgICAgICAgIH07XHJcblx0XHR9XHJcblx0XHRpZiAoIXRoaXMuaGVhZGVycykge1xyXG5cdFx0XHR0aGlzLmhlYWRlcnMgPSBbXTtcclxuXHRcdH1cclxuXHRcdHRoaXMuZXZhbHVhdGVSb3dzKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aW9uS2V5cykge1xyXG4gICAgICAgICAgICB0aGlzLmFjdGlvbktleXMgPSB0aGlzLmFjdGlvbktleXMuc3BsaXQoXCIsXCIpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCF0aGlzLnJvd0RldGFpbGVyICYmIHRoaXMuZXhwYW5kYWJsZSkge1xyXG5cdFx0XHR0aGlzLnJvd0RldGFpbGVyID0gZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRcdHJldHVybiB7ZGF0YTogaXRlbSwgaGVhZGVyczogW119O1xyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdFx0aWYgKCF0aGlzLmV4cGFuZGFibGUpIHtcclxuXHRcdFx0dGhpcy5leHBhbmRhYmxlID0gZnVuY3Rpb24oaXRlbSwgc2hvd0ljb24pIHtyZXR1cm4gc2hvd0ljb259O1xyXG5cdFx0fVxyXG5cdFx0aWYgKCF0aGlzLnJvd0RldGFpbGVySGVhZGVycykge1xyXG5cdFx0XHR0aGlzLnJvd0RldGFpbGVySGVhZGVycyA9IChpdGVtKSA9PiBbXTtcclxuXHRcdH1cclxuXHR9XHJcblx0ZXZhbHVhdGVSb3dzKCkge1xyXG5cdFx0aWYgKHRoaXMuZW5hYmxlRmlsdGVyaW5nKSB7XHJcblx0XHRcdHRoaXMuZmlsdGVySXRlbXMoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IHRoaXMuaXRlbXMgPyB0aGlzLml0ZW1zIDogW107XHJcblx0XHR9XHJcblx0XHR0aGlzLmluaXRWaXNpYmxlUm93cygpO1xyXG5cdH1cclxuXHJcbiAgICBoZWFkZXJDb2x1bW5FbGVtZW50cygpIHtcclxuXHRcdGxldCByZXN1bHQgPSBbXTtcclxuXHJcblx0XHRpZiAodGhpcy50YWJsZS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW4pIHtcclxuXHRcdFx0Y29uc3QgbGlzdCA9IHRoaXMudGFibGUuZWxlbWVudC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuO1xyXG5cdFx0XHRyZXN1bHQgPSB0aGlzLmNhcHRpb24gPyBsaXN0WzFdLmNoaWxkcmVuWzBdLmNoaWxkcmVuIDogbGlzdFswXS5jaGlsZHJlblswXS5jaGlsZHJlbjtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG5cdGhlYWRlckJ5SWQoaWQpIHtcclxuXHRcdGxldCBoO1xyXG5cdFx0Zm9yIChjb25zdCBpIGluIHRoaXMuaGVhZGVycykge1xyXG5cdFx0XHRpZiAodGhpcy5oZWFkZXJzW2ldLmtleSA9PT0gaWQpIHtcclxuXHRcdFx0XHRoID0gdGhpcy5oZWFkZXJzW2ldO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gaDtcclxuXHR9XHJcblxyXG4gICAgY29sdW1uc0NvdW50KCkge1xyXG5cdFx0bGV0IGNvdW50ID0gMDtcclxuXHRcdHRoaXMuaGVhZGVycy5tYXAoIChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLnByZXNlbnQpIHtcclxuICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgIH1cclxuXHRcdH0pO1xyXG4gICAgICAgIGlmICh0aGlzLmFjdGlvbikge1xyXG4gICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY291bnQ7XHJcblx0fVxyXG5cdGhvdmVyKGl0ZW0sIGZsYWcpIHtcclxuXHRcdGlmIChmbGFnKSB7XHJcblx0XHRcdGl0ZW0uaG92ZXIgPSB0cnVlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZGVsZXRlIGl0ZW0uaG92ZXI7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR0b0Nzc0NsYXNzKGhlYWRlcikge1xyXG5cdFx0cmV0dXJuIGhlYWRlci5rZXkucmVwbGFjZSgvXFwuL2csJy0nKTtcclxuXHR9XHJcbiAgICBrZXlkb3duKGV2ZW50LCBpdGVtKSB7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG4gICAgICAgIGlmICgoY29kZSA9PT0gMTMpIHx8IChjb2RlID09PSAzMikpIHtcclxuXHRcdFx0aXRlbS5jbGljaygpO1xyXG5cdFx0fVxyXG4gICAgfVxyXG4gICAgb2ZmU2NyZWVuTWVzc2FnZShpdGVtKSB7XHJcblx0XHRsZXQgbWVzc2FnZTogc3RyaW5nID0gdGhpcy5hY3Rpb247XHJcblx0XHRpZiAodGhpcy5hY3Rpb25LZXlzKSB7XHJcblx0XHRcdHRoaXMuYWN0aW9uS2V5cy5tYXAoKGtleSkgPT4geyBtZXNzYWdlID0gbWVzc2FnZS5yZXBsYWNlKGtleSwgaXRlbVtrZXkuc3Vic3RyaW5nKDEsIGtleS5sZW5ndGggLSAxKV0pOyB9KVxyXG5cdFx0fVxyXG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xyXG4gICAgfVxyXG5cclxuICAgIGNlbGxDb250ZW50KGl0ZW0sIGhlYWRlcikge1xyXG5cdFx0bGV0IGNvbnRlbnQgPSB0aGlzLml0ZW1WYWx1ZShpdGVtLCBoZWFkZXIua2V5LnNwbGl0KFwiLlwiKSk7XHJcbiAgICAgICAgcmV0dXJuIChjb250ZW50ICE9PSB1bmRlZmluZWQgJiYgY29udGVudCAhPSBudWxsICYmIFN0cmluZyhjb250ZW50KS5sZW5ndGgpID8gY29udGVudCA6ICcmbmJzcDsnO1xyXG5cdH1cclxuXHJcblx0cm93RGV0YWlsZXJDb250ZXh0KGl0ZW0pIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGRhdGE6IGl0ZW0sXHJcblx0XHRcdHRhYmxlSW5mbzogdGhpcy50YWJsZUluZm8sXHJcblx0XHRcdGhlYWRlcnM6IHRoaXMucm93RGV0YWlsZXJIZWFkZXJzKGl0ZW0pXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0Y2hhbmdlRmlsdGVyKGV2ZW50LCBoZWFkZXIpIHtcclxuICAgICAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcblxyXG5cdFx0aGVhZGVyLmZpbHRlciA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuXHJcblx0XHRpZiAodGhpcy5maWx0ZXJ3aGlsZXR5cGluZyB8fCBjb2RlID09PSAxMykge1xyXG5cdFx0XHRpZih0aGlzLmZpbHRlcmluZ1RpbWVySWQpIHtcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQodGhpcy5maWx0ZXJpbmdUaW1lcklkKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmZpbHRlcmluZ1RpbWVySWQgPSBzZXRUaW1lb3V0KCgpPT57XHJcblx0XHRcdFx0dGhpcy5maWx0ZXJJdGVtcygpO1xyXG5cdFx0XHRcdHRoaXMuaW5pdFZpc2libGVSb3dzKCk7XHJcblx0XHRcdFx0dGhpcy5maWx0ZXJpbmdUaW1lcklkICA9IHVuZGVmaW5lZDtcclxuXHRcdFx0fSwgMTIzKTtcclxuXHRcdH1cclxuXHR9XHJcblx0YWN0aW9uQ2xpY2soZXZlbnQsIGl0ZW06IGFueSkge1xyXG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgaWYgKHRoaXMucm93RGV0YWlsZXIgJiYgKHRoaXMuZXhwYW5kSWYgfHwgdGhpcy5leHBhbmRhYmxlKGl0ZW0sIGZhbHNlKSkgKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmV4cGFuZGVkKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgaXRlbS5leHBhbmRlZDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZXhwYW5kZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vbmFjdGlvbi5lbWl0KGl0ZW0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cHJpbnQoKSB7XHJcblx0XHR0aGlzLnByaW50TW9kZSA9IHRydWU7XHJcblx0XHRzZXRUaW1lb3V0KCgpPT57XHJcblx0XHRcdGNvbnN0IGNvbnRlbnQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MO1xyXG5cdFx0XHR0aGlzLnByaW50TW9kZSA9IGZhbHNlO1xyXG5cdFx0XHRjb25zdCBwb3B1cFdpbiA9IHdpbmRvdy5vcGVuKCcnLCAnX2JsYW5rJywgJ3dpZHRoPTMwMCxoZWlnaHQ9MzAwJyk7XHJcblx0XHRcclxuXHRcdFx0cG9wdXBXaW4uZG9jdW1lbnQub3BlbigpO1xyXG4gICAgICAgIFx0cG9wdXBXaW4uZG9jdW1lbnQud3JpdGUoJzxodG1sPjxib2R5IG9ubG9hZD1cIndpbmRvdy5wcmludCgpXCI+JyArIGNvbnRlbnQgKyAnPC9odG1sPicpO1xyXG4gICAgICAgIFx0cG9wdXBXaW4uZG9jdW1lbnQuY2xvc2UoKTtcclxuXHRcdH0sMyk7XHJcblx0fVxyXG5cclxuXHQvLyA8NSwgITUsID41LCAqRSwgRSosICpFKlxyXG5cdHByaXZhdGUgc2hvdWxkU2tpcEl0ZW0odmFsdWUsIGZpbHRlckJ5KSB7XHJcblx0XHRsZXQgcmVzdWx0ID0gZmFsc2U7XHJcblxyXG5cdFx0aWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwgJiYgU3RyaW5nKHZhbHVlKS5sZW5ndGgpIHtcclxuXHRcdFx0Y29uc3QgdiA9IFN0cmluZyh2YWx1ZSk7XHJcblx0XHRcdGlmIChmaWx0ZXJCeVswXSA9PT0gJzwnKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gZmlsdGVyQnkubGVuZ3RoID4gMSAmJiBwYXJzZUZsb2F0KHYpID49IHBhcnNlRmxvYXQoZmlsdGVyQnkuc3Vic3RyaW5nKDEpKTtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWx0ZXJCeVswXSA9PT0gJz4nKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gZmlsdGVyQnkubGVuZ3RoID4gMSAmJiBwYXJzZUZsb2F0KHYpIDw9IHBhcnNlRmxvYXQoZmlsdGVyQnkuc3Vic3RyaW5nKDEpKTtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWx0ZXJCeVswXSA9PT0gJyEnKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gZmlsdGVyQnkubGVuZ3RoID4gMSAmJiBwYXJzZUZsb2F0KHYpID09IHBhcnNlRmxvYXQoZmlsdGVyQnkuc3Vic3RyaW5nKDEpKTtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWx0ZXJCeVswXSA9PT0gJz0nKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gZmlsdGVyQnkubGVuZ3RoID09IDEgfHwgcGFyc2VGbG9hdCh2KSAhPT0gcGFyc2VGbG9hdChmaWx0ZXJCeS5zdWJzdHJpbmcoMSkpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGZpbHRlckJ5WzBdID09PSAnKicgJiYgZmlsdGVyQnlbZmlsdGVyQnkubGVuZ3RoLTFdICE9PSAnKicpIHtcclxuXHRcdFx0XHRjb25zdCBmID0gZmlsdGVyQnkuc3Vic3RyaW5nKDEpO1xyXG5cdFx0XHRcdHJlc3VsdCA9IHYuaW5kZXhPZihmKSAhPT0gdi5sZW5ndGggLSBmLmxlbmd0aFxyXG5cdFx0XHR9IGVsc2UgaWYgKGZpbHRlckJ5WzBdICE9PSAnKicgJiYgZmlsdGVyQnlbZmlsdGVyQnkubGVuZ3RoLTFdID09PSAnKicpIHtcclxuXHRcdFx0XHRjb25zdCBmID0gZmlsdGVyQnkuc3Vic3RyaW5nKDAsIGZpbHRlckJ5Lmxlbmd0aC0xKTtcclxuXHRcdFx0XHRyZXN1bHQgPSB2LmluZGV4T2YoZikgIT09IDA7XHJcblx0XHRcdH0gZWxzZSBpZiAoZmlsdGVyQnlbMF0gPT09ICcqJyAmJiBmaWx0ZXJCeVtmaWx0ZXJCeS5sZW5ndGgtMV0gPT09ICcqJykge1xyXG5cdFx0XHRcdHJlc3VsdCA9IGZpbHRlckJ5Lmxlbmd0aCA+IDEgJiYgdi5pbmRleE9mKCBmaWx0ZXJCeS5zdWJzdHJpbmcoMSwgZmlsdGVyQnkubGVuZ3RoLTEpICkgPCAwO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJlc3VsdCA9IHYuaW5kZXhPZihmaWx0ZXJCeSkgPCAwO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH1cclxuXHRmaWx0ZXJJdGVtcygpIHtcclxuXHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IHRoaXMuaXRlbXMgPyB0aGlzLml0ZW1zLmZpbHRlcigoaXRlbSkgPT4ge1xyXG5cdFx0XHRsZXQga2VlcEl0ZW0gPSB0cnVlO1xyXG5cclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlYWRlcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRjb25zdCBoZWFkZXIgPSB0aGlzLmhlYWRlcnNbaV07XHJcblx0XHRcdFx0aWYgKGhlYWRlci5maWx0ZXIgJiYgaGVhZGVyLmZpbHRlci5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdGNvbnN0IHYgPSB0aGlzLml0ZW1WYWx1ZShpdGVtLCBoZWFkZXIua2V5LnNwbGl0KFwiLlwiKSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuc2hvdWxkU2tpcEl0ZW0odixoZWFkZXIuZmlsdGVyKSkge1xyXG5cdFx0XHRcdFx0XHRrZWVwSXRlbSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGtlZXBJdGVtO1xyXG5cdFx0fSkgOiBbXTtcclxuXHRcdHRoaXMub25maWx0ZXIuZW1pdCh0aGlzLmZpbHRlcmVkSXRlbXMpO1xyXG5cdH1cclxuXHJcblx0b25UYWJsZUNlbGxFZGl0KGV2ZW50KSB7XHJcblx0XHRjb25zdCBpZCA9IGV2ZW50LmlkLnNwbGl0KFwiLVwiKTtcclxuXHRcdGNvbnN0IG4gPSBldmVudC5uYW1lO1xyXG5cdFx0Y29uc3Qgdj0gZXZlbnQudmFsdWU7XHJcblx0XHRjb25zdCB0ID0gdGhpcy5pdGVtc1twYXJzZUludChpZFsxXSldO1xyXG5cclxuXHRcdGlmICh0KSB7XHJcblx0XHRcdGNvbnN0IGxpc3QgPSBpZFswXS5zcGxpdChcIi5cIik7XHJcblx0XHRcdGxldCBzdWJpdGVtID0gdFtsaXN0WzBdXTtcclxuXHRcdFx0Zm9yKGxldCBpID0gMTsgaSA8IChsaXN0Lmxlbmd0aCAtIDEpOyBpKyspIHtcclxuXHRcdFx0XHRzdWJpdGVtID0gc3ViaXRlbVtsaXN0W2ldXVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChzdWJpdGVtICYmIGxpc3QubGVuZ3RoID4gMSl7XHJcblx0XHRcdFx0c3ViaXRlbVtsaXN0W2xpc3QubGVuZ3RoIC0gMV1dID0gdjtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLm9uQ2VsbENvbnRlbnRFZGl0LmVtaXQoe25hbWU6IG4sIHZhbHVlOiB2LCBpdGVtOiB0fSk7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG5cdGRyYWdFbmFibGVkKGV2ZW50OiBEcmFnRXZlbnQpIHtcclxuXHRcdHJldHVybiBldmVudC5tZWRpdW0uZHJhZ2FibGU7XHJcblx0fVxyXG5cdGRyb3BFbmFibGVkKGV2ZW50OiBEcm9wRXZlbnQpIHtcclxuXHRcdHJldHVybiBldmVudC5kZXN0aW5hdGlvbi5tZWRpdW0uZHJhZ2FibGU7XHJcblx0fVxyXG5cdG9uRHJhZ1N0YXJ0KGV2ZW50OiBEcmFnRXZlbnQpe1xyXG4vLyAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWU7XHJcblx0fVxyXG5cdG9uRHJhZ0VuZChldmVudDogRHJhZ0V2ZW50KXtcclxuIC8vICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcclxuXHR9XHJcblx0b25Ecm9wKGV2ZW50OkRyb3BFdmVudCl7XHJcblx0XHR0aGlzLnN3YXBDb2x1bW5zKGV2ZW50LnNvdXJjZSwgZXZlbnQuZGVzdGluYXRpb24pO1xyXG5cdH1cclxufVxyXG4iLCIvKlxyXG4qIFByb3ZpZGVzIHJlbmRlcmluZyBvZiBhIHRhYmxlIHdoaWNoIGlzIHVzaW5nIHRoZSBnaXZlbiBGbGV4aWJsZVRhYmxlSGVhZGVyIHNldCBpblxyXG4qIG9yZGVyIHRvIHRhYnVsYXRlIHRoZSBnaXZlbiBkYXRhLiBBcyBwZXIgZGVmaW5pdGlvbiBvZiBlYXJjaCBoZWFkZXIgY29tcG9uZW50LFxyXG4qIGEgY29sdW1uIGNvdWxkIGJlIGhpZGRlbiwgc29ydGFibGUsIG9yIGRyYWdnYWJsZS4gRWFjaCB0YWJsZSByb3cgY2FuIGV4cGFuZC9jb2xsYXBzZVxyXG4qIG9yIHJlc3BvbmQgdG8gYSBjbGljayBhY3Rpb24uXHJcbiovXHJcbmltcG9ydCB7XHJcbiAgICBDb21wb25lbnQsXHJcblx0SW5wdXQsXHJcblx0T3V0cHV0LFxyXG5cdFZpZXdDaGlsZCxcclxuXHRWaWV3Q29udGFpbmVyUmVmLFxyXG5cdE9uSW5pdCxcclxuXHRFdmVudEVtaXR0ZXJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IERyb3BFdmVudCwgRHJhZ0V2ZW50IH0gZnJvbSAnZHJhZy1lbmFibGVkJztcclxuaW1wb3J0IHsgVGFibGVIZWFkZXJzR2VuZXJhdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlLWhlYWRlcnMtZ2VuZXJhdG9yJztcclxuaW1wb3J0IHsgVGFibGVWaWV3Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlLmNvbXBvbmVudCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuXHRzZWxlY3RvcjogJ2ZsZXhpYmxlLXRhYmxlJyxcclxuXHR0ZW1wbGF0ZVVybDogJy4vZmxleGlibGUudGFibGUuY29tcG9uZW50Lmh0bWwnLFxyXG5cdHN0eWxlVXJsczogWycuL2ZsZXhpYmxlLnRhYmxlLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIEZsZXhpYmxlVGFibGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuXHRzdWJIZWFkZXJzOmFueTtcclxuXHJcbiAgICBASW5wdXQoXCJ2b2NhYnVsYXJ5XCIpXHJcbiAgICBwdWJsaWMgdm9jYWJ1bGFyeSA9IHtcclxuXHRcdHByaW50VGFibGU6IFwiUHJpbnQgVGFibGVcIixcclxuXHRcdGNvbmZpZ3VyZVRhYmxlOiBcIkNvbmZpZ3VyZSBUYWJsZVwiLFxyXG5cdFx0Y29uZmlndXJlQ29sdW1uczogXCJDb25maWd1cmUgQ29sdW1uc1wiLFxyXG5cdFx0Y2xpY2tTb3J0OiBcIkNsaWNrIHRvIFNvcnRcIixcclxuXHRcdHNldFNpemU6IFwiU2V0IFNpemVcIixcclxuXHRcdGZpcnN0UGFnZTogXCJGaXJzdFwiLFxyXG5cdFx0bGFzdFBhZ2U6IFwiTGFzdFwiLFxyXG5cdFx0cHJldmlvdXNQYWdlOiBcIlByZXZpb3VzXCJcclxuXHR9O1xyXG5cdFxyXG4gICAgQElucHV0KFwicGVyc2lzdGVuY2VJZFwiKVxyXG4gICAgcHVibGljIHBlcnNpc3RlbmNlSWQ6IHN0cmluZztcclxuXHJcblx0QElucHV0KFwicGVyc2lzdGVuY2VLZXlcIilcclxuICAgIHB1YmxpYyBwZXJzaXN0ZW5jZUtleTogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dChcImNhcHRpb25cIilcclxuICAgIHB1YmxpYyBjYXB0aW9uOiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KFwiYWN0aW9uXCIpXHJcbiAgICBwdWJsaWMgYWN0aW9uOiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KFwiYWN0aW9uS2V5c1wiKVxyXG4gICAgcHVibGljIGFjdGlvbktleXM7XHJcblxyXG4gICAgQElucHV0KFwidGFibGVDbGFzc1wiKVxyXG4gICAgcHVibGljIHRhYmxlQ2xhc3MgPSAnZGVmYXVsdC1mbGV4aWJsZS10YWJsZSc7XHJcblxyXG5cdEBJbnB1dChcImhlYWRlcnNcIilcclxuXHRwdWJsaWMgaGVhZGVyczogYW55W107XHJcblxyXG5cdEBJbnB1dChcIml0ZW1zXCIpXHJcblx0cHVibGljIGl0ZW1zOiBhbnlbXTtcclxuXHJcblx0QElucHV0KFwicGFnZUluZm9cIilcclxuXHRwdWJsaWMgcGFnZUluZm86IGFueTtcclxuXHJcblx0QElucHV0KFwidGFibGVJbmZvXCIpXHJcblx0cHVibGljIHRhYmxlSW5mbzogYW55O1xyXG5cclxuICAgIEBJbnB1dChcImNvbmZpZ3VyYWJsZVwiKVxyXG4gICAgcHVibGljIGNvbmZpZ3VyYWJsZTogYm9vbGVhbjtcclxuXHJcblx0QElucHV0KFwiY29uZmlnQWRkb25cIilcclxuXHRwdWJsaWMgY29uZmlnQWRkb246IGFueTtcclxuXHJcblx0QElucHV0KFwiZW5hYmxlSW5kZXhpbmdcIilcclxuICAgIHB1YmxpYyBlbmFibGVJbmRleGluZzogYm9vbGVhbjtcclxuXHJcbiAgICBASW5wdXQoXCJlbmFibGVGaWx0ZXJpbmdcIilcclxuICAgIHB1YmxpYyBlbmFibGVGaWx0ZXJpbmc6IGJvb2xlYW47XHJcblxyXG4gICAgQElucHV0KFwicm93RGV0YWlsZXJcIilcclxuICAgIHB1YmxpYyByb3dEZXRhaWxlcjogYW55O1xyXG5cclxuICAgIEBJbnB1dChcImV4cGFuZGFibGVcIilcclxuICAgIHB1YmxpYyBleHBhbmRhYmxlOiBhbnk7XHJcblxyXG4gICAgQElucHV0KFwiZXhwYW5kSWZcIilcclxuICAgIHB1YmxpYyBleHBhbmRJZjogYm9vbGVhbjtcclxuXHJcbiAgICBASW5wdXQoXCJmaWx0ZXJ3aGlsZXR5cGluZ1wiKVxyXG4gICAgcHVibGljIGZpbHRlcndoaWxldHlwaW5nOiBib29sZWFuO1xyXG5cclxuICAgIEBJbnB1dChcInJvd0RldGFpbGVySGVhZGVyc1wiKVxyXG4gICAgcHVibGljIHJvd0RldGFpbGVySGVhZGVyczogYW55O1xyXG5cclxuXHRAT3V0cHV0KCdvbmFjdGlvbicpXHJcblx0cHJpdmF0ZSBvbmFjdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0QE91dHB1dCgnb25DZWxsQ29udGVudEVkaXQnKVxyXG5cdHByaXZhdGUgb25DZWxsQ29udGVudEVkaXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBPdXRwdXQoJ29uY29uZmlndXJhdGlvbmNoYW5nZScpXHJcblx0cHJpdmF0ZSBvbmNvbmZpZ3VyYXRpb25jaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBWaWV3Q2hpbGQoJ3ZpZXdUYWJsZScpXHJcblx0dmlld1RhYmxlOiBUYWJsZVZpZXdDb21wb25lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBnZW5lcmF0b3I6IFRhYmxlSGVhZGVyc0dlbmVyYXRvcikge31cclxuXHJcblx0bmdPbkluaXQoKSB7XHJcblx0XHRpZiAodGhpcy5wZXJzaXN0ZW5jZUtleSkge1xyXG5cdFx0XHRjb25zdCBoZWFkZXJzOmFueSA9IHRoaXMuZ2VuZXJhdG9yLnJldHJlaXZlSGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQpO1xyXG5cclxuXHRcdFx0aWYgKGhlYWRlcnMpIHtcclxuXHRcdFx0XHR0aGlzLmhlYWRlcnMgPSBoZWFkZXJzO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAoIXRoaXMuaGVhZGVycyB8fCB0aGlzLmhlYWRlcnMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdHRoaXMuaGVhZGVycyA9IHRoaXMuZ2VuZXJhdG9yLmdlbmVyYXRlSGVhZGVyc0Zvcih0aGlzLml0ZW1zWzBdLFwiXCIsIDUsIHRoaXMuZW5hYmxlRmlsdGVyaW5nKTtcclxuXHRcdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcclxuXHRcdFx0XHR0aGlzLmdlbmVyYXRvci5wZXJzaXN0SGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQsIHRoaXMuaGVhZGVycyk7XHJcblx0XHRcdH1cclxuICAgICAgICB9XHJcblx0XHRpZiAoIXRoaXMucm93RGV0YWlsZXIgJiYgdGhpcy5leHBhbmRhYmxlKSB7XHJcblx0XHRcdHRoaXMucm93RGV0YWlsZXIgPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdFx0cmV0dXJuIHtkYXRhOiBpdGVtLCBoZWFkZXJzOiBbXX07XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5wYWdlSW5mbykge1xyXG5cdFx0XHRpZiAoIXRoaXMucGFnZUluZm8udG8pIHtcclxuXHRcdFx0XHR0aGlzLnBhZ2VJbmZvLnRvID0gdGhpcy5wYWdlSW5mby5wYWdlU2l6ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLnBhZ2VJbmZvLmNvbnRlbnRTaXplID0gdGhpcy5pdGVtcy5sZW5ndGg7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnBhZ2VJbmZvID0ge1xyXG4gICAgICAgICAgICAgICAgY29udGVudFNpemU6IDEwMDAwMCxcclxuICAgICAgICAgICAgICAgIHBhZ2VTaXplOiAxMDAwMDAsXHJcbiAgICAgICAgICAgICAgICBwYWdlczogMSxcclxuICAgICAgICAgICAgICAgIGZyb206IDAsXHJcbiAgICAgICAgICAgICAgICB0bzogMTAwMDAwLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudFBhZ2U6IDEsXHJcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogXCIwXCJcclxuICAgICAgICAgICAgfTtcclxuXHRcdH1cclxuXHRcdHRoaXMudXBkYXRlTGltaXRzKCk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGVMaW1pdHMoKSB7XHJcblx0XHR0aGlzLnN1YkhlYWRlcnMgPSB0aGlzLmhlYWRlcnMuZmlsdGVyKCAoaGVhZGVyKSA9PiBoZWFkZXIucHJlc2VudCA9PT0gdHJ1ZSk7XHJcblx0fVxyXG5cclxuXHRyZWNvbmZpZ3VyZShldmVudCkge1xyXG5cdFx0dGhpcy5oZWFkZXJzID0gZXZlbnQ7XHJcblx0XHR0aGlzLnVwZGF0ZUxpbWl0cygpO1xyXG5cdFx0dGhpcy5vbmNvbmZpZ3VyYXRpb25jaGFuZ2UuZW1pdChldmVudCk7XHJcblxyXG5cdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcclxuXHRcdFx0dGhpcy5nZW5lcmF0b3IucGVyc2lzdEhlYWRlcnModGhpcy5wZXJzaXN0ZW5jZUtleSwgdGhpcy5wZXJzaXN0ZW5jZUlkLCB0aGlzLmhlYWRlcnMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0b25QYWdpbmF0aW9uQ2hhbmdlKGV2ZW50KSB7XHJcblx0XHR0aGlzLnBhZ2VJbmZvID0gZXZlbnQ7XHJcblx0XHR0aGlzLnZpZXdUYWJsZS5ldmFsdWF0ZVJvd3MoKTtcclxuXHR9XHJcblxyXG5cdHRhYmxlQWN0aW9uKGV2ZW50KSB7XHJcblx0XHR0aGlzLm9uYWN0aW9uLmVtaXQoZXZlbnQpXHJcblx0fVxyXG5cclxuXHRvbkRyb3AoZXZlbnQ6RHJvcEV2ZW50KXtcclxuXHJcblx0fVxyXG5cdG9uQ2VsbEVkaXQoZXZlbnQpe1xyXG5cdFx0dGhpcy5vbkNlbGxDb250ZW50RWRpdC5lbWl0KGV2ZW50KTtcclxuXHR9XHJcbn1cclxuIiwiLypcclxuKiBQcm92aWRlcyBwYWdpbmF0aW9uIG9mIGEgZGF0YSBzZXQgaW4gYSB0YWJsZS5cclxuKi9cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFBhZ2luYXRpb25JbmZvIHtcclxuXHRjb250ZW50U2l6ZTogbnVtYmVyLFxyXG5cdHBhZ2VTaXplOiBudW1iZXIsXHJcbiAgICBtYXhXaWR0aD86IHN0cmluZyxcclxuXHRwYWdlcz86IG51bWJlcixcclxuXHRmcm9tPzogbnVtYmVyLFxyXG5cdHRvPzogbnVtYmVyLFxyXG5cdGN1cnJlbnRQYWdlPzogbnVtYmVyLFxyXG4gICAgcmVzZXRTaXplPzogYm9vbGVhblxyXG59XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAndGFibGUtcGFnaW5hdGlvbicsXHJcblx0dGVtcGxhdGVVcmw6ICcuL3BhZ2luYXRpb24uY29tcG9uZW50Lmh0bWwnLFxyXG5cdHN0eWxlVXJsczogWycuL3BhZ2luYXRpb24uY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgUGFnaW5hdGlvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gICAgQElucHV0KFwidm9jYWJ1bGFyeVwiKVxyXG4gICAgcHVibGljIHZvY2FidWxhcnkgPSB7c2V0U2l6ZTogXCJcIiwgZmlyc3RQYWdlOiBcIlwiLCBuZXh0UGFnZTogXCJcIiwgbGFzdFBhZ2U6IFwiXCIsIHByZXZpb3VzUGFnZTogXCJcIn07XHJcblxyXG4gICAgQElucHV0KFwiaW5mb1wiKVxyXG4gICAgaW5mbzogUGFnaW5hdGlvbkluZm8gPSB7IGNvbnRlbnRTaXplOiAwLCBwYWdlU2l6ZTogMCwgbWF4V2lkdGg6IFwiMFwiIH07XHJcblxyXG5cdEBPdXRwdXQoJ29uY2hhbmdlJylcclxuICAgIG9uY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAgIEBPdXRwdXQoJ29ucmVhZHknKVxyXG4gICAgb25yZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0bmdPbkluaXQoKSB7XHJcblx0XHRpZiAoIXRoaXMuaW5mbykge1xyXG5cdFx0XHR0aGlzLmluZm8gPSB7IFxyXG4gICAgICAgICAgICAgICAgY29udGVudFNpemU6IDEwMDAsIFxyXG4gICAgICAgICAgICAgICAgcGFnZVNpemU6IDEwMDAsIFxyXG4gICAgICAgICAgICAgICAgcGFnZXM6IDEsIFxyXG4gICAgICAgICAgICAgICAgZnJvbTogMCwgXHJcbiAgICAgICAgICAgICAgICB0bzogMTAwMCwgXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFnZTogMSwgXHJcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogXCIwXCIgXHJcbiAgICAgICAgICAgIH07XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5pbmZvLmNvbnRlbnRTaXplICYmIHRoaXMuaW5mby5wYWdlU2l6ZSkge1xyXG5cdFx0XHR0aGlzLmluZm8ucGFnZXMgPSBNYXRoLmNlaWwodGhpcy5pbmZvLmNvbnRlbnRTaXplIC8gdGhpcy5pbmZvLnBhZ2VTaXplKTtcclxuXHRcdFx0dGhpcy5pbmZvLmZyb20gPSAwO1xyXG5cdFx0XHR0aGlzLmluZm8udG8gPSB0aGlzLmluZm8ucGFnZVNpemUgLSAxO1xyXG5cdFx0XHR0aGlzLmluZm8uY3VycmVudFBhZ2UgPSAxO1xyXG5cdFx0ICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5yZWFkeSgpLCA2Nik7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFdpZHRoKHdpZHRoOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmluZm8ubWF4V2lkdGggPSB3aWR0aCArIFwicHhcIjtcclxuICAgIH1cclxuXHJcbiAgICByZWFkeSgpIHtcclxuICAgICAgICB0aGlzLm9ucmVhZHkuZW1pdCh0aGlzKTtcclxuICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5pbmZvKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RGaXJzdCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbmZvLmN1cnJlbnRQYWdlID4gMSkge1xyXG5cdFx0ICAgIHRoaXMuaW5mby5mcm9tID0gMDtcclxuXHRcdCAgICB0aGlzLmluZm8udG8gPSB0aGlzLmluZm8uZnJvbSArIHRoaXMuaW5mby5wYWdlU2l6ZSAtIDE7XHJcblx0XHQgICAgdGhpcy5pbmZvLmN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaW5mbyk7XHJcbiAgICAgICAgfVxyXG4gICB9XHJcblxyXG4gICBzZWxlY3ROZXh0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmluZm8uY3VycmVudFBhZ2UgPCB0aGlzLmluZm8ucGFnZXMpIHtcclxuIFx0XHR0aGlzLmluZm8uZnJvbSA9IHRoaXMuaW5mby50byArIDE7XHJcblx0XHR0aGlzLmluZm8udG8gPSB0aGlzLmluZm8uZnJvbSArIHRoaXMuaW5mby5wYWdlU2l6ZSAtIDE7XHJcblx0XHR0aGlzLmluZm8uY3VycmVudFBhZ2UrKztcclxuICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5pbmZvKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0UHJldigpIHtcclxuICAgICAgICBpZiAodGhpcy5pbmZvLmN1cnJlbnRQYWdlID4gMSkge1xyXG4gXHRcdCAgICB0aGlzLmluZm8uZnJvbSAtPSB0aGlzLmluZm8ucGFnZVNpemU7XHJcblx0XHQgICAgdGhpcy5pbmZvLnRvID0gdGhpcy5pbmZvLmZyb20gKyB0aGlzLmluZm8ucGFnZVNpemUgLSAxO1xyXG5cdFx0ICAgIHRoaXMuaW5mby5jdXJyZW50UGFnZS0tO1xyXG4gICAgICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5pbmZvKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0TGFzdCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbmZvLmN1cnJlbnRQYWdlIDwgdGhpcy5pbmZvLnBhZ2VzKSB7XHJcblx0XHQgICAgdGhpcy5pbmZvLmZyb20gPSB0aGlzLmluZm8ucGFnZVNpemUgKiAodGhpcy5pbmZvLnBhZ2VzIC0gMSk7XHJcblx0XHQgICAgdGhpcy5pbmZvLnRvID0gdGhpcy5pbmZvLmZyb20gKyB0aGlzLmluZm8ucGFnZVNpemUgLSAxO1xyXG5cdFx0ICAgIHRoaXMuaW5mby5jdXJyZW50UGFnZSA9IHRoaXMuaW5mby5wYWdlcztcclxuICAgICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaW5mbyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZUN1cnJlbnQocmFuZ2VyOiBhbnkpIHtcclxuICAgICAgICBjb25zdCB2ID0gcGFyc2VJbnQoIHJhbmdlci52YWx1ZSwgMTAgKTtcclxuICAgICAgICBpZiAodGhpcy5pbmZvLmN1cnJlbnRQYWdlIDwgdiAmJiB2ID4gMCAmJiB2IDwgdGhpcy5pbmZvLnBhZ2VzKSB7XHJcblx0XHQgICAgdGhpcy5pbmZvLmZyb20gPSB2ICogKHRoaXMuaW5mby5wYWdlU2l6ZSAtIDEpO1xyXG5cdFx0ICAgIHRoaXMuaW5mby50byA9IHRoaXMuaW5mby5mcm9tICsgdGhpcy5pbmZvLnBhZ2VTaXplIC0gMTtcclxuXHRcdCAgICB0aGlzLmluZm8uY3VycmVudFBhZ2UgPSB2O1xyXG4gICAgICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5pbmZvKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByYW5nZXIudmFsdWUgPSB0aGlzLmluZm8uY3VycmVudFBhZ2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVNpemUoc2l6ZXI6IGFueSkge1xyXG4gICAgICAgIGNvbnN0IHYgPSBwYXJzZUludCggc2l6ZXIudmFsdWUsIDEwICk7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5mby5jb250ZW50U2l6ZSA+PSB2ICYmIHYgPiAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5mby5wYWdlU2l6ZSA9IHY7XHJcbiBcdFx0XHR0aGlzLmluZm8ucGFnZXMgPSBNYXRoLmNlaWwodGhpcy5pbmZvLmNvbnRlbnRTaXplIC8gdik7XHJcbiAgICAgICAgICAgIHRoaXMuaW5mby5mcm9tID0gMDtcclxuXHRcdFx0dGhpcy5pbmZvLnRvID0gdGhpcy5pbmZvLnBhZ2VTaXplIC0gMTtcclxuXHRcdFx0dGhpcy5pbmZvLmN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaW5mbyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2l6ZXIudmFsdWUgPSB0aGlzLmluZm8ucGFnZVNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qXHJcbiogUHJvdmlkZXMgYWJpbGl0eSB0byBjb25maWd1cmUgZGlzcGxheWluZyBvZiB0YWJsZSBjb2x1bW5zLiBBcyBwZXIgZGVmaW5pdGlvbiBvZiBlYXJjaCBoZWFkZXIgY29tcG9uZW50LFxyXG4qIGEgY29sdW1uIGNvdWxkIGJlIGhpZGRlbi5cclxuKi9cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG5cdHNlbGVjdG9yOiAndGFibGUtY29uZmlndXJhdGlvbicsXHJcblx0dGVtcGxhdGVVcmw6ICcuL2NvbmZpZ3VyYXRpb24uY29tcG9uZW50Lmh0bWwnLFxyXG5cdHN0eWxlVXJsczogWycuL2NvbmZpZ3VyYXRpb24uY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ29uZmlndXJhdGlvbkNvbXBvbmVudCB7XHJcbiAgICBzaG93Q29uZmlndXJhdGlvblZpZXc6IGJvb2xlYW47XHJcblxyXG5cdEBJbnB1dChcInRpdGxlXCIpXHJcblx0cHVibGljIHRpdGxlOiBzdHJpbmc7XHJcblxyXG5cdEBJbnB1dChcImFjdGlvblwiKVxyXG5cdHB1YmxpYyBhY3Rpb246IHN0cmluZztcclxuXHJcblx0QElucHV0KFwicHJpbnRUYWJsZVwiKVxyXG5cdHB1YmxpYyBwcmludFRhYmxlOiBzdHJpbmc7XHJcblx0XHJcblx0QElucHV0KFwiaGVhZGVyc1wiKVxyXG5cdHB1YmxpYyBoZWFkZXJzOiBhbnlbXTtcclxuXHJcblx0QElucHV0KFwiY29uZmlnQWRkb25cIilcclxuXHRwdWJsaWMgY29uZmlnQWRkb246IGFueTtcclxuXHJcblx0QE91dHB1dCgnb25jaGFuZ2UnKVxyXG5cdHByaXZhdGUgb25jaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBPdXRwdXQoJ29ucHJpbnQnKVxyXG5cdHByaXZhdGUgb25wcmludCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0cmVjb25maWd1cmUoaXRlbSwgaGVhZGVyKSB7XHJcbiAgICAgICAgaGVhZGVyLnByZXNlbnQgPSBpdGVtLmNoZWNrZWQ7XHJcblx0XHR0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5oZWFkZXJzKTtcclxuXHR9XHJcblxyXG5cdGVuYWJsZUZpbHRlcihpdGVtLCBoZWFkZXIpIHtcclxuICAgICAgICBpZiAoaGVhZGVyLmZpbHRlciA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGhlYWRlci5maWx0ZXIgPSBcIlwiO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZGVsZXRlIGhlYWRlci5maWx0ZXI7XHJcblx0XHR9XHJcblx0XHR0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5oZWFkZXJzKTtcclxuXHR9XHJcblxyXG5cdHByaW50KGV2ZW50KSB7XHJcblx0XHR0aGlzLm9ucHJpbnQuZW1pdCh0cnVlKTtcclxuXHR9XHJcblxyXG4gICAga2V5dXAoZXZlbnQpIHtcclxuICAgICAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcbiAgICAgICAgaWYgKGNvZGUgPT09IDEzKSB7XHJcblx0XHRcdGV2ZW50LnRhcmdldC5jbGljaygpO1xyXG5cdFx0fVxyXG4gICAgfVxyXG59XHJcbiIsIi8qXG4qIFByb3ZpZGVzIHJlbmRlcmluZyBvZiBhIHRhYmxlIHdoaWNoIGlzIHVzaW5nIHRoZSBnaXZlbiBGbGV4aWJsZVRhYmxlSGVhZGVyIHNldCBpblxuKiBvcmRlciB0byB0YWJ1bGF0ZSB0aGUgZ2l2ZW4gZGF0YS4gQXMgcGVyIGRlZmluaXRpb24gb2YgZWFyY2ggaGVhZGVyIGNvbXBvbmVudCxcbiogYSBjb2x1bW4gY291bGQgYmUgaGlkZGVuLCBzb3J0YWJsZSwgb3IgZHJhZ2dhYmxlLiBFYWNoIHRhYmxlIHJvdyBjYW4gZXhwYW5kL2NvbGxhcHNlXG4qIG9yIHJlc3BvbmQgdG8gYSBjbGljayBhY3Rpb24uXG4qL1xuaW1wb3J0IHtcbiAgICBDb21wb25lbnQsXG5cdElucHV0LFxuXHRPdXRwdXQsXG5cdFZpZXdDaGlsZCxcblx0Vmlld0NvbnRhaW5lclJlZixcblx0T25Jbml0LFxuXHRSZW5kZXJlcixcblx0RWxlbWVudFJlZixcblx0RXZlbnRFbWl0dGVyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBEcm9wRXZlbnQsIERyYWdFdmVudCB9IGZyb20gJ2RyYWctZW5hYmxlZCc7XG5pbXBvcnQgeyBUYWJsZVZpZXdDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50JztcbmltcG9ydCB7IFRhYmxlSGVhZGVyc0dlbmVyYXRvciB9IGZyb20gJy4vY29tcG9uZW50cy90YWJsZS1oZWFkZXJzLWdlbmVyYXRvcic7XG5cbkBDb21wb25lbnQoe1xuXHRzZWxlY3RvcjogJ2xvY2stdGFibGUnLFxuXHR0ZW1wbGF0ZVVybDogJy4vbG9jay50YWJsZS5jb21wb25lbnQuaHRtbCcsXG5cdHN0eWxlVXJsczogWycuL2xvY2sudGFibGUuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBMb2NrVGFibGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG5cdGxvY2tlZEhlYWRlcnM6YW55O1xuXHR1bmxvY2tlZEhlYWRlcnM6YW55O1xuXHRmaWx0ZXJlZEl0ZW1zID0gW107XG5cbiAgICBASW5wdXQoXCJ2b2NhYnVsYXJ5XCIpXG4gICAgcHVibGljIHZvY2FidWxhcnkgPSB7XG5cdFx0Y29uZmlndXJlVGFibGU6IFwiQ29uZmlndXJlIFRhYmxlXCIsXG5cdFx0Y29uZmlndXJlQ29sdW1uczogXCJDb25maWd1cmUgQ29sdW1uc1wiLFxuXHRcdGNsaWNrU29ydDogXCJDbGljayB0byBTb3J0XCIsXG5cdFx0c2V0U2l6ZTogXCJTZXQgU2l6ZVwiLFxuXHRcdGZpcnN0UGFnZTogXCJGaXJzdFwiLFxuXHRcdGxhc3RQYWdlOiBcIkxhc3RcIixcblx0XHRwcmV2aW91c1BhZ2U6IFwiUHJldmlvdXNcIlxuXHR9O1xuXG4gICAgQElucHV0KFwicGVyc2lzdGVuY2VJZFwiKVxuICAgIHB1YmxpYyBwZXJzaXN0ZW5jZUlkOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoXCJwZXJzaXN0ZW5jZUtleVwiKVxuICAgIHB1YmxpYyBwZXJzaXN0ZW5jZUtleTogc3RyaW5nO1xuXG4gICAgQElucHV0KFwiY2FwdGlvblwiKVxuICAgIHB1YmxpYyBjYXB0aW9uOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoXCJhY3Rpb25cIilcbiAgICBwdWJsaWMgYWN0aW9uOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoXCJhY3Rpb25LZXlzXCIpXG4gICAgcHVibGljIGFjdGlvbktleXM7XG5cbiAgICBASW5wdXQoXCJ0YWJsZUNsYXNzXCIpXG4gICAgcHVibGljIHRhYmxlQ2xhc3MgPSAnZGVmYXVsdC1mbGV4aWJsZS10YWJsZSc7XG5cblx0QElucHV0KFwiaGVhZGVyc1wiKVxuXHRwdWJsaWMgaGVhZGVyczogYW55W107XG5cblx0QElucHV0KFwiaXRlbXNcIilcblx0cHVibGljIGl0ZW1zOiBhbnlbXTtcblxuXHRASW5wdXQoXCJwYWdlSW5mb1wiKVxuXHRwdWJsaWMgcGFnZUluZm86IGFueTtcblxuXHRASW5wdXQoXCJ0YWJsZUluZm9cIilcblx0cHVibGljIHRhYmxlSW5mbzogYW55O1xuXG4gICAgQElucHV0KFwiY29uZmlndXJhYmxlXCIpXG4gICAgcHVibGljIGNvbmZpZ3VyYWJsZTogYm9vbGVhbjtcblxuXHRASW5wdXQoXCJjb25maWdBZGRvblwiKVxuXHRwdWJsaWMgY29uZmlnQWRkb246IGFueTtcblxuXHRASW5wdXQoXCJlbmFibGVGaWx0ZXJpbmdcIilcbiAgICBwdWJsaWMgZW5hYmxlRmlsdGVyaW5nOiBib29sZWFuO1xuXG4gICAgQElucHV0KFwiZW5hYmxlSW5kZXhpbmdcIilcbiAgICBwdWJsaWMgZW5hYmxlSW5kZXhpbmc6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoXCJmaWx0ZXJ3aGlsZXR5cGluZ1wiKVxuICAgIHB1YmxpYyBmaWx0ZXJ3aGlsZXR5cGluZzogYm9vbGVhbjtcblxuXG5cdEBPdXRwdXQoJ29uYWN0aW9uJylcblx0cHJpdmF0ZSBvbmFjdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuXHRAT3V0cHV0KCdvbkNlbGxDb250ZW50RWRpdCcpXG5cdHByaXZhdGUgb25DZWxsQ29udGVudEVkaXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cblx0QE91dHB1dCgnb25jb25maWd1cmF0aW9uY2hhbmdlJylcblx0cHJpdmF0ZSBvbmNvbmZpZ3VyYXRpb25jaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cblx0QFZpZXdDaGlsZCgnbG9ja2VkVGFibGUnKVxuXHRwcml2YXRlIGxvY2tlZFRhYmxlOiBUYWJsZVZpZXdDb21wb25lbnQ7XG5cblx0QFZpZXdDaGlsZCgndW5sb2NrZWRUYWJsZScpXG5cdHByaXZhdGUgdW5sb2NrZWRUYWJsZTogVGFibGVWaWV3Q29tcG9uZW50O1xuXG4gICAgc2Nyb2xsKGV2ZW50KSB7XG5cdFx0dGhpcy5yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUoXG5cdFx0XHRcdHRoaXMubG9ja2VkVGFibGUuZWwubmF0aXZlRWxlbWVudCxcblx0XHRcdFx0XCJsZWZ0XCIsXG5cdFx0XHRcdGV2ZW50LnRhcmdldC5zY3JvbGxMZWZ0K1wicHhcIik7XG5cdH1cblxuICAgIGNvbnN0cnVjdG9yKFxuXHRcdHByaXZhdGUgZ2VuZXJhdG9yOiBUYWJsZUhlYWRlcnNHZW5lcmF0b3IsXG5cdFx0cHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXJcblx0KSB7fVxuXG5cdG5nT25Jbml0KCkge1xuXHRcdGlmICh0aGlzLnBhZ2VJbmZvKSB7XG5cdFx0XHRpZiAoIXRoaXMucGFnZUluZm8udG8pIHtcblx0XHRcdFx0dGhpcy5wYWdlSW5mby50byA9IHRoaXMucGFnZUluZm8ucGFnZVNpemU7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMucGFnZUluZm8gPSB7XG4gICAgICAgICAgICAgICAgY29udGVudFNpemU6IDEwMDAwMCxcbiAgICAgICAgICAgICAgICBwYWdlU2l6ZTogMTAwMDAwLFxuICAgICAgICAgICAgICAgIHBhZ2VzOiAxLFxuICAgICAgICAgICAgICAgIGZyb206IDAsXG4gICAgICAgICAgICAgICAgdG86IDEwMDAwMCxcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFnZTogMSxcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogXCIwXCJcbiAgICAgICAgICAgIH07XG5cdFx0fVxuXHRcdGlmICh0aGlzLnBlcnNpc3RlbmNlS2V5KSB7XG5cdFx0XHRjb25zdCBoZWFkZXJzOmFueSA9IHRoaXMuZ2VuZXJhdG9yLnJldHJlaXZlSGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQpO1xuXG5cdFx0XHRpZiAoaGVhZGVycykge1xuXHRcdFx0XHR0aGlzLmhlYWRlcnMgPSBoZWFkZXJzO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoIXRoaXMuaGVhZGVycykge1xuXHRcdFx0dGhpcy5oZWFkZXJzID0gdGhpcy5nZW5lcmF0b3IuZ2VuZXJhdGVIZWFkZXJzRm9yKHRoaXMuaXRlbXNbMF0sXCJcIiwgNSwgdGhpcy5lbmFibGVGaWx0ZXJpbmcpO1xuXHRcdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcblx0XHRcdFx0dGhpcy5nZW5lcmF0b3IucGVyc2lzdEhlYWRlcnModGhpcy5wZXJzaXN0ZW5jZUtleSwgdGhpcy5wZXJzaXN0ZW5jZUlkLCB0aGlzLmhlYWRlcnMpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSB0aGlzLml0ZW1zO1xuXHRcdHRoaXMucGFnZUluZm8uY29udGVudFNpemUgPSB0aGlzLml0ZW1zLmxlbmd0aDtcblx0XHRcblx0XHR0aGlzLnJlY29uZmlndXJlKHRoaXMuaGVhZGVycyk7XG5cblx0fVxuXG5cdGV2YWx1YXRlUG9zaXRpb25pbmcoKSB7XG5cdFx0dGhpcy5yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUoXG5cdFx0XHR0aGlzLnVubG9ja2VkVGFibGUuZWwubmF0aXZlRWxlbWVudCxcblx0XHRcdFwibWFyZ2luLWxlZnRcIixcblx0XHRcdHRoaXMubG9ja2VkVGFibGUub2Zmc2V0V2lkdGgoKStcInB4XCIpO1xuXHR9XG5cblx0cmVjb25maWd1cmUoZXZlbnQpIHtcblx0XHR0aGlzLmhlYWRlcnMgPSBldmVudDtcblx0XHR0aGlzLmxvY2tlZEhlYWRlcnMgPSB0aGlzLmhlYWRlcnMuZmlsdGVyKCAoaXRlbSkgPT4gaXRlbS5sb2NrZWQgPT09IHRydWUgJiYgaXRlbS5wcmVzZW50KTtcblx0XHR0aGlzLnVubG9ja2VkSGVhZGVycyA9IHRoaXMuaGVhZGVycy5maWx0ZXIoIChpdGVtKSA9PiBpdGVtLmxvY2tlZCAhPT0gdHJ1ZSAgJiYgaXRlbS5wcmVzZW50KTtcdFxuXHRcdHRoaXMub25jb25maWd1cmF0aW9uY2hhbmdlLmVtaXQoZXZlbnQpO1xuXG5cdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcblx0XHRcdHRoaXMuZ2VuZXJhdG9yLnBlcnNpc3RIZWFkZXJzKHRoaXMucGVyc2lzdGVuY2VLZXksIHRoaXMucGVyc2lzdGVuY2VJZCwgdGhpcy5oZWFkZXJzKTtcblx0XHR9XG5cdFx0c2V0VGltZW91dCh0aGlzLmV2YWx1YXRlUG9zaXRpb25pbmcuYmluZCh0aGlzKSwxMTEpO1xuXHR9XG5cblx0b25sb2NrKGV2ZW50KSB7XG5cdFx0dGhpcy5sb2NrZWRIZWFkZXJzID0gdGhpcy5oZWFkZXJzLmZpbHRlciggKGl0ZW0pID0+IGl0ZW0ubG9ja2VkID09PSB0cnVlICYmIGl0ZW0ucHJlc2VudCk7XG5cdFx0dGhpcy51bmxvY2tlZEhlYWRlcnMgPSB0aGlzLmhlYWRlcnMuZmlsdGVyKCAoaXRlbSkgPT4gaXRlbS5sb2NrZWQgIT09IHRydWUgICYmIGl0ZW0ucHJlc2VudCk7XHRcblx0XHR0aGlzLm9uY29uZmlndXJhdGlvbmNoYW5nZS5lbWl0KGV2ZW50KTtcblxuXHRcdGlmICh0aGlzLnBlcnNpc3RlbmNlS2V5KSB7XG5cdFx0XHR0aGlzLmdlbmVyYXRvci5wZXJzaXN0SGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQsIHRoaXMuaGVhZGVycyk7XG5cdFx0fVxuXHRcdHNldFRpbWVvdXQodGhpcy5ldmFsdWF0ZVBvc2l0aW9uaW5nLmJpbmQodGhpcyksMTExKTtcblx0fVxuXHRjaGFuZ2VMb2NrZWRUYWJsZUZpbHRlcmVkSXRlbXMoZXZlbnQpIHtcblx0XHRpZiAodGhpcy5sb2NrZWRUYWJsZSkge1xuXHRcdFx0dGhpcy5sb2NrZWRUYWJsZS5maWx0ZXJlZEl0ZW1zID0gZXZlbnQ7XG5cdFx0XHR0aGlzLmxvY2tlZFRhYmxlLmluaXRWaXNpYmxlUm93cygpO1xuXHRcdH1cblx0fVxuXHRjaGFuZ2VVbmxvY2tlZFRhYmxlRmlsdGVyZWRJdGVtcyhldmVudCkge1xuXHRcdGlmICh0aGlzLnVubG9ja2VkVGFibGUpIHtcblx0XHRcdHRoaXMudW5sb2NrZWRUYWJsZS5maWx0ZXJlZEl0ZW1zID0gZXZlbnQ7XG5cdFx0XHR0aGlzLnVubG9ja2VkVGFibGUuaW5pdFZpc2libGVSb3dzKCk7XG5cdFx0fVxuXHR9XG5cdG9uUGFnaW5hdGlvbkNoYW5nZShldmVudCkge1xuXHRcdHRoaXMucGFnZUluZm8gPSBldmVudDtcblx0XHR0aGlzLnVubG9ja2VkVGFibGUuZXZhbHVhdGVSb3dzKCk7XG5cdH1cblxuXHR0YWJsZUFjdGlvbihldmVudCkge1xuXHRcdHRoaXMub25hY3Rpb24uZW1pdChldmVudClcblx0fVxuXG5cdG9uRHJvcChldmVudDpEcm9wRXZlbnQpe1xuXG5cdH1cblx0b25DZWxsRWRpdChldmVudCl7XG5cdFx0dGhpcy5vbkNlbGxDb250ZW50RWRpdC5lbWl0KGV2ZW50KTtcblx0fVxufVxuXG4iLCJpbXBvcnQge1xyXG4gICAgRGlyZWN0aXZlLFxyXG4gICAgRWxlbWVudFJlZixcclxuICAgIEhvc3RMaXN0ZW5lcixcclxuICAgIElucHV0LFxyXG4gICAgT3V0cHV0LFxyXG4gICAgUmVuZGVyZXIsXHJcbiAgICBFdmVudEVtaXR0ZXJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdbdGFibGVTb3J0XSdcclxufSlcclxuZXhwb3J0IGNsYXNzIFRhYmxlU29ydERpcmVjdGl2ZSB7XHJcbiAgICBcclxuICAgIEBJbnB1dCgnbWVkaXVtJylcclxuICAgIG1lZGl1bTogYW55O1xyXG4gICAgICAgIFxyXG4gICAgQElucHV0KCdoZWFkZXJzJylcclxuICAgIGhlYWRlcnM6IGFueTtcclxuICAgICAgICBcclxuICAgIEBJbnB1dCgpXHJcbiAgICBkcm9wRWZmZWN0ID0gXCJtb3ZlXCI7XHJcbiAgICAgICAgXHJcbiAgICBASW5wdXQoXCJ0YWJsZVNvcnRcIilcclxuICAgIHRhYmxlU29ydCA9IChwYXRoKSA9PiB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIsXHJcbiAgICAgICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZlxyXG4gICAgKSB7fVxyXG4gICAgXHJcbiAgICBwcml2YXRlIGhlYWRlckNvbHVtbkVsZW1lbnRzKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZWwubmF0aXZlRWxlbWVudC5wYXJlbnROb2RlLmNoaWxkcmVuO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZmluZENvbHVtbldpdGhJRChpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IHRoaXMuaGVhZGVyQ29sdW1uRWxlbWVudHMoKTtcclxuXHRcdGxldCBjb2x1bW4gPSBudWxsO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmIChsaXN0W2ldLmdldEF0dHJpYnV0ZShcImlkXCIpID09PSBpZCkge1xyXG5cdFx0XHRcdGNvbHVtbiA9IGxpc3RbaV07XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBjb2x1bW47XHJcblx0fVxyXG5cclxuXHRzb3J0KGljb24pIHtcclxuXHRcdGlmICh0aGlzLm1lZGl1bS5zb3J0YWJsZSkge1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVhZGVycy5sZW5ndGggOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGggPSB0aGlzLmhlYWRlcnNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGgua2V5ICE9PSB0aGlzLm1lZGl1bS5rZXkpIHtcclxuXHRcdFx0XHRcdGNvbnN0IGl0ZW0gPSB0aGlzLmZpbmRDb2x1bW5XaXRoSUQoaC5rZXkpO1xyXG5cclxuXHRcdFx0XHRcdGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGl0ZW0sIFwiYXNjZW5kaW5nXCIsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoaXRlbSwgXCJkZXNjZW5kaW5nXCIsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoaXRlbSwgXCJzb3J0YWJsZVwiLCB0cnVlKTtcclxuXHRcdFx0XHRcdH1cclxuICAgICAgICAgICAgICAgICAgICBoLmRlc2NlbmRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBoLmFzY2VuZGluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhpY29uLCBcImZhLXNvcnRcIiwgZmFsc2UpO1xyXG5cdFx0XHRpZiAodGhpcy5tZWRpdW0uYXNjZW5kaW5nIHx8ICghdGhpcy5tZWRpdW0uYXNjZW5kaW5nICYmICF0aGlzLm1lZGl1bS5kZXNjZW5kaW5nKSkge1xyXG5cdFx0XHRcdHRoaXMubWVkaXVtLmRlc2NlbmRpbmcgPSB0cnVlO1xyXG5cdFx0XHRcdHRoaXMubWVkaXVtLmFzY2VuZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoaWNvbiwgXCJmYS1zb3J0LWFzY1wiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhpY29uLCBcImZhLXNvcnQtZGVzY1wiLCB0cnVlKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLm1lZGl1bS5kZXNjZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0dGhpcy5tZWRpdW0uYXNjZW5kaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGljb24sIFwiZmEtc29ydC1kZXNjXCIsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGljb24sIFwiZmEtc29ydC1hc2NcIiwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy50YWJsZVNvcnQodGhpcy5tZWRpdW0ua2V5LnNwbGl0KFwiLlwiKSk7XHJcblx0XHR9XHJcblx0fVxyXG59IiwiLypcclxuKiBQcm92aWRlcyByZW5kZXJpbmcgb2YgZmxleGlibGUgdGFibGUgaW4gYSBsYXp5IGxvYWQgZmFzaGlvbi5cclxuKi9cclxuaW1wb3J0IHsgTmdNb2R1bGUsIENVU1RPTV9FTEVNRU5UU19TQ0hFTUEgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHtJbnRvUGlwZU1vZHVsZX0gZnJvbSAnaW50by1waXBlcyc7XHJcbmltcG9ydCB7IERyYWdEcm9wTW9kdWxlIH0gZnJvbSAnZHJhZy1lbmFibGVkJztcclxuXHJcbmltcG9ydCB7IFBhZ2luYXRpb25Db21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvcGFnaW5hdGlvbi5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDb25maWd1cmF0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2NvbmZpZ3VyYXRpb24uY29tcG9uZW50JztcclxuaW1wb3J0IHsgVGFibGVWaWV3Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlLmNvbXBvbmVudCc7XHJcblxyXG5pbXBvcnQgeyBUYWJsZUhlYWRlcnNHZW5lcmF0b3IgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUtaGVhZGVycy1nZW5lcmF0b3InO1xyXG5pbXBvcnQgeyBGbGV4aWJsZVRhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi9mbGV4aWJsZS50YWJsZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBMb2NrVGFibGVDb21wb25lbnQgfSBmcm9tICcuL2xvY2sudGFibGUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgVGFibGVTb3J0RGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL3RhYmxlLXNvcnQuZGlyZWN0aXZlJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbXHJcbiAgICAgICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgICAgIERyYWdEcm9wTW9kdWxlLFxyXG4gICAgICAgIEludG9QaXBlTW9kdWxlXHJcbiAgICBdLFxyXG4gICAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICAgICAgRmxleGlibGVUYWJsZUNvbXBvbmVudCxcclxuICAgICAgICBMb2NrVGFibGVDb21wb25lbnQsXHJcbiAgICAgICAgQ29uZmlndXJhdGlvbkNvbXBvbmVudCxcclxuICAgICAgICBQYWdpbmF0aW9uQ29tcG9uZW50LFxyXG4gICAgICAgIFRhYmxlVmlld0NvbXBvbmVudCxcclxuICAgICAgICBUYWJsZVNvcnREaXJlY3RpdmVcclxuICAgIF0sXHJcbiAgICBleHBvcnRzOiBbXHJcbiAgICAgICAgRmxleGlibGVUYWJsZUNvbXBvbmVudCxcclxuICAgICAgICBMb2NrVGFibGVDb21wb25lbnRcclxuICAgIF0sXHJcbiAgICBlbnRyeUNvbXBvbmVudHM6IFtcclxuICAgIF0sXHJcbiAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICBUYWJsZUhlYWRlcnNHZW5lcmF0b3JcclxuICAgIF0sXHJcbiAgICBzY2hlbWFzOiBbQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQV1cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBGbGV4aWJsZVRhYmxlTW9kdWxlIHt9XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBaUJFO3VCQUZrQixFQUFFO0tBR25COzs7Ozs7OztJQUVELGtCQUFrQixDQUFDLElBQVEsRUFBRSxJQUFZLEVBQUUsVUFBa0IsRUFBRSxnQkFBeUI7UUFFdEYsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFFLENBQUMsR0FBRzs7Z0JBQ3pCLE1BQU0sU0FBUyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7Z0JBRTNELElBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUSxJQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsSUFBSSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxTQUFTLEVBQUU7O29CQUNwRyxNQUFNLE1BQU0sR0FBUTt3QkFDbEIsR0FBRyxFQUFFLFNBQVM7d0JBQ2QsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO3dCQUNoQyxRQUFRLEVBQUUsSUFBSTt3QkFDZCxRQUFRLEVBQUUsSUFBSTt3QkFDZCxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDO3FCQUNqRSxDQUFBO29CQUNELElBQUksZ0JBQWdCLEVBQUU7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QUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNsRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZELElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzdCO0tBQ0o7Ozs7SUFFRCxVQUFVO1FBQ04sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUU7WUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZELElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2pDO0tBQ0o7Ozs7SUFFRCxVQUFVO1FBQ04sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUMvQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FB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