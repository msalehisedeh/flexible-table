import * as tslib_1 from "tslib";
/*
* Provides rendering of a table which is using the given FlexibleTableHeader set in
* order to tabulate the given data. As per definition of earch header component,
* a column could be hidden, sortable, or draggable. Each table row can expand/collapse
* or respond to a click action.
*/
import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { TableHeadersGenerator } from './components/table-headers-generator';
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
    return FlexibleTableComponent;
}());
export { FlexibleTableComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxleGlibGUudGFibGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlZGVoL2ZsZXhpYmxlLXRhYmxlLyIsInNvdXJjZXMiOlsic3JjL2FwcC9mbGV4aWJsZS10YWJsZS9mbGV4aWJsZS50YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7OztFQUtFO0FBQ0YsT0FBTyxFQUNILFNBQVMsRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFHVCxZQUFZLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFRN0U7SUE0RkksZ0NBQW9CLFNBQWdDO1FBQWhDLGNBQVMsR0FBVCxTQUFTLENBQXVCO1FBdEY3QyxlQUFVLEdBQUc7WUFDdEIsVUFBVSxFQUFFLGFBQWE7WUFDekIsY0FBYyxFQUFFLGlCQUFpQjtZQUNqQyxnQkFBZ0IsRUFBRSxtQkFBbUI7WUFDckMsU0FBUyxFQUFFLGVBQWU7WUFDMUIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsU0FBUyxFQUFFLE9BQU87WUFDbEIsUUFBUSxFQUFFLE1BQU07WUFDaEIsWUFBWSxFQUFFLFVBQVU7U0FDeEIsQ0FBQztRQWtCUSxlQUFVLEdBQUcsd0JBQXdCLENBQUM7UUFHN0MscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBMENwQixhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUc5QixzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBR3ZDLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRzlCLDBCQUFxQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFLTyxDQUFDO0lBRTNELDRDQUFXLEdBQVgsVUFBWSxPQUFZO1FBQXhCLGlCQThCQztRQTdCQSxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7WUFDbEIsSUFBTSxNQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ2hCLElB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QUM7NERBQ0c7SUFHckI7UUFEQyxLQUFLLENBQUMsV0FBVyxDQUFDOzZEQUNHO0lBR25CO1FBREMsS0FBSyxDQUFDLGNBQWMsQ0FBQztnRUFDTztJQUdoQztRQURDLEtBQUssQ0FBQyxhQUFhLENBQUM7K0RBQ0c7SUFHckI7UUFERixLQUFLLENBQUMsZ0JBQWdCLENBQUM7a0VBQ1U7SUFHL0I7UUFEQyxLQUFLLENBQUMsaUJBQWlCLENBQUM7bUVBQ087SUFHaEM7UUFEQyxLQUFLLENBQUMsYUFBYSxDQUFDOytEQUNHO0lBR3hCO1FBREMsS0FBSyxDQUFDLFlBQVksQ0FBQzs4REFDRztJQUd2QjtRQURDLEtBQUssQ0FBQyxVQUFVLENBQUM7NERBQ087SUFHekI7UUFEQyxLQUFLLENBQUMsbUJBQW1CLENBQUM7cUVBQ087SUFHbEM7UUFEQyxLQUFLLENBQUMsb0JBQW9CLENBQUM7c0VBQ0c7SUFHbEM7UUFEQyxNQUFNLENBQUMsVUFBVSxDQUFDOzREQUNtQjtJQUd0QztRQURDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQztxRUFDbUI7SUFHL0M7UUFEQyxNQUFNLENBQUMsVUFBVSxDQUFDOzREQUNtQjtJQUd0QztRQURDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQzt5RUFDbUI7SUFHbkQ7UUFEQyxTQUFTLENBQUMsV0FBVyxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDOzZEQUNWO0lBMUZsQixzQkFBc0I7UUFMbEMsU0FBUyxDQUFDO1lBQ1YsUUFBUSxFQUFFLGdCQUFnQjtZQUMxQix1bERBQThDOztTQUU5QyxDQUFDO09BQ1csc0JBQXNCLENBbU1sQztJQUFELDZCQUFDO0NBQUEsQUFuTUQsSUFtTUM7U0FuTVksc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuKiBQcm92aWRlcyByZW5kZXJpbmcgb2YgYSB0YWJsZSB3aGljaCBpcyB1c2luZyB0aGUgZ2l2ZW4gRmxleGlibGVUYWJsZUhlYWRlciBzZXQgaW5cclxuKiBvcmRlciB0byB0YWJ1bGF0ZSB0aGUgZ2l2ZW4gZGF0YS4gQXMgcGVyIGRlZmluaXRpb24gb2YgZWFyY2ggaGVhZGVyIGNvbXBvbmVudCxcclxuKiBhIGNvbHVtbiBjb3VsZCBiZSBoaWRkZW4sIHNvcnRhYmxlLCBvciBkcmFnZ2FibGUuIEVhY2ggdGFibGUgcm93IGNhbiBleHBhbmQvY29sbGFwc2VcclxuKiBvciByZXNwb25kIHRvIGEgY2xpY2sgYWN0aW9uLlxyXG4qL1xyXG5pbXBvcnQge1xyXG4gICAgQ29tcG9uZW50LFxyXG5cdElucHV0LFxyXG5cdE91dHB1dCxcclxuXHRWaWV3Q2hpbGQsXHJcblx0T25Jbml0LFxyXG5cdE9uQ2hhbmdlcyxcclxuXHRFdmVudEVtaXR0ZXJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IERyb3BFdmVudCB9IGZyb20gJ0BzZWRlaC9kcmFnLWVuYWJsZWQnO1xyXG5pbXBvcnQgeyBUYWJsZUhlYWRlcnNHZW5lcmF0b3IgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUtaGVhZGVycy1nZW5lcmF0b3InO1xyXG5pbXBvcnQgeyBUYWJsZVZpZXdDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG5cdHNlbGVjdG9yOiAnZmxleGlibGUtdGFibGUnLFxyXG5cdHRlbXBsYXRlVXJsOiAnLi9mbGV4aWJsZS50YWJsZS5jb21wb25lbnQuaHRtbCcsXHJcblx0c3R5bGVVcmxzOiBbJy4vZmxleGlibGUudGFibGUuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRmxleGlibGVUYWJsZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcclxuXHJcblx0c3ViSGVhZGVyczphbnk7XHJcblx0Zm9ybWVkaXRlbXM6IGFueVtdO1xyXG5cclxuICAgIEBJbnB1dChcInZvY2FidWxhcnlcIilcclxuICAgIHB1YmxpYyB2b2NhYnVsYXJ5ID0ge1xyXG5cdFx0cHJpbnRUYWJsZTogXCJQcmludCBUYWJsZVwiLFxyXG5cdFx0Y29uZmlndXJlVGFibGU6IFwiQ29uZmlndXJlIFRhYmxlXCIsXHJcblx0XHRjb25maWd1cmVDb2x1bW5zOiBcIkNvbmZpZ3VyZSBDb2x1bW5zXCIsXHJcblx0XHRjbGlja1NvcnQ6IFwiQ2xpY2sgdG8gU29ydFwiLFxyXG5cdFx0c2V0U2l6ZTogXCJTZXQgU2l6ZVwiLFxyXG5cdFx0Zmlyc3RQYWdlOiBcIkZpcnN0XCIsXHJcblx0XHRsYXN0UGFnZTogXCJMYXN0XCIsXHJcblx0XHRwcmV2aW91c1BhZ2U6IFwiUHJldmlvdXNcIlxyXG5cdH07XHJcblx0XHJcbiAgICBASW5wdXQoXCJwZXJzaXN0ZW5jZUlkXCIpXHJcbiAgICBwdWJsaWMgcGVyc2lzdGVuY2VJZDogc3RyaW5nO1xyXG5cclxuXHRASW5wdXQoXCJwZXJzaXN0ZW5jZUtleVwiKVxyXG4gICAgcHVibGljIHBlcnNpc3RlbmNlS2V5OiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KFwiY2FwdGlvblwiKVxyXG4gICAgcHVibGljIGNhcHRpb246IHN0cmluZztcclxuXHJcbiAgICBASW5wdXQoXCJhY3Rpb25cIilcclxuICAgIHB1YmxpYyBhY3Rpb246IHN0cmluZztcclxuXHJcbiAgICBASW5wdXQoXCJhY3Rpb25LZXlzXCIpXHJcbiAgICBwdWJsaWMgYWN0aW9uS2V5cztcclxuXHJcbiAgICBASW5wdXQoXCJ0YWJsZUNsYXNzXCIpXHJcbiAgICBwdWJsaWMgdGFibGVDbGFzcyA9ICdkZWZhdWx0LWZsZXhpYmxlLXRhYmxlJztcclxuXHJcbiAgICBASW5wdXQoJ2lubGluZVBhZ2luYXRpb24nKVxyXG4gICAgaW5saW5lUGFnaW5hdGlvbiA9IGZhbHNlO1xyXG5cclxuXHRASW5wdXQoXCJoZWFkZXJzXCIpXHJcblx0cHVibGljIGhlYWRlcnM6IGFueVtdO1xyXG5cclxuXHRASW5wdXQoXCJpdGVtc1wiKVxyXG5cdHB1YmxpYyBpdGVtczogYW55W107XHJcblxyXG5cdEBJbnB1dChcInBhZ2VJbmZvXCIpXHJcblx0cHVibGljIHBhZ2VJbmZvOiBhbnk7XHJcblxyXG5cdEBJbnB1dChcInRhYmxlSW5mb1wiKVxyXG5cdHB1YmxpYyB0YWJsZUluZm86IGFueTtcclxuXHJcbiAgICBASW5wdXQoXCJjb25maWd1cmFibGVcIilcclxuICAgIHB1YmxpYyBjb25maWd1cmFibGU6IGJvb2xlYW47XHJcblxyXG5cdEBJbnB1dChcImNvbmZpZ0FkZG9uXCIpXHJcblx0cHVibGljIGNvbmZpZ0FkZG9uOiBhbnk7XHJcblxyXG5cdEBJbnB1dChcImVuYWJsZUluZGV4aW5nXCIpXHJcbiAgICBwdWJsaWMgZW5hYmxlSW5kZXhpbmc6IGJvb2xlYW47XHJcblxyXG4gICAgQElucHV0KFwiZW5hYmxlRmlsdGVyaW5nXCIpXHJcbiAgICBwdWJsaWMgZW5hYmxlRmlsdGVyaW5nOiBib29sZWFuO1xyXG5cclxuICAgIEBJbnB1dChcInJvd0RldGFpbGVyXCIpXHJcbiAgICBwdWJsaWMgcm93RGV0YWlsZXI6IGFueTtcclxuXHJcbiAgICBASW5wdXQoXCJleHBhbmRhYmxlXCIpXHJcbiAgICBwdWJsaWMgZXhwYW5kYWJsZTogYW55O1xyXG5cclxuICAgIEBJbnB1dChcImV4cGFuZElmXCIpXHJcbiAgICBwdWJsaWMgZXhwYW5kSWY6IGJvb2xlYW47XHJcblxyXG4gICAgQElucHV0KFwiZmlsdGVyd2hpbGV0eXBpbmdcIilcclxuICAgIHB1YmxpYyBmaWx0ZXJ3aGlsZXR5cGluZzogYm9vbGVhbjtcclxuXHJcbiAgICBASW5wdXQoXCJyb3dEZXRhaWxlckhlYWRlcnNcIilcclxuICAgIHB1YmxpYyByb3dEZXRhaWxlckhlYWRlcnM6IGFueTtcclxuXHJcblx0QE91dHB1dCgnb25hY3Rpb24nKVxyXG5cdHByaXZhdGUgb25hY3Rpb24gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBPdXRwdXQoJ29uQ2VsbENvbnRlbnRFZGl0JylcclxuXHRwcml2YXRlIG9uQ2VsbENvbnRlbnRFZGl0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHRAT3V0cHV0KCdvbmZpbHRlcicpXHJcblx0cHJpdmF0ZSBvbmZpbHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0QE91dHB1dCgnb25jb25maWd1cmF0aW9uY2hhbmdlJylcclxuXHRwcml2YXRlIG9uY29uZmlndXJhdGlvbmNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0QFZpZXdDaGlsZCgndmlld1RhYmxlJywge3N0YXRpYzogZmFsc2V9KVxyXG5cdHZpZXdUYWJsZTogVGFibGVWaWV3Q29tcG9uZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZ2VuZXJhdG9yOiBUYWJsZUhlYWRlcnNHZW5lcmF0b3IpIHt9XHJcblxyXG5cdG5nT25DaGFuZ2VzKGNoYW5nZXM6IGFueSkge1xyXG5cdFx0aWYgKGNoYW5nZXMuaXRlbXMpIHtcclxuXHRcdFx0Y29uc3QgbGlzdCA9IFtdO1xyXG5cdFx0XHR0aGlzLml0ZW1zLm1hcChcclxuXHRcdFx0XHQoaXRlbTogYW55KSA9PiB7XHJcblx0XHRcdFx0XHRjb25zdCBjb3B5ID0gT2JqZWN0LmFzc2lnbih7fSwgaXRlbSk7XHJcblx0XHRcdFx0XHR0aGlzLmhlYWRlcnMubWFwKFxyXG5cdFx0XHRcdFx0XHQoaGVhZGVyOiBhbnkpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoaGVhZGVyLmZvcm1hdCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgdiA9IGNvcHlbaGVhZGVyLmtleV07XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAodiAmJiB0eXBlb2YgdiA9PT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgZm9ybWF0ID0gaGVhZGVyLmZvcm1hdC5zcGxpdCgnOicpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoZm9ybWF0WzBdID09PSAnY2FsZW5kYXInKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29weVtoZWFkZXIua2V5XSA9IERhdGUucGFyc2Uodik7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZm9ybWF0WzBdID09PSAnZGF0ZScpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb3B5W2hlYWRlci5rZXldID0gRGF0ZS5wYXJzZSh2KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChmb3JtYXRbMF0gPT09ICdudW1iZXInKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29weVtoZWFkZXIua2V5XSA9IGZvcm1hdC5sZW5ndGggPiAyID8gcGFyc2VGbG9hdCh2KSA6IHBhcnNlSW50KHYsIDEwKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChmb3JtYXRbMF0gPT09ICdjdXJyZW5jeScpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb3B5W2hlYWRlci5rZXldID0gcGFyc2VGbG9hdCh2LnJlcGxhY2UoL1teMC05XFwuLV0rL2csXCJcIikpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRsaXN0LnB1c2goY29weSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpXHJcblx0XHRcdHRoaXMuZm9ybWVkaXRlbXMgPSBsaXN0O1xyXG5cdFx0fVxyXG5cdH1cclxuXHRuZ09uSW5pdCgpIHtcclxuXHRcdGlmICh0aGlzLnBlcnNpc3RlbmNlS2V5KSB7XHJcblx0XHRcdGNvbnN0IGhlYWRlcnM6YW55ID0gdGhpcy5nZW5lcmF0b3IucmV0cmVpdmVIZWFkZXJzKHRoaXMucGVyc2lzdGVuY2VLZXksIHRoaXMucGVyc2lzdGVuY2VJZCk7XHJcblxyXG5cdFx0XHRpZiAoaGVhZGVycykge1xyXG5cdFx0XHRcdHRoaXMuaGVhZGVycyA9IGhlYWRlcnM7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmICghdGhpcy5oZWFkZXJzIHx8IHRoaXMuaGVhZGVycy5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0dGhpcy5oZWFkZXJzID0gdGhpcy5nZW5lcmF0b3IuZ2VuZXJhdGVIZWFkZXJzRm9yKHRoaXMuaXRlbXNbMF0sXCJcIiwgNSwgdGhpcy5lbmFibGVGaWx0ZXJpbmcpO1xyXG5cdFx0XHRpZiAodGhpcy5wZXJzaXN0ZW5jZUtleSkge1xyXG5cdFx0XHRcdHRoaXMuZ2VuZXJhdG9yLnBlcnNpc3RIZWFkZXJzKHRoaXMucGVyc2lzdGVuY2VLZXksIHRoaXMucGVyc2lzdGVuY2VJZCwgdGhpcy5oZWFkZXJzKTtcclxuXHRcdFx0fVxyXG4gICAgICAgIH1cclxuXHRcdGlmICghdGhpcy5yb3dEZXRhaWxlciAmJiB0aGlzLmV4cGFuZGFibGUpIHtcclxuXHRcdFx0dGhpcy5yb3dEZXRhaWxlciA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0XHRyZXR1cm4ge2RhdGE6IGl0ZW0sIGhlYWRlcnM6IFtdfTtcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLnBhZ2VJbmZvKSB7XHJcblx0XHRcdGlmICghdGhpcy5wYWdlSW5mby50bykge1xyXG5cdFx0XHRcdHRoaXMucGFnZUluZm8udG8gPSB0aGlzLnBhZ2VJbmZvLnBhZ2VTaXplO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMucGFnZUluZm8uY29udGVudFNpemUgPSB0aGlzLml0ZW1zLmxlbmd0aDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMucGFnZUluZm8gPSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50U2l6ZTogMTAwMDAwLFxyXG4gICAgICAgICAgICAgICAgcGFnZVNpemU6IDEwMDAwMCxcclxuICAgICAgICAgICAgICAgIHBhZ2VzOiAxLFxyXG4gICAgICAgICAgICAgICAgZnJvbTogMCxcclxuICAgICAgICAgICAgICAgIHRvOiAxMDAwMDAsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFnZTogMSxcclxuICAgICAgICAgICAgICAgIG1heFdpZHRoOiBcIjBcIlxyXG4gICAgICAgICAgICB9O1xyXG5cdFx0fVxyXG5cdFx0dGhpcy51cGRhdGVMaW1pdHMoKTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZUxpbWl0cygpIHtcclxuXHRcdHRoaXMuc3ViSGVhZGVycyA9IHRoaXMuaGVhZGVycy5maWx0ZXIoIChoZWFkZXIpID0+IGhlYWRlci5wcmVzZW50ID09PSB0cnVlKTtcclxuXHR9XHJcblxyXG5cdHJlY29uZmlndXJlKGV2ZW50KSB7XHJcblx0XHR0aGlzLmhlYWRlcnMgPSBldmVudDtcclxuXHRcdHRoaXMudXBkYXRlTGltaXRzKCk7XHJcblx0XHR0aGlzLm9uY29uZmlndXJhdGlvbmNoYW5nZS5lbWl0KGV2ZW50KTtcclxuXHJcblx0XHRpZiAodGhpcy5wZXJzaXN0ZW5jZUtleSkge1xyXG5cdFx0XHR0aGlzLmdlbmVyYXRvci5wZXJzaXN0SGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQsIHRoaXMuaGVhZGVycyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRvblBhZ2luYXRpb25DaGFuZ2UoZXZlbnQpIHtcclxuXHRcdHRoaXMucGFnZUluZm8gPSBldmVudDtcclxuXHRcdHRoaXMudmlld1RhYmxlLmV2YWx1YXRlUm93cygpO1xyXG5cdH1cclxuXHJcblx0dGFibGVBY3Rpb24oZXZlbnQpIHtcclxuXHRcdHRoaXMub25hY3Rpb24uZW1pdChldmVudClcclxuXHR9XHJcblxyXG5cdG9uRHJvcChldmVudDpEcm9wRXZlbnQpe1xyXG5cclxuXHR9XHJcblx0b25DZWxsRWRpdChldmVudCl7XHJcblx0XHR0aGlzLm9uQ2VsbENvbnRlbnRFZGl0LmVtaXQoZXZlbnQpO1xyXG5cdH1cclxuXHRvblRhYmxlRmlsdGVyKGV2ZW50KXtcclxuXHRcdHRoaXMub25maWx0ZXIuZW1pdChldmVudCk7XHJcblx0fVxyXG59XHJcbiJdfQ==