import { Injectable, Component, Input, Output, ViewChild, ViewContainerRef, EventEmitter, ElementRef, Renderer, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntoPipeModule } from '@sedeh/into-pipes';
import { DragDropModule } from '@sedeh/drag-enabled';

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
                    TableViewComponent
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

export { FlexibleTableComponent, FlexibleTableModule, ConfigurationComponent as ɵc, PaginationComponent as ɵd, TableHeadersGenerator as ɵa, TableViewComponent as ɵe, LockTableComponent as ɵb };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VkZWgtZmxleGlibGUtdGFibGUuanMubWFwIiwic291cmNlcyI6WyJuZzovL0BzZWRlaC9mbGV4aWJsZS10YWJsZS9zcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2NvbXBvbmVudHMvdGFibGUtaGVhZGVycy1nZW5lcmF0b3IudHMiLCJuZzovL0BzZWRlaC9mbGV4aWJsZS10YWJsZS9zcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50LnRzIiwibmc6Ly9Ac2VkZWgvZmxleGlibGUtdGFibGUvc3JjL2FwcC9mbGV4aWJsZS10YWJsZS9mbGV4aWJsZS50YWJsZS5jb21wb25lbnQudHMiLCJuZzovL0BzZWRlaC9mbGV4aWJsZS10YWJsZS9zcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2NvbXBvbmVudHMvcGFnaW5hdGlvbi5jb21wb25lbnQudHMiLCJuZzovL0BzZWRlaC9mbGV4aWJsZS10YWJsZS9zcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2NvbXBvbmVudHMvY29uZmlndXJhdGlvbi5jb21wb25lbnQudHMiLCJuZzovL0BzZWRlaC9mbGV4aWJsZS10YWJsZS9zcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2xvY2sudGFibGUuY29tcG9uZW50LnRzIiwibmc6Ly9Ac2VkZWgvZmxleGlibGUtdGFibGUvc3JjL2FwcC9mbGV4aWJsZS10YWJsZS9mbGV4aWJsZS10YWJsZS1tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogVGhpcyBvYmplY3Qgd2lsbCB0cmF2ZXJzZSB0aHJvdWdoIGEgZ2l2ZW4ganNvbiBvYmplY3QgYW5kIGZpbmRzIGFsbCB0aGUgYXR0cmlidXRlcyBvZiBcclxuICogdGhlIG9iamVjdCBhbmQgaXRzIHJlbGF0ZWQgYXNzb2NpYXRpb25zIHdpdGhpbiB0aGUganNvbi4gVGhlIHJlc3VsdGluZyBzdHJ1Y3R1cmUgd291bGQgYmUgXHJcbiAqIG5hbWUgb2YgYXR0cmlidXRlcyBhbmQgYSBwYXRod2F5IHRvIHJlYWNoIHRoZSBhdHRyaWJ1dGUgZGVlcCBpbiBvYmplY3QgaGVpcmFyY2h5LlxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVmlzdWFsaXphdGlvblBvaW50IHtcclxuICBrZXk6IHN0cmluZyxcclxuICB2YWx1ZTogc3RyaW5nXHJcbn1cclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRhYmxlSGVhZGVyc0dlbmVyYXRvciB7XHJcbiAgcHJpdmF0ZSBoZWFkZXJzID0gW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gIH1cclxuXHJcbiAgZ2VuZXJhdGVIZWFkZXJzRm9yKHJvb3Q6IHt9LCBwYXRoOiBzdHJpbmcsIG1heFZpc2libGU6IG51bWJlciwgZmlsdGVyaW5nRW5hYmxlZDogYm9vbGVhbikge1xyXG5cclxuICAgIGlmIChyb290ICE9PSBudWxsKSB7XHJcbiAgICAgIE9iamVjdC5rZXlzKHJvb3QpLm1hcCggKGtleSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlubmVyUGF0aCA9IChwYXRoLmxlbmd0aCA/IChwYXRoICsgXCIuXCIgKyBrZXkpIDoga2V5KTtcclxuICBcclxuICAgICAgICBpZiAodHlwZW9mIHJvb3Rba2V5XSA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2Ygcm9vdFtrZXldID09PSBcIm51bWJlclwiIHx8IHR5cGVvZiByb290W2tleV0gPT09IFwiYm9vbGVhblwiKSB7XHJcbiAgICAgICAgICBjb25zdCBoZWFkZXI6IGFueSA9IHtcclxuICAgICAgICAgICAga2V5OiBpbm5lclBhdGgsXHJcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLm1ha2VXb3Jkcyhpbm5lclBhdGgpLFxyXG4gICAgICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgZHJhZ2FibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHByZXNlbnQ6IChwYXRoLmxlbmd0aCA9PT0gMCAmJiB0aGlzLmhlYWRlcnMubGVuZ3RoIDwgbWF4VmlzaWJsZSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChmaWx0ZXJpbmdFbmFibGVkKSB7XHJcbiAgICAgICAgICAgIGhlYWRlci5maWx0ZXIgPSBcIlwiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnB1c2goaGVhZGVyKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJvb3Rba2V5XSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICBjb25zdCBub2RlID0gcm9vdFtrZXldO1xyXG4gICAgICAgICAgaWYgKG5vZGUubGVuZ3RoICYmICEobm9kZVswXSBpbnN0YW5jZW9mIEFycmF5KSAmJiAodHlwZW9mIG5vZGVbMF0gIT09IFwic3RyaW5nXCIpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVIZWFkZXJzRm9yKG5vZGVbMF0sIGlubmVyUGF0aCwgbWF4VmlzaWJsZSwgZmlsdGVyaW5nRW5hYmxlZCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmhlYWRlcnMucHVzaCh7XHJcbiAgICAgICAgICAgICAga2V5OiBpbm5lclBhdGgsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHRoaXMubWFrZVdvcmRzKGlubmVyUGF0aClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5nZW5lcmF0ZUhlYWRlcnNGb3Iocm9vdFtrZXldLCBpbm5lclBhdGgsIG1heFZpc2libGUsIGZpbHRlcmluZ0VuYWJsZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5oZWFkZXJzO1xyXG4gIH1cclxuXHJcbiAgcmV0cmVpdmVIZWFkZXJzKGtleSwgdHJhY2tpbmdrZXkpIHtcclxuICAgIGxldCByZXN1bHQ6IGFueTtcclxuICAgIHRyeSB7XHJcbiAgICAgIHJlc3VsdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRyYWNraW5na2V5KTtcclxuXHJcbiAgICAgIGlmICghcmVzdWx0IHx8IHJlc3VsdCAhPSBrZXkpIHtcclxuICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7IC8vIHdlIGhhdmUgYSBuZXdlciB2ZXJzaW9uIGFuZCBpdCB3aWxsIG92ZXJyaWRlIHNhdmVkIGRhdGEuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcclxuICAgICAgICByZXN1bHQgPSByZXN1bHQgPyBKU09OLnBhcnNlKHJlc3VsdCkgOiByZXN1bHQ7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwZXJzaXN0SGVhZGVycyhrZXksIHRyYWNraW5na2V5LCBoZWFkZXJzKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0cmFja2luZ2tleSk7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRyYWNraW5na2V5LCBrZXkpO1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KGhlYWRlcnMpKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgbWFrZVdvcmRzKG5hbWUpIHtcclxuICAgIHJldHVybiBuYW1lXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXC4vZywnIH4gJylcclxuICAgICAgICAgICAgLnJlcGxhY2UoLyhbQS1aXSkvZywgJyAkMScpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC8tL2csXCIgXCIpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC9fL2csXCIgXCIpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC9eLi8sIChzdHIpID0+IHN0ci50b1VwcGVyQ2FzZSgpKTtcclxuICB9XHJcbn1cclxuIiwiLypcclxuKiBQcm92aWRlcyByZW5kZXJpbmcgb2YgYSB0YWJsZSB3aGljaCBpcyB1c2luZyB0aGUgZ2l2ZW4gRmxleGlibGVUYWJsZUhlYWRlciBzZXQgaW5cclxuKiBvcmRlciB0byB0YWJ1bGF0ZSB0aGUgZ2l2ZW4gZGF0YS4gQXMgcGVyIGRlZmluaXRpb24gb2YgZWFyY2ggaGVhZGVyIGNvbXBvbmVudCxcclxuKiBhIGNvbHVtbiBjb3VsZCBiZSBoaWRkZW4sIHNvcnRhYmxlLCBvciBkcmFnZ2FibGUuIEVhY2ggdGFibGUgcm93IGNhbiBleHBhbmQvY29sbGFwc2VcclxuKiBvciByZXNwb25kIHRvIGEgY2xpY2sgYWN0aW9uLlxyXG4qL1xyXG5pbXBvcnQge1xyXG4gICAgQ29tcG9uZW50LFxyXG5cdElucHV0LFxyXG5cdE91dHB1dCxcclxuXHRWaWV3Q2hpbGQsXHJcblx0Vmlld0NvbnRhaW5lclJlZixcclxuXHRPbkluaXQsXHJcblx0T25DaGFuZ2VzLFxyXG5cdEV2ZW50RW1pdHRlcixcclxuXHRFbGVtZW50UmVmXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBEcm9wRXZlbnQsIERyYWdFdmVudCB9IGZyb20gJ0BzZWRlaC9kcmFnLWVuYWJsZWQnO1xyXG5pbXBvcnQgeyBUaW1lb3V0cyB9IGZyb20gJy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AdHlwZXMvc2VsZW5pdW0td2ViZHJpdmVyJztcclxuaW1wb3J0IHsgVGltZSB9IGZyb20gJy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AYW5ndWxhci9jb21tb24nO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBGbGV4aWJsZVRhYmxlSGVhZGVyIHtcclxuXHRrZXk6IHN0cmluZyxcclxuXHR2YWx1ZTogc3RyaW5nLFxyXG5cdHByZXNlbnQ6IGJvb2xlYW4sXHJcblx0d2lkdGg/OiBzdHJpbmcsXHJcblx0bWlud2lkdGg/OiBzdHJpbmcsXHJcblx0Zm9ybWF0Pzogc3RyaW5nLFxyXG5cdGZpbHRlcj86IHN0cmluZyxcclxuXHRkcmFnYWJsZT86IGJvb2xlYW4sXHJcblx0c29ydGFibGU/OiBib29sZWFuLFxyXG5cdGNsYXNzPzpzdHJpbmcsXHJcblx0bG9ja2VkPzpib29sZWFuLFxyXG5cdGFzY2VuZGluZz86IGJvb2xlYW4sXHJcblx0ZGVzY2VuZGluZz86IGJvb2xlYW5cclxufVxyXG5cclxuQENvbXBvbmVudCh7XHJcblx0c2VsZWN0b3I6ICd0YWJsZS12aWV3JyxcclxuXHR0ZW1wbGF0ZVVybDogJy4vdGFibGUuY29tcG9uZW50Lmh0bWwnLFxyXG5cdHN0eWxlVXJsczogWycuL3RhYmxlLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIFRhYmxlVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcclxuXHRkcmFnZ2luZyA9IGZhbHNlO1xyXG5cdHByaW50TW9kZSA9IGZhbHNlO1xyXG5cdGZpbHRlcmVkSXRlbXMgPSBbXTtcclxuXHRmaWx0ZXJpbmdUaW1lcklkOiBhbnk7XHJcblxyXG4gICAgQElucHV0KFwidm9jYWJ1bGFyeVwiKVxyXG4gICAgcHVibGljIHZvY2FidWxhcnkgPSB7XHJcblx0XHRjb25maWd1cmVUYWJsZTogXCJDb25maWd1cmUgVGFibGVcIixcclxuXHRcdGNvbmZpZ3VyZUNvbHVtbnM6IFwiQ29uZmlndXJlIENvbHVtbnNcIixcclxuXHRcdGNsaWNrU29ydDogXCJDbGljayB0byBTb3J0XCIsXHJcblx0XHRzZXRTaXplOiBcIlNldCBTaXplXCIsXHJcblx0XHRmaXJzdFBhZ2U6IFwiRmlyc3RcIixcclxuXHRcdGxhc3RQYWdlOiBcIkxhc3RcIixcclxuXHRcdHByZXZpb3VzUGFnZTogXCJQcmV2aW91c1wiXHJcblx0fTtcclxuXHJcblx0QElucHV0KFwibG9ja2FibGVcIilcclxuXHRsb2NrYWJsZTpib29sZWFuO1xyXG5cclxuXHRASW5wdXQoXCJjYXB0aW9uXCIpXHJcbiAgICBwdWJsaWMgY2FwdGlvbjogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dChcImFjdGlvblwiKVxyXG4gICAgcHVibGljIGFjdGlvbjogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dChcInBhZ2VJbmZvXCIpXHJcbiAgICBwdWJsaWMgcGFnZUluZm87XHJcblxyXG4gICAgQElucHV0KFwiYWN0aW9uS2V5c1wiKVxyXG4gICAgcHVibGljIGFjdGlvbktleXM7XHJcblxyXG4gICAgQElucHV0KFwidGFibGVDbGFzc1wiKVxyXG4gICAgcHVibGljIHRhYmxlQ2xhc3MgPSAnZGVmYXVsdC1mbGV4aWJsZS10YWJsZSc7XHJcblxyXG5cdEBJbnB1dChcImhlYWRlcnNcIilcclxuXHRwdWJsaWMgaGVhZGVyczogYW55W107XHJcblxyXG5cdEBJbnB1dChcIml0ZW1zXCIpXHJcblx0cHVibGljIGl0ZW1zOiBhbnlbXTtcclxuXHJcblx0QElucHV0KFwidGFibGVJbmZvXCIpXHJcblx0cHVibGljIHRhYmxlSW5mbzogYW55O1xyXG5cclxuICAgIEBJbnB1dChcImVuYWJsZUluZGV4aW5nXCIpXHJcbiAgICBwdWJsaWMgZW5hYmxlSW5kZXhpbmc6IGJvb2xlYW47XHJcblxyXG4gICAgQElucHV0KFwiZW5hYmxlRmlsdGVyaW5nXCIpXHJcbiAgICBwdWJsaWMgZW5hYmxlRmlsdGVyaW5nOiBib29sZWFuO1xyXG5cclxuICAgIEBJbnB1dChcInJvd0RldGFpbGVyXCIpXHJcbiAgICBwdWJsaWMgcm93RGV0YWlsZXI6IGFueTtcclxuXHJcbiAgICBASW5wdXQoXCJleHBhbmRhYmxlXCIpXHJcbiAgICBwdWJsaWMgZXhwYW5kYWJsZTogYW55O1xyXG5cclxuICAgIEBJbnB1dChcImV4cGFuZElmXCIpXHJcbiAgICBwdWJsaWMgZXhwYW5kSWY6IGJvb2xlYW47XHJcblxyXG4gICAgQElucHV0KFwiZmlsdGVyd2hpbGV0eXBpbmdcIilcclxuICAgIHB1YmxpYyBmaWx0ZXJ3aGlsZXR5cGluZzogYm9vbGVhbjtcclxuXHJcbiAgICBASW5wdXQoXCJyb3dEZXRhaWxlckhlYWRlcnNcIilcclxuICAgIHB1YmxpYyByb3dEZXRhaWxlckhlYWRlcnM6IGFueTtcclxuXHJcblx0QE91dHB1dCgnb25hY3Rpb24nKVxyXG5cdHByaXZhdGUgb25hY3Rpb24gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBPdXRwdXQoJ29uY2hhbmdlJylcclxuXHRwcml2YXRlIG9uY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHRAT3V0cHV0KCdvbmZpbHRlcicpXHJcblx0cHJpdmF0ZSBvbmZpbHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0QE91dHB1dCgnb25DZWxsQ29udGVudEVkaXQnKVxyXG5cdHByaXZhdGUgb25DZWxsQ29udGVudEVkaXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBWaWV3Q2hpbGQoJ2ZsZXhpYmxlJywge3JlYWQ6IFZpZXdDb250YWluZXJSZWZ9KSBwcml2YXRlIHRhYmxlOiBWaWV3Q29udGFpbmVyUmVmO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDpFbGVtZW50UmVmKSB7fVxyXG5cclxuXHJcblx0cHJpdmF0ZSBmaW5kQ29sdW1uV2l0aElEKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBsaXN0ID0gdGhpcy5oZWFkZXJDb2x1bW5FbGVtZW50cygpO1xyXG5cdFx0bGV0IGNvbHVtbiA9IG51bGw7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKGxpc3RbaV0uZ2V0QXR0cmlidXRlKFwiaWRcIikgPT09IGlkKSB7XHJcblx0XHRcdFx0Y29sdW1uID0gbGlzdFtpXTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNvbHVtbjtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgc3dhcENvbHVtbnMoc291cmNlOiBhbnksIGRlc3RpbmF0aW9uOiBhbnkpIHtcclxuXHJcblx0XHRpZiAoc291cmNlLm5vZGUucGFyZW50Tm9kZSA9PT0gZGVzdGluYXRpb24ubm9kZS5wYXJlbnROb2RlKSB7XHJcblx0XHRcdGNvbnN0IHNyY0luZGV4ID0gdGhpcy5nZXRDb2x1bW5JbmRleChzb3VyY2UubWVkaXVtLmtleSk7XHJcblx0XHRcdGNvbnN0IGRlc0luZGV4ID0gdGhpcy5nZXRDb2x1bW5JbmRleChkZXN0aW5hdGlvbi5tZWRpdW0ua2V5KTtcclxuXHRcdFx0aWYgKHNyY0luZGV4IDwgMCB8fCBkZXNJbmRleCA8IDApIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcImludmFsaWQgZHJvcCBpZFwiLCBzb3VyY2UubWVkaXVtLmtleSwgZGVzdGluYXRpb24ubWVkaXVtLmtleSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNvbnN0IHggPSB0aGlzLmZpbHRlcmVkSXRlbXM7XHJcblx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IFtdO1xyXG5cclxuXHRcdFx0c2V0VGltZW91dCgoKT0+e1xyXG5cdFx0XHRcdGNvbnN0IHNvYmogPSB0aGlzLmhlYWRlcnNbc3JjSW5kZXhdO1xyXG5cdFx0XHRcdHRoaXMuaGVhZGVyc1tzcmNJbmRleF0gPSB0aGlzLmhlYWRlcnNbZGVzSW5kZXhdO1xyXG5cdFx0XHRcdHRoaXMuaGVhZGVyc1tkZXNJbmRleF0gPSBzb2JqO1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IHg7XHJcblxyXG5cdFx0XHRcdHRoaXMub25maWx0ZXIuZW1pdCh0aGlzLmZpbHRlcmVkSXRlbXMpO1xyXG5cdFx0XHRcdHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzLmhlYWRlcnMpO1xyXG5cdFx0XHR9LCAzMyk7XHJcblx0XHJcblx0XHR9IGVsc2UgaWYgKHNvdXJjZS5tZWRpdW0ubG9ja2VkIHx8IGRlc3RpbmF0aW9uLm1lZGl1bS5sb2NrZWQpIHtcclxuXHRcdFx0Y29uc3QgeCA9IHRoaXMuZmlsdGVyZWRJdGVtcztcclxuXHRcdFx0dGhpcy5maWx0ZXJlZEl0ZW1zID0gW107XHJcblx0XHRcdHRoaXMub25maWx0ZXIuZW1pdCh0aGlzLmZpbHRlcmVkSXRlbXMpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KCgpPT57XHJcblx0XHRcdFx0c291cmNlLm1lZGl1bS5sb2NrZWQgPSAhc291cmNlLm1lZGl1bS5sb2NrZWQ7XHJcblx0XHRcdFx0ZGVzdGluYXRpb24ubWVkaXVtLmxvY2tlZCA9ICFkZXN0aW5hdGlvbi5tZWRpdW0ubG9ja2VkO1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IHg7XHJcblx0XHRcdFx0dGhpcy5vbmZpbHRlci5lbWl0KHRoaXMuZmlsdGVyZWRJdGVtcyk7XHJcblx0XHRcdFx0dGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaGVhZGVycyk7XHJcblx0XHRcdH0sMzMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBnZXRDb2x1bW5JbmRleChpZDogc3RyaW5nKSB7XHJcblx0XHRsZXQgaW5kZXggPSAtMTtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWFkZXJzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmICh0aGlzLmhlYWRlcnNbaV0ua2V5ID09PSBpZCkge1xyXG5cdFx0XHRcdGluZGV4ID0gaTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGluZGV4O1xyXG5cdH1cclxuXHRwcml2YXRlIGl0ZW1WYWx1ZShpdGVtLCBocGF0aCkge1xyXG5cdFx0bGV0IHN1Yml0ZW0gPSBpdGVtO1xyXG5cdFx0aHBhdGgubWFwKCAoc3Via2V5KSA9PiB7XHJcblx0XHRcdGlmIChzdWJpdGVtKSB7XHJcblx0XHRcdFx0c3ViaXRlbSA9IHN1Yml0ZW1bc3Via2V5XTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHRcdHJldHVybiBzdWJpdGVtID09PSB1bmRlZmluZWQgfHwgc3ViaXRlbSA9PT0gbnVsbCB8fCBzdWJpdGVtID09PSBcIm51bGxcIiA/IFwiXCIgOiBzdWJpdGVtO1xyXG5cdH1cclxuXHRpbml0VmlzaWJsZVJvd3MoKSB7XHJcblx0XHRjb25zdCByZXN1bHQgPSBbXTtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5maWx0ZXJlZEl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmIChpID49IHRoaXMucGFnZUluZm8uZnJvbSAmJiBpIDw9IHRoaXMucGFnZUluZm8udG8pIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaCh0aGlzLmZpbHRlcmVkSXRlbXNbaV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSByZXN1bHQ7XHJcblx0fVxyXG5cclxuXHRsb2NrKGhlYWRlcjogRmxleGlibGVUYWJsZUhlYWRlciwgZXZlbnQpIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcdFxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRoZWFkZXIubG9ja2VkID0gIWhlYWRlci5sb2NrZWQ7XHJcblx0XHR0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5oZWFkZXJzKTtcclxuXHR9XHJcblx0c29ydChoZWFkZXI6IEZsZXhpYmxlVGFibGVIZWFkZXIsIGljb24pIHtcclxuXHRcdGlmIChoZWFkZXIuc29ydGFibGUgJiYgdGhpcy5pdGVtcyAmJiB0aGlzLml0ZW1zLmxlbmd0aCkge1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVhZGVycy5sZW5ndGggOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGggPSB0aGlzLmhlYWRlcnNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGgua2V5ICE9PSBoZWFkZXIua2V5KSB7XHJcblx0XHRcdFx0XHRjb25zdCBpdGVtID0gdGhpcy5maW5kQ29sdW1uV2l0aElEKGgua2V5KTtcclxuXHJcblx0XHRcdFx0XHRpZiAoaXRlbSkge1xyXG5cdFx0XHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJhc2NlbmRpbmdcIik7XHJcblx0XHRcdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LnJlbW92ZShcImRlc2NlbmRpbmdcIik7XHJcblx0XHRcdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LmFkZChcInNvcnRhYmxlXCIpO1xyXG5cdFx0XHRcdFx0fVxyXG4gICAgICAgICAgICAgICAgICAgIGguZGVzY2VuZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGguYXNjZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcbiAgICAgICAgICAgIGljb24uY2xhc3NMaXN0LnJlbW92ZShcImZhLXNvcnRcIik7XHJcblx0XHRcdGlmIChoZWFkZXIuYXNjZW5kaW5nIHx8ICghaGVhZGVyLmFzY2VuZGluZyAmJiAhaGVhZGVyLmRlc2NlbmRpbmcpKSB7XHJcblx0XHRcdFx0aGVhZGVyLmRlc2NlbmRpbmcgPSB0cnVlO1xyXG5cdFx0XHRcdGhlYWRlci5hc2NlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRpY29uLmNsYXNzTGlzdC5yZW1vdmUoXCJmYS1zb3J0LWFzY1wiKTtcclxuXHRcdFx0XHRpY29uLmNsYXNzTGlzdC5hZGQoXCJmYS1zb3J0LWRlc2NcIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aGVhZGVyLmRlc2NlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRoZWFkZXIuYXNjZW5kaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHRpY29uLmNsYXNzTGlzdC5yZW1vdmUoXCJmYS1zb3J0LWRlc2NcIik7XHJcblx0XHRcdFx0aWNvbi5jbGFzc0xpc3QuYWRkKFwiZmEtc29ydC1hc2NcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0Y29uc3QgaHBhdGggPSBoZWFkZXIua2V5LnNwbGl0KFwiLlwiKTtcclxuXHJcblx0XHRcdGlmICh0aGlzLmVuYWJsZUZpbHRlcmluZykge1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVySXRlbXMoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSB0aGlzLml0ZW1zID8gdGhpcy5pdGVtcyA6IFtdO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcy5zb3J0KChhLCBiKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgdjEgPSB0aGlzLml0ZW1WYWx1ZShhLCBocGF0aCk7XHJcblx0XHRcdFx0Y29uc3QgdjIgPSB0aGlzLml0ZW1WYWx1ZShiLCBocGF0aCk7XHJcblxyXG5cdFx0XHRcdGlmIChoZWFkZXIuYXNjZW5kaW5nKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdjEgPiB2MiA/IDEgOiAtMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHYxIDwgdjIgPyAxIDogLTE7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR0aGlzLmluaXRWaXNpYmxlUm93cygpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0b2Zmc2V0V2lkdGgoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy50YWJsZS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XHJcblx0fVxyXG5cclxuXHRuZ09uQ2hhbmdlcyhjaGFuZ2VzOmFueSkge1xyXG5cdFx0Ly8gaWYgKGNoYW5nZXMuaXRlbXMpIHtcclxuXHRcdC8vIFx0dGhpcy5ldmFsdWF0ZVJvd3MoKTtcclxuXHRcdC8vIH1cclxuXHR9XHJcblxyXG5cdG5nT25Jbml0KCkge1xyXG5cdFx0aWYgKHRoaXMucGFnZUluZm8pIHtcclxuXHRcdFx0aWYgKCF0aGlzLnBhZ2VJbmZvLnRvKSB7XHJcblx0XHRcdFx0dGhpcy5wYWdlSW5mby50byA9IHRoaXMucGFnZUluZm8ucGFnZVNpemU7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMucGFnZUluZm8gPSB7IFxyXG4gICAgICAgICAgICAgICAgY29udGVudFNpemU6IDEwMDAwMCwgXHJcbiAgICAgICAgICAgICAgICBwYWdlU2l6ZTogMTAwMDAwLCBcclxuICAgICAgICAgICAgICAgIHBhZ2VzOiAxLCBcclxuICAgICAgICAgICAgICAgIGZyb206IDAsIFxyXG4gICAgICAgICAgICAgICAgdG86IDEwMDAwMCwgXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFnZTogMSwgXHJcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogXCIwXCIgXHJcbiAgICAgICAgICAgIH07XHJcblx0XHR9XHJcblx0XHRpZiAoIXRoaXMuaGVhZGVycykge1xyXG5cdFx0XHR0aGlzLmhlYWRlcnMgPSBbXTtcclxuXHRcdH1cclxuXHRcdHRoaXMuZXZhbHVhdGVSb3dzKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aW9uS2V5cykge1xyXG4gICAgICAgICAgICB0aGlzLmFjdGlvbktleXMgPSB0aGlzLmFjdGlvbktleXMuc3BsaXQoXCIsXCIpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCF0aGlzLnJvd0RldGFpbGVyICYmIHRoaXMuZXhwYW5kYWJsZSkge1xyXG5cdFx0XHR0aGlzLnJvd0RldGFpbGVyID0gZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRcdHJldHVybiB7ZGF0YTogaXRlbSwgaGVhZGVyczogW119O1xyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdFx0aWYgKCF0aGlzLmV4cGFuZGFibGUpIHtcclxuXHRcdFx0dGhpcy5leHBhbmRhYmxlID0gZnVuY3Rpb24oaXRlbSwgc2hvd0ljb24pIHtyZXR1cm4gc2hvd0ljb259O1xyXG5cdFx0fVxyXG5cdFx0aWYgKCF0aGlzLnJvd0RldGFpbGVySGVhZGVycykge1xyXG5cdFx0XHR0aGlzLnJvd0RldGFpbGVySGVhZGVycyA9IChpdGVtKSA9PiBbXTtcclxuXHRcdH1cclxuXHR9XHJcblx0ZXZhbHVhdGVSb3dzKCkge1xyXG5cdFx0aWYgKHRoaXMuZW5hYmxlRmlsdGVyaW5nKSB7XHJcblx0XHRcdHRoaXMuZmlsdGVySXRlbXMoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IHRoaXMuaXRlbXMgPyB0aGlzLml0ZW1zIDogW107XHJcblx0XHR9XHJcblx0XHR0aGlzLmluaXRWaXNpYmxlUm93cygpO1xyXG5cdH1cclxuXHJcbiAgICBoZWFkZXJDb2x1bW5FbGVtZW50cygpIHtcclxuXHRcdGxldCByZXN1bHQgPSBbXTtcclxuXHJcblx0XHRpZiAodGhpcy50YWJsZS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW4pIHtcclxuXHRcdFx0Y29uc3QgbGlzdCA9IHRoaXMudGFibGUuZWxlbWVudC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuO1xyXG5cdFx0XHRyZXN1bHQgPSB0aGlzLmNhcHRpb24gPyBsaXN0WzFdLmNoaWxkcmVuWzBdLmNoaWxkcmVuIDogbGlzdFswXS5jaGlsZHJlblswXS5jaGlsZHJlbjtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG5cdGhlYWRlckJ5SWQoaWQpIHtcclxuXHRcdGxldCBoO1xyXG5cdFx0Zm9yIChjb25zdCBpIGluIHRoaXMuaGVhZGVycykge1xyXG5cdFx0XHRpZiAodGhpcy5oZWFkZXJzW2ldLmtleSA9PT0gaWQpIHtcclxuXHRcdFx0XHRoID0gdGhpcy5oZWFkZXJzW2ldO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gaDtcclxuXHR9XHJcblxyXG4gICAgY29sdW1uc0NvdW50KCkge1xyXG5cdFx0bGV0IGNvdW50ID0gMDtcclxuXHRcdHRoaXMuaGVhZGVycy5tYXAoIChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLnByZXNlbnQpIHtcclxuICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgIH1cclxuXHRcdH0pO1xyXG4gICAgICAgIGlmICh0aGlzLmFjdGlvbikge1xyXG4gICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY291bnQ7XHJcblx0fVxyXG5cdGhvdmVyKGl0ZW0sIGZsYWcpIHtcclxuXHRcdGlmIChmbGFnKSB7XHJcblx0XHRcdGl0ZW0uaG92ZXIgPSB0cnVlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZGVsZXRlIGl0ZW0uaG92ZXI7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR0b0Nzc0NsYXNzKGhlYWRlcikge1xyXG5cdFx0cmV0dXJuIGhlYWRlci5rZXkucmVwbGFjZSgvXFwuL2csJy0nKTtcclxuXHR9XHJcbiAgICBrZXlkb3duKGV2ZW50LCBpdGVtKSB7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG4gICAgICAgIGlmICgoY29kZSA9PT0gMTMpIHx8IChjb2RlID09PSAzMikpIHtcclxuXHRcdFx0aXRlbS5jbGljaygpO1xyXG5cdFx0fVxyXG4gICAgfVxyXG4gICAgb2ZmU2NyZWVuTWVzc2FnZShpdGVtKSB7XHJcblx0XHRsZXQgbWVzc2FnZTogc3RyaW5nID0gdGhpcy5hY3Rpb247XHJcblx0XHRpZiAodGhpcy5hY3Rpb25LZXlzKSB7XHJcblx0XHRcdHRoaXMuYWN0aW9uS2V5cy5tYXAoKGtleSkgPT4geyBtZXNzYWdlID0gbWVzc2FnZS5yZXBsYWNlKGtleSwgaXRlbVtrZXkuc3Vic3RyaW5nKDEsIGtleS5sZW5ndGggLSAxKV0pOyB9KVxyXG5cdFx0fVxyXG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xyXG4gICAgfVxyXG5cclxuICAgIGNlbGxDb250ZW50KGl0ZW0sIGhlYWRlcikge1xyXG5cdFx0bGV0IGNvbnRlbnQgPSB0aGlzLml0ZW1WYWx1ZShpdGVtLCBoZWFkZXIua2V5LnNwbGl0KFwiLlwiKSk7XHJcbiAgICAgICAgcmV0dXJuIChjb250ZW50ICE9PSB1bmRlZmluZWQgJiYgY29udGVudCAhPSBudWxsICYmIFN0cmluZyhjb250ZW50KS5sZW5ndGgpID8gY29udGVudCA6ICcmbmJzcDsnO1xyXG5cdH1cclxuXHJcblx0cm93RGV0YWlsZXJDb250ZXh0KGl0ZW0pIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGRhdGE6IGl0ZW0sXHJcblx0XHRcdHRhYmxlSW5mbzogdGhpcy50YWJsZUluZm8sXHJcblx0XHRcdGhlYWRlcnM6IHRoaXMucm93RGV0YWlsZXJIZWFkZXJzKGl0ZW0pXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0Y2hhbmdlRmlsdGVyKGV2ZW50LCBoZWFkZXIpIHtcclxuICAgICAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcblxyXG5cdFx0aGVhZGVyLmZpbHRlciA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuXHJcblx0XHRpZiAodGhpcy5maWx0ZXJ3aGlsZXR5cGluZyB8fCBjb2RlID09PSAxMykge1xyXG5cdFx0XHRpZih0aGlzLmZpbHRlcmluZ1RpbWVySWQpIHtcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQodGhpcy5maWx0ZXJpbmdUaW1lcklkKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmZpbHRlcmluZ1RpbWVySWQgPSBzZXRUaW1lb3V0KCgpPT57XHJcblx0XHRcdFx0dGhpcy5maWx0ZXJJdGVtcygpO1xyXG5cdFx0XHRcdHRoaXMuaW5pdFZpc2libGVSb3dzKCk7XHJcblx0XHRcdFx0dGhpcy5maWx0ZXJpbmdUaW1lcklkICA9IHVuZGVmaW5lZDtcclxuXHRcdFx0fSwgMTIzKTtcclxuXHRcdH1cclxuXHR9XHJcblx0YWN0aW9uQ2xpY2soZXZlbnQsIGl0ZW06IGFueSkge1xyXG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgaWYgKHRoaXMucm93RGV0YWlsZXIgJiYgKHRoaXMuZXhwYW5kSWYgfHwgdGhpcy5leHBhbmRhYmxlKGl0ZW0sIGZhbHNlKSkgKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmV4cGFuZGVkKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgaXRlbS5leHBhbmRlZDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZXhwYW5kZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vbmFjdGlvbi5lbWl0KGl0ZW0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cHJpbnQoKSB7XHJcblx0XHR0aGlzLnByaW50TW9kZSA9IHRydWU7XHJcblx0XHRzZXRUaW1lb3V0KCgpPT57XHJcblx0XHRcdGNvbnN0IGNvbnRlbnQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MO1xyXG5cdFx0XHR0aGlzLnByaW50TW9kZSA9IGZhbHNlO1xyXG5cdFx0XHRjb25zdCBwb3B1cFdpbiA9IHdpbmRvdy5vcGVuKCcnLCAnX2JsYW5rJywgJ3dpZHRoPTMwMCxoZWlnaHQ9MzAwJyk7XHJcblx0XHRcclxuXHRcdFx0cG9wdXBXaW4uZG9jdW1lbnQub3BlbigpO1xyXG4gICAgICAgIFx0cG9wdXBXaW4uZG9jdW1lbnQud3JpdGUoJzxodG1sPjxib2R5IG9ubG9hZD1cIndpbmRvdy5wcmludCgpXCI+JyArIGNvbnRlbnQgKyAnPC9odG1sPicpO1xyXG4gICAgICAgIFx0cG9wdXBXaW4uZG9jdW1lbnQuY2xvc2UoKTtcclxuXHRcdH0sMyk7XHJcblx0fVxyXG5cclxuXHQvLyA8NSwgITUsID41LCAqRSwgRSosICpFKlxyXG5cdHByaXZhdGUgc2hvdWxkU2tpcEl0ZW0odmFsdWUsIGZpbHRlckJ5KSB7XHJcblx0XHRsZXQgcmVzdWx0ID0gZmFsc2U7XHJcblxyXG5cdFx0aWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwgJiYgU3RyaW5nKHZhbHVlKS5sZW5ndGgpIHtcclxuXHRcdFx0Y29uc3QgdiA9IFN0cmluZyh2YWx1ZSk7XHJcblx0XHRcdGlmIChmaWx0ZXJCeVswXSA9PT0gJzwnKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gZmlsdGVyQnkubGVuZ3RoID4gMSAmJiBwYXJzZUZsb2F0KHYpID49IHBhcnNlRmxvYXQoZmlsdGVyQnkuc3Vic3RyaW5nKDEpKTtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWx0ZXJCeVswXSA9PT0gJz4nKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gZmlsdGVyQnkubGVuZ3RoID4gMSAmJiBwYXJzZUZsb2F0KHYpIDw9IHBhcnNlRmxvYXQoZmlsdGVyQnkuc3Vic3RyaW5nKDEpKTtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWx0ZXJCeVswXSA9PT0gJyEnKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gZmlsdGVyQnkubGVuZ3RoID4gMSAmJiBwYXJzZUZsb2F0KHYpID09IHBhcnNlRmxvYXQoZmlsdGVyQnkuc3Vic3RyaW5nKDEpKTtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWx0ZXJCeVswXSA9PT0gJz0nKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gZmlsdGVyQnkubGVuZ3RoID09IDEgfHwgcGFyc2VGbG9hdCh2KSAhPT0gcGFyc2VGbG9hdChmaWx0ZXJCeS5zdWJzdHJpbmcoMSkpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGZpbHRlckJ5WzBdID09PSAnKicgJiYgZmlsdGVyQnlbZmlsdGVyQnkubGVuZ3RoLTFdICE9PSAnKicpIHtcclxuXHRcdFx0XHRjb25zdCBmID0gZmlsdGVyQnkuc3Vic3RyaW5nKDEpO1xyXG5cdFx0XHRcdHJlc3VsdCA9IHYuaW5kZXhPZihmKSAhPT0gdi5sZW5ndGggLSBmLmxlbmd0aFxyXG5cdFx0XHR9IGVsc2UgaWYgKGZpbHRlckJ5WzBdICE9PSAnKicgJiYgZmlsdGVyQnlbZmlsdGVyQnkubGVuZ3RoLTFdID09PSAnKicpIHtcclxuXHRcdFx0XHRjb25zdCBmID0gZmlsdGVyQnkuc3Vic3RyaW5nKDAsIGZpbHRlckJ5Lmxlbmd0aC0xKTtcclxuXHRcdFx0XHRyZXN1bHQgPSB2LmluZGV4T2YoZikgIT09IDA7XHJcblx0XHRcdH0gZWxzZSBpZiAoZmlsdGVyQnlbMF0gPT09ICcqJyAmJiBmaWx0ZXJCeVtmaWx0ZXJCeS5sZW5ndGgtMV0gPT09ICcqJykge1xyXG5cdFx0XHRcdHJlc3VsdCA9IGZpbHRlckJ5Lmxlbmd0aCA+IDEgJiYgdi5pbmRleE9mKCBmaWx0ZXJCeS5zdWJzdHJpbmcoMSwgZmlsdGVyQnkubGVuZ3RoLTEpICkgPCAwO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJlc3VsdCA9IHYuaW5kZXhPZihmaWx0ZXJCeSkgPCAwO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH1cclxuXHRmaWx0ZXJJdGVtcygpIHtcclxuXHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IHRoaXMuaXRlbXMgPyB0aGlzLml0ZW1zLmZpbHRlcigoaXRlbSkgPT4ge1xyXG5cdFx0XHRsZXQga2VlcEl0ZW0gPSB0cnVlO1xyXG5cclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlYWRlcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRjb25zdCBoZWFkZXIgPSB0aGlzLmhlYWRlcnNbaV07XHJcblx0XHRcdFx0aWYgKGhlYWRlci5maWx0ZXIgJiYgaGVhZGVyLmZpbHRlci5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdGNvbnN0IHYgPSB0aGlzLml0ZW1WYWx1ZShpdGVtLCBoZWFkZXIua2V5LnNwbGl0KFwiLlwiKSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuc2hvdWxkU2tpcEl0ZW0odixoZWFkZXIuZmlsdGVyKSkge1xyXG5cdFx0XHRcdFx0XHRrZWVwSXRlbSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGtlZXBJdGVtO1xyXG5cdFx0fSkgOiBbXTtcclxuXHRcdHRoaXMub25maWx0ZXIuZW1pdCh0aGlzLmZpbHRlcmVkSXRlbXMpO1xyXG5cdH1cclxuXHJcblx0b25UYWJsZUNlbGxFZGl0KGV2ZW50KSB7XHJcblx0XHRjb25zdCBpZCA9IGV2ZW50LmlkLnNwbGl0KFwiLVwiKTtcclxuXHRcdGNvbnN0IG4gPSBldmVudC5uYW1lO1xyXG5cdFx0Y29uc3Qgdj0gZXZlbnQudmFsdWU7XHJcblx0XHRjb25zdCB0ID0gdGhpcy5pdGVtc1twYXJzZUludChpZFsxXSldO1xyXG5cclxuXHRcdGlmICh0KSB7XHJcblx0XHRcdGNvbnN0IGxpc3QgPSBpZFswXS5zcGxpdChcIi5cIik7XHJcblx0XHRcdGxldCBzdWJpdGVtID0gdFtsaXN0WzBdXTtcclxuXHRcdFx0Zm9yKGxldCBpID0gMTsgaSA8IChsaXN0Lmxlbmd0aCAtIDEpOyBpKyspIHtcclxuXHRcdFx0XHRzdWJpdGVtID0gc3ViaXRlbVtsaXN0W2ldXVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChzdWJpdGVtICYmIGxpc3QubGVuZ3RoID4gMSl7XHJcblx0XHRcdFx0c3ViaXRlbVtsaXN0W2xpc3QubGVuZ3RoIC0gMV1dID0gdjtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLm9uQ2VsbENvbnRlbnRFZGl0LmVtaXQoe25hbWU6IG4sIHZhbHVlOiB2LCBpdGVtOiB0fSk7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG5cdGRyYWdFbmFibGVkKGV2ZW50OiBEcmFnRXZlbnQpIHtcclxuXHRcdHJldHVybiBldmVudC5tZWRpdW0uZHJhZ2FibGU7XHJcblx0fVxyXG5cdGRyb3BFbmFibGVkKGV2ZW50OiBEcm9wRXZlbnQpIHtcclxuXHRcdHJldHVybiBldmVudC5kZXN0aW5hdGlvbi5tZWRpdW0uZHJhZ2FibGU7XHJcblx0fVxyXG5cdG9uRHJhZ1N0YXJ0KGV2ZW50OiBEcmFnRXZlbnQpe1xyXG4vLyAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWU7XHJcblx0fVxyXG5cdG9uRHJhZ0VuZChldmVudDogRHJhZ0V2ZW50KXtcclxuIC8vICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcclxuXHR9XHJcblx0b25Ecm9wKGV2ZW50OkRyb3BFdmVudCl7XHJcblx0XHR0aGlzLnN3YXBDb2x1bW5zKGV2ZW50LnNvdXJjZSwgZXZlbnQuZGVzdGluYXRpb24pO1xyXG5cdH1cclxufVxyXG4iLCIvKlxyXG4qIFByb3ZpZGVzIHJlbmRlcmluZyBvZiBhIHRhYmxlIHdoaWNoIGlzIHVzaW5nIHRoZSBnaXZlbiBGbGV4aWJsZVRhYmxlSGVhZGVyIHNldCBpblxyXG4qIG9yZGVyIHRvIHRhYnVsYXRlIHRoZSBnaXZlbiBkYXRhLiBBcyBwZXIgZGVmaW5pdGlvbiBvZiBlYXJjaCBoZWFkZXIgY29tcG9uZW50LFxyXG4qIGEgY29sdW1uIGNvdWxkIGJlIGhpZGRlbiwgc29ydGFibGUsIG9yIGRyYWdnYWJsZS4gRWFjaCB0YWJsZSByb3cgY2FuIGV4cGFuZC9jb2xsYXBzZVxyXG4qIG9yIHJlc3BvbmQgdG8gYSBjbGljayBhY3Rpb24uXHJcbiovXHJcbmltcG9ydCB7XHJcbiAgICBDb21wb25lbnQsXHJcblx0SW5wdXQsXHJcblx0T3V0cHV0LFxyXG5cdFZpZXdDaGlsZCxcclxuXHRWaWV3Q29udGFpbmVyUmVmLFxyXG5cdE9uSW5pdCxcclxuXHRFdmVudEVtaXR0ZXJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IERyb3BFdmVudCwgRHJhZ0V2ZW50IH0gZnJvbSAnQHNlZGVoL2RyYWctZW5hYmxlZCc7XHJcbmltcG9ydCB7IFRhYmxlSGVhZGVyc0dlbmVyYXRvciB9IGZyb20gJy4vY29tcG9uZW50cy90YWJsZS1oZWFkZXJzLWdlbmVyYXRvcic7XHJcbmltcG9ydCB7IFRhYmxlVmlld0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90YWJsZS5jb21wb25lbnQnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcblx0c2VsZWN0b3I6ICdmbGV4aWJsZS10YWJsZScsXHJcblx0dGVtcGxhdGVVcmw6ICcuL2ZsZXhpYmxlLnRhYmxlLmNvbXBvbmVudC5odG1sJyxcclxuXHRzdHlsZVVybHM6IFsnLi9mbGV4aWJsZS50YWJsZS5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBGbGV4aWJsZVRhYmxlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcblx0c3ViSGVhZGVyczphbnk7XHJcblxyXG4gICAgQElucHV0KFwidm9jYWJ1bGFyeVwiKVxyXG4gICAgcHVibGljIHZvY2FidWxhcnkgPSB7XHJcblx0XHRwcmludFRhYmxlOiBcIlByaW50IFRhYmxlXCIsXHJcblx0XHRjb25maWd1cmVUYWJsZTogXCJDb25maWd1cmUgVGFibGVcIixcclxuXHRcdGNvbmZpZ3VyZUNvbHVtbnM6IFwiQ29uZmlndXJlIENvbHVtbnNcIixcclxuXHRcdGNsaWNrU29ydDogXCJDbGljayB0byBTb3J0XCIsXHJcblx0XHRzZXRTaXplOiBcIlNldCBTaXplXCIsXHJcblx0XHRmaXJzdFBhZ2U6IFwiRmlyc3RcIixcclxuXHRcdGxhc3RQYWdlOiBcIkxhc3RcIixcclxuXHRcdHByZXZpb3VzUGFnZTogXCJQcmV2aW91c1wiXHJcblx0fTtcclxuXHRcclxuICAgIEBJbnB1dChcInBlcnNpc3RlbmNlSWRcIilcclxuICAgIHB1YmxpYyBwZXJzaXN0ZW5jZUlkOiBzdHJpbmc7XHJcblxyXG5cdEBJbnB1dChcInBlcnNpc3RlbmNlS2V5XCIpXHJcbiAgICBwdWJsaWMgcGVyc2lzdGVuY2VLZXk6IHN0cmluZztcclxuXHJcbiAgICBASW5wdXQoXCJjYXB0aW9uXCIpXHJcbiAgICBwdWJsaWMgY2FwdGlvbjogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dChcImFjdGlvblwiKVxyXG4gICAgcHVibGljIGFjdGlvbjogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dChcImFjdGlvbktleXNcIilcclxuICAgIHB1YmxpYyBhY3Rpb25LZXlzO1xyXG5cclxuICAgIEBJbnB1dChcInRhYmxlQ2xhc3NcIilcclxuICAgIHB1YmxpYyB0YWJsZUNsYXNzID0gJ2RlZmF1bHQtZmxleGlibGUtdGFibGUnO1xyXG5cclxuXHRASW5wdXQoXCJoZWFkZXJzXCIpXHJcblx0cHVibGljIGhlYWRlcnM6IGFueVtdO1xyXG5cclxuXHRASW5wdXQoXCJpdGVtc1wiKVxyXG5cdHB1YmxpYyBpdGVtczogYW55W107XHJcblxyXG5cdEBJbnB1dChcInBhZ2VJbmZvXCIpXHJcblx0cHVibGljIHBhZ2VJbmZvOiBhbnk7XHJcblxyXG5cdEBJbnB1dChcInRhYmxlSW5mb1wiKVxyXG5cdHB1YmxpYyB0YWJsZUluZm86IGFueTtcclxuXHJcbiAgICBASW5wdXQoXCJjb25maWd1cmFibGVcIilcclxuICAgIHB1YmxpYyBjb25maWd1cmFibGU6IGJvb2xlYW47XHJcblxyXG5cdEBJbnB1dChcImNvbmZpZ0FkZG9uXCIpXHJcblx0cHVibGljIGNvbmZpZ0FkZG9uOiBhbnk7XHJcblxyXG5cdEBJbnB1dChcImVuYWJsZUluZGV4aW5nXCIpXHJcbiAgICBwdWJsaWMgZW5hYmxlSW5kZXhpbmc6IGJvb2xlYW47XHJcblxyXG4gICAgQElucHV0KFwiZW5hYmxlRmlsdGVyaW5nXCIpXHJcbiAgICBwdWJsaWMgZW5hYmxlRmlsdGVyaW5nOiBib29sZWFuO1xyXG5cclxuICAgIEBJbnB1dChcInJvd0RldGFpbGVyXCIpXHJcbiAgICBwdWJsaWMgcm93RGV0YWlsZXI6IGFueTtcclxuXHJcbiAgICBASW5wdXQoXCJleHBhbmRhYmxlXCIpXHJcbiAgICBwdWJsaWMgZXhwYW5kYWJsZTogYW55O1xyXG5cclxuICAgIEBJbnB1dChcImV4cGFuZElmXCIpXHJcbiAgICBwdWJsaWMgZXhwYW5kSWY6IGJvb2xlYW47XHJcblxyXG4gICAgQElucHV0KFwiZmlsdGVyd2hpbGV0eXBpbmdcIilcclxuICAgIHB1YmxpYyBmaWx0ZXJ3aGlsZXR5cGluZzogYm9vbGVhbjtcclxuXHJcbiAgICBASW5wdXQoXCJyb3dEZXRhaWxlckhlYWRlcnNcIilcclxuICAgIHB1YmxpYyByb3dEZXRhaWxlckhlYWRlcnM6IGFueTtcclxuXHJcblx0QE91dHB1dCgnb25hY3Rpb24nKVxyXG5cdHByaXZhdGUgb25hY3Rpb24gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBPdXRwdXQoJ29uQ2VsbENvbnRlbnRFZGl0JylcclxuXHRwcml2YXRlIG9uQ2VsbENvbnRlbnRFZGl0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHRAT3V0cHV0KCdvbmNvbmZpZ3VyYXRpb25jaGFuZ2UnKVxyXG5cdHByaXZhdGUgb25jb25maWd1cmF0aW9uY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHRAVmlld0NoaWxkKCd2aWV3VGFibGUnKVxyXG5cdHZpZXdUYWJsZTogVGFibGVWaWV3Q29tcG9uZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZ2VuZXJhdG9yOiBUYWJsZUhlYWRlcnNHZW5lcmF0b3IpIHt9XHJcblxyXG5cdG5nT25Jbml0KCkge1xyXG5cdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcclxuXHRcdFx0Y29uc3QgaGVhZGVyczphbnkgPSB0aGlzLmdlbmVyYXRvci5yZXRyZWl2ZUhlYWRlcnModGhpcy5wZXJzaXN0ZW5jZUtleSwgdGhpcy5wZXJzaXN0ZW5jZUlkKTtcclxuXHJcblx0XHRcdGlmIChoZWFkZXJzKSB7XHJcblx0XHRcdFx0dGhpcy5oZWFkZXJzID0gaGVhZGVycztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKCF0aGlzLmhlYWRlcnMgfHwgdGhpcy5oZWFkZXJzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHR0aGlzLmhlYWRlcnMgPSB0aGlzLmdlbmVyYXRvci5nZW5lcmF0ZUhlYWRlcnNGb3IodGhpcy5pdGVtc1swXSxcIlwiLCA1LCB0aGlzLmVuYWJsZUZpbHRlcmluZyk7XHJcblx0XHRcdGlmICh0aGlzLnBlcnNpc3RlbmNlS2V5KSB7XHJcblx0XHRcdFx0dGhpcy5nZW5lcmF0b3IucGVyc2lzdEhlYWRlcnModGhpcy5wZXJzaXN0ZW5jZUtleSwgdGhpcy5wZXJzaXN0ZW5jZUlkLCB0aGlzLmhlYWRlcnMpO1xyXG5cdFx0XHR9XHJcbiAgICAgICAgfVxyXG5cdFx0aWYgKCF0aGlzLnJvd0RldGFpbGVyICYmIHRoaXMuZXhwYW5kYWJsZSkge1xyXG5cdFx0XHR0aGlzLnJvd0RldGFpbGVyID0gZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRcdHJldHVybiB7ZGF0YTogaXRlbSwgaGVhZGVyczogW119O1xyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMucGFnZUluZm8pIHtcclxuXHRcdFx0aWYgKCF0aGlzLnBhZ2VJbmZvLnRvKSB7XHJcblx0XHRcdFx0dGhpcy5wYWdlSW5mby50byA9IHRoaXMucGFnZUluZm8ucGFnZVNpemU7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5wYWdlSW5mby5jb250ZW50U2l6ZSA9IHRoaXMuaXRlbXMubGVuZ3RoO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5wYWdlSW5mbyA9IHtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRTaXplOiAxMDAwMDAsXHJcbiAgICAgICAgICAgICAgICBwYWdlU2l6ZTogMTAwMDAwLFxyXG4gICAgICAgICAgICAgICAgcGFnZXM6IDEsXHJcbiAgICAgICAgICAgICAgICBmcm9tOiAwLFxyXG4gICAgICAgICAgICAgICAgdG86IDEwMDAwMCxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRQYWdlOiAxLFxyXG4gICAgICAgICAgICAgICAgbWF4V2lkdGg6IFwiMFwiXHJcbiAgICAgICAgICAgIH07XHJcblx0XHR9XHJcblx0XHR0aGlzLnVwZGF0ZUxpbWl0cygpO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlTGltaXRzKCkge1xyXG5cdFx0dGhpcy5zdWJIZWFkZXJzID0gdGhpcy5oZWFkZXJzLmZpbHRlciggKGhlYWRlcikgPT4gaGVhZGVyLnByZXNlbnQgPT09IHRydWUpO1xyXG5cdH1cclxuXHJcblx0cmVjb25maWd1cmUoZXZlbnQpIHtcclxuXHRcdHRoaXMuaGVhZGVycyA9IGV2ZW50O1xyXG5cdFx0dGhpcy51cGRhdGVMaW1pdHMoKTtcclxuXHRcdHRoaXMub25jb25maWd1cmF0aW9uY2hhbmdlLmVtaXQoZXZlbnQpO1xyXG5cclxuXHRcdGlmICh0aGlzLnBlcnNpc3RlbmNlS2V5KSB7XHJcblx0XHRcdHRoaXMuZ2VuZXJhdG9yLnBlcnNpc3RIZWFkZXJzKHRoaXMucGVyc2lzdGVuY2VLZXksIHRoaXMucGVyc2lzdGVuY2VJZCwgdGhpcy5oZWFkZXJzKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG9uUGFnaW5hdGlvbkNoYW5nZShldmVudCkge1xyXG5cdFx0dGhpcy5wYWdlSW5mbyA9IGV2ZW50O1xyXG5cdFx0dGhpcy52aWV3VGFibGUuZXZhbHVhdGVSb3dzKCk7XHJcblx0fVxyXG5cclxuXHR0YWJsZUFjdGlvbihldmVudCkge1xyXG5cdFx0dGhpcy5vbmFjdGlvbi5lbWl0KGV2ZW50KVxyXG5cdH1cclxuXHJcblx0b25Ecm9wKGV2ZW50OkRyb3BFdmVudCl7XHJcblxyXG5cdH1cclxuXHRvbkNlbGxFZGl0KGV2ZW50KXtcclxuXHRcdHRoaXMub25DZWxsQ29udGVudEVkaXQuZW1pdChldmVudCk7XHJcblx0fVxyXG59XHJcbiIsIi8qXHJcbiogUHJvdmlkZXMgcGFnaW5hdGlvbiBvZiBhIGRhdGEgc2V0IGluIGEgdGFibGUuXHJcbiovXHJcbmltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQYWdpbmF0aW9uSW5mbyB7XHJcblx0Y29udGVudFNpemU6IG51bWJlcixcclxuXHRwYWdlU2l6ZTogbnVtYmVyLFxyXG4gICAgbWF4V2lkdGg/OiBzdHJpbmcsXHJcblx0cGFnZXM/OiBudW1iZXIsXHJcblx0ZnJvbT86IG51bWJlcixcclxuXHR0bz86IG51bWJlcixcclxuXHRjdXJyZW50UGFnZT86IG51bWJlcixcclxuICAgIHJlc2V0U2l6ZT86IGJvb2xlYW5cclxufVxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ3RhYmxlLXBhZ2luYXRpb24nLFxyXG5cdHRlbXBsYXRlVXJsOiAnLi9wYWdpbmF0aW9uLmNvbXBvbmVudC5odG1sJyxcclxuXHRzdHlsZVVybHM6IFsnLi9wYWdpbmF0aW9uLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIFBhZ2luYXRpb25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICAgIEBJbnB1dChcInZvY2FidWxhcnlcIilcclxuICAgIHB1YmxpYyB2b2NhYnVsYXJ5ID0ge3NldFNpemU6IFwiXCIsIGZpcnN0UGFnZTogXCJcIiwgbmV4dFBhZ2U6IFwiXCIsIGxhc3RQYWdlOiBcIlwiLCBwcmV2aW91c1BhZ2U6IFwiXCJ9O1xyXG5cclxuICAgIEBJbnB1dChcImluZm9cIilcclxuICAgIGluZm86IFBhZ2luYXRpb25JbmZvID0geyBjb250ZW50U2l6ZTogMCwgcGFnZVNpemU6IDAsIG1heFdpZHRoOiBcIjBcIiB9O1xyXG5cclxuXHRAT3V0cHV0KCdvbmNoYW5nZScpXHJcbiAgICBvbmNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgICBAT3V0cHV0KCdvbnJlYWR5JylcclxuICAgIG9ucmVhZHkgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdG5nT25Jbml0KCkge1xyXG5cdFx0aWYgKCF0aGlzLmluZm8pIHtcclxuXHRcdFx0dGhpcy5pbmZvID0geyBcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRTaXplOiAxMDAwLCBcclxuICAgICAgICAgICAgICAgIHBhZ2VTaXplOiAxMDAwLCBcclxuICAgICAgICAgICAgICAgIHBhZ2VzOiAxLCBcclxuICAgICAgICAgICAgICAgIGZyb206IDAsIFxyXG4gICAgICAgICAgICAgICAgdG86IDEwMDAsIFxyXG4gICAgICAgICAgICAgICAgY3VycmVudFBhZ2U6IDEsIFxyXG4gICAgICAgICAgICAgICAgbWF4V2lkdGg6IFwiMFwiIFxyXG4gICAgICAgICAgICB9O1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMuaW5mby5jb250ZW50U2l6ZSAmJiB0aGlzLmluZm8ucGFnZVNpemUpIHtcclxuXHRcdFx0dGhpcy5pbmZvLnBhZ2VzID0gTWF0aC5jZWlsKHRoaXMuaW5mby5jb250ZW50U2l6ZSAvIHRoaXMuaW5mby5wYWdlU2l6ZSk7XHJcblx0XHRcdHRoaXMuaW5mby5mcm9tID0gMDtcclxuXHRcdFx0dGhpcy5pbmZvLnRvID0gdGhpcy5pbmZvLnBhZ2VTaXplIC0gMTtcclxuXHRcdFx0dGhpcy5pbmZvLmN1cnJlbnRQYWdlID0gMTtcclxuXHRcdCAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVhZHkoKSwgNjYpO1xyXG5cdFx0fVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRXaWR0aCh3aWR0aDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5pbmZvLm1heFdpZHRoID0gd2lkdGggKyBcInB4XCI7XHJcbiAgICB9XHJcblxyXG4gICAgcmVhZHkoKSB7XHJcbiAgICAgICAgdGhpcy5vbnJlYWR5LmVtaXQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaW5mbyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0Rmlyc3QoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5mby5jdXJyZW50UGFnZSA+IDEpIHtcclxuXHRcdCAgICB0aGlzLmluZm8uZnJvbSA9IDA7XHJcblx0XHQgICAgdGhpcy5pbmZvLnRvID0gdGhpcy5pbmZvLmZyb20gKyB0aGlzLmluZm8ucGFnZVNpemUgLSAxO1xyXG5cdFx0ICAgIHRoaXMuaW5mby5jdXJyZW50UGFnZSA9IDE7XHJcbiAgICAgICAgICAgIHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzLmluZm8pO1xyXG4gICAgICAgIH1cclxuICAgfVxyXG5cclxuICAgc2VsZWN0TmV4dCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbmZvLmN1cnJlbnRQYWdlIDwgdGhpcy5pbmZvLnBhZ2VzKSB7XHJcbiBcdFx0dGhpcy5pbmZvLmZyb20gPSB0aGlzLmluZm8udG8gKyAxO1xyXG5cdFx0dGhpcy5pbmZvLnRvID0gdGhpcy5pbmZvLmZyb20gKyB0aGlzLmluZm8ucGFnZVNpemUgLSAxO1xyXG5cdFx0dGhpcy5pbmZvLmN1cnJlbnRQYWdlKys7XHJcbiAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaW5mbyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdFByZXYoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5mby5jdXJyZW50UGFnZSA+IDEpIHtcclxuIFx0XHQgICAgdGhpcy5pbmZvLmZyb20gLT0gdGhpcy5pbmZvLnBhZ2VTaXplO1xyXG5cdFx0ICAgIHRoaXMuaW5mby50byA9IHRoaXMuaW5mby5mcm9tICsgdGhpcy5pbmZvLnBhZ2VTaXplIC0gMTtcclxuXHRcdCAgICB0aGlzLmluZm8uY3VycmVudFBhZ2UtLTtcclxuICAgICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaW5mbyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdExhc3QoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5mby5jdXJyZW50UGFnZSA8IHRoaXMuaW5mby5wYWdlcykge1xyXG5cdFx0ICAgIHRoaXMuaW5mby5mcm9tID0gdGhpcy5pbmZvLnBhZ2VTaXplICogKHRoaXMuaW5mby5wYWdlcyAtIDEpO1xyXG5cdFx0ICAgIHRoaXMuaW5mby50byA9IHRoaXMuaW5mby5mcm9tICsgdGhpcy5pbmZvLnBhZ2VTaXplIC0gMTtcclxuXHRcdCAgICB0aGlzLmluZm8uY3VycmVudFBhZ2UgPSB0aGlzLmluZm8ucGFnZXM7XHJcbiAgICAgICAgICAgIHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzLmluZm8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VDdXJyZW50KHJhbmdlcjogYW55KSB7XHJcbiAgICAgICAgY29uc3QgdiA9IHBhcnNlSW50KCByYW5nZXIudmFsdWUsIDEwICk7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5mby5jdXJyZW50UGFnZSA8IHYgJiYgdiA+IDAgJiYgdiA8IHRoaXMuaW5mby5wYWdlcykge1xyXG5cdFx0ICAgIHRoaXMuaW5mby5mcm9tID0gdiAqICh0aGlzLmluZm8ucGFnZVNpemUgLSAxKTtcclxuXHRcdCAgICB0aGlzLmluZm8udG8gPSB0aGlzLmluZm8uZnJvbSArIHRoaXMuaW5mby5wYWdlU2l6ZSAtIDE7XHJcblx0XHQgICAgdGhpcy5pbmZvLmN1cnJlbnRQYWdlID0gdjtcclxuICAgICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaW5mbyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmFuZ2VyLnZhbHVlID0gdGhpcy5pbmZvLmN1cnJlbnRQYWdlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VTaXplKHNpemVyOiBhbnkpIHtcclxuICAgICAgICBjb25zdCB2ID0gcGFyc2VJbnQoIHNpemVyLnZhbHVlLCAxMCApO1xyXG4gICAgICAgIGlmICh0aGlzLmluZm8uY29udGVudFNpemUgPj0gdiAmJiB2ID4gMSkge1xyXG4gICAgICAgICAgICB0aGlzLmluZm8ucGFnZVNpemUgPSB2O1xyXG4gXHRcdFx0dGhpcy5pbmZvLnBhZ2VzID0gTWF0aC5jZWlsKHRoaXMuaW5mby5jb250ZW50U2l6ZSAvIHYpO1xyXG4gICAgICAgICAgICB0aGlzLmluZm8uZnJvbSA9IDA7XHJcblx0XHRcdHRoaXMuaW5mby50byA9IHRoaXMuaW5mby5wYWdlU2l6ZSAtIDE7XHJcblx0XHRcdHRoaXMuaW5mby5jdXJyZW50UGFnZSA9IDE7XHJcbiAgICAgICAgICAgIHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzLmluZm8pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNpemVyLnZhbHVlID0gdGhpcy5pbmZvLnBhZ2VTaXplO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvKlxyXG4qIFByb3ZpZGVzIGFiaWxpdHkgdG8gY29uZmlndXJlIGRpc3BsYXlpbmcgb2YgdGFibGUgY29sdW1ucy4gQXMgcGVyIGRlZmluaXRpb24gb2YgZWFyY2ggaGVhZGVyIGNvbXBvbmVudCxcclxuKiBhIGNvbHVtbiBjb3VsZCBiZSBoaWRkZW4uXHJcbiovXHJcbmltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuXHRzZWxlY3RvcjogJ3RhYmxlLWNvbmZpZ3VyYXRpb24nLFxyXG5cdHRlbXBsYXRlVXJsOiAnLi9jb25maWd1cmF0aW9uLmNvbXBvbmVudC5odG1sJyxcclxuXHRzdHlsZVVybHM6IFsnLi9jb25maWd1cmF0aW9uLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIENvbmZpZ3VyYXRpb25Db21wb25lbnQge1xyXG4gICAgc2hvd0NvbmZpZ3VyYXRpb25WaWV3OiBib29sZWFuO1xyXG5cclxuXHRASW5wdXQoXCJ0aXRsZVwiKVxyXG5cdHB1YmxpYyB0aXRsZTogc3RyaW5nO1xyXG5cclxuXHRASW5wdXQoXCJhY3Rpb25cIilcclxuXHRwdWJsaWMgYWN0aW9uOiBzdHJpbmc7XHJcblxyXG5cdEBJbnB1dChcInByaW50VGFibGVcIilcclxuXHRwdWJsaWMgcHJpbnRUYWJsZTogc3RyaW5nO1xyXG5cdFxyXG5cdEBJbnB1dChcImhlYWRlcnNcIilcclxuXHRwdWJsaWMgaGVhZGVyczogYW55W107XHJcblxyXG5cdEBJbnB1dChcImNvbmZpZ0FkZG9uXCIpXHJcblx0cHVibGljIGNvbmZpZ0FkZG9uOiBhbnk7XHJcblxyXG5cdEBPdXRwdXQoJ29uY2hhbmdlJylcclxuXHRwcml2YXRlIG9uY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHRAT3V0cHV0KCdvbnByaW50JylcclxuXHRwcml2YXRlIG9ucHJpbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdHJlY29uZmlndXJlKGl0ZW0sIGhlYWRlcikge1xyXG4gICAgICAgIGhlYWRlci5wcmVzZW50ID0gaXRlbS5jaGVja2VkO1xyXG5cdFx0dGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaGVhZGVycyk7XHJcblx0fVxyXG5cclxuXHRlbmFibGVGaWx0ZXIoaXRlbSwgaGVhZGVyKSB7XHJcbiAgICAgICAgaWYgKGhlYWRlci5maWx0ZXIgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRoZWFkZXIuZmlsdGVyID0gXCJcIjtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRlbGV0ZSBoZWFkZXIuZmlsdGVyO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaGVhZGVycyk7XHJcblx0fVxyXG5cclxuXHRwcmludChldmVudCkge1xyXG5cdFx0dGhpcy5vbnByaW50LmVtaXQodHJ1ZSk7XHJcblx0fVxyXG5cclxuICAgIGtleXVwKGV2ZW50KSB7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG4gICAgICAgIGlmIChjb2RlID09PSAxMykge1xyXG5cdFx0XHRldmVudC50YXJnZXQuY2xpY2soKTtcclxuXHRcdH1cclxuICAgIH1cclxufVxyXG4iLCIvKlxuKiBQcm92aWRlcyByZW5kZXJpbmcgb2YgYSB0YWJsZSB3aGljaCBpcyB1c2luZyB0aGUgZ2l2ZW4gRmxleGlibGVUYWJsZUhlYWRlciBzZXQgaW5cbiogb3JkZXIgdG8gdGFidWxhdGUgdGhlIGdpdmVuIGRhdGEuIEFzIHBlciBkZWZpbml0aW9uIG9mIGVhcmNoIGhlYWRlciBjb21wb25lbnQsXG4qIGEgY29sdW1uIGNvdWxkIGJlIGhpZGRlbiwgc29ydGFibGUsIG9yIGRyYWdnYWJsZS4gRWFjaCB0YWJsZSByb3cgY2FuIGV4cGFuZC9jb2xsYXBzZVxuKiBvciByZXNwb25kIHRvIGEgY2xpY2sgYWN0aW9uLlxuKi9cbmltcG9ydCB7XG4gICAgQ29tcG9uZW50LFxuXHRJbnB1dCxcblx0T3V0cHV0LFxuXHRWaWV3Q2hpbGQsXG5cdFZpZXdDb250YWluZXJSZWYsXG5cdE9uSW5pdCxcblx0UmVuZGVyZXIsXG5cdEVsZW1lbnRSZWYsXG5cdEV2ZW50RW1pdHRlclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRHJvcEV2ZW50LCBEcmFnRXZlbnQgfSBmcm9tICdAc2VkZWgvZHJhZy1lbmFibGVkJztcbmltcG9ydCB7IFRhYmxlVmlld0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90YWJsZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgVGFibGVIZWFkZXJzR2VuZXJhdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlLWhlYWRlcnMtZ2VuZXJhdG9yJztcblxuQENvbXBvbmVudCh7XG5cdHNlbGVjdG9yOiAnbG9jay10YWJsZScsXG5cdHRlbXBsYXRlVXJsOiAnLi9sb2NrLnRhYmxlLmNvbXBvbmVudC5odG1sJyxcblx0c3R5bGVVcmxzOiBbJy4vbG9jay50YWJsZS5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIExvY2tUYWJsZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cblx0bG9ja2VkSGVhZGVyczphbnk7XG5cdHVubG9ja2VkSGVhZGVyczphbnk7XG5cdGZpbHRlcmVkSXRlbXMgPSBbXTtcblxuICAgIEBJbnB1dChcInZvY2FidWxhcnlcIilcbiAgICBwdWJsaWMgdm9jYWJ1bGFyeSA9IHtcblx0XHRjb25maWd1cmVUYWJsZTogXCJDb25maWd1cmUgVGFibGVcIixcblx0XHRjb25maWd1cmVDb2x1bW5zOiBcIkNvbmZpZ3VyZSBDb2x1bW5zXCIsXG5cdFx0Y2xpY2tTb3J0OiBcIkNsaWNrIHRvIFNvcnRcIixcblx0XHRzZXRTaXplOiBcIlNldCBTaXplXCIsXG5cdFx0Zmlyc3RQYWdlOiBcIkZpcnN0XCIsXG5cdFx0bGFzdFBhZ2U6IFwiTGFzdFwiLFxuXHRcdHByZXZpb3VzUGFnZTogXCJQcmV2aW91c1wiXG5cdH07XG5cbiAgICBASW5wdXQoXCJwZXJzaXN0ZW5jZUlkXCIpXG4gICAgcHVibGljIHBlcnNpc3RlbmNlSWQ6IHN0cmluZztcblxuICAgIEBJbnB1dChcInBlcnNpc3RlbmNlS2V5XCIpXG4gICAgcHVibGljIHBlcnNpc3RlbmNlS2V5OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoXCJjYXB0aW9uXCIpXG4gICAgcHVibGljIGNhcHRpb246IHN0cmluZztcblxuICAgIEBJbnB1dChcImFjdGlvblwiKVxuICAgIHB1YmxpYyBhY3Rpb246IHN0cmluZztcblxuICAgIEBJbnB1dChcImFjdGlvbktleXNcIilcbiAgICBwdWJsaWMgYWN0aW9uS2V5cztcblxuICAgIEBJbnB1dChcInRhYmxlQ2xhc3NcIilcbiAgICBwdWJsaWMgdGFibGVDbGFzcyA9ICdkZWZhdWx0LWZsZXhpYmxlLXRhYmxlJztcblxuXHRASW5wdXQoXCJoZWFkZXJzXCIpXG5cdHB1YmxpYyBoZWFkZXJzOiBhbnlbXTtcblxuXHRASW5wdXQoXCJpdGVtc1wiKVxuXHRwdWJsaWMgaXRlbXM6IGFueVtdO1xuXG5cdEBJbnB1dChcInBhZ2VJbmZvXCIpXG5cdHB1YmxpYyBwYWdlSW5mbzogYW55O1xuXG5cdEBJbnB1dChcInRhYmxlSW5mb1wiKVxuXHRwdWJsaWMgdGFibGVJbmZvOiBhbnk7XG5cbiAgICBASW5wdXQoXCJjb25maWd1cmFibGVcIilcbiAgICBwdWJsaWMgY29uZmlndXJhYmxlOiBib29sZWFuO1xuXG5cdEBJbnB1dChcImNvbmZpZ0FkZG9uXCIpXG5cdHB1YmxpYyBjb25maWdBZGRvbjogYW55O1xuXG5cdEBJbnB1dChcImVuYWJsZUZpbHRlcmluZ1wiKVxuICAgIHB1YmxpYyBlbmFibGVGaWx0ZXJpbmc6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoXCJlbmFibGVJbmRleGluZ1wiKVxuICAgIHB1YmxpYyBlbmFibGVJbmRleGluZzogYm9vbGVhbjtcblxuICAgIEBJbnB1dChcImZpbHRlcndoaWxldHlwaW5nXCIpXG4gICAgcHVibGljIGZpbHRlcndoaWxldHlwaW5nOiBib29sZWFuO1xuXG5cblx0QE91dHB1dCgnb25hY3Rpb24nKVxuXHRwcml2YXRlIG9uYWN0aW9uID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG5cdEBPdXRwdXQoJ29uQ2VsbENvbnRlbnRFZGl0Jylcblx0cHJpdmF0ZSBvbkNlbGxDb250ZW50RWRpdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuXHRAT3V0cHV0KCdvbmNvbmZpZ3VyYXRpb25jaGFuZ2UnKVxuXHRwcml2YXRlIG9uY29uZmlndXJhdGlvbmNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuXHRAVmlld0NoaWxkKCdsb2NrZWRUYWJsZScpXG5cdHByaXZhdGUgbG9ja2VkVGFibGU6IFRhYmxlVmlld0NvbXBvbmVudDtcblxuXHRAVmlld0NoaWxkKCd1bmxvY2tlZFRhYmxlJylcblx0cHJpdmF0ZSB1bmxvY2tlZFRhYmxlOiBUYWJsZVZpZXdDb21wb25lbnQ7XG5cbiAgICBzY3JvbGwoZXZlbnQpIHtcblx0XHR0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRTdHlsZShcblx0XHRcdFx0dGhpcy5sb2NrZWRUYWJsZS5lbC5uYXRpdmVFbGVtZW50LFxuXHRcdFx0XHRcImxlZnRcIixcblx0XHRcdFx0ZXZlbnQudGFyZ2V0LnNjcm9sbExlZnQrXCJweFwiKTtcblx0fVxuXG4gICAgY29uc3RydWN0b3IoXG5cdFx0cHJpdmF0ZSBnZW5lcmF0b3I6IFRhYmxlSGVhZGVyc0dlbmVyYXRvcixcblx0XHRwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlclxuXHQpIHt9XG5cblx0bmdPbkluaXQoKSB7XG5cdFx0aWYgKHRoaXMucGFnZUluZm8pIHtcblx0XHRcdGlmICghdGhpcy5wYWdlSW5mby50bykge1xuXHRcdFx0XHR0aGlzLnBhZ2VJbmZvLnRvID0gdGhpcy5wYWdlSW5mby5wYWdlU2l6ZTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5wYWdlSW5mbyA9IHtcbiAgICAgICAgICAgICAgICBjb250ZW50U2l6ZTogMTAwMDAwLFxuICAgICAgICAgICAgICAgIHBhZ2VTaXplOiAxMDAwMDAsXG4gICAgICAgICAgICAgICAgcGFnZXM6IDEsXG4gICAgICAgICAgICAgICAgZnJvbTogMCxcbiAgICAgICAgICAgICAgICB0bzogMTAwMDAwLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRQYWdlOiAxLFxuICAgICAgICAgICAgICAgIG1heFdpZHRoOiBcIjBcIlxuICAgICAgICAgICAgfTtcblx0XHR9XG5cdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcblx0XHRcdGNvbnN0IGhlYWRlcnM6YW55ID0gdGhpcy5nZW5lcmF0b3IucmV0cmVpdmVIZWFkZXJzKHRoaXMucGVyc2lzdGVuY2VLZXksIHRoaXMucGVyc2lzdGVuY2VJZCk7XG5cblx0XHRcdGlmIChoZWFkZXJzKSB7XG5cdFx0XHRcdHRoaXMuaGVhZGVycyA9IGhlYWRlcnM7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICghdGhpcy5oZWFkZXJzKSB7XG5cdFx0XHR0aGlzLmhlYWRlcnMgPSB0aGlzLmdlbmVyYXRvci5nZW5lcmF0ZUhlYWRlcnNGb3IodGhpcy5pdGVtc1swXSxcIlwiLCA1LCB0aGlzLmVuYWJsZUZpbHRlcmluZyk7XG5cdFx0XHRpZiAodGhpcy5wZXJzaXN0ZW5jZUtleSkge1xuXHRcdFx0XHR0aGlzLmdlbmVyYXRvci5wZXJzaXN0SGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQsIHRoaXMuaGVhZGVycyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IHRoaXMuaXRlbXM7XG5cdFx0dGhpcy5wYWdlSW5mby5jb250ZW50U2l6ZSA9IHRoaXMuaXRlbXMubGVuZ3RoO1xuXHRcdFxuXHRcdHRoaXMucmVjb25maWd1cmUodGhpcy5oZWFkZXJzKTtcblxuXHR9XG5cblx0ZXZhbHVhdGVQb3NpdGlvbmluZygpIHtcblx0XHR0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRTdHlsZShcblx0XHRcdHRoaXMudW5sb2NrZWRUYWJsZS5lbC5uYXRpdmVFbGVtZW50LFxuXHRcdFx0XCJtYXJnaW4tbGVmdFwiLFxuXHRcdFx0dGhpcy5sb2NrZWRUYWJsZS5vZmZzZXRXaWR0aCgpK1wicHhcIik7XG5cdH1cblxuXHRyZWNvbmZpZ3VyZShldmVudCkge1xuXHRcdHRoaXMuaGVhZGVycyA9IGV2ZW50O1xuXHRcdHRoaXMubG9ja2VkSGVhZGVycyA9IHRoaXMuaGVhZGVycy5maWx0ZXIoIChpdGVtKSA9PiBpdGVtLmxvY2tlZCA9PT0gdHJ1ZSAmJiBpdGVtLnByZXNlbnQpO1xuXHRcdHRoaXMudW5sb2NrZWRIZWFkZXJzID0gdGhpcy5oZWFkZXJzLmZpbHRlciggKGl0ZW0pID0+IGl0ZW0ubG9ja2VkICE9PSB0cnVlICAmJiBpdGVtLnByZXNlbnQpO1x0XG5cdFx0dGhpcy5vbmNvbmZpZ3VyYXRpb25jaGFuZ2UuZW1pdChldmVudCk7XG5cblx0XHRpZiAodGhpcy5wZXJzaXN0ZW5jZUtleSkge1xuXHRcdFx0dGhpcy5nZW5lcmF0b3IucGVyc2lzdEhlYWRlcnModGhpcy5wZXJzaXN0ZW5jZUtleSwgdGhpcy5wZXJzaXN0ZW5jZUlkLCB0aGlzLmhlYWRlcnMpO1xuXHRcdH1cblx0XHRzZXRUaW1lb3V0KHRoaXMuZXZhbHVhdGVQb3NpdGlvbmluZy5iaW5kKHRoaXMpLDExMSk7XG5cdH1cblxuXHRvbmxvY2soZXZlbnQpIHtcblx0XHR0aGlzLmxvY2tlZEhlYWRlcnMgPSB0aGlzLmhlYWRlcnMuZmlsdGVyKCAoaXRlbSkgPT4gaXRlbS5sb2NrZWQgPT09IHRydWUgJiYgaXRlbS5wcmVzZW50KTtcblx0XHR0aGlzLnVubG9ja2VkSGVhZGVycyA9IHRoaXMuaGVhZGVycy5maWx0ZXIoIChpdGVtKSA9PiBpdGVtLmxvY2tlZCAhPT0gdHJ1ZSAgJiYgaXRlbS5wcmVzZW50KTtcdFxuXHRcdHRoaXMub25jb25maWd1cmF0aW9uY2hhbmdlLmVtaXQoZXZlbnQpO1xuXG5cdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcblx0XHRcdHRoaXMuZ2VuZXJhdG9yLnBlcnNpc3RIZWFkZXJzKHRoaXMucGVyc2lzdGVuY2VLZXksIHRoaXMucGVyc2lzdGVuY2VJZCwgdGhpcy5oZWFkZXJzKTtcblx0XHR9XG5cdFx0c2V0VGltZW91dCh0aGlzLmV2YWx1YXRlUG9zaXRpb25pbmcuYmluZCh0aGlzKSwxMTEpO1xuXHR9XG5cdGNoYW5nZUxvY2tlZFRhYmxlRmlsdGVyZWRJdGVtcyhldmVudCkge1xuXHRcdGlmICh0aGlzLmxvY2tlZFRhYmxlKSB7XG5cdFx0XHR0aGlzLmxvY2tlZFRhYmxlLmZpbHRlcmVkSXRlbXMgPSBldmVudDtcblx0XHRcdHRoaXMubG9ja2VkVGFibGUuaW5pdFZpc2libGVSb3dzKCk7XG5cdFx0fVxuXHR9XG5cdGNoYW5nZVVubG9ja2VkVGFibGVGaWx0ZXJlZEl0ZW1zKGV2ZW50KSB7XG5cdFx0aWYgKHRoaXMudW5sb2NrZWRUYWJsZSkge1xuXHRcdFx0dGhpcy51bmxvY2tlZFRhYmxlLmZpbHRlcmVkSXRlbXMgPSBldmVudDtcblx0XHRcdHRoaXMudW5sb2NrZWRUYWJsZS5pbml0VmlzaWJsZVJvd3MoKTtcblx0XHR9XG5cdH1cblx0b25QYWdpbmF0aW9uQ2hhbmdlKGV2ZW50KSB7XG5cdFx0dGhpcy5wYWdlSW5mbyA9IGV2ZW50O1xuXHRcdHRoaXMudW5sb2NrZWRUYWJsZS5ldmFsdWF0ZVJvd3MoKTtcblx0fVxuXG5cdHRhYmxlQWN0aW9uKGV2ZW50KSB7XG5cdFx0dGhpcy5vbmFjdGlvbi5lbWl0KGV2ZW50KVxuXHR9XG5cblx0b25Ecm9wKGV2ZW50OkRyb3BFdmVudCl7XG5cblx0fVxuXHRvbkNlbGxFZGl0KGV2ZW50KXtcblx0XHR0aGlzLm9uQ2VsbENvbnRlbnRFZGl0LmVtaXQoZXZlbnQpO1xuXHR9XG59XG5cbiIsIi8qXHJcbiogUHJvdmlkZXMgcmVuZGVyaW5nIG9mIGZsZXhpYmxlIHRhYmxlIGluIGEgbGF6eSBsb2FkIGZhc2hpb24uXHJcbiovXHJcbmltcG9ydCB7IE5nTW9kdWxlLCBDVVNUT01fRUxFTUVOVFNfU0NIRU1BIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7SW50b1BpcGVNb2R1bGV9IGZyb20gJ0BzZWRlaC9pbnRvLXBpcGVzJztcclxuaW1wb3J0IHsgRHJhZ0Ryb3BNb2R1bGUgfSBmcm9tICdAc2VkZWgvZHJhZy1lbmFibGVkJztcclxuXHJcbmltcG9ydCB7IFBhZ2luYXRpb25Db21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvcGFnaW5hdGlvbi5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDb25maWd1cmF0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2NvbmZpZ3VyYXRpb24uY29tcG9uZW50JztcclxuaW1wb3J0IHsgVGFibGVWaWV3Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlLmNvbXBvbmVudCc7XHJcblxyXG5pbXBvcnQgeyBUYWJsZUhlYWRlcnNHZW5lcmF0b3IgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUtaGVhZGVycy1nZW5lcmF0b3InO1xyXG5pbXBvcnQgeyBGbGV4aWJsZVRhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi9mbGV4aWJsZS50YWJsZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBMb2NrVGFibGVDb21wb25lbnQgfSBmcm9tICcuL2xvY2sudGFibGUuY29tcG9uZW50JztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbXHJcbiAgICAgICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgICAgIERyYWdEcm9wTW9kdWxlLFxyXG4gICAgICAgIEludG9QaXBlTW9kdWxlXHJcbiAgICBdLFxyXG4gICAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICAgICAgRmxleGlibGVUYWJsZUNvbXBvbmVudCxcclxuICAgICAgICBMb2NrVGFibGVDb21wb25lbnQsXHJcbiAgICAgICAgQ29uZmlndXJhdGlvbkNvbXBvbmVudCxcclxuICAgICAgICBQYWdpbmF0aW9uQ29tcG9uZW50LFxyXG4gICAgICAgIFRhYmxlVmlld0NvbXBvbmVudFxyXG4gICAgXSxcclxuICAgIGV4cG9ydHM6IFtcclxuICAgICAgICBGbGV4aWJsZVRhYmxlQ29tcG9uZW50LFxyXG4gICAgICAgIExvY2tUYWJsZUNvbXBvbmVudFxyXG4gICAgXSxcclxuICAgIGVudHJ5Q29tcG9uZW50czogW1xyXG4gICAgXSxcclxuICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIFRhYmxlSGVhZGVyc0dlbmVyYXRvclxyXG4gICAgXSxcclxuICAgIHNjaGVtYXM6IFtDVVNUT01fRUxFTUVOVFNfU0NIRU1BXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIEZsZXhpYmxlVGFibGVNb2R1bGUge31cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFpQkU7dUJBRmtCLEVBQUU7S0FHbkI7Ozs7Ozs7O0lBRUQsa0JBQWtCLENBQUMsSUFBUSxFQUFFLElBQVksRUFBRSxVQUFrQixFQUFFLGdCQUF5QjtRQUV0RixJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7WUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUUsQ0FBQyxHQUFHOztnQkFDekIsTUFBTSxTQUFTLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztnQkFFM0QsSUFBSSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLElBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUSxJQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsRUFBRTs7b0JBQ3BHLE1BQU0sTUFBTSxHQUFRO3dCQUNsQixHQUFHLEVBQUUsU0FBUzt3QkFDZCxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUM7d0JBQ2hDLFFBQVEsRUFBRSxJQUFJO3dCQUNkLFFBQVEsRUFBRSxJQUFJO3dCQUNkLE9B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QUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNuRjtpQkFBTSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7Z0JBQy9CLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNuRjtpQkFBTSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7Z0JBQy9CLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNuRjtpQkFBTSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7Z0JBQy9CLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssVUFBVSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNyRjtpQkFBTSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFOztnQkFDdEUsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsTUFBTSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFBO2FBQzdDO2lCQUFNLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMs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QUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDakM7S0FDTDs7OztJQUVELFVBQVU7UUFDTCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2xELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNsQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDN0I7S0FDSjs7OztJQUVELFVBQVU7UUFDTixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsRUFBRTtZQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNsQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDakM7S0FDSjs7OztJQUVELFVBQVU7UUFDTixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQy9DLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztZQUN2RCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUNsQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDakM7S0FDSjs7Ozs7SUFFRCxhQUFhLENBQUMsTUFBVzs7UUFDckIsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFFLENBQUM7UUFDdkMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDakUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztZQUN2RCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2pDO2FBQU07WUFDSCxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQ3hD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