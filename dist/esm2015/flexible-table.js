import { Injectable, Component, Input, Output, EventEmitter, ViewChild, ViewContainerRef, ElementRef, Renderer, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntoPipeModule } from 'into-pipes';
import { DragDropModule } from 'drag-enabled';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/*
 * This object will traverse through a given json object and finds all the attributes of
 * the object and its related associations within the json. The resulting structure would be
 * name of attributes and a pathway to reach the attribute deep in object heirarchy.
 */
/**
 * @record
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
                const /** @type {?} */ innerPath = (path.length ? (path + "." + key) : key);
                if (typeof root[key] === "string" || typeof root[key] === "number" || typeof root[key] === "boolean") {
                    const /** @type {?} */ header = {
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
                    const /** @type {?} */ node = root[key];
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
        let /** @type {?} */ result;
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
        catch (/** @type {?} */ e) {
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
        catch (/** @type {?} */ e) {
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
    { type: Injectable },
];
/** @nocollapse */
TableHeadersGenerator.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
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
        this.onconfigurationchange = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.persistenceKey) {
            const /** @type {?} */ headers = this.generator.retreiveHeaders(this.persistenceKey, this.persistenceId);
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
}
FlexibleTableComponent.decorators = [
    { type: Component, args: [{
                selector: 'flexible-table',
                template: `
<div class="flexible-table">
    <table-configuration
        *ngIf="configurable && items && items.length"
        class="table-configuration"
        [headers]="headers"
        [title]="vocabulary.configureColumns"
        [printTable]="vocabulary.printTable"
        [action]="vocabulary.configureTable"
        (onprint)="viewTable.print()"
        (onchange)="reconfigure($event)"></table-configuration>
    <table-view #viewTable
        [action]="action"
        [actionKeys]="actionKeys"
		[tableClass]="tableClass"
		[caption]="caption"
		[headers]="subHeaders"
		[items]="items"
        [pageInfo]="pageInfo"
        [vocabulary]="vocabulary"
		[enableIndexing]="enableIndexing"
		[enableFiltering]="enableFiltering"
        [rowDetailer]="rowDetailer"
        [actionable]="actionable"
        [expandable]="expandable"
        (onDrop)="onDrop($event)"
        (onchange)="reconfigure($event)"
		(onaction)="tableAction($event)"></table-view>
</div>
<table-pagination
    [info]="pageInfo"
    [vocabulary]="vocabulary"
    (onchange)="onPaginationChange($event)"></table-pagination>
`,
                styles: [`:host{display:inline-block!important;width:100%}.flexible-table{position:relative;margin:0 auto;display:table;border-spacing:0;border-collapse:collapse}.flexible-table .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table{margin:1rem auto;padding:0;width:100%;table-layout:fixed;max-width:99%;background-color:transparent;border-collapse:collapse}.flexible-table table caption{background-color:#c3e5e2;border-radius:2px;color:#1b1b1b;caption-side:top;font-size:14px;padding:5px 6px;margin-bottom:15px;text-align:left}.flexible-table table thead{border-top:1px solid #bbb;border-bottom:1px solid #bbb;background-color:#eee}.flexible-table table tr{border:0}.flexible-table table tr.expanded td{font-weight:700;border-bottom:0}.flexible-table table td{padding-left:3px}.flexible-table table td:first-child{padding-left:5px}.flexible-table table td .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table td.index{background-color:#eee;border-right:1px solid #bbb}.flexible-table table th{cursor:default;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none;height:24px;position:relative;white-space:nowrap;font-weight:400;text-transform:uppercase;font-size:14px;padding-top:6px;padding-bottom:6px;text-align:left}.flexible-table table th.drag-over{background-color:#9b9b9b}.flexible-table table th.drag-over .icon,.flexible-table table th.drag-over .title{color:#eee}.flexible-table table th:first-child{padding-left:5px}.flexible-table table th.ascending,.flexible-table table th.descending,.flexible-table table th.sortable{cursor:pointer;height:12px}.flexible-table table th.indexable{width:33px}.flexible-table table th.actionable{width:24px}.flexible-table table th .title{color:#254a4d;display:inline-block;height:20px;white-space:nowrap}.flexible-table table th .dragable{cursor:move}.flexible-table table th .icon{width:22px;display:inline-block;height:20px;color:#254a4d}.flexible-table .fa.fa-angle-right{font-size:18px}.flexible-table table tr.detail td{border-top:0;cursor:default}.flexible-table table tr.expanded td a.expanded{background-position:right 2px}.flexible-table table tbody tr:hover{background-color:#ffeed2}.flexible-table table tbody tr.detail:hover,.flexible-table table tbody tr.detail:hover td table thead tr{background-color:inherit}.flexible-table table tr td a.actionable{display:inline-table;height:32px;vertical-align:middle;width:25px;line-height:30px;color:#254a4d}.flexible-table table tbody tr.detail:hover td:last-child{border-right:0}.flexible-table table tbody tr.detail:hover td:first-child{border-left:0}.flexible-table table tr td{border-bottom:1px solid #b1b3b3;color:#254a5d;font-size:15px;text-transform:capitalize}.flexible-table table tbody tr.pointer{cursor:pointer}.flexible-table table.alert-danger{border:0}.flexible-table table.alert-danger caption{background-color:transparent;font-weight:700;margin-bottom:0}.flexible-table table.alert-danger td{border-bottom:0;display:block}.flexible-table table.alert-danger td:first-child{padding-left:0}.flexible-table table.alert-danger td:last-child{border-bottom:0}.flexible-table table.alert-danger td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase;width:20%}.flexible-table table.alert-danger td a span.icon{width:100%}.flexible-table table.alert-danger thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table.alert-danger tr{border:2px solid #fff;display:block;margin-bottom:.625em;padding:5px;border-radius:5px}.flexible-table table.alert-danger tr th.actionable{width:inherit}.flexible-table table.alert-danger tr td{border-bottom:0}@media screen and (max-width:600px){.flexible-table table{border:0}.flexible-table table td{border-bottom:0;display:block;text-align:right}.flexible-table table td:first-child{padding-left:0}.flexible-table table td:last-child{border-bottom:0}.flexible-table table td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase}.flexible-table table td a span.icon{width:100%}.flexible-table table thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table tr{border-bottom:3px solid #ddd;display:block;margin-bottom:.625em}.flexible-table table tr th.actionable{width:inherit}.flexible-table table tr td{border-bottom:0}.flexible-table table.alert-danger td:before{width:inherit}}`]
            },] },
];
/** @nocollapse */
FlexibleTableComponent.ctorParameters = () => [
    { type: TableHeadersGenerator, },
];
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */

class PaginationComponent {
    constructor() {
        this.vocabulary = { setSize: "", firstPage: "", lastPage: "", previousPage: "" };
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
        const /** @type {?} */ v = parseInt(ranger.value, 10);
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
        const /** @type {?} */ v = parseInt(sizer.value, 10);
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
                template: `<div *ngIf="info && info.pages > 1" [style.width]="info.maxWidth" class="table-pagination" #paginationWrapper>
    <div class="fa fa-angle-left"
         (click)="selectPrev()"
         [class.disabled]="info.currentPage==1">
        <span class="prev" [textContent]="vocabulary.previousPage"></span>
    </div>
    <div class="fa fa-angle-double-left"
         (click)="selectFirst()"
         [class.disabled]="info.currentPage==1">
        <span class="first" [textContent]="vocabulary.firstPage"></span>
    </div>
    <div class="current">
        <input  #ranger [value]="info.currentPage" (keydown.Enter)="changeCurrent(ranger)" />
        <span [textContent]="' / ' + info.pages"></span>
	</div>
    <div class="fa fa-angle-double-right"
         (click)="selectLast()"
         [class.disabled]="info.currentPage==info.pages">
        <span class="last" [textContent]="vocabulary.lastPage"></span>
    </div>
    <div class="fa fa-angle-right"
         (click)="selectNext()"
         [class.disabled]="info.currentPage==info.pages">
        <span class="next" [textContent]="vocabulary.nextPage"></span>
    </div>
    <div class="reset-size" *ngIf="info.resetSize">
        <label for="pagination-set-size">
            <span class="off-screen" [textContent]="vocabulary.setSize"></span>
            <input id="pagination-set-size" [value]="info.pageSize" (keydown.Enter)="changeSize(sizer)" #sizer />
        </label>
    </div>
</div>
`,
                styles: [`.table-pagination{-webkit-box-sizing:border-box;box-sizing:border-box;background-color:#fff;border:1px solid #254a5d;border-radius:2px;color:#254a5d;bottom:5px;clear:both;display:-webkit-box;display:-ms-flexbox;display:flex;font-size:1em;height:38px;max-width:100%;margin:0 auto;position:fixed;left:40%;z-index:55}.table-pagination .fa{padding:4px 8px;margin-top:5px}.table-pagination .first,.table-pagination .last,.table-pagination .next,.table-pagination .prev{background-repeat:no-repeat;cursor:pointer;width:auto;display:block;height:39px;text-indent:-99999px;-webkit-box-sizing:border-box;box-sizing:border-box}.table-pagination .reset-size{padding:0;height:35px;border-radius:4px}.table-pagination .reset-size input{border:0;border-left:1px solid #4c5854;height:34px;text-align:center;width:30px;margin-right:2px;margin-left:8px}.table-pagination .current{padding:1px 5px}.table-pagination .current input{padding:0 3px;width:14px;height:35px;border:none;text-align:center}.table-pagination .disabled{opacity:.4}@media screen and (max-width:992px){.table-pagination{left:4px}}`]
            },] },
];
/** @nocollapse */
PaginationComponent.ctorParameters = () => [];
PaginationComponent.propDecorators = {
    "vocabulary": [{ type: Input, args: ["vocabulary",] },],
    "info": [{ type: Input, args: ["info",] },],
    "onchange": [{ type: Output, args: ['onchange',] },],
    "onready": [{ type: Output, args: ['onready',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
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
        const /** @type {?} */ code = event.which;
        if (code === 13) {
            event.target.click();
        }
    }
}
ConfigurationComponent.decorators = [
    { type: Component, args: [{
                selector: 'table-configuration',
                template: `
<div class="shim"
    [style.display]="showConfigurationView ? 'block':'none'"
    (click)="showConfigurationView = !showConfigurationView"></div>
<a  [attr.tabindex]="0" *ngIf="printTable"
    class="print-table"
    (keyup)="keyup($event)"
    (click)="print($event)">
    <span class="icon fa fa-print" aria-hidden="true"></span>
    <span class="off-screen" [textContent]="print"></span>
</a>
<a  [attr.tabindex]="0"
    class="configure-table"
    (keyup)="keyup($event)"
    (click)="showConfigurationView = !showConfigurationView">
    <span class="icon fa fa-gear" aria-hidden="true"></span>
    <span class="off-screen" [textContent]="action"></span>
</a>
<ul role="list" [style.display]="showConfigurationView ? 'block':'none'">
    <p [textContent]="title"></p>
    <li  *ngFor="let header of headers" role="listitem">
        <label for="{{header.key ? header.key+'f':'f'}}">
            <input type="checkbox" #filter
                    [id]="header.key ? header.key+'f':'f'"
                    [checked]="header.filter !== undefined"
                    (keyup)="keyup($event)"
                    (click)="enableFilter(filter, header)" />
            <span>Filrer</span>
        </label>
        <label for="{{header.key ? header.key+'c':'c'}}">
            <input type="checkbox" #checkbox
                    [id]="header.key ? header.key+'c':'c'"
                    [value]="header.key"
                    [checked]="header.present"
                    (keyup)="keyup($event)"
                    (click)="reconfigure(checkbox, header)" />
            <span>Show</span>
        </label>
        <span>: </span>
        <span [textContent]="header.value"></span>
    </li>
</ul>
`,
                styles: [`:host{-webkit-box-sizing:border-box;box-sizing:border-box;padding:2px;position:absolute;right:8px;top:18px;z-index:2}:host a{display:block;float:left;padding:0 0 0 10px;cursor:pointer;z-index:5}:host a .icon{color:#00925b}:host a .off-screen{display:block;text-indent:-9999px;width:0;height:0;overflow:hidden}:host .shim{background-color:rgba(255,255,255,.2);width:100vw;height:100vh;position:fixed;top:0;left:0;z-index:2}:host ul{background-color:#fff;border:1px solid #999;border-radius:4px;display:block;list-style:none;max-height:300px;margin:2px 0;min-width:200px;overflow-y:auto;position:absolute;padding:15px;right:0;-webkit-box-shadow:6px 8px 6px -6px #1b1b1b;box-shadow:6px 8px 6px -6px #1b1b1b;z-index:6}:host ul li{white-space:nowrap;text-align:left}`]
            },] },
];
/** @nocollapse */
ConfigurationComponent.ctorParameters = () => [];
ConfigurationComponent.propDecorators = {
    "title": [{ type: Input, args: ["title",] },],
    "action": [{ type: Input, args: ["action",] },],
    "printTable": [{ type: Input, args: ["printTable",] },],
    "headers": [{ type: Input, args: ["headers",] },],
    "onchange": [{ type: Output, args: ['onchange',] },],
    "onprint": [{ type: Output, args: ['onprint',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
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
    }
    /**
     * @param {?} id
     * @return {?}
     */
    findColumnWithID(id) {
        const /** @type {?} */ list = this.headerColumnElements();
        let /** @type {?} */ column = null;
        for (let /** @type {?} */ i = 0; i < list.length; i++) {
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
            const /** @type {?} */ srcIndex = this.getColumnIndex(source.medium.key);
            const /** @type {?} */ desIndex = this.getColumnIndex(destination.medium.key);
            if (srcIndex < 0 || desIndex < 0) {
                console.log("invalid drop id", source.medium.key, destination.medium.key);
                return;
            }
            const /** @type {?} */ x = this.filteredItems;
            this.filteredItems = [];
            setTimeout(() => {
                const /** @type {?} */ sobj = this.headers[srcIndex];
                this.headers[srcIndex] = this.headers[desIndex];
                this.headers[desIndex] = sobj;
                this.filteredItems = x;
                this.onfilter.emit(this.filteredItems);
                this.onchange.emit(this.headers);
            }, 33);
        }
        else if (source.medium.locked || destination.medium.locked) {
            const /** @type {?} */ x = this.filteredItems;
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
        let /** @type {?} */ index = -1;
        for (let /** @type {?} */ i = 0; i < this.headers.length; i++) {
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
        let /** @type {?} */ subitem = item;
        hpath.map((subkey) => {
            if (subitem) {
                subitem = subitem[subkey];
            }
        });
        return subitem === undefined || subitem === null || subitem === "null" ? "" : String(subitem);
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
            for (let /** @type {?} */ i = 0; i < this.headers.length; i++) {
                const /** @type {?} */ h = this.headers[i];
                if (h.key !== header.key) {
                    const /** @type {?} */ item = this.findColumnWithID(h.key);
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
            const /** @type {?} */ hpath = header.key.split(".");
            this.filteredItems.sort((a, b) => {
                const /** @type {?} */ v1 = this.itemValue(a, hpath);
                const /** @type {?} */ v2 = this.itemValue(b, hpath);
                if (header.ascending) {
                    return v1 > v2 ? 1 : -1;
                }
                return v1 < v2 ? 1 : -1;
            });
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
    }
    /**
     * @return {?}
     */
    ngOnInit() {
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
            this.rowDetailerHeaders = (item) => [];
        }
    }
    /**
     * @return {?}
     */
    headerColumnElements() {
        let /** @type {?} */ result = [];
        if (this.table.element.nativeElement.children) {
            const /** @type {?} */ list = this.table.element.nativeElement.children;
            result = this.caption ? list[1].children[0].children : list[0].children[0].children;
        }
        return result;
    }
    /**
     * @param {?} id
     * @return {?}
     */
    headerById(id) {
        let /** @type {?} */ h;
        for (const /** @type {?} */ i in this.headers) {
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
        let /** @type {?} */ count = 0;
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
     * @param {?} event
     * @param {?} item
     * @return {?}
     */
    keydown(event, item) {
        const /** @type {?} */ code = event.which;
        if ((code === 13) || (code === 32)) {
            item.click();
        }
    }
    /**
     * @param {?} item
     * @return {?}
     */
    offScreenMessage(item) {
        let /** @type {?} */ message = this.action;
        this.actionKeys.map((key) => { message = message.replace(key, item[key.substring(1, key.length - 1)]); });
        return message;
    }
    /**
     * @param {?} item
     * @param {?} header
     * @return {?}
     */
    cellContent(item, header) {
        let /** @type {?} */ content = this.itemValue(item, header.key.split("."));
        return (content !== undefined && content != null) ? content : '&nbsp;';
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
        const /** @type {?} */ code = event.which;
        header.filter = event.target.value;
        if (code === 13) {
            this.filterItems();
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
        const /** @type {?} */ oldInfo = this.pageInfo;
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
        setTimeout(() => {
            const /** @type {?} */ content = this.el.nativeElement.innerHTML;
            this.printMode = false;
            this.pageInfo = oldInfo;
            const /** @type {?} */ popupWin = window.open('', '_blank', 'width=300,height=300');
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
        let /** @type {?} */ result = false;
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
                const /** @type {?} */ f = filterBy.substring(1);
                result = value.toLowerCase().indexOf(f) !== value.length - f.length;
            }
            else if (filterBy[0] !== '*' && filterBy[filterBy.length - 1] === '*') {
                const /** @type {?} */ f = filterBy.substring(0, filterBy.length - 1);
                result = value.toLowerCase().indexOf(f) !== 0;
            }
            else if (filterBy[0] === '*' && filterBy[filterBy.length - 1] === '*') {
                const /** @type {?} */ f = filterBy.substring(1, filterBy.length - 1);
                result = value.toLowerCase().indexOf(f) < 0;
            }
            else {
                result = value.toLowerCase().indexOf(filterBy) < 0;
            }
        }
        return result;
    }
    /**
     * @return {?}
     */
    filterItems() {
        this.filteredItems = this.items.filter((item) => {
            let /** @type {?} */ keepItem = true;
            for (let /** @type {?} */ i = 0; i < this.headers.length; i++) {
                const /** @type {?} */ header = this.headers[i];
                if (header.filter && header.filter.length) {
                    const /** @type {?} */ v2 = header.filter.toLowerCase();
                    const /** @type {?} */ v = this.itemValue(item, header.key.split("."));
                    if (this.shouldSkipItem(v, v2)) {
                        keepItem = false;
                        break;
                    }
                }
            }
            return keepItem;
        });
        this.onfilter.emit(this.filteredItems);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onTableCellEdit(event) {
        const /** @type {?} */ id = event.id.split("-");
        const /** @type {?} */ name = event.name;
        const /** @type {?} */ value = event.value;
        const /** @type {?} */ item = this.items[parseInt(id[1])];
        if (item) {
            const /** @type {?} */ list = id[0].split(".");
            let /** @type {?} */ subitem = item[list[0]];
            for (let /** @type {?} */ i = 1; i < (list.length - 1); i++) {
                subitem = subitem[list[i]];
            }
            if (subitem && list.length > 1) {
                subitem[list[list.length - 1]] = value;
            }
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
                template: `
<table [class]="tableClass"  #flexible>
    <caption *ngIf="caption" [textContent]="caption"></caption>
    <thead>
        <tr>
            <th scope="col" *ngIf="enableIndexing && !printMode" id="indexable" class="indexable"></th>
            <th scope="col" *ngFor="let header of headers"
                [dragEnabled]="dragEnabled.bind(this)"
                [dropEnabled]="dropEnabled.bind(this)"
                [medium]="header"
                (onDragStart)="onDragStart($event)"
                (onDragEnd)="onDragEnd($event)"
                (onDrop)="onDrop($event)"
                [id]="header.key"
                [attr.width]="header.width ? header.width : null"
                [style.min-width]="header.minwidth ? header.minwidth : ''"
                [attr.tabindex]="header.sortable ? 0 : -1"
                (keydown)="keydown($event, th)" (click)="sort(header, icon)">
                <span *ngIf="!printMode && header.sortable" class="off-screen"  [textContent]="vocabulary.clickSort"></span>
                <span class="locker icon fa" #locker
                        *ngIf="!printMode && lockable && (headers.length > 1 || header.locked)"
                        tabindex="0"
                        title="lock/unlock this column"
                        (keydown)="keydown($event, locker)" (click)="lock(header, $event)"
                        [class.fa-lock]="header.locked"
                        [class.fa-unlock]="!header.locked"></span>
                <span class="title"
                        [class.dragable]="header.dragable"
                        [textContent]="header.value"></span>
                <span class="icon fa"
                        *ngIf="!printMode && items && items.length" #icon
                        [class.fa-sort]="header.sortable"
                        [class.fa-sort-asc]="header.assending"
                        [class.fa-sort-desc]="header.desending"></span>
            </th>
            <th scope="col" *ngIf="action && !printMode" id="actionable" class="actionable"></th>
        </tr>
    </thead>
    <tbody>
        <tr *ngIf="!printMode && enableFiltering && items && items.length">
            <td scope="row" *ngIf="enableIndexing && !printMode" class="index filter">
                <input type="text" disabled style="opacity:0" />
            </td>
            <td scope="row"
                        *ngFor="let header of headers; let i=index"
                        [attr.data-label]="header.value"
                        class="filter">
                <span *ngIf="header.filter === undefined">&nbsp;</span>
                <input  *ngIf="header.filter !== undefined"
                        id="filter-{{i}}"
                        type="text"
                        (keyup)="changeFilter($event, header)"
                        [value]="header.filter ? header.filter : ''" />
                <label *ngIf="header.filter !== undefined" for="filter-{{i}}" ><span class="off-screen" >Filter "{{header.value}}"</span><span class="fa fa-search"></span></label>
            </td>
            <td scope="row" *ngIf="action && !printMode"></td>
        </tr>
       <ng-template ngFor let-item [ngForOf]="filteredItems" let-i="index">
            <tr *ngIf="i >= pageInfo.from && i <= pageInfo.to "
                (click)="actionClick($event, item)"
                (mouseover)="hover(item, true)"
                (mouseout)="hover(item, false)"
                [class.pointer]="action"
                [class.hover]="item.hover"
                [class.expanded]="item.expanded"
                [class.odd]="i%2">
                <td scope="row" class="index" *ngIf="enableIndexing && !printMode">{{i + 1}}</td>
                <td scope="row"
                    *ngFor="let header of headers"
                    [attr.data-label]="header.value"
                    [intoName]="header.value"
                    [intoId]="header.key + '-' + i"
                    [into]="header.format"
                    [rawContent]="cellContent(item, header)"
                    [onComponentChange]="onTableCellEdit.bind(this)"></td>
                <td scope="row" *ngIf="action && !printMode">
                    <a class="actionable"
                        *ngIf="expandable(item, true)"
                        tabindex="0"
                        role="button"
                        style="cursor:pointer"
                        [class.expanded]="item.expanded" #clicker
                        (keydown)="keydown($event, clicker)" (click)="actionClick($event, item)">
                        <span
                            class="icon fa"
                            [class.fa-angle-right]="!rowDetailer"
                            [class.fa-minus-square-o]="rowDetailer && item.expanded"
                            [class.fa-plus-square-o]="rowDetailer && !item.expanded"
                            aria-hidden="true"></span>
                        <span class="off-screen" [textContent]="offScreenMessage(item)"></span>
                    </a>
                </td>
            </tr>
            <tr *ngIf="rowDetailer && item.expanded" class="detail" [class.odd]="i%2">
                <td scope="row" class="index" *ngIf="enableIndexing && !printMode"></td>
                <td [attr.colspan]="columnsCount()">
                    <ng-container [ngTemplateOutlet]="rowDetailer" [ngTemplateOutletContext]="rowDetailerContext(item)"></ng-container>
                </td>
            </tr>
        </ng-template>
    </tbody>
</table>
`,
                styles: [`:host{display:inline-block!important;width:100%;position:relative;margin:0 auto;border-spacing:0;border-collapse:collapse}:host .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host table{margin:1rem auto;padding:0;width:100%;table-layout:fixed;max-width:99%;background-color:transparent;border-collapse:collapse}:host table caption{background-color:#c3e5e2;border-radius:2px;color:#1b1b1b;caption-side:top;font-size:14px;padding:5px 6px;margin-bottom:15px;text-align:left}:host table thead{border-top:1px solid #bbb;border-bottom:1px solid #bbb;background-color:#eee}:host table tr{border:0}:host table tr.expanded td{font-weight:700}:host table td{padding-left:3px}:host table td:first-child{padding-left:5px}:host table td .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host table td.filter{padding:0;position:relative}:host table td.filter input{-webkit-box-sizing:border-box;box-sizing:border-box;width:100%;padding:5px}:host table td.filter .fa{position:absolute;top:7px;right:2px;color:#bad}:host table td ::ng-deep img{height:24px}:host table td.index{background-color:#eee;border-right:1px solid #bbb}:host table th{cursor:default;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none;height:24px;position:relative;white-space:nowrap;font-weight:400;text-transform:uppercase;font-size:14px;padding-top:6px;padding-bottom:6px;text-align:left}:host table th.drag-over{background-color:#9b9b9b}:host table th.drag-over .icon,:host table th.drag-over .title{color:#eee}:host table th:first-child{padding-left:5px}:host table th.ascending,:host table th.descending,:host table th.sortable{cursor:pointer;height:12px}:host table th.indexable{width:33px}:host table th.actionable{width:24px}:host table th .title{color:#254a4d;display:inline-block;height:20px;white-space:nowrap}:host table th .dragable{cursor:move}:host table th .icon{width:22px;display:inline-block;height:20px;color:#254a4d}:host .fa.fa-angle-right{font-size:18px}table tr.expanded td{border-bottom:0}table tr.detail td{border-top:0;cursor:default}table tr.expanded td a.expanded{background-position:right 2px}table tbody tr.hover,table tbody tr:hover{background-color:#ffeed2}table tbody tr.detail.hover,table tbody tr.detail.hover td table thead tr,table tbody tr.detail:hover,table tbody tr.detail:hover td table thead tr{background-color:inherit}table tr td a.actionable{display:inline-table;height:32px;vertical-align:middle;width:25px;line-height:30px;color:#254a4d}table tbody tr.detail.hover td:last-child,table tbody tr.detail:hover td:last-child{border-right:0}table tbody tr.detail.hover td:first-child,table tbody tr.detail:hover td:first-child{border-left:0}table tr td{border-bottom:1px solid #b1b3b3;color:#254a5d;font-size:15px;text-transform:capitalize}table tbody tr.pointer{cursor:pointer}table.alert-danger{border:0}table.alert-danger caption{background-color:transparent;font-weight:700;margin-bottom:0}table.alert-danger td{border-bottom:0;display:block}table.alert-danger td:first-child{padding-left:0}table.alert-danger td:last-child{border-bottom:0}table.alert-danger td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase;width:20%}table.alert-danger td a span.icon{width:100%}table.alert-danger thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}table.alert-danger tr{border:2px solid #fff;display:block;margin-bottom:.625em;padding:5px;border-radius:5px}table.alert-danger tr th.actionable{width:inherit}table.alert-danger tr td{border-bottom:0}@media screen and (max-width:600px){table{border:0}table td{border-bottom:0;display:block;text-align:right}table td:first-child{padding-left:0}table td:last-child{border-bottom:0}table td.filter input{width:50%!important}table td.filter .fa{right:7px!important}table td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase}table td a span.icon{width:100%}table thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}table tr{border-bottom:3px solid #ddd;display:block;margin-bottom:.625em}table tr th.actionable{width:inherit}table tr td{border-bottom:0}table.alert-danger td:before{width:inherit}}`]
            },] },
];
/** @nocollapse */
TableViewComponent.ctorParameters = () => [
    { type: ElementRef, },
];
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
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
        if (this.persistenceKey) {
            const /** @type {?} */ headers = this.generator.retreiveHeaders(this.persistenceKey, this.persistenceId);
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
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    changeUnlockedTableFilteredItems(event) {
        if (this.unlockedTable) {
            this.unlockedTable.filteredItems = event;
        }
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
}
LockTableComponent.decorators = [
    { type: Component, args: [{
                selector: 'lock-table',
                template: `<div class="caption">
	<table-configuration
		*ngIf="configurable"
		[headers]="headers"
		[title]="vocabulary.configureColumns"
		[action]="vocabulary.configureTable"
		(onchange)="reconfigure($event)"></table-configuration>
	<div *ngIf="caption" [textContent]="caption"></div>
</div>
<div class="smart-table-wrap" (scroll)="scroll($event)">
	<table-view #lockedTable
		class="locked-table"
		lockable="true"
		[headers]="lockedHeaders"
		[items]="filteredItems"
        [pageInfo]="pageInfo"
        [vocabulary]="vocabulary"
		[enableIndexing]="enableIndexing"
		[enableFiltering]="enableFiltering"
        [rowDetailer]="rowDetailer"
		[actionable]="actionable"
		(onchange)="onlock($event)"
		(onDrop)="onDrop($event)"
		(onfilter)="changeUnlockedTableFilteredItems($event)"
		(onaction)="tableAction($event)"></table-view>
    <table-view #unlockedTable
		class="unlocked-table"
		lockable="true"
		[headers]="unlockedHeaders"
		[items]="filteredItems"
        [pageInfo]="pageInfo"
        [vocabulary]="vocabulary"
		[enableFiltering]="enableFiltering"
        [rowDetailer]="rowDetailer"
        [actionable]="actionable"
		(onDrop)="onDrop($event)"
		(onchange)="onlock($event)"
		(onfilter)="changeLockedTableFilteredItems($event)"
		(onaction)="tableAction($event)"></table-view>
</div>
<table-pagination [info]="pageInfo" [vocabulary]="vocabulary" #pager></table-pagination>
`,
                styles: [`:host{width:100%;position:relative;margin:0 auto;display:table}:host .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host .caption{background-color:#c3e5e2;border-radius:2px;-webkit-box-sizing:border-box;box-sizing:border-box;color:#1b1b1b;caption-side:top;font-size:14px;margin-bottom:15px;padding:5px 6px;text-align:left;width:100%}:host .caption table-configuration{display:inline-block;float:right;position:unset}:host .smart-table-wrap{border-spacing:0;border-collapse:collapse;border-right:1px solid #aaa;border-bottom:1px solid #aaa;-webkit-box-sizing:border-box;box-sizing:border-box;width:100%;position:relative;overflow-x:auto}:host .smart-table-wrap .unlocked-table ::ng-deep table{max-width:100%;margin-bottom:0;margin-top:0}:host .smart-table-wrap .unlocked-table ::ng-deep table th .locker{cursor:pointer;color:#00925b;text-align:center}:host .smart-table-wrap .unlocked-table ::ng-deep table td,:host .smart-table-wrap .unlocked-table ::ng-deep table th{white-space:nowrap;min-height:23px!important}:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr{background-color:#fff}:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr.hover,:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr:hover{background-color:#ffeed2}:host .smart-table-wrap .unlocked-table ::ng-deep table img{height:14px}:host .smart-table-wrap .locked-table{position:absolute;margin:0 auto;display:inline-table;border-spacing:0;border-collapse:collapse;float:left;z-index:2;width:auto}:host .smart-table-wrap .locked-table ::ng-deep table{display:inline-block;border-right:1px solid #aaa;margin:0;width:auto}:host .smart-table-wrap .locked-table ::ng-deep table th .locker{cursor:pointer;color:#8b0224;text-align:center}:host .smart-table-wrap .locked-table ::ng-deep table td,:host .smart-table-wrap .locked-table ::ng-deep table th{white-space:nowrap;min-height:23px!important}:host .smart-table-wrap .locked-table ::ng-deep table tbody tr{background-color:#fff}:host .smart-table-wrap .locked-table ::ng-deep table tbody tr.hover,:host .smart-table-wrap .locked-table ::ng-deep table tbody tr:hover{background-color:#ffeed2}:host .smart-table-wrap .locked-table ::ng-deep table img{height:14px}@media screen and (max-width:600px){.smart-table-wrap{border:0!important;position:unset;overflow-x:unset}.smart-table-wrap .unlocked-table{margin-left:0!important}.smart-table-wrap .unlocked-table ::ng-deep table td,.smart-table-wrap .unlocked-table ::ng-deep table th{white-space:unset}.smart-table-wrap .unlocked-table ::ng-deep table img{height:30px}.smart-table-wrap .locked-table{position:unset!important;margin:0!important;display:table;left:0!important}.smart-table-wrap .locked-table ::ng-deep table{display:table!important;margin:0!important;width:100%!important}.smart-table-wrap .locked-table ::ng-deep table td,.smart-table-wrap .locked-table ::ng-deep table th{white-space:unset}.smart-table-wrap .locked-table ::ng-deep table img{height:30px}}`]
            },] },
];
/** @nocollapse */
LockTableComponent.ctorParameters = () => [
    { type: TableHeadersGenerator, },
    { type: Renderer, },
];
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
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
            },] },
];
/** @nocollapse */
FlexibleTableModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { FlexibleTableComponent, FlexibleTableModule, ConfigurationComponent as ɵc, PaginationComponent as ɵd, TableHeadersGenerator as ɵa, TableViewComponent as ɵe, LockTableComponent as ɵb };
//# sourceMappingURL=flexible-table.js.map
