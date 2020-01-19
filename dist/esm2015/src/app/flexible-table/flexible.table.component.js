import * as tslib_1 from "tslib";
/*
* Provides rendering of a table which is using the given FlexibleTableHeader set in
* order to tabulate the given data. As per definition of earch header component,
* a column could be hidden, sortable, or draggable. Each table row can expand/collapse
* or respond to a click action.
*/
import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { TableHeadersGenerator } from './components/table-headers-generator';
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
        this.headerSeparation = true;
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
tslib_1.__decorate([
    Input("vocabulary")
], FlexibleTableComponent.prototype, "vocabulary", void 0);
tslib_1.__decorate([
    Input()
], FlexibleTableComponent.prototype, "headerSeparation", void 0);
tslib_1.__decorate([
    Input()
], FlexibleTableComponent.prototype, "persistenceId", void 0);
tslib_1.__decorate([
    Input()
], FlexibleTableComponent.prototype, "persistenceKey", void 0);
tslib_1.__decorate([
    Input()
], FlexibleTableComponent.prototype, "caption", void 0);
tslib_1.__decorate([
    Input()
], FlexibleTableComponent.prototype, "action", void 0);
tslib_1.__decorate([
    Input()
], FlexibleTableComponent.prototype, "actionKeys", void 0);
tslib_1.__decorate([
    Input()
], FlexibleTableComponent.prototype, "tableClass", void 0);
tslib_1.__decorate([
    Input()
], FlexibleTableComponent.prototype, "inlinePagination", void 0);
tslib_1.__decorate([
    Input()
], FlexibleTableComponent.prototype, "headers", void 0);
tslib_1.__decorate([
    Input()
], FlexibleTableComponent.prototype, "items", void 0);
tslib_1.__decorate([
    Input()
], FlexibleTableComponent.prototype, "pageInfo", void 0);
tslib_1.__decorate([
    Input()
], FlexibleTableComponent.prototype, "tableInfo", void 0);
tslib_1.__decorate([
    Input()
], FlexibleTableComponent.prototype, "configurable", void 0);
tslib_1.__decorate([
    Input()
], FlexibleTableComponent.prototype, "configAddon", void 0);
tslib_1.__decorate([
    Input()
], FlexibleTableComponent.prototype, "enableIndexing", void 0);
tslib_1.__decorate([
    Input()
], FlexibleTableComponent.prototype, "enableFiltering", void 0);
tslib_1.__decorate([
    Input()
], FlexibleTableComponent.prototype, "rowDetailer", void 0);
tslib_1.__decorate([
    Input()
], FlexibleTableComponent.prototype, "expandable", void 0);
tslib_1.__decorate([
    Input()
], FlexibleTableComponent.prototype, "expandIf", void 0);
tslib_1.__decorate([
    Input()
], FlexibleTableComponent.prototype, "filterwhiletyping", void 0);
tslib_1.__decorate([
    Input()
], FlexibleTableComponent.prototype, "rowDetailerHeaders", void 0);
tslib_1.__decorate([
    Output()
], FlexibleTableComponent.prototype, "onaction", void 0);
tslib_1.__decorate([
    Output()
], FlexibleTableComponent.prototype, "onCellContentEdit", void 0);
tslib_1.__decorate([
    Output()
], FlexibleTableComponent.prototype, "onfilter", void 0);
tslib_1.__decorate([
    Output()
], FlexibleTableComponent.prototype, "onconfigurationchange", void 0);
tslib_1.__decorate([
    ViewChild('viewTable', { static: false })
], FlexibleTableComponent.prototype, "viewTable", void 0);
FlexibleTableComponent = tslib_1.__decorate([
    Component({
        selector: 'flexible-table',
        template: "\r\n<div class=\"flexible-table\">\r\n    <table-configuration\r\n        *ngIf=\"configurable && items && items.length\"\r\n        class=\"table-configuration\" \r\n        [headers]=\"headers\" \r\n        [title]=\"vocabulary.configureColumns\" \r\n        [printTable]=\"vocabulary.printTable\"\r\n        [action]=\"vocabulary.configureTable\"\r\n        [configAddon]=\"configAddon\"\r\n        (onprint)=\"viewTable.print()\"\r\n        (onchange)=\"reconfigure($event)\"></table-configuration>\r\n        \r\n    <table-view #viewTable\r\n        [action]=\"action\"\r\n        [actionKeys]=\"actionKeys\"\r\n\t\t[tableClass]=\"tableClass\"\r\n\t\t[tableInfo]=\"tableInfo\"\r\n\t\t[caption]=\"caption\" \r\n\t\t[headers]=\"subHeaders\" \r\n        [items]=\"formeditems\" \r\n        [filterwhiletyping]=\"filterwhiletyping\"\r\n\t\t[headerSeparation]=\"headerSeparation\"\r\n        [pageInfo]=\"pageInfo\"\r\n        [vocabulary]=\"vocabulary\"\r\n\t\t[enableIndexing]=\"enableIndexing\"\r\n\t\t[enableFiltering]=\"enableFiltering\"\r\n        [rowDetailer]=\"rowDetailer\"\r\n        [rowDetailerHeaders]=\"rowDetailerHeaders\"\r\n        [expandable]=\"expandable\"\r\n        [expandIf]=\"expandIf\"\r\n        (onDrop)=\"onDrop($event)\"\r\n        (onfilter)=\"onTableFilter($event)\"\r\n\t\t(onCellContentEdit)=\"onCellEdit($event)\"\r\n        (onchange)=\"reconfigure($event)\"\r\n\t\t(onaction)=\"tableAction($event)\"></table-view>\r\n</div>\r\n<table-pagination \r\n    [info]=\"pageInfo\" \r\n    [inline]=\"inlinePagination\" \r\n    [vocabulary]=\"vocabulary\"\r\n    (onchange)=\"onPaginationChange($event)\"></table-pagination>\r\n",
        styles: [":host{display:inline-block!important;width:100%}.flexible-table{position:relative;margin:0 auto;display:table;border-spacing:0;border-collapse:collapse}.flexible-table .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table{margin:1rem auto;padding:0;width:100%;table-layout:fixed;max-width:99%;background-color:transparent;border-collapse:collapse}.flexible-table table caption{background-color:#c3e5e2;border-radius:2px;color:#1b1b1b;caption-side:top;font-size:14px;padding:5px 6px;margin-bottom:15px;text-align:left}.flexible-table table thead{border-top:1px solid #bbb;border-bottom:1px solid #bbb;background-color:#eee}.flexible-table table tr{border:0}.flexible-table table tr.expanded td{font-weight:700;border-bottom:0}.flexible-table table td{padding-left:3px}.flexible-table table td:first-child{padding-left:5px}.flexible-table table td .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table td.index{background-color:#eee;border-right:1px solid #bbb}.flexible-table table th{cursor:default;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none;height:24px;position:relative;white-space:nowrap;font-weight:400;text-transform:uppercase;font-size:14px;padding-top:6px;padding-bottom:6px;text-align:left}.flexible-table table th.drag-over{background-color:#9b9b9b}.flexible-table table th.drag-over .icon,.flexible-table table th.drag-over .title{color:#eee}.flexible-table table th:first-child{padding-left:5px}.flexible-table table th.ascending,.flexible-table table th.descending,.flexible-table table th.sortable{cursor:pointer;height:12px}.flexible-table table th.indexable{width:33px}.flexible-table table th.actionable{width:24px}.flexible-table table th .title{color:#254a4d;display:inline-block;height:20px;white-space:nowrap}.flexible-table table th .dragable{cursor:move}.flexible-table table th .icon{width:22px;display:inline-block;height:20px;color:#254a4d}.flexible-table .fa.fa-angle-right{font-size:18px}.flexible-table table tr.detail td{border-top:0;cursor:default}.flexible-table table tr.expanded td a.expanded{background-position:right 2px}.flexible-table table tbody tr:hover{background-color:#ffeed2}.flexible-table table tbody tr.detail:hover,.flexible-table table tbody tr.detail:hover td table thead tr{background-color:inherit}.flexible-table table tr td a.actionable{display:inline-table;height:32px;vertical-align:middle;width:25px;line-height:30px;color:#254a4d}.flexible-table table tbody tr.detail:hover td:last-child{border-right:0}.flexible-table table tbody tr.detail:hover td:first-child{border-left:0}.flexible-table table tr td{border-bottom:1px solid #b1b3b3;color:#254a5d;font-size:15px;text-transform:capitalize}.flexible-table table tbody tr.pointer{cursor:pointer}.flexible-table table.alert-danger{border:0}.flexible-table table.alert-danger caption{background-color:transparent;font-weight:700;margin-bottom:0}.flexible-table table.alert-danger td{border-bottom:0;display:block}.flexible-table table.alert-danger td:first-child{padding-left:0}.flexible-table table.alert-danger td:last-child{border-bottom:0}.flexible-table table.alert-danger td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase;width:20%}.flexible-table table.alert-danger td a span.icon{width:100%}.flexible-table table.alert-danger thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table.alert-danger tr{border:2px solid #fff;display:block;margin-bottom:.625em;padding:5px;border-radius:5px}.flexible-table table.alert-danger tr th.actionable{width:inherit}.flexible-table table.alert-danger tr td{border-bottom:0}@media screen and (max-width:600px){.flexible-table table{border:0}.flexible-table table td{border-bottom:0;display:block;text-align:right}.flexible-table table td:first-child{padding-left:0}.flexible-table table td:last-child{border-bottom:0}.flexible-table table td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase}.flexible-table table td a span.icon{width:100%}.flexible-table table thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table tr{border-bottom:3px solid #ddd;display:block;margin-bottom:.625em}.flexible-table table tr th.actionable{width:inherit}.flexible-table table tr td{border-bottom:0}.flexible-table table.alert-danger td:before{width:inherit}}"]
    })
], FlexibleTableComponent);
export { FlexibleTableComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxleGlibGUudGFibGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlZGVoL2ZsZXhpYmxlLXRhYmxlLyIsInNvdXJjZXMiOlsic3JjL2FwcC9mbGV4aWJsZS10YWJsZS9mbGV4aWJsZS50YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7OztFQUtFO0FBQ0YsT0FBTyxFQUNILFNBQVMsRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFHVCxZQUFZLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFRN0UsSUFBYSxzQkFBc0IsR0FBbkMsTUFBYSxzQkFBc0I7SUErQy9CLFlBQW9CLFNBQWdDO1FBQWhDLGNBQVMsR0FBVCxTQUFTLENBQXVCO1FBekM3QyxlQUFVLEdBQUc7WUFDdEIsVUFBVSxFQUFFLGFBQWE7WUFDekIsY0FBYyxFQUFFLGlCQUFpQjtZQUNqQyxnQkFBZ0IsRUFBRSxtQkFBbUI7WUFDckMsU0FBUyxFQUFFLGVBQWU7WUFDMUIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsU0FBUyxFQUFFLE9BQU87WUFDbEIsUUFBUSxFQUFFLE1BQU07WUFDaEIsWUFBWSxFQUFFLFVBQVU7U0FDeEIsQ0FBQztRQUVPLHFCQUFnQixHQUFHLElBQUksQ0FBQztRQU1yQixlQUFVLEdBQUcsd0JBQXdCLENBQUM7UUFDdEMscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBZW5CLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzlCLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDdkMsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDOUIsMEJBQXFCLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQUtILENBQUM7SUFFM0QsV0FBVyxDQUFDLE9BQVk7UUFDdkIsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFO1lB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QUN6QjtJQUFSLEtBQUssRUFBRTsyREFBa0I7QUFDakI7SUFBUixLQUFLLEVBQUU7OERBQXlCO0FBQ3JCO0lBQVIsS0FBSyxFQUFFOytEQUEwQjtBQUN6QjtJQUFSLEtBQUssRUFBRTsyREFBa0I7QUFDakI7SUFBUixLQUFLLEVBQUU7MERBQWlCO0FBQ2hCO0lBQVIsS0FBSyxFQUFFO3dEQUFtQjtBQUNsQjtJQUFSLEtBQUssRUFBRTtpRUFBNEI7QUFDM0I7SUFBUixLQUFLLEVBQUU7a0VBQXlCO0FBRTFCO0lBQVQsTUFBTSxFQUFFO3dEQUF1QztBQUN0QztJQUFULE1BQU0sRUFBRTtpRUFBZ0Q7QUFDL0M7SUFBVCxNQUFNLEVBQUU7d0RBQXVDO0FBQ3RDO0lBQVQsTUFBTSxFQUFFO3FFQUFvRDtBQUc3RDtJQURDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUM7eURBQ1Y7QUE3Q2xCLHNCQUFzQjtJQUxsQyxTQUFTLENBQUM7UUFDVixRQUFRLEVBQUUsZ0JBQWdCO1FBQzFCLHNvREFBOEM7O0tBRTlDLENBQUM7R0FDVyxzQkFBc0IsQ0FzSmxDO1NBdEpZLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiogUHJvdmlkZXMgcmVuZGVyaW5nIG9mIGEgdGFibGUgd2hpY2ggaXMgdXNpbmcgdGhlIGdpdmVuIEZsZXhpYmxlVGFibGVIZWFkZXIgc2V0IGluXHJcbiogb3JkZXIgdG8gdGFidWxhdGUgdGhlIGdpdmVuIGRhdGEuIEFzIHBlciBkZWZpbml0aW9uIG9mIGVhcmNoIGhlYWRlciBjb21wb25lbnQsXHJcbiogYSBjb2x1bW4gY291bGQgYmUgaGlkZGVuLCBzb3J0YWJsZSwgb3IgZHJhZ2dhYmxlLiBFYWNoIHRhYmxlIHJvdyBjYW4gZXhwYW5kL2NvbGxhcHNlXHJcbiogb3IgcmVzcG9uZCB0byBhIGNsaWNrIGFjdGlvbi5cclxuKi9cclxuaW1wb3J0IHtcclxuICAgIENvbXBvbmVudCxcclxuXHRJbnB1dCxcclxuXHRPdXRwdXQsXHJcblx0Vmlld0NoaWxkLFxyXG5cdE9uSW5pdCxcclxuXHRPbkNoYW5nZXMsXHJcblx0RXZlbnRFbWl0dGVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBEcm9wRXZlbnQgfSBmcm9tICdAc2VkZWgvZHJhZy1lbmFibGVkJztcclxuaW1wb3J0IHsgVGFibGVIZWFkZXJzR2VuZXJhdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlLWhlYWRlcnMtZ2VuZXJhdG9yJztcclxuaW1wb3J0IHsgVGFibGVWaWV3Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlLmNvbXBvbmVudCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuXHRzZWxlY3RvcjogJ2ZsZXhpYmxlLXRhYmxlJyxcclxuXHR0ZW1wbGF0ZVVybDogJy4vZmxleGlibGUudGFibGUuY29tcG9uZW50Lmh0bWwnLFxyXG5cdHN0eWxlVXJsczogWycuL2ZsZXhpYmxlLnRhYmxlLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIEZsZXhpYmxlVGFibGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XHJcblxyXG5cdHN1YkhlYWRlcnM6YW55O1xyXG5cdGZvcm1lZGl0ZW1zOiBhbnlbXTtcclxuXHJcbiAgICBASW5wdXQoXCJ2b2NhYnVsYXJ5XCIpXHJcbiAgICBwdWJsaWMgdm9jYWJ1bGFyeSA9IHtcclxuXHRcdHByaW50VGFibGU6IFwiUHJpbnQgVGFibGVcIixcclxuXHRcdGNvbmZpZ3VyZVRhYmxlOiBcIkNvbmZpZ3VyZSBUYWJsZVwiLFxyXG5cdFx0Y29uZmlndXJlQ29sdW1uczogXCJDb25maWd1cmUgQ29sdW1uc1wiLFxyXG5cdFx0Y2xpY2tTb3J0OiBcIkNsaWNrIHRvIFNvcnRcIixcclxuXHRcdHNldFNpemU6IFwiU2V0IFNpemVcIixcclxuXHRcdGZpcnN0UGFnZTogXCJGaXJzdFwiLFxyXG5cdFx0bGFzdFBhZ2U6IFwiTGFzdFwiLFxyXG5cdFx0cHJldmlvdXNQYWdlOiBcIlByZXZpb3VzXCJcclxuXHR9O1xyXG5cdFxyXG5cdEBJbnB1dCgpIGhlYWRlclNlcGFyYXRpb24gPSB0cnVlO1xyXG4gICAgQElucHV0KCkgcGVyc2lzdGVuY2VJZDogc3RyaW5nO1xyXG5cdEBJbnB1dCgpIHBlcnNpc3RlbmNlS2V5OiBzdHJpbmc7XHJcbiAgICBASW5wdXQoKSBjYXB0aW9uOiBzdHJpbmc7XHJcbiAgICBASW5wdXQoKSBhY3Rpb246IHN0cmluZztcclxuICAgIEBJbnB1dCgpIGFjdGlvbktleXM7XHJcbiAgICBASW5wdXQoKSB0YWJsZUNsYXNzID0gJ2RlZmF1bHQtZmxleGlibGUtdGFibGUnO1xyXG4gICAgQElucHV0KCkgaW5saW5lUGFnaW5hdGlvbiA9IGZhbHNlO1xyXG5cdEBJbnB1dCgpIGhlYWRlcnM6IGFueVtdO1xyXG5cdEBJbnB1dCgpIGl0ZW1zOiBhbnlbXTtcclxuXHRASW5wdXQoKSBwYWdlSW5mbzogYW55O1xyXG5cdEBJbnB1dCgpIHRhYmxlSW5mbzogYW55O1xyXG4gICAgQElucHV0KCkgY29uZmlndXJhYmxlOiBib29sZWFuO1xyXG5cdEBJbnB1dCgpIGNvbmZpZ0FkZG9uOiBhbnk7XHJcblx0QElucHV0KCkgZW5hYmxlSW5kZXhpbmc6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKSBlbmFibGVGaWx0ZXJpbmc6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKSByb3dEZXRhaWxlcjogYW55O1xyXG4gICAgQElucHV0KCkgZXhwYW5kYWJsZTogYW55O1xyXG4gICAgQElucHV0KCkgZXhwYW5kSWY6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKSBmaWx0ZXJ3aGlsZXR5cGluZzogYm9vbGVhbjtcclxuICAgIEBJbnB1dCgpIHJvd0RldGFpbGVySGVhZGVyczogYW55O1xyXG5cclxuXHRAT3V0cHV0KCkgcHJpdmF0ZSBvbmFjdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHRAT3V0cHV0KCkgcHJpdmF0ZSBvbkNlbGxDb250ZW50RWRpdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHRAT3V0cHV0KCkgcHJpdmF0ZSBvbmZpbHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHRAT3V0cHV0KCkgcHJpdmF0ZSBvbmNvbmZpZ3VyYXRpb25jaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBWaWV3Q2hpbGQoJ3ZpZXdUYWJsZScsIHtzdGF0aWM6IGZhbHNlfSlcclxuXHR2aWV3VGFibGU6IFRhYmxlVmlld0NvbXBvbmVudDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGdlbmVyYXRvcjogVGFibGVIZWFkZXJzR2VuZXJhdG9yKSB7fVxyXG5cclxuXHRuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBhbnkpIHtcclxuXHRcdGlmIChjaGFuZ2VzLml0ZW1zKSB7XHJcblx0XHRcdGNvbnN0IGxpc3QgPSBbXTtcclxuXHRcdFx0dGhpcy5pdGVtcy5tYXAoXHJcblx0XHRcdFx0KGl0ZW06IGFueSkgPT4ge1xyXG5cdFx0XHRcdFx0Y29uc3QgY29weSA9IE9iamVjdC5hc3NpZ24oe30sIGl0ZW0pO1xyXG5cdFx0XHRcdFx0dGhpcy5oZWFkZXJzLm1hcChcclxuXHRcdFx0XHRcdFx0KGhlYWRlcjogYW55KSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGhlYWRlci5mb3JtYXQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IHYgPSBjb3B5W2hlYWRlci5rZXldO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHYgJiYgdHlwZW9mIHYgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IGZvcm1hdCA9IGhlYWRlci5mb3JtYXQuc3BsaXQoJzonKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGZvcm1hdFswXSA9PT0gJ2NhbGVuZGFyJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvcHlbaGVhZGVyLmtleV0gPSBEYXRlLnBhcnNlKHYpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGZvcm1hdFswXSA9PT0gJ2RhdGUnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29weVtoZWFkZXIua2V5XSA9IERhdGUucGFyc2Uodik7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZm9ybWF0WzBdID09PSAnbnVtYmVyJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvcHlbaGVhZGVyLmtleV0gPSBmb3JtYXQubGVuZ3RoID4gMiA/IHBhcnNlRmxvYXQodikgOiBwYXJzZUludCh2LCAxMCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZm9ybWF0WzBdID09PSAnY3VycmVuY3knKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29weVtoZWFkZXIua2V5XSA9IHBhcnNlRmxvYXQodi5yZXBsYWNlKC9bXjAtOVxcLi1dKy9nLFwiXCIpKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0bGlzdC5wdXNoKGNvcHkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KVxyXG5cdFx0XHR0aGlzLmZvcm1lZGl0ZW1zID0gbGlzdDtcclxuXHRcdH1cclxuXHR9XHJcblx0bmdPbkluaXQoKSB7XHJcblx0XHRpZiAodGhpcy5wZXJzaXN0ZW5jZUtleSkge1xyXG5cdFx0XHRjb25zdCBoZWFkZXJzOmFueSA9IHRoaXMuZ2VuZXJhdG9yLnJldHJlaXZlSGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQpO1xyXG5cclxuXHRcdFx0aWYgKGhlYWRlcnMpIHtcclxuXHRcdFx0XHR0aGlzLmhlYWRlcnMgPSBoZWFkZXJzO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAoIXRoaXMuaGVhZGVycyB8fCB0aGlzLmhlYWRlcnMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdHRoaXMuaGVhZGVycyA9IHRoaXMuZ2VuZXJhdG9yLmdlbmVyYXRlSGVhZGVyc0Zvcih0aGlzLml0ZW1zWzBdLFwiXCIsIDUsIHRoaXMuZW5hYmxlRmlsdGVyaW5nKTtcclxuXHRcdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcclxuXHRcdFx0XHR0aGlzLmdlbmVyYXRvci5wZXJzaXN0SGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQsIHRoaXMuaGVhZGVycyk7XHJcblx0XHRcdH1cclxuICAgICAgICB9XHJcblx0XHRpZiAoIXRoaXMucm93RGV0YWlsZXIgJiYgdGhpcy5leHBhbmRhYmxlKSB7XHJcblx0XHRcdHRoaXMucm93RGV0YWlsZXIgPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdFx0cmV0dXJuIHtkYXRhOiBpdGVtLCBoZWFkZXJzOiBbXX07XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5wYWdlSW5mbykge1xyXG5cdFx0XHRpZiAoIXRoaXMucGFnZUluZm8udG8pIHtcclxuXHRcdFx0XHR0aGlzLnBhZ2VJbmZvLnRvID0gdGhpcy5wYWdlSW5mby5wYWdlU2l6ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLnBhZ2VJbmZvLmNvbnRlbnRTaXplID0gdGhpcy5pdGVtcy5sZW5ndGg7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnBhZ2VJbmZvID0ge1xyXG4gICAgICAgICAgICAgICAgY29udGVudFNpemU6IDEwMDAwMCxcclxuICAgICAgICAgICAgICAgIHBhZ2VTaXplOiAxMDAwMDAsXHJcbiAgICAgICAgICAgICAgICBwYWdlczogMSxcclxuICAgICAgICAgICAgICAgIGZyb206IDAsXHJcbiAgICAgICAgICAgICAgICB0bzogMTAwMDAwLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudFBhZ2U6IDEsXHJcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogXCIwXCJcclxuICAgICAgICAgICAgfTtcclxuXHRcdH1cclxuXHRcdHRoaXMudXBkYXRlTGltaXRzKCk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGVMaW1pdHMoKSB7XHJcblx0XHR0aGlzLnN1YkhlYWRlcnMgPSB0aGlzLmhlYWRlcnMuZmlsdGVyKCAoaGVhZGVyKSA9PiBoZWFkZXIucHJlc2VudCA9PT0gdHJ1ZSk7XHJcblx0fVxyXG5cclxuXHRyZWNvbmZpZ3VyZShldmVudCkge1xyXG5cdFx0dGhpcy5oZWFkZXJzID0gZXZlbnQ7XHJcblx0XHR0aGlzLnVwZGF0ZUxpbWl0cygpO1xyXG5cdFx0dGhpcy5vbmNvbmZpZ3VyYXRpb25jaGFuZ2UuZW1pdChldmVudCk7XHJcblxyXG5cdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcclxuXHRcdFx0dGhpcy5nZW5lcmF0b3IucGVyc2lzdEhlYWRlcnModGhpcy5wZXJzaXN0ZW5jZUtleSwgdGhpcy5wZXJzaXN0ZW5jZUlkLCB0aGlzLmhlYWRlcnMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0b25QYWdpbmF0aW9uQ2hhbmdlKGV2ZW50KSB7XHJcblx0XHR0aGlzLnBhZ2VJbmZvID0gZXZlbnQ7XHJcblx0XHR0aGlzLnZpZXdUYWJsZS5ldmFsdWF0ZVJvd3MoKTtcclxuXHR9XHJcblxyXG5cdHRhYmxlQWN0aW9uKGV2ZW50KSB7XHJcblx0XHR0aGlzLm9uYWN0aW9uLmVtaXQoZXZlbnQpXHJcblx0fVxyXG5cclxuXHRvbkRyb3AoZXZlbnQ6RHJvcEV2ZW50KXtcclxuXHJcblx0fVxyXG5cdG9uQ2VsbEVkaXQoZXZlbnQpe1xyXG5cdFx0dGhpcy5vbkNlbGxDb250ZW50RWRpdC5lbWl0KGV2ZW50KTtcclxuXHR9XHJcblx0b25UYWJsZUZpbHRlcihldmVudCl7XHJcblx0XHR0aGlzLm9uZmlsdGVyLmVtaXQoZXZlbnQpO1xyXG5cdH1cclxufVxyXG4iXX0=