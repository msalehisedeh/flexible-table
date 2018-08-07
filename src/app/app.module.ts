import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {IntoPipeModule} from 'into-pipes';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { SelectService } from './select.service';
import { FlexibleTableModule } from './flexible-table/flexible-table-module';

@NgModule({
  declarations: [
    AppComponent,
    SelectService
  ],
  imports: [
    BrowserModule,
    IntoPipeModule,
    HttpModule,
    FlexibleTableModule
  ],
  providers: [
    AppService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
