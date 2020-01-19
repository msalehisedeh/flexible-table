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
        this.headerSeparation = true;
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
    Input()
], LockTableComponent.prototype, "headerSeparation", void 0);
tslib_1.__decorate([
    Input("persistenceId")
], LockTableComponent.prototype, "persistenceId", void 0);
tslib_1.__decorate([
    Input("persistenceKey")
], LockTableComponent.prototype, "persistenceKey", void 0);
tslib_1.__decorate([
    Input()
], LockTableComponent.prototype, "caption", void 0);
tslib_1.__decorate([
    Input()
], LockTableComponent.prototype, "action", void 0);
tslib_1.__decorate([
    Input()
], LockTableComponent.prototype, "actionKeys", void 0);
tslib_1.__decorate([
    Input()
], LockTableComponent.prototype, "tableClass", void 0);
tslib_1.__decorate([
    Input()
], LockTableComponent.prototype, "headers", void 0);
tslib_1.__decorate([
    Input()
], LockTableComponent.prototype, "items", void 0);
tslib_1.__decorate([
    Input()
], LockTableComponent.prototype, "inlinePagination", void 0);
tslib_1.__decorate([
    Input()
], LockTableComponent.prototype, "pageInfo", void 0);
tslib_1.__decorate([
    Input()
], LockTableComponent.prototype, "tableInfo", void 0);
tslib_1.__decorate([
    Input()
], LockTableComponent.prototype, "configurable", void 0);
tslib_1.__decorate([
    Input()
], LockTableComponent.prototype, "configAddon", void 0);
tslib_1.__decorate([
    Input()
], LockTableComponent.prototype, "enableFiltering", void 0);
tslib_1.__decorate([
    Input()
], LockTableComponent.prototype, "enableIndexing", void 0);
tslib_1.__decorate([
    Input()
], LockTableComponent.prototype, "filterwhiletyping", void 0);
tslib_1.__decorate([
    Output()
], LockTableComponent.prototype, "onaction", void 0);
tslib_1.__decorate([
    Output()
], LockTableComponent.prototype, "onCellContentEdit", void 0);
tslib_1.__decorate([
    Output()
], LockTableComponent.prototype, "onfilter", void 0);
tslib_1.__decorate([
    Output()
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
        template: "<div class=\"caption\">\n\t<table-configuration\n\t\t*ngIf=\"configurable\" \n\t\t[headers]=\"headers\" \n\t\t[title]=\"vocabulary.configureColumns\" \n\t\t[action]=\"vocabulary.configureTable\"\n\t\t[configAddon]=\"configAddon\"\n\t\t(onchange)=\"reconfigure($event)\"></table-configuration>\n\n\t<div *ngIf=\"caption\" [textContent]=\"caption\"></div>\n</div>\n<div class=\"smart-table-wrap\" (scroll)=\"scroll($event)\">\n\t<table-view #lockedTable\n\t\tclass=\"locked-table\"\n\t\tlockable=\"true\"\n\t\t[headers]=\"lockedHeaders\" \n\t\t[items]=\"filteredItems\" \n        [pageInfo]=\"pageInfo\"\n        [vocabulary]=\"vocabulary\"\n        [filterwhiletyping]=\"filterwhiletyping\"\n\t\t[enableFiltering]=\"enableFiltering\"\n\t\t[enableIndexing]=\"enableIndexing\"\n\t\t[headerSeparation]=\"headerSeparation\"\n\n\t\t(onchange)=\"onlock($event)\"\n\t\t(onDrop)=\"onDrop($event)\"\n        (onfilter)=\"onTableFilter($event)\"\n\t\t(onCellContentEdit)=\"onCellEdit($event)\"\n\t\t(onfilter)=\"changeUnlockedTableFilteredItems($event)\"\n\t\t(onaction)=\"tableAction($event)\"></table-view>\n\n    <table-view #unlockedTable\n\t\tclass=\"unlocked-table\"\n\t\tlockable=\"true\"\n\t\t[headers]=\"unlockedHeaders\" \n\t\t[items]=\"filteredItems\" \n        [pageInfo]=\"pageInfo\"\n        [vocabulary]=\"vocabulary\"\n        [filterwhiletyping]=\"filterwhiletyping\"\n\t\t[enableFiltering]=\"enableFiltering\"\n\t\t[headerSeparation]=\"headerSeparation\"\n\n\t\t(onDrop)=\"onDrop($event)\"\n        (onfilter)=\"onTableFilter($event)\"\n\t\t(onchange)=\"onlock($event)\"\n\t\t(onCellContentEdit)=\"onCellEdit($event)\"\n\t\t(onfilter)=\"changeLockedTableFilteredItems($event)\"\n\t\t(onaction)=\"tableAction($event)\"></table-view>\n\t\n</div>\n<table-pagination #pager\n\t[info]=\"pageInfo\" \n    [inline]=\"inlinePagination\" \n\t[vocabulary]=\"vocabulary\" \n    (onchange)=\"onPaginationChange($event)\"></table-pagination>\n",
        styles: [":host{width:100%;position:relative;margin:0 auto;display:table}:host .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host .caption{background-color:#c3e5e2;border-radius:2px;box-sizing:border-box;color:#1b1b1b;caption-side:top;font-size:14px;margin-bottom:15px;padding:5px 6px;text-align:left;width:100%}:host .caption table-configuration{display:inline-block;float:right;position:unset}:host .smart-table-wrap{border-spacing:0;border-collapse:collapse;border-right:1px solid #aaa;border-bottom:1px solid #aaa;box-sizing:border-box;width:100%;position:relative;overflow-x:auto}:host .smart-table-wrap .unlocked-table ::ng-deep table{max-width:100%;margin-bottom:0;margin-top:0}:host .smart-table-wrap .unlocked-table ::ng-deep table th td{white-space:nowrap}:host .smart-table-wrap .unlocked-table ::ng-deep table th .locker{cursor:pointer;color:#00925b;text-align:center}:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr{background-color:#fff}:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr.hover,:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr:hover{background-color:#ffeed2}:host .smart-table-wrap .unlocked-table ::ng-deep table img{height:14px}:host .smart-table-wrap .locked-table{position:absolute;margin:0 auto;display:inline-table;border-spacing:0;border-collapse:collapse;float:left;z-index:2;width:auto}:host .smart-table-wrap .locked-table ::ng-deep table{display:inline-block;border-right:1px solid #aaa;margin:0;width:auto}:host .smart-table-wrap .locked-table ::ng-deep table th td{white-space:nowrap}:host .smart-table-wrap .locked-table ::ng-deep table th .locker{cursor:pointer;color:#8b0224;text-align:center}:host .smart-table-wrap .locked-table ::ng-deep table tbody tr{background-color:#fff}:host .smart-table-wrap .locked-table ::ng-deep table tbody tr.hover,:host .smart-table-wrap .locked-table ::ng-deep table tbody tr:hover{background-color:#ffeed2}:host .smart-table-wrap .locked-table ::ng-deep table img{height:14px}@media screen and (max-width:600px){.smart-table-wrap{border:0!important;position:unset;overflow-x:unset}.smart-table-wrap .unlocked-table{margin-left:0!important;position:unset!important}.smart-table-wrap .unlocked-table ::ng-deep table td,.smart-table-wrap .unlocked-table ::ng-deep table th{white-space:unset}.smart-table-wrap .unlocked-table ::ng-deep table img{height:30px}.smart-table-wrap .locked-table{position:unset!important;margin:0!important;display:table;left:0!important}.smart-table-wrap .locked-table ::ng-deep table{display:table!important;margin:0!important;width:100%!important}.smart-table-wrap .locked-table ::ng-deep table td,.smart-table-wrap .locked-table ::ng-deep table th{white-space:unset}.smart-table-wrap .locked-table ::ng-deep table td.index{border-right:0}.smart-table-wrap .locked-table ::ng-deep table img{height:30px}}"]
    })
], LockTableComponent);
export { LockTableComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jay50YWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvZmxleGlibGUtdGFibGUvIiwic291cmNlcyI6WyJzcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2xvY2sudGFibGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7RUFLRTtBQUNGLE9BQU8sRUFDSCxTQUFTLEVBQ1osS0FBSyxFQUNMLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULE1BQU0sRUFDTixRQUFRLEVBQ1IsWUFBWSxFQUNaLE1BQU0sZUFBZSxDQUFDO0FBSXZCLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBTzdFLElBQWEsa0JBQWtCLEdBQS9CLE1BQWEsa0JBQWtCO0lBNkQzQixZQUNNLFNBQWdDLEVBQ2hDLFFBQWtCO1FBRGxCLGNBQVMsR0FBVCxTQUFTLENBQXVCO1FBQ2hDLGFBQVEsR0FBUixRQUFRLENBQVU7UUE3RDNCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFDbkIsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFJckIsa0JBQWEsR0FBRyxFQUFFLENBQUM7UUFHVCxlQUFVLEdBQUc7WUFDdEIsY0FBYyxFQUFFLGlCQUFpQjtZQUNqQyxnQkFBZ0IsRUFBRSxtQkFBbUI7WUFDckMsU0FBUyxFQUFFLGVBQWU7WUFDMUIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsU0FBUyxFQUFFLE9BQU87WUFDbEIsUUFBUSxFQUFFLE1BQU07WUFDaEIsWUFBWSxFQUFFLFVBQVU7U0FDeEIsQ0FBQztRQUVPLHFCQUFnQixHQUFHLElBQUksQ0FBQztRQVVyQixlQUFVLEdBQUcsd0JBQXdCLENBQUM7UUFHdEMscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBVW5CLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzlCLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDdkMsYUFBUSxHQUFHLElBQUks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QUFLLEVBQUU7NkRBQTRCO0FBRzdCO0lBQVQsTUFBTSxFQUFFO29EQUF1QztBQUN0QztJQUFULE1BQU0sRUFBRTs2REFBZ0Q7QUFDL0M7SUFBVCxNQUFNLEVBQUU7b0RBQXVDO0FBQ3RDO0lBQVQsTUFBTSxFQUFFO2lFQUFvRDtBQUc3RDtJQURDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUM7dURBQ0Y7QUFHeEM7SUFEQyxTQUFTLENBQUMsZUFBZSxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDO3lEQUNGO0FBcEQ5QixrQkFBa0I7SUFMOUIsU0FBUyxDQUFDO1FBQ1YsUUFBUSxFQUFFLFlBQVk7UUFDdEIsNjVEQUEwQzs7S0FFMUMsQ0FBQztHQUNXLGtCQUFrQixDQXFNOUI7U0FyTVksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiogUHJvdmlkZXMgcmVuZGVyaW5nIG9mIGEgdGFibGUgd2hpY2ggaXMgdXNpbmcgdGhlIGdpdmVuIEZsZXhpYmxlVGFibGVIZWFkZXIgc2V0IGluXG4qIG9yZGVyIHRvIHRhYnVsYXRlIHRoZSBnaXZlbiBkYXRhLiBBcyBwZXIgZGVmaW5pdGlvbiBvZiBlYXJjaCBoZWFkZXIgY29tcG9uZW50LFxuKiBhIGNvbHVtbiBjb3VsZCBiZSBoaWRkZW4sIHNvcnRhYmxlLCBvciBkcmFnZ2FibGUuIEVhY2ggdGFibGUgcm93IGNhbiBleHBhbmQvY29sbGFwc2Vcbiogb3IgcmVzcG9uZCB0byBhIGNsaWNrIGFjdGlvbi5cbiovXG5pbXBvcnQge1xuICAgIENvbXBvbmVudCxcblx0SW5wdXQsXG5cdE91dHB1dCxcblx0Vmlld0NoaWxkLFxuXHRPbkNoYW5nZXMsXG5cdE9uSW5pdCxcblx0UmVuZGVyZXIsXG5cdEV2ZW50RW1pdHRlclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRHJvcEV2ZW50LCBEcmFnRXZlbnQgfSBmcm9tICdAc2VkZWgvZHJhZy1lbmFibGVkJztcbmltcG9ydCB7IFRhYmxlVmlld0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90YWJsZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgVGFibGVIZWFkZXJzR2VuZXJhdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlLWhlYWRlcnMtZ2VuZXJhdG9yJztcblxuQENvbXBvbmVudCh7XG5cdHNlbGVjdG9yOiAnbG9jay10YWJsZScsXG5cdHRlbXBsYXRlVXJsOiAnLi9sb2NrLnRhYmxlLmNvbXBvbmVudC5odG1sJyxcblx0c3R5bGVVcmxzOiBbJy4vbG9jay50YWJsZS5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIExvY2tUYWJsZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcblxuXHRob2xkbG9ja2VkID0gZmFsc2U7XG5cdGhvbGR1bmxvY2tlZCA9IGZhbHNlO1xuXHRsb2NrZWRIZWFkZXJzOmFueTtcblx0dW5sb2NrZWRIZWFkZXJzOmFueTtcblx0Zm9ybWVkaXRlbXM6YW55O1xuXHRmaWx0ZXJlZEl0ZW1zID0gW107XG5cbiAgICBASW5wdXQoXCJ2b2NhYnVsYXJ5XCIpXG4gICAgcHVibGljIHZvY2FidWxhcnkgPSB7XG5cdFx0Y29uZmlndXJlVGFibGU6IFwiQ29uZmlndXJlIFRhYmxlXCIsXG5cdFx0Y29uZmlndXJlQ29sdW1uczogXCJDb25maWd1cmUgQ29sdW1uc1wiLFxuXHRcdGNsaWNrU29ydDogXCJDbGljayB0byBTb3J0XCIsXG5cdFx0c2V0U2l6ZTogXCJTZXQgU2l6ZVwiLFxuXHRcdGZpcnN0UGFnZTogXCJGaXJzdFwiLFxuXHRcdGxhc3RQYWdlOiBcIkxhc3RcIixcblx0XHRwcmV2aW91c1BhZ2U6IFwiUHJldmlvdXNcIlxuXHR9O1xuXG5cdEBJbnB1dCgpIGhlYWRlclNlcGFyYXRpb24gPSB0cnVlO1xuICAgIEBJbnB1dChcInBlcnNpc3RlbmNlSWRcIilcbiAgICBwdWJsaWMgcGVyc2lzdGVuY2VJZDogc3RyaW5nO1xuXG4gICAgQElucHV0KFwicGVyc2lzdGVuY2VLZXlcIilcbiAgICBwdWJsaWMgcGVyc2lzdGVuY2VLZXk6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGNhcHRpb246IHN0cmluZztcbiAgICBASW5wdXQoKSBhY3Rpb246IHN0cmluZztcbiAgICBASW5wdXQoKSBhY3Rpb25LZXlzO1xuICAgIEBJbnB1dCgpIHRhYmxlQ2xhc3MgPSAnZGVmYXVsdC1mbGV4aWJsZS10YWJsZSc7XG5cdEBJbnB1dCgpIGhlYWRlcnM6IGFueVtdO1xuXHRASW5wdXQoKSBpdGVtczogYW55W107XG4gICAgQElucHV0KCkgaW5saW5lUGFnaW5hdGlvbiA9IGZhbHNlO1xuXHRASW5wdXQoKSBwYWdlSW5mbzogYW55O1xuXHRASW5wdXQoKSB0YWJsZUluZm86IGFueTtcbiAgICBASW5wdXQoKSBjb25maWd1cmFibGU6IGJvb2xlYW47XG5cdEBJbnB1dCgpIGNvbmZpZ0FkZG9uOiBhbnk7XG5cdEBJbnB1dCgpIGVuYWJsZUZpbHRlcmluZzogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBlbmFibGVJbmRleGluZzogYm9vbGVhbjtcbiAgICBASW5wdXQoKSBmaWx0ZXJ3aGlsZXR5cGluZzogYm9vbGVhbjtcblxuXG5cdEBPdXRwdXQoKSBwcml2YXRlIG9uYWN0aW9uID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXHRAT3V0cHV0KCkgcHJpdmF0ZSBvbkNlbGxDb250ZW50RWRpdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblx0QE91dHB1dCgpIHByaXZhdGUgb25maWx0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdEBPdXRwdXQoKSBwcml2YXRlIG9uY29uZmlndXJhdGlvbmNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuXHRAVmlld0NoaWxkKCdsb2NrZWRUYWJsZScsIHtzdGF0aWM6IGZhbHNlfSlcblx0cHJpdmF0ZSBsb2NrZWRUYWJsZTogVGFibGVWaWV3Q29tcG9uZW50O1xuXG5cdEBWaWV3Q2hpbGQoJ3VubG9ja2VkVGFibGUnLCB7c3RhdGljOiBmYWxzZX0pXG5cdHByaXZhdGUgdW5sb2NrZWRUYWJsZTogVGFibGVWaWV3Q29tcG9uZW50O1xuXG4gICAgc2Nyb2xsKGV2ZW50KSB7XG5cdFx0dGhpcy5yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUoXG5cdFx0XHRcdHRoaXMubG9ja2VkVGFibGUuZWwubmF0aXZlRWxlbWVudCxcblx0XHRcdFx0XCJsZWZ0XCIsXG5cdFx0XHRcdGV2ZW50LnRhcmdldC5zY3JvbGxMZWZ0K1wicHhcIik7XG5cdH1cblxuICAgIGNvbnN0cnVjdG9yKFxuXHRcdHByaXZhdGUgZ2VuZXJhdG9yOiBUYWJsZUhlYWRlcnNHZW5lcmF0b3IsXG5cdFx0cHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXJcblx0KSB7fVxuXG5cdG5nT25DaGFuZ2VzKGNoYW5nZXM6IGFueSkge1xuXHRcdGlmIChjaGFuZ2VzLml0ZW1zKSB7XG5cdFx0XHRjb25zdCBsaXN0ID0gW107XG5cdFx0XHR0aGlzLml0ZW1zLm1hcChcblx0XHRcdFx0KGl0ZW06IGFueSkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGNvcHkgPSBPYmplY3QuYXNzaWduKHt9LCBpdGVtKTtcblx0XHRcdFx0XHR0aGlzLmhlYWRlcnMubWFwKFxuXHRcdFx0XHRcdFx0KGhlYWRlcjogYW55KSA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmIChoZWFkZXIuZm9ybWF0KSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgdiA9IGNvcHlbaGVhZGVyLmtleV07XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHYgJiYgdHlwZW9mIHYgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBmb3JtYXQgPSBoZWFkZXIuZm9ybWF0LnNwbGl0KCc6Jyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoZm9ybWF0WzBdID09PSAnY2FsZW5kYXInKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvcHlbaGVhZGVyLmtleV0gPSBEYXRlLnBhcnNlKHYpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChmb3JtYXRbMF0gPT09ICdkYXRlJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb3B5W2hlYWRlci5rZXldID0gRGF0ZS5wYXJzZSh2KTtcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZm9ybWF0WzBdID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb3B5W2hlYWRlci5rZXldID0gZm9ybWF0Lmxlbmd0aCA+IDIgPyBwYXJzZUZsb2F0KHYpIDogcGFyc2VJbnQodiwgMTApO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChmb3JtYXRbMF0gPT09ICdjdXJyZW5jeScpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29weVtoZWFkZXIua2V5XSA9IHBhcnNlRmxvYXQodi5yZXBsYWNlKC9bXjAtOVxcLi1dKy9nLFwiXCIpKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0bGlzdC5wdXNoKGNvcHkpO1xuXHRcdFx0XHR9XG5cdFx0XHQpXG5cdFx0XHR0aGlzLmZvcm1lZGl0ZW1zID0gbGlzdDtcblx0XHR9XG5cdH1cblx0bmdPbkluaXQoKSB7XG5cdFx0aWYgKHRoaXMucGFnZUluZm8pIHtcblx0XHRcdGlmICghdGhpcy5wYWdlSW5mby50bykge1xuXHRcdFx0XHR0aGlzLnBhZ2VJbmZvLnRvID0gdGhpcy5wYWdlSW5mby5wYWdlU2l6ZTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5wYWdlSW5mbyA9IHtcbiAgICAgICAgICAgICAgICBjb250ZW50U2l6ZTogMTAwMDAwLFxuICAgICAgICAgICAgICAgIHBhZ2VTaXplOiAxMDAwMDAsXG4gICAgICAgICAgICAgICAgcGFnZXM6IDEsXG4gICAgICAgICAgICAgICAgZnJvbTogMCxcbiAgICAgICAgICAgICAgICB0bzogMTAwMDAwLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRQYWdlOiAxLFxuICAgICAgICAgICAgICAgIG1heFdpZHRoOiBcIjBcIlxuICAgICAgICAgICAgfTtcblx0XHR9XG5cdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcblx0XHRcdGNvbnN0IGhlYWRlcnM6YW55ID0gdGhpcy5nZW5lcmF0b3IucmV0cmVpdmVIZWFkZXJzKHRoaXMucGVyc2lzdGVuY2VLZXksIHRoaXMucGVyc2lzdGVuY2VJZCk7XG5cblx0XHRcdGlmIChoZWFkZXJzKSB7XG5cdFx0XHRcdHRoaXMuaGVhZGVycyA9IGhlYWRlcnM7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICghdGhpcy5oZWFkZXJzKSB7XG5cdFx0XHR0aGlzLmhlYWRlcnMgPSB0aGlzLmdlbmVyYXRvci5nZW5lcmF0ZUhlYWRlcnNGb3IodGhpcy5pdGVtc1swXSxcIlwiLCA1LCB0aGlzLmVuYWJsZUZpbHRlcmluZyk7XG5cdFx0XHRpZiAodGhpcy5wZXJzaXN0ZW5jZUtleSkge1xuXHRcdFx0XHR0aGlzLmdlbmVyYXRvci5wZXJzaXN0SGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQsIHRoaXMuaGVhZGVycyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IHRoaXMuZm9ybWVkaXRlbXMgPyB0aGlzLmZvcm1lZGl0ZW1zOiB0aGlzLml0ZW1zO1xuXHRcdHRoaXMucGFnZUluZm8uY29udGVudFNpemUgPSB0aGlzLml0ZW1zLmxlbmd0aDtcblx0XHRcblx0XHR0aGlzLnJlY29uZmlndXJlKHRoaXMuaGVhZGVycyk7XG5cblx0fVxuXG5cdGV2YWx1YXRlUG9zaXRpb25pbmcoKSB7XG5cdFx0dGhpcy5yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUoXG5cdFx0XHR0aGlzLnVubG9ja2VkVGFibGUuZWwubmF0aXZlRWxlbWVudCxcblx0XHRcdFwibWFyZ2luLWxlZnRcIixcblx0XHRcdHRoaXMubG9ja2VkVGFibGUub2Zmc2V0V2lkdGgoKStcInB4XCIpO1xuXHR9XG5cblx0cmVjb25maWd1cmUoZXZlbnQpIHtcblx0XHR0aGlzLmhlYWRlcnMgPSBldmVudDtcblx0XHR0aGlzLmxvY2tlZEhlYWRlcnMgPSB0aGlzLmhlYWRlcnMuZmlsdGVyKCAoaXRlbSkgPT4gaXRlbS5sb2NrZWQgPT09IHRydWUgJiYgaXRlbS5wcmVzZW50KTtcblx0XHR0aGlzLnVubG9ja2VkSGVhZGVycyA9IHRoaXMuaGVhZGVycy5maWx0ZXIoIChpdGVtKSA9PiBpdGVtLmxvY2tlZCAhPT0gdHJ1ZSAgJiYgaXRlbS5wcmVzZW50KTtcdFxuXHRcdHRoaXMub25jb25maWd1cmF0aW9uY2hhbmdlLmVtaXQoZXZlbnQpO1xuXG5cdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcblx0XHRcdHRoaXMuZ2VuZXJhdG9yLnBlcnNpc3RIZWFkZXJzKHRoaXMucGVyc2lzdGVuY2VLZXksIHRoaXMucGVyc2lzdGVuY2VJZCwgdGhpcy5oZWFkZXJzKTtcblx0XHR9XG5cdFx0c2V0VGltZW91dCh0aGlzLmV2YWx1YXRlUG9zaXRpb25pbmcuYmluZCh0aGlzKSwxMTEpO1xuXHR9XG5cblx0b25sb2NrKGV2ZW50KSB7XG5cdFx0dGhpcy5sb2NrZWRIZWFkZXJzID0gdGhpcy5oZWFkZXJzLmZpbHRlciggKGl0ZW0pID0+IGl0ZW0ubG9ja2VkID09PSB0cnVlICYmIGl0ZW0ucHJlc2VudCk7XG5cdFx0dGhpcy51bmxvY2tlZEhlYWRlcnMgPSB0aGlzLmhlYWRlcnMuZmlsdGVyKCAoaXRlbSkgPT4gaXRlbS5sb2NrZWQgIT09IHRydWUgICYmIGl0ZW0ucHJlc2VudCk7XHRcblx0XHR0aGlzLm9uY29uZmlndXJhdGlvbmNoYW5nZS5lbWl0KGV2ZW50KTtcblxuXHRcdGlmICh0aGlzLnBlcnNpc3RlbmNlS2V5KSB7XG5cdFx0XHR0aGlzLmdlbmVyYXRvci5wZXJzaXN0SGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQsIHRoaXMuaGVhZGVycyk7XG5cdFx0fVxuXHRcdHNldFRpbWVvdXQodGhpcy5ldmFsdWF0ZVBvc2l0aW9uaW5nLmJpbmQodGhpcyksMTExKTtcblx0fVxuXHRjaGFuZ2VMb2NrZWRUYWJsZUZpbHRlcmVkSXRlbXMoZXZlbnQpIHtcblx0XHRpZiAodGhpcy5sb2NrZWRUYWJsZSAmJiAhdGhpcy5ob2xkbG9ja2VkKSB7XG5cdFx0XHR0aGlzLmxvY2tlZFRhYmxlLmZpbHRlcmVkSXRlbXMgPSBldmVudDtcblx0XHRcdHRoaXMubG9ja2VkVGFibGUuaW5pdFZpc2libGVSb3dzKG51bGwpO1xuXHRcdH1cblx0XHR0aGlzLmhvbGRsb2NrZWQgPSBmYWxzZTtcblx0fVxuXHRjaGFuZ2VVbmxvY2tlZFRhYmxlRmlsdGVyZWRJdGVtcyhldmVudCkge1xuXHRcdGlmICh0aGlzLnVubG9ja2VkVGFibGUgJiYgIXRoaXMuaG9sZHVubG9ja2VkKSB7XG5cdFx0XHR0aGlzLnVubG9ja2VkVGFibGUuZmlsdGVyZWRJdGVtcyA9IGV2ZW50O1xuXHRcdFx0dGhpcy51bmxvY2tlZFRhYmxlLmluaXRWaXNpYmxlUm93cyhudWxsKTtcblx0XHR9XG5cdFx0dGhpcy5ob2xkdW5sb2NrZWQgPSBmYWxzZTtcblx0fVxuXHRvblBhZ2luYXRpb25DaGFuZ2UoZXZlbnQpIHtcblx0XHR0aGlzLnBhZ2VJbmZvID0gZXZlbnQ7XG5cdFx0dGhpcy5ob2xkbG9ja2VkID0gdHJ1ZTtcblx0XHR0aGlzLmhvbGR1bmxvY2tlZCA9IHRydWU7XG5cdFx0dGhpcy5sb2NrZWRUYWJsZS5ldmFsdWF0ZVJvd3MoKTtcblx0XHR0aGlzLnVubG9ja2VkVGFibGUuZXZhbHVhdGVSb3dzKCk7XG5cdH1cblxuXHR0YWJsZUFjdGlvbihldmVudCkge1xuXHRcdHRoaXMub25hY3Rpb24uZW1pdChldmVudClcblx0fVxuXG5cdG9uRHJvcChldmVudDpEcm9wRXZlbnQpe1xuXG5cdH1cblx0b25DZWxsRWRpdChldmVudCl7XG5cdFx0dGhpcy5vbkNlbGxDb250ZW50RWRpdC5lbWl0KGV2ZW50KTtcblx0fVxuXHRvblRhYmxlRmlsdGVyKGV2ZW50KXtcblx0XHR0aGlzLm9uZmlsdGVyLmVtaXQoZXZlbnQpO1xuXHR9XG59XG5cbiJdfQ==