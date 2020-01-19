import { __decorate } from 'tslib';
import { Injectable, EventEmitter, Input, Output, ViewChild, Component, ElementRef, HostListener, Directive, NgModule, CUSTOM_ELEMENTS_SCHEMA, Renderer } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntoPipeModule } from '@sedeh/into-pipes';

/*
 * This object will traverse through a given json object and finds all the attributes of
 * the object and its related associations within the json. The resulting structure would be
 * name of attributes and a pathway to reach the attribute deep in object heirarchy.
 */
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
    TableHeadersGenerator = __decorate([
        Injectable()
    ], TableHeadersGenerator);
    return TableHeadersGenerator;
}());

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
        this.headerSeparation = true;
        this.tableClass = 'default-flexible-table';
        this.inlinePagination = false;
        this.onaction = new EventEmitter();
        this.onCellContentEdit = new EventEmitter();
        this.onfilter = new EventEmitter();
        this.onconfigurationchange = new EventEmitter();
    }
    FlexibleTableComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (changes.items) {
            var list_1 = [];
            this.items.map(function (item) {
                var copy = Object.assign({}, item);
                _this.headers.map(function (header) {
                    if (header.format) {
                        var v = copy[header.key];
                        if (v && typeof v === 'string') {
                            var format = header.format.split(':');
                            if (format[0] === 'calendar') {
                                copy[header.key] = Date.parse(v);
                            }
                            else if (format[0] === 'date') {
                                copy[header.key] = Date.parse(v);
                            }
                            else if (format[0] === 'number') {
                                copy[header.key] = format.length > 2 ? parseFloat(v) : parseInt(v, 10);
                            }
                            else if (format[0] === 'currency') {
                                copy[header.key] = parseFloat(v.replace(/[^0-9\.-]+/g, ""));
                            }
                        }
                    }
                });
                list_1.push(copy);
            });
            this.formeditems = list_1;
        }
    };
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
        this.viewTable.evaluateRows();
    };
    FlexibleTableComponent.prototype.tableAction = function (event) {
        this.onaction.emit(event);
    };
    FlexibleTableComponent.prototype.onDrop = function (event) {
    };
    FlexibleTableComponent.prototype.onCellEdit = function (event) {
        this.onCellContentEdit.emit(event);
    };
    FlexibleTableComponent.prototype.onTableFilter = function (event) {
        this.onfilter.emit(event);
    };
    FlexibleTableComponent.ctorParameters = function () { return [
        { type: TableHeadersGenerator }
    ]; };
    __decorate([
        Input("vocabulary")
    ], FlexibleTableComponent.prototype, "vocabulary", void 0);
    __decorate([
        Input()
    ], FlexibleTableComponent.prototype, "headerSeparation", void 0);
    __decorate([
        Input()
    ], FlexibleTableComponent.prototype, "persistenceId", void 0);
    __decorate([
        Input()
    ], FlexibleTableComponent.prototype, "persistenceKey", void 0);
    __decorate([
        Input()
    ], FlexibleTableComponent.prototype, "caption", void 0);
    __decorate([
        Input()
    ], FlexibleTableComponent.prototype, "action", void 0);
    __decorate([
        Input()
    ], FlexibleTableComponent.prototype, "actionKeys", void 0);
    __decorate([
        Input()
    ], FlexibleTableComponent.prototype, "tableClass", void 0);
    __decorate([
        Input()
    ], FlexibleTableComponent.prototype, "inlinePagination", void 0);
    __decorate([
        Input()
    ], FlexibleTableComponent.prototype, "headers", void 0);
    __decorate([
        Input()
    ], FlexibleTableComponent.prototype, "items", void 0);
    __decorate([
        Input()
    ], FlexibleTableComponent.prototype, "pageInfo", void 0);
    __decorate([
        Input()
    ], FlexibleTableComponent.prototype, "tableInfo", void 0);
    __decorate([
        Input()
    ], FlexibleTableComponent.prototype, "configurable", void 0);
    __decorate([
        Input()
    ], FlexibleTableComponent.prototype, "configAddon", void 0);
    __decorate([
        Input()
    ], FlexibleTableComponent.prototype, "enableIndexing", void 0);
    __decorate([
        Input()
    ], FlexibleTableComponent.prototype, "enableFiltering", void 0);
    __decorate([
        Input()
    ], FlexibleTableComponent.prototype, "rowDetailer", void 0);
    __decorate([
        Input()
    ], FlexibleTableComponent.prototype, "expandable", void 0);
    __decorate([
        Input()
    ], FlexibleTableComponent.prototype, "expandIf", void 0);
    __decorate([
        Input()
    ], FlexibleTableComponent.prototype, "filterwhiletyping", void 0);
    __decorate([
        Input()
    ], FlexibleTableComponent.prototype, "rowDetailerHeaders", void 0);
    __decorate([
        Output()
    ], FlexibleTableComponent.prototype, "onaction", void 0);
    __decorate([
        Output()
    ], FlexibleTableComponent.prototype, "onCellContentEdit", void 0);
    __decorate([
        Output()
    ], FlexibleTableComponent.prototype, "onfilter", void 0);
    __decorate([
        Output()
    ], FlexibleTableComponent.prototype, "onconfigurationchange", void 0);
    __decorate([
        ViewChild('viewTable', { static: false })
    ], FlexibleTableComponent.prototype, "viewTable", void 0);
    FlexibleTableComponent = __decorate([
        Component({
            selector: 'flexible-table',
            template: "\r\n<div class=\"flexible-table\">\r\n    <table-configuration\r\n        *ngIf=\"configurable && items && items.length\"\r\n        class=\"table-configuration\" \r\n        [headers]=\"headers\" \r\n        [title]=\"vocabulary.configureColumns\" \r\n        [printTable]=\"vocabulary.printTable\"\r\n        [action]=\"vocabulary.configureTable\"\r\n        [configAddon]=\"configAddon\"\r\n        (onprint)=\"viewTable.print()\"\r\n        (onchange)=\"reconfigure($event)\"></table-configuration>\r\n        \r\n    <table-view #viewTable\r\n        [action]=\"action\"\r\n        [actionKeys]=\"actionKeys\"\r\n\t\t[tableClass]=\"tableClass\"\r\n\t\t[tableInfo]=\"tableInfo\"\r\n\t\t[caption]=\"caption\" \r\n\t\t[headers]=\"subHeaders\" \r\n        [items]=\"formeditems\" \r\n        [filterwhiletyping]=\"filterwhiletyping\"\r\n\t\t[headerSeparation]=\"headerSeparation\"\r\n        [pageInfo]=\"pageInfo\"\r\n        [vocabulary]=\"vocabulary\"\r\n\t\t[enableIndexing]=\"enableIndexing\"\r\n\t\t[enableFiltering]=\"enableFiltering\"\r\n        [rowDetailer]=\"rowDetailer\"\r\n        [rowDetailerHeaders]=\"rowDetailerHeaders\"\r\n        [expandable]=\"expandable\"\r\n        [expandIf]=\"expandIf\"\r\n        (onDrop)=\"onDrop($event)\"\r\n        (onfilter)=\"onTableFilter($event)\"\r\n\t\t(onCellContentEdit)=\"onCellEdit($event)\"\r\n        (onchange)=\"reconfigure($event)\"\r\n\t\t(onaction)=\"tableAction($event)\"></table-view>\r\n</div>\r\n<table-pagination \r\n    [info]=\"pageInfo\" \r\n    [inline]=\"inlinePagination\" \r\n    [vocabulary]=\"vocabulary\"\r\n    (onchange)=\"onPaginationChange($event)\"></table-pagination>\r\n",
            styles: [":host{display:inline-block!important;width:100%}.flexible-table{position:relative;margin:0 auto;display:table;border-spacing:0;border-collapse:collapse}.flexible-table .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table{margin:1rem auto;padding:0;width:100%;table-layout:fixed;max-width:99%;background-color:transparent;border-collapse:collapse}.flexible-table table caption{background-color:#c3e5e2;border-radius:2px;color:#1b1b1b;caption-side:top;font-size:14px;padding:5px 6px;margin-bottom:15px;text-align:left}.flexible-table table thead{border-top:1px solid #bbb;border-bottom:1px solid #bbb;background-color:#eee}.flexible-table table tr{border:0}.flexible-table table tr.expanded td{font-weight:700;border-bottom:0}.flexible-table table td{padding-left:3px}.flexible-table table td:first-child{padding-left:5px}.flexible-table table td .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table td.index{background-color:#eee;border-right:1px solid #bbb}.flexible-table table th{cursor:default;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none;height:24px;position:relative;white-space:nowrap;font-weight:400;text-transform:uppercase;font-size:14px;padding-top:6px;padding-bottom:6px;text-align:left}.flexible-table table th.drag-over{background-color:#9b9b9b}.flexible-table table th.drag-over .icon,.flexible-table table th.drag-over .title{color:#eee}.flexible-table table th:first-child{padding-left:5px}.flexible-table table th.ascending,.flexible-table table th.descending,.flexible-table table th.sortable{cursor:pointer;height:12px}.flexible-table table th.indexable{width:33px}.flexible-table table th.actionable{width:24px}.flexible-table table th .title{color:#254a4d;display:inline-block;height:20px;white-space:nowrap}.flexible-table table th .dragable{cursor:move}.flexible-table table th .icon{width:22px;display:inline-block;height:20px;color:#254a4d}.flexible-table .fa.fa-angle-right{font-size:18px}.flexible-table table tr.detail td{border-top:0;cursor:default}.flexible-table table tr.expanded td a.expanded{background-position:right 2px}.flexible-table table tbody tr:hover{background-color:#ffeed2}.flexible-table table tbody tr.detail:hover,.flexible-table table tbody tr.detail:hover td table thead tr{background-color:inherit}.flexible-table table tr td a.actionable{display:inline-table;height:32px;vertical-align:middle;width:25px;line-height:30px;color:#254a4d}.flexible-table table tbody tr.detail:hover td:last-child{border-right:0}.flexible-table table tbody tr.detail:hover td:first-child{border-left:0}.flexible-table table tr td{border-bottom:1px solid #b1b3b3;color:#254a5d;font-size:15px;text-transform:capitalize}.flexible-table table tbody tr.pointer{cursor:pointer}.flexible-table table.alert-danger{border:0}.flexible-table table.alert-danger caption{background-color:transparent;font-weight:700;margin-bottom:0}.flexible-table table.alert-danger td{border-bottom:0;display:block}.flexible-table table.alert-danger td:first-child{padding-left:0}.flexible-table table.alert-danger td:last-child{border-bottom:0}.flexible-table table.alert-danger td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase;width:20%}.flexible-table table.alert-danger td a span.icon{width:100%}.flexible-table table.alert-danger thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table.alert-danger tr{border:2px solid #fff;display:block;margin-bottom:.625em;padding:5px;border-radius:5px}.flexible-table table.alert-danger tr th.actionable{width:inherit}.flexible-table table.alert-danger tr td{border-bottom:0}@media screen and (max-width:600px){.flexible-table table{border:0}.flexible-table table td{border-bottom:0;display:block;text-align:right}.flexible-table table td:first-child{padding-left:0}.flexible-table table td:last-child{border-bottom:0}.flexible-table table td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase}.flexible-table table td a span.icon{width:100%}.flexible-table table thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table tr{border-bottom:3px solid #ddd;display:block;margin-bottom:.625em}.flexible-table table tr th.actionable{width:inherit}.flexible-table table tr td{border-bottom:0}.flexible-table table.alert-danger td:before{width:inherit}}"]
        })
    ], FlexibleTableComponent);
    return FlexibleTableComponent;
}());

