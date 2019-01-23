/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, ViewChild, Renderer, EventEmitter } from '@angular/core';
import { TableViewComponent } from './components/table.component';
import { TableHeadersGenerator } from './components/table-headers-generator';
var LockTableComponent = /** @class */ (function () {
    function LockTableComponent(generator, renderer) {
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
        this.onCellContentEdit = new EventEmitter();
        this.onconfigurationchange = new EventEmitter();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    LockTableComponent.prototype.scroll = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.renderer.setElementStyle(this.lockedTable.el.nativeElement, "left", event.target.scrollLeft + "px");
    };
    /**
     * @return {?}
     */
    LockTableComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
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
            /** @type {?} */
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
        this.filteredItems = this.items;
        this.pageInfo.contentSize = this.items.length;
        this.reconfigure(this.headers);
    };
    /**
     * @return {?}
     */
    LockTableComponent.prototype.evaluatePositioning = /**
     * @return {?}
     */
    function () {
        this.renderer.setElementStyle(this.unlockedTable.el.nativeElement, "margin-left", this.lockedTable.offsetWidth() + "px");
    };
    /**
     * @param {?} event
     * @return {?}
     */
    LockTableComponent.prototype.reconfigure = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.headers = event;
        this.lockedHeaders = this.headers.filter(function (item) { return item.locked === true && item.present; });
        this.unlockedHeaders = this.headers.filter(function (item) { return item.locked !== true && item.present; });
        this.onconfigurationchange.emit(event);
        if (this.persistenceKey) {
            this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
        }
        setTimeout(this.evaluatePositioning.bind(this), 111);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    LockTableComponent.prototype.onlock = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.lockedHeaders = this.headers.filter(function (item) { return item.locked === true && item.present; });
        this.unlockedHeaders = this.headers.filter(function (item) { return item.locked !== true && item.present; });
        this.onconfigurationchange.emit(event);
        if (this.persistenceKey) {
            this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
        }
        setTimeout(this.evaluatePositioning.bind(this), 111);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    LockTableComponent.prototype.changeLockedTableFilteredItems = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.lockedTable) {
            this.lockedTable.filteredItems = event;
            this.lockedTable.initVisibleRows();
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    LockTableComponent.prototype.changeUnlockedTableFilteredItems = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.unlockedTable) {
            this.unlockedTable.filteredItems = event;
            this.unlockedTable.initVisibleRows();
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    LockTableComponent.prototype.onPaginationChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.pageInfo = event;
        this.unlockedTable.evaluateRows();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    LockTableComponent.prototype.tableAction = /**
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
    LockTableComponent.prototype.onDrop = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
    };
    /**
     * @param {?} event
     * @return {?}
     */
    LockTableComponent.prototype.onCellEdit = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.onCellContentEdit.emit(event);
    };
    LockTableComponent.decorators = [
        { type: Component, args: [{
                    selector: 'lock-table',
                    template: "<div class=\"caption\">\n\t<table-configuration\n\t\t*ngIf=\"configurable\" \n\t\t[headers]=\"headers\" \n\t\t[title]=\"vocabulary.configureColumns\" \n\t\t[action]=\"vocabulary.configureTable\"\n\t\t[configAddon]=\"configAddon\"\n\t\t(onchange)=\"reconfigure($event)\"></table-configuration>\n\n\t<div *ngIf=\"caption\" [textContent]=\"caption\"></div>\n</div>\n<div class=\"smart-table-wrap\" (scroll)=\"scroll($event)\">\n\t<table-view #lockedTable\n\t\tclass=\"locked-table\"\n\t\tlockable=\"true\"\n\t\t[headers]=\"lockedHeaders\" \n\t\t[items]=\"filteredItems\" \n        [pageInfo]=\"pageInfo\"\n        [vocabulary]=\"vocabulary\"\n        [filterwhiletyping]=\"filterwhiletyping\"\n\t\t[enableFiltering]=\"enableFiltering\"\n\t\t[enableIndexing]=\"enableIndexing\"\n        \n\t\t(onchange)=\"onlock($event)\"\n\t\t(onDrop)=\"onDrop($event)\"\n\t\t(onCellContentEdit)=\"onCellEdit($event)\"\n\t\t(onfilter)=\"changeUnlockedTableFilteredItems($event)\"\n\t\t(onaction)=\"tableAction($event)\"></table-view>\n\n    <table-view #unlockedTable\n\t\tclass=\"unlocked-table\"\n\t\tlockable=\"true\"\n\t\t[headers]=\"unlockedHeaders\" \n\t\t[items]=\"filteredItems\" \n        [pageInfo]=\"pageInfo\"\n        [vocabulary]=\"vocabulary\"\n        [filterwhiletyping]=\"filterwhiletyping\"\n\t\t[enableFiltering]=\"enableFiltering\"\n\n\t\t(onDrop)=\"onDrop($event)\"\n\t\t(onchange)=\"onlock($event)\"\n\t\t(onCellContentEdit)=\"onCellEdit($event)\"\n\t\t(onfilter)=\"changeLockedTableFilteredItems($event)\"\n\t\t(onaction)=\"tableAction($event)\"></table-view>\n\t\n</div>\n<table-pagination #pager\n\t[info]=\"pageInfo\" \n\t[vocabulary]=\"vocabulary\" \n    (onchange)=\"onPaginationChange($event)\"></table-pagination>\n",
                    styles: [":host{width:100%;position:relative;margin:0 auto;display:table}:host .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host .caption{background-color:#c3e5e2;border-radius:2px;box-sizing:border-box;color:#1b1b1b;caption-side:top;font-size:14px;margin-bottom:15px;padding:5px 6px;text-align:left;width:100%}:host .caption table-configuration{display:inline-block;float:right;position:unset}:host .smart-table-wrap{border-spacing:0;border-collapse:collapse;border-right:1px solid #aaa;border-bottom:1px solid #aaa;box-sizing:border-box;width:100%;position:relative;overflow-x:auto}:host .smart-table-wrap .unlocked-table ::ng-deep table{max-width:100%;margin-bottom:0;margin-top:0}:host .smart-table-wrap .unlocked-table ::ng-deep table th td{white-space:nowrap}:host .smart-table-wrap .unlocked-table ::ng-deep table th .locker{cursor:pointer;color:#00925b;text-align:center}:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr{background-color:#fff}:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr.hover,:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr:hover{background-color:#ffeed2}:host .smart-table-wrap .unlocked-table ::ng-deep table img{height:14px}:host .smart-table-wrap .locked-table{position:absolute;margin:0 auto;display:inline-table;border-spacing:0;border-collapse:collapse;float:left;z-index:2;width:auto}:host .smart-table-wrap .locked-table ::ng-deep table{display:inline-block;border-right:1px solid #aaa;margin:0;width:auto}:host .smart-table-wrap .locked-table ::ng-deep table th td{white-space:nowrap}:host .smart-table-wrap .locked-table ::ng-deep table th .locker{cursor:pointer;color:#8b0224;text-align:center}:host .smart-table-wrap .locked-table ::ng-deep table tbody tr{background-color:#fff}:host .smart-table-wrap .locked-table ::ng-deep table tbody tr.hover,:host .smart-table-wrap .locked-table ::ng-deep table tbody tr:hover{background-color:#ffeed2}:host .smart-table-wrap .locked-table ::ng-deep table img{height:14px}@media screen and (max-width:600px){.smart-table-wrap{border:0!important;position:unset;overflow-x:unset}.smart-table-wrap .unlocked-table{margin-left:0!important}.smart-table-wrap .unlocked-table ::ng-deep table td,.smart-table-wrap .unlocked-table ::ng-deep table th{white-space:unset}.smart-table-wrap .unlocked-table ::ng-deep table img{height:30px}.smart-table-wrap .locked-table{position:unset!important;margin:0!important;display:table;left:0!important}.smart-table-wrap .locked-table ::ng-deep table{display:table!important;margin:0!important;width:100%!important}.smart-table-wrap .locked-table ::ng-deep table td,.smart-table-wrap .locked-table ::ng-deep table th{white-space:unset}.smart-table-wrap .locked-table ::ng-deep table img{height:30px}}"]
                }] }
    ];
    /** @nocollapse */
    LockTableComponent.ctorParameters = function () { return [
        { type: TableHeadersGenerator },
        { type: Renderer }
    ]; };
    LockTableComponent.propDecorators = {
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
        enableFiltering: [{ type: Input, args: ["enableFiltering",] }],
        enableIndexing: [{ type: Input, args: ["enableIndexing",] }],
        filterwhiletyping: [{ type: Input, args: ["filterwhiletyping",] }],
        onaction: [{ type: Output, args: ['onaction',] }],
        onCellContentEdit: [{ type: Output, args: ['onCellContentEdit',] }],
        onconfigurationchange: [{ type: Output, args: ['onconfigurationchange',] }],
        lockedTable: [{ type: ViewChild, args: ['lockedTable',] }],
        unlockedTable: [{ type: ViewChild, args: ['unlockedTable',] }]
    };
    return LockTableComponent;
}());
export { LockTableComponent };
if (false) {
    /** @type {?} */
    LockTableComponent.prototype.lockedHeaders;
    /** @type {?} */
    LockTableComponent.prototype.unlockedHeaders;
    /** @type {?} */
    LockTableComponent.prototype.filteredItems;
    /** @type {?} */
    LockTableComponent.prototype.vocabulary;
    /** @type {?} */
    LockTableComponent.prototype.persistenceId;
    /** @type {?} */
    LockTableComponent.prototype.persistenceKey;
    /** @type {?} */
    LockTableComponent.prototype.caption;
    /** @type {?} */
    LockTableComponent.prototype.action;
    /** @type {?} */
    LockTableComponent.prototype.actionKeys;
    /** @type {?} */
    LockTableComponent.prototype.tableClass;
    /** @type {?} */
    LockTableComponent.prototype.headers;
    /** @type {?} */
    LockTableComponent.prototype.items;
    /** @type {?} */
    LockTableComponent.prototype.pageInfo;
    /** @type {?} */
    LockTableComponent.prototype.tableInfo;
    /** @type {?} */
    LockTableComponent.prototype.configurable;
    /** @type {?} */
    LockTableComponent.prototype.configAddon;
    /** @type {?} */
    LockTableComponent.prototype.enableFiltering;
    /** @type {?} */
    LockTableComponent.prototype.enableIndexing;
    /** @type {?} */
    LockTableComponent.prototype.filterwhiletyping;
    /** @type {?} */
    LockTableComponent.prototype.onaction;
    /** @type {?} */
    LockTableComponent.prototype.onCellContentEdit;
    /** @type {?} */
    LockTableComponent.prototype.onconfigurationchange;
    /** @type {?} */
    LockTableComponent.prototype.lockedTable;
    /** @type {?} */
    LockTableComponent.prototype.unlockedTable;
    /** @type {?} */
    LockTableComponent.prototype.generator;
    /** @type {?} */
    LockTableComponent.prototype.renderer;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jay50YWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvZmxleGlibGUtdGFibGUvIiwic291cmNlcyI6WyJzcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2xvY2sudGFibGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFNQSxPQUFPLEVBQ0gsU0FBUyxFQUNaLEtBQUssRUFDTCxNQUFNLEVBQ04sU0FBUyxFQUdULFFBQVEsRUFFUixZQUFZLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDbEUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7O0lBNEZ6RSw0QkFDTSxXQUNBO1FBREEsY0FBUyxHQUFULFNBQVM7UUFDVCxhQUFRLEdBQVIsUUFBUTs2QkFuRkQsRUFBRTswQkFHSztZQUN0QixjQUFjLEVBQUUsaUJBQWlCO1lBQ2pDLGdCQUFnQixFQUFFLG1CQUFtQjtZQUNyQyxTQUFTLEVBQUUsZUFBZTtZQUMxQixPQUFPLEVBQUUsVUFBVTtZQUNuQixTQUFTLEVBQUUsT0FBTztZQUNsQixRQUFRLEVBQUUsTUFBTTtZQUNoQixZQUFZLEVBQUUsVUFBVTtTQUN4QjswQkFrQnNCLHdCQUF3Qjt3QkErQjVCLElBQUksWUFBWSxFQUFFO2lDQUdULElBQUksWUFBWSxFQUFFO3FDQUdkLElBQUksWUFBWSxFQUFFO0tBa0I5Qzs7Ozs7SUFWRCxtQ0FBTTs7OztJQUFOLFVBQU8sS0FBSztRQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUMzQixJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQ2pDLE1BQU0sRUFDTixLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBQyxJQUFJLENBQUMsQ0FBQztLQUNoQzs7OztJQU9ELHFDQUFROzs7SUFBUjtRQUNDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FB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QUFXOytCQUdkLEtBQUssU0FBQyxjQUFjOzhCQUd2QixLQUFLLFNBQUMsYUFBYTtrQ0FHbkIsS0FBSyxTQUFDLGlCQUFpQjtpQ0FHcEIsS0FBSyxTQUFDLGdCQUFnQjtvQ0FHdEIsS0FBSyxTQUFDLG1CQUFtQjsyQkFJNUIsTUFBTSxTQUFDLFVBQVU7b0NBR2pCLE1BQU0sU0FBQyxtQkFBbUI7d0NBRzFCLE1BQU0sU0FBQyx1QkFBdUI7OEJBRzlCLFNBQVMsU0FBQyxhQUFhO2dDQUd2QixTQUFTLFNBQUMsZUFBZTs7NkJBdEczQjs7U0EyQmEsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiogUHJvdmlkZXMgcmVuZGVyaW5nIG9mIGEgdGFibGUgd2hpY2ggaXMgdXNpbmcgdGhlIGdpdmVuIEZsZXhpYmxlVGFibGVIZWFkZXIgc2V0IGluXG4qIG9yZGVyIHRvIHRhYnVsYXRlIHRoZSBnaXZlbiBkYXRhLiBBcyBwZXIgZGVmaW5pdGlvbiBvZiBlYXJjaCBoZWFkZXIgY29tcG9uZW50LFxuKiBhIGNvbHVtbiBjb3VsZCBiZSBoaWRkZW4sIHNvcnRhYmxlLCBvciBkcmFnZ2FibGUuIEVhY2ggdGFibGUgcm93IGNhbiBleHBhbmQvY29sbGFwc2Vcbiogb3IgcmVzcG9uZCB0byBhIGNsaWNrIGFjdGlvbi5cbiovXG5pbXBvcnQge1xuICAgIENvbXBvbmVudCxcblx0SW5wdXQsXG5cdE91dHB1dCxcblx0Vmlld0NoaWxkLFxuXHRWaWV3Q29udGFpbmVyUmVmLFxuXHRPbkluaXQsXG5cdFJlbmRlcmVyLFxuXHRFbGVtZW50UmVmLFxuXHRFdmVudEVtaXR0ZXJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IERyb3BFdmVudCwgRHJhZ0V2ZW50IH0gZnJvbSAnQHNlZGVoL2RyYWctZW5hYmxlZCc7XG5pbXBvcnQgeyBUYWJsZVZpZXdDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50JztcbmltcG9ydCB7IFRhYmxlSGVhZGVyc0dlbmVyYXRvciB9IGZyb20gJy4vY29tcG9uZW50cy90YWJsZS1oZWFkZXJzLWdlbmVyYXRvcic7XG5cbkBDb21wb25lbnQoe1xuXHRzZWxlY3RvcjogJ2xvY2stdGFibGUnLFxuXHR0ZW1wbGF0ZVVybDogJy4vbG9jay50YWJsZS5jb21wb25lbnQuaHRtbCcsXG5cdHN0eWxlVXJsczogWycuL2xvY2sudGFibGUuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBMb2NrVGFibGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG5cdGxvY2tlZEhlYWRlcnM6YW55O1xuXHR1bmxvY2tlZEhlYWRlcnM6YW55O1xuXHRmaWx0ZXJlZEl0ZW1zID0gW107XG5cbiAgICBASW5wdXQoXCJ2b2NhYnVsYXJ5XCIpXG4gICAgcHVibGljIHZvY2FidWxhcnkgPSB7XG5cdFx0Y29uZmlndXJlVGFibGU6IFwiQ29uZmlndXJlIFRhYmxlXCIsXG5cdFx0Y29uZmlndXJlQ29sdW1uczogXCJDb25maWd1cmUgQ29sdW1uc1wiLFxuXHRcdGNsaWNrU29ydDogXCJDbGljayB0byBTb3J0XCIsXG5cdFx0c2V0U2l6ZTogXCJTZXQgU2l6ZVwiLFxuXHRcdGZpcnN0UGFnZTogXCJGaXJzdFwiLFxuXHRcdGxhc3RQYWdlOiBcIkxhc3RcIixcblx0XHRwcmV2aW91c1BhZ2U6IFwiUHJldmlvdXNcIlxuXHR9O1xuXG4gICAgQElucHV0KFwicGVyc2lzdGVuY2VJZFwiKVxuICAgIHB1YmxpYyBwZXJzaXN0ZW5jZUlkOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoXCJwZXJzaXN0ZW5jZUtleVwiKVxuICAgIHB1YmxpYyBwZXJzaXN0ZW5jZUtleTogc3RyaW5nO1xuXG4gICAgQElucHV0KFwiY2FwdGlvblwiKVxuICAgIHB1YmxpYyBjYXB0aW9uOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoXCJhY3Rpb25cIilcbiAgICBwdWJsaWMgYWN0aW9uOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoXCJhY3Rpb25LZXlzXCIpXG4gICAgcHVibGljIGFjdGlvbktleXM7XG5cbiAgICBASW5wdXQoXCJ0YWJsZUNsYXNzXCIpXG4gICAgcHVibGljIHRhYmxlQ2xhc3MgPSAnZGVmYXVsdC1mbGV4aWJsZS10YWJsZSc7XG5cblx0QElucHV0KFwiaGVhZGVyc1wiKVxuXHRwdWJsaWMgaGVhZGVyczogYW55W107XG5cblx0QElucHV0KFwiaXRlbXNcIilcblx0cHVibGljIGl0ZW1zOiBhbnlbXTtcblxuXHRASW5wdXQoXCJwYWdlSW5mb1wiKVxuXHRwdWJsaWMgcGFnZUluZm86IGFueTtcblxuXHRASW5wdXQoXCJ0YWJsZUluZm9cIilcblx0cHVibGljIHRhYmxlSW5mbzogYW55O1xuXG4gICAgQElucHV0KFwiY29uZmlndXJhYmxlXCIpXG4gICAgcHVibGljIGNvbmZpZ3VyYWJsZTogYm9vbGVhbjtcblxuXHRASW5wdXQoXCJjb25maWdBZGRvblwiKVxuXHRwdWJsaWMgY29uZmlnQWRkb246IGFueTtcblxuXHRASW5wdXQoXCJlbmFibGVGaWx0ZXJpbmdcIilcbiAgICBwdWJsaWMgZW5hYmxlRmlsdGVyaW5nOiBib29sZWFuO1xuXG4gICAgQElucHV0KFwiZW5hYmxlSW5kZXhpbmdcIilcbiAgICBwdWJsaWMgZW5hYmxlSW5kZXhpbmc6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoXCJmaWx0ZXJ3aGlsZXR5cGluZ1wiKVxuICAgIHB1YmxpYyBmaWx0ZXJ3aGlsZXR5cGluZzogYm9vbGVhbjtcblxuXG5cdEBPdXRwdXQoJ29uYWN0aW9uJylcblx0cHJpdmF0ZSBvbmFjdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuXHRAT3V0cHV0KCdvbkNlbGxDb250ZW50RWRpdCcpXG5cdHByaXZhdGUgb25DZWxsQ29udGVudEVkaXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cblx0QE91dHB1dCgnb25jb25maWd1cmF0aW9uY2hhbmdlJylcblx0cHJpdmF0ZSBvbmNvbmZpZ3VyYXRpb25jaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cblx0QFZpZXdDaGlsZCgnbG9ja2VkVGFibGUnKVxuXHRwcml2YXRlIGxvY2tlZFRhYmxlOiBUYWJsZVZpZXdDb21wb25lbnQ7XG5cblx0QFZpZXdDaGlsZCgndW5sb2NrZWRUYWJsZScpXG5cdHByaXZhdGUgdW5sb2NrZWRUYWJsZTogVGFibGVWaWV3Q29tcG9uZW50O1xuXG4gICAgc2Nyb2xsKGV2ZW50KSB7XG5cdFx0dGhpcy5yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUoXG5cdFx0XHRcdHRoaXMubG9ja2VkVGFibGUuZWwubmF0aXZlRWxlbWVudCxcblx0XHRcdFx0XCJsZWZ0XCIsXG5cdFx0XHRcdGV2ZW50LnRhcmdldC5zY3JvbGxMZWZ0K1wicHhcIik7XG5cdH1cblxuICAgIGNvbnN0cnVjdG9yKFxuXHRcdHByaXZhdGUgZ2VuZXJhdG9yOiBUYWJsZUhlYWRlcnNHZW5lcmF0b3IsXG5cdFx0cHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXJcblx0KSB7fVxuXG5cdG5nT25Jbml0KCkge1xuXHRcdGlmICh0aGlzLnBhZ2VJbmZvKSB7XG5cdFx0XHRpZiAoIXRoaXMucGFnZUluZm8udG8pIHtcblx0XHRcdFx0dGhpcy5wYWdlSW5mby50byA9IHRoaXMucGFnZUluZm8ucGFnZVNpemU7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMucGFnZUluZm8gPSB7XG4gICAgICAgICAgICAgICAgY29udGVudFNpemU6IDEwMDAwMCxcbiAgICAgICAgICAgICAgICBwYWdlU2l6ZTogMTAwMDAwLFxuICAgICAgICAgICAgICAgIHBhZ2VzOiAxLFxuICAgICAgICAgICAgICAgIGZyb206IDAsXG4gICAgICAgICAgICAgICAgdG86IDEwMDAwMCxcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFnZTogMSxcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogXCIwXCJcbiAgICAgICAgICAgIH07XG5cdFx0fVxuXHRcdGlmICh0aGlzLnBlcnNpc3RlbmNlS2V5KSB7XG5cdFx0XHRjb25zdCBoZWFkZXJzOmFueSA9IHRoaXMuZ2VuZXJhdG9yLnJldHJlaXZlSGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQpO1xuXG5cdFx0XHRpZiAoaGVhZGVycykge1xuXHRcdFx0XHR0aGlzLmhlYWRlcnMgPSBoZWFkZXJzO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoIXRoaXMuaGVhZGVycykge1xuXHRcdFx0dGhpcy5oZWFkZXJzID0gdGhpcy5nZW5lcmF0b3IuZ2VuZXJhdGVIZWFkZXJzRm9yKHRoaXMuaXRlbXNbMF0sXCJcIiwgNSwgdGhpcy5lbmFibGVGaWx0ZXJpbmcpO1xuXHRcdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcblx0XHRcdFx0dGhpcy5nZW5lcmF0b3IucGVyc2lzdEhlYWRlcnModGhpcy5wZXJzaXN0ZW5jZUtleSwgdGhpcy5wZXJzaXN0ZW5jZUlkLCB0aGlzLmhlYWRlcnMpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSB0aGlzLml0ZW1zO1xuXHRcdHRoaXMucGFnZUluZm8uY29udGVudFNpemUgPSB0aGlzLml0ZW1zLmxlbmd0aDtcblx0XHRcblx0XHR0aGlzLnJlY29uZmlndXJlKHRoaXMuaGVhZGVycyk7XG5cblx0fVxuXG5cdGV2YWx1YXRlUG9zaXRpb25pbmcoKSB7XG5cdFx0dGhpcy5yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUoXG5cdFx0XHR0aGlzLnVubG9ja2VkVGFibGUuZWwubmF0aXZlRWxlbWVudCxcblx0XHRcdFwibWFyZ2luLWxlZnRcIixcblx0XHRcdHRoaXMubG9ja2VkVGFibGUub2Zmc2V0V2lkdGgoKStcInB4XCIpO1xuXHR9XG5cblx0cmVjb25maWd1cmUoZXZlbnQpIHtcblx0XHR0aGlzLmhlYWRlcnMgPSBldmVudDtcblx0XHR0aGlzLmxvY2tlZEhlYWRlcnMgPSB0aGlzLmhlYWRlcnMuZmlsdGVyKCAoaXRlbSkgPT4gaXRlbS5sb2NrZWQgPT09IHRydWUgJiYgaXRlbS5wcmVzZW50KTtcblx0XHR0aGlzLnVubG9ja2VkSGVhZGVycyA9IHRoaXMuaGVhZGVycy5maWx0ZXIoIChpdGVtKSA9PiBpdGVtLmxvY2tlZCAhPT0gdHJ1ZSAgJiYgaXRlbS5wcmVzZW50KTtcdFxuXHRcdHRoaXMub25jb25maWd1cmF0aW9uY2hhbmdlLmVtaXQoZXZlbnQpO1xuXG5cdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcblx0XHRcdHRoaXMuZ2VuZXJhdG9yLnBlcnNpc3RIZWFkZXJzKHRoaXMucGVyc2lzdGVuY2VLZXksIHRoaXMucGVyc2lzdGVuY2VJZCwgdGhpcy5oZWFkZXJzKTtcblx0XHR9XG5cdFx0c2V0VGltZW91dCh0aGlzLmV2YWx1YXRlUG9zaXRpb25pbmcuYmluZCh0aGlzKSwxMTEpO1xuXHR9XG5cblx0b25sb2NrKGV2ZW50KSB7XG5cdFx0dGhpcy5sb2NrZWRIZWFkZXJzID0gdGhpcy5oZWFkZXJzLmZpbHRlciggKGl0ZW0pID0+IGl0ZW0ubG9ja2VkID09PSB0cnVlICYmIGl0ZW0ucHJlc2VudCk7XG5cdFx0dGhpcy51bmxvY2tlZEhlYWRlcnMgPSB0aGlzLmhlYWRlcnMuZmlsdGVyKCAoaXRlbSkgPT4gaXRlbS5sb2NrZWQgIT09IHRydWUgICYmIGl0ZW0ucHJlc2VudCk7XHRcblx0XHR0aGlzLm9uY29uZmlndXJhdGlvbmNoYW5nZS5lbWl0KGV2ZW50KTtcblxuXHRcdGlmICh0aGlzLnBlcnNpc3RlbmNlS2V5KSB7XG5cdFx0XHR0aGlzLmdlbmVyYXRvci5wZXJzaXN0SGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQsIHRoaXMuaGVhZGVycyk7XG5cdFx0fVxuXHRcdHNldFRpbWVvdXQodGhpcy5ldmFsdWF0ZVBvc2l0aW9uaW5nLmJpbmQodGhpcyksMTExKTtcblx0fVxuXHRjaGFuZ2VMb2NrZWRUYWJsZUZpbHRlcmVkSXRlbXMoZXZlbnQpIHtcblx0XHRpZiAodGhpcy5sb2NrZWRUYWJsZSkge1xuXHRcdFx0dGhpcy5sb2NrZWRUYWJsZS5maWx0ZXJlZEl0ZW1zID0gZXZlbnQ7XG5cdFx0XHR0aGlzLmxvY2tlZFRhYmxlLmluaXRWaXNpYmxlUm93cygpO1xuXHRcdH1cblx0fVxuXHRjaGFuZ2VVbmxvY2tlZFRhYmxlRmlsdGVyZWRJdGVtcyhldmVudCkge1xuXHRcdGlmICh0aGlzLnVubG9ja2VkVGFibGUpIHtcblx0XHRcdHRoaXMudW5sb2NrZWRUYWJsZS5maWx0ZXJlZEl0ZW1zID0gZXZlbnQ7XG5cdFx0XHR0aGlzLnVubG9ja2VkVGFibGUuaW5pdFZpc2libGVSb3dzKCk7XG5cdFx0fVxuXHR9XG5cdG9uUGFnaW5hdGlvbkNoYW5nZShldmVudCkge1xuXHRcdHRoaXMucGFnZUluZm8gPSBldmVudDtcblx0XHR0aGlzLnVubG9ja2VkVGFibGUuZXZhbHVhdGVSb3dzKCk7XG5cdH1cblxuXHR0YWJsZUFjdGlvbihldmVudCkge1xuXHRcdHRoaXMub25hY3Rpb24uZW1pdChldmVudClcblx0fVxuXG5cdG9uRHJvcChldmVudDpEcm9wRXZlbnQpe1xuXG5cdH1cblx0b25DZWxsRWRpdChldmVudCl7XG5cdFx0dGhpcy5vbkNlbGxDb250ZW50RWRpdC5lbWl0KGV2ZW50KTtcblx0fVxufVxuXG4iXX0=