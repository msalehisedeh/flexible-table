import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTransfer } from './datatransfer';
import { DragDirective } from './drag.directive';
import { DragInDocumentDirective } from './drag-only.directive';
import { DropDirective } from './drop.directive';

@NgModule({
  imports: [
	CommonModule
  ],
  declarations: [
	DragDirective,
    DragInDocumentDirective,
	DropDirective
  ],
  exports: [
	DragDirective,
	DragInDocumentDirective,
	DropDirective
  ],
  entryComponents: [
  ],
  providers: [
    DataTransfer
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class DragDropModule {}
