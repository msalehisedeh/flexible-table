/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Directive, ElementRef, Input, Renderer } from '@angular/core';
export class TableSortDirective {
    /**
     * @param {?} renderer
     * @param {?} el
     */
    constructor(renderer, el) {
        this.renderer = renderer;
        this.el = el;
        this.dropEffect = "move";
        this.tableSort = (path) => { };
    }
    /**
     * @return {?}
     */
    headerColumnElements() {
        return this.el.nativeElement.parentNode.children;
    }
    /**
     * @param {?} id
     * @return {?}
     */
    findColumnWithID(id) {
        /** @type {?} */
        const list = this.headerColumnElements();
        /** @type {?} */
        let column = null;
        for (let i = 0; i < list.length; i++) {
            if (list[i].getAttribute("id") === id) {
                column = list[i];
                break;
            }
        }
        return column;
    }
    /**
     * @param {?} icon
     * @return {?}
     */
    sort(icon) {
        if (this.medium.sortable) {
            for (let i = 0; i < this.headers.length; i++) {
                /** @type {?} */
                const h = this.headers[i];
                if (h.key !== this.medium.key) {
                    /** @type {?} */
                    const item = this.findColumnWithID(h.key);
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
    }
}
TableSortDirective.decorators = [
    { type: Directive, args: [{
                selector: '[tableSort]'
            },] }
];
/** @nocollapse */
TableSortDirective.ctorParameters = () => [
    { type: Renderer },
    { type: ElementRef }
];
TableSortDirective.propDecorators = {
    medium: [{ type: Input, args: ['medium',] }],
    headers: [{ type: Input, args: ['headers',] }],
    dropEffect: [{ type: Input }],
    tableSort: [{ type: Input, args: ["tableSort",] }]
};
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtc29ydC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mbGV4aWJsZS10YWJsZS8iLCJzb3VyY2VzIjpbInNyYy9hcHAvZmxleGlibGUtdGFibGUvZGlyZWN0aXZlcy90YWJsZS1zb3J0LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNILFNBQVMsRUFDVCxVQUFVLEVBRVYsS0FBSyxFQUVMLFFBQVEsRUFFWCxNQUFNLGVBQWUsQ0FBQztBQUt2QixNQUFNOzs7OztJQWNGLFlBQ2EsVUFDRDtRQURDLGFBQVEsR0FBUixRQUFRO1FBQ1QsT0FBRSxHQUFGLEVBQUU7MEJBUEQsTUFBTTt5QkFHUCxDQUFDLElBQUksRUFBRSxFQUFFLElBQUc7S0FLcEI7Ozs7SUFFSSxvQkFBb0I7UUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7Ozs7OztJQUd2QyxnQkFBZ0IsQ0FBQyxFQUFVOztRQUMvQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQzs7UUFDL0MsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3RDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDdkMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakIsS0FBSyxDQUFDO2FBQ047U0FDRDtRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7Ozs7OztJQUdmLElBQUksQ0FBQyxJQUFJO1FBQ1IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzFCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQzs7Z0JBQ25DLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRTFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztvQkFDM0MsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFFMUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDUSxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUN4RCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUN6RCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO3FCQUN4RTtvQkFDYyxDQUFDLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztvQkFDckIsQ0FBQyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7aUJBQ25DO2FBQ0Q7WUFDUSxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQy9ELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7Z0JBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztnQkFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDMUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUN0RTtZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNQLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztnQkFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2dCQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUMzRCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ3JFO1lBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUMzQztLQUNEOzs7WUFyRUQsU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxhQUFhO2FBQzFCOzs7O1lBTkcsUUFBUTtZQUpSLFVBQVU7OztxQkFhVCxLQUFLLFNBQUMsUUFBUTtzQkFHZCxLQUFLLFNBQUMsU0FBUzt5QkFHZixLQUFLO3dCQUdMLEtBQUssU0FBQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICAgIERpcmVjdGl2ZSxcclxuICAgIEVsZW1lbnRSZWYsXHJcbiAgICBIb3N0TGlzdGVuZXIsXHJcbiAgICBJbnB1dCxcclxuICAgIE91dHB1dCxcclxuICAgIFJlbmRlcmVyLFxyXG4gICAgRXZlbnRFbWl0dGVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnW3RhYmxlU29ydF0nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUYWJsZVNvcnREaXJlY3RpdmUge1xyXG4gICAgXHJcbiAgICBASW5wdXQoJ21lZGl1bScpXHJcbiAgICBtZWRpdW06IGFueTtcclxuICAgICAgICBcclxuICAgIEBJbnB1dCgnaGVhZGVycycpXHJcbiAgICBoZWFkZXJzOiBhbnk7XHJcbiAgICAgICAgXHJcbiAgICBASW5wdXQoKVxyXG4gICAgZHJvcEVmZmVjdCA9IFwibW92ZVwiO1xyXG4gICAgICAgIFxyXG4gICAgQElucHV0KFwidGFibGVTb3J0XCIpXHJcbiAgICB0YWJsZVNvcnQgPSAocGF0aCkgPT4ge307XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyLFxyXG4gICAgICAgIHByaXZhdGUgZWw6IEVsZW1lbnRSZWZcclxuICAgICkge31cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBoZWFkZXJDb2x1bW5FbGVtZW50cygpIHtcclxuXHRcdHJldHVybiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZS5jaGlsZHJlbjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZpbmRDb2x1bW5XaXRoSUQoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSB0aGlzLmhlYWRlckNvbHVtbkVsZW1lbnRzKCk7XHJcblx0XHRsZXQgY29sdW1uID0gbnVsbDtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAobGlzdFtpXS5nZXRBdHRyaWJ1dGUoXCJpZFwiKSA9PT0gaWQpIHtcclxuXHRcdFx0XHRjb2x1bW4gPSBsaXN0W2ldO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY29sdW1uO1xyXG5cdH1cclxuXHJcblx0c29ydChpY29uKSB7XHJcblx0XHRpZiAodGhpcy5tZWRpdW0uc29ydGFibGUpIHtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhlYWRlcnMubGVuZ3RoIDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoID0gdGhpcy5oZWFkZXJzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChoLmtleSAhPT0gdGhpcy5tZWRpdW0ua2V5KSB7XHJcblx0XHRcdFx0XHRjb25zdCBpdGVtID0gdGhpcy5maW5kQ29sdW1uV2l0aElEKGgua2V5KTtcclxuXHJcblx0XHRcdFx0XHRpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhpdGVtLCBcImFzY2VuZGluZ1wiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGl0ZW0sIFwiZGVzY2VuZGluZ1wiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGl0ZW0sIFwic29ydGFibGVcIiwgdHJ1ZSk7XHJcblx0XHRcdFx0XHR9XHJcbiAgICAgICAgICAgICAgICAgICAgaC5kZXNjZW5kaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaC5hc2NlbmRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoaWNvbiwgXCJmYS1zb3J0XCIsIGZhbHNlKTtcclxuXHRcdFx0aWYgKHRoaXMubWVkaXVtLmFzY2VuZGluZyB8fCAoIXRoaXMubWVkaXVtLmFzY2VuZGluZyAmJiAhdGhpcy5tZWRpdW0uZGVzY2VuZGluZykpIHtcclxuXHRcdFx0XHR0aGlzLm1lZGl1bS5kZXNjZW5kaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHR0aGlzLm1lZGl1bS5hc2NlbmRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGljb24sIFwiZmEtc29ydC1hc2NcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoaWNvbiwgXCJmYS1zb3J0LWRlc2NcIiwgdHJ1ZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5tZWRpdW0uZGVzY2VuZGluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdHRoaXMubWVkaXVtLmFzY2VuZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhpY29uLCBcImZhLXNvcnQtZGVzY1wiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhpY29uLCBcImZhLXNvcnQtYXNjXCIsIHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMudGFibGVTb3J0KHRoaXMubWVkaXVtLmtleS5zcGxpdChcIi5cIikpO1xyXG5cdFx0fVxyXG5cdH1cclxufSJdfQ==