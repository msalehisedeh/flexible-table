/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
export class ConfigurationComponent {
    constructor() {
        this.onchange = new EventEmitter();
        this.onprint = new EventEmitter();
    }
    /**
     * @param {?} item
     * @param {?} header
     * @return {?}
     */
    reconfigure(item, header) {
        header.present = item.checked;
        this.onchange.emit(this.headers);
    }
    /**
     * @param {?} item
     * @param {?} header
     * @return {?}
     */
    enableFilter(item, header) {
        if (header.filter === undefined) {
            header.filter = "";
        }
        else {
            delete header.filter;
        }
        this.onchange.emit(this.headers);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    print(event) {
        this.onprint.emit(true);
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
}
ConfigurationComponent.decorators = [
    { type: Component, args: [{
                selector: 'table-configuration',
                template: "\r\n<div class=\"shim\"\r\n    [style.display]=\"showConfigurationView ? 'block':'none'\"\r\n    (click)=\"showConfigurationView = !showConfigurationView\"></div>\r\n\r\n<a  [attr.tabindex]=\"0\" *ngIf=\"printTable\"\r\n    class=\"print-table\"\r\n    (keyup)=\"keyup($event)\"\r\n    (click)=\"print($event)\">\r\n    <span class=\"icon fa fa-print\" aria-hidden=\"true\"></span>\r\n    <span class=\"off-screen\" [textContent]=\"print\"></span>\r\n</a>\r\n<a  [attr.tabindex]=\"0\"\r\n    class=\"configure-table\"\r\n    (keyup)=\"keyup($event)\"\r\n    (click)=\"showConfigurationView = !showConfigurationView\">\r\n    <span class=\"icon fa fa-gear\" aria-hidden=\"true\"></span>\r\n    <span class=\"off-screen\" [textContent]=\"action\"></span>\r\n</a>\r\n<ng-container *ngIf=\"configAddon\" [ngTemplateOutlet]=\"configAddon\"></ng-container>\r\n\r\n<ul role=\"list\" [style.display]=\"showConfigurationView ? 'block':'none'\">\r\n    <p [textContent]=\"title\"></p>\r\n    <li  *ngFor=\"let header of headers\" role=\"listitem\">\r\n        <label for=\"{{header.key ? header.key+'f':'f'}}\">\r\n            <input type=\"checkbox\" #filter\r\n                    [id]=\"header.key ? header.key+'f':'f'\"\r\n                    [checked]=\"header.filter !== undefined\"\r\n                    (keyup)=\"keyup($event)\"\r\n                    (click)=\"enableFilter(filter, header)\" />\r\n            <span>Filter</span>\r\n        </label>\r\n        <label for=\"{{header.key ? header.key+'c':'c'}}\">\r\n            <input type=\"checkbox\" #checkbox\r\n                    [id]=\"header.key ? header.key+'c':'c'\"\r\n                    [value]=\"header.key\"\r\n                    [checked]=\"header.present\"\r\n                    (keyup)=\"keyup($event)\"\r\n                    (click)=\"reconfigure(checkbox, header)\" />\r\n            <span>Show</span>\r\n        </label>\r\n        <span class=\"title\" [textContent]=\"header.value | uppercase\"></span>\r\n    </li>\r\n</ul>\r\n",
                styles: [":host{box-sizing:border-box;padding:2px;position:absolute;right:8px;top:18px;z-index:2}:host a{display:block;float:left;padding:0 0 0 10px;cursor:pointer;z-index:5}:host a .icon{color:#00925b}:host a .off-screen{display:block;text-indent:-9999px;width:0;height:0;overflow:hidden}:host .shim{background-color:rgba(255,255,255,.2);width:100vw;height:100vh;position:fixed;top:0;left:0;z-index:2}:host ul{background-color:#fff;border:1px solid #999;border-radius:4px;display:flex;list-style:none;max-height:200px;margin:0 2px;min-width:200px;overflow-y:auto;position:absolute;padding:0 0 8px;right:0;box-shadow:6px 8px 6px -6px #1b1b1b;z-index:6}:host ul p{margin:0;padding:1px 5px;background-color:#5f9ea0;color:#fff}:host ul li{white-space:nowrap;text-align:left;flex-direction:row;padding:1px 5px}:host ul li label input{flex:0 0 30%;margin-top:4px}:host ul li .title{flex:0 0 30%;font-weight:700}"]
            }] }
];
ConfigurationComponent.propDecorators = {
    title: [{ type: Input, args: ["title",] }],
    action: [{ type: Input, args: ["action",] }],
    printTable: [{ type: Input, args: ["printTable",] }],
    headers: [{ type: Input, args: ["headers",] }],
    configAddon: [{ type: Input, args: ["configAddon",] }],
    onchange: [{ type: Output, args: ['onchange',] }],
    onprint: [{ type: Output, args: ['onprint',] }]
};
if (false) {
    /** @type {?} */
    ConfigurationComponent.prototype.showConfigurationView;
    /** @type {?} */
    ConfigurationComponent.prototype.title;
    /** @type {?} */
    ConfigurationComponent.prototype.action;
    /** @type {?} */
    ConfigurationComponent.prototype.printTable;
    /** @type {?} */
    ConfigurationComponent.prototype.headers;
    /** @type {?} */
    ConfigurationComponent.prototype.configAddon;
    /** @type {?} */
    ConfigurationComponent.prototype.onchange;
    /** @type {?} */
    ConfigurationComponent.prototype.onprint;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9mbGV4aWJsZS10YWJsZS8iLCJzb3VyY2VzIjpbInNyYy9hcHAvZmxleGlibGUtdGFibGUvY29tcG9uZW50cy9jb25maWd1cmF0aW9uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBSUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQU92RSxNQUFNOzt3QkFtQmMsSUFBSSxZQUFZLEVBQUU7dUJBR25CLElBQUksWUFBWSxFQUFFOzs7Ozs7O0lBRXBDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsTUFBTTtRQUNqQixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDcEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ2pDOzs7Ozs7SUFFRCxZQUFZLENBQUMsSUFBSSxFQUFFLE1BQU07UUFDbEIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1NBQ25CO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDUCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUM7U0FDckI7UUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDakM7Ozs7O0lBRUQsS0FBSyxDQUFDLEtBQUs7UUFDVixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4Qjs7Ozs7SUFFRSxLQUFLLENBQUMsS0FBSzs7UUFDUCxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3pCLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDckI7S0FDRTs7O1lBcERKLFNBQVMsU0FBQztnQkFDVixRQUFRLEVBQUUscUJBQXFCO2dCQUMvQixnK0RBQTZDOzthQUU3Qzs7O29CQUlDLEtBQUssU0FBQyxPQUFPO3FCQUdiLEtBQUssU0FBQyxRQUFRO3lCQUdkLEtBQUssU0FBQyxZQUFZO3NCQUdsQixLQUFLLFNBQUMsU0FBUzswQkFHZixLQUFLLFNBQUMsYUFBYTt1QkFHbkIsTUFBTSxTQUFDLFVBQVU7c0JBR2pCLE1BQU0sU0FBQyxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuKiBQcm92aWRlcyBhYmlsaXR5IHRvIGNvbmZpZ3VyZSBkaXNwbGF5aW5nIG9mIHRhYmxlIGNvbHVtbnMuIEFzIHBlciBkZWZpbml0aW9uIG9mIGVhcmNoIGhlYWRlciBjb21wb25lbnQsXHJcbiogYSBjb2x1bW4gY291bGQgYmUgaGlkZGVuLlxyXG4qL1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcblx0c2VsZWN0b3I6ICd0YWJsZS1jb25maWd1cmF0aW9uJyxcclxuXHR0ZW1wbGF0ZVVybDogJy4vY29uZmlndXJhdGlvbi5jb21wb25lbnQuaHRtbCcsXHJcblx0c3R5bGVVcmxzOiBbJy4vY29uZmlndXJhdGlvbi5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDb25maWd1cmF0aW9uQ29tcG9uZW50IHtcclxuICAgIHNob3dDb25maWd1cmF0aW9uVmlldzogYm9vbGVhbjtcclxuXHJcblx0QElucHV0KFwidGl0bGVcIilcclxuXHRwdWJsaWMgdGl0bGU6IHN0cmluZztcclxuXHJcblx0QElucHV0KFwiYWN0aW9uXCIpXHJcblx0cHVibGljIGFjdGlvbjogc3RyaW5nO1xyXG5cclxuXHRASW5wdXQoXCJwcmludFRhYmxlXCIpXHJcblx0cHVibGljIHByaW50VGFibGU6IHN0cmluZztcclxuXHRcclxuXHRASW5wdXQoXCJoZWFkZXJzXCIpXHJcblx0cHVibGljIGhlYWRlcnM6IGFueVtdO1xyXG5cclxuXHRASW5wdXQoXCJjb25maWdBZGRvblwiKVxyXG5cdHB1YmxpYyBjb25maWdBZGRvbjogYW55O1xyXG5cclxuXHRAT3V0cHV0KCdvbmNoYW5nZScpXHJcblx0cHJpdmF0ZSBvbmNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0QE91dHB1dCgnb25wcmludCcpXHJcblx0cHJpdmF0ZSBvbnByaW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHRyZWNvbmZpZ3VyZShpdGVtLCBoZWFkZXIpIHtcclxuICAgICAgICBoZWFkZXIucHJlc2VudCA9IGl0ZW0uY2hlY2tlZDtcclxuXHRcdHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzLmhlYWRlcnMpO1xyXG5cdH1cclxuXHJcblx0ZW5hYmxlRmlsdGVyKGl0ZW0sIGhlYWRlcikge1xyXG4gICAgICAgIGlmIChoZWFkZXIuZmlsdGVyID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0aGVhZGVyLmZpbHRlciA9IFwiXCI7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRkZWxldGUgaGVhZGVyLmZpbHRlcjtcclxuXHRcdH1cclxuXHRcdHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzLmhlYWRlcnMpO1xyXG5cdH1cclxuXHJcblx0cHJpbnQoZXZlbnQpIHtcclxuXHRcdHRoaXMub25wcmludC5lbWl0KHRydWUpO1xyXG5cdH1cclxuXHJcbiAgICBrZXl1cChldmVudCkge1xyXG4gICAgICAgIGNvbnN0IGNvZGUgPSBldmVudC53aGljaDtcclxuICAgICAgICBpZiAoY29kZSA9PT0gMTMpIHtcclxuXHRcdFx0ZXZlbnQudGFyZ2V0LmNsaWNrKCk7XHJcblx0XHR9XHJcbiAgICB9XHJcbn1cclxuIl19