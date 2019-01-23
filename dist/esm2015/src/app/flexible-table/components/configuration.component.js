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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvZmxleGlibGUtdGFibGUvIiwic291cmNlcyI6WyJzcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2NvbXBvbmVudHMvY29uZmlndXJhdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUlBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPdkUsTUFBTTs7d0JBbUJjLElBQUksWUFBWSxFQUFFO3VCQUduQixJQUFJLFlBQVksRUFBRTs7Ozs7OztJQUVwQyxXQUFXLENBQUMsSUFBSSxFQUFFLE1BQU07UUFDakIsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNqQzs7Ozs7O0lBRUQsWUFBWSxDQUFDLElBQUksRUFBRSxNQUFNO1FBQ2xCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN2QyxNQUFNLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztTQUNuQjtRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1AsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDO1NBQ3JCO1FBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ2pDOzs7OztJQUVELEtBQUssQ0FBQyxLQUFLO1FBQ1YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDeEI7Ozs7O0lBRUUsS0FBSyxDQUFDLEtBQUs7O1FBQ1AsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN6QixFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2QixLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3JCO0tBQ0U7OztZQXBESixTQUFTLFNBQUM7Z0JBQ1YsUUFBUSxFQUFFLHFCQUFxQjtnQkFDL0IsZytEQUE2Qzs7YUFFN0M7OztvQkFJQyxLQUFLLFNBQUMsT0FBTztxQkFHYixLQUFLLFNBQUMsUUFBUTt5QkFHZCxLQUFLLFNBQUMsWUFBWTtzQkFHbEIsS0FBSyxTQUFDLFNBQVM7MEJBR2YsS0FBSyxTQUFDLGFBQWE7dUJBR25CLE1BQU0sU0FBQyxVQUFVO3NCQUdqQixNQUFNLFNBQUMsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiogUHJvdmlkZXMgYWJpbGl0eSB0byBjb25maWd1cmUgZGlzcGxheWluZyBvZiB0YWJsZSBjb2x1bW5zLiBBcyBwZXIgZGVmaW5pdGlvbiBvZiBlYXJjaCBoZWFkZXIgY29tcG9uZW50LFxyXG4qIGEgY29sdW1uIGNvdWxkIGJlIGhpZGRlbi5cclxuKi9cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG5cdHNlbGVjdG9yOiAndGFibGUtY29uZmlndXJhdGlvbicsXHJcblx0dGVtcGxhdGVVcmw6ICcuL2NvbmZpZ3VyYXRpb24uY29tcG9uZW50Lmh0bWwnLFxyXG5cdHN0eWxlVXJsczogWycuL2NvbmZpZ3VyYXRpb24uY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ29uZmlndXJhdGlvbkNvbXBvbmVudCB7XHJcbiAgICBzaG93Q29uZmlndXJhdGlvblZpZXc6IGJvb2xlYW47XHJcblxyXG5cdEBJbnB1dChcInRpdGxlXCIpXHJcblx0cHVibGljIHRpdGxlOiBzdHJpbmc7XHJcblxyXG5cdEBJbnB1dChcImFjdGlvblwiKVxyXG5cdHB1YmxpYyBhY3Rpb246IHN0cmluZztcclxuXHJcblx0QElucHV0KFwicHJpbnRUYWJsZVwiKVxyXG5cdHB1YmxpYyBwcmludFRhYmxlOiBzdHJpbmc7XHJcblx0XHJcblx0QElucHV0KFwiaGVhZGVyc1wiKVxyXG5cdHB1YmxpYyBoZWFkZXJzOiBhbnlbXTtcclxuXHJcblx0QElucHV0KFwiY29uZmlnQWRkb25cIilcclxuXHRwdWJsaWMgY29uZmlnQWRkb246IGFueTtcclxuXHJcblx0QE91dHB1dCgnb25jaGFuZ2UnKVxyXG5cdHByaXZhdGUgb25jaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBPdXRwdXQoJ29ucHJpbnQnKVxyXG5cdHByaXZhdGUgb25wcmludCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0cmVjb25maWd1cmUoaXRlbSwgaGVhZGVyKSB7XHJcbiAgICAgICAgaGVhZGVyLnByZXNlbnQgPSBpdGVtLmNoZWNrZWQ7XHJcblx0XHR0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5oZWFkZXJzKTtcclxuXHR9XHJcblxyXG5cdGVuYWJsZUZpbHRlcihpdGVtLCBoZWFkZXIpIHtcclxuICAgICAgICBpZiAoaGVhZGVyLmZpbHRlciA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGhlYWRlci5maWx0ZXIgPSBcIlwiO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZGVsZXRlIGhlYWRlci5maWx0ZXI7XHJcblx0XHR9XHJcblx0XHR0aGlzLm9uY2hhbmdlLmVtaXQodGhpcy5oZWFkZXJzKTtcclxuXHR9XHJcblxyXG5cdHByaW50KGV2ZW50KSB7XHJcblx0XHR0aGlzLm9ucHJpbnQuZW1pdCh0cnVlKTtcclxuXHR9XHJcblxyXG4gICAga2V5dXAoZXZlbnQpIHtcclxuICAgICAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcbiAgICAgICAgaWYgKGNvZGUgPT09IDEzKSB7XHJcblx0XHRcdGV2ZW50LnRhcmdldC5jbGljaygpO1xyXG5cdFx0fVxyXG4gICAgfVxyXG59XHJcbiJdfQ==