import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';
 import { MapStateService } from '../../core/services/map-state/map-state.service';

import { loadModules } from 'esri-loader';
 import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-route-map',
  templateUrl: './route-map.component.html',
  styleUrls: ['./route-map.component.css']
})
export class RouteMapComponent implements OnInit {
  @ViewChild('viewContainerRef', { read: ViewContainerRef, static: false }) VCR: ViewContainerRef;
  index: number = 0;
  componentsReferences = [];
  value: any;
  value2: any;
  option: any;


  datefrom: any;
  timefrom: any;

  dateto: any;
  timeto: any;

  //  map: Map;

  public mapView: __esri.MapView;
  private sub: Subscription = new Subscription();
  public href: string = "";
  public currentURL: string = "";
  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(
    private router : Router,
    private activatedRoute: ActivatedRoute,
    private CFR?: ComponentFactoryResolver,
    private cdref?: ChangeDetectorRef,
    private msService?: MapStateService
   ) { }


   ngOnInit() {

             this.href = this.router.url;
            this.currentURL = window.location.href.replace(this.href,'');
             console.log(this.href);
             console.log(this.currentURL);


             let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");


             return loadModules([
               "esri/layers/GeoJSONLayer",
               "esri/widgets/Sketch",
               'esri/Map',
               "esri/layers/GraphicsLayer",
               'esri/views/MapView',
               'esri/Graphic'
             ])
               .then(([GeoJSONLayer,Sketch,Map,GraphicsLayer, MapView, Graphic]) => {
                     //    esriConfig.apiKey = "50b,094799d25e425a0d8cab088adbe49960f20e1669d0f65f4366968aeee9bef";
                 const map: __esri.Map = new Map({
                   basemap: 'streets'
                 });



                 this.mapView = new MapView({
                   container: this.mapViewEl.nativeElement,
                   map: map,
                   center: ["-112.794721","49.725848"], //Longitude, latitude
                   zoom: 13,
                 });


                 const graphicsLayer = new GraphicsLayer();
                  map.add(graphicsLayer);

                  let arrpoints = [
                  {lat: "49.725848", lon: "-112.794721"},
                   {lat: "49.7", lon: "-112.779"},
                   {lat: "49.756", lon: "-112.288"},
                   {lat: "49.873", lon: "-110.918"},
                   {lat: "50.036", lon: "-110.687"}
                  ]

                  for(var i = 0; i < arrpoints.length;i++){
                    const point = { //Create a point
                       type: "point",
                       longitude: arrpoints[i].lon,
                       latitude: arrpoints[i].lat
                    };
                    const simpleMarkerSymbol = {
                       type: "simple-marker",
                       color: [226, 119, 40],  // Orange
                       outline: {
                           color: [255, 255, 255], // White
                           width: 1
                       }
                    };

                    const pointGraphic = new Graphic({
                       geometry: point,
                       attributes: {
                        // used to define the text string in the symbol
                         text: "Hola"
                       },
                       symbol: simpleMarkerSymbol
                    });
                    graphicsLayer.add(pointGraphic);
                  }
                  let that = this;

                  this.mapView.on("click", (event) => {
                    console.log(this.mapView.zoom);
                    if(this.mapView.zoom>8){
                      event.stopPropagation();
                       this.mapView.hitTest(event).then(({ results }) => {
                         var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
                         var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
                         console.log(lat);
                         console.log(lon);
                       });
                    }

                 });



               })
               .catch(err => {
                 console.error(err);
               });

     }

     searchForDates(){
       console.log(this.datefrom);
       console.log(this.timefrom);
       console.log(this.dateto);
       console.log(this.timeto);
     }


     ngAfterViewInit() {
     }

}
