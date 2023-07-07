import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { PasswordRenameComponent } from './auth/password-rename/password-rename.component';
import { AccessDeniedComponent } from './auth/access-denied/access-denied.component';

 import { EsriMapComponent } from './modules/esri-map/esri-map.component';

 import { MapComponent } from './modules/map/map.component';
 import { RouteMapComponent } from './modules/route-map/route-map.component';

 import { PpsDetailsComponent } from './modules/train/pps-details/pps-details.component';
 import { LaunchpadComponent } from './modules/launchpad/launchpad.component';

 import { MapDivComponent } from './modules/map/mapdiv/mapdiv.component';
import {AuthGuard} from "./auth/guards/check-auth.guard";
import { TokenResolverService } from './core/resolver/token-resolver.service';

const routes: Routes = [
  {
    path: 'current-chassis-location',
    component: MapComponent ,
    canActivate: [AuthGuard]
  },
  {
    path: 'chassis-details/:chasis',
    component: PpsDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'chassis-history/:chasis',
    component: RouteMapComponent,
    canActivate: [AuthGuard]
  },
  { path: 'access-denied', component: AccessDeniedComponent, pathMatch: 'full' },

  { path: '**', redirectTo: '/current-chassis-location'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
