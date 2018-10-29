/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, ElementRef, EventEmitter, ViewChild } from '@angular/core';
export class FlexibleShowcaseComponent {
    constructor() {
        this.translatedPosition = 0;
        this.selectedIndex = 0;
        this.paginate = false;
        this.zoomOnHover = false;
        this.peekOnHover = false;
        this.enableEventTracking = false;
        this.message = "click to select ";
        this.onEventTracking = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this.selectedIndex = 0;
        this.thumbnails[0].selected = true;
        this.selectedItem = this.thumbnails[0];
        this.paginate = (this.thumbnails.length * 60) > this.width;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.position && this.slider) {
            this.translatedPosition = 0;
            this.slider.nativeElement.style.transform = "translate(0px,0px)";
        }
    }
    /**
     * @param {?} event
     * @param {?} item
     * @return {?}
     */
    hoverOver(event, item) {
        if (this.zoomOnHover && event.target.nodeName === 'IMG') {
            this.fireTrackingEvent(item.title, item.thumbnailId, "zoomed");
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    hoverOut(event) {
        if (this.largeImage) {
            this.largeImage.nativeElement.style.opacity = 0;
            this.largeImage.nativeElement.style.top = "-10000px";
            this.largeImage.nativeElement.style.left = "-10000px";
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    hoverViewPort(event) {
        if (this.zoomOnHover && event.target.nodeName === 'IMG') {
            this.largeImage.nativeElement.style.opacity = 1;
            this.largeImage.nativeElement.style.top = -event.layerY + "px";
            this.largeImage.nativeElement.style.left = -event.layerX + "px";
        }
    }
    /**
     * @param {?} position
     * @param {?} toEnd
     * @return {?}
     */
    shiftDisplay(position, toEnd) {
        if (position === "top" || position === "bottom") {
            this.translatedPosition += (toEnd ? -60 : 60);
            this.translatedPosition = this.translatedPosition > 0 ? 0 : this.translatedPosition;
            this.slider.nativeElement.style.transform = "translateX(" + this.translatedPosition + "px)";
        }
        else {
            this.translatedPosition += (toEnd ? -60 : 60);
            this.translatedPosition = this.translatedPosition > 0 ? 0 : this.translatedPosition;
            this.slider.nativeElement.style.transform = "translateY(" + this.translatedPosition + "px)";
        }
        if (this.enableEventTracking) {
            this.onEventTracking.emit({
                productId: this.productId,
                action: "thombnail shift",
                time: new Date()
            });
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    keyup(event) {
        /** @type {?} */
        const code = event.which;
        if (code === 13) {
            event.target.click();
        }
    }
    /**
     * @param {?} item
     * @param {?} trackingTime
     * @return {?}
     */
    videoPlayed(item, trackingTime) {
        this.fireTrackingEvent(item.title, item.thumbnailId, "play-video", trackingTime);
    }
    /**
     * @param {?} item
     * @param {?} trackingTime
     * @return {?}
     */
    videoPaused(item, trackingTime) {
        this.fireTrackingEvent(item.title, item.thumbnailId, "pause-video", trackingTime);
    }
    /**
     * @param {?} item
     * @param {?} trackingTime
     * @return {?}
     */
    videoEnded(item, trackingTime) {
        this.fireTrackingEvent(item.title, item.thumbnailId, "end-video", trackingTime);
    }
    /**
     * @param {?} i
     * @param {?} onhover
     * @return {?}
     */
    hoverTab(i, onhover) {
        if (this.peekOnHover) {
            this.hoverItem = this.thumbnails[i];
        }
        this.fireTrackingEvent(this.thumbnails[i].title, this.thumbnails[i].thumbnailId, onhover ? "hover" : "focus");
    }
    /**
     * @param {?} i
     * @return {?}
     */
    selectTab(i) {
        this.thumbnails.map((tab) => {
            tab.selected = false;
        });
        this.selectedIndex = i;
        this.thumbnails[i].selected = true;
        this.selectedItem = this.thumbnails[i];
        this.fireTrackingEvent(this.thumbnails[i].title, this.thumbnails[i].thumbnailId, "select");
    }
    /**
     * @param {?} name
     * @param {?} id
     * @param {?} event
     * @param {?=} track
     * @return {?}
     */
    fireTrackingEvent(name, id, event, track) {
        if (this.enableEventTracking) {
            if (track) {
                this.onEventTracking.emit({
                    productId: this.productId,
                    thumbnailId: id,
                    action: event,
                    title: name,
                    currentTime: track,
                    time: new Date()
                });
            }
            else {
                this.onEventTracking.emit({
                    productId: this.productId,
                    thumbnailId: id,
                    action: event,
                    title: name,
                    time: new Date()
                });
            }
        }
    }
}
FlexibleShowcaseComponent.decorators = [
    { type: Component, args: [{
                selector: 'showcase',
                template: "\r\n<div class=\"showcase {{position}}\">\r\n    <div class=\"showcase-control {{position}}\" \r\n        role=\"list\" \r\n        [style.width]=\"position === 'top' ? width + 'px' : null\" \r\n        [style.height]=\"position === 'left' ? height + 'px' : null\"\r\n        *ngIf=\"position === 'top' || position === 'left'\">\r\n        <div class=\"slide-control\" \r\n            [class.left]=\"position == 'top'\"\r\n            [class.up]=\"position == 'left'\"\r\n            *ngIf=\"paginate\" \r\n            (click)=\"shiftDisplay(position, false)\">\r\n            <span *ngIf=\"position === 'top'\" class=\"fa fa-angle-left\" aria-hidden=\"true\"></span>\r\n            <span *ngIf=\"position === 'left'\" class=\"fa fa-angle-up\" aria-hidden=\"true\"></span>\r\n        </div>\r\n        <div class=\"sliding-viewport\" [class.paginate]=\"paginate\" #slider>\r\n        <a *ngFor=\"let item of thumbnails; let i = index\" \r\n            role=\"listitem\" \r\n            tabindex=\"0\"\r\n            (keyup)=\"keyup($event)\" \r\n            (click)=\"selectTab(i)\"\r\n            (focus)=\"hoverTab(i, false)\"\r\n            (mouseenter)=\"hoverTab(i, true)\"\r\n            (mouseleave)=\"hoverItem = undefined\"\r\n            [title]=\"item.title\" \r\n            [class.selected]=\"item.selected\">\r\n            <span class=\"off-screen\" [textContent]=\"message\"></span>\r\n            <span class=\"title off-screen\" [textContent]=\"item.title\"></span>\r\n            <img  class=\"content\" [src]=\"item.src.small\" *ngIf=\"item.type === 'image'\" />\r\n            <video height=\"100%\" class=\"content\" *ngIf=\"item.type === 'video'\" disabled=\"disabled\" tabindex=\"-1\">\r\n                <source [src]=\"item.src.mp4\" type=\"video/mp4\">\r\n                <source [src]=\"item.src.webm\" type=\"video/webm\">\r\n                <source [src]=\"item.src.egg\" type=\"video/ogg\">\r\n            </video>\r\n        </a>\r\n        </div>\r\n        <div class=\"slide-control\" \r\n            [class.right]=\"position == 'top'\"\r\n            [class.down]=\"position == 'left'\"\r\n            *ngIf=\"paginate\" \r\n            (click)=\"shiftDisplay(position, true)\">\r\n            <span *ngIf=\"position === 'top'\" class=\"fa fa-angle-right\" aria-hidden=\"true\"></span>\r\n            <span *ngIf=\"position === 'left'\" class=\"fa fa-angle-down\" aria-hidden=\"true\"></span>\r\n        </div>\r\n    </div>\r\n    <div \r\n        class=\"showcase-viewport\" \r\n        [style.width]=\"width + 'px'\" \r\n        [style.height]=\"height + 'px'\"\r\n        (mouseout)=\"hoverOut($event)\"\r\n        (mouseover)=\"hoverOver($event, selectedItem)\"\r\n        (mousemove)=\"hoverViewPort($event)\">\r\n        <img  class=\"content\" \r\n                [src]=\"hoverItem ? hoverItem.src.medium : selectedItem.src.medium\" \r\n                *ngIf=\"(hoverItem ? hoverItem.type === 'image' : selectedItem.type === 'image')\" />\r\n        <img  class=\"hover\" #largeImage\r\n                [style.width]=\"(width*2) + 'px'\"\r\n                [style.height]=\"(height*2) + 'px'\"\r\n                [src]=\"selectedItem.src.large\" \r\n                *ngIf=\"zoomOnHover && selectedItem.type === 'image'\" />\r\n        <video  \r\n            class=\"content\" #video\r\n            [style.width]=\"width + 'px'\" \r\n            [style.height]=\"height + 'px'\"\r\n            (play)=\"videoPlayed(selectedItem, video.currentTime)\"\r\n            (pause)=\"videoPaused(selectedItem, video.currentTime)\"\r\n            (ended)=\"videoEnded(selectedItem, video.currentTime)\"\r\n            *ngIf=\"(hoverItem ? hoverItem.type === 'video' : selectedItem.type === 'video')\" controls>\r\n            <source [src]=\"hoverItem ? hoverItem.src.mp4 : selectedItem.src.mp4\" type=\"video/mp4\">\r\n            <source [src]=\"hoverItem ? hoverItem.src.webm : selectedItem.src.webm\" type=\"video/webm\">\r\n            <source [src]=\"hoverItem ? hoverItem.src.egg : selectedItem.src.egg\" type=\"video/ogg\">\r\n        </video>\r\n    </div>\r\n    <div class=\"showcase-control {{position}}\" \r\n        role=\"list\" \r\n        [style.width]=\"position === 'bottom' ? width + 'px' : null\" \r\n        [style.height]=\"position === 'right' ? height + 'px' : null\"\r\n        *ngIf=\"position === 'bottom' || position === 'right'\">\r\n        <div class=\"slide-control\" \r\n            [class.left]=\"position == 'bottom'\"\r\n            [class.up]=\"position == 'right'\"\r\n            *ngIf=\"paginate\" \r\n            (click)=\"shiftDisplay(position, false)\">\r\n            <span *ngIf=\"position === 'bottom'\" class=\"fa fa-angle-left\" aria-hidden=\"true\"></span>\r\n            <span *ngIf=\"position === 'right'\" class=\"fa fa-angle-up\" aria-hidden=\"true\"></span>\r\n        </div>\r\n        <div class=\"sliding-viewport\" [class.paginate]=\"paginate\" #slider>\r\n        <a *ngFor=\"let item of thumbnails; let i = index\" \r\n            role=\"listitem\" \r\n            tabindex=\"0\"\r\n            (keyup)=\"keyup($event)\" \r\n            (click)=\"selectTab(i)\"\r\n            (focus)=\"hoverTab(i, false)\"\r\n            (mouseenter)=\"hoverTab(i, true)\"\r\n            [title]=\"item.title\" \r\n            [class.selected]=\"item.selected\">\r\n            <span class=\"off-screen\" [textContent]=\"message\"></span>\r\n            <span class=\"title off-screen\" [textContent]=\"item.title\"></span>\r\n            <img  class=\"content\" [src]=\"item.src.small\" *ngIf=\"item.type === 'image'\" />\r\n            <video  height=\"100%\" class=\"content\" *ngIf=\"item.type === 'video'\" disabled=\"disabled\" tabindex=\"-1\">\r\n                <source [src]=\"item.src.mp4\" type=\"video/mp4\">\r\n                <source [src]=\"item.src.webm\" type=\"video/webm\">\r\n                <source [src]=\"item.src.egg\" type=\"video/ogg\">\r\n            </video>\r\n        </a>\r\n        </div>\r\n        <div class=\"slide-control\" \r\n            [class.right]=\"position == 'bottom'\"\r\n            [class.down]=\"position == 'right'\"\r\n            *ngIf=\"paginate\" \r\n            (click)=\"shiftDisplay(position, true)\">\r\n            <span *ngIf=\"position === 'bottom'\" class=\"fa fa-angle-right\" aria-hidden=\"true\"></span>\r\n            <span *ngIf=\"position === 'right'\" class=\"fa fa-angle-down\" aria-hidden=\"true\"></span>\r\n        </div>\r\n    </div>\r\n</div>\r\n",
                styles: [".showcase{display:flex;width:100%}.showcase .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.showcase .showcase-viewport{box-sizing:border-box;border:1px solid #bcd;min-height:150px;overflow:hidden;position:relative}.showcase .showcase-viewport ::ng-deep img,.showcase .showcase-viewport video{width:100%}.showcase .showcase-viewport .hover{position:absolute;background-color:#fff;top:-10000px;left:-10000px;opacity:0;pointer-events:none}.showcase .showcase-control{border:1px solid #bcd;box-sizing:border-box;display:flex}.showcase .showcase-control.bottom,.showcase .showcase-control.top{flex-direction:row;overflow:hidden}.showcase .showcase-control.bottom .slide-control,.showcase .showcase-control.top .slide-control{width:20px;height:inherit;background-color:#fff;z-index:2}.showcase .showcase-control.bottom .slide-control.left,.showcase .showcase-control.top .slide-control.left{border-right:1px solid #bcd}.showcase .showcase-control.bottom .slide-control.right,.showcase .showcase-control.top .slide-control.right{border-left:1px solid #bcd}.showcase .showcase-control.bottom .slide-control .fa,.showcase .showcase-control.top .slide-control .fa{font-weight:700;margin:99% 30%;font-size:1.6rem}.showcase .showcase-control.bottom .sliding-viewport.paginate,.showcase .showcase-control.top .sliding-viewport.paginate{width:calc(100% - 40px)}.showcase .showcase-control.left,.showcase .showcase-control.right{flex-direction:column;overflow:hidden}.showcase .showcase-control.left .slide-control,.showcase .showcase-control.right .slide-control{height:20px;width:inherit;background-color:#fff;z-index:2}.showcase .showcase-control.left .slide-control.up,.showcase .showcase-control.right .slide-control.up{border-bottom:1px solid #bcd}.showcase .showcase-control.left .slide-control.down,.showcase .showcase-control.right .slide-control.down{border-top:1px solid #bcd}.showcase .showcase-control.left .slide-control .fa,.showcase .showcase-control.right .slide-control .fa{font-weight:700;margin:0 29%;font-size:1.6rem}.showcase .showcase-control.left .sliding-viewport.paginate,.showcase .showcase-control.right .sliding-viewport.paginate{height:calc(100% - 40px)}.showcase .showcase-control .sliding-viewport{display:flex}.showcase .showcase-control .sliding-viewport a{box-sizing:border-box;white-space:nowrap;border:0;cursor:pointer}.showcase .showcase-control .sliding-viewport a ::ng-deep img,.showcase .showcase-control .sliding-viewport a video{width:60px}.showcase.top{flex-direction:column}.showcase.top .showcase-control{flex-wrap:nowrap}.showcase.top .showcase-control .sliding-viewport{flex-direction:row}.showcase.bottom{flex-direction:column}.showcase.bottom .showcase-control{flex-wrap:nowrap}.showcase.bottom .showcase-control .sliding-viewport,.showcase.left{flex-direction:row}.showcase.left .showcase-control{flex-wrap:nowrap;flex:1}.showcase.left .showcase-control .sliding-viewport{flex-direction:column}.showcase.right{flex-direction:row}.showcase.right .showcase-control{flex-wrap:nowrap;flex:1}.showcase.right .showcase-control .sliding-viewport{flex-direction:column}@media screen and (max-width:600px){.showcase{display:table}.showcase-control{display:block}.showcase-control a{width:100%;display:table}.showcase-viewport{margin:5px 0}}"]
            }] }
];
/** @nocollapse */
FlexibleShowcaseComponent.ctorParameters = () => [];
FlexibleShowcaseComponent.propDecorators = {
    largeImage: [{ type: ViewChild, args: ["largeImage",] }],
    slider: [{ type: ViewChild, args: ["slider",] }],
    position: [{ type: Input, args: ["position",] }],
    width: [{ type: Input, args: ["width",] }],
    height: [{ type: Input, args: ["height",] }],
    productId: [{ type: Input, args: ["productId",] }],
    zoomOnHover: [{ type: Input, args: ["zoomOnHover",] }],
    peekOnHover: [{ type: Input, args: ["peekOnHover",] }],
    enableEventTracking: [{ type: Input, args: ["enableEventTracking",] }],
    thumbnails: [{ type: Input, args: ["thumbnails",] }],
    message: [{ type: Input, args: ["message",] }],
    onEventTracking: [{ type: Output, args: ['onEventTracking',] }]
};
if (false) {
    /** @type {?} */
    FlexibleShowcaseComponent.prototype.translatedPosition;
    /** @type {?} */
    FlexibleShowcaseComponent.prototype.selectedIndex;
    /** @type {?} */
    FlexibleShowcaseComponent.prototype.selectedItem;
    /** @type {?} */
    FlexibleShowcaseComponent.prototype.hoverItem;
    /** @type {?} */
    FlexibleShowcaseComponent.prototype.paginate;
    /** @type {?} */
    FlexibleShowcaseComponent.prototype.largeImage;
    /** @type {?} */
    FlexibleShowcaseComponent.prototype.slider;
    /** @type {?} */
    FlexibleShowcaseComponent.prototype.position;
    /** @type {?} */
    FlexibleShowcaseComponent.prototype.width;
    /** @type {?} */
    FlexibleShowcaseComponent.prototype.height;
    /** @type {?} */
    FlexibleShowcaseComponent.prototype.productId;
    /** @type {?} */
    FlexibleShowcaseComponent.prototype.zoomOnHover;
    /** @type {?} */
    FlexibleShowcaseComponent.prototype.peekOnHover;
    /** @type {?} */
    FlexibleShowcaseComponent.prototype.enableEventTracking;
    /** @type {?} */
    FlexibleShowcaseComponent.prototype.thumbnails;
    /** @type {?} */
    FlexibleShowcaseComponent.prototype.message;
    /** @type {?} */
    FlexibleShowcaseComponent.prototype.onEventTracking;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxleGlibGUtc2hvd2Nhc2UuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vZmxleGlibGUtc2hvd2Nhc2UvIiwic291cmNlcyI6WyJzcmMvYXBwL2ZsZXhpYmxlLXNob3djYXNlL2ZsZXhpYmxlLXNob3djYXNlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsT0FBTyxFQUNILFNBQVMsRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUVOLFVBQVUsRUFDVixZQUFZLEVBQ1osU0FBUyxFQUVULE1BQU0sZUFBZSxDQUFDO0FBUXZCLE1BQU07SUEyQ0Y7a0NBMUMwQixDQUFDOzZCQUNkLENBQUM7d0JBR04sS0FBSzsyQkFxQlEsS0FBSzsyQkFHTCxLQUFLO21DQUdHLEtBQUs7dUJBTWpCLGtCQUFrQjsrQkFHWixJQUFJLFlBQVksRUFBRTtLQUV6Qjs7OztJQUVuQixrQkFBa0I7UUFDakIsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ25DLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztLQUMzRDs7Ozs7SUFDRCxXQUFXLENBQUMsT0FBTztRQUNsQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxvQkFBb0IsQ0FBQztTQUNqRTtLQUNEOzs7Ozs7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O29CQUN6QixXQUFXLEVBQUUsRUFBRTtvQkFDZixNQUFNLEVBQUUsS0FBSztvQkFDYixLQUFLLEVBQUUsSUFBSTtvQkFDWCxJQUFJLEVBQUUsSUFBSSxJQUFJLEVBQUU7aUJBQ2hCLENBQUMsQ0FBQzthQUNIO1NBQ0Q7Ozs7WUE5S0YsU0FBUyxTQUFDO2dCQUNWLFFBQVEsRUFBRSxVQUFVO2dCQUNwQixtM01BQWlEOzthQUVqRDs7Ozs7eUJBUUMsU0FBUyxTQUFDLFlBQVk7cUJBR3RCLFNBQVMsU0FBQyxRQUFRO3VCQUdmLEtBQUssU0FBQyxVQUFVO29CQUduQixLQUFLLFNBQUMsT0FBTztxQkFHYixLQUFLLFNBQUMsUUFBUTt3QkFHZCxLQUFLLFNBQUMsV0FBVzswQkFHZCxLQUFLLFNBQUMsYUFBYTswQkFHbkIsS0FBSyxTQUFDLGFBQWE7a0NBR25CLEtBQUssU0FBQyxxQkFBcUI7eUJBRzNCLEtBQUssU0FBQyxZQUFZO3NCQUdsQixLQUFLLFNBQUMsU0FBUzs4QkFHbEIsTUFBTSxTQUFDLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQge1xyXG4gICAgQ29tcG9uZW50LFxyXG5cdElucHV0LFxyXG5cdE91dHB1dCxcclxuXHRBZnRlckNvbnRlbnRJbml0LFxyXG5cdEVsZW1lbnRSZWYsXHJcblx0RXZlbnRFbWl0dGVyLFxyXG5cdFZpZXdDaGlsZCxcclxuXHRPbkNoYW5nZXNcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcblxyXG5AQ29tcG9uZW50KHtcclxuXHRzZWxlY3RvcjogJ3Nob3djYXNlJyxcclxuXHR0ZW1wbGF0ZVVybDogJy4vZmxleGlibGUtc2hvd2Nhc2UuY29tcG9uZW50Lmh0bWwnLFxyXG5cdHN0eWxlVXJsczogWycuL2ZsZXhpYmxlLXNob3djYXNlLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIEZsZXhpYmxlU2hvd2Nhc2VDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkNoYW5nZXMgIHtcclxuXHRwcml2YXRlIHRyYW5zbGF0ZWRQb3NpdGlvbiA9IDA7XHJcblx0c2VsZWN0ZWRJbmRleCA9IDA7XHJcblx0c2VsZWN0ZWRJdGVtOiBhbnk7XHJcblx0aG92ZXJJdGVtOiBhbnk7XHJcblx0cGFnaW5hdGUgPSBmYWxzZTtcclxuXHJcblx0QFZpZXdDaGlsZChcImxhcmdlSW1hZ2VcIilcclxuXHRwcml2YXRlIGxhcmdlSW1hZ2U6IEVsZW1lbnRSZWY7XHJcblxyXG5cdEBWaWV3Q2hpbGQoXCJzbGlkZXJcIilcclxuXHRwcml2YXRlIHNsaWRlcjogRWxlbWVudFJlZjtcclxuXHJcbiAgICBASW5wdXQoXCJwb3NpdGlvblwiKVxyXG4gICAgcHVibGljIHBvc2l0aW9uOiBzdHJpbmc7IC8vIHRvcCwgbGVmdCwgYm90dG9tLCByaWdodFxyXG5cclxuXHRASW5wdXQoXCJ3aWR0aFwiKVxyXG4gICAgcHVibGljIHdpZHRoOiBudW1iZXI7XHJcblxyXG5cdEBJbnB1dChcImhlaWdodFwiKVxyXG4gICAgcHVibGljIGhlaWdodDogbnVtYmVyO1xyXG5cclxuXHRASW5wdXQoXCJwcm9kdWN0SWRcIilcclxuICAgIHB1YmxpYyBwcm9kdWN0SWQ6IHN0cmluZztcclxuXHRcclxuICAgIEBJbnB1dChcInpvb21PbkhvdmVyXCIpXHJcbiAgICBwdWJsaWMgem9vbU9uSG92ZXIgPSBmYWxzZVxyXG5cclxuICAgIEBJbnB1dChcInBlZWtPbkhvdmVyXCIpXHJcbiAgICBwdWJsaWMgcGVla09uSG92ZXIgPSBmYWxzZVxyXG5cclxuICAgIEBJbnB1dChcImVuYWJsZUV2ZW50VHJhY2tpbmdcIilcclxuICAgIHB1YmxpYyBlbmFibGVFdmVudFRyYWNraW5nID0gZmFsc2VcclxuXHJcbiAgICBASW5wdXQoXCJ0aHVtYm5haWxzXCIpXHJcbiAgICBwdWJsaWMgdGh1bWJuYWlsczogYW55W107XHJcblxyXG4gICAgQElucHV0KFwibWVzc2FnZVwiKVxyXG4gICAgcHVibGljIG1lc3NhZ2UgPSBcImNsaWNrIHRvIHNlbGVjdCBcIjtcclxuXHJcblx0QE91dHB1dCgnb25FdmVudFRyYWNraW5nJylcclxuXHRwcml2YXRlIG9uRXZlbnRUcmFja2luZyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG5cdG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcclxuXHRcdHRoaXMuc2VsZWN0ZWRJbmRleCA9IDA7XHJcblx0XHR0aGlzLnRodW1ibmFpbHNbMF0uc2VsZWN0ZWQgPSB0cnVlO1xyXG5cdFx0dGhpcy5zZWxlY3RlZEl0ZW0gPSB0aGlzLnRodW1ibmFpbHNbMF07XHJcblx0XHR0aGlzLnBhZ2luYXRlID0gKHRoaXMudGh1bWJuYWlscy5sZW5ndGggKiA2MCkgPiB0aGlzLndpZHRoO1xyXG5cdH1cclxuXHRuZ09uQ2hhbmdlcyhjaGFuZ2VzKSB7XHJcblx0XHRpZiAoY2hhbmdlcy5wb3NpdGlvbiAmJiB0aGlzLnNsaWRlcikge1xyXG5cdFx0XHR0aGlzLnRyYW5zbGF0ZWRQb3NpdGlvbiA9IDA7XHJcblx0XHRcdHRoaXMuc2xpZGVyLm5hdGl2ZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUoMHB4LDBweClcIjtcclxuXHRcdH1cclxuXHR9XHJcblx0aG92ZXJPdmVyKGV2ZW50LCBpdGVtKSB7XHJcblx0XHRpZiAodGhpcy56b29tT25Ib3ZlciAmJiBldmVudC50YXJnZXQubm9kZU5hbWUgPT09ICdJTUcnKSB7XHJcblx0XHRcdHRoaXMuZmlyZVRyYWNraW5nRXZlbnQoaXRlbS50aXRsZSwgaXRlbS50aHVtYm5haWxJZCwgXCJ6b29tZWRcIik7XHJcblx0XHR9XHJcblx0fVxyXG5cdGhvdmVyT3V0KGV2ZW50KSB7XHJcblx0XHRpZiAodGhpcy5sYXJnZUltYWdlKSB7XHJcblx0XHRcdHRoaXMubGFyZ2VJbWFnZS5uYXRpdmVFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xyXG5cdFx0XHR0aGlzLmxhcmdlSW1hZ2UubmF0aXZlRWxlbWVudC5zdHlsZS50b3AgPSBcIi0xMDAwMHB4XCI7XHJcblx0XHRcdHRoaXMubGFyZ2VJbWFnZS5uYXRpdmVFbGVtZW50LnN0eWxlLmxlZnQgPSBcIi0xMDAwMHB4XCI7XHJcblx0XHR9XHJcblx0fVxyXG5cdGhvdmVyVmlld1BvcnQoZXZlbnQpIHtcclxuXHRcdGlmICh0aGlzLnpvb21PbkhvdmVyICYmIGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gJ0lNRycpIHtcclxuXHRcdFx0dGhpcy5sYXJnZUltYWdlLm5hdGl2ZUVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDE7XHJcblx0XHRcdHRoaXMubGFyZ2VJbWFnZS5uYXRpdmVFbGVtZW50LnN0eWxlLnRvcCA9IC1ldmVudC5sYXllclkgKyBcInB4XCI7XHJcblx0XHRcdHRoaXMubGFyZ2VJbWFnZS5uYXRpdmVFbGVtZW50LnN0eWxlLmxlZnQgPSAtZXZlbnQubGF5ZXJYICsgXCJweFwiO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRzaGlmdERpc3BsYXkocG9zaXRpb24sIHRvRW5kKSB7XHRcdFxyXG5cdFx0aWYgKHBvc2l0aW9uID09PSBcInRvcFwiIHx8IHBvc2l0aW9uID09PSBcImJvdHRvbVwiKSB7XHJcblx0XHRcdHRoaXMudHJhbnNsYXRlZFBvc2l0aW9uICs9ICh0b0VuZCA/IC02MCA6IDYwKTtcclxuXHRcdFx0dGhpcy50cmFuc2xhdGVkUG9zaXRpb24gPSB0aGlzLnRyYW5zbGF0ZWRQb3NpdGlvbiA+IDAgPyAwIDogdGhpcy50cmFuc2xhdGVkUG9zaXRpb247XHJcblx0XHRcdHRoaXMuc2xpZGVyLm5hdGl2ZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGVYKFwiICsgdGhpcy50cmFuc2xhdGVkUG9zaXRpb24gKyBcInB4KVwiO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy50cmFuc2xhdGVkUG9zaXRpb24gKz0gKHRvRW5kID8gLTYwIDogNjApO1xyXG5cdFx0XHR0aGlzLnRyYW5zbGF0ZWRQb3NpdGlvbiA9IHRoaXMudHJhbnNsYXRlZFBvc2l0aW9uID4gMCA/IDAgOiB0aGlzLnRyYW5zbGF0ZWRQb3NpdGlvbjtcclxuXHRcdFx0dGhpcy5zbGlkZXIubmF0aXZlRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZVkoXCIgKyB0aGlzLnRyYW5zbGF0ZWRQb3NpdGlvbiArIFwicHgpXCI7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuZW5hYmxlRXZlbnRUcmFja2luZykge1xyXG5cdFx0XHR0aGlzLm9uRXZlbnRUcmFja2luZy5lbWl0KHtcclxuXHRcdFx0XHRwcm9kdWN0SWQ6IHRoaXMucHJvZHVjdElkLFxyXG5cdFx0XHRcdGFjdGlvbjogXCJ0aG9tYm5haWwgc2hpZnRcIixcclxuXHRcdFx0XHR0aW1lOiBuZXcgRGF0ZSgpXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRrZXl1cChldmVudCkge1xyXG4gICAgICAgIGNvbnN0IGNvZGUgPSBldmVudC53aGljaDtcclxuXHRcdFxyXG5cdFx0aWYgKGNvZGUgPT09IDEzKSB7XHJcblx0XHRcdGV2ZW50LnRhcmdldC5jbGljaygpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHR2aWRlb1BsYXllZChpdGVtLCB0cmFja2luZ1RpbWUpIHtcclxuXHRcdHRoaXMuZmlyZVRyYWNraW5nRXZlbnQoXHJcblx0XHRcdGl0ZW0udGl0bGUsXHJcblx0XHRcdGl0ZW0udGh1bWJuYWlsSWQsXHJcblx0XHRcdFwicGxheS12aWRlb1wiLFxyXG5cdFx0XHR0cmFja2luZ1RpbWVcclxuXHRcdCk7XHJcblx0fVxyXG5cdHZpZGVvUGF1c2VkKGl0ZW0sIHRyYWNraW5nVGltZSkge1xyXG5cdFx0dGhpcy5maXJlVHJhY2tpbmdFdmVudChcclxuXHRcdFx0aXRlbS50aXRsZSxcclxuXHRcdFx0aXRlbS50aHVtYm5haWxJZCxcclxuXHRcdFx0XCJwYXVzZS12aWRlb1wiLFxyXG5cdFx0XHR0cmFja2luZ1RpbWVcclxuXHRcdCk7XHJcblx0fVxyXG5cdHZpZGVvRW5kZWQoaXRlbSwgdHJhY2tpbmdUaW1lKSB7XHJcblx0XHR0aGlzLmZpcmVUcmFja2luZ0V2ZW50KFxyXG5cdFx0XHRpdGVtLnRpdGxlLFxyXG5cdFx0XHRpdGVtLnRodW1ibmFpbElkLFxyXG5cdFx0XHRcImVuZC12aWRlb1wiLFxyXG5cdFx0XHR0cmFja2luZ1RpbWVcclxuXHRcdCk7XHJcblx0fVxyXG5cdGhvdmVyVGFiKGksIG9uaG92ZXIpIHtcclxuXHRcdGlmICh0aGlzLnBlZWtPbkhvdmVyKSB7XHJcblx0XHRcdHRoaXMuaG92ZXJJdGVtID0gdGhpcy50aHVtYm5haWxzW2ldO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5maXJlVHJhY2tpbmdFdmVudChcclxuXHRcdFx0dGhpcy50aHVtYm5haWxzW2ldLnRpdGxlLFxyXG5cdFx0XHR0aGlzLnRodW1ibmFpbHNbaV0udGh1bWJuYWlsSWQsXHJcblx0XHRcdG9uaG92ZXIgPyBcImhvdmVyXCIgOiBcImZvY3VzXCJcclxuXHRcdCk7XHJcblx0fVxyXG5cdHNlbGVjdFRhYihpKSB7XHJcblx0XHR0aGlzLnRodW1ibmFpbHMubWFwKCh0YWIpPT57XHJcblx0XHRcdHRhYi5zZWxlY3RlZCA9IGZhbHNlO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnNlbGVjdGVkSW5kZXggPSBpO1xyXG5cdFx0dGhpcy50aHVtYm5haWxzW2ldLnNlbGVjdGVkID0gdHJ1ZTtcclxuXHRcdHRoaXMuc2VsZWN0ZWRJdGVtID0gdGhpcy50aHVtYm5haWxzW2ldO1xyXG5cdFx0dGhpcy5maXJlVHJhY2tpbmdFdmVudChcclxuXHRcdFx0dGhpcy50aHVtYm5haWxzW2ldLnRpdGxlLFxyXG5cdFx0XHR0aGlzLnRodW1ibmFpbHNbaV0udGh1bWJuYWlsSWQsXHJcblx0XHRcdFwic2VsZWN0XCJcclxuXHRcdCk7XHJcblx0fVxyXG5cdHByaXZhdGUgZmlyZVRyYWNraW5nRXZlbnQobmFtZSwgaWQsIGV2ZW50LCB0cmFjaz8pIHtcclxuXHRcdGlmICh0aGlzLmVuYWJsZUV2ZW50VHJhY2tpbmcpIHtcclxuXHRcdFx0aWYgKHRyYWNrKSB7XHJcblx0XHRcdFx0dGhpcy5vbkV2ZW50VHJhY2tpbmcuZW1pdCh7XHJcblx0XHRcdFx0XHRwcm9kdWN0SWQ6IHRoaXMucHJvZHVjdElkLFxyXG5cdFx0XHRcdFx0dGh1bWJuYWlsSWQ6IGlkLFxyXG5cdFx0XHRcdFx0YWN0aW9uOiBldmVudCxcclxuXHRcdFx0XHRcdHRpdGxlOiBuYW1lLFxyXG5cdFx0XHRcdFx0Y3VycmVudFRpbWU6IHRyYWNrLFxyXG5cdFx0XHRcdFx0dGltZTogbmV3IERhdGUoKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMub25FdmVudFRyYWNraW5nLmVtaXQoe1xyXG5cdFx0XHRcdFx0cHJvZHVjdElkOiB0aGlzLnByb2R1Y3RJZCxcclxuXHRcdFx0XHRcdHRodW1ibmFpbElkOiBpZCxcclxuXHRcdFx0XHRcdGFjdGlvbjogZXZlbnQsXHJcblx0XHRcdFx0XHR0aXRsZTogbmFtZSxcclxuXHRcdFx0XHRcdHRpbWU6IG5ldyBEYXRlKClcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iXX0=