import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';
 import { MapStateService } from '../../core/services/map-state/map-state.service';

import { loadModules } from 'esri-loader';
import { Router } from '@angular/router';

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

  //  map: Map;

  public mapView: __esri.MapView;
  private sub: Subscription = new Subscription();
  public href: string = "";
  public currentURL: string = "";
  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(
    private router : Router,
    private CFR?: ComponentFactoryResolver,
    private cdref?: ChangeDetectorRef,
    private msService?: MapStateService
   ) { }


   ngOnInit() {

             this.href = this.router.url;
            this.currentURL = window.location.href.replace(this.href,'');
             console.log(this.href);
             console.log(this.currentURL);

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
           content: "This cluster represents {cluster_count} chasis.",
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
           center: [-118.805, 34.027], // Longitude, latitude
           zoom: 13, // Zoom level
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


              this.mapView.popup.open({
                  // Set the popup's title to the coordinates of the clicked location
                  title: "Reverse geocode: [" + lon + ", " + lat + "]",
                  location: event.mapPoint // Set the location of the popup to the clicked location
              });

               }
           });
        });

       })


       .catch(err => {
         console.error(err);
       });

     }


     ngAfterViewInit() {
     }

}

/*
import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';
 import { MapStateService } from '../../core/services/map-state/map-state.service';

import { loadModules } from 'esri-loader';


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

  //  map: Map;

  public mapView: __esri.MapView;
  private sub: Subscription = new Subscription();

  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(
    private CFR?: ComponentFactoryResolver,
    private cdref?: ChangeDetectorRef,
    private msService?: MapStateService
   ) { }


  ngOnInit() {

    return loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/CSVLayer",
      "esri/layers/FeatureLayer",
      "esri/layers/GraphicsLayer",
      "esri/widgets/Sketch/SketchViewModel",
      "esri/Graphic",
      "esri/widgets/FeatureTable",
      "esri/Basemap",
      "esri/geometry/geometryEngineAsync"
    ])
      .then(([Map,
      MapView,
      CSVLayer,
      FeatureLayer,
      GraphicsLayer,
      SketchViewModel,
      Graphic,
      FeatureTable, Basemap, geometryEngineAsync]) => {

        const states = new FeatureLayer({
          url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/SampleWorldCities/MapServer",
          renderer: {
            type: "simple",
            symbol: {
              type: "simple-fill",
              color: "#f0ebe4",
              outline:{
                color: "#DCDCDC",
                width: "0.5px"
              }
            }
          },
        });

        // national parks csv layer
        const csvLayer = new CSVLayer({
          url: "https://ubatsukh.github.io/arcgis-js-api-demos/devsummit2021/csvLayer-nps/data/nps_establishments.csv",
          delimiter: ",",
          popupTemplate: {
            title: "{unit_name}",
            content:
              "Established on <b>{date_est}</b> <br/><br/> {description}"
          },
          renderer: setRenderer()
        });

        let csvLayerView;
        csvLayer.when(() => {
          this.mapView.whenLayerView(csvLayer).then(function (layerView) {
            csvLayerView = layerView;
          });
        })
        .catch(errorCallback);

            //    esriConfig.apiKey = "50b,094799d25e425a0d8cab088adbe49960f20e1669d0f65f4366968aeee9bef";
        const map: __esri.Map = new Map({
          basemap: new Basemap({
            baseLayers: [states]
          }),
          layers: [csvLayer]
        });

<<<<<<< HEAD
        const clusterConfig = {
        type: "cluster",
        clusterRadius: "100px",
        // {cluster_count} is an aggregate field containing
        // the number of features comprised by the cluster

        popupTemplate: {

          title: "Cluster summary",
          content: "This cluster represents {cluster_count} chasis.",
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
            color: "black",
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
            url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
            copyright: "USGS Earthquakes",
            featureReduction: clusterConfig,
          });
        map.add(geojsonlayer);
        console.log(map);

        this.mapView = new MapView({
          container: this.mapViewEl.nativeElement,
          center: [-118.805, 34.027], // Longitude, latitude
          zoom: 13, // Zoom level
          map: map
        });
        const graphicsLayer = new GraphicsLayer();
        this.mapView.when(() => {
        const sketch = new Sketch({
          layer: graphicsLayer,
          view: this.mapView,
          // graphic will be selected as soon as it is created
        //  creationMode: "update"
        });

        this.mapView.ui.add(sketch, "top-right");
      });
      let that = this;

        const evento = this.mapView.when(
          () => {
            const points = this.msService.getPoints();
            console.log('first load', points);
            this.sub = points.subscribe(value => {
              console.log(value);

              if(value.length) {
                console.log(value);

                this.mapView.graphics.addMany(value);
                this.sub.unsubscribe(); // we only want this once
              }
            })
          },
          (err) => {
            console.error(err);
          }
        ).then((layerView) => {
          this.mapView.on("pointer-move", eventHandler);
          this.mapView.on("pointer-down", eventHandler);

          function eventHandler(event) {
            console.log(event);
          }

        });

=======

        this.mapView = new MapView({
          container: this.mapViewEl.nativeElement,
          map: map,
          extent: {
            type: "extent",
            spatialReference: {
              wkid: 102003
            },
            xmax: 2275062,
            xmin: -2752064,
            ymax: 1676207,
            ymin: -1348080,
          },
          constraints: {
            snapToZoom: false,
            minScale: 50465153
          },
          spatialReference: {
            wkid: 102003
          },
          background: {
            color: "white"
          }
        });


                // create a new instance of a FeatureTable
                const featureTable = new FeatureTable({
                  view: this.mapView,
                  layer: csvLayer,
                  highlightOnRowSelectEnabled: false,
                  fieldConfigs: [
                    {
                      name: "unit_name",
                      label: "Name"
                    },
                    {
                      name: "state",
                      label: "State"
                    },
                    {
                      name: "region",
                      label: "Region"
                    },
                    {
                      name: "unit_type",
                      label: "Type"
                    },
                    {
                      name: "created_by",
                      label: "Created by"
                    },
                    {
                      name: "date_est",
                      label: "Established date"
                    },
                    {
                      name: "description",
                      label: "Description"
                    },
                      {
                      name: "caption",
                      label: "Caption"
                    }
                  ],
                  container: document.getElementById("tableDiv")
                });

                // this array will keep track of selected feature objectIds to
                // sync the layerview feature effects and feature table selection
                let features = [];


                // Listen for the table's selection-change event
                featureTable.on("selection-change", (changes) => {
                  // if the feature is unselected then remove the objectId
                  // of the removed feature from the features array
                  changes.removed.forEach((item) => {
                    const data = features.find((data) => {
                      return data === item.objectId;
                    });
                    if (data) {
                      features.splice(features.indexOf(data), 1);
                    }
                  });

                  // If the selection is added, push all added selections to array
                  changes.added.forEach((item) => {
                    features.push(item.objectId);
                  });

                  // set excluded effect on the features that are not selected in the table
                  csvLayerView.featureEffect = {
                    filter: {
                      objectIds: features
                    },
                    excludedEffect: "blur(5px) grayscale(90%) opacity(40%)"
                  };
                });


                // polygonGraphicsLayer will be used by the sketchviewmodel
                // show the polygon being drawn on the view
                const polygonGraphicsLayer = new GraphicsLayer();
                map.add(polygonGraphicsLayer);

                // add the select by rectangle button the view
                this.mapView.ui.add("select-by-rectangle", "top-left");
                const selectButton = document.getElementById("select-by-rectangle");


                // click event for the select by rectangle button
                selectButton.addEventListener("click", () => {
                  this.mapView.popup.close();
                  sketchViewModel.create("rectangle");
                });


                // add the clear selection button the view
                this.mapView.ui.add("clear-selection", "top-left");
                document.getElementById("clear-selection").addEventListener("click", () => {
                  featureTable.clearSelection();
                  featureTable.filterGeometry = null;
                  polygonGraphicsLayer.removeAll();
                });

                // create a new sketch view model set its layer
                const sketchViewModel = new SketchViewModel({
                  view: this.mapView,
                  layer: polygonGraphicsLayer
                });


                // Once user is done drawing a rectangle on the map
                // use the rectangle to select features on the map and table
                sketchViewModel.on("create", async (event) => {
                  if (event.state === "complete") {
                    // this polygon will be used to query features that intersect it
                    const geometries = polygonGraphicsLayer.graphics.map(function(graphic){
                      return graphic.geometry
                    });
                    const queryGeometry = await geometryEngineAsync.union(geometries.toArray());
                    selectFeatures(queryGeometry);
                  }
                });

                // This function is called when user completes drawing a rectangle
                // on the map. Use the rectangle to select features in the layer and table
                function selectFeatures(geometry) {
                  if (csvLayerView) {
                    // create a query and set its geometry parameter to the
                    // rectangle that was drawn on the view
                    const query = {
                      geometry: geometry,
                      outFields: ["*"]
                    };

                    // query graphics from the csv layer view. Geometry set for the query
                    // can be polygon for point features and only intersecting geometries are returned
                    csvLayerView.queryFeatures(query)
                      .then((results) => {
                        if (results.features.length === 0) {
                        //  clearSelection();
                        } else {
                          // pass in the query results to the table by calling its selectRows method.
                          // This will trigger FeatureTable's selection-change event
                          // where we will be setting the feature effect on the csv layer view
                          featureTable.filterGeometry = geometry;
                          featureTable.selectRows(results.features);
                        }
                      })
                      .catch(errorCallback);
                  }
                }


                function errorCallback(error) {
                  console.log("error happened:", error.message);
                }

                // this is called from CSVLayer constructor
                // tree CIM symbol
                function setRenderer(){
                  return {
                      type: "simple",
                      symbol: {
                        type: "cim",
                        data: {
                          type: "CIMSymbolReference",
                          symbol: {
                            type: "CIMPointSymbol",
                            symbolLayers: [
                              {
                                type: "CIMVectorMarker",
                                enable: true,
                                anchorPointUnits: "Relative",
                                dominantSizeAxis3D: "Y",
                                size: 15.75,
                                billboardMode3D: "FaceNearPlane",
                                frame: {
                                  xmin: 0,
                                  ymin: 0,
                                  xmax: 21,
                                  ymax: 21
                                },
                                markerGraphics: [
                                  {
                                    type: "CIMMarkerGraphic",
                                    geometry: {
                                      rings: [
                                        [
                                          [15, 15],
                                          [12, 15],
                                          [16, 10],
                                          [13, 10],
                                          [17, 5],
                                          [11, 5],
                                          [11, 2],
                                          [10, 2],
                                          [10, 5],
                                          [4, 5],
                                          [8, 10],
                                          [5, 10],
                                          [9, 15],
                                          [6, 15],
                                          [10.5, 19],
                                          [15, 15]
                                        ]
                                      ]
                                    },
                                    symbol: {
                                      type: "CIMPolygonSymbol",
                                      symbolLayers: [
                                        {
                                          type: "CIMSolidStroke",
                                          enable: true,
                                          capStyle: "Round",
                                          joinStyle: "Round",
                                          lineStyle3D: "Strip",
                                          miterLimit: 10,
                                          width: 0,
                                          color: [0, 0, 0, 255]
                                        },
                                        {
                                          type: "CIMSolidFill",
                                          enable: true,
                                          color: [0, 160, 0, 255]
                                        }
                                      ]
                                    }
                                  }
                                ],
                                scaleSymbolsProportionally: true,
                                respectFrame: true
                              },
                              {
                                type: "CIMVectorMarker",
                                enable: true,
                                colorLocked: true,
                                anchorPointUnits: "Relative",
                                dominantSizeAxis3D: "Y",
                                size: 8,
                                billboardMode3D: "FaceNearPlane",
                                frame: {
                                  xmin: -5,
                                  ymin: -5,
                                  xmax: 5,
                                  ymax: 5
                                },
                                markerGraphics: [
                                  {
                                    type: "CIMMarkerGraphic",
                                    geometry: {
                                      rings: [
                                        [
                                          [0, 5],
                                          [0.87, 4.92],
                                          [1.71, 4.7],
                                          [2.5, 4.33],
                                          [3.21, 3.83],
                                          [3.83, 3.21],
                                          [4.33, 2.5],
                                          [4.7, 1.71],
                                          [4.92, 0.87],
                                          [5, 0],
                                          [4.92, -0.87],
                                          [4.7, -1.71],
                                          [4.33, -2.5],
                                          [3.83, -3.21],
                                          [3.21, -3.83],
                                          [2.5, -4.33],
                                          [1.71, -4.7],
                                          [0.87, -4.92],
                                          [0, -5],
                                          [-0.87, -4.92],
                                          [-1.71, -4.7],
                                          [-2.5, -4.33],
                                          [-3.21, -3.83],
                                          [-3.83, -3.21],
                                          [-4.33, -2.5],
                                          [-4.7, -1.71],
                                          [-4.92, -0.87],
                                          [-5, 0],
                                          [-4.92, 0.87],
                                          [-4.7, 1.71],
                                          [-4.33, 2.5],
                                          [-3.83, 3.21],
                                          [-3.21, 3.83],
                                          [-2.5, 4.33],
                                          [-1.71, 4.7],
                                          [-0.87, 4.92],
                                          [0, 5]
                                        ]
                                      ]
                                    },
                                    symbol: {
                                      type: "CIMPolygonSymbol",
                                      symbolLayers: [
                                        {
                                          type: "CIMSolidStroke",
                                          enable: true,
                                          capStyle: "Round",
                                          joinStyle: "Round",
                                          lineStyle3D: "Strip",
                                          miterLimit: 10,
                                          width: 0.5,
                                          color: [167, 169, 172, 255]
                                        },
                                        {
                                          type: "CIMSolidFill",
                                          enable: true,
                                          color: [255, 255, 255, 255]
                                        }
                                      ]
                                    }
                                  }
                                ],
                                scaleSymbolsProportionally: true,
                                respectFrame: true
                              }
                            ],
                            haloSize: 1,
                            scaleX: 1,
                            angleAlignment: "Display"
                          }
                        }
                      }
                    }
                }

>>>>>>> c3308d5cdfe91370d6cbc5fd40dac253505602f5
      })
      .catch(err => {
        console.error(err);
      });

      this.mapView.on("click", function(event){
        // event is the event handle returned after the event fires.
        console.log(event.mapPoint);
      });
    }

  ngAfterViewInit() {
  }

}


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
                   console.log('Hola');

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

*/
