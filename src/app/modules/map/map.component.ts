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

      this.events = [];

      this.data = [];
      this.dataGeneral = [];

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
                   console.log('...................................');
                  console.log(out);
                  console.log('...................................');

                this.rehacerjson(out.features);

           }).catch(err => console.error(err));

           this.cdRef.detectChanges();
           }

           buildmap(json){
             this.jsonmap = json;

              const blob = new Blob([JSON.stringify(json)], {
                type: "application/json"
              });

              // URL reference to the blob
              const urljson = URL.createObjectURL(blob);
              console.log(urljson);

              return loadModules([
                "esri/Map",
                    "esri/layers/FeatureLayer",
                    "esri/layers/GeoJSONLayer",
                    "esri/views/MapView",
                    "esri/widgets/Legend",
                    "esri/widgets/Expand",
                    "esri/widgets/Home",
                    "esri/popup/content/CustomContent",
                    "esri/layers/GraphicsLayer",
                    "esri/widgets/Sketch",
                    "esri/widgets/Sketch/SketchViewModel",
                    "esri/geometry/geometryEngineAsync"



              ])
                .then(([Map, FeatureLayer, GeoJSONLayer, MapView, Legend, Expand, Home, CustomContent,GraphicsLayer,Sketch,SketchViewModel,geometryEngineAsync]) => {
                      //    esriConfig.apiKey = "50b,094799d25e425a0d8cab088adbe49960f20e1669d0f65f4366968aeee9bef";
                      const map: __esri.Map = new Map({
                        basemap: 'streets'
                      });

                      const layer = new GeoJSONLayer({
                           title: "Chasis",
                           url: urljson,
                           outFields: ["*"],
                           popupTemplate: {
                             title: "Chasis <a href='http://localhost:4200/ppsdetails/{id}'>{id}</a>",
                             content: "{id} - {move_type}",
                           }
                       });



                       const baseLayer = new FeatureLayer({
                           portalItem: {
                               id: "2b93b06dc0dc4e809d3c8db5cb96ba69"
                           },
                           legendEnabled: false,
                           popupEnabled: false,
                           renderer: {
                               type: "simple",
                               symbol: {
                                   type: "simple-fill",
                                   color: [65, 65, 65, 1],
                                   outline: {
                                       color: [50, 50, 50, 0.75],
                                       width: 0.5
                                   }
                               }
                           },
                           spatialReference: {
                               wkid: 5936
                           }
                       });



                       this.mapView = new MapView({
                         container: this.mapViewEl.nativeElement,
                         center: [-114.8574, 54.6542], // Longitude, latitude
                         zoom: 4, // Zoom level
                         map: map
                       });
                       map.add(layer);

                       this.mapView.popup.viewModel.includeDefaultActions = false;

                      // this.mapView.whenLayerView(layer).then(lv => {
                       this.mapView.whenLayerView(layer).then(lv => {
                         console.log(lv);
                           const layerView = lv;
                           console.log(layerView);

                           const customContentPromise = new CustomContent({
                               outFields: ["*"],
                               creator: (event) => {
                                 console.log(event);
                                 console.log(event.graphic.getObjectId());

                                 const query = layer.createQuery();
                                 query.aggregateIds = [event.graphic.getObjectId()];
                                 console.log(query);
                                 return layer.queryFeatures(query).then(result => {
                                     console.log(result.features);
                                     const contentDiv = document.createElement("div");
                                     const featuresUl = document.createElement("ul");
                                     let featureLi;
                                     for (const feature of result.features) {
                                         featureLi = document.createElement("li");
                                         featureLi.innerText = `Chasis ${feature.attributes.id}`;
                                         featuresUl.appendChild(featureLi);
                                     }
                                     contentDiv.appendChild(featuresUl);
                                     return contentDiv
                                 });

                                 /*
                                   const query = layerView.createQuery();
                                   query.aggregateIds = [event.graphic.getObjectId()];
                                   console.log(query);
                                   return layerView.queryFeatures(query).then(result => {
                                       console.log(result.features);
                                       const contentDiv = document.createElement("div");
                                       const featuresUl = document.createElement("ul");
                                       let featureLi;
                                       for (const feature of result.features) {
                                           featureLi = document.createElement("li");
                                           featureLi.innerText = `Chasis ${feature.attributes.id}`;
                                           featuresUl.appendChild(featureLi);
                                       }
                                       contentDiv.appendChild(featuresUl);
                                       return contentDiv
                                   });
                                   */
                               }
                           });

                           const clusterConfig = {
                               type: "cluster",
                               clusterRadius: "100px",
                               popupTemplate: {
                                   title: "Cluster summary",
                                   outFields: ["*"],
                                   content: [customContentPromise],
                                   actions: []
                               },
                               clusterMinSize: "24px",
                               clusterMaxSize: "60px",
                               labelingInfo: [
                                   {
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
                                       labelPlacement: "center-center"
                                   }
                               ]
                           };

                           layer.featureReduction = clusterConfig;

                           const toggleButton = document.getElementById("cluster");

                           toggleButton.addEventListener("click", () => {
                               let fr = layer.featureReduction;
                               layer.featureReduction =
                                   fr && fr.type === "cluster" ? null : clusterConfig;
                               toggleButton.innerText =
                                   toggleButton.innerText === "Enable Clustering"
                                       ? "Disable Clustering"
                                       : "Enable Clustering";
                           });
                       });


                       const legend = new Legend({
                           view: this.mapView,
                           container: "legendDiv"
                       });

                       const infoDiv = document.getElementById("infoDiv");
                       this.mapView.ui.add(
                           new Expand({
                               view: this.mapView,
                               content: infoDiv,
                               expandIconClass: "esri-icon-layer-list",
                               expanded: false
                           }),
                           "top-left"
                       );


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

                })


                .catch(err => {
                  console.error(err);
                });



              }




           rehacerjson(features){
             this.data = []
             this.dataGeneral = []

             this.events= []
             this.georeferences = [];
             for(var i = 0; i < features.length;i++){
               let arr = features[i].properties.move_type.replace('_',' ').split(" ");
               for (var a = 0; a < arr.length; a++) {
                   arr[a] = arr[a].charAt(0).toUpperCase() + arr[a].slice(1);
               }
               const str2 = arr.join(" ");
               const found = this.events.find(element => element.name == str2);
               if(!found){
                 this.events.push({name: str2, value: features[i].properties.move_type});
                 this.georeferences.push({name: str2, value: features[i].properties.move_type});
               }

               this.data.push(
                 {
                   reference: features[i].id,
                    device_id:  features[i].properties.device_id,
                     date: this.formatdate(features[i].properties.date),
                     move_type: features[i].properties.move_type,
                     coordinates: features[i].geometry.coordinates[0] + ',' + features[i].geometry.coordinates[1] ,
                 }
               );

               this.dataGeneral.push(
                 {
                   reference: features[i].id,
                    device_id:  features[i].properties.device_id,
                     date: this.formatdate(features[i].properties.date),
                     move_type: features[i].properties.move_type,
                     coordinates: features[i].geometry.coordinates[0] + ',' + features[i].geometry.coordinates[1] ,
                 }
               );
             }

             console.log(this.events);


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

  getFilters($event){
    console.log($event.event);
    this.data = this.dataGeneral;
     if($event.event!=null){
       this.data = this.data.filter(element => element.move_type == $event.event.value);
     }
     console.log($event.chasis);

     if($event.chasis!=null){
       this.data = this.data.filter(element => element.reference == $event.chasis);
     }

     if($event.georeference!=null){
       this.data = this.data.filter(element => element.georeference == $event.georeference.value);
     }
     setTimeout(() => {
       this.rebuildmap($event);
     }, 100);




  }

  rebuildmap($event){
    fetch("https://d2gv90pkqj.execute-api.us-west-2.amazonaws.com/dev/get-locations")
        .then(res => res.json())
        .then((out) => {
          this.makefromjson(out,$event);
    }).catch(err => console.error(err));
  }

  makefromjson(json,$event){
    let arrayfeacturesfilter = json.features;
    console.log('+++++++++++++++++');
    console.log(json.features);
    console.log('+++++++++++++++++');

    if($event.event!=null){
       arrayfeacturesfilter = arrayfeacturesfilter.filter(element => element.properties.move_type == $event.event.value);

    }

    if($event.chasis!=null){
      arrayfeacturesfilter = arrayfeacturesfilter.filter(element => element.id == $event.chasis);
    }

    if($event.georeference!=null){
      arrayfeacturesfilter = arrayfeacturesfilter.filter(element => element.georeference == $event.georeference.value);
    }


    json.features = arrayfeacturesfilter;
    setTimeout(() => {
      this.buildmap(json);
    }, 100);

   }

}
