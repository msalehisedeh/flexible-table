/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, ViewChild, ViewContainerRef, EventEmitter, ElementRef } from '@angular/core';
/**
 * @record
 */
export function FlexibleTableHeader() { }
/** @type {?} */
FlexibleTableHeader.prototype.key;
/** @type {?} */
FlexibleTableHeader.prototype.value;
/** @type {?} */
FlexibleTableHeader.prototype.present;
/** @type {?|undefined} */
FlexibleTableHeader.prototype.width;
/** @type {?|undefined} */
FlexibleTableHeader.prototype.minwidth;
/** @type {?|undefined} */
FlexibleTableHeader.prototype.format;
/** @type {?|undefined} */
FlexibleTableHeader.prototype.filter;
/** @type {?|undefined} */
FlexibleTableHeader.prototype.dragable;
/** @type {?|undefined} */
FlexibleTableHeader.prototype.sortable;
/** @type {?|undefined} */
FlexibleTableHeader.prototype.class;
/** @type {?|undefined} */
FlexibleTableHeader.prototype.locked;
/** @type {?|undefined} */
FlexibleTableHeader.prototype.ascending;
/** @type {?|undefined} */
FlexibleTableHeader.prototype.descending;
export class TableViewComponent {
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
if (false) {
    /** @type {?} */
    TableViewComponent.prototype.dragging;
    /** @type {?} */
    TableViewComponent.prototype.printMode;
    /** @type {?} */
    TableViewComponent.prototype.filteredItems;
    /** @type {?} */
    TableViewComponent.prototype.filteringTimerId;
    /** @type {?} */
    TableViewComponent.prototype.vocabulary;
    /** @type {?} */
    TableViewComponent.prototype.lockable;
    /** @type {?} */
    TableViewComponent.prototype.caption;
    /** @type {?} */
    TableViewComponent.prototype.action;
    /** @type {?} */
    TableViewComponent.prototype.pageInfo;
    /** @type {?} */
    TableViewComponent.prototype.actionKeys;
    /** @type {?} */
    TableViewComponent.prototype.tableClass;
    /** @type {?} */
    TableViewComponent.prototype.headers;
    /** @type {?} */
    TableViewComponent.prototype.items;
    /** @type {?} */
    TableViewComponent.prototype.tableInfo;
    /** @type {?} */
    TableViewComponent.prototype.enableIndexing;
    /** @type {?} */
    TableViewComponent.prototype.enableFiltering;
    /** @type {?} */
    TableViewComponent.prototype.rowDetailer;
    /** @type {?} */
    TableViewComponent.prototype.expandable;
    /** @type {?} */
    TableViewComponent.prototype.expandIf;
    /** @type {?} */
    TableViewComponent.prototype.filterwhiletyping;
    /** @type {?} */
    TableViewComponent.prototype.rowDetailerHeaders;
    /** @type {?} */
    TableViewComponent.prototype.onaction;
    /** @type {?} */
    TableViewComponent.prototype.onchange;
    /** @type {?} */
    TableViewComponent.prototype.onfilter;
    /** @type {?} */
    TableViewComponent.prototype.onCellContentEdit;
    /** @type {?} */
    TableViewComponent.prototype.table;
    /** @type {?} */
    TableViewComponent.prototype.el;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vZmxleGlibGUtdGFibGUvIiwic291cmNlcyI6WyJzcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFNQSxPQUFPLEVBQ0gsU0FBUyxFQUNaLEtBQUssRUFDTCxNQUFNLEVBQ04sU0FBUyxFQUNULGdCQUFnQixFQUdoQixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sZUFBZSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkJ2QixNQUFNOzs7O0lBK0VGLFlBQW1CLEVBQWE7UUFBYixPQUFFLEdBQUYsRUFBRSxDQUFXO3dCQTlFeEIsS0FBSzt5QkFDSixLQUFLOzZCQUNELEVBQUU7MEJBSUs7WUFDdEIsY0FBYyxFQUFFLGlCQUFpQjtZQUNqQyxnQkFBZ0IsRUFBRSxtQkFBbUI7WUFDckMsU0FBUyxFQUFFLGVBQWU7WUFDMUIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsU0FBUyxFQUFFLE9BQU87WUFDbEIsUUFBUSxFQUFFLE1BQU07WUFDaEIsWUFBWSxFQUFFLFVBQVU7U0FDeEI7MEJBa0JzQix3QkFBd0I7d0JBaUM1QixJQUFJLFlBQVksRUFBRTt3QkFHbEIsSUFBSSxZQUFZLEVBQUU7d0JBR2xCLElBQUksWUFBWSxFQUFFO2lDQUdULElBQUksWUFBWSxFQUFFO0tBSVA7Ozs7O0lBRy9CLGdCQUFnQixDQUFDLEVBQVU7O1FBQzVCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDOztRQUMvQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDdEMsRUFBRSxDQUFDLENBQUMsSUFBSSxD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QyxZQUFZO3lCQUdsQixLQUFLLFNBQUMsWUFBWTtzQkFHckIsS0FBSyxTQUFDLFNBQVM7b0JBR2YsS0FBSyxTQUFDLE9BQU87d0JBR2IsS0FBSyxTQUFDLFdBQVc7NkJBR2QsS0FBSyxTQUFDLGdCQUFnQjs4QkFHdEIsS0FBSyxTQUFDLGlCQUFpQjswQkFHdkIsS0FBSyxTQUFDLGFBQWE7eUJBR25CLEtBQUssU0FBQyxZQUFZO3VCQUdsQixLQUFLLFNBQUMsVUFBVTtnQ0FHaEIsS0FBSyxTQUFDLG1CQUFtQjtpQ0FHekIsS0FBSyxTQUFDLG9CQUFvQjt1QkFHN0IsTUFBTSxTQUFDLFVBQVU7dUJBR2pCLE1BQU0sU0FBQyxVQUFVO3VCQUdqQixNQUFNLFNBQUMsVUFBVTtnQ0FHakIsTUFBTSxTQUFDLG1CQUFtQjtvQkFHMUIsU0FBUyxTQUFDLFVBQVUsRUFBRSxFQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiogUHJvdmlkZXMgcmVuZGVyaW5nIG9mIGEgdGFibGUgd2hpY2ggaXMgdXNpbmcgdGhlIGdpdmVuIEZsZXhpYmxlVGFibGVIZWFkZXIgc2V0IGluXHJcbiogb3JkZXIgdG8gdGFidWxhdGUgdGhlIGdpdmVuIGRhdGEuIEFzIHBlciBkZWZpbml0aW9uIG9mIGVhcmNoIGhlYWRlciBjb21wb25lbnQsXHJcbiogYSBjb2x1bW4gY291bGQgYmUgaGlkZGVuLCBzb3J0YWJsZSwgb3IgZHJhZ2dhYmxlLiBFYWNoIHRhYmxlIHJvdyBjYW4gZXhwYW5kL2NvbGxhcHNlXHJcbiogb3IgcmVzcG9uZCB0byBhIGNsaWNrIGFjdGlvbi5cclxuKi9cclxuaW1wb3J0IHtcclxuICAgIENvbXBvbmVudCxcclxuXHRJbnB1dCxcclxuXHRPdXRwdXQsXHJcblx0Vmlld0NoaWxkLFxyXG5cdFZpZXdDb250YWluZXJSZWYsXHJcblx0T25Jbml0LFxyXG5cdE9uQ2hhbmdlcyxcclxuXHRFdmVudEVtaXR0ZXIsXHJcblx0RWxlbWVudFJlZlxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgRHJvcEV2ZW50LCBEcmFnRXZlbnQgfSBmcm9tICdkcmFnLWVuYWJsZWQnO1xyXG5pbXBvcnQgeyBUaW1lb3V0cyB9IGZyb20gJy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AdHlwZXMvc2VsZW5pdW0td2ViZHJpdmVyJztcclxuaW1wb3J0IHsgVGltZSB9IGZyb20gJy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AYW5ndWxhci9jb21tb24nO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBGbGV4aWJsZVRhYmxlSGVhZGVyIHtcclxuXHRrZXk6IHN0cmluZyxcclxuXHR2YWx1ZTogc3RyaW5nLFxyXG5cdHByZXNlbnQ6IGJvb2xlYW4sXHJcblx0d2lkdGg/OiBzdHJpbmcsXHJcblx0bWlud2lkdGg/OiBzdHJpbmcsXHJcblx0Zm9ybWF0Pzogc3RyaW5nLFxyXG5cdGZpbHRlcj86IHN0cmluZyxcclxuXHRkcmFnYWJsZT86IGJvb2xlYW4sXHJcblx0c29ydGFibGU/OiBib29sZWFuLFxyXG5cdGNsYXNzPzpzdHJpbmcsXHJcblx0bG9ja2VkPzpib29sZWFuLFxyXG5cdGFzY2VuZGluZz86IGJvb2xlYW4sXHJcblx0ZGVzY2VuZGluZz86IGJvb2xlYW5cclxufVxyXG5cclxuQENvbXBvbmVudCh7XHJcblx0c2VsZWN0b3I6ICd0YWJsZS12aWV3JyxcclxuXHR0ZW1wbGF0ZVVybDogJy4vdGFibGUuY29tcG9uZW50Lmh0bWwnLFxyXG5cdHN0eWxlVXJsczogWycuL3RhYmxlLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIFRhYmxlVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcclxuXHRkcmFnZ2luZyA9IGZhbHNlO1xyXG5cdHByaW50TW9kZSA9IGZhbHNlO1xyXG5cdGZpbHRlcmVkSXRlbXMgPSBbXTtcclxuXHRmaWx0ZXJpbmdUaW1lcklkOiBhbnk7XHJcblxyXG4gICAgQElucHV0KFwidm9jYWJ1bGFyeVwiKVxyXG4gICAgcHVibGljIHZvY2FidWxhcnkgPSB7XHJcblx0XHRjb25maWd1cmVUYWJsZTogXCJDb25maWd1cmUgVGFibGVcIixcclxuXHRcdGNvbmZpZ3VyZUNvbHVtbnM6IFwiQ29uZmlndXJlIENvbHVtbnNcIixcclxuXHRcdGNsaWNrU29ydDogXCJDbGljayB0byBTb3J0XCIsXHJcblx0XHRzZXRTaXplOiBcIlNldCBTaXplXCIsXHJcblx0XHRmaXJzdFBhZ2U6IFwiRmlyc3RcIixcclxuXHRcdGxhc3RQYWdlOiBcIkxhc3RcIixcclxuXHRcdHByZXZpb3VzUGFnZTogXCJQcmV2aW91c1wiXHJcblx0fTtcclxuXHJcblx0QElucHV0KFwibG9ja2FibGVcIilcclxuXHRsb2NrYWJsZTpib29sZWFuO1xyXG5cclxuXHRASW5wdXQoXCJjYXB0aW9uXCIpXHJcbiAgICBwdWJsaWMgY2FwdGlvbjogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dChcImFjdGlvblwiKVxyXG4gICAgcHVibGljIGFjdGlvbjogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dChcInBhZ2VJbmZvXCIpXHJcbiAgICBwdWJsaWMgcGFnZUluZm87XHJcblxyXG4gICAgQElucHV0KFwiYWN0aW9uS2V5c1wiKVxyXG4gICAgcHVibGljIGFjdGlvbktleXM7XHJcblxyXG4gICAgQElucHV0KFwidGFibGVDbGFzc1wiKVxyXG4gICAgcHVibGljIHRhYmxlQ2xhc3MgPSAnZGVmYXVsdC1mbGV4aWJsZS10YWJsZSc7XHJcblxyXG5cdEBJbnB1dChcImhlYWRlcnNcIilcclxuXHRwdWJsaWMgaGVhZGVyczogYW55W107XHJcblxyXG5cdEBJbnB1dChcIml0ZW1zXCIpXHJcblx0cHVibGljIGl0ZW1zOiBhbnlbXTtcclxuXHJcblx0QElucHV0KFwidGFibGVJbmZvXCIpXHJcblx0cHVibGljIHRhYmxlSW5mbzogYW55O1xyXG5cclxuICAgIEBJbnB1dChcImVuYWJsZUluZGV4aW5nXCIpXHJcbiAgICBwdWJsaWMgZW5hYmxlSW5kZXhpbmc6IGJvb2xlYW47XHJcblxyXG4gICAgQElucHV0KFwiZW5hYmxlRmlsdGVyaW5nXCIpXHJcbiAgICBwdWJsaWMgZW5hYmxlRmlsdGVyaW5nOiBib29sZWFuO1xyXG5cclxuICAgIEBJbnB1dChcInJvd0RldGFpbGVyXCIpXHJcbiAgICBwdWJsaWMgcm93RGV0YWlsZXI6IGFueTtcclxuXHJcbiAgICBASW5wdXQoXCJleHBhbmRhYmxlXCIpXHJcbiAgICBwdWJsaWMgZXhwYW5kYWJsZTogYW55O1xyXG5cclxuICAgIEBJbnB1dChcImV4cGFuZElmXCIpXHJcbiAgICBwdWJsaWMgZXhwYW5kSWY6IGJvb2xlYW47XHJcblxyXG4gICAgQElucHV0KFwiZmlsdGVyd2hpbGV0eXBpbmdcIilcclxuICAgIHB1YmxpYyBmaWx0ZXJ3aGlsZXR5cGluZzogYm9vbGVhbjtcclxuXHJcbiAgICBASW5wdXQoXCJyb3dEZXRhaWxlckhlYWRlcnNcIilcclxuICAgIHB1YmxpYyByb3dEZXRhaWxlckhlYWRlcnM6IGFueTtcclxuXHJcblx0QE91dHB1dCgnb25hY3Rpb24nKVxyXG5cdHByaXZhdGUgb25hY3Rpb24gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBPdXRwdXQoJ29uY2hhbmdlJylcclxuXHRwcml2YXRlIG9uY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHRAT3V0cHV0KCdvbmZpbHRlcicpXHJcblx0cHJpdmF0ZSBvbmZpbHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0QE91dHB1dCgnb25DZWxsQ29udGVudEVkaXQnKVxyXG5cdHByaXZhdGUgb25DZWxsQ29udGVudEVkaXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBWaWV3Q2hpbGQoJ2ZsZXhpYmxlJywge3JlYWQ6IFZpZXdDb250YWluZXJSZWZ9KSBwcml2YXRlIHRhYmxlOiBWaWV3Q29udGFpbmVyUmVmO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDpFbGVtZW50UmVmKSB7fVxyXG5cclxuXHJcblx0cHJpdmF0ZSBmaW5kQ29sdW1uV2l0aElEKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBsaXN0ID0gdGhpcy5oZWFkZXJDb2x1bW5FbGVtZW50cygpO1xyXG5cdFx0bGV0IGNvbHVtbiA9IG51bGw7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKGxpc3RbaV0uZ2V0QXR0cmlidXRlKFwiaWRcIikgPT09IGlkKSB7XHJcblx0XHRcdFx0Y29sdW1uID0gbGlzdFtpXTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNvbHVtbjtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgc3dhcENvbHVtbnMoc291cmNlOiBhbnksIGRlc3RpbmF0aW9uOiBhbnkpIHtcclxuXHJcblx0XHRpZiAoc291cmNlLm5vZGUucGFyZW50Tm9kZSA9PT0gZGVzdGluYXRpb24ubm9kZS5wYXJlbnROb2RlKSB7XHJcblx0XHRcdGNvbnN0IHNyY0luZGV4ID0gdGhpcy5nZXRDb2x1bW5JbmRleChzb3VyY2UubWVkaXVtLmtleSk7XHJcblx0XHRcdGNvbnN0IGRlc0luZGV4ID0gdGhpcy5nZXRDb2x1bW5JbmRleChkZXN0aW5hdGlvbi5tZWRpdW0ua2V5KTtcclxuXHRcdFx0aWYgKHNyY0luZGV4IDwgMCB8fCBkZXNJbmRleCA8IDApIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcImludmFsaWQgZHJvcCBpZFwiLCBzb3VyY2UubWVkaXVtLmtleSwgZGVzdGluYXRpb24ubWVkaXVtLmtleSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNvbnN0IHggPSB0aGlzLmZpbHRlcmVkSXRlbXM7XHJcblx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IFtdO1xyXG5cclxuXHRcdFx0c2V0VGltZW91dCgoKT0+e1xyXG5cdFx0XHRcdGNvbnN0IHNvYmogPSB0aGlzLmhlYWRlcnNbc3JjSW5kZXhdO1xyXG5cdFx0XHRcdHRoaXMuaGVhZGVyc1tzcmNJbmRleF0gPSB0aGlzLmhlYWRlcnNbZGVzSW5kZXhdO1xyXG5cdFx0XHRcdHRoaXMuaGVhZGVyc1tkZXNJbmRleF0gPSBzb2JqO1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IHg7XHJcblxyXG5cdFx0XHRcdHRoaXMub25maWx0ZXIuZW1pdCh0aGlzLmZpbHRlcmVkSXRlbXMpO1xyXG5cdFx0XHRcdHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzLmhlYWRlcnMpO1xyXG5cdFx0XHR9LCAzMyk7XHJcblx0XHJcblx0XHR9IGVsc2UgaWYgKHNvdXJjZS5tZWRpdW0ubG9ja2VkIHx8IGRlc3RpbmF0aW9uLm1lZGl1bS5sb2NrZWQpIHtcclxuXHRcdFx0Y29uc3QgeCA9IHRoaXMuZmlsdGVyZWRJdGVtcztcclxuXHRcdFx0dGhpcy5maWx0ZXJlZEl0ZW1zID0gW107XHJcblx0XHRcdHRoaXMub25maWx0ZXIuZW1pdCh0aGlzLmZpbHRlcmVkSXRlbXMpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KCgpPT57XHJcblx0XHRcdFx0c291cmNlLm1lZGl1bS5sb2NrZWQgPSAhc291cmNlLm1lZGl1bS5sb2NrZWQ7XHJcblx0XHRcdFx0ZGVzdGluYXRpb24ubWVkaXVtLmxvY2tlZCA9ICFkZXN0aW5hdGlvbi5tZWRpdW0ubG9ja2VkO1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IHg7XHJcblx0XHRcdFx0dGhpcy5vbmZpbHRlci5lbWl0KHRoaXMuZmlsdGVyZWRJdGVtcyk7XHJcblx0XHRcdFx0dGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaGVhZGVycyk7XHJcblx0XHRcdH0sMzMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBnZXRDb2x1bW5JbmRleChpZDogc3RyaW5nKSB7XHJcblx0XHRsZXQgaW5kZXggPSAtMTtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWFkZXJzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmICh0aGlzLmhlYWRlcnNbaV0ua2V5ID09PSBpZCkge1xyXG5cdFx0XHRcdGluZGV4ID0gaTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGluZGV4O1xyXG5cdH1cclxuXHRwcml2YXRlIGl0ZW1WYWx1ZShpdGVtLCBocGF0aCkge1xyXG5cdFx0bGV0IHN1Yml0ZW0gPSBpdGVtO1xyXG5cdFx0aHBhdGgubWFwKCAoc3Via2V5KSA9PiB7XHJcblx0XHRcdGlmIChzdWJpdGVtKSB7XHJcblx0XHRcdFx0c3ViaXRlbSA9IHN1Yml0ZW1bc3Via2V5XTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHRcdHJldHVybiBzdWJpdGVtID09PSB1bmRlZmluZWQgfHwgc3ViaXRlbSA9PT0gbnVsbCB8fCBzdWJpdGVtID09PSBcIm51bGxcIiA/IFwiXCIgOiBzdWJpdGVtO1xyXG5cdH1cclxuXHRpbml0VmlzaWJsZVJvd3MoKSB7XHJcblx0XHRjb25zdCByZXN1bHQgPSBbXTtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5maWx0ZXJlZEl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmIChpID49IHRoaXMucGFnZUluZm8uZnJvbSAmJiBpIDw9IHRoaXMucGFnZUluZm8udG8pIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaCh0aGlzLmZpbHRlcmVkSXRlbXNbaV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSByZXN1bHQ7XHJcblx0fVxyXG5cclxuXHRsb2NrKGhlYWRlcjogRmxleGlibGVUYWJsZUhlYWRlciwgZXZlbnQpIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcdFxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRoZWFkZXIubG9ja2VkID0gIWhlYWRlci5sb2NrZWQ7XHJcblx0XHR0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5oZWFkZXJzKTtcclxuXHR9XHJcblx0c29ydChoZWFkZXI6IEZsZXhpYmxlVGFibGVIZWFkZXIsIGljb24pIHtcclxuXHRcdGlmIChoZWFkZXIuc29ydGFibGUgJiYgdGhpcy5pdGVtcyAmJiB0aGlzLml0ZW1zLmxlbmd0aCkge1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVhZGVycy5sZW5ndGggOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGggPSB0aGlzLmhlYWRlcnNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGgua2V5ICE9PSBoZWFkZXIua2V5KSB7XHJcblx0XHRcdFx0XHRjb25zdCBpdGVtID0gdGhpcy5maW5kQ29sdW1uV2l0aElEKGgua2V5KTtcclxuXHJcblx0XHRcdFx0XHRpZiAoaXRlbSkge1xyXG5cdFx0XHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJhc2NlbmRpbmdcIik7XHJcblx0XHRcdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LnJlbW92ZShcImRlc2NlbmRpbmdcIik7XHJcblx0XHRcdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LmFkZChcInNvcnRhYmxlXCIpO1xyXG5cdFx0XHRcdFx0fVxyXG4gICAgICAgICAgICAgICAgICAgIGguZGVzY2VuZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGguYXNjZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcbiAgICAgICAgICAgIGljb24uY2xhc3NMaXN0LnJlbW92ZShcImZhLXNvcnRcIik7XHJcblx0XHRcdGlmIChoZWFkZXIuYXNjZW5kaW5nIHx8ICghaGVhZGVyLmFzY2VuZGluZyAmJiAhaGVhZGVyLmRlc2NlbmRpbmcpKSB7XHJcblx0XHRcdFx0aGVhZGVyLmRlc2NlbmRpbmcgPSB0cnVlO1xyXG5cdFx0XHRcdGhlYWRlci5hc2NlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRpY29uLmNsYXNzTGlzdC5yZW1vdmUoXCJmYS1zb3J0LWFzY1wiKTtcclxuXHRcdFx0XHRpY29uLmNsYXNzTGlzdC5hZGQoXCJmYS1zb3J0LWRlc2NcIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aGVhZGVyLmRlc2NlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRoZWFkZXIuYXNjZW5kaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHRpY29uLmNsYXNzTGlzdC5yZW1vdmUoXCJmYS1zb3J0LWRlc2NcIik7XHJcblx0XHRcdFx0aWNvbi5jbGFzc0xpc3QuYWRkKFwiZmEtc29ydC1hc2NcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0Y29uc3QgaHBhdGggPSBoZWFkZXIua2V5LnNwbGl0KFwiLlwiKTtcclxuXHJcblx0XHRcdGlmICh0aGlzLmVuYWJsZUZpbHRlcmluZykge1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVySXRlbXMoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSB0aGlzLml0ZW1zID8gdGhpcy5pdGVtcyA6IFtdO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcy5zb3J0KChhLCBiKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgdjEgPSB0aGlzLml0ZW1WYWx1ZShhLCBocGF0aCk7XHJcblx0XHRcdFx0Y29uc3QgdjIgPSB0aGlzLml0ZW1WYWx1ZShiLCBocGF0aCk7XHJcblxyXG5cdFx0XHRcdGlmIChoZWFkZXIuYXNjZW5kaW5nKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdjEgPiB2MiA/IDEgOiAtMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHYxIDwgdjIgPyAxIDogLTE7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR0aGlzLmluaXRWaXNpYmxlUm93cygpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0b2Zmc2V0V2lkdGgoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy50YWJsZS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XHJcblx0fVxyXG5cclxuXHRuZ09uQ2hhbmdlcyhjaGFuZ2VzOmFueSkge1xyXG5cdFx0Ly8gaWYgKGNoYW5nZXMuaXRlbXMpIHtcclxuXHRcdC8vIFx0dGhpcy5ldmFsdWF0ZVJvd3MoKTtcclxuXHRcdC8vIH1cclxuXHR9XHJcblxyXG5cdG5nT25Jbml0KCkge1xyXG5cdFx0aWYgKHRoaXMucGFnZUluZm8pIHtcclxuXHRcdFx0aWYgKCF0aGlzLnBhZ2VJbmZvLnRvKSB7XHJcblx0XHRcdFx0dGhpcy5wYWdlSW5mby50byA9IHRoaXMucGFnZUluZm8ucGFnZVNpemU7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMucGFnZUluZm8gPSB7IFxyXG4gICAgICAgICAgICAgICAgY29udGVudFNpemU6IDEwMDAwMCwgXHJcbiAgICAgICAgICAgICAgICBwYWdlU2l6ZTogMTAwMDAwLCBcclxuICAgICAgICAgICAgICAgIHBhZ2VzOiAxLCBcclxuICAgICAgICAgICAgICAgIGZyb206IDAsIFxyXG4gICAgICAgICAgICAgICAgdG86IDEwMDAwMCwgXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFnZTogMSwgXHJcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogXCIwXCIgXHJcbiAgICAgICAgICAgIH07XHJcblx0XHR9XHJcblx0XHRpZiAoIXRoaXMuaGVhZGVycykge1xyXG5cdFx0XHR0aGlzLmhlYWRlcnMgPSBbXTtcclxuXHRcdH1cclxuXHRcdHRoaXMuZXZhbHVhdGVSb3dzKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aW9uS2V5cykge1xyXG4gICAgICAgICAgICB0aGlzLmFjdGlvbktleXMgPSB0aGlzLmFjdGlvbktleXMuc3BsaXQoXCIsXCIpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCF0aGlzLnJvd0RldGFpbGVyICYmIHRoaXMuZXhwYW5kYWJsZSkge1xyXG5cdFx0XHR0aGlzLnJvd0RldGFpbGVyID0gZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRcdHJldHVybiB7ZGF0YTogaXRlbSwgaGVhZGVyczogW119O1xyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdFx0aWYgKCF0aGlzLmV4cGFuZGFibGUpIHtcclxuXHRcdFx0dGhpcy5leHBhbmRhYmxlID0gZnVuY3Rpb24oaXRlbSwgc2hvd0ljb24pIHtyZXR1cm4gc2hvd0ljb259O1xyXG5cdFx0fVxyXG5cdFx0aWYgKCF0aGlzLnJvd0RldGFpbGVySGVhZGVycykge1xyXG5cdFx0XHR0aGlzLnJvd0RldGFpbGVySGVhZGVycyA9IChpdGVtKSA9PiBbXTtcclxuXHRcdH1cclxuXHR9XHJcblx0ZXZhbHVhdGVSb3dzKCkge1xyXG5cdFx0aWYgKHRoaXMuZW5hYmxlRmlsdGVyaW5nKSB7XHJcblx0XHRcdHRoaXMuZmlsdGVySXRlbXMoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IHRoaXMuaXRlbXMgPyB0aGlzLml0ZW1zIDogW107XHJcblx0XHR9XHJcblx0XHR0aGlzLmluaXRWaXNpYmxlUm93cygpO1xyXG5cdH1cclxuXHJcbiAgICBoZWFkZXJDb2x1bW5FbGVtZW50cygpIHtcclxuXHRcdGxldCByZXN1bHQgPSBbXTtcclxuXHJcblx0XHRpZiAodGhpcy50YWJsZS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW4pIHtcclxuXHRcdFx0Y29uc3QgbGlzdCA9IHRoaXMudGFibGUuZWxlbWVudC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuO1xyXG5cdFx0XHRyZXN1bHQgPSB0aGlzLmNhcHRpb24gPyBsaXN0WzFdLmNoaWxkcmVuWzBdLmNoaWxkcmVuIDogbGlzdFswXS5jaGlsZHJlblswXS5jaGlsZHJlbjtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG5cdGhlYWRlckJ5SWQoaWQpIHtcclxuXHRcdGxldCBoO1xyXG5cdFx0Zm9yIChjb25zdCBpIGluIHRoaXMuaGVhZGVycykge1xyXG5cdFx0XHRpZiAodGhpcy5oZWFkZXJzW2ldLmtleSA9PT0gaWQpIHtcclxuXHRcdFx0XHRoID0gdGhpcy5oZWFkZXJzW2ldO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gaDtcclxuXHR9XHJcblxyXG4gICAgY29sdW1uc0NvdW50KCkge1xyXG5cdFx0bGV0IGNvdW50ID0gMDtcclxuXHRcdHRoaXMuaGVhZGVycy5tYXAoIChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLnByZXNlbnQpIHtcclxuICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgIH1cclxuXHRcdH0pO1xyXG4gICAgICAgIGlmICh0aGlzLmFjdGlvbikge1xyXG4gICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY291bnQ7XHJcblx0fVxyXG5cdGhvdmVyKGl0ZW0sIGZsYWcpIHtcclxuXHRcdGlmIChmbGFnKSB7XHJcblx0XHRcdGl0ZW0uaG92ZXIgPSB0cnVlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZGVsZXRlIGl0ZW0uaG92ZXI7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR0b0Nzc0NsYXNzKGhlYWRlcikge1xyXG5cdFx0cmV0dXJuIGhlYWRlci5rZXkucmVwbGFjZSgvXFwuL2csJy0nKTtcclxuXHR9XHJcbiAgICBrZXlkb3duKGV2ZW50LCBpdGVtKSB7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG4gICAgICAgIGlmICgoY29kZSA9PT0gMTMpIHx8IChjb2RlID09PSAzMikpIHtcclxuXHRcdFx0aXRlbS5jbGljaygpO1xyXG5cdFx0fVxyXG4gICAgfVxyXG4gICAgb2ZmU2NyZWVuTWVzc2FnZShpdGVtKSB7XHJcblx0XHRsZXQgbWVzc2FnZTogc3RyaW5nID0gdGhpcy5hY3Rpb247XHJcblx0XHRpZiAodGhpcy5hY3Rpb25LZXlzKSB7XHJcblx0XHRcdHRoaXMuYWN0aW9uS2V5cy5tYXAoKGtleSkgPT4geyBtZXNzYWdlID0gbWVzc2FnZS5yZXBsYWNlKGtleSwgaXRlbVtrZXkuc3Vic3RyaW5nKDEsIGtleS5sZW5ndGggLSAxKV0pOyB9KVxyXG5cdFx0fVxyXG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xyXG4gICAgfVxyXG5cclxuICAgIGNlbGxDb250ZW50KGl0ZW0sIGhlYWRlcikge1xyXG5cdFx0bGV0IGNvbnRlbnQgPSB0aGlzLml0ZW1WYWx1ZShpdGVtLCBoZWFkZXIua2V5LnNwbGl0KFwiLlwiKSk7XHJcbiAgICAgICAgcmV0dXJuIChjb250ZW50ICE9PSB1bmRlZmluZWQgJiYgY29udGVudCAhPSBudWxsICYmIFN0cmluZyhjb250ZW50KS5sZW5ndGgpID8gY29udGVudCA6ICcmbmJzcDsnO1xyXG5cdH1cclxuXHJcblx0cm93RGV0YWlsZXJDb250ZXh0KGl0ZW0pIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGRhdGE6IGl0ZW0sXHJcblx0XHRcdHRhYmxlSW5mbzogdGhpcy50YWJsZUluZm8sXHJcblx0XHRcdGhlYWRlcnM6IHRoaXMucm93RGV0YWlsZXJIZWFkZXJzKGl0ZW0pXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0Y2hhbmdlRmlsdGVyKGV2ZW50LCBoZWFkZXIpIHtcclxuICAgICAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcblxyXG5cdFx0aGVhZGVyLmZpbHRlciA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuXHJcblx0XHRpZiAodGhpcy5maWx0ZXJ3aGlsZXR5cGluZyB8fCBjb2RlID09PSAxMykge1xyXG5cdFx0XHRpZih0aGlzLmZpbHRlcmluZ1RpbWVySWQpIHtcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQodGhpcy5maWx0ZXJpbmdUaW1lcklkKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmZpbHRlcmluZ1RpbWVySWQgPSBzZXRUaW1lb3V0KCgpPT57XHJcblx0XHRcdFx0dGhpcy5maWx0ZXJJdGVtcygpO1xyXG5cdFx0XHRcdHRoaXMuaW5pdFZpc2libGVSb3dzKCk7XHJcblx0XHRcdFx0dGhpcy5maWx0ZXJpbmdUaW1lcklkICA9IHVuZGVmaW5lZDtcclxuXHRcdFx0fSwgMTIzKTtcclxuXHRcdH1cclxuXHR9XHJcblx0YWN0aW9uQ2xpY2soZXZlbnQsIGl0ZW06IGFueSkge1xyXG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgaWYgKHRoaXMucm93RGV0YWlsZXIgJiYgKHRoaXMuZXhwYW5kSWYgfHwgdGhpcy5leHBhbmRhYmxlKGl0ZW0sIGZhbHNlKSkgKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmV4cGFuZGVkKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgaXRlbS5leHBhbmRlZDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZXhwYW5kZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vbmFjdGlvbi5lbWl0KGl0ZW0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cHJpbnQoKSB7XHJcblx0XHR0aGlzLnByaW50TW9kZSA9IHRydWU7XHJcblx0XHRzZXRUaW1lb3V0KCgpPT57XHJcblx0XHRcdGNvbnN0IGNvbnRlbnQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MO1xyXG5cdFx0XHR0aGlzLnByaW50TW9kZSA9IGZhbHNlO1xyXG5cdFx0XHRjb25zdCBwb3B1cFdpbiA9IHdpbmRvdy5vcGVuKCcnLCAnX2JsYW5rJywgJ3dpZHRoPTMwMCxoZWlnaHQ9MzAwJyk7XHJcblx0XHRcclxuXHRcdFx0cG9wdXBXaW4uZG9jdW1lbnQub3BlbigpO1xyXG4gICAgICAgIFx0cG9wdXBXaW4uZG9jdW1lbnQud3JpdGUoJzxodG1sPjxib2R5IG9ubG9hZD1cIndpbmRvdy5wcmludCgpXCI+JyArIGNvbnRlbnQgKyAnPC9odG1sPicpO1xyXG4gICAgICAgIFx0cG9wdXBXaW4uZG9jdW1lbnQuY2xvc2UoKTtcclxuXHRcdH0sMyk7XHJcblx0fVxyXG5cclxuXHQvLyA8NSwgITUsID41LCAqRSwgRSosICpFKlxyXG5cdHByaXZhdGUgc2hvdWxkU2tpcEl0ZW0odmFsdWUsIGZpbHRlckJ5KSB7XHJcblx0XHRsZXQgcmVzdWx0ID0gZmFsc2U7XHJcblxyXG5cdFx0aWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwgJiYgU3RyaW5nKHZhbHVlKS5sZW5ndGgpIHtcclxuXHRcdFx0Y29uc3QgdiA9IFN0cmluZyh2YWx1ZSk7XHJcblx0XHRcdGlmIChmaWx0ZXJCeVswXSA9PT0gJzwnKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gZmlsdGVyQnkubGVuZ3RoID4gMSAmJiBwYXJzZUZsb2F0KHYpID49IHBhcnNlRmxvYXQoZmlsdGVyQnkuc3Vic3RyaW5nKDEpKTtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWx0ZXJCeVswXSA9PT0gJz4nKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gZmlsdGVyQnkubGVuZ3RoID4gMSAmJiBwYXJzZUZsb2F0KHYpIDw9IHBhcnNlRmxvYXQoZmlsdGVyQnkuc3Vic3RyaW5nKDEpKTtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWx0ZXJCeVswXSA9PT0gJyEnKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gZmlsdGVyQnkubGVuZ3RoID4gMSAmJiBwYXJzZUZsb2F0KHYpID09IHBhcnNlRmxvYXQoZmlsdGVyQnkuc3Vic3RyaW5nKDEpKTtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWx0ZXJCeVswXSA9PT0gJz0nKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gZmlsdGVyQnkubGVuZ3RoID09IDEgfHwgcGFyc2VGbG9hdCh2KSAhPT0gcGFyc2VGbG9hdChmaWx0ZXJCeS5zdWJzdHJpbmcoMSkpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGZpbHRlckJ5WzBdID09PSAnKicgJiYgZmlsdGVyQnlbZmlsdGVyQnkubGVuZ3RoLTFdICE9PSAnKicpIHtcclxuXHRcdFx0XHRjb25zdCBmID0gZmlsdGVyQnkuc3Vic3RyaW5nKDEpO1xyXG5cdFx0XHRcdHJlc3VsdCA9IHYuaW5kZXhPZihmKSAhPT0gdi5sZW5ndGggLSBmLmxlbmd0aFxyXG5cdFx0XHR9IGVsc2UgaWYgKGZpbHRlckJ5WzBdICE9PSAnKicgJiYgZmlsdGVyQnlbZmlsdGVyQnkubGVuZ3RoLTFdID09PSAnKicpIHtcclxuXHRcdFx0XHRjb25zdCBmID0gZmlsdGVyQnkuc3Vic3RyaW5nKDAsIGZpbHRlckJ5Lmxlbmd0aC0xKTtcclxuXHRcdFx0XHRyZXN1bHQgPSB2LmluZGV4T2YoZikgIT09IDA7XHJcblx0XHRcdH0gZWxzZSBpZiAoZmlsdGVyQnlbMF0gPT09ICcqJyAmJiBmaWx0ZXJCeVtmaWx0ZXJCeS5sZW5ndGgtMV0gPT09ICcqJykge1xyXG5cdFx0XHRcdHJlc3VsdCA9IGZpbHRlckJ5Lmxlbmd0aCA+IDEgJiYgdi5pbmRleE9mKCBmaWx0ZXJCeS5zdWJzdHJpbmcoMSwgZmlsdGVyQnkubGVuZ3RoLTEpICkgPCAwO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJlc3VsdCA9IHYuaW5kZXhPZihmaWx0ZXJCeSkgPCAwO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH1cclxuXHRmaWx0ZXJJdGVtcygpIHtcclxuXHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IHRoaXMuaXRlbXMgPyB0aGlzLml0ZW1zLmZpbHRlcigoaXRlbSkgPT4ge1xyXG5cdFx0XHRsZXQga2VlcEl0ZW0gPSB0cnVlO1xyXG5cclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlYWRlcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRjb25zdCBoZWFkZXIgPSB0aGlzLmhlYWRlcnNbaV07XHJcblx0XHRcdFx0aWYgKGhlYWRlci5maWx0ZXIgJiYgaGVhZGVyLmZpbHRlci5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdGNvbnN0IHYgPSB0aGlzLml0ZW1WYWx1ZShpdGVtLCBoZWFkZXIua2V5LnNwbGl0KFwiLlwiKSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuc2hvdWxkU2tpcEl0ZW0odixoZWFkZXIuZmlsdGVyKSkge1xyXG5cdFx0XHRcdFx0XHRrZWVwSXRlbSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGtlZXBJdGVtO1xyXG5cdFx0fSkgOiBbXTtcclxuXHRcdHRoaXMub25maWx0ZXIuZW1pdCh0aGlzLmZpbHRlcmVkSXRlbXMpO1xyXG5cdH1cclxuXHJcblx0b25UYWJsZUNlbGxFZGl0KGV2ZW50KSB7XHJcblx0XHRjb25zdCBpZCA9IGV2ZW50LmlkLnNwbGl0KFwiLVwiKTtcclxuXHRcdGNvbnN0IG4gPSBldmVudC5uYW1lO1xyXG5cdFx0Y29uc3Qgdj0gZXZlbnQudmFsdWU7XHJcblx0XHRjb25zdCB0ID0gdGhpcy5pdGVtc1twYXJzZUludChpZFsxXSldO1xyXG5cclxuXHRcdGlmICh0KSB7XHJcblx0XHRcdGNvbnN0IGxpc3QgPSBpZFswXS5zcGxpdChcIi5cIik7XHJcblx0XHRcdGxldCBzdWJpdGVtID0gdFtsaXN0WzBdXTtcclxuXHRcdFx0Zm9yKGxldCBpID0gMTsgaSA8IChsaXN0Lmxlbmd0aCAtIDEpOyBpKyspIHtcclxuXHRcdFx0XHRzdWJpdGVtID0gc3ViaXRlbVtsaXN0W2ldXVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChzdWJpdGVtICYmIGxpc3QubGVuZ3RoID4gMSl7XHJcblx0XHRcdFx0c3ViaXRlbVtsaXN0W2xpc3QubGVuZ3RoIC0gMV1dID0gdjtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLm9uQ2VsbENvbnRlbnRFZGl0LmVtaXQoe25hbWU6IG4sIHZhbHVlOiB2LCBpdGVtOiB0fSk7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG5cdGRyYWdFbmFibGVkKGV2ZW50OiBEcmFnRXZlbnQpIHtcclxuXHRcdHJldHVybiBldmVudC5tZWRpdW0uZHJhZ2FibGU7XHJcblx0fVxyXG5cdGRyb3BFbmFibGVkKGV2ZW50OiBEcm9wRXZlbnQpIHtcclxuXHRcdHJldHVybiBldmVudC5kZXN0aW5hdGlvbi5tZWRpdW0uZHJhZ2FibGU7XHJcblx0fVxyXG5cdG9uRHJhZ1N0YXJ0KGV2ZW50OiBEcmFnRXZlbnQpe1xyXG4vLyAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWU7XHJcblx0fVxyXG5cdG9uRHJhZ0VuZChldmVudDogRHJhZ0V2ZW50KXtcclxuIC8vICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcclxuXHR9XHJcblx0b25Ecm9wKGV2ZW50OkRyb3BFdmVudCl7XHJcblx0XHR0aGlzLnN3YXBDb2x1bW5zKGV2ZW50LnNvdXJjZSwgZXZlbnQuZGVzdGluYXRpb24pO1xyXG5cdH1cclxufVxyXG4iXX0=