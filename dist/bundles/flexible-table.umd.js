(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('into-pipes'), require('@angular/common'), require('drag-enabled')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'into-pipes', '@angular/common', 'drag-enabled'], factory) :
	(factory((global['flexible-table'] = {}),global.ng.core,global.intoPipes,global.ng.common,global.dragEnabled));
}(this, (function (exports,core,intoPipes,common,dragEnabled) { 'use strict';

var FlexibleTableComponent = /** @class */ (function () {
    function FlexibleTableComponent(intoPipe) {
        this.intoPipe = intoPipe;
        this.registeredHeaders = [];
        this.dragging = false;
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
        this.onaction = new core.EventEmitter();
        this.onconfigurationchange = new core.EventEmitter();
    }
    FlexibleTableComponent.prototype.findColumnWithID = function (id) {
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
    FlexibleTableComponent.prototype.swapColumns = function (sourceID, destinationID) {
        var srcIndex = this.getColumnIndex(sourceID);
        var desIndex = this.getColumnIndex(destinationID);
        if (srcIndex < 0 || desIndex < 0) {
            console.log("invalid drop id", sourceID, destinationID);
            return;
        }
        var sobj = this.headers[srcIndex];
        this.headers[srcIndex] = this.headers[desIndex];
        this.headers[desIndex] = sobj;
        for (var i = 0; i < this.items.length; i++) {
            var row = this.items[i];
            var sobji = row[srcIndex];
            row[srcIndex] = row[desIndex];
            row[desIndex] = sobji;
        }
        this.onconfigurationchange.emit(this.headers);
    };
    FlexibleTableComponent.prototype.getColumnIndex = function (id) {
        var index = -1;
        for (var i = 0; i < this.headers.length; i++) {
            if (this.headers[i].key === id) {
                index = i;
                break;
            }
        }
        return index;
    };
    FlexibleTableComponent.prototype.itemValue = function (item, hpath) {
        var subitem = item;
        hpath.map(function (subkey) {
            if (subitem) {
                subitem = subitem[subkey] ? subitem[subkey] : undefined;
            }
        });
        return subitem ? subitem : "";
    };
    FlexibleTableComponent.prototype.sort = function (header, icon) {
        var _this = this;
        if (header.sortable) {
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
            this.items.sort(function (a, b) {
                var v1 = _this.itemValue(a, hpath_1);
                var v2 = _this.itemValue(b, hpath_1);
                if (header.ascending) {
                    return v1 > v2 ? 1 : -1;
                }
                return v1 < v2 ? 1 : -1;
            });
            setTimeout(function () { return _this.onconfigurationchange.emit(_this.headers); }, 2);
        }
    };
    FlexibleTableComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.headers || this.headers.length === 0) {
            this.headers = [];
            this.items[0].map(function (item) {
                _this.headers.push({ key: item, value: item, sortable: true, present: true });
            });
        }
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
    FlexibleTableComponent.prototype.reconfigure = function (event) {
        this.onconfigurationchange.emit(event);
    };
    FlexibleTableComponent.prototype.headerColumnElements = function () {
        return this.table.element.nativeElement.children ?
            this.table.element.nativeElement.children[1].children[0].children : [];
    };
    FlexibleTableComponent.prototype.headerById = function (id) {
        var h;
        for (var i in this.headers) {
            if (this.headers[i].key === id) {
                h = this.headers[i];
                break;
            }
        }
        return h;
    };
    FlexibleTableComponent.prototype.columnsCount = function () {
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
    FlexibleTableComponent.prototype.keydown = function (event, item) {
        var code = event.which;
        if ((code === 13) || (code === 32)) {
            item.click();
        }
    };
    FlexibleTableComponent.prototype.offScreenMessage = function (item) {
        var message = this.action;
        this.actionKeys.map(function (key) { message = message.replace(key, item[key.substring(1, key.length - 1)]); });
        return message;
    };
    FlexibleTableComponent.prototype.cellContent = function (item, header) {
        var content = this.itemValue(item, header.key.split("."));
        if (header.format && content !== undefined && content != null) {
            content = this.intoPipe.transform(content, header.format);
        }
        return (content !== undefined && content != null) ? content : '&nbsp;';
    };
    FlexibleTableComponent.prototype.rowDetailerContext = function (item) {
        return {
            data: item,
            tableInfo: this.tableInfo,
            headers: this.rowDetailerHeaders(item)
        };
    };
    FlexibleTableComponent.prototype.actionClick = function (event, item) {
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
    FlexibleTableComponent.prototype.dragEnabled = function (event) {
        return event.medium.dragable;
    };
    FlexibleTableComponent.prototype.dropEnabled = function (event) {
        return event.destination.medium.dragable;
    };
    FlexibleTableComponent.prototype.onDragStart = function (event) {
    };
    FlexibleTableComponent.prototype.onDragEnd = function (event) {
    };
    FlexibleTableComponent.prototype.onDrop = function (event) {
        this.swapColumns(event.source.medium.key, event.destination.medium.key);
    };
    return FlexibleTableComponent;
}());
FlexibleTableComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'flexible-table',
                template: "\n<div class=\"flexible-table\">\n    <table-configuration\n        *ngIf=\"configurable\"\n        [headers]=\"headers\"\n        [title]=\"vocabulary.configureColumns\"\n        [action]=\"vocabulary.configureTable\"\n        (onchange)=\"reconfigure($event)\"></table-configuration>\n    <table [class]=\"tableClass\" #flexible>\n        <caption *ngIf=\"caption\" [textContent]=\"caption\"></caption>\n        <thead>\n            <tr>\n                <th scope=\"col\" *ngIf=\"enableIndexing\" id=\"indexable\" class=\"indexable\"></th>\n                <ng-template ngFor let-header [ngForOf]=\"headers\">\n                    <th scope=\"col\" *ngIf=\"header.present\"\n                        [dragEnabled]=\"dragEnabled.bind(this)\"\n                        [dropEnabled]=\"dropEnabled.bind(this)\"\n                        [medium]=\"header\"\n                        (onDragStart)=\"onDragStart($event)\"\n                        (onDragEnd)=\"onDragEnd($event)\"\n                        (onDrop)=\"onDrop($event)\"\n                        [id]=\"header.key\"\n                        [attr.width]=\"header.width ? header.width : null\"\n                        [attr.tabindex]=\"header.sortable ? 0 : -1\"\n\t\t\t\t\t\t(keydown)=\"keydown($event, th)\" (click)=\"sort(header, icon)\">\n                        <span *ngIf=\"header.sortable\" class=\"off-screen\"  [textContent]=\"vocabulary.clickSort\"></span>\n                        <span class=\"title\"\n                              [class.dragable]=\"header.dragable\"\n                              [textContent]=\"header.value\"></span>\n                        <span class=\"icon fa\" #icon\n                              [class.fa-sort]=\"header.sortable\"\n                              [class.fa-sort-asc]=\"header.assending\"\n                              [class.fa-sort-desc]=\"header.desending\"></span>\n                    </th>\n                </ng-template>\n                <th scope=\"col\" *ngIf=\"action\" id=\"actionable\" class=\"actionable\"></th>\n            </tr>\n        </thead>\n        <tbody>\n            <ng-template ngFor let-item [ngForOf]=\"items\" let-i=\"index\">\n                <tr *ngIf=\"(!pager || (pager && pager.info && i>=pager.info.from && i<=pager.info.to))\"\n                    (click)=\"actionClick($event, item)\"\n                    [class.pointer]=\"action\"\n                    [class.expanded]=\"item.expanded\"\n                    [class.odd]=\"i%2\">\n                    <td scope=\"row\" class=\"index\" *ngIf=\"enableIndexing\">{{i + 1}}</td>\n                    <ng-template ngFor let-header [ngForOf]=\"headers\">\n                        <td scope=\"row\"\n                            *ngIf=\"header.present\"\n                            [attr.data-label]=\"header.value\"\n                            [innerHTML]=\"cellContent(item, header)\"></td>\n                    </ng-template>\n                    <td scope=\"row\" *ngIf=\"action\">\n                        <a class=\"actionable\"\n                            *ngIf=\"expandable(item, true)\"\n                            tabindex=\"0\"\n                            role=\"button\"\n                            style=\"cursor:pointer\"\n                            [class.expanded]=\"item.expanded\" #clicker\n                            (keydown)=\"keydown($event, clicker)\" (click)=\"actionClick($event, item)\">\n                            <span\n                                class=\"icon fa\"\n                                [class.fa-angle-right]=\"!rowDetailer\"\n                                [class.fa-minus-square-o]=\"rowDetailer && item.expanded\"\n                                [class.fa-plus-square-o]=\"rowDetailer && !item.expanded\"\n                                aria-hidden=\"true\"></span>\n                            <span class=\"off-screen\" [textContent]=\"offScreenMessage(item)\"></span>\n                        </a>\n                    </td>\n                </tr>\n                <tr *ngIf=\"(!pager || (pager && pager.info && i>=pager.info.from && i<=pager.info.to)) && rowDetailer && item.expanded\" class=\"detail\" [class.odd]=\"i%2\">\n                    <td scope=\"row\" class=\"index\" *ngIf=\"enableIndexing\"></td>\n                    <td [attr.colspan]=\"columnsCount()\">\n                        <ng-container [ngTemplateOutlet]=\"rowDetailer\" [ngTemplateOutletContext]=\"rowDetailerContext(item)\"></ng-container>\n                    </td>\n                </tr>\n            </ng-template>\n        </tbody>\n    </table>\n</div>\n<table-pagination [info]=\"pageInfo\" [vocabulary]=\"vocabulary\" #pager></table-pagination>\n",
                styles: [":host{display:inline-block!important;width:100%}.flexible-table{position:relative;margin:0 auto;display:table;border-spacing:0;border-collapse:collapse}.flexible-table .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table{margin:1rem auto;padding:0;width:100%;table-layout:fixed;max-width:99%;background-color:transparent;border-collapse:collapse}.flexible-table table caption{background-color:#c3e5e2;border-radius:2px;color:#1b1b1b;caption-side:top;font-size:14px;padding:5px 6px;margin-bottom:15px;text-align:left}.flexible-table table thead{border-top:1px solid #bbb;border-bottom:1px solid #bbb;background-color:#eee}.flexible-table table tr{border:0}.flexible-table table tr.expanded td{font-weight:700;border-bottom:0}.flexible-table table td{padding-left:3px}.flexible-table table td:first-child{padding-left:5px}.flexible-table table td .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table td.index{background-color:#eee;border-right:1px solid #bbb}.flexible-table table th{cursor:default;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none;height:24px;position:relative;white-space:nowrap;font-weight:400;text-transform:uppercase;font-size:14px;padding-top:6px;padding-bottom:6px;text-align:left}.flexible-table table th.drag-over{background-color:#9b9b9b}.flexible-table table th.drag-over .icon,.flexible-table table th.drag-over .title{color:#eee}.flexible-table table th:first-child{padding-left:5px}.flexible-table table th.ascending,.flexible-table table th.descending,.flexible-table table th.sortable{cursor:pointer;height:12px}.flexible-table table th.indexable{width:33px}.flexible-table table th.actionable{width:24px}.flexible-table table th .title{color:#254a4d;display:inline-block;height:20px;white-space:nowrap}.flexible-table table th .dragable{cursor:move}.flexible-table table th .icon{width:22px;display:inline-block;height:20px;color:#254a4d}.flexible-table .fa.fa-angle-right{font-size:18px}.flexible-table table tr.detail td{border-top:0;cursor:default}.flexible-table table tr.expanded td a.expanded{background-position:right 2px}.flexible-table table tbody tr:hover{background-color:#ffeed2}.flexible-table table tbody tr.detail:hover,.flexible-table table tbody tr.detail:hover td table thead tr{background-color:inherit}.flexible-table table tr td a.actionable{display:inline-table;height:32px;vertical-align:middle;width:25px;line-height:30px;color:#254a4d}.flexible-table table tbody tr.detail:hover td:last-child{border-right:0}.flexible-table table tbody tr.detail:hover td:first-child{border-left:0}.flexible-table table tr td{border-bottom:1px solid #b1b3b3;color:#254a5d;font-size:15px;text-transform:capitalize}.flexible-table table tbody tr.pointer{cursor:pointer}.flexible-table table.alert-danger{border:0}.flexible-table table.alert-danger caption{background-color:transparent;font-weight:700;margin-bottom:0}.flexible-table table.alert-danger td{border-bottom:0;display:block}.flexible-table table.alert-danger td:first-child{padding-left:0}.flexible-table table.alert-danger td:last-child{border-bottom:0}.flexible-table table.alert-danger td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase;width:20%}.flexible-table table.alert-danger td a span.icon{width:100%}.flexible-table table.alert-danger thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table.alert-danger tr{border:2px solid #fff;display:block;margin-bottom:.625em;padding:5px;border-radius:5px}.flexible-table table.alert-danger tr th.actionable{width:inherit}.flexible-table table.alert-danger tr td{border-bottom:0}@media screen and (max-width:600px){.flexible-table table{border:0}.flexible-table table td{border-bottom:0;display:block;text-align:right}.flexible-table table td:first-child{padding-left:0}.flexible-table table td:last-child{border-bottom:0}.flexible-table table td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase}.flexible-table table td a span.icon{width:100%}.flexible-table table thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table tr{border-bottom:3px solid #ddd;display:block;margin-bottom:.625em}.flexible-table table tr th.actionable{width:inherit}.flexible-table table tr td{border-bottom:0}.flexible-table table.alert-danger td:before{width:inherit}}"]
            },] },
];
FlexibleTableComponent.ctorParameters = function () { return [
    { type: intoPipes.InToPipe, },
]; };
FlexibleTableComponent.propDecorators = {
    "vocabulary": [{ type: core.Input, args: ["vocabulary",] },],
    "caption": [{ type: core.Input, args: ["caption",] },],
    "action": [{ type: core.Input, args: ["action",] },],
    "actionKeys": [{ type: core.Input, args: ["actionKeys",] },],
    "tableClass": [{ type: core.Input, args: ["tableClass",] },],
    "headers": [{ type: core.Input, args: ["headers",] },],
    "items": [{ type: core.Input, args: ["items",] },],
    "pageInfo": [{ type: core.Input, args: ["pageInfo",] },],
    "tableInfo": [{ type: core.Input, args: ["tableInfo",] },],
    "configurable": [{ type: core.Input, args: ["configurable",] },],
    "enableIndexing": [{ type: core.Input, args: ["enableIndexing",] },],
    "rowDetailer": [{ type: core.Input, args: ["rowDetailer",] },],
    "expandable": [{ type: core.Input, args: ["expandable",] },],
    "expandIf": [{ type: core.Input, args: ["expandIf",] },],
    "rowDetailerHeaders": [{ type: core.Input, args: ["rowDetailerHeaders",] },],
    "onaction": [{ type: core.Output, args: ['onaction',] },],
    "onconfigurationchange": [{ type: core.Output, args: ['onconfigurationchange',] },],
    "table": [{ type: core.ViewChild, args: ['flexible', { read: core.ViewContainerRef },] },],
};
var PaginationComponent = /** @class */ (function () {
    function PaginationComponent() {
        this.vocabulary = { setSize: "", firstPage: "", lastPage: "", previousPage: "" };
        this.info = { contentSize: 0, pageSize: 0, maxWidth: "0" };
        this.onchange = new core.EventEmitter();
        this.onready = new core.EventEmitter();
    }
    PaginationComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.info) {
            this.info = { contentSize: 1000, pageSize: 1000, maxWidth: "0" };
        }
        if (this.info.contentSize && this.info.pageSize) {
            this.info.pages = Math.ceil(this.info.contentSize / this.info.pageSize);
            this.info.from = 0;
            this.info.to = this.info.pageSize - 1;
            this.info.currentPage = 1;
            setTimeout(function () { return _this.ready(); }, 66);
        }
    };
    PaginationComponent.prototype.setWidth = function (width) {
        this.info.maxWidth = width + "px";
    };
    PaginationComponent.prototype.ready = function () {
        this.onready.emit(this);
        this.onchange.emit(this.info);
    };
    PaginationComponent.prototype.selectFirst = function () {
        if (this.info.currentPage > 1) {
            this.info.from = 0;
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage = 1;
            this.onchange.emit(this.info);
        }
    };
    PaginationComponent.prototype.selectNext = function () {
        if (this.info.currentPage < this.info.pages) {
            this.info.from = this.info.to + 1;
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage++;
            this.onchange.emit(this.info);
        }
    };
    PaginationComponent.prototype.selectPrev = function () {
        if (this.info.currentPage > 1) {
            this.info.from -= this.info.pageSize;
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage--;
            this.onchange.emit(this.info);
        }
    };
    PaginationComponent.prototype.selectLast = function () {
        if (this.info.currentPage < this.info.pages) {
            this.info.from = this.info.pageSize * (this.info.pages - 1);
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage = this.info.pages;
            this.onchange.emit(this.info);
        }
    };
    PaginationComponent.prototype.changeCurrent = function (ranger) {
        var v = parseInt(ranger.value, 10);
        if (this.info.currentPage < v && v > 0 && v < this.info.pages) {
            this.info.from = v * (this.info.pageSize - 1);
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage = v;
            this.onchange.emit(this.info);
        }
        else {
            ranger.value = this.info.currentPage;
        }
    };
    PaginationComponent.prototype.changeSize = function (sizer) {
        var v = parseInt(sizer.value, 10);
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
    };
    return PaginationComponent;
}());
PaginationComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'table-pagination',
                template: "<div *ngIf=\"info && info.pages > 1\" [style.width]=\"info.maxWidth\" class=\"table-pagination\" #paginationWrapper>\n    <div class=\"fa fa-angle-left\"\n         (click)=\"selectPrev()\"\n         [class.disabled]=\"info.currentPage==1\">\n        <span class=\"prev\" [textContent]=\"vocabulary.previousPage\"></span>\n    </div>\n    <div class=\"fa fa-angle-double-left\"\n         (click)=\"selectFirst()\"\n         [class.disabled]=\"info.currentPage==1\">\n        <span class=\"first\" [textContent]=\"vocabulary.firstPage\"></span>\n    </div>\n    <div class=\"current\">\n        <input  #ranger [value]=\"info.currentPage\" (keydown.Enter)=\"changeCurrent(ranger)\" />\n        <span [textContent]=\"' / ' + info.pages\"></span>\n\t</div>\n    <div class=\"fa fa-angle-double-right\"\n         (click)=\"selectLast()\"\n         [class.disabled]=\"info.currentPage==info.pages\">\n        <span class=\"last\" [textContent]=\"vocabulary.lastPage\"></span>\n    </div>\n    <div class=\"fa fa-angle-right\"\n         (click)=\"selectNext()\"\n         [class.disabled]=\"info.currentPage==info.pages\">\n        <span class=\"next\" [textContent]=\"vocabulary.nextPage\"></span>\n    </div>\n    <div class=\"reset-size\" *ngIf=\"info.resetSize\">\n        <label for=\"pagination-set-size\">\n            <span class=\"off-screen\" [textContent]=\"vocabulary.setSize\"></span>\n            <input id=\"pagination-set-size\" [value]=\"info.pageSize\" (keydown.Enter)=\"changeSize(sizer)\" #sizer />\n        </label>\n    </div>\n</div>\n",
                styles: [".table-pagination{-webkit-box-sizing:border-box;box-sizing:border-box;background-color:#fff;border:1px solid #254a5d;border-radius:2px;color:#254a5d;bottom:5px;clear:both;display:-webkit-box;display:-ms-flexbox;display:flex;font-size:1em;height:38px;max-width:100%;margin:0 auto;position:fixed;left:40%;z-index:55}.table-pagination .fa{padding:4px 8px;margin-top:5px}.table-pagination .first,.table-pagination .last,.table-pagination .next,.table-pagination .prev{background-repeat:no-repeat;cursor:pointer;width:auto;display:block;height:39px;text-indent:-99999px;-webkit-box-sizing:border-box;box-sizing:border-box}.table-pagination .reset-size{padding:0;height:35px;border-radius:4px}.table-pagination .reset-size input{border:0;border-left:1px solid #4c5854;height:34px;text-align:center;width:30px;margin-right:2px;margin-left:8px}.table-pagination .current{padding:1px 5px}.table-pagination .current input{padding:0 3px;width:14px;height:35px;border:none;text-align:center}.table-pagination .disabled{opacity:.4}@media screen and (max-width:992px){.table-pagination{left:4px}}"]
            },] },
];
PaginationComponent.ctorParameters = function () { return []; };
PaginationComponent.propDecorators = {
    "vocabulary": [{ type: core.Input, args: ["vocabulary",] },],
    "info": [{ type: core.Input, args: ["info",] },],
    "onchange": [{ type: core.Output, args: ['onchange',] },],
    "onready": [{ type: core.Output, args: ['onready',] },],
};
var ConfigurationComponent = /** @class */ (function () {
    function ConfigurationComponent() {
        this.onchange = new core.EventEmitter();
    }
    ConfigurationComponent.prototype.reconfigure = function (item, header) {
        header.present = item.checked;
        this.onchange.emit(this.headers);
    };
    ConfigurationComponent.prototype.keyup = function (event) {
        var code = event.which;
        if (code === 13) {
            event.target.click();
        }
    };
    return ConfigurationComponent;
}());
ConfigurationComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'table-configuration',
                template: "\n<div class=\"shim\"\n    [style.display]=\"showConfigurationView ? 'block':'none'\"\n    (click)=\"showConfigurationView = !showConfigurationView\"></div>\n<a  [attr.tabindex]=\"0\"\n    (keyup)=\"keyup($event)\"\n    (click)=\"showConfigurationView = !showConfigurationView\">\n    <span class=\"icon fa fa-gear\" aria-hidden=\"true\"></span>\n    <span class=\"off-screen\" [textContent]=\"action\"></span>\n</a>\n<ul role=\"list\" [style.display]=\"showConfigurationView ? 'block':'none'\">\n    <p [textContent]=\"title\"></p>\n    <li  *ngFor=\"let header of headers\" role=\"listitem\">\n        <label for=\"{{header.key ? header.key+'c':'c'}}\">\n            <input type=\"checkbox\" #checkbox\n                    [id]=\"header.key ? header.key+'c':'c'\"\n                    [value]=\"header.key\"\n                    [checked]=\"header.present\"\n                    (keyup)=\"keyup($event)\"\n                    (click)=\"reconfigure(checkbox, header)\" />\n            <span [textContent]=\"header.value\"></span>\n        </label>\n    </li>\n</ul>\n",
                styles: [":host{-webkit-box-sizing:border-box;box-sizing:border-box;padding:2px;position:absolute;right:8px;top:18px}:host a{display:block;padding:0;cursor:pointer;z-index:5}:host a .icon{color:#00925b}:host a .off-screen{display:block;text-indent:-9999px;width:0;height:0;overflow:hidden}:host .shim{background-color:rgba(255,255,255,.2);width:100vw;height:100vh;position:fixed;top:0;left:0;z-index:2}:host ul{background-color:#fff;border:1px solid #999;border-radius:4px;display:block;list-style:none;max-height:300px;margin:2px 0;min-width:200px;overflow-y:auto;position:absolute;padding:15px;right:0;-webkit-box-shadow:6px 8px 6px -6px #1b1b1b;box-shadow:6px 8px 6px -6px #1b1b1b;z-index:5}:host ul li{white-space:nowrap}"]
            },] },
];
ConfigurationComponent.ctorParameters = function () { return []; };
ConfigurationComponent.propDecorators = {
    "title": [{ type: core.Input, args: ["title",] },],
    "action": [{ type: core.Input, args: ["action",] },],
    "headers": [{ type: core.Input, args: ["headers",] },],
    "onchange": [{ type: core.Output, args: ['onchange',] },],
};
var FlexibleTableModule = /** @class */ (function () {
    function FlexibleTableModule() {
    }
    return FlexibleTableModule;
}());
FlexibleTableModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    common.CommonModule,
                    dragEnabled.DragDropModule,
                    intoPipes.IntoPipeModule
                ],
                declarations: [
                    FlexibleTableComponent,
                    ConfigurationComponent,
                    PaginationComponent
                ],
                exports: [
                    FlexibleTableComponent
                ],
                entryComponents: [],
                providers: [],
                schemas: [core.CUSTOM_ELEMENTS_SCHEMA]
            },] },
];
FlexibleTableModule.ctorParameters = function () { return []; };

exports.FlexibleTableComponent = FlexibleTableComponent;
exports.FlexibleTableModule = FlexibleTableModule;
exports.ɵa = ConfigurationComponent;
exports.ɵb = PaginationComponent;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=flexible-table.umd.js.map
