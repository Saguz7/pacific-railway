import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MapComponent } from './map.component';
import { TokenResolverService } from '../../core/resolver/token-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: MapComponent,
    resolve: {
      access: TokenResolverService
    }
  }
];

@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MapModule { }
