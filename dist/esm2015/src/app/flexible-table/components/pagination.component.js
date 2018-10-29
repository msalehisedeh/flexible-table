/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter } from "@angular/core";
/**
 * @record
 */
export function PaginationInfo() { }
/** @type {?} */
PaginationInfo.prototype.contentSize;
/** @type {?} */
PaginationInfo.prototype.pageSize;
/** @type {?|undefined} */
PaginationInfo.prototype.maxWidth;
/** @type {?|undefined} */
PaginationInfo.prototype.pages;
/** @type {?|undefined} */
PaginationInfo.prototype.from;
/** @type {?|undefined} */
PaginationInfo.prototype.to;
/** @type {?|undefined} */
PaginationInfo.prototype.currentPage;
/** @type {?|undefined} */
PaginationInfo.prototype.resetSize;
export class PaginationComponent {
    constructor() {
        this.vocabulary = { setSize: "", firstPage: "", nextPage: "", lastPage: "", previousPage: "" };
        this.info = { contentSize: 0, pageSize: 0, maxWidth: "0" };
        this.onchange = new EventEmitter();
        this.onready = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
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
            setTimeout(() => this.ready(), 66);
        }
    }
    /**
     * @param {?} width
     * @return {?}
     */
    setWidth(width) {
        this.info.maxWidth = width + "px";
    }
    /**
     * @return {?}
     */
    ready() {
        this.onready.emit(this);
        this.onchange.emit(this.info);
    }
    /**
     * @return {?}
     */
    selectFirst() {
        if (this.info.currentPage > 1) {
            this.info.from = 0;
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage = 1;
            this.onchange.emit(this.info);
        }
    }
    /**
     * @return {?}
     */
    selectNext() {
        if (this.info.currentPage < this.info.pages) {
            this.info.from = this.info.to + 1;
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage++;
            this.onchange.emit(this.info);
        }
    }
    /**
     * @return {?}
     */
    selectPrev() {
        if (this.info.currentPage > 1) {
            this.info.from -= this.info.pageSize;
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage--;
            this.onchange.emit(this.info);
        }
    }
    /**
     * @return {?}
     */
    selectLast() {
        if (this.info.currentPage < this.info.pages) {
            this.info.from = this.info.pageSize * (this.info.pages - 1);
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage = this.info.pages;
            this.onchange.emit(this.info);
        }
    }
    /**
     * @param {?} ranger
     * @return {?}
     */
    changeCurrent(ranger) {
        /** @type {?} */
        const v = parseInt(ranger.value, 10);
        if (this.info.currentPage < v && v > 0 && v < this.info.pages) {
            this.info.from = v * (this.info.pageSize - 1);
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage = v;
            this.onchange.emit(this.info);
        }
        else {
            ranger.value = this.info.currentPage;
        }
    }
    /**
     * @param {?} sizer
     * @return {?}
     */
    changeSize(sizer) {
        /** @type {?} */
        const v = parseInt(sizer.value, 10);
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
    }
}
PaginationComponent.decorators = [
    { type: Component, args: [{
                selector: 'table-pagination',
                template: "<div *ngIf=\"info && info.pages > 1\" [style.width]=\"info.maxWidth\" class=\"table-pagination\" #paginationWrapper>\r\n    <div class=\"fa fa-angle-left\"\r\n         (click)=\"selectPrev()\"\r\n         [class.disabled]=\"info.currentPage==1\">\r\n        <span class=\"prev\" [textContent]=\"vocabulary.previousPage\"></span>\r\n    </div>\r\n    <div class=\"fa fa-angle-double-left\"\r\n         (click)=\"selectFirst()\"\r\n         [class.disabled]=\"info.currentPage==1\">\r\n        <span class=\"first\" [textContent]=\"vocabulary.firstPage\"></span>\r\n    </div>\r\n    <div class=\"current\">\r\n        <input  #ranger [value]=\"info.currentPage\" (keydown.Enter)=\"changeCurrent(ranger)\" />\r\n        <span [textContent]=\"' / ' + info.pages\"></span>\r\n\t</div>\r\n    <div class=\"fa fa-angle-double-right\"\r\n         (click)=\"selectLast()\"\r\n         [class.disabled]=\"info.currentPage==info.pages\">\r\n        <span class=\"last\" [textContent]=\"vocabulary.lastPage\"></span>\r\n    </div>\r\n    <div class=\"fa fa-angle-right\"\r\n         (click)=\"selectNext()\"\r\n         [class.disabled]=\"info.currentPage==info.pages\">\r\n        <span class=\"next\" [textContent]=\"vocabulary.nextPage\"></span>\r\n    </div>\r\n    <div class=\"reset-size\" *ngIf=\"info.resetSize\">\r\n        <label for=\"pagination-set-size\">\r\n            <span class=\"off-screen\" [textContent]=\"vocabulary.setSize\"></span>\r\n            <input id=\"pagination-set-size\" [value]=\"info.pageSize\" (keydown.Enter)=\"changeSize(sizer)\" #sizer />\r\n        </label>\r\n    </div>\r\n</div>\r\n",
                styles: [".table-pagination{box-sizing:border-box;background-color:#fff;border:1px solid #254a5d;border-radius:2px;color:#254a5d;bottom:5px;clear:both;display:flex;font-size:1em;height:38px;max-width:100%;margin:0 auto;position:fixed;left:40%;z-index:55}.table-pagination .fa{padding:4px 8px;margin-top:5px}.table-pagination .first,.table-pagination .last,.table-pagination .next,.table-pagination .prev{background-repeat:no-repeat;cursor:pointer;width:auto;display:block;height:39px;text-indent:-99999px;box-sizing:border-box}.table-pagination .reset-size{padding:0;height:35px;border-radius:4px}.table-pagination .reset-size input{border:0;border-left:1px solid #4c5854;height:34px;text-align:center;width:30px;margin-right:2px;margin-left:8px}.table-pagination .current{padding:1px 5px}.table-pagination .current input{padding:0 3px;width:14px;height:35px;border:none;text-align:center}.table-pagination .disabled{opacity:.4}@media screen and (max-width:992px){.table-pagination{left:4px}}"]
            }] }
];
PaginationComponent.propDecorators = {
    vocabulary: [{ type: Input, args: ["vocabulary",] }],
    info: [{ type: Input, args: ["info",] }],
    onchange: [{ type: Output, args: ['onchange',] }],
    onready: [{ type: Output, args: ['onready',] }]
};
if (false) {
    /** @type {?} */
    PaginationComponent.prototype.vocabulary;
    /** @type {?} */
    PaginationComponent.prototype.info;
    /** @type {?} */
    PaginationComponent.prototype.onchange;
    /** @type {?} */
    PaginationComponent.prototype.onready;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mbGV4aWJsZS10YWJsZS8iLCJzb3VyY2VzIjpbInNyYy9hcHAvZmxleGlibGUtdGFibGUvY29tcG9uZW50cy9wYWdpbmF0aW9uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBR0EsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBVSxNQUFNLGVBQWUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0IvRSxNQUFNOzswQkFHa0IsRUFBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUM7b0JBR3ZFLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUU7d0JBRzFELElBQUksWUFBWSxFQUFFO3VCQUduQixJQUFJLFlBQVksRUFBRTs7Ozs7SUFFL0IsUUFBUTtRQUNQLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBSSxDQUFDLElBQUksR0FBRztnQkFDQyxXQUFXLEVBQUUsSUFBSTtnQkFDakIsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsSUFBSSxFQUFFLENBQUM7Z0JBQ1AsRUFBRSxFQUFFLElBQUk7Z0JBQ1IsV0FBVyxFQUFFLENBQUM7Z0JBQ2QsUUFBUSxFQUFFLEdBQUc7YUFDaEIsQ0FBQztTQUNYO1FBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2pELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElB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IGEgZGF0YSBzZXQgaW4gYSB0YWJsZS5cclxuKi9cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIE9uSW5pdCB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFBhZ2luYXRpb25JbmZvIHtcclxuXHRjb250ZW50U2l6ZTogbnVtYmVyLFxyXG5cdHBhZ2VTaXplOiBudW1iZXIsXHJcbiAgICBtYXhXaWR0aD86IHN0cmluZyxcclxuXHRwYWdlcz86IG51bWJlcixcclxuXHRmcm9tPzogbnVtYmVyLFxyXG5cdHRvPzogbnVtYmVyLFxyXG5cdGN1cnJlbnRQYWdlPzogbnVtYmVyLFxyXG4gICAgcmVzZXRTaXplPzogYm9vbGVhblxyXG59XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAndGFibGUtcGFnaW5hdGlvbicsXHJcblx0dGVtcGxhdGVVcmw6ICcuL3BhZ2luYXRpb24uY29tcG9uZW50Lmh0bWwnLFxyXG5cdHN0eWxlVXJsczogWycuL3BhZ2luYXRpb24uY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgUGFnaW5hdGlvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gICAgQElucHV0KFwidm9jYWJ1bGFyeVwiKVxyXG4gICAgcHVibGljIHZvY2FidWxhcnkgPSB7c2V0U2l6ZTogXCJcIiwgZmlyc3RQYWdlOiBcIlwiLCBuZXh0UGFnZTogXCJcIiwgbGFzdFBhZ2U6IFwiXCIsIHByZXZpb3VzUGFnZTogXCJcIn07XHJcblxyXG4gICAgQElucHV0KFwiaW5mb1wiKVxyXG4gICAgaW5mbzogUGFnaW5hdGlvbkluZm8gPSB7IGNvbnRlbnRTaXplOiAwLCBwYWdlU2l6ZTogMCwgbWF4V2lkdGg6IFwiMFwiIH07XHJcblxyXG5cdEBPdXRwdXQoJ29uY2hhbmdlJylcclxuICAgIG9uY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAgIEBPdXRwdXQoJ29ucmVhZHknKVxyXG4gICAgb25yZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0bmdPbkluaXQoKSB7XHJcblx0XHRpZiAoIXRoaXMuaW5mbykge1xyXG5cdFx0XHR0aGlzLmluZm8gPSB7IFxyXG4gICAgICAgICAgICAgICAgY29udGVudFNpemU6IDEwMDAsIFxyXG4gICAgICAgICAgICAgICAgcGFnZVNpemU6IDEwMDAsIFxyXG4gICAgICAgICAgICAgICAgcGFnZXM6IDEsIFxyXG4gICAgICAgICAgICAgICAgZnJvbTogMCwgXHJcbiAgICAgICAgICAgICAgICB0bzogMTAwMCwgXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFnZTogMSwgXHJcbiAgICAgICAgICAgICAgICBtYXhXaWR0aDogXCIwXCIgXHJcbiAgICAgICAgICAgIH07XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5pbmZvLmNvbnRlbnRTaXplICYmIHRoaXMuaW5mby5wYWdlU2l6ZSkge1xyXG5cdFx0XHR0aGlzLmluZm8ucGFnZXMgPSBNYXRoLmNlaWwodGhpcy5pbmZvLmNvbnRlbnRTaXplIC8gdGhpcy5pbmZvLnBhZ2VTaXplKTtcclxuXHRcdFx0dGhpcy5pbmZvLmZyb20gPSAwO1xyXG5cdFx0XHR0aGlzLmluZm8udG8gPSB0aGlzLmluZm8ucGFnZVNpemUgLSAxO1xyXG5cdFx0XHR0aGlzLmluZm8uY3VycmVudFBhZ2UgPSAxO1xyXG5cdFx0ICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5yZWFkeSgpLCA2Nik7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFdpZHRoKHdpZHRoOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmluZm8ubWF4V2lkdGggPSB3aWR0aCArIFwicHhcIjtcclxuICAgIH1cclxuXHJcbiAgICByZWFkeSgpIHtcclxuICAgICAgICB0aGlzLm9ucmVhZHkuZW1pdCh0aGlzKTtcclxuICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5pbmZvKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RGaXJzdCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbmZvLmN1cnJlbnRQYWdlID4gMSkge1xyXG5cdFx0ICAgIHRoaXMuaW5mby5mcm9tID0gMDtcclxuXHRcdCAgICB0aGlzLmluZm8udG8gPSB0aGlzLmluZm8uZnJvbSArIHRoaXMuaW5mby5wYWdlU2l6ZSAtIDE7XHJcblx0XHQgICAgdGhpcy5pbmZvLmN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaW5mbyk7XHJcbiAgICAgICAgfVxyXG4gICB9XHJcblxyXG4gICBzZWxlY3ROZXh0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmluZm8uY3VycmVudFBhZ2UgPCB0aGlzLmluZm8ucGFnZXMpIHtcclxuIFx0XHR0aGlzLmluZm8uZnJvbSA9IHRoaXMuaW5mby50byArIDE7XHJcblx0XHR0aGlzLmluZm8udG8gPSB0aGlzLmluZm8uZnJvbSArIHRoaXMuaW5mby5wYWdlU2l6ZSAtIDE7XHJcblx0XHR0aGlzLmluZm8uY3VycmVudFBhZ2UrKztcclxuICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5pbmZvKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0UHJldigpIHtcclxuICAgICAgICBpZiAodGhpcy5pbmZvLmN1cnJlbnRQYWdlID4gMSkge1xyXG4gXHRcdCAgICB0aGlzLmluZm8uZnJvbSAtPSB0aGlzLmluZm8ucGFnZVNpemU7XHJcblx0XHQgICAgdGhpcy5pbmZvLnRvID0gdGhpcy5pbmZvLmZyb20gKyB0aGlzLmluZm8ucGFnZVNpemUgLSAxO1xyXG5cdFx0ICAgIHRoaXMuaW5mby5jdXJyZW50UGFnZS0tO1xyXG4gICAgICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5pbmZvKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0TGFzdCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbmZvLmN1cnJlbnRQYWdlIDwgdGhpcy5pbmZvLnBhZ2VzKSB7XHJcblx0XHQgICAgdGhpcy5pbmZvLmZyb20gPSB0aGlzLmluZm8ucGFnZVNpemUgKiAodGhpcy5pbmZvLnBhZ2VzIC0gMSk7XHJcblx0XHQgICAgdGhpcy5pbmZvLnRvID0gdGhpcy5pbmZvLmZyb20gKyB0aGlzLmluZm8ucGFnZVNpemUgLSAxO1xyXG5cdFx0ICAgIHRoaXMuaW5mby5jdXJyZW50UGFnZSA9IHRoaXMuaW5mby5wYWdlcztcclxuICAgICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaW5mbyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZUN1cnJlbnQocmFuZ2VyOiBhbnkpIHtcclxuICAgICAgICBjb25zdCB2ID0gcGFyc2VJbnQoIHJhbmdlci52YWx1ZSwgMTAgKTtcclxuICAgICAgICBpZiAodGhpcy5pbmZvLmN1cnJlbnRQYWdlIDwgdiAmJiB2ID4gMCAmJiB2IDwgdGhpcy5pbmZvLnBhZ2VzKSB7XHJcblx0XHQgICAgdGhpcy5pbmZvLmZyb20gPSB2ICogKHRoaXMuaW5mby5wYWdlU2l6ZSAtIDEpO1xyXG5cdFx0ICAgIHRoaXMuaW5mby50byA9IHRoaXMuaW5mby5mcm9tICsgdGhpcy5pbmZvLnBhZ2VTaXplIC0gMTtcclxuXHRcdCAgICB0aGlzLmluZm8uY3VycmVudFBhZ2UgPSB2O1xyXG4gICAgICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5pbmZvKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByYW5nZXIudmFsdWUgPSB0aGlzLmluZm8uY3VycmVudFBhZ2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVNpemUoc2l6ZXI6IGFueSkge1xyXG4gICAgICAgIGNvbnN0IHYgPSBwYXJzZUludCggc2l6ZXIudmFsdWUsIDEwICk7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5mby5jb250ZW50U2l6ZSA+PSB2ICYmIHYgPiAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5mby5wYWdlU2l6ZSA9IHY7XHJcbiBcdFx0XHR0aGlzLmluZm8ucGFnZXMgPSBNYXRoLmNlaWwodGhpcy5pbmZvLmNvbnRlbnRTaXplIC8gdik7XHJcbiAgICAgICAgICAgIHRoaXMuaW5mby5mcm9tID0gMDtcclxuXHRcdFx0dGhpcy5pbmZvLnRvID0gdGhpcy5pbmZvLnBhZ2VTaXplIC0gMTtcclxuXHRcdFx0dGhpcy5pbmZvLmN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaW5mbyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2l6ZXIudmFsdWUgPSB0aGlzLmluZm8ucGFnZVNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==