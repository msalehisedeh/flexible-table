import * as tslib_1 from "tslib";
/*
* Provides ability to configure displaying of table columns. As per definition of earch header component,
* a column could be hidden.
*/
import { Component, Input, Output, EventEmitter } from '@angular/core';
var ConfigurationComponent = /** @class */ (function () {
    function ConfigurationComponent() {
        this.onchange = new EventEmitter();
        this.onprint = new EventEmitter();
    }
    ConfigurationComponent.prototype.reconfigure = function (item, header) {
        header.present = item.checked;
        this.onchange.emit(this.headers);
    };
    ConfigurationComponent.prototype.enableFilter = function (item, header) {
        if (header.filter === undefined) {
            header.filter = "";
        }
        else {
            delete header.filter;
        }
        this.onchange.emit(this.headers);
    };
    ConfigurationComponent.prototype.print = function (event) {
        this.onprint.emit(true);
    };
    ConfigurationComponent.prototype.keyup = function (event) {
        var code = event.which;
        if (code === 13) {
            event.target.click();
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
    return ConfigurationComponent;
}());
export { ConfigurationComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvZmxleGlibGUtdGFibGUvIiwic291cmNlcyI6WyJzcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2NvbXBvbmVudHMvY29uZmlndXJhdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7RUFHRTtBQUNGLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPdkU7SUFMQTtRQWNtQixhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM5QixZQUFPLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQTBCaEQsQ0FBQztJQXhCQSw0Q0FBVyxHQUFYLFVBQVksSUFBSSxFQUFFLE1BQU07UUFDakIsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsNkNBQVksR0FBWixVQUFhLElBQUksRUFBRSxNQUFNO1FBQ2xCLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDdEMsTUFBTSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7U0FDbkI7YUFBTTtZQUNOLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQztTQUNyQjtRQUNELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsc0NBQUssR0FBTCxVQUFNLEtBQUs7UUFDVixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUUsc0NBQUssR0FBTCxVQUFNLEtBQUs7UUFDUCxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3pCLElBQUksSUFBSSxLQUFLLEVBQUUsRUFBRTtZQUN0QixLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3JCO0lBQ0MsQ0FBQztJQWhDSztRQUFSLEtBQUssRUFBRTt5REFBZTtJQUNkO1FBQVIsS0FBSyxFQUFFOzBEQUFnQjtJQUNmO1FBQVIsS0FBSyxFQUFFOzhEQUFvQjtJQUNuQjtRQUFSLEtBQUssRUFBRTsyREFBZ0I7SUFDZjtRQUFSLEtBQUssRUFBRTsrREFBa0I7SUFFaEI7UUFBVCxNQUFNLEVBQUU7NERBQXVDO0lBQ3RDO1FBQVQsTUFBTSxFQUFFOzJEQUFzQztJQVZuQyxzQkFBc0I7UUFMbEMsU0FBUyxDQUFDO1lBQ1YsUUFBUSxFQUFFLHFCQUFxQjtZQUMvQixnK0RBQTZDOztTQUU3QyxDQUFDO09BQ1csc0JBQXNCLENBb0NsQztJQUFELDZCQUFDO0NBQUEsQUFwQ0QsSUFvQ0M7U0FwQ1ksc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuKiBQcm92aWRlcyBhYmlsaXR5IHRvIGNvbmZpZ3VyZSBkaXNwbGF5aW5nIG9mIHRhYmxlIGNvbHVtbnMuIEFzIHBlciBkZWZpbml0aW9uIG9mIGVhcmNoIGhlYWRlciBjb21wb25lbnQsXHJcbiogYSBjb2x1bW4gY291bGQgYmUgaGlkZGVuLlxyXG4qL1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcblx0c2VsZWN0b3I6ICd0YWJsZS1jb25maWd1cmF0aW9uJyxcclxuXHR0ZW1wbGF0ZVVybDogJy4vY29uZmlndXJhdGlvbi5jb21wb25lbnQuaHRtbCcsXHJcblx0c3R5bGVVcmxzOiBbJy4vY29uZmlndXJhdGlvbi5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDb25maWd1cmF0aW9uQ29tcG9uZW50IHtcclxuICAgIHNob3dDb25maWd1cmF0aW9uVmlldzogYm9vbGVhbjtcclxuXHJcblx0QElucHV0KCkgdGl0bGU6IHN0cmluZztcclxuXHRASW5wdXQoKSBhY3Rpb246IHN0cmluZztcclxuXHRASW5wdXQoKSBwcmludFRhYmxlOiBzdHJpbmc7XHJcblx0QElucHV0KCkgaGVhZGVyczogYW55W107XHJcblx0QElucHV0KCkgY29uZmlnQWRkb246IGFueTtcclxuXHJcblx0QE91dHB1dCgpIHByaXZhdGUgb25jaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblx0QE91dHB1dCgpIHByaXZhdGUgb25wcmludCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0cmVjb25maWd1cmUoaXRlbSwgaGVhZGVyKSB7XHJcbiAgICAgICAgaGVhZGVyLnByZXNlbnQgPSBpdGVtLmNoZWNrZWQ7XHJcblx0XHR0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5oZWFkZXJzKTtcclxuXHR9XHJcblxyXG5cdGVuYWJsZUZpbHRlcihpdGVtLCBoZWFkZXIpIHtcclxuICAgICAgICBpZiAoaGVhZGVyLmZpbHRlciA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGhlYWRlci5maWx0ZXIgPSBcIlwiO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZGVsZXRlIGhlYWRlci5maWx0ZXI7XHJcblx0XHR9XHJcblx0XHR0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5oZWFkZXJzKTtcclxuXHR9XHJcblxyXG5cdHByaW50KGV2ZW50KSB7XHJcblx0XHR0aGlzLm9ucHJpbnQuZW1pdCh0cnVlKTtcclxuXHR9XHJcblxyXG4gICAga2V5dXAoZXZlbnQpIHtcclxuICAgICAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcbiAgICAgICAgaWYgKGNvZGUgPT09IDEzKSB7XHJcblx0XHRcdGV2ZW50LnRhcmdldC5jbGljaygpO1xyXG5cdFx0fVxyXG4gICAgfVxyXG59XHJcbiJdfQ==