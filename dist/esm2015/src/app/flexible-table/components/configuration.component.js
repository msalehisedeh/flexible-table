import * as tslib_1 from "tslib";
/*
* Provides ability to configure displaying of table columns. As per definition of earch header component,
* a column could be hidden.
*/
import { Component, Input, Output, EventEmitter } from '@angular/core';
let ConfigurationComponent = class ConfigurationComponent {
    constructor() {
        this.onchange = new EventEmitter();
        this.onprint = new EventEmitter();
    }
    reconfigure(item, header) {
        header.present = item.checked;
        this.onchange.emit(this.headers);
    }
    enableFilter(item, header) {
        if (header.filter === undefined) {
            header.filter = "";
        }
        else {
            delete header.filter;
        }
        this.onchange.emit(this.headers);
    }
    print(event) {
        this.onprint.emit(true);
    }
    keyup(event) {
        const code = event.which;
        if (code === 13) {
            event.target.click();
        }
    }
};
tslib_1.__decorate([
    Input("title")
], ConfigurationComponent.prototype, "title", void 0);
tslib_1.__decorate([
    Input("action")
], ConfigurationComponent.prototype, "action", void 0);
tslib_1.__decorate([
    Input("printTable")
], ConfigurationComponent.prototype, "printTable", void 0);
tslib_1.__decorate([
    Input("headers")
], ConfigurationComponent.prototype, "headers", void 0);
tslib_1.__decorate([
    Input("configAddon")
], ConfigurationComponent.prototype, "configAddon", void 0);
tslib_1.__decorate([
    Output('onchange')
], ConfigurationComponent.prototype, "onchange", void 0);
tslib_1.__decorate([
    Output('onprint')
], ConfigurationComponent.prototype, "onprint", void 0);
ConfigurationComponent = tslib_1.__decorate([
    Component({
        selector: 'table-configuration',
        template: "\r\n<div class=\"shim\"\r\n    [style.display]=\"showConfigurationView ? 'block':'none'\"\r\n    (click)=\"showConfigurationView = !showConfigurationView\"></div>\r\n\r\n<a  [attr.tabindex]=\"0\" *ngIf=\"printTable\"\r\n    class=\"print-table\"\r\n    (keyup)=\"keyup($event)\"\r\n    (click)=\"print($event)\">\r\n    <span class=\"icon fa fa-print\" aria-hidden=\"true\"></span>\r\n    <span class=\"off-screen\" [textContent]=\"print\"></span>\r\n</a>\r\n<a  [attr.tabindex]=\"0\"\r\n    class=\"configure-table\"\r\n    (keyup)=\"keyup($event)\"\r\n    (click)=\"showConfigurationView = !showConfigurationView\">\r\n    <span class=\"icon fa fa-gear\" aria-hidden=\"true\"></span>\r\n    <span class=\"off-screen\" [textContent]=\"action\"></span>\r\n</a>\r\n<ng-container *ngIf=\"configAddon\" [ngTemplateOutlet]=\"configAddon\"></ng-container>\r\n\r\n<ul role=\"list\" [style.display]=\"showConfigurationView ? 'block':'none'\">\r\n    <p [textContent]=\"title\"></p>\r\n    <li  *ngFor=\"let header of headers\" role=\"listitem\">\r\n        <label for=\"{{header.key ? header.key+'f':'f'}}\">\r\n            <input type=\"checkbox\" #filter\r\n                    [id]=\"header.key ? header.key+'f':'f'\"\r\n                    [checked]=\"header.filter !== undefined\"\r\n                    (keyup)=\"keyup($event)\"\r\n                    (click)=\"enableFilter(filter, header)\" />\r\n            <span>Filter</span>\r\n        </label>\r\n        <label for=\"{{header.key ? header.key+'c':'c'}}\">\r\n            <input type=\"checkbox\" #checkbox\r\n                    [id]=\"header.key ? header.key+'c':'c'\"\r\n                    [value]=\"header.key\"\r\n                    [checked]=\"header.present\"\r\n                    (keyup)=\"keyup($event)\"\r\n                    (click)=\"reconfigure(checkbox, header)\" />\r\n            <span>Show</span>\r\n        </label>\r\n        <span class=\"title\" [textContent]=\"header.value | uppercase\"></span>\r\n    </li>\r\n</ul>\r\n",
        styles: [":host{box-sizing:border-box;padding:2px;position:absolute;right:8px;top:18px;z-index:2}:host a{display:block;float:left;padding:0 0 0 10px;cursor:pointer;z-index:5}:host a .icon{color:#00925b}:host a .off-screen{display:block;text-indent:-9999px;width:0;height:0;overflow:hidden}:host .shim{background-color:rgba(255,255,255,.2);width:100vw;height:100vh;position:fixed;top:0;left:0;z-index:2}:host ul{background-color:#fff;border:1px solid #999;border-radius:4px;display:flex;list-style:none;max-height:200px;margin:0 2px;min-width:200px;overflow-y:auto;position:absolute;padding:0 0 8px;right:0;box-shadow:6px 8px 6px -6px #1b1b1b;z-index:6}:host ul p{margin:0;padding:1px 5px;background-color:#5f9ea0;color:#fff}:host ul li{white-space:nowrap;text-align:left;flex-direction:row;padding:1px 5px}:host ul li label input{flex:0 0 30%;margin-top:4px}:host ul li .title{flex:0 0 30%;font-weight:700}@media print{:host{display:none}}"]
    })
], ConfigurationComponent);
export { ConfigurationComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvZmxleGlibGUtdGFibGUvIiwic291cmNlcyI6WyJzcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2NvbXBvbmVudHMvY29uZmlndXJhdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7RUFHRTtBQUNGLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPdkUsSUFBYSxzQkFBc0IsR0FBbkMsTUFBYSxzQkFBc0I7SUFMbkM7UUF3QlMsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFHOUIsWUFBTyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUEwQnRDLENBQUM7SUF4QkEsV0FBVyxDQUFDLElBQUksRUFBRSxNQUFNO1FBQ2pCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNwQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUFJLEVBQUUsTUFBTTtRQUNsQixJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQ3RDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1NBQ25CO2FBQU07WUFDTixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUM7U0FDckI7UUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLO1FBQ1YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVFLEtBQUssQ0FBQyxLQUFLO1FBQ1AsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN6QixJQUFJLElBQUksS0FBSyxFQUFFLEVBQUU7WUFDdEIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNyQjtJQUNDLENBQUM7Q0FDSixDQUFBO0FBNUNBO0lBREMsS0FBSyxDQUFDLE9BQU8sQ0FBQztxREFDTTtBQUdyQjtJQURDLEtBQUssQ0FBQyxRQUFRLENBQUM7c0RBQ007QUFHdEI7SUFEQyxLQUFLLENBQUMsWUFBWSxDQUFDOzBEQUNNO0FBRzFCO0lBREMsS0FBSyxDQUFDLFNBQVMsQ0FBQzt1REFDSztBQUd0QjtJQURDLEtBQUssQ0FBQyxhQUFhLENBQUM7MkRBQ0c7QUFHeEI7SUFEQyxNQUFNLENBQUMsVUFBVSxDQUFDO3dEQUNtQjtBQUd0QztJQURDLE1BQU0sQ0FBQyxTQUFTLENBQUM7dURBQ21CO0FBdEJ6QixzQkFBc0I7SUFMbEMsU0FBUyxDQUFDO1FBQ1YsUUFBUSxFQUFFLHFCQUFxQjtRQUMvQixnK0RBQTZDOztLQUU3QyxDQUFDO0dBQ1csc0JBQXNCLENBZ0RsQztTQWhEWSxzQkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4qIFByb3ZpZGVzIGFiaWxpdHkgdG8gY29uZmlndXJlIGRpc3BsYXlpbmcgb2YgdGFibGUgY29sdW1ucy4gQXMgcGVyIGRlZmluaXRpb24gb2YgZWFyY2ggaGVhZGVyIGNvbXBvbmVudCxcclxuKiBhIGNvbHVtbiBjb3VsZCBiZSBoaWRkZW4uXHJcbiovXHJcbmltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuXHRzZWxlY3RvcjogJ3RhYmxlLWNvbmZpZ3VyYXRpb24nLFxyXG5cdHRlbXBsYXRlVXJsOiAnLi9jb25maWd1cmF0aW9uLmNvbXBvbmVudC5odG1sJyxcclxuXHRzdHlsZVVybHM6IFsnLi9jb25maWd1cmF0aW9uLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIENvbmZpZ3VyYXRpb25Db21wb25lbnQge1xyXG4gICAgc2hvd0NvbmZpZ3VyYXRpb25WaWV3OiBib29sZWFuO1xyXG5cclxuXHRASW5wdXQoXCJ0aXRsZVwiKVxyXG5cdHB1YmxpYyB0aXRsZTogc3RyaW5nO1xyXG5cclxuXHRASW5wdXQoXCJhY3Rpb25cIilcclxuXHRwdWJsaWMgYWN0aW9uOiBzdHJpbmc7XHJcblxyXG5cdEBJbnB1dChcInByaW50VGFibGVcIilcclxuXHRwdWJsaWMgcHJpbnRUYWJsZTogc3RyaW5nO1xyXG5cdFxyXG5cdEBJbnB1dChcImhlYWRlcnNcIilcclxuXHRwdWJsaWMgaGVhZGVyczogYW55W107XHJcblxyXG5cdEBJbnB1dChcImNvbmZpZ0FkZG9uXCIpXHJcblx0cHVibGljIGNvbmZpZ0FkZG9uOiBhbnk7XHJcblxyXG5cdEBPdXRwdXQoJ29uY2hhbmdlJylcclxuXHRwcml2YXRlIG9uY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuXHRAT3V0cHV0KCdvbnByaW50JylcclxuXHRwcml2YXRlIG9ucHJpbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdHJlY29uZmlndXJlKGl0ZW0sIGhlYWRlcikge1xyXG4gICAgICAgIGhlYWRlci5wcmVzZW50ID0gaXRlbS5jaGVja2VkO1xyXG5cdFx0dGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaGVhZGVycyk7XHJcblx0fVxyXG5cclxuXHRlbmFibGVGaWx0ZXIoaXRlbSwgaGVhZGVyKSB7XHJcbiAgICAgICAgaWYgKGhlYWRlci5maWx0ZXIgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRoZWFkZXIuZmlsdGVyID0gXCJcIjtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRlbGV0ZSBoZWFkZXIuZmlsdGVyO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaGVhZGVycyk7XHJcblx0fVxyXG5cclxuXHRwcmludChldmVudCkge1xyXG5cdFx0dGhpcy5vbnByaW50LmVtaXQodHJ1ZSk7XHJcblx0fVxyXG5cclxuICAgIGtleXVwKGV2ZW50KSB7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG4gICAgICAgIGlmIChjb2RlID09PSAxMykge1xyXG5cdFx0XHRldmVudC50YXJnZXQuY2xpY2soKTtcclxuXHRcdH1cclxuICAgIH1cclxufVxyXG4iXX0=