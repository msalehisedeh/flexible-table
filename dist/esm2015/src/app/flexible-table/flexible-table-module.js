import * as tslib_1 from "tslib";
/*
* Provides rendering of flexible table in a lazy load fashion.
*/
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntoPipeModule } from '@sedeh/into-pipes';
import { DragDropModule } from '../drag-enabled/dragdrop.module';
import { PaginationComponent } from './components/pagination.component';
import { ConfigurationComponent } from './components/configuration.component';
import { TableViewComponent } from './components/table.component';
import { TableHeadersGenerator } from './components/table-headers-generator';
import { FlexibleTableComponent } from './flexible.table.component';
import { LockTableComponent } from './lock.table.component';
let FlexibleTableModule = class FlexibleTableModule {
};
FlexibleTableModule = tslib_1.__decorate([
    NgModule({
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
            TableViewComponent
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
    })
], FlexibleTableModule);
export { FlexibleTableModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxleGlibGUtdGFibGUtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHNlZGVoL2ZsZXhpYmxlLXRhYmxlLyIsInNvdXJjZXMiOlsic3JjL2FwcC9mbGV4aWJsZS10YWJsZS9mbGV4aWJsZS10YWJsZS1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztFQUVFO0FBQ0YsT0FBTyxFQUFFLFFBQVEsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUVqRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUN4RSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUM5RSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUVsRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUM3RSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUNwRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQTJCNUQsSUFBYSxtQkFBbUIsR0FBaEMsTUFBYSxtQkFBbUI7Q0FBRyxDQUFBO0FBQXRCLG1CQUFtQjtJQXpCL0IsUUFBUSxDQUFDO1FBQ04sT0FBTyxFQUFFO1lBQ0wsWUFBWTtZQUNaLGNBQWM7WUFDZCxjQUFjO1NBQ2pCO1FBQ0QsWUFBWSxFQUFFO1lBQ1Ysc0JBQXNCO1lBQ3RCLGtCQUFrQjtZQUNsQixzQkFBc0I7WUFDdEIsbUJBQW1CO1lBQ25CLGtCQUFrQjtTQUNyQjtRQUNELE9BQU8sRUFBRTtZQUNMLHNCQUFzQjtZQUN0QixrQkFBa0I7U0FDckI7UUFDRCxlQUFlLEVBQUUsRUFDaEI7UUFDRCxTQUFTLEVBQUU7WUFDUCxxQkFBcUI7U0FDeEI7UUFDRCxPQUFPLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztLQUNwQyxDQUFDO0dBRVcsbUJBQW1CLENBQUc7U0FBdEIsbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuKiBQcm92aWRlcyByZW5kZXJpbmcgb2YgZmxleGlibGUgdGFibGUgaW4gYSBsYXp5IGxvYWQgZmFzaGlvbi5cclxuKi9cclxuaW1wb3J0IHsgTmdNb2R1bGUsIENVU1RPTV9FTEVNRU5UU19TQ0hFTUEgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHtJbnRvUGlwZU1vZHVsZX0gZnJvbSAnQHNlZGVoL2ludG8tcGlwZXMnO1xyXG5pbXBvcnQgeyBEcmFnRHJvcE1vZHVsZSB9IGZyb20gJy4uL2RyYWctZW5hYmxlZC9kcmFnZHJvcC5tb2R1bGUnO1xyXG5cclxuaW1wb3J0IHsgUGFnaW5hdGlvbkNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9wYWdpbmF0aW9uLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Db21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvY29uZmlndXJhdGlvbi5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBUYWJsZVZpZXdDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUuY29tcG9uZW50JztcclxuXHJcbmltcG9ydCB7IFRhYmxlSGVhZGVyc0dlbmVyYXRvciB9IGZyb20gJy4vY29tcG9uZW50cy90YWJsZS1oZWFkZXJzLWdlbmVyYXRvcic7XHJcbmltcG9ydCB7IEZsZXhpYmxlVGFibGVDb21wb25lbnQgfSBmcm9tICcuL2ZsZXhpYmxlLnRhYmxlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IExvY2tUYWJsZUNvbXBvbmVudCB9IGZyb20gJy4vbG9jay50YWJsZS5jb21wb25lbnQnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICAgIGltcG9ydHM6IFtcclxuICAgICAgICBDb21tb25Nb2R1bGUsXHJcbiAgICAgICAgRHJhZ0Ryb3BNb2R1bGUsXHJcbiAgICAgICAgSW50b1BpcGVNb2R1bGVcclxuICAgIF0sXHJcbiAgICBkZWNsYXJhdGlvbnM6IFtcclxuICAgICAgICBGbGV4aWJsZVRhYmxlQ29tcG9uZW50LFxyXG4gICAgICAgIExvY2tUYWJsZUNvbXBvbmVudCxcclxuICAgICAgICBDb25maWd1cmF0aW9uQ29tcG9uZW50LFxyXG4gICAgICAgIFBhZ2luYXRpb25Db21wb25lbnQsXHJcbiAgICAgICAgVGFibGVWaWV3Q29tcG9uZW50XHJcbiAgICBdLFxyXG4gICAgZXhwb3J0czogW1xyXG4gICAgICAgIEZsZXhpYmxlVGFibGVDb21wb25lbnQsXHJcbiAgICAgICAgTG9ja1RhYmxlQ29tcG9uZW50XHJcbiAgICBdLFxyXG4gICAgZW50cnlDb21wb25lbnRzOiBbXHJcbiAgICBdLFxyXG4gICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgVGFibGVIZWFkZXJzR2VuZXJhdG9yXHJcbiAgICBdLFxyXG4gICAgc2NoZW1hczogW0NVU1RPTV9FTEVNRU5UU19TQ0hFTUFdXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgRmxleGlibGVUYWJsZU1vZHVsZSB7fVxyXG4iXX0=