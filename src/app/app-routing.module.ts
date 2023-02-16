import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
 import { EsriMapComponent } from './modules/esri-map/esri-map.component';

 import { MapComponent } from './modules/map/map.component';
 import { RouteMapComponent } from './modules/route-map/route-map.component';

 import { PpsDetailsComponent } from './modules/train/pps-details/pps-details.component';
 import { LaunchpadComponent } from './modules/launchpad/launchpad.component';

 import { MapDivComponent } from './modules/map/mapdiv/mapdiv.component';

const routes: Routes = [
 { path: 'map', component: MapComponent, pathMatch: 'full' },
 { path: 'ppsdetails/:chasis', component: PpsDetailsComponent, pathMatch: 'full' },

{ path: 'launchpad', component: LaunchpadComponent, pathMatch: 'full' },
{ path: 'routemap', component: RouteMapComponent, pathMatch: 'full' },

 { path: 'map2', component: MapDivComponent, pathMatch: 'full' },

  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: '', redirectTo: '/launchpad', pathMatch: 'full' },
  { path: '**', redirectTo: '/launchpad'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
