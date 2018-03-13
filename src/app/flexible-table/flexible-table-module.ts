/*
* Provides rendering of flexible table in a lazy load fashion.
*/
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IntoPipeModule} from 'into-pipes';
import { DragDropModule } from 'drag-enabled';

import { PaginationComponent } from './components/pagination.component';
import { ConfigurationComponent } from './components/configuration.component';

import { FlexibleTableComponent } from './flexible.table.component';

@NgModule({
    imports: [
        CommonModule,
        DragDropModule,
        IntoPipeModule
    ],
    declarations: [
        FlexibleTableComponent,
        ConfigurationComponent,
        PaginationComponent
    ],
    exports: [
        FlexibleTableComponent
    ],
    entryComponents: [
    ],
    providers: [
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class FlexibleTableModule {}
