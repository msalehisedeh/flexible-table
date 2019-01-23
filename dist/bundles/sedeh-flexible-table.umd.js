(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@sedeh/into-pipes'), require('@sedeh/drag-enabled')) :
    typeof define === 'function' && define.amd ? define('@sedeh/flexible-table', ['exports', '@angular/core', '@angular/common', '@sedeh/into-pipes', '@sedeh/drag-enabled'], factory) :
    (factory((global.sedeh = global.sedeh || {}, global.sedeh['flexible-table'] = {}),global.ng.core,global.ng.common,global['into-pipes'],global['drag-enabled']));
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
                            TableViewComponent
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
    exports.ɵb = LockTableComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VkZWgtZmxleGlibGUtdGFibGUudW1kLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9Ac2VkZWgvZmxleGlibGUtdGFibGUvc3JjL2FwcC9mbGV4aWJsZS10YWJsZS9jb21wb25lbnRzL3RhYmxlLWhlYWRlcnMtZ2VuZXJhdG9yLnRzIiwibmc6Ly9Ac2VkZWgvZmxleGlibGUtdGFibGUvc3JjL2FwcC9mbGV4aWJsZS10YWJsZS9mbGV4aWJsZS50YWJsZS5jb21wb25lbnQudHMiLCJuZzovL0BzZWRlaC9mbGV4aWJsZS10YWJsZS9zcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2NvbXBvbmVudHMvcGFnaW5hdGlvbi5jb21wb25lbnQudHMiLCJuZzovL0BzZWRlaC9mbGV4aWJsZS10YWJsZS9zcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2NvbXBvbmVudHMvY29uZmlndXJhdGlvbi5jb21wb25lbnQudHMiLCJuZzovL0BzZWRlaC9mbGV4aWJsZS10YWJsZS9zcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50LnRzIiwibmc6Ly9Ac2VkZWgvZmxleGlibGUtdGFibGUvc3JjL2FwcC9mbGV4aWJsZS10YWJsZS9sb2NrLnRhYmxlLmNvbXBvbmVudC50cyIsIm5nOi8vQHNlZGVoL2ZsZXhpYmxlLXRhYmxlL3NyYy9hcHAvZmxleGlibGUtdGFibGUvZmxleGlibGUtdGFibGUtbW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIFRoaXMgb2JqZWN0IHdpbGwgdHJhdmVyc2UgdGhyb3VnaCBhIGdpdmVuIGpzb24gb2JqZWN0IGFuZCBmaW5kcyBhbGwgdGhlIGF0dHJpYnV0ZXMgb2YgXHJcbiAqIHRoZSBvYmplY3QgYW5kIGl0cyByZWxhdGVkIGFzc29jaWF0aW9ucyB3aXRoaW4gdGhlIGpzb24uIFRoZSByZXN1bHRpbmcgc3RydWN0dXJlIHdvdWxkIGJlIFxyXG4gKiBuYW1lIG9mIGF0dHJpYnV0ZXMgYW5kIGEgcGF0aHdheSB0byByZWFjaCB0aGUgYXR0cmlidXRlIGRlZXAgaW4gb2JqZWN0IGhlaXJhcmNoeS5cclxuICovXHJcblxyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFZpc3VhbGl6YXRpb25Qb2ludCB7XHJcbiAga2V5OiBzdHJpbmcsXHJcbiAgdmFsdWU6IHN0cmluZ1xyXG59XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBUYWJsZUhlYWRlcnNHZW5lcmF0b3Ige1xyXG4gIHByaXZhdGUgaGVhZGVycyA9IFtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICB9XHJcblxyXG4gIGdlbmVyYXRlSGVhZGVyc0Zvcihyb290OiB7fSwgcGF0aDogc3RyaW5nLCBtYXhWaXNpYmxlOiBudW1iZXIsIGZpbHRlcmluZ0VuYWJsZWQ6IGJvb2xlYW4pIHtcclxuXHJcbiAgICBpZiAocm9vdCAhPT0gbnVsbCkge1xyXG4gICAgICBPYmplY3Qua2V5cyhyb290KS5tYXAoIChrZXkpID0+IHtcclxuICAgICAgICBjb25zdCBpbm5lclBhdGggPSAocGF0aC5sZW5ndGggPyAocGF0aCArIFwiLlwiICsga2V5KSA6IGtleSk7XHJcbiAgXHJcbiAgICAgICAgaWYgKHR5cGVvZiByb290W2tleV0gPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHJvb3Rba2V5XSA9PT0gXCJudW1iZXJcIiB8fCB0eXBlb2Ygcm9vdFtrZXldID09PSBcImJvb2xlYW5cIikge1xyXG4gICAgICAgICAgY29uc3QgaGVhZGVyOiBhbnkgPSB7XHJcbiAgICAgICAgICAgIGtleTogaW5uZXJQYXRoLFxyXG4gICAgICAgICAgICB2YWx1ZTogdGhpcy5tYWtlV29yZHMoaW5uZXJQYXRoKSxcclxuICAgICAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGRyYWdhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBwcmVzZW50OiAocGF0aC5sZW5ndGggPT09IDAgJiYgdGhpcy5oZWFkZXJzLmxlbmd0aCA8IG1heFZpc2libGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoZmlsdGVyaW5nRW5hYmxlZCkge1xyXG4gICAgICAgICAgICBoZWFkZXIuZmlsdGVyID0gXCJcIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuaGVhZGVycy5wdXNoKGhlYWRlcik7XHJcbiAgICAgICAgfSBlbHNlIGlmIChyb290W2tleV0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgY29uc3Qgbm9kZSA9IHJvb3Rba2V5XTtcclxuICAgICAgICAgIGlmIChub2RlLmxlbmd0aCAmJiAhKG5vZGVbMF0gaW5zdGFuY2VvZiBBcnJheSkgJiYgKHR5cGVvZiBub2RlWzBdICE9PSBcInN0cmluZ1wiKSkge1xyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlSGVhZGVyc0Zvcihub2RlWzBdLCBpbm5lclBhdGgsIG1heFZpc2libGUsIGZpbHRlcmluZ0VuYWJsZWQpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5oZWFkZXJzLnB1c2goe1xyXG4gICAgICAgICAgICAgIGtleTogaW5uZXJQYXRoLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiB0aGlzLm1ha2VXb3Jkcyhpbm5lclBhdGgpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuZ2VuZXJhdGVIZWFkZXJzRm9yKHJvb3Rba2V5XSwgaW5uZXJQYXRoLCBtYXhWaXNpYmxlLCBmaWx0ZXJpbmdFbmFibGVkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuaGVhZGVycztcclxuICB9XHJcblxyXG4gIHJldHJlaXZlSGVhZGVycyhrZXksIHRyYWNraW5na2V5KSB7XHJcbiAgICBsZXQgcmVzdWx0OiBhbnk7XHJcbiAgICB0cnkge1xyXG4gICAgICByZXN1bHQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0cmFja2luZ2tleSk7XHJcblxyXG4gICAgICBpZiAoIXJlc3VsdCB8fCByZXN1bHQgIT0ga2V5KSB7XHJcbiAgICAgICAgcmVzdWx0ID0gdW5kZWZpbmVkOyAvLyB3ZSBoYXZlIGEgbmV3ZXIgdmVyc2lvbiBhbmQgaXQgd2lsbCBvdmVycmlkZSBzYXZlZCBkYXRhLlxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc3VsdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0ID8gSlNPTi5wYXJzZShyZXN1bHQpIDogcmVzdWx0O1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgcGVyc2lzdEhlYWRlcnMoa2V5LCB0cmFja2luZ2tleSwgaGVhZGVycykge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odHJhY2tpbmdrZXkpO1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0cmFja2luZ2tleSwga2V5KTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShoZWFkZXJzKSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG1ha2VXb3JkcyhuYW1lKSB7XHJcbiAgICByZXR1cm4gbmFtZVxyXG4gICAgICAgICAgICAucmVwbGFjZSgvXFwuL2csJyB+ICcpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC8oW0EtWl0pL2csICcgJDEnKVxyXG4gICAgICAgICAgICAucmVwbGFjZSgvLS9nLFwiIFwiKVxyXG4gICAgICAgICAgICAucmVwbGFjZSgvXy9nLFwiIFwiKVxyXG4gICAgICAgICAgICAucmVwbGFjZSgvXi4vLCAoc3RyKSA9PiBzdHIudG9VcHBlckNhc2UoKSk7XHJcbiAgfVxyXG59XHJcbiIsIi8qXHJcbiogUHJvdmlkZXMgcmVuZGVyaW5nIG9mIGEgdGFibGUgd2hpY2ggaXMgdXNpbmcgdGhlIGdpdmVuIEZsZXhpYmxlVGFibGVIZWFkZXIgc2V0IGluXHJcbiogb3JkZXIgdG8gdGFidWxhdGUgdGhlIGdpdmVuIGRhdGEuIEFzIHBlciBkZWZpbml0aW9uIG9mIGVhcmNoIGhlYWRlciBjb21wb25lbnQsXHJcbiogYSBjb2x1bW4gY291bGQgYmUgaGlkZGVuLCBzb3J0YWJsZSwgb3IgZHJhZ2dhYmxlLiBFYWNoIHRhYmxlIHJvdyBjYW4gZXhwYW5kL2NvbGxhcHNlXHJcbiogb3IgcmVzcG9uZCB0byBhIGNsaWNrIGFjdGlvbi5cclxuKi9cclxuaW1wb3J0IHtcclxuICAgIENvbXBvbmVudCxcclxuXHRJbnB1dCxcclxuXHRPdXRwdXQsXHJcblx0Vmlld0NoaWxkLFxyXG5cdFZpZXdDb250YWluZXJSZWYsXHJcblx0T25Jbml0LFxyXG5cdEV2ZW50RW1pdHRlclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgRHJvcEV2ZW50LCBEcmFnRXZlbnQgfSBmcm9tICdAc2VkZWgvZHJhZy1lbmFibGVkJztcclxuaW1wb3J0IHsgVGFibGVIZWFkZXJzR2VuZXJhdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlLWhlYWRlcnMtZ2VuZXJhdG9yJztcclxuaW1wb3J0IHsgVGFibGVWaWV3Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlLmNvbXBvbmVudCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuXHRzZWxlY3RvcjogJ2ZsZXhpYmxlLXRhYmxlJyxcclxuXHR0ZW1wbGF0ZVVybDogJy4vZmxleGlibGUudGFibGUuY29tcG9uZW50Lmh0bWwnLFxyXG5cdHN0eWxlVXJsczogWycuL2ZsZXhpYmxlLnRhYmxlLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIEZsZXhpYmxlVGFibGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuXHRzdWJIZWFkZXJzOmFueTtcclxuXHJcbiAgICBASW5wdXQoXCJ2b2NhYnVsYXJ5XCIpXHJcbiAgICBwdWJsaWMgdm9jYWJ1bGFyeSA9IHtcclxuXHRcdHByaW50VGFibGU6IFwiUHJpbnQgVGFibGVcIixcclxuXHRcdGNvbmZpZ3VyZVRhYmxlOiBcIkNvbmZpZ3VyZSBUYWJsZVwiLFxyXG5cdFx0Y29uZmlndXJlQ29sdW1uczogXCJDb25maWd1cmUgQ29sdW1uc1wiLFxyXG5cdFx0Y2xpY2tTb3J0OiBcIkNsaWNrIHRvIFNvcnRcIixcclxuXHRcdHNldFNpemU6IFwiU2V0IFNpemVcIixcclxuXHRcdGZpcnN0UGFnZTogXCJGaXJzdFwiLFxyXG5cdFx0bGFzdFBhZ2U6IFwiTGFzdFwiLFxyXG5cdFx0cHJldmlvdXNQYWdlOiBcIlByZXZpb3VzXCJcclxuXHR9O1xyXG5cdFxyXG4gICAgQElucHV0KFwicGVyc2lzdGVuY2VJZFwiKVxyXG4gICAgcHVibGljIHBlcnNpc3RlbmNlSWQ6IHN0cmluZztcclxuXHJcblx0QElucHV0KFwicGVyc2lzdGVuY2VLZXlcIilcclxuICAgIHB1YmxpYyBwZXJzaXN0ZW5jZUtleTogc3RyaW5nO1xyXG5cclxuICAgIEBJbnB1dChcImNhcHRpb25cIilcclxuICAgIHB1YmxpYyBjYXB0aW9uOiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KFwiYWN0aW9uXCIpXHJcbiAgICBwdWJsaWMgYWN0aW9uOiBzdHJpbmc7XHJcblxyXG4gICAgQElucHV0KFwiYWN0aW9uS2V5c1wiKVxyXG4gICAgcHVibGljIGFjdGlvbktleXM7XHJcblxyXG4gICAgQElucHV0KFwidGFibGVDbGFzc1wiKVxyXG4gICAgcHVibGljIHRhYmxlQ2xhc3MgPSAnZGVmYXVsdC1mbGV4aWJsZS10YWJsZSc7XHJcblxyXG5cdEBJbnB1dChcImhlYWRlcnNcIilcclxuXHRwdWJsaWMgaGVhZGVyczogYW55W107XHJcblxyXG5cdEBJbnB1dChcIml0ZW1zXCIpXHJcblx0cHVibGljIGl0ZW1zOiBhbnlbXTtcclxuXHJcblx0QElucHV0KFwicGFnZUluZm9cIilcclxuXHRwdWJsaWMgcGFnZUluZm86IGFueTtcclxuXHJcblx0QElucHV0KFwidGFibGVJbmZvXCIpXHJcblx0cHVibGljIHRhYmxlSW5mbzogYW55O1xyXG5cclxuICAgIEBJbnB1dChcImNvbmZpZ3VyYWJsZVwiKVxyXG4gICAgcHVibGljIGNvbmZpZ3VyYWJsZTogYm9vbGVhbjtcclxuXHJcblx0QElucHV0KFwiY29uZmlnQWRkb25cIilcclxuXHRwdWJsaWMgY29uZmlnQWRkb246IGFueTtcclxuXHJcblx0QElucHV0KFwiZW5hYmxlSW5kZXhpbmdcIilcclxuICAgIHB1YmxpYyBlbmFibGVJbmRleGluZzogYm9vbGVhbjtcclxuXHJcbiAgICBASW5wdXQoXCJlbmFibGVGaWx0ZXJpbmdcIilcclxuICAgIHB1YmxpYyBlbmFibGVGaWx0ZXJpbmc6IGJvb2xlYW47XHJcblxyXG4gICAgQElucHV0KFwicm93RGV0YWlsZXJcIilcclxuICAgIHB1YmxpYyByb3dEZXRhaWxlcjogYW55O1xyXG5cclxuICAgIEBJbnB1dChcImV4cGFuZGFibGVcIilcclxuICAgIHB1YmxpYyBleHBhbmRhYmxlOiBhbnk7XHJcblxyXG4gICAgQElucHV0KFwiZXhwYW5kSWZcIilcclxuICAgIHB1YmxpYyBleHBhbmRJZjogYm9vbGVhbjtcclxuXHJcbiAgICBASW5wdXQoXCJmaWx0ZXJ3aGlsZXR5cGluZ1wiKVxyXG4gICAgcHVibGljIGZpbHRlcndoaWxldHlwaW5nOiBib29sZWFuO1xyXG5cclxuICAgIEBJbnB1dChcInJvd0RldGFpbGVySGVhZGVyc1wiKVxyXG4gICAgcHVibGljIHJvd0RldGFpbGVySGVhZGVyczogYW55O1xyXG5cclxuXHRAT3V0cHV0KCdvbmFjdGlvbicpXHJcblx0cHJpdmF0ZSBvbmFjdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0QE91dHB1dCgnb25DZWxsQ29udGVudEVkaXQnKVxyXG5cdHByaXZhdGUgb25DZWxsQ29udGVudEVkaXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBPdXRwdXQoJ29uY29uZmlndXJhdGlvbmNoYW5nZScpXHJcblx0cHJpdmF0ZSBvbmNvbmZpZ3VyYXRpb25jaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBWaWV3Q2hpbGQoJ3ZpZXdUYWJsZScpXHJcblx0dmlld1RhYmxlOiBUYWJsZVZpZXdDb21wb25lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBnZW5lcmF0b3I6IFRhYmxlSGVhZGVyc0dlbmVyYXRvcikge31cclxuXHJcblx0bmdPbkluaXQoKSB7XHJcblx0XHRpZiAodGhpcy5wZXJzaXN0ZW5jZUtleSkge1xyXG5cdFx0XHRjb25zdCBoZWFkZXJzOmFueSA9IHRoaXMuZ2VuZXJhdG9yLnJldHJlaXZlSGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQpO1xyXG5cclxuXHRcdFx0aWYgKGhlYWRlcnMpIHtcclxuXHRcdFx0XHR0aGlzLmhlYWRlcnMgPSBoZWFkZXJzO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAoIXRoaXMuaGVhZGVycyB8fCB0aGlzLmhlYWRlcnMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdHRoaXMuaGVhZGVycyA9IHRoaXMuZ2VuZXJhdG9yLmdlbmVyYXRlSGVhZGVyc0Zvcih0aGlzLml0ZW1zWzBdLFwiXCIsIDUsIHRoaXMuZW5hYmxlRmlsdGVyaW5nKTtcclxuXHRcdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcclxuXHRcdFx0XHR0aGlzLmdlbmVyYXRvci5wZXJzaXN0SGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQsIHRoaXMuaGVhZGVycyk7XHJcblx0XHRcdH1cclxuICAgICAgICB9XHJcblx0XHRpZiAoIXRoaXMucm93RGV0YWlsZXIgJiYgdGhpcy5leHBhbmRhYmxlKSB7XHJcblx0XHRcdHRoaXMucm93RGV0YWlsZXIgPSBmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdFx0cmV0dXJuIHtkYXRhOiBpdGVtLCBoZWFkZXJzOiBbXX07XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5wYWdlSW5mbykge1xyXG5cdFx0XHRpZiAoIXRoaXMucGFnZUluZm8udG8pIHtcclxuXHRcdFx0XHR0aGlzLnBhZ2VJbmZvLnRvID0gdGhpcy5wYWdlSW5mby5wYWdlU2l6ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLnBhZ2VJbmZvLmNvbnRlbnRTaXplID0gdGhpcy5pdGVtcy5sZW5ndGg7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnBhZ2VJbmZvID0ge1xyXG4gICAgICAgICAgICAgICAgY29udGVudFNpemU6IDEwMDAwMCxcclxuICAgICAgICAgICAgICAgIHBhZ2VTaXplOiAxMDAwMDAsXHJcbiAgICAgICAgICAgICAgICBwYWdlczogMSxcclxuICAgICAgICAgICAgICAgIGZyb206IDAsXHJcbiAgICAgICAgICAgICAgICB0bzogMTAwMDAwLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudFBhZ2U6IDEsXHJcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogXCIwXCJcclxuICAgICAgICAgICAgfTtcclxuXHRcdH1cclxuXHRcdHRoaXMudXBkYXRlTGltaXRzKCk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGVMaW1pdHMoKSB7XHJcblx0XHR0aGlzLnN1YkhlYWRlcnMgPSB0aGlzLmhlYWRlcnMuZmlsdGVyKCAoaGVhZGVyKSA9PiBoZWFkZXIucHJlc2VudCA9PT0gdHJ1ZSk7XHJcblx0fVxyXG5cclxuXHRyZWNvbmZpZ3VyZShldmVudCkge1xyXG5cdFx0dGhpcy5oZWFkZXJzID0gZXZlbnQ7XHJcblx0XHR0aGlzLnVwZGF0ZUxpbWl0cygpO1xyXG5cdFx0dGhpcy5vbmNvbmZpZ3VyYXRpb25jaGFuZ2UuZW1pdChldmVudCk7XHJcblxyXG5cdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcclxuXHRcdFx0dGhpcy5nZW5lcmF0b3IucGVyc2lzdEhlYWRlcnModGhpcy5wZXJzaXN0ZW5jZUtleSwgdGhpcy5wZXJzaXN0ZW5jZUlkLCB0aGlzLmhlYWRlcnMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0b25QYWdpbmF0aW9uQ2hhbmdlKGV2ZW50KSB7XHJcblx0XHR0aGlzLnBhZ2VJbmZvID0gZXZlbnQ7XHJcblx0XHR0aGlzLnZpZXdUYWJsZS5ldmFsdWF0ZVJvd3MoKTtcclxuXHR9XHJcblxyXG5cdHRhYmxlQWN0aW9uKGV2ZW50KSB7XHJcblx0XHR0aGlzLm9uYWN0aW9uLmVtaXQoZXZlbnQpXHJcblx0fVxyXG5cclxuXHRvbkRyb3AoZXZlbnQ6RHJvcEV2ZW50KXtcclxuXHJcblx0fVxyXG5cdG9uQ2VsbEVkaXQoZXZlbnQpe1xyXG5cdFx0dGhpcy5vbkNlbGxDb250ZW50RWRpdC5lbWl0KGV2ZW50KTtcclxuXHR9XHJcbn1cclxuIiwiLypcclxuKiBQcm92aWRlcyBwYWdpbmF0aW9uIG9mIGEgZGF0YSBzZXQgaW4gYSB0YWJsZS5cclxuKi9cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFBhZ2luYXRpb25JbmZvIHtcclxuXHRjb250ZW50U2l6ZTogbnVtYmVyLFxyXG5cdHBhZ2VTaXplOiBudW1iZXIsXHJcbiAgICBtYXhXaWR0aD86IHN0cmluZyxcclxuXHRwYWdlcz86IG51bWJlcixcclxuXHRmcm9tPzogbnVtYmVyLFxyXG5cdHRvPzogbnVtYmVyLFxyXG5cdGN1cnJlbnRQYWdlPzogbnVtYmVyLFxyXG4gICAgcmVzZXRTaXplPzogYm9vbGVhblxyXG59XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAndGFibGUtcGFnaW5hdGlvbicsXHJcblx0dGVtcGxhdGVVcmw6ICcuL3BhZ2luYXRpb24uY29tcG9uZW50Lmh0bWwnLFxyXG5cdHN0eWxlVXJsczogWycuL3BhZ2luYXRpb24uY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgUGFnaW5hdGlvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gICAgQElucHV0KFwidm9jYWJ1bGFyeVwiKVxyXG4gICAgcHVibGljIHZvY2FidWxhcnkgPSB7c2V0U2l6ZTogXCJcIiwgZmlyc3RQYWdlOiBcIlwiLCBuZXh0UGFnZTogXCJcIiwgbGFzdFBhZ2U6IFwiXCIsIHByZXZpb3VzUGFnZTogXCJcIn07XHJcblxyXG4gICAgQElucHV0KFwiaW5mb1wiKVxyXG4gICAgaW5mbzogUGFnaW5hdGlvbkluZm8gPSB7IGNvbnRlbnRTaXplOiAwLCBwYWdlU2l6ZTogMCwgbWF4V2lkdGg6IFwiMFwiIH07XHJcblxyXG5cdEBPdXRwdXQoJ29uY2hhbmdlJylcclxuICAgIG9uY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAgIEBPdXRwdXQoJ29ucmVhZHknKVxyXG4gICAgb25yZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0bmdPbkluaXQoKSB7XHJcblx0XHRpZiAoIXRoaXMuaW5mbykge1xyXG5cdFx0XHR0aGlzLmluZm8gPSB7IFxyXG4gICAgICAgICAgICAgICAgY29udGVudFNpemU6IDEwMDAsIFxyXG4gICAgICAgICAgICAgICAgcGFnZVNpemU6IDEwMDAsIFxyXG4gICAgICAgICAgICAgICAgcGFnZXM6IDEsIFxyXG4gICAgICAgICAgICAgICAgZnJvbTogMCwgXHJcbiAgICAgICAgICAgICAgICB0bzogMTAwMCwgXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFnZTogMSwgXHJcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogXCIwXCIgXHJcbiAgICAgICAgICAgIH07XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5pbmZvLmNvbnRlbnRTaXplICYmIHRoaXMuaW5mby5wYWdlU2l6ZSkge1xyXG5cdFx0XHR0aGlzLmluZm8ucGFnZXMgPSBNYXRoLmNlaWwodGhpcy5pbmZvLmNvbnRlbnRTaXplIC8gdGhpcy5pbmZvLnBhZ2VTaXplKTtcclxuXHRcdFx0dGhpcy5pbmZvLmZyb20gPSAwO1xyXG5cdFx0XHR0aGlzLmluZm8udG8gPSB0aGlzLmluZm8ucGFnZVNpemUgLSAxO1xyXG5cdFx0XHR0aGlzLmluZm8uY3VycmVudFBhZ2UgPSAxO1xyXG5cdFx0ICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5yZWFkeSgpLCA2Nik7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFdpZHRoKHdpZHRoOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmluZm8ubWF4V2lkdGggPSB3aWR0aCArIFwicHhcIjtcclxuICAgIH1cclxuXHJcbiAgICByZWFkeSgpIHtcclxuICAgICAgICB0aGlzLm9ucmVhZHkuZW1pdCh0aGlzKTtcclxuICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5pbmZvKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RGaXJzdCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbmZvLmN1cnJlbnRQYWdlID4gMSkge1xyXG5cdFx0ICAgIHRoaXMuaW5mby5mcm9tID0gMDtcclxuXHRcdCAgICB0aGlzLmluZm8udG8gPSB0aGlzLmluZm8uZnJvbSArIHRoaXMuaW5mby5wYWdlU2l6ZSAtIDE7XHJcblx0XHQgICAgdGhpcy5pbmZvLmN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaW5mbyk7XHJcbiAgICAgICAgfVxyXG4gICB9XHJcblxyXG4gICBzZWxlY3ROZXh0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmluZm8uY3VycmVudFBhZ2UgPCB0aGlzLmluZm8ucGFnZXMpIHtcclxuIFx0XHR0aGlzLmluZm8uZnJvbSA9IHRoaXMuaW5mby50byArIDE7XHJcblx0XHR0aGlzLmluZm8udG8gPSB0aGlzLmluZm8uZnJvbSArIHRoaXMuaW5mby5wYWdlU2l6ZSAtIDE7XHJcblx0XHR0aGlzLmluZm8uY3VycmVudFBhZ2UrKztcclxuICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5pbmZvKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0UHJldigpIHtcclxuICAgICAgICBpZiAodGhpcy5pbmZvLmN1cnJlbnRQYWdlID4gMSkge1xyXG4gXHRcdCAgICB0aGlzLmluZm8uZnJvbSAtPSB0aGlzLmluZm8ucGFnZVNpemU7XHJcblx0XHQgICAgdGhpcy5pbmZvLnRvID0gdGhpcy5pbmZvLmZyb20gKyB0aGlzLmluZm8ucGFnZVNpemUgLSAxO1xyXG5cdFx0ICAgIHRoaXMuaW5mby5jdXJyZW50UGFnZS0tO1xyXG4gICAgICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5pbmZvKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0TGFzdCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbmZvLmN1cnJlbnRQYWdlIDwgdGhpcy5pbmZvLnBhZ2VzKSB7XHJcblx0XHQgICAgdGhpcy5pbmZvLmZyb20gPSB0aGlzLmluZm8ucGFnZVNpemUgKiAodGhpcy5pbmZvLnBhZ2VzIC0gMSk7XHJcblx0XHQgICAgdGhpcy5pbmZvLnRvID0gdGhpcy5pbmZvLmZyb20gKyB0aGlzLmluZm8ucGFnZVNpemUgLSAxO1xyXG5cdFx0ICAgIHRoaXMuaW5mby5jdXJyZW50UGFnZSA9IHRoaXMuaW5mby5wYWdlcztcclxuICAgICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaW5mbyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZUN1cnJlbnQocmFuZ2VyOiBhbnkpIHtcclxuICAgICAgICBjb25zdCB2ID0gcGFyc2VJbnQoIHJhbmdlci52YWx1ZSwgMTAgKTtcclxuICAgICAgICBpZiAodGhpcy5pbmZvLmN1cnJlbnRQYWdlIDwgdiAmJiB2ID4gMCAmJiB2IDwgdGhpcy5pbmZvLnBhZ2VzKSB7XHJcblx0XHQgICAgdGhpcy5pbmZvLmZyb20gPSB2ICogKHRoaXMuaW5mby5wYWdlU2l6ZSAtIDEpO1xyXG5cdFx0ICAgIHRoaXMuaW5mby50byA9IHRoaXMuaW5mby5mcm9tICsgdGhpcy5pbmZvLnBhZ2VTaXplIC0gMTtcclxuXHRcdCAgICB0aGlzLmluZm8uY3VycmVudFBhZ2UgPSB2O1xyXG4gICAgICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5pbmZvKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByYW5nZXIudmFsdWUgPSB0aGlzLmluZm8uY3VycmVudFBhZ2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVNpemUoc2l6ZXI6IGFueSkge1xyXG4gICAgICAgIGNvbnN0IHYgPSBwYXJzZUludCggc2l6ZXIudmFsdWUsIDEwICk7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5mby5jb250ZW50U2l6ZSA+PSB2ICYmIHYgPiAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5mby5wYWdlU2l6ZSA9IHY7XHJcbiBcdFx0XHR0aGlzLmluZm8ucGFnZXMgPSBNYXRoLmNlaWwodGhpcy5pbmZvLmNvbnRlbnRTaXplIC8gdik7XHJcbiAgICAgICAgICAgIHRoaXMuaW5mby5mcm9tID0gMDtcclxuXHRcdFx0dGhpcy5pbmZvLnRvID0gdGhpcy5pbmZvLnBhZ2VTaXplIC0gMTtcclxuXHRcdFx0dGhpcy5pbmZvLmN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaW5mbyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2l6ZXIudmFsdWUgPSB0aGlzLmluZm8ucGFnZVNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qXHJcbiogUHJvdmlkZXMgYWJpbGl0eSB0byBjb25maWd1cmUgZGlzcGxheWluZyBvZiB0YWJsZSBjb2x1bW5zLiBBcyBwZXIgZGVmaW5pdGlvbiBvZiBlYXJjaCBoZWFkZXIgY29tcG9uZW50LFxyXG4qIGEgY29sdW1uIGNvdWxkIGJlIGhpZGRlbi5cclxuKi9cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG5cdHNlbGVjdG9yOiAndGFibGUtY29uZmlndXJhdGlvbicsXHJcblx0dGVtcGxhdGVVcmw6ICcuL2NvbmZpZ3VyYXRpb24uY29tcG9uZW50Lmh0bWwnLFxyXG5cdHN0eWxlVXJsczogWycuL2NvbmZpZ3VyYXRpb24uY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ29uZmlndXJhdGlvbkNvbXBvbmVudCB7XHJcbiAgICBzaG93Q29uZmlndXJhdGlvblZpZXc6IGJvb2xlYW47XHJcblxyXG5cdEBJbnB1dChcInRpdGxlXCIpXHJcblx0cHVibGljIHRpdGxlOiBzdHJpbmc7XHJcblxyXG5cdEBJbnB1dChcImFjdGlvblwiKVxyXG5cdHB1YmxpYyBhY3Rpb246IHN0cmluZztcclxuXHJcblx0QElucHV0KFwicHJpbnRUYWJsZVwiKVxyXG5cdHB1YmxpYyBwcmludFRhYmxlOiBzdHJpbmc7XHJcblx0XHJcblx0QElucHV0KFwiaGVhZGVyc1wiKVxyXG5cdHB1YmxpYyBoZWFkZXJzOiBhbnlbXTtcclxuXHJcblx0QElucHV0KFwiY29uZmlnQWRkb25cIilcclxuXHRwdWJsaWMgY29uZmlnQWRkb246IGFueTtcclxuXHJcblx0QE91dHB1dCgnb25jaGFuZ2UnKVxyXG5cdHByaXZhdGUgb25jaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBPdXRwdXQoJ29ucHJpbnQnKVxyXG5cdHByaXZhdGUgb25wcmludCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0cmVjb25maWd1cmUoaXRlbSwgaGVhZGVyKSB7XHJcbiAgICAgICAgaGVhZGVyLnByZXNlbnQgPSBpdGVtLmNoZWNrZWQ7XHJcblx0XHR0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5oZWFkZXJzKTtcclxuXHR9XHJcblxyXG5cdGVuYWJsZUZpbHRlcihpdGVtLCBoZWFkZXIpIHtcclxuICAgICAgICBpZiAoaGVhZGVyLmZpbHRlciA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGhlYWRlci5maWx0ZXIgPSBcIlwiO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZGVsZXRlIGhlYWRlci5maWx0ZXI7XHJcblx0XHR9XHJcblx0XHR0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5oZWFkZXJzKTtcclxuXHR9XHJcblxyXG5cdHByaW50KGV2ZW50KSB7XHJcblx0XHR0aGlzLm9ucHJpbnQuZW1pdCh0cnVlKTtcclxuXHR9XHJcblxyXG4gICAga2V5dXAoZXZlbnQpIHtcclxuICAgICAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcbiAgICAgICAgaWYgKGNvZGUgPT09IDEzKSB7XHJcblx0XHRcdGV2ZW50LnRhcmdldC5jbGljaygpO1xyXG5cdFx0fVxyXG4gICAgfVxyXG59XHJcbiIsIi8qXHJcbiogUHJvdmlkZXMgcmVuZGVyaW5nIG9mIGEgdGFibGUgd2hpY2ggaXMgdXNpbmcgdGhlIGdpdmVuIEZsZXhpYmxlVGFibGVIZWFkZXIgc2V0IGluXHJcbiogb3JkZXIgdG8gdGFidWxhdGUgdGhlIGdpdmVuIGRhdGEuIEFzIHBlciBkZWZpbml0aW9uIG9mIGVhcmNoIGhlYWRlciBjb21wb25lbnQsXHJcbiogYSBjb2x1bW4gY291bGQgYmUgaGlkZGVuLCBzb3J0YWJsZSwgb3IgZHJhZ2dhYmxlLiBFYWNoIHRhYmxlIHJvdyBjYW4gZXhwYW5kL2NvbGxhcHNlXHJcbiogb3IgcmVzcG9uZCB0byBhIGNsaWNrIGFjdGlvbi5cclxuKi9cclxuaW1wb3J0IHtcclxuICAgIENvbXBvbmVudCxcclxuXHRJbnB1dCxcclxuXHRPdXRwdXQsXHJcblx0Vmlld0NoaWxkLFxyXG5cdFZpZXdDb250YWluZXJSZWYsXHJcblx0T25Jbml0LFxyXG5cdE9uQ2hhbmdlcyxcclxuXHRFdmVudEVtaXR0ZXIsXHJcblx0RWxlbWVudFJlZlxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgRHJvcEV2ZW50LCBEcmFnRXZlbnQgfSBmcm9tICdAc2VkZWgvZHJhZy1lbmFibGVkJztcclxuaW1wb3J0IHsgVGltZW91dHMgfSBmcm9tICcuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHR5cGVzL3NlbGVuaXVtLXdlYmRyaXZlcic7XHJcbmltcG9ydCB7IFRpbWUgfSBmcm9tICcuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGFuZ3VsYXIvY29tbW9uJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRmxleGlibGVUYWJsZUhlYWRlciB7XHJcblx0a2V5OiBzdHJpbmcsXHJcblx0dmFsdWU6IHN0cmluZyxcclxuXHRwcmVzZW50OiBib29sZWFuLFxyXG5cdHdpZHRoPzogc3RyaW5nLFxyXG5cdG1pbndpZHRoPzogc3RyaW5nLFxyXG5cdGZvcm1hdD86IHN0cmluZyxcclxuXHRmaWx0ZXI/OiBzdHJpbmcsXHJcblx0ZHJhZ2FibGU/OiBib29sZWFuLFxyXG5cdHNvcnRhYmxlPzogYm9vbGVhbixcclxuXHRjbGFzcz86c3RyaW5nLFxyXG5cdGxvY2tlZD86Ym9vbGVhbixcclxuXHRhc2NlbmRpbmc/OiBib29sZWFuLFxyXG5cdGRlc2NlbmRpbmc/OiBib29sZWFuXHJcbn1cclxuXHJcbkBDb21wb25lbnQoe1xyXG5cdHNlbGVjdG9yOiAndGFibGUtdmlldycsXHJcblx0dGVtcGxhdGVVcmw6ICcuL3RhYmxlLmNvbXBvbmVudC5odG1sJyxcclxuXHRzdHlsZVVybHM6IFsnLi90YWJsZS5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUYWJsZVZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XHJcblx0ZHJhZ2dpbmcgPSBmYWxzZTtcclxuXHRwcmludE1vZGUgPSBmYWxzZTtcclxuXHRmaWx0ZXJlZEl0ZW1zID0gW107XHJcblx0ZmlsdGVyaW5nVGltZXJJZDogYW55O1xyXG5cclxuICAgIEBJbnB1dChcInZvY2FidWxhcnlcIilcclxuICAgIHB1YmxpYyB2b2NhYnVsYXJ5ID0ge1xyXG5cdFx0Y29uZmlndXJlVGFibGU6IFwiQ29uZmlndXJlIFRhYmxlXCIsXHJcblx0XHRjb25maWd1cmVDb2x1bW5zOiBcIkNvbmZpZ3VyZSBDb2x1bW5zXCIsXHJcblx0XHRjbGlja1NvcnQ6IFwiQ2xpY2sgdG8gU29ydFwiLFxyXG5cdFx0c2V0U2l6ZTogXCJTZXQgU2l6ZVwiLFxyXG5cdFx0Zmlyc3RQYWdlOiBcIkZpcnN0XCIsXHJcblx0XHRsYXN0UGFnZTogXCJMYXN0XCIsXHJcblx0XHRwcmV2aW91c1BhZ2U6IFwiUHJldmlvdXNcIlxyXG5cdH07XHJcblxyXG5cdEBJbnB1dChcImxvY2thYmxlXCIpXHJcblx0bG9ja2FibGU6Ym9vbGVhbjtcclxuXHJcblx0QElucHV0KFwiY2FwdGlvblwiKVxyXG4gICAgcHVibGljIGNhcHRpb246IHN0cmluZztcclxuXHJcbiAgICBASW5wdXQoXCJhY3Rpb25cIilcclxuICAgIHB1YmxpYyBhY3Rpb246IHN0cmluZztcclxuXHJcbiAgICBASW5wdXQoXCJwYWdlSW5mb1wiKVxyXG4gICAgcHVibGljIHBhZ2VJbmZvO1xyXG5cclxuICAgIEBJbnB1dChcImFjdGlvbktleXNcIilcclxuICAgIHB1YmxpYyBhY3Rpb25LZXlzO1xyXG5cclxuICAgIEBJbnB1dChcInRhYmxlQ2xhc3NcIilcclxuICAgIHB1YmxpYyB0YWJsZUNsYXNzID0gJ2RlZmF1bHQtZmxleGlibGUtdGFibGUnO1xyXG5cclxuXHRASW5wdXQoXCJoZWFkZXJzXCIpXHJcblx0cHVibGljIGhlYWRlcnM6IGFueVtdO1xyXG5cclxuXHRASW5wdXQoXCJpdGVtc1wiKVxyXG5cdHB1YmxpYyBpdGVtczogYW55W107XHJcblxyXG5cdEBJbnB1dChcInRhYmxlSW5mb1wiKVxyXG5cdHB1YmxpYyB0YWJsZUluZm86IGFueTtcclxuXHJcbiAgICBASW5wdXQoXCJlbmFibGVJbmRleGluZ1wiKVxyXG4gICAgcHVibGljIGVuYWJsZUluZGV4aW5nOiBib29sZWFuO1xyXG5cclxuICAgIEBJbnB1dChcImVuYWJsZUZpbHRlcmluZ1wiKVxyXG4gICAgcHVibGljIGVuYWJsZUZpbHRlcmluZzogYm9vbGVhbjtcclxuXHJcbiAgICBASW5wdXQoXCJyb3dEZXRhaWxlclwiKVxyXG4gICAgcHVibGljIHJvd0RldGFpbGVyOiBhbnk7XHJcblxyXG4gICAgQElucHV0KFwiZXhwYW5kYWJsZVwiKVxyXG4gICAgcHVibGljIGV4cGFuZGFibGU6IGFueTtcclxuXHJcbiAgICBASW5wdXQoXCJleHBhbmRJZlwiKVxyXG4gICAgcHVibGljIGV4cGFuZElmOiBib29sZWFuO1xyXG5cclxuICAgIEBJbnB1dChcImZpbHRlcndoaWxldHlwaW5nXCIpXHJcbiAgICBwdWJsaWMgZmlsdGVyd2hpbGV0eXBpbmc6IGJvb2xlYW47XHJcblxyXG4gICAgQElucHV0KFwicm93RGV0YWlsZXJIZWFkZXJzXCIpXHJcbiAgICBwdWJsaWMgcm93RGV0YWlsZXJIZWFkZXJzOiBhbnk7XHJcblxyXG5cdEBPdXRwdXQoJ29uYWN0aW9uJylcclxuXHRwcml2YXRlIG9uYWN0aW9uID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHRAT3V0cHV0KCdvbmNoYW5nZScpXHJcblx0cHJpdmF0ZSBvbmNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0QE91dHB1dCgnb25maWx0ZXInKVxyXG5cdHByaXZhdGUgb25maWx0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBPdXRwdXQoJ29uQ2VsbENvbnRlbnRFZGl0JylcclxuXHRwcml2YXRlIG9uQ2VsbENvbnRlbnRFZGl0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHRAVmlld0NoaWxkKCdmbGV4aWJsZScsIHtyZWFkOiBWaWV3Q29udGFpbmVyUmVmfSkgcHJpdmF0ZSB0YWJsZTogVmlld0NvbnRhaW5lclJlZjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6RWxlbWVudFJlZikge31cclxuXHJcblxyXG5cdHByaXZhdGUgZmluZENvbHVtbldpdGhJRChpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IHRoaXMuaGVhZGVyQ29sdW1uRWxlbWVudHMoKTtcclxuXHRcdGxldCBjb2x1bW4gPSBudWxsO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmIChsaXN0W2ldLmdldEF0dHJpYnV0ZShcImlkXCIpID09PSBpZCkge1xyXG5cdFx0XHRcdGNvbHVtbiA9IGxpc3RbaV07XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBjb2x1bW47XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIHN3YXBDb2x1bW5zKHNvdXJjZTogYW55LCBkZXN0aW5hdGlvbjogYW55KSB7XHJcblxyXG5cdFx0aWYgKHNvdXJjZS5ub2RlLnBhcmVudE5vZGUgPT09IGRlc3RpbmF0aW9uLm5vZGUucGFyZW50Tm9kZSkge1xyXG5cdFx0XHRjb25zdCBzcmNJbmRleCA9IHRoaXMuZ2V0Q29sdW1uSW5kZXgoc291cmNlLm1lZGl1bS5rZXkpO1xyXG5cdFx0XHRjb25zdCBkZXNJbmRleCA9IHRoaXMuZ2V0Q29sdW1uSW5kZXgoZGVzdGluYXRpb24ubWVkaXVtLmtleSk7XHJcblx0XHRcdGlmIChzcmNJbmRleCA8IDAgfHwgZGVzSW5kZXggPCAwKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJpbnZhbGlkIGRyb3AgaWRcIiwgc291cmNlLm1lZGl1bS5rZXksIGRlc3RpbmF0aW9uLm1lZGl1bS5rZXkpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjb25zdCB4ID0gdGhpcy5maWx0ZXJlZEl0ZW1zO1xyXG5cdFx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSBbXTtcclxuXHJcblx0XHRcdHNldFRpbWVvdXQoKCk9PntcclxuXHRcdFx0XHRjb25zdCBzb2JqID0gdGhpcy5oZWFkZXJzW3NyY0luZGV4XTtcclxuXHRcdFx0XHR0aGlzLmhlYWRlcnNbc3JjSW5kZXhdID0gdGhpcy5oZWFkZXJzW2Rlc0luZGV4XTtcclxuXHRcdFx0XHR0aGlzLmhlYWRlcnNbZGVzSW5kZXhdID0gc29iajtcclxuXHRcdFx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSB4O1xyXG5cclxuXHRcdFx0XHR0aGlzLm9uZmlsdGVyLmVtaXQodGhpcy5maWx0ZXJlZEl0ZW1zKTtcclxuXHRcdFx0XHR0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5oZWFkZXJzKTtcclxuXHRcdFx0fSwgMzMpO1xyXG5cdFxyXG5cdFx0fSBlbHNlIGlmIChzb3VyY2UubWVkaXVtLmxvY2tlZCB8fCBkZXN0aW5hdGlvbi5tZWRpdW0ubG9ja2VkKSB7XHJcblx0XHRcdGNvbnN0IHggPSB0aGlzLmZpbHRlcmVkSXRlbXM7XHJcblx0XHRcdHRoaXMuZmlsdGVyZWRJdGVtcyA9IFtdO1xyXG5cdFx0XHR0aGlzLm9uZmlsdGVyLmVtaXQodGhpcy5maWx0ZXJlZEl0ZW1zKTtcclxuXHRcdFx0c2V0VGltZW91dCgoKT0+e1xyXG5cdFx0XHRcdHNvdXJjZS5tZWRpdW0ubG9ja2VkID0gIXNvdXJjZS5tZWRpdW0ubG9ja2VkO1xyXG5cdFx0XHRcdGRlc3RpbmF0aW9uLm1lZGl1bS5sb2NrZWQgPSAhZGVzdGluYXRpb24ubWVkaXVtLmxvY2tlZDtcclxuXHRcdFx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSB4O1xyXG5cdFx0XHRcdHRoaXMub25maWx0ZXIuZW1pdCh0aGlzLmZpbHRlcmVkSXRlbXMpO1xyXG5cdFx0XHRcdHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzLmhlYWRlcnMpO1xyXG5cdFx0XHR9LDMzKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgZ2V0Q29sdW1uSW5kZXgoaWQ6IHN0cmluZykge1xyXG5cdFx0bGV0IGluZGV4ID0gLTE7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVhZGVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAodGhpcy5oZWFkZXJzW2ldLmtleSA9PT0gaWQpIHtcclxuXHRcdFx0XHRpbmRleCA9IGk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBpbmRleDtcclxuXHR9XHJcblx0cHJpdmF0ZSBpdGVtVmFsdWUoaXRlbSwgaHBhdGgpIHtcclxuXHRcdGxldCBzdWJpdGVtID0gaXRlbTtcclxuXHRcdGhwYXRoLm1hcCggKHN1YmtleSkgPT4ge1xyXG5cdFx0XHRpZiAoc3ViaXRlbSkge1xyXG5cdFx0XHRcdHN1Yml0ZW0gPSBzdWJpdGVtW3N1YmtleV07XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0XHRyZXR1cm4gc3ViaXRlbSA9PT0gdW5kZWZpbmVkIHx8IHN1Yml0ZW0gPT09IG51bGwgfHwgc3ViaXRlbSA9PT0gXCJudWxsXCIgPyBcIlwiIDogc3ViaXRlbTtcclxuXHR9XHJcblx0aW5pdFZpc2libGVSb3dzKCkge1xyXG5cdFx0Y29uc3QgcmVzdWx0ID0gW107XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZmlsdGVyZWRJdGVtcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAoaSA+PSB0aGlzLnBhZ2VJbmZvLmZyb20gJiYgaSA8PSB0aGlzLnBhZ2VJbmZvLnRvKSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2godGhpcy5maWx0ZXJlZEl0ZW1zW2ldKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dGhpcy5maWx0ZXJlZEl0ZW1zID0gcmVzdWx0O1xyXG5cdH1cclxuXHJcblx0bG9jayhoZWFkZXI6IEZsZXhpYmxlVGFibGVIZWFkZXIsIGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHRcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0aGVhZGVyLmxvY2tlZCA9ICFoZWFkZXIubG9ja2VkO1xyXG5cdFx0dGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaGVhZGVycyk7XHJcblx0fVxyXG5cdHNvcnQoaGVhZGVyOiBGbGV4aWJsZVRhYmxlSGVhZGVyLCBpY29uKSB7XHJcblx0XHRpZiAoaGVhZGVyLnNvcnRhYmxlICYmIHRoaXMuaXRlbXMgJiYgdGhpcy5pdGVtcy5sZW5ndGgpIHtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlYWRlcnMubGVuZ3RoIDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoID0gdGhpcy5oZWFkZXJzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChoLmtleSAhPT0gaGVhZGVyLmtleSkge1xyXG5cdFx0XHRcdFx0Y29uc3QgaXRlbSA9IHRoaXMuZmluZENvbHVtbldpdGhJRChoLmtleSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKGl0ZW0pIHtcclxuXHRcdFx0XHRcdFx0aXRlbS5jbGFzc0xpc3QucmVtb3ZlKFwiYXNjZW5kaW5nXCIpO1xyXG5cdFx0XHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJkZXNjZW5kaW5nXCIpO1xyXG5cdFx0XHRcdFx0XHRpdGVtLmNsYXNzTGlzdC5hZGQoXCJzb3J0YWJsZVwiKTtcclxuXHRcdFx0XHRcdH1cclxuICAgICAgICAgICAgICAgICAgICBoLmRlc2NlbmRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBoLmFzY2VuZGluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG4gICAgICAgICAgICBpY29uLmNsYXNzTGlzdC5yZW1vdmUoXCJmYS1zb3J0XCIpO1xyXG5cdFx0XHRpZiAoaGVhZGVyLmFzY2VuZGluZyB8fCAoIWhlYWRlci5hc2NlbmRpbmcgJiYgIWhlYWRlci5kZXNjZW5kaW5nKSkge1xyXG5cdFx0XHRcdGhlYWRlci5kZXNjZW5kaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHRoZWFkZXIuYXNjZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0aWNvbi5jbGFzc0xpc3QucmVtb3ZlKFwiZmEtc29ydC1hc2NcIik7XHJcblx0XHRcdFx0aWNvbi5jbGFzc0xpc3QuYWRkKFwiZmEtc29ydC1kZXNjXCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGhlYWRlci5kZXNjZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0aGVhZGVyLmFzY2VuZGluZyA9IHRydWU7XHJcblx0XHRcdFx0aWNvbi5jbGFzc0xpc3QucmVtb3ZlKFwiZmEtc29ydC1kZXNjXCIpO1xyXG5cdFx0XHRcdGljb24uY2xhc3NMaXN0LmFkZChcImZhLXNvcnQtYXNjXCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNvbnN0IGhwYXRoID0gaGVhZGVyLmtleS5zcGxpdChcIi5cIik7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5lbmFibGVGaWx0ZXJpbmcpIHtcclxuXHRcdFx0XHR0aGlzLmZpbHRlckl0ZW1zKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5maWx0ZXJlZEl0ZW1zID0gdGhpcy5pdGVtcyA/IHRoaXMuaXRlbXMgOiBbXTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmZpbHRlcmVkSXRlbXMuc29ydCgoYSwgYikgPT4ge1xyXG5cdFx0XHRcdGNvbnN0IHYxID0gdGhpcy5pdGVtVmFsdWUoYSwgaHBhdGgpO1xyXG5cdFx0XHRcdGNvbnN0IHYyID0gdGhpcy5pdGVtVmFsdWUoYiwgaHBhdGgpO1xyXG5cclxuXHRcdFx0XHRpZiAoaGVhZGVyLmFzY2VuZGluZykge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHYxID4gdjIgPyAxIDogLTE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiB2MSA8IHYyID8gMSA6IC0xO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0dGhpcy5pbml0VmlzaWJsZVJvd3MoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG9mZnNldFdpZHRoKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMudGFibGUuZWxlbWVudC5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoO1xyXG5cdH1cclxuXHJcblx0bmdPbkNoYW5nZXMoY2hhbmdlczphbnkpIHtcclxuXHRcdC8vIGlmIChjaGFuZ2VzLml0ZW1zKSB7XHJcblx0XHQvLyBcdHRoaXMuZXZhbHVhdGVSb3dzKCk7XHJcblx0XHQvLyB9XHJcblx0fVxyXG5cclxuXHRuZ09uSW5pdCgpIHtcclxuXHRcdGlmICh0aGlzLnBhZ2VJbmZvKSB7XHJcblx0XHRcdGlmICghdGhpcy5wYWdlSW5mby50bykge1xyXG5cdFx0XHRcdHRoaXMucGFnZUluZm8udG8gPSB0aGlzLnBhZ2VJbmZvLnBhZ2VTaXplO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnBhZ2VJbmZvID0geyBcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRTaXplOiAxMDAwMDAsIFxyXG4gICAgICAgICAgICAgICAgcGFnZVNpemU6IDEwMDAwMCwgXHJcbiAgICAgICAgICAgICAgICBwYWdlczogMSwgXHJcbiAgICAgICAgICAgICAgICBmcm9tOiAwLCBcclxuICAgICAgICAgICAgICAgIHRvOiAxMDAwMDAsIFxyXG4gICAgICAgICAgICAgICAgY3VycmVudFBhZ2U6IDEsIFxyXG4gICAgICAgICAgICAgICAgbWF4V2lkdGg6IFwiMFwiIFxyXG4gICAgICAgICAgICB9O1xyXG5cdFx0fVxyXG5cdFx0aWYgKCF0aGlzLmhlYWRlcnMpIHtcclxuXHRcdFx0dGhpcy5oZWFkZXJzID0gW107XHJcblx0XHR9XHJcblx0XHR0aGlzLmV2YWx1YXRlUm93cygpO1xyXG4gICAgICAgIGlmICh0aGlzLmFjdGlvbktleXMpIHtcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb25LZXlzID0gdGhpcy5hY3Rpb25LZXlzLnNwbGl0KFwiLFwiKTtcclxuXHRcdH1cclxuXHRcdGlmICghdGhpcy5yb3dEZXRhaWxlciAmJiB0aGlzLmV4cGFuZGFibGUpIHtcclxuXHRcdFx0dGhpcy5yb3dEZXRhaWxlciA9IGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0XHRyZXR1cm4ge2RhdGE6IGl0ZW0sIGhlYWRlcnM6IFtdfTtcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHRcdGlmICghdGhpcy5leHBhbmRhYmxlKSB7XHJcblx0XHRcdHRoaXMuZXhwYW5kYWJsZSA9IGZ1bmN0aW9uKGl0ZW0sIHNob3dJY29uKSB7cmV0dXJuIHNob3dJY29ufTtcclxuXHRcdH1cclxuXHRcdGlmICghdGhpcy5yb3dEZXRhaWxlckhlYWRlcnMpIHtcclxuXHRcdFx0dGhpcy5yb3dEZXRhaWxlckhlYWRlcnMgPSAoaXRlbSkgPT4gW107XHJcblx0XHR9XHJcblx0fVxyXG5cdGV2YWx1YXRlUm93cygpIHtcclxuXHRcdGlmICh0aGlzLmVuYWJsZUZpbHRlcmluZykge1xyXG5cdFx0XHR0aGlzLmZpbHRlckl0ZW1zKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSB0aGlzLml0ZW1zID8gdGhpcy5pdGVtcyA6IFtdO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5pbml0VmlzaWJsZVJvd3MoKTtcclxuXHR9XHJcblxyXG4gICAgaGVhZGVyQ29sdW1uRWxlbWVudHMoKSB7XHJcblx0XHRsZXQgcmVzdWx0ID0gW107XHJcblxyXG5cdFx0aWYgKHRoaXMudGFibGUuZWxlbWVudC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuKSB7XHJcblx0XHRcdGNvbnN0IGxpc3QgPSB0aGlzLnRhYmxlLmVsZW1lbnQubmF0aXZlRWxlbWVudC5jaGlsZHJlbjtcclxuXHRcdFx0cmVzdWx0ID0gdGhpcy5jYXB0aW9uID8gbGlzdFsxXS5jaGlsZHJlblswXS5jaGlsZHJlbiA6IGxpc3RbMF0uY2hpbGRyZW5bMF0uY2hpbGRyZW47XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuXHRoZWFkZXJCeUlkKGlkKSB7XHJcblx0XHRsZXQgaDtcclxuXHRcdGZvciAoY29uc3QgaSBpbiB0aGlzLmhlYWRlcnMpIHtcclxuXHRcdFx0aWYgKHRoaXMuaGVhZGVyc1tpXS5rZXkgPT09IGlkKSB7XHJcblx0XHRcdFx0aCA9IHRoaXMuaGVhZGVyc1tpXTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGg7XHJcblx0fVxyXG5cclxuICAgIGNvbHVtbnNDb3VudCgpIHtcclxuXHRcdGxldCBjb3VudCA9IDA7XHJcblx0XHR0aGlzLmhlYWRlcnMubWFwKCAoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5wcmVzZW50KSB7XHJcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICB9XHJcblx0XHR9KTtcclxuICAgICAgICBpZiAodGhpcy5hY3Rpb24pIHtcclxuICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvdW50O1xyXG5cdH1cclxuXHRob3ZlcihpdGVtLCBmbGFnKSB7XHJcblx0XHRpZiAoZmxhZykge1xyXG5cdFx0XHRpdGVtLmhvdmVyID0gdHJ1ZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRlbGV0ZSBpdGVtLmhvdmVyO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dG9Dc3NDbGFzcyhoZWFkZXIpIHtcclxuXHRcdHJldHVybiBoZWFkZXIua2V5LnJlcGxhY2UoL1xcLi9nLCctJyk7XHJcblx0fVxyXG4gICAga2V5ZG93bihldmVudCwgaXRlbSkge1xyXG4gICAgICAgIGNvbnN0IGNvZGUgPSBldmVudC53aGljaDtcclxuICAgICAgICBpZiAoKGNvZGUgPT09IDEzKSB8fCAoY29kZSA9PT0gMzIpKSB7XHJcblx0XHRcdGl0ZW0uY2xpY2soKTtcclxuXHRcdH1cclxuICAgIH1cclxuICAgIG9mZlNjcmVlbk1lc3NhZ2UoaXRlbSkge1xyXG5cdFx0bGV0IG1lc3NhZ2U6IHN0cmluZyA9IHRoaXMuYWN0aW9uO1xyXG5cdFx0aWYgKHRoaXMuYWN0aW9uS2V5cykge1xyXG5cdFx0XHR0aGlzLmFjdGlvbktleXMubWFwKChrZXkpID0+IHsgbWVzc2FnZSA9IG1lc3NhZ2UucmVwbGFjZShrZXksIGl0ZW1ba2V5LnN1YnN0cmluZygxLCBrZXkubGVuZ3RoIC0gMSldKTsgfSlcclxuXHRcdH1cclxuICAgICAgICByZXR1cm4gbWVzc2FnZTtcclxuICAgIH1cclxuXHJcbiAgICBjZWxsQ29udGVudChpdGVtLCBoZWFkZXIpIHtcclxuXHRcdGxldCBjb250ZW50ID0gdGhpcy5pdGVtVmFsdWUoaXRlbSwgaGVhZGVyLmtleS5zcGxpdChcIi5cIikpO1xyXG4gICAgICAgIHJldHVybiAoY29udGVudCAhPT0gdW5kZWZpbmVkICYmIGNvbnRlbnQgIT0gbnVsbCAmJiBTdHJpbmcoY29udGVudCkubGVuZ3RoKSA/IGNvbnRlbnQgOiAnJm5ic3A7JztcclxuXHR9XHJcblxyXG5cdHJvd0RldGFpbGVyQ29udGV4dChpdGVtKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRkYXRhOiBpdGVtLFxyXG5cdFx0XHR0YWJsZUluZm86IHRoaXMudGFibGVJbmZvLFxyXG5cdFx0XHRoZWFkZXJzOiB0aGlzLnJvd0RldGFpbGVySGVhZGVycyhpdGVtKVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdGNoYW5nZUZpbHRlcihldmVudCwgaGVhZGVyKSB7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG5cclxuXHRcdGhlYWRlci5maWx0ZXIgPSBldmVudC50YXJnZXQudmFsdWU7XHJcblxyXG5cdFx0aWYgKHRoaXMuZmlsdGVyd2hpbGV0eXBpbmcgfHwgY29kZSA9PT0gMTMpIHtcclxuXHRcdFx0aWYodGhpcy5maWx0ZXJpbmdUaW1lcklkKSB7XHJcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRoaXMuZmlsdGVyaW5nVGltZXJJZCk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5maWx0ZXJpbmdUaW1lcklkID0gc2V0VGltZW91dCgoKT0+e1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVySXRlbXMoKTtcclxuXHRcdFx0XHR0aGlzLmluaXRWaXNpYmxlUm93cygpO1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVyaW5nVGltZXJJZCAgPSB1bmRlZmluZWQ7XHJcblx0XHRcdH0sIDEyMyk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGFjdGlvbkNsaWNrKGV2ZW50LCBpdGVtOiBhbnkpIHtcclxuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIGlmICh0aGlzLnJvd0RldGFpbGVyICYmICh0aGlzLmV4cGFuZElmIHx8IHRoaXMuZXhwYW5kYWJsZShpdGVtLCBmYWxzZSkpICkge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5leHBhbmRlZCkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIGl0ZW0uZXhwYW5kZWQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmV4cGFuZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMub25hY3Rpb24uZW1pdChpdGVtKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHByaW50KCkge1xyXG5cdFx0dGhpcy5wcmludE1vZGUgPSB0cnVlO1xyXG5cdFx0c2V0VGltZW91dCgoKT0+e1xyXG5cdFx0XHRjb25zdCBjb250ZW50ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmlubmVySFRNTDtcclxuXHRcdFx0dGhpcy5wcmludE1vZGUgPSBmYWxzZTtcclxuXHRcdFx0Y29uc3QgcG9wdXBXaW4gPSB3aW5kb3cub3BlbignJywgJ19ibGFuaycsICd3aWR0aD0zMDAsaGVpZ2h0PTMwMCcpO1xyXG5cdFx0XHJcblx0XHRcdHBvcHVwV2luLmRvY3VtZW50Lm9wZW4oKTtcclxuICAgICAgICBcdHBvcHVwV2luLmRvY3VtZW50LndyaXRlKCc8aHRtbD48Ym9keSBvbmxvYWQ9XCJ3aW5kb3cucHJpbnQoKVwiPicgKyBjb250ZW50ICsgJzwvaHRtbD4nKTtcclxuICAgICAgICBcdHBvcHVwV2luLmRvY3VtZW50LmNsb3NlKCk7XHJcblx0XHR9LDMpO1xyXG5cdH1cclxuXHJcblx0Ly8gPDUsICE1LCA+NSwgKkUsIEUqLCAqRSpcclxuXHRwcml2YXRlIHNob3VsZFNraXBJdGVtKHZhbHVlLCBmaWx0ZXJCeSkge1xyXG5cdFx0bGV0IHJlc3VsdCA9IGZhbHNlO1xyXG5cclxuXHRcdGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsICYmIFN0cmluZyh2YWx1ZSkubGVuZ3RoKSB7XHJcblx0XHRcdGNvbnN0IHYgPSBTdHJpbmcodmFsdWUpO1xyXG5cdFx0XHRpZiAoZmlsdGVyQnlbMF0gPT09ICc8Jykge1xyXG5cdFx0XHRcdHJlc3VsdCA9IGZpbHRlckJ5Lmxlbmd0aCA+IDEgJiYgcGFyc2VGbG9hdCh2KSA+PSBwYXJzZUZsb2F0KGZpbHRlckJ5LnN1YnN0cmluZygxKSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoZmlsdGVyQnlbMF0gPT09ICc+Jykge1xyXG5cdFx0XHRcdHJlc3VsdCA9IGZpbHRlckJ5Lmxlbmd0aCA+IDEgJiYgcGFyc2VGbG9hdCh2KSA8PSBwYXJzZUZsb2F0KGZpbHRlckJ5LnN1YnN0cmluZygxKSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoZmlsdGVyQnlbMF0gPT09ICchJykge1xyXG5cdFx0XHRcdHJlc3VsdCA9IGZpbHRlckJ5Lmxlbmd0aCA+IDEgJiYgcGFyc2VGbG9hdCh2KSA9PSBwYXJzZUZsb2F0KGZpbHRlckJ5LnN1YnN0cmluZygxKSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoZmlsdGVyQnlbMF0gPT09ICc9Jykge1xyXG5cdFx0XHRcdHJlc3VsdCA9IGZpbHRlckJ5Lmxlbmd0aCA9PSAxIHx8IHBhcnNlRmxvYXQodikgIT09IHBhcnNlRmxvYXQoZmlsdGVyQnkuc3Vic3RyaW5nKDEpKTtcclxuXHRcdFx0fSBlbHNlIGlmIChmaWx0ZXJCeVswXSA9PT0gJyonICYmIGZpbHRlckJ5W2ZpbHRlckJ5Lmxlbmd0aC0xXSAhPT0gJyonKSB7XHJcblx0XHRcdFx0Y29uc3QgZiA9IGZpbHRlckJ5LnN1YnN0cmluZygxKTtcclxuXHRcdFx0XHRyZXN1bHQgPSB2LmluZGV4T2YoZikgIT09IHYubGVuZ3RoIC0gZi5sZW5ndGhcclxuXHRcdFx0fSBlbHNlIGlmIChmaWx0ZXJCeVswXSAhPT0gJyonICYmIGZpbHRlckJ5W2ZpbHRlckJ5Lmxlbmd0aC0xXSA9PT0gJyonKSB7XHJcblx0XHRcdFx0Y29uc3QgZiA9IGZpbHRlckJ5LnN1YnN0cmluZygwLCBmaWx0ZXJCeS5sZW5ndGgtMSk7XHJcblx0XHRcdFx0cmVzdWx0ID0gdi5pbmRleE9mKGYpICE9PSAwO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGZpbHRlckJ5WzBdID09PSAnKicgJiYgZmlsdGVyQnlbZmlsdGVyQnkubGVuZ3RoLTFdID09PSAnKicpIHtcclxuXHRcdFx0XHRyZXN1bHQgPSBmaWx0ZXJCeS5sZW5ndGggPiAxICYmIHYuaW5kZXhPZiggZmlsdGVyQnkuc3Vic3RyaW5nKDEsIGZpbHRlckJ5Lmxlbmd0aC0xKSApIDwgMDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXN1bHQgPSB2LmluZGV4T2YoZmlsdGVyQnkpIDwgMDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9XHJcblx0ZmlsdGVySXRlbXMoKSB7XHJcblx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSB0aGlzLml0ZW1zID8gdGhpcy5pdGVtcy5maWx0ZXIoKGl0ZW0pID0+IHtcclxuXHRcdFx0bGV0IGtlZXBJdGVtID0gdHJ1ZTtcclxuXHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWFkZXJzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0Y29uc3QgaGVhZGVyID0gdGhpcy5oZWFkZXJzW2ldO1xyXG5cdFx0XHRcdGlmIChoZWFkZXIuZmlsdGVyICYmIGhlYWRlci5maWx0ZXIubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRjb25zdCB2ID0gdGhpcy5pdGVtVmFsdWUoaXRlbSwgaGVhZGVyLmtleS5zcGxpdChcIi5cIikpO1xyXG5cclxuXHRcdFx0XHRcdGlmICh0aGlzLnNob3VsZFNraXBJdGVtKHYsaGVhZGVyLmZpbHRlcikpIHtcclxuXHRcdFx0XHRcdFx0a2VlcEl0ZW0gPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBrZWVwSXRlbTtcclxuXHRcdH0pIDogW107XHJcblx0XHR0aGlzLm9uZmlsdGVyLmVtaXQodGhpcy5maWx0ZXJlZEl0ZW1zKTtcclxuXHR9XHJcblxyXG5cdG9uVGFibGVDZWxsRWRpdChldmVudCkge1xyXG5cdFx0Y29uc3QgaWQgPSBldmVudC5pZC5zcGxpdChcIi1cIik7XHJcblx0XHRjb25zdCBuID0gZXZlbnQubmFtZTtcclxuXHRcdGNvbnN0IHY9IGV2ZW50LnZhbHVlO1xyXG5cdFx0Y29uc3QgdCA9IHRoaXMuaXRlbXNbcGFyc2VJbnQoaWRbMV0pXTtcclxuXHJcblx0XHRpZiAodCkge1xyXG5cdFx0XHRjb25zdCBsaXN0ID0gaWRbMF0uc3BsaXQoXCIuXCIpO1xyXG5cdFx0XHRsZXQgc3ViaXRlbSA9IHRbbGlzdFswXV07XHJcblx0XHRcdGZvcihsZXQgaSA9IDE7IGkgPCAobGlzdC5sZW5ndGggLSAxKTsgaSsrKSB7XHJcblx0XHRcdFx0c3ViaXRlbSA9IHN1Yml0ZW1bbGlzdFtpXV1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoc3ViaXRlbSAmJiBsaXN0Lmxlbmd0aCA+IDEpe1xyXG5cdFx0XHRcdHN1Yml0ZW1bbGlzdFtsaXN0Lmxlbmd0aCAtIDFdXSA9IHY7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5vbkNlbGxDb250ZW50RWRpdC5lbWl0KHtuYW1lOiBuLCB2YWx1ZTogdiwgaXRlbTogdH0pO1xyXG5cdFx0fVxyXG4gICAgfVxyXG5cclxuXHRkcmFnRW5hYmxlZChldmVudDogRHJhZ0V2ZW50KSB7XHJcblx0XHRyZXR1cm4gZXZlbnQubWVkaXVtLmRyYWdhYmxlO1xyXG5cdH1cclxuXHRkcm9wRW5hYmxlZChldmVudDogRHJvcEV2ZW50KSB7XHJcblx0XHRyZXR1cm4gZXZlbnQuZGVzdGluYXRpb24ubWVkaXVtLmRyYWdhYmxlO1xyXG5cdH1cclxuXHRvbkRyYWdTdGFydChldmVudDogRHJhZ0V2ZW50KXtcclxuLy8gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlO1xyXG5cdH1cclxuXHRvbkRyYWdFbmQoZXZlbnQ6IERyYWdFdmVudCl7XHJcbiAvLyAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XHJcblx0fVxyXG5cdG9uRHJvcChldmVudDpEcm9wRXZlbnQpe1xyXG5cdFx0dGhpcy5zd2FwQ29sdW1ucyhldmVudC5zb3VyY2UsIGV2ZW50LmRlc3RpbmF0aW9uKTtcclxuXHR9XHJcbn1cclxuIiwiLypcbiogUHJvdmlkZXMgcmVuZGVyaW5nIG9mIGEgdGFibGUgd2hpY2ggaXMgdXNpbmcgdGhlIGdpdmVuIEZsZXhpYmxlVGFibGVIZWFkZXIgc2V0IGluXG4qIG9yZGVyIHRvIHRhYnVsYXRlIHRoZSBnaXZlbiBkYXRhLiBBcyBwZXIgZGVmaW5pdGlvbiBvZiBlYXJjaCBoZWFkZXIgY29tcG9uZW50LFxuKiBhIGNvbHVtbiBjb3VsZCBiZSBoaWRkZW4sIHNvcnRhYmxlLCBvciBkcmFnZ2FibGUuIEVhY2ggdGFibGUgcm93IGNhbiBleHBhbmQvY29sbGFwc2Vcbiogb3IgcmVzcG9uZCB0byBhIGNsaWNrIGFjdGlvbi5cbiovXG5pbXBvcnQge1xuICAgIENvbXBvbmVudCxcblx0SW5wdXQsXG5cdE91dHB1dCxcblx0Vmlld0NoaWxkLFxuXHRWaWV3Q29udGFpbmVyUmVmLFxuXHRPbkluaXQsXG5cdFJlbmRlcmVyLFxuXHRFbGVtZW50UmVmLFxuXHRFdmVudEVtaXR0ZXJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IERyb3BFdmVudCwgRHJhZ0V2ZW50IH0gZnJvbSAnQHNlZGVoL2RyYWctZW5hYmxlZCc7XG5pbXBvcnQgeyBUYWJsZVZpZXdDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50JztcbmltcG9ydCB7IFRhYmxlSGVhZGVyc0dlbmVyYXRvciB9IGZyb20gJy4vY29tcG9uZW50cy90YWJsZS1oZWFkZXJzLWdlbmVyYXRvcic7XG5cbkBDb21wb25lbnQoe1xuXHRzZWxlY3RvcjogJ2xvY2stdGFibGUnLFxuXHR0ZW1wbGF0ZVVybDogJy4vbG9jay50YWJsZS5jb21wb25lbnQuaHRtbCcsXG5cdHN0eWxlVXJsczogWycuL2xvY2sudGFibGUuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBMb2NrVGFibGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG5cdGxvY2tlZEhlYWRlcnM6YW55O1xuXHR1bmxvY2tlZEhlYWRlcnM6YW55O1xuXHRmaWx0ZXJlZEl0ZW1zID0gW107XG5cbiAgICBASW5wdXQoXCJ2b2NhYnVsYXJ5XCIpXG4gICAgcHVibGljIHZvY2FidWxhcnkgPSB7XG5cdFx0Y29uZmlndXJlVGFibGU6IFwiQ29uZmlndXJlIFRhYmxlXCIsXG5cdFx0Y29uZmlndXJlQ29sdW1uczogXCJDb25maWd1cmUgQ29sdW1uc1wiLFxuXHRcdGNsaWNrU29ydDogXCJDbGljayB0byBTb3J0XCIsXG5cdFx0c2V0U2l6ZTogXCJTZXQgU2l6ZVwiLFxuXHRcdGZpcnN0UGFnZTogXCJGaXJzdFwiLFxuXHRcdGxhc3RQYWdlOiBcIkxhc3RcIixcblx0XHRwcmV2aW91c1BhZ2U6IFwiUHJldmlvdXNcIlxuXHR9O1xuXG4gICAgQElucHV0KFwicGVyc2lzdGVuY2VJZFwiKVxuICAgIHB1YmxpYyBwZXJzaXN0ZW5jZUlkOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoXCJwZXJzaXN0ZW5jZUtleVwiKVxuICAgIHB1YmxpYyBwZXJzaXN0ZW5jZUtleTogc3RyaW5nO1xuXG4gICAgQElucHV0KFwiY2FwdGlvblwiKVxuICAgIHB1YmxpYyBjYXB0aW9uOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoXCJhY3Rpb25cIilcbiAgICBwdWJsaWMgYWN0aW9uOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoXCJhY3Rpb25LZXlzXCIpXG4gICAgcHVibGljIGFjdGlvbktleXM7XG5cbiAgICBASW5wdXQoXCJ0YWJsZUNsYXNzXCIpXG4gICAgcHVibGljIHRhYmxlQ2xhc3MgPSAnZGVmYXVsdC1mbGV4aWJsZS10YWJsZSc7XG5cblx0QElucHV0KFwiaGVhZGVyc1wiKVxuXHRwdWJsaWMgaGVhZGVyczogYW55W107XG5cblx0QElucHV0KFwiaXRlbXNcIilcblx0cHVibGljIGl0ZW1zOiBhbnlbXTtcblxuXHRASW5wdXQoXCJwYWdlSW5mb1wiKVxuXHRwdWJsaWMgcGFnZUluZm86IGFueTtcblxuXHRASW5wdXQoXCJ0YWJsZUluZm9cIilcblx0cHVibGljIHRhYmxlSW5mbzogYW55O1xuXG4gICAgQElucHV0KFwiY29uZmlndXJhYmxlXCIpXG4gICAgcHVibGljIGNvbmZpZ3VyYWJsZTogYm9vbGVhbjtcblxuXHRASW5wdXQoXCJjb25maWdBZGRvblwiKVxuXHRwdWJsaWMgY29uZmlnQWRkb246IGFueTtcblxuXHRASW5wdXQoXCJlbmFibGVGaWx0ZXJpbmdcIilcbiAgICBwdWJsaWMgZW5hYmxlRmlsdGVyaW5nOiBib29sZWFuO1xuXG4gICAgQElucHV0KFwiZW5hYmxlSW5kZXhpbmdcIilcbiAgICBwdWJsaWMgZW5hYmxlSW5kZXhpbmc6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoXCJmaWx0ZXJ3aGlsZXR5cGluZ1wiKVxuICAgIHB1YmxpYyBmaWx0ZXJ3aGlsZXR5cGluZzogYm9vbGVhbjtcblxuXG5cdEBPdXRwdXQoJ29uYWN0aW9uJylcblx0cHJpdmF0ZSBvbmFjdGlvbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuXHRAT3V0cHV0KCdvbkNlbGxDb250ZW50RWRpdCcpXG5cdHByaXZhdGUgb25DZWxsQ29udGVudEVkaXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cblx0QE91dHB1dCgnb25jb25maWd1cmF0aW9uY2hhbmdlJylcblx0cHJpdmF0ZSBvbmNvbmZpZ3VyYXRpb25jaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cblx0QFZpZXdDaGlsZCgnbG9ja2VkVGFibGUnKVxuXHRwcml2YXRlIGxvY2tlZFRhYmxlOiBUYWJsZVZpZXdDb21wb25lbnQ7XG5cblx0QFZpZXdDaGlsZCgndW5sb2NrZWRUYWJsZScpXG5cdHByaXZhdGUgdW5sb2NrZWRUYWJsZTogVGFibGVWaWV3Q29tcG9uZW50O1xuXG4gICAgc2Nyb2xsKGV2ZW50KSB7XG5cdFx0dGhpcy5yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUoXG5cdFx0XHRcdHRoaXMubG9ja2VkVGFibGUuZWwubmF0aXZlRWxlbWVudCxcblx0XHRcdFx0XCJsZWZ0XCIsXG5cdFx0XHRcdGV2ZW50LnRhcmdldC5zY3JvbGxMZWZ0K1wicHhcIik7XG5cdH1cblxuICAgIGNvbnN0cnVjdG9yKFxuXHRcdHByaXZhdGUgZ2VuZXJhdG9yOiBUYWJsZUhlYWRlcnNHZW5lcmF0b3IsXG5cdFx0cHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXJcblx0KSB7fVxuXG5cdG5nT25Jbml0KCkge1xuXHRcdGlmICh0aGlzLnBhZ2VJbmZvKSB7XG5cdFx0XHRpZiAoIXRoaXMucGFnZUluZm8udG8pIHtcblx0XHRcdFx0dGhpcy5wYWdlSW5mby50byA9IHRoaXMucGFnZUluZm8ucGFnZVNpemU7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMucGFnZUluZm8gPSB7XG4gICAgICAgICAgICAgICAgY29udGVudFNpemU6IDEwMDAwMCxcbiAgICAgICAgICAgICAgICBwYWdlU2l6ZTogMTAwMDAwLFxuICAgICAgICAgICAgICAgIHBhZ2VzOiAxLFxuICAgICAgICAgICAgICAgIGZyb206IDAsXG4gICAgICAgICAgICAgICAgdG86IDEwMDAwMCxcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFnZTogMSxcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogXCIwXCJcbiAgICAgICAgICAgIH07XG5cdFx0fVxuXHRcdGlmICh0aGlzLnBlcnNpc3RlbmNlS2V5KSB7XG5cdFx0XHRjb25zdCBoZWFkZXJzOmFueSA9IHRoaXMuZ2VuZXJhdG9yLnJldHJlaXZlSGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQpO1xuXG5cdFx0XHRpZiAoaGVhZGVycykge1xuXHRcdFx0XHR0aGlzLmhlYWRlcnMgPSBoZWFkZXJzO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoIXRoaXMuaGVhZGVycykge1xuXHRcdFx0dGhpcy5oZWFkZXJzID0gdGhpcy5nZW5lcmF0b3IuZ2VuZXJhdGVIZWFkZXJzRm9yKHRoaXMuaXRlbXNbMF0sXCJcIiwgNSwgdGhpcy5lbmFibGVGaWx0ZXJpbmcpO1xuXHRcdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcblx0XHRcdFx0dGhpcy5nZW5lcmF0b3IucGVyc2lzdEhlYWRlcnModGhpcy5wZXJzaXN0ZW5jZUtleSwgdGhpcy5wZXJzaXN0ZW5jZUlkLCB0aGlzLmhlYWRlcnMpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLmZpbHRlcmVkSXRlbXMgPSB0aGlzLml0ZW1zO1xuXHRcdHRoaXMucGFnZUluZm8uY29udGVudFNpemUgPSB0aGlzLml0ZW1zLmxlbmd0aDtcblx0XHRcblx0XHR0aGlzLnJlY29uZmlndXJlKHRoaXMuaGVhZGVycyk7XG5cblx0fVxuXG5cdGV2YWx1YXRlUG9zaXRpb25pbmcoKSB7XG5cdFx0dGhpcy5yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUoXG5cdFx0XHR0aGlzLnVubG9ja2VkVGFibGUuZWwubmF0aXZlRWxlbWVudCxcblx0XHRcdFwibWFyZ2luLWxlZnRcIixcblx0XHRcdHRoaXMubG9ja2VkVGFibGUub2Zmc2V0V2lkdGgoKStcInB4XCIpO1xuXHR9XG5cblx0cmVjb25maWd1cmUoZXZlbnQpIHtcblx0XHR0aGlzLmhlYWRlcnMgPSBldmVudDtcblx0XHR0aGlzLmxvY2tlZEhlYWRlcnMgPSB0aGlzLmhlYWRlcnMuZmlsdGVyKCAoaXRlbSkgPT4gaXRlbS5sb2NrZWQgPT09IHRydWUgJiYgaXRlbS5wcmVzZW50KTtcblx0XHR0aGlzLnVubG9ja2VkSGVhZGVycyA9IHRoaXMuaGVhZGVycy5maWx0ZXIoIChpdGVtKSA9PiBpdGVtLmxvY2tlZCAhPT0gdHJ1ZSAgJiYgaXRlbS5wcmVzZW50KTtcdFxuXHRcdHRoaXMub25jb25maWd1cmF0aW9uY2hhbmdlLmVtaXQoZXZlbnQpO1xuXG5cdFx0aWYgKHRoaXMucGVyc2lzdGVuY2VLZXkpIHtcblx0XHRcdHRoaXMuZ2VuZXJhdG9yLnBlcnNpc3RIZWFkZXJzKHRoaXMucGVyc2lzdGVuY2VLZXksIHRoaXMucGVyc2lzdGVuY2VJZCwgdGhpcy5oZWFkZXJzKTtcblx0XHR9XG5cdFx0c2V0VGltZW91dCh0aGlzLmV2YWx1YXRlUG9zaXRpb25pbmcuYmluZCh0aGlzKSwxMTEpO1xuXHR9XG5cblx0b25sb2NrKGV2ZW50KSB7XG5cdFx0dGhpcy5sb2NrZWRIZWFkZXJzID0gdGhpcy5oZWFkZXJzLmZpbHRlciggKGl0ZW0pID0+IGl0ZW0ubG9ja2VkID09PSB0cnVlICYmIGl0ZW0ucHJlc2VudCk7XG5cdFx0dGhpcy51bmxvY2tlZEhlYWRlcnMgPSB0aGlzLmhlYWRlcnMuZmlsdGVyKCAoaXRlbSkgPT4gaXRlbS5sb2NrZWQgIT09IHRydWUgICYmIGl0ZW0ucHJlc2VudCk7XHRcblx0XHR0aGlzLm9uY29uZmlndXJhdGlvbmNoYW5nZS5lbWl0KGV2ZW50KTtcblxuXHRcdGlmICh0aGlzLnBlcnNpc3RlbmNlS2V5KSB7XG5cdFx0XHR0aGlzLmdlbmVyYXRvci5wZXJzaXN0SGVhZGVycyh0aGlzLnBlcnNpc3RlbmNlS2V5LCB0aGlzLnBlcnNpc3RlbmNlSWQsIHRoaXMuaGVhZGVycyk7XG5cdFx0fVxuXHRcdHNldFRpbWVvdXQodGhpcy5ldmFsdWF0ZVBvc2l0aW9uaW5nLmJpbmQodGhpcyksMTExKTtcblx0fVxuXHRjaGFuZ2VMb2NrZWRUYWJsZUZpbHRlcmVkSXRlbXMoZXZlbnQpIHtcblx0XHRpZiAodGhpcy5sb2NrZWRUYWJsZSkge1xuXHRcdFx0dGhpcy5sb2NrZWRUYWJsZS5maWx0ZXJlZEl0ZW1zID0gZXZlbnQ7XG5cdFx0XHR0aGlzLmxvY2tlZFRhYmxlLmluaXRWaXNpYmxlUm93cygpO1xuXHRcdH1cblx0fVxuXHRjaGFuZ2VVbmxvY2tlZFRhYmxlRmlsdGVyZWRJdGVtcyhldmVudCkge1xuXHRcdGlmICh0aGlzLnVubG9ja2VkVGFibGUpIHtcblx0XHRcdHRoaXMudW5sb2NrZWRUYWJsZS5maWx0ZXJlZEl0ZW1zID0gZXZlbnQ7XG5cdFx0XHR0aGlzLnVubG9ja2VkVGFibGUuaW5pdFZpc2libGVSb3dzKCk7XG5cdFx0fVxuXHR9XG5cdG9uUGFnaW5hdGlvbkNoYW5nZShldmVudCkge1xuXHRcdHRoaXMucGFnZUluZm8gPSBldmVudDtcblx0XHR0aGlzLnVubG9ja2VkVGFibGUuZXZhbHVhdGVSb3dzKCk7XG5cdH1cblxuXHR0YWJsZUFjdGlvbihldmVudCkge1xuXHRcdHRoaXMub25hY3Rpb24uZW1pdChldmVudClcblx0fVxuXG5cdG9uRHJvcChldmVudDpEcm9wRXZlbnQpe1xuXG5cdH1cblx0b25DZWxsRWRpdChldmVudCl7XG5cdFx0dGhpcy5vbkNlbGxDb250ZW50RWRpdC5lbWl0KGV2ZW50KTtcblx0fVxufVxuXG4iLCIvKlxyXG4qIFByb3ZpZGVzIHJlbmRlcmluZyBvZiBmbGV4aWJsZSB0YWJsZSBpbiBhIGxhenkgbG9hZCBmYXNoaW9uLlxyXG4qL1xyXG5pbXBvcnQgeyBOZ01vZHVsZSwgQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQge0ludG9QaXBlTW9kdWxlfSBmcm9tICdAc2VkZWgvaW50by1waXBlcyc7XHJcbmltcG9ydCB7IERyYWdEcm9wTW9kdWxlIH0gZnJvbSAnQHNlZGVoL2RyYWctZW5hYmxlZCc7XHJcblxyXG5pbXBvcnQgeyBQYWdpbmF0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3BhZ2luYXRpb24uY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ29uZmlndXJhdGlvbkNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9jb25maWd1cmF0aW9uLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFRhYmxlVmlld0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90YWJsZS5jb21wb25lbnQnO1xyXG5cclxuaW1wb3J0IHsgVGFibGVIZWFkZXJzR2VuZXJhdG9yIH0gZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlLWhlYWRlcnMtZ2VuZXJhdG9yJztcclxuaW1wb3J0IHsgRmxleGlibGVUYWJsZUNvbXBvbmVudCB9IGZyb20gJy4vZmxleGlibGUudGFibGUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTG9ja1RhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi9sb2NrLnRhYmxlLmNvbXBvbmVudCc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gICAgaW1wb3J0czogW1xyXG4gICAgICAgIENvbW1vbk1vZHVsZSxcclxuICAgICAgICBEcmFnRHJvcE1vZHVsZSxcclxuICAgICAgICBJbnRvUGlwZU1vZHVsZVxyXG4gICAgXSxcclxuICAgIGRlY2xhcmF0aW9uczogW1xyXG4gICAgICAgIEZsZXhpYmxlVGFibGVDb21wb25lbnQsXHJcbiAgICAgICAgTG9ja1RhYmxlQ29tcG9uZW50LFxyXG4gICAgICAgIENvbmZpZ3VyYXRpb25Db21wb25lbnQsXHJcbiAgICAgICAgUGFnaW5hdGlvbkNvbXBvbmVudCxcclxuICAgICAgICBUYWJsZVZpZXdDb21wb25lbnRcclxuICAgIF0sXHJcbiAgICBleHBvcnRzOiBbXHJcbiAgICAgICAgRmxleGlibGVUYWJsZUNvbXBvbmVudCxcclxuICAgICAgICBMb2NrVGFibGVDb21wb25lbnRcclxuICAgIF0sXHJcbiAgICBlbnRyeUNvbXBvbmVudHM6IFtcclxuICAgIF0sXHJcbiAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICBUYWJsZUhlYWRlcnNHZW5lcmF0b3JcclxuICAgIF0sXHJcbiAgICBzY2hlbWFzOiBbQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQV1cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBGbGV4aWJsZVRhYmxlTW9kdWxlIHt9XHJcbiJdLCJuYW1lcyI6WyJJbmplY3RhYmxlIiwiRXZlbnRFbWl0dGVyIiwiQ29tcG9uZW50IiwiSW5wdXQiLCJPdXRwdXQiLCJWaWV3Q2hpbGQiLCJFbGVtZW50UmVmIiwiVmlld0NvbnRhaW5lclJlZiIsIlJlbmRlcmVyIiwiTmdNb2R1bGUiLCJDb21tb25Nb2R1bGUiLCJEcmFnRHJvcE1vZHVsZSIsIkludG9QaXBlTW9kdWxlIiwiQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7UUFpQkU7MkJBRmtCLEVBQUU7U0FHbkI7Ozs7Ozs7O1FBRUQsa0RBQWtCOzs7Ozs7O1lBQWxCLFVBQW1CLElBQVEsRUFBRSxJQUFZLEVBQUUsVUFBa0IsRUFBRSxnQkFBeUI7Z0JBQXhGLGlCQWtDQztnQkFoQ0MsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO29CQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBRSxVQUFDLEdBQUc7O3dCQUN6QixJQUFNLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO3dCQUUzRCxJQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFB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