var DataTransfer = /** @class */ (function () {
    function DataTransfer() {
        this.data = {};
    }
    DataTransfer.prototype.setData = function (name, value) {
        this.data[name] = value;
    };
    DataTransfer.prototype.getData = function (name) {
        return this.data[name];
    };
    DataTransfer = __decorate([
        Injectable()
    ], DataTransfer);
    return DataTransfer;
}());

var DragDirective = /** @class */ (function () {
    function DragDirective(dataTransfer, el) {
        this.dataTransfer = dataTransfer;
        this.el = el;
        this.dragEffect = "move";
        this.dragEnabled = function (event) { return true; };
        this.onDragStart = new EventEmitter();
        this.onDragEnd = new EventEmitter();
        this.onDrag = new EventEmitter();
    }
    DragDirective.prototype.dragStart = function (event) {
        event.stopPropagation();
        var rect = this.el.nativeElement.getBoundingClientRect();
        var dragEvent = {
            medium: this.medium,
            node: this.el.nativeElement,
            clientX: event.clientX,
            clientY: event.clientY,
            offset: {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            }
        };
        if (this.dragEnabled(dragEvent)) {
            event.dataTransfer.effectAllowed = this.dragEffect;
            if (!this.isIE()) {
                event.dataTransfer.setData("makeItTick", "true"); // this is needed just to make drag/drop event trigger.
            }
            this.dataTransfer.setData("source", dragEvent);
            this.onDragStart.emit(dragEvent);
        }
    };
    DragDirective.prototype.isIE = function () {
        var match = navigator.userAgent.search(/(?:Edge|MSIE|Trident\/.*; rv:)/);
        var isIE = false;
        if (match !== -1) {
            isIE = true;
        }
        return isIE;
    };
    DragDirective.prototype.drag = function (event) {
        var dragEvent = this.dataTransfer.getData("source");
        dragEvent.clientX = event.clientX;
        dragEvent.clientY = event.clientY;
        if (this.dragEnabled(dragEvent)) {
            this.onDrag.emit(dragEvent);
        }
    };
    DragDirective.prototype.dragEnd = function (event) {
        event.stopPropagation();
        var dragEvent = this.dataTransfer.getData("source");
        this.onDragEnd.emit(dragEvent);
        this.el.nativeElement.classList.remove("drag-over");
    };
    DragDirective.ctorParameters = function () { return [
        { type: DataTransfer },
        { type: ElementRef }
    ]; };
    __decorate([
        Input("medium")
    ], DragDirective.prototype, "medium", void 0);
    __decorate([
        Input("dragEffect")
    ], DragDirective.prototype, "dragEffect", void 0);
    __decorate([
        Input("dragEnabled")
    ], DragDirective.prototype, "dragEnabled", void 0);
    __decorate([
        Output()
    ], DragDirective.prototype, "onDragStart", void 0);
    __decorate([
        Output()
    ], DragDirective.prototype, "onDragEnd", void 0);
    __decorate([
        Output()
    ], DragDirective.prototype, "onDrag", void 0);
    __decorate([
        HostListener('dragstart', ['$event'])
    ], DragDirective.prototype, "dragStart", null);
    __decorate([
        HostListener('dragover', ['$event'])
    ], DragDirective.prototype, "drag", null);
    __decorate([
        HostListener('dragend', ['$event'])
    ], DragDirective.prototype, "dragEnd", null);
    DragDirective = __decorate([
        Directive({
            selector: '[dragEnabled]',
            host: {
                '[draggable]': 'true'
            }
        })
    ], DragDirective);
    return DragDirective;
}());

