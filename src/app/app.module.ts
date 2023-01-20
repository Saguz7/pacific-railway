import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Components
import { LoginComponent } from './auth/login/login.component';
import { NavigationComponent } from './modules/navigation/navigation.component';

import { MapComponent } from './modules/map/map.component';
import { EsriMapComponent } from './modules/esri-map/esri-map.component';

import { MapDivComponent } from './modules/map/mapdiv/mapdiv.component';
import { ChasisComponent } from './modules/train/chasis/chasis.component';



 import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

 import {PasswordModule} from 'primeng/password';
 import {ButtonModule} from 'primeng/button';
 import {MenuModule} from 'primeng/menu';
 import {TieredMenuModule} from 'primeng/tieredmenu';

 import { EsriMapService } from './core/services/esri-map/esri-map.service';


 import * as $ from "jquery";
import * as L from 'leaflet';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavigationComponent,
    MapComponent,
    EsriMapComponent,
    MapDivComponent,
    ChasisComponent

  ],
  imports: [
    FormsModule,
    PasswordModule,
    ButtonModule,
    MenuModule,
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
