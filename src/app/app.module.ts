import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRouting } from './app.router';
import { CommonComponent, PageComponentList } from './containers/Core';
import { ManagerPageComponentList } from './manage/Index';
import { ManagerApiPageComponentList } from './manageapi/Index';

import { AppComponent } from './app.component';
const Routers = AppRouting.Router();

@NgModule({
  declarations: [AppComponent, PageComponentList, ManagerPageComponentList, ManagerApiPageComponentList, CommonComponent],
  imports: [BrowserAnimationsModule, BrowserModule, FormsModule, HttpModule, Routers],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [CommonComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
