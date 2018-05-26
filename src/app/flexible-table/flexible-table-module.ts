/*
* Provides rendering of flexible table in a lazy load fashion.
*/
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IntoPipeModule} from 'into-pipes';
import { DragDropModule } from 'drag-enabled';

import { PaginationComponent } from './components/pagination.component';
import { ConfigurationComponent } from './components/configuration.component';
import { TableViewComponent } from './components/table.component';

import { TableHeadersGenerator } from './components/table-headers-generator';
import { FlexibleTableComponent } from './flexible.table.component';
import { LockTableComponent } from './lock.table.component';

@NgModule({
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
    entryComponents: [
    ],
    providers: [
        TableHeadersGenerator
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class FlexibleTableModule {}
