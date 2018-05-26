import { Injectable, Component, Input, Output, EventEmitter, ViewChild, ViewContainerRef, ElementRef, Renderer, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntoPipeModule } from 'into-pipes';
import { DragDropModule } from 'drag-enabled';

var TableHeadersGenerator = /** @class */ (function () {
    function TableHeadersGenerator() {
        this.headers = [];
    }
    TableHeadersGenerator.prototype.generateHeadersFor = function (root, path, maxVisible, filteringEnabled) {
        var _this = this;
        if (root !== null) {
            Object.keys(root).map(function (key) {
                var innerPath = (path.length ? (path + "." + key) : key);
                if (typeof root[key] === "string" || typeof root[key] === "number" || typeof root[key] === "boolean") {
                    var header = {
                        key: innerPath,
                        value: _this.makeWords(innerPath),
                        sortable: true,
                        dragable: true,
                        present: (path.length === 0 && _this.headers.length < maxVisible)
                    };
                    if (filteringEnabled) {
                        header.filter = "";
                    }
                    _this.headers.push(header);
                }
                else if (root[key] instanceof Array) {
                    var node = root[key];
                    if (node.length && !(node[0] instanceof Array) && (typeof node[0] !== "string")) {
                        _this.generateHeadersFor(node[0], innerPath, maxVisible, filteringEnabled);
                    }
                    else {
                        _this.headers.push({
                            key: innerPath,
                            value: _this.makeWords(innerPath)
                        });
                    }
                }
                else {
                    _this.generateHeadersFor(root[key], innerPath, maxVisible, filteringEnabled);
                }
            });
        }
        return this.headers;
    };
    TableHeadersGenerator.prototype.retreiveHeaders = function (key, trackingkey) {
        var result;
        try {
            result = localStorage.getItem(trackingkey);
            if (!result || result != key) {
                result = undefined;
            }
            else {
                result = localStorage.getItem(key);
                result = result ? JSON.parse(result) : result;
            }
        }
        catch (e) {
        }
        return result;
    };
    TableHeadersGenerator.prototype.persistHeaders = function (key, trackingkey, headers) {
        try {
            localStorage.removeItem(trackingkey);
            localStorage.setItem(trackingkey, key);
            localStorage.setItem(key, JSON.stringify(headers));
        }
        catch (e) {
        }
    };
    TableHeadersGenerator.prototype.makeWords = function (name) {
        return name
            .replace(/\./g, ' ~ ')
            .replace(/([A-Z])/g, ' $1')
            .replace(/-/g, " ")
            .replace(/_/g, " ")
            .replace(/^./, function (str) { return str.toUpperCase(); });
    };
    return TableHeadersGenerator;
}());
TableHeadersGenerator.decorators = [
    { type: Injectable },
];
TableHeadersGenerator.ctorParameters = function () { return []; };
var FlexibleTableComponent = /** @class */ (function () {
    function FlexibleTableComponent(generator) {
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
        this.onconfigurationchange = new EventEmitter();
    }
    FlexibleTableComponent.prototype.ngOnInit = function () {
        if (this.persistenceKey) {
            var headers = this.generator.retreiveHeaders(this.persistenceKey, this.persistenceId);
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
        this.updateLimits();
    };
    FlexibleTableComponent.prototype.updateLimits = function () {
        this.subHeaders = this.headers.filter(function (header) { return header.present === true; });
    };
    FlexibleTableComponent.prototype.reconfigure = function (event) {
        this.headers = event;
        this.updateLimits();
        this.onconfigurationchange.emit(event);
        if (this.persistenceKey) {
            this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
        }
    };
    FlexibleTableComponent.prototype.onPaginationChange = function (event) {
        this.pageInfo = event;
    };
    FlexibleTableComponent.prototype.tableAction = function (event) {
        this.onaction.emit(event);
    };
    FlexibleTableComponent.prototype.onDrop = function (event) {
    };
    return FlexibleTableComponent;
}());
FlexibleTableComponent.decorators = [
    { type: Component, args: [{
                selector: 'flexible-table',
                template: "\n<div class=\"flexible-table\">\n    <table-configuration\n        *ngIf=\"configurable && items && items.length\"\n        class=\"table-configuration\"\n        [headers]=\"headers\"\n        [title]=\"vocabulary.configureColumns\"\n        [printTable]=\"vocabulary.printTable\"\n        [action]=\"vocabulary.configureTable\"\n        (onprint)=\"viewTable.print()\"\n        (onchange)=\"reconfigure($event)\"></table-configuration>\n    <table-view #viewTable\n        [action]=\"action\"\n        [actionKeys]=\"actionKeys\"\n\t\t[tableClass]=\"tableClass\"\n\t\t[caption]=\"caption\"\n\t\t[headers]=\"subHeaders\"\n\t\t[items]=\"items\"\n        [pageInfo]=\"pageInfo\"\n        [vocabulary]=\"vocabulary\"\n\t\t[enableIndexing]=\"enableIndexing\"\n\t\t[enableFiltering]=\"enableFiltering\"\n        [rowDetailer]=\"rowDetailer\"\n        [actionable]=\"actionable\"\n        [expandable]=\"expandable\"\n        (onDrop)=\"onDrop($event)\"\n        (onchange)=\"reconfigure($event)\"\n\t\t(onaction)=\"tableAction($event)\"></table-view>\n</div>\n<table-pagination\n    [info]=\"pageInfo\"\n    [vocabulary]=\"vocabulary\"\n    (onchange)=\"onPaginationChange($event)\"></table-pagination>\n",
                styles: [":host{display:inline-block!important;width:100%}.flexible-table{position:relative;margin:0 auto;display:table;border-spacing:0;border-collapse:collapse}.flexible-table .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table{margin:1rem auto;padding:0;width:100%;table-layout:fixed;max-width:99%;background-color:transparent;border-collapse:collapse}.flexible-table table caption{background-color:#c3e5e2;border-radius:2px;color:#1b1b1b;caption-side:top;font-size:14px;padding:5px 6px;margin-bottom:15px;text-align:left}.flexible-table table thead{border-top:1px solid #bbb;border-bottom:1px solid #bbb;background-color:#eee}.flexible-table table tr{border:0}.flexible-table table tr.expanded td{font-weight:700;border-bottom:0}.flexible-table table td{padding-left:3px}.flexible-table table td:first-child{padding-left:5px}.flexible-table table td .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table td.index{background-color:#eee;border-right:1px solid #bbb}.flexible-table table th{cursor:default;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none;height:24px;position:relative;white-space:nowrap;font-weight:400;text-transform:uppercase;font-size:14px;padding-top:6px;padding-bottom:6px;text-align:left}.flexible-table table th.drag-over{background-color:#9b9b9b}.flexible-table table th.drag-over .icon,.flexible-table table th.drag-over .title{color:#eee}.flexible-table table th:first-child{padding-left:5px}.flexible-table table th.ascending,.flexible-table table th.descending,.flexible-table table th.sortable{cursor:pointer;height:12px}.flexible-table table th.indexable{width:33px}.flexible-table table th.actionable{width:24px}.flexible-table table th .title{color:#254a4d;display:inline-block;height:20px;white-space:nowrap}.flexible-table table th .dragable{cursor:move}.flexible-table table th .icon{width:22px;display:inline-block;height:20px;color:#254a4d}.flexible-table .fa.fa-angle-right{font-size:18px}.flexible-table table tr.detail td{border-top:0;cursor:default}.flexible-table table tr.expanded td a.expanded{background-position:right 2px}.flexible-table table tbody tr:hover{background-color:#ffeed2}.flexible-table table tbody tr.detail:hover,.flexible-table table tbody tr.detail:hover td table thead tr{background-color:inherit}.flexible-table table tr td a.actionable{display:inline-table;height:32px;vertical-align:middle;width:25px;line-height:30px;color:#254a4d}.flexible-table table tbody tr.detail:hover td:last-child{border-right:0}.flexible-table table tbody tr.detail:hover td:first-child{border-left:0}.flexible-table table tr td{border-bottom:1px solid #b1b3b3;color:#254a5d;font-size:15px;text-transform:capitalize}.flexible-table table tbody tr.pointer{cursor:pointer}.flexible-table table.alert-danger{border:0}.flexible-table table.alert-danger caption{background-color:transparent;font-weight:700;margin-bottom:0}.flexible-table table.alert-danger td{border-bottom:0;display:block}.flexible-table table.alert-danger td:first-child{padding-left:0}.flexible-table table.alert-danger td:last-child{border-bottom:0}.flexible-table table.alert-danger td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase;width:20%}.flexible-table table.alert-danger td a span.icon{width:100%}.flexible-table table.alert-danger thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table.alert-danger tr{border:2px solid #fff;display:block;margin-bottom:.625em;padding:5px;border-radius:5px}.flexible-table table.alert-danger tr th.actionable{width:inherit}.flexible-table table.alert-danger tr td{border-bottom:0}@media screen and (max-width:600px){.flexible-table table{border:0}.flexible-table table td{border-bottom:0;display:block;text-align:right}.flexible-table table td:first-child{padding-left:0}.flexible-table table td:last-child{border-bottom:0}.flexible-table table td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase}.flexible-table table td a span.icon{width:100%}.flexible-table table thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table tr{border-bottom:3px solid #ddd;display:block;margin-bottom:.625em}.flexible-table table tr th.actionable{width:inherit}.flexible-table table tr td{border-bottom:0}.flexible-table table.alert-danger td:before{width:inherit}}"]
            },] },
];
FlexibleTableComponent.ctorParameters = function () { return [
    { type: TableHeadersGenerator, },
]; };
FlexibleTableComponent.propDecorators = {
    "vocabulary": [{ type: Input, args: ["vocabulary",] },],
    "persistenceId": [{ type: Input, args: ["persistenceId",] },],
    "persistenceKey": [{ type: Input, args: ["persistenceKey",] },],
    "caption": [{ type: Input, args: ["caption",] },],
    "action": [{ type: Input, args: ["action",] },],
    "actionKeys": [{ type: Input, args: ["actionKeys",] },],
    "tableClass": [{ type: Input, args: ["tableClass",] },],
    "headers": [{ type: Input, args: ["headers",] },],
    "items": [{ type: Input, args: ["items",] },],
    "pageInfo": [{ type: Input, args: ["pageInfo",] },],
    "tableInfo": [{ type: Input, args: ["tableInfo",] },],
    "configurable": [{ type: Input, args: ["configurable",] },],
    "enableIndexing": [{ type: Input, args: ["enableIndexing",] },],
    "enableFiltering": [{ type: Input, args: ["enableFiltering",] },],
    "rowDetailer": [{ type: Input, args: ["rowDetailer",] },],
    "expandable": [{ type: Input, args: ["expandable",] },],
    "expandIf": [{ type: Input, args: ["expandIf",] },],
    "rowDetailerHeaders": [{ type: Input, args: ["rowDetailerHeaders",] },],
    "onaction": [{ type: Output, args: ['onaction',] },],
    "onconfigurationchange": [{ type: Output, args: ['onconfigurationchange',] },],
};
var PaginationComponent = /** @class */ (function () {
    function PaginationComponent() {
        this.vocabulary = { setSize: "", firstPage: "", lastPage: "", previousPage: "" };
        this.info = { contentSize: 0, pageSize: 0, maxWidth: "0" };
        this.onchange = new EventEmitter();
        this.onready = new EventEmitter();
    }
    PaginationComponent.prototype.ngOnInit = function () {
        var _this = this;
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
    { type: Component, args: [{
                selector: 'table-pagination',
                template: "<div *ngIf=\"info && info.pages > 1\" [style.width]=\"info.maxWidth\" class=\"table-pagination\" #paginationWrapper>\n    <div class=\"fa fa-angle-left\"\n         (click)=\"selectPrev()\"\n         [class.disabled]=\"info.currentPage==1\">\n        <span class=\"prev\" [textContent]=\"vocabulary.previousPage\"></span>\n    </div>\n    <div class=\"fa fa-angle-double-left\"\n         (click)=\"selectFirst()\"\n         [class.disabled]=\"info.currentPage==1\">\n        <span class=\"first\" [textContent]=\"vocabulary.firstPage\"></span>\n    </div>\n    <div class=\"current\">\n        <input  #ranger [value]=\"info.currentPage\" (keydown.Enter)=\"changeCurrent(ranger)\" />\n        <span [textContent]=\"' / ' + info.pages\"></span>\n\t</div>\n    <div class=\"fa fa-angle-double-right\"\n         (click)=\"selectLast()\"\n         [class.disabled]=\"info.currentPage==info.pages\">\n        <span class=\"last\" [textContent]=\"vocabulary.lastPage\"></span>\n    </div>\n    <div class=\"fa fa-angle-right\"\n         (click)=\"selectNext()\"\n         [class.disabled]=\"info.currentPage==info.pages\">\n        <span class=\"next\" [textContent]=\"vocabulary.nextPage\"></span>\n    </div>\n    <div class=\"reset-size\" *ngIf=\"info.resetSize\">\n        <label for=\"pagination-set-size\">\n            <span class=\"off-screen\" [textContent]=\"vocabulary.setSize\"></span>\n            <input id=\"pagination-set-size\" [value]=\"info.pageSize\" (keydown.Enter)=\"changeSize(sizer)\" #sizer />\n        </label>\n    </div>\n</div>\n",
                styles: [".table-pagination{-webkit-box-sizing:border-box;box-sizing:border-box;background-color:#fff;border:1px solid #254a5d;border-radius:2px;color:#254a5d;bottom:5px;clear:both;display:-webkit-box;display:-ms-flexbox;display:flex;font-size:1em;height:38px;max-width:100%;margin:0 auto;position:fixed;left:40%;z-index:55}.table-pagination .fa{padding:4px 8px;margin-top:5px}.table-pagination .first,.table-pagination .last,.table-pagination .next,.table-pagination .prev{background-repeat:no-repeat;cursor:pointer;width:auto;display:block;height:39px;text-indent:-99999px;-webkit-box-sizing:border-box;box-sizing:border-box}.table-pagination .reset-size{padding:0;height:35px;border-radius:4px}.table-pagination .reset-size input{border:0;border-left:1px solid #4c5854;height:34px;text-align:center;width:30px;margin-right:2px;margin-left:8px}.table-pagination .current{padding:1px 5px}.table-pagination .current input{padding:0 3px;width:14px;height:35px;border:none;text-align:center}.table-pagination .disabled{opacity:.4}@media screen and (max-width:992px){.table-pagination{left:4px}}"]
            },] },
];
PaginationComponent.ctorParameters = function () { return []; };
PaginationComponent.propDecorators = {
    "vocabulary": [{ type: Input, args: ["vocabulary",] },],
    "info": [{ type: Input, args: ["info",] },],
    "onchange": [{ type: Output, args: ['onchange',] },],
    "onready": [{ type: Output, args: ['onready',] },],
};
var ConfigurationComponent = /** @class */ (function () {
    function ConfigurationComponent() {
        this.onchange = new EventEmitter();
        this.onprint = new EventEmitter();
    }
    ConfigurationComponent.prototype.reconfigure = function (item, header) {
        header.present = item.checked;
        this.onchange.emit(this.headers);
    };
    ConfigurationComponent.prototype.enableFilter = function (item, header) {
        if (header.filter === undefined) {
            header.filter = "";
        }
        else {
            delete header.filter;
        }
        this.onchange.emit(this.headers);
    };
    ConfigurationComponent.prototype.print = function (event) {
        this.onprint.emit(true);
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
    { type: Component, args: [{
                selector: 'table-configuration',
                template: "\n<div class=\"shim\"\n    [style.display]=\"showConfigurationView ? 'block':'none'\"\n    (click)=\"showConfigurationView = !showConfigurationView\"></div>\n<a  [attr.tabindex]=\"0\" *ngIf=\"printTable\"\n    class=\"print-table\"\n    (keyup)=\"keyup($event)\"\n    (click)=\"print($event)\">\n    <span class=\"icon fa fa-print\" aria-hidden=\"true\"></span>\n    <span class=\"off-screen\" [textContent]=\"print\"></span>\n</a>\n<a  [attr.tabindex]=\"0\"\n    class=\"configure-table\"\n    (keyup)=\"keyup($event)\"\n    (click)=\"showConfigurationView = !showConfigurationView\">\n    <span class=\"icon fa fa-gear\" aria-hidden=\"true\"></span>\n    <span class=\"off-screen\" [textContent]=\"action\"></span>\n</a>\n<ul role=\"list\" [style.display]=\"showConfigurationView ? 'block':'none'\">\n    <p [textContent]=\"title\"></p>\n    <li  *ngFor=\"let header of headers\" role=\"listitem\">\n        <label for=\"{{header.key ? header.key+'f':'f'}}\">\n            <input type=\"checkbox\" #filter\n                    [id]=\"header.key ? header.key+'f':'f'\"\n                    [checked]=\"header.filter !== undefined\"\n                    (keyup)=\"keyup($event)\"\n                    (click)=\"enableFilter(filter, header)\" />\n            <span>Filrer</span>\n        </label>\n        <label for=\"{{header.key ? header.key+'c':'c'}}\">\n            <input type=\"checkbox\" #checkbox\n                    [id]=\"header.key ? header.key+'c':'c'\"\n                    [value]=\"header.key\"\n                    [checked]=\"header.present\"\n                    (keyup)=\"keyup($event)\"\n                    (click)=\"reconfigure(checkbox, header)\" />\n            <span>Show</span>\n        </label>\n        <span>: </span>\n        <span [textContent]=\"header.value\"></span>\n    </li>\n</ul>\n",
                styles: [":host{-webkit-box-sizing:border-box;box-sizing:border-box;padding:2px;position:absolute;right:8px;top:18px;z-index:2}:host a{display:block;float:left;padding:0 0 0 10px;cursor:pointer;z-index:5}:host a .icon{color:#00925b}:host a .off-screen{display:block;text-indent:-9999px;width:0;height:0;overflow:hidden}:host .shim{background-color:rgba(255,255,255,.2);width:100vw;height:100vh;position:fixed;top:0;left:0;z-index:2}:host ul{background-color:#fff;border:1px solid #999;border-radius:4px;display:block;list-style:none;max-height:300px;margin:2px 0;min-width:200px;overflow-y:auto;position:absolute;padding:15px;right:0;-webkit-box-shadow:6px 8px 6px -6px #1b1b1b;box-shadow:6px 8px 6px -6px #1b1b1b;z-index:6}:host ul li{white-space:nowrap;text-align:left}"]
            },] },
];
ConfigurationComponent.ctorParameters = function () { return []; };
ConfigurationComponent.propDecorators = {
    "title": [{ type: Input, args: ["title",] },],
    "action": [{ type: Input, args: ["action",] },],
    "printTable": [{ type: Input, args: ["printTable",] },],
    "headers": [{ type: Input, args: ["headers",] },],
    "onchange": [{ type: Output, args: ['onchange',] },],
    "onprint": [{ type: Output, args: ['onprint',] },],
};
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
        return subitem === undefined || subitem === null || subitem === "null" ? "" : String(subitem);
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
            this.filteredItems.sort(function (a, b) {
                var v1 = _this.itemValue(a, hpath_1);
                var v2 = _this.itemValue(b, hpath_1);
                if (header.ascending) {
                    return v1 > v2 ? 1 : -1;
                }
                return v1 < v2 ? 1 : -1;
            });
        }
    };
    TableViewComponent.prototype.offsetWidth = function () {
        return this.table.element.nativeElement.offsetWidth;
    };
    TableViewComponent.prototype.ngOnChanges = function (changes) {
        if (changes.items) {
            if (this.enableFiltering) {
                if (this.enableFiltering) {
                    this.filterItems();
                }
                else {
                    this.filteredItems = this.items;
                }
            }
        }
    };
    TableViewComponent.prototype.ngOnInit = function () {
        if (!this.pageInfo) {
            this.pageInfo = {
                contentSize: 1000,
                pageSize: 1000,
                pages: 1,
                from: 0,
                to: 1000,
                currentPage: 1,
                maxWidth: "0"
            };
        }
        if (!this.headers) {
            this.headers = [];
        }
        if (this.enableFiltering) {
            this.filterItems();
        }
        else {
            this.filteredItems = this.items;
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
    TableViewComponent.prototype.headerColumnElements = function () {
        var result = [];
        if (this.table.element.nativeElement.children) {
            var list = this.table.element.nativeElement.children;
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
    TableViewComponent.prototype.keydown = function (event, item) {
        var code = event.which;
        if ((code === 13) || (code === 32)) {
            item.click();
        }
    };
    TableViewComponent.prototype.offScreenMessage = function (item) {
        var message = this.action;
        this.actionKeys.map(function (key) { message = message.replace(key, item[key.substring(1, key.length - 1)]); });
        return message;
    };
    TableViewComponent.prototype.cellContent = function (item, header) {
        var content = this.itemValue(item, header.key.split("."));
        return (content !== undefined && content != null) ? content : '&nbsp;';
    };
    TableViewComponent.prototype.rowDetailerContext = function (item) {
        return {
            data: item,
            tableInfo: this.tableInfo,
            headers: this.rowDetailerHeaders(item)
        };
    };
    TableViewComponent.prototype.changeFilter = function (event, header) {
        var code = event.which;
        header.filter = event.target.value;
        if (code === 13) {
            this.filterItems();
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
        var oldInfo = this.pageInfo;
        this.pageInfo = {
            contentSize: 1000,
            pageSize: 1000,
            pages: 1,
            from: 0,
            to: 1000,
            currentPage: 1,
            maxWidth: "0"
        };
        this.printMode = true;
        setTimeout(function () {
            var content = _this.el.nativeElement.innerHTML;
            _this.printMode = false;
            _this.pageInfo = oldInfo;
            var popupWin = window.open('', '_blank', 'width=300,height=300');
            popupWin.document.open();
            popupWin.document.write('<html><body onload="window.print()">' + content + '</html>');
            popupWin.document.close();
        }, 3);
    };
    TableViewComponent.prototype.shouldSkipItem = function (value, filterBy) {
        var result = false;
        if (value !== undefined && value !== null && value.length) {
            if (filterBy[0] === '<') {
                result = parseFloat(value) >= parseFloat(filterBy.substring(1));
            }
            else if (filterBy[0] === '>') {
                result = parseFloat(value) <= parseFloat(filterBy.substring(1));
            }
            else if (filterBy[0] === '!') {
                result = parseFloat(value) == parseFloat(filterBy.substring(1));
            }
            else if (filterBy[0] === '=') {
                result = parseFloat(value) !== parseFloat(filterBy.substring(1));
            }
            else if (filterBy[0] === '*' && filterBy[filterBy.length - 1] !== '*') {
                var f = filterBy.substring(1);
                result = value.toLowerCase().indexOf(f) !== value.length - f.length;
            }
            else if (filterBy[0] !== '*' && filterBy[filterBy.length - 1] === '*') {
                var f = filterBy.substring(0, filterBy.length - 1);
                result = value.toLowerCase().indexOf(f) !== 0;
            }
            else if (filterBy[0] === '*' && filterBy[filterBy.length - 1] === '*') {
                var f = filterBy.substring(1, filterBy.length - 1);
                result = value.toLowerCase().indexOf(f) < 0;
            }
            else {
                result = value.toLowerCase().indexOf(filterBy) < 0;
            }
        }
        return result;
    };
    TableViewComponent.prototype.filterItems = function () {
        var _this = this;
        this.filteredItems = this.items.filter(function (item) {
            var keepItem = true;
            for (var i = 0; i < _this.headers.length; i++) {
                var header = _this.headers[i];
                if (header.filter && header.filter.length) {
                    var v2 = header.filter.toLowerCase();
                    var v = _this.itemValue(item, header.key.split("."));
                    if (_this.shouldSkipItem(v, v2)) {
                        keepItem = false;
                        break;
                    }
                }
            }
            return keepItem;
        });
        this.onfilter.emit(this.filteredItems);
    };
    TableViewComponent.prototype.onTableCellEdit = function (event) {
        var id = event.id.split("-");
        var name = event.name;
        var value = event.value;
        var item = this.items[parseInt(id[1])];
        if (item) {
            var list = id[0].split(".");
            var subitem = item[list[0]];
            for (var i = 1; i < (list.length - 1); i++) {
                subitem = subitem[list[i]];
            }
            if (subitem && list.length > 1) {
                subitem[list[list.length - 1]] = value;
            }
        }
    };
    TableViewComponent.prototype.dragEnabled = function (event) {
        return event.medium.dragable;
    };
    TableViewComponent.prototype.dropEnabled = function (event) {
        return event.destination.medium.dragable;
    };
    TableViewComponent.prototype.onDragStart = function (event) {
    };
    TableViewComponent.prototype.onDragEnd = function (event) {
    };
    TableViewComponent.prototype.onDrop = function (event) {
        this.swapColumns(event.source, event.destination);
    };
    return TableViewComponent;
}());
TableViewComponent.decorators = [
    { type: Component, args: [{
                selector: 'table-view',
                template: "\n<table [class]=\"tableClass\"  #flexible>\n    <caption *ngIf=\"caption\" [textContent]=\"caption\"></caption>\n    <thead>\n        <tr>\n            <th scope=\"col\" *ngIf=\"enableIndexing && !printMode\" id=\"indexable\" class=\"indexable\"></th>\n            <th scope=\"col\" *ngFor=\"let header of headers\"\n                [dragEnabled]=\"dragEnabled.bind(this)\"\n                [dropEnabled]=\"dropEnabled.bind(this)\"\n                [medium]=\"header\"\n                (onDragStart)=\"onDragStart($event)\"\n                (onDragEnd)=\"onDragEnd($event)\"\n                (onDrop)=\"onDrop($event)\"\n                [id]=\"header.key\"\n                [attr.width]=\"header.width ? header.width : null\"\n                [style.min-width]=\"header.minwidth ? header.minwidth : ''\"\n                [attr.tabindex]=\"header.sortable ? 0 : -1\"\n                (keydown)=\"keydown($event, th)\" (click)=\"sort(header, icon)\">\n                <span *ngIf=\"!printMode && header.sortable\" class=\"off-screen\"  [textContent]=\"vocabulary.clickSort\"></span>\n                <span class=\"locker icon fa\" #locker\n                        *ngIf=\"!printMode && lockable && (headers.length > 1 || header.locked)\"\n                        tabindex=\"0\"\n                        title=\"lock/unlock this column\"\n                        (keydown)=\"keydown($event, locker)\" (click)=\"lock(header, $event)\"\n                        [class.fa-lock]=\"header.locked\"\n                        [class.fa-unlock]=\"!header.locked\"></span>\n                <span class=\"title\"\n                        [class.dragable]=\"header.dragable\"\n                        [textContent]=\"header.value\"></span>\n                <span class=\"icon fa\"\n                        *ngIf=\"!printMode && items && items.length\" #icon\n                        [class.fa-sort]=\"header.sortable\"\n                        [class.fa-sort-asc]=\"header.assending\"\n                        [class.fa-sort-desc]=\"header.desending\"></span>\n            </th>\n            <th scope=\"col\" *ngIf=\"action && !printMode\" id=\"actionable\" class=\"actionable\"></th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr *ngIf=\"!printMode && enableFiltering && items && items.length\">\n            <td scope=\"row\" *ngIf=\"enableIndexing && !printMode\" class=\"index filter\">\n                <input type=\"text\" disabled style=\"opacity:0\" />\n            </td>\n            <td scope=\"row\"\n                        *ngFor=\"let header of headers; let i=index\"\n                        [attr.data-label]=\"header.value\"\n                        class=\"filter\">\n                <span *ngIf=\"header.filter === undefined\">&nbsp;</span>\n                <input  *ngIf=\"header.filter !== undefined\"\n                        id=\"filter-{{i}}\"\n                        type=\"text\"\n                        (keyup)=\"changeFilter($event, header)\"\n                        [value]=\"header.filter ? header.filter : ''\" />\n                <label *ngIf=\"header.filter !== undefined\" for=\"filter-{{i}}\" ><span class=\"off-screen\" >Filter \"{{header.value}}\"</span><span class=\"fa fa-search\"></span></label>\n            </td>\n            <td scope=\"row\" *ngIf=\"action && !printMode\"></td>\n        </tr>\n       <ng-template ngFor let-item [ngForOf]=\"filteredItems\" let-i=\"index\">\n            <tr *ngIf=\"i >= pageInfo.from && i <= pageInfo.to \"\n                (click)=\"actionClick($event, item)\"\n                (mouseover)=\"hover(item, true)\"\n                (mouseout)=\"hover(item, false)\"\n                [class.pointer]=\"action\"\n                [class.hover]=\"item.hover\"\n                [class.expanded]=\"item.expanded\"\n                [class.odd]=\"i%2\">\n                <td scope=\"row\" class=\"index\" *ngIf=\"enableIndexing && !printMode\">{{i + 1}}</td>\n                <td scope=\"row\"\n                    *ngFor=\"let header of headers\"\n                    [attr.data-label]=\"header.value\"\n                    [intoName]=\"header.value\"\n                    [intoId]=\"header.key + '-' + i\"\n                    [into]=\"header.format\"\n                    [rawContent]=\"cellContent(item, header)\"\n                    [onComponentChange]=\"onTableCellEdit.bind(this)\"></td>\n                <td scope=\"row\" *ngIf=\"action && !printMode\">\n                    <a class=\"actionable\"\n                        *ngIf=\"expandable(item, true)\"\n                        tabindex=\"0\"\n                        role=\"button\"\n                        style=\"cursor:pointer\"\n                        [class.expanded]=\"item.expanded\" #clicker\n                        (keydown)=\"keydown($event, clicker)\" (click)=\"actionClick($event, item)\">\n                        <span\n                            class=\"icon fa\"\n                            [class.fa-angle-right]=\"!rowDetailer\"\n                            [class.fa-minus-square-o]=\"rowDetailer && item.expanded\"\n                            [class.fa-plus-square-o]=\"rowDetailer && !item.expanded\"\n                            aria-hidden=\"true\"></span>\n                        <span class=\"off-screen\" [textContent]=\"offScreenMessage(item)\"></span>\n                    </a>\n                </td>\n            </tr>\n            <tr *ngIf=\"rowDetailer && item.expanded\" class=\"detail\" [class.odd]=\"i%2\">\n                <td scope=\"row\" class=\"index\" *ngIf=\"enableIndexing && !printMode\"></td>\n                <td [attr.colspan]=\"columnsCount()\">\n                    <ng-container [ngTemplateOutlet]=\"rowDetailer\" [ngTemplateOutletContext]=\"rowDetailerContext(item)\"></ng-container>\n                </td>\n            </tr>\n        </ng-template>\n    </tbody>\n</table>\n",
                styles: [":host{display:inline-block!important;width:100%;position:relative;margin:0 auto;border-spacing:0;border-collapse:collapse}:host .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host table{margin:1rem auto;padding:0;width:100%;table-layout:fixed;max-width:99%;background-color:transparent;border-collapse:collapse}:host table caption{background-color:#c3e5e2;border-radius:2px;color:#1b1b1b;caption-side:top;font-size:14px;padding:5px 6px;margin-bottom:15px;text-align:left}:host table thead{border-top:1px solid #bbb;border-bottom:1px solid #bbb;background-color:#eee}:host table tr{border:0}:host table tr.expanded td{font-weight:700}:host table td{padding-left:3px}:host table td:first-child{padding-left:5px}:host table td .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host table td.filter{padding:0;position:relative}:host table td.filter input{-webkit-box-sizing:border-box;box-sizing:border-box;width:100%;padding:5px}:host table td.filter .fa{position:absolute;top:7px;right:2px;color:#bad}:host table td ::ng-deep img{height:24px}:host table td.index{background-color:#eee;border-right:1px solid #bbb}:host table th{cursor:default;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none;height:24px;position:relative;white-space:nowrap;font-weight:400;text-transform:uppercase;font-size:14px;padding-top:6px;padding-bottom:6px;text-align:left}:host table th.drag-over{background-color:#9b9b9b}:host table th.drag-over .icon,:host table th.drag-over .title{color:#eee}:host table th:first-child{padding-left:5px}:host table th.ascending,:host table th.descending,:host table th.sortable{cursor:pointer;height:12px}:host table th.indexable{width:33px}:host table th.actionable{width:24px}:host table th .title{color:#254a4d;display:inline-block;height:20px;white-space:nowrap}:host table th .dragable{cursor:move}:host table th .icon{width:22px;display:inline-block;height:20px;color:#254a4d}:host .fa.fa-angle-right{font-size:18px}table tr.expanded td{border-bottom:0}table tr.detail td{border-top:0;cursor:default}table tr.expanded td a.expanded{background-position:right 2px}table tbody tr.hover,table tbody tr:hover{background-color:#ffeed2}table tbody tr.detail.hover,table tbody tr.detail.hover td table thead tr,table tbody tr.detail:hover,table tbody tr.detail:hover td table thead tr{background-color:inherit}table tr td a.actionable{display:inline-table;height:32px;vertical-align:middle;width:25px;line-height:30px;color:#254a4d}table tbody tr.detail.hover td:last-child,table tbody tr.detail:hover td:last-child{border-right:0}table tbody tr.detail.hover td:first-child,table tbody tr.detail:hover td:first-child{border-left:0}table tr td{border-bottom:1px solid #b1b3b3;color:#254a5d;font-size:15px;text-transform:capitalize}table tbody tr.pointer{cursor:pointer}table.alert-danger{border:0}table.alert-danger caption{background-color:transparent;font-weight:700;margin-bottom:0}table.alert-danger td{border-bottom:0;display:block}table.alert-danger td:first-child{padding-left:0}table.alert-danger td:last-child{border-bottom:0}table.alert-danger td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase;width:20%}table.alert-danger td a span.icon{width:100%}table.alert-danger thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}table.alert-danger tr{border:2px solid #fff;display:block;margin-bottom:.625em;padding:5px;border-radius:5px}table.alert-danger tr th.actionable{width:inherit}table.alert-danger tr td{border-bottom:0}@media screen and (max-width:600px){table{border:0}table td{border-bottom:0;display:block;text-align:right}table td:first-child{padding-left:0}table td:last-child{border-bottom:0}table td.filter input{width:50%!important}table td.filter .fa{right:7px!important}table td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase}table td a span.icon{width:100%}table thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}table tr{border-bottom:3px solid #ddd;display:block;margin-bottom:.625em}table tr th.actionable{width:inherit}table tr td{border-bottom:0}table.alert-danger td:before{width:inherit}}"]
            },] },
];
TableViewComponent.ctorParameters = function () { return [
    { type: ElementRef, },
]; };
TableViewComponent.propDecorators = {
    "vocabulary": [{ type: Input, args: ["vocabulary",] },],
    "lockable": [{ type: Input, args: ["lockable",] },],
    "caption": [{ type: Input, args: ["caption",] },],
    "action": [{ type: Input, args: ["action",] },],
    "pageInfo": [{ type: Input, args: ["pageInfo",] },],
    "actionKeys": [{ type: Input, args: ["actionKeys",] },],
    "tableClass": [{ type: Input, args: ["tableClass",] },],
    "headers": [{ type: Input, args: ["headers",] },],
    "items": [{ type: Input, args: ["items",] },],
    "tableInfo": [{ type: Input, args: ["tableInfo",] },],
    "enableIndexing": [{ type: Input, args: ["enableIndexing",] },],
    "enableFiltering": [{ type: Input, args: ["enableFiltering",] },],
    "rowDetailer": [{ type: Input, args: ["rowDetailer",] },],
    "expandable": [{ type: Input, args: ["expandable",] },],
    "expandIf": [{ type: Input, args: ["expandIf",] },],
    "rowDetailerHeaders": [{ type: Input, args: ["rowDetailerHeaders",] },],
    "onaction": [{ type: Output, args: ['onaction',] },],
    "onchange": [{ type: Output, args: ['onchange',] },],
    "onfilter": [{ type: Output, args: ['onfilter',] },],
    "table": [{ type: ViewChild, args: ['flexible', { read: ViewContainerRef },] },],
};
var LockTableComponent = /** @class */ (function () {
    function LockTableComponent(generator, renderer) {
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
        this.onconfigurationchange = new EventEmitter();
    }
    LockTableComponent.prototype.scroll = function (event) {
        this.renderer.setElementStyle(this.lockedTable.el.nativeElement, "left", event.target.scrollLeft + "px");
    };
    LockTableComponent.prototype.ngOnInit = function () {
        if (this.persistenceKey) {
            var headers = this.generator.retreiveHeaders(this.persistenceKey, this.persistenceId);
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
        this.reconfigure(this.headers);
    };
    LockTableComponent.prototype.evaluatePositioning = function () {
        this.renderer.setElementStyle(this.unlockedTable.el.nativeElement, "margin-left", this.lockedTable.offsetWidth() + "px");
    };
    LockTableComponent.prototype.reconfigure = function (event) {
        this.headers = event;
        this.lockedHeaders = this.headers.filter(function (item) { return item.locked === true && item.present; });
        this.unlockedHeaders = this.headers.filter(function (item) { return item.locked !== true && item.present; });
        this.onconfigurationchange.emit(event);
        if (this.persistenceKey) {
            this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
        }
        setTimeout(this.evaluatePositioning.bind(this), 111);
    };
    LockTableComponent.prototype.onlock = function (event) {
        this.lockedHeaders = this.headers.filter(function (item) { return item.locked === true && item.present; });
        this.unlockedHeaders = this.headers.filter(function (item) { return item.locked !== true && item.present; });
        this.onconfigurationchange.emit(event);
        if (this.persistenceKey) {
            this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
        }
        setTimeout(this.evaluatePositioning.bind(this), 111);
    };
    LockTableComponent.prototype.changeLockedTableFilteredItems = function (event) {
        if (this.lockedTable) {
            this.lockedTable.filteredItems = event;
        }
    };
    LockTableComponent.prototype.changeUnlockedTableFilteredItems = function (event) {
        if (this.unlockedTable) {
            this.unlockedTable.filteredItems = event;
        }
    };
    LockTableComponent.prototype.tableAction = function (event) {
        this.onaction.emit(event);
    };
    LockTableComponent.prototype.onDrop = function (event) {
    };
    return LockTableComponent;
}());
LockTableComponent.decorators = [
    { type: Component, args: [{
                selector: 'lock-table',
                template: "<div class=\"caption\">\n\t<table-configuration\n\t\t*ngIf=\"configurable\"\n\t\t[headers]=\"headers\"\n\t\t[title]=\"vocabulary.configureColumns\"\n\t\t[action]=\"vocabulary.configureTable\"\n\t\t(onchange)=\"reconfigure($event)\"></table-configuration>\n\t<div *ngIf=\"caption\" [textContent]=\"caption\"></div>\n</div>\n<div class=\"smart-table-wrap\" (scroll)=\"scroll($event)\">\n\t<table-view #lockedTable\n\t\tclass=\"locked-table\"\n\t\tlockable=\"true\"\n\t\t[headers]=\"lockedHeaders\"\n\t\t[items]=\"filteredItems\"\n        [pageInfo]=\"pageInfo\"\n        [vocabulary]=\"vocabulary\"\n\t\t[enableIndexing]=\"enableIndexing\"\n\t\t[enableFiltering]=\"enableFiltering\"\n        [rowDetailer]=\"rowDetailer\"\n\t\t[actionable]=\"actionable\"\n\t\t(onchange)=\"onlock($event)\"\n\t\t(onDrop)=\"onDrop($event)\"\n\t\t(onfilter)=\"changeUnlockedTableFilteredItems($event)\"\n\t\t(onaction)=\"tableAction($event)\"></table-view>\n    <table-view #unlockedTable\n\t\tclass=\"unlocked-table\"\n\t\tlockable=\"true\"\n\t\t[headers]=\"unlockedHeaders\"\n\t\t[items]=\"filteredItems\"\n        [pageInfo]=\"pageInfo\"\n        [vocabulary]=\"vocabulary\"\n\t\t[enableFiltering]=\"enableFiltering\"\n        [rowDetailer]=\"rowDetailer\"\n        [actionable]=\"actionable\"\n\t\t(onDrop)=\"onDrop($event)\"\n\t\t(onchange)=\"onlock($event)\"\n\t\t(onfilter)=\"changeLockedTableFilteredItems($event)\"\n\t\t(onaction)=\"tableAction($event)\"></table-view>\n</div>\n<table-pagination [info]=\"pageInfo\" [vocabulary]=\"vocabulary\" #pager></table-pagination>\n",
                styles: [":host{width:100%;position:relative;margin:0 auto;display:table}:host .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host .caption{background-color:#c3e5e2;border-radius:2px;-webkit-box-sizing:border-box;box-sizing:border-box;color:#1b1b1b;caption-side:top;font-size:14px;margin-bottom:15px;padding:5px 6px;text-align:left;width:100%}:host .caption table-configuration{display:inline-block;float:right;position:unset}:host .smart-table-wrap{border-spacing:0;border-collapse:collapse;border-right:1px solid #aaa;border-bottom:1px solid #aaa;-webkit-box-sizing:border-box;box-sizing:border-box;width:100%;position:relative;overflow-x:auto}:host .smart-table-wrap .unlocked-table ::ng-deep table{max-width:100%;margin-bottom:0;margin-top:0}:host .smart-table-wrap .unlocked-table ::ng-deep table th .locker{cursor:pointer;color:#00925b;text-align:center}:host .smart-table-wrap .unlocked-table ::ng-deep table td,:host .smart-table-wrap .unlocked-table ::ng-deep table th{white-space:nowrap;min-height:23px!important}:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr{background-color:#fff}:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr.hover,:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr:hover{background-color:#ffeed2}:host .smart-table-wrap .unlocked-table ::ng-deep table img{height:14px}:host .smart-table-wrap .locked-table{position:absolute;margin:0 auto;display:inline-table;border-spacing:0;border-collapse:collapse;float:left;z-index:2;width:auto}:host .smart-table-wrap .locked-table ::ng-deep table{display:inline-block;border-right:1px solid #aaa;margin:0;width:auto}:host .smart-table-wrap .locked-table ::ng-deep table th .locker{cursor:pointer;color:#8b0224;text-align:center}:host .smart-table-wrap .locked-table ::ng-deep table td,:host .smart-table-wrap .locked-table ::ng-deep table th{white-space:nowrap;min-height:23px!important}:host .smart-table-wrap .locked-table ::ng-deep table tbody tr{background-color:#fff}:host .smart-table-wrap .locked-table ::ng-deep table tbody tr.hover,:host .smart-table-wrap .locked-table ::ng-deep table tbody tr:hover{background-color:#ffeed2}:host .smart-table-wrap .locked-table ::ng-deep table img{height:14px}@media screen and (max-width:600px){.smart-table-wrap{border:0!important;position:unset;overflow-x:unset}.smart-table-wrap .unlocked-table{margin-left:0!important}.smart-table-wrap .unlocked-table ::ng-deep table td,.smart-table-wrap .unlocked-table ::ng-deep table th{white-space:unset}.smart-table-wrap .unlocked-table ::ng-deep table img{height:30px}.smart-table-wrap .locked-table{position:unset!important;margin:0!important;display:table;left:0!important}.smart-table-wrap .locked-table ::ng-deep table{display:table!important;margin:0!important;width:100%!important}.smart-table-wrap .locked-table ::ng-deep table td,.smart-table-wrap .locked-table ::ng-deep table th{white-space:unset}.smart-table-wrap .locked-table ::ng-deep table img{height:30px}}"]
            },] },
];
LockTableComponent.ctorParameters = function () { return [
    { type: TableHeadersGenerator, },
    { type: Renderer, },
]; };
LockTableComponent.propDecorators = {
    "vocabulary": [{ type: Input, args: ["vocabulary",] },],
    "persistenceId": [{ type: Input, args: ["persistenceId",] },],
    "persistenceKey": [{ type: Input, args: ["persistenceKey",] },],
    "caption": [{ type: Input, args: ["caption",] },],
    "action": [{ type: Input, args: ["action",] },],
    "actionKeys": [{ type: Input, args: ["actionKeys",] },],
    "tableClass": [{ type: Input, args: ["tableClass",] },],
    "headers": [{ type: Input, args: ["headers",] },],
    "items": [{ type: Input, args: ["items",] },],
    "pageInfo": [{ type: Input, args: ["pageInfo",] },],
    "tableInfo": [{ type: Input, args: ["tableInfo",] },],
    "configurable": [{ type: Input, args: ["configurable",] },],
    "enableFiltering": [{ type: Input, args: ["enableFiltering",] },],
    "enableIndexing": [{ type: Input, args: ["enableIndexing",] },],
    "onaction": [{ type: Output, args: ['onaction',] },],
    "onconfigurationchange": [{ type: Output, args: ['onconfigurationchange',] },],
    "lockedTable": [{ type: ViewChild, args: ['lockedTable',] },],
    "unlockedTable": [{ type: ViewChild, args: ['unlockedTable',] },],
};
var FlexibleTableModule = /** @class */ (function () {
    function FlexibleTableModule() {
    }
    return FlexibleTableModule;
}());
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
            },] },
];
FlexibleTableModule.ctorParameters = function () { return []; };

export { FlexibleTableComponent, FlexibleTableModule, ConfigurationComponent as ɵc, PaginationComponent as ɵd, TableHeadersGenerator as ɵa, TableViewComponent as ɵe, LockTableComponent as ɵb };
//# sourceMappingURL=flexible-table.js.map
