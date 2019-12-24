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
    Input("vocabulary")
], PaginationComponent.prototype, "vocabulary", void 0);
tslib_1.__decorate([
    Input("info")
], PaginationComponent.prototype, "info", void 0);
tslib_1.__decorate([
    Input('inline')
], PaginationComponent.prototype, "inline", void 0);
tslib_1.__decorate([
    Output('onchange')
], PaginationComponent.prototype, "onchange", void 0);
tslib_1.__decorate([
    Output('onready')
], PaginationComponent.prototype, "onready", void 0);
PaginationComponent = tslib_1.__decorate([
    Component({
        selector: 'table-pagination',
        template: "<div *ngIf=\"info && info.pages > 1\" \r\n    [style.width]=\"info.maxWidth\" \r\n    [class.inliner]=\"inline\"\r\n    [class.floater]=\"!inline\"\r\n    class=\"table-pagination\" #paginationWrapper>\r\n    <div class=\"fa fa-angle-left\"\r\n         (click)=\"selectPrev()\"\r\n         [class.disabled]=\"info.currentPage==1\">\r\n        <span class=\"prev\" [textContent]=\"vocabulary.previousPage\"></span>\r\n    </div>\r\n    <div class=\"fa fa-angle-double-left\"\r\n         (click)=\"selectFirst()\"\r\n         [class.disabled]=\"info.currentPage==1\">\r\n        <span class=\"first\" [textContent]=\"vocabulary.firstPage\"></span>\r\n    </div>\r\n    <div class=\"current\">\r\n        <input  #ranger [value]=\"info.currentPage\" (keydown.Enter)=\"changeCurrent(ranger)\" />\r\n        <span [textContent]=\"' / ' + info.pages\"></span>\r\n\t</div>\r\n    <div class=\"fa fa-angle-double-right\"\r\n         (click)=\"selectLast()\"\r\n         [class.disabled]=\"info.currentPage==info.pages\">\r\n        <span class=\"last\" [textContent]=\"vocabulary.lastPage\"></span>\r\n    </div>\r\n    <div class=\"fa fa-angle-right\"\r\n         (click)=\"selectNext()\"\r\n         [class.disabled]=\"info.currentPage==info.pages\">\r\n        <span class=\"next\" [textContent]=\"vocabulary.nextPage\"></span>\r\n    </div>\r\n    <div class=\"reset-size\" *ngIf=\"info.resetSize\">\r\n        <label for=\"pagination-set-size\">\r\n            <span class=\"off-screen\" [textContent]=\"vocabulary.setSize\"></span>\r\n            <input id=\"pagination-set-size\" [value]=\"info.pageSize\" (keydown.Enter)=\"changeSize(sizer)\" #sizer />\r\n        </label>\r\n    </div>\r\n</div>\r\n",
        styles: [".table-pagination{box-sizing:border-box;background-color:#fff;border:1px solid #254a5d;border-radius:2px;color:#254a5d;clear:both;display:flex;font-size:1em;height:38px;max-width:100%;margin:0 auto}.table-pagination.inliner{width:191px;float:right}.table-pagination.floater{position:fixed;left:40%;z-index:55;bottom:5px}.table-pagination .fa{padding:4px 8px;margin-top:5px}.table-pagination .first,.table-pagination .last,.table-pagination .next,.table-pagination .prev{background-repeat:no-repeat;cursor:pointer;width:auto;display:block;height:39px;text-indent:-99999px;box-sizing:border-box}.table-pagination .reset-size{padding:0;height:35px;border-radius:4px}.table-pagination .reset-size input{border:0;border-left:1px solid #4c5854;height:34px;text-align:center;width:30px;margin-right:2px;margin-left:8px}.table-pagination .current{padding:1px 5px}.table-pagination .current input{padding:0 3px;width:14px;height:35px;border:none;text-align:center}.table-pagination .disabled{opacity:.4}@media screen and (max-width:992px){.table-pagination{left:4px}}@media print{:host{display:none}}"]
    })
], PaginationComponent);
export { PaginationComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvZmxleGlibGUtdGFibGUvIiwic291cmNlcyI6WyJzcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2NvbXBvbmVudHMvcGFnaW5hdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztFQUVFO0FBQ0YsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBVSxNQUFNLGVBQWUsQ0FBQztBQWtCL0UsSUFBYSxtQkFBbUIsR0FBaEMsTUFBYSxtQkFBbUI7SUFMaEM7UUFRVyxlQUFVLEdBQUcsRUFBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUMsQ0FBQztRQUcvRixTQUFJLEdBQW1CLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUd0RSxXQUFNLEdBQUcsS0FBSyxDQUFDO1FBR2YsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFHOUIsWUFBTyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUE2RmpDLENBQUM7SUEzRkEsUUFBUTtRQUNQLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2YsSUFBSSxDQUFDLElBQUksR0FBRztnQkFDQyxXQUFXLEVBQUUsSUFBSTtnQkFDakIsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsSUFBSSxFQUFFLENBQUM7Z0JBQ1AsRUFBRSxFQUFFLElBQUk7Z0JBQ1IsV0FBVyxFQUFFLENBQUM7Z0JBQ2QsUUFBUSxFQUFFLEdBQUc7YUFDaEIsQ0FBQztTQUNYO1FBQ0QsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcs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LElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztZQUN2RCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUNsQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDakM7SUFDTCxDQUFDO0lBRUQsYUFBYSxDQUFDLE1BQVc7UUFDckIsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFFLENBQUM7UUFDdkMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDakUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZELElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDakM7YUFBTTtZQUNILE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7U0FDeEM7SUFDTCxDQUFDO0lBRUQsVUFBVSxDQUFDLEtBQVU7UUFDakIsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFFLENBQUM7UUFDdEMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMvQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztZQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDakM7YUFBTTtZQUNILEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDcEM7SUFDTCxDQUFDO0NBQ0osQ0FBQTtBQXpHRztJQURDLEtBQUssQ0FBQyxZQUFZLENBQUM7dURBQzJFO0FBRy9GO0lBREMsS0FBSyxDQUFDLE1BQU0sQ0FBQztpREFDd0Q7QUFHdEU7SUFEQyxLQUFLLENBQUMsUUFBUSxDQUFDO21EQUNEO0FBR2Y7SUFERixNQUFNLENBQUMsVUFBVSxDQUFDO3FEQUNjO0FBRzlCO0lBREMsTUFBTSxDQUFDLFNBQVMsQ0FBQztvREFDVztBQWZwQixtQkFBbUI7SUFML0IsU0FBUyxDQUFDO1FBQ1AsUUFBUSxFQUFFLGtCQUFrQjtRQUMvQixnckRBQTBDOztLQUUxQyxDQUFDO0dBQ1csbUJBQW1CLENBNEcvQjtTQTVHWSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4qIFByb3ZpZGVzIHBhZ2luYXRpb24gb2YgYSBkYXRhIHNldCBpbiBhIHRhYmxlLlxyXG4qL1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgT25Jbml0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUGFnaW5hdGlvbkluZm8ge1xyXG5cdGNvbnRlbnRTaXplOiBudW1iZXIsXHJcblx0cGFnZVNpemU6IG51bWJlcixcclxuICAgIG1heFdpZHRoPzogc3RyaW5nLFxyXG5cdHBhZ2VzPzogbnVtYmVyLFxyXG5cdGZyb20/OiBudW1iZXIsXHJcblx0dG8/OiBudW1iZXIsXHJcblx0Y3VycmVudFBhZ2U/OiBudW1iZXIsXHJcbiAgICByZXNldFNpemU/OiBib29sZWFuXHJcbn1cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICd0YWJsZS1wYWdpbmF0aW9uJyxcclxuXHR0ZW1wbGF0ZVVybDogJy4vcGFnaW5hdGlvbi5jb21wb25lbnQuaHRtbCcsXHJcblx0c3R5bGVVcmxzOiBbJy4vcGFnaW5hdGlvbi5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBQYWdpbmF0aW9uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgICBASW5wdXQoXCJ2b2NhYnVsYXJ5XCIpXHJcbiAgICBwdWJsaWMgdm9jYWJ1bGFyeSA9IHtzZXRTaXplOiBcIlwiLCBmaXJzdFBhZ2U6IFwiXCIsIG5leHRQYWdlOiBcIlwiLCBsYXN0UGFnZTogXCJcIiwgcHJldmlvdXNQYWdlOiBcIlwifTtcclxuXHJcbiAgICBASW5wdXQoXCJpbmZvXCIpXHJcbiAgICBpbmZvOiBQYWdpbmF0aW9uSW5mbyA9IHsgY29udGVudFNpemU6IDAsIHBhZ2VTaXplOiAwLCBtYXhXaWR0aDogXCIwXCIgfTtcclxuXHJcbiAgICBASW5wdXQoJ2lubGluZScpXHJcbiAgICBpbmxpbmUgPSBmYWxzZTtcclxuXHJcblx0QE91dHB1dCgnb25jaGFuZ2UnKVxyXG4gICAgb25jaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gICAgQE91dHB1dCgnb25yZWFkeScpXHJcbiAgICBvbnJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHRuZ09uSW5pdCgpIHtcclxuXHRcdGlmICghdGhpcy5pbmZvKSB7XHJcblx0XHRcdHRoaXMuaW5mbyA9IHsgXHJcbiAgICAgICAgICAgICAgICBjb250ZW50U2l6ZTogMTAwMCwgXHJcbiAgICAgICAgICAgICAgICBwYWdlU2l6ZTogMTAwMCwgXHJcbiAgICAgICAgICAgICAgICBwYWdlczogMSwgXHJcbiAgICAgICAgICAgICAgICBmcm9tOiAwLCBcclxuICAgICAgICAgICAgICAgIHRvOiAxMDAwLCBcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRQYWdlOiAxLCBcclxuICAgICAgICAgICAgICAgIG1heFdpZHRoOiBcIjBcIiBcclxuICAgICAgICAgICAgfTtcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLmluZm8uY29udGVudFNpemUgJiYgdGhpcy5pbmZvLnBhZ2VTaXplKSB7XHJcblx0XHRcdHRoaXMuaW5mby5wYWdlcyA9IE1hdGguY2VpbCh0aGlzLmluZm8uY29udGVudFNpemUgLyB0aGlzLmluZm8ucGFnZVNpemUpO1xyXG5cdFx0XHR0aGlzLmluZm8uZnJvbSA9IDA7XHJcblx0XHRcdHRoaXMuaW5mby50byA9IHRoaXMuaW5mby5wYWdlU2l6ZSAtIDE7XHJcblx0XHRcdHRoaXMuaW5mby5jdXJyZW50UGFnZSA9IDE7XHJcblx0XHQgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnJlYWR5KCksIDY2KTtcclxuXHRcdH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0V2lkdGgod2lkdGg6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuaW5mby5tYXhXaWR0aCA9IHdpZHRoICsgXCJweFwiO1xyXG4gICAgfVxyXG5cclxuICAgIHJlYWR5KCkge1xyXG4gICAgICAgIHRoaXMub25yZWFkeS5lbWl0KHRoaXMpO1xyXG4gICAgICAgIHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzLmluZm8pO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdEZpcnN0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmluZm8uY3VycmVudFBhZ2UgPiAxKSB7XHJcblx0XHQgICAgdGhpcy5pbmZvLmZyb20gPSAwO1xyXG5cdFx0ICAgIHRoaXMuaW5mby50byA9IHRoaXMuaW5mby5mcm9tICsgdGhpcy5pbmZvLnBhZ2VTaXplIC0gMTtcclxuXHRcdCAgICB0aGlzLmluZm8uY3VycmVudFBhZ2UgPSAxO1xyXG4gICAgICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5pbmZvKTtcclxuICAgICAgICB9XHJcbiAgIH1cclxuXHJcbiAgIHNlbGVjdE5leHQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5mby5jdXJyZW50UGFnZSA8IHRoaXMuaW5mby5wYWdlcykge1xyXG4gXHRcdHRoaXMuaW5mby5mcm9tID0gdGhpcy5pbmZvLnRvICsgMTtcclxuXHRcdHRoaXMuaW5mby50byA9IHRoaXMuaW5mby5mcm9tICsgdGhpcy5pbmZvLnBhZ2VTaXplIC0gMTtcclxuXHRcdHRoaXMuaW5mby5jdXJyZW50UGFnZSsrO1xyXG4gICAgICAgIHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzLmluZm8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RQcmV2KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmluZm8uY3VycmVudFBhZ2UgPiAxKSB7XHJcbiBcdFx0ICAgIHRoaXMuaW5mby5mcm9tIC09IHRoaXMuaW5mby5wYWdlU2l6ZTtcclxuXHRcdCAgICB0aGlzLmluZm8udG8gPSB0aGlzLmluZm8uZnJvbSArIHRoaXMuaW5mby5wYWdlU2l6ZSAtIDE7XHJcblx0XHQgICAgdGhpcy5pbmZvLmN1cnJlbnRQYWdlLS07XHJcbiAgICAgICAgICAgIHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzLmluZm8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RMYXN0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmluZm8uY3VycmVudFBhZ2UgPCB0aGlzLmluZm8ucGFnZXMpIHtcclxuXHRcdCAgICB0aGlzLmluZm8uZnJvbSA9IHRoaXMuaW5mby5wYWdlU2l6ZSAqICh0aGlzLmluZm8ucGFnZXMgLSAxKTtcclxuXHRcdCAgICB0aGlzLmluZm8udG8gPSB0aGlzLmluZm8uZnJvbSArIHRoaXMuaW5mby5wYWdlU2l6ZSAtIDE7XHJcblx0XHQgICAgdGhpcy5pbmZvLmN1cnJlbnRQYWdlID0gdGhpcy5pbmZvLnBhZ2VzO1xyXG4gICAgICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5pbmZvKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlQ3VycmVudChyYW5nZXI6IGFueSkge1xyXG4gICAgICAgIGNvbnN0IHYgPSBwYXJzZUludCggcmFuZ2VyLnZhbHVlLCAxMCApO1xyXG4gICAgICAgIGlmICh0aGlzLmluZm8uY3VycmVudFBhZ2UgPCB2ICYmIHYgPiAwICYmIHYgPCB0aGlzLmluZm8ucGFnZXMpIHtcclxuXHRcdCAgICB0aGlzLmluZm8uZnJvbSA9IHYgKiAodGhpcy5pbmZvLnBhZ2VTaXplIC0gMSk7XHJcblx0XHQgICAgdGhpcy5pbmZvLnRvID0gdGhpcy5pbmZvLmZyb20gKyB0aGlzLmluZm8ucGFnZVNpemUgLSAxO1xyXG5cdFx0ICAgIHRoaXMuaW5mby5jdXJyZW50UGFnZSA9IHY7XHJcbiAgICAgICAgICAgIHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzLmluZm8pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJhbmdlci52YWx1ZSA9IHRoaXMuaW5mby5jdXJyZW50UGFnZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlU2l6ZShzaXplcjogYW55KSB7XHJcbiAgICAgICAgY29uc3QgdiA9IHBhcnNlSW50KCBzaXplci52YWx1ZSwgMTAgKTtcclxuICAgICAgICBpZiAodGhpcy5pbmZvLmNvbnRlbnRTaXplID49IHYgJiYgdiA+IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5pbmZvLnBhZ2VTaXplID0gdjtcclxuIFx0XHRcdHRoaXMuaW5mby5wYWdlcyA9IE1hdGguY2VpbCh0aGlzLmluZm8uY29udGVudFNpemUgLyB2KTtcclxuICAgICAgICAgICAgdGhpcy5pbmZvLmZyb20gPSAwO1xyXG5cdFx0XHR0aGlzLmluZm8udG8gPSB0aGlzLmluZm8ucGFnZVNpemUgLSAxO1xyXG5cdFx0XHR0aGlzLmluZm8uY3VycmVudFBhZ2UgPSAxO1xyXG4gICAgICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5pbmZvKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzaXplci52YWx1ZSA9IHRoaXMuaW5mby5wYWdlU2l6ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19