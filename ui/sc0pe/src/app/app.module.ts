import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewScanComponent } from './new-scan/new-scan.component';
import { ScansComponent } from './scans/scans.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    NewScanComponent,
    ScansComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    TableModule,
    TooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
