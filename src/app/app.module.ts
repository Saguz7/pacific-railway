import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Components
import { LoginComponent } from './auth/login/login.component';
import { PasswordRenameComponent } from './auth/password-rename/password-rename.component';

import { AccessDeniedComponent } from './auth/access-denied/access-denied.component';

import { NavigationComponent } from './modules/navigation/navigation.component';

import { MapComponent } from './modules/map/map.component';
import { TableRouteMapComponent } from './modules/route-map/table-route-map/table-route-map.component';
import { RouteMapComponent } from './modules/route-map/route-map.component';

import { FilterRouteMapComponent } from './modules/route-map/filter-routemap/filter-routemap.component';



import { TableMapComponent } from './modules/map/table-map/table-map.component';
import { FilterMapComponent } from './modules/map/filter-map/filter-map.component';

import { EsriMapComponent } from './modules/esri-map/esri-map.component';
import { LaunchpadComponent } from './modules/launchpad/launchpad.component';
import { NavlaunchComponent } from './modules/launchpad/navlauch/navlaunch.component';
import { NotificationComponent } from './modules/launchpad/notification/notification.component';
import { PRSMComponent } from './modules/launchpad/boards/problem-resolution-shipment-management/problem-resolution-shipment-management.component';


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
 import {ScrollPanelModule} from 'primeng/scrollpanel';
 import {ChartModule} from 'primeng/chart';
 import {PanelModule} from 'primeng/panel';
import {ProgressBarModule} from 'primeng/progressbar';
 import {DividerModule} from 'primeng/divider';
 import {ToastModule} from 'primeng/toast';
 import { EsriMapService } from './core/services/esri-map/esri-map.service';
import {InputSwitchModule} from 'primeng/inputswitch';
import { HttpClientModule } from '@angular/common/http';
 import * as $ from "jquery";
import * as L from 'leaflet';


//import { TokenResolverService } from './core/resolver/token-resolver.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PasswordRenameComponent,
    NavigationComponent,
    MapComponent,
    RouteMapComponent,
    FilterMapComponent,
    EsriMapComponent,
    MapDivComponent,
    ChasisComponent,
    LaunchpadComponent,
    TableMapComponent,
    PpsDetailsComponent,
    NavlaunchComponent,
    NotificationComponent,
    PRSMComponent,
    TableRouteMapComponent,
    FilterRouteMapComponent,
    AccessDeniedComponent

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
    ScrollPanelModule,
    BrowserAnimationsModule,
    ChartModule,
    DividerModule,
    PanelModule,
    ProgressBarModule,
    HttpClientModule,
    InputSwitchModule,
    ToastModule
  ],
  providers: [EsriMapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
