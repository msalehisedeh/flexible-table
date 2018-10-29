(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('into-pipes'), require('drag-enabled')) :
    typeof define === 'function' && define.amd ? define('flexible-table', ['exports', '@angular/core', '@angular/common', 'into-pipes', 'drag-enabled'], factory) :
    (factory((global['flexible-table'] = {}),global.ng.core,global.ng.common,global.intoPipes,global.dragEnabled));
}(this, (function (exports,core,common,intoPipes,dragEnabled) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var TableHeadersGenerator = (function () {
        function TableHeadersGenerator() {
            this.headers = [];
        }
        /**
         * @param {?} root
         * @param {?} path
         * @param {?} maxVisible
         * @param {?} filteringEnabled
         * @return {?}
         */
        TableHeadersGenerator.prototype.generateHeadersFor = /**
         * @param {?} root
         * @param {?} path
         * @param {?} maxVisible
         * @param {?} filteringEnabled
         * @return {?}
         */
            function (root, path, maxVisible, filteringEnabled) {
                var _this = this;
                if (root !== null) {
                    Object.keys(root).map(function (key) {
                        /** @type {?} */
                        var innerPath = (path.length ? (path + "." + key) : key);
                        if (typeof root[key] === "string" || typeof root[key] === "number" || typeof root[key] === "boolean") {
                            /** @type {?} */
                            var header = {
                                key: innerPath,
                                value: _this.makeWords(innerPath),
                                sortable: true,
                                dragable: true,
                                present: (path.length === 0 && _this.headers.length < maxVisible)
                            };
                            if (filteringEnabled) {
                                header.filter = "";
                            }
                            _this.headers.push(header);
                        }
                        else if (root[key] instanceof Array) {
                            /** @type {?} */
                            var node = root[key];
                            if (node.length && !(node[0] instanceof Array) && (typeof node[0] !== "string")) {
                                _this.generateHeadersFor(node[0], innerPath, maxVisible, filteringEnabled);
                            }
                            else {
                                _this.headers.push({
                                    key: innerPath,
                                    value: _this.makeWords(innerPath)
                                });
                            }
                        }
                        else {
                            _this.generateHeadersFor(root[key], innerPath, maxVisible, filteringEnabled);
                        }
                    });
                }
                return this.headers;
            };
        /**
         * @param {?} key
         * @param {?} trackingkey
         * @return {?}
         */
        TableHeadersGenerator.prototype.retreiveHeaders = /**
         * @param {?} key
         * @param {?} trackingkey
         * @return {?}
         */
            function (key, trackingkey) {
                /** @type {?} */
                var result;
                try {
                    result = localStorage.getItem(trackingkey);
                    if (!result || result != key) {
                        result = undefined; // we have a newer version and it will override saved data.
                    }
                    else {
                        result = localStorage.getItem(key);
                        result = result ? JSON.parse(result) : result;
                    }
                }
                catch (e) {
                }
                return result;
            };
        /**
         * @param {?} key
         * @param {?} trackingkey
         * @param {?} headers
         * @return {?}
         */
        TableHeadersGenerator.prototype.persistHeaders = /**
         * @param {?} key
         * @param {?} trackingkey
         * @param {?} headers
         * @return {?}
         */
            function (key, trackingkey, headers) {
                try {
                    localStorage.removeItem(trackingkey);
                    localStorage.setItem(trackingkey, key);
                    localStorage.setItem(key, JSON.stringify(headers));
                }
                catch (e) {
                }
            };
        /**
         * @param {?} name
         * @return {?}
         */
        TableHeadersGenerator.prototype.makeWords = /**
         * @param {?} name
         * @return {?}
         */
            function (name) {
                return name
                    .replace(/\./g, ' ~ ')
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/-/g, " ")
                    .replace(/_/g, " ")
                    .replace(/^./, function (str) { return str.toUpperCase(); });
            };
        TableHeadersGenerator.decorators = [
            { type: core.Injectable }
        ];
        /** @nocollapse */
        TableHeadersGenerator.ctorParameters = function () { return []; };
        return TableHeadersGenerator;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var FlexibleTableComponent = (function () {
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
            this.onaction = new core.EventEmitter();
            this.onCellContentEdit = new core.EventEmitter();
            this.onconfigurationchange = new core.EventEmitter();
        }
        /**
         * @return {?}
         */
        FlexibleTableComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                if (this.persistenceKey) {
                    /** @type {?} */
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
        /**
         * @return {?}
         */
        FlexibleTableComponent.prototype.updateLimits = /**
         * @return {?}
         */
            function () {
                this.subHeaders = this.headers.filter(function (header) { return header.present === true; });
            };
        /**
         * @param {?} event
         * @return {?}
         */
        FlexibleTableComponent.prototype.reconfigure = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.headers = event;
                this.updateLimits();
                this.onconfigurationchange.emit(event);
                if (this.persistenceKey) {
                    this.generator.persistHeaders(this.persistenceKey, this.persistenceId, this.headers);
                }
            };
        /**
         * @param {?} event
         * @return {?}
         */
        FlexibleTableComponent.prototype.onPaginationChange = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.pageInfo = event;
                this.viewTable.evaluateRows();
            };
        /**
         * @param {?} event
         * @return {?}
         */
        FlexibleTableComponent.prototype.tableAction = /**
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
        FlexibleTableComponent.prototype.onDrop = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
            };
        /**
         * @param {?} event
         * @return {?}
         */
        FlexibleTableComponent.prototype.onCellEdit = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.onCellContentEdit.emit(event);
            };
        FlexibleTableComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'flexible-table',
                        template: "\r\n<div class=\"flexible-table\">\r\n    <table-configuration\r\n        *ngIf=\"configurable && items && items.length\"\r\n        class=\"table-configuration\" \r\n        [headers]=\"headers\" \r\n        [title]=\"vocabulary.configureColumns\" \r\n        [printTable]=\"vocabulary.printTable\"\r\n        [action]=\"vocabulary.configureTable\"\r\n        [configAddon]=\"configAddon\"\r\n        (onprint)=\"viewTable.print()\"\r\n        (onchange)=\"reconfigure($event)\"></table-configuration>\r\n        \r\n    <table-view #viewTable\r\n        [action]=\"action\"\r\n        [actionKeys]=\"actionKeys\"\r\n\t\t[tableClass]=\"tableClass\"\r\n\t\t[tableInfo]=\"tableInfo\"\r\n\t\t[caption]=\"caption\" \r\n\t\t[headers]=\"subHeaders\" \r\n        [items]=\"items\" \r\n        [filterwhiletyping]=\"filterwhiletyping\"\r\n        [pageInfo]=\"pageInfo\"\r\n        [vocabulary]=\"vocabulary\"\r\n\t\t[enableIndexing]=\"enableIndexing\"\r\n\t\t[enableFiltering]=\"enableFiltering\"\r\n        [rowDetailer]=\"rowDetailer\"\r\n        [rowDetailerHeaders]=\"rowDetailerHeaders\"\r\n        [expandable]=\"expandable\"\r\n        [expandIf]=\"expandIf\"\r\n        (onDrop)=\"onDrop($event)\"\r\n\t\t(onCellContentEdit)=\"onCellEdit($event)\"\r\n        (onchange)=\"reconfigure($event)\"\r\n\t\t(onaction)=\"tableAction($event)\"></table-view>\r\n</div>\r\n<table-pagination \r\n    [info]=\"pageInfo\" \r\n    [vocabulary]=\"vocabulary\"\r\n    (onchange)=\"onPaginationChange($event)\"></table-pagination>\r\n",
                        styles: [":host{display:inline-block!important;width:100%}.flexible-table{position:relative;margin:0 auto;display:table;border-spacing:0;border-collapse:collapse}.flexible-table .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table{margin:1rem auto;padding:0;width:100%;table-layout:fixed;max-width:99%;background-color:transparent;border-collapse:collapse}.flexible-table table caption{background-color:#c3e5e2;border-radius:2px;color:#1b1b1b;caption-side:top;font-size:14px;padding:5px 6px;margin-bottom:15px;text-align:left}.flexible-table table thead{border-top:1px solid #bbb;border-bottom:1px solid #bbb;background-color:#eee}.flexible-table table tr{border:0}.flexible-table table tr.expanded td{font-weight:700;border-bottom:0}.flexible-table table td{padding-left:3px}.flexible-table table td:first-child{padding-left:5px}.flexible-table table td .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table td.index{background-color:#eee;border-right:1px solid #bbb}.flexible-table table th{cursor:default;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none;height:24px;position:relative;white-space:nowrap;font-weight:400;text-transform:uppercase;font-size:14px;padding-top:6px;padding-bottom:6px;text-align:left}.flexible-table table th.drag-over{background-color:#9b9b9b}.flexible-table table th.drag-over .icon,.flexible-table table th.drag-over .title{color:#eee}.flexible-table table th:first-child{padding-left:5px}.flexible-table table th.ascending,.flexible-table table th.descending,.flexible-table table th.sortable{cursor:pointer;height:12px}.flexible-table table th.indexable{width:33px}.flexible-table table th.actionable{width:24px}.flexible-table table th .title{color:#254a4d;display:inline-block;height:20px;white-space:nowrap}.flexible-table table th .dragable{cursor:move}.flexible-table table th .icon{width:22px;display:inline-block;height:20px;color:#254a4d}.flexible-table .fa.fa-angle-right{font-size:18px}.flexible-table table tr.detail td{border-top:0;cursor:default}.flexible-table table tr.expanded td a.expanded{background-position:right 2px}.flexible-table table tbody tr:hover{background-color:#ffeed2}.flexible-table table tbody tr.detail:hover,.flexible-table table tbody tr.detail:hover td table thead tr{background-color:inherit}.flexible-table table tr td a.actionable{display:inline-table;height:32px;vertical-align:middle;width:25px;line-height:30px;color:#254a4d}.flexible-table table tbody tr.detail:hover td:last-child{border-right:0}.flexible-table table tbody tr.detail:hover td:first-child{border-left:0}.flexible-table table tr td{border-bottom:1px solid #b1b3b3;color:#254a5d;font-size:15px;text-transform:capitalize}.flexible-table table tbody tr.pointer{cursor:pointer}.flexible-table table.alert-danger{border:0}.flexible-table table.alert-danger caption{background-color:transparent;font-weight:700;margin-bottom:0}.flexible-table table.alert-danger td{border-bottom:0;display:block}.flexible-table table.alert-danger td:first-child{padding-left:0}.flexible-table table.alert-danger td:last-child{border-bottom:0}.flexible-table table.alert-danger td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase;width:20%}.flexible-table table.alert-danger td a span.icon{width:100%}.flexible-table table.alert-danger thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table.alert-danger tr{border:2px solid #fff;display:block;margin-bottom:.625em;padding:5px;border-radius:5px}.flexible-table table.alert-danger tr th.actionable{width:inherit}.flexible-table table.alert-danger tr td{border-bottom:0}@media screen and (max-width:600px){.flexible-table table{border:0}.flexible-table table td{border-bottom:0;display:block;text-align:right}.flexible-table table td:first-child{padding-left:0}.flexible-table table td:last-child{border-bottom:0}.flexible-table table td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase}.flexible-table table td a span.icon{width:100%}.flexible-table table thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table tr{border-bottom:3px solid #ddd;display:block;margin-bottom:.625em}.flexible-table table tr th.actionable{width:inherit}.flexible-table table tr td{border-bottom:0}.flexible-table table.alert-danger td:before{width:inherit}}"]
                    }] }
        ];
        /** @nocollapse */
        FlexibleTableComponent.ctorParameters = function () {
            return [
                { type: TableHeadersGenerator }
            ];
        };
        FlexibleTableComponent.propDecorators = {
            vocabulary: [{ type: core.Input, args: ["vocabulary",] }],
            persistenceId: [{ type: core.Input, args: ["persistenceId",] }],
            persistenceKey: [{ type: core.Input, args: ["persistenceKey",] }],
            caption: [{ type: core.Input, args: ["caption",] }],
            action: [{ type: core.Input, args: ["action",] }],
            actionKeys: [{ type: core.Input, args: ["actionKeys",] }],
            tableClass: [{ type: core.Input, args: ["tableClass",] }],
            headers: [{ type: core.Input, args: ["headers",] }],
            items: [{ type: core.Input, args: ["items",] }],
            pageInfo: [{ type: core.Input, args: ["pageInfo",] }],
            tableInfo: [{ type: core.Input, args: ["tableInfo",] }],
            configurable: [{ type: core.Input, args: ["configurable",] }],
            configAddon: [{ type: core.Input, args: ["configAddon",] }],
            enableIndexing: [{ type: core.Input, args: ["enableIndexing",] }],
            enableFiltering: [{ type: core.Input, args: ["enableFiltering",] }],
            rowDetailer: [{ type: core.Input, args: ["rowDetailer",] }],
            expandable: [{ type: core.Input, args: ["expandable",] }],
            expandIf: [{ type: core.Input, args: ["expandIf",] }],
            filterwhiletyping: [{ type: core.Input, args: ["filterwhiletyping",] }],
            rowDetailerHeaders: [{ type: core.Input, args: ["rowDetailerHeaders",] }],
            onaction: [{ type: core.Output, args: ['onaction',] }],
            onCellContentEdit: [{ type: core.Output, args: ['onCellContentEdit',] }],
            onconfigurationchange: [{ type: core.Output, args: ['onconfigurationchange',] }],
            viewTable: [{ type: core.ViewChild, args: ['viewTable',] }]
        };
        return FlexibleTableComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var PaginationComponent = (function () {
        function PaginationComponent() {
            this.vocabulary = { setSize: "", firstPage: "", nextPage: "", lastPage: "", previousPage: "" };
            this.info = { contentSize: 0, pageSize: 0, maxWidth: "0" };
            this.onchange = new core.EventEmitter();
            this.onready = new core.EventEmitter();
        }
        /**
         * @return {?}
         */
        PaginationComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                if (!this.info) {
                    this.info = {
                        contentSize: 1000,
                        pageSize: 1000,
                        pages: 1,
                        from: 0,
                        to: 1000,
                        currentPage: 1,
                        maxWidth: "0"
                    };
                }
                if (this.info.contentSize && this.info.pageSize) {
                    this.info.pages = Math.ceil(this.info.contentSize / this.info.pageSize);
                    this.info.from = 0;
                    this.info.to = this.info.pageSize - 1;
                    this.info.currentPage = 1;
                    setTimeout(function () { return _this.ready(); }, 66);
                }
            };
        /**
         * @param {?} width
         * @return {?}
         */
        PaginationComponent.prototype.setWidth = /**
         * @param {?} width
         * @return {?}
         */
            function (width) {
                this.info.maxWidth = width + "px";
            };
        /**
         * @return {?}
         */
        PaginationComponent.prototype.ready = /**
         * @return {?}
         */
            function () {
                this.onready.emit(this);
                this.onchange.emit(this.info);
            };
        /**
         * @return {?}
         */
        PaginationComponent.prototype.selectFirst = /**
         * @return {?}
         */
            function () {
                if (this.info.currentPage > 1) {
                    this.info.from = 0;
                    this.info.to = this.info.from + this.info.pageSize - 1;
                    this.info.currentPage = 1;
                    this.onchange.emit(this.info);
                }
            };
        /**
         * @return {?}
         */
        PaginationComponent.prototype.selectNext = /**
         * @return {?}
         */
            function () {
                if (this.info.currentPage < this.info.pages) {
                    this.info.from = this.info.to + 1;
                    this.info.to = this.info.from + this.info.pageSize - 1;
                    this.info.currentPage++;
                    this.onchange.emit(this.info);
                }
            };
        /**
         * @return {?}
         */
        PaginationComponent.prototype.selectPrev = /**
         * @return {?}
         */
            function () {
                if (this.info.currentPage > 1) {
                    this.info.from -= this.info.pageSize;
                    this.info.to = this.info.from + this.info.pageSize - 1;
                    this.info.currentPage--;
                    this.onchange.emit(this.info);
                }
            };
        /**
         * @return {?}
         */
        PaginationComponent.prototype.selectLast = /**
         * @return {?}
         */
            function () {
                if (this.info.currentPage < this.info.pages) {
                    this.info.from = this.info.pageSize * (this.info.pages - 1);
                    this.info.to = this.info.from + this.info.pageSize - 1;
                    this.info.currentPage = this.info.pages;
                    this.onchange.emit(this.info);
                }
            };
        /**
         * @param {?} ranger
         * @return {?}
         */
        PaginationComponent.prototype.changeCurrent = /**
         * @param {?} ranger
         * @return {?}
         */
            function (ranger) {
                /** @type {?} */
                var v = parseInt(ranger.value, 10);
                if (this.info.currentPage < v && v > 0 && v < this.info.pages) {
                    this.info.from = v * (this.info.pageSize - 1);
                    this.info.to = this.info.from + this.info.pageSize - 1;
                    this.info.currentPage = v;
                    this.onchange.emit(this.info);
                }
                else {
                    ranger.value = this.info.currentPage;
                }
            };
        /**
         * @param {?} sizer
         * @return {?}
         */
        PaginationComponent.prototype.changeSize = /**
         * @param {?} sizer
         * @return {?}
         */
            function (sizer) {
                /** @type {?} */
                var v = parseInt(sizer.value, 10);
                if (this.info.contentSize >= v && v > 1) {
                    this.info.pageSize = v;
                    this.info.pages = Math.ceil(this.info.contentSize / v);
                    this.info.from = 0;
                    this.info.to = this.info.pageSize - 1;
                    this.info.currentPage = 1;
                    this.onchange.emit(this.info);
                }
                else {
                    sizer.value = this.info.pageSize;
                }
            };
        PaginationComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'table-pagination',
                        template: "<div *ngIf=\"info && info.pages > 1\" [style.width]=\"info.maxWidth\" class=\"table-pagination\" #paginationWrapper>\r\n    <div class=\"fa fa-angle-left\"\r\n         (click)=\"selectPrev()\"\r\n         [class.disabled]=\"info.currentPage==1\">\r\n        <span class=\"prev\" [textContent]=\"vocabulary.previousPage\"></span>\r\n    </div>\r\n    <div class=\"fa fa-angle-double-left\"\r\n         (click)=\"selectFirst()\"\r\n         [class.disabled]=\"info.currentPage==1\">\r\n        <span class=\"first\" [textContent]=\"vocabulary.firstPage\"></span>\r\n    </div>\r\n    <div class=\"current\">\r\n        <input  #ranger [value]=\"info.currentPage\" (keydown.Enter)=\"changeCurrent(ranger)\" />\r\n        <span [textContent]=\"' / ' + info.pages\"></span>\r\n\t</div>\r\n    <div class=\"fa fa-angle-double-right\"\r\n         (click)=\"selectLast()\"\r\n         [class.disabled]=\"info.currentPage==info.pages\">\r\n        <span class=\"last\" [textContent]=\"vocabulary.lastPage\"></span>\r\n    </div>\r\n    <div class=\"fa fa-angle-right\"\r\n         (click)=\"selectNext()\"\r\n         [class.disabled]=\"info.currentPage==info.pages\">\r\n        <span class=\"next\" [textContent]=\"vocabulary.nextPage\"></span>\r\n    </div>\r\n    <div class=\"reset-size\" *ngIf=\"info.resetSize\">\r\n        <label for=\"pagination-set-size\">\r\n            <span class=\"off-screen\" [textContent]=\"vocabulary.setSize\"></span>\r\n            <input id=\"pagination-set-size\" [value]=\"info.pageSize\" (keydown.Enter)=\"changeSize(sizer)\" #sizer />\r\n        </label>\r\n    </div>\r\n</div>\r\n",
                        styles: [".table-pagination{box-sizing:border-box;background-color:#fff;border:1px solid #254a5d;border-radius:2px;color:#254a5d;bottom:5px;clear:both;display:flex;font-size:1em;height:38px;max-width:100%;margin:0 auto;position:fixed;left:40%;z-index:55}.table-pagination .fa{padding:4px 8px;margin-top:5px}.table-pagination .first,.table-pagination .last,.table-pagination .next,.table-pagination .prev{background-repeat:no-repeat;cursor:pointer;width:auto;display:block;height:39px;text-indent:-99999px;box-sizing:border-box}.table-pagination .reset-size{padding:0;height:35px;border-radius:4px}.table-pagination .reset-size input{border:0;border-left:1px solid #4c5854;height:34px;text-align:center;width:30px;margin-right:2px;margin-left:8px}.table-pagination .current{padding:1px 5px}.table-pagination .current input{padding:0 3px;width:14px;height:35px;border:none;text-align:center}.table-pagination .disabled{opacity:.4}@media screen and (max-width:992px){.table-pagination{left:4px}}"]
                    }] }
        ];
        PaginationComponent.propDecorators = {
            vocabulary: [{ type: core.Input, args: ["vocabulary",] }],
            info: [{ type: core.Input, args: ["info",] }],
            onchange: [{ type: core.Output, args: ['onchange',] }],
            onready: [{ type: core.Output, args: ['onready',] }]
        };
        return PaginationComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var ConfigurationComponent = (function () {
        function ConfigurationComponent() {
            this.onchange = new core.EventEmitter();
            this.onprint = new core.EventEmitter();
        }
        /**
         * @param {?} item
         * @param {?} header
         * @return {?}
         */
        ConfigurationComponent.prototype.reconfigure = /**
         * @param {?} item
         * @param {?} header
         * @return {?}
         */
            function (item, header) {
                header.present = item.checked;
                this.onchange.emit(this.headers);
            };
        /**
         * @param {?} item
         * @param {?} header
         * @return {?}
         */
        ConfigurationComponent.prototype.enableFilter = /**
         * @param {?} item
         * @param {?} header
         * @return {?}
         */
            function (item, header) {
                if (header.filter === undefined) {
                    header.filter = "";
                }
                else {
                    delete header.filter;
                }
                this.onchange.emit(this.headers);
            };
        /**
         * @param {?} event
         * @return {?}
         */
        ConfigurationComponent.prototype.print = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.onprint.emit(true);
            };
        /**
         * @param {?} event
         * @return {?}
         */
        ConfigurationComponent.prototype.keyup = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                /** @type {?} */
                var code = event.which;
                if (code === 13) {
                    event.target.click();
                }
            };
        ConfigurationComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'table-configuration',
                        template: "\r\n<div class=\"shim\"\r\n    [style.display]=\"showConfigurationView ? 'block':'none'\"\r\n    (click)=\"showConfigurationView = !showConfigurationView\"></div>\r\n\r\n<a  [attr.tabindex]=\"0\" *ngIf=\"printTable\"\r\n    class=\"print-table\"\r\n    (keyup)=\"keyup($event)\"\r\n    (click)=\"print($event)\">\r\n    <span class=\"icon fa fa-print\" aria-hidden=\"true\"></span>\r\n    <span class=\"off-screen\" [textContent]=\"print\"></span>\r\n</a>\r\n<a  [attr.tabindex]=\"0\"\r\n    class=\"configure-table\"\r\n    (keyup)=\"keyup($event)\"\r\n    (click)=\"showConfigurationView = !showConfigurationView\">\r\n    <span class=\"icon fa fa-gear\" aria-hidden=\"true\"></span>\r\n    <span class=\"off-screen\" [textContent]=\"action\"></span>\r\n</a>\r\n<ng-container *ngIf=\"configAddon\" [ngTemplateOutlet]=\"configAddon\"></ng-container>\r\n\r\n<ul role=\"list\" [style.display]=\"showConfigurationView ? 'block':'none'\">\r\n    <p [textContent]=\"title\"></p>\r\n    <li  *ngFor=\"let header of headers\" role=\"listitem\">\r\n        <label for=\"{{header.key ? header.key+'f':'f'}}\">\r\n            <input type=\"checkbox\" #filter\r\n                    [id]=\"header.key ? header.key+'f':'f'\"\r\n                    [checked]=\"header.filter !== undefined\"\r\n                    (keyup)=\"keyup($event)\"\r\n                    (click)=\"enableFilter(filter, header)\" />\r\n            <span>Filter</span>\r\n        </label>\r\n        <label for=\"{{header.key ? header.key+'c':'c'}}\">\r\n            <input type=\"checkbox\" #checkbox\r\n                    [id]=\"header.key ? header.key+'c':'c'\"\r\n                    [value]=\"header.key\"\r\n                    [checked]=\"header.present\"\r\n                    (keyup)=\"keyup($event)\"\r\n                    (click)=\"reconfigure(checkbox, header)\" />\r\n            <span>Show</span>\r\n        </label>\r\n        <span class=\"title\" [textContent]=\"header.value | uppercase\"></span>\r\n    </li>\r\n</ul>\r\n",
                        styles: [":host{box-sizing:border-box;padding:2px;position:absolute;right:8px;top:18px;z-index:2}:host a{display:block;float:left;padding:0 0 0 10px;cursor:pointer;z-index:5}:host a .icon{color:#00925b}:host a .off-screen{display:block;text-indent:-9999px;width:0;height:0;overflow:hidden}:host .shim{background-color:rgba(255,255,255,.2);width:100vw;height:100vh;position:fixed;top:0;left:0;z-index:2}:host ul{background-color:#fff;border:1px solid #999;border-radius:4px;display:flex;list-style:none;max-height:200px;margin:0 2px;min-width:200px;overflow-y:auto;position:absolute;padding:0 0 8px;right:0;box-shadow:6px 8px 6px -6px #1b1b1b;z-index:6}:host ul p{margin:0;padding:1px 5px;background-color:#5f9ea0;color:#fff}:host ul li{white-space:nowrap;text-align:left;flex-direction:row;padding:1px 5px}:host ul li label input{flex:0 0 30%;margin-top:4px}:host ul li .title{flex:0 0 30%;font-weight:700}"]
                    }] }
        ];
        ConfigurationComponent.propDecorators = {
            title: [{ type: core.Input, args: ["title",] }],
            action: [{ type: core.Input, args: ["action",] }],
            printTable: [{ type: core.Input, args: ["printTable",] }],
            headers: [{ type: core.Input, args: ["headers",] }],
            configAddon: [{ type: core.Input, args: ["configAddon",] }],
            onchange: [{ type: core.Output, args: ['onchange',] }],
            onprint: [{ type: core.Output, args: ['onprint',] }]
        };
        return ConfigurationComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var TableViewComponent = (function () {
        function TableViewComponent(el) {
            this.el = el;
            this.dragging = false;
            this.printMode = false;
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
            this.onaction = new core.EventEmitter();
            this.onchange = new core.EventEmitter();
            this.onfilter = new core.EventEmitter();
            this.onCellContentEdit = new core.EventEmitter();
        }
        /**
         * @param {?} id
         * @return {?}
         */
        TableViewComponent.prototype.findColumnWithID = /**
         * @param {?} id
         * @return {?}
         */
            function (id) {
                /** @type {?} */
                var list = this.headerColumnElements();
                /** @type {?} */
                var column = null;
                for (var i = 0; i < list.length; i++) {
                    if (list[i].getAttribute("id") === id) {
                        column = list[i];
                        break;
                    }
                }
                return column;
            };
        /**
         * @param {?} source
         * @param {?} destination
         * @return {?}
         */
        TableViewComponent.prototype.swapColumns = /**
         * @param {?} source
         * @param {?} destination
         * @return {?}
         */
            function (source, destination) {
                var _this = this;
                if (source.node.parentNode === destination.node.parentNode) {
                    /** @type {?} */
                    var srcIndex_1 = this.getColumnIndex(source.medium.key);
                    /** @type {?} */
                    var desIndex_1 = this.getColumnIndex(destination.medium.key);
                    if (srcIndex_1 < 0 || desIndex_1 < 0) {
                        console.log("invalid drop id", source.medium.key, destination.medium.key);
                        return;
                    }
                    /** @type {?} */
                    var x_1 = this.filteredItems;
                    this.filteredItems = [];
                    setTimeout(function () {
                        /** @type {?} */
                        var sobj = _this.headers[srcIndex_1];
                        _this.headers[srcIndex_1] = _this.headers[desIndex_1];
                        _this.headers[desIndex_1] = sobj;
                        _this.filteredItems = x_1;
                        _this.onfilter.emit(_this.filteredItems);
                        _this.onchange.emit(_this.headers);
                    }, 33);
                }
                else if (source.medium.locked || destination.medium.locked) {
                    /** @type {?} */
                    var x_2 = this.filteredItems;
                    this.filteredItems = [];
                    this.onfilter.emit(this.filteredItems);
                    setTimeout(function () {
                        source.medium.locked = !source.medium.locked;
                        destination.medium.locked = !destination.medium.locked;
                        _this.filteredItems = x_2;
                        _this.onfilter.emit(_this.filteredItems);
                        _this.onchange.emit(_this.headers);
                    }, 33);
                }
            };
        /**
         * @param {?} id
         * @return {?}
         */
        TableViewComponent.prototype.getColumnIndex = /**
         * @param {?} id
         * @return {?}
         */
            function (id) {
                /** @type {?} */
                var index = -1;
                for (var i = 0; i < this.headers.length; i++) {
                    if (this.headers[i].key === id) {
                        index = i;
                        break;
                    }
                }
                return index;
            };
        /**
         * @param {?} item
         * @param {?} hpath
         * @return {?}
         */
        TableViewComponent.prototype.itemValue = /**
         * @param {?} item
         * @param {?} hpath
         * @return {?}
         */
            function (item, hpath) {
                /** @type {?} */
                var subitem = item;
                hpath.map(function (subkey) {
                    if (subitem) {
                        subitem = subitem[subkey];
                    }
                });
                return subitem === undefined || subitem === null || subitem === "null" ? "" : subitem;
            };
        /**
         * @return {?}
         */
        TableViewComponent.prototype.initVisibleRows = /**
         * @return {?}
         */
            function () {
                /** @type {?} */
                var result = [];
                for (var i = 0; i < this.filteredItems.length; i++) {
                    if (i >= this.pageInfo.from && i <= this.pageInfo.to) {
                        result.push(this.filteredItems[i]);
                    }
                }
                this.filteredItems = result;
            };
        /**
         * @param {?} header
         * @param {?} event
         * @return {?}
         */
        TableViewComponent.prototype.lock = /**
         * @param {?} header
         * @param {?} event
         * @return {?}
         */
            function (header, event) {
                event.stopPropagation();
                event.preventDefault();
                header.locked = !header.locked;
                this.onchange.emit(this.headers);
            };
        /**
         * @param {?} header
         * @param {?} icon
         * @return {?}
         */
        TableViewComponent.prototype.sort = /**
         * @param {?} header
         * @param {?} icon
         * @return {?}
         */
            function (header, icon) {
                var _this = this;
                if (header.sortable && this.items && this.items.length) {
                    for (var i = 0; i < this.headers.length; i++) {
                        /** @type {?} */
                        var h = this.headers[i];
                        if (h.key !== header.key) {
                            /** @type {?} */
                            var item = this.findColumnWithID(h.key);
                            if (item) {
                                item.classList.remove("ascending");
                                item.classList.remove("descending");
                                item.classList.add("sortable");
                            }
                            h.descending = false;
                            h.ascending = false;
                        }
                    }
                    icon.classList.remove("fa-sort");
                    if (header.ascending || (!header.ascending && !header.descending)) {
                        header.descending = true;
                        header.ascending = false;
                        icon.classList.remove("fa-sort-asc");
                        icon.classList.add("fa-sort-desc");
                    }
                    else {
                        header.descending = false;
                        header.ascending = true;
                        icon.classList.remove("fa-sort-desc");
                        icon.classList.add("fa-sort-asc");
                    }
                    /** @type {?} */
                    var hpath_1 = header.key.split(".");
                    if (this.enableFiltering) {
                        this.filterItems();
                    }
                    else {
                        this.filteredItems = this.items ? this.items : [];
                    }
                    this.filteredItems.sort(function (a, b) {
                        /** @type {?} */
                        var v1 = _this.itemValue(a, hpath_1);
                        /** @type {?} */
                        var v2 = _this.itemValue(b, hpath_1);
                        if (header.ascending) {
                            return v1 > v2 ? 1 : -1;
                        }
                        return v1 < v2 ? 1 : -1;
                    });
                    this.initVisibleRows();
                }
            };
        /**
         * @return {?}
         */
        TableViewComponent.prototype.offsetWidth = /**
         * @return {?}
         */
            function () {
                return this.table.element.nativeElement.offsetWidth;
            };
        /**
         * @param {?} changes
         * @return {?}
         */
        TableViewComponent.prototype.ngOnChanges = /**
         * @param {?} changes
         * @return {?}
         */
            function (changes) {
                // if (changes.items) {
                // 	this.evaluateRows();
                // }
            };
        /**
         * @return {?}
         */
        TableViewComponent.prototype.ngOnInit = /**
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
                if (!this.headers) {
                    this.headers = [];
                }
                this.evaluateRows();
                if (this.actionKeys) {
                    this.actionKeys = this.actionKeys.split(",");
                }
                if (!this.rowDetailer && this.expandable) {
                    this.rowDetailer = function (item) {
                        return { data: item, headers: [] };
                    };
                }
                if (!this.expandable) {
                    this.expandable = function (item, showIcon) { return showIcon; };
                }
                if (!this.rowDetailerHeaders) {
                    this.rowDetailerHeaders = function (item) { return []; };
                }
            };
        /**
         * @return {?}
         */
        TableViewComponent.prototype.evaluateRows = /**
         * @return {?}
         */
            function () {
                if (this.enableFiltering) {
                    this.filterItems();
                }
                else {
                    this.filteredItems = this.items ? this.items : [];
                }
                this.initVisibleRows();
            };
        /**
         * @return {?}
         */
        TableViewComponent.prototype.headerColumnElements = /**
         * @return {?}
         */
            function () {
                /** @type {?} */
                var result = [];
                if (this.table.element.nativeElement.children) {
                    /** @type {?} */
                    var list = this.table.element.nativeElement.children;
                    result = this.caption ? list[1].children[0].children : list[0].children[0].children;
                }
                return result;
            };
        /**
         * @param {?} id
         * @return {?}
         */
        TableViewComponent.prototype.headerById = /**
         * @param {?} id
         * @return {?}
         */
            function (id) {
                /** @type {?} */
                var h;
                for (var i in this.headers) {
                    if (this.headers[i].key === id) {
                        h = this.headers[i];
                        break;
                    }
                }
                return h;
            };
        /**
         * @return {?}
         */
        TableViewComponent.prototype.columnsCount = /**
         * @return {?}
         */
            function () {
                /** @type {?} */
                var count = 0;
                this.headers.map(function (item) {
                    if (item.present) {
                        count++;
                    }
                });
                if (this.action) {
                    count++;
                }
                return count;
            };
        /**
         * @param {?} item
         * @param {?} flag
         * @return {?}
         */
        TableViewComponent.prototype.hover = /**
         * @param {?} item
         * @param {?} flag
         * @return {?}
         */
            function (item, flag) {
                if (flag) {
                    item.hover = true;
                }
                else {
                    delete item.hover;
                }
            };
        /**
         * @param {?} header
         * @return {?}
         */
        TableViewComponent.prototype.toCssClass = /**
         * @param {?} header
         * @return {?}
         */
            function (header) {
                return header.key.replace(/\./g, '-');
            };
        /**
         * @param {?} event
         * @param {?} item
         * @return {?}
         */
        TableViewComponent.prototype.keydown = /**
         * @param {?} event
         * @param {?} item
         * @return {?}
         */
            function (event, item) {
                /** @type {?} */
                var code = event.which;
                if ((code === 13) || (code === 32)) {
                    item.click();
                }
            };
        /**
         * @param {?} item
         * @return {?}
         */
        TableViewComponent.prototype.offScreenMessage = /**
         * @param {?} item
         * @return {?}
         */
            function (item) {
                /** @type {?} */
                var message = this.action;
                if (this.actionKeys) {
                    this.actionKeys.map(function (key) { message = message.replace(key, item[key.substring(1, key.length - 1)]); });
                }
                return message;
            };
        /**
         * @param {?} item
         * @param {?} header
         * @return {?}
         */
        TableViewComponent.prototype.cellContent = /**
         * @param {?} item
         * @param {?} header
         * @return {?}
         */
            function (item, header) {
                /** @type {?} */
                var content = this.itemValue(item, header.key.split("."));
                return (content !== undefined && content != null && String(content).length) ? content : '&nbsp;';
            };
        /**
         * @param {?} item
         * @return {?}
         */
        TableViewComponent.prototype.rowDetailerContext = /**
         * @param {?} item
         * @return {?}
         */
            function (item) {
                return {
                    data: item,
                    tableInfo: this.tableInfo,
                    headers: this.rowDetailerHeaders(item)
                };
            };
        /**
         * @param {?} event
         * @param {?} header
         * @return {?}
         */
        TableViewComponent.prototype.changeFilter = /**
         * @param {?} event
         * @param {?} header
         * @return {?}
         */
            function (event, header) {
                var _this = this;
                /** @type {?} */
                var code = event.which;
                header.filter = event.target.value;
                if (this.filterwhiletyping || code === 13) {
                    if (this.filteringTimerId) {
                        clearTimeout(this.filteringTimerId);
                    }
                    this.filteringTimerId = setTimeout(function () {
                        _this.filterItems();
                        _this.initVisibleRows();
                        _this.filteringTimerId = undefined;
                    }, 123);
                }
            };
        /**
         * @param {?} event
         * @param {?} item
         * @return {?}
         */
        TableViewComponent.prototype.actionClick = /**
         * @param {?} event
         * @param {?} item
         * @return {?}
         */
            function (event, item) {
                event.stopPropagation();
                if (this.rowDetailer && (this.expandIf || this.expandable(item, false))) {
                    if (item.expanded) {
                        delete item.expanded;
                    }
                    else {
                        item.expanded = true;
                    }
                }
                else {
                    this.onaction.emit(item);
                }
                return false;
            };
        /**
         * @return {?}
         */
        TableViewComponent.prototype.print = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.printMode = true;
                setTimeout(function () {
                    /** @type {?} */
                    var content = _this.el.nativeElement.innerHTML;
                    _this.printMode = false;
                    /** @type {?} */
                    var popupWin = window.open('', '_blank', 'width=300,height=300');
                    popupWin.document.open();
                    popupWin.document.write('<html><body onload="window.print()">' + content + '</html>');
                    popupWin.document.close();
                }, 3);
            };
        /**
         * @param {?} value
         * @param {?} filterBy
         * @return {?}
         */
        TableViewComponent.prototype.shouldSkipItem = /**
         * @param {?} value
         * @param {?} filterBy
         * @return {?}
         */
            function (value, filterBy) {
                /** @type {?} */
                var result = false;
                if (value !== undefined && value !== null && String(value).length) {
                    /** @type {?} */
                    var v = String(value);
                    if (filterBy[0] === '<') {
                        result = filterBy.length > 1 && parseFloat(v) >= parseFloat(filterBy.substring(1));
                    }
                    else if (filterBy[0] === '>') {
                        result = filterBy.length > 1 && parseFloat(v) <= parseFloat(filterBy.substring(1));
                    }
                    else if (filterBy[0] === '!') {
                        result = filterBy.length > 1 && parseFloat(v) == parseFloat(filterBy.substring(1));
                    }
                    else if (filterBy[0] === '=') {
                        result = filterBy.length == 1 || parseFloat(v) !== parseFloat(filterBy.substring(1));
                    }
                    else if (filterBy[0] === '*' && filterBy[filterBy.length - 1] !== '*') {
                        /** @type {?} */
                        var f = filterBy.substring(1);
                        result = v.indexOf(f) !== v.length - f.length;
                    }
                    else if (filterBy[0] !== '*' && filterBy[filterBy.length - 1] === '*') {
                        /** @type {?} */
                        var f = filterBy.substring(0, filterBy.length - 1);
                        result = v.indexOf(f) !== 0;
                    }
                    else if (filterBy[0] === '*' && filterBy[filterBy.length - 1] === '*') {
                        result = filterBy.length > 1 && v.indexOf(filterBy.substring(1, filterBy.length - 1)) < 0;
                    }
                    else {
                        result = v.indexOf(filterBy) < 0;
                    }
                }
                return result;
            };
        /**
         * @return {?}
         */
        TableViewComponent.prototype.filterItems = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.filteredItems = this.items ? this.items.filter(function (item) {
                    /** @type {?} */
                    var keepItem = true;
                    for (var i = 0; i < _this.headers.length; i++) {
                        /** @type {?} */
                        var header = _this.headers[i];
                        if (header.filter && header.filter.length) {
                            /** @type {?} */
                            var v = _this.itemValue(item, header.key.split("."));
                            if (_this.shouldSkipItem(v, header.filter)) {
                                keepItem = false;
                                break;
                            }
                        }
                    }
                    return keepItem;
                }) : [];
                this.onfilter.emit(this.filteredItems);
            };
        /**
         * @param {?} event
         * @return {?}
         */
        TableViewComponent.prototype.onTableCellEdit = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                /** @type {?} */
                var id = event.id.split("-");
                /** @type {?} */
                var n = event.name;
                /** @type {?} */
                var v = event.value;
                /** @type {?} */
                var t = this.items[parseInt(id[1])];
                if (t) {
                    /** @type {?} */
                    var list = id[0].split(".");
                    /** @type {?} */
                    var subitem = t[list[0]];
                    for (var i = 1; i < (list.length - 1); i++) {
                        subitem = subitem[list[i]];
                    }
                    if (subitem && list.length > 1) {
                        subitem[list[list.length - 1]] = v;
                    }
                    this.onCellContentEdit.emit({ name: n, value: v, item: t });
                }
            };
        /**
         * @param {?} event
         * @return {?}
         */
        TableViewComponent.prototype.dragEnabled = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                return event.medium.dragable;
            };
        /**
         * @param {?} event
         * @return {?}
         */
        TableViewComponent.prototype.dropEnabled = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                return event.destination.medium.dragable;
            };
        /**
         * @param {?} event
         * @return {?}
         */
        TableViewComponent.prototype.onDragStart = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                //        this.dragging = true;
            };
        /**
         * @param {?} event
         * @return {?}
         */
        TableViewComponent.prototype.onDragEnd = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                //       this.dragging = false;
            };
        /**
         * @param {?} event
         * @return {?}
         */
        TableViewComponent.prototype.onDrop = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.swapColumns(event.source, event.destination);
            };
        TableViewComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'table-view',
                        template: "\r\n<table [class]=\"tableClass\"  #flexible>\r\n    <caption *ngIf=\"caption\" [textContent]=\"caption\"></caption>\r\n    <thead>\r\n        <tr>\r\n            <th scope=\"col\" *ngIf=\"enableIndexing && !printMode\" id=\"indexable\" class=\"indexable\"></th>\r\n            <th scope=\"col\" *ngFor=\"let header of headers\" #th\r\n                [dragEnabled]=\"dragEnabled.bind(this)\"\r\n                [dropEnabled]=\"dropEnabled.bind(this)\"\r\n                [medium]=\"header\"\r\n                (onDragStart)=\"onDragStart($event)\"\r\n                (onDragEnd)=\"onDragEnd($event)\"\r\n                (onDrop)=\"onDrop($event)\"\r\n                [id]=\"header.key\"\r\n                [attr.width]=\"header.width ? header.width : null\" \r\n                [style.min-width]=\"header.minwidth ? header.minwidth : ''\" \r\n                [attr.tabindex]=\"header.sortable ? 0 : -1\"\r\n                (keydown)=\"keydown($event, th)\" (click)=\"sort(header, icon)\">\r\n                <span *ngIf=\"!printMode && header.sortable\" class=\"off-screen\"  [textContent]=\"vocabulary.clickSort\"></span>\r\n                <span class=\"locker icon fa\" #locker\r\n                        *ngIf=\"!printMode && lockable && (headers.length > 1 || header.locked)\"\r\n                        tabindex=\"0\"\r\n                        title=\"lock/unlock this column\"\r\n                        (keydown)=\"keydown($event, locker)\" (click)=\"lock(header, $event)\"\r\n                        [class.fa-lock]=\"header.locked\"\r\n                        [class.fa-unlock]=\"!header.locked\"></span>\r\n                <span class=\"title\"\r\n                        [class.dragable]=\"header.dragable\"\r\n                        [textContent]=\"header.value\"></span>\r\n                <span class=\"icon fa\" [class.hidden]=\"printMode || !items || items.length === 0\" #icon\r\n                        [class.fa-sort]=\"header.sortable\"\r\n                        [class.fa-sort-asc]=\"header.assending\"\r\n                        [class.fa-sort-desc]=\"header.desending\"></span>\r\n            </th>\r\n            <th scope=\"col\" *ngIf=\"action && !printMode\" id=\"actionable\" class=\"actionable\"></th>\r\n        </tr>\r\n    </thead>\r\n    <tbody>\r\n        <tr *ngIf=\"!printMode && enableFiltering && items && items.length\">\r\n            <td scope=\"row\" *ngIf=\"enableIndexing && !printMode\" class=\"index filter\">\r\n                <input type=\"text\" disabled style=\"opacity:0\" />\r\n            </td>\r\n            <td scope=\"row\" \r\n                        *ngFor=\"let header of headers; let i=index\" \r\n                        [attr.data-label]=\"header.value\" \r\n                        class=\"filter\">\r\n                <span *ngIf=\"header.filter === undefined\">&nbsp;</span>\r\n                <input  *ngIf=\"header.filter !== undefined\"\r\n                        id=\"filter-{{i}}\"\r\n                        type=\"text\" \r\n                        (keyup)=\"changeFilter($event, header)\"\r\n                        [value]=\"header.filter ? header.filter : ''\" />\r\n                <label *ngIf=\"header.filter !== undefined\" for=\"filter-{{i}}\" ><span class=\"off-screen\" >Filter \"{{header.value}}\"</span><span class=\"fa fa-search\"></span></label>\r\n            </td>\r\n            <td scope=\"row\" *ngIf=\"action && !printMode\"></td>\r\n        </tr>\r\n       <ng-template ngFor let-item [ngForOf]=\"filteredItems\" let-i=\"index\">\r\n            <tr (click)=\"actionClick($event, item)\"\r\n                (mouseover)=\"hover(item, true)\"\r\n                (mouseout)=\"hover(item, false)\"\r\n                [class.pointer]=\"action\"\r\n                [class.hover]=\"item.hover\"\r\n                [class.expanded]=\"item.expanded\"\r\n                [class.odd]=\"i%2\">\r\n                <td scope=\"row\" class=\"index\" *ngIf=\"enableIndexing && !printMode\">\r\n                    <span [textContent]=\"i + pageInfo.from + 1\"></span></td>\r\n                <td scope=\"row\" \r\n                    *ngFor=\"let header of headers\" \r\n                    [class]=\"toCssClass(header)\"\r\n                    [attr.data-label]=\"header.value\" \r\n                    [intoName]=\"header.value\"\r\n                    [intoId]=\"header.key + '-' + i\"\r\n                    [into]=\"header.format\"\r\n                    [intoData]=\"item\"\r\n                    [rawContent]=\"cellContent(item, header)\"\r\n                    [onComponentChange]=\"onTableCellEdit.bind(this)\"></td>\r\n                <td scope=\"row\" *ngIf=\"action && !printMode\">\r\n                    <a class=\"actionable\"\r\n                        *ngIf=\"expandable(item, true)\"\r\n                        tabindex=\"0\"\r\n                        role=\"button\"\r\n                        style=\"cursor:pointer\"\r\n                        [class.expanded]=\"item.expanded\" #clicker\r\n                        (keydown)=\"keydown($event, clicker)\" (click)=\"actionClick($event, item)\">\r\n                        <span\r\n                            class=\"icon fa\"\r\n                            [class.fa-angle-right]=\"!rowDetailer\"\r\n                            [class.fa-minus-square-o]=\"rowDetailer && item.expanded\"\r\n                            [class.fa-plus-square-o]=\"rowDetailer && !item.expanded\"\r\n                            aria-hidden=\"true\"></span>\r\n                        <span class=\"off-screen\" [textContent]=\"offScreenMessage(item)\"></span>\r\n                    </a>\r\n                </td>\r\n            </tr>\r\n            <tr *ngIf=\"rowDetailer && item.expanded\" class=\"detail\" [class.odd]=\"i%2\">\r\n                <td scope=\"row\" class=\"index\" *ngIf=\"enableIndexing && !printMode\"></td>\r\n                <td [attr.colspan]=\"columnsCount()\">\r\n                    <ng-container [ngTemplateOutlet]=\"rowDetailer\" [ngTemplateOutletContext]=\"rowDetailerContext(item)\"></ng-container>\r\n                </td>\r\n            </tr>\r\n        </ng-template>\r\n    </tbody>\r\n</table>\r\n",
                        styles: [":host{display:inline-block!important;width:100%;position:relative;margin:0 auto;border-spacing:0;border-collapse:collapse}:host .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host table{margin:1rem auto;padding:0;width:100%;table-layout:fixed;max-width:99%;background-color:transparent;border-collapse:collapse}:host table caption{background-color:#c3e5e2;border-radius:2px;color:#1b1b1b;caption-side:top;font-size:14px;padding:5px 6px;margin-bottom:15px;text-align:left}:host table thead{border-top:1px solid #bbb;border-bottom:1px solid #bbb;background-color:#eee}:host table tr{border:0}:host table tr.expanded td{font-weight:700}:host table td{padding-left:3px;min-height:23px}:host table td.index span{display:block;height:23px}:host table td:first-child{padding-left:5px}:host table td ::ng-deep input-component .locked,:host table td ::ng-deep input-component input{width:99%}:host table td .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host table td.filter{padding:0;position:relative}:host table td.filter input{box-sizing:border-box;width:100%;margin:0}:host table td.filter .fa{position:absolute;top:4px;right:2px;color:#bad}:host table td ::ng-deep img{height:24px}:host table td.index{background-color:#eee;border-right:1px solid #bbb}:host table th{cursor:default;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none;height:24px;position:relative;white-space:nowrap;font-weight:400;text-transform:uppercase;font-size:14px;padding-top:6px;padding-bottom:6px;text-align:left}:host table th.drag-over{background-color:#9b9b9b}:host table th.drag-over .icon,:host table th.drag-over .title{color:#eee}:host table th:first-child{padding-left:5px}:host table th.ascending,:host table th.descending,:host table th.sortable{cursor:pointer;height:12px}:host table th.indexable{width:33px}:host table th.actionable{width:24px}:host table th .hidden{display:none}:host table th .title{color:#254a4d;display:inline-block;height:20px;white-space:nowrap}:host table th .dragable{cursor:move}:host table th .icon{width:22px;display:inline-block;height:20px;color:#254a4d}:host .fa.fa-angle-right{font-size:18px}table tr.expanded td{border-bottom:0}table tr.detail td{border-top:0;cursor:default}table tr.expanded td a.expanded{background-position:right 2px}table tbody tr.hover,table tbody tr:hover{background-color:#ffeed2}table tbody tr.detail.hover,table tbody tr.detail.hover td table thead tr,table tbody tr.detail:hover,table tbody tr.detail:hover td table thead tr{background-color:inherit}table tr td a.actionable{display:inline-table;height:32px;vertical-align:middle;width:25px;line-height:30px;color:#254a4d}table tbody tr.detail.hover td:last-child,table tbody tr.detail:hover td:last-child{border-right:0}table tbody tr.detail.hover td:first-child,table tbody tr.detail:hover td:first-child{border-left:0}table tr td{border-bottom:1px solid #b1b3b3;color:#254a5d;font-size:15px;text-transform:capitalize}table tbody tr.pointer{cursor:pointer}table.alert-danger{border:0}table.alert-danger caption{background-color:transparent;font-weight:700;margin-bottom:0}table.alert-danger td{border-bottom:0;display:block}table.alert-danger td:first-child{padding-left:0}table.alert-danger td:last-child{border-bottom:0}table.alert-danger td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase;width:20%}table.alert-danger td a span.icon{width:100%}table.alert-danger thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}table.alert-danger tr{border:2px solid #fff;display:block;margin-bottom:.625em;padding:5px;border-radius:5px}table.alert-danger tr th.actionable{width:inherit}table.alert-danger tr td{border-bottom:0}@media screen and (max-width:600px){table{border:0}table td{border-bottom:0;display:block;text-align:right}table td:first-child{padding-left:0}table td:last-child{border-bottom:0}table td.filter input{width:50%!important}table td.filter .fa{right:7px!important}table td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase}table td a span.icon{width:100%}table thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}table tr{border-bottom:3px solid #ddd;display:block;margin-bottom:.625em}table tr th.actionable{width:inherit}table tr td{border-bottom:0}table.alert-danger td:before{width:inherit}}"]
                    }] }
        ];
        /** @nocollapse */
        TableViewComponent.ctorParameters = function () {
            return [
                { type: core.ElementRef }
            ];
        };
        TableViewComponent.propDecorators = {
            vocabulary: [{ type: core.Input, args: ["vocabulary",] }],
            lockable: [{ type: core.Input, args: ["lockable",] }],
            caption: [{ type: core.Input, args: ["caption",] }],
            action: [{ type: core.Input, args: ["action",] }],
            pageInfo: [{ type: core.Input, args: ["pageInfo",] }],
            actionKeys: [{ type: core.Input, args: ["actionKeys",] }],
            tableClass: [{ type: core.Input, args: ["tableClass",] }],
            headers: [{ type: core.Input, args: ["headers",] }],
            items: [{ type: core.Input, args: ["items",] }],
            tableInfo: [{ type: core.Input, args: ["tableInfo",] }],
            enableIndexing: [{ type: core.Input, args: ["enableIndexing",] }],
            enableFiltering: [{ type: core.Input, args: ["enableFiltering",] }],
            rowDetailer: [{ type: core.Input, args: ["rowDetailer",] }],
            expandable: [{ type: core.Input, args: ["expandable",] }],
            expandIf: [{ type: core.Input, args: ["expandIf",] }],
            filterwhiletyping: [{ type: core.Input, args: ["filterwhiletyping",] }],
            rowDetailerHeaders: [{ type: core.Input, args: ["rowDetailerHeaders",] }],
            onaction: [{ type: core.Output, args: ['onaction',] }],
            onchange: [{ type: core.Output, args: ['onchange',] }],
            onfilter: [{ type: core.Output, args: ['onfilter',] }],
            onCellContentEdit: [{ type: core.Output, args: ['onCellContentEdit',] }],
            table: [{ type: core.ViewChild, args: ['flexible', { read: core.ViewContainerRef },] }]
        };
        return TableViewComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var LockTableComponent = (function () {
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
            this.onaction = new core.EventEmitter();
            this.onCellContentEdit = new core.EventEmitter();
            this.onconfigurationchange = new core.EventEmitter();
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
            { type: core.Component, args: [{
                        selector: 'lock-table',
                        template: "<div class=\"caption\">\n\t<table-configuration\n\t\t*ngIf=\"configurable\" \n\t\t[headers]=\"headers\" \n\t\t[title]=\"vocabulary.configureColumns\" \n\t\t[action]=\"vocabulary.configureTable\"\n\t\t[configAddon]=\"configAddon\"\n\t\t(onchange)=\"reconfigure($event)\"></table-configuration>\n\n\t<div *ngIf=\"caption\" [textContent]=\"caption\"></div>\n</div>\n<div class=\"smart-table-wrap\" (scroll)=\"scroll($event)\">\n\t<table-view #lockedTable\n\t\tclass=\"locked-table\"\n\t\tlockable=\"true\"\n\t\t[headers]=\"lockedHeaders\" \n\t\t[items]=\"filteredItems\" \n        [pageInfo]=\"pageInfo\"\n        [vocabulary]=\"vocabulary\"\n        [filterwhiletyping]=\"filterwhiletyping\"\n\t\t[enableFiltering]=\"enableFiltering\"\n\t\t[enableIndexing]=\"enableIndexing\"\n        \n\t\t(onchange)=\"onlock($event)\"\n\t\t(onDrop)=\"onDrop($event)\"\n\t\t(onCellContentEdit)=\"onCellEdit($event)\"\n\t\t(onfilter)=\"changeUnlockedTableFilteredItems($event)\"\n\t\t(onaction)=\"tableAction($event)\"></table-view>\n\n    <table-view #unlockedTable\n\t\tclass=\"unlocked-table\"\n\t\tlockable=\"true\"\n\t\t[headers]=\"unlockedHeaders\" \n\t\t[items]=\"filteredItems\" \n        [pageInfo]=\"pageInfo\"\n        [vocabulary]=\"vocabulary\"\n        [filterwhiletyping]=\"filterwhiletyping\"\n\t\t[enableFiltering]=\"enableFiltering\"\n\n\t\t(onDrop)=\"onDrop($event)\"\n\t\t(onchange)=\"onlock($event)\"\n\t\t(onCellContentEdit)=\"onCellEdit($event)\"\n\t\t(onfilter)=\"changeLockedTableFilteredItems($event)\"\n\t\t(onaction)=\"tableAction($event)\"></table-view>\n\t\n</div>\n<table-pagination #pager\n\t[info]=\"pageInfo\" \n\t[vocabulary]=\"vocabulary\" \n    (onchange)=\"onPaginationChange($event)\"></table-pagination>\n",
                        styles: [":host{width:100%;position:relative;margin:0 auto;display:table}:host .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}:host .caption{background-color:#c3e5e2;border-radius:2px;box-sizing:border-box;color:#1b1b1b;caption-side:top;font-size:14px;margin-bottom:15px;padding:5px 6px;text-align:left;width:100%}:host .caption table-configuration{display:inline-block;float:right;position:unset}:host .smart-table-wrap{border-spacing:0;border-collapse:collapse;border-right:1px solid #aaa;border-bottom:1px solid #aaa;box-sizing:border-box;width:100%;position:relative;overflow-x:auto}:host .smart-table-wrap .unlocked-table ::ng-deep table{max-width:100%;margin-bottom:0;margin-top:0}:host .smart-table-wrap .unlocked-table ::ng-deep table th td{white-space:nowrap}:host .smart-table-wrap .unlocked-table ::ng-deep table th .locker{cursor:pointer;color:#00925b;text-align:center}:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr{background-color:#fff}:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr.hover,:host .smart-table-wrap .unlocked-table ::ng-deep table tbody tr:hover{background-color:#ffeed2}:host .smart-table-wrap .unlocked-table ::ng-deep table img{height:14px}:host .smart-table-wrap .locked-table{position:absolute;margin:0 auto;display:inline-table;border-spacing:0;border-collapse:collapse;float:left;z-index:2;width:auto}:host .smart-table-wrap .locked-table ::ng-deep table{display:inline-block;border-right:1px solid #aaa;margin:0;width:auto}:host .smart-table-wrap .locked-table ::ng-deep table th td{white-space:nowrap}:host .smart-table-wrap .locked-table ::ng-deep table th .locker{cursor:pointer;color:#8b0224;text-align:center}:host .smart-table-wrap .locked-table ::ng-deep table tbody tr{background-color:#fff}:host .smart-table-wrap .locked-table ::ng-deep table tbody tr.hover,:host .smart-table-wrap .locked-table ::ng-deep table tbody tr:hover{background-color:#ffeed2}:host .smart-table-wrap .locked-table ::ng-deep table img{height:14px}@media screen and (max-width:600px){.smart-table-wrap{border:0!important;position:unset;overflow-x:unset}.smart-table-wrap .unlocked-table{margin-left:0!important}.smart-table-wrap .unlocked-table ::ng-deep table td,.smart-table-wrap .unlocked-table ::ng-deep table th{white-space:unset}.smart-table-wrap .unlocked-table ::ng-deep table img{height:30px}.smart-table-wrap .locked-table{position:unset!important;margin:0!important;display:table;left:0!important}.smart-table-wrap .locked-table ::ng-deep table{display:table!important;margin:0!important;width:100%!important}.smart-table-wrap .locked-table ::ng-deep table td,.smart-table-wrap .locked-table ::ng-deep table th{white-space:unset}.smart-table-wrap .locked-table ::ng-deep table img{height:30px}}"]
                    }] }
        ];
        /** @nocollapse */
        LockTableComponent.ctorParameters = function () {
            return [
                { type: TableHeadersGenerator },
                { type: core.Renderer }
            ];
        };
        LockTableComponent.propDecorators = {
            vocabulary: [{ type: core.Input, args: ["vocabulary",] }],
            persistenceId: [{ type: core.Input, args: ["persistenceId",] }],
            persistenceKey: [{ type: core.Input, args: ["persistenceKey",] }],
            caption: [{ type: core.Input, args: ["caption",] }],
            action: [{ type: core.Input, args: ["action",] }],
            actionKeys: [{ type: core.Input, args: ["actionKeys",] }],
            tableClass: [{ type: core.Input, args: ["tableClass",] }],
            headers: [{ type: core.Input, args: ["headers",] }],
            items: [{ type: core.Input, args: ["items",] }],
            pageInfo: [{ type: core.Input, args: ["pageInfo",] }],
            tableInfo: [{ type: core.Input, args: ["tableInfo",] }],
            configurable: [{ type: core.Input, args: ["configurable",] }],
            configAddon: [{ type: core.Input, args: ["configAddon",] }],
            enableFiltering: [{ type: core.Input, args: ["enableFiltering",] }],
            enableIndexing: [{ type: core.Input, args: ["enableIndexing",] }],
            filterwhiletyping: [{ type: core.Input, args: ["filterwhiletyping",] }],
            onaction: [{ type: core.Output, args: ['onaction',] }],
            onCellContentEdit: [{ type: core.Output, args: ['onCellContentEdit',] }],
            onconfigurationchange: [{ type: core.Output, args: ['onconfigurationchange',] }],
            lockedTable: [{ type: core.ViewChild, args: ['lockedTable',] }],
            unlockedTable: [{ type: core.ViewChild, args: ['unlockedTable',] }]
        };
        return LockTableComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var TableSortDirective = (function () {
        function TableSortDirective(renderer, el) {
            this.renderer = renderer;
            this.el = el;
            this.dropEffect = "move";
            this.tableSort = function (path) { };
        }
        /**
         * @return {?}
         */
        TableSortDirective.prototype.headerColumnElements = /**
         * @return {?}
         */
            function () {
                return this.el.nativeElement.parentNode.children;
            };
        /**
         * @param {?} id
         * @return {?}
         */
        TableSortDirective.prototype.findColumnWithID = /**
         * @param {?} id
         * @return {?}
         */
            function (id) {
                /** @type {?} */
                var list = this.headerColumnElements();
                /** @type {?} */
                var column = null;
                for (var i = 0; i < list.length; i++) {
                    if (list[i].getAttribute("id") === id) {
                        column = list[i];
                        break;
                    }
                }
                return column;
            };
        /**
         * @param {?} icon
         * @return {?}
         */
        TableSortDirective.prototype.sort = /**
         * @param {?} icon
         * @return {?}
         */
            function (icon) {
                if (this.medium.sortable) {
                    for (var i = 0; i < this.headers.length; i++) {
                        /** @type {?} */
                        var h = this.headers[i];
                        if (h.key !== this.medium.key) {
                            /** @type {?} */
                            var item = this.findColumnWithID(h.key);
                            if (item) {
                                this.renderer.setElementClass(item, "ascending", false);
                                this.renderer.setElementClass(item, "descending", false);
                                this.renderer.setElementClass(item, "sortable", true);
                            }
                            h.descending = false;
                            h.ascending = false;
                        }
                    }
                    this.renderer.setElementClass(icon, "fa-sort", false);
                    if (this.medium.ascending || (!this.medium.ascending && !this.medium.descending)) {
                        this.medium.descending = true;
                        this.medium.ascending = false;
                        this.renderer.setElementClass(icon, "fa-sort-asc", false);
                        this.renderer.setElementClass(icon, "fa-sort-desc", true);
                    }
                    else {
                        this.medium.descending = false;
                        this.medium.ascending = true;
                        this.renderer.setElementClass(icon, "fa-sort-desc", false);
                        this.renderer.setElementClass(icon, "fa-sort-asc", true);
                    }
                    this.tableSort(this.medium.key.split("."));
                }
            };
        TableSortDirective.decorators = [
            { type: core.Directive, args: [{
                        selector: '[tableSort]'
                    },] }
        ];
        /** @nocollapse */
        TableSortDirective.ctorParameters = function () {
            return [
                { type: core.Renderer },
                { type: core.ElementRef }
            ];
        };
        TableSortDirective.propDecorators = {
            medium: [{ type: core.Input, args: ['medium',] }],
            headers: [{ type: core.Input, args: ['headers',] }],
            dropEffect: [{ type: core.Input }],
            tableSort: [{ type: core.Input, args: ["tableSort",] }]
        };
        return TableSortDirective;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var FlexibleTableModule = (function () {
        function FlexibleTableModule() {
        }
        FlexibleTableModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [
                            common.CommonModule,
                            dragEnabled.DragDropModule,
                            intoPipes.IntoPipeModule
                        ],
                        declarations: [
                            FlexibleTableComponent,
                            LockTableComponent,
                            ConfigurationComponent,
                            PaginationComponent,
                            TableViewComponent,
                            TableSortDirective
                        ],
                        exports: [
                            FlexibleTableComponent,
                            LockTableComponent
                        ],
                        entryComponents: [],
                        providers: [
                            TableHeadersGenerator
                        ],
                        schemas: [core.CUSTOM_ELEMENTS_SCHEMA]
                    },] }
        ];
        return FlexibleTableModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.FlexibleTableComponent = FlexibleTableComponent;
    exports.FlexibleTableModule = FlexibleTableModule;
    exports.ɵc = ConfigurationComponent;
    exports.ɵd = PaginationComponent;
    exports.ɵa = TableHeadersGenerator;
    exports.ɵe = TableViewComponent;
    exports.ɵf = TableSortDirective;
    exports.ɵb = LockTableComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxleGlibGUtdGFibGUudW1kLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9mbGV4aWJsZS10YWJsZS9zcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2NvbXBvbmVudHMvdGFibGUtaGVhZGVycy1nZW5lcmF0b3IudHMiLCJuZzovL2ZsZXhpYmxlLXRhYmxlL3NyYy9hcHAvZmxleGlibGUtdGFibGUvZmxleGlibGUudGFibGUuY29tcG9uZW50LnRzIiwibmc6Ly9mbGV4aWJsZS10YWJsZS9zcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2NvbXBvbmVudHMvcGFnaW5hdGlvbi5jb21wb25lbnQudHMiLCJuZzovL2ZsZXhpYmxlLXRhYmxlL3NyYy9hcHAvZmxleGlibGUtdGFibGUvY29tcG9uZW50cy9jb25maWd1cmF0aW9uLmNvbXBvbmVudC50cyIsIm5nOi8vZmxleGlibGUtdGFibGUvc3JjL2FwcC9mbGV4aWJsZS10YWJsZS9jb21wb25lbnRzL3RhYmxlLmNvbXBvbmVudC50cyIsIm5nOi8vZmxleGlibGUtdGFibGUvc3JjL2FwcC9mbGV4aWJsZS10YWJsZS9sb2NrLnRhYmxlLmNvbXBvbmVudC50cyIsIm5nOi8vZmxleGlibGUtdGFibGUvc3JjL2FwcC9mbGV4aWJsZS10YWJsZS9kaXJlY3RpdmVzL3RhYmxlLXNvcnQuZGlyZWN0aXZlLnRzIiwibmc6Ly9mbGV4aWJsZS10YWJsZS9zcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2ZsZXhpYmxlLXRhYmxlLW1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBUaGlzIG9iamVjdCB3aWxsIHRyYXZlcnNlIHRocm91Z2ggYSBnaXZlbiBqc29uIG9iamVjdCBhbmQgZmluZHMgYWxsIHRoZSBhdHRyaWJ1dGVzIG9mIFxyXG4gKiB0aGUgb2JqZWN0IGFuZCBpdHMgcmVsYXRlZCBhc3NvY2lhdGlvbnMgd2l0aGluIHRoZSBqc29uLiBUaGUgcmVzdWx0aW5nIHN0cnVjdHVyZSB3b3VsZCBiZSBcclxuICogbmFtZSBvZiBhdHRyaWJ1dGVzIGFuZCBhIHBhdGh3YXkgdG8gcmVhY2ggdGhlIGF0dHJpYnV0ZSBkZWVwIGluIG9iamVjdCBoZWlyYXJjaHkuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBWaXN1YWxpemF0aW9uUG9pbnQge1xyXG4gIGtleTogc3RyaW5nLFxyXG4gIHZhbHVlOiBzdHJpbmdcclxufVxyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVGFibGVIZWFkZXJzR2VuZXJhdG9yIHtcclxuICBwcml2YXRlIGhlYWRlcnMgPSBbXTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgfVxyXG5cclxuICBnZW5lcmF0ZUhlYWRlcnNGb3Iocm9vdDoge30sIHBhdGg6IHN0cmluZywgbWF4VmlzaWJsZTogbnVtYmVyLCBmaWx0ZXJpbmdFbmFibGVkOiBib29sZWFuKSB7XHJcblxyXG4gICAgaWYgKHJvb3QgIT09IG51bGwpIHtcclxuICAgICAgT2JqZWN0LmtleXMocm9vdCkubWFwKCAoa2V5KSA9PiB7XHJcbiAgICAgICAgY29uc3QgaW5uZXJQYXRoID0gKHBhdGgubGVuZ3RoID8gKHBhdGggKyBcIi5cIiArIGtleSkgOiBrZXkpO1xyXG4gIFxyXG4gICAgICAgIGlmICh0eXBlb2Ygcm9vdFtrZXldID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiByb290W2tleV0gPT09IFwibnVtYmVyXCIgfHwgdHlwZW9mIHJvb3Rba2V5XSA9PT0gXCJib29sZWFuXCIpIHtcclxuICAgICAgICAgIGNvbnN0IGhlYWRlcjogYW55ID0ge1xyXG4gICAgICAgICAgICBrZXk6IGlubmVyUGF0aCxcclxuICAgICAgICAgICAgdmFsdWU6IHRoaXMubWFrZVdvcmRzKGlubmVyUGF0aCksXHJcbiAgICAgICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBkcmFnYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgcHJlc2VudDogKHBhdGgubGVuZ3RoID09PSAwICYmIHRoaXMuaGVhZGVycy5sZW5ndGggPCBtYXhWaXNpYmxlKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGZpbHRlcmluZ0VuYWJsZWQpIHtcclxuICAgICAgICAgICAgaGVhZGVyLmZpbHRlciA9IFwiXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmhlYWRlcnMucHVzaChoZWFkZXIpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocm9vdFtrZXldIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgIGNvbnN0IG5vZGUgPSByb290W2tleV07XHJcbiAgICAgICAgICBpZiAobm9kZS5sZW5ndGggJiYgIShub2RlWzBdIGluc3RhbmNlb2YgQXJyYXkpICYmICh0eXBlb2Ygbm9kZVswXSAhPT0gXCJzdHJpbmdcIikpIHtcclxuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUhlYWRlcnNGb3Iobm9kZVswXSwgaW5uZXJQYXRoLCBtYXhWaXNpYmxlLCBmaWx0ZXJpbmdFbmFibGVkKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGVhZGVycy5wdXNoKHtcclxuICAgICAgICAgICAgICBrZXk6IGlubmVyUGF0aCxcclxuICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5tYWtlV29yZHMoaW5uZXJQYXRoKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmdlbmVyYXRlSGVhZGVyc0Zvcihyb290W2tleV0sIGlubmVyUGF0aCwgbWF4VmlzaWJsZSwgZmlsdGVyaW5nRW5hYmxlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmhlYWRlcnM7XHJcbiAgfVxyXG5cclxuICByZXRyZWl2ZUhlYWRlcnMoa2V5LCB0cmFja2luZ2tleSkge1xyXG4gICAgbGV0IHJlc3VsdDogYW55O1xyXG4gICAgdHJ5IHtcclxuICAgICAgcmVzdWx0ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odHJhY2tpbmdrZXkpO1xyXG5cclxuICAgICAgaWYgKCFyZXN1bHQgfHwgcmVzdWx0ICE9IGtleSkge1xyXG4gICAgICAgIHJlc3VsdCA9IHVuZGVmaW5lZDsgLy8gd2UgaGF2ZSBhIG5ld2VyIHZlcnNpb24gYW5kIGl0IHdpbGwgb3ZlcnJpZGUgc2F2ZWQgZGF0YS5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXN1bHQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xyXG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdCA/IEpTT04ucGFyc2UocmVzdWx0KSA6IHJlc3VsdDtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHBlcnNpc3RIZWFkZXJzKGtleSwgdHJhY2tpbmdrZXksIGhlYWRlcnMpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRyYWNraW5na2V5KTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odHJhY2tpbmdrZXksIGtleSk7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoaGVhZGVycykpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBtYWtlV29yZHMobmFtZSkge1xyXG4gICAgcmV0dXJuIG5hbWVcclxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcLi9nLCcgfiAnKVxyXG4gICAgICAgICAgICAucmVwbGFjZSgvKFtBLVpdKS9nLCAnICQxJylcclxuICAgICAgICAgICAgLnJlcGxhY2UoLy0vZyxcIiBcIilcclxuICAgICAgICAgICAgLnJlcGxhY2UoL18vZyxcIiBcIilcclxuICAgICAgICAgICAgLnJlcGxhY2UoL14uLywgKHN0cikgPT4gc3RyLnRvVXBwZXJDYXNlKCkpO1xyXG4gIH1cclxufVxyXG4iLCIvKlxyXG4qIFByb3ZpZGVzIHJlbmRlcmluZyBvZiBhIHRhYmxlIHdoaWNoIGlzIHVzaW5nIHRoZSBnaXZlbiBGbGV4aWJsZVRhYmxlSGVhZGVyIHNldCBpblxyXG4qIG9yZGVyIHRvIHRhYnVsYXRlIHRoZSBnaXZlbiBkYXRhLiBBcyBwZXIgZGVmaW5pdGlvbiBvZiBlYXJjaCBoZWFkZXIgY29tcG9uZW50LFxyXG4qIGEgY29sdW1uIGNvdWxkIGJlIGhpZGRlbiwgc29ydGFibGUsIG9yIGRyYWdnYWJsZS4gRWFjaCB0YWJsZSByb3cgY2FuIGV4cGFuZC9jb2xsYXBzZVxyXG4qIG9yIHJlc3BvbmQgdG8gYSBjbGljayBhY3Rpb24uXHJcbiovXHJcbmltcG9ydCB7XHJcbiAgICBDb21wb25lbnQsXHJcblx0SW5wdXQsXHJcblx0T3V0cHV0LFxyXG5cdFZpZXdDaGlsZCxcclxuXHRWaWV3Q29udGFpbmVyUmVmLFxyXG5cdE9uSW5pdCxcclxuXHRFdmVudEVtaXR0ZXJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IERyb3BFdmVudCwgRHJhZ0V2ZW50IH0gZnJvbSAnZHJhZy1lbmFibGVkJztcclxuaW1wb3J0IHsgVGFibGVIZWFkZXJzR2VuZXJhdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlLWhlYWRlcnMtZ2VuZXJhdG9yJztcclxuaW1wb3J0IHsgVGFibGVWaWV3Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlLmNvbXBvbmVudCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuXHRzZWxlY3RvcjogJ2ZsZXhpYmxlLXRhYmxlJyxcclxuXHR0ZW1wbGF0ZVVybDogJy4vZmxleGlibGUudGFibGUuY29tcG9uZW50Lmh0bWwnLFxyXG5cdHN0eWxlVXJsczogWycuL2ZsZXhpYmxlLnRhYmxlLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIEZsZXhpYmxlVGFibGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuXHRzdWJIZWFkZXJzOmFueTtcclxuXHJcbiAgICBASW5wdXQoXCJ2b2NhYnVsYXJ5XCIpXHJcbiAgICBwdWJsaWMgdm9jYWJ1bGFyeSA9IHtcclxuXHRcdHByaW50VGFibGU6IFwiUHJpbnQgVGFibGVcIixcclxuXHRcdGNvbmZpZ3VyZVRhYmxlOiBcIkNvbmZpZ3VyZSBUYWJsZVwiLFxyXG5cdFx0Y29uZmlndXJlQ29sdW1uczogXCJDb25maWd1cmUgQ29sdW1uc1wiLFxyXG5cdFx0Y2xpY2tTb3J0OiBcIkNsaWNrIHRvIFNvcnRcIixcclxuXHRcdHNldFNpemU6IFwiU2V0IFNpemVcIixcclxuXHRcdGZpcnN0UGFnZTogXCJGaXJzdFwiLFxyXG5cdFx0bGFzdFBhZ2U6IFwiTGFzdFwiLFxyXG5cdFx0cHJldmlvdXNQYWdlOiBcIlByZXZpb3VzXCJcclxuXHR9O1xyXG5cdFxyXG4gICAgQElucHV0KFwicGVyc2lzdGVuY2VJZFwiKVxyXG4gICAgcHVibGljIHBlcnNpc3RlbmNlSWQ6IHN0cmluZztcclxuXHJcblx0QElucHV0KFwicGVyc2lzdGVuY2VLZXlcIilcclxuICAgIHB1YmxpYyBwZXJzaXN0ZW5jZUtleTogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dChcImNhcHRpb25cIilcclxuICAgIHB1YmxpYyBjYXB0aW9uOiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KFwiYWN0aW9uXCIpXHJcbiAgICBwdWJsaWMgYWN0aW9uOiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KFwiYWN0aW9uS2V5c1wiKVxyXG4gICAgcHVibGljIGFjdGlvbktleXM7XHJcblxyXG4gICAgQElucHV0KFwidGFibGVDbGFzc1wiKVxyXG4gICAgcHVibGljIHRhYmxlQ2xhc3MgPSAnZGVmYXVsdC1mbGV4aWJsZS10YWJsZSc7XHJcblxyXG5cdEBJbnB1dChcImhlYWRlcnNcIilcclxuXHRwdWJsaWMgaGVhZGVyczogYW55W107XHJcblxyXG5cdEBJbnB1dChcIml0ZW1zXCIpXHJcblx0cHVibGljIGl0ZW1zOiBhbnlbXTtcclxuXHJcblx0QElucHV0KFwicGFnZUluZm9cIilcclxuXHRwdWJsaWMgcGFnZUluZm86IGFueTtcclxuXHJcblx0QElucHV0KFwidGFibGVJbmZvXCIpXHJcblx0cHVibGljIHRhYmxlSW5mbzogYW55O1xyXG5cclxuICAgIEBJbnB1dChcImNvbmZpZ3VyYWJsZVwiKVxyXG4gICAgcHVibGljIGNvbmZpZ3VyYWJsZTogYm9vbGVhbjtcclxuXHJcblx0QElucHV0KFwiY29uZmlnQWRkb25cIilcclxuXHRwdWJsaWMgY29uZmlnQWRkb246IGFueTtcclxuXHJcblx0QElucHV0KFwiZW5hYmxlSW5kZXhpbmdcIilcclxuICAgIHB1YmxpYyBlbmFibGVJbmRleGluZzogYm9vbGVhbjtcclxuXHJcbiAgICBASW5wdXQoXCJlbmFibGVGaWx0ZXJpbmdcIilcclxuICAgIHB1YmxpYyBlbmFibGVGaWx0ZXJpbmc6IGJvb2xlYW47XHJcblxyXG4gICAgQElucHV0KFwicm93RGV0YWlsZXJcIilcclxuICAgIHB1YmxpYyByb3dEZXRhaWxlcjogYW55O1xyXG5cclxuICAgIEBJbnB1dChcImV4cGFuZGFibGVcIilcclxuICAgIHB1YmxpYyBleHBhbmRhYmxlOiBhbnk7XHJcblxyXG4gICAgQElucHV0KFwiZXhwYW5kSWZcIilcclxuICAgIHB1YmxpYyBleHBhbmRJZjogYm9vbGVhbjtcclxuXHJcbiAgICBASW5wdXQoXCJmaWx0ZXJ3aGlsZXR5cGluZ1wiKVxyXG4gICAgcHVibGljIGZpbHRlcndoaWxldHlwaW5nOiBib29sZWFuO1xyXG5cclxuICAgIEBJbnB1dChcInJvd0RldGFpbGVySGVhZGVyc1wiKVxyXG4gICAgcHVibGljIHJvd0RldGFpbGVySGVhZGVyczogYW55O1xyXG5cclxuXHRAT3V0cHV0KCdvbmFjdGlvbicpXHJcblx0cHJpdmF0ZSBvbmFjdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0QE91dHB1dCgnb25DZWxsQ29udGVudEVkaXQnKVxyXG5cdHByaXZhdGUgb25DZWxsQ29udGVudEVkaXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBPdXRwdXQoJ29uY29uZmlndXJhdGlvbmNoYW5nZScpXHJcblx0cHJpdmF0ZSBvbmNvbmZpZ3VyYXRpb25jaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBWaWV3Q2hpbGQoJ3ZpZXdUYWJsZScpXHJcblx0dmlld1RhYmxlOiBUYWJsZVZpZXdDb21wb25lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBnZW5lcmF0b3I6IFRhYmxlSGVhZGVyc0dlbmVyYXRvcikge31cclxuXHJcblx0bmdPbkluaXQoKSB7XHJcblx0XHRpZiAodGhpcy5wZXJzaXN0ZW5jZUtleSkge1xyXG5cdFx0XHRjb25zdCBoZWFkZXJzOmFueSA9IHRoaXMuZ2VuZXJhdG9yLnJldHJlaXZlSGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQpO1xyXG5cclxuXHRcdFx0aWYgKGhlYWRlcnMpIHtcclxuXHRcdFx0XHR0aGlzLmhlYWRlcnMgPSBoZWFkZXJzO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAoIXRoaXMuaGVhZGVycyB8fCB0aGlzLmhlYWRlcnMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdHRoaXMuaGVhZGVycyA9IHRoaXMuZ2VuZXJhdG9yLmdlbmVyYXRlSGVhZGVyc0Zvcih0aGlzLml0ZW1zWzBdLFwiXCIsIDUsIHRoaXMuZW5hYmxlRmlsdGVyaW5nKTtcclxuXHRcdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcclxuXHRcdFx0XHR0aGlzLmdlbmVyYXRvci5wZXJzaXN0SGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQsIHRoaXMuaGVhZGVycyk7XHJcblx0XHRcdH1cclxuICAgICAgICB9XHJcblx0XHRpZiAoIXRoaXMucm93RGV0YWlsZXIgJiYgdGhpcy5leHBhbmRhYmxlKSB7XHJcblx0XHRcdHRoaXMucm93RGV0YWlsZXIgPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdFx0cmV0dXJuIHtkYXRhOiBpdGVtLCBoZWFkZXJzOiBbXX07XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5wYWdlSW5mbykge1xyXG5cdFx0XHRpZiAoIXRoaXMucGFnZUluZm8udG8pIHtcclxuXHRcdFx0XHR0aGlzLnBhZ2VJbmZvLnRvID0gdGhpcy5wYWdlSW5mby5wYWdlU2l6ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLnBhZ2VJbmZvLmNvbnRlbnRTaXplID0gdGhpcy5pdGVtcy5sZW5ndGg7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnBhZ2VJbmZvID0ge1xyXG4gICAgICAgICAgICAgICAgY29udGVudFNpemU6IDEwMDAwMCxcclxuICAgICAgICAgICAgICAgIHBhZ2VTaXplOiAxMDAwMDAsXHJcbiAgICAgICAgICAgICAgICBwYWdlczogMSxcclxuICAgICAgICAgICAgICAgIGZyb206IDAsXHJcbiAgICAgICAgICAgICAgICB0bzogMTAwMDAwLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudFBhZ2U6IDEsXHJcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogXCIwXCJcclxuICAgICAgICAgICAgfTtcclxuXHRcdH1cclxuXHRcdHRoaXMudXBkYXRlTGltaXRzKCk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGVMaW1pdHMoKSB7XHJcblx0XHR0aGlzLnN1YkhlYWRlcnMgPSB0aGlzLmhlYWRlcnMuZmlsdGVyKCAoaGVhZGVyKSA9PiBoZWFkZXIucHJlc2VudCA9PT0gdHJ1ZSk7XHJcblx0fVxyXG5cclxuXHRyZWNvbmZpZ3VyZShldmVudCkge1xyXG5cdFx0dGhpcy5oZWFkZXJzID0gZXZlbnQ7XHJcblx0XHR0aGlzLnVwZGF0ZUxpbWl0cygpO1xyXG5cdFx0dGhpcy5vbmNvbmZpZ3VyYXRpb25jaGFuZ2UuZW1pdChldmVudCk7XHJcblxyXG5cdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcclxuXHRcdFx0dGhpcy5nZW5lcmF0b3IucGVyc2lzdEhlYWRlcnModGhpcy5wZXJzaXN0ZW5jZUtleSwgdGhpcy5wZXJzaXN0ZW5jZUlkLCB0aGlzLmhlYWRlcnMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0b25QYWdpbmF0aW9uQ2hhbmdlKGV2ZW50KSB7XHJcblx0XHR0aGlzLnBhZ2VJbmZvID0gZXZlbnQ7XHJcblx0XHR0aGlzLnZpZXdUYWJsZS5ldmFsdWF0ZVJvd3MoKTtcclxuXHR9XHJcblxyXG5cdHRhYmxlQWN0aW9uKGV2ZW50KSB7XHJcblx0XHR0aGlzLm9uYWN0aW9uLmVtaXQoZXZlbnQpXHJcblx0fVxyXG5cclxuXHRvbkRyb3AoZXZlbnQ6RHJvcEV2ZW50KXtcclxuXHJcblx0fVxyXG5cdG9uQ2VsbEVkaXQoZXZlbnQpe1xyXG5cdFx0dGhpcy5vbkNlbGxDb250ZW50RWRpdC5lbWl0KGV2ZW50KTtcclxuXHR9XHJcbn1cclxuIiwiLypcclxuKiBQcm92aWRlcyBwYWdpbmF0aW9uIG9mIGEgZGF0YSBzZXQgaW4gYSB0YWJsZS5cclxuKi9cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFBhZ2luYXRpb25JbmZvIHtcclxuXHRjb250ZW50U2l6ZTogbnVtYmVyLFxyXG5cdHBhZ2VTaXplOiBudW1iZXIsXHJcbiAgICBtYXhXaWR0aD86IHN0cmluZyxcclxuXHRwYWdlcz86IG51bWJlcixcclxuXHRmcm9tPzogbnVtYmVyLFxyXG5cdHRvPzogbnVtYmVyLFxyXG5cdGN1cnJlbnRQYWdlPzogbnVtYmVyLFxyXG4gICAgcmVzZXRTaXplPzogYm9vbGVhblxyXG59XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAndGFibGUtcGFnaW5hdGlvbicsXHJcblx0dGVtcGxhdGVVcmw6ICcuL3BhZ2luYXRpb24uY29tcG9uZW50Lmh0bWwnLFxyXG5cdHN0eWxlVXJsczogWycuL3BhZ2luYXRpb24uY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgUGFnaW5hdGlvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gICAgQElucHV0KFwidm9jYWJ1bGFyeVwiKVxyXG4gICAgcHVibGljIHZvY2FidWxhcnkgPSB7c2V0U2l6ZTogXCJcIiwgZmlyc3RQYWdlOiBcIlwiLCBuZXh0UGFnZTogXCJcIiwgbGFzdFBhZ2U6IFwiXCIsIHByZXZpb3VzUGFnZTogXCJcIn07XHJcblxyXG4gICAgQElucHV0KFwiaW5mb1wiKVxyXG4gICAgaW5mbzogUGFnaW5hdGlvbkluZm8gPSB7IGNvbnRlbnRTaXplOiAwLCBwYWdlU2l6ZTogMCwgbWF4V2lkdGg6IFwiMFwiIH07XHJcblxyXG5cdEBPdXRwdXQoJ29uY2hhbmdlJylcclxuICAgIG9uY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAgIEBPdXRwdXQoJ29ucmVhZHknKVxyXG4gICAgb25yZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0bmdPbkluaXQoKSB7XHJcblx0XHRpZiAoIXRoaXMuaW5mbykge1xyXG5cdFx0XHR0aGlzLmluZm8gPSB7IFxyXG4gICAgICAgICAgICAgICAgY29udGVudFNpemU6IDEwMDAsIFxyXG4gICAgICAgICAgICAgICAgcGFnZVNpemU6IDEwMDAsIFxyXG4gICAgICAgICAgICAgICAgcGFnZXM6IDEsIFxyXG4gICAgICAgICAgICAgICAgZnJvbTogMCwgXHJcbiAgICAgICAgICAgICAgICB0bzogMTAwMCwgXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFnZTogMSwgXHJcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogXCIwXCIgXHJcbiAgICAgICAgICAgIH07XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5pbmZvLmNvbnRlbnRTaXplICYmIHRoaXMuaW5mby5wYWdlU2l6ZSkge1xyXG5cdFx0XHR0aGlzLmluZm8ucGFnZXMgPSBNYXRoLmNlaWwodGhpcy5pbmZvLmNvbnRlbnRTaXplIC8gdGhpcy5pbmZvLnBhZ2VTaXplKTtcclxuXHRcdFx0dGhpcy5pbmZvLmZyb20gPSAwO1xyXG5cdFx0XHR0aGlzLmluZm8udG8gPSB0aGlzLmluZm8ucGFnZVNpemUgLSAxO1xyXG5cdFx0XHR0aGlzLmluZm8uY3VycmVudFBhZ2UgPSAxO1xyXG5cdFx0ICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5yZWFkeSgpLCA2Nik7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFdpZHRoKHdpZHRoOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmluZm8ubWF4V2lkdGggPSB3aWR0aCArIFwicHhcIjtcclxuICAgIH1cclxuXHJcbiAgICByZWFkeSgpIHtcclxuICAgICAgICB0aGlzLm9ucmVhZHkuZW1pdCh0aGlzKTtcclxuICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5pbmZvKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RGaXJzdCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbmZvLmN1cnJlbnRQYWdlID4gMSkge1xyXG5cdFx0ICAgIHRoaXMuaW5mby5mcm9tID0gMDtcclxuXHRcdCAgICB0aGlzLmluZm8udG8gPSB0aGlzLmluZm8uZnJvbSArIHRoaXMuaW5mby5wYWdlU2l6ZSAtIDE7XHJcblx0XHQgICAgdGhpcy5pbmZvLmN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaW5mbyk7XHJcbiAgICAgICAgfVxyXG4gICB9XHJcblxyXG4gICBzZWxlY3ROZXh0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmluZm8uY3VycmVudFBhZ2UgPCB0aGlzLmluZm8ucGFnZXMpIHtcclxuIFx0XHR0aGlzLmluZm8uZnJvbSA9IHRoaXMuaW5mby50byArIDE7XHJcblx0XHR0aGlzLmluZm8udG8gPSB0aGlzLmluZm8uZnJvbSArIHRoaXMuaW5mby5wYWdlU2l6ZSAtIDE7XHJcblx0XHR0aGlzLmluZm8uY3VycmVudFBhZ2UrKztcclxuICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5pbmZvKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0UHJldigpIHtcclxuICAgICAgICBpZiAodGhpcy5pbmZvLmN1cnJlbnRQYWdlID4gMSkge1xyXG4gXHRcdCAgICB0aGlzLmluZm8uZnJvbSAtPSB0aGlzLmluZm8ucGFnZVNpemU7XHJcblx0XHQgICAgdGhpcy5pbmZvLnRvID0gdGhpcy5pbmZvLmZyb20gKyB0aGlzLmluZm8ucGFnZVNpemUgLSAxO1xyXG5cdFx0ICAgIHRoaXMuaW5mby5jdXJyZW50UGFnZS0tO1xyXG4gICAgICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5pbmZvKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0TGFzdCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbmZvLmN1cnJlbnRQYWdlIDwgdGhpcy5pbmZvLnBhZ2VzKSB7XHJcblx0XHQgICAgdGhpcy5pbmZvLmZyb20gPSB0aGlzLmluZm8ucGFnZVNpemUgKiAodGhpcy5pbmZvLnBhZ2VzIC0gMSk7XHJcblx0XHQgICAgdGhpcy5pbmZvLnRvID0gdGhpcy5pbmZvLmZyb20gKyB0aGlzLmluZm8ucGFnZVNpemUgLSAxO1xyXG5cdFx0ICAgIHRoaXMuaW5mby5jdXJyZW50UGFnZSA9IHRoaXMuaW5mby5wYWdlcztcclxuICAgICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaW5mbyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZUN1cnJlbnQocmFuZ2VyOiBhbnkpIHtcclxuICAgICAgICBjb25zdCB2ID0gcGFyc2VJbnQoIHJhbmdlci52YWx1ZSwgMTAgKTtcclxuICAgICAgICBpZiAodGhpcy5pbmZvLmN1cnJlbnRQYWdlIDwgdiAmJiB2ID4gMCAmJiB2IDwgdGhpcy5pbmZvLnBhZ2VzKSB7XHJcblx0XHQgICAgdGhpcy5pbmZvLmZyb20gPSB2ICogKHRoaXMuaW5mby5wYWdlU2l6ZSAtIDEpO1xyXG5cdFx0ICAgIHRoaXMuaW5mby50byA9IHRoaXMuaW5mby5mcm9tICsgdGhpcy5pbmZvLnBhZ2VTaXplIC0gMTtcclxuXHRcdCAgICB0aGlzLmluZm8uY3VycmVudFBhZ2UgPSB2O1xyXG4gICAgICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5pbmZvKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByYW5nZXIudmFsdWUgPSB0aGlzLmluZm8uY3VycmVudFBhZ2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVNpemUoc2l6ZXI6IGFueSkge1xyXG4gICAgICAgIGNvbnN0IHYgPSBwYXJzZUludCggc2l6ZXIudmFsdWUsIDEwICk7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5mby5jb250ZW50U2l6ZSA+PSB2ICYmIHYgPiAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5mby5wYWdlU2l6ZSA9IHY7XHJcbiBcdFx0XHR0aGlzLmluZm8ucGFnZXMgPSBNYXRoLmNlaWwodGhpcy5pbmZvLmNvbnRlbnRTaXplIC8gdik7XHJcbiAgICAgICAgICAgIHRoaXMuaW5mby5mcm9tID0gMDtcclxuXHRcdFx0dGhpcy5pbmZvLnRvID0gdGhpcy5pbmZvLnBhZ2VTaXplIC0gMTtcclxuXHRcdFx0dGhpcy5pbmZvLmN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaW5mbyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2l6ZXIudmFsdWUgPSB0aGlzLmluZm8ucGFnZVNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qXHJcbiogUHJvdmlkZXMgYWJpbGl0eSB0byBjb25maWd1cmUgZGlzcGxheWluZyBvZiB0YWJsZSBjb2x1bW5zLiBBcyBwZXIgZGVmaW5pdGlvbiBvZiBlYXJjaCBoZWFkZXIgY29tcG9uZW50LFxyXG4qIGEgY29sdW1uIGNvdWxkIGJlIGhpZGRlbi5cclxuKi9cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG5cdHNlbGVjdG9yOiAndGFibGUtY29uZmlndXJhdGlvbicsXHJcblx0dGVtcGxhdGVVcmw6ICcuL2NvbmZpZ3VyYXRpb24uY29tcG9uZW50Lmh0bWwnLFxyXG5cdHN0eWxlVXJsczogWycuL2NvbmZpZ3VyYXRpb24uY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ29uZmlndXJhdGlvbkNvbXBvbmVudCB7XHJcbiAgICBzaG93Q29uZmlndXJhdGlvblZpZXc6IGJvb2xlYW47XHJcblxyXG5cdEBJbnB1dChcInRpdGxlXCIpXHJcblx0cHVibGljIHRpdGxlOiBzdHJpbmc7XHJcblxyXG5cdEBJbnB1dChcImFjdGlvblwiKVxyXG5cdHB1YmxpYyBhY3Rpb246IHN0cmluZztcclxuXHJcblx0QElucHV0KFwicHJpbnRUYWJsZVwiKVxyXG5cdHB1YmxpYyBwcmludFRhYmxlOiBzdHJpbmc7XHJcblx0XHJcblx0QElucHV0KFwiaGVhZGVyc1wiKVxyXG5cdHB1YmxpYyBoZWFkZXJzOiBhbnlbXTtcclxuXHJcblx0QElucHV0KFwiY29uZmlnQWRkb25cIilcclxuXHRwdWJsaWMgY29uZmlnQWRkb246IGFueTtcclxuXHJcblx0QE91dHB1dCgnb25jaGFuZ2UnKVxyXG5cdHByaXZhdGUgb25jaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBPdXRwdXQoJ29ucHJpbnQnKVxyXG5cdHByaXZhdGUgb25wcmludCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0cmVjb25maWd1cmUoaXRlbSwgaGVhZGVyKSB7XHJcbiAgICAgICAgaGVhZGVyLnByZXNlbnQgPSBpdGVtLmNoZWNrZWQ7XHJcblx0XHR0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5oZWFkZXJzKTtcclxuXHR9XHJcblxyXG5cdGVuYWJsZUZpbHRlcihpdGVtLCBoZWFkZXIpIHtcclxuICAgICAgICBpZiAoaGVhZGVyLmZpbHRlciA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGhlYWRlci5maWx0ZXIgPSBcIlwiO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZGVsZXRlIGhlYWRlci5maWx0ZXI7XHJcblx0XHR9XHJcblx0XHR0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5oZWFkZXJzKTtcclxuXHR9XHJcblxyXG5cdHByaW50KGV2ZW50KSB7XHJcblx0XHR0aGlzLm9ucHJpbnQuZW1pdCh0cnVlKTtcclxuXHR9XHJcblxyXG4gICAga2V5dXAoZXZlbnQpIHtcclxuICAgICAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcbiAgICAgICAgaWYgKGNvZGUgPT09IDEzKSB7XHJcblx0XHRcdGV2ZW50LnRhcmdldC5jbGljaygpO1xyXG5cdFx0fVxyXG4gICAgfVxyXG59XHJcbiIsIi8qXHJcbiogUHJvdmlkZXMgcmVuZGVyaW5nIG9mIGEgdGFibGUgd2hpY2ggaXMgdXNpbmcgdGhlIGdpdmVuIEZsZXhpYmxlVGFibGVIZWFkZXIgc2V0IGluXHJcbiogb3JkZXIgdG8gdGFidWxhdGUgdGhlIGdpdmVuIGRhdGEuIEFzIHBlciBkZWZpbml0aW9uIG9mIGVhcmNoIGhlYWRlciBjb21wb25lbnQsXHJcbiogYSBjb2x1bW4gY291bGQgYmUgaGlkZGVuLCBzb3J0YWJsZSwgb3IgZHJhZ2dhYmxlLiBFYWNoIHRhYmxlIHJvdyBjYW4gZXhwYW5kL2NvbGxhcHNlXHJcbiogb3IgcmVzcG9uZCB0byBhIGNsaWNrIGFjdGlvbi5cclxuKi9cclxuaW1wb3J0IHtcclxuICAgIENvbXBvbmVudCxcclxuXHRJbnB1dCxcclxuXHRPdXRwdXQsXHJcblx0Vmlld0NoaWxkLFxyXG5cdFZpZXdDb250YWluZXJSZWYsXHJcblx0T25Jbml0LFxyXG5cdE9uQ2hhbmdlcyxcclxuXHRFdmVudEVtaXR0ZXIsXHJcblx0RWxlbWVudFJlZlxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgRHJvcEV2ZW50LCBEcmFnRXZlbnQgfSBmcm9tICdkcmFnLWVuYWJsZWQnO1xyXG5pbXBvcnQgeyBUaW1lb3V0cyB9IGZyb20gJy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AdHlwZXMvc2VsZW5pdW0td2ViZHJpdmVyJztcclxuaW1wb3J0IHsgVGltZSB9IGZyb20gJy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AYW5ndWxhci9jb21tb24nO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBGbGV4aWJsZVRhYmxlSGVhZGVyIHtcclxuXHRrZXk6IHN0cmluZyxcclxuXHR2YWx1ZTogc3RyaW5nLFxyXG5cdHByZXNlbnQ6IGJvb2xlYW4sXHJcblx0d2lkdGg/OiBzdHJpbmcsXHJcblx0bWlud2lkdGg/OiBzdHJpbmcsXHJcblx0Zm9ybWF0Pzogc3RyaW5nLFxyXG5cdGZpbHRlcj86IHN0cmluZyxcclxuXHRkcmFnYWJsZT86IGJvb2xlYW4sXHJcblx0c29ydGFibGU/OiBib29sZWFuLFxyXG5cdGNsYXNzPzpzdHJpbmcsXHJcblx0bG9ja2VkPzpib29sZWFuLFxyXG5cdGFzY2VuZGluZz86IGJvb2xlYW4sXHJcblx0ZGVzY2VuZGluZz86IGJvb2xlYW5cclxufVxyXG5cclxuQENvbXBvbmVudCh7XHJcblx0c2VsZWN0b3I6ICd0YWJsZS12aWV3JyxcclxuXHR0ZW1wbGF0ZVVybDogJy4vdGFibGUuY29tcG9uZW50Lmh0bWwnLFxyXG5cdHN0eWxlVXJsczogWycuL3RhYmxlLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIFRhYmxlVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcclxuXHRkcmFnZ2luZyA9IGZhbHNlO1xyXG5cdHByaW50TW9kZSA9IGZhbHNlO1xyXG5cdGZpbHRlcmVkSXRlbXMgPSBbXTtcclxuXHRmaWx0ZXJpbmdUaW1lcklkOiBhbnk7XHJcblxyXG4gICAgQElucHV0KFwidm9jYWJ1bGFyeVwiKVxyXG4gICAgcHVibGljIHZvY2FidWxhcnkgPSB7XHJcblx0XHRjb25maWd1cmVUYWJsZTogXCJDb25maWd1cmUgVGFibGVcIixcclxuXHRcdGNvbmZpZ3VyZUNvbHVtbnM6IFwiQ29uZmlndXJlIENvbHVtbnNcIixcclxuXHRcdGNsaWNrU29ydDogXCJDbGljayB0byBTb3J0XCIsXHJcblx0XHRzZXRTaXplOiBcIlNldCBTaXplXCIsXHJcblx0XHRmaXJzdFBhZ2U6IFwiRmlyc3RcIixcclxuXHRcdGxhc3RQYWdlOiBcIkxhc3RcIixcclxuXHRcdHByZXZpb3VzUGFnZTogXCJQcmV2aW91c1wiXHJcblx0fTtcclxuXHJcblx0QElucHV0KFwibG9ja2FibGVcIilcclxuXHRsb2NrYWJsZTpib29sZWFuO1xyXG5cclxuXHRASW5wdXQoXCJjYXB0aW9uXCIpXHJcbiAgICBwdWJsaWMgY2FwdGlvbjogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dChcImFjdGlvblwiKVxyXG4gICAgcHVibGljIGFjdGlvbjogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dChcInBhZ2VJbmZvXCIpXHJcbiAgICBwdWJsaWMgcGFnZUluZm87XHJcblxyXG4gICAgQElucHV0KFwiYWN0aW9uS2V5c1wiKVxyXG4gICAgcHVibGljIGFjdGlvbktleXM7XHJcblxyXG4gICAgQElucHV0KFwidGFibGVDbGFzc1wiKVxyXG4gICAgcHVibGljIHRhYmxlQ2xhc3MgPSAnZGVmYXVsdC1mbGV4aWJsZS10YWJsZSc7XHJcblxyXG5cdEBJbnB1dChcImhlYWRlcnNcIilcclxuXHRwdWJsaWMgaGVhZGVyczogYW55W107XHJcblxyXG5cdEBJbnB1dChcIml0ZW1zXCIpXHJcblx0cHVibGljIGl0ZW1zOiBhbnlbXTtcclxuXHJcblx0QElucHV0KFwidGFibGVJbmZvXCIpXHJcblx0cHVibGljIHRhYmxlSW5mbzogYW55O1xyXG5cclxuICAgIEBJbnB1dChcImVuYWJsZUluZGV4aW5nXCIpXHJcbiAgICBwdWJsaWMgZW5hYmxlSW5kZXhpbmc6IGJvb2xlYW47XHJcblxyXG4gICAgQElucHV0KFwiZW5hYmxlRmlsdGVyaW5nXCIpXHJcbiAgICBwdWJsaWMgZW5hYmxlRmlsdGVyaW5nOiBib29sZWFuO1xyXG5cclxuICAgIEBJbnB1dChcInJvd0RldGFpbGVyXCIpXHJcbiAgICBwdWJsaWMgcm93RGV0YWlsZXI6IGFueTtcclxuXHJcbiAgICBASW5wdXQoXCJleHBhbmRhYmxlXCIpXHJcbiAgICBwdWJsaWMgZXhwYW5kYWJsZTogYW55O1xyXG5cclxuICAgIEBJbnB1dChcImV4cGFuZElmXCIpXHJcbiAgICBwdWJsaWMgZXhwYW5kSWY6IGJvb2xlYW47XHJcblxyXG4gICAgQElucHV0KFwiZmlsdGVyd2hpbGV0eXBpbmdcIilcclxuICAgIHB1YmxpYyBmaWx0ZXJ3aGlsZXR5cGluZzogYm9vbGVhbjtcclxuXHJcbiAgICBASW5wdXQoXCJyb3dEZXRhaWxlckhlYWRlcnNcIilcclxuICAgIHB1YmxpYyByb3dEZXRhaWxlckhlYWRlcnM6IGFueTtcclxuXHJcblx0QE91dHB1dCgnb25hY3Rpb24nKVxyXG5cdHByaXZhdGUgb25hY3Rpb24gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBPdXRwdXQoJ29uY2hhbmdlJylcclxuXHRwcml2YXRlIG9uY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHRAT3V0cHV0KCdvbmZpbHRlcicpXHJcblx0cHJpdmF0ZSBvbmZpbHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0QE91dHB1dCgnb25DZWxsQ29udGVudEVkaXQnKVxyXG5cdHByaXZhdGUgb25DZWxsQ29udGVudEVkaXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBWaWV3Q2hpbGQoJ2ZsZXhpYmxlJywge3JlYWQ6IFZpZXdDb250YWluZXJSZWZ9KSBwcml2YXRlIHRhYmxlOiBWaWV3Q29udGFpbmVyUmVmO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDpFbGVtZW50UmVmKSB7fVxyXG5cclxuXHJcblx0cHJpdmF0ZSBmaW5kQ29sdW1uV2l0aElEKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBsaXN0ID0gdGhpcy5oZWFkZXJDb2x1bW5FbGVtZW50cygpO1xyXG5cdFx0bGV0IGNvbHVtbiA9IG51bGw7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKGxpc3RbaV0uZ2V0QXR0cmlidXRlKFwiaWRcIikgPT09IGlkKSB7XHJcblx0XHRcdFx0Y29sdW1uID0gbGlzdFtpXTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNvbHVtbjtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgc3dhcENvbHVtbnMoc291cmNlOiBhbnksIGRlc3RpbmF0aW9uOiBhbnkpIHtcclxuXHJcblx0XHRpZiAoc291cmNlLm5vZGUucGFyZW50Tm9kZSA9PT0gZGVzdGluYXRpb24ubm9kZS5wYXJlbnROb2RlKSB7XHJcblx0XHRcdGNvbnN0IHNyY0luZGV4ID0gdGhpcy5nZXRDb2x1bW5JbmRleChzb3VyY2UubWVkaXVtLmtleSk7XHJcblx0XHRcdGNvbnN0IGRlc0luZGV4ID0gdGhpcy5nZXRDb2x1bW5JbmRleChkZXN0aW5hdGlvbi5tZWRpdW0ua2V5KTtcclxuXHRcdFx0aWYgKHNyY0luZGV4IDwgMCB8fCBkZXNJbmRleCA8IDApIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcImludmFsaWQgZHJvcCBpZFwiLCBzb3VyY2UubWVkaXVtLmtleSwgZGVzdGluYXRpb24ubWVkaXVtLmtleSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNvbnN0IHggPSB0aGlzLmZpbHRlcmVkSXRlbXM7XHJcblx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IFtdO1xyXG5cclxuXHRcdFx0c2V0VGltZW91dCgoKT0+e1xyXG5cdFx0XHRcdGNvbnN0IHNvYmogPSB0aGlzLmhlYWRlcnNbc3JjSW5kZXhdO1xyXG5cdFx0XHRcdHRoaXMuaGVhZGVyc1tzcmNJbmRleF0gPSB0aGlzLmhlYWRlcnNbZGVzSW5kZXhdO1xyXG5cdFx0XHRcdHRoaXMuaGVhZGVyc1tkZXNJbmRleF0gPSBzb2JqO1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IHg7XHJcblxyXG5cdFx0XHRcdHRoaXMub25maWx0ZXIuZW1pdCh0aGlzLmZpbHRlcmVkSXRlbXMpO1xyXG5cdFx0XHRcdHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzLmhlYWRlcnMpO1xyXG5cdFx0XHR9LCAzMyk7XHJcblx0XHJcblx0XHR9IGVsc2UgaWYgKHNvdXJjZS5tZWRpdW0ubG9ja2VkIHx8IGRlc3RpbmF0aW9uLm1lZGl1bS5sb2NrZWQpIHtcclxuXHRcdFx0Y29uc3QgeCA9IHRoaXMuZmlsdGVyZWRJdGVtcztcclxuXHRcdFx0dGhpcy5maWx0ZXJlZEl0ZW1zID0gW107XHJcblx0XHRcdHRoaXMub25maWx0ZXIuZW1pdCh0aGlzLmZpbHRlcmVkSXRlbXMpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KCgpPT57XHJcblx0XHRcdFx0c291cmNlLm1lZGl1bS5sb2NrZWQgPSAhc291cmNlLm1lZGl1bS5sb2NrZWQ7XHJcblx0XHRcdFx0ZGVzdGluYXRpb24ubWVkaXVtLmxvY2tlZCA9ICFkZXN0aW5hdGlvbi5tZWRpdW0ubG9ja2VkO1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IHg7XHJcblx0XHRcdFx0dGhpcy5vbmZpbHRlci5lbWl0KHRoaXMuZmlsdGVyZWRJdGVtcyk7XHJcblx0XHRcdFx0dGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaGVhZGVycyk7XHJcblx0XHRcdH0sMzMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBnZXRDb2x1bW5JbmRleChpZDogc3RyaW5nKSB7XHJcblx0XHRsZXQgaW5kZXggPSAtMTtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWFkZXJzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmICh0aGlzLmhlYWRlcnNbaV0ua2V5ID09PSBpZCkge1xyXG5cdFx0XHRcdGluZGV4ID0gaTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGluZGV4O1xyXG5cdH1cclxuXHRwcml2YXRlIGl0ZW1WYWx1ZShpdGVtLCBocGF0aCkge1xyXG5cdFx0bGV0IHN1Yml0ZW0gPSBpdGVtO1xyXG5cdFx0aHBhdGgubWFwKCAoc3Via2V5KSA9PiB7XHJcblx0XHRcdGlmIChzdWJpdGVtKSB7XHJcblx0XHRcdFx0c3ViaXRlbSA9IHN1Yml0ZW1bc3Via2V5XTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHRcdHJldHVybiBzdWJpdGVtID09PSB1bmRlZmluZWQgfHwgc3ViaXRlbSA9PT0gbnVsbCB8fCBzdWJpdGVtID09PSBcIm51bGxcIiA/IFwiXCIgOiBzdWJpdGVtO1xyXG5cdH1cclxuXHRpbml0VmlzaWJsZVJvd3MoKSB7XHJcblx0XHRjb25zdCByZXN1bHQgPSBbXTtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5maWx0ZXJlZEl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmIChpID49IHRoaXMucGFnZUluZm8uZnJvbSAmJiBpIDw9IHRoaXMucGFnZUluZm8udG8pIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaCh0aGlzLmZpbHRlcmVkSXRlbXNbaV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSByZXN1bHQ7XHJcblx0fVxyXG5cclxuXHRsb2NrKGhlYWRlcjogRmxleGlibGVUYWJsZUhlYWRlciwgZXZlbnQpIHtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcdFxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRoZWFkZXIubG9ja2VkID0gIWhlYWRlci5sb2NrZWQ7XHJcblx0XHR0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5oZWFkZXJzKTtcclxuXHR9XHJcblx0c29ydChoZWFkZXI6IEZsZXhpYmxlVGFibGVIZWFkZXIsIGljb24pIHtcclxuXHRcdGlmIChoZWFkZXIuc29ydGFibGUgJiYgdGhpcy5pdGVtcyAmJiB0aGlzLml0ZW1zLmxlbmd0aCkge1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVhZGVycy5sZW5ndGggOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGggPSB0aGlzLmhlYWRlcnNbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGgua2V5ICE9PSBoZWFkZXIua2V5KSB7XHJcblx0XHRcdFx0XHRjb25zdCBpdGVtID0gdGhpcy5maW5kQ29sdW1uV2l0aElEKGgua2V5KTtcclxuXHJcblx0XHRcdFx0XHRpZiAoaXRlbSkge1xyXG5cdFx0XHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJhc2NlbmRpbmdcIik7XHJcblx0XHRcdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LnJlbW92ZShcImRlc2NlbmRpbmdcIik7XHJcblx0XHRcdFx0XHRcdGl0ZW0uY2xhc3NMaXN0LmFkZChcInNvcnRhYmxlXCIpO1xyXG5cdFx0XHRcdFx0fVxyXG4gICAgICAgICAgICAgICAgICAgIGguZGVzY2VuZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGguYXNjZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcbiAgICAgICAgICAgIGljb24uY2xhc3NMaXN0LnJlbW92ZShcImZhLXNvcnRcIik7XHJcblx0XHRcdGlmIChoZWFkZXIuYXNjZW5kaW5nIHx8ICghaGVhZGVyLmFzY2VuZGluZyAmJiAhaGVhZGVyLmRlc2NlbmRpbmcpKSB7XHJcblx0XHRcdFx0aGVhZGVyLmRlc2NlbmRpbmcgPSB0cnVlO1xyXG5cdFx0XHRcdGhlYWRlci5hc2NlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRpY29uLmNsYXNzTGlzdC5yZW1vdmUoXCJmYS1zb3J0LWFzY1wiKTtcclxuXHRcdFx0XHRpY29uLmNsYXNzTGlzdC5hZGQoXCJmYS1zb3J0LWRlc2NcIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aGVhZGVyLmRlc2NlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRoZWFkZXIuYXNjZW5kaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHRpY29uLmNsYXNzTGlzdC5yZW1vdmUoXCJmYS1zb3J0LWRlc2NcIik7XHJcblx0XHRcdFx0aWNvbi5jbGFzc0xpc3QuYWRkKFwiZmEtc29ydC1hc2NcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0Y29uc3QgaHBhdGggPSBoZWFkZXIua2V5LnNwbGl0KFwiLlwiKTtcclxuXHJcblx0XHRcdGlmICh0aGlzLmVuYWJsZUZpbHRlcmluZykge1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVySXRlbXMoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSB0aGlzLml0ZW1zID8gdGhpcy5pdGVtcyA6IFtdO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcy5zb3J0KChhLCBiKSA9PiB7XHJcblx0XHRcdFx0Y29uc3QgdjEgPSB0aGlzLml0ZW1WYWx1ZShhLCBocGF0aCk7XHJcblx0XHRcdFx0Y29uc3QgdjIgPSB0aGlzLml0ZW1WYWx1ZShiLCBocGF0aCk7XHJcblxyXG5cdFx0XHRcdGlmIChoZWFkZXIuYXNjZW5kaW5nKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdjEgPiB2MiA/IDEgOiAtMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHYxIDwgdjIgPyAxIDogLTE7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR0aGlzLmluaXRWaXNpYmxlUm93cygpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0b2Zmc2V0V2lkdGgoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy50YWJsZS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XHJcblx0fVxyXG5cclxuXHRuZ09uQ2hhbmdlcyhjaGFuZ2VzOmFueSkge1xyXG5cdFx0Ly8gaWYgKGNoYW5nZXMuaXRlbXMpIHtcclxuXHRcdC8vIFx0dGhpcy5ldmFsdWF0ZVJvd3MoKTtcclxuXHRcdC8vIH1cclxuXHR9XHJcblxyXG5cdG5nT25Jbml0KCkge1xyXG5cdFx0aWYgKHRoaXMucGFnZUluZm8pIHtcclxuXHRcdFx0aWYgKCF0aGlzLnBhZ2VJbmZvLnRvKSB7XHJcblx0XHRcdFx0dGhpcy5wYWdlSW5mby50byA9IHRoaXMucGFnZUluZm8ucGFnZVNpemU7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMucGFnZUluZm8gPSB7IFxyXG4gICAgICAgICAgICAgICAgY29udGVudFNpemU6IDEwMDAwMCwgXHJcbiAgICAgICAgICAgICAgICBwYWdlU2l6ZTogMTAwMDAwLCBcclxuICAgICAgICAgICAgICAgIHBhZ2VzOiAxLCBcclxuICAgICAgICAgICAgICAgIGZyb206IDAsIFxyXG4gICAgICAgICAgICAgICAgdG86IDEwMDAwMCwgXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFnZTogMSwgXHJcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogXCIwXCIgXHJcbiAgICAgICAgICAgIH07XHJcblx0XHR9XHJcblx0XHRpZiAoIXRoaXMuaGVhZGVycykge1xyXG5cdFx0XHR0aGlzLmhlYWRlcnMgPSBbXTtcclxuXHRcdH1cclxuXHRcdHRoaXMuZXZhbHVhdGVSb3dzKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aW9uS2V5cykge1xyXG4gICAgICAgICAgICB0aGlzLmFjdGlvbktleXMgPSB0aGlzLmFjdGlvbktleXMuc3BsaXQoXCIsXCIpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCF0aGlzLnJvd0RldGFpbGVyICYmIHRoaXMuZXhwYW5kYWJsZSkge1xyXG5cdFx0XHR0aGlzLnJvd0RldGFpbGVyID0gZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRcdHJldHVybiB7ZGF0YTogaXRlbSwgaGVhZGVyczogW119O1xyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdFx0aWYgKCF0aGlzLmV4cGFuZGFibGUpIHtcclxuXHRcdFx0dGhpcy5leHBhbmRhYmxlID0gZnVuY3Rpb24oaXRlbSwgc2hvd0ljb24pIHtyZXR1cm4gc2hvd0ljb259O1xyXG5cdFx0fVxyXG5cdFx0aWYgKCF0aGlzLnJvd0RldGFpbGVySGVhZGVycykge1xyXG5cdFx0XHR0aGlzLnJvd0RldGFpbGVySGVhZGVycyA9IChpdGVtKSA9PiBbXTtcclxuXHRcdH1cclxuXHR9XHJcblx0ZXZhbHVhdGVSb3dzKCkge1xyXG5cdFx0aWYgKHRoaXMuZW5hYmxlRmlsdGVyaW5nKSB7XHJcblx0XHRcdHRoaXMuZmlsdGVySXRlbXMoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IHRoaXMuaXRlbXMgPyB0aGlzLml0ZW1zIDogW107XHJcblx0XHR9XHJcblx0XHR0aGlzLmluaXRWaXNpYmxlUm93cygpO1xyXG5cdH1cclxuXHJcbiAgICBoZWFkZXJDb2x1bW5FbGVtZW50cygpIHtcclxuXHRcdGxldCByZXN1bHQgPSBbXTtcclxuXHJcblx0XHRpZiAodGhpcy50YWJsZS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW4pIHtcclxuXHRcdFx0Y29uc3QgbGlzdCA9IHRoaXMudGFibGUuZWxlbWVudC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuO1xyXG5cdFx0XHRyZXN1bHQgPSB0aGlzLmNhcHRpb24gPyBsaXN0WzFdLmNoaWxkcmVuWzBdLmNoaWxkcmVuIDogbGlzdFswXS5jaGlsZHJlblswXS5jaGlsZHJlbjtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG5cdGhlYWRlckJ5SWQoaWQpIHtcclxuXHRcdGxldCBoO1xyXG5cdFx0Zm9yIChjb25zdCBpIGluIHRoaXMuaGVhZGVycykge1xyXG5cdFx0XHRpZiAodGhpcy5oZWFkZXJzW2ldLmtleSA9PT0gaWQpIHtcclxuXHRcdFx0XHRoID0gdGhpcy5oZWFkZXJzW2ldO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gaDtcclxuXHR9XHJcblxyXG4gICAgY29sdW1uc0NvdW50KCkge1xyXG5cdFx0bGV0IGNvdW50ID0gMDtcclxuXHRcdHRoaXMuaGVhZGVycy5tYXAoIChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLnByZXNlbnQpIHtcclxuICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgIH1cclxuXHRcdH0pO1xyXG4gICAgICAgIGlmICh0aGlzLmFjdGlvbikge1xyXG4gICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY291bnQ7XHJcblx0fVxyXG5cdGhvdmVyKGl0ZW0sIGZsYWcpIHtcclxuXHRcdGlmIChmbGFnKSB7XHJcblx0XHRcdGl0ZW0uaG92ZXIgPSB0cnVlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZGVsZXRlIGl0ZW0uaG92ZXI7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR0b0Nzc0NsYXNzKGhlYWRlcikge1xyXG5cdFx0cmV0dXJuIGhlYWRlci5rZXkucmVwbGFjZSgvXFwuL2csJy0nKTtcclxuXHR9XHJcbiAgICBrZXlkb3duKGV2ZW50LCBpdGVtKSB7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG4gICAgICAgIGlmICgoY29kZSA9PT0gMTMpIHx8IChjb2RlID09PSAzMikpIHtcclxuXHRcdFx0aXRlbS5jbGljaygpO1xyXG5cdFx0fVxyXG4gICAgfVxyXG4gICAgb2ZmU2NyZWVuTWVzc2FnZShpdGVtKSB7XHJcblx0XHRsZXQgbWVzc2FnZTogc3RyaW5nID0gdGhpcy5hY3Rpb247XHJcblx0XHRpZiAodGhpcy5hY3Rpb25LZXlzKSB7XHJcblx0XHRcdHRoaXMuYWN0aW9uS2V5cy5tYXAoKGtleSkgPT4geyBtZXNzYWdlID0gbWVzc2FnZS5yZXBsYWNlKGtleSwgaXRlbVtrZXkuc3Vic3RyaW5nKDEsIGtleS5sZW5ndGggLSAxKV0pOyB9KVxyXG5cdFx0fVxyXG4gICAgICAgIHJldHVybiBtZXNzYWdlO1xyXG4gICAgfVxyXG5cclxuICAgIGNlbGxDb250ZW50KGl0ZW0sIGhlYWRlcikge1xyXG5cdFx0bGV0IGNvbnRlbnQgPSB0aGlzLml0ZW1WYWx1ZShpdGVtLCBoZWFkZXIua2V5LnNwbGl0KFwiLlwiKSk7XHJcbiAgICAgICAgcmV0dXJuIChjb250ZW50ICE9PSB1bmRlZmluZWQgJiYgY29udGVudCAhPSBudWxsICYmIFN0cmluZyhjb250ZW50KS5sZW5ndGgpID8gY29udGVudCA6ICcmbmJzcDsnO1xyXG5cdH1cclxuXHJcblx0cm93RGV0YWlsZXJDb250ZXh0KGl0ZW0pIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGRhdGE6IGl0ZW0sXHJcblx0XHRcdHRhYmxlSW5mbzogdGhpcy50YWJsZUluZm8sXHJcblx0XHRcdGhlYWRlcnM6IHRoaXMucm93RGV0YWlsZXJIZWFkZXJzKGl0ZW0pXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0Y2hhbmdlRmlsdGVyKGV2ZW50LCBoZWFkZXIpIHtcclxuICAgICAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcblxyXG5cdFx0aGVhZGVyLmZpbHRlciA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuXHJcblx0XHRpZiAodGhpcy5maWx0ZXJ3aGlsZXR5cGluZyB8fCBjb2RlID09PSAxMykge1xyXG5cdFx0XHRpZih0aGlzLmZpbHRlcmluZ1RpbWVySWQpIHtcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQodGhpcy5maWx0ZXJpbmdUaW1lcklkKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmZpbHRlcmluZ1RpbWVySWQgPSBzZXRUaW1lb3V0KCgpPT57XHJcblx0XHRcdFx0dGhpcy5maWx0ZXJJdGVtcygpO1xyXG5cdFx0XHRcdHRoaXMuaW5pdFZpc2libGVSb3dzKCk7XHJcblx0XHRcdFx0dGhpcy5maWx0ZXJpbmdUaW1lcklkICA9IHVuZGVmaW5lZDtcclxuXHRcdFx0fSwgMTIzKTtcclxuXHRcdH1cclxuXHR9XHJcblx0YWN0aW9uQ2xpY2soZXZlbnQsIGl0ZW06IGFueSkge1xyXG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgaWYgKHRoaXMucm93RGV0YWlsZXIgJiYgKHRoaXMuZXhwYW5kSWYgfHwgdGhpcy5leHBhbmRhYmxlKGl0ZW0sIGZhbHNlKSkgKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmV4cGFuZGVkKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgaXRlbS5leHBhbmRlZDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZXhwYW5kZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vbmFjdGlvbi5lbWl0KGl0ZW0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cHJpbnQoKSB7XHJcblx0XHR0aGlzLnByaW50TW9kZSA9IHRydWU7XHJcblx0XHRzZXRUaW1lb3V0KCgpPT57XHJcblx0XHRcdGNvbnN0IGNvbnRlbnQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MO1xyXG5cdFx0XHR0aGlzLnByaW50TW9kZSA9IGZhbHNlO1xyXG5cdFx0XHRjb25zdCBwb3B1cFdpbiA9IHdpbmRvdy5vcGVuKCcnLCAnX2JsYW5rJywgJ3dpZHRoPTMwMCxoZWlnaHQ9MzAwJyk7XHJcblx0XHRcclxuXHRcdFx0cG9wdXBXaW4uZG9jdW1lbnQub3BlbigpO1xyXG4gICAgICAgIFx0cG9wdXBXaW4uZG9jdW1lbnQud3JpdGUoJzxodG1sPjxib2R5IG9ubG9hZD1cIndpbmRvdy5wcmludCgpXCI+JyArIGNvbnRlbnQgKyAnPC9odG1sPicpO1xyXG4gICAgICAgIFx0cG9wdXBXaW4uZG9jdW1lbnQuY2xvc2UoKTtcclxuXHRcdH0sMyk7XHJcblx0fVxyXG5cclxuXHQvLyA8NSwgITUsID41LCAqRSwgRSosICpFKlxyXG5cdHByaXZhdGUgc2hvdWxkU2tpcEl0ZW0odmFsdWUsIGZpbHRlckJ5KSB7XHJcblx0XHRsZXQgcmVzdWx0ID0gZmFsc2U7XHJcblxyXG5cdFx0aWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwgJiYgU3RyaW5nKHZhbHVlKS5sZW5ndGgpIHtcclxuXHRcdFx0Y29uc3QgdiA9IFN0cmluZyh2YWx1ZSk7XHJcblx0XHRcdGlmIChmaWx0ZXJCeVswXSA9PT0gJzwnKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gZmlsdGVyQnkubGVuZ3RoID4gMSAmJiBwYXJzZUZsb2F0KHYpID49IHBhcnNlRmxvYXQoZmlsdGVyQnkuc3Vic3RyaW5nKDEpKTtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWx0ZXJCeVswXSA9PT0gJz4nKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gZmlsdGVyQnkubGVuZ3RoID4gMSAmJiBwYXJzZUZsb2F0KHYpIDw9IHBhcnNlRmxvYXQoZmlsdGVyQnkuc3Vic3RyaW5nKDEpKTtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWx0ZXJCeVswXSA9PT0gJyEnKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gZmlsdGVyQnkubGVuZ3RoID4gMSAmJiBwYXJzZUZsb2F0KHYpID09IHBhcnNlRmxvYXQoZmlsdGVyQnkuc3Vic3RyaW5nKDEpKTtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWx0ZXJCeVswXSA9PT0gJz0nKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gZmlsdGVyQnkubGVuZ3RoID09IDEgfHwgcGFyc2VGbG9hdCh2KSAhPT0gcGFyc2VGbG9hdChmaWx0ZXJCeS5zdWJzdHJpbmcoMSkpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGZpbHRlckJ5WzBdID09PSAnKicgJiYgZmlsdGVyQnlbZmlsdGVyQnkubGVuZ3RoLTFdICE9PSAnKicpIHtcclxuXHRcdFx0XHRjb25zdCBmID0gZmlsdGVyQnkuc3Vic3RyaW5nKDEpO1xyXG5cdFx0XHRcdHJlc3VsdCA9IHYuaW5kZXhPZihmKSAhPT0gdi5sZW5ndGggLSBmLmxlbmd0aFxyXG5cdFx0XHR9IGVsc2UgaWYgKGZpbHRlckJ5WzBdICE9PSAnKicgJiYgZmlsdGVyQnlbZmlsdGVyQnkubGVuZ3RoLTFdID09PSAnKicpIHtcclxuXHRcdFx0XHRjb25zdCBmID0gZmlsdGVyQnkuc3Vic3RyaW5nKDAsIGZpbHRlckJ5Lmxlbmd0aC0xKTtcclxuXHRcdFx0XHRyZXN1bHQgPSB2LmluZGV4T2YoZikgIT09IDA7XHJcblx0XHRcdH0gZWxzZSBpZiAoZmlsdGVyQnlbMF0gPT09ICcqJyAmJiBmaWx0ZXJCeVtmaWx0ZXJCeS5sZW5ndGgtMV0gPT09ICcqJykge1xyXG5cdFx0XHRcdHJlc3VsdCA9IGZpbHRlckJ5Lmxlbmd0aCA+IDEgJiYgdi5pbmRleE9mKCBmaWx0ZXJCeS5zdWJzdHJpbmcoMSwgZmlsdGVyQnkubGVuZ3RoLTEpICkgPCAwO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJlc3VsdCA9IHYuaW5kZXhPZihmaWx0ZXJCeSkgPCAwO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH1cclxuXHRmaWx0ZXJJdGVtcygpIHtcclxuXHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IHRoaXMuaXRlbXMgPyB0aGlzLml0ZW1zLmZpbHRlcigoaXRlbSkgPT4ge1xyXG5cdFx0XHRsZXQga2VlcEl0ZW0gPSB0cnVlO1xyXG5cclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlYWRlcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRjb25zdCBoZWFkZXIgPSB0aGlzLmhlYWRlcnNbaV07XHJcblx0XHRcdFx0aWYgKGhlYWRlci5maWx0ZXIgJiYgaGVhZGVyLmZpbHRlci5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdGNvbnN0IHYgPSB0aGlzLml0ZW1WYWx1ZShpdGVtLCBoZWFkZXIua2V5LnNwbGl0KFwiLlwiKSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuc2hvdWxkU2tpcEl0ZW0odixoZWFkZXIuZmlsdGVyKSkge1xyXG5cdFx0XHRcdFx0XHRrZWVwSXRlbSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGtlZXBJdGVtO1xyXG5cdFx0fSkgOiBbXTtcclxuXHRcdHRoaXMub25maWx0ZXIuZW1pdCh0aGlzLmZpbHRlcmVkSXRlbXMpO1xyXG5cdH1cclxuXHJcblx0b25UYWJsZUNlbGxFZGl0KGV2ZW50KSB7XHJcblx0XHRjb25zdCBpZCA9IGV2ZW50LmlkLnNwbGl0KFwiLVwiKTtcclxuXHRcdGNvbnN0IG4gPSBldmVudC5uYW1lO1xyXG5cdFx0Y29uc3Qgdj0gZXZlbnQudmFsdWU7XHJcblx0XHRjb25zdCB0ID0gdGhpcy5pdGVtc1twYXJzZUludChpZFsxXSldO1xyXG5cclxuXHRcdGlmICh0KSB7XHJcblx0XHRcdGNvbnN0IGxpc3QgPSBpZFswXS5zcGxpdChcIi5cIik7XHJcblx0XHRcdGxldCBzdWJpdGVtID0gdFtsaXN0WzBdXTtcclxuXHRcdFx0Zm9yKGxldCBpID0gMTsgaSA8IChsaXN0Lmxlbmd0aCAtIDEpOyBpKyspIHtcclxuXHRcdFx0XHRzdWJpdGVtID0gc3ViaXRlbVtsaXN0W2ldXVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChzdWJpdGVtICYmIGxpc3QubGVuZ3RoID4gMSl7XHJcblx0XHRcdFx0c3ViaXRlbVtsaXN0W2xpc3QubGVuZ3RoIC0gMV1dID0gdjtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLm9uQ2VsbENvbnRlbnRFZGl0LmVtaXQoe25hbWU6IG4sIHZhbHVlOiB2LCBpdGVtOiB0fSk7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG5cdGRyYWdFbmFibGVkKGV2ZW50OiBEcmFnRXZlbnQpIHtcclxuXHRcdHJldHVybiBldmVudC5tZWRpdW0uZHJhZ2FibGU7XHJcblx0fVxyXG5cdGRyb3BFbmFibGVkKGV2ZW50OiBEcm9wRXZlbnQpIHtcclxuXHRcdHJldHVybiBldmVudC5kZXN0aW5hdGlvbi5tZWRpdW0uZHJhZ2FibGU7XHJcblx0fVxyXG5cdG9uRHJhZ1N0YXJ0KGV2ZW50OiBEcmFnRXZlbnQpe1xyXG4vLyAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWU7XHJcblx0fVxyXG5cdG9uRHJhZ0VuZChldmVudDogRHJhZ0V2ZW50KXtcclxuIC8vICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcclxuXHR9XHJcblx0b25Ecm9wKGV2ZW50OkRyb3BFdmVudCl7XHJcblx0XHR0aGlzLnN3YXBDb2x1bW5zKGV2ZW50LnNvdXJjZSwgZXZlbnQuZGVzdGluYXRpb24pO1xyXG5cdH1cclxufVxyXG4iLCIvKlxuKiBQcm92aWRlcyByZW5kZXJpbmcgb2YgYSB0YWJsZSB3aGljaCBpcyB1c2luZyB0aGUgZ2l2ZW4gRmxleGlibGVUYWJsZUhlYWRlciBzZXQgaW5cbiogb3JkZXIgdG8gdGFidWxhdGUgdGhlIGdpdmVuIGRhdGEuIEFzIHBlciBkZWZpbml0aW9uIG9mIGVhcmNoIGhlYWRlciBjb21wb25lbnQsXG4qIGEgY29sdW1uIGNvdWxkIGJlIGhpZGRlbiwgc29ydGFibGUsIG9yIGRyYWdnYWJsZS4gRWFjaCB0YWJsZSByb3cgY2FuIGV4cGFuZC9jb2xsYXBzZVxuKiBvciByZXNwb25kIHRvIGEgY2xpY2sgYWN0aW9uLlxuKi9cbmltcG9ydCB7XG4gICAgQ29tcG9uZW50LFxuXHRJbnB1dCxcblx0T3V0cHV0LFxuXHRWaWV3Q2hpbGQsXG5cdFZpZXdDb250YWluZXJSZWYsXG5cdE9uSW5pdCxcblx0UmVuZGVyZXIsXG5cdEVsZW1lbnRSZWYsXG5cdEV2ZW50RW1pdHRlclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRHJvcEV2ZW50LCBEcmFnRXZlbnQgfSBmcm9tICdkcmFnLWVuYWJsZWQnO1xuaW1wb3J0IHsgVGFibGVWaWV3Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUYWJsZUhlYWRlcnNHZW5lcmF0b3IgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUtaGVhZGVycy1nZW5lcmF0b3InO1xuXG5AQ29tcG9uZW50KHtcblx0c2VsZWN0b3I6ICdsb2NrLXRhYmxlJyxcblx0dGVtcGxhdGVVcmw6ICcuL2xvY2sudGFibGUuY29tcG9uZW50Lmh0bWwnLFxuXHRzdHlsZVVybHM6IFsnLi9sb2NrLnRhYmxlLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTG9ja1RhYmxlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuXHRsb2NrZWRIZWFkZXJzOmFueTtcblx0dW5sb2NrZWRIZWFkZXJzOmFueTtcblx0ZmlsdGVyZWRJdGVtcyA9IFtdO1xuXG4gICAgQElucHV0KFwidm9jYWJ1bGFyeVwiKVxuICAgIHB1YmxpYyB2b2NhYnVsYXJ5ID0ge1xuXHRcdGNvbmZpZ3VyZVRhYmxlOiBcIkNvbmZpZ3VyZSBUYWJsZVwiLFxuXHRcdGNvbmZpZ3VyZUNvbHVtbnM6IFwiQ29uZmlndXJlIENvbHVtbnNcIixcblx0XHRjbGlja1NvcnQ6IFwiQ2xpY2sgdG8gU29ydFwiLFxuXHRcdHNldFNpemU6IFwiU2V0IFNpemVcIixcblx0XHRmaXJzdFBhZ2U6IFwiRmlyc3RcIixcblx0XHRsYXN0UGFnZTogXCJMYXN0XCIsXG5cdFx0cHJldmlvdXNQYWdlOiBcIlByZXZpb3VzXCJcblx0fTtcblxuICAgIEBJbnB1dChcInBlcnNpc3RlbmNlSWRcIilcbiAgICBwdWJsaWMgcGVyc2lzdGVuY2VJZDogc3RyaW5nO1xuXG4gICAgQElucHV0KFwicGVyc2lzdGVuY2VLZXlcIilcbiAgICBwdWJsaWMgcGVyc2lzdGVuY2VLZXk6IHN0cmluZztcblxuICAgIEBJbnB1dChcImNhcHRpb25cIilcbiAgICBwdWJsaWMgY2FwdGlvbjogc3RyaW5nO1xuXG4gICAgQElucHV0KFwiYWN0aW9uXCIpXG4gICAgcHVibGljIGFjdGlvbjogc3RyaW5nO1xuXG4gICAgQElucHV0KFwiYWN0aW9uS2V5c1wiKVxuICAgIHB1YmxpYyBhY3Rpb25LZXlzO1xuXG4gICAgQElucHV0KFwidGFibGVDbGFzc1wiKVxuICAgIHB1YmxpYyB0YWJsZUNsYXNzID0gJ2RlZmF1bHQtZmxleGlibGUtdGFibGUnO1xuXG5cdEBJbnB1dChcImhlYWRlcnNcIilcblx0cHVibGljIGhlYWRlcnM6IGFueVtdO1xuXG5cdEBJbnB1dChcIml0ZW1zXCIpXG5cdHB1YmxpYyBpdGVtczogYW55W107XG5cblx0QElucHV0KFwicGFnZUluZm9cIilcblx0cHVibGljIHBhZ2VJbmZvOiBhbnk7XG5cblx0QElucHV0KFwidGFibGVJbmZvXCIpXG5cdHB1YmxpYyB0YWJsZUluZm86IGFueTtcblxuICAgIEBJbnB1dChcImNvbmZpZ3VyYWJsZVwiKVxuICAgIHB1YmxpYyBjb25maWd1cmFibGU6IGJvb2xlYW47XG5cblx0QElucHV0KFwiY29uZmlnQWRkb25cIilcblx0cHVibGljIGNvbmZpZ0FkZG9uOiBhbnk7XG5cblx0QElucHV0KFwiZW5hYmxlRmlsdGVyaW5nXCIpXG4gICAgcHVibGljIGVuYWJsZUZpbHRlcmluZzogYm9vbGVhbjtcblxuICAgIEBJbnB1dChcImVuYWJsZUluZGV4aW5nXCIpXG4gICAgcHVibGljIGVuYWJsZUluZGV4aW5nOiBib29sZWFuO1xuXG4gICAgQElucHV0KFwiZmlsdGVyd2hpbGV0eXBpbmdcIilcbiAgICBwdWJsaWMgZmlsdGVyd2hpbGV0eXBpbmc6IGJvb2xlYW47XG5cblxuXHRAT3V0cHV0KCdvbmFjdGlvbicpXG5cdHByaXZhdGUgb25hY3Rpb24gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cblx0QE91dHB1dCgnb25DZWxsQ29udGVudEVkaXQnKVxuXHRwcml2YXRlIG9uQ2VsbENvbnRlbnRFZGl0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG5cdEBPdXRwdXQoJ29uY29uZmlndXJhdGlvbmNoYW5nZScpXG5cdHByaXZhdGUgb25jb25maWd1cmF0aW9uY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG5cdEBWaWV3Q2hpbGQoJ2xvY2tlZFRhYmxlJylcblx0cHJpdmF0ZSBsb2NrZWRUYWJsZTogVGFibGVWaWV3Q29tcG9uZW50O1xuXG5cdEBWaWV3Q2hpbGQoJ3VubG9ja2VkVGFibGUnKVxuXHRwcml2YXRlIHVubG9ja2VkVGFibGU6IFRhYmxlVmlld0NvbXBvbmVudDtcblxuICAgIHNjcm9sbChldmVudCkge1xuXHRcdHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKFxuXHRcdFx0XHR0aGlzLmxvY2tlZFRhYmxlLmVsLm5hdGl2ZUVsZW1lbnQsXG5cdFx0XHRcdFwibGVmdFwiLFxuXHRcdFx0XHRldmVudC50YXJnZXQuc2Nyb2xsTGVmdCtcInB4XCIpO1xuXHR9XG5cbiAgICBjb25zdHJ1Y3Rvcihcblx0XHRwcml2YXRlIGdlbmVyYXRvcjogVGFibGVIZWFkZXJzR2VuZXJhdG9yLFxuXHRcdHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyXG5cdCkge31cblxuXHRuZ09uSW5pdCgpIHtcblx0XHRpZiAodGhpcy5wYWdlSW5mbykge1xuXHRcdFx0aWYgKCF0aGlzLnBhZ2VJbmZvLnRvKSB7XG5cdFx0XHRcdHRoaXMucGFnZUluZm8udG8gPSB0aGlzLnBhZ2VJbmZvLnBhZ2VTaXplO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnBhZ2VJbmZvID0ge1xuICAgICAgICAgICAgICAgIGNvbnRlbnRTaXplOiAxMDAwMDAsXG4gICAgICAgICAgICAgICAgcGFnZVNpemU6IDEwMDAwMCxcbiAgICAgICAgICAgICAgICBwYWdlczogMSxcbiAgICAgICAgICAgICAgICBmcm9tOiAwLFxuICAgICAgICAgICAgICAgIHRvOiAxMDAwMDAsXG4gICAgICAgICAgICAgICAgY3VycmVudFBhZ2U6IDEsXG4gICAgICAgICAgICAgICAgbWF4V2lkdGg6IFwiMFwiXG4gICAgICAgICAgICB9O1xuXHRcdH1cblx0XHRpZiAodGhpcy5wZXJzaXN0ZW5jZUtleSkge1xuXHRcdFx0Y29uc3QgaGVhZGVyczphbnkgPSB0aGlzLmdlbmVyYXRvci5yZXRyZWl2ZUhlYWRlcnModGhpcy5wZXJzaXN0ZW5jZUtleSwgdGhpcy5wZXJzaXN0ZW5jZUlkKTtcblxuXHRcdFx0aWYgKGhlYWRlcnMpIHtcblx0XHRcdFx0dGhpcy5oZWFkZXJzID0gaGVhZGVycztcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKCF0aGlzLmhlYWRlcnMpIHtcblx0XHRcdHRoaXMuaGVhZGVycyA9IHRoaXMuZ2VuZXJhdG9yLmdlbmVyYXRlSGVhZGVyc0Zvcih0aGlzLml0ZW1zWzBdLFwiXCIsIDUsIHRoaXMuZW5hYmxlRmlsdGVyaW5nKTtcblx0XHRcdGlmICh0aGlzLnBlcnNpc3RlbmNlS2V5KSB7XG5cdFx0XHRcdHRoaXMuZ2VuZXJhdG9yLnBlcnNpc3RIZWFkZXJzKHRoaXMucGVyc2lzdGVuY2VLZXksIHRoaXMucGVyc2lzdGVuY2VJZCwgdGhpcy5oZWFkZXJzKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5maWx0ZXJlZEl0ZW1zID0gdGhpcy5pdGVtcztcblx0XHR0aGlzLnBhZ2VJbmZvLmNvbnRlbnRTaXplID0gdGhpcy5pdGVtcy5sZW5ndGg7XG5cdFx0XG5cdFx0dGhpcy5yZWNvbmZpZ3VyZSh0aGlzLmhlYWRlcnMpO1xuXG5cdH1cblxuXHRldmFsdWF0ZVBvc2l0aW9uaW5nKCkge1xuXHRcdHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKFxuXHRcdFx0dGhpcy51bmxvY2tlZFRhYmxlLmVsLm5hdGl2ZUVsZW1lbnQsXG5cdFx0XHRcIm1hcmdpbi1sZWZ0XCIsXG5cdFx0XHR0aGlzLmxvY2tlZFRhYmxlLm9mZnNldFdpZHRoKCkrXCJweFwiKTtcblx0fVxuXG5cdHJlY29uZmlndXJlKGV2ZW50KSB7XG5cdFx0dGhpcy5oZWFkZXJzID0gZXZlbnQ7XG5cdFx0dGhpcy5sb2NrZWRIZWFkZXJzID0gdGhpcy5oZWFkZXJzLmZpbHRlciggKGl0ZW0pID0+IGl0ZW0ubG9ja2VkID09PSB0cnVlICYmIGl0ZW0ucHJlc2VudCk7XG5cdFx0dGhpcy51bmxvY2tlZEhlYWRlcnMgPSB0aGlzLmhlYWRlcnMuZmlsdGVyKCAoaXRlbSkgPT4gaXRlbS5sb2NrZWQgIT09IHRydWUgICYmIGl0ZW0ucHJlc2VudCk7XHRcblx0XHR0aGlzLm9uY29uZmlndXJhdGlvbmNoYW5nZS5lbWl0KGV2ZW50KTtcblxuXHRcdGlmICh0aGlzLnBlcnNpc3RlbmNlS2V5KSB7XG5cdFx0XHR0aGlzLmdlbmVyYXRvci5wZXJzaXN0SGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQsIHRoaXMuaGVhZGVycyk7XG5cdFx0fVxuXHRcdHNldFRpbWVvdXQodGhpcy5ldmFsdWF0ZVBvc2l0aW9uaW5nLmJpbmQodGhpcyksMTExKTtcblx0fVxuXG5cdG9ubG9jayhldmVudCkge1xuXHRcdHRoaXMubG9ja2VkSGVhZGVycyA9IHRoaXMuaGVhZGVycy5maWx0ZXIoIChpdGVtKSA9PiBpdGVtLmxvY2tlZCA9PT0gdHJ1ZSAmJiBpdGVtLnByZXNlbnQpO1xuXHRcdHRoaXMudW5sb2NrZWRIZWFkZXJzID0gdGhpcy5oZWFkZXJzLmZpbHRlciggKGl0ZW0pID0+IGl0ZW0ubG9ja2VkICE9PSB0cnVlICAmJiBpdGVtLnByZXNlbnQpO1x0XG5cdFx0dGhpcy5vbmNvbmZpZ3VyYXRpb25jaGFuZ2UuZW1pdChldmVudCk7XG5cblx0XHRpZiAodGhpcy5wZXJzaXN0ZW5jZUtleSkge1xuXHRcdFx0dGhpcy5nZW5lcmF0b3IucGVyc2lzdEhlYWRlcnModGhpcy5wZXJzaXN0ZW5jZUtleSwgdGhpcy5wZXJzaXN0ZW5jZUlkLCB0aGlzLmhlYWRlcnMpO1xuXHRcdH1cblx0XHRzZXRUaW1lb3V0KHRoaXMuZXZhbHVhdGVQb3NpdGlvbmluZy5iaW5kKHRoaXMpLDExMSk7XG5cdH1cblx0Y2hhbmdlTG9ja2VkVGFibGVGaWx0ZXJlZEl0ZW1zKGV2ZW50KSB7XG5cdFx0aWYgKHRoaXMubG9ja2VkVGFibGUpIHtcblx0XHRcdHRoaXMubG9ja2VkVGFibGUuZmlsdGVyZWRJdGVtcyA9IGV2ZW50O1xuXHRcdFx0dGhpcy5sb2NrZWRUYWJsZS5pbml0VmlzaWJsZVJvd3MoKTtcblx0XHR9XG5cdH1cblx0Y2hhbmdlVW5sb2NrZWRUYWJsZUZpbHRlcmVkSXRlbXMoZXZlbnQpIHtcblx0XHRpZiAodGhpcy51bmxvY2tlZFRhYmxlKSB7XG5cdFx0XHR0aGlzLnVubG9ja2VkVGFibGUuZmlsdGVyZWRJdGVtcyA9IGV2ZW50O1xuXHRcdFx0dGhpcy51bmxvY2tlZFRhYmxlLmluaXRWaXNpYmxlUm93cygpO1xuXHRcdH1cblx0fVxuXHRvblBhZ2luYXRpb25DaGFuZ2UoZXZlbnQpIHtcblx0XHR0aGlzLnBhZ2VJbmZvID0gZXZlbnQ7XG5cdFx0dGhpcy51bmxvY2tlZFRhYmxlLmV2YWx1YXRlUm93cygpO1xuXHR9XG5cblx0dGFibGVBY3Rpb24oZXZlbnQpIHtcblx0XHR0aGlzLm9uYWN0aW9uLmVtaXQoZXZlbnQpXG5cdH1cblxuXHRvbkRyb3AoZXZlbnQ6RHJvcEV2ZW50KXtcblxuXHR9XG5cdG9uQ2VsbEVkaXQoZXZlbnQpe1xuXHRcdHRoaXMub25DZWxsQ29udGVudEVkaXQuZW1pdChldmVudCk7XG5cdH1cbn1cblxuIiwiaW1wb3J0IHtcclxuICAgIERpcmVjdGl2ZSxcclxuICAgIEVsZW1lbnRSZWYsXHJcbiAgICBIb3N0TGlzdGVuZXIsXHJcbiAgICBJbnB1dCxcclxuICAgIE91dHB1dCxcclxuICAgIFJlbmRlcmVyLFxyXG4gICAgRXZlbnRFbWl0dGVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnW3RhYmxlU29ydF0nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUYWJsZVNvcnREaXJlY3RpdmUge1xyXG4gICAgXHJcbiAgICBASW5wdXQoJ21lZGl1bScpXHJcbiAgICBtZWRpdW06IGFueTtcclxuICAgICAgICBcclxuICAgIEBJbnB1dCgnaGVhZGVycycpXHJcbiAgICBoZWFkZXJzOiBhbnk7XHJcbiAgICAgICAgXHJcbiAgICBASW5wdXQoKVxyXG4gICAgZHJvcEVmZmVjdCA9IFwibW92ZVwiO1xyXG4gICAgICAgIFxyXG4gICAgQElucHV0KFwidGFibGVTb3J0XCIpXHJcbiAgICB0YWJsZVNvcnQgPSAocGF0aCkgPT4ge307XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyLFxyXG4gICAgICAgIHByaXZhdGUgZWw6IEVsZW1lbnRSZWZcclxuICAgICkge31cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBoZWFkZXJDb2x1bW5FbGVtZW50cygpIHtcclxuXHRcdHJldHVybiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZS5jaGlsZHJlbjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZpbmRDb2x1bW5XaXRoSUQoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSB0aGlzLmhlYWRlckNvbHVtbkVsZW1lbnRzKCk7XHJcblx0XHRsZXQgY29sdW1uID0gbnVsbDtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAobGlzdFtpXS5nZXRBdHRyaWJ1dGUoXCJpZFwiKSA9PT0gaWQpIHtcclxuXHRcdFx0XHRjb2x1bW4gPSBsaXN0W2ldO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY29sdW1uO1xyXG5cdH1cclxuXHJcblx0c29ydChpY29uKSB7XHJcblx0XHRpZiAodGhpcy5tZWRpdW0uc29ydGFibGUpIHtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlYWRlcnMubGVuZ3RoIDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoID0gdGhpcy5oZWFkZXJzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChoLmtleSAhPT0gdGhpcy5tZWRpdW0ua2V5KSB7XHJcblx0XHRcdFx0XHRjb25zdCBpdGVtID0gdGhpcy5maW5kQ29sdW1uV2l0aElEKGgua2V5KTtcclxuXHJcblx0XHRcdFx0XHRpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhpdGVtLCBcImFzY2VuZGluZ1wiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGl0ZW0sIFwiZGVzY2VuZGluZ1wiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGl0ZW0sIFwic29ydGFibGVcIiwgdHJ1ZSk7XHJcblx0XHRcdFx0XHR9XHJcbiAgICAgICAgICAgICAgICAgICAgaC5kZXNjZW5kaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaC5hc2NlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoaWNvbiwgXCJmYS1zb3J0XCIsIGZhbHNlKTtcclxuXHRcdFx0aWYgKHRoaXMubWVkaXVtLmFzY2VuZGluZyB8fCAoIXRoaXMubWVkaXVtLmFzY2VuZGluZyAmJiAhdGhpcy5tZWRpdW0uZGVzY2VuZGluZykpIHtcclxuXHRcdFx0XHR0aGlzLm1lZGl1bS5kZXNjZW5kaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHR0aGlzLm1lZGl1bS5hc2NlbmRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGljb24sIFwiZmEtc29ydC1hc2NcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoaWNvbiwgXCJmYS1zb3J0LWRlc2NcIiwgdHJ1ZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5tZWRpdW0uZGVzY2VuZGluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdHRoaXMubWVkaXVtLmFzY2VuZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhpY29uLCBcImZhLXNvcnQtZGVzY1wiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhpY29uLCBcImZhLXNvcnQtYXNjXCIsIHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMudGFibGVTb3J0KHRoaXMubWVkaXVtLmtleS5zcGxpdChcIi5cIikpO1xyXG5cdFx0fVxyXG5cdH1cclxufSIsIi8qXHJcbiogUHJvdmlkZXMgcmVuZGVyaW5nIG9mIGZsZXhpYmxlIHRhYmxlIGluIGEgbGF6eSBsb2FkIGZhc2hpb24uXHJcbiovXHJcbmltcG9ydCB7IE5nTW9kdWxlLCBDVVNUT01fRUxFTUVOVFNfU0NIRU1BIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7SW50b1BpcGVNb2R1bGV9IGZyb20gJ2ludG8tcGlwZXMnO1xyXG5pbXBvcnQgeyBEcmFnRHJvcE1vZHVsZSB9IGZyb20gJ2RyYWctZW5hYmxlZCc7XHJcblxyXG5pbXBvcnQgeyBQYWdpbmF0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3BhZ2luYXRpb24uY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ29uZmlndXJhdGlvbkNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9jb25maWd1cmF0aW9uLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFRhYmxlVmlld0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90YWJsZS5jb21wb25lbnQnO1xyXG5cclxuaW1wb3J0IHsgVGFibGVIZWFkZXJzR2VuZXJhdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlLWhlYWRlcnMtZ2VuZXJhdG9yJztcclxuaW1wb3J0IHsgRmxleGlibGVUYWJsZUNvbXBvbmVudCB9IGZyb20gJy4vZmxleGlibGUudGFibGUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTG9ja1RhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi9sb2NrLnRhYmxlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFRhYmxlU29ydERpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy90YWJsZS1zb3J0LmRpcmVjdGl2ZSc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gICAgaW1wb3J0czogW1xyXG4gICAgICAgIENvbW1vbk1vZHVsZSxcclxuICAgICAgICBEcmFnRHJvcE1vZHVsZSxcclxuICAgICAgICBJbnRvUGlwZU1vZHVsZVxyXG4gICAgXSxcclxuICAgIGRlY2xhcmF0aW9uczogW1xyXG4gICAgICAgIEZsZXhpYmxlVGFibGVDb21wb25lbnQsXHJcbiAgICAgICAgTG9ja1RhYmxlQ29tcG9uZW50LFxyXG4gICAgICAgIENvbmZpZ3VyYXRpb25Db21wb25lbnQsXHJcbiAgICAgICAgUGFnaW5hdGlvbkNvbXBvbmVudCxcclxuICAgICAgICBUYWJsZVZpZXdDb21wb25lbnQsXHJcbiAgICAgICAgVGFibGVTb3J0RGlyZWN0aXZlXHJcbiAgICBdLFxyXG4gICAgZXhwb3J0czogW1xyXG4gICAgICAgIEZsZXhpYmxlVGFibGVDb21wb25lbnQsXHJcbiAgICAgICAgTG9ja1RhYmxlQ29tcG9uZW50XHJcbiAgICBdLFxyXG4gICAgZW50cnlDb21wb25lbnRzOiBbXHJcbiAgICBdLFxyXG4gICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgVGFibGVIZWFkZXJzR2VuZXJhdG9yXHJcbiAgICBdLFxyXG4gICAgc2NoZW1hczogW0NVU1RPTV9FTEVNRU5UU19TQ0hFTUFdXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgRmxleGlibGVUYWJsZU1vZHVsZSB7fVxyXG4iXSwibmFtZXMiOlsiSW5qZWN0YWJsZSIsIkV2ZW50RW1pdHRlciIsIkNvbXBvbmVudCIsIklucHV0IiwiT3V0cHV0IiwiVmlld0NoaWxkIiwiRWxlbWVudFJlZiIsIlZpZXdDb250YWluZXJSZWYiLCJSZW5kZXJlciIsIkRpcmVjdGl2ZSIsIk5nTW9kdWxlIiwiQ29tbW9uTW9kdWxlIiwiRHJhZ0Ryb3BNb2R1bGUiLCJJbnRvUGlwZU1vZHVsZSIsIkNVU1RPTV9FTEVNRU5UU19TQ0hFTUEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O1FBaUJFOzJCQUZrQixFQUFFO1NBR25COzs7Ozs7OztRQUVELGtEQUFrQjs7Ozs7OztZQUFsQixVQUFtQixJQUFRLEVBQUUsSUFBWSxFQUFFLFVBQWtCLEVBQUUsZ0JBQXlCO2dCQUF4RixpQkFrQ0M7Z0JBaENDLElBQUksSUFBSSxLQUFLLElBQUksRUFBRTtvQkFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUUsVUFBQyxHQUFHOzt3QkFDekIsSUFBTSxTQUFTLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQzt3QkFFM0QsSUFBSSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLElBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUSxJQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsRUFBRTs7NEJBQ3BHLElBQU0s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UUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ25GO3lCQUFNLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTt3QkFDL0IsTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxVQUFVLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUNyRjt5QkFBTSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFOzt3QkFDdEUsSUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDaEMsTUFBTSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFBO3FCQUM3Qzt5QkFBTSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFOzt3QkFDdEUsSUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbkQsTUFBTSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUM1Qjt5QkFBTSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxF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