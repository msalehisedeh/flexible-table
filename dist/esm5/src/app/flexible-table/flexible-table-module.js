/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntoPipeModule } from 'into-pipes';
import { DragDropModule } from 'drag-enabled';
import { PaginationComponent } from './components/pagination.component';
import { ConfigurationComponent } from './components/configuration.component';
import { TableViewComponent } from './components/table.component';
import { TableHeadersGenerator } from './components/table-headers-generator';
import { FlexibleTableComponent } from './flexible.table.component';
import { LockTableComponent } from './lock.table.component';
import { TableSortDirective } from './directives/table-sort.directive';
var FlexibleTableModule = /** @class */ (function () {
    function FlexibleTableModule() {
    }
    FlexibleTableModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        DragDropModule,
                        IntoPipeModule
                    ],
                    declarations: [
                        FlexibleTableComponent,
                        LockTableComponent,
                        ConfigurationComponent,
                        PaginationComponent,
                        TableViewComponent,
                        TableSortDirective
                    ],
                    exports: [
                        FlexibleTableComponent,
                        LockTableComponent
                    ],
                    entryComponents: [],
                    providers: [
                        TableHeadersGenerator
                    ],
                    schemas: [CUSTOM_ELEMENTS_SCHEMA]
                },] }
    ];
    return FlexibleTableModule;
}());
export { FlexibleTableModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxleGlibGUtdGFibGUtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vZmxleGlibGUtdGFibGUvIiwic291cmNlcyI6WyJzcmMvYXBwL2ZsZXhpYmxlLXRhYmxlL2ZsZXhpYmxlLXRhYmxlLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBR0EsT0FBTyxFQUFFLFFBQVEsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUMxQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRTlDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzlFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBRWxFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzdFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzVELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDOzs7OztnQkFFdEUsUUFBUSxTQUFDO29CQUNOLE9BQU8sRUFBRTt3QkFDTCxZQUFZO3dCQUNaLGNBQWM7d0JBQ2QsY0FBYztxQkFDakI7b0JBQ0QsWUFBWSxFQUFFO3dCQUNWLHNCQUFzQjt3QkFDdEIsa0JBQWtCO3dCQUNsQixzQkFBc0I7d0JBQ3RCLG1CQUFtQjt3QkFDbkIsa0JBQWtCO3dCQUNsQixrQkFBa0I7cUJBQ3JCO29CQUNELE9BQU8sRUFBRTt3QkFDTCxzQkFBc0I7d0JBQ3RCLGtCQUFrQjtxQkFDckI7b0JBQ0QsZUFBZSxFQUFFLEVBQ2hCO29CQUNELFNBQVMsRUFBRTt3QkFDUCxxQkFBcUI7cUJBQ3hCO29CQUNELE9BQU8sRUFBRSxDQUFDLHNCQUFzQixDQUFDO2lCQUNwQzs7OEJBekNEOztTQTJDYSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4qIFByb3ZpZGVzIHJlbmRlcmluZyBvZiBmbGV4aWJsZSB0YWJsZSBpbiBhIGxhenkgbG9hZCBmYXNoaW9uLlxyXG4qL1xyXG5pbXBvcnQgeyBOZ01vZHVsZSwgQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQge0ludG9QaXBlTW9kdWxlfSBmcm9tICdpbnRvLXBpcGVzJztcclxuaW1wb3J0IHsgRHJhZ0Ryb3BNb2R1bGUgfSBmcm9tICdkcmFnLWVuYWJsZWQnO1xyXG5cclxuaW1wb3J0IHsgUGFnaW5hdGlvbkNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9wYWdpbmF0aW9uLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Db21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY29uZmlndXJhdGlvbi5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBUYWJsZVZpZXdDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50JztcclxuXHJcbmltcG9ydCB7IFRhYmxlSGVhZGVyc0dlbmVyYXRvciB9IGZyb20gJy4vY29tcG9uZW50cy90YWJsZS1oZWFkZXJzLWdlbmVyYXRvcic7XHJcbmltcG9ydCB7IEZsZXhpYmxlVGFibGVDb21wb25lbnQgfSBmcm9tICcuL2ZsZXhpYmxlLnRhYmxlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IExvY2tUYWJsZUNvbXBvbmVudCB9IGZyb20gJy4vbG9jay50YWJsZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBUYWJsZVNvcnREaXJlY3RpdmUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvdGFibGUtc29ydC5kaXJlY3RpdmUnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICAgIGltcG9ydHM6IFtcclxuICAgICAgICBDb21tb25Nb2R1bGUsXHJcbiAgICAgICAgRHJhZ0Ryb3BNb2R1bGUsXHJcbiAgICAgICAgSW50b1BpcGVNb2R1bGVcclxuICAgIF0sXHJcbiAgICBkZWNsYXJhdGlvbnM6IFtcclxuICAgICAgICBGbGV4aWJsZVRhYmxlQ29tcG9uZW50LFxyXG4gICAgICAgIExvY2tUYWJsZUNvbXBvbmVudCxcclxuICAgICAgICBDb25maWd1cmF0aW9uQ29tcG9uZW50LFxyXG4gICAgICAgIFBhZ2luYXRpb25Db21wb25lbnQsXHJcbiAgICAgICAgVGFibGVWaWV3Q29tcG9uZW50LFxyXG4gICAgICAgIFRhYmxlU29ydERpcmVjdGl2ZVxyXG4gICAgXSxcclxuICAgIGV4cG9ydHM6IFtcclxuICAgICAgICBGbGV4aWJsZVRhYmxlQ29tcG9uZW50LFxyXG4gICAgICAgIExvY2tUYWJsZUNvbXBvbmVudFxyXG4gICAgXSxcclxuICAgIGVudHJ5Q29tcG9uZW50czogW1xyXG4gICAgXSxcclxuICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIFRhYmxlSGVhZGVyc0dlbmVyYXRvclxyXG4gICAgXSxcclxuICAgIHNjaGVtYXM6IFtDVVNUT01fRUxFTUVOVFNfU0NIRU1BXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIEZsZXhpYmxlVGFibGVNb2R1bGUge31cclxuIl19