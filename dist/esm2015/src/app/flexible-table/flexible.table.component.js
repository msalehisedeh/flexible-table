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
    Input("persistenceId")
], FlexibleTableComponent.prototype, "persistenceId", void 0);
tslib_1.__decorate([
    Input("persistenceKey")
], FlexibleTableComponent.prototype, "persistenceKey", void 0);
tslib_1.__decorate([
    Input("caption")
], FlexibleTableComponent.prototype, "caption", void 0);
tslib_1.__decorate([
    Input("action")
], FlexibleTableComponent.prototype, "action", void 0);
tslib_1.__decorate([
    Input("actionKeys")
], FlexibleTableComponent.prototype, "actionKeys", void 0);
tslib_1.__decorate([
    Input("tableClass")
], FlexibleTableComponent.prototype, "tableClass", void 0);
tslib_1.__decorate([
    Input('inlinePagination')
], FlexibleTableComponent.prototype, "inlinePagination", void 0);
tslib_1.__decorate([
    Input("headers")
], FlexibleTableComponent.prototype, "headers", void 0);
tslib_1.__decorate([
    Input("items")
], FlexibleTableComponent.prototype, "items", void 0);
tslib_1.__decorate([
    Input("pageInfo")
], FlexibleTableComponent.prototype, "pageInfo", void 0);
tslib_1.__decorate([
    Input("tableInfo")
], FlexibleTableComponent.prototype, "tableInfo", void 0);
tslib_1.__decorate([
    Input("configurable")
], FlexibleTableComponent.prototype, "configurable", void 0);
tslib_1.__decorate([
    Input("configAddon")
], FlexibleTableComponent.prototype, "configAddon", void 0);
tslib_1.__decorate([
    Input("enableIndexing")
], FlexibleTableComponent.prototype, "enableIndexing", void 0);
tslib_1.__decorate([
    Input("enableFiltering")
], FlexibleTableComponent.prototype, "enableFiltering", void 0);
tslib_1.__decorate([
    Input("rowDetailer")
], FlexibleTableComponent.prototype, "rowDetailer", void 0);
tslib_1.__decorate([
    Input("expandable")
], FlexibleTableComponent.prototype, "expandable", void 0);
tslib_1.__decorate([
    Input("expandIf")
], FlexibleTableComponent.prototype, "expandIf", void 0);
tslib_1.__decorate([
    Input("filterwhiletyping")
], FlexibleTableComponent.prototype, "filterwhiletyping", void 0);
tslib_1.__decorate([
    Input("rowDetailerHeaders")
], FlexibleTableComponent.prototype, "rowDetailerHeaders", void 0);
tslib_1.__decorate([
    Output('onaction')
], FlexibleTableComponent.prototype, "onaction", void 0);
tslib_1.__decorate([
    Output('onCellContentEdit')
], FlexibleTableComponent.prototype, "onCellContentEdit", void 0);
tslib_1.__decorate([
    Output('onfilter')
], FlexibleTableComponent.prototype, "onfilter", void 0);
tslib_1.__decorate([
    Output('onconfigurationchange')
], FlexibleTableComponent.prototype, "onconfigurationchange", void 0);
tslib_1.__decorate([
    ViewChild('viewTable', { static: false })
], FlexibleTableComponent.prototype, "viewTable", void 0);
FlexibleTableComponent = tslib_1.__decorate([
    Component({
        selector: 'flexible-table',
        template: "\r\n<div class=\"flexible-table\">\r\n    <table-configuration\r\n        *ngIf=\"configurable && items && items.length\"\r\n        class=\"table-configuration\" \r\n        [headers]=\"headers\" \r\n        [title]=\"vocabulary.configureColumns\" \r\n        [printTable]=\"vocabulary.printTable\"\r\n        [action]=\"vocabulary.configureTable\"\r\n        [configAddon]=\"configAddon\"\r\n        (onprint)=\"viewTable.print()\"\r\n        (onchange)=\"reconfigure($event)\"></table-configuration>\r\n        \r\n    <table-view #viewTable\r\n        [action]=\"action\"\r\n        [actionKeys]=\"actionKeys\"\r\n\t\t[tableClass]=\"tableClass\"\r\n\t\t[tableInfo]=\"tableInfo\"\r\n\t\t[caption]=\"caption\" \r\n\t\t[headers]=\"subHeaders\" \r\n        [items]=\"formeditems\" \r\n        [filterwhiletyping]=\"filterwhiletyping\"\r\n        [pageInfo]=\"pageInfo\"\r\n        [vocabulary]=\"vocabulary\"\r\n\t\t[enableIndexing]=\"enableIndexing\"\r\n\t\t[enableFiltering]=\"enableFiltering\"\r\n        [rowDetailer]=\"rowDetailer\"\r\n        [rowDetailerHeaders]=\"rowDetailerHeaders\"\r\n        [expandable]=\"expandable\"\r\n        [expandIf]=\"expandIf\"\r\n        (onDrop)=\"onDrop($event)\"\r\n        (onfilter)=\"onTableFilter($event)\"\r\n\t\t(onCellContentEdit)=\"onCellEdit($event)\"\r\n        (onchange)=\"reconfigure($event)\"\r\n\t\t(onaction)=\"tableAction($event)\"></table-view>\r\n</div>\r\n<table-pagination \r\n    [info]=\"pageInfo\" \r\n    [inline]=\"inlinePagination\" \r\n    [vocabulary]=\"vocabulary\"\r\n    (onchange)=\"onPaginationChange($event)\"></table-pagination>\r\n",
        styles: [":host{display:inline-block!important;width:100%}.flexible-table{position:relative;margin:0 auto;display:table;border-spacing:0;border-collapse:collapse}.flexible-table .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table{margin:1rem auto;padding:0;width:100%;table-layout:fixed;max-width:99%;background-color:transparent;border-collapse:collapse}.flexible-table table caption{background-color:#c3e5e2;border-radius:2px;color:#1b1b1b;caption-side:top;font-size:14px;padding:5px 6px;margin-bottom:15px;text-align:left}.flexible-table table thead{border-top:1px solid #bbb;border-bottom:1px solid #bbb;background-color:#eee}.flexible-table table tr{border:0}.flexible-table table tr.expanded td{font-weight:700;border-bottom:0}.flexible-table table td{padding-left:3px}.flexible-table table td:first-child{padding-left:5px}.flexible-table table td .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table td.index{background-color:#eee;border-right:1px solid #bbb}.flexible-table table th{cursor:default;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none;height:24px;position:relative;white-space:nowrap;font-weight:400;text-transform:uppercase;font-size:14px;padding-top:6px;padding-bottom:6px;text-align:left}.flexible-table table th.drag-over{background-color:#9b9b9b}.flexible-table table th.drag-over .icon,.flexible-table table th.drag-over .title{color:#eee}.flexible-table table th:first-child{padding-left:5px}.flexible-table table th.ascending,.flexible-table table th.descending,.flexible-table table th.sortable{cursor:pointer;height:12px}.flexible-table table th.indexable{width:33px}.flexible-table table th.actionable{width:24px}.flexible-table table th .title{color:#254a4d;display:inline-block;height:20px;white-space:nowrap}.flexible-table table th .dragable{cursor:move}.flexible-table table th .icon{width:22px;display:inline-block;height:20px;color:#254a4d}.flexible-table .fa.fa-angle-right{font-size:18px}.flexible-table table tr.detail td{border-top:0;cursor:default}.flexible-table table tr.expanded td a.expanded{background-position:right 2px}.flexible-table table tbody tr:hover{background-color:#ffeed2}.flexible-table table tbody tr.detail:hover,.flexible-table table tbody tr.detail:hover td table thead tr{background-color:inherit}.flexible-table table tr td a.actionable{display:inline-table;height:32px;vertical-align:middle;width:25px;line-height:30px;color:#254a4d}.flexible-table table tbody tr.detail:hover td:last-child{border-right:0}.flexible-table table tbody tr.detail:hover td:first-child{border-left:0}.flexible-table table tr td{border-bottom:1px solid #b1b3b3;color:#254a5d;font-size:15px;text-transform:capitalize}.flexible-table table tbody tr.pointer{cursor:pointer}.flexible-table table.alert-danger{border:0}.flexible-table table.alert-danger caption{background-color:transparent;font-weight:700;margin-bottom:0}.flexible-table table.alert-danger td{border-bottom:0;display:block}.flexible-table table.alert-danger td:first-child{padding-left:0}.flexible-table table.alert-danger td:last-child{border-bottom:0}.flexible-table table.alert-danger td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase;width:20%}.flexible-table table.alert-danger td a span.icon{width:100%}.flexible-table table.alert-danger thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table.alert-danger tr{border:2px solid #fff;display:block;margin-bottom:.625em;padding:5px;border-radius:5px}.flexible-table table.alert-danger tr th.actionable{width:inherit}.flexible-table table.alert-danger tr td{border-bottom:0}@media screen and (max-width:600px){.flexible-table table{border:0}.flexible-table table td{border-bottom:0;display:block;text-align:right}.flexible-table table td:first-child{padding-left:0}.flexible-table table td:last-child{border-bottom:0}.flexible-table table td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase}.flexible-table table td a span.icon{width:100%}.flexible-table table thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table tr{border-bottom:3px solid #ddd;display:block;margin-bottom:.625em}.flexible-table table tr th.actionable{width:inherit}.flexible-table table tr td{border-bottom:0}.flexible-table table.alert-danger td:before{width:inherit}}"]
    })
], FlexibleTableComponent);
export { FlexibleTableComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxleGlibGUudGFibGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlZGVoL2ZsZXhpYmxlLXRhYmxlLyIsInNvdXJjZXMiOlsic3JjL2FwcC9mbGV4aWJsZS10YWJsZS9mbGV4aWJsZS50YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7OztFQUtFO0FBQ0YsT0FBTyxFQUNILFNBQVMsRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFHVCxZQUFZLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFRN0UsSUFBYSxzQkFBc0IsR0FBbkMsTUFBYSxzQkFBc0I7SUE0Ri9CLFlBQW9CLFNBQWdDO1FBQWhDLGNBQVMsR0FBVCxTQUFTLENBQXVCO1FBdEY3QyxlQUFVLEdBQUc7WUFDdEIsVUFBVSxFQUFFLGFBQWE7WUFDekIsY0FBYyxFQUFFLGlCQUFpQjtZQUNqQyxnQkFBZ0IsRUFBRSxtQkFBbUI7WUFDckMsU0FBUyxFQUFFLGVBQWU7WUFDMUIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsU0FBUyxFQUFFLE9BQU87WUFDbEIsUUFBUSxFQUFFLE1BQU07WUFDaEIsWUFBWSxFQUFFLFVBQVU7U0FDeEIsQ0FBQztRQWtCUSxlQUFVLEdBQUcsd0JBQXdCLENBQUM7UUFHN0MscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBMENwQixhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUc5QixzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBR3ZDLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRzlCLDBCQUFxQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFLTyxDQUFDO0lBRTNELFdBQVcsQ0FBQyxPQUFZO1FBQ3ZCLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtZQUNsQixNQUFNLElBQUksR0FBRyxFQUFFLENB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QURDLEtBQUssQ0FBQyxXQUFXLENBQUM7eURBQ0c7QUFHbkI7SUFEQyxLQUFLLENBQUMsY0FBYyxDQUFDOzREQUNPO0FBR2hDO0lBREMsS0FBSyxDQUFDLGFBQWEsQ0FBQzsyREFDRztBQUdyQjtJQURGLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQzs4REFDVTtBQUcvQjtJQURDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQzsrREFDTztBQUdoQztJQURDLEtBQUssQ0FBQyxhQUFhLENBQUM7MkRBQ0c7QUFHeEI7SUFEQyxLQUFLLENBQUMsWUFBWSxDQUFDOzBEQUNHO0FBR3ZCO0lBREMsS0FBSyxDQUFDLFVBQVUsQ0FBQzt3REFDTztBQUd6QjtJQURDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQztpRUFDTztBQUdsQztJQURDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQztrRUFDRztBQUdsQztJQURDLE1BQU0sQ0FBQyxVQUFVLENBQUM7d0RBQ21CO0FBR3RDO0lBREMsTUFBTSxDQUFDLG1CQUFtQixDQUFDO2lFQUNtQjtBQUcvQztJQURDLE1BQU0sQ0FBQyxVQUFVLENBQUM7d0RBQ21CO0FBR3RDO0lBREMsTUFBTSxDQUFDLHVCQUF1QixDQUFDO3FFQUNtQjtBQUduRDtJQURDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUM7eURBQ1Y7QUExRmxCLHNCQUFzQjtJQUxsQyxTQUFTLENBQUM7UUFDVixRQUFRLEVBQUUsZ0JBQWdCO1FBQzFCLHVsREFBOEM7O0tBRTlDLENBQUM7R0FDVyxzQkFBc0IsQ0FtTWxDO1NBbk1ZLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiogUHJvdmlkZXMgcmVuZGVyaW5nIG9mIGEgdGFibGUgd2hpY2ggaXMgdXNpbmcgdGhlIGdpdmVuIEZsZXhpYmxlVGFibGVIZWFkZXIgc2V0IGluXHJcbiogb3JkZXIgdG8gdGFidWxhdGUgdGhlIGdpdmVuIGRhdGEuIEFzIHBlciBkZWZpbml0aW9uIG9mIGVhcmNoIGhlYWRlciBjb21wb25lbnQsXHJcbiogYSBjb2x1bW4gY291bGQgYmUgaGlkZGVuLCBzb3J0YWJsZSwgb3IgZHJhZ2dhYmxlLiBFYWNoIHRhYmxlIHJvdyBjYW4gZXhwYW5kL2NvbGxhcHNlXHJcbiogb3IgcmVzcG9uZCB0byBhIGNsaWNrIGFjdGlvbi5cclxuKi9cclxuaW1wb3J0IHtcclxuICAgIENvbXBvbmVudCxcclxuXHRJbnB1dCxcclxuXHRPdXRwdXQsXHJcblx0Vmlld0NoaWxkLFxyXG5cdE9uSW5pdCxcclxuXHRPbkNoYW5nZXMsXHJcblx0RXZlbnRFbWl0dGVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBEcm9wRXZlbnQgfSBmcm9tICdAc2VkZWgvZHJhZy1lbmFibGVkJztcclxuaW1wb3J0IHsgVGFibGVIZWFkZXJzR2VuZXJhdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlLWhlYWRlcnMtZ2VuZXJhdG9yJztcclxuaW1wb3J0IHsgVGFibGVWaWV3Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlLmNvbXBvbmVudCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuXHRzZWxlY3RvcjogJ2ZsZXhpYmxlLXRhYmxlJyxcclxuXHR0ZW1wbGF0ZVVybDogJy4vZmxleGlibGUudGFibGUuY29tcG9uZW50Lmh0bWwnLFxyXG5cdHN0eWxlVXJsczogWycuL2ZsZXhpYmxlLnRhYmxlLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIEZsZXhpYmxlVGFibGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XHJcblxyXG5cdHN1YkhlYWRlcnM6YW55O1xyXG5cdGZvcm1lZGl0ZW1zOiBhbnlbXTtcclxuXHJcbiAgICBASW5wdXQoXCJ2b2NhYnVsYXJ5XCIpXHJcbiAgICBwdWJsaWMgdm9jYWJ1bGFyeSA9IHtcclxuXHRcdHByaW50VGFibGU6IFwiUHJpbnQgVGFibGVcIixcclxuXHRcdGNvbmZpZ3VyZVRhYmxlOiBcIkNvbmZpZ3VyZSBUYWJsZVwiLFxyXG5cdFx0Y29uZmlndXJlQ29sdW1uczogXCJDb25maWd1cmUgQ29sdW1uc1wiLFxyXG5cdFx0Y2xpY2tTb3J0OiBcIkNsaWNrIHRvIFNvcnRcIixcclxuXHRcdHNldFNpemU6IFwiU2V0IFNpemVcIixcclxuXHRcdGZpcnN0UGFnZTogXCJGaXJzdFwiLFxyXG5cdFx0bGFzdFBhZ2U6IFwiTGFzdFwiLFxyXG5cdFx0cHJldmlvdXNQYWdlOiBcIlByZXZpb3VzXCJcclxuXHR9O1xyXG5cdFxyXG4gICAgQElucHV0KFwicGVyc2lzdGVuY2VJZFwiKVxyXG4gICAgcHVibGljIHBlcnNpc3RlbmNlSWQ6IHN0cmluZztcclxuXHJcblx0QElucHV0KFwicGVyc2lzdGVuY2VLZXlcIilcclxuICAgIHB1YmxpYyBwZXJzaXN0ZW5jZUtleTogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dChcImNhcHRpb25cIilcclxuICAgIHB1YmxpYyBjYXB0aW9uOiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KFwiYWN0aW9uXCIpXHJcbiAgICBwdWJsaWMgYWN0aW9uOiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KFwiYWN0aW9uS2V5c1wiKVxyXG4gICAgcHVibGljIGFjdGlvbktleXM7XHJcblxyXG4gICAgQElucHV0KFwidGFibGVDbGFzc1wiKVxyXG4gICAgcHVibGljIHRhYmxlQ2xhc3MgPSAnZGVmYXVsdC1mbGV4aWJsZS10YWJsZSc7XHJcblxyXG4gICAgQElucHV0KCdpbmxpbmVQYWdpbmF0aW9uJylcclxuICAgIGlubGluZVBhZ2luYXRpb24gPSBmYWxzZTtcclxuXHJcblx0QElucHV0KFwiaGVhZGVyc1wiKVxyXG5cdHB1YmxpYyBoZWFkZXJzOiBhbnlbXTtcclxuXHJcblx0QElucHV0KFwiaXRlbXNcIilcclxuXHRwdWJsaWMgaXRlbXM6IGFueVtdO1xyXG5cclxuXHRASW5wdXQoXCJwYWdlSW5mb1wiKVxyXG5cdHB1YmxpYyBwYWdlSW5mbzogYW55O1xyXG5cclxuXHRASW5wdXQoXCJ0YWJsZUluZm9cIilcclxuXHRwdWJsaWMgdGFibGVJbmZvOiBhbnk7XHJcblxyXG4gICAgQElucHV0KFwiY29uZmlndXJhYmxlXCIpXHJcbiAgICBwdWJsaWMgY29uZmlndXJhYmxlOiBib29sZWFuO1xyXG5cclxuXHRASW5wdXQoXCJjb25maWdBZGRvblwiKVxyXG5cdHB1YmxpYyBjb25maWdBZGRvbjogYW55O1xyXG5cclxuXHRASW5wdXQoXCJlbmFibGVJbmRleGluZ1wiKVxyXG4gICAgcHVibGljIGVuYWJsZUluZGV4aW5nOiBib29sZWFuO1xyXG5cclxuICAgIEBJbnB1dChcImVuYWJsZUZpbHRlcmluZ1wiKVxyXG4gICAgcHVibGljIGVuYWJsZUZpbHRlcmluZzogYm9vbGVhbjtcclxuXHJcbiAgICBASW5wdXQoXCJyb3dEZXRhaWxlclwiKVxyXG4gICAgcHVibGljIHJvd0RldGFpbGVyOiBhbnk7XHJcblxyXG4gICAgQElucHV0KFwiZXhwYW5kYWJsZVwiKVxyXG4gICAgcHVibGljIGV4cGFuZGFibGU6IGFueTtcclxuXHJcbiAgICBASW5wdXQoXCJleHBhbmRJZlwiKVxyXG4gICAgcHVibGljIGV4cGFuZElmOiBib29sZWFuO1xyXG5cclxuICAgIEBJbnB1dChcImZpbHRlcndoaWxldHlwaW5nXCIpXHJcbiAgICBwdWJsaWMgZmlsdGVyd2hpbGV0eXBpbmc6IGJvb2xlYW47XHJcblxyXG4gICAgQElucHV0KFwicm93RGV0YWlsZXJIZWFkZXJzXCIpXHJcbiAgICBwdWJsaWMgcm93RGV0YWlsZXJIZWFkZXJzOiBhbnk7XHJcblxyXG5cdEBPdXRwdXQoJ29uYWN0aW9uJylcclxuXHRwcml2YXRlIG9uYWN0aW9uID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHRAT3V0cHV0KCdvbkNlbGxDb250ZW50RWRpdCcpXHJcblx0cHJpdmF0ZSBvbkNlbGxDb250ZW50RWRpdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0QE91dHB1dCgnb25maWx0ZXInKVxyXG5cdHByaXZhdGUgb25maWx0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBPdXRwdXQoJ29uY29uZmlndXJhdGlvbmNoYW5nZScpXHJcblx0cHJpdmF0ZSBvbmNvbmZpZ3VyYXRpb25jaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBWaWV3Q2hpbGQoJ3ZpZXdUYWJsZScsIHtzdGF0aWM6IGZhbHNlfSlcclxuXHR2aWV3VGFibGU6IFRhYmxlVmlld0NvbXBvbmVudDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGdlbmVyYXRvcjogVGFibGVIZWFkZXJzR2VuZXJhdG9yKSB7fVxyXG5cclxuXHRuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBhbnkpIHtcclxuXHRcdGlmIChjaGFuZ2VzLml0ZW1zKSB7XHJcblx0XHRcdGNvbnN0IGxpc3QgPSBbXTtcclxuXHRcdFx0dGhpcy5pdGVtcy5tYXAoXHJcblx0XHRcdFx0KGl0ZW06IGFueSkgPT4ge1xyXG5cdFx0XHRcdFx0Y29uc3QgY29weSA9IE9iamVjdC5hc3NpZ24oe30sIGl0ZW0pO1xyXG5cdFx0XHRcdFx0dGhpcy5oZWFkZXJzLm1hcChcclxuXHRcdFx0XHRcdFx0KGhlYWRlcjogYW55KSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGhlYWRlci5mb3JtYXQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IHYgPSBjb3B5W2hlYWRlci5rZXldO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHYgJiYgdHlwZW9mIHYgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IGZvcm1hdCA9IGhlYWRlci5mb3JtYXQuc3BsaXQoJzonKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGZvcm1hdFswXSA9PT0gJ2NhbGVuZGFyJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvcHlbaGVhZGVyLmtleV0gPSBEYXRlLnBhcnNlKHYpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGZvcm1hdFswXSA9PT0gJ2RhdGUnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29weVtoZWFkZXIua2V5XSA9IERhdGUucGFyc2Uodik7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZm9ybWF0WzBdID09PSAnbnVtYmVyJykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvcHlbaGVhZGVyLmtleV0gPSBmb3JtYXQubGVuZ3RoID4gMiA/IHBhcnNlRmxvYXQodikgOiBwYXJzZUludCh2LCAxMCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZm9ybWF0WzBdID09PSAnY3VycmVuY3knKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29weVtoZWFkZXIua2V5XSA9IHBhcnNlRmxvYXQodi5yZXBsYWNlKC9bXjAtOVxcLi1dKy9nLFwiXCIpKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0bGlzdC5wdXNoKGNvcHkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KVxyXG5cdFx0XHR0aGlzLmZvcm1lZGl0ZW1zID0gbGlzdDtcclxuXHRcdH1cclxuXHR9XHJcblx0bmdPbkluaXQoKSB7XHJcblx0XHRpZiAodGhpcy5wZXJzaXN0ZW5jZUtleSkge1xyXG5cdFx0XHRjb25zdCBoZWFkZXJzOmFueSA9IHRoaXMuZ2VuZXJhdG9yLnJldHJlaXZlSGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQpO1xyXG5cclxuXHRcdFx0aWYgKGhlYWRlcnMpIHtcclxuXHRcdFx0XHR0aGlzLmhlYWRlcnMgPSBoZWFkZXJzO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAoIXRoaXMuaGVhZGVycyB8fCB0aGlzLmhlYWRlcnMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdHRoaXMuaGVhZGVycyA9IHRoaXMuZ2VuZXJhdG9yLmdlbmVyYXRlSGVhZGVyc0Zvcih0aGlzLml0ZW1zWzBdLFwiXCIsIDUsIHRoaXMuZW5hYmxlRmlsdGVyaW5nKTtcclxuXHRcdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcclxuXHRcdFx0XHR0aGlzLmdlbmVyYXRvci5wZXJzaXN0SGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQsIHRoaXMuaGVhZGVycyk7XHJcblx0XHRcdH1cclxuICAgICAgICB9XHJcblx0XHRpZiAoIXRoaXMucm93RGV0YWlsZXIgJiYgdGhpcy5leHBhbmRhYmxlKSB7XHJcblx0XHRcdHRoaXMucm93RGV0YWlsZXIgPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdFx0cmV0dXJuIHtkYXRhOiBpdGVtLCBoZWFkZXJzOiBbXX07XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5wYWdlSW5mbykge1xyXG5cdFx0XHRpZiAoIXRoaXMucGFnZUluZm8udG8pIHtcclxuXHRcdFx0XHR0aGlzLnBhZ2VJbmZvLnRvID0gdGhpcy5wYWdlSW5mby5wYWdlU2l6ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLnBhZ2VJbmZvLmNvbnRlbnRTaXplID0gdGhpcy5pdGVtcy5sZW5ndGg7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnBhZ2VJbmZvID0ge1xyXG4gICAgICAgICAgICAgICAgY29udGVudFNpemU6IDEwMDAwMCxcclxuICAgICAgICAgICAgICAgIHBhZ2VTaXplOiAxMDAwMDAsXHJcbiAgICAgICAgICAgICAgICBwYWdlczogMSxcclxuICAgICAgICAgICAgICAgIGZyb206IDAsXHJcbiAgICAgICAgICAgICAgICB0bzogMTAwMDAwLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudFBhZ2U6IDEsXHJcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogXCIwXCJcclxuICAgICAgICAgICAgfTtcclxuXHRcdH1cclxuXHRcdHRoaXMudXBkYXRlTGltaXRzKCk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGVMaW1pdHMoKSB7XHJcblx0XHR0aGlzLnN1YkhlYWRlcnMgPSB0aGlzLmhlYWRlcnMuZmlsdGVyKCAoaGVhZGVyKSA9PiBoZWFkZXIucHJlc2VudCA9PT0gdHJ1ZSk7XHJcblx0fVxyXG5cclxuXHRyZWNvbmZpZ3VyZShldmVudCkge1xyXG5cdFx0dGhpcy5oZWFkZXJzID0gZXZlbnQ7XHJcblx0XHR0aGlzLnVwZGF0ZUxpbWl0cygpO1xyXG5cdFx0dGhpcy5vbmNvbmZpZ3VyYXRpb25jaGFuZ2UuZW1pdChldmVudCk7XHJcblxyXG5cdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcclxuXHRcdFx0dGhpcy5nZW5lcmF0b3IucGVyc2lzdEhlYWRlcnModGhpcy5wZXJzaXN0ZW5jZUtleSwgdGhpcy5wZXJzaXN0ZW5jZUlkLCB0aGlzLmhlYWRlcnMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0b25QYWdpbmF0aW9uQ2hhbmdlKGV2ZW50KSB7XHJcblx0XHR0aGlzLnBhZ2VJbmZvID0gZXZlbnQ7XHJcblx0XHR0aGlzLnZpZXdUYWJsZS5ldmFsdWF0ZVJvd3MoKTtcclxuXHR9XHJcblxyXG5cdHRhYmxlQWN0aW9uKGV2ZW50KSB7XHJcblx0XHR0aGlzLm9uYWN0aW9uLmVtaXQoZXZlbnQpXHJcblx0fVxyXG5cclxuXHRvbkRyb3AoZXZlbnQ6RHJvcEV2ZW50KXtcclxuXHJcblx0fVxyXG5cdG9uQ2VsbEVkaXQoZXZlbnQpe1xyXG5cdFx0dGhpcy5vbkNlbGxDb250ZW50RWRpdC5lbWl0KGV2ZW50KTtcclxuXHR9XHJcblx0b25UYWJsZUZpbHRlcihldmVudCl7XHJcblx0XHR0aGlzLm9uZmlsdGVyLmVtaXQoZXZlbnQpO1xyXG5cdH1cclxufVxyXG4iXX0=