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
    ocultarTabla:boolean;

    ngOnInit() {

      this.data = [];

              this.href = this.router.url;
             this.currentURL = window.location.href.replace(this.href,'');

             /*

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
            title: "Information",
            content: "{cluster_count} chasis.",
            fieldInfos: [
            {
              fieldName: "cluster_count",
              format: {
                places: 0,
                digitSeparator: true
              }
            }
          ]
          },
          clusterMinSize: "24px",
          clusterMaxSize: "30px",
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

        let url = this.currentURL;

          const geojsonlayer = new GeoJSONLayer({
              url: this.currentURL + "/assets/get-locations.json",
              //url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",

              //url: "https://d2gv90pkqj.execute-api.us-west-2.amazonaws.com/dev/get-locations",
              featureReduction: clusterConfig,
              popupTemplate: {
                title: "Chasis <a href='http://localhost:4200/ppsdetails/{id}'>{id}</a>",
                content: "{date}",
                fieldInfos: [
                  {
                    fieldName: "ID"
                  },
                  {
                    fieldName: "date"
                  },
                  {
                    fieldName: "move_type"
                  }
                ]
              },
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
            console.log(this.mapView.zoom);
            if(this.mapView.zoom>8){
              event.stopPropagation();
         this.mapView.hitTest(event).then(({ results }) => {
           var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
             var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
             console.log(lat);
             console.log(lon);

             if(results.length>0){
              }
          });
            }

         });

        })


        .catch(err => {
          console.error(err);
        });

        */


      }


         ngAfterViewInit() {

           this.loading = true;


           fetch("https://d2gv90pkqj.execute-api.us-west-2.amazonaws.com/dev/get-locations")
               .then(res => res.json())
               .then((out) => {
                // this.data = out.features;
                this.buildmap(out);
                  this.loading = false;
                this.rehacerjson(out.features);

           }).catch(err => console.error(err));

           this.cdRef.detectChanges();
           }

           buildmap(json){
              const blob = new Blob([JSON.stringify(json)], {
                type: "application/json"
              });

              // URL reference to the blob
              const urljson = URL.createObjectURL(blob);
              console.log(urljson);

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
                    title: "Information",
                    content: "{cluster_count} chasis.",
                    fieldInfos: [
                    {
                      fieldName: "cluster_count",
                      format: {
                        places: 0,
                        digitSeparator: true
                      }
                    }
                  ]
                  },
                  clusterMinSize: "24px",
                  clusterMaxSize: "30px",
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

                let url = this.currentURL;

                  const geojsonlayer = new GeoJSONLayer({
                      url: urljson,
                      //url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",

                      //url: "https://d2gv90pkqj.execute-api.us-west-2.amazonaws.com/dev/get-locations",
                      featureReduction: clusterConfig,
                      popupTemplate: {
                        title: "Chasis <a href='http://localhost:4200/ppsdetails/{id}'>{id}</a>",
                        content: "{id} - {move_type}",
                        fieldInfos: [
                          {
                            fieldName: "ID"
                          },
                          {
                            fieldName: "date"
                          },
                          {
                            fieldName: "move_type"
                          }
                        ]
                      },
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
                    console.log(this.mapView.zoom);
                    if(this.mapView.zoom>8){
                      event.stopPropagation();
                 this.mapView.hitTest(event).then(({ results }) => {
                   var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
                     var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
                     console.log(lat);
                     console.log(lon);

                     if(results.length>0){
                      }
                  });
                    }

                 });

                })


                .catch(err => {
                  console.error(err);
                });


           }


           rehacerjson(features){
             this.data = []


             for(var i = 0; i < features.length;i++){
               this.data.push(
                 {
                   reference: features[i].id,
                    device_id:  features[i].properties.device_id,
                     date: this.formatdate(features[i].properties.date),
                     move_type: features[i].properties.move_type,
                     coordinates: features[i].geometry.coordinates[0] + ',' + features[i].geometry.coordinates[1] ,
                 }
               );
             }
           }

           formatdate(date){
             let dateformat = date.split(' ');
             return dateformat[0];
           }

  ocultar(){

    const map = document.querySelector('.esri-view');
    map.setAttribute('style', 'height: 600px');
    return (this.ocultarFiltro = true);
  }

  mostrar(){
    const map = document.querySelector('.esri-view');
    map.setAttribute('style', 'height: 300px');
    return(this.ocultarFiltro = false);
  }

  ocultarTab(){
    const map = document.querySelector('.esri-view');
    map.setAttribute('style', 'height: 600px');
    return (this.ocultarTabla = true);
  }

  mostrarTabla(){
    const map = document.querySelector('.esri-view');
    map.setAttribute('style', 'height: 300px');
    return(this.ocultarTabla = false);
  }

}
