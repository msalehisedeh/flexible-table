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
    Input()
], ConfigurationComponent.prototype, "title", void 0);
tslib_1.__decorate([
    Input()
], ConfigurationComponent.prototype, "action", void 0);
tslib_1.__decorate([
    Input()
], ConfigurationComponent.prototype, "printTable", void 0);
tslib_1.__decorate([
    Input()
], ConfigurationComponent.prototype, "headers", void 0);
tslib_1.__decorate([
    Input()
], ConfigurationComponent.prototype, "configAddon", void 0);
tslib_1.__decorate([
    Output()
], ConfigurationComponent.prototype, "onchange", void 0);
tslib_1.__decorate([
    Output()
], ConfigurationComponent.prototype, "onprint", void 0);
ConfigurationComponent = tslib_1.__decorate([
    Component({
        selector: 'table-configuration',
        template: "\r\n<div class=\"shim\"\r\n    [style.display]=\"showConfigurationView ? 'block':'none'\"\r\n    (click)=\"showConfigurationView = !showConfigurationView\"></div>\r\n\r\n<a  [attr.tabindex]=\"0\" *ngIf=\"printTable\"\r\n    class=\"print-table\"\r\n    (keyup)=\"keyup($event)\"\r\n    (click)=\"print($event)\">\r\n    <span class=\"icon fa fa-print\" aria-hidden=\"true\"></span>\r\n    <span class=\"off-screen\" [textContent]=\"print\"></span>\r\n</a>\r\n<a  [attr.tabindex]=\"0\"\r\n    class=\"configure-table\"\r\n    (keyup)=\"keyup($event)\"\r\n    (click)=\"showConfigurationView = !showConfigurationView\">\r\n    <span class=\"icon fa fa-gear\" aria-hidden=\"true\"></span>\r\n    <span class=\"off-screen\" [textContent]=\"action\"></span>\r\n</a>\r\n<ng-container *ngIf=\"configAddon\" [ngTemplateOutlet]=\"configAddon\"></ng-container>\r\n\r\n<ul role=\"list\" [style.display]=\"showConfigurationView ? 'block':'none'\">\r\n    <p [textContent]=\"title\"></p>\r\n    <li  *ngFor=\"let header of headers\" role=\"listitem\">\r\n        <label for=\"{{header.key ? header.key+'f':'f'}}\">\r\n            <input type=\"checkbox\" #filter\r\n                    [id]=\"header.key ? header.key+'f':'f'\"\r\n                    [checked]=\"header.filter !== undefined\"\r\n                    (keyup)=\"keyup($event)\"\r\n                    (click)=\"enableFilter(filter, header)\" />\r\n            <span>Filter</span>\r\n        </label>\r\n        <label for=\"{{header.key ? header.key+'c':'c'}}\">\r\n            <input type=\"checkbox\" #checkbox\r\n                    [id]=\"header.key ? header.key+'c':'c'\"\r\n                    [value]=\"header.key\"\r\n                    [checked]=\"header.present\"\r\n                    (keyup)=\"keyup($event)\"\r\n                    (click)=\"reconfigure(checkbox, header)\" />\r\n            <span>Show</span>\r\n        </label>\r\n        <span class=\"title\" [textContent]=\"header.value | uppercase\"></span>\r\n    </li>\r\n</ul>\r\n",
        styles: [":host{box-sizing:border-box;padding:2px;position:absolute;right:8px;top:18px;z-index:2}:host a{display:block;float:left;padding:0 0 0 10px;cursor:pointer;z-index:5}:host a .icon{color:#00925b}:host a .off-screen{display:block;text-indent:-9999px;width:0;height:0;overflow:hidden}:host .shim{background-color:rgba(255,255,255,.2);width:100vw;height:100vh;position:fixed;top:0;left:0;z-index:2}:host ul{background-color:#fff;border:1px solid #999;border-radius:4px;display:flex;list-style:none;max-height:200px;margin:0 2px;min-width:200px;overflow-y:auto;position:absolute;padding:0 0 8px;right:0;box-shadow:6px 8px 6px -6px #1b1b1b;z-index:6}:host ul p{margin:0;padding:1px 5px;background-color:#5f9ea0;color:#fff}:host ul li{white-space:nowrap;text-align:left;flex-direction:row;padding:1px 5px}:host ul li label input{flex:0 0 30%;margin-top:4px}:host ul li .title{flex:0 0 30%;font-weight:700}@media print{:host{display:none}}"]
    })
], ConfigurationComponent);
export { ConfigurationComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvZmxleGlibGUtdGFibGUvIiwic291cmNlcyI6WyJzcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2NvbXBvbmVudHMvY29uZmlndXJhdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7RUFHRTtBQUNGLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPdkUsSUFBYSxzQkFBc0IsR0FBbkMsTUFBYSxzQkFBc0I7SUFMbkM7UUFjbUIsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDOUIsWUFBTyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUEwQmhELENBQUM7SUF4QkEsV0FBVyxDQUFDLElBQUksRUFBRSxNQUFNO1FBQ2pCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNwQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUFJLEVBQUUsTUFBTTtRQUNsQixJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQ3RDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1NBQ25CO2FBQU07WUFDTixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUM7U0FDckI7UUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLO1FBQ1YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVFLEtBQUssQ0FBQyxLQUFLO1FBQ1AsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN6QixJQUFJLElBQUksS0FBSyxFQUFFLEVBQUU7WUFDdEIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNyQjtJQUNDLENBQUM7Q0FDSixDQUFBO0FBakNTO0lBQVIsS0FBSyxFQUFFO3FEQUFlO0FBQ2Q7SUFBUixLQUFLLEVBQUU7c0RBQWdCO0FBQ2Y7SUFBUixLQUFLLEVBQUU7MERBQW9CO0FBQ25CO0lBQVIsS0FBSyxFQUFFO3VEQUFnQjtBQUNmO0lBQVIsS0FBSyxFQUFFOzJEQUFrQjtBQUVoQjtJQUFULE1BQU0sRUFBRTt3REFBdUM7QUFDdEM7SUFBVCxNQUFNLEVBQUU7dURBQXNDO0FBVm5DLHNCQUFzQjtJQUxsQyxTQUFTLENBQUM7UUFDVixRQUFRLEVBQUUscUJBQXFCO1FBQy9CLGcrREFBNkM7O0tBRTdDLENBQUM7R0FDVyxzQkFBc0IsQ0FvQ2xDO1NBcENZLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiogUHJvdmlkZXMgYWJpbGl0eSB0byBjb25maWd1cmUgZGlzcGxheWluZyBvZiB0YWJsZSBjb2x1bW5zLiBBcyBwZXIgZGVmaW5pdGlvbiBvZiBlYXJjaCBoZWFkZXIgY29tcG9uZW50LFxyXG4qIGEgY29sdW1uIGNvdWxkIGJlIGhpZGRlbi5cclxuKi9cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG5cdHNlbGVjdG9yOiAndGFibGUtY29uZmlndXJhdGlvbicsXHJcblx0dGVtcGxhdGVVcmw6ICcuL2NvbmZpZ3VyYXRpb24uY29tcG9uZW50Lmh0bWwnLFxyXG5cdHN0eWxlVXJsczogWycuL2NvbmZpZ3VyYXRpb24uY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ29uZmlndXJhdGlvbkNvbXBvbmVudCB7XHJcbiAgICBzaG93Q29uZmlndXJhdGlvblZpZXc6IGJvb2xlYW47XHJcblxyXG5cdEBJbnB1dCgpIHRpdGxlOiBzdHJpbmc7XHJcblx0QElucHV0KCkgYWN0aW9uOiBzdHJpbmc7XHJcblx0QElucHV0KCkgcHJpbnRUYWJsZTogc3RyaW5nO1xyXG5cdEBJbnB1dCgpIGhlYWRlcnM6IGFueVtdO1xyXG5cdEBJbnB1dCgpIGNvbmZpZ0FkZG9uOiBhbnk7XHJcblxyXG5cdEBPdXRwdXQoKSBwcml2YXRlIG9uY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cdEBPdXRwdXQoKSBwcml2YXRlIG9ucHJpbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdHJlY29uZmlndXJlKGl0ZW0sIGhlYWRlcikge1xyXG4gICAgICAgIGhlYWRlci5wcmVzZW50ID0gaXRlbS5jaGVja2VkO1xyXG5cdFx0dGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaGVhZGVycyk7XHJcblx0fVxyXG5cclxuXHRlbmFibGVGaWx0ZXIoaXRlbSwgaGVhZGVyKSB7XHJcbiAgICAgICAgaWYgKGhlYWRlci5maWx0ZXIgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRoZWFkZXIuZmlsdGVyID0gXCJcIjtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRlbGV0ZSBoZWFkZXIuZmlsdGVyO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMuaGVhZGVycyk7XHJcblx0fVxyXG5cclxuXHRwcmludChldmVudCkge1xyXG5cdFx0dGhpcy5vbnByaW50LmVtaXQodHJ1ZSk7XHJcblx0fVxyXG5cclxuICAgIGtleXVwKGV2ZW50KSB7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG4gICAgICAgIGlmIChjb2RlID09PSAxMykge1xyXG5cdFx0XHRldmVudC50YXJnZXQuY2xpY2soKTtcclxuXHRcdH1cclxuICAgIH1cclxufVxyXG4iXX0=