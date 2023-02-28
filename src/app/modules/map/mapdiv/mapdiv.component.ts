import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';
import {MapCustomService} from '../../../core/services/map/map-custom.service'
import { loadModules } from 'esri-loader';

import * as mapboxgl from 'mapbox-gl';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
declare var L: any;

@Component({
  selector: 'app-mapdiv',
  templateUrl: './mapdiv.component.html',
  styleUrls: ['./mapdiv.component.css']
})
export class MapDivComponent implements OnInit {

  @ViewChild('viewContainerRef', { read: ViewContainerRef, static: false }) VCR: ViewContainerRef;
  index: number = 0;
  componentsReferences = [];
  events = [];
  georeferences = [];

  //  map: Map;

  public mapView: __esri.MapView;
  private sub: Subscription = new Subscription();
  public href: string = "";
  public currentURL: string = "";
  data: any;
  dataGeneral: any;
  jsonmap: any;
  loading: boolean = false;
  counterror: any;
  zoomgeneral: any;
  firstview: boolean = false;
  filtersactive: boolean = false;
  filterspoints = [];


  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(
  private mapCustomService: MapCustomService,
  private CFR?: ComponentFactoryResolver,
  private cdref?: ChangeDetectorRef,

  ) { }
  ngAfterViewInit() {
    this.getDatafromGeoJson();
    this.cdref.detectChanges();
  }

  getDatafromGeoJson(){
    fetch("https://d2gv90pkqj.execute-api.us-west-2.amazonaws.com/dev/get-locations")
    .then(res => res.json())
    .then((out) => {
      if(out.errorMessage==undefined){
        this.loading = false;
        this.buildmap(out);
       }else{
        setTimeout(() => {
          this.counterror = this.counterror + 1;
          if(this.counterror < 10){
            this.getDatafromGeoJson();
          }
        }, 100);
      }
    }).catch(err => console.error(err));
  }

  buildmap(json){
    this.jsonmap = json;
    const blob = new Blob([JSON.stringify(json)], {
      type: "application/json"
    });
    const urljson = URL.createObjectURL(blob);
    return loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/Graphic",
      "esri/geometry/Point",
      "esri/rest/route",
      "esri/rest/support/RouteParameters",
      "esri/rest/support/FeatureSet",
      "esri/config",
      "esri/widgets/Expand"
    ])
    .then(([Map, MapView, Graphic, Point, route, RouteParameters, FeatureSet, esriConfig,Expand]) => {
      const map: __esri.Map = new Map({
        basemap: "arcgis-navigation"
      });

      esriConfig.apiKey = "AAPK304c230c0e0e488dbe5b69b257f55ef0Eu9jOtbwGIvKFvH3fwYHPaa0qIEBQDop0q3Oym5x0ZKK7rsvqiH88X_UrIDiBit7";

      const center = new Point ([-122.62,45.526201]);

      const origin = new Point([-122.690176,45.522054]);
      const stop =  new Point([-122.614995,45.526201]);
      const destination = new Point([-122.68782,45.51238]);

      this.mapView = new MapView({
        container: this.mapViewEl.nativeElement,
        map: map,
        center: center,
        zoom: 12,
        constraints: {
          snapToZoom: false
        }
      });

      this.mapView.when(()=>{
        addGraphic("start", origin);
        addGraphic("stop", stop);
        addGraphic("finish", destination);
        getRoute();
      });

      this.mapView.on("click", (event)=>{
        if (this.mapView.graphics.length === 0) {
          addGraphic("start", event.mapPoint);
        } else if (this.mapView.graphics.length === 1) {
          addGraphic("stop", event.mapPoint);
        } else if (this.mapView.graphics.length === 2) {
          addGraphic("finish", event.mapPoint);
          getRoute();
        } else {
          this.mapView.graphics.removeAll();
          this.mapView.ui.empty("top-right");
          addGraphic("start",event.mapPoint);
        }
      });

      function addGraphic(type, point) {
        let color = "#ffffff";
        let outlineColor = "#000000"
        let size = "12px";
        if (type == "start") {
          color = "#ffffff";
        } else if (type == "stop") {
          color = "#000000";
          outlineColor = "#ffffff";
          size = "8px";
        } else {
          color = "#000000";
          outlineColor = "#ffffff";
        }
        const graphic = new Graphic({
          symbol: {
            type: "simple-marker",
            color: color,
            size: size,
            outline: {
              color: outlineColor,
              width: "1px"
            }
          },
          geometry: point
        });
        this.mapView.graphics.add(graphic);
      }

      function getRoute() {

        const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

        const routeParams = new RouteParameters({
          stops: new FeatureSet({
            features: this.mapView.graphics.toArray()
          }),
          returnDirections: true  
        });

        route.solve(routeUrl, routeParams)
          .then((data)=> {
            if (data.routeResults.length > 0) {
              showRoute(data.routeResults[0].route);
              showDirections(data.routeResults[0].directions.features);
            }
          })
          .catch((error)=>{
            console.log(error);
          })
      }

      function showRoute(routeResult) {
        routeResult.symbol = {
          type: "simple-line",
          color: [5, 150, 255],
          width: 3
        };
        this.mapView.graphics.add(routeResult,0);
      }

      function showDirections(directions) {
        function showRouteDirections(directions) {
          const directionsList = document.createElement("ol");
          directions.forEach(function(result,i){
            const direction = document.createElement("li");
            direction.innerHTML = result.attributes.text + ((result.attributes.length > 0) ? " (" + result.attributes.length.toFixed(2) + " miles)" : "");
            directionsList.appendChild(direction);
          });
          directionsElement.appendChild(directionsList);
        }

        const directionsElement = document.createElement("div");
        directionsElement.innerHTML = "<h3>Directions</h3>";
      //  directionsElement.classList = "esri-widget esri-widget--panel esri-directions__scroller directions";
        directionsElement.style.marginTop = "0";
        directionsElement.style.padding = "0 15px";
        directionsElement.style.minHeight = "365px";

        showRouteDirections(directions);

        this.mapView.ui.empty("top-right");
        this.mapView.ui.add(new Expand({
          view:this.mapView,
          content:directionsElement,
          expanded:true,
          mode:"floating"}), "top-right");
      }
    })
    .catch(err => {
      console.error(err);
    });


  }


  ngOnInit() {



  }

}
