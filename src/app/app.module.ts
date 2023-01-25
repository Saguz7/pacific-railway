import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Components
import { LoginComponent } from './auth/login/login.component';
import { NavigationComponent } from './modules/navigation/navigation.component';

import { MapComponent } from './modules/map/map.component';
import { RouteMapComponent } from './modules/route-map/route-map.component';


import { TableMapComponent } from './modules/map/table-map/table-map.component';
import { FilterMapComponent } from './modules/map/filter-map/filter-map.component';

import { EsriMapComponent } from './modules/esri-map/esri-map.component';
import { LaunchpadComponent } from './modules/launchpad/launchpad.component';

import { MapDivComponent } from './modules/map/mapdiv/mapdiv.component';
import { ChasisComponent } from './modules/train/chasis/chasis.component';
import { PpsDetailsComponent } from './modules/train/pps-details/pps-details.component';



 import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

 import {PasswordModule} from 'primeng/password';
 import {ButtonModule} from 'primeng/button';
 import {MenuModule} from 'primeng/menu';
 import {TieredMenuModule} from 'primeng/tieredmenu';
 import {TableModule} from 'primeng/table';
 import {RadioButtonModule} from 'primeng/radiobutton';
 import {DropdownModule} from 'primeng/dropdown';
 import {CalendarModule} from 'primeng/calendar';
 import { EsriMapService } from './core/services/esri-map/esri-map.service';


 import * as $ from "jquery";
import * as L from 'leaflet';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavigationComponent,
    MapComponent,
    RouteMapComponent,
    FilterMapComponent,
    EsriMapComponent,
    MapDivComponent,
    ChasisComponent,
    LaunchpadComponent,
    TableMapComponent,
    PpsDetailsComponent

  ],
  imports: [
    FormsModule,
    PasswordModule,
    ButtonModule,
    MenuModule,
    TableModule,
    RadioButtonModule,
    DropdownModule,
    CalendarModule,
    TieredMenuModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [EsriMapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
