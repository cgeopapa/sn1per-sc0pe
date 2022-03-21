import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import {CommonModule} from "@angular/common"

import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import {InputNumberModule} from 'primeng/inputnumber';
import {CheckboxModule} from 'primeng/checkbox';
import {TabViewModule} from 'primeng/tabview';
import {InputSwitchModule} from 'primeng/inputswitch';
import {DialogModule} from 'primeng/dialog';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {AccordionModule} from 'primeng/accordion';
import {FieldsetModule} from 'primeng/fieldset';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScansComponent } from './scans/scans.component';
import { HomeComponent } from './home/home.component';
import { TerminalComponent } from './terminal/terminal.component';
import { ConfigsComponent } from './configs/configs.component';
import { ScanDetailsComponent } from './scan-details/scan-details.component';

@NgModule({
  declarations: [
    AppComponent,
    ScansComponent,
    HomeComponent,
    TerminalComponent,
    ConfigsComponent,
    ScanDetailsComponent
  ],
  imports: [
    CommonModule,
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
    InputNumberModule,
    CheckboxModule,
    TabViewModule,
    InputSwitchModule,
    DialogModule,
    ConfirmDialogModule,
    AccordionModule,
    FieldsetModule,
  ],
  providers: [
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
