/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { TableHeadersGenerator } from './components/table-headers-generator';
import { TableViewComponent } from './components/table.component';
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
        this.onCellContentEdit = new EventEmitter();
        this.onconfigurationchange = new EventEmitter();
    }
    /**
     * @return {?}
     */
    FlexibleTableComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (this.persistenceKey) {
            /** @type {?} */
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
    /**
     * @return {?}
     */
    FlexibleTableComponent.prototype.updateLimits = /**
     * @return {?}
     */
    function () {
        this.subHeaders = this.headers.filter(function (header) { return header.present === true; });
    };
    /**
     * @param {?} event
     * @return {?}
     */
    FlexibleTableComponent.prototype.reconfigure = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.headers = event;
        this.updateLimits();
        this.onconfigurationchange.emit(event);
        if (this.persistenceKey) {
            this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    FlexibleTableComponent.prototype.onPaginationChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.pageInfo = event;
        this.viewTable.evaluateRows();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    FlexibleTableComponent.prototype.tableAction = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.onaction.emit(event);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    FlexibleTableComponent.prototype.onDrop = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
    };
    /**
     * @param {?} event
     * @return {?}
     */
    FlexibleTableComponent.prototype.onCellEdit = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.onCellContentEdit.emit(event);
    };
    FlexibleTableComponent.decorators = [
        { type: Component, args: [{
                    selector: 'flexible-table',
                    template: "\r\n<div class=\"flexible-table\">\r\n    <table-configuration\r\n        *ngIf=\"configurable && items && items.length\"\r\n        class=\"table-configuration\" \r\n        [headers]=\"headers\" \r\n        [title]=\"vocabulary.configureColumns\" \r\n        [printTable]=\"vocabulary.printTable\"\r\n        [action]=\"vocabulary.configureTable\"\r\n        [configAddon]=\"configAddon\"\r\n        (onprint)=\"viewTable.print()\"\r\n        (onchange)=\"reconfigure($event)\"></table-configuration>\r\n        \r\n    <table-view #viewTable\r\n        [action]=\"action\"\r\n        [actionKeys]=\"actionKeys\"\r\n\t\t[tableClass]=\"tableClass\"\r\n\t\t[tableInfo]=\"tableInfo\"\r\n\t\t[caption]=\"caption\" \r\n\t\t[headers]=\"subHeaders\" \r\n        [items]=\"items\" \r\n        [filterwhiletyping]=\"filterwhiletyping\"\r\n        [pageInfo]=\"pageInfo\"\r\n        [vocabulary]=\"vocabulary\"\r\n\t\t[enableIndexing]=\"enableIndexing\"\r\n\t\t[enableFiltering]=\"enableFiltering\"\r\n        [rowDetailer]=\"rowDetailer\"\r\n        [rowDetailerHeaders]=\"rowDetailerHeaders\"\r\n        [expandable]=\"expandable\"\r\n        [expandIf]=\"expandIf\"\r\n        (onDrop)=\"onDrop($event)\"\r\n\t\t(onCellContentEdit)=\"onCellEdit($event)\"\r\n        (onchange)=\"reconfigure($event)\"\r\n\t\t(onaction)=\"tableAction($event)\"></table-view>\r\n</div>\r\n<table-pagination \r\n    [info]=\"pageInfo\" \r\n    [vocabulary]=\"vocabulary\"\r\n    (onchange)=\"onPaginationChange($event)\"></table-pagination>\r\n",
                    styles: [":host{display:inline-block!important;width:100%}.flexible-table{position:relative;margin:0 auto;display:table;border-spacing:0;border-collapse:collapse}.flexible-table .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table{margin:1rem auto;padding:0;width:100%;table-layout:fixed;max-width:99%;background-color:transparent;border-collapse:collapse}.flexible-table table caption{background-color:#c3e5e2;border-radius:2px;color:#1b1b1b;caption-side:top;font-size:14px;padding:5px 6px;margin-bottom:15px;text-align:left}.flexible-table table thead{border-top:1px solid #bbb;border-bottom:1px solid #bbb;background-color:#eee}.flexible-table table tr{border:0}.flexible-table table tr.expanded td{font-weight:700;border-bottom:0}.flexible-table table td{padding-left:3px}.flexible-table table td:first-child{padding-left:5px}.flexible-table table td .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table td.index{background-color:#eee;border-right:1px solid #bbb}.flexible-table table th{cursor:default;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none;height:24px;position:relative;white-space:nowrap;font-weight:400;text-transform:uppercase;font-size:14px;padding-top:6px;padding-bottom:6px;text-align:left}.flexible-table table th.drag-over{background-color:#9b9b9b}.flexible-table table th.drag-over .icon,.flexible-table table th.drag-over .title{color:#eee}.flexible-table table th:first-child{padding-left:5px}.flexible-table table th.ascending,.flexible-table table th.descending,.flexible-table table th.sortable{cursor:pointer;height:12px}.flexible-table table th.indexable{width:33px}.flexible-table table th.actionable{width:24px}.flexible-table table th .title{color:#254a4d;display:inline-block;height:20px;white-space:nowrap}.flexible-table table th .dragable{cursor:move}.flexible-table table th .icon{width:22px;display:inline-block;height:20px;color:#254a4d}.flexible-table .fa.fa-angle-right{font-size:18px}.flexible-table table tr.detail td{border-top:0;cursor:default}.flexible-table table tr.expanded td a.expanded{background-position:right 2px}.flexible-table table tbody tr:hover{background-color:#ffeed2}.flexible-table table tbody tr.detail:hover,.flexible-table table tbody tr.detail:hover td table thead tr{background-color:inherit}.flexible-table table tr td a.actionable{display:inline-table;height:32px;vertical-align:middle;width:25px;line-height:30px;color:#254a4d}.flexible-table table tbody tr.detail:hover td:last-child{border-right:0}.flexible-table table tbody tr.detail:hover td:first-child{border-left:0}.flexible-table table tr td{border-bottom:1px solid #b1b3b3;color:#254a5d;font-size:15px;text-transform:capitalize}.flexible-table table tbody tr.pointer{cursor:pointer}.flexible-table table.alert-danger{border:0}.flexible-table table.alert-danger caption{background-color:transparent;font-weight:700;margin-bottom:0}.flexible-table table.alert-danger td{border-bottom:0;display:block}.flexible-table table.alert-danger td:first-child{padding-left:0}.flexible-table table.alert-danger td:last-child{border-bottom:0}.flexible-table table.alert-danger td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase;width:20%}.flexible-table table.alert-danger td a span.icon{width:100%}.flexible-table table.alert-danger thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table.alert-danger tr{border:2px solid #fff;display:block;margin-bottom:.625em;padding:5px;border-radius:5px}.flexible-table table.alert-danger tr th.actionable{width:inherit}.flexible-table table.alert-danger tr td{border-bottom:0}@media screen and (max-width:600px){.flexible-table table{border:0}.flexible-table table td{border-bottom:0;display:block;text-align:right}.flexible-table table td:first-child{padding-left:0}.flexible-table table td:last-child{border-bottom:0}.flexible-table table td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase}.flexible-table table td a span.icon{width:100%}.flexible-table table thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table tr{border-bottom:3px solid #ddd;display:block;margin-bottom:.625em}.flexible-table table tr th.actionable{width:inherit}.flexible-table table tr td{border-bottom:0}.flexible-table table.alert-danger td:before{width:inherit}}"]
                }] }
    ];
    /** @nocollapse */
    FlexibleTableComponent.ctorParameters = function () { return [
        { type: TableHeadersGenerator }
    ]; };
    FlexibleTableComponent.propDecorators = {
        vocabulary: [{ type: Input, args: ["vocabulary",] }],
        persistenceId: [{ type: Input, args: ["persistenceId",] }],
        persistenceKey: [{ type: Input, args: ["persistenceKey",] }],
        caption: [{ type: Input, args: ["caption",] }],
        action: [{ type: Input, args: ["action",] }],
        actionKeys: [{ type: Input, args: ["actionKeys",] }],
        tableClass: [{ type: Input, args: ["tableClass",] }],
        headers: [{ type: Input, args: ["headers",] }],
        items: [{ type: Input, args: ["items",] }],
        pageInfo: [{ type: Input, args: ["pageInfo",] }],
        tableInfo: [{ type: Input, args: ["tableInfo",] }],
        configurable: [{ type: Input, args: ["configurable",] }],
        configAddon: [{ type: Input, args: ["configAddon",] }],
        enableIndexing: [{ type: Input, args: ["enableIndexing",] }],
        enableFiltering: [{ type: Input, args: ["enableFiltering",] }],
        rowDetailer: [{ type: Input, args: ["rowDetailer",] }],
        expandable: [{ type: Input, args: ["expandable",] }],
        expandIf: [{ type: Input, args: ["expandIf",] }],
        filterwhiletyping: [{ type: Input, args: ["filterwhiletyping",] }],
        rowDetailerHeaders: [{ type: Input, args: ["rowDetailerHeaders",] }],
        onaction: [{ type: Output, args: ['onaction',] }],
        onCellContentEdit: [{ type: Output, args: ['onCellContentEdit',] }],
        onconfigurationchange: [{ type: Output, args: ['onconfigurationchange',] }],
        viewTable: [{ type: ViewChild, args: ['viewTable',] }]
    };
    return FlexibleTableComponent;
}());
export { FlexibleTableComponent };
if (false) {
    /** @type {?} */
    FlexibleTableComponent.prototype.subHeaders;
    /** @type {?} */
    FlexibleTableComponent.prototype.vocabulary;
    /** @type {?} */
    FlexibleTableComponent.prototype.persistenceId;
    /** @type {?} */
    FlexibleTableComponent.prototype.persistenceKey;
    /** @type {?} */
    FlexibleTableComponent.prototype.caption;
    /** @type {?} */
    FlexibleTableComponent.prototype.action;
    /** @type {?} */
    FlexibleTableComponent.prototype.actionKeys;
    /** @type {?} */
    FlexibleTableComponent.prototype.tableClass;
    /** @type {?} */
    FlexibleTableComponent.prototype.headers;
    /** @type {?} */
    FlexibleTableComponent.prototype.items;
    /** @type {?} */
    FlexibleTableComponent.prototype.pageInfo;
    /** @type {?} */
    FlexibleTableComponent.prototype.tableInfo;
    /** @type {?} */
    FlexibleTableComponent.prototype.configurable;
    /** @type {?} */
    FlexibleTableComponent.prototype.configAddon;
    /** @type {?} */
    FlexibleTableComponent.prototype.enableIndexing;
    /** @type {?} */
    FlexibleTableComponent.prototype.enableFiltering;
    /** @type {?} */
    FlexibleTableComponent.prototype.rowDetailer;
    /** @type {?} */
    FlexibleTableComponent.prototype.expandable;
    /** @type {?} */
    FlexibleTableComponent.prototype.expandIf;
    /** @type {?} */
    FlexibleTableComponent.prototype.filterwhiletyping;
    /** @type {?} */
    FlexibleTableComponent.prototype.rowDetailerHeaders;
    /** @type {?} */
    FlexibleTableComponent.prototype.onaction;
    /** @type {?} */
    FlexibleTableComponent.prototype.onCellContentEdit;
    /** @type {?} */
    FlexibleTableComponent.prototype.onconfigurationchange;
    /** @type {?} */
    FlexibleTableComponent.prototype.viewTable;
    /** @type {?} */
    FlexibleTableComponent.prototype.generator;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxleGlibGUudGFibGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vZmxleGlibGUtdGFibGUvIiwic291cmNlcyI6WyJzcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2ZsZXhpYmxlLnRhYmxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBTUEsT0FBTyxFQUNILFNBQVMsRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFHVCxZQUFZLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDN0UsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sOEJBQThCLENBQUM7O0lBNEY5RCxnQ0FBb0IsU0FBZ0M7UUFBaEMsY0FBUyxHQUFULFNBQVMsQ0FBdUI7MEJBaEZoQztZQUN0QixVQUFVLEVBQUUsYUFBYTtZQUN6QixjQUFjLEVBQUUsaUJBQWlCO1lBQ2pDLGdCQUFnQixFQUFFLG1CQUFtQjtZQUNyQyxTQUFTLEVBQUUsZUFBZTtZQUMxQixPQUFPLEVBQUUsVUFBVTtZQUNuQixTQUFTLEVBQUUsT0FBTztZQUNsQixRQUFRLEVBQUUsTUFBTTtZQUNoQixZQUFZLEVBQUUsVUFBVTtTQUN4QjswQkFrQnNCLHdCQUF3Qjt3QkEwQzVCLElBQUksWUFBWSxFQUFFO2lDQUdULElBQUksWUFBWSxFQUFFO3FDQUdkLElBQUksWUFBWSxFQUFFO0tBS1M7Ozs7SUFFM0QseUNBQVE7OztJQUFSO1FBQ0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7O1lBQ3pCLElBQU0sT0FBTyxHQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRTVGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsSUFBSSxDQUFDLE9BQU8s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O0lBRUQsdUNBQU07Ozs7SUFBTixVQUFPLEtBQWU7S0FFckI7Ozs7O0lBQ0QsMkNBQVU7Ozs7SUFBVixVQUFXLEtBQUs7UUFDZixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ25DOztnQkE5SkQsU0FBUyxTQUFDO29CQUNWLFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLDIvQ0FBOEM7O2lCQUU5Qzs7OztnQkFQUSxxQkFBcUI7Ozs2QkFZekIsS0FBSyxTQUFDLFlBQVk7Z0NBWWxCLEtBQUssU0FBQyxlQUFlO2lDQUd4QixLQUFLLFNBQUMsZ0JBQWdCOzBCQUduQixLQUFLLFNBQUMsU0FBUzt5QkFHZixLQUFLLFNBQUMsUUFBUTs2QkFHZCxLQUFLLFNBQUMsWUFBWTs2QkFHbEIsS0FBSyxTQUFDLFlBQVk7MEJBR3JCLEtBQUssU0FBQyxTQUFTO3dCQUdmLEtBQUssU0FBQyxPQUFPOzJCQUdiLEtBQUssU0FBQyxVQUFVOzRCQUdoQixLQUFLLFNBQUMsV0FBVzsrQkFHZCxLQUFLLFNBQUMsY0FBYzs4QkFHdkIsS0FBSyxTQUFDLGFBQWE7aUNBR25CLEtBQUssU0FBQyxnQkFBZ0I7a0NBR25CLEtBQUssU0FBQyxpQkFBaUI7OEJBR3ZCLEtBQUssU0FBQyxhQUFhOzZCQUduQixLQUFLLFNBQUMsWUFBWTsyQkFHbEIsS0FBSyxTQUFDLFVBQVU7b0NBR2hCLEtBQUssU0FBQyxtQkFBbUI7cUNBR3pCLEtBQUssU0FBQyxvQkFBb0I7MkJBRzdCLE1BQU0sU0FBQyxVQUFVO29DQUdqQixNQUFNLFNBQUMsbUJBQW1CO3dDQUcxQixNQUFNLFNBQUMsdUJBQXVCOzRCQUc5QixTQUFTLFNBQUMsV0FBVzs7aUNBM0d2Qjs7U0F5QmEsc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuKiBQcm92aWRlcyByZW5kZXJpbmcgb2YgYSB0YWJsZSB3aGljaCBpcyB1c2luZyB0aGUgZ2l2ZW4gRmxleGlibGVUYWJsZUhlYWRlciBzZXQgaW5cclxuKiBvcmRlciB0byB0YWJ1bGF0ZSB0aGUgZ2l2ZW4gZGF0YS4gQXMgcGVyIGRlZmluaXRpb24gb2YgZWFyY2ggaGVhZGVyIGNvbXBvbmVudCxcclxuKiBhIGNvbHVtbiBjb3VsZCBiZSBoaWRkZW4sIHNvcnRhYmxlLCBvciBkcmFnZ2FibGUuIEVhY2ggdGFibGUgcm93IGNhbiBleHBhbmQvY29sbGFwc2VcclxuKiBvciByZXNwb25kIHRvIGEgY2xpY2sgYWN0aW9uLlxyXG4qL1xyXG5pbXBvcnQge1xyXG4gICAgQ29tcG9uZW50LFxyXG5cdElucHV0LFxyXG5cdE91dHB1dCxcclxuXHRWaWV3Q2hpbGQsXHJcblx0Vmlld0NvbnRhaW5lclJlZixcclxuXHRPbkluaXQsXHJcblx0RXZlbnRFbWl0dGVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBEcm9wRXZlbnQsIERyYWdFdmVudCB9IGZyb20gJ2RyYWctZW5hYmxlZCc7XHJcbmltcG9ydCB7IFRhYmxlSGVhZGVyc0dlbmVyYXRvciB9IGZyb20gJy4vY29tcG9uZW50cy90YWJsZS1oZWFkZXJzLWdlbmVyYXRvcic7XHJcbmltcG9ydCB7IFRhYmxlVmlld0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90YWJsZS5jb21wb25lbnQnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcblx0c2VsZWN0b3I6ICdmbGV4aWJsZS10YWJsZScsXHJcblx0dGVtcGxhdGVVcmw6ICcuL2ZsZXhpYmxlLnRhYmxlLmNvbXBvbmVudC5odG1sJyxcclxuXHRzdHlsZVVybHM6IFsnLi9mbGV4aWJsZS50YWJsZS5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBGbGV4aWJsZVRhYmxlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcblx0c3ViSGVhZGVyczphbnk7XHJcblxyXG4gICAgQElucHV0KFwidm9jYWJ1bGFyeVwiKVxyXG4gICAgcHVibGljIHZvY2FidWxhcnkgPSB7XHJcblx0XHRwcmludFRhYmxlOiBcIlByaW50IFRhYmxlXCIsXHJcblx0XHRjb25maWd1cmVUYWJsZTogXCJDb25maWd1cmUgVGFibGVcIixcclxuXHRcdGNvbmZpZ3VyZUNvbHVtbnM6IFwiQ29uZmlndXJlIENvbHVtbnNcIixcclxuXHRcdGNsaWNrU29ydDogXCJDbGljayB0byBTb3J0XCIsXHJcblx0XHRzZXRTaXplOiBcIlNldCBTaXplXCIsXHJcblx0XHRmaXJzdFBhZ2U6IFwiRmlyc3RcIixcclxuXHRcdGxhc3RQYWdlOiBcIkxhc3RcIixcclxuXHRcdHByZXZpb3VzUGFnZTogXCJQcmV2aW91c1wiXHJcblx0fTtcclxuXHRcclxuICAgIEBJbnB1dChcInBlcnNpc3RlbmNlSWRcIilcclxuICAgIHB1YmxpYyBwZXJzaXN0ZW5jZUlkOiBzdHJpbmc7XHJcblxyXG5cdEBJbnB1dChcInBlcnNpc3RlbmNlS2V5XCIpXHJcbiAgICBwdWJsaWMgcGVyc2lzdGVuY2VLZXk6IHN0cmluZztcclxuXHJcbiAgICBASW5wdXQoXCJjYXB0aW9uXCIpXHJcbiAgICBwdWJsaWMgY2FwdGlvbjogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dChcImFjdGlvblwiKVxyXG4gICAgcHVibGljIGFjdGlvbjogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dChcImFjdGlvbktleXNcIilcclxuICAgIHB1YmxpYyBhY3Rpb25LZXlzO1xyXG5cclxuICAgIEBJbnB1dChcInRhYmxlQ2xhc3NcIilcclxuICAgIHB1YmxpYyB0YWJsZUNsYXNzID0gJ2RlZmF1bHQtZmxleGlibGUtdGFibGUnO1xyXG5cclxuXHRASW5wdXQoXCJoZWFkZXJzXCIpXHJcblx0cHVibGljIGhlYWRlcnM6IGFueVtdO1xyXG5cclxuXHRASW5wdXQoXCJpdGVtc1wiKVxyXG5cdHB1YmxpYyBpdGVtczogYW55W107XHJcblxyXG5cdEBJbnB1dChcInBhZ2VJbmZvXCIpXHJcblx0cHVibGljIHBhZ2VJbmZvOiBhbnk7XHJcblxyXG5cdEBJbnB1dChcInRhYmxlSW5mb1wiKVxyXG5cdHB1YmxpYyB0YWJsZUluZm86IGFueTtcclxuXHJcbiAgICBASW5wdXQoXCJjb25maWd1cmFibGVcIilcclxuICAgIHB1YmxpYyBjb25maWd1cmFibGU6IGJvb2xlYW47XHJcblxyXG5cdEBJbnB1dChcImNvbmZpZ0FkZG9uXCIpXHJcblx0cHVibGljIGNvbmZpZ0FkZG9uOiBhbnk7XHJcblxyXG5cdEBJbnB1dChcImVuYWJsZUluZGV4aW5nXCIpXHJcbiAgICBwdWJsaWMgZW5hYmxlSW5kZXhpbmc6IGJvb2xlYW47XHJcblxyXG4gICAgQElucHV0KFwiZW5hYmxlRmlsdGVyaW5nXCIpXHJcbiAgICBwdWJsaWMgZW5hYmxlRmlsdGVyaW5nOiBib29sZWFuO1xyXG5cclxuICAgIEBJbnB1dChcInJvd0RldGFpbGVyXCIpXHJcbiAgICBwdWJsaWMgcm93RGV0YWlsZXI6IGFueTtcclxuXHJcbiAgICBASW5wdXQoXCJleHBhbmRhYmxlXCIpXHJcbiAgICBwdWJsaWMgZXhwYW5kYWJsZTogYW55O1xyXG5cclxuICAgIEBJbnB1dChcImV4cGFuZElmXCIpXHJcbiAgICBwdWJsaWMgZXhwYW5kSWY6IGJvb2xlYW47XHJcblxyXG4gICAgQElucHV0KFwiZmlsdGVyd2hpbGV0eXBpbmdcIilcclxuICAgIHB1YmxpYyBmaWx0ZXJ3aGlsZXR5cGluZzogYm9vbGVhbjtcclxuXHJcbiAgICBASW5wdXQoXCJyb3dEZXRhaWxlckhlYWRlcnNcIilcclxuICAgIHB1YmxpYyByb3dEZXRhaWxlckhlYWRlcnM6IGFueTtcclxuXHJcblx0QE91dHB1dCgnb25hY3Rpb24nKVxyXG5cdHByaXZhdGUgb25hY3Rpb24gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBPdXRwdXQoJ29uQ2VsbENvbnRlbnRFZGl0JylcclxuXHRwcml2YXRlIG9uQ2VsbENvbnRlbnRFZGl0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHRAT3V0cHV0KCdvbmNvbmZpZ3VyYXRpb25jaGFuZ2UnKVxyXG5cdHByaXZhdGUgb25jb25maWd1cmF0aW9uY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHRAVmlld0NoaWxkKCd2aWV3VGFibGUnKVxyXG5cdHZpZXdUYWJsZTogVGFibGVWaWV3Q29tcG9uZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZ2VuZXJhdG9yOiBUYWJsZUhlYWRlcnNHZW5lcmF0b3IpIHt9XHJcblxyXG5cdG5nT25Jbml0KCkge1xyXG5cdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcclxuXHRcdFx0Y29uc3QgaGVhZGVyczphbnkgPSB0aGlzLmdlbmVyYXRvci5yZXRyZWl2ZUhlYWRlcnModGhpcy5wZXJzaXN0ZW5jZUtleSwgdGhpcy5wZXJzaXN0ZW5jZUlkKTtcclxuXHJcblx0XHRcdGlmIChoZWFkZXJzKSB7XHJcblx0XHRcdFx0dGhpcy5oZWFkZXJzID0gaGVhZGVycztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKCF0aGlzLmhlYWRlcnMgfHwgdGhpcy5oZWFkZXJzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHR0aGlzLmhlYWRlcnMgPSB0aGlzLmdlbmVyYXRvci5nZW5lcmF0ZUhlYWRlcnNGb3IodGhpcy5pdGVtc1swXSxcIlwiLCA1LCB0aGlzLmVuYWJsZUZpbHRlcmluZyk7XHJcblx0XHRcdGlmICh0aGlzLnBlcnNpc3RlbmNlS2V5KSB7XHJcblx0XHRcdFx0dGhpcy5nZW5lcmF0b3IucGVyc2lzdEhlYWRlcnModGhpcy5wZXJzaXN0ZW5jZUtleSwgdGhpcy5wZXJzaXN0ZW5jZUlkLCB0aGlzLmhlYWRlcnMpO1xyXG5cdFx0XHR9XHJcbiAgICAgICAgfVxyXG5cdFx0aWYgKCF0aGlzLnJvd0RldGFpbGVyICYmIHRoaXMuZXhwYW5kYWJsZSkge1xyXG5cdFx0XHR0aGlzLnJvd0RldGFpbGVyID0gZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRcdHJldHVybiB7ZGF0YTogaXRlbSwgaGVhZGVyczogW119O1xyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMucGFnZUluZm8pIHtcclxuXHRcdFx0aWYgKCF0aGlzLnBhZ2VJbmZvLnRvKSB7XHJcblx0XHRcdFx0dGhpcy5wYWdlSW5mby50byA9IHRoaXMucGFnZUluZm8ucGFnZVNpemU7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5wYWdlSW5mby5jb250ZW50U2l6ZSA9IHRoaXMuaXRlbXMubGVuZ3RoO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5wYWdlSW5mbyA9IHtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRTaXplOiAxMDAwMDAsXHJcbiAgICAgICAgICAgICAgICBwYWdlU2l6ZTogMTAwMDAwLFxyXG4gICAgICAgICAgICAgICAgcGFnZXM6IDEsXHJcbiAgICAgICAgICAgICAgICBmcm9tOiAwLFxyXG4gICAgICAgICAgICAgICAgdG86IDEwMDAwMCxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRQYWdlOiAxLFxyXG4gICAgICAgICAgICAgICAgbWF4V2lkdGg6IFwiMFwiXHJcbiAgICAgICAgICAgIH07XHJcblx0XHR9XHJcblx0XHR0aGlzLnVwZGF0ZUxpbWl0cygpO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlTGltaXRzKCkge1xyXG5cdFx0dGhpcy5zdWJIZWFkZXJzID0gdGhpcy5oZWFkZXJzLmZpbHRlciggKGhlYWRlcikgPT4gaGVhZGVyLnByZXNlbnQgPT09IHRydWUpO1xyXG5cdH1cclxuXHJcblx0cmVjb25maWd1cmUoZXZlbnQpIHtcclxuXHRcdHRoaXMuaGVhZGVycyA9IGV2ZW50O1xyXG5cdFx0dGhpcy51cGRhdGVMaW1pdHMoKTtcclxuXHRcdHRoaXMub25jb25maWd1cmF0aW9uY2hhbmdlLmVtaXQoZXZlbnQpO1xyXG5cclxuXHRcdGlmICh0aGlzLnBlcnNpc3RlbmNlS2V5KSB7XHJcblx0XHRcdHRoaXMuZ2VuZXJhdG9yLnBlcnNpc3RIZWFkZXJzKHRoaXMucGVyc2lzdGVuY2VLZXksIHRoaXMucGVyc2lzdGVuY2VJZCwgdGhpcy5oZWFkZXJzKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG9uUGFnaW5hdGlvbkNoYW5nZShldmVudCkge1xyXG5cdFx0dGhpcy5wYWdlSW5mbyA9IGV2ZW50O1xyXG5cdFx0dGhpcy52aWV3VGFibGUuZXZhbHVhdGVSb3dzKCk7XHJcblx0fVxyXG5cclxuXHR0YWJsZUFjdGlvbihldmVudCkge1xyXG5cdFx0dGhpcy5vbmFjdGlvbi5lbWl0KGV2ZW50KVxyXG5cdH1cclxuXHJcblx0b25Ecm9wKGV2ZW50OkRyb3BFdmVudCl7XHJcblxyXG5cdH1cclxuXHRvbkNlbGxFZGl0KGV2ZW50KXtcclxuXHRcdHRoaXMub25DZWxsQ29udGVudEVkaXQuZW1pdChldmVudCk7XHJcblx0fVxyXG59XHJcbiJdfQ==