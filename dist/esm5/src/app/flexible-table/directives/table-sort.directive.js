/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Directive, ElementRef, Input, Renderer } from '@angular/core';
var TableSortDirective = /** @class */ (function () {
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
        { type: Directive, args: [{
                    selector: '[tableSort]'
                },] }
    ];
    /** @nocollapse */
    TableSortDirective.ctorParameters = function () { return [
        { type: Renderer },
        { type: ElementRef }
    ]; };
    TableSortDirective.propDecorators = {
        medium: [{ type: Input, args: ['medium',] }],
        headers: [{ type: Input, args: ['headers',] }],
        dropEffect: [{ type: Input }],
        tableSort: [{ type: Input, args: ["tableSort",] }]
    };
    return TableSortDirective;
}());
export { TableSortDirective };
if (false) {
    /** @type {?} */
    TableSortDirective.prototype.medium;
    /** @type {?} */
    TableSortDirective.prototype.headers;
    /** @type {?} */
    TableSortDirective.prototype.dropEffect;
    /** @type {?} */
    TableSortDirective.prototype.tableSort;
    /** @type {?} */
    TableSortDirective.prototype.renderer;
    /** @type {?} */
    TableSortDirective.prototype.el;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtc29ydC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mbGV4aWJsZS10YWJsZS8iLCJzb3VyY2VzIjpbInNyYy9hcHAvZmxleGlibGUtdGFibGUvZGlyZWN0aXZlcy90YWJsZS1zb3J0LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNILFNBQVMsRUFDVCxVQUFVLEVBRVYsS0FBSyxFQUVMLFFBQVEsRUFFWCxNQUFNLGVBQWUsQ0FBQzs7SUFtQm5CLDRCQUNhLFVBQ0Q7UUFEQyxhQUFRLEdBQVIsUUFBUTtRQUNULE9BQUUsR0FBRixFQUFFOzBCQVBELE1BQU07eUJBR1AsVUFBQyxJQUFJLEtBQU87S0FLcEI7Ozs7SUFFSSxpREFBb0I7Ozs7UUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7Ozs7OztJQUd2Qyw2Q0FBZ0I7Ozs7Y0FBQyxFQUFVOztRQUMvQixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQzs7UUFDL0MsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3RDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDdkMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakIsS0FBSyxDQUFDO2FBQ047U0FDRDtRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7Ozs7OztJQUdmLGlDQUFJOzs7O0lBQUosVUFBSyxJQUFJO1FBQ1IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzFCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQzs7Z0JBQ25DLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRTFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztvQkFDM0MsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFFMUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDUSxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUN4RCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUN6RCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO3FCQUN4RTtvQkFDYyxDQUFDLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztvQkFDckIsQ0FBQyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7aUJBQ25DO2FBQ0Q7WUFDUSxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQy9ELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7Z0JBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztnQkFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDMUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUN0RTtZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNQLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztnQkFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2dCQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUMzRCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ3JFO1lBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUMzQztLQUNEOztnQkFyRUQsU0FBUyxTQUFDO29CQUNQLFFBQVEsRUFBRSxhQUFhO2lCQUMxQjs7OztnQkFORyxRQUFRO2dCQUpSLFVBQVU7Ozt5QkFhVCxLQUFLLFNBQUMsUUFBUTswQkFHZCxLQUFLLFNBQUMsU0FBUzs2QkFHZixLQUFLOzRCQUdMLEtBQUssU0FBQyxXQUFXOzs2QkF4QnRCOztTQWFhLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgICBEaXJlY3RpdmUsXHJcbiAgICBFbGVtZW50UmVmLFxyXG4gICAgSG9zdExpc3RlbmVyLFxyXG4gICAgSW5wdXQsXHJcbiAgICBPdXRwdXQsXHJcbiAgICBSZW5kZXJlcixcclxuICAgIEV2ZW50RW1pdHRlclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgICBzZWxlY3RvcjogJ1t0YWJsZVNvcnRdJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgVGFibGVTb3J0RGlyZWN0aXZlIHtcclxuICAgIFxyXG4gICAgQElucHV0KCdtZWRpdW0nKVxyXG4gICAgbWVkaXVtOiBhbnk7XHJcbiAgICAgICAgXHJcbiAgICBASW5wdXQoJ2hlYWRlcnMnKVxyXG4gICAgaGVhZGVyczogYW55O1xyXG4gICAgICAgIFxyXG4gICAgQElucHV0KClcclxuICAgIGRyb3BFZmZlY3QgPSBcIm1vdmVcIjtcclxuICAgICAgICBcclxuICAgIEBJbnB1dChcInRhYmxlU29ydFwiKVxyXG4gICAgdGFibGVTb3J0ID0gKHBhdGgpID0+IHt9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcixcclxuICAgICAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmXHJcbiAgICApIHt9XHJcbiAgICBcclxuICAgIHByaXZhdGUgaGVhZGVyQ29sdW1uRWxlbWVudHMoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5lbC5uYXRpdmVFbGVtZW50LnBhcmVudE5vZGUuY2hpbGRyZW47XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBmaW5kQ29sdW1uV2l0aElEKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBsaXN0ID0gdGhpcy5oZWFkZXJDb2x1bW5FbGVtZW50cygpO1xyXG5cdFx0bGV0IGNvbHVtbiA9IG51bGw7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKGxpc3RbaV0uZ2V0QXR0cmlidXRlKFwiaWRcIikgPT09IGlkKSB7XHJcblx0XHRcdFx0Y29sdW1uID0gbGlzdFtpXTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNvbHVtbjtcclxuXHR9XHJcblxyXG5cdHNvcnQoaWNvbikge1xyXG5cdFx0aWYgKHRoaXMubWVkaXVtLnNvcnRhYmxlKSB7XHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5oZWFkZXJzLmxlbmd0aCA7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaCA9IHRoaXMuaGVhZGVyc1tpXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaC5rZXkgIT09IHRoaXMubWVkaXVtLmtleSkge1xyXG5cdFx0XHRcdFx0Y29uc3QgaXRlbSA9IHRoaXMuZmluZENvbHVtbldpdGhJRChoLmtleSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoaXRlbSwgXCJhc2NlbmRpbmdcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhpdGVtLCBcImRlc2NlbmRpbmdcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhpdGVtLCBcInNvcnRhYmxlXCIsIHRydWUpO1xyXG5cdFx0XHRcdFx0fVxyXG4gICAgICAgICAgICAgICAgICAgIGguZGVzY2VuZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGguYXNjZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGljb24sIFwiZmEtc29ydFwiLCBmYWxzZSk7XHJcblx0XHRcdGlmICh0aGlzLm1lZGl1bS5hc2NlbmRpbmcgfHwgKCF0aGlzLm1lZGl1bS5hc2NlbmRpbmcgJiYgIXRoaXMubWVkaXVtLmRlc2NlbmRpbmcpKSB7XHJcblx0XHRcdFx0dGhpcy5tZWRpdW0uZGVzY2VuZGluZyA9IHRydWU7XHJcblx0XHRcdFx0dGhpcy5tZWRpdW0uYXNjZW5kaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhpY29uLCBcImZhLXNvcnQtYXNjXCIsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGljb24sIFwiZmEtc29ydC1kZXNjXCIsIHRydWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMubWVkaXVtLmRlc2NlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHR0aGlzLm1lZGl1bS5hc2NlbmRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoaWNvbiwgXCJmYS1zb3J0LWRlc2NcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoaWNvbiwgXCJmYS1zb3J0LWFzY1wiLCB0cnVlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLnRhYmxlU29ydCh0aGlzLm1lZGl1bS5rZXkuc3BsaXQoXCIuXCIpKTtcclxuXHRcdH1cclxuXHR9XHJcbn0iXX0=