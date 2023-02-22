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
  counterror: any;
  zoomgeneral: any;
  firstview: boolean = false;


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
      this.counterror = 0;

      this.data = [];
      this.dataGeneral = [];

              this.href = this.router.url;
             this.currentURL = window.location.href.replace(this.href,'');

             /*

                   return loadModules([
                      "esri/Map",
                      "esri/layers/FeatureLayer",
                      "esri/layers/GeoJSONLayer",
                      "esri/views/MapView",
                      "esri/widgets/Legend",
                      "esri/widgets/Expand",
                      "esri/widgets/Home",
                      "esri/popup/content/CustomContent"

                   ])
                     .then(([Map, FeatureLayer, GeoJSONLayer, MapView, Legend, Expand, Home, CustomContent]) => {
                           //    esriConfig.apiKey = "50b,094799d25e425a0d8cab088adbe49960f20e1669d0f65f4366968aeee9bef";

                           const layer = new GeoJSONLayer({
                                          title: "Earthquakes from the last month",
                                          url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
                                          copyright: "USGS Earthquakes",
                                          outFields: ["*"],
                                          popupTemplate: {
                                              title: "Magnitude {mag} {type}",
                                              content: "Magnitude {mag} {type} hit {place} on {time}"
                                          },
                                          renderer: {
                                              type: "simple",
                                              field: "mag",
                                              symbol: {
                                                  type: "simple-marker",
                                                  size: 4,
                                                  color: "#69dcff",
                                                  outline: {
                                                      color: "rgba(0, 139, 174, 0.5)",
                                                      width: 5
                                                  }
                                              }
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

                                      const map = new Map({
                                          layers: [baseLayer, layer]
                                      });

                                      const view = new MapView({
                                          container: "viewDiv",
                                          extent: {
                                              spatialReference: {
                                                  wkid: 5936
                                              },
                                              xmin: 1270382,
                                              ymin: -1729511,
                                              xmax: 2461436,
                                              ymax: -953893
                                          },
                                          spatialReference: {
                                              // WGS_1984_EPSG_Alaska_Polar_Stereographic
                                              wkid: 5936
                                          },
                                          constraints: {
                                              minScale: 15469455
                                          },
                                          map: map
                                      });

                                      view.popup.viewModel.includeDefaultActions = false;

                                      view.whenLayerView(layer).then(lv => {
                                          const layerView = lv;
                                          const customContentPromise = new CustomContent({
                                              outFields: ["*"],
                                              creator: (event) => {
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
                                                          featureLi.innerText = `Magnitude ${feature.attributes.mag} ${feature.attributes.type} hit ${feature.attributes.place} on ${feature.attributes.time}`;
                                                          featuresUl.appendChild(featureLi);
                                                      }
                                                      contentDiv.appendChild(featuresUl);
                                                      return contentDiv
                                                  });
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

                                      view.ui.add(
                                          new Home({
                                              view: view
                                          }),
                                          "top-left"
                                      );

                                      const legend = new Legend({
                                          view: view,
                                          container: "legendDiv"
                                      });

                                      const infoDiv = document.getElementById("infoDiv");
                                      view.ui.add(
                                          new Expand({
                                              view: view,
                                              content: infoDiv,
                                              expandIconClass: "esri-icon-layer-list",
                                              expanded: false
                                          }),
                                          "top-left"
                                      );

                         })


                         .catch(err => {
                           console.error(err);
                         });

                         */


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
           this.getDatafromGeoJson();



           this.cdRef.detectChanges();
           }


           getDatafromGeoJson(){

                        fetch("https://d2gv90pkqj.execute-api.us-west-2.amazonaws.com/dev/get-locations")
                            .then(res => res.json())
                            .then((out) => {
                              if(out.errorMessage==undefined){
                                this.loading = false;
                                this.buildmap(out);
                                this.rehacerjson(out.features);
                              }else{
                                setTimeout(() => {
                                   this.counterror = this.counterror + 1;

                                  if(this.counterror < 10){
                                    this.getDatafromGeoJson();
                                  }else{

                                  }

                                 }, 100);
                              }
                             // this.data = out.features;


                        }).catch(err => console.error(err));


           }

           buildmap(json){
             this.jsonmap = json;

              const blob = new Blob([JSON.stringify(json)], {
                type: "application/json"
              });

              // URL reference to the blob
              const urljson = URL.createObjectURL(blob);

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
                    "esri/geometry/geometryEngineAsync",
                    "esri/geometry/support/webMercatorUtils"



              ])
                .then(([Map, FeatureLayer, GeoJSONLayer, MapView, Legend, Expand, Home, CustomContent,GraphicsLayer,Sketch,SketchViewModel,geometryEngineAsync,webMercatorUtils]) => {
                      //    esriConfig.apiKey = "50b,094799d25e425a0d8cab088adbe49960f20e1669d0f65f4366968aeee9bef";
                      const map: __esri.Map = new Map({
                        basemap: 'streets'
                      });

                      let urldirect = window.location.href.replace('/map','')

                      const layer = new GeoJSONLayer({
                           title: "Chasis",
                           url: urljson,
                           outFields: ["*"],
                           popupTemplate: {
                             title: 'Chasis <a href="https://saguz7.github.io/pacific-railway/ppsdetails/{id}" title="{id}">{id}</a>',
                             content: "{id} - {move_type}",
                           }
                       });





                       this.mapView = new MapView({
                         container: this.mapViewEl.nativeElement,
                         center: [-114.8574, 54.6542], // Longitude, latitude
                         zoom: 4, // Zoom level
                         map: map,
                         constraints: {
                           minZoom : 3,
                          },
                       });
                       map.add(layer);


                       this.mapView.popup.viewModel.includeDefaultActions = false;

                       let that = this;

                       this.mapView.on("drag", function(evt) {
                         var initialExtent = that.mapView.extent;
                         const p1 = webMercatorUtils.xyToLngLat(initialExtent.xmin,initialExtent.ymin);
                         const p2 = webMercatorUtils.xyToLngLat(initialExtent.xmax,initialExtent.ymax);
                         if(that.mapView.zoom>6){
                           that.filtersfromzoommap(p1[0],p2[0],p1[1],p2[1]);

                         }else{
                           that.getAllTable();
                         }

                        });


                       this.mapView.watch('scale', function(evt){
                         var initialExtent = that.mapView.extent;
                         const p1 = webMercatorUtils.xyToLngLat(initialExtent.xmin,initialExtent.ymin);
                         const p2 = webMercatorUtils.xyToLngLat(initialExtent.xmax,initialExtent.ymax);
                         if(that.mapView.zoom>6){
                           that.filtersfromzoommap(p1[0].toFixed(2),p2[0].toFixed(2),p1[1].toFixed(2),p2[1].toFixed(2));

                         }else{
                           that.getAllTable();
                         }



                          //document.getElementById('vScale').innerHTML = '1:' + evt.toFixed(2);
                        });

                      // this.mapView.whenLayerView(layer).then(lv => {
                       this.mapView.whenLayerView(layer).then(lv => {
                           const layerView = lv;

                           const customContentPromise = new CustomContent({
                               outFields: ["*"],
                               creator: (event) => {
                                 const query = layer.createQuery();
                                 query.aggregateIds = [event.graphic.getObjectId()];
                                  return layer.queryFeatures(query).then(result => {
                                     const contentDiv = document.createElement("div");
                                     const tbl = document.createElement("table");
                                     let headers = ['Chasis ID','Events','Georeference','PPS Details'];
                                     let headerslabel = ['id','move_type','date','url'];

                                     const tblHeader = document.createElement("thead");
                                     const rowheaders = document.createElement("tr");

                                       for (let i = 0; i < headers.length; i++) {
                                         const cellheader = document.createElement("th");
                                         const cellTextHeader = document.createTextNode(headers[i]);
                                         cellheader.appendChild(cellTextHeader);
                                         rowheaders.appendChild(cellheader);
                                       }

                                       // add the row to the end of the table body
                                       tblHeader.appendChild(rowheaders);


                                      const tblBody = document.createElement("tbody");

                                      // creating all cells
                                      for (const feature of result.features) {
                                        // creates a table row
                                        const row = document.createElement("tr");

                                        for (let j = 0; j < headerslabel.length; j++) {
                                          // Create a <td> element and a text node, make the text
                                          // node the contents of the <td>, and put the <td> at
                                          // the end of the table row
                                           let data = "";
                                           const cell = document.createElement("td");

                                          if(headerslabel[j]=='id' || headerslabel[j]=='move_type' || headerslabel[j]=='date'){
                                            data = feature.attributes[headerslabel[j]];
                                            const cellText = document.createTextNode(data);
                                            cell.appendChild(cellText);

                                          }
                                          if(headerslabel[j]=='url'){
                                            var createA = document.createElement('a');
                                            var createAText = document.createTextNode(`ppsdetails`);
                                            createA.setAttribute('href',   "https://saguz7.github.io/pacific-railway/ppsdetails/" + feature.attributes['id']);
                                            createA.appendChild(createAText);
                                            cell.appendChild(createA);
                                          }
                                           row.appendChild(cell);
                                        }

                                        // add the row to the end of the table body
                                        tblBody.appendChild(row);
                                      }

                                      // put the <tbody> in the <table>
                                      tbl.appendChild(tblHeader);

                                      tbl.appendChild(tblBody);
                                      // appends <table> into <body>
                                      document.body.appendChild(tbl);
                                     /*
                                     const featuresUl = document.createElement("ul");
                                     let featureLi;
                                     for (const feature of result.features) {
                                         featureLi = document.createElement("li");
                                         featureLi.innerText = `Chasis ${feature.attributes.id}`;
                                         featuresUl.appendChild(featureLi);
                                     }
                                     contentDiv.appendChild(featuresUl);

                                     */
                                     contentDiv.appendChild(tbl);

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
                               clusterMinSize: "14px",
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

             this.events= [
               {name: "No Filter", value: "No Filter"}
             ]
             this.georeferences = [
               {name: "No Filter", value: "No Filter"},
               {name: "Bensenville Intermodal Terminal", value: "Bensenville Intermodal Terminal"},
               {name: "Calgary Intermodal Terminal", value: "Calgary Intermodal Terminal"},
               {name: "Edmonton Intermodal Terminal", value: "Edmonton Intermodal Terminal"},
               {name: "Lachine Intermodal Terminal", value: "Lachine Intermodal Terminal"},
               {name: "Regina Intermodal Terminal", value: "Regina Intermodal Terminal"},
               {name: "Schiller Park Intermodal Terminal", value: "Schiller Park Intermodal Terminal"},
               {name: "Saint John Intermodal Terminal", value: "Saint John Intermodal Terminal"},
               {name: "Vaughan Intermodal Terminal", value: "Vaughan Intermodal Terminal"},
               {name: "Vancouver Intermodal Terminal", value: "Vancouver Intermodal Terminal"},
               {name: "Winnipeg Intermodal Terminal", value: "Winnipeg Intermodal Terminal"},

             ];
             for(var i = 0; i < features.length;i++){
               let arr = features[i].properties.move_type.replace('_',' ').split(" ");
               for (var a = 0; a < arr.length; a++) {
                   arr[a] = arr[a].charAt(0).toUpperCase() + arr[a].slice(1);
               }
               const str2 = arr.join(" ");
               const found = this.events.find(element => element.name == str2);
               if(!found){
                 this.events.push({name: str2, value: features[i].properties.move_type});
                // this.georeferences.push({name: str2, value: features[i].properties.move_type});
               }

               this.data.push(
                 {
                   reference: features[i].id,
                    device_id:  features[i].properties.device_id,
                     date: this.formatdate(features[i].properties.date),
                     move_type: features[i].properties.move_type,
                     coordinates: features[i].geometry.coordinates[0] + ',' + features[i].geometry.coordinates[1] ,
                     lat: features[i].geometry.coordinates[0],
                     lon: features[i].geometry.coordinates[1],

                 }
               );

               this.dataGeneral.push(
                 {
                   reference: features[i].id,
                    device_id:  features[i].properties.device_id,
                     date: this.formatdate(features[i].properties.date),
                     move_type: features[i].properties.move_type,
                     coordinates: features[i].geometry.coordinates[0] + ',' + features[i].geometry.coordinates[1] ,
                     lat: features[i].geometry.coordinates[0],
                     lon: features[i].geometry.coordinates[1],
                 }
               );
             }

             console.log(this.data);


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
    this.loading = true;
    console.log($event.event);
    this.data = this.dataGeneral;

     console.log($event.chasis);

     if($event.chasis!=null){
       this.data = this.data.filter(element => element.reference == $event.chasis);
     }else{
       if($event.event!=null){
         this.data = this.data.filter(element => element.move_type == $event.event.value);
       }
       if($event.georeference!=null){
        // this.data = this.data.filter(element => element.georeference == $event.georeference.value);
       }
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

    if($event.event!=null && ($event.event!=null && $event.event.value != 'No Filter')){
       arrayfeacturesfilter = arrayfeacturesfilter.filter(element => element.properties.move_type == $event.event.value);

    }

    if($event.chasis!=null){
      arrayfeacturesfilter = arrayfeacturesfilter.filter(element => element.id == $event.chasis);
    }

    if($event.georeference!=null && ($event.georeference!=null && $event.georeference.value != 'No Filter')){
      arrayfeacturesfilter = arrayfeacturesfilter.filter(element => element.georeference == $event.georeference.value);
    }


    json.features = arrayfeacturesfilter;
    console.log(json);
    setTimeout(() => {
      this.loading = false;

      this.buildmap(json);
    }, 100);

   }

   getCenter(event){
     console.log(event);
     console.log(event.coordinates);

     let coordinates = event.coordinates.split(',');
     console.log(coordinates);
     document.getElementById("esri-view").focus();
     this.mapView.goTo({
      center: [parseInt(coordinates[0]), parseInt(coordinates[1])]
    })
    .catch(function(error) {
      if (error.name != "AbortError") {
         console.error(error);
      }
    });
   }


  getAllTable(){
    this.data = this.dataGeneral;

  }


   filtersfromzoommap(x1,x2,y1,y2){
     this.data = this.dataGeneral;
     let datafilter = [];
     for(var i = 0; i < this.dataGeneral.length;i++){
       if(x1 < this.dataGeneral[i].lat && x2 > this.dataGeneral[i].lat && y1 < this.dataGeneral[i].lon && y2 > this.dataGeneral[i].lon){
         datafilter.push(this.dataGeneral[i]);
       }

     }

     this.data = datafilter;
     //this.data = this.data.filter(element => x1 < element.lon && x2 > element.lon &&   y1 < element.lat && y2 > element.lat);

  //   console.log(this.data);
   }



}
