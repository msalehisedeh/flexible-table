/*
* Provides rendering of flexible tabs in a lazy load fashion.
*/
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexibleShowcaseComponent } from './flexible-showcase.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        FlexibleShowcaseComponent
    ],
    exports: [
        FlexibleShowcaseComponent
    ],
    entryComponents: [
    ],
    providers: [
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class FlexibleShowcaseModule {}
