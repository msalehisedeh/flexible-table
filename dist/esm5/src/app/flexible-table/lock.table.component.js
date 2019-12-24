import * as tslib_1 from "tslib";
/*
* Provides rendering of a table which is using the given FlexibleTableHeader set in
* order to tabulate the given data. As per definition of earch header component,
* a column could be hidden, sortable, or draggable. Each table row can expand/collapse
* or respond to a click action.
*/
import { Component, Input, Output, ViewChild, OnChanges, OnInit, Renderer, EventEmitter } from '@angular/core';
import { TableHeadersGenerator } from './components/table-headers-generator';
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
    tslib_1.__decorate([
        Input("vocabulary")
    ], LockTableComponent.prototype, "vocabulary", void 0);
    tslib_1.__decorate([
        Input("persistenceId")
    ], LockTableComponent.prototype, "persistenceId", void 0);
    tslib_1.__decorate([
        Input("persistenceKey")
    ], LockTableComponent.prototype, "persistenceKey", void 0);
    tslib_1.__decorate([
        Input("caption")
    ], LockTableComponent.prototype, "caption", void 0);
    tslib_1.__decorate([
        Input("action")
    ], LockTableComponent.prototype, "action", void 0);
    tslib_1.__decorate([
        Input("actionKeys")
    ], LockTableComponent.prototype, "actionKeys", void 0);
    tslib_1.__decorate([
        Input("tableClass")
    ], LockTableComponent.prototype, "tableClass", void 0);
    tslib_1.__decorate([
        Input("headers")
    ], LockTableComponent.prototype, "headers", void 0);
    tslib_1.__decorate([
        Input("items")
    ], LockTableComponent.prototype, "items", void 0);
    tslib_1.__decorate([
        Input('inlinePagination')
    ], LockTableComponent.prototype, "inlinePagination", void 0);
    tslib_1.__decorate([
        Input("pageInfo")
    ], LockTableComponent.prototype, "pageInfo", void 0);
    tslib_1.__decorate([
        Input("tableInfo")
    ], LockTableComponent.prototype, "tableInfo", void 0);
    tslib_1.__decorate([
        Input("configurable")
    ], LockTableComponent.prototype, "configurable", void 0);
    tslib_1.__decorate([
        Input("configAddon")
    ], LockTableComponent.prototype, "configAddon", void 0);
    tslib_1.__decorate([
        Input("enableFiltering")
    ], LockTableComponent.prototype, "enableFiltering", void 0);
    tslib_1.__decorate([
        Input("enableIndexing")
    ], LockTableComponent.prototype, "enableIndexing", void 0);
    tslib_1.__decorate([
        Input("filterwhiletyping")
    ], LockTableComponent.prototype, "filterwhiletyping", void 0);
    tslib_1.__decorate([
        Output('onaction')
    ], LockTableComponent.prototype, "onaction", void 0);
    tslib_1.__decorate([
        Output('onCellContentEdit')
    ], LockTableComponent.prototype, "onCellContentEdit", void 0);
    tslib_1.__decorate([
        Output('onfilter')
    ], LockTableComponent.prototype, "onfilter", void 0);
    tslib_1.__decorate([
        Output('onconfigurationchange')
    ], LockTableComponent.prototype, "onconfigurationchange", void 0);
    tslib_1.__decorate([
        ViewChild('lockedTable', { static: false })
    ], LockTableComponent.prototype, "lockedTable", void 0);
    tslib_1.__decorate([
        ViewChild('unlockedTable', { static: false })
    ], LockTableComponent.prototype, "unlockedTable", void 0);
    LockTableComponent = tslib_1.__decorate([
        Component({
            selector: 'lock-table',
            template: "<div class=\"caption\">\n\t<table-configuration\n\t\t*ngIf=\"configurable\" \n\t\t[headers]=\"headers\" \n\t\t[title]=\"vocabulary.configureColumns\" \n\t\t[action]=\"vocabulary.configureTable\"\n\t\t[configAddon]=\"configAddon\"\n\t\t(onchange)=\"reconfigure($event)\"></table-configuration>\n\n\t<div *ngIf=\"caption\" [textContent]=\"caption\"></div>\n</div>\n<div class=\"smart-table-wrap\" (scroll)=\"scroll($event)\">\n\t<table-view #lockedTable\n\t\tclass=\"locked-table\"\n\t\tlockable=\"true\"\n\t\t[headers]=\"lockedHeaders\" \n\t\t[items]=\"filteredItems\" \n        [pageInfo]=\"pageInfo\"\n        [vocabulary]=\"vocabulary\"\n        [filterwhiletyping]=\"filterwhiletyping\"\n\t\t[enableFiltering]=\"enableFiltering\"\n\t\t[enableIndexing]=\"enableIndexing\"\n        \n\t\t(onchange)=\"onlock($event)\"\n\t\t(onDrop)=\"onDrop($event)\"\n        (onfilter)=\"onTableFilter($event)\"\n\t\t(onCellContentEdit)=\"onCellEdit($event)\"\n\t\t(onfilter)=\"changeUnlockedTableFilteredItems($event)\"\n\t\t(onaction)=\"tableAction($event)\"></table-view>\n\n    <table-view #unlockedTable\n\t\tclass=\"unlocked-table\"\n\t\tlockable=\"true\"\n\t\t[headers]=\"unlockedHeaders\" \n\t\t[items]=\"filteredItems\" \n        [pageInfo]=\"pageInfo\"\n        [vocabulary]=\"vocabulary\"\n        [filterwhiletyping]=\"filterwhiletyping\"\n\t\t[enableFiltering]=\"enableFiltering\"\n\n\t\t(onDrop)=\"onDrop($event)\"\n        (onfilter)=\"onTableFilter($event)\"\n\t\t(onchange)=\"onlock($event)\"\n\t\t(onCellContentEdit)=\"onCellEdit($event)\"\n\t\t(onfilter)=\"changeLockedTableFilteredItems($event)\"\n\t\t(onaction)=\"tableAction($event)\"></table-view>\n\t\n</div>\n<table-pagination #pager\n\t[info]=\"pageInfo\" \n    [inline]=\"inlinePagination\" \n\t[vocabulary]=\"vocabulary\" \n    (onchange)=\"onPaginationChange($event)\"></table-pagination>\n",
            styles: [":host{width:100%;position:relative;margin:0 auto;display:table}:host .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host .caption{background-color:#c3e5e2;border-radius:2px;box-sizing:border-box;color:#1b1b1b;caption-side:top;font-size:14px;margin-bottom:15px;padding:5px 6px;text-align:left;width:100%}:host .caption table-configuration{display:inline-block;float:right;position:unset}:host .smart-table-wrap{border-spacing:0;border-collapse:collapse;border-right:1px solid #aaa;border-bottom:1px solid #aaa;box-sizing:border-box;width:100%;position:relative;overflow-x:auto}:host .smart-table-wrap .unlocked-table ::ng-deep table{max-width:100%;margin-bottom:0;margin-top:0}:host .smart-table-wrap .unlocked-table ::ng-deep table th td{white-space:nowrap}:host .smart-table-wrap .unlocked-table ::ng-deep table th .locker{cursor:pointer;color:#00925b;text-align:center}:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr{background-color:#fff}:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr.hover,:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr:hover{background-color:#ffeed2}:host .smart-table-wrap .unlocked-table ::ng-deep table img{height:14px}:host .smart-table-wrap .locked-table{position:absolute;margin:0 auto;display:inline-table;border-spacing:0;border-collapse:collapse;float:left;z-index:2;width:auto}:host .smart-table-wrap .locked-table ::ng-deep table{display:inline-block;border-right:1px solid #aaa;margin:0;width:auto}:host .smart-table-wrap .locked-table ::ng-deep table th td{white-space:nowrap}:host .smart-table-wrap .locked-table ::ng-deep table th .locker{cursor:pointer;color:#8b0224;text-align:center}:host .smart-table-wrap .locked-table ::ng-deep table tbody tr{background-color:#fff}:host .smart-table-wrap .locked-table ::ng-deep table tbody tr.hover,:host .smart-table-wrap .locked-table ::ng-deep table tbody tr:hover{background-color:#ffeed2}:host .smart-table-wrap .locked-table ::ng-deep table img{height:14px}@media screen and (max-width:600px){.smart-table-wrap{border:0!important;position:unset;overflow-x:unset}.smart-table-wrap .unlocked-table{margin-left:0!important;position:unset!important}.smart-table-wrap .unlocked-table ::ng-deep table td,.smart-table-wrap .unlocked-table ::ng-deep table th{white-space:unset}.smart-table-wrap .unlocked-table ::ng-deep table img{height:30px}.smart-table-wrap .locked-table{position:unset!important;margin:0!important;display:table;left:0!important}.smart-table-wrap .locked-table ::ng-deep table{display:table!important;margin:0!important;width:100%!important}.smart-table-wrap .locked-table ::ng-deep table td,.smart-table-wrap .locked-table ::ng-deep table th{white-space:unset}.smart-table-wrap .locked-table ::ng-deep table td.index{border-right:0}.smart-table-wrap .locked-table ::ng-deep table img{height:30px}}"]
        })
    ], LockTableComponent);
    return LockTableComponent;
}());
export { LockTableComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jay50YWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvZmxleGlibGUtdGFibGUvIiwic291cmNlcyI6WyJzcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2xvY2sudGFibGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7RUFLRTtBQUNGLE9BQU8sRUFDSCxTQUFTLEVBQ1osS0FBSyxFQUNMLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULE1BQU0sRUFDTixRQUFRLEVBQ1IsWUFBWSxFQUNaLE1BQU0sZUFBZSxDQUFDO0FBSXZCLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBTzdFO0lBOEZJLDRCQUNNLFNBQWdDLEVBQ2hDLFFBQWtCO1FBRGxCLGNBQVMsR0FBVCxTQUFTLENBQXVCO1FBQ2hDLGFBQVEsR0FBUixRQUFRLENBQVU7UUE5RjNCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFDbkIsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFJckIsa0JBQWEsR0FBRyxFQUFFLENBQUM7UUFHVCxlQUFVLEdBQUc7WUFDdEIsY0FBYyxFQUFFLGlCQUFpQjtZQUNqQyxnQkFBZ0IsRUFBRSxtQkFBbUI7WUFDckMsU0FBUyxFQUFFLGVBQWU7WUFDMUIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsU0FBUyxFQUFFLE9BQU87WUFDbEIsUUFBUSxFQUFFLE1BQU07WUFDaEIsWUFBWSxFQUFFLFVBQVU7U0FDeEIsQ0FBQztRQWtCUSxlQUFVLEdBQUcsd0JBQXdCLENBQUM7UUFTN0MscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBeUJwQixhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUc5QixzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBR3ZDLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRzlCLDBCQUFxQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFr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QUFjLENBQUM7NERBQ087SUFHaEM7UUFEQyxLQUFLLENBQUMsYUFBYSxDQUFDOzJEQUNHO0lBR3JCO1FBREYsS0FBSyxDQUFDLGlCQUFpQixDQUFDOytEQUNVO0lBR2hDO1FBREMsS0FBSyxDQUFDLGdCQUFnQixDQUFDOzhEQUNPO0lBRy9CO1FBREMsS0FBSyxDQUFDLG1CQUFtQixDQUFDO2lFQUNPO0lBSXJDO1FBREMsTUFBTSxDQUFDLFVBQVUsQ0FBQzt3REFDbUI7SUFHdEM7UUFEQyxNQUFNLENBQUMsbUJBQW1CLENBQUM7aUVBQ21CO0lBRy9DO1FBREMsTUFBTSxDQUFDLFVBQVUsQ0FBQzt3REFDbUI7SUFHdEM7UUFEQyxNQUFNLENBQUMsdUJBQXVCLENBQUM7cUVBQ21CO0lBR25EO1FBREMsU0FBUyxDQUFDLGFBQWEsRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQzsyREFDRjtJQUd4QztRQURDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUM7NkRBQ0Y7SUFyRjlCLGtCQUFrQjtRQUw5QixTQUFTLENBQUM7WUFDVixRQUFRLEVBQUUsWUFBWTtZQUN0QiwyMERBQTBDOztTQUUxQyxDQUFDO09BQ1csa0JBQWtCLENBc085QjtJQUFELHlCQUFDO0NBQUEsQUF0T0QsSUFzT0M7U0F0T1ksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiogUHJvdmlkZXMgcmVuZGVyaW5nIG9mIGEgdGFibGUgd2hpY2ggaXMgdXNpbmcgdGhlIGdpdmVuIEZsZXhpYmxlVGFibGVIZWFkZXIgc2V0IGluXG4qIG9yZGVyIHRvIHRhYnVsYXRlIHRoZSBnaXZlbiBkYXRhLiBBcyBwZXIgZGVmaW5pdGlvbiBvZiBlYXJjaCBoZWFkZXIgY29tcG9uZW50LFxuKiBhIGNvbHVtbiBjb3VsZCBiZSBoaWRkZW4sIHNvcnRhYmxlLCBvciBkcmFnZ2FibGUuIEVhY2ggdGFibGUgcm93IGNhbiBleHBhbmQvY29sbGFwc2Vcbiogb3IgcmVzcG9uZCB0byBhIGNsaWNrIGFjdGlvbi5cbiovXG5pbXBvcnQge1xuICAgIENvbXBvbmVudCxcblx0SW5wdXQsXG5cdE91dHB1dCxcblx0Vmlld0NoaWxkLFxuXHRPbkNoYW5nZXMsXG5cdE9uSW5pdCxcblx0UmVuZGVyZXIsXG5cdEV2ZW50RW1pdHRlclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRHJvcEV2ZW50LCBEcmFnRXZlbnQgfSBmcm9tICdAc2VkZWgvZHJhZy1lbmFibGVkJztcbmltcG9ydCB7IFRhYmxlVmlld0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90YWJsZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgVGFibGVIZWFkZXJzR2VuZXJhdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlLWhlYWRlcnMtZ2VuZXJhdG9yJztcblxuQENvbXBvbmVudCh7XG5cdHNlbGVjdG9yOiAnbG9jay10YWJsZScsXG5cdHRlbXBsYXRlVXJsOiAnLi9sb2NrLnRhYmxlLmNvbXBvbmVudC5odG1sJyxcblx0c3R5bGVVcmxzOiBbJy4vbG9jay50YWJsZS5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIExvY2tUYWJsZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcblxuXHRob2xkbG9ja2VkID0gZmFsc2U7XG5cdGhvbGR1bmxvY2tlZCA9IGZhbHNlO1xuXHRsb2NrZWRIZWFkZXJzOmFueTtcblx0dW5sb2NrZWRIZWFkZXJzOmFueTtcblx0Zm9ybWVkaXRlbXM6YW55O1xuXHRmaWx0ZXJlZEl0ZW1zID0gW107XG5cbiAgICBASW5wdXQoXCJ2b2NhYnVsYXJ5XCIpXG4gICAgcHVibGljIHZvY2FidWxhcnkgPSB7XG5cdFx0Y29uZmlndXJlVGFibGU6IFwiQ29uZmlndXJlIFRhYmxlXCIsXG5cdFx0Y29uZmlndXJlQ29sdW1uczogXCJDb25maWd1cmUgQ29sdW1uc1wiLFxuXHRcdGNsaWNrU29ydDogXCJDbGljayB0byBTb3J0XCIsXG5cdFx0c2V0U2l6ZTogXCJTZXQgU2l6ZVwiLFxuXHRcdGZpcnN0UGFnZTogXCJGaXJzdFwiLFxuXHRcdGxhc3RQYWdlOiBcIkxhc3RcIixcblx0XHRwcmV2aW91c1BhZ2U6IFwiUHJldmlvdXNcIlxuXHR9O1xuXG4gICAgQElucHV0KFwicGVyc2lzdGVuY2VJZFwiKVxuICAgIHB1YmxpYyBwZXJzaXN0ZW5jZUlkOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoXCJwZXJzaXN0ZW5jZUtleVwiKVxuICAgIHB1YmxpYyBwZXJzaXN0ZW5jZUtleTogc3RyaW5nO1xuXG4gICAgQElucHV0KFwiY2FwdGlvblwiKVxuICAgIHB1YmxpYyBjYXB0aW9uOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoXCJhY3Rpb25cIilcbiAgICBwdWJsaWMgYWN0aW9uOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoXCJhY3Rpb25LZXlzXCIpXG4gICAgcHVibGljIGFjdGlvbktleXM7XG5cbiAgICBASW5wdXQoXCJ0YWJsZUNsYXNzXCIpXG4gICAgcHVibGljIHRhYmxlQ2xhc3MgPSAnZGVmYXVsdC1mbGV4aWJsZS10YWJsZSc7XG5cblx0QElucHV0KFwiaGVhZGVyc1wiKVxuXHRwdWJsaWMgaGVhZGVyczogYW55W107XG5cblx0QElucHV0KFwiaXRlbXNcIilcblx0cHVibGljIGl0ZW1zOiBhbnlbXTtcblxuICAgIEBJbnB1dCgnaW5saW5lUGFnaW5hdGlvbicpXG4gICAgaW5saW5lUGFnaW5hdGlvbiA9IGZhbHNlO1xuXG5cdEBJbnB1dChcInBhZ2VJbmZvXCIpXG5cdHB1YmxpYyBwYWdlSW5mbzogYW55O1xuXG5cdEBJbnB1dChcInRhYmxlSW5mb1wiKVxuXHRwdWJsaWMgdGFibGVJbmZvOiBhbnk7XG5cbiAgICBASW5wdXQoXCJjb25maWd1cmFibGVcIilcbiAgICBwdWJsaWMgY29uZmlndXJhYmxlOiBib29sZWFuO1xuXG5cdEBJbnB1dChcImNvbmZpZ0FkZG9uXCIpXG5cdHB1YmxpYyBjb25maWdBZGRvbjogYW55O1xuXG5cdEBJbnB1dChcImVuYWJsZUZpbHRlcmluZ1wiKVxuICAgIHB1YmxpYyBlbmFibGVGaWx0ZXJpbmc6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoXCJlbmFibGVJbmRleGluZ1wiKVxuICAgIHB1YmxpYyBlbmFibGVJbmRleGluZzogYm9vbGVhbjtcblxuICAgIEBJbnB1dChcImZpbHRlcndoaWxldHlwaW5nXCIpXG4gICAgcHVibGljIGZpbHRlcndoaWxldHlwaW5nOiBib29sZWFuO1xuXG5cblx0QE91dHB1dCgnb25hY3Rpb24nKVxuXHRwcml2YXRlIG9uYWN0aW9uID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG5cdEBPdXRwdXQoJ29uQ2VsbENvbnRlbnRFZGl0Jylcblx0cHJpdmF0ZSBvbkNlbGxDb250ZW50RWRpdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuXHRAT3V0cHV0KCdvbmZpbHRlcicpXG5cdHByaXZhdGUgb25maWx0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cblx0QE91dHB1dCgnb25jb25maWd1cmF0aW9uY2hhbmdlJylcblx0cHJpdmF0ZSBvbmNvbmZpZ3VyYXRpb25jaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cblx0QFZpZXdDaGlsZCgnbG9ja2VkVGFibGUnLCB7c3RhdGljOiBmYWxzZX0pXG5cdHByaXZhdGUgbG9ja2VkVGFibGU6IFRhYmxlVmlld0NvbXBvbmVudDtcblxuXHRAVmlld0NoaWxkKCd1bmxvY2tlZFRhYmxlJywge3N0YXRpYzogZmFsc2V9KVxuXHRwcml2YXRlIHVubG9ja2VkVGFibGU6IFRhYmxlVmlld0NvbXBvbmVudDtcblxuICAgIHNjcm9sbChldmVudCkge1xuXHRcdHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKFxuXHRcdFx0XHR0aGlzLmxvY2tlZFRhYmxlLmVsLm5hdGl2ZUVsZW1lbnQsXG5cdFx0XHRcdFwibGVmdFwiLFxuXHRcdFx0XHRldmVudC50YXJnZXQuc2Nyb2xsTGVmdCtcInB4XCIpO1xuXHR9XG5cbiAgICBjb25zdHJ1Y3Rvcihcblx0XHRwcml2YXRlIGdlbmVyYXRvcjogVGFibGVIZWFkZXJzR2VuZXJhdG9yLFxuXHRcdHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyXG5cdCkge31cblxuXHRuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBhbnkpIHtcblx0XHRpZiAoY2hhbmdlcy5pdGVtcykge1xuXHRcdFx0Y29uc3QgbGlzdCA9IFtdO1xuXHRcdFx0dGhpcy5pdGVtcy5tYXAoXG5cdFx0XHRcdChpdGVtOiBhbnkpID0+IHtcblx0XHRcdFx0XHRjb25zdCBjb3B5ID0gT2JqZWN0LmFzc2lnbih7fSwgaXRlbSk7XG5cdFx0XHRcdFx0dGhpcy5oZWFkZXJzLm1hcChcblx0XHRcdFx0XHRcdChoZWFkZXI6IGFueSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAoaGVhZGVyLmZvcm1hdCkge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IHYgPSBjb3B5W2hlYWRlci5rZXldO1xuXHRcdFx0XHRcdFx0XHRcdGlmICh2ICYmIHR5cGVvZiB2ID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgZm9ybWF0ID0gaGVhZGVyLmZvcm1hdC5zcGxpdCgnOicpO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGZvcm1hdFswXSA9PT0gJ2NhbGVuZGFyJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb3B5W2hlYWRlci5rZXldID0gRGF0ZS5wYXJzZSh2KTtcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZm9ybWF0WzBdID09PSAnZGF0ZScpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29weVtoZWFkZXIua2V5XSA9IERhdGUucGFyc2Uodik7XG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGZvcm1hdFswXSA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29weVtoZWFkZXIua2V5XSA9IGZvcm1hdC5sZW5ndGggPiAyID8gcGFyc2VGbG9hdCh2KSA6IHBhcnNlSW50KHYsIDEwKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZm9ybWF0WzBdID09PSAnY3VycmVuY3knKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvcHlbaGVhZGVyLmtleV0gPSBwYXJzZUZsb2F0KHYucmVwbGFjZSgvW14wLTlcXC4tXSsvZyxcIlwiKSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KVxuXHRcdFx0XHRcdGxpc3QucHVzaChjb3B5KTtcblx0XHRcdFx0fVxuXHRcdFx0KVxuXHRcdFx0dGhpcy5mb3JtZWRpdGVtcyA9IGxpc3Q7XG5cdFx0fVxuXHR9XG5cdG5nT25Jbml0KCkge1xuXHRcdGlmICh0aGlzLnBhZ2VJbmZvKSB7XG5cdFx0XHRpZiAoIXRoaXMucGFnZUluZm8udG8pIHtcblx0XHRcdFx0dGhpcy5wYWdlSW5mby50byA9IHRoaXMucGFnZUluZm8ucGFnZVNpemU7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMucGFnZUluZm8gPSB7XG4gICAgICAgICAgICAgICAgY29udGVudFNpemU6IDEwMDAwMCxcbiAgICAgICAgICAgICAgICBwYWdlU2l6ZTogMTAwMDAwLFxuICAgICAgICAgICAgICAgIHBhZ2VzOiAxLFxuICAgICAgICAgICAgICAgIGZyb206IDAsXG4gICAgICAgICAgICAgICAgdG86IDEwMDAwMCxcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFnZTogMSxcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogXCIwXCJcbiAgICAgICAgICAgIH07XG5cdFx0fVxuXHRcdGlmICh0aGlzLnBlcnNpc3RlbmNlS2V5KSB7XG5cdFx0XHRjb25zdCBoZWFkZXJzOmFueSA9IHRoaXMuZ2VuZXJhdG9yLnJldHJlaXZlSGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQpO1xuXG5cdFx0XHRpZiAoaGVhZGVycykge1xuXHRcdFx0XHR0aGlzLmhlYWRlcnMgPSBoZWFkZXJzO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoIXRoaXMuaGVhZGVycykge1xuXHRcdFx0dGhpcy5oZWFkZXJzID0gdGhpcy5nZW5lcmF0b3IuZ2VuZXJhdGVIZWFkZXJzRm9yKHRoaXMuaXRlbXNbMF0sXCJcIiwgNSwgdGhpcy5lbmFibGVGaWx0ZXJpbmcpO1xuXHRcdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcblx0XHRcdFx0dGhpcy5nZW5lcmF0b3IucGVyc2lzdEhlYWRlcnModGhpcy5wZXJzaXN0ZW5jZUtleSwgdGhpcy5wZXJzaXN0ZW5jZUlkLCB0aGlzLmhlYWRlcnMpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSB0aGlzLmZvcm1lZGl0ZW1zID8gdGhpcy5mb3JtZWRpdGVtczogdGhpcy5pdGVtcztcblx0XHR0aGlzLnBhZ2VJbmZvLmNvbnRlbnRTaXplID0gdGhpcy5pdGVtcy5sZW5ndGg7XG5cdFx0XG5cdFx0dGhpcy5yZWNvbmZpZ3VyZSh0aGlzLmhlYWRlcnMpO1xuXG5cdH1cblxuXHRldmFsdWF0ZVBvc2l0aW9uaW5nKCkge1xuXHRcdHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKFxuXHRcdFx0dGhpcy51bmxvY2tlZFRhYmxlLmVsLm5hdGl2ZUVsZW1lbnQsXG5cdFx0XHRcIm1hcmdpbi1sZWZ0XCIsXG5cdFx0XHR0aGlzLmxvY2tlZFRhYmxlLm9mZnNldFdpZHRoKCkrXCJweFwiKTtcblx0fVxuXG5cdHJlY29uZmlndXJlKGV2ZW50KSB7XG5cdFx0dGhpcy5oZWFkZXJzID0gZXZlbnQ7XG5cdFx0dGhpcy5sb2NrZWRIZWFkZXJzID0gdGhpcy5oZWFkZXJzLmZpbHRlciggKGl0ZW0pID0+IGl0ZW0ubG9ja2VkID09PSB0cnVlICYmIGl0ZW0ucHJlc2VudCk7XG5cdFx0dGhpcy51bmxvY2tlZEhlYWRlcnMgPSB0aGlzLmhlYWRlcnMuZmlsdGVyKCAoaXRlbSkgPT4gaXRlbS5sb2NrZWQgIT09IHRydWUgICYmIGl0ZW0ucHJlc2VudCk7XHRcblx0XHR0aGlzLm9uY29uZmlndXJhdGlvbmNoYW5nZS5lbWl0KGV2ZW50KTtcblxuXHRcdGlmICh0aGlzLnBlcnNpc3RlbmNlS2V5KSB7XG5cdFx0XHR0aGlzLmdlbmVyYXRvci5wZXJzaXN0SGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQsIHRoaXMuaGVhZGVycyk7XG5cdFx0fVxuXHRcdHNldFRpbWVvdXQodGhpcy5ldmFsdWF0ZVBvc2l0aW9uaW5nLmJpbmQodGhpcyksMTExKTtcblx0fVxuXG5cdG9ubG9jayhldmVudCkge1xuXHRcdHRoaXMubG9ja2VkSGVhZGVycyA9IHRoaXMuaGVhZGVycy5maWx0ZXIoIChpdGVtKSA9PiBpdGVtLmxvY2tlZCA9PT0gdHJ1ZSAmJiBpdGVtLnByZXNlbnQpO1xuXHRcdHRoaXMudW5sb2NrZWRIZWFkZXJzID0gdGhpcy5oZWFkZXJzLmZpbHRlciggKGl0ZW0pID0+IGl0ZW0ubG9ja2VkICE9PSB0cnVlICAmJiBpdGVtLnByZXNlbnQpO1x0XG5cdFx0dGhpcy5vbmNvbmZpZ3VyYXRpb25jaGFuZ2UuZW1pdChldmVudCk7XG5cblx0XHRpZiAodGhpcy5wZXJzaXN0ZW5jZUtleSkge1xuXHRcdFx0dGhpcy5nZW5lcmF0b3IucGVyc2lzdEhlYWRlcnModGhpcy5wZXJzaXN0ZW5jZUtleSwgdGhpcy5wZXJzaXN0ZW5jZUlkLCB0aGlzLmhlYWRlcnMpO1xuXHRcdH1cblx0XHRzZXRUaW1lb3V0KHRoaXMuZXZhbHVhdGVQb3NpdGlvbmluZy5iaW5kKHRoaXMpLDExMSk7XG5cdH1cblx0Y2hhbmdlTG9ja2VkVGFibGVGaWx0ZXJlZEl0ZW1zKGV2ZW50KSB7XG5cdFx0aWYgKHRoaXMubG9ja2VkVGFibGUgJiYgIXRoaXMuaG9sZGxvY2tlZCkge1xuXHRcdFx0dGhpcy5sb2NrZWRUYWJsZS5maWx0ZXJlZEl0ZW1zID0gZXZlbnQ7XG5cdFx0XHR0aGlzLmxvY2tlZFRhYmxlLmluaXRWaXNpYmxlUm93cyhudWxsKTtcblx0XHR9XG5cdFx0dGhpcy5ob2xkbG9ja2VkID0gZmFsc2U7XG5cdH1cblx0Y2hhbmdlVW5sb2NrZWRUYWJsZUZpbHRlcmVkSXRlbXMoZXZlbnQpIHtcblx0XHRpZiAodGhpcy51bmxvY2tlZFRhYmxlICYmICF0aGlzLmhvbGR1bmxvY2tlZCkge1xuXHRcdFx0dGhpcy51bmxvY2tlZFRhYmxlLmZpbHRlcmVkSXRlbXMgPSBldmVudDtcblx0XHRcdHRoaXMudW5sb2NrZWRUYWJsZS5pbml0VmlzaWJsZVJvd3MobnVsbCk7XG5cdFx0fVxuXHRcdHRoaXMuaG9sZHVubG9ja2VkID0gZmFsc2U7XG5cdH1cblx0b25QYWdpbmF0aW9uQ2hhbmdlKGV2ZW50KSB7XG5cdFx0dGhpcy5wYWdlSW5mbyA9IGV2ZW50O1xuXHRcdHRoaXMuaG9sZGxvY2tlZCA9IHRydWU7XG5cdFx0dGhpcy5ob2xkdW5sb2NrZWQgPSB0cnVlO1xuXHRcdHRoaXMubG9ja2VkVGFibGUuZXZhbHVhdGVSb3dzKCk7XG5cdFx0dGhpcy51bmxvY2tlZFRhYmxlLmV2YWx1YXRlUm93cygpO1xuXHR9XG5cblx0dGFibGVBY3Rpb24oZXZlbnQpIHtcblx0XHR0aGlzLm9uYWN0aW9uLmVtaXQoZXZlbnQpXG5cdH1cblxuXHRvbkRyb3AoZXZlbnQ6RHJvcEV2ZW50KXtcblxuXHR9XG5cdG9uQ2VsbEVkaXQoZXZlbnQpe1xuXHRcdHRoaXMub25DZWxsQ29udGVudEVkaXQuZW1pdChldmVudCk7XG5cdH1cblx0b25UYWJsZUZpbHRlcihldmVudCl7XG5cdFx0dGhpcy5vbmZpbHRlci5lbWl0KGV2ZW50KTtcblx0fVxufVxuXG4iXX0=