var DragInDocumentDirective = /** @class */ (function () {
    function DragInDocumentDirective(dataTransfer, el) {
        this.dataTransfer = dataTransfer;
        this.el = el;
        this.dragEffect = "move";
        this.dragInDocument = function (event) { return true; };
        this.onDragStart = new EventEmitter();
        this.onDragEnd = new EventEmitter();
        this.onDrag = new EventEmitter();
    }
    DragInDocumentDirective.prototype.dragStart = function (event) {
        event.stopPropagation();
        var rect = this.el.nativeElement.getBoundingClientRect();
        var dragEvent = {
            medium: this.medium,
            node: this.el.nativeElement,
            clientX: event.clientX,
            clientY: event.clientY,
            offset: {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            }
        };
        if (this.dragInDocument(dragEvent)) {
            event.dataTransfer.effectAllowed = this.dragEffect;
            if (!this.isIE()) {
                event.dataTransfer.setData("makeItTick", "true"); // this is needed just to make drag/drop event trigger.
            }
            this.dataTransfer.setData("source", dragEvent);
            this.onDragStart.emit(dragEvent);
        }
    };
    DragInDocumentDirective.prototype.isIE = function () {
        var match = navigator.userAgent.search(/(?:Edge|MSIE|Trident\/.*; rv:)/);
        var isIE = false;
        if (match !== -1) {
            isIE = true;
        }
        return isIE;
    };
    DragInDocumentDirective.prototype.drag = function (event) {
        var dragEvent = this.dataTransfer.getData("source");
        dragEvent.clientX = event.clientX;
        dragEvent.clientY = event.clientY;
        if (this.dragInDocument(dragEvent)) {
            this.onDrag.emit(dragEvent);
        }
    };
    DragInDocumentDirective.prototype.dragEnd = function (event) {
        event.stopPropagation();
        var dragEvent = this.dataTransfer.getData("source");
        this.onDragEnd.emit(dragEvent);
        this.el.nativeElement.classList.remove("drag-over");
    };
    DragInDocumentDirective.ctorParameters = function () { return [
        { type: DataTransfer },
        { type: ElementRef }
    ]; };
    __decorate([
        Input("medium")
    ], DragInDocumentDirective.prototype, "medium", void 0);
    __decorate([
        Input("dragEffect")
    ], DragInDocumentDirective.prototype, "dragEffect", void 0);
    __decorate([
        Input("dragInDocument")
    ], DragInDocumentDirective.prototype, "dragInDocument", void 0);
    __decorate([
        Output()
    ], DragInDocumentDirective.prototype, "onDragStart", void 0);
    __decorate([
        Output()
    ], DragInDocumentDirective.prototype, "onDragEnd", void 0);
    __decorate([
        Output()
    ], DragInDocumentDirective.prototype, "onDrag", void 0);
    __decorate([
        HostListener('dragstart', ['$event'])
    ], DragInDocumentDirective.prototype, "dragStart", null);
    __decorate([
        HostListener('document:dragover', ['$event'])
    ], DragInDocumentDirective.prototype, "drag", null);
    __decorate([
        HostListener('document:dragend', ['$event'])
    ], DragInDocumentDirective.prototype, "dragEnd", null);
    DragInDocumentDirective = __decorate([
        Directive({
            selector: '[dragInDocument]',
            host: {
                '[draggable]': 'true'
            }
        })
    ], DragInDocumentDirective);
    return DragInDocumentDirective;
}());

var DropDirective = /** @class */ (function () {
    function DropDirective(dataTransfer, el) {
        this.dataTransfer = dataTransfer;
        this.el = el;
        this.dropEffect = "move";
        this.dropEnabled = function (event) { return true; };
        this.onDragEnter = new EventEmitter();
        this.onDragLeave = new EventEmitter();
        this.onDrop = new EventEmitter();
        this.onDragOver = new EventEmitter();
    }
    DropDirective.prototype.createDropEvent = function (event) {
        return {
            source: this.dataTransfer.getData("source"),
            destination: {
                medium: this.medium,
                node: this.el.nativeElement,
                clientX: event.clientX,
                clientY: event.clientY
            }
        };
    };
    DropDirective.prototype.drop = function (event) {
        event.preventDefault();
        var dropEvent = this.createDropEvent(event);
        this.el.nativeElement.classList.remove("drag-over");
        if (this.dropEnabled(dropEvent)) {
            this.onDrop.emit(dropEvent);
        }
    };
    DropDirective.prototype.dragEnter = function (event) {
        event.preventDefault();
        var dropEvent = this.createDropEvent(event);
        if (this.dropEnabled(dropEvent)) {
            event.dataTransfer.dropEffect = this.dropEffect;
            this.el.nativeElement.classList.add("drag-over");
            this.onDragEnter.emit(dropEvent);
        }
        else {
            this.el.nativeElement.classList.remove("drag-over");
        }
    };
    DropDirective.prototype.dragLeave = function (event) {
        event.preventDefault();
        this.el.nativeElement.classList.remove("drag-over");
        this.onDragLeave.emit(event);
    };
    DropDirective.prototype.dragOver = function (event) {
        var dropEvent = this.createDropEvent(event);
        if (this.dropEnabled(dropEvent)) {
            event.preventDefault();
            this.el.nativeElement.classList.add("drag-over");
            this.onDragOver.emit(dropEvent);
        }
        else {
            this.el.nativeElement.classList.remove("drag-over");
        }
    };
    DropDirective.ctorParameters = function () { return [
        { type: DataTransfer },
        { type: ElementRef }
    ]; };
    __decorate([
        Input('medium')
    ], DropDirective.prototype, "medium", void 0);
    __decorate([
        Input()
    ], DropDirective.prototype, "dropEffect", void 0);
    __decorate([
        Input("dropEnabled")
    ], DropDirective.prototype, "dropEnabled", void 0);
    __decorate([
        Output()
    ], DropDirective.prototype, "onDragEnter", void 0);
    __decorate([
        Output()
    ], DropDirective.prototype, "onDragLeave", void 0);
    __decorate([
        Output()
    ], DropDirective.prototype, "onDrop", void 0);
    __decorate([
        Output()
    ], DropDirective.prototype, "onDragOver", void 0);
    __decorate([
        HostListener('drop', ['$event'])
    ], DropDirective.prototype, "drop", null);
    __decorate([
        HostListener('dragenter', ['$event'])
    ], DropDirective.prototype, "dragEnter", null);
    __decorate([
        HostListener('dragleave', ['$event'])
    ], DropDirective.prototype, "dragLeave", null);
    __decorate([
        HostListener('dragover', ['$event'])
    ], DropDirective.prototype, "dragOver", null);
    DropDirective = __decorate([
        Directive({
            selector: '[dropEnabled]'
        })
    ], DropDirective);
    return DropDirective;
}());

