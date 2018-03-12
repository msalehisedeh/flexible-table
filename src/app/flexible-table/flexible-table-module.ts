/*
* Provides rendering of flexible table in a lazy load fashion.
*/
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe, DecimalPipe, JsonPipe, SlicePipe, UpperCasePipe, LowerCasePipe } from '@angular/common';
import {IntoPipeModule} from 'into-pipes';
import { DragDropModule } from 'drag-enabled';

import { TablePaginationComponent } from './table.pagination.component';
import { FlexibleTableComponent } from './flexible.table.component';

@NgModule({
    imports: [
        CommonModule,
        DragDropModule,
        IntoPipeModule
    ],
    declarations: [
        FlexibleTableComponent,
        TablePaginationComponent
    ],
    exports: [
        FlexibleTableComponent,
        TablePaginationComponent
    ],
    entryComponents: [
    ],
    providers: [
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class FlexibleTableModule {}
