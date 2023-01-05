import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { Subscription } from 'rxjs';
import {MapCustomService} from '../../core/services/map/map-custom.service'
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D | null;
  mapbox = (mapboxgl as typeof mapboxgl);
  map!: mapboxgl.Map;
  trains: [];
  constructor(
    private mapCustomService: MapCustomService
  ) { }

  ngOnInit() {
    this.trains = [

    ];

    setTimeout(()=>{
      this.mapCustomService.buildMap()
      .then(({data}) => {
        console.log('data:', data);
      })
      .catch((err) => {
      //  console.log('******* ERROR ******', err);
      });
    }, 1000);
  }

}
