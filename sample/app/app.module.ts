import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { IntoPipeModule } from '@sedeh/into-pipes';
import { FlexibleTableModule } from '@sedeh/flexible-table';

import { AppComponent } from './app.component';
import { SelectService } from './select.service';

@NgModule({
  imports: [
    BrowserModule,
    IntoPipeModule,
    HttpClientModule,
    FlexibleTableModule,
  ],
  declarations: [AppComponent, SelectService],
  bootstrap: [AppComponent],
})
export class AppModule {}
