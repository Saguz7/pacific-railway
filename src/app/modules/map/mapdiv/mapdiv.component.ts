import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';
import {MapCustomService} from '../../../core/services/map/map-custom.service'

import * as mapboxgl from 'mapbox-gl';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
declare var L: any;

@Component({
  selector: 'app-mapdiv',
  templateUrl: './mapdiv.component.html',
  styleUrls: ['./mapdiv.component.css']
})
export class MapDivComponent implements OnInit {

  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D | null;
  mapbox = (mapboxgl as typeof mapboxgl);
  map!: mapboxgl.Map;
  trains: [];

  lat = 54.6542;
  lng = -114.8574;
  viewmap = true;
  constructor(
  private mapCustomService: MapCustomService,
  private CFR?: ComponentFactoryResolver,
  private cdref?: ChangeDetectorRef,

  ) { }
/*
  ngOnInit() {
    console.log('Entra aqui');








  }
  */

  ngAfterViewInit() {

    /*
    window.onload = function() {
      console.log('Entra aqui 3');

       L.mapquest.key = 'FM9hgjXyKly2nJK9eagKmGG6DqGAZrqq';
       console.log('Entra aqui 2');

       var map = L.mapquest.map('map', {
         center: [54.6542, -114.8574],
         layers: L.mapquest.tileLayer('map'),
         zoom: 12
       });

       L.marker([54.6542, -114.8574], {
          icon: L.mapquest.icons.marker(),
          draggable: false
        }).bindPopup('Point 1').addTo(map).on('click', function(e) {
           console.log(e.latlng);
       });

       L.mapquest.control().addTo(map);
       L.mapquest.geocodingControl().addTo(map);
     }
       this.cdref.detectChanges();

       */

  }

  drawMap(){

    /*

    this.viewmap= false;

    setTimeout(() => {
      this.viewmap= true;
      setTimeout(() => {
        window.onload = function() {
           L.mapquest.key = 'ck2OXUAJsF0iz999XGQ62jyXo8AXOVp7';

           var map = L.mapquest.map('map', {
             center: [this.lat, this.lng],
             layers: L.mapquest.tileLayer('map'),
             zoom: 12
           });

           L.marker([this.lat, this.lng], {
              icon: L.mapquest.icons.marker(),
              draggable: false
            }).bindPopup('Point 1').addTo(map).on('click', function(e) {
               console.log(e.latlng);
           });

           L.mapquest.control().addTo(map);
           L.mapquest.geocodingControl().addTo(map);
         }
      }, 100);


    }, 100);

    */


  }



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
