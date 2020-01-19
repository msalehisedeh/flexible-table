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
        this.headerSeparation = true;
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
    return LockTableComponent;
}());
export { LockTableComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jay50YWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvZmxleGlibGUtdGFibGUvIiwic291cmNlcyI6WyJzcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2xvY2sudGFibGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7RUFLRTtBQUNGLE9BQU8sRUFDSCxTQUFTLEVBQ1osS0FBSyxFQUNMLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULE1BQU0sRUFDTixRQUFRLEVBQ1IsWUFBWSxFQUNaLE1BQU0sZUFBZSxDQUFDO0FBSXZCLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBTzdFO0lBNkRJLDRCQUNNLFNBQWdDLEVBQ2hDLFFBQWtCO1FBRGxCLGNBQVMsR0FBVCxTQUFTLENBQXVCO1FBQ2hDLGFBQVEsR0FBUixRQUFRLENBQVU7UUE3RDNCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFDbkIsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFJckIsa0JBQWEsR0FBRyxFQUFFLENBQUM7UUFHVCxlQUFVLEdBQUc7WUFDdEIsY0FBYyxFQUFFLGlCQUFpQjtZQUNqQyxnQkFBZ0IsRUFBRSxtQkFBbUI7WUFDckMsU0FBUyxFQUFFLGVBQWU7WUFDMUIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsU0FBUyxFQUFFLE9BQU87WUFDbEIsUUFBUSxFQUFFLE1BQU07WUFDaEIsWUFBWSxFQUFFLFVBQVU7U0FDeEIsQ0FBQztRQUVPLHFCQUFnQixHQUFHLElBQUksQ0FBQztRQVVyQixlQUFVLEdBQUcsd0JBQXdCLENBQUM7UUFHdEMscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBVW5CLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzlCLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDdkMsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDOUIsMEJBQXFCLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQWtCMUQsQ0FBQztJQVZELG1DQUFNLEdBQU4sVUFBTyxLQUFLO1FBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQzNCLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFDakMsTUFBTSxFQUNOLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFPRCx3Q0FBVyxHQUFYLFVBQVksT0FBWTtRQUF4QixpQkE4QkM7UUE3QkEsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQ2xCLElBQU0sTUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FDYixVQUFDLElBQVM7Z0JBQ1QsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3JDLEtBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUNmLFVBQUMsTUFBVztvQkFDWCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7d0JBQ2xCLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQzNCLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRTs0QkFDL0IsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBQ3hDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLFVBQVUsRUFBRTtnQ0FDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzZCQUNqQztpQ0FBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLEVBQUU7Z0NBQ2hDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs2QkFDakM7aUNBQU0sSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxFQUFFO2dDQUNsQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7NkJBQ3ZFO2lDQUFNLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLFVBQVUsRUFBRTtnQ0FDcEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs2QkFDM0Q7eUJBQ0Q7cUJBQ0Q7Z0JBQ0YsQ0FBQyxDQUNELENBQUE7Z0JBQ0QsTUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqQixDQUFDLENBQ0QsQ0FBQTtZQUNELElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBSSxDQUFDO1NBQ3hCO0lBQ0YsQ0FBQztJQUNELHFDQUFRLEdBQVI7UUFDQyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFO2dCQUN0QixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQzthQUMxQztTQUNEO2FBQU07WUFDTixJQUFJLENBQUMsUUFBUSxHQUFHO2dCQUNILFdBQVcsRUFBRSxNQUFNO2dCQUNuQixRQUFRLEVBQUUsTUFBTTtnQkFDaEIsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsSUFBSSxFQUFFLENBQUM7Z0JBQ1AsRUFBRSxFQUFFLE1BQU07Z0JBQ1YsV0FBVyxFQUFFLENBQUM7Z0JBQ2QsUUFBUSxFQUFFLEdBQUc7YUFDaEIsQ0FBQztTQUNYO1FBQ0QsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3hCLElBQU0sT0FBTyxHQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRTVGLElBQUksT0FBTyxFQUFFO2dCQUNaLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO2FBQ3ZCO1NBQ0Q7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNsQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUM1RixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQ3hCLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDckY7U0FDRDtRQUNELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNyRSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUU5QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVoQyxDQUFDO0lBRUQsZ0RBQW1CLEdBQW5CO1FBQ0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQzVCLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFDbkMsYUFBYSxFQUNiLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLEdBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELHdDQUFXLEdBQVgsVUFBWSxLQUFLO1FBQ2hCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUUsVUFBQyxJQUFJLElBQUssT0FBQSxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFwQyxDQUFvQyxDQUFDLENBQUM7UUFDMUYsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBRSxVQUFDLElBQUksSUFBSyxPQUFBLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSSxJQUFLLElBQUksQ0FBQyxPQUFPLEVBQXJDLENBQXFDLENBQUMsQ0FBQztRQUM3RixJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXZDLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN4QixJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3JGO1FBQ0QsVUFBVSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUMsR0FBRyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELG1DQUFNLEdBQU4sVUFBTyxLQUFLO1FBQ1gsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBRSxVQUFDLElBQUksSUFBSyxPQUFBLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQXBDLENBQW9DLENBQUMsQ0FBQztRQUMxRixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFFLFVBQUMsSUFBSSxJQUFLLE9BQUEsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLElBQUssSUFBSSxDQUFDLE9BQU8sRUFBckMsQ0FBcUMsQ0FBQyxDQUFDO1FBQzdGLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFdkMsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDckY7UUFDRCxVQUFVLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBQyxHQUFHLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBQ0QsMkRBQThCLEdBQTlCLFVBQStCLEtBQUs7UUFDbkMsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUN6QyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7WUFDdkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkM7UUFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztJQUN6QixDQUFDO0lBQ0QsNkRBQWdDLEdBQWhDLFVBQWlDLEtBQUs7UUFDckMsSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUM3QyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7WUFDekMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDekM7UUFDRCxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBQ0QsK0NBQWtCLEdBQWxCLFVBQW1CLEtBQUs7UUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDdEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDekIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFFRCx3Q0FBVyxHQUFYLFVBQVksS0FBSztRQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUMxQixDQUFDO0lBRUQsbUNBQU0sR0FBTixVQUFPLEtBQWU7SUFFdEIsQ0FBQztJQUNELHVDQUFVLEdBQVYsVUFBVyxLQUFLO1FBQ2YsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBQ0QsMENBQWEsR0FBYixVQUFjLEtBQUs7UUFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0IsQ0FBQzs7Z0JBdEltQixxQkFBcUI7Z0JBQ3RCLFFBQVE7O0lBckR4QjtRQURDLEtBQUssQ0FBQyxZQUFZLENBQUM7MERBU3JCO0lBRU87UUFBUixLQUFLLEVBQUU7Z0VBQXlCO0lBRTlCO1FBREMsS0FBSyxDQUFDLGVBQWUsQ0FBQzs2REFDTTtJQUc3QjtRQURDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQzs4REFDTTtJQUVyQjtRQUFSLEtBQUssRUFBRTt1REFBaUI7SUFDaEI7UUFBUixLQUFLLEVBQUU7c0RBQWdCO0lBQ2Y7UUFBUixLQUFLLEVBQUU7MERBQVk7SUFDWDtRQUFSLEtBQUssRUFBRTswREFBdUM7SUFDekM7UUFBUixLQUFLLEVBQUU7dURBQWdCO0lBQ2Y7UUFBUixLQUFLLEVBQUU7cURBQWM7SUFDVjtRQUFSLEtBQUssRUFBRTtnRUFBMEI7SUFDNUI7UUFBUixLQUFLLEVBQUU7d0RBQWU7SUFDZDtRQUFSLEtBQUssRUFBRTt5REFBZ0I7SUFDWjtRQUFSLEtBQUssRUFBRTs0REFBdUI7SUFDekI7UUFBUixLQUFLLEVBQUU7MkRBQWtCO0lBQ2pCO1FBQVIsS0FBSyxFQUFFOytEQUEwQjtJQUN0QjtRQUFSLEtBQUssRUFBRTs4REFBeUI7SUFDeEI7UUFBUixLQUFLLEVBQUU7aUVBQTRCO0lBRzdCO1FBQVQsTUFBTSxFQUFFO3dEQUF1QztJQUN0QztRQUFULE1BQU0sRUFBRTtpRUFBZ0Q7SUFDL0M7UUFBVCxNQUFNLEVBQUU7d0RBQXVDO0lBQ3RDO1FBQVQsTUFBTSxFQUFFO3FFQUFvRDtJQUc3RDtRQURDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUM7MkRBQ0Y7SUFHeEM7UUFEQyxTQUFTLENBQUMsZUFBZSxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDOzZEQUNGO0lBcEQ5QixrQkFBa0I7UUFMOUIsU0FBUyxDQUFDO1lBQ1YsUUFBUSxFQUFFLFlBQVk7WUFDdEIsNjVEQUEwQzs7U0FFMUMsQ0FBQztPQUNXLGtCQUFrQixDQXFNOUI7SUFBRCx5QkFBQztDQUFBLEFBck1ELElBcU1DO1NBck1ZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4qIFByb3ZpZGVzIHJlbmRlcmluZyBvZiBhIHRhYmxlIHdoaWNoIGlzIHVzaW5nIHRoZSBnaXZlbiBGbGV4aWJsZVRhYmxlSGVhZGVyIHNldCBpblxuKiBvcmRlciB0byB0YWJ1bGF0ZSB0aGUgZ2l2ZW4gZGF0YS4gQXMgcGVyIGRlZmluaXRpb24gb2YgZWFyY2ggaGVhZGVyIGNvbXBvbmVudCxcbiogYSBjb2x1bW4gY291bGQgYmUgaGlkZGVuLCBzb3J0YWJsZSwgb3IgZHJhZ2dhYmxlLiBFYWNoIHRhYmxlIHJvdyBjYW4gZXhwYW5kL2NvbGxhcHNlXG4qIG9yIHJlc3BvbmQgdG8gYSBjbGljayBhY3Rpb24uXG4qL1xuaW1wb3J0IHtcbiAgICBDb21wb25lbnQsXG5cdElucHV0LFxuXHRPdXRwdXQsXG5cdFZpZXdDaGlsZCxcblx0T25DaGFuZ2VzLFxuXHRPbkluaXQsXG5cdFJlbmRlcmVyLFxuXHRFdmVudEVtaXR0ZXJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IERyb3BFdmVudCwgRHJhZ0V2ZW50IH0gZnJvbSAnQHNlZGVoL2RyYWctZW5hYmxlZCc7XG5pbXBvcnQgeyBUYWJsZVZpZXdDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50JztcbmltcG9ydCB7IFRhYmxlSGVhZGVyc0dlbmVyYXRvciB9IGZyb20gJy4vY29tcG9uZW50cy90YWJsZS1oZWFkZXJzLWdlbmVyYXRvcic7XG5cbkBDb21wb25lbnQoe1xuXHRzZWxlY3RvcjogJ2xvY2stdGFibGUnLFxuXHR0ZW1wbGF0ZVVybDogJy4vbG9jay50YWJsZS5jb21wb25lbnQuaHRtbCcsXG5cdHN0eWxlVXJsczogWycuL2xvY2sudGFibGUuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBMb2NrVGFibGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG5cblx0aG9sZGxvY2tlZCA9IGZhbHNlO1xuXHRob2xkdW5sb2NrZWQgPSBmYWxzZTtcblx0bG9ja2VkSGVhZGVyczphbnk7XG5cdHVubG9ja2VkSGVhZGVyczphbnk7XG5cdGZvcm1lZGl0ZW1zOmFueTtcblx0ZmlsdGVyZWRJdGVtcyA9IFtdO1xuXG4gICAgQElucHV0KFwidm9jYWJ1bGFyeVwiKVxuICAgIHB1YmxpYyB2b2NhYnVsYXJ5ID0ge1xuXHRcdGNvbmZpZ3VyZVRhYmxlOiBcIkNvbmZpZ3VyZSBUYWJsZVwiLFxuXHRcdGNvbmZpZ3VyZUNvbHVtbnM6IFwiQ29uZmlndXJlIENvbHVtbnNcIixcblx0XHRjbGlja1NvcnQ6IFwiQ2xpY2sgdG8gU29ydFwiLFxuXHRcdHNldFNpemU6IFwiU2V0IFNpemVcIixcblx0XHRmaXJzdFBhZ2U6IFwiRmlyc3RcIixcblx0XHRsYXN0UGFnZTogXCJMYXN0XCIsXG5cdFx0cHJldmlvdXNQYWdlOiBcIlByZXZpb3VzXCJcblx0fTtcblxuXHRASW5wdXQoKSBoZWFkZXJTZXBhcmF0aW9uID0gdHJ1ZTtcbiAgICBASW5wdXQoXCJwZXJzaXN0ZW5jZUlkXCIpXG4gICAgcHVibGljIHBlcnNpc3RlbmNlSWQ6IHN0cmluZztcblxuICAgIEBJbnB1dChcInBlcnNpc3RlbmNlS2V5XCIpXG4gICAgcHVibGljIHBlcnNpc3RlbmNlS2V5OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBjYXB0aW9uOiBzdHJpbmc7XG4gICAgQElucHV0KCkgYWN0aW9uOiBzdHJpbmc7XG4gICAgQElucHV0KCkgYWN0aW9uS2V5cztcbiAgICBASW5wdXQoKSB0YWJsZUNsYXNzID0gJ2RlZmF1bHQtZmxleGlibGUtdGFibGUnO1xuXHRASW5wdXQoKSBoZWFkZXJzOiBhbnlbXTtcblx0QElucHV0KCkgaXRlbXM6IGFueVtdO1xuICAgIEBJbnB1dCgpIGlubGluZVBhZ2luYXRpb24gPSBmYWxzZTtcblx0QElucHV0KCkgcGFnZUluZm86IGFueTtcblx0QElucHV0KCkgdGFibGVJbmZvOiBhbnk7XG4gICAgQElucHV0KCkgY29uZmlndXJhYmxlOiBib29sZWFuO1xuXHRASW5wdXQoKSBjb25maWdBZGRvbjogYW55O1xuXHRASW5wdXQoKSBlbmFibGVGaWx0ZXJpbmc6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZW5hYmxlSW5kZXhpbmc6IGJvb2xlYW47XG4gICAgQElucHV0KCkgZmlsdGVyd2hpbGV0eXBpbmc6IGJvb2xlYW47XG5cblxuXHRAT3V0cHV0KCkgcHJpdmF0ZSBvbmFjdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblx0QE91dHB1dCgpIHByaXZhdGUgb25DZWxsQ29udGVudEVkaXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cdEBPdXRwdXQoKSBwcml2YXRlIG9uZmlsdGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXHRAT3V0cHV0KCkgcHJpdmF0ZSBvbmNvbmZpZ3VyYXRpb25jaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cblx0QFZpZXdDaGlsZCgnbG9ja2VkVGFibGUnLCB7c3RhdGljOiBmYWxzZX0pXG5cdHByaXZhdGUgbG9ja2VkVGFibGU6IFRhYmxlVmlld0NvbXBvbmVudDtcblxuXHRAVmlld0NoaWxkKCd1bmxvY2tlZFRhYmxlJywge3N0YXRpYzogZmFsc2V9KVxuXHRwcml2YXRlIHVubG9ja2VkVGFibGU6IFRhYmxlVmlld0NvbXBvbmVudDtcblxuICAgIHNjcm9sbChldmVudCkge1xuXHRcdHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKFxuXHRcdFx0XHR0aGlzLmxvY2tlZFRhYmxlLmVsLm5hdGl2ZUVsZW1lbnQsXG5cdFx0XHRcdFwibGVmdFwiLFxuXHRcdFx0XHRldmVudC50YXJnZXQuc2Nyb2xsTGVmdCtcInB4XCIpO1xuXHR9XG5cbiAgICBjb25zdHJ1Y3Rvcihcblx0XHRwcml2YXRlIGdlbmVyYXRvcjogVGFibGVIZWFkZXJzR2VuZXJhdG9yLFxuXHRcdHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyXG5cdCkge31cblxuXHRuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBhbnkpIHtcblx0XHRpZiAoY2hhbmdlcy5pdGVtcykge1xuXHRcdFx0Y29uc3QgbGlzdCA9IFtdO1xuXHRcdFx0dGhpcy5pdGVtcy5tYXAoXG5cdFx0XHRcdChpdGVtOiBhbnkpID0+IHtcblx0XHRcdFx0XHRjb25zdCBjb3B5ID0gT2JqZWN0LmFzc2lnbih7fSwgaXRlbSk7XG5cdFx0XHRcdFx0dGhpcy5oZWFkZXJzLm1hcChcblx0XHRcdFx0XHRcdChoZWFkZXI6IGFueSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAoaGVhZGVyLmZvcm1hdCkge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IHYgPSBjb3B5W2hlYWRlci5rZXldO1xuXHRcdFx0XHRcdFx0XHRcdGlmICh2ICYmIHR5cGVvZiB2ID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgZm9ybWF0ID0gaGVhZGVyLmZvcm1hdC5zcGxpdCgnOicpO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGZvcm1hdFswXSA9PT0gJ2NhbGVuZGFyJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb3B5W2hlYWRlci5rZXldID0gRGF0ZS5wYXJzZSh2KTtcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZm9ybWF0WzBdID09PSAnZGF0ZScpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29weVtoZWFkZXIua2V5XSA9IERhdGUucGFyc2Uodik7XG5cdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGZvcm1hdFswXSA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29weVtoZWFkZXIua2V5XSA9IGZvcm1hdC5sZW5ndGggPiAyID8gcGFyc2VGbG9hdCh2KSA6IHBhcnNlSW50KHYsIDEwKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZm9ybWF0WzBdID09PSAnY3VycmVuY3knKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvcHlbaGVhZGVyLmtleV0gPSBwYXJzZUZsb2F0KHYucmVwbGFjZSgvW14wLTlcXC4tXSsvZyxcIlwiKSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0KVxuXHRcdFx0XHRcdGxpc3QucHVzaChjb3B5KTtcblx0XHRcdFx0fVxuXHRcdFx0KVxuXHRcdFx0dGhpcy5mb3JtZWRpdGVtcyA9IGxpc3Q7XG5cdFx0fVxuXHR9XG5cdG5nT25Jbml0KCkge1xuXHRcdGlmICh0aGlzLnBhZ2VJbmZvKSB7XG5cdFx0XHRpZiAoIXRoaXMucGFnZUluZm8udG8pIHtcblx0XHRcdFx0dGhpcy5wYWdlSW5mby50byA9IHRoaXMucGFnZUluZm8ucGFnZVNpemU7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMucGFnZUluZm8gPSB7XG4gICAgICAgICAgICAgICAgY29udGVudFNpemU6IDEwMDAwMCxcbiAgICAgICAgICAgICAgICBwYWdlU2l6ZTogMTAwMDAwLFxuICAgICAgICAgICAgICAgIHBhZ2VzOiAxLFxuICAgICAgICAgICAgICAgIGZyb206IDAsXG4gICAgICAgICAgICAgICAgdG86IDEwMDAwMCxcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFnZTogMSxcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogXCIwXCJcbiAgICAgICAgICAgIH07XG5cdFx0fVxuXHRcdGlmICh0aGlzLnBlcnNpc3RlbmNlS2V5KSB7XG5cdFx0XHRjb25zdCBoZWFkZXJzOmFueSA9IHRoaXMuZ2VuZXJhdG9yLnJldHJlaXZlSGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQpO1xuXG5cdFx0XHRpZiAoaGVhZGVycykge1xuXHRcdFx0XHR0aGlzLmhlYWRlcnMgPSBoZWFkZXJzO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoIXRoaXMuaGVhZGVycykge1xuXHRcdFx0dGhpcy5oZWFkZXJzID0gdGhpcy5nZW5lcmF0b3IuZ2VuZXJhdGVIZWFkZXJzRm9yKHRoaXMuaXRlbXNbMF0sXCJcIiwgNSwgdGhpcy5lbmFibGVGaWx0ZXJpbmcpO1xuXHRcdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcblx0XHRcdFx0dGhpcy5nZW5lcmF0b3IucGVyc2lzdEhlYWRlcnModGhpcy5wZXJzaXN0ZW5jZUtleSwgdGhpcy5wZXJzaXN0ZW5jZUlkLCB0aGlzLmhlYWRlcnMpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSB0aGlzLmZvcm1lZGl0ZW1zID8gdGhpcy5mb3JtZWRpdGVtczogdGhpcy5pdGVtcztcblx0XHR0aGlzLnBhZ2VJbmZvLmNvbnRlbnRTaXplID0gdGhpcy5pdGVtcy5sZW5ndGg7XG5cdFx0XG5cdFx0dGhpcy5yZWNvbmZpZ3VyZSh0aGlzLmhlYWRlcnMpO1xuXG5cdH1cblxuXHRldmFsdWF0ZVBvc2l0aW9uaW5nKCkge1xuXHRcdHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKFxuXHRcdFx0dGhpcy51bmxvY2tlZFRhYmxlLmVsLm5hdGl2ZUVsZW1lbnQsXG5cdFx0XHRcIm1hcmdpbi1sZWZ0XCIsXG5cdFx0XHR0aGlzLmxvY2tlZFRhYmxlLm9mZnNldFdpZHRoKCkrXCJweFwiKTtcblx0fVxuXG5cdHJlY29uZmlndXJlKGV2ZW50KSB7XG5cdFx0dGhpcy5oZWFkZXJzID0gZXZlbnQ7XG5cdFx0dGhpcy5sb2NrZWRIZWFkZXJzID0gdGhpcy5oZWFkZXJzLmZpbHRlciggKGl0ZW0pID0+IGl0ZW0ubG9ja2VkID09PSB0cnVlICYmIGl0ZW0ucHJlc2VudCk7XG5cdFx0dGhpcy51bmxvY2tlZEhlYWRlcnMgPSB0aGlzLmhlYWRlcnMuZmlsdGVyKCAoaXRlbSkgPT4gaXRlbS5sb2NrZWQgIT09IHRydWUgICYmIGl0ZW0ucHJlc2VudCk7XHRcblx0XHR0aGlzLm9uY29uZmlndXJhdGlvbmNoYW5nZS5lbWl0KGV2ZW50KTtcblxuXHRcdGlmICh0aGlzLnBlcnNpc3RlbmNlS2V5KSB7XG5cdFx0XHR0aGlzLmdlbmVyYXRvci5wZXJzaXN0SGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQsIHRoaXMuaGVhZGVycyk7XG5cdFx0fVxuXHRcdHNldFRpbWVvdXQodGhpcy5ldmFsdWF0ZVBvc2l0aW9uaW5nLmJpbmQodGhpcyksMTExKTtcblx0fVxuXG5cdG9ubG9jayhldmVudCkge1xuXHRcdHRoaXMubG9ja2VkSGVhZGVycyA9IHRoaXMuaGVhZGVycy5maWx0ZXIoIChpdGVtKSA9PiBpdGVtLmxvY2tlZCA9PT0gdHJ1ZSAmJiBpdGVtLnByZXNlbnQpO1xuXHRcdHRoaXMudW5sb2NrZWRIZWFkZXJzID0gdGhpcy5oZWFkZXJzLmZpbHRlciggKGl0ZW0pID0+IGl0ZW0ubG9ja2VkICE9PSB0cnVlICAmJiBpdGVtLnByZXNlbnQpO1x0XG5cdFx0dGhpcy5vbmNvbmZpZ3VyYXRpb25jaGFuZ2UuZW1pdChldmVudCk7XG5cblx0XHRpZiAodGhpcy5wZXJzaXN0ZW5jZUtleSkge1xuXHRcdFx0dGhpcy5nZW5lcmF0b3IucGVyc2lzdEhlYWRlcnModGhpcy5wZXJzaXN0ZW5jZUtleSwgdGhpcy5wZXJzaXN0ZW5jZUlkLCB0aGlzLmhlYWRlcnMpO1xuXHRcdH1cblx0XHRzZXRUaW1lb3V0KHRoaXMuZXZhbHVhdGVQb3NpdGlvbmluZy5iaW5kKHRoaXMpLDExMSk7XG5cdH1cblx0Y2hhbmdlTG9ja2VkVGFibGVGaWx0ZXJlZEl0ZW1zKGV2ZW50KSB7XG5cdFx0aWYgKHRoaXMubG9ja2VkVGFibGUgJiYgIXRoaXMuaG9sZGxvY2tlZCkge1xuXHRcdFx0dGhpcy5sb2NrZWRUYWJsZS5maWx0ZXJlZEl0ZW1zID0gZXZlbnQ7XG5cdFx0XHR0aGlzLmxvY2tlZFRhYmxlLmluaXRWaXNpYmxlUm93cyhudWxsKTtcblx0XHR9XG5cdFx0dGhpcy5ob2xkbG9ja2VkID0gZmFsc2U7XG5cdH1cblx0Y2hhbmdlVW5sb2NrZWRUYWJsZUZpbHRlcmVkSXRlbXMoZXZlbnQpIHtcblx0XHRpZiAodGhpcy51bmxvY2tlZFRhYmxlICYmICF0aGlzLmhvbGR1bmxvY2tlZCkge1xuXHRcdFx0dGhpcy51bmxvY2tlZFRhYmxlLmZpbHRlcmVkSXRlbXMgPSBldmVudDtcblx0XHRcdHRoaXMudW5sb2NrZWRUYWJsZS5pbml0VmlzaWJsZVJvd3MobnVsbCk7XG5cdFx0fVxuXHRcdHRoaXMuaG9sZHVubG9ja2VkID0gZmFsc2U7XG5cdH1cblx0b25QYWdpbmF0aW9uQ2hhbmdlKGV2ZW50KSB7XG5cdFx0dGhpcy5wYWdlSW5mbyA9IGV2ZW50O1xuXHRcdHRoaXMuaG9sZGxvY2tlZCA9IHRydWU7XG5cdFx0dGhpcy5ob2xkdW5sb2NrZWQgPSB0cnVlO1xuXHRcdHRoaXMubG9ja2VkVGFibGUuZXZhbHVhdGVSb3dzKCk7XG5cdFx0dGhpcy51bmxvY2tlZFRhYmxlLmV2YWx1YXRlUm93cygpO1xuXHR9XG5cblx0dGFibGVBY3Rpb24oZXZlbnQpIHtcblx0XHR0aGlzLm9uYWN0aW9uLmVtaXQoZXZlbnQpXG5cdH1cblxuXHRvbkRyb3AoZXZlbnQ6RHJvcEV2ZW50KXtcblxuXHR9XG5cdG9uQ2VsbEVkaXQoZXZlbnQpe1xuXHRcdHRoaXMub25DZWxsQ29udGVudEVkaXQuZW1pdChldmVudCk7XG5cdH1cblx0b25UYWJsZUZpbHRlcihldmVudCl7XG5cdFx0dGhpcy5vbmZpbHRlci5lbWl0KGV2ZW50KTtcblx0fVxufVxuXG4iXX0=