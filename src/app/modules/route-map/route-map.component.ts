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
       "esri/layers/GeoJSONLayer",
       "esri/widgets/Sketch",
       "esri/widgets/Sketch/SketchViewModel",
       'esri/Map',
       "esri/layers/GraphicsLayer",
       'esri/views/MapView',
       'esri/Graphic',
       "esri/geometry/geometryEngineAsync"

     ])
       .then(([GeoJSONLayer,Sketch,SketchViewModel,Map,GraphicsLayer, MapView, Graphic,geometryEngineAsync]) => {
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
             url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
             copyright: "USGS Earthquakes",
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
             console.log(geometries.toArray());

             const queryGeometry = await geometryEngineAsync.union(geometries.toArray());
             console.log(queryGeometry);
            // selectFeatures(queryGeometry);
           }
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

      })
      .catch(err => {
        console.error(err);
      });
    }

  ngAfterViewInit() {
  }

}
*/
