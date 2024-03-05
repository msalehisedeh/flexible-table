import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from  '@angular/common/http';

import {IntoPipeModule} from '@sedeh/into-pipes';
import { FlexibleTableModule } from '@sedeh/flexible-table';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { SelectService } from './select.service';

@NgModule({
  imports: [
    BrowserModule,
    IntoPipeModule,
    HttpClientModule,
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
