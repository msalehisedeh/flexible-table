(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('flexible-showcase', ['exports', '@angular/core', '@angular/common'], factory) :
    (factory((global['flexible-showcase'] = {}),global.ng.core,global.ng.common));
}(this, (function (exports,core,common) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var FlexibleShowcaseComponent = (function () {
        function FlexibleShowcaseComponent() {
            this.translatedPosition = 0;
            this.selectedIndex = 0;
            this.paginate = false;
            this.zoomOnHover = false;
            this.peekOnHover = false;
            this.enableEventTracking = false;
            this.message = "click to select ";
            this.onEventTracking = new core.EventEmitter();
        }
        /**
         * @return {?}
         */
        FlexibleShowcaseComponent.prototype.ngAfterContentInit = /**
         * @return {?}
         */
            function () {
                this.selectedIndex = 0;
                this.thumbnails[0].selected = true;
                this.selectedItem = this.thumbnails[0];
                this.paginate = (this.thumbnails.length * 60) > this.width;
            };
        /**
         * @param {?} changes
         * @return {?}
         */
        FlexibleShowcaseComponent.prototype.ngOnChanges = /**
         * @param {?} changes
         * @return {?}
         */
            function (changes) {
                if (changes.position && this.slider) {
                    this.translatedPosition = 0;
                    this.slider.nativeElement.style.transform = "translate(0px,0px)";
                }
            };
        /**
         * @param {?} event
         * @param {?} item
         * @return {?}
         */
        FlexibleShowcaseComponent.prototype.hoverOver = /**
         * @param {?} event
         * @param {?} item
         * @return {?}
         */
            function (event, item) {
                if (this.zoomOnHover && event.target.nodeName === 'IMG') {
                    this.fireTrackingEvent(item.title, item.thumbnailId, "zoomed");
                }
            };
        /**
         * @param {?} event
         * @return {?}
         */
        FlexibleShowcaseComponent.prototype.hoverOut = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                if (this.largeImage) {
                    this.largeImage.nativeElement.style.opacity = 0;
                    this.largeImage.nativeElement.style.top = "-10000px";
                    this.largeImage.nativeElement.style.left = "-10000px";
                }
            };
        /**
         * @param {?} event
         * @return {?}
         */
        FlexibleShowcaseComponent.prototype.hoverViewPort = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                if (this.zoomOnHover && event.target.nodeName === 'IMG') {
                    this.largeImage.nativeElement.style.opacity = 1;
                    this.largeImage.nativeElement.style.top = -event.layerY + "px";
                    this.largeImage.nativeElement.style.left = -event.layerX + "px";
                }
            };
        /**
         * @param {?} position
         * @param {?} toEnd
         * @return {?}
         */
        FlexibleShowcaseComponent.prototype.shiftDisplay = /**
         * @param {?} position
         * @param {?} toEnd
         * @return {?}
         */
            function (position, toEnd) {
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
            };
        /**
         * @param {?} event
         * @return {?}
         */
        FlexibleShowcaseComponent.prototype.keyup = /**
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
        /**
         * @param {?} item
         * @param {?} trackingTime
         * @return {?}
         */
        FlexibleShowcaseComponent.prototype.videoPlayed = /**
         * @param {?} item
         * @param {?} trackingTime
         * @return {?}
         */
            function (item, trackingTime) {
                this.fireTrackingEvent(item.title, item.thumbnailId, "play-video", trackingTime);
            };
        /**
         * @param {?} item
         * @param {?} trackingTime
         * @return {?}
         */
        FlexibleShowcaseComponent.prototype.videoPaused = /**
         * @param {?} item
         * @param {?} trackingTime
         * @return {?}
         */
            function (item, trackingTime) {
                this.fireTrackingEvent(item.title, item.thumbnailId, "pause-video", trackingTime);
            };
        /**
         * @param {?} item
         * @param {?} trackingTime
         * @return {?}
         */
        FlexibleShowcaseComponent.prototype.videoEnded = /**
         * @param {?} item
         * @param {?} trackingTime
         * @return {?}
         */
            function (item, trackingTime) {
                this.fireTrackingEvent(item.title, item.thumbnailId, "end-video", trackingTime);
            };
        /**
         * @param {?} i
         * @param {?} onhover
         * @return {?}
         */
        FlexibleShowcaseComponent.prototype.hoverTab = /**
         * @param {?} i
         * @param {?} onhover
         * @return {?}
         */
            function (i, onhover) {
                if (this.peekOnHover) {
                    this.hoverItem = this.thumbnails[i];
                }
                this.fireTrackingEvent(this.thumbnails[i].title, this.thumbnails[i].thumbnailId, onhover ? "hover" : "focus");
            };
        /**
         * @param {?} i
         * @return {?}
         */
        FlexibleShowcaseComponent.prototype.selectTab = /**
         * @param {?} i
         * @return {?}
         */
            function (i) {
                this.thumbnails.map(function (tab) {
                    tab.selected = false;
                });
                this.selectedIndex = i;
                this.thumbnails[i].selected = true;
                this.selectedItem = this.thumbnails[i];
                this.fireTrackingEvent(this.thumbnails[i].title, this.thumbnails[i].thumbnailId, "select");
            };
        /**
         * @param {?} name
         * @param {?} id
         * @param {?} event
         * @param {?=} track
         * @return {?}
         */
        FlexibleShowcaseComponent.prototype.fireTrackingEvent = /**
         * @param {?} name
         * @param {?} id
         * @param {?} event
         * @param {?=} track
         * @return {?}
         */
            function (name, id, event, track) {
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
            };
        FlexibleShowcaseComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'showcase',
                        template: "\r\n<div class=\"showcase {{position}}\">\r\n    <div class=\"showcase-control {{position}}\" \r\n        role=\"list\" \r\n        [style.width]=\"position === 'top' ? width + 'px' : null\" \r\n        [style.height]=\"position === 'left' ? height + 'px' : null\"\r\n        *ngIf=\"position === 'top' || position === 'left'\">\r\n        <div class=\"slide-control\" \r\n            [class.left]=\"position == 'top'\"\r\n            [class.up]=\"position == 'left'\"\r\n            *ngIf=\"paginate\" \r\n            (click)=\"shiftDisplay(position, false)\">\r\n            <span *ngIf=\"position === 'top'\" class=\"fa fa-angle-left\" aria-hidden=\"true\"></span>\r\n            <span *ngIf=\"position === 'left'\" class=\"fa fa-angle-up\" aria-hidden=\"true\"></span>\r\n        </div>\r\n        <div class=\"sliding-viewport\" [class.paginate]=\"paginate\" #slider>\r\n        <a *ngFor=\"let item of thumbnails; let i = index\" \r\n            role=\"listitem\" \r\n            tabindex=\"0\"\r\n            (keyup)=\"keyup($event)\" \r\n            (click)=\"selectTab(i)\"\r\n            (focus)=\"hoverTab(i, false)\"\r\n            (mouseenter)=\"hoverTab(i, true)\"\r\n            (mouseleave)=\"hoverItem = undefined\"\r\n            [title]=\"item.title\" \r\n            [class.selected]=\"item.selected\">\r\n            <span class=\"off-screen\" [textContent]=\"message\"></span>\r\n            <span class=\"title off-screen\" [textContent]=\"item.title\"></span>\r\n            <img  class=\"content\" [src]=\"item.src.small\" *ngIf=\"item.type === 'image'\" />\r\n            <video height=\"100%\" class=\"content\" *ngIf=\"item.type === 'video'\" disabled=\"disabled\" tabindex=\"-1\">\r\n                <source [src]=\"item.src.mp4\" type=\"video/mp4\">\r\n                <source [src]=\"item.src.webm\" type=\"video/webm\">\r\n                <source [src]=\"item.src.egg\" type=\"video/ogg\">\r\n            </video>\r\n        </a>\r\n        </div>\r\n        <div class=\"slide-control\" \r\n            [class.right]=\"position == 'top'\"\r\n            [class.down]=\"position == 'left'\"\r\n            *ngIf=\"paginate\" \r\n            (click)=\"shiftDisplay(position, true)\">\r\n            <span *ngIf=\"position === 'top'\" class=\"fa fa-angle-right\" aria-hidden=\"true\"></span>\r\n            <span *ngIf=\"position === 'left'\" class=\"fa fa-angle-down\" aria-hidden=\"true\"></span>\r\n        </div>\r\n    </div>\r\n    <div \r\n        class=\"showcase-viewport\" \r\n        [style.width]=\"width + 'px'\" \r\n        [style.height]=\"height + 'px'\"\r\n        (mouseout)=\"hoverOut($event)\"\r\n        (mouseover)=\"hoverOver($event, selectedItem)\"\r\n        (mousemove)=\"hoverViewPort($event)\">\r\n        <img  class=\"content\" \r\n                [src]=\"hoverItem ? hoverItem.src.medium : selectedItem.src.medium\" \r\n                *ngIf=\"(hoverItem ? hoverItem.type === 'image' : selectedItem.type === 'image')\" />\r\n        <img  class=\"hover\" #largeImage\r\n                [style.width]=\"(width*2) + 'px'\"\r\n                [style.height]=\"(height*2) + 'px'\"\r\n                [src]=\"selectedItem.src.large\" \r\n                *ngIf=\"zoomOnHover && selectedItem.type === 'image'\" />\r\n        <video  \r\n            class=\"content\" #video\r\n            [style.width]=\"width + 'px'\" \r\n            [style.height]=\"height + 'px'\"\r\n            (play)=\"videoPlayed(selectedItem, video.currentTime)\"\r\n            (pause)=\"videoPaused(selectedItem, video.currentTime)\"\r\n            (ended)=\"videoEnded(selectedItem, video.currentTime)\"\r\n            *ngIf=\"(hoverItem ? hoverItem.type === 'video' : selectedItem.type === 'video')\" controls>\r\n            <source [src]=\"hoverItem ? hoverItem.src.mp4 : selectedItem.src.mp4\" type=\"video/mp4\">\r\n            <source [src]=\"hoverItem ? hoverItem.src.webm : selectedItem.src.webm\" type=\"video/webm\">\r\n            <source [src]=\"hoverItem ? hoverItem.src.egg : selectedItem.src.egg\" type=\"video/ogg\">\r\n        </video>\r\n    </div>\r\n    <div class=\"showcase-control {{position}}\" \r\n        role=\"list\" \r\n        [style.width]=\"position === 'bottom' ? width + 'px' : null\" \r\n        [style.height]=\"position === 'right' ? height + 'px' : null\"\r\n        *ngIf=\"position === 'bottom' || position === 'right'\">\r\n        <div class=\"slide-control\" \r\n            [class.left]=\"position == 'bottom'\"\r\n            [class.up]=\"position == 'right'\"\r\n            *ngIf=\"paginate\" \r\n            (click)=\"shiftDisplay(position, false)\">\r\n            <span *ngIf=\"position === 'bottom'\" class=\"fa fa-angle-left\" aria-hidden=\"true\"></span>\r\n            <span *ngIf=\"position === 'right'\" class=\"fa fa-angle-up\" aria-hidden=\"true\"></span>\r\n        </div>\r\n        <div class=\"sliding-viewport\" [class.paginate]=\"paginate\" #slider>\r\n        <a *ngFor=\"let item of thumbnails; let i = index\" \r\n            role=\"listitem\" \r\n            tabindex=\"0\"\r\n            (keyup)=\"keyup($event)\" \r\n            (click)=\"selectTab(i)\"\r\n            (focus)=\"hoverTab(i, false)\"\r\n            (mouseenter)=\"hoverTab(i, true)\"\r\n            [title]=\"item.title\" \r\n            [class.selected]=\"item.selected\">\r\n            <span class=\"off-screen\" [textContent]=\"message\"></span>\r\n            <span class=\"title off-screen\" [textContent]=\"item.title\"></span>\r\n            <img  class=\"content\" [src]=\"item.src.small\" *ngIf=\"item.type === 'image'\" />\r\n            <video  height=\"100%\" class=\"content\" *ngIf=\"item.type === 'video'\" disabled=\"disabled\" tabindex=\"-1\">\r\n                <source [src]=\"item.src.mp4\" type=\"video/mp4\">\r\n                <source [src]=\"item.src.webm\" type=\"video/webm\">\r\n                <source [src]=\"item.src.egg\" type=\"video/ogg\">\r\n            </video>\r\n        </a>\r\n        </div>\r\n        <div class=\"slide-control\" \r\n            [class.right]=\"position == 'bottom'\"\r\n            [class.down]=\"position == 'right'\"\r\n            *ngIf=\"paginate\" \r\n            (click)=\"shiftDisplay(position, true)\">\r\n            <span *ngIf=\"position === 'bottom'\" class=\"fa fa-angle-right\" aria-hidden=\"true\"></span>\r\n            <span *ngIf=\"position === 'right'\" class=\"fa fa-angle-down\" aria-hidden=\"true\"></span>\r\n        </div>\r\n    </div>\r\n</div>\r\n",
                        styles: [".showcase{display:flex;width:100%}.showcase .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.showcase .showcase-viewport{box-sizing:border-box;border:1px solid #bcd;min-height:150px;overflow:hidden;position:relative}.showcase .showcase-viewport ::ng-deep img,.showcase .showcase-viewport video{width:100%}.showcase .showcase-viewport .hover{position:absolute;background-color:#fff;top:-10000px;left:-10000px;opacity:0;pointer-events:none}.showcase .showcase-control{border:1px solid #bcd;box-sizing:border-box;display:flex}.showcase .showcase-control.bottom,.showcase .showcase-control.top{flex-direction:row;overflow:hidden}.showcase .showcase-control.bottom .slide-control,.showcase .showcase-control.top .slide-control{width:20px;height:inherit;background-color:#fff;z-index:2}.showcase .showcase-control.bottom .slide-control.left,.showcase .showcase-control.top .slide-control.left{border-right:1px solid #bcd}.showcase .showcase-control.bottom .slide-control.right,.showcase .showcase-control.top .slide-control.right{border-left:1px solid #bcd}.showcase .showcase-control.bottom .slide-control .fa,.showcase .showcase-control.top .slide-control .fa{font-weight:700;margin:99% 30%;font-size:1.6rem}.showcase .showcase-control.bottom .sliding-viewport.paginate,.showcase .showcase-control.top .sliding-viewport.paginate{width:calc(100% - 40px)}.showcase .showcase-control.left,.showcase .showcase-control.right{flex-direction:column;overflow:hidden}.showcase .showcase-control.left .slide-control,.showcase .showcase-control.right .slide-control{height:20px;width:inherit;background-color:#fff;z-index:2}.showcase .showcase-control.left .slide-control.up,.showcase .showcase-control.right .slide-control.up{border-bottom:1px solid #bcd}.showcase .showcase-control.left .slide-control.down,.showcase .showcase-control.right .slide-control.down{border-top:1px solid #bcd}.showcase .showcase-control.left .slide-control .fa,.showcase .showcase-control.right .slide-control .fa{font-weight:700;margin:0 29%;font-size:1.6rem}.showcase .showcase-control.left .sliding-viewport.paginate,.showcase .showcase-control.right .sliding-viewport.paginate{height:calc(100% - 40px)}.showcase .showcase-control .sliding-viewport{display:flex}.showcase .showcase-control .sliding-viewport a{box-sizing:border-box;white-space:nowrap;border:0;cursor:pointer}.showcase .showcase-control .sliding-viewport a ::ng-deep img,.showcase .showcase-control .sliding-viewport a video{width:60px}.showcase.top{flex-direction:column}.showcase.top .showcase-control{flex-wrap:nowrap}.showcase.top .showcase-control .sliding-viewport{flex-direction:row}.showcase.bottom{flex-direction:column}.showcase.bottom .showcase-control{flex-wrap:nowrap}.showcase.bottom .showcase-control .sliding-viewport,.showcase.left{flex-direction:row}.showcase.left .showcase-control{flex-wrap:nowrap;flex:1}.showcase.left .showcase-control .sliding-viewport{flex-direction:column}.showcase.right{flex-direction:row}.showcase.right .showcase-control{flex-wrap:nowrap;flex:1}.showcase.right .showcase-control .sliding-viewport{flex-direction:column}@media screen and (max-width:600px){.showcase{display:table}.showcase-control{display:block}.showcase-control a{width:100%;display:table}.showcase-viewport{margin:5px 0}}"]
                    }] }
        ];
        /** @nocollapse */
        FlexibleShowcaseComponent.ctorParameters = function () { return []; };
        FlexibleShowcaseComponent.propDecorators = {
            largeImage: [{ type: core.ViewChild, args: ["largeImage",] }],
            slider: [{ type: core.ViewChild, args: ["slider",] }],
            position: [{ type: core.Input, args: ["position",] }],
            width: [{ type: core.Input, args: ["width",] }],
            height: [{ type: core.Input, args: ["height",] }],
            productId: [{ type: core.Input, args: ["productId",] }],
            zoomOnHover: [{ type: core.Input, args: ["zoomOnHover",] }],
            peekOnHover: [{ type: core.Input, args: ["peekOnHover",] }],
            enableEventTracking: [{ type: core.Input, args: ["enableEventTracking",] }],
            thumbnails: [{ type: core.Input, args: ["thumbnails",] }],
            message: [{ type: core.Input, args: ["message",] }],
            onEventTracking: [{ type: core.Output, args: ['onEventTracking',] }]
        };
        return FlexibleShowcaseComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var FlexibleShowcaseModule = (function () {
        function FlexibleShowcaseModule() {
        }
        FlexibleShowcaseModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [
                            common.CommonModule
                        ],
                        declarations: [
                            FlexibleShowcaseComponent
                        ],
                        exports: [
                            FlexibleShowcaseComponent
                        ],
                        entryComponents: [],
                        providers: [],
                        schemas: [core.CUSTOM_ELEMENTS_SCHEMA]
                    },] }
        ];
        return FlexibleShowcaseModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.FlexibleShowcaseComponent = FlexibleShowcaseComponent;
    exports.FlexibleShowcaseModule = FlexibleShowcaseModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxleGlibGUtc2hvd2Nhc2UudW1kLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9mbGV4aWJsZS1zaG93Y2FzZS9zcmMvYXBwL2ZsZXhpYmxlLXNob3djYXNlL2ZsZXhpYmxlLXNob3djYXNlLmNvbXBvbmVudC50cyIsIm5nOi8vZmxleGlibGUtc2hvd2Nhc2Uvc3JjL2FwcC9mbGV4aWJsZS1zaG93Y2FzZS9mbGV4aWJsZS1zaG93Y2FzZS1tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCB7XHJcbiAgICBDb21wb25lbnQsXHJcblx0SW5wdXQsXHJcblx0T3V0cHV0LFxyXG5cdEFmdGVyQ29udGVudEluaXQsXHJcblx0RWxlbWVudFJlZixcclxuXHRFdmVudEVtaXR0ZXIsXHJcblx0Vmlld0NoaWxkLFxyXG5cdE9uQ2hhbmdlc1xyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG5cdHNlbGVjdG9yOiAnc2hvd2Nhc2UnLFxyXG5cdHRlbXBsYXRlVXJsOiAnLi9mbGV4aWJsZS1zaG93Y2FzZS5jb21wb25lbnQuaHRtbCcsXHJcblx0c3R5bGVVcmxzOiBbJy4vZmxleGlibGUtc2hvd2Nhc2UuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRmxleGlibGVTaG93Y2FzZUNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uQ2hhbmdlcyAge1xyXG5cdHByaXZhdGUgdHJhbnNsYXRlZFBvc2l0aW9uID0gMDtcclxuXHRzZWxlY3RlZEluZGV4ID0gMDtcclxuXHRzZWxlY3RlZEl0ZW06IGFueTtcclxuXHRob3Zlckl0ZW06IGFueTtcclxuXHRwYWdpbmF0ZSA9IGZhbHNlO1xyXG5cclxuXHRAVmlld0NoaWxkKFwibGFyZ2VJbWFnZVwiKVxyXG5cdHByaXZhdGUgbGFyZ2VJbWFnZTogRWxlbWVudFJlZjtcclxuXHJcblx0QFZpZXdDaGlsZChcInNsaWRlclwiKVxyXG5cdHByaXZhdGUgc2xpZGVyOiBFbGVtZW50UmVmO1xyXG5cclxuICAgIEBJbnB1dChcInBvc2l0aW9uXCIpXHJcbiAgICBwdWJsaWMgcG9zaXRpb246IHN0cmluZzsgLy8gdG9wLCBsZWZ0LCBib3R0b20sIHJpZ2h0XHJcblxyXG5cdEBJbnB1dChcIndpZHRoXCIpXHJcbiAgICBwdWJsaWMgd2lkdGg6IG51bWJlcjtcclxuXHJcblx0QElucHV0KFwiaGVpZ2h0XCIpXHJcbiAgICBwdWJsaWMgaGVpZ2h0OiBudW1iZXI7XHJcblxyXG5cdEBJbnB1dChcInByb2R1Y3RJZFwiKVxyXG4gICAgcHVibGljIHByb2R1Y3RJZDogc3RyaW5nO1xyXG5cdFxyXG4gICAgQElucHV0KFwiem9vbU9uSG92ZXJcIilcclxuICAgIHB1YmxpYyB6b29tT25Ib3ZlciA9IGZhbHNlXHJcblxyXG4gICAgQElucHV0KFwicGVla09uSG92ZXJcIilcclxuICAgIHB1YmxpYyBwZWVrT25Ib3ZlciA9IGZhbHNlXHJcblxyXG4gICAgQElucHV0KFwiZW5hYmxlRXZlbnRUcmFja2luZ1wiKVxyXG4gICAgcHVibGljIGVuYWJsZUV2ZW50VHJhY2tpbmcgPSBmYWxzZVxyXG5cclxuICAgIEBJbnB1dChcInRodW1ibmFpbHNcIilcclxuICAgIHB1YmxpYyB0aHVtYm5haWxzOiBhbnlbXTtcclxuXHJcbiAgICBASW5wdXQoXCJtZXNzYWdlXCIpXHJcbiAgICBwdWJsaWMgbWVzc2FnZSA9IFwiY2xpY2sgdG8gc2VsZWN0IFwiO1xyXG5cclxuXHRAT3V0cHV0KCdvbkV2ZW50VHJhY2tpbmcnKVxyXG5cdHByaXZhdGUgb25FdmVudFRyYWNraW5nID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge31cclxuXHJcblx0bmdBZnRlckNvbnRlbnRJbml0KCkge1xyXG5cdFx0dGhpcy5zZWxlY3RlZEluZGV4ID0gMDtcclxuXHRcdHRoaXMudGh1bWJuYWlsc1swXS5zZWxlY3RlZCA9IHRydWU7XHJcblx0XHR0aGlzLnNlbGVjdGVkSXRlbSA9IHRoaXMudGh1bWJuYWlsc1swXTtcclxuXHRcdHRoaXMucGFnaW5hdGUgPSAodGhpcy50aHVtYm5haWxzLmxlbmd0aCAqIDYwKSA+IHRoaXMud2lkdGg7XHJcblx0fVxyXG5cdG5nT25DaGFuZ2VzKGNoYW5nZXMpIHtcclxuXHRcdGlmIChjaGFuZ2VzLnBvc2l0aW9uICYmIHRoaXMuc2xpZGVyKSB7XHJcblx0XHRcdHRoaXMudHJhbnNsYXRlZFBvc2l0aW9uID0gMDtcclxuXHRcdFx0dGhpcy5zbGlkZXIubmF0aXZlRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZSgwcHgsMHB4KVwiO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRob3Zlck92ZXIoZXZlbnQsIGl0ZW0pIHtcclxuXHRcdGlmICh0aGlzLnpvb21PbkhvdmVyICYmIGV2ZW50LnRhcmdldC5ub2RlTmFtZSA9PT0gJ0lNRycpIHtcclxuXHRcdFx0dGhpcy5maXJlVHJhY2tpbmdFdmVudChpdGVtLnRpdGxlLCBpdGVtLnRodW1ibmFpbElkLCBcInpvb21lZFwiKTtcclxuXHRcdH1cclxuXHR9XHJcblx0aG92ZXJPdXQoZXZlbnQpIHtcclxuXHRcdGlmICh0aGlzLmxhcmdlSW1hZ2UpIHtcclxuXHRcdFx0dGhpcy5sYXJnZUltYWdlLm5hdGl2ZUVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDA7XHJcblx0XHRcdHRoaXMubGFyZ2VJbWFnZS5uYXRpdmVFbGVtZW50LnN0eWxlLnRvcCA9IFwiLTEwMDAwcHhcIjtcclxuXHRcdFx0dGhpcy5sYXJnZUltYWdlLm5hdGl2ZUVsZW1lbnQuc3R5bGUubGVmdCA9IFwiLTEwMDAwcHhcIjtcclxuXHRcdH1cclxuXHR9XHJcblx0aG92ZXJWaWV3UG9ydChldmVudCkge1xyXG5cdFx0aWYgKHRoaXMuem9vbU9uSG92ZXIgJiYgZXZlbnQudGFyZ2V0Lm5vZGVOYW1lID09PSAnSU1HJykge1xyXG5cdFx0XHR0aGlzLmxhcmdlSW1hZ2UubmF0aXZlRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMTtcclxuXHRcdFx0dGhpcy5sYXJnZUltYWdlLm5hdGl2ZUVsZW1lbnQuc3R5bGUudG9wID0gLWV2ZW50LmxheWVyWSArIFwicHhcIjtcclxuXHRcdFx0dGhpcy5sYXJnZUltYWdlLm5hdGl2ZUVsZW1lbnQuc3R5bGUubGVmdCA9IC1ldmVudC5sYXllclggKyBcInB4XCI7XHJcblx0XHR9XHJcblx0fVxyXG5cdHNoaWZ0RGlzcGxheShwb3NpdGlvbiwgdG9FbmQpIHtcdFx0XHJcblx0XHRpZiAocG9zaXRpb24gPT09IFwidG9wXCIgfHwgcG9zaXRpb24gPT09IFwiYm90dG9tXCIpIHtcclxuXHRcdFx0dGhpcy50cmFuc2xhdGVkUG9zaXRpb24gKz0gKHRvRW5kID8gLTYwIDogNjApO1xyXG5cdFx0XHR0aGlzLnRyYW5zbGF0ZWRQb3NpdGlvbiA9IHRoaXMudHJhbnNsYXRlZFBvc2l0aW9uID4gMCA/IDAgOiB0aGlzLnRyYW5zbGF0ZWRQb3NpdGlvbjtcclxuXHRcdFx0dGhpcy5zbGlkZXIubmF0aXZlRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZVgoXCIgKyB0aGlzLnRyYW5zbGF0ZWRQb3NpdGlvbiArIFwicHgpXCI7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnRyYW5zbGF0ZWRQb3NpdGlvbiArPSAodG9FbmQgPyAtNjAgOiA2MCk7XHJcblx0XHRcdHRoaXMudHJhbnNsYXRlZFBvc2l0aW9uID0gdGhpcy50cmFuc2xhdGVkUG9zaXRpb24gPiAwID8gMCA6IHRoaXMudHJhbnNsYXRlZFBvc2l0aW9uO1xyXG5cdFx0XHR0aGlzLnNsaWRlci5uYXRpdmVFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlWShcIiArIHRoaXMudHJhbnNsYXRlZFBvc2l0aW9uICsgXCJweClcIjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5lbmFibGVFdmVudFRyYWNraW5nKSB7XHJcblx0XHRcdHRoaXMub25FdmVudFRyYWNraW5nLmVtaXQoe1xyXG5cdFx0XHRcdHByb2R1Y3RJZDogdGhpcy5wcm9kdWN0SWQsXHJcblx0XHRcdFx0YWN0aW9uOiBcInRob21ibmFpbCBzaGlmdFwiLFxyXG5cdFx0XHRcdHRpbWU6IG5ldyBEYXRlKClcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGtleXVwKGV2ZW50KSB7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG5cdFx0XHJcblx0XHRpZiAoY29kZSA9PT0gMTMpIHtcclxuXHRcdFx0ZXZlbnQudGFyZ2V0LmNsaWNrKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHZpZGVvUGxheWVkKGl0ZW0sIHRyYWNraW5nVGltZSkge1xyXG5cdFx0dGhpcy5maXJlVHJhY2tpbmdFdmVudChcclxuXHRcdFx0aXRlbS50aXRsZSxcclxuXHRcdFx0aXRlbS50aHVtYm5haWxJZCxcclxuXHRcdFx0XCJwbGF5LXZpZGVvXCIsXHJcblx0XHRcdHRyYWNraW5nVGltZVxyXG5cdFx0KTtcclxuXHR9XHJcblx0dmlkZW9QYXVzZWQoaXRlbSwgdHJhY2tpbmdUaW1lKSB7XHJcblx0XHR0aGlzLmZpcmVUcmFja2luZ0V2ZW50KFxyXG5cdFx0XHRpdGVtLnRpdGxlLFxyXG5cdFx0XHRpdGVtLnRodW1ibmFpbElkLFxyXG5cdFx0XHRcInBhdXNlLXZpZGVvXCIsXHJcblx0XHRcdHRyYWNraW5nVGltZVxyXG5cdFx0KTtcclxuXHR9XHJcblx0dmlkZW9FbmRlZChpdGVtLCB0cmFja2luZ1RpbWUpIHtcclxuXHRcdHRoaXMuZmlyZVRyYWNraW5nRXZlbnQoXHJcblx0XHRcdGl0ZW0udGl0bGUsXHJcblx0XHRcdGl0ZW0udGh1bWJuYWlsSWQsXHJcblx0XHRcdFwiZW5kLXZpZGVvXCIsXHJcblx0XHRcdHRyYWNraW5nVGltZVxyXG5cdFx0KTtcclxuXHR9XHJcblx0aG92ZXJUYWIoaSwgb25ob3Zlcikge1xyXG5cdFx0aWYgKHRoaXMucGVla09uSG92ZXIpIHtcclxuXHRcdFx0dGhpcy5ob3Zlckl0ZW0gPSB0aGlzLnRodW1ibmFpbHNbaV07XHJcblx0XHR9XHJcblx0XHR0aGlzLmZpcmVUcmFja2luZ0V2ZW50KFxyXG5cdFx0XHR0aGlzLnRodW1ibmFpbHNbaV0udGl0bGUsXHJcblx0XHRcdHRoaXMudGh1bWJuYWlsc1tpXS50aHVtYm5haWxJZCxcclxuXHRcdFx0b25ob3ZlciA/IFwiaG92ZXJcIiA6IFwiZm9jdXNcIlxyXG5cdFx0KTtcclxuXHR9XHJcblx0c2VsZWN0VGFiKGkpIHtcclxuXHRcdHRoaXMudGh1bWJuYWlscy5tYXAoKHRhYik9PntcclxuXHRcdFx0dGFiLnNlbGVjdGVkID0gZmFsc2U7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMuc2VsZWN0ZWRJbmRleCA9IGk7XHJcblx0XHR0aGlzLnRodW1ibmFpbHNbaV0uc2VsZWN0ZWQgPSB0cnVlO1xyXG5cdFx0dGhpcy5zZWxlY3RlZEl0ZW0gPSB0aGlzLnRodW1ibmFpbHNbaV07XHJcblx0XHR0aGlzLmZpcmVUcmFja2luZ0V2ZW50KFxyXG5cdFx0XHR0aGlzLnRodW1ibmFpbHNbaV0udGl0bGUsXHJcblx0XHRcdHRoaXMudGh1bWJuYWlsc1tpXS50aHVtYm5haWxJZCxcclxuXHRcdFx0XCJzZWxlY3RcIlxyXG5cdFx0KTtcclxuXHR9XHJcblx0cHJpdmF0ZSBmaXJlVHJhY2tpbmdFdmVudChuYW1lLCBpZCwgZXZlbnQsIHRyYWNrPykge1xyXG5cdFx0aWYgKHRoaXMuZW5hYmxlRXZlbnRUcmFja2luZykge1xyXG5cdFx0XHRpZiAodHJhY2spIHtcclxuXHRcdFx0XHR0aGlzLm9uRXZlbnRUcmFja2luZy5lbWl0KHtcclxuXHRcdFx0XHRcdHByb2R1Y3RJZDogdGhpcy5wcm9kdWN0SWQsXHJcblx0XHRcdFx0XHR0aHVtYm5haWxJZDogaWQsXHJcblx0XHRcdFx0XHRhY3Rpb246IGV2ZW50LFxyXG5cdFx0XHRcdFx0dGl0bGU6IG5hbWUsXHJcblx0XHRcdFx0XHRjdXJyZW50VGltZTogdHJhY2ssXHJcblx0XHRcdFx0XHR0aW1lOiBuZXcgRGF0ZSgpXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5vbkV2ZW50VHJhY2tpbmcuZW1pdCh7XHJcblx0XHRcdFx0XHRwcm9kdWN0SWQ6IHRoaXMucHJvZHVjdElkLFxyXG5cdFx0XHRcdFx0dGh1bWJuYWlsSWQ6IGlkLFxyXG5cdFx0XHRcdFx0YWN0aW9uOiBldmVudCxcclxuXHRcdFx0XHRcdHRpdGxlOiBuYW1lLFxyXG5cdFx0XHRcdFx0dGltZTogbmV3IERhdGUoKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsIi8qXHJcbiogUHJvdmlkZXMgcmVuZGVyaW5nIG9mIGZsZXhpYmxlIHRhYnMgaW4gYSBsYXp5IGxvYWQgZmFzaGlvbi5cclxuKi9cclxuaW1wb3J0IHsgTmdNb2R1bGUsIENVU1RPTV9FTEVNRU5UU19TQ0hFTUEgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuXHJcbmltcG9ydCB7IEZsZXhpYmxlU2hvd2Nhc2VDb21wb25lbnQgfSBmcm9tICcuL2ZsZXhpYmxlLXNob3djYXNlLmNvbXBvbmVudCc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gICAgaW1wb3J0czogW1xyXG4gICAgICAgIENvbW1vbk1vZHVsZVxyXG4gICAgXSxcclxuICAgIGRlY2xhcmF0aW9uczogW1xyXG4gICAgICAgIEZsZXhpYmxlU2hvd2Nhc2VDb21wb25lbnRcclxuICAgIF0sXHJcbiAgICBleHBvcnRzOiBbXHJcbiAgICAgICAgRmxleGlibGVTaG93Y2FzZUNvbXBvbmVudFxyXG4gICAgXSxcclxuICAgIGVudHJ5Q29tcG9uZW50czogW1xyXG4gICAgXSxcclxuICAgIHByb3ZpZGVyczogW1xyXG4gICAgXSxcclxuICAgIHNjaGVtYXM6IFtDVVNUT01fRUxFTUVOVFNfU0NIRU1BXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIEZsZXhpYmxlU2hvd2Nhc2VNb2R1bGUge31cclxuIl0sIm5hbWVzIjpbIkV2ZW50RW1pdHRlciIsIkNvbXBvbmVudCIsIlZpZXdDaGlsZCIsIklucHV0IiwiT3V0cHV0IiwiTmdNb2R1bGUiLCJDb21tb25Nb2R1bGUiLCJDVVNUT01fRUxFTUVOVFNfU0NIRU1BIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0E7UUE0REk7c0NBMUMwQixDQUFDO2lDQUNkLENBQUM7NEJBR04sS0FBSzsrQkFxQlEsS0FBSzsrQkFHTCxLQUFLO3VDQUdHLEtBQUs7MkJBTWpCLGtCQUFrQjttQ0FHWixJQUFJQSxpQkFBWSxFQUFFO1NBRXpCOzs7O1FBRW5CLHNEQUFrQjs7O1lBQWxCO2dCQUNDLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO2dCQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQzNEOzs7OztRQUNELCtDQUFXOzs7O1lBQVgsVUFBWSxPQUFPO2dCQUNsQixJQUFJLE9BQU8sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDcEMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQztvQkFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxvQkFBb0IsQ0FBQztpQkFDakU7YUFDRDs7Ozs7O1FBQ0QsNkNBQVM7Ozs7O1lBQVQsVUFBVSxLQUFLLEVBQUUsSUFBSTtnQkFDcEIsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxLQUFLLEtBQUssRUFB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