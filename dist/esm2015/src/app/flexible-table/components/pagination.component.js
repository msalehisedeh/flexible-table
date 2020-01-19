import * as tslib_1 from "tslib";
/*
* Provides pagination of a data set in a table.
*/
import { Component, Input, Output, EventEmitter } from "@angular/core";
let PaginationComponent = class PaginationComponent {
    constructor() {
        this.vocabulary = { setSize: "", firstPage: "", nextPage: "", lastPage: "", previousPage: "" };
        this.info = { contentSize: 0, pageSize: 0, maxWidth: "0" };
        this.inline = false;
        this.onchange = new EventEmitter();
        this.onready = new EventEmitter();
    }
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
    setWidth(width) {
        this.info.maxWidth = width + "px";
    }
    ready() {
        this.onready.emit(this);
        this.onchange.emit(this.info);
    }
    selectFirst() {
        if (this.info.currentPage > 1) {
            this.info.from = 0;
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage = 1;
            this.onchange.emit(this.info);
        }
    }
    selectNext() {
        if (this.info.currentPage < this.info.pages) {
            this.info.from = this.info.to + 1;
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage++;
            this.onchange.emit(this.info);
        }
    }
    selectPrev() {
        if (this.info.currentPage > 1) {
            this.info.from -= this.info.pageSize;
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage--;
            this.onchange.emit(this.info);
        }
    }
    selectLast() {
        if (this.info.currentPage < this.info.pages) {
            this.info.from = this.info.pageSize * (this.info.pages - 1);
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage = this.info.pages;
            this.onchange.emit(this.info);
        }
    }
    changeCurrent(ranger) {
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
    changeSize(sizer) {
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
};
tslib_1.__decorate([
    Input()
], PaginationComponent.prototype, "vocabulary", void 0);
tslib_1.__decorate([
    Input()
], PaginationComponent.prototype, "info", void 0);
tslib_1.__decorate([
    Input()
], PaginationComponent.prototype, "inline", void 0);
tslib_1.__decorate([
    Output()
], PaginationComponent.prototype, "onchange", void 0);
tslib_1.__decorate([
    Output()
], PaginationComponent.prototype, "onready", void 0);
PaginationComponent = tslib_1.__decorate([
    Component({
        selector: 'table-pagination',
        template: "<div *ngIf=\"info && info.pages > 1\" \r\n    [style.width]=\"info.maxWidth\" \r\n    [class.inliner]=\"inline\"\r\n    [class.floater]=\"!inline\"\r\n    class=\"table-pagination\" #paginationWrapper>\r\n    <div class=\"fa fa-angle-left\"\r\n         (click)=\"selectPrev()\"\r\n         [class.disabled]=\"info.currentPage==1\">\r\n        <span class=\"prev\" [textContent]=\"vocabulary.previousPage\"></span>\r\n    </div>\r\n    <div class=\"fa fa-angle-double-left\"\r\n         (click)=\"selectFirst()\"\r\n         [class.disabled]=\"info.currentPage==1\">\r\n        <span class=\"first\" [textContent]=\"vocabulary.firstPage\"></span>\r\n    </div>\r\n    <div class=\"current\">\r\n        <input  #ranger [value]=\"info.currentPage\" (keydown.Enter)=\"changeCurrent(ranger)\" />\r\n        <span [textContent]=\"' / ' + info.pages\"></span>\r\n\t</div>\r\n    <div class=\"fa fa-angle-double-right\"\r\n         (click)=\"selectLast()\"\r\n         [class.disabled]=\"info.currentPage==info.pages\">\r\n        <span class=\"last\" [textContent]=\"vocabulary.lastPage\"></span>\r\n    </div>\r\n    <div class=\"fa fa-angle-right\"\r\n         (click)=\"selectNext()\"\r\n         [class.disabled]=\"info.currentPage==info.pages\">\r\n        <span class=\"next\" [textContent]=\"vocabulary.nextPage\"></span>\r\n    </div>\r\n    <div class=\"reset-size\" *ngIf=\"info.resetSize\">\r\n        <label for=\"pagination-set-size\">\r\n            <span class=\"off-screen\" [textContent]=\"vocabulary.setSize\"></span>\r\n            <input id=\"pagination-set-size\" [value]=\"info.pageSize\" (keydown.Enter)=\"changeSize(sizer)\" #sizer />\r\n        </label>\r\n    </div>\r\n</div>\r\n",
        styles: [".table-pagination{box-sizing:border-box;background-color:#fff;border:1px solid #254a5d;border-radius:2px;color:#254a5d;clear:both;display:flex;font-size:1em;height:38px;max-width:100%;margin:0 auto}.table-pagination.inliner{width:191px;float:right}.table-pagination.floater{position:fixed;left:40%;z-index:55;bottom:5px}.table-pagination .fa{padding:4px 8px;margin-top:5px}.table-pagination .first,.table-pagination .last,.table-pagination .next,.table-pagination .prev{background-repeat:no-repeat;cursor:pointer;width:auto;display:block;height:39px;text-indent:-99999px;box-sizing:border-box}.table-pagination .reset-size{padding:0;height:35px;border-radius:4px}.table-pagination .reset-size input{border:0;border-left:1px solid #4c5854;height:34px;text-align:center;width:30px;margin-right:2px;margin-left:8px}.table-pagination .current{padding:1px 5px}.table-pagination .current input{padding:0 3px;width:14px;height:35px;border:none;text-align:center}.table-pagination .disabled{opacity:.4}@media screen and (max-width:992px){.table-pagination{left:4px}}@media print{:host{display:none}}"]
    })
], PaginationComponent);
export { PaginationComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvZmxleGlibGUtdGFibGUvIiwic291cmNlcyI6WyJzcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2NvbXBvbmVudHMvcGFnaW5hdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztFQUVFO0FBQ0YsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBVSxNQUFNLGVBQWUsQ0FBQztBQWtCL0UsSUFBYSxtQkFBbUIsR0FBaEMsTUFBYSxtQkFBbUI7SUFMaEM7UUFPYSxlQUFVLEdBQUcsRUFBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUMsQ0FBQztRQUN4RixTQUFJLEdBQW1CLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUN0RSxXQUFNLEdBQUcsS0FBSyxDQUFDO1FBRWpCLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzNCLFlBQU8sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBNkYzQyxDQUFDO0lBM0ZBLFFBQVE7UUFDUCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNmLElBQUksQ0FBQyxJQUFJLEdBQUc7Z0JBQ0MsV0FBVyxFQUFFLElBQUk7Z0JBQ2pCLFFBQVEsRUFBRSxJQUFJO2dCQUNkLEtBQUssRUFBRSxDQUFDO2dCQUNSLElBQUksRUFBRSxDQUFDO2dCQUNQLEVBQUUsRUFBRSxJQUFJO2dCQUNSLFdBQVcsRUFBRSxDQUFDO2dCQUNkLFFBQVEsRUFBRSxHQUFHO2FBQ2hCLENBQUM7U0FDWDtRQUNELElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFX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QyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDbEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2pDO0lBQ0wsQ0FBQztJQUVELGFBQWEsQ0FBQyxNQUFXO1FBQ3JCLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBRSxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBRSxDQUFDO1FBQ3ZDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2pFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztZQUN2RCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2pDO2FBQU07WUFDSCxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQ3hDO0lBQ0wsQ0FBQztJQUVELFVBQVUsQ0FBQyxLQUFVO1FBQ2pCLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBRSxDQUFDO1FBQ3RDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7WUFDakIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2pDO2FBQU07WUFDSCxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ3BDO0lBQ0wsQ0FBQztDQUNKLENBQUE7QUFsR1k7SUFBUixLQUFLLEVBQUU7dURBQXlGO0FBQ3hGO0lBQVIsS0FBSyxFQUFFO2lEQUF1RTtBQUN0RTtJQUFSLEtBQUssRUFBRTttREFBZ0I7QUFFakI7SUFBVCxNQUFNLEVBQUU7cURBQStCO0FBQzNCO0lBQVQsTUFBTSxFQUFFO29EQUE4QjtBQVA5QixtQkFBbUI7SUFML0IsU0FBUyxDQUFDO1FBQ1AsUUFBUSxFQUFFLGtCQUFrQjtRQUMvQixnckRBQTBDOztLQUUxQyxDQUFDO0dBQ1csbUJBQW1CLENBb0cvQjtTQXBHWSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4qIFByb3ZpZGVzIHBhZ2luYXRpb24gb2YgYSBkYXRhIHNldCBpbiBhIHRhYmxlLlxyXG4qL1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgT25Jbml0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUGFnaW5hdGlvbkluZm8ge1xyXG5cdGNvbnRlbnRTaXplOiBudW1iZXIsXHJcblx0cGFnZVNpemU6IG51bWJlcixcclxuICAgIG1heFdpZHRoPzogc3RyaW5nLFxyXG5cdHBhZ2VzPzogbnVtYmVyLFxyXG5cdGZyb20/OiBudW1iZXIsXHJcblx0dG8/OiBudW1iZXIsXHJcblx0Y3VycmVudFBhZ2U/OiBudW1iZXIsXHJcbiAgICByZXNldFNpemU/OiBib29sZWFuXHJcbn1cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICd0YWJsZS1wYWdpbmF0aW9uJyxcclxuXHR0ZW1wbGF0ZVVybDogJy4vcGFnaW5hdGlvbi5jb21wb25lbnQuaHRtbCcsXHJcblx0c3R5bGVVcmxzOiBbJy4vcGFnaW5hdGlvbi5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBQYWdpbmF0aW9uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgICBASW5wdXQoKSB2b2NhYnVsYXJ5ID0ge3NldFNpemU6IFwiXCIsIGZpcnN0UGFnZTogXCJcIiwgbmV4dFBhZ2U6IFwiXCIsIGxhc3RQYWdlOiBcIlwiLCBwcmV2aW91c1BhZ2U6IFwiXCJ9O1xyXG4gICAgQElucHV0KCkgaW5mbzogUGFnaW5hdGlvbkluZm8gPSB7IGNvbnRlbnRTaXplOiAwLCBwYWdlU2l6ZTogMCwgbWF4V2lkdGg6IFwiMFwiIH07XHJcbiAgICBASW5wdXQoKSBpbmxpbmUgPSBmYWxzZTtcclxuXHJcblx0QE91dHB1dCgpIG9uY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgQE91dHB1dCgpIG9ucmVhZHkgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdG5nT25Jbml0KCkge1xyXG5cdFx0aWYgKCF0aGlzLmluZm8pIHtcclxuXHRcdFx0dGhpcy5pbmZvID0geyBcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRTaXplOiAxMDAwLCBcclxuICAgICAgICAgICAgICAgIHBhZ2VTaXplOiAxMDAwLCBcclxuICAgICAgICAgICAgICAgIHBhZ2VzOiAxLCBcclxuICAgICAgICAgICAgICAgIGZyb206IDAsIFxyXG4gICAgICAgICAgICAgICAgdG86IDEwMDAsIFxyXG4gICAgICAgICAgICAgICAgY3VycmVudFBhZ2U6IDEsIFxyXG4gICAgICAgICAgICAgICAgbWF4V2lkdGg6IFwiMFwiIFxyXG4gICAgICAgICAgICB9O1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMuaW5mby5jb250ZW50U2l6ZSAmJiB0aGlzLmluZm8ucGFnZVNpemUpIHtcclxuXHRcdFx0dGhpcy5pbmZvLnBhZ2VzID0gTWF0aC5jZWlsKHRoaXMuaW5mby5jb250ZW50U2l6ZSAvIHRoaXMuaW5mby5wYWdlU2l6ZSk7XHJcblx0XHRcdHRoaXMuaW5mby5mcm9tID0gMDtcclxuXHRcdFx0dGhpcy5pbmZvLnRvID0gdGhpcy5pbmZvLnBhZ2VTaXplIC0gMTtcclxuXHRcdFx0dGhpcy5pbmZvLmN1cnJlbnRQYWdlID0gMTtcclxuXHRcdCAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVhZHkoKSwgNjYpO1xyXG5cdFx0fVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRXaWR0aCh3aWR0aDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5pbmZvLm1heFdpZHRoID0gd2lkdGggKyBcInB4XCI7XHJcbiAgICB9XHJcblxyXG4gICAgcmVhZHkoKSB7XHJcbiAgICAgICAgdGhpcy5vbnJlYWR5LmVtaXQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaW5mbyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0Rmlyc3QoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5mby5jdXJyZW50UGFnZSA+IDEpIHtcclxuXHRcdCAgICB0aGlzLmluZm8uZnJvbSA9IDA7XHJcblx0XHQgICAgdGhpcy5pbmZvLnRvID0gdGhpcy5pbmZvLmZyb20gKyB0aGlzLmluZm8ucGFnZVNpemUgLSAxO1xyXG5cdFx0ICAgIHRoaXMuaW5mby5jdXJyZW50UGFnZSA9IDE7XHJcbiAgICAgICAgICAgIHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzLmluZm8pO1xyXG4gICAgICAgIH1cclxuICAgfVxyXG5cclxuICAgc2VsZWN0TmV4dCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbmZvLmN1cnJlbnRQYWdlIDwgdGhpcy5pbmZvLnBhZ2VzKSB7XHJcbiBcdFx0dGhpcy5pbmZvLmZyb20gPSB0aGlzLmluZm8udG8gKyAxO1xyXG5cdFx0dGhpcy5pbmZvLnRvID0gdGhpcy5pbmZvLmZyb20gKyB0aGlzLmluZm8ucGFnZVNpemUgLSAxO1xyXG5cdFx0dGhpcy5pbmZvLmN1cnJlbnRQYWdlKys7XHJcbiAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaW5mbyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdFByZXYoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5mby5jdXJyZW50UGFnZSA+IDEpIHtcclxuIFx0XHQgICAgdGhpcy5pbmZvLmZyb20gLT0gdGhpcy5pbmZvLnBhZ2VTaXplO1xyXG5cdFx0ICAgIHRoaXMuaW5mby50byA9IHRoaXMuaW5mby5mcm9tICsgdGhpcy5pbmZvLnBhZ2VTaXplIC0gMTtcclxuXHRcdCAgICB0aGlzLmluZm8uY3VycmVudFBhZ2UtLTtcclxuICAgICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaW5mbyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdExhc3QoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5mby5jdXJyZW50UGFnZSA8IHRoaXMuaW5mby5wYWdlcykge1xyXG5cdFx0ICAgIHRoaXMuaW5mby5mcm9tID0gdGhpcy5pbmZvLnBhZ2VTaXplICogKHRoaXMuaW5mby5wYWdlcyAtIDEpO1xyXG5cdFx0ICAgIHRoaXMuaW5mby50byA9IHRoaXMuaW5mby5mcm9tICsgdGhpcy5pbmZvLnBhZ2VTaXplIC0gMTtcclxuXHRcdCAgICB0aGlzLmluZm8uY3VycmVudFBhZ2UgPSB0aGlzLmluZm8ucGFnZXM7XHJcbiAgICAgICAgICAgIHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzLmluZm8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VDdXJyZW50KHJhbmdlcjogYW55KSB7XHJcbiAgICAgICAgY29uc3QgdiA9IHBhcnNlSW50KCByYW5nZXIudmFsdWUsIDEwICk7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5mby5jdXJyZW50UGFnZSA8IHYgJiYgdiA+IDAgJiYgdiA8IHRoaXMuaW5mby5wYWdlcykge1xyXG5cdFx0ICAgIHRoaXMuaW5mby5mcm9tID0gdiAqICh0aGlzLmluZm8ucGFnZVNpemUgLSAxKTtcclxuXHRcdCAgICB0aGlzLmluZm8udG8gPSB0aGlzLmluZm8uZnJvbSArIHRoaXMuaW5mby5wYWdlU2l6ZSAtIDE7XHJcblx0XHQgICAgdGhpcy5pbmZvLmN1cnJlbnRQYWdlID0gdjtcclxuICAgICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaW5mbyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmFuZ2VyLnZhbHVlID0gdGhpcy5pbmZvLmN1cnJlbnRQYWdlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VTaXplKHNpemVyOiBhbnkpIHtcclxuICAgICAgICBjb25zdCB2ID0gcGFyc2VJbnQoIHNpemVyLnZhbHVlLCAxMCApO1xyXG4gICAgICAgIGlmICh0aGlzLmluZm8uY29udGVudFNpemUgPj0gdiAmJiB2ID4gMSkge1xyXG4gICAgICAgICAgICB0aGlzLmluZm8ucGFnZVNpemUgPSB2O1xyXG4gXHRcdFx0dGhpcy5pbmZvLnBhZ2VzID0gTWF0aC5jZWlsKHRoaXMuaW5mby5jb250ZW50U2l6ZSAvIHYpO1xyXG4gICAgICAgICAgICB0aGlzLmluZm8uZnJvbSA9IDA7XHJcblx0XHRcdHRoaXMuaW5mby50byA9IHRoaXMuaW5mby5wYWdlU2l6ZSAtIDE7XHJcblx0XHRcdHRoaXMuaW5mby5jdXJyZW50UGFnZSA9IDE7XHJcbiAgICAgICAgICAgIHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzLmluZm8pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNpemVyLnZhbHVlID0gdGhpcy5pbmZvLnBhZ2VTaXplO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=