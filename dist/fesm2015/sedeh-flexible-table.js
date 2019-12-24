import { __decorate } from 'tslib';
import { Injectable, EventEmitter, Input, Output, ViewChild, Component, ElementRef, HostListener, Directive, NgModule, CUSTOM_ELEMENTS_SCHEMA, Renderer } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntoPipeModule } from '@sedeh/into-pipes';

/*
 * This object will traverse through a given json object and finds all the attributes of
 * the object and its related associations within the json. The resulting structure would be
 * name of attributes and a pathway to reach the attribute deep in object heirarchy.
 */
let TableHeadersGenerator = class TableHeadersGenerator {
    constructor() {
        this.headers = [];
    }
    generateHeadersFor(root, path, maxVisible, filteringEnabled) {
        if (root !== null) {
            Object.keys(root).map((key) => {
                const innerPath = (path.length ? (path + "." + key) : key);
                if (typeof root[key] === "string" || typeof root[key] === "number" || typeof root[key] === "boolean") {
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
    retreiveHeaders(key, trackingkey) {
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
    persistHeaders(key, trackingkey, headers) {
        try {
            localStorage.removeItem(trackingkey);
            localStorage.setItem(trackingkey, key);
            localStorage.setItem(key, JSON.stringify(headers));
        }
        catch (e) {
        }
    }
    makeWords(name) {
        return name
            .replace(/\./g, ' ~ ')
            .replace(/([A-Z])/g, ' $1')
            .replace(/-/g, " ")
            .replace(/_/g, " ")
            .replace(/^./, (str) => str.toUpperCase());
    }
};
TableHeadersGenerator = __decorate([
    Injectable()
], TableHeadersGenerator);

let FlexibleTableComponent = class FlexibleTableComponent {
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
        this.inlinePagination = false;
        this.onaction = new EventEmitter();
        this.onCellContentEdit = new EventEmitter();
        this.onfilter = new EventEmitter();
        this.onconfigurationchange = new EventEmitter();
    }
    ngOnChanges(changes) {
        if (changes.items) {
            const list = [];
            this.items.map((item) => {
                const copy = Object.assign({}, item);
                this.headers.map((header) => {
                    if (header.format) {
                        const v = copy[header.key];
                        if (v && typeof v === 'string') {
                            const format = header.format.split(':');
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
                list.push(copy);
            });
            this.formeditems = list;
        }
    }
    ngOnInit() {
        if (this.persistenceKey) {
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
    updateLimits() {
        this.subHeaders = this.headers.filter((header) => header.present === true);
    }
    reconfigure(event) {
        this.headers = event;
        this.updateLimits();
        this.onconfigurationchange.emit(event);
        if (this.persistenceKey) {
            this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
        }
    }
    onPaginationChange(event) {
        this.pageInfo = event;
        this.viewTable.evaluateRows();
    }
    tableAction(event) {
        this.onaction.emit(event);
    }
    onDrop(event) {
    }
    onCellEdit(event) {
        this.onCellContentEdit.emit(event);
    }
    onTableFilter(event) {
        this.onfilter.emit(event);
    }
};
FlexibleTableComponent.ctorParameters = () => [
    { type: TableHeadersGenerator }
];
__decorate([
    Input("vocabulary")
], FlexibleTableComponent.prototype, "vocabulary", void 0);
__decorate([
    Input("persistenceId")
], FlexibleTableComponent.prototype, "persistenceId", void 0);
__decorate([
    Input("persistenceKey")
], FlexibleTableComponent.prototype, "persistenceKey", void 0);
__decorate([
    Input("caption")
], FlexibleTableComponent.prototype, "caption", void 0);
__decorate([
    Input("action")
], FlexibleTableComponent.prototype, "action", void 0);
__decorate([
    Input("actionKeys")
], FlexibleTableComponent.prototype, "actionKeys", void 0);
__decorate([
    Input("tableClass")
], FlexibleTableComponent.prototype, "tableClass", void 0);
__decorate([
    Input('inlinePagination')
], FlexibleTableComponent.prototype, "inlinePagination", void 0);
__decorate([
    Input("headers")
], FlexibleTableComponent.prototype, "headers", void 0);
__decorate([
    Input("items")
], FlexibleTableComponent.prototype, "items", void 0);
__decorate([
    Input("pageInfo")
], FlexibleTableComponent.prototype, "pageInfo", void 0);
__decorate([
    Input("tableInfo")
], FlexibleTableComponent.prototype, "tableInfo", void 0);
__decorate([
    Input("configurable")
], FlexibleTableComponent.prototype, "configurable", void 0);
__decorate([
    Input("configAddon")
], FlexibleTableComponent.prototype, "configAddon", void 0);
__decorate([
    Input("enableIndexing")
], FlexibleTableComponent.prototype, "enableIndexing", void 0);
__decorate([
    Input("enableFiltering")
], FlexibleTableComponent.prototype, "enableFiltering", void 0);
__decorate([
    Input("rowDetailer")
], FlexibleTableComponent.prototype, "rowDetailer", void 0);
__decorate([
    Input("expandable")
], FlexibleTableComponent.prototype, "expandable", void 0);
__decorate([
    Input("expandIf")
], FlexibleTableComponent.prototype, "expandIf", void 0);
__decorate([
    Input("filterwhiletyping")
], FlexibleTableComponent.prototype, "filterwhiletyping", void 0);
__decorate([
    Input("rowDetailerHeaders")
], FlexibleTableComponent.prototype, "rowDetailerHeaders", void 0);
__decorate([
    Output('onaction')
], FlexibleTableComponent.prototype, "onaction", void 0);
__decorate([
    Output('onCellContentEdit')
], FlexibleTableComponent.prototype, "onCellContentEdit", void 0);
__decorate([
    Output('onfilter')
], FlexibleTableComponent.prototype, "onfilter", void 0);
__decorate([
    Output('onconfigurationchange')
], FlexibleTableComponent.prototype, "onconfigurationchange", void 0);
__decorate([
    ViewChild('viewTable', { static: false })
], FlexibleTableComponent.prototype, "viewTable", void 0);
FlexibleTableComponent = __decorate([
    Component({
        selector: 'flexible-table',
        template: "\r\n<div class=\"flexible-table\">\r\n    <table-configuration\r\n        *ngIf=\"configurable && items && items.length\"\r\n        class=\"table-configuration\" \r\n        [headers]=\"headers\" \r\n        [title]=\"vocabulary.configureColumns\" \r\n        [printTable]=\"vocabulary.printTable\"\r\n        [action]=\"vocabulary.configureTable\"\r\n        [configAddon]=\"configAddon\"\r\n        (onprint)=\"viewTable.print()\"\r\n        (onchange)=\"reconfigure($event)\"></table-configuration>\r\n        \r\n    <table-view #viewTable\r\n        [action]=\"action\"\r\n        [actionKeys]=\"actionKeys\"\r\n\t\t[tableClass]=\"tableClass\"\r\n\t\t[tableInfo]=\"tableInfo\"\r\n\t\t[caption]=\"caption\" \r\n\t\t[headers]=\"subHeaders\" \r\n        [items]=\"formeditems\" \r\n        [filterwhiletyping]=\"filterwhiletyping\"\r\n        [pageInfo]=\"pageInfo\"\r\n        [vocabulary]=\"vocabulary\"\r\n\t\t[enableIndexing]=\"enableIndexing\"\r\n\t\t[enableFiltering]=\"enableFiltering\"\r\n        [rowDetailer]=\"rowDetailer\"\r\n        [rowDetailerHeaders]=\"rowDetailerHeaders\"\r\n        [expandable]=\"expandable\"\r\n        [expandIf]=\"expandIf\"\r\n        (onDrop)=\"onDrop($event)\"\r\n        (onfilter)=\"onTableFilter($event)\"\r\n\t\t(onCellContentEdit)=\"onCellEdit($event)\"\r\n        (onchange)=\"reconfigure($event)\"\r\n\t\t(onaction)=\"tableAction($event)\"></table-view>\r\n</div>\r\n<table-pagination \r\n    [info]=\"pageInfo\" \r\n    [inline]=\"inlinePagination\" \r\n    [vocabulary]=\"vocabulary\"\r\n    (onchange)=\"onPaginationChange($event)\"></table-pagination>\r\n",
        styles: [":host{display:inline-block!important;width:100%}.flexible-table{position:relative;margin:0 auto;display:table;border-spacing:0;border-collapse:collapse}.flexible-table .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table{margin:1rem auto;padding:0;width:100%;table-layout:fixed;max-width:99%;background-color:transparent;border-collapse:collapse}.flexible-table table caption{background-color:#c3e5e2;border-radius:2px;color:#1b1b1b;caption-side:top;font-size:14px;padding:5px 6px;margin-bottom:15px;text-align:left}.flexible-table table thead{border-top:1px solid #bbb;border-bottom:1px solid #bbb;background-color:#eee}.flexible-table table tr{border:0}.flexible-table table tr.expanded td{font-weight:700;border-bottom:0}.flexible-table table td{padding-left:3px}.flexible-table table td:first-child{padding-left:5px}.flexible-table table td .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table td.index{background-color:#eee;border-right:1px solid #bbb}.flexible-table table th{cursor:default;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none;height:24px;position:relative;white-space:nowrap;font-weight:400;text-transform:uppercase;font-size:14px;padding-top:6px;padding-bottom:6px;text-align:left}.flexible-table table th.drag-over{background-color:#9b9b9b}.flexible-table table th.drag-over .icon,.flexible-table table th.drag-over .title{color:#eee}.flexible-table table th:first-child{padding-left:5px}.flexible-table table th.ascending,.flexible-table table th.descending,.flexible-table table th.sortable{cursor:pointer;height:12px}.flexible-table table th.indexable{width:33px}.flexible-table table th.actionable{width:24px}.flexible-table table th .title{color:#254a4d;display:inline-block;height:20px;white-space:nowrap}.flexible-table table th .dragable{cursor:move}.flexible-table table th .icon{width:22px;display:inline-block;height:20px;color:#254a4d}.flexible-table .fa.fa-angle-right{font-size:18px}.flexible-table table tr.detail td{border-top:0;cursor:default}.flexible-table table tr.expanded td a.expanded{background-position:right 2px}.flexible-table table tbody tr:hover{background-color:#ffeed2}.flexible-table table tbody tr.detail:hover,.flexible-table table tbody tr.detail:hover td table thead tr{background-color:inherit}.flexible-table table tr td a.actionable{display:inline-table;height:32px;vertical-align:middle;width:25px;line-height:30px;color:#254a4d}.flexible-table table tbody tr.detail:hover td:last-child{border-right:0}.flexible-table table tbody tr.detail:hover td:first-child{border-left:0}.flexible-table table tr td{border-bottom:1px solid #b1b3b3;color:#254a5d;font-size:15px;text-transform:capitalize}.flexible-table table tbody tr.pointer{cursor:pointer}.flexible-table table.alert-danger{border:0}.flexible-table table.alert-danger caption{background-color:transparent;font-weight:700;margin-bottom:0}.flexible-table table.alert-danger td{border-bottom:0;display:block}.flexible-table table.alert-danger td:first-child{padding-left:0}.flexible-table table.alert-danger td:last-child{border-bottom:0}.flexible-table table.alert-danger td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase;width:20%}.flexible-table table.alert-danger td a span.icon{width:100%}.flexible-table table.alert-danger thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table.alert-danger tr{border:2px solid #fff;display:block;margin-bottom:.625em;padding:5px;border-radius:5px}.flexible-table table.alert-danger tr th.actionable{width:inherit}.flexible-table table.alert-danger tr td{border-bottom:0}@media screen and (max-width:600px){.flexible-table table{border:0}.flexible-table table td{border-bottom:0;display:block;text-align:right}.flexible-table table td:first-child{padding-left:0}.flexible-table table td:last-child{border-bottom:0}.flexible-table table td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase}.flexible-table table td a span.icon{width:100%}.flexible-table table thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table tr{border-bottom:3px solid #ddd;display:block;margin-bottom:.625em}.flexible-table table tr th.actionable{width:inherit}.flexible-table table tr td{border-bottom:0}.flexible-table table.alert-danger td:before{width:inherit}}"]
    })
], FlexibleTableComponent);

let DataTransfer = class DataTransfer {
    constructor() {
        this.data = {};
    }
    setData(name, value) {
        this.data[name] = value;
    }
    getData(name) {
        return this.data[name];
    }
};
DataTransfer = __decorate([
    Injectable()
], DataTransfer);

let DragDirective = class DragDirective {
    constructor(dataTransfer, el) {
        this.dataTransfer = dataTransfer;
        this.el = el;
        this.dragEffect = "move";
        this.dragEnabled = (event) => true;
        this.onDragStart = new EventEmitter();
        this.onDragEnd = new EventEmitter();
        this.onDrag = new EventEmitter();
    }
    dragStart(event) {
        event.stopPropagation();
        const rect = this.el.nativeElement.getBoundingClientRect();
        const dragEvent = {
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
    }
    isIE() {
        const match = navigator.userAgent.search(/(?:Edge|MSIE|Trident\/.*; rv:)/);
        let isIE = false;
        if (match !== -1) {
            isIE = true;
        }
        return isIE;
    }
    drag(event) {
        const dragEvent = this.dataTransfer.getData("source");
        dragEvent.clientX = event.clientX;
        dragEvent.clientY = event.clientY;
        if (this.dragEnabled(dragEvent)) {
            this.onDrag.emit(dragEvent);
        }
    }
    dragEnd(event) {
        event.stopPropagation();
        const dragEvent = this.dataTransfer.getData("source");
        this.onDragEnd.emit(dragEvent);
        this.el.nativeElement.classList.remove("drag-over");
    }
};
DragDirective.ctorParameters = () => [
    { type: DataTransfer },
    { type: ElementRef }
];
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

let DragInDocumentDirective = class DragInDocumentDirective {
    constructor(dataTransfer, el) {
        this.dataTransfer = dataTransfer;
        this.el = el;
        this.dragEffect = "move";
        this.dragInDocument = (event) => true;
        this.onDragStart = new EventEmitter();
        this.onDragEnd = new EventEmitter();
        this.onDrag = new EventEmitter();
    }
    dragStart(event) {
        event.stopPropagation();
        const rect = this.el.nativeElement.getBoundingClientRect();
        const dragEvent = {
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
    }
    isIE() {
        const match = navigator.userAgent.search(/(?:Edge|MSIE|Trident\/.*; rv:)/);
        let isIE = false;
        if (match !== -1) {
            isIE = true;
        }
        return isIE;
    }
    drag(event) {
        const dragEvent = this.dataTransfer.getData("source");
        dragEvent.clientX = event.clientX;
        dragEvent.clientY = event.clientY;
        if (this.dragInDocument(dragEvent)) {
            this.onDrag.emit(dragEvent);
        }
    }
    dragEnd(event) {
        event.stopPropagation();
        const dragEvent = this.dataTransfer.getData("source");
        this.onDragEnd.emit(dragEvent);
        this.el.nativeElement.classList.remove("drag-over");
    }
};
DragInDocumentDirective.ctorParameters = () => [
    { type: DataTransfer },
    { type: ElementRef }
];
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

let DropDirective = class DropDirective {
    constructor(dataTransfer, el) {
        this.dataTransfer = dataTransfer;
        this.el = el;
        this.dropEffect = "move";
        this.dropEnabled = (event) => true;
        this.onDragEnter = new EventEmitter();
        this.onDragLeave = new EventEmitter();
        this.onDrop = new EventEmitter();
        this.onDragOver = new EventEmitter();
    }
    createDropEvent(event) {
        return {
            source: this.dataTransfer.getData("source"),
            destination: {
                medium: this.medium,
                node: this.el.nativeElement,
                clientX: event.clientX,
                clientY: event.clientY
            }
        };
    }
    drop(event) {
        event.preventDefault();
        const dropEvent = this.createDropEvent(event);
        this.el.nativeElement.classList.remove("drag-over");
        if (this.dropEnabled(dropEvent)) {
            this.onDrop.emit(dropEvent);
        }
    }
    dragEnter(event) {
        event.preventDefault();
        const dropEvent = this.createDropEvent(event);
        if (this.dropEnabled(dropEvent)) {
            event.dataTransfer.dropEffect = this.dropEffect;
            this.el.nativeElement.classList.add("drag-over");
            this.onDragEnter.emit(dropEvent);
        }
        else {
            this.el.nativeElement.classList.remove("drag-over");
        }
    }
    dragLeave(event) {
        event.preventDefault();
        this.el.nativeElement.classList.remove("drag-over");
        this.onDragLeave.emit(event);
    }
    dragOver(event) {
        const dropEvent = this.createDropEvent(event);
        if (this.dropEnabled(dropEvent)) {
            event.preventDefault();
            this.el.nativeElement.classList.add("drag-over");
            this.onDragOver.emit(dropEvent);
        }
        else {
            this.el.nativeElement.classList.remove("drag-over");
        }
    }
};
DropDirective.ctorParameters = () => [
    { type: DataTransfer },
    { type: ElementRef }
];
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

let DragDropModule = class DragDropModule {
};
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

let PaginationComponent = class PaginationComponent {
    constructor() {
        this.vocabulary = { setSize: "", firstPage: "", nextPage: "", lastPage: "", previousPage: "" };
        this.info = { contentSize: 0, pageSize: 0, maxWidth: "0" };
        this.inline = false;
        this.onchange = new EventEmitter();
        this.onready = new EventEmitter();
    }
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
    setWidth(width) {
        this.info.maxWidth = width + "px";
    }
    ready() {
        this.onready.emit(this);
        this.onchange.emit(this.info);
    }
    selectFirst() {
        if (this.info.currentPage > 1) {
            this.info.from = 0;
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage = 1;
            this.onchange.emit(this.info);
        }
    }
    selectNext() {
        if (this.info.currentPage < this.info.pages) {
            this.info.from = this.info.to + 1;
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage++;
            this.onchange.emit(this.info);
        }
    }
    selectPrev() {
        if (this.info.currentPage > 1) {
            this.info.from -= this.info.pageSize;
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage--;
            this.onchange.emit(this.info);
        }
    }
    selectLast() {
        if (this.info.currentPage < this.info.pages) {
            this.info.from = this.info.pageSize * (this.info.pages - 1);
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage = this.info.pages;
            this.onchange.emit(this.info);
        }
    }
    changeCurrent(ranger) {
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
    changeSize(sizer) {
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
};
__decorate([
    Input("vocabulary")
], PaginationComponent.prototype, "vocabulary", void 0);
__decorate([
    Input("info")
], PaginationComponent.prototype, "info", void 0);
__decorate([
    Input('inline')
], PaginationComponent.prototype, "inline", void 0);
__decorate([
    Output('onchange')
], PaginationComponent.prototype, "onchange", void 0);
__decorate([
    Output('onready')
], PaginationComponent.prototype, "onready", void 0);
PaginationComponent = __decorate([
    Component({
        selector: 'table-pagination',
        template: "<div *ngIf=\"info && info.pages > 1\" \r\n    [style.width]=\"info.maxWidth\" \r\n    [class.inliner]=\"inline\"\r\n    [class.floater]=\"!inline\"\r\n    class=\"table-pagination\" #paginationWrapper>\r\n    <div class=\"fa fa-angle-left\"\r\n         (click)=\"selectPrev()\"\r\n         [class.disabled]=\"info.currentPage==1\">\r\n        <span class=\"prev\" [textContent]=\"vocabulary.previousPage\"></span>\r\n    </div>\r\n    <div class=\"fa fa-angle-double-left\"\r\n         (click)=\"selectFirst()\"\r\n         [class.disabled]=\"info.currentPage==1\">\r\n        <span class=\"first\" [textContent]=\"vocabulary.firstPage\"></span>\r\n    </div>\r\n    <div class=\"current\">\r\n        <input  #ranger [value]=\"info.currentPage\" (keydown.Enter)=\"changeCurrent(ranger)\" />\r\n        <span [textContent]=\"' / ' + info.pages\"></span>\r\n\t</div>\r\n    <div class=\"fa fa-angle-double-right\"\r\n         (click)=\"selectLast()\"\r\n         [class.disabled]=\"info.currentPage==info.pages\">\r\n        <span class=\"last\" [textContent]=\"vocabulary.lastPage\"></span>\r\n    </div>\r\n    <div class=\"fa fa-angle-right\"\r\n         (click)=\"selectNext()\"\r\n         [class.disabled]=\"info.currentPage==info.pages\">\r\n        <span class=\"next\" [textContent]=\"vocabulary.nextPage\"></span>\r\n    </div>\r\n    <div class=\"reset-size\" *ngIf=\"info.resetSize\">\r\n        <label for=\"pagination-set-size\">\r\n            <span class=\"off-screen\" [textContent]=\"vocabulary.setSize\"></span>\r\n            <input id=\"pagination-set-size\" [value]=\"info.pageSize\" (keydown.Enter)=\"changeSize(sizer)\" #sizer />\r\n        </label>\r\n    </div>\r\n</div>\r\n",
        styles: [".table-pagination{box-sizing:border-box;background-color:#fff;border:1px solid #254a5d;border-radius:2px;color:#254a5d;clear:both;display:flex;font-size:1em;height:38px;max-width:100%;margin:0 auto}.table-pagination.inliner{width:191px;float:right}.table-pagination.floater{position:fixed;left:40%;z-index:55;bottom:5px}.table-pagination .fa{padding:4px 8px;margin-top:5px}.table-pagination .first,.table-pagination .last,.table-pagination .next,.table-pagination .prev{background-repeat:no-repeat;cursor:pointer;width:auto;display:block;height:39px;text-indent:-99999px;box-sizing:border-box}.table-pagination .reset-size{padding:0;height:35px;border-radius:4px}.table-pagination .reset-size input{border:0;border-left:1px solid #4c5854;height:34px;text-align:center;width:30px;margin-right:2px;margin-left:8px}.table-pagination .current{padding:1px 5px}.table-pagination .current input{padding:0 3px;width:14px;height:35px;border:none;text-align:center}.table-pagination .disabled{opacity:.4}@media screen and (max-width:992px){.table-pagination{left:4px}}@media print{:host{display:none}}"]
    })
], PaginationComponent);

let ConfigurationComponent = class ConfigurationComponent {
    constructor() {
        this.onchange = new EventEmitter();
        this.onprint = new EventEmitter();
    }
    reconfigure(item, header) {
        header.present = item.checked;
        this.onchange.emit(this.headers);
    }
    enableFilter(item, header) {
        if (header.filter === undefined) {
            header.filter = "";
        }
        else {
            delete header.filter;
        }
        this.onchange.emit(this.headers);
    }
    print(event) {
        this.onprint.emit(true);
    }
    keyup(event) {
        const code = event.which;
        if (code === 13) {
            event.target.click();
        }
    }
};
__decorate([
    Input("title")
], ConfigurationComponent.prototype, "title", void 0);
__decorate([
    Input("action")
], ConfigurationComponent.prototype, "action", void 0);
__decorate([
    Input("printTable")
], ConfigurationComponent.prototype, "printTable", void 0);
__decorate([
    Input("headers")
], ConfigurationComponent.prototype, "headers", void 0);
__decorate([
    Input("configAddon")
], ConfigurationComponent.prototype, "configAddon", void 0);
__decorate([
    Output('onchange')
], ConfigurationComponent.prototype, "onchange", void 0);
__decorate([
    Output('onprint')
], ConfigurationComponent.prototype, "onprint", void 0);
ConfigurationComponent = __decorate([
    Component({
        selector: 'table-configuration',
        template: "\r\n<div class=\"shim\"\r\n    [style.display]=\"showConfigurationView ? 'block':'none'\"\r\n    (click)=\"showConfigurationView = !showConfigurationView\"></div>\r\n\r\n<a  [attr.tabindex]=\"0\" *ngIf=\"printTable\"\r\n    class=\"print-table\"\r\n    (keyup)=\"keyup($event)\"\r\n    (click)=\"print($event)\">\r\n    <span class=\"icon fa fa-print\" aria-hidden=\"true\"></span>\r\n    <span class=\"off-screen\" [textContent]=\"print\"></span>\r\n</a>\r\n<a  [attr.tabindex]=\"0\"\r\n    class=\"configure-table\"\r\n    (keyup)=\"keyup($event)\"\r\n    (click)=\"showConfigurationView = !showConfigurationView\">\r\n    <span class=\"icon fa fa-gear\" aria-hidden=\"true\"></span>\r\n    <span class=\"off-screen\" [textContent]=\"action\"></span>\r\n</a>\r\n<ng-container *ngIf=\"configAddon\" [ngTemplateOutlet]=\"configAddon\"></ng-container>\r\n\r\n<ul role=\"list\" [style.display]=\"showConfigurationView ? 'block':'none'\">\r\n    <p [textContent]=\"title\"></p>\r\n    <li  *ngFor=\"let header of headers\" role=\"listitem\">\r\n        <label for=\"{{header.key ? header.key+'f':'f'}}\">\r\n            <input type=\"checkbox\" #filter\r\n                    [id]=\"header.key ? header.key+'f':'f'\"\r\n                    [checked]=\"header.filter !== undefined\"\r\n                    (keyup)=\"keyup($event)\"\r\n                    (click)=\"enableFilter(filter, header)\" />\r\n            <span>Filter</span>\r\n        </label>\r\n        <label for=\"{{header.key ? header.key+'c':'c'}}\">\r\n            <input type=\"checkbox\" #checkbox\r\n                    [id]=\"header.key ? header.key+'c':'c'\"\r\n                    [value]=\"header.key\"\r\n                    [checked]=\"header.present\"\r\n                    (keyup)=\"keyup($event)\"\r\n                    (click)=\"reconfigure(checkbox, header)\" />\r\n            <span>Show</span>\r\n        </label>\r\n        <span class=\"title\" [textContent]=\"header.value | uppercase\"></span>\r\n    </li>\r\n</ul>\r\n",
        styles: [":host{box-sizing:border-box;padding:2px;position:absolute;right:8px;top:18px;z-index:2}:host a{display:block;float:left;padding:0 0 0 10px;cursor:pointer;z-index:5}:host a .icon{color:#00925b}:host a .off-screen{display:block;text-indent:-9999px;width:0;height:0;overflow:hidden}:host .shim{background-color:rgba(255,255,255,.2);width:100vw;height:100vh;position:fixed;top:0;left:0;z-index:2}:host ul{background-color:#fff;border:1px solid #999;border-radius:4px;display:flex;list-style:none;max-height:200px;margin:0 2px;min-width:200px;overflow-y:auto;position:absolute;padding:0 0 8px;right:0;box-shadow:6px 8px 6px -6px #1b1b1b;z-index:6}:host ul p{margin:0;padding:1px 5px;background-color:#5f9ea0;color:#fff}:host ul li{white-space:nowrap;text-align:left;flex-direction:row;padding:1px 5px}:host ul li label input{flex:0 0 30%;margin-top:4px}:host ul li .title{flex:0 0 30%;font-weight:700}@media print{:host{display:none}}"]
    })
], ConfigurationComponent);

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
__decorate([
    Input("vocabulary")
], TableViewComponent.prototype, "vocabulary", void 0);
__decorate([
    Input("lockable")
], TableViewComponent.prototype, "lockable", void 0);
__decorate([
    Input("caption")
], TableViewComponent.prototype, "caption", void 0);
__decorate([
    Input("action")
], TableViewComponent.prototype, "action", void 0);
__decorate([
    Input("pageInfo")
], TableViewComponent.prototype, "pageInfo", void 0);
__decorate([
    Input("actionKeys")
], TableViewComponent.prototype, "actionKeys", void 0);
__decorate([
    Input("tableClass")
], TableViewComponent.prototype, "tableClass", void 0);
__decorate([
    Input("headers")
], TableViewComponent.prototype, "headers", void 0);
__decorate([
    Input("items")
], TableViewComponent.prototype, "items", void 0);
__decorate([
    Input("tableInfo")
], TableViewComponent.prototype, "tableInfo", void 0);
__decorate([
    Input("enableIndexing")
], TableViewComponent.prototype, "enableIndexing", void 0);
__decorate([
    Input("enableFiltering")
], TableViewComponent.prototype, "enableFiltering", void 0);
__decorate([
    Input("rowDetailer")
], TableViewComponent.prototype, "rowDetailer", void 0);
__decorate([
    Input("expandable")
], TableViewComponent.prototype, "expandable", void 0);
__decorate([
    Input("expandIf")
], TableViewComponent.prototype, "expandIf", void 0);
__decorate([
    Input("filterwhiletyping")
], TableViewComponent.prototype, "filterwhiletyping", void 0);
__decorate([
    Input("rowDetailerHeaders")
], TableViewComponent.prototype, "rowDetailerHeaders", void 0);
__decorate([
    Output('onaction')
], TableViewComponent.prototype, "onaction", void 0);
__decorate([
    Output('onchange')
], TableViewComponent.prototype, "onchange", void 0);
__decorate([
    Output('onfilter')
], TableViewComponent.prototype, "onfilter", void 0);
__decorate([
    Output('onCellContentEdit')
], TableViewComponent.prototype, "onCellContentEdit", void 0);
__decorate([
    ViewChild('flexible', { static: false })
], TableViewComponent.prototype, "table", void 0);
TableViewComponent = __decorate([
    Component({
        selector: 'table-view',
        template: "\r\n<table [class]=\"tableClass\"  #flexible>\r\n    <caption *ngIf=\"caption\" [textContent]=\"caption\"></caption>\r\n    <thead>\r\n        <tr>\r\n            <th scope=\"col\" *ngIf=\"enableIndexing && !printMode\" id=\"indexable\" class=\"indexable hide-on-print\"></th>\r\n            <th scope=\"col\" *ngFor=\"let header of headers\" #th\r\n                [dragEnabled]=\"dragEnabled.bind(this)\"\r\n                [dropEnabled]=\"dropEnabled.bind(this)\"\r\n                [medium]=\"header\"\r\n                (onDragStart)=\"onDragStart($event)\"\r\n                (onDragEnd)=\"onDragEnd($event)\"\r\n                (onDrop)=\"onDrop($event)\"\r\n                [id]=\"header.key\"\r\n                [attr.width]=\"header.width ? header.width : null\" \r\n                [style.min-width]=\"header.minwidth ? header.minwidth : ''\" \r\n                [attr.tabindex]=\"header.sortable ? 0 : -1\"\r\n                [class.hide-on-print]=\"header.hideOnPrint\"\r\n                (keydown)=\"keydown($event, th)\" (click)=\"sort(header, icon)\">\r\n                <span \r\n                    *ngIf=\"!printMode && header.sortable\" \r\n                    class=\"off-screen\"  \r\n                    [textContent]=\"vocabulary.clickSort\"></span>\r\n                <span class=\"locker icon fa\" #locker\r\n                    *ngIf=\"!printMode && lockable && (headers.length > 1 || header.locked)\"\r\n                    tabindex=\"0\"\r\n                    title=\"lock/unlock this column\"\r\n                    (keydown)=\"keydown($event, locker)\" (click)=\"lock(header, $event)\"\r\n                    [class.fa-lock]=\"header.locked\"\r\n                    [class.fa-unlock]=\"!header.locked\"></span>\r\n                <span class=\"title\"\r\n                    [class.lockable]=\"lockable\"\r\n                    [class.dragable]=\"header.dragable\"\r\n                    [textContent]=\"header.value\"></span>\r\n                <span class=\"icon fa\" [class.hidden]=\"printMode || !items || items.length === 0\" #icon\r\n                    [class.fa-sort]=\"header.sortable\"\r\n                    [class.fa-sort-asc]=\"header.assending\"\r\n                    [class.fa-sort-desc]=\"header.desending\"></span>\r\n            </th>\r\n            <th scope=\"col\" *ngIf=\"action && !printMode\" id=\"actionable\" class=\"actionable hide-on-print\"></th>\r\n        </tr>\r\n    </thead>\r\n    <tbody>\r\n        <tr *ngIf=\"!printMode && enableFiltering && items && items.length\" class=\"hide-on-print\">\r\n            <td scope=\"row\" *ngIf=\"enableIndexing && !printMode\" class=\"index filter hide-on-print\">\r\n                <input type=\"text\" disabled style=\"opacity:0\" />\r\n            </td>\r\n            <td scope=\"row\" \r\n                        *ngFor=\"let header of headers; let i=index\" \r\n                        [attr.data-label]=\"header.value\" \r\n                        [class.hide-on-print]=\"header.hideOnPrint\"\r\n                        class=\"filter\">\r\n                <span *ngIf=\"header.filter === undefined\">&nbsp;</span>\r\n                <input  *ngIf=\"header.filter !== undefined\"\r\n                        id=\"filter-{{i}}\"\r\n                        type=\"text\" \r\n                        (keyup)=\"changeFilter($event, header)\"\r\n                        [value]=\"header.filter ? header.filter : ''\" />\r\n                <label *ngIf=\"header.filter !== undefined\" for=\"filter-{{i}}\" ><span class=\"off-screen\" >Filter \"{{header.value}}\"</span><span class=\"fa fa-search\"></span></label>\r\n            </td>\r\n            <td scope=\"row\" *ngIf=\"action && !printMode\" class=\"hide-on-print\"></td>\r\n        </tr>\r\n       <ng-template ngFor let-item [ngForOf]=\"printMode ? items: filteredItems\" let-i=\"index\">\r\n            <tr (click)=\"actionClick($event, item)\"\r\n                (mouseover)=\"hover(item, true)\"\r\n                (mouseout)=\"hover(item, false)\"\r\n                [class.pointer]=\"action\"\r\n                [class.hover]=\"item.hover\"\r\n                [class.expanded]=\"item.expanded\"\r\n                [class.odd]=\"i%2\">\r\n                <td scope=\"row\" class=\"index hide-on-print\" *ngIf=\"enableIndexing && !printMode\">\r\n                    <span [textContent]=\"i + pageInfo.from + 1\"></span>\r\n                </td>\r\n                <td scope=\"row\" \r\n                    *ngFor=\"let header of headers\" \r\n                    [class]=\"toCssClass(header)\"\r\n                    [class.hide-on-print]=\"header.hideOnPrint\"\r\n                    [attr.data-label]=\"header.value\" \r\n                    [intoName]=\"header.value\"\r\n                    [intoId]=\"header.key + '-' + i\"\r\n                    [into]=\"header.format\"\r\n                    [intoData]=\"item\"\r\n                    [rawContent]=\"cellContent(item, header)\"\r\n                    [onComponentChange]=\"onTableCellEdit.bind(this)\"></td>\r\n                <td scope=\"row\" *ngIf=\"action && !printMode\" class=\"hide-on-print\">\r\n                    <a class=\"actionable\"\r\n                        *ngIf=\"expandable(item, true)\"\r\n                        tabindex=\"0\"\r\n                        role=\"button\"\r\n                        style=\"cursor:pointer\"\r\n                        [class.expanded]=\"item.expanded\" #clicker\r\n                        (keydown)=\"keydown($event, clicker)\" (click)=\"actionClick($event, item)\">\r\n                        <span\r\n                            class=\"icon fa\"\r\n                            [class.fa-angle-right]=\"!rowDetailer\"\r\n                            [class.fa-minus-square-o]=\"rowDetailer && item.expanded\"\r\n                            [class.fa-plus-square-o]=\"rowDetailer && !item.expanded\"\r\n                            aria-hidden=\"true\"></span>\r\n                        <span class=\"off-screen\" [textContent]=\"offScreenMessage(item)\"></span>\r\n                    </a>\r\n                </td>\r\n            </tr>\r\n            <tr *ngIf=\"rowDetailer && item.expanded\" class=\"detail\" [class.odd]=\"i%2\">\r\n                <td scope=\"row\" class=\"index\" *ngIf=\"enableIndexing && !printMode\"></td>\r\n                <td [attr.colspan]=\"columnsCount()\">\r\n                    <ng-container [ngTemplateOutlet]=\"rowDetailer\" [ngTemplateOutletContext]=\"rowDetailerContext(item)\"></ng-container>\r\n                </td>\r\n            </tr>\r\n        </ng-template>\r\n    </tbody>\r\n</table>\r\n",
        styles: [":host{display:inline-block!important;width:100%;position:relative;margin:0 auto;border-spacing:0;border-collapse:collapse}:host .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host table{margin:1rem auto;padding:0;width:100%;table-layout:fixed;max-width:99%;background-color:transparent;border-collapse:collapse}:host table caption{background-color:#c3e5e2;border-radius:2px;color:#1b1b1b;caption-side:top;font-size:14px;padding:5px 6px;margin-bottom:15px;text-align:left}:host table thead{border-top:1px solid #bbb;border-bottom:1px solid #bbb;background-color:#eee}:host table tr{border:0}:host table tr.expanded td{font-weight:700}:host table td{padding-left:3px;min-height:21px;overflow:hidden}:host table td span:first-child{min-height:21px;display:block}:host table td:first-child{padding-left:5px}:host table td ::ng-deep input-component .locked,:host table td ::ng-deep input-component input{width:99%}:host table td .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host table td.filter{padding:0;position:relative}:host table td.filter input{box-sizing:border-box;width:100%;margin:0}:host table td.filter .fa{position:absolute;top:4px;right:2px;color:#bad}:host table td ::ng-deep img{height:24px}:host table td.index{background-color:#eee;border-right:1px solid #bbb}:host table td.index span{padding:1px 0}:host table th{cursor:default;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none;height:24px;position:relative;white-space:nowrap;font-weight:400;text-transform:uppercase;font-size:14px;padding-top:6px;padding-bottom:6px;text-align:left}:host table th.drag-over{background-color:#9b9b9b}:host table th.drag-over .icon,:host table th.drag-over .title{color:#eee}:host table th:first-child{padding-left:5px}:host table th.ascending,:host table th.descending,:host table th.sortable{cursor:pointer;min-height:12px}:host table th.indexable{width:33px}:host table th.actionable{width:24px}:host table th .hidden{display:none}:host table th .title{color:#254a4d;display:inline-block;height:20px;float:left;width:calc(90% - 22px)!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}:host table th .title.dragable{width:auto}:host table th .title.lockable{width:calc(90% - 46px)!important}:host table th .dragable{cursor:move}:host table th .icon{width:22px;display:inline-block;height:20px;color:#254a4d;float:right}:host table th .locker{float:left}:host .fa.fa-angle-right{font-size:18px}table tr.expanded td{border-bottom:0}table tr.detail td{border-top:0;cursor:default}table tr.expanded td a.expanded{background-position:right 2px}table tbody tr.hover,table tbody tr:hover{background-color:#ffeed2}table tbody tr.detail.hover,table tbody tr.detail.hover td table thead tr,table tbody tr.detail:hover,table tbody tr.detail:hover td table thead tr{background-color:inherit}table tr td a.actionable{color:#254a4d}table tr td a.actionable .icon{line-height:22px;text-align:right}table tbody tr.detail.hover td:last-child,table tbody tr.detail:hover td:last-child{border-right:0}table tbody tr.detail.hover td:first-child,table tbody tr.detail:hover td:first-child{border-left:0}table tr td{border-bottom:1px solid #b1b3b3;color:#254a5d;font-size:15px;text-transform:capitalize}table tbody tr.pointer{cursor:pointer}table.alert-danger{border:0}table.alert-danger caption{background-color:transparent;font-weight:700;margin-bottom:0}table.alert-danger td{border-bottom:0;display:block}table.alert-danger td:first-child{padding-left:0}table.alert-danger td:last-child{border-bottom:0}table.alert-danger td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase;width:40%;text-align:left;overflow:hidden;text-overflow:ellipsis}table.alert-danger td a span.icon{width:100%}table.alert-danger thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}table.alert-danger tr{border:2px solid #fff;display:block;margin-bottom:.625em;padding:5px;border-radius:5px}table.alert-danger tr th.actionable{width:inherit}table.alert-danger tr td{border-bottom:0}@media print{table td,table th{text-align:left}table td .icon,table th .icon{display:none!important}table td.hide-on-print,table th.hide-on-print,table tr.hide-on-print{display:none}}@media screen and (max-width:600px){table{border:0}table th.indexable{display:none}table td{border-bottom:0;display:block;text-align:right}table td.index{display:none}table td:first-child{padding-left:0}table td:last-child{border-bottom:0}table td.filter input{width:50%!important}table td.filter .fa{right:7px!important}table td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase}table td a span.icon{width:100%}table td ::ng-deep .into{float:right!important}table td ::ng-deep .into .calendar{margin-right:0}table td ::ng-deep .into .popper{margin-right:0}table thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}table tr{border-bottom:3px solid #ddd;display:block;margin-bottom:.625em}table tr th.actionable{width:inherit}table tr td{border-bottom:0}table.alert-danger td:before{width:inherit}}"]
    })
], TableViewComponent);

let LockTableComponent = class LockTableComponent {
    constructor(generator, renderer) {
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
        this.tableClass = 'default-flexible-table';
        this.inlinePagination = false;
        this.onaction = new EventEmitter();
        this.onCellContentEdit = new EventEmitter();
        this.onfilter = new EventEmitter();
        this.onconfigurationchange = new EventEmitter();
    }
    scroll(event) {
        this.renderer.setElementStyle(this.lockedTable.el.nativeElement, "left", event.target.scrollLeft + "px");
    }
    ngOnChanges(changes) {
        if (changes.items) {
            const list = [];
            this.items.map((item) => {
                const copy = Object.assign({}, item);
                this.headers.map((header) => {
                    if (header.format) {
                        const v = copy[header.key];
                        if (v && typeof v === 'string') {
                            const format = header.format.split(':');
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
                list.push(copy);
            });
            this.formeditems = list;
        }
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
        if (this.persistenceKey) {
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
        this.filteredItems = this.formeditems ? this.formeditems : this.items;
        this.pageInfo.contentSize = this.items.length;
        this.reconfigure(this.headers);
    }
    evaluatePositioning() {
        this.renderer.setElementStyle(this.unlockedTable.el.nativeElement, "margin-left", this.lockedTable.offsetWidth() + "px");
    }
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
    onlock(event) {
        this.lockedHeaders = this.headers.filter((item) => item.locked === true && item.present);
        this.unlockedHeaders = this.headers.filter((item) => item.locked !== true && item.present);
        this.onconfigurationchange.emit(event);
        if (this.persistenceKey) {
            this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
        }
        setTimeout(this.evaluatePositioning.bind(this), 111);
    }
    changeLockedTableFilteredItems(event) {
        if (this.lockedTable && !this.holdlocked) {
            this.lockedTable.filteredItems = event;
            this.lockedTable.initVisibleRows(null);
        }
        this.holdlocked = false;
    }
    changeUnlockedTableFilteredItems(event) {
        if (this.unlockedTable && !this.holdunlocked) {
            this.unlockedTable.filteredItems = event;
            this.unlockedTable.initVisibleRows(null);
        }
        this.holdunlocked = false;
    }
    onPaginationChange(event) {
        this.pageInfo = event;
        this.holdlocked = true;
        this.holdunlocked = true;
        this.lockedTable.evaluateRows();
        this.unlockedTable.evaluateRows();
    }
    tableAction(event) {
        this.onaction.emit(event);
    }
    onDrop(event) {
    }
    onCellEdit(event) {
        this.onCellContentEdit.emit(event);
    }
    onTableFilter(event) {
        this.onfilter.emit(event);
    }
};
LockTableComponent.ctorParameters = () => [
    { type: TableHeadersGenerator },
    { type: Renderer }
];
__decorate([
    Input("vocabulary")
], LockTableComponent.prototype, "vocabulary", void 0);
__decorate([
    Input("persistenceId")
], LockTableComponent.prototype, "persistenceId", void 0);
__decorate([
    Input("persistenceKey")
], LockTableComponent.prototype, "persistenceKey", void 0);
__decorate([
    Input("caption")
], LockTableComponent.prototype, "caption", void 0);
__decorate([
    Input("action")
], LockTableComponent.prototype, "action", void 0);
__decorate([
    Input("actionKeys")
], LockTableComponent.prototype, "actionKeys", void 0);
__decorate([
    Input("tableClass")
], LockTableComponent.prototype, "tableClass", void 0);
__decorate([
    Input("headers")
], LockTableComponent.prototype, "headers", void 0);
__decorate([
    Input("items")
], LockTableComponent.prototype, "items", void 0);
__decorate([
    Input('inlinePagination')
], LockTableComponent.prototype, "inlinePagination", void 0);
__decorate([
    Input("pageInfo")
], LockTableComponent.prototype, "pageInfo", void 0);
__decorate([
    Input("tableInfo")
], LockTableComponent.prototype, "tableInfo", void 0);
__decorate([
    Input("configurable")
], LockTableComponent.prototype, "configurable", void 0);
__decorate([
    Input("configAddon")
], LockTableComponent.prototype, "configAddon", void 0);
__decorate([
    Input("enableFiltering")
], LockTableComponent.prototype, "enableFiltering", void 0);
__decorate([
    Input("enableIndexing")
], LockTableComponent.prototype, "enableIndexing", void 0);
__decorate([
    Input("filterwhiletyping")
], LockTableComponent.prototype, "filterwhiletyping", void 0);
__decorate([
    Output('onaction')
], LockTableComponent.prototype, "onaction", void 0);
__decorate([
    Output('onCellContentEdit')
], LockTableComponent.prototype, "onCellContentEdit", void 0);
__decorate([
    Output('onfilter')
], LockTableComponent.prototype, "onfilter", void 0);
__decorate([
    Output('onconfigurationchange')
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
        template: "<div class=\"caption\">\n\t<table-configuration\n\t\t*ngIf=\"configurable\" \n\t\t[headers]=\"headers\" \n\t\t[title]=\"vocabulary.configureColumns\" \n\t\t[action]=\"vocabulary.configureTable\"\n\t\t[configAddon]=\"configAddon\"\n\t\t(onchange)=\"reconfigure($event)\"></table-configuration>\n\n\t<div *ngIf=\"caption\" [textContent]=\"caption\"></div>\n</div>\n<div class=\"smart-table-wrap\" (scroll)=\"scroll($event)\">\n\t<table-view #lockedTable\n\t\tclass=\"locked-table\"\n\t\tlockable=\"true\"\n\t\t[headers]=\"lockedHeaders\" \n\t\t[items]=\"filteredItems\" \n        [pageInfo]=\"pageInfo\"\n        [vocabulary]=\"vocabulary\"\n        [filterwhiletyping]=\"filterwhiletyping\"\n\t\t[enableFiltering]=\"enableFiltering\"\n\t\t[enableIndexing]=\"enableIndexing\"\n        \n\t\t(onchange)=\"onlock($event)\"\n\t\t(onDrop)=\"onDrop($event)\"\n        (onfilter)=\"onTableFilter($event)\"\n\t\t(onCellContentEdit)=\"onCellEdit($event)\"\n\t\t(onfilter)=\"changeUnlockedTableFilteredItems($event)\"\n\t\t(onaction)=\"tableAction($event)\"></table-view>\n\n    <table-view #unlockedTable\n\t\tclass=\"unlocked-table\"\n\t\tlockable=\"true\"\n\t\t[headers]=\"unlockedHeaders\" \n\t\t[items]=\"filteredItems\" \n        [pageInfo]=\"pageInfo\"\n        [vocabulary]=\"vocabulary\"\n        [filterwhiletyping]=\"filterwhiletyping\"\n\t\t[enableFiltering]=\"enableFiltering\"\n\n\t\t(onDrop)=\"onDrop($event)\"\n        (onfilter)=\"onTableFilter($event)\"\n\t\t(onchange)=\"onlock($event)\"\n\t\t(onCellContentEdit)=\"onCellEdit($event)\"\n\t\t(onfilter)=\"changeLockedTableFilteredItems($event)\"\n\t\t(onaction)=\"tableAction($event)\"></table-view>\n\t\n</div>\n<table-pagination #pager\n\t[info]=\"pageInfo\" \n    [inline]=\"inlinePagination\" \n\t[vocabulary]=\"vocabulary\" \n    (onchange)=\"onPaginationChange($event)\"></table-pagination>\n",
        styles: [":host{width:100%;position:relative;margin:0 auto;display:table}:host .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host .caption{background-color:#c3e5e2;border-radius:2px;box-sizing:border-box;color:#1b1b1b;caption-side:top;font-size:14px;margin-bottom:15px;padding:5px 6px;text-align:left;width:100%}:host .caption table-configuration{display:inline-block;float:right;position:unset}:host .smart-table-wrap{border-spacing:0;border-collapse:collapse;border-right:1px solid #aaa;border-bottom:1px solid #aaa;box-sizing:border-box;width:100%;position:relative;overflow-x:auto}:host .smart-table-wrap .unlocked-table ::ng-deep table{max-width:100%;margin-bottom:0;margin-top:0}:host .smart-table-wrap .unlocked-table ::ng-deep table th td{white-space:nowrap}:host .smart-table-wrap .unlocked-table ::ng-deep table th .locker{cursor:pointer;color:#00925b;text-align:center}:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr{background-color:#fff}:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr.hover,:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr:hover{background-color:#ffeed2}:host .smart-table-wrap .unlocked-table ::ng-deep table img{height:14px}:host .smart-table-wrap .locked-table{position:absolute;margin:0 auto;display:inline-table;border-spacing:0;border-collapse:collapse;float:left;z-index:2;width:auto}:host .smart-table-wrap .locked-table ::ng-deep table{display:inline-block;border-right:1px solid #aaa;margin:0;width:auto}:host .smart-table-wrap .locked-table ::ng-deep table th td{white-space:nowrap}:host .smart-table-wrap .locked-table ::ng-deep table th .locker{cursor:pointer;color:#8b0224;text-align:center}:host .smart-table-wrap .locked-table ::ng-deep table tbody tr{background-color:#fff}:host .smart-table-wrap .locked-table ::ng-deep table tbody tr.hover,:host .smart-table-wrap .locked-table ::ng-deep table tbody tr:hover{background-color:#ffeed2}:host .smart-table-wrap .locked-table ::ng-deep table img{height:14px}@media screen and (max-width:600px){.smart-table-wrap{border:0!important;position:unset;overflow-x:unset}.smart-table-wrap .unlocked-table{margin-left:0!important;position:unset!important}.smart-table-wrap .unlocked-table ::ng-deep table td,.smart-table-wrap .unlocked-table ::ng-deep table th{white-space:unset}.smart-table-wrap .unlocked-table ::ng-deep table img{height:30px}.smart-table-wrap .locked-table{position:unset!important;margin:0!important;display:table;left:0!important}.smart-table-wrap .locked-table ::ng-deep table{display:table!important;margin:0!important;width:100%!important}.smart-table-wrap .locked-table ::ng-deep table td,.smart-table-wrap .locked-table ::ng-deep table th{white-space:unset}.smart-table-wrap .locked-table ::ng-deep table td.index{border-right:0}.smart-table-wrap .locked-table ::ng-deep table img{height:30px}}"]
    })
], LockTableComponent);

let FlexibleTableModule = class FlexibleTableModule {
};
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

/**
 * Generated bundle index. Do not edit.
 */

export { FlexibleTableComponent, FlexibleTableModule, TableViewComponent as ɵa, TableHeadersGenerator as ɵb, DragDropModule as ɵc, DragDirective as ɵd, DataTransfer as ɵe, DragInDocumentDirective as ɵf, DropDirective as ɵg, LockTableComponent as ɵh, ConfigurationComponent as ɵi, PaginationComponent as ɵj };
//# sourceMappingURL=sedeh-flexible-table.js.map
