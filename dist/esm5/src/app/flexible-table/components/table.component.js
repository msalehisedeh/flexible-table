import * as tslib_1 from "tslib";
/*
* Provides rendering of a table which is using the given FlexibleTableHeader set in
* order to tabulate the given data. As per definition of earch header component,
* a column could be hidden, sortable, or draggable. Each table row can expand/collapse
* or respond to a click action.
*/
import { Component, Input, Output, ViewChild, ViewContainerRef, OnInit, OnChanges, EventEmitter, ElementRef } from '@angular/core';
var TableViewComponent = /** @class */ (function () {
    function TableViewComponent(el) {
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
        this.headerSeparation = true;
        this.tableClass = 'default-flexible-table';
        this.onaction = new EventEmitter();
        this.onchange = new EventEmitter();
        this.onfilter = new EventEmitter();
        this.onCellContentEdit = new EventEmitter();
    }
    TableViewComponent.prototype.findColumnWithID = function (id) {
        var list = this.headerColumnElements();
        var column = null;
        for (var i = 0; i < list.length; i++) {
            if (list[i].getAttribute("id") === id) {
                column = list[i];
                break;
            }
        }
        return column;
    };
    TableViewComponent.prototype.swapColumns = function (source, destination) {
        var _this = this;
        if (source.node.parentNode === destination.node.parentNode) {
            var srcIndex_1 = this.getColumnIndex(source.medium.key);
            var desIndex_1 = this.getColumnIndex(destination.medium.key);
            if (srcIndex_1 < 0 || desIndex_1 < 0) {
                console.log("invalid drop id", source.medium.key, destination.medium.key);
                return;
            }
            var x_1 = this.filteredItems;
            this.filteredItems = [];
            setTimeout(function () {
                var sobj = _this.headers[srcIndex_1];
                _this.headers[srcIndex_1] = _this.headers[desIndex_1];
                _this.headers[desIndex_1] = sobj;
                _this.filteredItems = x_1;
                _this.onfilter.emit(_this.filteredItems);
                _this.onchange.emit(_this.headers);
            }, 33);
        }
        else if (source.medium.locked || destination.medium.locked) {
            var x_2 = this.filteredItems;
            this.filteredItems = [];
            this.onfilter.emit(this.filteredItems);
            setTimeout(function () {
                source.medium.locked = !source.medium.locked;
                destination.medium.locked = !destination.medium.locked;
                _this.filteredItems = x_2;
                _this.onfilter.emit(_this.filteredItems);
                _this.onchange.emit(_this.headers);
            }, 33);
        }
    };
    TableViewComponent.prototype.getColumnIndex = function (id) {
        var index = -1;
        for (var i = 0; i < this.headers.length; i++) {
            if (this.headers[i].key === id) {
                index = i;
                break;
            }
        }
        return index;
    };
    TableViewComponent.prototype.itemValue = function (item, hpath) {
        var subitem = item;
        hpath.map(function (subkey) {
            if (subitem) {
                subitem = subitem[subkey];
            }
        });
        return subitem === undefined || subitem === null || subitem === "null" ? "" : subitem;
    };
    TableViewComponent.prototype.initVisibleRows = function (filtered) {
        var result = [];
        var list = filtered ? filtered : this.filteredItems;
        if (this.pageInfo) {
            for (var i = 0; i < list.length; i++) {
                if (i >= this.pageInfo.from && i <= this.pageInfo.to) {
                    result.push(list[i]);
                }
            }
            this.filteredItems = result;
        }
        if (filtered) {
            this.onfilter.emit(this.filteredItems);
        }
    };
    TableViewComponent.prototype.lock = function (header, event) {
        event.stopPropagation();
        event.preventDefault();
        header.locked = !header.locked;
        this.onchange.emit(this.headers);
    };
    TableViewComponent.prototype.sort = function (header, icon) {
        var _this = this;
        if (header.sortable && this.items && this.items.length) {
            for (var i = 0; i < this.headers.length; i++) {
                var h = this.headers[i];
                if (h.key !== header.key) {
                    var item = this.findColumnWithID(h.key);
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
            var hpath_1 = header.key.split(".");
            var filtered = [];
            if (this.enableFiltering) {
                filtered = this.filterItems();
            }
            else {
                filtered = this.items ? this.items : [];
            }
            filtered.sort(function (a, b) {
                var v1 = _this.itemValue(a, hpath_1);
                var v2 = _this.itemValue(b, hpath_1);
                if (header.ascending) {
                    return v1 > v2 ? 1 : -1;
                }
                return v1 < v2 ? 1 : -1;
            });
            this.sortedItems = filtered;
            this.initVisibleRows(filtered);
        }
    };
    TableViewComponent.prototype.offsetWidth = function () {
        return this.table.nativeElement.offsetWidth;
    };
    TableViewComponent.prototype.ngOnChanges = function (changes) {
        // if (changes.items) {
        // 	this.evaluateRows();
        // }
    };
    TableViewComponent.prototype.ngOnInit = function () {
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
            this.rowDetailerHeaders = function (item) { return []; };
        }
    };
    TableViewComponent.prototype.evaluateRows = function () {
        var filtered = [];
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
    };
    TableViewComponent.prototype.headerColumnElements = function () {
        var result = [];
        if (this.table.nativeElement.children) {
            var list = this.table.nativeElement.children;
            result = this.caption ? list[1].children[0].children : list[0].children[0].children;
        }
        return result;
    };
    TableViewComponent.prototype.headerById = function (id) {
        var h;
        for (var i in this.headers) {
            if (this.headers[i].key === id) {
                h = this.headers[i];
                break;
            }
        }
        return h;
    };
    TableViewComponent.prototype.columnsCount = function () {
        var count = 0;
        this.headers.map(function (item) {
            if (item.present) {
                count++;
            }
        });
        if (this.action) {
            count++;
        }
        return count;
    };
    TableViewComponent.prototype.hover = function (item, flag) {
        if (flag) {
            item.hover = true;
        }
        else {
            delete item.hover;
        }
    };
    TableViewComponent.prototype.toCssClass = function (header) {
        return header.key.replace(/\./g, '-');
    };
    TableViewComponent.prototype.keydown = function (event, item) {
        var code = event.which;
        if ((code === 13) || (code === 32)) {
            item.click();
        }
    };
    TableViewComponent.prototype.offScreenMessage = function (item) {
        var message = this.action;
        if (this.actionKeys) {
            this.actionKeys.map(function (key) { message = message.replace(key, item[key.substring(1, key.length - 1)]); });
        }
        return message;
    };
    TableViewComponent.prototype.cellContent = function (item, header) {
        var content = this.itemValue(item, header.key.split("."));
        return (content !== undefined && content != null && String(content).length) ? content : '&nbsp;';
    };
    TableViewComponent.prototype.rowDetailerContext = function (item) {
        return {
            data: item,
            tableInfo: this.tableInfo,
            headers: this.rowDetailerHeaders(item)
        };
    };
    TableViewComponent.prototype.changeFilter = function (event, header) {
        var _this = this;
        var code = event.which;
        header.filter = event.target.value;
        if (this.filterwhiletyping || code === 13) {
            if (this.filteringTimerId) {
                clearTimeout(this.filteringTimerId);
            }
            this.filteringTimerId = setTimeout(function () {
                _this.initVisibleRows(_this.filterItems());
                _this.filteringTimerId = undefined;
            }, 123);
        }
    };
    TableViewComponent.prototype.actionClick = function (event, item) {
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
    };
    TableViewComponent.prototype.print = function () {
        var _this = this;
        this.printMode = true;
        setTimeout(function () {
            var content = _this.el.nativeElement.innerHTML;
            var styles = document.getElementsByTagName('style');
            _this.printMode = false;
            var popupWin = window.open('', '_blank', 'width=300,height=300');
            var copiedContent = '<html>';
            for (var i = 0; i < styles.length; i++) {
                copiedContent += styles[i].outerHTML;
            }
            copiedContent += '<body onload="window.print()">' + content + '</html>';
            popupWin.document.open();
            popupWin.document.write(copiedContent);
            popupWin.document.close();
        }, 3);
    };
    // <5, !5, >5, *E, E*, *E*
    TableViewComponent.prototype.shouldSkipItem = function (value, filterBy) {
        var result = false;
        if (value !== undefined && value !== null && String(value).length) {
            var v = String(value);
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
                var f = filterBy.substring(1);
                result = v.indexOf(f) !== v.length - f.length;
            }
            else if (filterBy[0] !== '*' && filterBy[filterBy.length - 1] === '*') {
                var f = filterBy.substring(0, filterBy.length - 1);
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
    };
    TableViewComponent.prototype.filterItems = function () {
        var _this = this;
        return this.items ? this.items.filter(function (item) {
            var keepItem = true;
            for (var i = 0; i < _this.headers.length; i++) {
                var header = _this.headers[i];
                if (header.filter && header.filter.length) {
                    var v = _this.itemValue(item, header.key.split("."));
                    if (_this.shouldSkipItem(v, header.filter)) {
                        keepItem = false;
                        break;
                    }
                }
            }
            return keepItem;
        }) : [];
    };
    TableViewComponent.prototype.onTableCellEdit = function (event) {
        var id = event.id.split("-");
        var n = event.name;
        var v = event.value;
        var t = this.items[parseInt(id[1])];
        if (t) {
            var list = id[0].split(".");
            var subitem = t[list[0]];
            for (var i = 1; i < (list.length - 1); i++) {
                subitem = subitem[list[i]];
            }
            if (subitem && list.length > 1) {
                subitem[list[list.length - 1]] = v;
            }
            this.onCellContentEdit.emit({ name: n, value: v, item: t });
        }
    };
    TableViewComponent.prototype.dragEnabled = function (event) {
        return event.medium.dragable;
    };
    TableViewComponent.prototype.dropEnabled = function (event) {
        return event.destination.medium.dragable;
    };
    TableViewComponent.prototype.onDragStart = function (event) {
        //        this.dragging = true;
    };
    TableViewComponent.prototype.onDragEnd = function (event) {
        //       this.dragging = false;
    };
    TableViewComponent.prototype.onDrop = function (event) {
        this.swapColumns(event.source, event.destination);
    };
    TableViewComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    tslib_1.__decorate([
        Input("vocabulary")
    ], TableViewComponent.prototype, "vocabulary", void 0);
    tslib_1.__decorate([
        Input()
    ], TableViewComponent.prototype, "headerSeparation", void 0);
    tslib_1.__decorate([
        Input()
    ], TableViewComponent.prototype, "lockable", void 0);
    tslib_1.__decorate([
        Input()
    ], TableViewComponent.prototype, "caption", void 0);
    tslib_1.__decorate([
        Input()
    ], TableViewComponent.prototype, "action", void 0);
    tslib_1.__decorate([
        Input()
    ], TableViewComponent.prototype, "pageInfo", void 0);
    tslib_1.__decorate([
        Input()
    ], TableViewComponent.prototype, "actionKeys", void 0);
    tslib_1.__decorate([
        Input()
    ], TableViewComponent.prototype, "tableClass", void 0);
    tslib_1.__decorate([
        Input()
    ], TableViewComponent.prototype, "headers", void 0);
    tslib_1.__decorate([
        Input()
    ], TableViewComponent.prototype, "items", void 0);
    tslib_1.__decorate([
        Input()
    ], TableViewComponent.prototype, "tableInfo", void 0);
    tslib_1.__decorate([
        Input()
    ], TableViewComponent.prototype, "enableIndexing", void 0);
    tslib_1.__decorate([
        Input()
    ], TableViewComponent.prototype, "enableFiltering", void 0);
    tslib_1.__decorate([
        Input()
    ], TableViewComponent.prototype, "rowDetailer", void 0);
    tslib_1.__decorate([
        Input()
    ], TableViewComponent.prototype, "expandable", void 0);
    tslib_1.__decorate([
        Input()
    ], TableViewComponent.prototype, "expandIf", void 0);
    tslib_1.__decorate([
        Input()
    ], TableViewComponent.prototype, "filterwhiletyping", void 0);
    tslib_1.__decorate([
        Input()
    ], TableViewComponent.prototype, "rowDetailerHeaders", void 0);
    tslib_1.__decorate([
        Output()
    ], TableViewComponent.prototype, "onaction", void 0);
    tslib_1.__decorate([
        Output()
    ], TableViewComponent.prototype, "onchange", void 0);
    tslib_1.__decorate([
        Output()
    ], TableViewComponent.prototype, "onfilter", void 0);
    tslib_1.__decorate([
        Output()
    ], TableViewComponent.prototype, "onCellContentEdit", void 0);
    tslib_1.__decorate([
        ViewChild('flexible', { static: false })
    ], TableViewComponent.prototype, "table", void 0);
    TableViewComponent = tslib_1.__decorate([
        Component({
            selector: 'table-view',
            template: "\r\n<table [class]=\"tableClass\"  #flexible>\r\n    <caption *ngIf=\"caption\" [textContent]=\"caption\"></caption>\r\n    <thead>\r\n        <tr>\r\n            <th scope=\"col\" *ngIf=\"enableIndexing && !printMode\" id=\"indexable\" class=\"indexable hide-on-print\"></th>\r\n            <th scope=\"col\" *ngFor=\"let header of headers; let hh = index\" #th\r\n                [dragEnabled]=\"dragEnabled.bind(this)\"\r\n                [dropEnabled]=\"dropEnabled.bind(this)\"\r\n                [medium]=\"header\"\r\n                (onDragStart)=\"onDragStart($event)\"\r\n                (onDragEnd)=\"onDragEnd($event)\"\r\n                (onDrop)=\"onDrop($event)\"\r\n                [id]=\"header.key\"\r\n                [attr.width]=\"header.width ? header.width : null\" \r\n                [style.min-width]=\"header.minwidth ? header.minwidth : ''\" \r\n                [attr.tabindex]=\"header.sortable ? 0 : -1\"\r\n                [class.hide-on-print]=\"header.hideOnPrint\"\r\n                [class.distict]=\"headerSeparation && hh < (headers.length -1)\"\r\n                (keydown)=\"keydown($event, th)\" (click)=\"sort(header, icon)\">\r\n                <span \r\n                    *ngIf=\"!printMode && header.sortable\" \r\n                    class=\"off-screen\"  \r\n                    [textContent]=\"vocabulary.clickSort\"></span>\r\n                <span class=\"locker icon fa\" #locker\r\n                    *ngIf=\"!printMode && lockable && (headers.length > 1 || header.locked)\"\r\n                    tabindex=\"0\"\r\n                    title=\"lock/unlock this column\"\r\n                    (keydown)=\"keydown($event, locker)\" (click)=\"lock(header, $event)\"\r\n                    [class.fa-lock]=\"header.locked\"\r\n                    [class.fa-unlock]=\"!header.locked\"></span>\r\n                <span class=\"title\"\r\n                    [class.lockable]=\"lockable\"\r\n                    [class.dragable]=\"header.dragable\"\r\n                    [textContent]=\"header.value\"></span>\r\n                <span class=\"icon fa\" [class.hidden]=\"printMode || !items || items.length === 0\" #icon\r\n                    [class.fa-sort]=\"header.sortable\"\r\n                    [class.fa-sort-asc]=\"header.assending\"\r\n                    [class.fa-sort-desc]=\"header.desending\"></span>\r\n            </th>\r\n            <th scope=\"col\" *ngIf=\"action && !printMode\" id=\"actionable\" class=\"actionable hide-on-print\"></th>\r\n        </tr>\r\n    </thead>\r\n    <tbody>\r\n        <tr *ngIf=\"!printMode && enableFiltering && items && items.length\" class=\"hide-on-print\">\r\n            <td scope=\"row\" *ngIf=\"enableIndexing && !printMode\" class=\"index filter hide-on-print\">\r\n                <input type=\"text\" disabled style=\"opacity:0\" />\r\n            </td>\r\n            <td scope=\"row\" \r\n                        *ngFor=\"let header of headers; let i=index\" \r\n                        [attr.data-label]=\"header.value\" \r\n                        [class.hide-on-print]=\"header.hideOnPrint\"\r\n                        class=\"filter\">\r\n                <span *ngIf=\"header.filter === undefined\">&nbsp;</span>\r\n                <input  *ngIf=\"header.filter !== undefined\"\r\n                        id=\"filter-{{i}}\"\r\n                        type=\"text\" \r\n                        (keyup)=\"changeFilter($event, header)\"\r\n                        [value]=\"header.filter ? header.filter : ''\" />\r\n                <label *ngIf=\"header.filter !== undefined\" for=\"filter-{{i}}\" ><span class=\"off-screen\" >Filter \"{{header.value}}\"</span><span class=\"fa fa-search\"></span></label>\r\n            </td>\r\n            <td scope=\"row\" *ngIf=\"action && !printMode\" class=\"hide-on-print\"></td>\r\n        </tr>\r\n       <ng-template ngFor let-item [ngForOf]=\"printMode ? items: filteredItems\" let-i=\"index\">\r\n            <tr (click)=\"actionClick($event, item)\"\r\n                (mouseover)=\"hover(item, true)\"\r\n                (mouseout)=\"hover(item, false)\"\r\n                [class.pointer]=\"action\"\r\n                [class.hover]=\"item.hover\"\r\n                [class.expanded]=\"item.expanded\"\r\n                [class.odd]=\"i%2\">\r\n                <td scope=\"row\" class=\"index hide-on-print\" *ngIf=\"enableIndexing && !printMode\">\r\n                    <span [textContent]=\"i + pageInfo.from + 1\"></span>\r\n                </td>\r\n                <td scope=\"row\" \r\n                    *ngFor=\"let header of headers\" \r\n                    [class]=\"toCssClass(header)\"\r\n                    [class.hide-on-print]=\"header.hideOnPrint\"\r\n                    [attr.data-label]=\"header.value\" \r\n                    [intoName]=\"header.value\"\r\n                    [intoId]=\"header.key + '-' + i\"\r\n                    [into]=\"header.format\"\r\n                    [intoData]=\"item\"\r\n                    [rawContent]=\"cellContent(item, header)\"\r\n                    [onComponentChange]=\"onTableCellEdit.bind(this)\"></td>\r\n                <td scope=\"row\" *ngIf=\"action && !printMode\" class=\"hide-on-print\">\r\n                    <a class=\"actionable\"\r\n                        *ngIf=\"expandable(item, true)\"\r\n                        tabindex=\"0\"\r\n                        role=\"button\"\r\n                        style=\"cursor:pointer\"\r\n                        [class.expanded]=\"item.expanded\" #clicker\r\n                        (keydown)=\"keydown($event, clicker)\" (click)=\"actionClick($event, item)\">\r\n                        <span\r\n                            class=\"icon fa\"\r\n                            [class.fa-angle-right]=\"!rowDetailer\"\r\n                            [class.fa-minus-square-o]=\"rowDetailer && item.expanded\"\r\n                            [class.fa-plus-square-o]=\"rowDetailer && !item.expanded\"\r\n                            aria-hidden=\"true\"></span>\r\n                        <span class=\"off-screen\" [textContent]=\"offScreenMessage(item)\"></span>\r\n                    </a>\r\n                </td>\r\n            </tr>\r\n            <tr *ngIf=\"rowDetailer && item.expanded\" class=\"detail\" [class.odd]=\"i%2\">\r\n                <td scope=\"row\" class=\"index\" *ngIf=\"enableIndexing && !printMode\"></td>\r\n                <td [attr.colspan]=\"columnsCount()\">\r\n                    <ng-container [ngTemplateOutlet]=\"rowDetailer\" [ngTemplateOutletContext]=\"rowDetailerContext(item)\"></ng-container>\r\n                </td>\r\n            </tr>\r\n        </ng-template>\r\n    </tbody>\r\n</table>\r\n",
            styles: [":host{display:inline-block!important;width:100%;position:relative;margin:0 auto;border-spacing:0;border-collapse:collapse}:host .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host table{margin:1rem auto;padding:0;width:100%;table-layout:fixed;max-width:99%;background-color:transparent;border-collapse:collapse}:host table caption{background-color:#c3e5e2;border-radius:2px;color:#1b1b1b;caption-side:top;font-size:14px;padding:5px 6px;margin-bottom:15px;text-align:left}:host table thead{border-top:1px solid #bbb;border-bottom:1px solid #bbb;background-color:#eee}:host table tr{border:0}:host table tr.expanded td{font-weight:700}:host table td{padding-left:3px;min-height:21px;overflow:hidden}:host table td span:first-child{min-height:21px;display:block}:host table td:first-child{padding-left:5px}:host table td ::ng-deep input-component .locked,:host table td ::ng-deep input-component input{width:99%}:host table td .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host table td.filter{padding:0;position:relative}:host table td.filter input{box-sizing:border-box;width:100%;margin:0}:host table td.filter .fa{position:absolute;top:4px;right:2px;color:#bad}:host table td ::ng-deep img{height:24px}:host table td.index{background-color:#eee;border-right:1px solid #bbb}:host table td.index span{padding:1px 0}:host table th{cursor:default;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none;height:24px;position:relative;white-space:nowrap;font-weight:400;text-transform:uppercase;font-size:14px;padding-top:6px;padding-bottom:6px;text-align:left;padding-left:5px}:host table th.drag-over{background-color:#9b9b9b}:host table th.drag-over .icon,:host table th.drag-over .title{color:#eee}:host table th:first-child{padding-left:5px}:host table th.distict{border-right:1px solid #ccc}:host table th.distict:last-child{border-right:0}:host table th.ascending,:host table th.descending,:host table th.sortable{cursor:pointer;min-height:12px}:host table th.indexable{width:33px}:host table th.actionable{width:24px}:host table th .hidden{display:none}:host table th .title{color:#254a4d;display:inline-block;height:20px;float:left;width:calc(90% - 22px)!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}:host table th .title.dragable{width:auto}:host table th .title.lockable{width:calc(90% - 46px)!important}:host table th .dragable{cursor:move}:host table th .icon{width:22px;display:inline-block;height:20px;color:#254a4d;float:right}:host table th .locker{float:left}:host .fa.fa-angle-right{font-size:18px}table tr.expanded td{border-bottom:0}table tr.detail td{border-top:0;cursor:default}table tr.expanded td a.expanded{background-position:right 2px}table tbody tr.hover,table tbody tr:hover{background-color:#ffeed2}table tbody tr.detail.hover,table tbody tr.detail.hover td table thead tr,table tbody tr.detail:hover,table tbody tr.detail:hover td table thead tr{background-color:inherit}table tr td a.actionable{color:#254a4d}table tr td a.actionable .icon{line-height:22px;text-align:right}table tbody tr.detail.hover td:last-child,table tbody tr.detail:hover td:last-child{border-right:0}table tbody tr.detail.hover td:first-child,table tbody tr.detail:hover td:first-child{border-left:0}table tr td{border-bottom:1px solid #b1b3b3;color:#254a5d;font-size:15px;text-transform:capitalize}table tbody tr.pointer{cursor:pointer}table.alert-danger{border:0}table.alert-danger caption{background-color:transparent;font-weight:700;margin-bottom:0}table.alert-danger td{border-bottom:0;display:block}table.alert-danger td:first-child{padding-left:0}table.alert-danger td:last-child{border-bottom:0}table.alert-danger td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase;width:40%;text-align:left;overflow:hidden;text-overflow:ellipsis}table.alert-danger td a span.icon{width:100%}table.alert-danger thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}table.alert-danger tr{border:2px solid #fff;display:block;margin-bottom:.625em;padding:5px;border-radius:5px}table.alert-danger tr th.actionable{width:inherit}table.alert-danger tr td{border-bottom:0}@media print{table td,table th{text-align:left}table td .icon,table th .icon{display:none!important}table td.hide-on-print,table th.hide-on-print,table tr.hide-on-print{display:none}}@media screen and (max-width:600px){table{border:0}table th.indexable{display:none}table td{border-bottom:0;display:block;text-align:right}table td.index{display:none}table td:first-child{padding-left:0}table td:last-child{border-bottom:0}table td.filter input{width:50%!important}table td.filter .fa{right:7px!important}table td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase}table td a span.icon{width:100%}table td ::ng-deep .into{float:right!important}table td ::ng-deep .into .calendar{margin-right:0}table td ::ng-deep .into .popper{margin-right:0}table thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}table tr{border-bottom:3px solid #ddd;display:block;margin-bottom:.625em}table tr th.actionable{width:inherit}table tr td{border-bottom:0}table.alert-danger td:before{width:inherit}}"]
        })
    ], TableViewComponent);
    return TableViewComponent;
}());
export { TableViewComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlZGVoL2ZsZXhpYmxlLXRhYmxlLyIsInNvdXJjZXMiOlsic3JjL2FwcC9mbGV4aWJsZS10YWJsZS9jb21wb25lbnRzL3RhYmxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7O0VBS0U7QUFDRixPQUFPLEVBQ0gsU0FBUyxFQUNaLEtBQUssRUFDTCxNQUFNLEVBQ04sU0FBUyxFQUNULGdCQUFnQixFQUNoQixNQUFNLEVBQ04sU0FBUyxFQUNULFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxlQUFlLENBQUM7QUEwQnZCO0lBMkNJLDRCQUFtQixFQUFhO1FBQWIsT0FBRSxHQUFGLEVBQUUsQ0FBVztRQTFDbkMsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLGtCQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ25CLGdCQUFXLEdBQUcsRUFBRSxDQUFDO1FBSVAsZUFBVSxHQUFHO1lBQ3RCLGNBQWMsRUFBRSxpQkFBaUI7WUFDakMsZ0JBQWdCLEVBQUUsbUJBQW1CO1lBQ3JDLFNBQVMsRUFBRSxlQUFlO1lBQzFCLE9BQU8sRUFBRSxVQUFVO1lBQ25CLFNBQVMsRUFBRSxPQUFPO1lBQ2xCLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLFlBQVksRUFBRSxVQUFVO1NBQ3hCLENBQUM7UUFFTyxxQkFBZ0IsR0FBRyxJQUFJLENBQUM7UUFNckIsZUFBVSxHQUFHLHdCQUF3QixDQUFDO1FBWWhDLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzlCLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzlCLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzlCLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFJbkIsQ0FBQztJQUcvQiw2Q0FBZ0IsR0FBeEIsVUFBeUIsRUFBVTtRQUM1QixJQUFN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QjtJQUNoQjtRQUFSLEtBQUssRUFBRTt3REFBbUI7SUFDbEI7UUFBUixLQUFLLEVBQUU7aUVBQTRCO0lBQzlCO1FBQVIsS0FBSyxFQUFFO2tFQUF5QjtJQUV2QjtRQUFULE1BQU0sRUFBRTt3REFBdUM7SUFDdEM7UUFBVCxNQUFNLEVBQUU7d0RBQXVDO0lBQ3RDO1FBQVQsTUFBTSxFQUFFO3dEQUF1QztJQUN0QztRQUFULE1BQU0sRUFBRTtpRUFBZ0Q7SUFFakI7UUFBdkMsU0FBUyxDQUFDLFVBQVUsRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQztxREFBb0I7SUF6Qy9DLGtCQUFrQjtRQUw5QixTQUFTLENBQUM7WUFDVixRQUFRLEVBQUUsWUFBWTtZQUN0Qiwwa05BQXFDOztTQUVyQyxDQUFDO09BQ1csa0JBQWtCLENBNmI5QjtJQUFELHlCQUFDO0NBQUEsQUE3YkQsSUE2YkM7U0E3Ylksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuKiBQcm92aWRlcyByZW5kZXJpbmcgb2YgYSB0YWJsZSB3aGljaCBpcyB1c2luZyB0aGUgZ2l2ZW4gRmxleGlibGVUYWJsZUhlYWRlciBzZXQgaW5cclxuKiBvcmRlciB0byB0YWJ1bGF0ZSB0aGUgZ2l2ZW4gZGF0YS4gQXMgcGVyIGRlZmluaXRpb24gb2YgZWFyY2ggaGVhZGVyIGNvbXBvbmVudCxcclxuKiBhIGNvbHVtbiBjb3VsZCBiZSBoaWRkZW4sIHNvcnRhYmxlLCBvciBkcmFnZ2FibGUuIEVhY2ggdGFibGUgcm93IGNhbiBleHBhbmQvY29sbGFwc2VcclxuKiBvciByZXNwb25kIHRvIGEgY2xpY2sgYWN0aW9uLlxyXG4qL1xyXG5pbXBvcnQge1xyXG4gICAgQ29tcG9uZW50LFxyXG5cdElucHV0LFxyXG5cdE91dHB1dCxcclxuXHRWaWV3Q2hpbGQsXHJcblx0Vmlld0NvbnRhaW5lclJlZixcclxuXHRPbkluaXQsXHJcblx0T25DaGFuZ2VzLFxyXG5cdEV2ZW50RW1pdHRlcixcclxuXHRFbGVtZW50UmVmXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBEcm9wRXZlbnQsIERyYWdFdmVudCB9IGZyb20gJ0BzZWRlaC9kcmFnLWVuYWJsZWQnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBGbGV4aWJsZVRhYmxlSGVhZGVyIHtcclxuXHRrZXk6IHN0cmluZyxcclxuXHR2YWx1ZTogc3RyaW5nLFxyXG5cdHByZXNlbnQ6IGJvb2xlYW4sXHJcblx0d2lkdGg/OiBzdHJpbmcsXHJcblx0bWlud2lkdGg/OiBzdHJpbmcsXHJcblx0Zm9ybWF0Pzogc3RyaW5nLFxyXG5cdGhpZGVPblByaW50Pzpib29sZWFuLFxyXG5cdGZpbHRlcj86IHN0cmluZyxcclxuXHRkcmFnYWJsZT86IGJvb2xlYW4sXHJcblx0c29ydGFibGU/OiBib29sZWFuLFxyXG5cdGNsYXNzPzpzdHJpbmcsXHJcblx0bG9ja2VkPzpib29sZWFuLFxyXG5cdGFzY2VuZGluZz86IGJvb2xlYW4sXHJcblx0ZGVzY2VuZGluZz86IGJvb2xlYW5cclxufVxyXG5cclxuQENvbXBvbmVudCh7XHJcblx0c2VsZWN0b3I6ICd0YWJsZS12aWV3JyxcclxuXHR0ZW1wbGF0ZVVybDogJy4vdGFibGUuY29tcG9uZW50Lmh0bWwnLFxyXG5cdHN0eWxlVXJsczogWycuL3RhYmxlLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIFRhYmxlVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcclxuXHRkcmFnZ2luZyA9IGZhbHNlO1xyXG5cdHByaW50TW9kZSA9IGZhbHNlO1xyXG5cdGZpbHRlcmVkSXRlbXMgPSBbXTtcclxuXHRzb3J0ZWRJdGVtcyA9IFtdO1xyXG5cdGZpbHRlcmluZ1RpbWVySWQ6IGFueTtcclxuXHJcbiAgICBASW5wdXQoXCJ2b2NhYnVsYXJ5XCIpXHJcbiAgICBwdWJsaWMgdm9jYWJ1bGFyeSA9IHtcclxuXHRcdGNvbmZpZ3VyZVRhYmxlOiBcIkNvbmZpZ3VyZSBUYWJsZVwiLFxyXG5cdFx0Y29uZmlndXJlQ29sdW1uczogXCJDb25maWd1cmUgQ29sdW1uc1wiLFxyXG5cdFx0Y2xpY2tTb3J0OiBcIkNsaWNrIHRvIFNvcnRcIixcclxuXHRcdHNldFNpemU6IFwiU2V0IFNpemVcIixcclxuXHRcdGZpcnN0UGFnZTogXCJGaXJzdFwiLFxyXG5cdFx0bGFzdFBhZ2U6IFwiTGFzdFwiLFxyXG5cdFx0cHJldmlvdXNQYWdlOiBcIlByZXZpb3VzXCJcclxuXHR9O1xyXG5cclxuXHRASW5wdXQoKSBoZWFkZXJTZXBhcmF0aW9uID0gdHJ1ZTtcclxuXHRASW5wdXQoKSBsb2NrYWJsZTpib29sZWFuO1xyXG5cdEBJbnB1dCgpIGNhcHRpb246IHN0cmluZztcclxuICAgIEBJbnB1dCgpIGFjdGlvbjogc3RyaW5nO1xyXG4gICAgQElucHV0KCkgcGFnZUluZm86IGFueTtcclxuICAgIEBJbnB1dCgpIGFjdGlvbktleXM6IGFueTtcclxuICAgIEBJbnB1dCgpIHRhYmxlQ2xhc3MgPSAnZGVmYXVsdC1mbGV4aWJsZS10YWJsZSc7XHJcblx0QElucHV0KCkgaGVhZGVyczogYW55W107XHJcblx0QElucHV0KCkgaXRlbXM6IGFueVtdO1xyXG5cdEBJbnB1dCgpIHRhYmxlSW5mbzogYW55O1xyXG4gICAgQElucHV0KCkgZW5hYmxlSW5kZXhpbmc6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKSBlbmFibGVGaWx0ZXJpbmc6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKSByb3dEZXRhaWxlcjogYW55O1xyXG4gICAgQElucHV0KCkgZXhwYW5kYWJsZTogYW55O1xyXG4gICAgQElucHV0KCkgZXhwYW5kSWY6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKSBmaWx0ZXJ3aGlsZXR5cGluZzogYm9vbGVhbjtcclxuXHRASW5wdXQoKSByb3dEZXRhaWxlckhlYWRlcnM6IGFueTtcclxuXHRcclxuXHRAT3V0cHV0KCkgcHJpdmF0ZSBvbmFjdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHRAT3V0cHV0KCkgcHJpdmF0ZSBvbmNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHRAT3V0cHV0KCkgcHJpdmF0ZSBvbmZpbHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHRAT3V0cHV0KCkgcHJpdmF0ZSBvbkNlbGxDb250ZW50RWRpdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0QFZpZXdDaGlsZCgnZmxleGlibGUnLCB7c3RhdGljOiBmYWxzZX0pIHByaXZhdGUgdGFibGU6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6RWxlbWVudFJlZikge31cclxuXHJcblxyXG5cdHByaXZhdGUgZmluZENvbHVtbldpdGhJRChpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IHRoaXMuaGVhZGVyQ29sdW1uRWxlbWVudHMoKTtcclxuXHRcdGxldCBjb2x1bW4gPSBudWxsO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmIChsaXN0W2ldLmdldEF0dHJpYnV0ZShcImlkXCIpID09PSBpZCkge1xyXG5cdFx0XHRcdGNvbHVtbiA9IGxpc3RbaV07XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBjb2x1bW47XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIHN3YXBDb2x1bW5zKHNvdXJjZTogYW55LCBkZXN0aW5hdGlvbjogYW55KSB7XHJcblxyXG5cdFx0aWYgKHNvdXJjZS5ub2RlLnBhcmVudE5vZGUgPT09IGRlc3RpbmF0aW9uLm5vZGUucGFyZW50Tm9kZSkge1xyXG5cdFx0XHRjb25zdCBzcmNJbmRleCA9IHRoaXMuZ2V0Q29sdW1uSW5kZXgoc291cmNlLm1lZGl1bS5rZXkpO1xyXG5cdFx0XHRjb25zdCBkZXNJbmRleCA9IHRoaXMuZ2V0Q29sdW1uSW5kZXgoZGVzdGluYXRpb24ubWVkaXVtLmtleSk7XHJcblx0XHRcdGlmIChzcmNJbmRleCA8IDAgfHwgZGVzSW5kZXggPCAwKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJpbnZhbGlkIGRyb3AgaWRcIiwgc291cmNlLm1lZGl1bS5rZXksIGRlc3RpbmF0aW9uLm1lZGl1bS5rZXkpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjb25zdCB4ID0gdGhpcy5maWx0ZXJlZEl0ZW1zO1xyXG5cdFx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSBbXTtcclxuXHJcblx0XHRcdHNldFRpbWVvdXQoKCk9PntcclxuXHRcdFx0XHRjb25zdCBzb2JqID0gdGhpcy5oZWFkZXJzW3NyY0luZGV4XTtcclxuXHRcdFx0XHR0aGlzLmhlYWRlcnNbc3JjSW5kZXhdID0gdGhpcy5oZWFkZXJzW2Rlc0luZGV4XTtcclxuXHRcdFx0XHR0aGlzLmhlYWRlcnNbZGVzSW5kZXhdID0gc29iajtcclxuXHRcdFx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSB4O1xyXG5cclxuXHRcdFx0XHR0aGlzLm9uZmlsdGVyLmVtaXQodGhpcy5maWx0ZXJlZEl0ZW1zKTtcclxuXHRcdFx0XHR0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5oZWFkZXJzKTtcclxuXHRcdFx0fSwgMzMpO1xyXG5cdFxyXG5cdFx0fSBlbHNlIGlmIChzb3VyY2UubWVkaXVtLmxvY2tlZCB8fCBkZXN0aW5hdGlvbi5tZWRpdW0ubG9ja2VkKSB7XHJcblx0XHRcdGNvbnN0IHggPSB0aGlzLmZpbHRlcmVkSXRlbXM7XHJcblx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IFtdO1xyXG5cdFx0XHR0aGlzLm9uZmlsdGVyLmVtaXQodGhpcy5maWx0ZXJlZEl0ZW1zKTtcclxuXHRcdFx0c2V0VGltZW91dCgoKT0+e1xyXG5cdFx0XHRcdHNvdXJjZS5tZWRpdW0ubG9ja2VkID0gIXNvdXJjZS5tZWRpdW0ubG9ja2VkO1xyXG5cdFx0XHRcdGRlc3RpbmF0aW9uLm1lZGl1bS5sb2NrZWQgPSAhZGVzdGluYXRpb24ubWVkaXVtLmxvY2tlZDtcclxuXHRcdFx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSB4O1xyXG5cdFx0XHRcdHRoaXMub25maWx0ZXIuZW1pdCh0aGlzLmZpbHRlcmVkSXRlbXMpO1xyXG5cdFx0XHRcdHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzLmhlYWRlcnMpO1xyXG5cdFx0XHR9LDMzKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgZ2V0Q29sdW1uSW5kZXgoaWQ6IHN0cmluZykge1xyXG5cdFx0bGV0IGluZGV4ID0gLTE7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVhZGVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAodGhpcy5oZWFkZXJzW2ldLmtleSA9PT0gaWQpIHtcclxuXHRcdFx0XHRpbmRleCA9IGk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBpbmRleDtcclxuXHR9XHJcblx0cHJpdmF0ZSBpdGVtVmFsdWUoaXRlbSwgaHBhdGgpIHtcclxuXHRcdGxldCBzdWJpdGVtID0gaXRlbTtcclxuXHRcdGhwYXRoLm1hcCggKHN1YmtleSkgPT4ge1xyXG5cdFx0XHRpZiAoc3ViaXRlbSkge1xyXG5cdFx0XHRcdHN1Yml0ZW0gPSBzdWJpdGVtW3N1YmtleV07XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0XHRyZXR1cm4gc3ViaXRlbSA9PT0gdW5kZWZpbmVkIHx8IHN1Yml0ZW0gPT09IG51bGwgfHwgc3ViaXRlbSA9PT0gXCJudWxsXCIgPyBcIlwiIDogc3ViaXRlbTtcclxuXHR9XHJcblx0aW5pdFZpc2libGVSb3dzKGZpbHRlcmVkOiBhbnlbXSkge1xyXG5cdFx0Y29uc3QgcmVzdWx0ID0gW107XHJcblx0XHRjb25zdCBsaXN0ID0gZmlsdGVyZWQgPyBmaWx0ZXJlZCA6IHRoaXMuZmlsdGVyZWRJdGVtcztcclxuXHRcdGlmICh0aGlzLnBhZ2VJbmZvKSB7XHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGlmIChpID49IHRoaXMucGFnZUluZm8uZnJvbSAmJiBpIDw9IHRoaXMucGFnZUluZm8udG8pIHtcclxuXHRcdFx0XHRcdHJlc3VsdC5wdXNoKGxpc3RbaV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSByZXN1bHQ7XHJcblx0XHR9XHJcblx0XHRpZiAoZmlsdGVyZWQpIHtcclxuXHRcdFx0dGhpcy5vbmZpbHRlci5lbWl0KHRoaXMuZmlsdGVyZWRJdGVtcyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRsb2NrKGhlYWRlcjogRmxleGlibGVUYWJsZUhlYWRlciwgZXZlbnQpIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcdFxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRoZWFkZXIubG9ja2VkID0gIWhlYWRlci5sb2NrZWQ7XHJcblx0XHR0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5oZWFkZXJzKTtcclxuXHR9XHJcblx0c29ydChoZWFkZXI6IEZsZXhpYmxlVGFibGVIZWFkZXIsIGljb24pIHtcclxuXHRcdGlmIChoZWFkZXIuc29ydGFibGUgJiYgdGhpcy5pdGVtcyAmJiB0aGlzLml0ZW1zLmxlbmd0aCkge1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVhZGVycy5sZW5ndGggOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGggPSB0aGlzLmhlYWRlcnNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGgua2V5ICE9PSBoZWFkZXIua2V5KSB7XHJcblx0XHRcdFx0XHRjb25zdCBpdGVtID0gdGhpcy5maW5kQ29sdW1uV2l0aElEKGgua2V5KTtcclxuXHJcblx0XHRcdFx0XHRpZiAoaXRlbSkge1xyXG5cdFx0XHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJhc2NlbmRpbmdcIik7XHJcblx0XHRcdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LnJlbW92ZShcImRlc2NlbmRpbmdcIik7XHJcblx0XHRcdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LmFkZChcInNvcnRhYmxlXCIpO1xyXG5cdFx0XHRcdFx0fVxyXG4gICAgICAgICAgICAgICAgICAgIGguZGVzY2VuZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGguYXNjZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcbiAgICAgICAgICAgIGljb24uY2xhc3NMaXN0LnJlbW92ZShcImZhLXNvcnRcIik7XHJcblx0XHRcdGlmIChoZWFkZXIuYXNjZW5kaW5nIHx8ICghaGVhZGVyLmFzY2VuZGluZyAmJiAhaGVhZGVyLmRlc2NlbmRpbmcpKSB7XHJcblx0XHRcdFx0aGVhZGVyLmRlc2NlbmRpbmcgPSB0cnVlO1xyXG5cdFx0XHRcdGhlYWRlci5hc2NlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRpY29uLmNsYXNzTGlzdC5yZW1vdmUoXCJmYS1zb3J0LWFzY1wiKTtcclxuXHRcdFx0XHRpY29uLmNsYXNzTGlzdC5hZGQoXCJmYS1zb3J0LWRlc2NcIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aGVhZGVyLmRlc2NlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRoZWFkZXIuYXNjZW5kaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHRpY29uLmNsYXNzTGlzdC5yZW1vdmUoXCJmYS1zb3J0LWRlc2NcIik7XHJcblx0XHRcdFx0aWNvbi5jbGFzc0xpc3QuYWRkKFwiZmEtc29ydC1hc2NcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0Y29uc3QgaHBhdGggPSBoZWFkZXIua2V5LnNwbGl0KFwiLlwiKTtcclxuXHRcdFx0bGV0IGZpbHRlcmVkID0gW107XHJcblx0XHRcdGlmICh0aGlzLmVuYWJsZUZpbHRlcmluZykge1xyXG5cdFx0XHRcdGZpbHRlcmVkID0gdGhpcy5maWx0ZXJJdGVtcygpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGZpbHRlcmVkID0gdGhpcy5pdGVtcyA/IHRoaXMuaXRlbXMgOiBbXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmaWx0ZXJlZC5zb3J0KChhLCBiKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgdjEgPSB0aGlzLml0ZW1WYWx1ZShhLCBocGF0aCk7XHJcblx0XHRcdFx0Y29uc3QgdjIgPSB0aGlzLml0ZW1WYWx1ZShiLCBocGF0aCk7XHJcblxyXG5cdFx0XHRcdGlmIChoZWFkZXIuYXNjZW5kaW5nKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdjEgPiB2MiA/IDEgOiAtMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHYxIDwgdjIgPyAxIDogLTE7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR0aGlzLnNvcnRlZEl0ZW1zID0gZmlsdGVyZWQ7XHJcblx0XHRcdHRoaXMuaW5pdFZpc2libGVSb3dzKGZpbHRlcmVkKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG9mZnNldFdpZHRoKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMudGFibGUubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aDtcclxuXHR9XHJcblxyXG5cdG5nT25DaGFuZ2VzKGNoYW5nZXM6YW55KSB7XHJcblx0XHQvLyBpZiAoY2hhbmdlcy5pdGVtcykge1xyXG5cdFx0Ly8gXHR0aGlzLmV2YWx1YXRlUm93cygpO1xyXG5cdFx0Ly8gfVxyXG5cdH1cclxuXHJcblx0bmdPbkluaXQoKSB7XHJcblx0XHRpZiAodGhpcy5wYWdlSW5mbykge1xyXG5cdFx0XHRpZiAoIXRoaXMucGFnZUluZm8udG8pIHtcclxuXHRcdFx0XHR0aGlzLnBhZ2VJbmZvLnRvID0gdGhpcy5wYWdlSW5mby5wYWdlU2l6ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5wYWdlSW5mbyA9IHsgXHJcbiAgICAgICAgICAgICAgICBjb250ZW50U2l6ZTogMTAwMDAwLCBcclxuICAgICAgICAgICAgICAgIHBhZ2VTaXplOiAxMDAwMDAsIFxyXG4gICAgICAgICAgICAgICAgcGFnZXM6IDEsIFxyXG4gICAgICAgICAgICAgICAgZnJvbTogMCwgXHJcbiAgICAgICAgICAgICAgICB0bzogMTAwMDAwLCBcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRQYWdlOiAxLCBcclxuICAgICAgICAgICAgICAgIG1heFdpZHRoOiBcIjBcIiBcclxuICAgICAgICAgICAgfTtcclxuXHRcdH1cclxuXHRcdGlmICghdGhpcy5oZWFkZXJzKSB7XHJcblx0XHRcdHRoaXMuaGVhZGVycyA9IFtdO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5ldmFsdWF0ZVJvd3MoKTtcclxuICAgICAgICBpZiAodGhpcy5hY3Rpb25LZXlzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aW9uS2V5cyA9IHRoaXMuYWN0aW9uS2V5cy5zcGxpdChcIixcIik7XHJcblx0XHR9XHJcblx0XHRpZiAoIXRoaXMucm93RGV0YWlsZXIgJiYgdGhpcy5leHBhbmRhYmxlKSB7XHJcblx0XHRcdHRoaXMucm93RGV0YWlsZXIgPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdFx0cmV0dXJuIHtkYXRhOiBpdGVtLCBoZWFkZXJzOiBbXX07XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHRpZiAoIXRoaXMuZXhwYW5kYWJsZSkge1xyXG5cdFx0XHR0aGlzLmV4cGFuZGFibGUgPSBmdW5jdGlvbihpdGVtLCBzaG93SWNvbikge3JldHVybiBzaG93SWNvbn07XHJcblx0XHR9XHJcblx0XHRpZiAoIXRoaXMucm93RGV0YWlsZXJIZWFkZXJzKSB7XHJcblx0XHRcdHRoaXMucm93RGV0YWlsZXJIZWFkZXJzID0gKGl0ZW0pID0+IFtdO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRldmFsdWF0ZVJvd3MoKSB7XHJcblx0XHRsZXQgZmlsdGVyZWQgPSBbXTtcclxuXHRcdGlmICh0aGlzLnNvcnRlZEl0ZW1zICYmIHRoaXMuc29ydGVkSXRlbXMubGVuZ3RoKSB7XHJcblx0XHRcdGZpbHRlcmVkID10aGlzLnNvcnRlZEl0ZW1zO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKHRoaXMuZW5hYmxlRmlsdGVyaW5nKSB7XHJcblx0XHRcdFx0ZmlsdGVyZWQgPSB0aGlzLmZpbHRlckl0ZW1zKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZmlsdGVyZWQgPSB0aGlzLml0ZW1zID8gdGhpcy5pdGVtcyA6IFtdO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aGlzLmluaXRWaXNpYmxlUm93cyhmaWx0ZXJlZCk7XHJcblx0fVxyXG5cclxuICAgIGhlYWRlckNvbHVtbkVsZW1lbnRzKCkge1xyXG5cdFx0bGV0IHJlc3VsdCA9IFtdO1xyXG5cclxuXHRcdGlmICh0aGlzLnRhYmxlLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW4pIHtcclxuXHRcdFx0Y29uc3QgbGlzdCA9IHRoaXMudGFibGUubmF0aXZlRWxlbWVudC5jaGlsZHJlbjtcclxuXHRcdFx0cmVzdWx0ID0gdGhpcy5jYXB0aW9uID8gbGlzdFsxXS5jaGlsZHJlblswXS5jaGlsZHJlbiA6IGxpc3RbMF0uY2hpbGRyZW5bMF0uY2hpbGRyZW47XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuXHRoZWFkZXJCeUlkKGlkKSB7XHJcblx0XHRsZXQgaDtcclxuXHRcdGZvciAoY29uc3QgaSBpbiB0aGlzLmhlYWRlcnMpIHtcclxuXHRcdFx0aWYgKHRoaXMuaGVhZGVyc1tpXS5rZXkgPT09IGlkKSB7XHJcblx0XHRcdFx0aCA9IHRoaXMuaGVhZGVyc1tpXTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGg7XHJcblx0fVxyXG5cclxuICAgIGNvbHVtbnNDb3VudCgpIHtcclxuXHRcdGxldCBjb3VudCA9IDA7XHJcblx0XHR0aGlzLmhlYWRlcnMubWFwKCAoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5wcmVzZW50KSB7XHJcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICB9XHJcblx0XHR9KTtcclxuICAgICAgICBpZiAodGhpcy5hY3Rpb24pIHtcclxuICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvdW50O1xyXG5cdH1cclxuXHRob3ZlcihpdGVtLCBmbGFnKSB7XHJcblx0XHRpZiAoZmxhZykge1xyXG5cdFx0XHRpdGVtLmhvdmVyID0gdHJ1ZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRlbGV0ZSBpdGVtLmhvdmVyO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dG9Dc3NDbGFzcyhoZWFkZXIpIHtcclxuXHRcdHJldHVybiBoZWFkZXIua2V5LnJlcGxhY2UoL1xcLi9nLCctJyk7XHJcblx0fVxyXG4gICAga2V5ZG93bihldmVudCwgaXRlbSkge1xyXG4gICAgICAgIGNvbnN0IGNvZGUgPSBldmVudC53aGljaDtcclxuICAgICAgICBpZiAoKGNvZGUgPT09IDEzKSB8fCAoY29kZSA9PT0gMzIpKSB7XHJcblx0XHRcdGl0ZW0uY2xpY2soKTtcclxuXHRcdH1cclxuICAgIH1cclxuICAgIG9mZlNjcmVlbk1lc3NhZ2UoaXRlbSkge1xyXG5cdFx0bGV0IG1lc3NhZ2U6IHN0cmluZyA9IHRoaXMuYWN0aW9uO1xyXG5cdFx0aWYgKHRoaXMuYWN0aW9uS2V5cykge1xyXG5cdFx0XHR0aGlzLmFjdGlvbktleXMubWFwKChrZXkpID0+IHsgbWVzc2FnZSA9IG1lc3NhZ2UucmVwbGFjZShrZXksIGl0ZW1ba2V5LnN1YnN0cmluZygxLCBrZXkubGVuZ3RoIC0gMSldKTsgfSlcclxuXHRcdH1cclxuICAgICAgICByZXR1cm4gbWVzc2FnZTtcclxuICAgIH1cclxuXHJcbiAgICBjZWxsQ29udGVudChpdGVtLCBoZWFkZXIpIHtcclxuXHRcdGxldCBjb250ZW50ID0gdGhpcy5pdGVtVmFsdWUoaXRlbSwgaGVhZGVyLmtleS5zcGxpdChcIi5cIikpO1xyXG4gICAgICAgIHJldHVybiAoY29udGVudCAhPT0gdW5kZWZpbmVkICYmIGNvbnRlbnQgIT0gbnVsbCAmJiBTdHJpbmcoY29udGVudCkubGVuZ3RoKSA/IGNvbnRlbnQgOiAnJm5ic3A7JztcclxuXHR9XHJcblxyXG5cdHJvd0RldGFpbGVyQ29udGV4dChpdGVtKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRkYXRhOiBpdGVtLFxyXG5cdFx0XHR0YWJsZUluZm86IHRoaXMudGFibGVJbmZvLFxyXG5cdFx0XHRoZWFkZXJzOiB0aGlzLnJvd0RldGFpbGVySGVhZGVycyhpdGVtKVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdGNoYW5nZUZpbHRlcihldmVudCwgaGVhZGVyKSB7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG5cclxuXHRcdGhlYWRlci5maWx0ZXIgPSBldmVudC50YXJnZXQudmFsdWU7XHJcblxyXG5cdFx0aWYgKHRoaXMuZmlsdGVyd2hpbGV0eXBpbmcgfHwgY29kZSA9PT0gMTMpIHtcclxuXHRcdFx0aWYodGhpcy5maWx0ZXJpbmdUaW1lcklkKSB7XHJcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRoaXMuZmlsdGVyaW5nVGltZXJJZCk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5maWx0ZXJpbmdUaW1lcklkID0gc2V0VGltZW91dCgoKT0+e1xyXG5cdFx0XHRcdHRoaXMuaW5pdFZpc2libGVSb3dzKHRoaXMuZmlsdGVySXRlbXMoKSk7XHJcblx0XHRcdFx0dGhpcy5maWx0ZXJpbmdUaW1lcklkICA9IHVuZGVmaW5lZDtcclxuXHRcdFx0fSwgMTIzKTtcclxuXHRcdH1cclxuXHR9XHJcblx0YWN0aW9uQ2xpY2soZXZlbnQsIGl0ZW06IGFueSkge1xyXG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgaWYgKHRoaXMucm93RGV0YWlsZXIgJiYgKHRoaXMuZXhwYW5kSWYgfHwgdGhpcy5leHBhbmRhYmxlKGl0ZW0sIGZhbHNlKSkgKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmV4cGFuZGVkKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgaXRlbS5leHBhbmRlZDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZXhwYW5kZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vbmFjdGlvbi5lbWl0KGl0ZW0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cHJpbnQoKSB7XHJcblx0XHR0aGlzLnByaW50TW9kZSA9IHRydWU7XHJcblx0XHRzZXRUaW1lb3V0KCgpPT57XHJcblx0XHRcdGNvbnN0IGNvbnRlbnQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MO1xyXG5cdFx0XHRjb25zdCBzdHlsZXM6IGFueSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzdHlsZScpO1xyXG5cdFx0XHR0aGlzLnByaW50TW9kZSA9IGZhbHNlO1xyXG5cdFx0XHRjb25zdCBwb3B1cFdpbiA9IHdpbmRvdy5vcGVuKCcnLCAnX2JsYW5rJywgJ3dpZHRoPTMwMCxoZWlnaHQ9MzAwJyk7XHJcblx0XHRcdGxldCBjb3BpZWRDb250ZW50ID0gJzxodG1sPic7XHJcblx0XHRcdGZvcihsZXQgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRjb3BpZWRDb250ZW50ICs9IHN0eWxlc1tpXS5vdXRlckhUTUw7XHJcblx0XHRcdH1cclxuXHRcdFx0Y29waWVkQ29udGVudCArPSAnPGJvZHkgb25sb2FkPVwid2luZG93LnByaW50KClcIj4nICsgY29udGVudCArICc8L2h0bWw+JztcclxuXHJcblx0XHRcclxuXHRcdFx0cG9wdXBXaW4uZG9jdW1lbnQub3BlbigpO1xyXG4gICAgICAgIFx0cG9wdXBXaW4uZG9jdW1lbnQud3JpdGUoY29waWVkQ29udGVudCk7XHJcbiAgICAgICAgXHRwb3B1cFdpbi5kb2N1bWVudC5jbG9zZSgpO1xyXG5cdFx0fSwzKTtcclxuXHR9XHJcblxyXG5cdC8vIDw1LCAhNSwgPjUsICpFLCBFKiwgKkUqXHJcblx0cHJpdmF0ZSBzaG91bGRTa2lwSXRlbSh2YWx1ZSwgZmlsdGVyQnkpIHtcclxuXHRcdGxldCByZXN1bHQgPSBmYWxzZTtcclxuXHJcblx0XHRpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCAmJiBTdHJpbmcodmFsdWUpLmxlbmd0aCkge1xyXG5cdFx0XHRjb25zdCB2ID0gU3RyaW5nKHZhbHVlKTtcclxuXHRcdFx0aWYgKGZpbHRlckJ5WzBdID09PSAnPCcpIHtcclxuXHRcdFx0XHRyZXN1bHQgPSBmaWx0ZXJCeS5sZW5ndGggPiAxICYmIHBhcnNlRmxvYXQodikgPj0gcGFyc2VGbG9hdChmaWx0ZXJCeS5zdWJzdHJpbmcoMSkpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGZpbHRlckJ5WzBdID09PSAnPicpIHtcclxuXHRcdFx0XHRyZXN1bHQgPSBmaWx0ZXJCeS5sZW5ndGggPiAxICYmIHBhcnNlRmxvYXQodikgPD0gcGFyc2VGbG9hdChmaWx0ZXJCeS5zdWJzdHJpbmcoMSkpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGZpbHRlckJ5WzBdID09PSAnIScpIHtcclxuXHRcdFx0XHRyZXN1bHQgPSBmaWx0ZXJCeS5sZW5ndGggPiAxICYmIHBhcnNlRmxvYXQodikgPT0gcGFyc2VGbG9hdChmaWx0ZXJCeS5zdWJzdHJpbmcoMSkpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGZpbHRlckJ5WzBdID09PSAnPScpIHtcclxuXHRcdFx0XHRyZXN1bHQgPSBmaWx0ZXJCeS5sZW5ndGggPT0gMSB8fCBwYXJzZUZsb2F0KHYpICE9PSBwYXJzZUZsb2F0KGZpbHRlckJ5LnN1YnN0cmluZygxKSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoZmlsdGVyQnlbMF0gPT09ICcqJyAmJiBmaWx0ZXJCeVtmaWx0ZXJCeS5sZW5ndGgtMV0gIT09ICcqJykge1xyXG5cdFx0XHRcdGNvbnN0IGYgPSBmaWx0ZXJCeS5zdWJzdHJpbmcoMSk7XHJcblx0XHRcdFx0cmVzdWx0ID0gdi5pbmRleE9mKGYpICE9PSB2Lmxlbmd0aCAtIGYubGVuZ3RoXHJcblx0XHRcdH0gZWxzZSBpZiAoZmlsdGVyQnlbMF0gIT09ICcqJyAmJiBmaWx0ZXJCeVtmaWx0ZXJCeS5sZW5ndGgtMV0gPT09ICcqJykge1xyXG5cdFx0XHRcdGNvbnN0IGYgPSBmaWx0ZXJCeS5zdWJzdHJpbmcoMCwgZmlsdGVyQnkubGVuZ3RoLTEpO1xyXG5cdFx0XHRcdHJlc3VsdCA9IHYuaW5kZXhPZihmKSAhPT0gMDtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWx0ZXJCeVswXSA9PT0gJyonICYmIGZpbHRlckJ5W2ZpbHRlckJ5Lmxlbmd0aC0xXSA9PT0gJyonKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gZmlsdGVyQnkubGVuZ3RoID4gMSAmJiB2LmluZGV4T2YoIGZpbHRlckJ5LnN1YnN0cmluZygxLCBmaWx0ZXJCeS5sZW5ndGgtMSkgKSA8IDA7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gdi5pbmRleE9mKGZpbHRlckJ5KSA8IDA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fVxyXG5cdGZpbHRlckl0ZW1zKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuaXRlbXMgPyB0aGlzLml0ZW1zLmZpbHRlcigoaXRlbSkgPT4ge1xyXG5cdFx0XHRsZXQga2VlcEl0ZW0gPSB0cnVlO1xyXG5cclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlYWRlcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRjb25zdCBoZWFkZXIgPSB0aGlzLmhlYWRlcnNbaV07XHJcblx0XHRcdFx0aWYgKGhlYWRlci5maWx0ZXIgJiYgaGVhZGVyLmZpbHRlci5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdGNvbnN0IHYgPSB0aGlzLml0ZW1WYWx1ZShpdGVtLCBoZWFkZXIua2V5LnNwbGl0KFwiLlwiKSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuc2hvdWxkU2tpcEl0ZW0odixoZWFkZXIuZmlsdGVyKSkge1xyXG5cdFx0XHRcdFx0XHRrZWVwSXRlbSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGtlZXBJdGVtO1xyXG5cdFx0fSkgOiBbXTtcclxuXHR9XHJcblxyXG5cdG9uVGFibGVDZWxsRWRpdChldmVudCkge1xyXG5cdFx0Y29uc3QgaWQgPSBldmVudC5pZC5zcGxpdChcIi1cIik7XHJcblx0XHRjb25zdCBuID0gZXZlbnQubmFtZTtcclxuXHRcdGNvbnN0IHY9IGV2ZW50LnZhbHVlO1xyXG5cdFx0Y29uc3QgdCA9IHRoaXMuaXRlbXNbcGFyc2VJbnQoaWRbMV0pXTtcclxuXHJcblx0XHRpZiAodCkge1xyXG5cdFx0XHRjb25zdCBsaXN0ID0gaWRbMF0uc3BsaXQoXCIuXCIpO1xyXG5cdFx0XHRsZXQgc3ViaXRlbSA9IHRbbGlzdFswXV07XHJcblx0XHRcdGZvcihsZXQgaSA9IDE7IGkgPCAobGlzdC5sZW5ndGggLSAxKTsgaSsrKSB7XHJcblx0XHRcdFx0c3ViaXRlbSA9IHN1Yml0ZW1bbGlzdFtpXV1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoc3ViaXRlbSAmJiBsaXN0Lmxlbmd0aCA+IDEpe1xyXG5cdFx0XHRcdHN1Yml0ZW1bbGlzdFtsaXN0Lmxlbmd0aCAtIDFdXSA9IHY7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5vbkNlbGxDb250ZW50RWRpdC5lbWl0KHtuYW1lOiBuLCB2YWx1ZTogdiwgaXRlbTogdH0pO1xyXG5cdFx0fVxyXG4gICAgfVxyXG5cclxuXHRkcmFnRW5hYmxlZChldmVudDogRHJhZ0V2ZW50KSB7XHJcblx0XHRyZXR1cm4gZXZlbnQubWVkaXVtLmRyYWdhYmxlO1xyXG5cdH1cclxuXHRkcm9wRW5hYmxlZChldmVudDogRHJvcEV2ZW50KSB7XHJcblx0XHRyZXR1cm4gZXZlbnQuZGVzdGluYXRpb24ubWVkaXVtLmRyYWdhYmxlO1xyXG5cdH1cclxuXHRvbkRyYWdTdGFydChldmVudDogRHJhZ0V2ZW50KXtcclxuLy8gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlO1xyXG5cdH1cclxuXHRvbkRyYWdFbmQoZXZlbnQ6IERyYWdFdmVudCl7XHJcbiAvLyAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XHJcblx0fVxyXG5cdG9uRHJvcChldmVudDpEcm9wRXZlbnQpe1xyXG5cdFx0dGhpcy5zd2FwQ29sdW1ucyhldmVudC5zb3VyY2UsIGV2ZW50LmRlc3RpbmF0aW9uKTtcclxuXHR9XHJcbn1cclxuIl19