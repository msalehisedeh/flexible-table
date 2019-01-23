/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
var ConfigurationComponent = /** @class */ (function () {
    function ConfigurationComponent() {
        this.onchange = new EventEmitter();
        this.onprint = new EventEmitter();
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
    return ConfigurationComponent;
}());
export { ConfigurationComponent };
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvZmxleGlibGUtdGFibGUvIiwic291cmNlcyI6WyJzcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2NvbXBvbmVudHMvY29uZmlndXJhdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUlBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozt3QkEwQm5ELElBQUksWUFBWSxFQUFFO3VCQUduQixJQUFJLFlBQVksRUFBRTs7Ozs7OztJQUVwQyw0Q0FBVzs7Ozs7SUFBWCxVQUFZLElBQUksRUFBRSxNQUFNO1FBQ2pCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNwQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDakM7Ozs7OztJQUVELDZDQUFZOzs7OztJQUFaLFVBQWEsSUFBSSxFQUFFLE1BQU07UUFDbEIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1NBQ25CO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDUCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUM7U0FDckI7UUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDakM7Ozs7O0lBRUQsc0NBQUs7Ozs7SUFBTCxVQUFNLEtBQUs7UUFDVixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4Qjs7Ozs7SUFFRSxzQ0FBSzs7OztJQUFMLFVBQU0sS0FBSzs7UUFDUCxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3pCLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDckI7S0FDRTs7Z0JBcERKLFNBQVMsU0FBQztvQkFDVixRQUFRLEVBQUUscUJBQXFCO29CQUMvQixnK0RBQTZDOztpQkFFN0M7Ozt3QkFJQyxLQUFLLFNBQUMsT0FBTzt5QkFHYixLQUFLLFNBQUMsUUFBUTs2QkFHZCxLQUFLLFNBQUMsWUFBWTswQkFHbEIsS0FBSyxTQUFDLFNBQVM7OEJBR2YsS0FBSyxTQUFDLGFBQWE7MkJBR25CLE1BQU0sU0FBQyxVQUFVOzBCQUdqQixNQUFNLFNBQUMsU0FBUzs7aUNBaENsQjs7U0FXYSxzQkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4qIFByb3ZpZGVzIGFiaWxpdHkgdG8gY29uZmlndXJlIGRpc3BsYXlpbmcgb2YgdGFibGUgY29sdW1ucy4gQXMgcGVyIGRlZmluaXRpb24gb2YgZWFyY2ggaGVhZGVyIGNvbXBvbmVudCxcclxuKiBhIGNvbHVtbiBjb3VsZCBiZSBoaWRkZW4uXHJcbiovXHJcbmltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuXHRzZWxlY3RvcjogJ3RhYmxlLWNvbmZpZ3VyYXRpb24nLFxyXG5cdHRlbXBsYXRlVXJsOiAnLi9jb25maWd1cmF0aW9uLmNvbXBvbmVudC5odG1sJyxcclxuXHRzdHlsZVVybHM6IFsnLi9jb25maWd1cmF0aW9uLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIENvbmZpZ3VyYXRpb25Db21wb25lbnQge1xyXG4gICAgc2hvd0NvbmZpZ3VyYXRpb25WaWV3OiBib29sZWFuO1xyXG5cclxuXHRASW5wdXQoXCJ0aXRsZVwiKVxyXG5cdHB1YmxpYyB0aXRsZTogc3RyaW5nO1xyXG5cclxuXHRASW5wdXQoXCJhY3Rpb25cIilcclxuXHRwdWJsaWMgYWN0aW9uOiBzdHJpbmc7XHJcblxyXG5cdEBJbnB1dChcInByaW50VGFibGVcIilcclxuXHRwdWJsaWMgcHJpbnRUYWJsZTogc3RyaW5nO1xyXG5cdFxyXG5cdEBJbnB1dChcImhlYWRlcnNcIilcclxuXHRwdWJsaWMgaGVhZGVyczogYW55W107XHJcblxyXG5cdEBJbnB1dChcImNvbmZpZ0FkZG9uXCIpXHJcblx0cHVibGljIGNvbmZpZ0FkZG9uOiBhbnk7XHJcblxyXG5cdEBPdXRwdXQoJ29uY2hhbmdlJylcclxuXHRwcml2YXRlIG9uY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHRAT3V0cHV0KCdvbnByaW50JylcclxuXHRwcml2YXRlIG9ucHJpbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdHJlY29uZmlndXJlKGl0ZW0sIGhlYWRlcikge1xyXG4gICAgICAgIGhlYWRlci5wcmVzZW50ID0gaXRlbS5jaGVja2VkO1xyXG5cdFx0dGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaGVhZGVycyk7XHJcblx0fVxyXG5cclxuXHRlbmFibGVGaWx0ZXIoaXRlbSwgaGVhZGVyKSB7XHJcbiAgICAgICAgaWYgKGhlYWRlci5maWx0ZXIgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRoZWFkZXIuZmlsdGVyID0gXCJcIjtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRlbGV0ZSBoZWFkZXIuZmlsdGVyO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaGVhZGVycyk7XHJcblx0fVxyXG5cclxuXHRwcmludChldmVudCkge1xyXG5cdFx0dGhpcy5vbnByaW50LmVtaXQodHJ1ZSk7XHJcblx0fVxyXG5cclxuICAgIGtleXVwKGV2ZW50KSB7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG4gICAgICAgIGlmIChjb2RlID09PSAxMykge1xyXG5cdFx0XHRldmVudC50YXJnZXQuY2xpY2soKTtcclxuXHRcdH1cclxuICAgIH1cclxufVxyXG4iXX0=