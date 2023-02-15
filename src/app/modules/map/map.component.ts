import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { MapDivComponent } from './mapdiv/mapdiv.component';
import { MapStateService } from '../../core/services/map-state/map-state.service';

import { loadModules } from 'esri-loader';
import { Router } from '@angular/router';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})



export class MapComponent implements OnInit {
  @ViewChild('viewContainerRef', { read: ViewContainerRef, static: false }) VCR: ViewContainerRef;
  index: number = 0;
  componentsReferences = [];
  //  map: Map;

  public mapView: __esri.MapView;
  private sub: Subscription = new Subscription();
  public href: string = "";
  public currentURL: string = "";
  data: any;
  loading: boolean = false;
  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(
    private router : Router,
    private cdRef : ChangeDetectorRef,
    private CFR?: ComponentFactoryResolver,
    private cdref?: ChangeDetectorRef,
    private msService?: MapStateService
   ) { }

   @Output()

    ocultarFiltro:boolean;

    ngOnInit() {

      this.data = [];

              this.href = this.router.url;
             this.currentURL = window.location.href.replace(this.href,'');
      return loadModules([
        "esri/layers/GeoJSONLayer",
        "esri/widgets/Sketch",
        "esri/widgets/Sketch/SketchViewModel",
        'esri/Map',
        "esri/layers/GraphicsLayer",
        'esri/views/MapView',
        'esri/Graphic',
        "esri/layers/FeatureLayer",
        "esri/geometry/geometryEngineAsync"

      ])
        .then(([GeoJSONLayer,Sketch,SketchViewModel,Map,GraphicsLayer, MapView, Graphic,FeatureLayer,geometryEngineAsync]) => {
              //    esriConfig.apiKey = "50b,094799d25e425a0d8cab088adbe49960f20e1669d0f65f4366968aeee9bef";
          const map: __esri.Map = new Map({
            basemap: 'streets'
          });

          const clusterConfig = {
          type: "cluster",
          clusterRadius: "100px",
          // {cluster_count} is an aggregate field containing
          // the number of features comprised by the cluster
          popupTemplate: {
            title: "Cluster summary",
            content: "This cluster represents {cluster_count} earthquakes.",
            fieldInfos: [{
              fieldName: "cluster_count",
              format: {
                places: 0,
                digitSeparator: true
              }
            }]
          },
          clusterMinSize: "24px",
          clusterMaxSize: "60px",
          labelingInfo: [{
            deconflictionStrategy: "none",
            labelExpressionInfo: {
              expression: "Text($feature.cluster_count, '#,###')"
            },
            symbol: {
              type: "text",
              color: "#004a5d",
              font: {
                weight: "bold",
                family: "Noto Sans",
                size: "12px"
              }
            },
            labelPlacement: "center-center",
          }]
        };

          const geojsonlayer = new GeoJSONLayer({
              url: this.currentURL + "/assets/geojson.json",
              featureReduction: clusterConfig,
            });
          map.add(geojsonlayer);

          this.mapView = new MapView({
            container: this.mapViewEl.nativeElement,
            center: [-114.8574, 54.6542], // Longitude, latitude
            zoom: 4, // Zoom level
            map: map
          });


          const polygonGraphicsLayer = new GraphicsLayer();
          map.add(polygonGraphicsLayer);


          const graphicsLayer = new GraphicsLayer();
          map.add(graphicsLayer);

          this.mapView.ui.add("select-by-rectangle", "top-left");
          const selectButton = document.getElementById("select-by-rectangle");


          // click event for the select by rectangle button
          selectButton.addEventListener("click", () => {
            this.mapView.popup.close();
            sketchViewModel.create("rectangle");
          });


          this.mapView.ui.add("select-by-circle", "top-left");
          const selectButtonCCircle = document.getElementById("select-by-circle");


          // click event for the select by rectangle button
          selectButtonCCircle.addEventListener("click", () => {
            this.mapView.popup.close();
            sketchViewModel.create("circle");
          });

          this.mapView.ui.add("clear-selection", "top-left");
          document.getElementById("clear-selection").addEventListener("click", () => {
            polygonGraphicsLayer.removeAll();

           });

          const sketchViewModel = new SketchViewModel({
            view: this.mapView,
            layer: polygonGraphicsLayer
          });

          sketchViewModel.on("create", async (event) => {
            if (event.state === "complete") {
              // this polygon will be used to query features that intersect it
              const geometries = polygonGraphicsLayer.graphics.map(function(graphic){
                return graphic.geometry
              });

              const queryGeometry = await geometryEngineAsync.union(geometries.toArray());
             // selectFeatures(queryGeometry);
            }
          });

          let that = this;

          this.mapView.on("click", (event) => {
                event.stopPropagation();
           this.mapView.hitTest(event).then(({ results }) => {
             var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
               var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
               if(results.length>0){

                 let point = this.data.find(element => element.geometry.coordinates[0].toFixed() == lon.toFixed() && element.geometry.coordinates[1].toFixed() == lat.toFixed());
                 if(point!=undefined){
                   this.mapView.popup.open({
                       // Set the popup's title to the coordinates of the clicked location
                       title: "Device ID: [" + point.properties.device_id + "]",
                       location: event.mapPoint // Set the location of the popup to the clicked location
                   });
                 }
                }
            });
         });

        })


        .catch(err => {
          console.error(err);
        });

      }


         ngAfterViewInit() {

           this.loading = true;


           fetch(this.currentURL + "/assets/geojson.json")
               .then(res => res.json())
               .then((out) => {
                 this.data = out.features;
                 this.loading = false;

           }).catch(err => console.error(err));

           this.cdRef.detectChanges();
           }

  ocultar(){
    return (this.ocultarFiltro = true);
  }

  mostrar(){
    return(this.ocultarFiltro = false);
  }

}
