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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jay50YWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mbGV4aWJsZS10YWJsZS8iLCJzb3VyY2VzIjpbInNyYy9hcHAvZmxleGlibGUtdGFibGUvbG9jay50YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQU1BLE9BQU8sRUFDSCxTQUFTLEVBQ1osS0FBSyxFQUNMLE1BQU0sRUFDTixTQUFTLEVBR1QsUUFBUSxFQUVSLFlBQVksRUFDWixNQUFNLGVBQWUsQ0FBQztBQUd2QixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNsRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQzs7SUE0RnpFLDRCQUNNLFdBQ0E7UUFEQSxjQUFTLEdBQVQsU0FBUztRQUNULGFBQVEsR0FBUixRQUFROzZCQW5GRCxFQUFFOzBCQUdLO1lBQ3RCLGNBQWMsRUFBRSxpQkFBaUI7WUFDakMsZ0JBQWdCLEVBQUUsbUJBQW1CO1lBQ3JDLFNBQVMsRUFBRSxlQUFlO1lBQzFCLE9BQU8sRUFBRSxVQUFVO1lBQ25CLFNBQVMsRUFBRSxPQUFPO1lBQ2xCLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLFlBQVksRUFBRSxVQUFVO1NBQ3hCOzBCQWtCc0Isd0JBQXdCO3dCQStCNUIsSUFBSSxZQUFZLEVBQUU7aUNBR1QsSUFBSSxZQUFZLEVBQUU7cUNBR2QsSUFBSSxZQUFZLEVBQUU7S0FrQjlDOzs7OztJQVZELG1DQUFNOzs7O0lBQU4sVUFBTyxLQUFLO1FBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQzNCLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFDakMsTUFBTSxFQUNOLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2hDOzs7O0lBT0QscUNBQVE7OztJQUFSO1FBQ0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDbkIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO2FBQzFDO1NBQ0Q7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNQLElBQUksQ0FBQyxRQUFRLEdBQUc7Z0JBQ0gsV0FBVyxFQUFFLE1BQU07Z0JBQ25CLFFBQVEsRUFBRSxNQUFNO2dCQUNoQixLQUFLLEVBQUUsQ0FBQztnQkFDUixJQUFJLEVBQUUsQ0FBQztnQkFDUCxFQUFFLEVBQUUsTUFBTTtnQkFDVixXQUFXLEVBQUUsQ0FBQztnQkFDZCxRQUFRLEVBQUUsR0FBRzthQUNoQixDQUFDO1NBQ1g7UUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQzs7WUFDekIsSUFBTSxPQUFPLEdBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFNUYsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDYixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzthQUN2QjtTQUNEO1FBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUM1RixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFDekIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUNyRjtTQUNEO1FBQ0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBRTlDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBRS9COzs7O0lBRUQsZ0RBQW1COzs7SUFBbkI7UUFDQyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FDNUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUNuQyxhQUFhLEVBQ2IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsR0FBQyxJQUFJLENBQUMsQ0FBQztLQUN0Qzs7Ozs7SUFFRCx3Q0FBVzs7OztJQUFYLFVBQVksS0FBSztRQUNoQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFFLFVBQUMsSUFBSSxJQUFLLE9BQUEsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBcEMsQ0FBb0MsQ0FBQyxDQUFDO1FBQzFGLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUUsVUFBQyxJQUFJLElBQUssT0FBQSxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksSUFBSyxJQUFJLENBQUMsT0FBTyxFQUFyQyxDQUFxQyxDQUFDLENBQUM7UUFDN0YsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV2QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3JGO1FBQ0QsVUFBVSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUM7S0FDcEQ7Ozs7O0lBRUQsbUNBQU07Ozs7SUFBTixVQUFPLEtBQUs7UUFDWCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFFLFVBQUMsSUFBSSxJQUFLLE9BQUEsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBcEMsQ0FBb0MsQ0FBQyxDQUFDO1FBQzFGLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUUsVUFBQyxJQUFJLElBQUssT0FBQSxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksSUFBSyxJQUFJLENBQUMsT0FBTyxFQUFyQyxDQUFxQyxDQUFDLENBQUM7UUFDN0YsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV2QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3JGO1FBQ0QsVUFBVSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUM7S0FDcEQ7Ozs7O0lBQ0QsMkRBQThCOzs7O0lBQTlCLFVBQStCLEtBQUs7UUFDbkMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDbkM7S0FDRDs7Ozs7SUFDRCw2REFBZ0M7Ozs7SUFBaEMsVUFBaUMsS0FBSztRQUNyQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7WUFDekMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEVBQUUsQ0FBQztTQUNyQztLQUNEOzs7OztJQUNELCtDQUFrQjs7OztJQUFsQixVQUFtQixLQUFLO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLENBQUM7S0FDbEM7Ozs7O0lBRUQsd0NBQVc7Ozs7SUFBWCxVQUFZLEtBQUs7UUFDaEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDekI7Ozs7O0lBRUQsbUNBQU07Ozs7SUFBTixVQUFPLEtBQWU7S0FFckI7Ozs7O0lBQ0QsdUNBQVU7Ozs7SUFBVixVQUFXLEtBQUs7UUFDZixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ25DOztnQkExTEQsU0FBUyxTQUFDO29CQUNWLFFBQVEsRUFBRSxZQUFZO29CQUN0Qiwyc0RBQTBDOztpQkFFMUM7Ozs7Z0JBTlEscUJBQXFCO2dCQVA3QixRQUFROzs7NkJBb0JKLEtBQUssU0FBQyxZQUFZO2dDQVdsQixLQUFLLFNBQUMsZUFBZTtpQ0FHckIsS0FBSyxTQUFDLGdCQUFnQjswQkFHdEIsS0FBSyxTQUFDLFNBQVM7eUJBR2YsS0FBSyxTQUFDLFFBQVE7NkJBR2QsS0FBSyxTQUFDLFlBQVk7NkJBR2xCLEtBQUssU0FBQyxZQUFZOzBCQUdyQixLQUFLLFNBQUMsU0FBUzt3QkFHZixLQUFLLFNBQUMsT0FBTzsyQkFHYixLQUFLLFNBQUMsVUFBVTs0QkFHaEIsS0FBSyxTQUFDLFdBQVc7K0JBR2QsS0FBSyxTQUFDLGNBQWM7OEJBR3ZCLEtBQUssU0FBQyxhQUFhO2tDQUduQixLQUFLLFNBQUMsaUJBQWlCO2lDQUdwQixLQUFLLFNBQUMsZ0JBQWdCO29DQUd0QixLQUFLLFNBQUMsbUJBQW1COzJCQUk1QixNQUFNLFNBQUMsVUFBVTtvQ0FHakIsTUFBTSxTQUFDLG1CQUFtQjt3Q0FHMUIsTUFBTSxTQUFDLHVCQUF1Qjs4QkFHOUIsU0FBUyxTQUFDLGFBQWE7Z0NBR3ZCLFNBQVMsU0FBQyxlQUFlOzs2QkF0RzNCOztTQTJCYSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuKiBQcm92aWRlcyByZW5kZXJpbmcgb2YgYSB0YWJsZSB3aGljaCBpcyB1c2luZyB0aGUgZ2l2ZW4gRmxleGlibGVUYWJsZUhlYWRlciBzZXQgaW5cbiogb3JkZXIgdG8gdGFidWxhdGUgdGhlIGdpdmVuIGRhdGEuIEFzIHBlciBkZWZpbml0aW9uIG9mIGVhcmNoIGhlYWRlciBjb21wb25lbnQsXG4qIGEgY29sdW1uIGNvdWxkIGJlIGhpZGRlbiwgc29ydGFibGUsIG9yIGRyYWdnYWJsZS4gRWFjaCB0YWJsZSByb3cgY2FuIGV4cGFuZC9jb2xsYXBzZVxuKiBvciByZXNwb25kIHRvIGEgY2xpY2sgYWN0aW9uLlxuKi9cbmltcG9ydCB7XG4gICAgQ29tcG9uZW50LFxuXHRJbnB1dCxcblx0T3V0cHV0LFxuXHRWaWV3Q2hpbGQsXG5cdFZpZXdDb250YWluZXJSZWYsXG5cdE9uSW5pdCxcblx0UmVuZGVyZXIsXG5cdEVsZW1lbnRSZWYsXG5cdEV2ZW50RW1pdHRlclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRHJvcEV2ZW50LCBEcmFnRXZlbnQgfSBmcm9tICdkcmFnLWVuYWJsZWQnO1xuaW1wb3J0IHsgVGFibGVWaWV3Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUYWJsZUhlYWRlcnNHZW5lcmF0b3IgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUtaGVhZGVycy1nZW5lcmF0b3InO1xuXG5AQ29tcG9uZW50KHtcblx0c2VsZWN0b3I6ICdsb2NrLXRhYmxlJyxcblx0dGVtcGxhdGVVcmw6ICcuL2xvY2sudGFibGUuY29tcG9uZW50Lmh0bWwnLFxuXHRzdHlsZVVybHM6IFsnLi9sb2NrLnRhYmxlLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTG9ja1RhYmxlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuXHRsb2NrZWRIZWFkZXJzOmFueTtcblx0dW5sb2NrZWRIZWFkZXJzOmFueTtcblx0ZmlsdGVyZWRJdGVtcyA9IFtdO1xuXG4gICAgQElucHV0KFwidm9jYWJ1bGFyeVwiKVxuICAgIHB1YmxpYyB2b2NhYnVsYXJ5ID0ge1xuXHRcdGNvbmZpZ3VyZVRhYmxlOiBcIkNvbmZpZ3VyZSBUYWJsZVwiLFxuXHRcdGNvbmZpZ3VyZUNvbHVtbnM6IFwiQ29uZmlndXJlIENvbHVtbnNcIixcblx0XHRjbGlja1NvcnQ6IFwiQ2xpY2sgdG8gU29ydFwiLFxuXHRcdHNldFNpemU6IFwiU2V0IFNpemVcIixcblx0XHRmaXJzdFBhZ2U6IFwiRmlyc3RcIixcblx0XHRsYXN0UGFnZTogXCJMYXN0XCIsXG5cdFx0cHJldmlvdXNQYWdlOiBcIlByZXZpb3VzXCJcblx0fTtcblxuICAgIEBJbnB1dChcInBlcnNpc3RlbmNlSWRcIilcbiAgICBwdWJsaWMgcGVyc2lzdGVuY2VJZDogc3RyaW5nO1xuXG4gICAgQElucHV0KFwicGVyc2lzdGVuY2VLZXlcIilcbiAgICBwdWJsaWMgcGVyc2lzdGVuY2VLZXk6IHN0cmluZztcblxuICAgIEBJbnB1dChcImNhcHRpb25cIilcbiAgICBwdWJsaWMgY2FwdGlvbjogc3RyaW5nO1xuXG4gICAgQElucHV0KFwiYWN0aW9uXCIpXG4gICAgcHVibGljIGFjdGlvbjogc3RyaW5nO1xuXG4gICAgQElucHV0KFwiYWN0aW9uS2V5c1wiKVxuICAgIHB1YmxpYyBhY3Rpb25LZXlzO1xuXG4gICAgQElucHV0KFwidGFibGVDbGFzc1wiKVxuICAgIHB1YmxpYyB0YWJsZUNsYXNzID0gJ2RlZmF1bHQtZmxleGlibGUtdGFibGUnO1xuXG5cdEBJbnB1dChcImhlYWRlcnNcIilcblx0cHVibGljIGhlYWRlcnM6IGFueVtdO1xuXG5cdEBJbnB1dChcIml0ZW1zXCIpXG5cdHB1YmxpYyBpdGVtczogYW55W107XG5cblx0QElucHV0KFwicGFnZUluZm9cIilcblx0cHVibGljIHBhZ2VJbmZvOiBhbnk7XG5cblx0QElucHV0KFwidGFibGVJbmZvXCIpXG5cdHB1YmxpYyB0YWJsZUluZm86IGFueTtcblxuICAgIEBJbnB1dChcImNvbmZpZ3VyYWJsZVwiKVxuICAgIHB1YmxpYyBjb25maWd1cmFibGU6IGJvb2xlYW47XG5cblx0QElucHV0KFwiY29uZmlnQWRkb25cIilcblx0cHVibGljIGNvbmZpZ0FkZG9uOiBhbnk7XG5cblx0QElucHV0KFwiZW5hYmxlRmlsdGVyaW5nXCIpXG4gICAgcHVibGljIGVuYWJsZUZpbHRlcmluZzogYm9vbGVhbjtcblxuICAgIEBJbnB1dChcImVuYWJsZUluZGV4aW5nXCIpXG4gICAgcHVibGljIGVuYWJsZUluZGV4aW5nOiBib29sZWFuO1xuXG4gICAgQElucHV0KFwiZmlsdGVyd2hpbGV0eXBpbmdcIilcbiAgICBwdWJsaWMgZmlsdGVyd2hpbGV0eXBpbmc6IGJvb2xlYW47XG5cblxuXHRAT3V0cHV0KCdvbmFjdGlvbicpXG5cdHByaXZhdGUgb25hY3Rpb24gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cblx0QE91dHB1dCgnb25DZWxsQ29udGVudEVkaXQnKVxuXHRwcml2YXRlIG9uQ2VsbENvbnRlbnRFZGl0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG5cdEBPdXRwdXQoJ29uY29uZmlndXJhdGlvbmNoYW5nZScpXG5cdHByaXZhdGUgb25jb25maWd1cmF0aW9uY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG5cdEBWaWV3Q2hpbGQoJ2xvY2tlZFRhYmxlJylcblx0cHJpdmF0ZSBsb2NrZWRUYWJsZTogVGFibGVWaWV3Q29tcG9uZW50O1xuXG5cdEBWaWV3Q2hpbGQoJ3VubG9ja2VkVGFibGUnKVxuXHRwcml2YXRlIHVubG9ja2VkVGFibGU6IFRhYmxlVmlld0NvbXBvbmVudDtcblxuICAgIHNjcm9sbChldmVudCkge1xuXHRcdHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKFxuXHRcdFx0XHR0aGlzLmxvY2tlZFRhYmxlLmVsLm5hdGl2ZUVsZW1lbnQsXG5cdFx0XHRcdFwibGVmdFwiLFxuXHRcdFx0XHRldmVudC50YXJnZXQuc2Nyb2xsTGVmdCtcInB4XCIpO1xuXHR9XG5cbiAgICBjb25zdHJ1Y3Rvcihcblx0XHRwcml2YXRlIGdlbmVyYXRvcjogVGFibGVIZWFkZXJzR2VuZXJhdG9yLFxuXHRcdHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyXG5cdCkge31cblxuXHRuZ09uSW5pdCgpIHtcblx0XHRpZiAodGhpcy5wYWdlSW5mbykge1xuXHRcdFx0aWYgKCF0aGlzLnBhZ2VJbmZvLnRvKSB7XG5cdFx0XHRcdHRoaXMucGFnZUluZm8udG8gPSB0aGlzLnBhZ2VJbmZvLnBhZ2VTaXplO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnBhZ2VJbmZvID0ge1xuICAgICAgICAgICAgICAgIGNvbnRlbnRTaXplOiAxMDAwMDAsXG4gICAgICAgICAgICAgICAgcGFnZVNpemU6IDEwMDAwMCxcbiAgICAgICAgICAgICAgICBwYWdlczogMSxcbiAgICAgICAgICAgICAgICBmcm9tOiAwLFxuICAgICAgICAgICAgICAgIHRvOiAxMDAwMDAsXG4gICAgICAgICAgICAgICAgY3VycmVudFBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgbWF4V2lkdGg6IFwiMFwiXG4gICAgICAgICAgICB9O1xuXHRcdH1cblx0XHRpZiAodGhpcy5wZXJzaXN0ZW5jZUtleSkge1xuXHRcdFx0Y29uc3QgaGVhZGVyczphbnkgPSB0aGlzLmdlbmVyYXRvci5yZXRyZWl2ZUhlYWRlcnModGhpcy5wZXJzaXN0ZW5jZUtleSwgdGhpcy5wZXJzaXN0ZW5jZUlkKTtcblxuXHRcdFx0aWYgKGhlYWRlcnMpIHtcblx0XHRcdFx0dGhpcy5oZWFkZXJzID0gaGVhZGVycztcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKCF0aGlzLmhlYWRlcnMpIHtcblx0XHRcdHRoaXMuaGVhZGVycyA9IHRoaXMuZ2VuZXJhdG9yLmdlbmVyYXRlSGVhZGVyc0Zvcih0aGlzLml0ZW1zWzBdLFwiXCIsIDUsIHRoaXMuZW5hYmxlRmlsdGVyaW5nKTtcblx0XHRcdGlmICh0aGlzLnBlcnNpc3RlbmNlS2V5KSB7XG5cdFx0XHRcdHRoaXMuZ2VuZXJhdG9yLnBlcnNpc3RIZWFkZXJzKHRoaXMucGVyc2lzdGVuY2VLZXksIHRoaXMucGVyc2lzdGVuY2VJZCwgdGhpcy5oZWFkZXJzKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5maWx0ZXJlZEl0ZW1zID0gdGhpcy5pdGVtcztcblx0XHR0aGlzLnBhZ2VJbmZvLmNvbnRlbnRTaXplID0gdGhpcy5pdGVtcy5sZW5ndGg7XG5cdFx0XG5cdFx0dGhpcy5yZWNvbmZpZ3VyZSh0aGlzLmhlYWRlcnMpO1xuXG5cdH1cblxuXHRldmFsdWF0ZVBvc2l0aW9uaW5nKCkge1xuXHRcdHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKFxuXHRcdFx0dGhpcy51bmxvY2tlZFRhYmxlLmVsLm5hdGl2ZUVsZW1lbnQsXG5cdFx0XHRcIm1hcmdpbi1sZWZ0XCIsXG5cdFx0XHR0aGlzLmxvY2tlZFRhYmxlLm9mZnNldFdpZHRoKCkrXCJweFwiKTtcblx0fVxuXG5cdHJlY29uZmlndXJlKGV2ZW50KSB7XG5cdFx0dGhpcy5oZWFkZXJzID0gZXZlbnQ7XG5cdFx0dGhpcy5sb2NrZWRIZWFkZXJzID0gdGhpcy5oZWFkZXJzLmZpbHRlciggKGl0ZW0pID0+IGl0ZW0ubG9ja2VkID09PSB0cnVlICYmIGl0ZW0ucHJlc2VudCk7XG5cdFx0dGhpcy51bmxvY2tlZEhlYWRlcnMgPSB0aGlzLmhlYWRlcnMuZmlsdGVyKCAoaXRlbSkgPT4gaXRlbS5sb2NrZWQgIT09IHRydWUgICYmIGl0ZW0ucHJlc2VudCk7XHRcblx0XHR0aGlzLm9uY29uZmlndXJhdGlvbmNoYW5nZS5lbWl0KGV2ZW50KTtcblxuXHRcdGlmICh0aGlzLnBlcnNpc3RlbmNlS2V5KSB7XG5cdFx0XHR0aGlzLmdlbmVyYXRvci5wZXJzaXN0SGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQsIHRoaXMuaGVhZGVycyk7XG5cdFx0fVxuXHRcdHNldFRpbWVvdXQodGhpcy5ldmFsdWF0ZVBvc2l0aW9uaW5nLmJpbmQodGhpcyksMTExKTtcblx0fVxuXG5cdG9ubG9jayhldmVudCkge1xuXHRcdHRoaXMubG9ja2VkSGVhZGVycyA9IHRoaXMuaGVhZGVycy5maWx0ZXIoIChpdGVtKSA9PiBpdGVtLmxvY2tlZCA9PT0gdHJ1ZSAmJiBpdGVtLnByZXNlbnQpO1xuXHRcdHRoaXMudW5sb2NrZWRIZWFkZXJzID0gdGhpcy5oZWFkZXJzLmZpbHRlciggKGl0ZW0pID0+IGl0ZW0ubG9ja2VkICE9PSB0cnVlICAmJiBpdGVtLnByZXNlbnQpO1x0XG5cdFx0dGhpcy5vbmNvbmZpZ3VyYXRpb25jaGFuZ2UuZW1pdChldmVudCk7XG5cblx0XHRpZiAodGhpcy5wZXJzaXN0ZW5jZUtleSkge1xuXHRcdFx0dGhpcy5nZW5lcmF0b3IucGVyc2lzdEhlYWRlcnModGhpcy5wZXJzaXN0ZW5jZUtleSwgdGhpcy5wZXJzaXN0ZW5jZUlkLCB0aGlzLmhlYWRlcnMpO1xuXHRcdH1cblx0XHRzZXRUaW1lb3V0KHRoaXMuZXZhbHVhdGVQb3NpdGlvbmluZy5iaW5kKHRoaXMpLDExMSk7XG5cdH1cblx0Y2hhbmdlTG9ja2VkVGFibGVGaWx0ZXJlZEl0ZW1zKGV2ZW50KSB7XG5cdFx0aWYgKHRoaXMubG9ja2VkVGFibGUpIHtcblx0XHRcdHRoaXMubG9ja2VkVGFibGUuZmlsdGVyZWRJdGVtcyA9IGV2ZW50O1xuXHRcdFx0dGhpcy5sb2NrZWRUYWJsZS5pbml0VmlzaWJsZVJvd3MoKTtcblx0XHR9XG5cdH1cblx0Y2hhbmdlVW5sb2NrZWRUYWJsZUZpbHRlcmVkSXRlbXMoZXZlbnQpIHtcblx0XHRpZiAodGhpcy51bmxvY2tlZFRhYmxlKSB7XG5cdFx0XHR0aGlzLnVubG9ja2VkVGFibGUuZmlsdGVyZWRJdGVtcyA9IGV2ZW50O1xuXHRcdFx0dGhpcy51bmxvY2tlZFRhYmxlLmluaXRWaXNpYmxlUm93cygpO1xuXHRcdH1cblx0fVxuXHRvblBhZ2luYXRpb25DaGFuZ2UoZXZlbnQpIHtcblx0XHR0aGlzLnBhZ2VJbmZvID0gZXZlbnQ7XG5cdFx0dGhpcy51bmxvY2tlZFRhYmxlLmV2YWx1YXRlUm93cygpO1xuXHR9XG5cblx0dGFibGVBY3Rpb24oZXZlbnQpIHtcblx0XHR0aGlzLm9uYWN0aW9uLmVtaXQoZXZlbnQpXG5cdH1cblxuXHRvbkRyb3AoZXZlbnQ6RHJvcEV2ZW50KXtcblxuXHR9XG5cdG9uQ2VsbEVkaXQoZXZlbnQpe1xuXHRcdHRoaXMub25DZWxsQ29udGVudEVkaXQuZW1pdChldmVudCk7XG5cdH1cbn1cblxuIl19