var DragDropModule = /** @class */ (function () {
    function DragDropModule() {
    }
    DragDropModule = __decorate([
        NgModule({
            imports: [
                CommonModule
            ],
            declarations: [
                DragDirective,
                DragInDocumentDirective,
                DropDirective
            ],
            exports: [
                DragDirective,
                DragInDocumentDirective,
                DropDirective
            ],
            entryComponents: [],
            providers: [
                DataTransfer
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
    ], DragDropModule);
    return DragDropModule;
}());

var PaginationComponent = /** @class */ (function () {
    function PaginationComponent() {
        this.vocabulary = { setSize: "", firstPage: "", nextPage: "", lastPage: "", previousPage: "" };
        this.info = { contentSize: 0, pageSize: 0, maxWidth: "0" };
        this.inline = false;
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
    __decorate([
        Input()
    ], PaginationComponent.prototype, "vocabulary", void 0);
    __decorate([
        Input()
    ], PaginationComponent.prototype, "info", void 0);
    __decorate([
        Input()
    ], PaginationComponent.prototype, "inline", void 0);
    __decorate([
        Output()
    ], PaginationComponent.prototype, "onchange", void 0);
    __decorate([
        Output()
    ], PaginationComponent.prototype, "onready", void 0);
    PaginationComponent = __decorate([
        Component({
            selector: 'table-pagination',
            template: "<div *ngIf=\"info && info.pages > 1\" \r\n    [style.width]=\"info.maxWidth\" \r\n    [class.inliner]=\"inline\"\r\n    [class.floater]=\"!inline\"\r\n    class=\"table-pagination\" #paginationWrapper>\r\n    <div class=\"fa fa-angle-left\"\r\n         (click)=\"selectPrev()\"\r\n         [class.disabled]=\"info.currentPage==1\">\r\n        <span class=\"prev\" [textContent]=\"vocabulary.previousPage\"></span>\r\n    </div>\r\n    <div class=\"fa fa-angle-double-left\"\r\n         (click)=\"selectFirst()\"\r\n         [class.disabled]=\"info.currentPage==1\">\r\n        <span class=\"first\" [textContent]=\"vocabulary.firstPage\"></span>\r\n    </div>\r\n    <div class=\"current\">\r\n        <input  #ranger [value]=\"info.currentPage\" (keydown.Enter)=\"changeCurrent(ranger)\" />\r\n        <span [textContent]=\"' / ' + info.pages\"></span>\r\n\t</div>\r\n    <div class=\"fa fa-angle-double-right\"\r\n         (click)=\"selectLast()\"\r\n         [class.disabled]=\"info.currentPage==info.pages\">\r\n        <span class=\"last\" [textContent]=\"vocabulary.lastPage\"></span>\r\n    </div>\r\n    <div class=\"fa fa-angle-right\"\r\n         (click)=\"selectNext()\"\r\n         [class.disabled]=\"info.currentPage==info.pages\">\r\n        <span class=\"next\" [textContent]=\"vocabulary.nextPage\"></span>\r\n    </div>\r\n    <div class=\"reset-size\" *ngIf=\"info.resetSize\">\r\n        <label for=\"pagination-set-size\">\r\n            <span class=\"off-screen\" [textContent]=\"vocabulary.setSize\"></span>\r\n            <input id=\"pagination-set-size\" [value]=\"info.pageSize\" (keydown.Enter)=\"changeSize(sizer)\" #sizer />\r\n        </label>\r\n    </div>\r\n</div>\r\n",
            styles: [".table-pagination{box-sizing:border-box;background-color:#fff;border:1px solid #254a5d;border-radius:2px;color:#254a5d;clear:both;display:flex;font-size:1em;height:38px;max-width:100%;margin:0 auto}.table-pagination.inliner{width:191px;float:right}.table-pagination.floater{position:fixed;left:40%;z-index:55;bottom:5px}.table-pagination .fa{padding:4px 8px;margin-top:5px}.table-pagination .first,.table-pagination .last,.table-pagination .next,.table-pagination .prev{background-repeat:no-repeat;cursor:pointer;width:auto;display:block;height:39px;text-indent:-99999px;box-sizing:border-box}.table-pagination .reset-size{padding:0;height:35px;border-radius:4px}.table-pagination .reset-size input{border:0;border-left:1px solid #4c5854;height:34px;text-align:center;width:30px;margin-right:2px;margin-left:8px}.table-pagination .current{padding:1px 5px}.table-pagination .current input{padding:0 3px;width:14px;height:35px;border:none;text-align:center}.table-pagination .disabled{opacity:.4}@media screen and (max-width:992px){.table-pagination{left:4px}}@media print{:host{display:none}}"]
        })
    ], PaginationComponent);
    return PaginationComponent;
}());

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
    __decorate([
        Input()
    ], ConfigurationComponent.prototype, "title", void 0);
    __decorate([
        Input()
    ], ConfigurationComponent.prototype, "action", void 0);
    __decorate([
        Input()
    ], ConfigurationComponent.prototype, "printTable", void 0);
    __decorate([
        Input()
    ], ConfigurationComponent.prototype, "headers", void 0);
    __decorate([
        Input()
    ], ConfigurationComponent.prototype, "configAddon", void 0);
    __decorate([
        Output()
    ], ConfigurationComponent.prototype, "onchange", void 0);
    __decorate([
        Output()
    ], ConfigurationComponent.prototype, "onprint", void 0);
    ConfigurationComponent = __decorate([
        Component({
            selector: 'table-configuration',
            template: "\r\n<div class=\"shim\"\r\n    [style.display]=\"showConfigurationView ? 'block':'none'\"\r\n    (click)=\"showConfigurationView = !showConfigurationView\"></div>\r\n\r\n<a  [attr.tabindex]=\"0\" *ngIf=\"printTable\"\r\n    class=\"print-table\"\r\n    (keyup)=\"keyup($event)\"\r\n    (click)=\"print($event)\">\r\n    <span class=\"icon fa fa-print\" aria-hidden=\"true\"></span>\r\n    <span class=\"off-screen\" [textContent]=\"print\"></span>\r\n</a>\r\n<a  [attr.tabindex]=\"0\"\r\n    class=\"configure-table\"\r\n    (keyup)=\"keyup($event)\"\r\n    (click)=\"showConfigurationView = !showConfigurationView\">\r\n    <span class=\"icon fa fa-gear\" aria-hidden=\"true\"></span>\r\n    <span class=\"off-screen\" [textContent]=\"action\"></span>\r\n</a>\r\n<ng-container *ngIf=\"configAddon\" [ngTemplateOutlet]=\"configAddon\"></ng-container>\r\n\r\n<ul role=\"list\" [style.display]=\"showConfigurationView ? 'block':'none'\">\r\n    <p [textContent]=\"title\"></p>\r\n    <li  *ngFor=\"let header of headers\" role=\"listitem\">\r\n        <label for=\"{{header.key ? header.key+'f':'f'}}\">\r\n            <input type=\"checkbox\" #filter\r\n                    [id]=\"header.key ? header.key+'f':'f'\"\r\n                    [checked]=\"header.filter !== undefined\"\r\n                    (keyup)=\"keyup($event)\"\r\n                    (click)=\"enableFilter(filter, header)\" />\r\n            <span>Filter</span>\r\n        </label>\r\n        <label for=\"{{header.key ? header.key+'c':'c'}}\">\r\n            <input type=\"checkbox\" #checkbox\r\n                    [id]=\"header.key ? header.key+'c':'c'\"\r\n                    [value]=\"header.key\"\r\n                    [checked]=\"header.present\"\r\n                    (keyup)=\"keyup($event)\"\r\n                    (click)=\"reconfigure(checkbox, header)\" />\r\n            <span>Show</span>\r\n        </label>\r\n        <span class=\"title\" [textContent]=\"header.value | uppercase\"></span>\r\n    </li>\r\n</ul>\r\n",
            styles: [":host{box-sizing:border-box;padding:2px;position:absolute;right:8px;top:18px;z-index:2}:host a{display:block;float:left;padding:0 0 0 10px;cursor:pointer;z-index:5}:host a .icon{color:#00925b}:host a .off-screen{display:block;text-indent:-9999px;width:0;height:0;overflow:hidden}:host .shim{background-color:rgba(255,255,255,.2);width:100vw;height:100vh;position:fixed;top:0;left:0;z-index:2}:host ul{background-color:#fff;border:1px solid #999;border-radius:4px;display:flex;list-style:none;max-height:200px;margin:0 2px;min-width:200px;overflow-y:auto;position:absolute;padding:0 0 8px;right:0;box-shadow:6px 8px 6px -6px #1b1b1b;z-index:6}:host ul p{margin:0;padding:1px 5px;background-color:#5f9ea0;color:#fff}:host ul li{white-space:nowrap;text-align:left;flex-direction:row;padding:1px 5px}:host ul li label input{flex:0 0 30%;margin-top:4px}:host ul li .title{flex:0 0 30%;font-weight:700}@media print{:host{display:none}}"]
        })
    ], ConfigurationComponent);
    return ConfigurationComponent;
}());

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
    __decorate([
        Input("vocabulary")
    ], TableViewComponent.prototype, "vocabulary", void 0);
    __decorate([
        Input()
    ], TableViewComponent.prototype, "headerSeparation", void 0);
    __decorate([
        Input()
    ], TableViewComponent.prototype, "lockable", void 0);
    __decorate([
        Input()
    ], TableViewComponent.prototype, "caption", void 0);
    __decorate([
        Input()
    ], TableViewComponent.prototype, "action", void 0);
    __decorate([
        Input()
    ], TableViewComponent.prototype, "pageInfo", void 0);
    __decorate([
        Input()
    ], TableViewComponent.prototype, "actionKeys", void 0);
    __decorate([
        Input()
    ], TableViewComponent.prototype, "tableClass", void 0);
    __decorate([
        Input()
    ], TableViewComponent.prototype, "headers", void 0);
    __decorate([
        Input()
    ], TableViewComponent.prototype, "items", void 0);
    __decorate([
        Input()
    ], TableViewComponent.prototype, "tableInfo", void 0);
    __decorate([
        Input()
    ], TableViewComponent.prototype, "enableIndexing", void 0);
    __decorate([
        Input()
    ], TableViewComponent.prototype, "enableFiltering", void 0);
    __decorate([
        Input()
    ], TableViewComponent.prototype, "rowDetailer", void 0);
    __decorate([
        Input()
    ], TableViewComponent.prototype, "expandable", void 0);
    __decorate([
        Input()
    ], TableViewComponent.prototype, "expandIf", void 0);
    __decorate([
        Input()
    ], TableViewComponent.prototype, "filterwhiletyping", void 0);
    __decorate([
        Input()
    ], TableViewComponent.prototype, "rowDetailerHeaders", void 0);
    __decorate([
        Output()
    ], TableViewComponent.prototype, "onaction", void 0);
    __decorate([
        Output()
    ], TableViewComponent.prototype, "onchange", void 0);
    __decorate([
        Output()
    ], TableViewComponent.prototype, "onfilter", void 0);
    __decorate([
        Output()
    ], TableViewComponent.prototype, "onCellContentEdit", void 0);
    __decorate([
        ViewChild('flexible', { static: false })
    ], TableViewComponent.prototype, "table", void 0);
    TableViewComponent = __decorate([
        Component({
            selector: 'table-view',
            template: "\r\n<table [class]=\"tableClass\"  #flexible>\r\n    <caption *ngIf=\"caption\" [textContent]=\"caption\"></caption>\r\n    <thead>\r\n        <tr>\r\n            <th scope=\"col\" *ngIf=\"enableIndexing && !printMode\" id=\"indexable\" class=\"indexable hide-on-print\"></th>\r\n            <th scope=\"col\" *ngFor=\"let header of headers; let hh = index\" #th\r\n                [dragEnabled]=\"dragEnabled.bind(this)\"\r\n                [dropEnabled]=\"dropEnabled.bind(this)\"\r\n                [medium]=\"header\"\r\n                (onDragStart)=\"onDragStart($event)\"\r\n                (onDragEnd)=\"onDragEnd($event)\"\r\n                (onDrop)=\"onDrop($event)\"\r\n                [id]=\"header.key\"\r\n                [attr.width]=\"header.width ? header.width : null\" \r\n                [style.min-width]=\"header.minwidth ? header.minwidth : ''\" \r\n                [attr.tabindex]=\"header.sortable ? 0 : -1\"\r\n                [class.hide-on-print]=\"header.hideOnPrint\"\r\n                [class.distict]=\"headerSeparation && hh < (headers.length -1)\"\r\n                (keydown)=\"keydown($event, th)\" (click)=\"sort(header, icon)\">\r\n                <span \r\n                    *ngIf=\"!printMode && header.sortable\" \r\n                    class=\"off-screen\"  \r\n                    [textContent]=\"vocabulary.clickSort\"></span>\r\n                <span class=\"locker icon fa\" #locker\r\n                    *ngIf=\"!printMode && lockable && (headers.length > 1 || header.locked)\"\r\n                    tabindex=\"0\"\r\n                    title=\"lock/unlock this column\"\r\n                    (keydown)=\"keydown($event, locker)\" (click)=\"lock(header, $event)\"\r\n                    [class.fa-lock]=\"header.locked\"\r\n                    [class.fa-unlock]=\"!header.locked\"></span>\r\n                <span class=\"title\"\r\n                    [class.lockable]=\"lockable\"\r\n                    [class.dragable]=\"header.dragable\"\r\n                    [textContent]=\"header.value\"></span>\r\n                <span class=\"icon fa\" [class.hidden]=\"printMode || !items || items.length === 0\" #icon\r\n                    [class.fa-sort]=\"header.sortable\"\r\n                    [class.fa-sort-asc]=\"header.assending\"\r\n                    [class.fa-sort-desc]=\"header.desending\"></span>\r\n            </th>\r\n            <th scope=\"col\" *ngIf=\"action && !printMode\" id=\"actionable\" class=\"actionable hide-on-print\"></th>\r\n        </tr>\r\n    </thead>\r\n    <tbody>\r\n        <tr *ngIf=\"!printMode && enableFiltering && items && items.length\" class=\"hide-on-print\">\r\n            <td scope=\"row\" *ngIf=\"enableIndexing && !printMode\" class=\"index filter hide-on-print\">\r\n                <input type=\"text\" disabled style=\"opacity:0\" />\r\n            </td>\r\n            <td scope=\"row\" \r\n                        *ngFor=\"let header of headers; let i=index\" \r\n                        [attr.data-label]=\"header.value\" \r\n                        [class.hide-on-print]=\"header.hideOnPrint\"\r\n                        class=\"filter\">\r\n                <span *ngIf=\"header.filter === undefined\">&nbsp;</span>\r\n                <input  *ngIf=\"header.filter !== undefined\"\r\n                        id=\"filter-{{i}}\"\r\n                        type=\"text\" \r\n                        (keyup)=\"changeFilter($event, header)\"\r\n                        [value]=\"header.filter ? header.filter : ''\" />\r\n                <label *ngIf=\"header.filter !== undefined\" for=\"filter-{{i}}\" ><span class=\"off-screen\" >Filter \"{{header.value}}\"</span><span class=\"fa fa-search\"></span></label>\r\n            </td>\r\n            <td scope=\"row\" *ngIf=\"action && !printMode\" class=\"hide-on-print\"></td>\r\n        </tr>\r\n       <ng-template ngFor let-item [ngForOf]=\"printMode ? items: filteredItems\" let-i=\"index\">\r\n            <tr (click)=\"actionClick($event, item)\"\r\n                (mouseover)=\"hover(item, true)\"\r\n                (mouseout)=\"hover(item, false)\"\r\n                [class.pointer]=\"action\"\r\n                [class.hover]=\"item.hover\"\r\n                [class.expanded]=\"item.expanded\"\r\n                [class.odd]=\"i%2\">\r\n                <td scope=\"row\" class=\"index hide-on-print\" *ngIf=\"enableIndexing && !printMode\">\r\n                    <span [textContent]=\"i + pageInfo.from + 1\"></span>\r\n                </td>\r\n                <td scope=\"row\" \r\n                    *ngFor=\"let header of headers\" \r\n                    [class]=\"toCssClass(header)\"\r\n                    [class.hide-on-print]=\"header.hideOnPrint\"\r\n                    [attr.data-label]=\"header.value\" \r\n                    [intoName]=\"header.value\"\r\n                    [intoId]=\"header.key + '-' + i\"\r\n                    [into]=\"header.format\"\r\n                    [intoData]=\"item\"\r\n                    [rawContent]=\"cellContent(item, header)\"\r\n                    [onComponentChange]=\"onTableCellEdit.bind(this)\"></td>\r\n                <td scope=\"row\" *ngIf=\"action && !printMode\" class=\"hide-on-print\">\r\n                    <a class=\"actionable\"\r\n                        *ngIf=\"expandable(item, true)\"\r\n                        tabindex=\"0\"\r\n                        role=\"button\"\r\n                        style=\"cursor:pointer\"\r\n                        [class.expanded]=\"item.expanded\" #clicker\r\n                        (keydown)=\"keydown($event, clicker)\" (click)=\"actionClick($event, item)\">\r\n                        <span\r\n                            class=\"icon fa\"\r\n                            [class.fa-angle-right]=\"!rowDetailer\"\r\n                            [class.fa-minus-square-o]=\"rowDetailer && item.expanded\"\r\n                            [class.fa-plus-square-o]=\"rowDetailer && !item.expanded\"\r\n                            aria-hidden=\"true\"></span>\r\n                        <span class=\"off-screen\" [textContent]=\"offScreenMessage(item)\"></span>\r\n                    </a>\r\n                </td>\r\n            </tr>\r\n            <tr *ngIf=\"rowDetailer && item.expanded\" class=\"detail\" [class.odd]=\"i%2\">\r\n                <td scope=\"row\" class=\"index\" *ngIf=\"enableIndexing && !printMode\"></td>\r\n                <td [attr.colspan]=\"columnsCount()\">\r\n                    <ng-container [ngTemplateOutlet]=\"rowDetailer\" [ngTemplateOutletContext]=\"rowDetailerContext(item)\"></ng-container>\r\n                </td>\r\n            </tr>\r\n        </ng-template>\r\n    </tbody>\r\n</table>\r\n",
            styles: [":host{display:inline-block!important;width:100%;position:relative;margin:0 auto;border-spacing:0;border-collapse:collapse}:host .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host table{margin:1rem auto;padding:0;width:100%;table-layout:fixed;max-width:99%;background-color:transparent;border-collapse:collapse}:host table caption{background-color:#c3e5e2;border-radius:2px;color:#1b1b1b;caption-side:top;font-size:14px;padding:5px 6px;margin-bottom:15px;text-align:left}:host table thead{border-top:1px solid #bbb;border-bottom:1px solid #bbb;background-color:#eee}:host table tr{border:0}:host table tr.expanded td{font-weight:700}:host table td{padding-left:3px;min-height:21px;overflow:hidden}:host table td span:first-child{min-height:21px;display:block}:host table td:first-child{padding-left:5px}:host table td ::ng-deep input-component .locked,:host table td ::ng-deep input-component input{width:99%}:host table td .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host table td.filter{padding:0;position:relative}:host table td.filter input{box-sizing:border-box;width:100%;margin:0}:host table td.filter .fa{position:absolute;top:4px;right:2px;color:#bad}:host table td ::ng-deep img{height:24px}:host table td.index{background-color:#eee;border-right:1px solid #bbb}:host table td.index span{padding:1px 0}:host table th{cursor:default;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none;height:24px;position:relative;white-space:nowrap;font-weight:400;text-transform:uppercase;font-size:14px;padding-top:6px;padding-bottom:6px;text-align:left;padding-left:5px}:host table th.drag-over{background-color:#9b9b9b}:host table th.drag-over .icon,:host table th.drag-over .title{color:#eee}:host table th:first-child{padding-left:5px}:host table th.distict{border-right:1px solid #ccc}:host table th.distict:last-child{border-right:0}:host table th.ascending,:host table th.descending,:host table th.sortable{cursor:pointer;min-height:12px}:host table th.indexable{width:33px}:host table th.actionable{width:24px}:host table th .hidden{display:none}:host table th .title{color:#254a4d;display:inline-block;height:20px;float:left;width:calc(90% - 22px)!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}:host table th .title.dragable{width:auto}:host table th .title.lockable{width:calc(90% - 46px)!important}:host table th .dragable{cursor:move}:host table th .icon{width:22px;display:inline-block;height:20px;color:#254a4d;float:right}:host table th .locker{float:left}:host .fa.fa-angle-right{font-size:18px}table tr.expanded td{border-bottom:0}table tr.detail td{border-top:0;cursor:default}table tr.expanded td a.expanded{background-position:right 2px}table tbody tr.hover,table tbody tr:hover{background-color:#ffeed2}table tbody tr.detail.hover,table tbody tr.detail.hover td table thead tr,table tbody tr.detail:hover,table tbody tr.detail:hover td table thead tr{background-color:inherit}table tr td a.actionable{color:#254a4d}table tr td a.actionable .icon{line-height:22px;text-align:right}table tbody tr.detail.hover td:last-child,table tbody tr.detail:hover td:last-child{border-right:0}table tbody tr.detail.hover td:first-child,table tbody tr.detail:hover td:first-child{border-left:0}table tr td{border-bottom:1px solid #b1b3b3;color:#254a5d;font-size:15px;text-transform:capitalize}table tbody tr.pointer{cursor:pointer}table.alert-danger{border:0}table.alert-danger caption{background-color:transparent;font-weight:700;margin-bottom:0}table.alert-danger td{border-bottom:0;display:block}table.alert-danger td:first-child{padding-left:0}table.alert-danger td:last-child{border-bottom:0}table.alert-danger td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase;width:40%;text-align:left;overflow:hidden;text-overflow:ellipsis}table.alert-danger td a span.icon{width:100%}table.alert-danger thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}table.alert-danger tr{border:2px solid #fff;display:block;margin-bottom:.625em;padding:5px;border-radius:5px}table.alert-danger tr th.actionable{width:inherit}table.alert-danger tr td{border-bottom:0}@media print{table td,table th{text-align:left}table td .icon,table th .icon{display:none!important}table td.hide-on-print,table th.hide-on-print,table tr.hide-on-print{display:none}}@media screen and (max-width:600px){table{border:0}table th.indexable{display:none}table td{border-bottom:0;display:block;text-align:right}table td.index{display:none}table td:first-child{padding-left:0}table td:last-child{border-bottom:0}table td.filter input{width:50%!important}table td.filter .fa{right:7px!important}table td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase}table td a span.icon{width:100%}table td ::ng-deep .into{float:right!important}table td ::ng-deep .into .calendar{margin-right:0}table td ::ng-deep .into .popper{margin-right:0}table thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}table tr{border-bottom:3px solid #ddd;display:block;margin-bottom:.625em}table tr th.actionable{width:inherit}table tr td{border-bottom:0}table.alert-danger td:before{width:inherit}}"]
        })
    ], TableViewComponent);
    return TableViewComponent;
}());

