/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { TableHeadersGenerator } from './components/table-headers-generator';
import { TableViewComponent } from './components/table.component';
export class FlexibleTableComponent {
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
        this.onCellContentEdit = new EventEmitter();
        this.onconfigurationchange = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.persistenceKey) {
            /** @type {?} */
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
        this.viewTable.evaluateRows();
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
    /**
     * @param {?} event
     * @return {?}
     */
    onCellEdit(event) {
        this.onCellContentEdit.emit(event);
    }
}
FlexibleTableComponent.decorators = [
    { type: Component, args: [{
                selector: 'flexible-table',
                template: "\r\n<div class=\"flexible-table\">\r\n    <table-configuration\r\n        *ngIf=\"configurable && items && items.length\"\r\n        class=\"table-configuration\" \r\n        [headers]=\"headers\" \r\n        [title]=\"vocabulary.configureColumns\" \r\n        [printTable]=\"vocabulary.printTable\"\r\n        [action]=\"vocabulary.configureTable\"\r\n        [configAddon]=\"configAddon\"\r\n        (onprint)=\"viewTable.print()\"\r\n        (onchange)=\"reconfigure($event)\"></table-configuration>\r\n        \r\n    <table-view #viewTable\r\n        [action]=\"action\"\r\n        [actionKeys]=\"actionKeys\"\r\n\t\t[tableClass]=\"tableClass\"\r\n\t\t[tableInfo]=\"tableInfo\"\r\n\t\t[caption]=\"caption\" \r\n\t\t[headers]=\"subHeaders\" \r\n        [items]=\"items\" \r\n        [filterwhiletyping]=\"filterwhiletyping\"\r\n        [pageInfo]=\"pageInfo\"\r\n        [vocabulary]=\"vocabulary\"\r\n\t\t[enableIndexing]=\"enableIndexing\"\r\n\t\t[enableFiltering]=\"enableFiltering\"\r\n        [rowDetailer]=\"rowDetailer\"\r\n        [rowDetailerHeaders]=\"rowDetailerHeaders\"\r\n        [expandable]=\"expandable\"\r\n        [expandIf]=\"expandIf\"\r\n        (onDrop)=\"onDrop($event)\"\r\n\t\t(onCellContentEdit)=\"onCellEdit($event)\"\r\n        (onchange)=\"reconfigure($event)\"\r\n\t\t(onaction)=\"tableAction($event)\"></table-view>\r\n</div>\r\n<table-pagination \r\n    [info]=\"pageInfo\" \r\n    [vocabulary]=\"vocabulary\"\r\n    (onchange)=\"onPaginationChange($event)\"></table-pagination>\r\n",
                styles: [":host{display:inline-block!important;width:100%}.flexible-table{position:relative;margin:0 auto;display:table;border-spacing:0;border-collapse:collapse}.flexible-table .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table{margin:1rem auto;padding:0;width:100%;table-layout:fixed;max-width:99%;background-color:transparent;border-collapse:collapse}.flexible-table table caption{background-color:#c3e5e2;border-radius:2px;color:#1b1b1b;caption-side:top;font-size:14px;padding:5px 6px;margin-bottom:15px;text-align:left}.flexible-table table thead{border-top:1px solid #bbb;border-bottom:1px solid #bbb;background-color:#eee}.flexible-table table tr{border:0}.flexible-table table tr.expanded td{font-weight:700;border-bottom:0}.flexible-table table td{padding-left:3px}.flexible-table table td:first-child{padding-left:5px}.flexible-table table td .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table td.index{background-color:#eee;border-right:1px solid #bbb}.flexible-table table th{cursor:default;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none;height:24px;position:relative;white-space:nowrap;font-weight:400;text-transform:uppercase;font-size:14px;padding-top:6px;padding-bottom:6px;text-align:left}.flexible-table table th.drag-over{background-color:#9b9b9b}.flexible-table table th.drag-over .icon,.flexible-table table th.drag-over .title{color:#eee}.flexible-table table th:first-child{padding-left:5px}.flexible-table table th.ascending,.flexible-table table th.descending,.flexible-table table th.sortable{cursor:pointer;height:12px}.flexible-table table th.indexable{width:33px}.flexible-table table th.actionable{width:24px}.flexible-table table th .title{color:#254a4d;display:inline-block;height:20px;white-space:nowrap}.flexible-table table th .dragable{cursor:move}.flexible-table table th .icon{width:22px;display:inline-block;height:20px;color:#254a4d}.flexible-table .fa.fa-angle-right{font-size:18px}.flexible-table table tr.detail td{border-top:0;cursor:default}.flexible-table table tr.expanded td a.expanded{background-position:right 2px}.flexible-table table tbody tr:hover{background-color:#ffeed2}.flexible-table table tbody tr.detail:hover,.flexible-table table tbody tr.detail:hover td table thead tr{background-color:inherit}.flexible-table table tr td a.actionable{display:inline-table;height:32px;vertical-align:middle;width:25px;line-height:30px;color:#254a4d}.flexible-table table tbody tr.detail:hover td:last-child{border-right:0}.flexible-table table tbody tr.detail:hover td:first-child{border-left:0}.flexible-table table tr td{border-bottom:1px solid #b1b3b3;color:#254a5d;font-size:15px;text-transform:capitalize}.flexible-table table tbody tr.pointer{cursor:pointer}.flexible-table table.alert-danger{border:0}.flexible-table table.alert-danger caption{background-color:transparent;font-weight:700;margin-bottom:0}.flexible-table table.alert-danger td{border-bottom:0;display:block}.flexible-table table.alert-danger td:first-child{padding-left:0}.flexible-table table.alert-danger td:last-child{border-bottom:0}.flexible-table table.alert-danger td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase;width:20%}.flexible-table table.alert-danger td a span.icon{width:100%}.flexible-table table.alert-danger thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table.alert-danger tr{border:2px solid #fff;display:block;margin-bottom:.625em;padding:5px;border-radius:5px}.flexible-table table.alert-danger tr th.actionable{width:inherit}.flexible-table table.alert-danger tr td{border-bottom:0}@media screen and (max-width:600px){.flexible-table table{border:0}.flexible-table table td{border-bottom:0;display:block;text-align:right}.flexible-table table td:first-child{padding-left:0}.flexible-table table td:last-child{border-bottom:0}.flexible-table table td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase}.flexible-table table td a span.icon{width:100%}.flexible-table table thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table tr{border-bottom:3px solid #ddd;display:block;margin-bottom:.625em}.flexible-table table tr th.actionable{width:inherit}.flexible-table table tr td{border-bottom:0}.flexible-table table.alert-danger td:before{width:inherit}}"]
            }] }
];
/** @nocollapse */
FlexibleTableComponent.ctorParameters = () => [
    { type: TableHeadersGenerator }
];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxleGlibGUudGFibGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vZmxleGlibGUtdGFibGUvIiwic291cmNlcyI6WyJzcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2ZsZXhpYmxlLnRhYmxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBTUEsT0FBTyxFQUNILFNBQVMsRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFHVCxZQUFZLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDN0UsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFPbEUsTUFBTTs7OztJQXFGRixZQUFvQixTQUFnQztRQUFoQyxjQUFTLEdBQVQsU0FBUyxDQUF1QjswQkFoRmhDO1lBQ3RCLFVBQVUsRUFBRSxhQUFhO1lBQ3pCLGNBQWMsRUFBRSxpQkFBaUI7WUFDakMsZ0JBQWdCLEVBQUUsbUJBQW1CO1lBQ3JDLFNBQVMsRUFBRSxlQUFlO1lBQzFCLE9BQU8sRUFBRSxVQUFVO1lBQ25CLFNBQVMsRUFBRSxPQUFPO1lBQ2xCLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLFlBQVksRUFBRSxVQUFVO1NBQ3hCOzBCQWtCc0Isd0JBQXdCO3dCQTBDNUIsSUFBSSxZQUFZLEVBQUU7aUNBR1QsSUFBSSxZQUFZLEVBQUU7cUNBR2QsSUFBSSxZQUFZLEVBQUU7S0FLUzs7OztJQUUzRCxRQUFRO1FBQ1AsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7O1lBQ3pCLE1BQU0sT0FBTyxHQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRTVGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsSUFBSSxDQUFDLE9B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LENBQUMsS0FBSztRQUNmLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDbkM7OztZQTlKRCxTQUFTLFNBQUM7Z0JBQ1YsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsMi9DQUE4Qzs7YUFFOUM7Ozs7WUFQUSxxQkFBcUI7Ozt5QkFZekIsS0FBSyxTQUFDLFlBQVk7NEJBWWxCLEtBQUssU0FBQyxlQUFlOzZCQUd4QixLQUFLLFNBQUMsZ0JBQWdCO3NCQUduQixLQUFLLFNBQUMsU0FBUztxQkFHZixLQUFLLFNBQUMsUUFBUTt5QkFHZCxLQUFLLFNBQUMsWUFBWTt5QkFHbEIsS0FBSyxTQUFDLFlBQVk7c0JBR3JCLEtBQUssU0FBQyxTQUFTO29CQUdmLEtBQUssU0FBQyxPQUFPO3VCQUdiLEtBQUssU0FBQyxVQUFVO3dCQUdoQixLQUFLLFNBQUMsV0FBVzsyQkFHZCxLQUFLLFNBQUMsY0FBYzswQkFHdkIsS0FBSyxTQUFDLGFBQWE7NkJBR25CLEtBQUssU0FBQyxnQkFBZ0I7OEJBR25CLEtBQUssU0FBQyxpQkFBaUI7MEJBR3ZCLEtBQUssU0FBQyxhQUFhO3lCQUduQixLQUFLLFNBQUMsWUFBWTt1QkFHbEIsS0FBSyxTQUFDLFVBQVU7Z0NBR2hCLEtBQUssU0FBQyxtQkFBbUI7aUNBR3pCLEtBQUssU0FBQyxvQkFBb0I7dUJBRzdCLE1BQU0sU0FBQyxVQUFVO2dDQUdqQixNQUFNLFNBQUMsbUJBQW1CO29DQUcxQixNQUFNLFNBQUMsdUJBQXVCO3dCQUc5QixTQUFTLFNBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiogUHJvdmlkZXMgcmVuZGVyaW5nIG9mIGEgdGFibGUgd2hpY2ggaXMgdXNpbmcgdGhlIGdpdmVuIEZsZXhpYmxlVGFibGVIZWFkZXIgc2V0IGluXHJcbiogb3JkZXIgdG8gdGFidWxhdGUgdGhlIGdpdmVuIGRhdGEuIEFzIHBlciBkZWZpbml0aW9uIG9mIGVhcmNoIGhlYWRlciBjb21wb25lbnQsXHJcbiogYSBjb2x1bW4gY291bGQgYmUgaGlkZGVuLCBzb3J0YWJsZSwgb3IgZHJhZ2dhYmxlLiBFYWNoIHRhYmxlIHJvdyBjYW4gZXhwYW5kL2NvbGxhcHNlXHJcbiogb3IgcmVzcG9uZCB0byBhIGNsaWNrIGFjdGlvbi5cclxuKi9cclxuaW1wb3J0IHtcclxuICAgIENvbXBvbmVudCxcclxuXHRJbnB1dCxcclxuXHRPdXRwdXQsXHJcblx0Vmlld0NoaWxkLFxyXG5cdFZpZXdDb250YWluZXJSZWYsXHJcblx0T25Jbml0LFxyXG5cdEV2ZW50RW1pdHRlclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgRHJvcEV2ZW50LCBEcmFnRXZlbnQgfSBmcm9tICdkcmFnLWVuYWJsZWQnO1xyXG5pbXBvcnQgeyBUYWJsZUhlYWRlcnNHZW5lcmF0b3IgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUtaGVhZGVycy1nZW5lcmF0b3InO1xyXG5pbXBvcnQgeyBUYWJsZVZpZXdDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG5cdHNlbGVjdG9yOiAnZmxleGlibGUtdGFibGUnLFxyXG5cdHRlbXBsYXRlVXJsOiAnLi9mbGV4aWJsZS50YWJsZS5jb21wb25lbnQuaHRtbCcsXHJcblx0c3R5bGVVcmxzOiBbJy4vZmxleGlibGUudGFibGUuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRmxleGlibGVUYWJsZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG5cdHN1YkhlYWRlcnM6YW55O1xyXG5cclxuICAgIEBJbnB1dChcInZvY2FidWxhcnlcIilcclxuICAgIHB1YmxpYyB2b2NhYnVsYXJ5ID0ge1xyXG5cdFx0cHJpbnRUYWJsZTogXCJQcmludCBUYWJsZVwiLFxyXG5cdFx0Y29uZmlndXJlVGFibGU6IFwiQ29uZmlndXJlIFRhYmxlXCIsXHJcblx0XHRjb25maWd1cmVDb2x1bW5zOiBcIkNvbmZpZ3VyZSBDb2x1bW5zXCIsXHJcblx0XHRjbGlja1NvcnQ6IFwiQ2xpY2sgdG8gU29ydFwiLFxyXG5cdFx0c2V0U2l6ZTogXCJTZXQgU2l6ZVwiLFxyXG5cdFx0Zmlyc3RQYWdlOiBcIkZpcnN0XCIsXHJcblx0XHRsYXN0UGFnZTogXCJMYXN0XCIsXHJcblx0XHRwcmV2aW91c1BhZ2U6IFwiUHJldmlvdXNcIlxyXG5cdH07XHJcblx0XHJcbiAgICBASW5wdXQoXCJwZXJzaXN0ZW5jZUlkXCIpXHJcbiAgICBwdWJsaWMgcGVyc2lzdGVuY2VJZDogc3RyaW5nO1xyXG5cclxuXHRASW5wdXQoXCJwZXJzaXN0ZW5jZUtleVwiKVxyXG4gICAgcHVibGljIHBlcnNpc3RlbmNlS2V5OiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KFwiY2FwdGlvblwiKVxyXG4gICAgcHVibGljIGNhcHRpb246IHN0cmluZztcclxuXHJcbiAgICBASW5wdXQoXCJhY3Rpb25cIilcclxuICAgIHB1YmxpYyBhY3Rpb246IHN0cmluZztcclxuXHJcbiAgICBASW5wdXQoXCJhY3Rpb25LZXlzXCIpXHJcbiAgICBwdWJsaWMgYWN0aW9uS2V5cztcclxuXHJcbiAgICBASW5wdXQoXCJ0YWJsZUNsYXNzXCIpXHJcbiAgICBwdWJsaWMgdGFibGVDbGFzcyA9ICdkZWZhdWx0LWZsZXhpYmxlLXRhYmxlJztcclxuXHJcblx0QElucHV0KFwiaGVhZGVyc1wiKVxyXG5cdHB1YmxpYyBoZWFkZXJzOiBhbnlbXTtcclxuXHJcblx0QElucHV0KFwiaXRlbXNcIilcclxuXHRwdWJsaWMgaXRlbXM6IGFueVtdO1xyXG5cclxuXHRASW5wdXQoXCJwYWdlSW5mb1wiKVxyXG5cdHB1YmxpYyBwYWdlSW5mbzogYW55O1xyXG5cclxuXHRASW5wdXQoXCJ0YWJsZUluZm9cIilcclxuXHRwdWJsaWMgdGFibGVJbmZvOiBhbnk7XHJcblxyXG4gICAgQElucHV0KFwiY29uZmlndXJhYmxlXCIpXHJcbiAgICBwdWJsaWMgY29uZmlndXJhYmxlOiBib29sZWFuO1xyXG5cclxuXHRASW5wdXQoXCJjb25maWdBZGRvblwiKVxyXG5cdHB1YmxpYyBjb25maWdBZGRvbjogYW55O1xyXG5cclxuXHRASW5wdXQoXCJlbmFibGVJbmRleGluZ1wiKVxyXG4gICAgcHVibGljIGVuYWJsZUluZGV4aW5nOiBib29sZWFuO1xyXG5cclxuICAgIEBJbnB1dChcImVuYWJsZUZpbHRlcmluZ1wiKVxyXG4gICAgcHVibGljIGVuYWJsZUZpbHRlcmluZzogYm9vbGVhbjtcclxuXHJcbiAgICBASW5wdXQoXCJyb3dEZXRhaWxlclwiKVxyXG4gICAgcHVibGljIHJvd0RldGFpbGVyOiBhbnk7XHJcblxyXG4gICAgQElucHV0KFwiZXhwYW5kYWJsZVwiKVxyXG4gICAgcHVibGljIGV4cGFuZGFibGU6IGFueTtcclxuXHJcbiAgICBASW5wdXQoXCJleHBhbmRJZlwiKVxyXG4gICAgcHVibGljIGV4cGFuZElmOiBib29sZWFuO1xyXG5cclxuICAgIEBJbnB1dChcImZpbHRlcndoaWxldHlwaW5nXCIpXHJcbiAgICBwdWJsaWMgZmlsdGVyd2hpbGV0eXBpbmc6IGJvb2xlYW47XHJcblxyXG4gICAgQElucHV0KFwicm93RGV0YWlsZXJIZWFkZXJzXCIpXHJcbiAgICBwdWJsaWMgcm93RGV0YWlsZXJIZWFkZXJzOiBhbnk7XHJcblxyXG5cdEBPdXRwdXQoJ29uYWN0aW9uJylcclxuXHRwcml2YXRlIG9uYWN0aW9uID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHRAT3V0cHV0KCdvbkNlbGxDb250ZW50RWRpdCcpXHJcblx0cHJpdmF0ZSBvbkNlbGxDb250ZW50RWRpdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0QE91dHB1dCgnb25jb25maWd1cmF0aW9uY2hhbmdlJylcclxuXHRwcml2YXRlIG9uY29uZmlndXJhdGlvbmNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0QFZpZXdDaGlsZCgndmlld1RhYmxlJylcclxuXHR2aWV3VGFibGU6IFRhYmxlVmlld0NvbXBvbmVudDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGdlbmVyYXRvcjogVGFibGVIZWFkZXJzR2VuZXJhdG9yKSB7fVxyXG5cclxuXHRuZ09uSW5pdCgpIHtcclxuXHRcdGlmICh0aGlzLnBlcnNpc3RlbmNlS2V5KSB7XHJcblx0XHRcdGNvbnN0IGhlYWRlcnM6YW55ID0gdGhpcy5nZW5lcmF0b3IucmV0cmVpdmVIZWFkZXJzKHRoaXMucGVyc2lzdGVuY2VLZXksIHRoaXMucGVyc2lzdGVuY2VJZCk7XHJcblxyXG5cdFx0XHRpZiAoaGVhZGVycykge1xyXG5cdFx0XHRcdHRoaXMuaGVhZGVycyA9IGhlYWRlcnM7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmICghdGhpcy5oZWFkZXJzIHx8IHRoaXMuaGVhZGVycy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0dGhpcy5oZWFkZXJzID0gdGhpcy5nZW5lcmF0b3IuZ2VuZXJhdGVIZWFkZXJzRm9yKHRoaXMuaXRlbXNbMF0sXCJcIiwgNSwgdGhpcy5lbmFibGVGaWx0ZXJpbmcpO1xyXG5cdFx0XHRpZiAodGhpcy5wZXJzaXN0ZW5jZUtleSkge1xyXG5cdFx0XHRcdHRoaXMuZ2VuZXJhdG9yLnBlcnNpc3RIZWFkZXJzKHRoaXMucGVyc2lzdGVuY2VLZXksIHRoaXMucGVyc2lzdGVuY2VJZCwgdGhpcy5oZWFkZXJzKTtcclxuXHRcdFx0fVxyXG4gICAgICAgIH1cclxuXHRcdGlmICghdGhpcy5yb3dEZXRhaWxlciAmJiB0aGlzLmV4cGFuZGFibGUpIHtcclxuXHRcdFx0dGhpcy5yb3dEZXRhaWxlciA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0XHRyZXR1cm4ge2RhdGE6IGl0ZW0sIGhlYWRlcnM6IFtdfTtcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLnBhZ2VJbmZvKSB7XHJcblx0XHRcdGlmICghdGhpcy5wYWdlSW5mby50bykge1xyXG5cdFx0XHRcdHRoaXMucGFnZUluZm8udG8gPSB0aGlzLnBhZ2VJbmZvLnBhZ2VTaXplO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMucGFnZUluZm8uY29udGVudFNpemUgPSB0aGlzLml0ZW1zLmxlbmd0aDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMucGFnZUluZm8gPSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50U2l6ZTogMTAwMDAwLFxyXG4gICAgICAgICAgICAgICAgcGFnZVNpemU6IDEwMDAwMCxcclxuICAgICAgICAgICAgICAgIHBhZ2VzOiAxLFxyXG4gICAgICAgICAgICAgICAgZnJvbTogMCxcclxuICAgICAgICAgICAgICAgIHRvOiAxMDAwMDAsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFnZTogMSxcclxuICAgICAgICAgICAgICAgIG1heFdpZHRoOiBcIjBcIlxyXG4gICAgICAgICAgICB9O1xyXG5cdFx0fVxyXG5cdFx0dGhpcy51cGRhdGVMaW1pdHMoKTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZUxpbWl0cygpIHtcclxuXHRcdHRoaXMuc3ViSGVhZGVycyA9IHRoaXMuaGVhZGVycy5maWx0ZXIoIChoZWFkZXIpID0+IGhlYWRlci5wcmVzZW50ID09PSB0cnVlKTtcclxuXHR9XHJcblxyXG5cdHJlY29uZmlndXJlKGV2ZW50KSB7XHJcblx0XHR0aGlzLmhlYWRlcnMgPSBldmVudDtcclxuXHRcdHRoaXMudXBkYXRlTGltaXRzKCk7XHJcblx0XHR0aGlzLm9uY29uZmlndXJhdGlvbmNoYW5nZS5lbWl0KGV2ZW50KTtcclxuXHJcblx0XHRpZiAodGhpcy5wZXJzaXN0ZW5jZUtleSkge1xyXG5cdFx0XHR0aGlzLmdlbmVyYXRvci5wZXJzaXN0SGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQsIHRoaXMuaGVhZGVycyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRvblBhZ2luYXRpb25DaGFuZ2UoZXZlbnQpIHtcclxuXHRcdHRoaXMucGFnZUluZm8gPSBldmVudDtcclxuXHRcdHRoaXMudmlld1RhYmxlLmV2YWx1YXRlUm93cygpO1xyXG5cdH1cclxuXHJcblx0dGFibGVBY3Rpb24oZXZlbnQpIHtcclxuXHRcdHRoaXMub25hY3Rpb24uZW1pdChldmVudClcclxuXHR9XHJcblxyXG5cdG9uRHJvcChldmVudDpEcm9wRXZlbnQpe1xyXG5cclxuXHR9XHJcblx0b25DZWxsRWRpdChldmVudCl7XHJcblx0XHR0aGlzLm9uQ2VsbENvbnRlbnRFZGl0LmVtaXQoZXZlbnQpO1xyXG5cdH1cclxufVxyXG4iXX0=