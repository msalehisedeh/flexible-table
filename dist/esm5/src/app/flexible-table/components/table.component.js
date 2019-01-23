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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlZGVoL2ZsZXhpYmxlLXRhYmxlLyIsInNvdXJjZXMiOlsic3JjL2FwcC9mbGV4aWJsZS10YWJsZS9jb21wb25lbnRzL3RhYmxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBTUEsT0FBTyxFQUNILFNBQVMsRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFDVCxnQkFBZ0IsRUFHaEIsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLGVBQWUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEwR25CLDRCQUFtQixFQUFhO1FBQWIsT0FBRSxHQUFGLEVBQUUsQ0FBVzt3QkE5RXhCLEtBQUs7eUJBQ0osS0FBSzs2QkFDRCxFQUFFOzBCQUlLO1lBQ3RCLGNBQWMsRUFBRSxpQkFBaUI7WUFDakMsZ0JBQWdCLEVBQUUsbUJBQW1CO1lBQ3JDLFNBQVMsRUFBRSxlQUFlO1lBQzFCLE9BQU8sRUFBRSxVQUFVO1lBQ25CLFNBQVMsRUFBRSxPQUFPO1lBQ2xCLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLFlBQVksRUFBRSxVQUFVO1NBQ3hCOzBCQWtCc0Isd0JBQXdCO3dCQWlDNUIsSUFBSSxZQUFZLEVBQUU7d0JBR2xCLElBQUksWUFBWSxFQUFFO3dCQUdsQixJQUFJLFlBQVksRUFBRTtpQ0FHVCxJQUFJLFlBQVksRUFBRTtLQUlQOzs7OztJQUcvQiw2Q0FBZ0I7Ozs7Y0FBQyxFQUFVOztRQUM1QixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQzs7UUFDL0MsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3RDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FB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QUFDLENBQUM7S0FDbEQ7O2dCQXBkRCxTQUFTLFNBQUM7b0JBQ1YsUUFBUSxFQUFFLFlBQVk7b0JBQ3RCLGtpTUFBcUM7O2lCQUVyQzs7OztnQkEzQkEsVUFBVTs7OzZCQWtDTixLQUFLLFNBQUMsWUFBWTsyQkFXckIsS0FBSyxTQUFDLFVBQVU7MEJBR2hCLEtBQUssU0FBQyxTQUFTO3lCQUdaLEtBQUssU0FBQyxRQUFROzJCQUdkLEtBQUssU0FBQyxVQUFVOzZCQUdoQixLQUFLLFNBQUMsWUFBWTs2QkFHbEIsS0FBSyxTQUFDLFlBQVk7MEJBR3JCLEtBQUssU0FBQyxTQUFTO3dCQUdmLEtBQUssU0FBQyxPQUFPOzRCQUdiLEtBQUssU0FBQyxXQUFXO2lDQUdkLEtBQUssU0FBQyxnQkFBZ0I7a0NBR3RCLEtBQUssU0FBQyxpQkFBaUI7OEJBR3ZCLEtBQUssU0FBQyxhQUFhOzZCQUduQixLQUFLLFNBQUMsWUFBWTsyQkFHbEIsS0FBSyxTQUFDLFVBQVU7b0NBR2hCLEtBQUssU0FBQyxtQkFBbUI7cUNBR3pCLEtBQUssU0FBQyxvQkFBb0I7MkJBRzdCLE1BQU0sU0FBQyxVQUFVOzJCQUdqQixNQUFNLFNBQUMsVUFBVTsyQkFHakIsTUFBTSxTQUFDLFVBQVU7b0NBR2pCLE1BQU0sU0FBQyxtQkFBbUI7d0JBRzFCLFNBQVMsU0FBQyxVQUFVLEVBQUUsRUFBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUM7OzZCQXhIaEQ7O1NBMkNhLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiogUHJvdmlkZXMgcmVuZGVyaW5nIG9mIGEgdGFibGUgd2hpY2ggaXMgdXNpbmcgdGhlIGdpdmVuIEZsZXhpYmxlVGFibGVIZWFkZXIgc2V0IGluXHJcbiogb3JkZXIgdG8gdGFidWxhdGUgdGhlIGdpdmVuIGRhdGEuIEFzIHBlciBkZWZpbml0aW9uIG9mIGVhcmNoIGhlYWRlciBjb21wb25lbnQsXHJcbiogYSBjb2x1bW4gY291bGQgYmUgaGlkZGVuLCBzb3J0YWJsZSwgb3IgZHJhZ2dhYmxlLiBFYWNoIHRhYmxlIHJvdyBjYW4gZXhwYW5kL2NvbGxhcHNlXHJcbiogb3IgcmVzcG9uZCB0byBhIGNsaWNrIGFjdGlvbi5cclxuKi9cclxuaW1wb3J0IHtcclxuICAgIENvbXBvbmVudCxcclxuXHRJbnB1dCxcclxuXHRPdXRwdXQsXHJcblx0Vmlld0NoaWxkLFxyXG5cdFZpZXdDb250YWluZXJSZWYsXHJcblx0T25Jbml0LFxyXG5cdE9uQ2hhbmdlcyxcclxuXHRFdmVudEVtaXR0ZXIsXHJcblx0RWxlbWVudFJlZlxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgRHJvcEV2ZW50LCBEcmFnRXZlbnQgfSBmcm9tICdAc2VkZWgvZHJhZy1lbmFibGVkJztcclxuaW1wb3J0IHsgVGltZW91dHMgfSBmcm9tICcuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHR5cGVzL3NlbGVuaXVtLXdlYmRyaXZlcic7XHJcbmltcG9ydCB7IFRpbWUgfSBmcm9tICcuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGFuZ3VsYXIvY29tbW9uJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRmxleGlibGVUYWJsZUhlYWRlciB7XHJcblx0a2V5OiBzdHJpbmcsXHJcblx0dmFsdWU6IHN0cmluZyxcclxuXHRwcmVzZW50OiBib29sZWFuLFxyXG5cdHdpZHRoPzogc3RyaW5nLFxyXG5cdG1pbndpZHRoPzogc3RyaW5nLFxyXG5cdGZvcm1hdD86IHN0cmluZyxcclxuXHRmaWx0ZXI/OiBzdHJpbmcsXHJcblx0ZHJhZ2FibGU/OiBib29sZWFuLFxyXG5cdHNvcnRhYmxlPzogYm9vbGVhbixcclxuXHRjbGFzcz86c3RyaW5nLFxyXG5cdGxvY2tlZD86Ym9vbGVhbixcclxuXHRhc2NlbmRpbmc/OiBib29sZWFuLFxyXG5cdGRlc2NlbmRpbmc/OiBib29sZWFuXHJcbn1cclxuXHJcbkBDb21wb25lbnQoe1xyXG5cdHNlbGVjdG9yOiAndGFibGUtdmlldycsXHJcblx0dGVtcGxhdGVVcmw6ICcuL3RhYmxlLmNvbXBvbmVudC5odG1sJyxcclxuXHRzdHlsZVVybHM6IFsnLi90YWJsZS5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUYWJsZVZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XHJcblx0ZHJhZ2dpbmcgPSBmYWxzZTtcclxuXHRwcmludE1vZGUgPSBmYWxzZTtcclxuXHRmaWx0ZXJlZEl0ZW1zID0gW107XHJcblx0ZmlsdGVyaW5nVGltZXJJZDogYW55O1xyXG5cclxuICAgIEBJbnB1dChcInZvY2FidWxhcnlcIilcclxuICAgIHB1YmxpYyB2b2NhYnVsYXJ5ID0ge1xyXG5cdFx0Y29uZmlndXJlVGFibGU6IFwiQ29uZmlndXJlIFRhYmxlXCIsXHJcblx0XHRjb25maWd1cmVDb2x1bW5zOiBcIkNvbmZpZ3VyZSBDb2x1bW5zXCIsXHJcblx0XHRjbGlja1NvcnQ6IFwiQ2xpY2sgdG8gU29ydFwiLFxyXG5cdFx0c2V0U2l6ZTogXCJTZXQgU2l6ZVwiLFxyXG5cdFx0Zmlyc3RQYWdlOiBcIkZpcnN0XCIsXHJcblx0XHRsYXN0UGFnZTogXCJMYXN0XCIsXHJcblx0XHRwcmV2aW91c1BhZ2U6IFwiUHJldmlvdXNcIlxyXG5cdH07XHJcblxyXG5cdEBJbnB1dChcImxvY2thYmxlXCIpXHJcblx0bG9ja2FibGU6Ym9vbGVhbjtcclxuXHJcblx0QElucHV0KFwiY2FwdGlvblwiKVxyXG4gICAgcHVibGljIGNhcHRpb246IHN0cmluZztcclxuXHJcbiAgICBASW5wdXQoXCJhY3Rpb25cIilcclxuICAgIHB1YmxpYyBhY3Rpb246IHN0cmluZztcclxuXHJcbiAgICBASW5wdXQoXCJwYWdlSW5mb1wiKVxyXG4gICAgcHVibGljIHBhZ2VJbmZvO1xyXG5cclxuICAgIEBJbnB1dChcImFjdGlvbktleXNcIilcclxuICAgIHB1YmxpYyBhY3Rpb25LZXlzO1xyXG5cclxuICAgIEBJbnB1dChcInRhYmxlQ2xhc3NcIilcclxuICAgIHB1YmxpYyB0YWJsZUNsYXNzID0gJ2RlZmF1bHQtZmxleGlibGUtdGFibGUnO1xyXG5cclxuXHRASW5wdXQoXCJoZWFkZXJzXCIpXHJcblx0cHVibGljIGhlYWRlcnM6IGFueVtdO1xyXG5cclxuXHRASW5wdXQoXCJpdGVtc1wiKVxyXG5cdHB1YmxpYyBpdGVtczogYW55W107XHJcblxyXG5cdEBJbnB1dChcInRhYmxlSW5mb1wiKVxyXG5cdHB1YmxpYyB0YWJsZUluZm86IGFueTtcclxuXHJcbiAgICBASW5wdXQoXCJlbmFibGVJbmRleGluZ1wiKVxyXG4gICAgcHVibGljIGVuYWJsZUluZGV4aW5nOiBib29sZWFuO1xyXG5cclxuICAgIEBJbnB1dChcImVuYWJsZUZpbHRlcmluZ1wiKVxyXG4gICAgcHVibGljIGVuYWJsZUZpbHRlcmluZzogYm9vbGVhbjtcclxuXHJcbiAgICBASW5wdXQoXCJyb3dEZXRhaWxlclwiKVxyXG4gICAgcHVibGljIHJvd0RldGFpbGVyOiBhbnk7XHJcblxyXG4gICAgQElucHV0KFwiZXhwYW5kYWJsZVwiKVxyXG4gICAgcHVibGljIGV4cGFuZGFibGU6IGFueTtcclxuXHJcbiAgICBASW5wdXQoXCJleHBhbmRJZlwiKVxyXG4gICAgcHVibGljIGV4cGFuZElmOiBib29sZWFuO1xyXG5cclxuICAgIEBJbnB1dChcImZpbHRlcndoaWxldHlwaW5nXCIpXHJcbiAgICBwdWJsaWMgZmlsdGVyd2hpbGV0eXBpbmc6IGJvb2xlYW47XHJcblxyXG4gICAgQElucHV0KFwicm93RGV0YWlsZXJIZWFkZXJzXCIpXHJcbiAgICBwdWJsaWMgcm93RGV0YWlsZXJIZWFkZXJzOiBhbnk7XHJcblxyXG5cdEBPdXRwdXQoJ29uYWN0aW9uJylcclxuXHRwcml2YXRlIG9uYWN0aW9uID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHRAT3V0cHV0KCdvbmNoYW5nZScpXHJcblx0cHJpdmF0ZSBvbmNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0QE91dHB1dCgnb25maWx0ZXInKVxyXG5cdHByaXZhdGUgb25maWx0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBPdXRwdXQoJ29uQ2VsbENvbnRlbnRFZGl0JylcclxuXHRwcml2YXRlIG9uQ2VsbENvbnRlbnRFZGl0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHRAVmlld0NoaWxkKCdmbGV4aWJsZScsIHtyZWFkOiBWaWV3Q29udGFpbmVyUmVmfSkgcHJpdmF0ZSB0YWJsZTogVmlld0NvbnRhaW5lclJlZjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6RWxlbWVudFJlZikge31cclxuXHJcblxyXG5cdHByaXZhdGUgZmluZENvbHVtbldpdGhJRChpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IHRoaXMuaGVhZGVyQ29sdW1uRWxlbWVudHMoKTtcclxuXHRcdGxldCBjb2x1bW4gPSBudWxsO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmIChsaXN0W2ldLmdldEF0dHJpYnV0ZShcImlkXCIpID09PSBpZCkge1xyXG5cdFx0XHRcdGNvbHVtbiA9IGxpc3RbaV07XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBjb2x1bW47XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIHN3YXBDb2x1bW5zKHNvdXJjZTogYW55LCBkZXN0aW5hdGlvbjogYW55KSB7XHJcblxyXG5cdFx0aWYgKHNvdXJjZS5ub2RlLnBhcmVudE5vZGUgPT09IGRlc3RpbmF0aW9uLm5vZGUucGFyZW50Tm9kZSkge1xyXG5cdFx0XHRjb25zdCBzcmNJbmRleCA9IHRoaXMuZ2V0Q29sdW1uSW5kZXgoc291cmNlLm1lZGl1bS5rZXkpO1xyXG5cdFx0XHRjb25zdCBkZXNJbmRleCA9IHRoaXMuZ2V0Q29sdW1uSW5kZXgoZGVzdGluYXRpb24ubWVkaXVtLmtleSk7XHJcblx0XHRcdGlmIChzcmNJbmRleCA8IDAgfHwgZGVzSW5kZXggPCAwKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJpbnZhbGlkIGRyb3AgaWRcIiwgc291cmNlLm1lZGl1bS5rZXksIGRlc3RpbmF0aW9uLm1lZGl1bS5rZXkpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjb25zdCB4ID0gdGhpcy5maWx0ZXJlZEl0ZW1zO1xyXG5cdFx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSBbXTtcclxuXHJcblx0XHRcdHNldFRpbWVvdXQoKCk9PntcclxuXHRcdFx0XHRjb25zdCBzb2JqID0gdGhpcy5oZWFkZXJzW3NyY0luZGV4XTtcclxuXHRcdFx0XHR0aGlzLmhlYWRlcnNbc3JjSW5kZXhdID0gdGhpcy5oZWFkZXJzW2Rlc0luZGV4XTtcclxuXHRcdFx0XHR0aGlzLmhlYWRlcnNbZGVzSW5kZXhdID0gc29iajtcclxuXHRcdFx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSB4O1xyXG5cclxuXHRcdFx0XHR0aGlzLm9uZmlsdGVyLmVtaXQodGhpcy5maWx0ZXJlZEl0ZW1zKTtcclxuXHRcdFx0XHR0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5oZWFkZXJzKTtcclxuXHRcdFx0fSwgMzMpO1xyXG5cdFxyXG5cdFx0fSBlbHNlIGlmIChzb3VyY2UubWVkaXVtLmxvY2tlZCB8fCBkZXN0aW5hdGlvbi5tZWRpdW0ubG9ja2VkKSB7XHJcblx0XHRcdGNvbnN0IHggPSB0aGlzLmZpbHRlcmVkSXRlbXM7XHJcblx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IFtdO1xyXG5cdFx0XHR0aGlzLm9uZmlsdGVyLmVtaXQodGhpcy5maWx0ZXJlZEl0ZW1zKTtcclxuXHRcdFx0c2V0VGltZW91dCgoKT0+e1xyXG5cdFx0XHRcdHNvdXJjZS5tZWRpdW0ubG9ja2VkID0gIXNvdXJjZS5tZWRpdW0ubG9ja2VkO1xyXG5cdFx0XHRcdGRlc3RpbmF0aW9uLm1lZGl1bS5sb2NrZWQgPSAhZGVzdGluYXRpb24ubWVkaXVtLmxvY2tlZDtcclxuXHRcdFx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSB4O1xyXG5cdFx0XHRcdHRoaXMub25maWx0ZXIuZW1pdCh0aGlzLmZpbHRlcmVkSXRlbXMpO1xyXG5cdFx0XHRcdHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzLmhlYWRlcnMpO1xyXG5cdFx0XHR9LDMzKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgZ2V0Q29sdW1uSW5kZXgoaWQ6IHN0cmluZykge1xyXG5cdFx0bGV0IGluZGV4ID0gLTE7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVhZGVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAodGhpcy5oZWFkZXJzW2ldLmtleSA9PT0gaWQpIHtcclxuXHRcdFx0XHRpbmRleCA9IGk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBpbmRleDtcclxuXHR9XHJcblx0cHJpdmF0ZSBpdGVtVmFsdWUoaXRlbSwgaHBhdGgpIHtcclxuXHRcdGxldCBzdWJpdGVtID0gaXRlbTtcclxuXHRcdGhwYXRoLm1hcCggKHN1YmtleSkgPT4ge1xyXG5cdFx0XHRpZiAoc3ViaXRlbSkge1xyXG5cdFx0XHRcdHN1Yml0ZW0gPSBzdWJpdGVtW3N1YmtleV07XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0XHRyZXR1cm4gc3ViaXRlbSA9PT0gdW5kZWZpbmVkIHx8IHN1Yml0ZW0gPT09IG51bGwgfHwgc3ViaXRlbSA9PT0gXCJudWxsXCIgPyBcIlwiIDogc3ViaXRlbTtcclxuXHR9XHJcblx0aW5pdFZpc2libGVSb3dzKCkge1xyXG5cdFx0Y29uc3QgcmVzdWx0ID0gW107XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZmlsdGVyZWRJdGVtcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAoaSA+PSB0aGlzLnBhZ2VJbmZvLmZyb20gJiYgaSA8PSB0aGlzLnBhZ2VJbmZvLnRvKSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2godGhpcy5maWx0ZXJlZEl0ZW1zW2ldKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dGhpcy5maWx0ZXJlZEl0ZW1zID0gcmVzdWx0O1xyXG5cdH1cclxuXHJcblx0bG9jayhoZWFkZXI6IEZsZXhpYmxlVGFibGVIZWFkZXIsIGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHRcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0aGVhZGVyLmxvY2tlZCA9ICFoZWFkZXIubG9ja2VkO1xyXG5cdFx0dGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaGVhZGVycyk7XHJcblx0fVxyXG5cdHNvcnQoaGVhZGVyOiBGbGV4aWJsZVRhYmxlSGVhZGVyLCBpY29uKSB7XHJcblx0XHRpZiAoaGVhZGVyLnNvcnRhYmxlICYmIHRoaXMuaXRlbXMgJiYgdGhpcy5pdGVtcy5sZW5ndGgpIHtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlYWRlcnMubGVuZ3RoIDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoID0gdGhpcy5oZWFkZXJzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChoLmtleSAhPT0gaGVhZGVyLmtleSkge1xyXG5cdFx0XHRcdFx0Y29uc3QgaXRlbSA9IHRoaXMuZmluZENvbHVtbldpdGhJRChoLmtleSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKGl0ZW0pIHtcclxuXHRcdFx0XHRcdFx0aXRlbS5jbGFzc0xpc3QucmVtb3ZlKFwiYXNjZW5kaW5nXCIpO1xyXG5cdFx0XHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJkZXNjZW5kaW5nXCIpO1xyXG5cdFx0XHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5hZGQoXCJzb3J0YWJsZVwiKTtcclxuXHRcdFx0XHRcdH1cclxuICAgICAgICAgICAgICAgICAgICBoLmRlc2NlbmRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBoLmFzY2VuZGluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG4gICAgICAgICAgICBpY29uLmNsYXNzTGlzdC5yZW1vdmUoXCJmYS1zb3J0XCIpO1xyXG5cdFx0XHRpZiAoaGVhZGVyLmFzY2VuZGluZyB8fCAoIWhlYWRlci5hc2NlbmRpbmcgJiYgIWhlYWRlci5kZXNjZW5kaW5nKSkge1xyXG5cdFx0XHRcdGhlYWRlci5kZXNjZW5kaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHRoZWFkZXIuYXNjZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0aWNvbi5jbGFzc0xpc3QucmVtb3ZlKFwiZmEtc29ydC1hc2NcIik7XHJcblx0XHRcdFx0aWNvbi5jbGFzc0xpc3QuYWRkKFwiZmEtc29ydC1kZXNjXCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGhlYWRlci5kZXNjZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0aGVhZGVyLmFzY2VuZGluZyA9IHRydWU7XHJcblx0XHRcdFx0aWNvbi5jbGFzc0xpc3QucmVtb3ZlKFwiZmEtc29ydC1kZXNjXCIpO1xyXG5cdFx0XHRcdGljb24uY2xhc3NMaXN0LmFkZChcImZhLXNvcnQtYXNjXCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNvbnN0IGhwYXRoID0gaGVhZGVyLmtleS5zcGxpdChcIi5cIik7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5lbmFibGVGaWx0ZXJpbmcpIHtcclxuXHRcdFx0XHR0aGlzLmZpbHRlckl0ZW1zKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5maWx0ZXJlZEl0ZW1zID0gdGhpcy5pdGVtcyA/IHRoaXMuaXRlbXMgOiBbXTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmZpbHRlcmVkSXRlbXMuc29ydCgoYSwgYikgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IHYxID0gdGhpcy5pdGVtVmFsdWUoYSwgaHBhdGgpO1xyXG5cdFx0XHRcdGNvbnN0IHYyID0gdGhpcy5pdGVtVmFsdWUoYiwgaHBhdGgpO1xyXG5cclxuXHRcdFx0XHRpZiAoaGVhZGVyLmFzY2VuZGluZykge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHYxID4gdjIgPyAxIDogLTE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiB2MSA8IHYyID8gMSA6IC0xO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0dGhpcy5pbml0VmlzaWJsZVJvd3MoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG9mZnNldFdpZHRoKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMudGFibGUuZWxlbWVudC5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoO1xyXG5cdH1cclxuXHJcblx0bmdPbkNoYW5nZXMoY2hhbmdlczphbnkpIHtcclxuXHRcdC8vIGlmIChjaGFuZ2VzLml0ZW1zKSB7XHJcblx0XHQvLyBcdHRoaXMuZXZhbHVhdGVSb3dzKCk7XHJcblx0XHQvLyB9XHJcblx0fVxyXG5cclxuXHRuZ09uSW5pdCgpIHtcclxuXHRcdGlmICh0aGlzLnBhZ2VJbmZvKSB7XHJcblx0XHRcdGlmICghdGhpcy5wYWdlSW5mby50bykge1xyXG5cdFx0XHRcdHRoaXMucGFnZUluZm8udG8gPSB0aGlzLnBhZ2VJbmZvLnBhZ2VTaXplO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnBhZ2VJbmZvID0geyBcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRTaXplOiAxMDAwMDAsIFxyXG4gICAgICAgICAgICAgICAgcGFnZVNpemU6IDEwMDAwMCwgXHJcbiAgICAgICAgICAgICAgICBwYWdlczogMSwgXHJcbiAgICAgICAgICAgICAgICBmcm9tOiAwLCBcclxuICAgICAgICAgICAgICAgIHRvOiAxMDAwMDAsIFxyXG4gICAgICAgICAgICAgICAgY3VycmVudFBhZ2U6IDEsIFxyXG4gICAgICAgICAgICAgICAgbWF4V2lkdGg6IFwiMFwiIFxyXG4gICAgICAgICAgICB9O1xyXG5cdFx0fVxyXG5cdFx0aWYgKCF0aGlzLmhlYWRlcnMpIHtcclxuXHRcdFx0dGhpcy5oZWFkZXJzID0gW107XHJcblx0XHR9XHJcblx0XHR0aGlzLmV2YWx1YXRlUm93cygpO1xyXG4gICAgICAgIGlmICh0aGlzLmFjdGlvbktleXMpIHtcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb25LZXlzID0gdGhpcy5hY3Rpb25LZXlzLnNwbGl0KFwiLFwiKTtcclxuXHRcdH1cclxuXHRcdGlmICghdGhpcy5yb3dEZXRhaWxlciAmJiB0aGlzLmV4cGFuZGFibGUpIHtcclxuXHRcdFx0dGhpcy5yb3dEZXRhaWxlciA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0XHRyZXR1cm4ge2RhdGE6IGl0ZW0sIGhlYWRlcnM6IFtdfTtcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHRcdGlmICghdGhpcy5leHBhbmRhYmxlKSB7XHJcblx0XHRcdHRoaXMuZXhwYW5kYWJsZSA9IGZ1bmN0aW9uKGl0ZW0sIHNob3dJY29uKSB7cmV0dXJuIHNob3dJY29ufTtcclxuXHRcdH1cclxuXHRcdGlmICghdGhpcy5yb3dEZXRhaWxlckhlYWRlcnMpIHtcclxuXHRcdFx0dGhpcy5yb3dEZXRhaWxlckhlYWRlcnMgPSAoaXRlbSkgPT4gW107XHJcblx0XHR9XHJcblx0fVxyXG5cdGV2YWx1YXRlUm93cygpIHtcclxuXHRcdGlmICh0aGlzLmVuYWJsZUZpbHRlcmluZykge1xyXG5cdFx0XHR0aGlzLmZpbHRlckl0ZW1zKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSB0aGlzLml0ZW1zID8gdGhpcy5pdGVtcyA6IFtdO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5pbml0VmlzaWJsZVJvd3MoKTtcclxuXHR9XHJcblxyXG4gICAgaGVhZGVyQ29sdW1uRWxlbWVudHMoKSB7XHJcblx0XHRsZXQgcmVzdWx0ID0gW107XHJcblxyXG5cdFx0aWYgKHRoaXMudGFibGUuZWxlbWVudC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuKSB7XHJcblx0XHRcdGNvbnN0IGxpc3QgPSB0aGlzLnRhYmxlLmVsZW1lbnQubmF0aXZlRWxlbWVudC5jaGlsZHJlbjtcclxuXHRcdFx0cmVzdWx0ID0gdGhpcy5jYXB0aW9uID8gbGlzdFsxXS5jaGlsZHJlblswXS5jaGlsZHJlbiA6IGxpc3RbMF0uY2hpbGRyZW5bMF0uY2hpbGRyZW47XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuXHRoZWFkZXJCeUlkKGlkKSB7XHJcblx0XHRsZXQgaDtcclxuXHRcdGZvciAoY29uc3QgaSBpbiB0aGlzLmhlYWRlcnMpIHtcclxuXHRcdFx0aWYgKHRoaXMuaGVhZGVyc1tpXS5rZXkgPT09IGlkKSB7XHJcblx0XHRcdFx0aCA9IHRoaXMuaGVhZGVyc1tpXTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGg7XHJcblx0fVxyXG5cclxuICAgIGNvbHVtbnNDb3VudCgpIHtcclxuXHRcdGxldCBjb3VudCA9IDA7XHJcblx0XHR0aGlzLmhlYWRlcnMubWFwKCAoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5wcmVzZW50KSB7XHJcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICB9XHJcblx0XHR9KTtcclxuICAgICAgICBpZiAodGhpcy5hY3Rpb24pIHtcclxuICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvdW50O1xyXG5cdH1cclxuXHRob3ZlcihpdGVtLCBmbGFnKSB7XHJcblx0XHRpZiAoZmxhZykge1xyXG5cdFx0XHRpdGVtLmhvdmVyID0gdHJ1ZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRlbGV0ZSBpdGVtLmhvdmVyO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dG9Dc3NDbGFzcyhoZWFkZXIpIHtcclxuXHRcdHJldHVybiBoZWFkZXIua2V5LnJlcGxhY2UoL1xcLi9nLCctJyk7XHJcblx0fVxyXG4gICAga2V5ZG93bihldmVudCwgaXRlbSkge1xyXG4gICAgICAgIGNvbnN0IGNvZGUgPSBldmVudC53aGljaDtcclxuICAgICAgICBpZiAoKGNvZGUgPT09IDEzKSB8fCAoY29kZSA9PT0gMzIpKSB7XHJcblx0XHRcdGl0ZW0uY2xpY2soKTtcclxuXHRcdH1cclxuICAgIH1cclxuICAgIG9mZlNjcmVlbk1lc3NhZ2UoaXRlbSkge1xyXG5cdFx0bGV0IG1lc3NhZ2U6IHN0cmluZyA9IHRoaXMuYWN0aW9uO1xyXG5cdFx0aWYgKHRoaXMuYWN0aW9uS2V5cykge1xyXG5cdFx0XHR0aGlzLmFjdGlvbktleXMubWFwKChrZXkpID0+IHsgbWVzc2FnZSA9IG1lc3NhZ2UucmVwbGFjZShrZXksIGl0ZW1ba2V5LnN1YnN0cmluZygxLCBrZXkubGVuZ3RoIC0gMSldKTsgfSlcclxuXHRcdH1cclxuICAgICAgICByZXR1cm4gbWVzc2FnZTtcclxuICAgIH1cclxuXHJcbiAgICBjZWxsQ29udGVudChpdGVtLCBoZWFkZXIpIHtcclxuXHRcdGxldCBjb250ZW50ID0gdGhpcy5pdGVtVmFsdWUoaXRlbSwgaGVhZGVyLmtleS5zcGxpdChcIi5cIikpO1xyXG4gICAgICAgIHJldHVybiAoY29udGVudCAhPT0gdW5kZWZpbmVkICYmIGNvbnRlbnQgIT0gbnVsbCAmJiBTdHJpbmcoY29udGVudCkubGVuZ3RoKSA/IGNvbnRlbnQgOiAnJm5ic3A7JztcclxuXHR9XHJcblxyXG5cdHJvd0RldGFpbGVyQ29udGV4dChpdGVtKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRkYXRhOiBpdGVtLFxyXG5cdFx0XHR0YWJsZUluZm86IHRoaXMudGFibGVJbmZvLFxyXG5cdFx0XHRoZWFkZXJzOiB0aGlzLnJvd0RldGFpbGVySGVhZGVycyhpdGVtKVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdGNoYW5nZUZpbHRlcihldmVudCwgaGVhZGVyKSB7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG5cclxuXHRcdGhlYWRlci5maWx0ZXIgPSBldmVudC50YXJnZXQudmFsdWU7XHJcblxyXG5cdFx0aWYgKHRoaXMuZmlsdGVyd2hpbGV0eXBpbmcgfHwgY29kZSA9PT0gMTMpIHtcclxuXHRcdFx0aWYodGhpcy5maWx0ZXJpbmdUaW1lcklkKSB7XHJcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRoaXMuZmlsdGVyaW5nVGltZXJJZCk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5maWx0ZXJpbmdUaW1lcklkID0gc2V0VGltZW91dCgoKT0+e1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVySXRlbXMoKTtcclxuXHRcdFx0XHR0aGlzLmluaXRWaXNpYmxlUm93cygpO1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVyaW5nVGltZXJJZCAgPSB1bmRlZmluZWQ7XHJcblx0XHRcdH0sIDEyMyk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGFjdGlvbkNsaWNrKGV2ZW50LCBpdGVtOiBhbnkpIHtcclxuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIGlmICh0aGlzLnJvd0RldGFpbGVyICYmICh0aGlzLmV4cGFuZElmIHx8IHRoaXMuZXhwYW5kYWJsZShpdGVtLCBmYWxzZSkpICkge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5leHBhbmRlZCkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIGl0ZW0uZXhwYW5kZWQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmV4cGFuZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMub25hY3Rpb24uZW1pdChpdGVtKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHByaW50KCkge1xyXG5cdFx0dGhpcy5wcmludE1vZGUgPSB0cnVlO1xyXG5cdFx0c2V0VGltZW91dCgoKT0+e1xyXG5cdFx0XHRjb25zdCBjb250ZW50ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmlubmVySFRNTDtcclxuXHRcdFx0dGhpcy5wcmludE1vZGUgPSBmYWxzZTtcclxuXHRcdFx0Y29uc3QgcG9wdXBXaW4gPSB3aW5kb3cub3BlbignJywgJ19ibGFuaycsICd3aWR0aD0zMDAsaGVpZ2h0PTMwMCcpO1xyXG5cdFx0XHJcblx0XHRcdHBvcHVwV2luLmRvY3VtZW50Lm9wZW4oKTtcclxuICAgICAgICBcdHBvcHVwV2luLmRvY3VtZW50LndyaXRlKCc8aHRtbD48Ym9keSBvbmxvYWQ9XCJ3aW5kb3cucHJpbnQoKVwiPicgKyBjb250ZW50ICsgJzwvaHRtbD4nKTtcclxuICAgICAgICBcdHBvcHVwV2luLmRvY3VtZW50LmNsb3NlKCk7XHJcblx0XHR9LDMpO1xyXG5cdH1cclxuXHJcblx0Ly8gPDUsICE1LCA+NSwgKkUsIEUqLCAqRSpcclxuXHRwcml2YXRlIHNob3VsZFNraXBJdGVtKHZhbHVlLCBmaWx0ZXJCeSkge1xyXG5cdFx0bGV0IHJlc3VsdCA9IGZhbHNlO1xyXG5cclxuXHRcdGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsICYmIFN0cmluZyh2YWx1ZSkubGVuZ3RoKSB7XHJcblx0XHRcdGNvbnN0IHYgPSBTdHJpbmcodmFsdWUpO1xyXG5cdFx0XHRpZiAoZmlsdGVyQnlbMF0gPT09ICc8Jykge1xyXG5cdFx0XHRcdHJlc3VsdCA9IGZpbHRlckJ5Lmxlbmd0aCA+IDEgJiYgcGFyc2VGbG9hdCh2KSA+PSBwYXJzZUZsb2F0KGZpbHRlckJ5LnN1YnN0cmluZygxKSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoZmlsdGVyQnlbMF0gPT09ICc+Jykge1xyXG5cdFx0XHRcdHJlc3VsdCA9IGZpbHRlckJ5Lmxlbmd0aCA+IDEgJiYgcGFyc2VGbG9hdCh2KSA8PSBwYXJzZUZsb2F0KGZpbHRlckJ5LnN1YnN0cmluZygxKSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoZmlsdGVyQnlbMF0gPT09ICchJykge1xyXG5cdFx0XHRcdHJlc3VsdCA9IGZpbHRlckJ5Lmxlbmd0aCA+IDEgJiYgcGFyc2VGbG9hdCh2KSA9PSBwYXJzZUZsb2F0KGZpbHRlckJ5LnN1YnN0cmluZygxKSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoZmlsdGVyQnlbMF0gPT09ICc9Jykge1xyXG5cdFx0XHRcdHJlc3VsdCA9IGZpbHRlckJ5Lmxlbmd0aCA9PSAxIHx8IHBhcnNlRmxvYXQodikgIT09IHBhcnNlRmxvYXQoZmlsdGVyQnkuc3Vic3RyaW5nKDEpKTtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWx0ZXJCeVswXSA9PT0gJyonICYmIGZpbHRlckJ5W2ZpbHRlckJ5Lmxlbmd0aC0xXSAhPT0gJyonKSB7XHJcblx0XHRcdFx0Y29uc3QgZiA9IGZpbHRlckJ5LnN1YnN0cmluZygxKTtcclxuXHRcdFx0XHRyZXN1bHQgPSB2LmluZGV4T2YoZikgIT09IHYubGVuZ3RoIC0gZi5sZW5ndGhcclxuXHRcdFx0fSBlbHNlIGlmIChmaWx0ZXJCeVswXSAhPT0gJyonICYmIGZpbHRlckJ5W2ZpbHRlckJ5Lmxlbmd0aC0xXSA9PT0gJyonKSB7XHJcblx0XHRcdFx0Y29uc3QgZiA9IGZpbHRlckJ5LnN1YnN0cmluZygwLCBmaWx0ZXJCeS5sZW5ndGgtMSk7XHJcblx0XHRcdFx0cmVzdWx0ID0gdi5pbmRleE9mKGYpICE9PSAwO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGZpbHRlckJ5WzBdID09PSAnKicgJiYgZmlsdGVyQnlbZmlsdGVyQnkubGVuZ3RoLTFdID09PSAnKicpIHtcclxuXHRcdFx0XHRyZXN1bHQgPSBmaWx0ZXJCeS5sZW5ndGggPiAxICYmIHYuaW5kZXhPZiggZmlsdGVyQnkuc3Vic3RyaW5nKDEsIGZpbHRlckJ5Lmxlbmd0aC0xKSApIDwgMDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXN1bHQgPSB2LmluZGV4T2YoZmlsdGVyQnkpIDwgMDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9XHJcblx0ZmlsdGVySXRlbXMoKSB7XHJcblx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSB0aGlzLml0ZW1zID8gdGhpcy5pdGVtcy5maWx0ZXIoKGl0ZW0pID0+IHtcclxuXHRcdFx0bGV0IGtlZXBJdGVtID0gdHJ1ZTtcclxuXHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWFkZXJzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0Y29uc3QgaGVhZGVyID0gdGhpcy5oZWFkZXJzW2ldO1xyXG5cdFx0XHRcdGlmIChoZWFkZXIuZmlsdGVyICYmIGhlYWRlci5maWx0ZXIubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRjb25zdCB2ID0gdGhpcy5pdGVtVmFsdWUoaXRlbSwgaGVhZGVyLmtleS5zcGxpdChcIi5cIikpO1xyXG5cclxuXHRcdFx0XHRcdGlmICh0aGlzLnNob3VsZFNraXBJdGVtKHYsaGVhZGVyLmZpbHRlcikpIHtcclxuXHRcdFx0XHRcdFx0a2VlcEl0ZW0gPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBrZWVwSXRlbTtcclxuXHRcdH0pIDogW107XHJcblx0XHR0aGlzLm9uZmlsdGVyLmVtaXQodGhpcy5maWx0ZXJlZEl0ZW1zKTtcclxuXHR9XHJcblxyXG5cdG9uVGFibGVDZWxsRWRpdChldmVudCkge1xyXG5cdFx0Y29uc3QgaWQgPSBldmVudC5pZC5zcGxpdChcIi1cIik7XHJcblx0XHRjb25zdCBuID0gZXZlbnQubmFtZTtcclxuXHRcdGNvbnN0IHY9IGV2ZW50LnZhbHVlO1xyXG5cdFx0Y29uc3QgdCA9IHRoaXMuaXRlbXNbcGFyc2VJbnQoaWRbMV0pXTtcclxuXHJcblx0XHRpZiAodCkge1xyXG5cdFx0XHRjb25zdCBsaXN0ID0gaWRbMF0uc3BsaXQoXCIuXCIpO1xyXG5cdFx0XHRsZXQgc3ViaXRlbSA9IHRbbGlzdFswXV07XHJcblx0XHRcdGZvcihsZXQgaSA9IDE7IGkgPCAobGlzdC5sZW5ndGggLSAxKTsgaSsrKSB7XHJcblx0XHRcdFx0c3ViaXRlbSA9IHN1Yml0ZW1bbGlzdFtpXV1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoc3ViaXRlbSAmJiBsaXN0Lmxlbmd0aCA+IDEpe1xyXG5cdFx0XHRcdHN1Yml0ZW1bbGlzdFtsaXN0Lmxlbmd0aCAtIDFdXSA9IHY7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5vbkNlbGxDb250ZW50RWRpdC5lbWl0KHtuYW1lOiBuLCB2YWx1ZTogdiwgaXRlbTogdH0pO1xyXG5cdFx0fVxyXG4gICAgfVxyXG5cclxuXHRkcmFnRW5hYmxlZChldmVudDogRHJhZ0V2ZW50KSB7XHJcblx0XHRyZXR1cm4gZXZlbnQubWVkaXVtLmRyYWdhYmxlO1xyXG5cdH1cclxuXHRkcm9wRW5hYmxlZChldmVudDogRHJvcEV2ZW50KSB7XHJcblx0XHRyZXR1cm4gZXZlbnQuZGVzdGluYXRpb24ubWVkaXVtLmRyYWdhYmxlO1xyXG5cdH1cclxuXHRvbkRyYWdTdGFydChldmVudDogRHJhZ0V2ZW50KXtcclxuLy8gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlO1xyXG5cdH1cclxuXHRvbkRyYWdFbmQoZXZlbnQ6IERyYWdFdmVudCl7XHJcbiAvLyAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XHJcblx0fVxyXG5cdG9uRHJvcChldmVudDpEcm9wRXZlbnQpe1xyXG5cdFx0dGhpcy5zd2FwQ29sdW1ucyhldmVudC5zb3VyY2UsIGV2ZW50LmRlc3RpbmF0aW9uKTtcclxuXHR9XHJcbn1cclxuIl19