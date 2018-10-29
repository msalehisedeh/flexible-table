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
var TableViewComponent = /** @class */ (function () {
    function TableViewComponent(el) {
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
    TableViewComponent.prototype.findColumnWithID = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var list = this.headerColumnElements();
        /** @type {?} */
        var column = null;
        for (var i = 0; i < list.length; i++) {
            if (list[i].getAttribute("id") === id) {
                column = list[i];
                break;
            }
        }
        return column;
    };
    /**
     * @param {?} source
     * @param {?} destination
     * @return {?}
     */
    TableViewComponent.prototype.swapColumns = /**
     * @param {?} source
     * @param {?} destination
     * @return {?}
     */
    function (source, destination) {
        var _this = this;
        if (source.node.parentNode === destination.node.parentNode) {
            /** @type {?} */
            var srcIndex_1 = this.getColumnIndex(source.medium.key);
            /** @type {?} */
            var desIndex_1 = this.getColumnIndex(destination.medium.key);
            if (srcIndex_1 < 0 || desIndex_1 < 0) {
                console.log("invalid drop id", source.medium.key, destination.medium.key);
                return;
            }
            /** @type {?} */
            var x_1 = this.filteredItems;
            this.filteredItems = [];
            setTimeout(function () {
                /** @type {?} */
                var sobj = _this.headers[srcIndex_1];
                _this.headers[srcIndex_1] = _this.headers[desIndex_1];
                _this.headers[desIndex_1] = sobj;
                _this.filteredItems = x_1;
                _this.onfilter.emit(_this.filteredItems);
                _this.onchange.emit(_this.headers);
            }, 33);
        }
        else if (source.medium.locked || destination.medium.locked) {
            /** @type {?} */
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
    /**
     * @param {?} id
     * @return {?}
     */
    TableViewComponent.prototype.getColumnIndex = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var index = -1;
        for (var i = 0; i < this.headers.length; i++) {
            if (this.headers[i].key === id) {
                index = i;
                break;
            }
        }
        return index;
    };
    /**
     * @param {?} item
     * @param {?} hpath
     * @return {?}
     */
    TableViewComponent.prototype.itemValue = /**
     * @param {?} item
     * @param {?} hpath
     * @return {?}
     */
    function (item, hpath) {
        /** @type {?} */
        var subitem = item;
        hpath.map(function (subkey) {
            if (subitem) {
                subitem = subitem[subkey];
            }
        });
        return subitem === undefined || subitem === null || subitem === "null" ? "" : subitem;
    };
    /**
     * @return {?}
     */
    TableViewComponent.prototype.initVisibleRows = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var result = [];
        for (var i = 0; i < this.filteredItems.length; i++) {
            if (i >= this.pageInfo.from && i <= this.pageInfo.to) {
                result.push(this.filteredItems[i]);
            }
        }
        this.filteredItems = result;
    };
    /**
     * @param {?} header
     * @param {?} event
     * @return {?}
     */
    TableViewComponent.prototype.lock = /**
     * @param {?} header
     * @param {?} event
     * @return {?}
     */
    function (header, event) {
        event.stopPropagation();
        event.preventDefault();
        header.locked = !header.locked;
        this.onchange.emit(this.headers);
    };
    /**
     * @param {?} header
     * @param {?} icon
     * @return {?}
     */
    TableViewComponent.prototype.sort = /**
     * @param {?} header
     * @param {?} icon
     * @return {?}
     */
    function (header, icon) {
        var _this = this;
        if (header.sortable && this.items && this.items.length) {
            for (var i = 0; i < this.headers.length; i++) {
                /** @type {?} */
                var h = this.headers[i];
                if (h.key !== header.key) {
                    /** @type {?} */
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
            /** @type {?} */
            var hpath_1 = header.key.split(".");
            if (this.enableFiltering) {
                this.filterItems();
            }
            else {
                this.filteredItems = this.items ? this.items : [];
            }
            this.filteredItems.sort(function (a, b) {
                /** @type {?} */
                var v1 = _this.itemValue(a, hpath_1);
                /** @type {?} */
                var v2 = _this.itemValue(b, hpath_1);
                if (header.ascending) {
                    return v1 > v2 ? 1 : -1;
                }
                return v1 < v2 ? 1 : -1;
            });
            this.initVisibleRows();
        }
    };
    /**
     * @return {?}
     */
    TableViewComponent.prototype.offsetWidth = /**
     * @return {?}
     */
    function () {
        return this.table.element.nativeElement.offsetWidth;
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    TableViewComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        // if (changes.items) {
        // 	this.evaluateRows();
        // }
    };
    /**
     * @return {?}
     */
    TableViewComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
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
    /**
     * @return {?}
     */
    TableViewComponent.prototype.evaluateRows = /**
     * @return {?}
     */
    function () {
        if (this.enableFiltering) {
            this.filterItems();
        }
        else {
            this.filteredItems = this.items ? this.items : [];
        }
        this.initVisibleRows();
    };
    /**
     * @return {?}
     */
    TableViewComponent.prototype.headerColumnElements = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var result = [];
        if (this.table.element.nativeElement.children) {
            /** @type {?} */
            var list = this.table.element.nativeElement.children;
            result = this.caption ? list[1].children[0].children : list[0].children[0].children;
        }
        return result;
    };
    /**
     * @param {?} id
     * @return {?}
     */
    TableViewComponent.prototype.headerById = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var h;
        for (var i in this.headers) {
            if (this.headers[i].key === id) {
                h = this.headers[i];
                break;
            }
        }
        return h;
    };
    /**
     * @return {?}
     */
    TableViewComponent.prototype.columnsCount = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
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
    /**
     * @param {?} item
     * @param {?} flag
     * @return {?}
     */
    TableViewComponent.prototype.hover = /**
     * @param {?} item
     * @param {?} flag
     * @return {?}
     */
    function (item, flag) {
        if (flag) {
            item.hover = true;
        }
        else {
            delete item.hover;
        }
    };
    /**
     * @param {?} header
     * @return {?}
     */
    TableViewComponent.prototype.toCssClass = /**
     * @param {?} header
     * @return {?}
     */
    function (header) {
        return header.key.replace(/\./g, '-');
    };
    /**
     * @param {?} event
     * @param {?} item
     * @return {?}
     */
    TableViewComponent.prototype.keydown = /**
     * @param {?} event
     * @param {?} item
     * @return {?}
     */
    function (event, item) {
        /** @type {?} */
        var code = event.which;
        if ((code === 13) || (code === 32)) {
            item.click();
        }
    };
    /**
     * @param {?} item
     * @return {?}
     */
    TableViewComponent.prototype.offScreenMessage = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var message = this.action;
        if (this.actionKeys) {
            this.actionKeys.map(function (key) { message = message.replace(key, item[key.substring(1, key.length - 1)]); });
        }
        return message;
    };
    /**
     * @param {?} item
     * @param {?} header
     * @return {?}
     */
    TableViewComponent.prototype.cellContent = /**
     * @param {?} item
     * @param {?} header
     * @return {?}
     */
    function (item, header) {
        /** @type {?} */
        var content = this.itemValue(item, header.key.split("."));
        return (content !== undefined && content != null && String(content).length) ? content : '&nbsp;';
    };
    /**
     * @param {?} item
     * @return {?}
     */
    TableViewComponent.prototype.rowDetailerContext = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        return {
            data: item,
            tableInfo: this.tableInfo,
            headers: this.rowDetailerHeaders(item)
        };
    };
    /**
     * @param {?} event
     * @param {?} header
     * @return {?}
     */
    TableViewComponent.prototype.changeFilter = /**
     * @param {?} event
     * @param {?} header
     * @return {?}
     */
    function (event, header) {
        var _this = this;
        /** @type {?} */
        var code = event.which;
        header.filter = event.target.value;
        if (this.filterwhiletyping || code === 13) {
            if (this.filteringTimerId) {
                clearTimeout(this.filteringTimerId);
            }
            this.filteringTimerId = setTimeout(function () {
                _this.filterItems();
                _this.initVisibleRows();
                _this.filteringTimerId = undefined;
            }, 123);
        }
    };
    /**
     * @param {?} event
     * @param {?} item
     * @return {?}
     */
    TableViewComponent.prototype.actionClick = /**
     * @param {?} event
     * @param {?} item
     * @return {?}
     */
    function (event, item) {
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
    /**
     * @return {?}
     */
    TableViewComponent.prototype.print = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.printMode = true;
        setTimeout(function () {
            /** @type {?} */
            var content = _this.el.nativeElement.innerHTML;
            _this.printMode = false;
            /** @type {?} */
            var popupWin = window.open('', '_blank', 'width=300,height=300');
            popupWin.document.open();
            popupWin.document.write('<html><body onload="window.print()">' + content + '</html>');
            popupWin.document.close();
        }, 3);
    };
    /**
     * @param {?} value
     * @param {?} filterBy
     * @return {?}
     */
    TableViewComponent.prototype.shouldSkipItem = /**
     * @param {?} value
     * @param {?} filterBy
     * @return {?}
     */
    function (value, filterBy) {
        /** @type {?} */
        var result = false;
        if (value !== undefined && value !== null && String(value).length) {
            /** @type {?} */
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
                /** @type {?} */
                var f = filterBy.substring(1);
                result = v.indexOf(f) !== v.length - f.length;
            }
            else if (filterBy[0] !== '*' && filterBy[filterBy.length - 1] === '*') {
                /** @type {?} */
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
    /**
     * @return {?}
     */
    TableViewComponent.prototype.filterItems = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.filteredItems = this.items ? this.items.filter(function (item) {
            /** @type {?} */
            var keepItem = true;
            for (var i = 0; i < _this.headers.length; i++) {
                /** @type {?} */
                var header = _this.headers[i];
                if (header.filter && header.filter.length) {
                    /** @type {?} */
                    var v = _this.itemValue(item, header.key.split("."));
                    if (_this.shouldSkipItem(v, header.filter)) {
                        keepItem = false;
                        break;
                    }
                }
            }
            return keepItem;
        }) : [];
        this.onfilter.emit(this.filteredItems);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TableViewComponent.prototype.onTableCellEdit = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var id = event.id.split("-");
        /** @type {?} */
        var n = event.name;
        /** @type {?} */
        var v = event.value;
        /** @type {?} */
        var t = this.items[parseInt(id[1])];
        if (t) {
            /** @type {?} */
            var list = id[0].split(".");
            /** @type {?} */
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
    /**
     * @param {?} event
     * @return {?}
     */
    TableViewComponent.prototype.dragEnabled = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        return event.medium.dragable;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TableViewComponent.prototype.dropEnabled = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        return event.destination.medium.dragable;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TableViewComponent.prototype.onDragStart = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        //        this.dragging = true;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TableViewComponent.prototype.onDragEnd = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        //       this.dragging = false;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TableViewComponent.prototype.onDrop = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.swapColumns(event.source, event.destination);
    };
    TableViewComponent.decorators = [
        { type: Component, args: [{
                    selector: 'table-view',
                    template: "\r\n<table [class]=\"tableClass\"  #flexible>\r\n    <caption *ngIf=\"caption\" [textContent]=\"caption\"></caption>\r\n    <thead>\r\n        <tr>\r\n            <th scope=\"col\" *ngIf=\"enableIndexing && !printMode\" id=\"indexable\" class=\"indexable\"></th>\r\n            <th scope=\"col\" *ngFor=\"let header of headers\" #th\r\n                [dragEnabled]=\"dragEnabled.bind(this)\"\r\n                [dropEnabled]=\"dropEnabled.bind(this)\"\r\n                [medium]=\"header\"\r\n                (onDragStart)=\"onDragStart($event)\"\r\n                (onDragEnd)=\"onDragEnd($event)\"\r\n                (onDrop)=\"onDrop($event)\"\r\n                [id]=\"header.key\"\r\n                [attr.width]=\"header.width ? header.width : null\" \r\n                [style.min-width]=\"header.minwidth ? header.minwidth : ''\" \r\n                [attr.tabindex]=\"header.sortable ? 0 : -1\"\r\n                (keydown)=\"keydown($event, th)\" (click)=\"sort(header, icon)\">\r\n                <span *ngIf=\"!printMode && header.sortable\" class=\"off-screen\"  [textContent]=\"vocabulary.clickSort\"></span>\r\n                <span class=\"locker icon fa\" #locker\r\n                        *ngIf=\"!printMode && lockable && (headers.length > 1 || header.locked)\"\r\n                        tabindex=\"0\"\r\n                        title=\"lock/unlock this column\"\r\n                        (keydown)=\"keydown($event, locker)\" (click)=\"lock(header, $event)\"\r\n                        [class.fa-lock]=\"header.locked\"\r\n                        [class.fa-unlock]=\"!header.locked\"></span>\r\n                <span class=\"title\"\r\n                        [class.dragable]=\"header.dragable\"\r\n                        [textContent]=\"header.value\"></span>\r\n                <span class=\"icon fa\" [class.hidden]=\"printMode || !items || items.length === 0\" #icon\r\n                        [class.fa-sort]=\"header.sortable\"\r\n                        [class.fa-sort-asc]=\"header.assending\"\r\n                        [class.fa-sort-desc]=\"header.desending\"></span>\r\n            </th>\r\n            <th scope=\"col\" *ngIf=\"action && !printMode\" id=\"actionable\" class=\"actionable\"></th>\r\n        </tr>\r\n    </thead>\r\n    <tbody>\r\n        <tr *ngIf=\"!printMode && enableFiltering && items && items.length\">\r\n            <td scope=\"row\" *ngIf=\"enableIndexing && !printMode\" class=\"index filter\">\r\n                <input type=\"text\" disabled style=\"opacity:0\" />\r\n            </td>\r\n            <td scope=\"row\" \r\n                        *ngFor=\"let header of headers; let i=index\" \r\n                        [attr.data-label]=\"header.value\" \r\n                        class=\"filter\">\r\n                <span *ngIf=\"header.filter === undefined\">&nbsp;</span>\r\n                <input  *ngIf=\"header.filter !== undefined\"\r\n                        id=\"filter-{{i}}\"\r\n                        type=\"text\" \r\n                        (keyup)=\"changeFilter($event, header)\"\r\n                        [value]=\"header.filter ? header.filter : ''\" />\r\n                <label *ngIf=\"header.filter !== undefined\" for=\"filter-{{i}}\" ><span class=\"off-screen\" >Filter \"{{header.value}}\"</span><span class=\"fa fa-search\"></span></label>\r\n            </td>\r\n            <td scope=\"row\" *ngIf=\"action && !printMode\"></td>\r\n        </tr>\r\n       <ng-template ngFor let-item [ngForOf]=\"filteredItems\" let-i=\"index\">\r\n            <tr (click)=\"actionClick($event, item)\"\r\n                (mouseover)=\"hover(item, true)\"\r\n                (mouseout)=\"hover(item, false)\"\r\n                [class.pointer]=\"action\"\r\n                [class.hover]=\"item.hover\"\r\n                [class.expanded]=\"item.expanded\"\r\n                [class.odd]=\"i%2\">\r\n                <td scope=\"row\" class=\"index\" *ngIf=\"enableIndexing && !printMode\">\r\n                    <span [textContent]=\"i + pageInfo.from + 1\"></span></td>\r\n                <td scope=\"row\" \r\n                    *ngFor=\"let header of headers\" \r\n                    [class]=\"toCssClass(header)\"\r\n                    [attr.data-label]=\"header.value\" \r\n                    [intoName]=\"header.value\"\r\n                    [intoId]=\"header.key + '-' + i\"\r\n                    [into]=\"header.format\"\r\n                    [intoData]=\"item\"\r\n                    [rawContent]=\"cellContent(item, header)\"\r\n                    [onComponentChange]=\"onTableCellEdit.bind(this)\"></td>\r\n                <td scope=\"row\" *ngIf=\"action && !printMode\">\r\n                    <a class=\"actionable\"\r\n                        *ngIf=\"expandable(item, true)\"\r\n                        tabindex=\"0\"\r\n                        role=\"button\"\r\n                        style=\"cursor:pointer\"\r\n                        [class.expanded]=\"item.expanded\" #clicker\r\n                        (keydown)=\"keydown($event, clicker)\" (click)=\"actionClick($event, item)\">\r\n                        <span\r\n                            class=\"icon fa\"\r\n                            [class.fa-angle-right]=\"!rowDetailer\"\r\n                            [class.fa-minus-square-o]=\"rowDetailer && item.expanded\"\r\n                            [class.fa-plus-square-o]=\"rowDetailer && !item.expanded\"\r\n                            aria-hidden=\"true\"></span>\r\n                        <span class=\"off-screen\" [textContent]=\"offScreenMessage(item)\"></span>\r\n                    </a>\r\n                </td>\r\n            </tr>\r\n            <tr *ngIf=\"rowDetailer && item.expanded\" class=\"detail\" [class.odd]=\"i%2\">\r\n                <td scope=\"row\" class=\"index\" *ngIf=\"enableIndexing && !printMode\"></td>\r\n                <td [attr.colspan]=\"columnsCount()\">\r\n                    <ng-container [ngTemplateOutlet]=\"rowDetailer\" [ngTemplateOutletContext]=\"rowDetailerContext(item)\"></ng-container>\r\n                </td>\r\n            </tr>\r\n        </ng-template>\r\n    </tbody>\r\n</table>\r\n",
                    styles: [":host{display:inline-block!important;width:100%;position:relative;margin:0 auto;border-spacing:0;border-collapse:collapse}:host .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host table{margin:1rem auto;padding:0;width:100%;table-layout:fixed;max-width:99%;background-color:transparent;border-collapse:collapse}:host table caption{background-color:#c3e5e2;border-radius:2px;color:#1b1b1b;caption-side:top;font-size:14px;padding:5px 6px;margin-bottom:15px;text-align:left}:host table thead{border-top:1px solid #bbb;border-bottom:1px solid #bbb;background-color:#eee}:host table tr{border:0}:host table tr.expanded td{font-weight:700}:host table td{padding-left:3px;min-height:23px}:host table td.index span{display:block;height:23px}:host table td:first-child{padding-left:5px}:host table td ::ng-deep input-component .locked,:host table td ::ng-deep input-component input{width:99%}:host table td .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host table td.filter{padding:0;position:relative}:host table td.filter input{box-sizing:border-box;width:100%;margin:0}:host table td.filter .fa{position:absolute;top:4px;right:2px;color:#bad}:host table td ::ng-deep img{height:24px}:host table td.index{background-color:#eee;border-right:1px solid #bbb}:host table th{cursor:default;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none;height:24px;position:relative;white-space:nowrap;font-weight:400;text-transform:uppercase;font-size:14px;padding-top:6px;padding-bottom:6px;text-align:left}:host table th.drag-over{background-color:#9b9b9b}:host table th.drag-over .icon,:host table th.drag-over .title{color:#eee}:host table th:first-child{padding-left:5px}:host table th.ascending,:host table th.descending,:host table th.sortable{cursor:pointer;height:12px}:host table th.indexable{width:33px}:host table th.actionable{width:24px}:host table th .hidden{display:none}:host table th .title{color:#254a4d;display:inline-block;height:20px;white-space:nowrap}:host table th .dragable{cursor:move}:host table th .icon{width:22px;display:inline-block;height:20px;color:#254a4d}:host .fa.fa-angle-right{font-size:18px}table tr.expanded td{border-bottom:0}table tr.detail td{border-top:0;cursor:default}table tr.expanded td a.expanded{background-position:right 2px}table tbody tr.hover,table tbody tr:hover{background-color:#ffeed2}table tbody tr.detail.hover,table tbody tr.detail.hover td table thead tr,table tbody tr.detail:hover,table tbody tr.detail:hover td table thead tr{background-color:inherit}table tr td a.actionable{display:inline-table;height:32px;vertical-align:middle;width:25px;line-height:30px;color:#254a4d}table tbody tr.detail.hover td:last-child,table tbody tr.detail:hover td:last-child{border-right:0}table tbody tr.detail.hover td:first-child,table tbody tr.detail:hover td:first-child{border-left:0}table tr td{border-bottom:1px solid #b1b3b3;color:#254a5d;font-size:15px;text-transform:capitalize}table tbody tr.pointer{cursor:pointer}table.alert-danger{border:0}table.alert-danger caption{background-color:transparent;font-weight:700;margin-bottom:0}table.alert-danger td{border-bottom:0;display:block}table.alert-danger td:first-child{padding-left:0}table.alert-danger td:last-child{border-bottom:0}table.alert-danger td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase;width:20%}table.alert-danger td a span.icon{width:100%}table.alert-danger thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}table.alert-danger tr{border:2px solid #fff;display:block;margin-bottom:.625em;padding:5px;border-radius:5px}table.alert-danger tr th.actionable{width:inherit}table.alert-danger tr td{border-bottom:0}@media screen and (max-width:600px){table{border:0}table td{border-bottom:0;display:block;text-align:right}table td:first-child{padding-left:0}table td:last-child{border-bottom:0}table td.filter input{width:50%!important}table td.filter .fa{right:7px!important}table td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase}table td a span.icon{width:100%}table thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}table tr{border-bottom:3px solid #ddd;display:block;margin-bottom:.625em}table tr th.actionable{width:inherit}table tr td{border-bottom:0}table.alert-danger td:before{width:inherit}}"]
                }] }
    ];
    /** @nocollapse */
    TableViewComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
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
    return TableViewComponent;
}());
export { TableViewComponent };
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vZmxleGlibGUtdGFibGUvIiwic291cmNlcyI6WyJzcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFNQSxPQUFPLEVBQ0gsU0FBUyxFQUNaLEtBQUssRUFDTCxNQUFNLEVBQ04sU0FBUyxFQUNULGdCQUFnQixFQUdoQixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sZUFBZSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTBHbkIsNEJBQW1CLEVBQWE7UUFBYixPQUFFLEdBQUYsRUFBRSxDQUFXO3dCQTlFeEIsS0FBSzt5QkFDSixLQUFLOzZCQUNELEVBQUU7MEJBSUs7WUFDdEIsY0FBYyxFQUFFLGlCQUFpQjtZQUNqQyxnQkFBZ0IsRUFBRSxtQkFBbUI7WUFDckMsU0FBUyxFQUFFLGVBQWU7WUFDMUIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsU0FBUyxFQUFFLE9BQU87WUFDbEIsUUFBUSxFQUFFLE1BQU07WUFDaEIsWUFBWSxFQUFFLFVBQVU7U0FDeEI7MEJBa0JzQix3QkFBd0I7d0JBaUM1QixJQUFJLFlBQVksRUFBRTt3QkFHbEIsSUFBSSxZQUFZLEVBQUU7d0JBR2xCLElBQUksWUFBWSxFQUFFO2lDQUdULElBQUksWUFBWSxFQUFFO0tBSVA7Ozs7O0lBRy9CLDZDQUFnQjs7OztjQUFDLEVBQVU7O1FBQzVCLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDOztRQUMvQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDdEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMs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QztLQUNsRDs7Z0JBcGRELFNBQVMsU0FBQztvQkFDVixRQUFRLEVBQUUsWUFBWTtvQkFDdEIsa2lNQUFxQzs7aUJBRXJDOzs7O2dCQTNCQSxVQUFVOzs7NkJBa0NOLEtBQUssU0FBQyxZQUFZOzJCQVdyQixLQUFLLFNBQUMsVUFBVTswQkFHaEIsS0FBSyxTQUFDLFNBQVM7eUJBR1osS0FBSyxTQUFDLFFBQVE7MkJBR2QsS0FBSyxTQUFDLFVBQVU7NkJBR2hCLEtBQUssU0FBQyxZQUFZOzZCQUdsQixLQUFLLFNBQUMsWUFBWTswQkFHckIsS0FBSyxTQUFDLFNBQVM7d0JBR2YsS0FBSyxTQUFDLE9BQU87NEJBR2IsS0FBSyxTQUFDLFdBQVc7aUNBR2QsS0FBSyxTQUFDLGdCQUFnQjtrQ0FHdEIsS0FBSyxTQUFDLGlCQUFpQjs4QkFHdkIsS0FBSyxTQUFDLGFBQWE7NkJBR25CLEtBQUssU0FBQyxZQUFZOzJCQUdsQixLQUFLLFNBQUMsVUFBVTtvQ0FHaEIsS0FBSyxTQUFDLG1CQUFtQjtxQ0FHekIsS0FBSyxTQUFDLG9CQUFvQjsyQkFHN0IsTUFBTSxTQUFDLFVBQVU7MkJBR2pCLE1BQU0sU0FBQyxVQUFVOzJCQUdqQixNQUFNLFNBQUMsVUFBVTtvQ0FHakIsTUFBTSxTQUFDLG1CQUFtQjt3QkFHMUIsU0FBUyxTQUFDLFVBQVUsRUFBRSxFQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBQzs7NkJBeEhoRDs7U0EyQ2Esa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuKiBQcm92aWRlcyByZW5kZXJpbmcgb2YgYSB0YWJsZSB3aGljaCBpcyB1c2luZyB0aGUgZ2l2ZW4gRmxleGlibGVUYWJsZUhlYWRlciBzZXQgaW5cclxuKiBvcmRlciB0byB0YWJ1bGF0ZSB0aGUgZ2l2ZW4gZGF0YS4gQXMgcGVyIGRlZmluaXRpb24gb2YgZWFyY2ggaGVhZGVyIGNvbXBvbmVudCxcclxuKiBhIGNvbHVtbiBjb3VsZCBiZSBoaWRkZW4sIHNvcnRhYmxlLCBvciBkcmFnZ2FibGUuIEVhY2ggdGFibGUgcm93IGNhbiBleHBhbmQvY29sbGFwc2VcclxuKiBvciByZXNwb25kIHRvIGEgY2xpY2sgYWN0aW9uLlxyXG4qL1xyXG5pbXBvcnQge1xyXG4gICAgQ29tcG9uZW50LFxyXG5cdElucHV0LFxyXG5cdE91dHB1dCxcclxuXHRWaWV3Q2hpbGQsXHJcblx0Vmlld0NvbnRhaW5lclJlZixcclxuXHRPbkluaXQsXHJcblx0T25DaGFuZ2VzLFxyXG5cdEV2ZW50RW1pdHRlcixcclxuXHRFbGVtZW50UmVmXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBEcm9wRXZlbnQsIERyYWdFdmVudCB9IGZyb20gJ2RyYWctZW5hYmxlZCc7XHJcbmltcG9ydCB7IFRpbWVvdXRzIH0gZnJvbSAnLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0B0eXBlcy9zZWxlbml1bS13ZWJkcml2ZXInO1xyXG5pbXBvcnQgeyBUaW1lIH0gZnJvbSAnLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0Bhbmd1bGFyL2NvbW1vbic7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEZsZXhpYmxlVGFibGVIZWFkZXIge1xyXG5cdGtleTogc3RyaW5nLFxyXG5cdHZhbHVlOiBzdHJpbmcsXHJcblx0cHJlc2VudDogYm9vbGVhbixcclxuXHR3aWR0aD86IHN0cmluZyxcclxuXHRtaW53aWR0aD86IHN0cmluZyxcclxuXHRmb3JtYXQ/OiBzdHJpbmcsXHJcblx0ZmlsdGVyPzogc3RyaW5nLFxyXG5cdGRyYWdhYmxlPzogYm9vbGVhbixcclxuXHRzb3J0YWJsZT86IGJvb2xlYW4sXHJcblx0Y2xhc3M/OnN0cmluZyxcclxuXHRsb2NrZWQ/OmJvb2xlYW4sXHJcblx0YXNjZW5kaW5nPzogYm9vbGVhbixcclxuXHRkZXNjZW5kaW5nPzogYm9vbGVhblxyXG59XHJcblxyXG5AQ29tcG9uZW50KHtcclxuXHRzZWxlY3RvcjogJ3RhYmxlLXZpZXcnLFxyXG5cdHRlbXBsYXRlVXJsOiAnLi90YWJsZS5jb21wb25lbnQuaHRtbCcsXHJcblx0c3R5bGVVcmxzOiBbJy4vdGFibGUuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgVGFibGVWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xyXG5cdGRyYWdnaW5nID0gZmFsc2U7XHJcblx0cHJpbnRNb2RlID0gZmFsc2U7XHJcblx0ZmlsdGVyZWRJdGVtcyA9IFtdO1xyXG5cdGZpbHRlcmluZ1RpbWVySWQ6IGFueTtcclxuXHJcbiAgICBASW5wdXQoXCJ2b2NhYnVsYXJ5XCIpXHJcbiAgICBwdWJsaWMgdm9jYWJ1bGFyeSA9IHtcclxuXHRcdGNvbmZpZ3VyZVRhYmxlOiBcIkNvbmZpZ3VyZSBUYWJsZVwiLFxyXG5cdFx0Y29uZmlndXJlQ29sdW1uczogXCJDb25maWd1cmUgQ29sdW1uc1wiLFxyXG5cdFx0Y2xpY2tTb3J0OiBcIkNsaWNrIHRvIFNvcnRcIixcclxuXHRcdHNldFNpemU6IFwiU2V0IFNpemVcIixcclxuXHRcdGZpcnN0UGFnZTogXCJGaXJzdFwiLFxyXG5cdFx0bGFzdFBhZ2U6IFwiTGFzdFwiLFxyXG5cdFx0cHJldmlvdXNQYWdlOiBcIlByZXZpb3VzXCJcclxuXHR9O1xyXG5cclxuXHRASW5wdXQoXCJsb2NrYWJsZVwiKVxyXG5cdGxvY2thYmxlOmJvb2xlYW47XHJcblxyXG5cdEBJbnB1dChcImNhcHRpb25cIilcclxuICAgIHB1YmxpYyBjYXB0aW9uOiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KFwiYWN0aW9uXCIpXHJcbiAgICBwdWJsaWMgYWN0aW9uOiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KFwicGFnZUluZm9cIilcclxuICAgIHB1YmxpYyBwYWdlSW5mbztcclxuXHJcbiAgICBASW5wdXQoXCJhY3Rpb25LZXlzXCIpXHJcbiAgICBwdWJsaWMgYWN0aW9uS2V5cztcclxuXHJcbiAgICBASW5wdXQoXCJ0YWJsZUNsYXNzXCIpXHJcbiAgICBwdWJsaWMgdGFibGVDbGFzcyA9ICdkZWZhdWx0LWZsZXhpYmxlLXRhYmxlJztcclxuXHJcblx0QElucHV0KFwiaGVhZGVyc1wiKVxyXG5cdHB1YmxpYyBoZWFkZXJzOiBhbnlbXTtcclxuXHJcblx0QElucHV0KFwiaXRlbXNcIilcclxuXHRwdWJsaWMgaXRlbXM6IGFueVtdO1xyXG5cclxuXHRASW5wdXQoXCJ0YWJsZUluZm9cIilcclxuXHRwdWJsaWMgdGFibGVJbmZvOiBhbnk7XHJcblxyXG4gICAgQElucHV0KFwiZW5hYmxlSW5kZXhpbmdcIilcclxuICAgIHB1YmxpYyBlbmFibGVJbmRleGluZzogYm9vbGVhbjtcclxuXHJcbiAgICBASW5wdXQoXCJlbmFibGVGaWx0ZXJpbmdcIilcclxuICAgIHB1YmxpYyBlbmFibGVGaWx0ZXJpbmc6IGJvb2xlYW47XHJcblxyXG4gICAgQElucHV0KFwicm93RGV0YWlsZXJcIilcclxuICAgIHB1YmxpYyByb3dEZXRhaWxlcjogYW55O1xyXG5cclxuICAgIEBJbnB1dChcImV4cGFuZGFibGVcIilcclxuICAgIHB1YmxpYyBleHBhbmRhYmxlOiBhbnk7XHJcblxyXG4gICAgQElucHV0KFwiZXhwYW5kSWZcIilcclxuICAgIHB1YmxpYyBleHBhbmRJZjogYm9vbGVhbjtcclxuXHJcbiAgICBASW5wdXQoXCJmaWx0ZXJ3aGlsZXR5cGluZ1wiKVxyXG4gICAgcHVibGljIGZpbHRlcndoaWxldHlwaW5nOiBib29sZWFuO1xyXG5cclxuICAgIEBJbnB1dChcInJvd0RldGFpbGVySGVhZGVyc1wiKVxyXG4gICAgcHVibGljIHJvd0RldGFpbGVySGVhZGVyczogYW55O1xyXG5cclxuXHRAT3V0cHV0KCdvbmFjdGlvbicpXHJcblx0cHJpdmF0ZSBvbmFjdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0QE91dHB1dCgnb25jaGFuZ2UnKVxyXG5cdHByaXZhdGUgb25jaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBPdXRwdXQoJ29uZmlsdGVyJylcclxuXHRwcml2YXRlIG9uZmlsdGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHRAT3V0cHV0KCdvbkNlbGxDb250ZW50RWRpdCcpXHJcblx0cHJpdmF0ZSBvbkNlbGxDb250ZW50RWRpdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0QFZpZXdDaGlsZCgnZmxleGlibGUnLCB7cmVhZDogVmlld0NvbnRhaW5lclJlZn0pIHByaXZhdGUgdGFibGU6IFZpZXdDb250YWluZXJSZWY7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOkVsZW1lbnRSZWYpIHt9XHJcblxyXG5cclxuXHRwcml2YXRlIGZpbmRDb2x1bW5XaXRoSUQoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSB0aGlzLmhlYWRlckNvbHVtbkVsZW1lbnRzKCk7XHJcblx0XHRsZXQgY29sdW1uID0gbnVsbDtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAobGlzdFtpXS5nZXRBdHRyaWJ1dGUoXCJpZFwiKSA9PT0gaWQpIHtcclxuXHRcdFx0XHRjb2x1bW4gPSBsaXN0W2ldO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY29sdW1uO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBzd2FwQ29sdW1ucyhzb3VyY2U6IGFueSwgZGVzdGluYXRpb246IGFueSkge1xyXG5cclxuXHRcdGlmIChzb3VyY2Uubm9kZS5wYXJlbnROb2RlID09PSBkZXN0aW5hdGlvbi5ub2RlLnBhcmVudE5vZGUpIHtcclxuXHRcdFx0Y29uc3Qgc3JjSW5kZXggPSB0aGlzLmdldENvbHVtbkluZGV4KHNvdXJjZS5tZWRpdW0ua2V5KTtcclxuXHRcdFx0Y29uc3QgZGVzSW5kZXggPSB0aGlzLmdldENvbHVtbkluZGV4KGRlc3RpbmF0aW9uLm1lZGl1bS5rZXkpO1xyXG5cdFx0XHRpZiAoc3JjSW5kZXggPCAwIHx8IGRlc0luZGV4IDwgMCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiaW52YWxpZCBkcm9wIGlkXCIsIHNvdXJjZS5tZWRpdW0ua2V5LCBkZXN0aW5hdGlvbi5tZWRpdW0ua2V5KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Y29uc3QgeCA9IHRoaXMuZmlsdGVyZWRJdGVtcztcclxuXHRcdFx0dGhpcy5maWx0ZXJlZEl0ZW1zID0gW107XHJcblxyXG5cdFx0XHRzZXRUaW1lb3V0KCgpPT57XHJcblx0XHRcdFx0Y29uc3Qgc29iaiA9IHRoaXMuaGVhZGVyc1tzcmNJbmRleF07XHJcblx0XHRcdFx0dGhpcy5oZWFkZXJzW3NyY0luZGV4XSA9IHRoaXMuaGVhZGVyc1tkZXNJbmRleF07XHJcblx0XHRcdFx0dGhpcy5oZWFkZXJzW2Rlc0luZGV4XSA9IHNvYmo7XHJcblx0XHRcdFx0dGhpcy5maWx0ZXJlZEl0ZW1zID0geDtcclxuXHJcblx0XHRcdFx0dGhpcy5vbmZpbHRlci5lbWl0KHRoaXMuZmlsdGVyZWRJdGVtcyk7XHJcblx0XHRcdFx0dGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaGVhZGVycyk7XHJcblx0XHRcdH0sIDMzKTtcclxuXHRcclxuXHRcdH0gZWxzZSBpZiAoc291cmNlLm1lZGl1bS5sb2NrZWQgfHwgZGVzdGluYXRpb24ubWVkaXVtLmxvY2tlZCkge1xyXG5cdFx0XHRjb25zdCB4ID0gdGhpcy5maWx0ZXJlZEl0ZW1zO1xyXG5cdFx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSBbXTtcclxuXHRcdFx0dGhpcy5vbmZpbHRlci5lbWl0KHRoaXMuZmlsdGVyZWRJdGVtcyk7XHJcblx0XHRcdHNldFRpbWVvdXQoKCk9PntcclxuXHRcdFx0XHRzb3VyY2UubWVkaXVtLmxvY2tlZCA9ICFzb3VyY2UubWVkaXVtLmxvY2tlZDtcclxuXHRcdFx0XHRkZXN0aW5hdGlvbi5tZWRpdW0ubG9ja2VkID0gIWRlc3RpbmF0aW9uLm1lZGl1bS5sb2NrZWQ7XHJcblx0XHRcdFx0dGhpcy5maWx0ZXJlZEl0ZW1zID0geDtcclxuXHRcdFx0XHR0aGlzLm9uZmlsdGVyLmVtaXQodGhpcy5maWx0ZXJlZEl0ZW1zKTtcclxuXHRcdFx0XHR0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5oZWFkZXJzKTtcclxuXHRcdFx0fSwzMyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGdldENvbHVtbkluZGV4KGlkOiBzdHJpbmcpIHtcclxuXHRcdGxldCBpbmRleCA9IC0xO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlYWRlcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKHRoaXMuaGVhZGVyc1tpXS5rZXkgPT09IGlkKSB7XHJcblx0XHRcdFx0aW5kZXggPSBpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gaW5kZXg7XHJcblx0fVxyXG5cdHByaXZhdGUgaXRlbVZhbHVlKGl0ZW0sIGhwYXRoKSB7XHJcblx0XHRsZXQgc3ViaXRlbSA9IGl0ZW07XHJcblx0XHRocGF0aC5tYXAoIChzdWJrZXkpID0+IHtcclxuXHRcdFx0aWYgKHN1Yml0ZW0pIHtcclxuXHRcdFx0XHRzdWJpdGVtID0gc3ViaXRlbVtzdWJrZXldO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdFx0cmV0dXJuIHN1Yml0ZW0gPT09IHVuZGVmaW5lZCB8fCBzdWJpdGVtID09PSBudWxsIHx8IHN1Yml0ZW0gPT09IFwibnVsbFwiID8gXCJcIiA6IHN1Yml0ZW07XHJcblx0fVxyXG5cdGluaXRWaXNpYmxlUm93cygpIHtcclxuXHRcdGNvbnN0IHJlc3VsdCA9IFtdO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmZpbHRlcmVkSXRlbXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKGkgPj0gdGhpcy5wYWdlSW5mby5mcm9tICYmIGkgPD0gdGhpcy5wYWdlSW5mby50bykge1xyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKHRoaXMuZmlsdGVyZWRJdGVtc1tpXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IHJlc3VsdDtcclxuXHR9XHJcblxyXG5cdGxvY2soaGVhZGVyOiBGbGV4aWJsZVRhYmxlSGVhZGVyLCBldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1x0XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdGhlYWRlci5sb2NrZWQgPSAhaGVhZGVyLmxvY2tlZDtcclxuXHRcdHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzLmhlYWRlcnMpO1xyXG5cdH1cclxuXHRzb3J0KGhlYWRlcjogRmxleGlibGVUYWJsZUhlYWRlciwgaWNvbikge1xyXG5cdFx0aWYgKGhlYWRlci5zb3J0YWJsZSAmJiB0aGlzLml0ZW1zICYmIHRoaXMuaXRlbXMubGVuZ3RoKSB7XHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWFkZXJzLmxlbmd0aCA7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaCA9IHRoaXMuaGVhZGVyc1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaC5rZXkgIT09IGhlYWRlci5rZXkpIHtcclxuXHRcdFx0XHRcdGNvbnN0IGl0ZW0gPSB0aGlzLmZpbmRDb2x1bW5XaXRoSUQoaC5rZXkpO1xyXG5cclxuXHRcdFx0XHRcdGlmIChpdGVtKSB7XHJcblx0XHRcdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LnJlbW92ZShcImFzY2VuZGluZ1wiKTtcclxuXHRcdFx0XHRcdFx0aXRlbS5jbGFzc0xpc3QucmVtb3ZlKFwiZGVzY2VuZGluZ1wiKTtcclxuXHRcdFx0XHRcdFx0aXRlbS5jbGFzc0xpc3QuYWRkKFwic29ydGFibGVcIik7XHJcblx0XHRcdFx0XHR9XHJcbiAgICAgICAgICAgICAgICAgICAgaC5kZXNjZW5kaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaC5hc2NlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuICAgICAgICAgICAgaWNvbi5jbGFzc0xpc3QucmVtb3ZlKFwiZmEtc29ydFwiKTtcclxuXHRcdFx0aWYgKGhlYWRlci5hc2NlbmRpbmcgfHwgKCFoZWFkZXIuYXNjZW5kaW5nICYmICFoZWFkZXIuZGVzY2VuZGluZykpIHtcclxuXHRcdFx0XHRoZWFkZXIuZGVzY2VuZGluZyA9IHRydWU7XHJcblx0XHRcdFx0aGVhZGVyLmFzY2VuZGluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdGljb24uY2xhc3NMaXN0LnJlbW92ZShcImZhLXNvcnQtYXNjXCIpO1xyXG5cdFx0XHRcdGljb24uY2xhc3NMaXN0LmFkZChcImZhLXNvcnQtZGVzY1wiKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRoZWFkZXIuZGVzY2VuZGluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdGhlYWRlci5hc2NlbmRpbmcgPSB0cnVlO1xyXG5cdFx0XHRcdGljb24uY2xhc3NMaXN0LnJlbW92ZShcImZhLXNvcnQtZGVzY1wiKTtcclxuXHRcdFx0XHRpY29uLmNsYXNzTGlzdC5hZGQoXCJmYS1zb3J0LWFzY1wiKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjb25zdCBocGF0aCA9IGhlYWRlci5rZXkuc3BsaXQoXCIuXCIpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuZW5hYmxlRmlsdGVyaW5nKSB7XHJcblx0XHRcdFx0dGhpcy5maWx0ZXJJdGVtcygpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IHRoaXMuaXRlbXMgPyB0aGlzLml0ZW1zIDogW107XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5maWx0ZXJlZEl0ZW1zLnNvcnQoKGEsIGIpID0+IHtcclxuXHRcdFx0XHRjb25zdCB2MSA9IHRoaXMuaXRlbVZhbHVlKGEsIGhwYXRoKTtcclxuXHRcdFx0XHRjb25zdCB2MiA9IHRoaXMuaXRlbVZhbHVlKGIsIGhwYXRoKTtcclxuXHJcblx0XHRcdFx0aWYgKGhlYWRlci5hc2NlbmRpbmcpIHtcclxuXHRcdFx0XHRcdHJldHVybiB2MSA+IHYyID8gMSA6IC0xO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gdjEgPCB2MiA/IDEgOiAtMTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHRoaXMuaW5pdFZpc2libGVSb3dzKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRvZmZzZXRXaWR0aCgpIHtcclxuXHRcdHJldHVybiB0aGlzLnRhYmxlLmVsZW1lbnQubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aDtcclxuXHR9XHJcblxyXG5cdG5nT25DaGFuZ2VzKGNoYW5nZXM6YW55KSB7XHJcblx0XHQvLyBpZiAoY2hhbmdlcy5pdGVtcykge1xyXG5cdFx0Ly8gXHR0aGlzLmV2YWx1YXRlUm93cygpO1xyXG5cdFx0Ly8gfVxyXG5cdH1cclxuXHJcblx0bmdPbkluaXQoKSB7XHJcblx0XHRpZiAodGhpcy5wYWdlSW5mbykge1xyXG5cdFx0XHRpZiAoIXRoaXMucGFnZUluZm8udG8pIHtcclxuXHRcdFx0XHR0aGlzLnBhZ2VJbmZvLnRvID0gdGhpcy5wYWdlSW5mby5wYWdlU2l6ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5wYWdlSW5mbyA9IHsgXHJcbiAgICAgICAgICAgICAgICBjb250ZW50U2l6ZTogMTAwMDAwLCBcclxuICAgICAgICAgICAgICAgIHBhZ2VTaXplOiAxMDAwMDAsIFxyXG4gICAgICAgICAgICAgICAgcGFnZXM6IDEsIFxyXG4gICAgICAgICAgICAgICAgZnJvbTogMCwgXHJcbiAgICAgICAgICAgICAgICB0bzogMTAwMDAwLCBcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRQYWdlOiAxLCBcclxuICAgICAgICAgICAgICAgIG1heFdpZHRoOiBcIjBcIiBcclxuICAgICAgICAgICAgfTtcclxuXHRcdH1cclxuXHRcdGlmICghdGhpcy5oZWFkZXJzKSB7XHJcblx0XHRcdHRoaXMuaGVhZGVycyA9IFtdO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5ldmFsdWF0ZVJvd3MoKTtcclxuICAgICAgICBpZiAodGhpcy5hY3Rpb25LZXlzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aW9uS2V5cyA9IHRoaXMuYWN0aW9uS2V5cy5zcGxpdChcIixcIik7XHJcblx0XHR9XHJcblx0XHRpZiAoIXRoaXMucm93RGV0YWlsZXIgJiYgdGhpcy5leHBhbmRhYmxlKSB7XHJcblx0XHRcdHRoaXMucm93RGV0YWlsZXIgPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdFx0cmV0dXJuIHtkYXRhOiBpdGVtLCBoZWFkZXJzOiBbXX07XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHRpZiAoIXRoaXMuZXhwYW5kYWJsZSkge1xyXG5cdFx0XHR0aGlzLmV4cGFuZGFibGUgPSBmdW5jdGlvbihpdGVtLCBzaG93SWNvbikge3JldHVybiBzaG93SWNvbn07XHJcblx0XHR9XHJcblx0XHRpZiAoIXRoaXMucm93RGV0YWlsZXJIZWFkZXJzKSB7XHJcblx0XHRcdHRoaXMucm93RGV0YWlsZXJIZWFkZXJzID0gKGl0ZW0pID0+IFtdO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRldmFsdWF0ZVJvd3MoKSB7XHJcblx0XHRpZiAodGhpcy5lbmFibGVGaWx0ZXJpbmcpIHtcclxuXHRcdFx0dGhpcy5maWx0ZXJJdGVtcygpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5maWx0ZXJlZEl0ZW1zID0gdGhpcy5pdGVtcyA/IHRoaXMuaXRlbXMgOiBbXTtcclxuXHRcdH1cclxuXHRcdHRoaXMuaW5pdFZpc2libGVSb3dzKCk7XHJcblx0fVxyXG5cclxuICAgIGhlYWRlckNvbHVtbkVsZW1lbnRzKCkge1xyXG5cdFx0bGV0IHJlc3VsdCA9IFtdO1xyXG5cclxuXHRcdGlmICh0aGlzLnRhYmxlLmVsZW1lbnQubmF0aXZlRWxlbWVudC5jaGlsZHJlbikge1xyXG5cdFx0XHRjb25zdCBsaXN0ID0gdGhpcy50YWJsZS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW47XHJcblx0XHRcdHJlc3VsdCA9IHRoaXMuY2FwdGlvbiA/IGxpc3RbMV0uY2hpbGRyZW5bMF0uY2hpbGRyZW4gOiBsaXN0WzBdLmNoaWxkcmVuWzBdLmNoaWxkcmVuO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcblx0aGVhZGVyQnlJZChpZCkge1xyXG5cdFx0bGV0IGg7XHJcblx0XHRmb3IgKGNvbnN0IGkgaW4gdGhpcy5oZWFkZXJzKSB7XHJcblx0XHRcdGlmICh0aGlzLmhlYWRlcnNbaV0ua2V5ID09PSBpZCkge1xyXG5cdFx0XHRcdGggPSB0aGlzLmhlYWRlcnNbaV07XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBoO1xyXG5cdH1cclxuXHJcbiAgICBjb2x1bW5zQ291bnQoKSB7XHJcblx0XHRsZXQgY291bnQgPSAwO1xyXG5cdFx0dGhpcy5oZWFkZXJzLm1hcCggKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0ucHJlc2VudCkge1xyXG4gICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgfVxyXG5cdFx0fSk7XHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb3VudDtcclxuXHR9XHJcblx0aG92ZXIoaXRlbSwgZmxhZykge1xyXG5cdFx0aWYgKGZsYWcpIHtcclxuXHRcdFx0aXRlbS5ob3ZlciA9IHRydWU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRkZWxldGUgaXRlbS5ob3ZlcjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHRvQ3NzQ2xhc3MoaGVhZGVyKSB7XHJcblx0XHRyZXR1cm4gaGVhZGVyLmtleS5yZXBsYWNlKC9cXC4vZywnLScpO1xyXG5cdH1cclxuICAgIGtleWRvd24oZXZlbnQsIGl0ZW0pIHtcclxuICAgICAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcbiAgICAgICAgaWYgKChjb2RlID09PSAxMykgfHwgKGNvZGUgPT09IDMyKSkge1xyXG5cdFx0XHRpdGVtLmNsaWNrKCk7XHJcblx0XHR9XHJcbiAgICB9XHJcbiAgICBvZmZTY3JlZW5NZXNzYWdlKGl0ZW0pIHtcclxuXHRcdGxldCBtZXNzYWdlOiBzdHJpbmcgPSB0aGlzLmFjdGlvbjtcclxuXHRcdGlmICh0aGlzLmFjdGlvbktleXMpIHtcclxuXHRcdFx0dGhpcy5hY3Rpb25LZXlzLm1hcCgoa2V5KSA9PiB7IG1lc3NhZ2UgPSBtZXNzYWdlLnJlcGxhY2Uoa2V5LCBpdGVtW2tleS5zdWJzdHJpbmcoMSwga2V5Lmxlbmd0aCAtIDEpXSk7IH0pXHJcblx0XHR9XHJcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgY2VsbENvbnRlbnQoaXRlbSwgaGVhZGVyKSB7XHJcblx0XHRsZXQgY29udGVudCA9IHRoaXMuaXRlbVZhbHVlKGl0ZW0sIGhlYWRlci5rZXkuc3BsaXQoXCIuXCIpKTtcclxuICAgICAgICByZXR1cm4gKGNvbnRlbnQgIT09IHVuZGVmaW5lZCAmJiBjb250ZW50ICE9IG51bGwgJiYgU3RyaW5nKGNvbnRlbnQpLmxlbmd0aCkgPyBjb250ZW50IDogJyZuYnNwOyc7XHJcblx0fVxyXG5cclxuXHRyb3dEZXRhaWxlckNvbnRleHQoaXRlbSkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZGF0YTogaXRlbSxcclxuXHRcdFx0dGFibGVJbmZvOiB0aGlzLnRhYmxlSW5mbyxcclxuXHRcdFx0aGVhZGVyczogdGhpcy5yb3dEZXRhaWxlckhlYWRlcnMoaXRlbSlcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRjaGFuZ2VGaWx0ZXIoZXZlbnQsIGhlYWRlcikge1xyXG4gICAgICAgIGNvbnN0IGNvZGUgPSBldmVudC53aGljaDtcclxuXHJcblx0XHRoZWFkZXIuZmlsdGVyID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG5cclxuXHRcdGlmICh0aGlzLmZpbHRlcndoaWxldHlwaW5nIHx8IGNvZGUgPT09IDEzKSB7XHJcblx0XHRcdGlmKHRoaXMuZmlsdGVyaW5nVGltZXJJZCkge1xyXG5cdFx0XHRcdGNsZWFyVGltZW91dCh0aGlzLmZpbHRlcmluZ1RpbWVySWQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuZmlsdGVyaW5nVGltZXJJZCA9IHNldFRpbWVvdXQoKCk9PntcclxuXHRcdFx0XHR0aGlzLmZpbHRlckl0ZW1zKCk7XHJcblx0XHRcdFx0dGhpcy5pbml0VmlzaWJsZVJvd3MoKTtcclxuXHRcdFx0XHR0aGlzLmZpbHRlcmluZ1RpbWVySWQgID0gdW5kZWZpbmVkO1xyXG5cdFx0XHR9LCAxMjMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRhY3Rpb25DbGljayhldmVudCwgaXRlbTogYW55KSB7XHJcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBpZiAodGhpcy5yb3dEZXRhaWxlciAmJiAodGhpcy5leHBhbmRJZiB8fCB0aGlzLmV4cGFuZGFibGUoaXRlbSwgZmFsc2UpKSApIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0uZXhwYW5kZWQpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBpdGVtLmV4cGFuZGVkO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5leHBhbmRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm9uYWN0aW9uLmVtaXQoaXRlbSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRwcmludCgpIHtcclxuXHRcdHRoaXMucHJpbnRNb2RlID0gdHJ1ZTtcclxuXHRcdHNldFRpbWVvdXQoKCk9PntcclxuXHRcdFx0Y29uc3QgY29udGVudCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5pbm5lckhUTUw7XHJcblx0XHRcdHRoaXMucHJpbnRNb2RlID0gZmFsc2U7XHJcblx0XHRcdGNvbnN0IHBvcHVwV2luID0gd2luZG93Lm9wZW4oJycsICdfYmxhbmsnLCAnd2lkdGg9MzAwLGhlaWdodD0zMDAnKTtcclxuXHRcdFxyXG5cdFx0XHRwb3B1cFdpbi5kb2N1bWVudC5vcGVuKCk7XHJcbiAgICAgICAgXHRwb3B1cFdpbi5kb2N1bWVudC53cml0ZSgnPGh0bWw+PGJvZHkgb25sb2FkPVwid2luZG93LnByaW50KClcIj4nICsgY29udGVudCArICc8L2h0bWw+Jyk7XHJcbiAgICAgICAgXHRwb3B1cFdpbi5kb2N1bWVudC5jbG9zZSgpO1xyXG5cdFx0fSwzKTtcclxuXHR9XHJcblxyXG5cdC8vIDw1LCAhNSwgPjUsICpFLCBFKiwgKkUqXHJcblx0cHJpdmF0ZSBzaG91bGRTa2lwSXRlbSh2YWx1ZSwgZmlsdGVyQnkpIHtcclxuXHRcdGxldCByZXN1bHQgPSBmYWxzZTtcclxuXHJcblx0XHRpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCAmJiBTdHJpbmcodmFsdWUpLmxlbmd0aCkge1xyXG5cdFx0XHRjb25zdCB2ID0gU3RyaW5nKHZhbHVlKTtcclxuXHRcdFx0aWYgKGZpbHRlckJ5WzBdID09PSAnPCcpIHtcclxuXHRcdFx0XHRyZXN1bHQgPSBmaWx0ZXJCeS5sZW5ndGggPiAxICYmIHBhcnNlRmxvYXQodikgPj0gcGFyc2VGbG9hdChmaWx0ZXJCeS5zdWJzdHJpbmcoMSkpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGZpbHRlckJ5WzBdID09PSAnPicpIHtcclxuXHRcdFx0XHRyZXN1bHQgPSBmaWx0ZXJCeS5sZW5ndGggPiAxICYmIHBhcnNlRmxvYXQodikgPD0gcGFyc2VGbG9hdChmaWx0ZXJCeS5zdWJzdHJpbmcoMSkpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGZpbHRlckJ5WzBdID09PSAnIScpIHtcclxuXHRcdFx0XHRyZXN1bHQgPSBmaWx0ZXJCeS5sZW5ndGggPiAxICYmIHBhcnNlRmxvYXQodikgPT0gcGFyc2VGbG9hdChmaWx0ZXJCeS5zdWJzdHJpbmcoMSkpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGZpbHRlckJ5WzBdID09PSAnPScpIHtcclxuXHRcdFx0XHRyZXN1bHQgPSBmaWx0ZXJCeS5sZW5ndGggPT0gMSB8fCBwYXJzZUZsb2F0KHYpICE9PSBwYXJzZUZsb2F0KGZpbHRlckJ5LnN1YnN0cmluZygxKSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoZmlsdGVyQnlbMF0gPT09ICcqJyAmJiBmaWx0ZXJCeVtmaWx0ZXJCeS5sZW5ndGgtMV0gIT09ICcqJykge1xyXG5cdFx0XHRcdGNvbnN0IGYgPSBmaWx0ZXJCeS5zdWJzdHJpbmcoMSk7XHJcblx0XHRcdFx0cmVzdWx0ID0gdi5pbmRleE9mKGYpICE9PSB2Lmxlbmd0aCAtIGYubGVuZ3RoXHJcblx0XHRcdH0gZWxzZSBpZiAoZmlsdGVyQnlbMF0gIT09ICcqJyAmJiBmaWx0ZXJCeVtmaWx0ZXJCeS5sZW5ndGgtMV0gPT09ICcqJykge1xyXG5cdFx0XHRcdGNvbnN0IGYgPSBmaWx0ZXJCeS5zdWJzdHJpbmcoMCwgZmlsdGVyQnkubGVuZ3RoLTEpO1xyXG5cdFx0XHRcdHJlc3VsdCA9IHYuaW5kZXhPZihmKSAhPT0gMDtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWx0ZXJCeVswXSA9PT0gJyonICYmIGZpbHRlckJ5W2ZpbHRlckJ5Lmxlbmd0aC0xXSA9PT0gJyonKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gZmlsdGVyQnkubGVuZ3RoID4gMSAmJiB2LmluZGV4T2YoIGZpbHRlckJ5LnN1YnN0cmluZygxLCBmaWx0ZXJCeS5sZW5ndGgtMSkgKSA8IDA7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gdi5pbmRleE9mKGZpbHRlckJ5KSA8IDA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fVxyXG5cdGZpbHRlckl0ZW1zKCkge1xyXG5cdFx0dGhpcy5maWx0ZXJlZEl0ZW1zID0gdGhpcy5pdGVtcyA/IHRoaXMuaXRlbXMuZmlsdGVyKChpdGVtKSA9PiB7XHJcblx0XHRcdGxldCBrZWVwSXRlbSA9IHRydWU7XHJcblxyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVhZGVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGNvbnN0IGhlYWRlciA9IHRoaXMuaGVhZGVyc1tpXTtcclxuXHRcdFx0XHRpZiAoaGVhZGVyLmZpbHRlciAmJiBoZWFkZXIuZmlsdGVyLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0Y29uc3QgdiA9IHRoaXMuaXRlbVZhbHVlKGl0ZW0sIGhlYWRlci5rZXkuc3BsaXQoXCIuXCIpKTtcclxuXHJcblx0XHRcdFx0XHRpZiAodGhpcy5zaG91bGRTa2lwSXRlbSh2LGhlYWRlci5maWx0ZXIpKSB7XHJcblx0XHRcdFx0XHRcdGtlZXBJdGVtID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4ga2VlcEl0ZW07XHJcblx0XHR9KSA6IFtdO1xyXG5cdFx0dGhpcy5vbmZpbHRlci5lbWl0KHRoaXMuZmlsdGVyZWRJdGVtcyk7XHJcblx0fVxyXG5cclxuXHRvblRhYmxlQ2VsbEVkaXQoZXZlbnQpIHtcclxuXHRcdGNvbnN0IGlkID0gZXZlbnQuaWQuc3BsaXQoXCItXCIpO1xyXG5cdFx0Y29uc3QgbiA9IGV2ZW50Lm5hbWU7XHJcblx0XHRjb25zdCB2PSBldmVudC52YWx1ZTtcclxuXHRcdGNvbnN0IHQgPSB0aGlzLml0ZW1zW3BhcnNlSW50KGlkWzFdKV07XHJcblxyXG5cdFx0aWYgKHQpIHtcclxuXHRcdFx0Y29uc3QgbGlzdCA9IGlkWzBdLnNwbGl0KFwiLlwiKTtcclxuXHRcdFx0bGV0IHN1Yml0ZW0gPSB0W2xpc3RbMF1dO1xyXG5cdFx0XHRmb3IobGV0IGkgPSAxOyBpIDwgKGxpc3QubGVuZ3RoIC0gMSk7IGkrKykge1xyXG5cdFx0XHRcdHN1Yml0ZW0gPSBzdWJpdGVtW2xpc3RbaV1dXHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHN1Yml0ZW0gJiYgbGlzdC5sZW5ndGggPiAxKXtcclxuXHRcdFx0XHRzdWJpdGVtW2xpc3RbbGlzdC5sZW5ndGggLSAxXV0gPSB2O1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMub25DZWxsQ29udGVudEVkaXQuZW1pdCh7bmFtZTogbiwgdmFsdWU6IHYsIGl0ZW06IHR9KTtcclxuXHRcdH1cclxuICAgIH1cclxuXHJcblx0ZHJhZ0VuYWJsZWQoZXZlbnQ6IERyYWdFdmVudCkge1xyXG5cdFx0cmV0dXJuIGV2ZW50Lm1lZGl1bS5kcmFnYWJsZTtcclxuXHR9XHJcblx0ZHJvcEVuYWJsZWQoZXZlbnQ6IERyb3BFdmVudCkge1xyXG5cdFx0cmV0dXJuIGV2ZW50LmRlc3RpbmF0aW9uLm1lZGl1bS5kcmFnYWJsZTtcclxuXHR9XHJcblx0b25EcmFnU3RhcnQoZXZlbnQ6IERyYWdFdmVudCl7XHJcbi8vICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcclxuXHR9XHJcblx0b25EcmFnRW5kKGV2ZW50OiBEcmFnRXZlbnQpe1xyXG4gLy8gICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xyXG5cdH1cclxuXHRvbkRyb3AoZXZlbnQ6RHJvcEV2ZW50KXtcclxuXHRcdHRoaXMuc3dhcENvbHVtbnMoZXZlbnQuc291cmNlLCBldmVudC5kZXN0aW5hdGlvbik7XHJcblx0fVxyXG59XHJcbiJdfQ==