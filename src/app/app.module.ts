import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Components
import { LoginComponent } from './auth/login/login.component';
import { NavigationComponent } from './modules/navigation/navigation.component';

import { MapComponent } from './modules/map/map.component';



 import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

 import {PasswordModule} from 'primeng/password';
 import {ButtonModule} from 'primeng/button';
 import {MenuModule} from 'primeng/menu';
 import {TieredMenuModule} from 'primeng/tieredmenu';

 import * as $ from "jquery";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavigationComponent,
    MapComponent

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