var LockTableComponent = /** @class */ (function () {
    function LockTableComponent(generator, renderer) {
        this.generator = generator;
        this.renderer = renderer;
        this.holdlocked = false;
        this.holdunlocked = false;
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
        this.headerSeparation = true;
        this.tableClass = 'default-flexible-table';
        this.inlinePagination = false;
        this.onaction = new EventEmitter();
        this.onCellContentEdit = new EventEmitter();
        this.onfilter = new EventEmitter();
        this.onconfigurationchange = new EventEmitter();
    }
    LockTableComponent.prototype.scroll = function (event) {
        this.renderer.setElementStyle(this.lockedTable.el.nativeElement, "left", event.target.scrollLeft + "px");
    };
    LockTableComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (changes.items) {
            var list_1 = [];
            this.items.map(function (item) {
                var copy = Object.assign({}, item);
                _this.headers.map(function (header) {
                    if (header.format) {
                        var v = copy[header.key];
                        if (v && typeof v === 'string') {
                            var format = header.format.split(':');
                            if (format[0] === 'calendar') {
                                copy[header.key] = Date.parse(v);
                            }
                            else if (format[0] === 'date') {
                                copy[header.key] = Date.parse(v);
                            }
                            else if (format[0] === 'number') {
                                copy[header.key] = format.length > 2 ? parseFloat(v) : parseInt(v, 10);
                            }
                            else if (format[0] === 'currency') {
                                copy[header.key] = parseFloat(v.replace(/[^0-9\.-]+/g, ""));
                            }
                        }
                    }
                });
                list_1.push(copy);
            });
            this.formeditems = list_1;
        }
    };
    LockTableComponent.prototype.ngOnInit = function () {
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
        this.filteredItems = this.formeditems ? this.formeditems : this.items;
        this.pageInfo.contentSize = this.items.length;
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
        if (this.lockedTable && !this.holdlocked) {
            this.lockedTable.filteredItems = event;
            this.lockedTable.initVisibleRows(null);
        }
        this.holdlocked = false;
    };
    LockTableComponent.prototype.changeUnlockedTableFilteredItems = function (event) {
        if (this.unlockedTable && !this.holdunlocked) {
            this.unlockedTable.filteredItems = event;
            this.unlockedTable.initVisibleRows(null);
        }
        this.holdunlocked = false;
    };
    LockTableComponent.prototype.onPaginationChange = function (event) {
        this.pageInfo = event;
        this.holdlocked = true;
        this.holdunlocked = true;
        this.lockedTable.evaluateRows();
        this.unlockedTable.evaluateRows();
    };
    LockTableComponent.prototype.tableAction = function (event) {
        this.onaction.emit(event);
    };
    LockTableComponent.prototype.onDrop = function (event) {
    };
    LockTableComponent.prototype.onCellEdit = function (event) {
        this.onCellContentEdit.emit(event);
    };
    LockTableComponent.prototype.onTableFilter = function (event) {
        this.onfilter.emit(event);
    };
    LockTableComponent.ctorParameters = function () { return [
        { type: TableHeadersGenerator },
        { type: Renderer }
    ]; };
    __decorate([
        Input("vocabulary")
    ], LockTableComponent.prototype, "vocabulary", void 0);
    __decorate([
        Input()
    ], LockTableComponent.prototype, "headerSeparation", void 0);
    __decorate([
        Input("persistenceId")
    ], LockTableComponent.prototype, "persistenceId", void 0);
    __decorate([
        Input("persistenceKey")
    ], LockTableComponent.prototype, "persistenceKey", void 0);
    __decorate([
        Input()
    ], LockTableComponent.prototype, "caption", void 0);
    __decorate([
        Input()
    ], LockTableComponent.prototype, "action", void 0);
    __decorate([
        Input()
    ], LockTableComponent.prototype, "actionKeys", void 0);
    __decorate([
        Input()
    ], LockTableComponent.prototype, "tableClass", void 0);
    __decorate([
        Input()
    ], LockTableComponent.prototype, "headers", void 0);
    __decorate([
        Input()
    ], LockTableComponent.prototype, "items", void 0);
    __decorate([
        Input()
    ], LockTableComponent.prototype, "inlinePagination", void 0);
    __decorate([
        Input()
    ], LockTableComponent.prototype, "pageInfo", void 0);
    __decorate([
        Input()
    ], LockTableComponent.prototype, "tableInfo", void 0);
    __decorate([
        Input()
    ], LockTableComponent.prototype, "configurable", void 0);
    __decorate([
        Input()
    ], LockTableComponent.prototype, "configAddon", void 0);
    __decorate([
        Input()
    ], LockTableComponent.prototype, "enableFiltering", void 0);
    __decorate([
        Input()
    ], LockTableComponent.prototype, "enableIndexing", void 0);
    __decorate([
        Input()
    ], LockTableComponent.prototype, "filterwhiletyping", void 0);
    __decorate([
        Output()
    ], LockTableComponent.prototype, "onaction", void 0);
    __decorate([
        Output()
    ], LockTableComponent.prototype, "onCellContentEdit", void 0);
    __decorate([
        Output()
    ], LockTableComponent.prototype, "onfilter", void 0);
    __decorate([
        Output()
    ], LockTableComponent.prototype, "onconfigurationchange", void 0);
    __decorate([
        ViewChild('lockedTable', { static: false })
    ], LockTableComponent.prototype, "lockedTable", void 0);
    __decorate([
        ViewChild('unlockedTable', { static: false })
    ], LockTableComponent.prototype, "unlockedTable", void 0);
    LockTableComponent = __decorate([
        Component({
            selector: 'lock-table',
            template: "<div class=\"caption\">\n\t<table-configuration\n\t\t*ngIf=\"configurable\" \n\t\t[headers]=\"headers\" \n\t\t[title]=\"vocabulary.configureColumns\" \n\t\t[action]=\"vocabulary.configureTable\"\n\t\t[configAddon]=\"configAddon\"\n\t\t(onchange)=\"reconfigure($event)\"></table-configuration>\n\n\t<div *ngIf=\"caption\" [textContent]=\"caption\"></div>\n</div>\n<div class=\"smart-table-wrap\" (scroll)=\"scroll($event)\">\n\t<table-view #lockedTable\n\t\tclass=\"locked-table\"\n\t\tlockable=\"true\"\n\t\t[headers]=\"lockedHeaders\" \n\t\t[items]=\"filteredItems\" \n        [pageInfo]=\"pageInfo\"\n        [vocabulary]=\"vocabulary\"\n        [filterwhiletyping]=\"filterwhiletyping\"\n\t\t[enableFiltering]=\"enableFiltering\"\n\t\t[enableIndexing]=\"enableIndexing\"\n\t\t[headerSeparation]=\"headerSeparation\"\n\n\t\t(onchange)=\"onlock($event)\"\n\t\t(onDrop)=\"onDrop($event)\"\n        (onfilter)=\"onTableFilter($event)\"\n\t\t(onCellContentEdit)=\"onCellEdit($event)\"\n\t\t(onfilter)=\"changeUnlockedTableFilteredItems($event)\"\n\t\t(onaction)=\"tableAction($event)\"></table-view>\n\n    <table-view #unlockedTable\n\t\tclass=\"unlocked-table\"\n\t\tlockable=\"true\"\n\t\t[headers]=\"unlockedHeaders\" \n\t\t[items]=\"filteredItems\" \n        [pageInfo]=\"pageInfo\"\n        [vocabulary]=\"vocabulary\"\n        [filterwhiletyping]=\"filterwhiletyping\"\n\t\t[enableFiltering]=\"enableFiltering\"\n\t\t[headerSeparation]=\"headerSeparation\"\n\n\t\t(onDrop)=\"onDrop($event)\"\n        (onfilter)=\"onTableFilter($event)\"\n\t\t(onchange)=\"onlock($event)\"\n\t\t(onCellContentEdit)=\"onCellEdit($event)\"\n\t\t(onfilter)=\"changeLockedTableFilteredItems($event)\"\n\t\t(onaction)=\"tableAction($event)\"></table-view>\n\t\n</div>\n<table-pagination #pager\n\t[info]=\"pageInfo\" \n    [inline]=\"inlinePagination\" \n\t[vocabulary]=\"vocabulary\" \n    (onchange)=\"onPaginationChange($event)\"></table-pagination>\n",
            styles: [":host{width:100%;position:relative;margin:0 auto;display:table}:host .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host .caption{background-color:#c3e5e2;border-radius:2px;box-sizing:border-box;color:#1b1b1b;caption-side:top;font-size:14px;margin-bottom:15px;padding:5px 6px;text-align:left;width:100%}:host .caption table-configuration{display:inline-block;float:right;position:unset}:host .smart-table-wrap{border-spacing:0;border-collapse:collapse;border-right:1px solid #aaa;border-bottom:1px solid #aaa;box-sizing:border-box;width:100%;position:relative;overflow-x:auto}:host .smart-table-wrap .unlocked-table ::ng-deep table{max-width:100%;margin-bottom:0;margin-top:0}:host .smart-table-wrap .unlocked-table ::ng-deep table th td{white-space:nowrap}:host .smart-table-wrap .unlocked-table ::ng-deep table th .locker{cursor:pointer;color:#00925b;text-align:center}:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr{background-color:#fff}:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr.hover,:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr:hover{background-color:#ffeed2}:host .smart-table-wrap .unlocked-table ::ng-deep table img{height:14px}:host .smart-table-wrap .locked-table{position:absolute;margin:0 auto;display:inline-table;border-spacing:0;border-collapse:collapse;float:left;z-index:2;width:auto}:host .smart-table-wrap .locked-table ::ng-deep table{display:inline-block;border-right:1px solid #aaa;margin:0;width:auto}:host .smart-table-wrap .locked-table ::ng-deep table th td{white-space:nowrap}:host .smart-table-wrap .locked-table ::ng-deep table th .locker{cursor:pointer;color:#8b0224;text-align:center}:host .smart-table-wrap .locked-table ::ng-deep table tbody tr{background-color:#fff}:host .smart-table-wrap .locked-table ::ng-deep table tbody tr.hover,:host .smart-table-wrap .locked-table ::ng-deep table tbody tr:hover{background-color:#ffeed2}:host .smart-table-wrap .locked-table ::ng-deep table img{height:14px}@media screen and (max-width:600px){.smart-table-wrap{border:0!important;position:unset;overflow-x:unset}.smart-table-wrap .unlocked-table{margin-left:0!important;position:unset!important}.smart-table-wrap .unlocked-table ::ng-deep table td,.smart-table-wrap .unlocked-table ::ng-deep table th{white-space:unset}.smart-table-wrap .unlocked-table ::ng-deep table img{height:30px}.smart-table-wrap .locked-table{position:unset!important;margin:0!important;display:table;left:0!important}.smart-table-wrap .locked-table ::ng-deep table{display:table!important;margin:0!important;width:100%!important}.smart-table-wrap .locked-table ::ng-deep table td,.smart-table-wrap .locked-table ::ng-deep table th{white-space:unset}.smart-table-wrap .locked-table ::ng-deep table td.index{border-right:0}.smart-table-wrap .locked-table ::ng-deep table img{height:30px}}"]
        })
    ], LockTableComponent);
    return LockTableComponent;
}());

var FlexibleTableModule = /** @class */ (function () {
    function FlexibleTableModule() {
    }
    FlexibleTableModule = __decorate([
        NgModule({
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
        })
    ], FlexibleTableModule);
    return FlexibleTableModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { FlexibleTableComponent, FlexibleTableModule, TableViewComponent as ɵa, TableHeadersGenerator as ɵb, DragDropModule as ɵc, DragDirective as ɵd, DataTransfer as ɵe, DragInDocumentDirective as ɵf, DropDirective as ɵg, LockTableComponent as ɵh, ConfigurationComponent as ɵi, PaginationComponent as ɵj };
//# sourceMappingURL=sedeh-flexible-table.js.map
