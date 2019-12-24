import * as tslib_1 from "tslib";
/*
* Provides rendering of a table which is using the given FlexibleTableHeader set in
* order to tabulate the given data. As per definition of earch header component,
* a column could be hidden, sortable, or draggable. Each table row can expand/collapse
* or respond to a click action.
*/
import { Component, Input, Output, ViewChild, OnChanges, OnInit, Renderer, EventEmitter } from '@angular/core';
import { TableHeadersGenerator } from './components/table-headers-generator';
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
export { LockTableComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jay50YWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvZmxleGlibGUtdGFibGUvIiwic291cmNlcyI6WyJzcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2xvY2sudGFibGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7RUFLRTtBQUNGLE9BQU8sRUFDSCxTQUFTLEVBQ1osS0FBSyxFQUNMLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULE1BQU0sRUFDTixRQUFRLEVBQ1IsWUFBWSxFQUNaLE1BQU0sZUFBZSxDQUFDO0FBSXZCLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBTzdFLElBQWEsa0JBQWtCLEdBQS9CLE1BQWEsa0JBQWtCO0lBOEYzQixZQUNNLFNBQWdDLEVBQ2hDLFFBQWtCO1FBRGxCLGNBQVMsR0FBVCxTQUFTLENBQXVCO1FBQ2hDLGFBQVEsR0FBUixRQUFRLENBQVU7UUE5RjNCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFDbkIsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFJckIsa0JBQWEsR0FBRyxFQUFFLENBQUM7UUFHVCxlQUFVLEdBQUc7WUFDdEIsY0FBYyxFQUFFLGlCQUFpQjtZQUNqQyxnQkFBZ0IsRUFBRSxtQkFBbUI7WUFDckMsU0FBUyxFQUFFLGVBQWU7WUFDMUIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsU0FBUyxFQUFFLE9BQU87WUFDbEIsUUFBUSxFQUFFLE1BQU07WUFDaEIsWUFBWSxFQUFFLFVBQVU7U0FDeEIsQ0FBQztRQWtCUSxlQUFVLEdBQUcsd0JBQXdCLENBQUM7UUFTN0MscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBeUJwQixhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUc5QixzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBR3ZDLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRzlCLDBCQUFx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S0FBSyxDQUFDLGlCQUFpQixDQUFDOzJEQUNVO0FBR2hDO0lBREMsS0FBSyxDQUFDLGdCQUFnQixDQUFDOzBEQUNPO0FBRy9CO0lBREMsS0FBSyxDQUFDLG1CQUFtQixDQUFDOzZEQUNPO0FBSXJDO0lBREMsTUFBTSxDQUFDLFVBQVUsQ0FBQztvREFDbUI7QUFHdEM7SUFEQyxNQUFNLENBQUMsbUJBQW1CLENBQUM7NkRBQ21CO0FBRy9DO0lBREMsTUFBTSxDQUFDLFVBQVUsQ0FBQztvREFDbUI7QUFHdEM7SUFEQyxNQUFNLENBQUMsdUJBQXVCLENBQUM7aUVBQ21CO0FBR25EO0lBREMsU0FBUyxDQUFDLGFBQWEsRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQzt1REFDRjtBQUd4QztJQURDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUM7eURBQ0Y7QUFyRjlCLGtCQUFrQjtJQUw5QixTQUFTLENBQUM7UUFDVixRQUFRLEVBQUUsWUFBWTtRQUN0QiwyMERBQTBDOztLQUUxQyxDQUFDO0dBQ1csa0JBQWtCLENBc085QjtTQXRPWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuKiBQcm92aWRlcyByZW5kZXJpbmcgb2YgYSB0YWJsZSB3aGljaCBpcyB1c2luZyB0aGUgZ2l2ZW4gRmxleGlibGVUYWJsZUhlYWRlciBzZXQgaW5cbiogb3JkZXIgdG8gdGFidWxhdGUgdGhlIGdpdmVuIGRhdGEuIEFzIHBlciBkZWZpbml0aW9uIG9mIGVhcmNoIGhlYWRlciBjb21wb25lbnQsXG4qIGEgY29sdW1uIGNvdWxkIGJlIGhpZGRlbiwgc29ydGFibGUsIG9yIGRyYWdnYWJsZS4gRWFjaCB0YWJsZSByb3cgY2FuIGV4cGFuZC9jb2xsYXBzZVxuKiBvciByZXNwb25kIHRvIGEgY2xpY2sgYWN0aW9uLlxuKi9cbmltcG9ydCB7XG4gICAgQ29tcG9uZW50LFxuXHRJbnB1dCxcblx0T3V0cHV0LFxuXHRWaWV3Q2hpbGQsXG5cdE9uQ2hhbmdlcyxcblx0T25Jbml0LFxuXHRSZW5kZXJlcixcblx0RXZlbnRFbWl0dGVyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBEcm9wRXZlbnQsIERyYWdFdmVudCB9IGZyb20gJ0BzZWRlaC9kcmFnLWVuYWJsZWQnO1xuaW1wb3J0IHsgVGFibGVWaWV3Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUYWJsZUhlYWRlcnNHZW5lcmF0b3IgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUtaGVhZGVycy1nZW5lcmF0b3InO1xuXG5AQ29tcG9uZW50KHtcblx0c2VsZWN0b3I6ICdsb2NrLXRhYmxlJyxcblx0dGVtcGxhdGVVcmw6ICcuL2xvY2sudGFibGUuY29tcG9uZW50Lmh0bWwnLFxuXHRzdHlsZVVybHM6IFsnLi9sb2NrLnRhYmxlLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTG9ja1RhYmxlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuXG5cdGhvbGRsb2NrZWQgPSBmYWxzZTtcblx0aG9sZHVubG9ja2VkID0gZmFsc2U7XG5cdGxvY2tlZEhlYWRlcnM6YW55O1xuXHR1bmxvY2tlZEhlYWRlcnM6YW55O1xuXHRmb3JtZWRpdGVtczphbnk7XG5cdGZpbHRlcmVkSXRlbXMgPSBbXTtcblxuICAgIEBJbnB1dChcInZvY2FidWxhcnlcIilcbiAgICBwdWJsaWMgdm9jYWJ1bGFyeSA9IHtcblx0XHRjb25maWd1cmVUYWJsZTogXCJDb25maWd1cmUgVGFibGVcIixcblx0XHRjb25maWd1cmVDb2x1bW5zOiBcIkNvbmZpZ3VyZSBDb2x1bW5zXCIsXG5cdFx0Y2xpY2tTb3J0OiBcIkNsaWNrIHRvIFNvcnRcIixcblx0XHRzZXRTaXplOiBcIlNldCBTaXplXCIsXG5cdFx0Zmlyc3RQYWdlOiBcIkZpcnN0XCIsXG5cdFx0bGFzdFBhZ2U6IFwiTGFzdFwiLFxuXHRcdHByZXZpb3VzUGFnZTogXCJQcmV2aW91c1wiXG5cdH07XG5cbiAgICBASW5wdXQoXCJwZXJzaXN0ZW5jZUlkXCIpXG4gICAgcHVibGljIHBlcnNpc3RlbmNlSWQ6IHN0cmluZztcblxuICAgIEBJbnB1dChcInBlcnNpc3RlbmNlS2V5XCIpXG4gICAgcHVibGljIHBlcnNpc3RlbmNlS2V5OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoXCJjYXB0aW9uXCIpXG4gICAgcHVibGljIGNhcHRpb246IHN0cmluZztcblxuICAgIEBJbnB1dChcImFjdGlvblwiKVxuICAgIHB1YmxpYyBhY3Rpb246IHN0cmluZztcblxuICAgIEBJbnB1dChcImFjdGlvbktleXNcIilcbiAgICBwdWJsaWMgYWN0aW9uS2V5cztcblxuICAgIEBJbnB1dChcInRhYmxlQ2xhc3NcIilcbiAgICBwdWJsaWMgdGFibGVDbGFzcyA9ICdkZWZhdWx0LWZsZXhpYmxlLXRhYmxlJztcblxuXHRASW5wdXQoXCJoZWFkZXJzXCIpXG5cdHB1YmxpYyBoZWFkZXJzOiBhbnlbXTtcblxuXHRASW5wdXQoXCJpdGVtc1wiKVxuXHRwdWJsaWMgaXRlbXM6IGFueVtdO1xuXG4gICAgQElucHV0KCdpbmxpbmVQYWdpbmF0aW9uJylcbiAgICBpbmxpbmVQYWdpbmF0aW9uID0gZmFsc2U7XG5cblx0QElucHV0KFwicGFnZUluZm9cIilcblx0cHVibGljIHBhZ2VJbmZvOiBhbnk7XG5cblx0QElucHV0KFwidGFibGVJbmZvXCIpXG5cdHB1YmxpYyB0YWJsZUluZm86IGFueTtcblxuICAgIEBJbnB1dChcImNvbmZpZ3VyYWJsZVwiKVxuICAgIHB1YmxpYyBjb25maWd1cmFibGU6IGJvb2xlYW47XG5cblx0QElucHV0KFwiY29uZmlnQWRkb25cIilcblx0cHVibGljIGNvbmZpZ0FkZG9uOiBhbnk7XG5cblx0QElucHV0KFwiZW5hYmxlRmlsdGVyaW5nXCIpXG4gICAgcHVibGljIGVuYWJsZUZpbHRlcmluZzogYm9vbGVhbjtcblxuICAgIEBJbnB1dChcImVuYWJsZUluZGV4aW5nXCIpXG4gICAgcHVibGljIGVuYWJsZUluZGV4aW5nOiBib29sZWFuO1xuXG4gICAgQElucHV0KFwiZmlsdGVyd2hpbGV0eXBpbmdcIilcbiAgICBwdWJsaWMgZmlsdGVyd2hpbGV0eXBpbmc6IGJvb2xlYW47XG5cblxuXHRAT3V0cHV0KCdvbmFjdGlvbicpXG5cdHByaXZhdGUgb25hY3Rpb24gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cblx0QE91dHB1dCgnb25DZWxsQ29udGVudEVkaXQnKVxuXHRwcml2YXRlIG9uQ2VsbENvbnRlbnRFZGl0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG5cdEBPdXRwdXQoJ29uZmlsdGVyJylcblx0cHJpdmF0ZSBvbmZpbHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuXHRAT3V0cHV0KCdvbmNvbmZpZ3VyYXRpb25jaGFuZ2UnKVxuXHRwcml2YXRlIG9uY29uZmlndXJhdGlvbmNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuXHRAVmlld0NoaWxkKCdsb2NrZWRUYWJsZScsIHtzdGF0aWM6IGZhbHNlfSlcblx0cHJpdmF0ZSBsb2NrZWRUYWJsZTogVGFibGVWaWV3Q29tcG9uZW50O1xuXG5cdEBWaWV3Q2hpbGQoJ3VubG9ja2VkVGFibGUnLCB7c3RhdGljOiBmYWxzZX0pXG5cdHByaXZhdGUgdW5sb2NrZWRUYWJsZTogVGFibGVWaWV3Q29tcG9uZW50O1xuXG4gICAgc2Nyb2xsKGV2ZW50KSB7XG5cdFx0dGhpcy5yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUoXG5cdFx0XHRcdHRoaXMubG9ja2VkVGFibGUuZWwubmF0aXZlRWxlbWVudCxcblx0XHRcdFx0XCJsZWZ0XCIsXG5cdFx0XHRcdGV2ZW50LnRhcmdldC5zY3JvbGxMZWZ0K1wicHhcIik7XG5cdH1cblxuICAgIGNvbnN0cnVjdG9yKFxuXHRcdHByaXZhdGUgZ2VuZXJhdG9yOiBUYWJsZUhlYWRlcnNHZW5lcmF0b3IsXG5cdFx0cHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXJcblx0KSB7fVxuXG5cdG5nT25DaGFuZ2VzKGNoYW5nZXM6IGFueSkge1xuXHRcdGlmIChjaGFuZ2VzLml0ZW1zKSB7XG5cdFx0XHRjb25zdCBsaXN0ID0gW107XG5cdFx0XHR0aGlzLml0ZW1zLm1hcChcblx0XHRcdFx0KGl0ZW06IGFueSkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGNvcHkgPSBPYmplY3QuYXNzaWduKHt9LCBpdGVtKTtcblx0XHRcdFx0XHR0aGlzLmhlYWRlcnMubWFwKFxuXHRcdFx0XHRcdFx0KGhlYWRlcjogYW55KSA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmIChoZWFkZXIuZm9ybWF0KSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgdiA9IGNvcHlbaGVhZGVyLmtleV07XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHYgJiYgdHlwZW9mIHYgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBmb3JtYXQgPSBoZWFkZXIuZm9ybWF0LnNwbGl0KCc6Jyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoZm9ybWF0WzBdID09PSAnY2FsZW5kYXInKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvcHlbaGVhZGVyLmtleV0gPSBEYXRlLnBhcnNlKHYpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChmb3JtYXRbMF0gPT09ICdkYXRlJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb3B5W2hlYWRlci5rZXldID0gRGF0ZS5wYXJzZSh2KTtcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZm9ybWF0WzBdID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb3B5W2hlYWRlci5rZXldID0gZm9ybWF0Lmxlbmd0aCA+IDIgPyBwYXJzZUZsb2F0KHYpIDogcGFyc2VJbnQodiwgMTApO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChmb3JtYXRbMF0gPT09ICdjdXJyZW5jeScpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29weVtoZWFkZXIua2V5XSA9IHBhcnNlRmxvYXQodi5yZXBsYWNlKC9bXjAtOVxcLi1dKy9nLFwiXCIpKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0bGlzdC5wdXNoKGNvcHkpO1xuXHRcdFx0XHR9XG5cdFx0XHQpXG5cdFx0XHR0aGlzLmZvcm1lZGl0ZW1zID0gbGlzdDtcblx0XHR9XG5cdH1cblx0bmdPbkluaXQoKSB7XG5cdFx0aWYgKHRoaXMucGFnZUluZm8pIHtcblx0XHRcdGlmICghdGhpcy5wYWdlSW5mby50bykge1xuXHRcdFx0XHR0aGlzLnBhZ2VJbmZvLnRvID0gdGhpcy5wYWdlSW5mby5wYWdlU2l6ZTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5wYWdlSW5mbyA9IHtcbiAgICAgICAgICAgICAgICBjb250ZW50U2l6ZTogMTAwMDAwLFxuICAgICAgICAgICAgICAgIHBhZ2VTaXplOiAxMDAwMDAsXG4gICAgICAgICAgICAgICAgcGFnZXM6IDEsXG4gICAgICAgICAgICAgICAgZnJvbTogMCxcbiAgICAgICAgICAgICAgICB0bzogMTAwMDAwLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRQYWdlOiAxLFxuICAgICAgICAgICAgICAgIG1heFdpZHRoOiBcIjBcIlxuICAgICAgICAgICAgfTtcblx0XHR9XG5cdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcblx0XHRcdGNvbnN0IGhlYWRlcnM6YW55ID0gdGhpcy5nZW5lcmF0b3IucmV0cmVpdmVIZWFkZXJzKHRoaXMucGVyc2lzdGVuY2VLZXksIHRoaXMucGVyc2lzdGVuY2VJZCk7XG5cblx0XHRcdGlmIChoZWFkZXJzKSB7XG5cdFx0XHRcdHRoaXMuaGVhZGVycyA9IGhlYWRlcnM7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICghdGhpcy5oZWFkZXJzKSB7XG5cdFx0XHR0aGlzLmhlYWRlcnMgPSB0aGlzLmdlbmVyYXRvci5nZW5lcmF0ZUhlYWRlcnNGb3IodGhpcy5pdGVtc1swXSxcIlwiLCA1LCB0aGlzLmVuYWJsZUZpbHRlcmluZyk7XG5cdFx0XHRpZiAodGhpcy5wZXJzaXN0ZW5jZUtleSkge1xuXHRcdFx0XHR0aGlzLmdlbmVyYXRvci5wZXJzaXN0SGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQsIHRoaXMuaGVhZGVycyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IHRoaXMuZm9ybWVkaXRlbXMgPyB0aGlzLmZvcm1lZGl0ZW1zOiB0aGlzLml0ZW1zO1xuXHRcdHRoaXMucGFnZUluZm8uY29udGVudFNpemUgPSB0aGlzLml0ZW1zLmxlbmd0aDtcblx0XHRcblx0XHR0aGlzLnJlY29uZmlndXJlKHRoaXMuaGVhZGVycyk7XG5cblx0fVxuXG5cdGV2YWx1YXRlUG9zaXRpb25pbmcoKSB7XG5cdFx0dGhpcy5yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUoXG5cdFx0XHR0aGlzLnVubG9ja2VkVGFibGUuZWwubmF0aXZlRWxlbWVudCxcblx0XHRcdFwibWFyZ2luLWxlZnRcIixcblx0XHRcdHRoaXMubG9ja2VkVGFibGUub2Zmc2V0V2lkdGgoKStcInB4XCIpO1xuXHR9XG5cblx0cmVjb25maWd1cmUoZXZlbnQpIHtcblx0XHR0aGlzLmhlYWRlcnMgPSBldmVudDtcblx0XHR0aGlzLmxvY2tlZEhlYWRlcnMgPSB0aGlzLmhlYWRlcnMuZmlsdGVyKCAoaXRlbSkgPT4gaXRlbS5sb2NrZWQgPT09IHRydWUgJiYgaXRlbS5wcmVzZW50KTtcblx0XHR0aGlzLnVubG9ja2VkSGVhZGVycyA9IHRoaXMuaGVhZGVycy5maWx0ZXIoIChpdGVtKSA9PiBpdGVtLmxvY2tlZCAhPT0gdHJ1ZSAgJiYgaXRlbS5wcmVzZW50KTtcdFxuXHRcdHRoaXMub25jb25maWd1cmF0aW9uY2hhbmdlLmVtaXQoZXZlbnQpO1xuXG5cdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcblx0XHRcdHRoaXMuZ2VuZXJhdG9yLnBlcnNpc3RIZWFkZXJzKHRoaXMucGVyc2lzdGVuY2VLZXksIHRoaXMucGVyc2lzdGVuY2VJZCwgdGhpcy5oZWFkZXJzKTtcblx0XHR9XG5cdFx0c2V0VGltZW91dCh0aGlzLmV2YWx1YXRlUG9zaXRpb25pbmcuYmluZCh0aGlzKSwxMTEpO1xuXHR9XG5cblx0b25sb2NrKGV2ZW50KSB7XG5cdFx0dGhpcy5sb2NrZWRIZWFkZXJzID0gdGhpcy5oZWFkZXJzLmZpbHRlciggKGl0ZW0pID0+IGl0ZW0ubG9ja2VkID09PSB0cnVlICYmIGl0ZW0ucHJlc2VudCk7XG5cdFx0dGhpcy51bmxvY2tlZEhlYWRlcnMgPSB0aGlzLmhlYWRlcnMuZmlsdGVyKCAoaXRlbSkgPT4gaXRlbS5sb2NrZWQgIT09IHRydWUgICYmIGl0ZW0ucHJlc2VudCk7XHRcblx0XHR0aGlzLm9uY29uZmlndXJhdGlvbmNoYW5nZS5lbWl0KGV2ZW50KTtcblxuXHRcdGlmICh0aGlzLnBlcnNpc3RlbmNlS2V5KSB7XG5cdFx0XHR0aGlzLmdlbmVyYXRvci5wZXJzaXN0SGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQsIHRoaXMuaGVhZGVycyk7XG5cdFx0fVxuXHRcdHNldFRpbWVvdXQodGhpcy5ldmFsdWF0ZVBvc2l0aW9uaW5nLmJpbmQodGhpcyksMTExKTtcblx0fVxuXHRjaGFuZ2VMb2NrZWRUYWJsZUZpbHRlcmVkSXRlbXMoZXZlbnQpIHtcblx0XHRpZiAodGhpcy5sb2NrZWRUYWJsZSAmJiAhdGhpcy5ob2xkbG9ja2VkKSB7XG5cdFx0XHR0aGlzLmxvY2tlZFRhYmxlLmZpbHRlcmVkSXRlbXMgPSBldmVudDtcblx0XHRcdHRoaXMubG9ja2VkVGFibGUuaW5pdFZpc2libGVSb3dzKG51bGwpO1xuXHRcdH1cblx0XHR0aGlzLmhvbGRsb2NrZWQgPSBmYWxzZTtcblx0fVxuXHRjaGFuZ2VVbmxvY2tlZFRhYmxlRmlsdGVyZWRJdGVtcyhldmVudCkge1xuXHRcdGlmICh0aGlzLnVubG9ja2VkVGFibGUgJiYgIXRoaXMuaG9sZHVubG9ja2VkKSB7XG5cdFx0XHR0aGlzLnVubG9ja2VkVGFibGUuZmlsdGVyZWRJdGVtcyA9IGV2ZW50O1xuXHRcdFx0dGhpcy51bmxvY2tlZFRhYmxlLmluaXRWaXNpYmxlUm93cyhudWxsKTtcblx0XHR9XG5cdFx0dGhpcy5ob2xkdW5sb2NrZWQgPSBmYWxzZTtcblx0fVxuXHRvblBhZ2luYXRpb25DaGFuZ2UoZXZlbnQpIHtcblx0XHR0aGlzLnBhZ2VJbmZvID0gZXZlbnQ7XG5cdFx0dGhpcy5ob2xkbG9ja2VkID0gdHJ1ZTtcblx0XHR0aGlzLmhvbGR1bmxvY2tlZCA9IHRydWU7XG5cdFx0dGhpcy5sb2NrZWRUYWJsZS5ldmFsdWF0ZVJvd3MoKTtcblx0XHR0aGlzLnVubG9ja2VkVGFibGUuZXZhbHVhdGVSb3dzKCk7XG5cdH1cblxuXHR0YWJsZUFjdGlvbihldmVudCkge1xuXHRcdHRoaXMub25hY3Rpb24uZW1pdChldmVudClcblx0fVxuXG5cdG9uRHJvcChldmVudDpEcm9wRXZlbnQpe1xuXG5cdH1cblx0b25DZWxsRWRpdChldmVudCl7XG5cdFx0dGhpcy5vbkNlbGxDb250ZW50RWRpdC5lbWl0KGV2ZW50KTtcblx0fVxuXHRvblRhYmxlRmlsdGVyKGV2ZW50KXtcblx0XHR0aGlzLm9uZmlsdGVyLmVtaXQoZXZlbnQpO1xuXHR9XG59XG5cbiJdfQ==