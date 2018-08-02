import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {IntoPipeModule} from 'into-pipes';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { FlexibleTableModule } from './flexible-table/flexible-table-module';

@NgModule({
  imports: [
	BrowserModule,
    IntoPipeModule,
    HttpModule,
    FlexibleTableModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    AppService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
