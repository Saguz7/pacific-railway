import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Components
import { LoginComponent } from './auth/login/login.component';
import { MapComponent } from './modules/map/map.component';



 import { FormsModule, ReactiveFormsModule } from '@angular/forms';

 import {PasswordModule} from 'primeng/password';
 import {ButtonModule} from 'primeng/button';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MapComponent

  ],
  imports: [
    FormsModule,
    PasswordModule,
    ButtonModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
