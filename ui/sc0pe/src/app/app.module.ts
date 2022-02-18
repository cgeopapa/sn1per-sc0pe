import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewScanComponent } from './new-scan/new-scan.component';

@NgModule({
  declarations: [
    AppComponent,
    NewScanComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
