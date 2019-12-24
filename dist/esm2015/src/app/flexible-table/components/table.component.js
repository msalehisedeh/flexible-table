import * as tslib_1 from "tslib";
/*
* Provides rendering of a table which is using the given FlexibleTableHeader set in
* order to tabulate the given data. As per definition of earch header component,
* a column could be hidden, sortable, or draggable. Each table row can expand/collapse
* or respond to a click action.
*/
import { Component, Input, Output, ViewChild, ViewContainerRef, OnInit, OnChanges, EventEmitter, ElementRef } from '@angular/core';
let TableViewComponent = class TableViewComponent {
    constructor(el) {
        this.el = el;
        this.dragging = false;
        this.printMode = false;
        this.filteredItems = [];
        this.sortedItems = [];
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
    findColumnWithID(id) {
        const list = this.headerColumnElements();
        let column = null;
        for (let i = 0; i < list.length; i++) {
            if (list[i].getAttribute("id") === id) {
                column = list[i];
                break;
            }
        }
        return column;
    }
    swapColumns(source, destination) {
        if (source.node.parentNode === destination.node.parentNode) {
            const srcIndex = this.getColumnIndex(source.medium.key);
            const desIndex = this.getColumnIndex(destination.medium.key);
            if (srcIndex < 0 || desIndex < 0) {
                console.log("invalid drop id", source.medium.key, destination.medium.key);
                return;
            }
            const x = this.filteredItems;
            this.filteredItems = [];
            setTimeout(() => {
                const sobj = this.headers[srcIndex];
                this.headers[srcIndex] = this.headers[desIndex];
                this.headers[desIndex] = sobj;
                this.filteredItems = x;
                this.onfilter.emit(this.filteredItems);
                this.onchange.emit(this.headers);
            }, 33);
        }
        else if (source.medium.locked || destination.medium.locked) {
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
    getColumnIndex(id) {
        let index = -1;
        for (let i = 0; i < this.headers.length; i++) {
            if (this.headers[i].key === id) {
                index = i;
                break;
            }
        }
        return index;
    }
    itemValue(item, hpath) {
        let subitem = item;
        hpath.map((subkey) => {
            if (subitem) {
                subitem = subitem[subkey];
            }
        });
        return subitem === undefined || subitem === null || subitem === "null" ? "" : subitem;
    }
    initVisibleRows(filtered) {
        const result = [];
        const list = filtered ? filtered : this.filteredItems;
        if (this.pageInfo) {
            for (let i = 0; i < list.length; i++) {
                if (i >= this.pageInfo.from && i <= this.pageInfo.to) {
                    result.push(list[i]);
                }
            }
            this.filteredItems = result;
        }
        if (filtered) {
            this.onfilter.emit(this.filteredItems);
        }
    }
    lock(header, event) {
        event.stopPropagation();
        event.preventDefault();
        header.locked = !header.locked;
        this.onchange.emit(this.headers);
    }
    sort(header, icon) {
        if (header.sortable && this.items && this.items.length) {
            for (let i = 0; i < this.headers.length; i++) {
                const h = this.headers[i];
                if (h.key !== header.key) {
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
            const hpath = header.key.split(".");
            let filtered = [];
            if (this.enableFiltering) {
                filtered = this.filterItems();
            }
            else {
                filtered = this.items ? this.items : [];
            }
            filtered.sort((a, b) => {
                const v1 = this.itemValue(a, hpath);
                const v2 = this.itemValue(b, hpath);
                if (header.ascending) {
                    return v1 > v2 ? 1 : -1;
                }
                return v1 < v2 ? 1 : -1;
            });
            this.sortedItems = filtered;
            this.initVisibleRows(filtered);
        }
    }
    offsetWidth() {
        return this.table.element.nativeElement.offsetWidth;
    }
    ngOnChanges(changes) {
        // if (changes.items) {
        // 	this.evaluateRows();
        // }
    }
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
    evaluateRows() {
        let filtered = [];
        if (this.sortedItems && this.sortedItems.length) {
            filtered = this.sortedItems;
        }
        else {
            if (this.enableFiltering) {
                filtered = this.filterItems();
            }
            else {
                filtered = this.items ? this.items : [];
            }
        }
        this.initVisibleRows(filtered);
    }
    headerColumnElements() {
        let result = [];
        if (this.table.element.nativeElement.children) {
            const list = this.table.element.nativeElement.children;
            result = this.caption ? list[1].children[0].children : list[0].children[0].children;
        }
        return result;
    }
    headerById(id) {
        let h;
        for (const i in this.headers) {
            if (this.headers[i].key === id) {
                h = this.headers[i];
                break;
            }
        }
        return h;
    }
    columnsCount() {
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
    hover(item, flag) {
        if (flag) {
            item.hover = true;
        }
        else {
            delete item.hover;
        }
    }
    toCssClass(header) {
        return header.key.replace(/\./g, '-');
    }
    keydown(event, item) {
        const code = event.which;
        if ((code === 13) || (code === 32)) {
            item.click();
        }
    }
    offScreenMessage(item) {
        let message = this.action;
        if (this.actionKeys) {
            this.actionKeys.map((key) => { message = message.replace(key, item[key.substring(1, key.length - 1)]); });
        }
        return message;
    }
    cellContent(item, header) {
        let content = this.itemValue(item, header.key.split("."));
        return (content !== undefined && content != null && String(content).length) ? content : '&nbsp;';
    }
    rowDetailerContext(item) {
        return {
            data: item,
            tableInfo: this.tableInfo,
            headers: this.rowDetailerHeaders(item)
        };
    }
    changeFilter(event, header) {
        const code = event.which;
        header.filter = event.target.value;
        if (this.filterwhiletyping || code === 13) {
            if (this.filteringTimerId) {
                clearTimeout(this.filteringTimerId);
            }
            this.filteringTimerId = setTimeout(() => {
                this.initVisibleRows(this.filterItems());
                this.filteringTimerId = undefined;
            }, 123);
        }
    }
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
    print() {
        this.printMode = true;
        setTimeout(() => {
            const content = this.el.nativeElement.innerHTML;
            const styles = document.getElementsByTagName('style');
            this.printMode = false;
            const popupWin = window.open('', '_blank', 'width=300,height=300');
            let copiedContent = '<html>';
            for (let i = 0; i < styles.length; i++) {
                copiedContent += styles[i].outerHTML;
            }
            copiedContent += '<body onload="window.print()">' + content + '</html>';
            popupWin.document.open();
            popupWin.document.write(copiedContent);
            popupWin.document.close();
        }, 3);
    }
    // <5, !5, >5, *E, E*, *E*
    shouldSkipItem(value, filterBy) {
        let result = false;
        if (value !== undefined && value !== null && String(value).length) {
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
                const f = filterBy.substring(1);
                result = v.indexOf(f) !== v.length - f.length;
            }
            else if (filterBy[0] !== '*' && filterBy[filterBy.length - 1] === '*') {
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
    filterItems() {
        return this.items ? this.items.filter((item) => {
            let keepItem = true;
            for (let i = 0; i < this.headers.length; i++) {
                const header = this.headers[i];
                if (header.filter && header.filter.length) {
                    const v = this.itemValue(item, header.key.split("."));
                    if (this.shouldSkipItem(v, header.filter)) {
                        keepItem = false;
                        break;
                    }
                }
            }
            return keepItem;
        }) : [];
    }
    onTableCellEdit(event) {
        const id = event.id.split("-");
        const n = event.name;
        const v = event.value;
        const t = this.items[parseInt(id[1])];
        if (t) {
            const list = id[0].split(".");
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
    dragEnabled(event) {
        return event.medium.dragable;
    }
    dropEnabled(event) {
        return event.destination.medium.dragable;
    }
    onDragStart(event) {
        //        this.dragging = true;
    }
    onDragEnd(event) {
        //       this.dragging = false;
    }
    onDrop(event) {
        this.swapColumns(event.source, event.destination);
    }
};
TableViewComponent.ctorParameters = () => [
    { type: ElementRef }
];
tslib_1.__decorate([
    Input("vocabulary")
], TableViewComponent.prototype, "vocabulary", void 0);
tslib_1.__decorate([
    Input("lockable")
], TableViewComponent.prototype, "lockable", void 0);
tslib_1.__decorate([
    Input("caption")
], TableViewComponent.prototype, "caption", void 0);
tslib_1.__decorate([
    Input("action")
], TableViewComponent.prototype, "action", void 0);
tslib_1.__decorate([
    Input("pageInfo")
], TableViewComponent.prototype, "pageInfo", void 0);
tslib_1.__decorate([
    Input("actionKeys")
], TableViewComponent.prototype, "actionKeys", void 0);
tslib_1.__decorate([
    Input("tableClass")
], TableViewComponent.prototype, "tableClass", void 0);
tslib_1.__decorate([
    Input("headers")
], TableViewComponent.prototype, "headers", void 0);
tslib_1.__decorate([
    Input("items")
], TableViewComponent.prototype, "items", void 0);
tslib_1.__decorate([
    Input("tableInfo")
], TableViewComponent.prototype, "tableInfo", void 0);
tslib_1.__decorate([
    Input("enableIndexing")
], TableViewComponent.prototype, "enableIndexing", void 0);
tslib_1.__decorate([
    Input("enableFiltering")
], TableViewComponent.prototype, "enableFiltering", void 0);
tslib_1.__decorate([
    Input("rowDetailer")
], TableViewComponent.prototype, "rowDetailer", void 0);
tslib_1.__decorate([
    Input("expandable")
], TableViewComponent.prototype, "expandable", void 0);
tslib_1.__decorate([
    Input("expandIf")
], TableViewComponent.prototype, "expandIf", void 0);
tslib_1.__decorate([
    Input("filterwhiletyping")
], TableViewComponent.prototype, "filterwhiletyping", void 0);
tslib_1.__decorate([
    Input("rowDetailerHeaders")
], TableViewComponent.prototype, "rowDetailerHeaders", void 0);
tslib_1.__decorate([
    Output('onaction')
], TableViewComponent.prototype, "onaction", void 0);
tslib_1.__decorate([
    Output('onchange')
], TableViewComponent.prototype, "onchange", void 0);
tslib_1.__decorate([
    Output('onfilter')
], TableViewComponent.prototype, "onfilter", void 0);
tslib_1.__decorate([
    Output('onCellContentEdit')
], TableViewComponent.prototype, "onCellContentEdit", void 0);
tslib_1.__decorate([
    ViewChild('flexible', { static: false })
], TableViewComponent.prototype, "table", void 0);
TableViewComponent = tslib_1.__decorate([
    Component({
        selector: 'table-view',
        template: "\r\n<table [class]=\"tableClass\"  #flexible>\r\n    <caption *ngIf=\"caption\" [textContent]=\"caption\"></caption>\r\n    <thead>\r\n        <tr>\r\n            <th scope=\"col\" *ngIf=\"enableIndexing && !printMode\" id=\"indexable\" class=\"indexable hide-on-print\"></th>\r\n            <th scope=\"col\" *ngFor=\"let header of headers\" #th\r\n                [dragEnabled]=\"dragEnabled.bind(this)\"\r\n                [dropEnabled]=\"dropEnabled.bind(this)\"\r\n                [medium]=\"header\"\r\n                (onDragStart)=\"onDragStart($event)\"\r\n                (onDragEnd)=\"onDragEnd($event)\"\r\n                (onDrop)=\"onDrop($event)\"\r\n                [id]=\"header.key\"\r\n                [attr.width]=\"header.width ? header.width : null\" \r\n                [style.min-width]=\"header.minwidth ? header.minwidth : ''\" \r\n                [attr.tabindex]=\"header.sortable ? 0 : -1\"\r\n                [class.hide-on-print]=\"header.hideOnPrint\"\r\n                (keydown)=\"keydown($event, th)\" (click)=\"sort(header, icon)\">\r\n                <span \r\n                    *ngIf=\"!printMode && header.sortable\" \r\n                    class=\"off-screen\"  \r\n                    [textContent]=\"vocabulary.clickSort\"></span>\r\n                <span class=\"locker icon fa\" #locker\r\n                    *ngIf=\"!printMode && lockable && (headers.length > 1 || header.locked)\"\r\n                    tabindex=\"0\"\r\n                    title=\"lock/unlock this column\"\r\n                    (keydown)=\"keydown($event, locker)\" (click)=\"lock(header, $event)\"\r\n                    [class.fa-lock]=\"header.locked\"\r\n                    [class.fa-unlock]=\"!header.locked\"></span>\r\n                <span class=\"title\"\r\n                    [class.lockable]=\"lockable\"\r\n                    [class.dragable]=\"header.dragable\"\r\n                    [textContent]=\"header.value\"></span>\r\n                <span class=\"icon fa\" [class.hidden]=\"printMode || !items || items.length === 0\" #icon\r\n                    [class.fa-sort]=\"header.sortable\"\r\n                    [class.fa-sort-asc]=\"header.assending\"\r\n                    [class.fa-sort-desc]=\"header.desending\"></span>\r\n            </th>\r\n            <th scope=\"col\" *ngIf=\"action && !printMode\" id=\"actionable\" class=\"actionable hide-on-print\"></th>\r\n        </tr>\r\n    </thead>\r\n    <tbody>\r\n        <tr *ngIf=\"!printMode && enableFiltering && items && items.length\" class=\"hide-on-print\">\r\n            <td scope=\"row\" *ngIf=\"enableIndexing && !printMode\" class=\"index filter hide-on-print\">\r\n                <input type=\"text\" disabled style=\"opacity:0\" />\r\n            </td>\r\n            <td scope=\"row\" \r\n                        *ngFor=\"let header of headers; let i=index\" \r\n                        [attr.data-label]=\"header.value\" \r\n                        [class.hide-on-print]=\"header.hideOnPrint\"\r\n                        class=\"filter\">\r\n                <span *ngIf=\"header.filter === undefined\">&nbsp;</span>\r\n                <input  *ngIf=\"header.filter !== undefined\"\r\n                        id=\"filter-{{i}}\"\r\n                        type=\"text\" \r\n                        (keyup)=\"changeFilter($event, header)\"\r\n                        [value]=\"header.filter ? header.filter : ''\" />\r\n                <label *ngIf=\"header.filter !== undefined\" for=\"filter-{{i}}\" ><span class=\"off-screen\" >Filter \"{{header.value}}\"</span><span class=\"fa fa-search\"></span></label>\r\n            </td>\r\n            <td scope=\"row\" *ngIf=\"action && !printMode\" class=\"hide-on-print\"></td>\r\n        </tr>\r\n       <ng-template ngFor let-item [ngForOf]=\"printMode ? items: filteredItems\" let-i=\"index\">\r\n            <tr (click)=\"actionClick($event, item)\"\r\n                (mouseover)=\"hover(item, true)\"\r\n                (mouseout)=\"hover(item, false)\"\r\n                [class.pointer]=\"action\"\r\n                [class.hover]=\"item.hover\"\r\n                [class.expanded]=\"item.expanded\"\r\n                [class.odd]=\"i%2\">\r\n                <td scope=\"row\" class=\"index hide-on-print\" *ngIf=\"enableIndexing && !printMode\">\r\n                    <span [textContent]=\"i + pageInfo.from + 1\"></span>\r\n                </td>\r\n                <td scope=\"row\" \r\n                    *ngFor=\"let header of headers\" \r\n                    [class]=\"toCssClass(header)\"\r\n                    [class.hide-on-print]=\"header.hideOnPrint\"\r\n                    [attr.data-label]=\"header.value\" \r\n                    [intoName]=\"header.value\"\r\n                    [intoId]=\"header.key + '-' + i\"\r\n                    [into]=\"header.format\"\r\n                    [intoData]=\"item\"\r\n                    [rawContent]=\"cellContent(item, header)\"\r\n                    [onComponentChange]=\"onTableCellEdit.bind(this)\"></td>\r\n                <td scope=\"row\" *ngIf=\"action && !printMode\" class=\"hide-on-print\">\r\n                    <a class=\"actionable\"\r\n                        *ngIf=\"expandable(item, true)\"\r\n                        tabindex=\"0\"\r\n                        role=\"button\"\r\n                        style=\"cursor:pointer\"\r\n                        [class.expanded]=\"item.expanded\" #clicker\r\n                        (keydown)=\"keydown($event, clicker)\" (click)=\"actionClick($event, item)\">\r\n                        <span\r\n                            class=\"icon fa\"\r\n                            [class.fa-angle-right]=\"!rowDetailer\"\r\n                            [class.fa-minus-square-o]=\"rowDetailer && item.expanded\"\r\n                            [class.fa-plus-square-o]=\"rowDetailer && !item.expanded\"\r\n                            aria-hidden=\"true\"></span>\r\n                        <span class=\"off-screen\" [textContent]=\"offScreenMessage(item)\"></span>\r\n                    </a>\r\n                </td>\r\n            </tr>\r\n            <tr *ngIf=\"rowDetailer && item.expanded\" class=\"detail\" [class.odd]=\"i%2\">\r\n                <td scope=\"row\" class=\"index\" *ngIf=\"enableIndexing && !printMode\"></td>\r\n                <td [attr.colspan]=\"columnsCount()\">\r\n                    <ng-container [ngTemplateOutlet]=\"rowDetailer\" [ngTemplateOutletContext]=\"rowDetailerContext(item)\"></ng-container>\r\n                </td>\r\n            </tr>\r\n        </ng-template>\r\n    </tbody>\r\n</table>\r\n",
        styles: [":host{display:inline-block!important;width:100%;position:relative;margin:0 auto;border-spacing:0;border-collapse:collapse}:host .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host table{margin:1rem auto;padding:0;width:100%;table-layout:fixed;max-width:99%;background-color:transparent;border-collapse:collapse}:host table caption{background-color:#c3e5e2;border-radius:2px;color:#1b1b1b;caption-side:top;font-size:14px;padding:5px 6px;margin-bottom:15px;text-align:left}:host table thead{border-top:1px solid #bbb;border-bottom:1px solid #bbb;background-color:#eee}:host table tr{border:0}:host table tr.expanded td{font-weight:700}:host table td{padding-left:3px;min-height:21px;overflow:hidden}:host table td span:first-child{min-height:21px;display:block}:host table td:first-child{padding-left:5px}:host table td ::ng-deep input-component .locked,:host table td ::ng-deep input-component input{width:99%}:host table td .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host table td.filter{padding:0;position:relative}:host table td.filter input{box-sizing:border-box;width:100%;margin:0}:host table td.filter .fa{position:absolute;top:4px;right:2px;color:#bad}:host table td ::ng-deep img{height:24px}:host table td.index{background-color:#eee;border-right:1px solid #bbb}:host table td.index span{padding:1px 0}:host table th{cursor:default;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none;height:24px;position:relative;white-space:nowrap;font-weight:400;text-transform:uppercase;font-size:14px;padding-top:6px;padding-bottom:6px;text-align:left}:host table th.drag-over{background-color:#9b9b9b}:host table th.drag-over .icon,:host table th.drag-over .title{color:#eee}:host table th:first-child{padding-left:5px}:host table th.ascending,:host table th.descending,:host table th.sortable{cursor:pointer;min-height:12px}:host table th.indexable{width:33px}:host table th.actionable{width:24px}:host table th .hidden{display:none}:host table th .title{color:#254a4d;display:inline-block;height:20px;float:left;width:calc(90% - 22px)!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}:host table th .title.dragable{width:auto}:host table th .title.lockable{width:calc(90% - 46px)!important}:host table th .dragable{cursor:move}:host table th .icon{width:22px;display:inline-block;height:20px;color:#254a4d;float:right}:host table th .locker{float:left}:host .fa.fa-angle-right{font-size:18px}table tr.expanded td{border-bottom:0}table tr.detail td{border-top:0;cursor:default}table tr.expanded td a.expanded{background-position:right 2px}table tbody tr.hover,table tbody tr:hover{background-color:#ffeed2}table tbody tr.detail.hover,table tbody tr.detail.hover td table thead tr,table tbody tr.detail:hover,table tbody tr.detail:hover td table thead tr{background-color:inherit}table tr td a.actionable{color:#254a4d}table tr td a.actionable .icon{line-height:22px;text-align:right}table tbody tr.detail.hover td:last-child,table tbody tr.detail:hover td:last-child{border-right:0}table tbody tr.detail.hover td:first-child,table tbody tr.detail:hover td:first-child{border-left:0}table tr td{border-bottom:1px solid #b1b3b3;color:#254a5d;font-size:15px;text-transform:capitalize}table tbody tr.pointer{cursor:pointer}table.alert-danger{border:0}table.alert-danger caption{background-color:transparent;font-weight:700;margin-bottom:0}table.alert-danger td{border-bottom:0;display:block}table.alert-danger td:first-child{padding-left:0}table.alert-danger td:last-child{border-bottom:0}table.alert-danger td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase;width:40%;text-align:left;overflow:hidden;text-overflow:ellipsis}table.alert-danger td a span.icon{width:100%}table.alert-danger thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}table.alert-danger tr{border:2px solid #fff;display:block;margin-bottom:.625em;padding:5px;border-radius:5px}table.alert-danger tr th.actionable{width:inherit}table.alert-danger tr td{border-bottom:0}@media print{table td,table th{text-align:left}table td .icon,table th .icon{display:none!important}table td.hide-on-print,table th.hide-on-print,table tr.hide-on-print{display:none}}@media screen and (max-width:600px){table{border:0}table th.indexable{display:none}table td{border-bottom:0;display:block;text-align:right}table td.index{display:none}table td:first-child{padding-left:0}table td:last-child{border-bottom:0}table td.filter input{width:50%!important}table td.filter .fa{right:7px!important}table td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase}table td a span.icon{width:100%}table td ::ng-deep .into{float:right!important}table td ::ng-deep .into .calendar{margin-right:0}table td ::ng-deep .into .popper{margin-right:0}table thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}table tr{border-bottom:3px solid #ddd;display:block;margin-bottom:.625em}table tr th.actionable{width:inherit}table tr td{border-bottom:0}table.alert-danger td:before{width:inherit}}"]
    })
], TableViewComponent);
export { TableViewComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlZGVoL2ZsZXhpYmxlLXRhYmxlLyIsInNvdXJjZXMiOlsic3JjL2FwcC9mbGV4aWJsZS10YWJsZS9jb21wb25lbnRzL3RhYmxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7O0VBS0U7QUFDRixPQUFPLEVBQ0gsU0FBUyxFQUNaLEtBQUssRUFDTCxNQUFNLEVBQ04sU0FBUyxFQUNULGdCQUFnQixFQUNoQixNQUFNLEVBQ04sU0FBUyxFQUNULFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxlQUFlLENBQUM7QUEwQnZCLElBQWEsa0JBQWtCLEdBQS9CLE1BQWEsa0JBQWtCO0lBZ0YzQixZQUFtQixFQUFhO1FBQWIsT0FBRSxHQUFGLEVBQUUsQ0FBVztRQS9FbkMsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLGtCQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ25CLGdCQUFXLEdBQUcsRUFBRSxDQUFDO1FBSVAsZUFBVSxHQUFHO1lBQ3RCLGNBQWMsRUFBRSxpQkFBaUI7WUFDakMsZ0JBQWdCLEVBQUUsbUJBQW1CO1lBQ3JDLFNBQVMsRUFBRSxlQUFlO1lBQzFCLE9BQU8sRUFBRSxVQUFVO1lBQ25CLFNBQVMsRUFBRSxPQUFPO1lBQ2xCLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLFlBQVksRUFBRSxVQUFVO1NBQ3hCLENBQUM7UUFrQlEsZUFBVSxHQUFHLHdCQUF3QixDQUFDO1FBaUN4QyxhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUc5QixhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUc5QixhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUc5QixzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBSVQsQ0FBQztJQUcvQixnQkFBZ0IsQ0FBQyxFQUFVO1FBQzVCLE1BQU0sSUFB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O29EQUNPO0FBR3pCO0lBREMsS0FBSyxDQUFDLG1CQUFtQixDQUFDOzZEQUNPO0FBR2xDO0lBREMsS0FBSyxDQUFDLG9CQUFvQixDQUFDOzhEQUNHO0FBR2xDO0lBREMsTUFBTSxDQUFDLFVBQVUsQ0FBQztvREFDbUI7QUFHdEM7SUFEQyxNQUFNLENBQUMsVUFBVSxDQUFDO29EQUNtQjtBQUd0QztJQURDLE1BQU0sQ0FBQyxVQUFVLENBQUM7b0RBQ21CO0FBR3RDO0lBREMsTUFBTSxDQUFDLG1CQUFtQixDQUFDOzZEQUNtQjtBQUVQO0lBQXZDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUM7aURBQWlDO0FBOUU1RCxrQkFBa0I7SUFMOUIsU0FBUyxDQUFDO1FBQ1YsUUFBUSxFQUFFLFlBQVk7UUFDdEIscytNQUFxQzs7S0FFckMsQ0FBQztHQUNXLGtCQUFrQixDQWtlOUI7U0FsZVksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuKiBQcm92aWRlcyByZW5kZXJpbmcgb2YgYSB0YWJsZSB3aGljaCBpcyB1c2luZyB0aGUgZ2l2ZW4gRmxleGlibGVUYWJsZUhlYWRlciBzZXQgaW5cclxuKiBvcmRlciB0byB0YWJ1bGF0ZSB0aGUgZ2l2ZW4gZGF0YS4gQXMgcGVyIGRlZmluaXRpb24gb2YgZWFyY2ggaGVhZGVyIGNvbXBvbmVudCxcclxuKiBhIGNvbHVtbiBjb3VsZCBiZSBoaWRkZW4sIHNvcnRhYmxlLCBvciBkcmFnZ2FibGUuIEVhY2ggdGFibGUgcm93IGNhbiBleHBhbmQvY29sbGFwc2VcclxuKiBvciByZXNwb25kIHRvIGEgY2xpY2sgYWN0aW9uLlxyXG4qL1xyXG5pbXBvcnQge1xyXG4gICAgQ29tcG9uZW50LFxyXG5cdElucHV0LFxyXG5cdE91dHB1dCxcclxuXHRWaWV3Q2hpbGQsXHJcblx0Vmlld0NvbnRhaW5lclJlZixcclxuXHRPbkluaXQsXHJcblx0T25DaGFuZ2VzLFxyXG5cdEV2ZW50RW1pdHRlcixcclxuXHRFbGVtZW50UmVmXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBEcm9wRXZlbnQsIERyYWdFdmVudCB9IGZyb20gJ0BzZWRlaC9kcmFnLWVuYWJsZWQnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBGbGV4aWJsZVRhYmxlSGVhZGVyIHtcclxuXHRrZXk6IHN0cmluZyxcclxuXHR2YWx1ZTogc3RyaW5nLFxyXG5cdHByZXNlbnQ6IGJvb2xlYW4sXHJcblx0d2lkdGg/OiBzdHJpbmcsXHJcblx0bWlud2lkdGg/OiBzdHJpbmcsXHJcblx0Zm9ybWF0Pzogc3RyaW5nLFxyXG5cdGhpZGVPblByaW50Pzpib29sZWFuLFxyXG5cdGZpbHRlcj86IHN0cmluZyxcclxuXHRkcmFnYWJsZT86IGJvb2xlYW4sXHJcblx0c29ydGFibGU/OiBib29sZWFuLFxyXG5cdGNsYXNzPzpzdHJpbmcsXHJcblx0bG9ja2VkPzpib29sZWFuLFxyXG5cdGFzY2VuZGluZz86IGJvb2xlYW4sXHJcblx0ZGVzY2VuZGluZz86IGJvb2xlYW5cclxufVxyXG5cclxuQENvbXBvbmVudCh7XHJcblx0c2VsZWN0b3I6ICd0YWJsZS12aWV3JyxcclxuXHR0ZW1wbGF0ZVVybDogJy4vdGFibGUuY29tcG9uZW50Lmh0bWwnLFxyXG5cdHN0eWxlVXJsczogWycuL3RhYmxlLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIFRhYmxlVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcclxuXHRkcmFnZ2luZyA9IGZhbHNlO1xyXG5cdHByaW50TW9kZSA9IGZhbHNlO1xyXG5cdGZpbHRlcmVkSXRlbXMgPSBbXTtcclxuXHRzb3J0ZWRJdGVtcyA9IFtdO1xyXG5cdGZpbHRlcmluZ1RpbWVySWQ6IGFueTtcclxuXHJcbiAgICBASW5wdXQoXCJ2b2NhYnVsYXJ5XCIpXHJcbiAgICBwdWJsaWMgdm9jYWJ1bGFyeSA9IHtcclxuXHRcdGNvbmZpZ3VyZVRhYmxlOiBcIkNvbmZpZ3VyZSBUYWJsZVwiLFxyXG5cdFx0Y29uZmlndXJlQ29sdW1uczogXCJDb25maWd1cmUgQ29sdW1uc1wiLFxyXG5cdFx0Y2xpY2tTb3J0OiBcIkNsaWNrIHRvIFNvcnRcIixcclxuXHRcdHNldFNpemU6IFwiU2V0IFNpemVcIixcclxuXHRcdGZpcnN0UGFnZTogXCJGaXJzdFwiLFxyXG5cdFx0bGFzdFBhZ2U6IFwiTGFzdFwiLFxyXG5cdFx0cHJldmlvdXNQYWdlOiBcIlByZXZpb3VzXCJcclxuXHR9O1xyXG5cclxuXHRASW5wdXQoXCJsb2NrYWJsZVwiKVxyXG5cdGxvY2thYmxlOmJvb2xlYW47XHJcblxyXG5cdEBJbnB1dChcImNhcHRpb25cIilcclxuICAgIHB1YmxpYyBjYXB0aW9uOiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KFwiYWN0aW9uXCIpXHJcbiAgICBwdWJsaWMgYWN0aW9uOiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KFwicGFnZUluZm9cIilcclxuICAgIHB1YmxpYyBwYWdlSW5mbztcclxuXHJcbiAgICBASW5wdXQoXCJhY3Rpb25LZXlzXCIpXHJcbiAgICBwdWJsaWMgYWN0aW9uS2V5cztcclxuXHJcbiAgICBASW5wdXQoXCJ0YWJsZUNsYXNzXCIpXHJcbiAgICBwdWJsaWMgdGFibGVDbGFzcyA9ICdkZWZhdWx0LWZsZXhpYmxlLXRhYmxlJztcclxuXHJcblx0QElucHV0KFwiaGVhZGVyc1wiKVxyXG5cdHB1YmxpYyBoZWFkZXJzOiBhbnlbXTtcclxuXHJcblx0QElucHV0KFwiaXRlbXNcIilcclxuXHRwdWJsaWMgaXRlbXM6IGFueVtdO1xyXG5cclxuXHRASW5wdXQoXCJ0YWJsZUluZm9cIilcclxuXHRwdWJsaWMgdGFibGVJbmZvOiBhbnk7XHJcblxyXG4gICAgQElucHV0KFwiZW5hYmxlSW5kZXhpbmdcIilcclxuICAgIHB1YmxpYyBlbmFibGVJbmRleGluZzogYm9vbGVhbjtcclxuXHJcbiAgICBASW5wdXQoXCJlbmFibGVGaWx0ZXJpbmdcIilcclxuICAgIHB1YmxpYyBlbmFibGVGaWx0ZXJpbmc6IGJvb2xlYW47XHJcblxyXG4gICAgQElucHV0KFwicm93RGV0YWlsZXJcIilcclxuICAgIHB1YmxpYyByb3dEZXRhaWxlcjogYW55O1xyXG5cclxuICAgIEBJbnB1dChcImV4cGFuZGFibGVcIilcclxuICAgIHB1YmxpYyBleHBhbmRhYmxlOiBhbnk7XHJcblxyXG4gICAgQElucHV0KFwiZXhwYW5kSWZcIilcclxuICAgIHB1YmxpYyBleHBhbmRJZjogYm9vbGVhbjtcclxuXHJcbiAgICBASW5wdXQoXCJmaWx0ZXJ3aGlsZXR5cGluZ1wiKVxyXG4gICAgcHVibGljIGZpbHRlcndoaWxldHlwaW5nOiBib29sZWFuO1xyXG5cclxuICAgIEBJbnB1dChcInJvd0RldGFpbGVySGVhZGVyc1wiKVxyXG4gICAgcHVibGljIHJvd0RldGFpbGVySGVhZGVyczogYW55O1xyXG5cclxuXHRAT3V0cHV0KCdvbmFjdGlvbicpXHJcblx0cHJpdmF0ZSBvbmFjdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0QE91dHB1dCgnb25jaGFuZ2UnKVxyXG5cdHByaXZhdGUgb25jaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBPdXRwdXQoJ29uZmlsdGVyJylcclxuXHRwcml2YXRlIG9uZmlsdGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHRAT3V0cHV0KCdvbkNlbGxDb250ZW50RWRpdCcpXHJcblx0cHJpdmF0ZSBvbkNlbGxDb250ZW50RWRpdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0QFZpZXdDaGlsZCgnZmxleGlibGUnLCB7c3RhdGljOiBmYWxzZX0pIHByaXZhdGUgdGFibGU6IFZpZXdDb250YWluZXJSZWY7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOkVsZW1lbnRSZWYpIHt9XHJcblxyXG5cclxuXHRwcml2YXRlIGZpbmRDb2x1bW5XaXRoSUQoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSB0aGlzLmhlYWRlckNvbHVtbkVsZW1lbnRzKCk7XHJcblx0XHRsZXQgY29sdW1uID0gbnVsbDtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAobGlzdFtpXS5nZXRBdHRyaWJ1dGUoXCJpZFwiKSA9PT0gaWQpIHtcclxuXHRcdFx0XHRjb2x1bW4gPSBsaXN0W2ldO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY29sdW1uO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBzd2FwQ29sdW1ucyhzb3VyY2U6IGFueSwgZGVzdGluYXRpb246IGFueSkge1xyXG5cclxuXHRcdGlmIChzb3VyY2Uubm9kZS5wYXJlbnROb2RlID09PSBkZXN0aW5hdGlvbi5ub2RlLnBhcmVudE5vZGUpIHtcclxuXHRcdFx0Y29uc3Qgc3JjSW5kZXggPSB0aGlzLmdldENvbHVtbkluZGV4KHNvdXJjZS5tZWRpdW0ua2V5KTtcclxuXHRcdFx0Y29uc3QgZGVzSW5kZXggPSB0aGlzLmdldENvbHVtbkluZGV4KGRlc3RpbmF0aW9uLm1lZGl1bS5rZXkpO1xyXG5cdFx0XHRpZiAoc3JjSW5kZXggPCAwIHx8IGRlc0luZGV4IDwgMCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiaW52YWxpZCBkcm9wIGlkXCIsIHNvdXJjZS5tZWRpdW0ua2V5LCBkZXN0aW5hdGlvbi5tZWRpdW0ua2V5KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Y29uc3QgeCA9IHRoaXMuZmlsdGVyZWRJdGVtcztcclxuXHRcdFx0dGhpcy5maWx0ZXJlZEl0ZW1zID0gW107XHJcblxyXG5cdFx0XHRzZXRUaW1lb3V0KCgpPT57XHJcblx0XHRcdFx0Y29uc3Qgc29iaiA9IHRoaXMuaGVhZGVyc1tzcmNJbmRleF07XHJcblx0XHRcdFx0dGhpcy5oZWFkZXJzW3NyY0luZGV4XSA9IHRoaXMuaGVhZGVyc1tkZXNJbmRleF07XHJcblx0XHRcdFx0dGhpcy5oZWFkZXJzW2Rlc0luZGV4XSA9IHNvYmo7XHJcblx0XHRcdFx0dGhpcy5maWx0ZXJlZEl0ZW1zID0geDtcclxuXHJcblx0XHRcdFx0dGhpcy5vbmZpbHRlci5lbWl0KHRoaXMuZmlsdGVyZWRJdGVtcyk7XHJcblx0XHRcdFx0dGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaGVhZGVycyk7XHJcblx0XHRcdH0sIDMzKTtcclxuXHRcclxuXHRcdH0gZWxzZSBpZiAoc291cmNlLm1lZGl1bS5sb2NrZWQgfHwgZGVzdGluYXRpb24ubWVkaXVtLmxvY2tlZCkge1xyXG5cdFx0XHRjb25zdCB4ID0gdGhpcy5maWx0ZXJlZEl0ZW1zO1xyXG5cdFx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSBbXTtcclxuXHRcdFx0dGhpcy5vbmZpbHRlci5lbWl0KHRoaXMuZmlsdGVyZWRJdGVtcyk7XHJcblx0XHRcdHNldFRpbWVvdXQoKCk9PntcclxuXHRcdFx0XHRzb3VyY2UubWVkaXVtLmxvY2tlZCA9ICFzb3VyY2UubWVkaXVtLmxvY2tlZDtcclxuXHRcdFx0XHRkZXN0aW5hdGlvbi5tZWRpdW0ubG9ja2VkID0gIWRlc3RpbmF0aW9uLm1lZGl1bS5sb2NrZWQ7XHJcblx0XHRcdFx0dGhpcy5maWx0ZXJlZEl0ZW1zID0geDtcclxuXHRcdFx0XHR0aGlzLm9uZmlsdGVyLmVtaXQodGhpcy5maWx0ZXJlZEl0ZW1zKTtcclxuXHRcdFx0XHR0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5oZWFkZXJzKTtcclxuXHRcdFx0fSwzMyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGdldENvbHVtbkluZGV4KGlkOiBzdHJpbmcpIHtcclxuXHRcdGxldCBpbmRleCA9IC0xO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlYWRlcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKHRoaXMuaGVhZGVyc1tpXS5rZXkgPT09IGlkKSB7XHJcblx0XHRcdFx0aW5kZXggPSBpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gaW5kZXg7XHJcblx0fVxyXG5cdHByaXZhdGUgaXRlbVZhbHVlKGl0ZW0sIGhwYXRoKSB7XHJcblx0XHRsZXQgc3ViaXRlbSA9IGl0ZW07XHJcblx0XHRocGF0aC5tYXAoIChzdWJrZXkpID0+IHtcclxuXHRcdFx0aWYgKHN1Yml0ZW0pIHtcclxuXHRcdFx0XHRzdWJpdGVtID0gc3ViaXRlbVtzdWJrZXldO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdFx0cmV0dXJuIHN1Yml0ZW0gPT09IHVuZGVmaW5lZCB8fCBzdWJpdGVtID09PSBudWxsIHx8IHN1Yml0ZW0gPT09IFwibnVsbFwiID8gXCJcIiA6IHN1Yml0ZW07XHJcblx0fVxyXG5cdGluaXRWaXNpYmxlUm93cyhmaWx0ZXJlZDogYW55W10pIHtcclxuXHRcdGNvbnN0IHJlc3VsdCA9IFtdO1xyXG5cdFx0Y29uc3QgbGlzdCA9IGZpbHRlcmVkID8gZmlsdGVyZWQgOiB0aGlzLmZpbHRlcmVkSXRlbXM7XHJcblx0XHRpZiAodGhpcy5wYWdlSW5mbykge1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRpZiAoaSA+PSB0aGlzLnBhZ2VJbmZvLmZyb20gJiYgaSA8PSB0aGlzLnBhZ2VJbmZvLnRvKSB7XHJcblx0XHRcdFx0XHRyZXN1bHQucHVzaChsaXN0W2ldKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5maWx0ZXJlZEl0ZW1zID0gcmVzdWx0O1xyXG5cdFx0fVxyXG5cdFx0aWYgKGZpbHRlcmVkKSB7XHJcblx0XHRcdHRoaXMub25maWx0ZXIuZW1pdCh0aGlzLmZpbHRlcmVkSXRlbXMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bG9jayhoZWFkZXI6IEZsZXhpYmxlVGFibGVIZWFkZXIsIGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHRcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0aGVhZGVyLmxvY2tlZCA9ICFoZWFkZXIubG9ja2VkO1xyXG5cdFx0dGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaGVhZGVycyk7XHJcblx0fVxyXG5cdHNvcnQoaGVhZGVyOiBGbGV4aWJsZVRhYmxlSGVhZGVyLCBpY29uKSB7XHJcblx0XHRpZiAoaGVhZGVyLnNvcnRhYmxlICYmIHRoaXMuaXRlbXMgJiYgdGhpcy5pdGVtcy5sZW5ndGgpIHtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlYWRlcnMubGVuZ3RoIDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoID0gdGhpcy5oZWFkZXJzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChoLmtleSAhPT0gaGVhZGVyLmtleSkge1xyXG5cdFx0XHRcdFx0Y29uc3QgaXRlbSA9IHRoaXMuZmluZENvbHVtbldpdGhJRChoLmtleSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKGl0ZW0pIHtcclxuXHRcdFx0XHRcdFx0aXRlbS5jbGFzc0xpc3QucmVtb3ZlKFwiYXNjZW5kaW5nXCIpO1xyXG5cdFx0XHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJkZXNjZW5kaW5nXCIpO1xyXG5cdFx0XHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5hZGQoXCJzb3J0YWJsZVwiKTtcclxuXHRcdFx0XHRcdH1cclxuICAgICAgICAgICAgICAgICAgICBoLmRlc2NlbmRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBoLmFzY2VuZGluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG4gICAgICAgICAgICBpY29uLmNsYXNzTGlzdC5yZW1vdmUoXCJmYS1zb3J0XCIpO1xyXG5cdFx0XHRpZiAoaGVhZGVyLmFzY2VuZGluZyB8fCAoIWhlYWRlci5hc2NlbmRpbmcgJiYgIWhlYWRlci5kZXNjZW5kaW5nKSkge1xyXG5cdFx0XHRcdGhlYWRlci5kZXNjZW5kaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHRoZWFkZXIuYXNjZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0aWNvbi5jbGFzc0xpc3QucmVtb3ZlKFwiZmEtc29ydC1hc2NcIik7XHJcblx0XHRcdFx0aWNvbi5jbGFzc0xpc3QuYWRkKFwiZmEtc29ydC1kZXNjXCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGhlYWRlci5kZXNjZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0aGVhZGVyLmFzY2VuZGluZyA9IHRydWU7XHJcblx0XHRcdFx0aWNvbi5jbGFzc0xpc3QucmVtb3ZlKFwiZmEtc29ydC1kZXNjXCIpO1xyXG5cdFx0XHRcdGljb24uY2xhc3NMaXN0LmFkZChcImZhLXNvcnQtYXNjXCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNvbnN0IGhwYXRoID0gaGVhZGVyLmtleS5zcGxpdChcIi5cIik7XHJcblx0XHRcdGxldCBmaWx0ZXJlZCA9IFtdO1xyXG5cdFx0XHRpZiAodGhpcy5lbmFibGVGaWx0ZXJpbmcpIHtcclxuXHRcdFx0XHRmaWx0ZXJlZCA9IHRoaXMuZmlsdGVySXRlbXMoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRmaWx0ZXJlZCA9IHRoaXMuaXRlbXMgPyB0aGlzLml0ZW1zIDogW107XHJcblx0XHRcdH1cclxuXHRcdFx0ZmlsdGVyZWQuc29ydCgoYSwgYikgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IHYxID0gdGhpcy5pdGVtVmFsdWUoYSwgaHBhdGgpO1xyXG5cdFx0XHRcdGNvbnN0IHYyID0gdGhpcy5pdGVtVmFsdWUoYiwgaHBhdGgpO1xyXG5cclxuXHRcdFx0XHRpZiAoaGVhZGVyLmFzY2VuZGluZykge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHYxID4gdjIgPyAxIDogLTE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiB2MSA8IHYyID8gMSA6IC0xO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0dGhpcy5zb3J0ZWRJdGVtcyA9IGZpbHRlcmVkO1xyXG5cdFx0XHR0aGlzLmluaXRWaXNpYmxlUm93cyhmaWx0ZXJlZCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRvZmZzZXRXaWR0aCgpIHtcclxuXHRcdHJldHVybiB0aGlzLnRhYmxlLmVsZW1lbnQubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aDtcclxuXHR9XHJcblxyXG5cdG5nT25DaGFuZ2VzKGNoYW5nZXM6YW55KSB7XHJcblx0XHQvLyBpZiAoY2hhbmdlcy5pdGVtcykge1xyXG5cdFx0Ly8gXHR0aGlzLmV2YWx1YXRlUm93cygpO1xyXG5cdFx0Ly8gfVxyXG5cdH1cclxuXHJcblx0bmdPbkluaXQoKSB7XHJcblx0XHRpZiAodGhpcy5wYWdlSW5mbykge1xyXG5cdFx0XHRpZiAoIXRoaXMucGFnZUluZm8udG8pIHtcclxuXHRcdFx0XHR0aGlzLnBhZ2VJbmZvLnRvID0gdGhpcy5wYWdlSW5mby5wYWdlU2l6ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5wYWdlSW5mbyA9IHsgXHJcbiAgICAgICAgICAgICAgICBjb250ZW50U2l6ZTogMTAwMDAwLCBcclxuICAgICAgICAgICAgICAgIHBhZ2VTaXplOiAxMDAwMDAsIFxyXG4gICAgICAgICAgICAgICAgcGFnZXM6IDEsIFxyXG4gICAgICAgICAgICAgICAgZnJvbTogMCwgXHJcbiAgICAgICAgICAgICAgICB0bzogMTAwMDAwLCBcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRQYWdlOiAxLCBcclxuICAgICAgICAgICAgICAgIG1heFdpZHRoOiBcIjBcIiBcclxuICAgICAgICAgICAgfTtcclxuXHRcdH1cclxuXHRcdGlmICghdGhpcy5oZWFkZXJzKSB7XHJcblx0XHRcdHRoaXMuaGVhZGVycyA9IFtdO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5ldmFsdWF0ZVJvd3MoKTtcclxuICAgICAgICBpZiAodGhpcy5hY3Rpb25LZXlzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aW9uS2V5cyA9IHRoaXMuYWN0aW9uS2V5cy5zcGxpdChcIixcIik7XHJcblx0XHR9XHJcblx0XHRpZiAoIXRoaXMucm93RGV0YWlsZXIgJiYgdGhpcy5leHBhbmRhYmxlKSB7XHJcblx0XHRcdHRoaXMucm93RGV0YWlsZXIgPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdFx0cmV0dXJuIHtkYXRhOiBpdGVtLCBoZWFkZXJzOiBbXX07XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHRpZiAoIXRoaXMuZXhwYW5kYWJsZSkge1xyXG5cdFx0XHR0aGlzLmV4cGFuZGFibGUgPSBmdW5jdGlvbihpdGVtLCBzaG93SWNvbikge3JldHVybiBzaG93SWNvbn07XHJcblx0XHR9XHJcblx0XHRpZiAoIXRoaXMucm93RGV0YWlsZXJIZWFkZXJzKSB7XHJcblx0XHRcdHRoaXMucm93RGV0YWlsZXJIZWFkZXJzID0gKGl0ZW0pID0+IFtdO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRldmFsdWF0ZVJvd3MoKSB7XHJcblx0XHRsZXQgZmlsdGVyZWQgPSBbXTtcclxuXHRcdGlmICh0aGlzLnNvcnRlZEl0ZW1zICYmIHRoaXMuc29ydGVkSXRlbXMubGVuZ3RoKSB7XHJcblx0XHRcdGZpbHRlcmVkID10aGlzLnNvcnRlZEl0ZW1zO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKHRoaXMuZW5hYmxlRmlsdGVyaW5nKSB7XHJcblx0XHRcdFx0ZmlsdGVyZWQgPSB0aGlzLmZpbHRlckl0ZW1zKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZmlsdGVyZWQgPSB0aGlzLml0ZW1zID8gdGhpcy5pdGVtcyA6IFtdO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aGlzLmluaXRWaXNpYmxlUm93cyhmaWx0ZXJlZCk7XHJcblx0fVxyXG5cclxuICAgIGhlYWRlckNvbHVtbkVsZW1lbnRzKCkge1xyXG5cdFx0bGV0IHJlc3VsdCA9IFtdO1xyXG5cclxuXHRcdGlmICh0aGlzLnRhYmxlLmVsZW1lbnQubmF0aXZlRWxlbWVudC5jaGlsZHJlbikge1xyXG5cdFx0XHRjb25zdCBsaXN0ID0gdGhpcy50YWJsZS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW47XHJcblx0XHRcdHJlc3VsdCA9IHRoaXMuY2FwdGlvbiA/IGxpc3RbMV0uY2hpbGRyZW5bMF0uY2hpbGRyZW4gOiBsaXN0WzBdLmNoaWxkcmVuWzBdLmNoaWxkcmVuO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcblx0aGVhZGVyQnlJZChpZCkge1xyXG5cdFx0bGV0IGg7XHJcblx0XHRmb3IgKGNvbnN0IGkgaW4gdGhpcy5oZWFkZXJzKSB7XHJcblx0XHRcdGlmICh0aGlzLmhlYWRlcnNbaV0ua2V5ID09PSBpZCkge1xyXG5cdFx0XHRcdGggPSB0aGlzLmhlYWRlcnNbaV07XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBoO1xyXG5cdH1cclxuXHJcbiAgICBjb2x1bW5zQ291bnQoKSB7XHJcblx0XHRsZXQgY291bnQgPSAwO1xyXG5cdFx0dGhpcy5oZWFkZXJzLm1hcCggKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0ucHJlc2VudCkge1xyXG4gICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgfVxyXG5cdFx0fSk7XHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb3VudDtcclxuXHR9XHJcblx0aG92ZXIoaXRlbSwgZmxhZykge1xyXG5cdFx0aWYgKGZsYWcpIHtcclxuXHRcdFx0aXRlbS5ob3ZlciA9IHRydWU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRkZWxldGUgaXRlbS5ob3ZlcjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHRvQ3NzQ2xhc3MoaGVhZGVyKSB7XHJcblx0XHRyZXR1cm4gaGVhZGVyLmtleS5yZXBsYWNlKC9cXC4vZywnLScpO1xyXG5cdH1cclxuICAgIGtleWRvd24oZXZlbnQsIGl0ZW0pIHtcclxuICAgICAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcbiAgICAgICAgaWYgKChjb2RlID09PSAxMykgfHwgKGNvZGUgPT09IDMyKSkge1xyXG5cdFx0XHRpdGVtLmNsaWNrKCk7XHJcblx0XHR9XHJcbiAgICB9XHJcbiAgICBvZmZTY3JlZW5NZXNzYWdlKGl0ZW0pIHtcclxuXHRcdGxldCBtZXNzYWdlOiBzdHJpbmcgPSB0aGlzLmFjdGlvbjtcclxuXHRcdGlmICh0aGlzLmFjdGlvbktleXMpIHtcclxuXHRcdFx0dGhpcy5hY3Rpb25LZXlzLm1hcCgoa2V5KSA9PiB7IG1lc3NhZ2UgPSBtZXNzYWdlLnJlcGxhY2Uoa2V5LCBpdGVtW2tleS5zdWJzdHJpbmcoMSwga2V5Lmxlbmd0aCAtIDEpXSk7IH0pXHJcblx0XHR9XHJcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgY2VsbENvbnRlbnQoaXRlbSwgaGVhZGVyKSB7XHJcblx0XHRsZXQgY29udGVudCA9IHRoaXMuaXRlbVZhbHVlKGl0ZW0sIGhlYWRlci5rZXkuc3BsaXQoXCIuXCIpKTtcclxuICAgICAgICByZXR1cm4gKGNvbnRlbnQgIT09IHVuZGVmaW5lZCAmJiBjb250ZW50ICE9IG51bGwgJiYgU3RyaW5nKGNvbnRlbnQpLmxlbmd0aCkgPyBjb250ZW50IDogJyZuYnNwOyc7XHJcblx0fVxyXG5cclxuXHRyb3dEZXRhaWxlckNvbnRleHQoaXRlbSkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZGF0YTogaXRlbSxcclxuXHRcdFx0dGFibGVJbmZvOiB0aGlzLnRhYmxlSW5mbyxcclxuXHRcdFx0aGVhZGVyczogdGhpcy5yb3dEZXRhaWxlckhlYWRlcnMoaXRlbSlcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRjaGFuZ2VGaWx0ZXIoZXZlbnQsIGhlYWRlcikge1xyXG4gICAgICAgIGNvbnN0IGNvZGUgPSBldmVudC53aGljaDtcclxuXHJcblx0XHRoZWFkZXIuZmlsdGVyID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG5cclxuXHRcdGlmICh0aGlzLmZpbHRlcndoaWxldHlwaW5nIHx8IGNvZGUgPT09IDEzKSB7XHJcblx0XHRcdGlmKHRoaXMuZmlsdGVyaW5nVGltZXJJZCkge1xyXG5cdFx0XHRcdGNsZWFyVGltZW91dCh0aGlzLmZpbHRlcmluZ1RpbWVySWQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuZmlsdGVyaW5nVGltZXJJZCA9IHNldFRpbWVvdXQoKCk9PntcclxuXHRcdFx0XHR0aGlzLmluaXRWaXNpYmxlUm93cyh0aGlzLmZpbHRlckl0ZW1zKCkpO1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVyaW5nVGltZXJJZCAgPSB1bmRlZmluZWQ7XHJcblx0XHRcdH0sIDEyMyk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGFjdGlvbkNsaWNrKGV2ZW50LCBpdGVtOiBhbnkpIHtcclxuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIGlmICh0aGlzLnJvd0RldGFpbGVyICYmICh0aGlzLmV4cGFuZElmIHx8IHRoaXMuZXhwYW5kYWJsZShpdGVtLCBmYWxzZSkpICkge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5leHBhbmRlZCkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIGl0ZW0uZXhwYW5kZWQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmV4cGFuZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMub25hY3Rpb24uZW1pdChpdGVtKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHByaW50KCkge1xyXG5cdFx0dGhpcy5wcmludE1vZGUgPSB0cnVlO1xyXG5cdFx0c2V0VGltZW91dCgoKT0+e1xyXG5cdFx0XHRjb25zdCBjb250ZW50ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmlubmVySFRNTDtcclxuXHRcdFx0Y29uc3Qgc3R5bGVzOiBhbnkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc3R5bGUnKTtcclxuXHRcdFx0dGhpcy5wcmludE1vZGUgPSBmYWxzZTtcclxuXHRcdFx0Y29uc3QgcG9wdXBXaW4gPSB3aW5kb3cub3BlbignJywgJ19ibGFuaycsICd3aWR0aD0zMDAsaGVpZ2h0PTMwMCcpO1xyXG5cdFx0XHRsZXQgY29waWVkQ29udGVudCA9ICc8aHRtbD4nO1xyXG5cdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0Y29waWVkQ29udGVudCArPSBzdHlsZXNbaV0ub3V0ZXJIVE1MO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNvcGllZENvbnRlbnQgKz0gJzxib2R5IG9ubG9hZD1cIndpbmRvdy5wcmludCgpXCI+JyArIGNvbnRlbnQgKyAnPC9odG1sPic7XHJcblxyXG5cdFx0XHJcblx0XHRcdHBvcHVwV2luLmRvY3VtZW50Lm9wZW4oKTtcclxuICAgICAgICBcdHBvcHVwV2luLmRvY3VtZW50LndyaXRlKGNvcGllZENvbnRlbnQpO1xyXG4gICAgICAgIFx0cG9wdXBXaW4uZG9jdW1lbnQuY2xvc2UoKTtcclxuXHRcdH0sMyk7XHJcblx0fVxyXG5cclxuXHQvLyA8NSwgITUsID41LCAqRSwgRSosICpFKlxyXG5cdHByaXZhdGUgc2hvdWxkU2tpcEl0ZW0odmFsdWUsIGZpbHRlckJ5KSB7XHJcblx0XHRsZXQgcmVzdWx0ID0gZmFsc2U7XHJcblxyXG5cdFx0aWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwgJiYgU3RyaW5nKHZhbHVlKS5sZW5ndGgpIHtcclxuXHRcdFx0Y29uc3QgdiA9IFN0cmluZyh2YWx1ZSk7XHJcblx0XHRcdGlmIChmaWx0ZXJCeVswXSA9PT0gJzwnKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gZmlsdGVyQnkubGVuZ3RoID4gMSAmJiBwYXJzZUZsb2F0KHYpID49IHBhcnNlRmxvYXQoZmlsdGVyQnkuc3Vic3RyaW5nKDEpKTtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWx0ZXJCeVswXSA9PT0gJz4nKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gZmlsdGVyQnkubGVuZ3RoID4gMSAmJiBwYXJzZUZsb2F0KHYpIDw9IHBhcnNlRmxvYXQoZmlsdGVyQnkuc3Vic3RyaW5nKDEpKTtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWx0ZXJCeVswXSA9PT0gJyEnKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gZmlsdGVyQnkubGVuZ3RoID4gMSAmJiBwYXJzZUZsb2F0KHYpID09IHBhcnNlRmxvYXQoZmlsdGVyQnkuc3Vic3RyaW5nKDEpKTtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWx0ZXJCeVswXSA9PT0gJz0nKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gZmlsdGVyQnkubGVuZ3RoID09IDEgfHwgcGFyc2VGbG9hdCh2KSAhPT0gcGFyc2VGbG9hdChmaWx0ZXJCeS5zdWJzdHJpbmcoMSkpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGZpbHRlckJ5WzBdID09PSAnKicgJiYgZmlsdGVyQnlbZmlsdGVyQnkubGVuZ3RoLTFdICE9PSAnKicpIHtcclxuXHRcdFx0XHRjb25zdCBmID0gZmlsdGVyQnkuc3Vic3RyaW5nKDEpO1xyXG5cdFx0XHRcdHJlc3VsdCA9IHYuaW5kZXhPZihmKSAhPT0gdi5sZW5ndGggLSBmLmxlbmd0aFxyXG5cdFx0XHR9IGVsc2UgaWYgKGZpbHRlckJ5WzBdICE9PSAnKicgJiYgZmlsdGVyQnlbZmlsdGVyQnkubGVuZ3RoLTFdID09PSAnKicpIHtcclxuXHRcdFx0XHRjb25zdCBmID0gZmlsdGVyQnkuc3Vic3RyaW5nKDAsIGZpbHRlckJ5Lmxlbmd0aC0xKTtcclxuXHRcdFx0XHRyZXN1bHQgPSB2LmluZGV4T2YoZikgIT09IDA7XHJcblx0XHRcdH0gZWxzZSBpZiAoZmlsdGVyQnlbMF0gPT09ICcqJyAmJiBmaWx0ZXJCeVtmaWx0ZXJCeS5sZW5ndGgtMV0gPT09ICcqJykge1xyXG5cdFx0XHRcdHJlc3VsdCA9IGZpbHRlckJ5Lmxlbmd0aCA+IDEgJiYgdi5pbmRleE9mKCBmaWx0ZXJCeS5zdWJzdHJpbmcoMSwgZmlsdGVyQnkubGVuZ3RoLTEpICkgPCAwO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJlc3VsdCA9IHYuaW5kZXhPZihmaWx0ZXJCeSkgPCAwO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH1cclxuXHRmaWx0ZXJJdGVtcygpIHtcclxuXHRcdHJldHVybiB0aGlzLml0ZW1zID8gdGhpcy5pdGVtcy5maWx0ZXIoKGl0ZW0pID0+IHtcclxuXHRcdFx0bGV0IGtlZXBJdGVtID0gdHJ1ZTtcclxuXHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWFkZXJzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0Y29uc3QgaGVhZGVyID0gdGhpcy5oZWFkZXJzW2ldO1xyXG5cdFx0XHRcdGlmIChoZWFkZXIuZmlsdGVyICYmIGhlYWRlci5maWx0ZXIubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRjb25zdCB2ID0gdGhpcy5pdGVtVmFsdWUoaXRlbSwgaGVhZGVyLmtleS5zcGxpdChcIi5cIikpO1xyXG5cclxuXHRcdFx0XHRcdGlmICh0aGlzLnNob3VsZFNraXBJdGVtKHYsaGVhZGVyLmZpbHRlcikpIHtcclxuXHRcdFx0XHRcdFx0a2VlcEl0ZW0gPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBrZWVwSXRlbTtcclxuXHRcdH0pIDogW107XHJcblx0fVxyXG5cclxuXHRvblRhYmxlQ2VsbEVkaXQoZXZlbnQpIHtcclxuXHRcdGNvbnN0IGlkID0gZXZlbnQuaWQuc3BsaXQoXCItXCIpO1xyXG5cdFx0Y29uc3QgbiA9IGV2ZW50Lm5hbWU7XHJcblx0XHRjb25zdCB2PSBldmVudC52YWx1ZTtcclxuXHRcdGNvbnN0IHQgPSB0aGlzLml0ZW1zW3BhcnNlSW50KGlkWzFdKV07XHJcblxyXG5cdFx0aWYgKHQpIHtcclxuXHRcdFx0Y29uc3QgbGlzdCA9IGlkWzBdLnNwbGl0KFwiLlwiKTtcclxuXHRcdFx0bGV0IHN1Yml0ZW0gPSB0W2xpc3RbMF1dO1xyXG5cdFx0XHRmb3IobGV0IGkgPSAxOyBpIDwgKGxpc3QubGVuZ3RoIC0gMSk7IGkrKykge1xyXG5cdFx0XHRcdHN1Yml0ZW0gPSBzdWJpdGVtW2xpc3RbaV1dXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHN1Yml0ZW0gJiYgbGlzdC5sZW5ndGggPiAxKXtcclxuXHRcdFx0XHRzdWJpdGVtW2xpc3RbbGlzdC5sZW5ndGggLSAxXV0gPSB2O1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMub25DZWxsQ29udGVudEVkaXQuZW1pdCh7bmFtZTogbiwgdmFsdWU6IHYsIGl0ZW06IHR9KTtcclxuXHRcdH1cclxuICAgIH1cclxuXHJcblx0ZHJhZ0VuYWJsZWQoZXZlbnQ6IERyYWdFdmVudCkge1xyXG5cdFx0cmV0dXJuIGV2ZW50Lm1lZGl1bS5kcmFnYWJsZTtcclxuXHR9XHJcblx0ZHJvcEVuYWJsZWQoZXZlbnQ6IERyb3BFdmVudCkge1xyXG5cdFx0cmV0dXJuIGV2ZW50LmRlc3RpbmF0aW9uLm1lZGl1bS5kcmFnYWJsZTtcclxuXHR9XHJcblx0b25EcmFnU3RhcnQoZXZlbnQ6IERyYWdFdmVudCl7XHJcbi8vICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcclxuXHR9XHJcblx0b25EcmFnRW5kKGV2ZW50OiBEcmFnRXZlbnQpe1xyXG4gLy8gICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xyXG5cdH1cclxuXHRvbkRyb3AoZXZlbnQ6RHJvcEV2ZW50KXtcclxuXHRcdHRoaXMuc3dhcENvbHVtbnMoZXZlbnQuc291cmNlLCBldmVudC5kZXN0aW5hdGlvbik7XHJcblx0fVxyXG59XHJcbiJdfQ==