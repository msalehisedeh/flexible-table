import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {IntoPipeModule} from '@sedeh/into-pipes';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { SelectService } from './select.service';
import { FlexibleTableModule } from './flexible-table/flexible-table-module';

@NgModule({
  imports: [
    BrowserModule,
    IntoPipeModule,
    FlexibleTableModule
  ],
  declarations: [
    AppComponent,
    SelectService
  ],
  providers: [
    AppService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
