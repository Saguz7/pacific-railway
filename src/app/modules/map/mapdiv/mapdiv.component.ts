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


      const layer = new GeoJSONLayer({
        title: "Earthquakes from the last month",
        url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson",
        copyright: "USGS Earthquakes",

        featureReduction: clusterConfig,

        // popupTemplates can still be viewed on
        // individual features
        popupTemplate: {
          title: "Magnitude {mag} {type}",
          content: "Magnitude {mag} {type} hit {place} on {time}",
          fieldInfos: [
            {
              fieldName: "time",
              format: {
                dateFormat: "short-date-short-time"
              }
            }
          ]
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

      // background layer for geographic context
      // projected to Alaska Polar Stereographic
      const baseLayer = new FeatureLayer({
        portalItem: {
          id: "2b93b06dc0dc4e809d3c8db5cb96ba69"
        },
        legendEnabled: false,
        outFields: ["*"],
          popupTemplate: {
            title: "city",
            content: popupListContent
          },
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

      function popupListContent(feature) {
  const tableContent = document.createElement("table");
  tableContent.classList.add('tablelayout');
  tableContent.classList.add('esri-widget__table');
  let infoTamplateData = "";
  let object = feature.graphic.attributes;
  console.log(feature.graphic);
  const fieldArr = [];
  if (feature.graphic.layer && feature.graphic.layer.fields) {
    feature.graphic.layer.fields.forEach(element => {
      // check if the feature has values
      if (feature.graphic.attributes[element.name] && feature.graphic.attributes[element.name] !== null){
        fieldArr.push(element.name);
       }
    });
   }
   fieldArr.forEach((f) => {
   infoTamplateData += "<tr label= " + f + "><th class='esri-feature__field-header' >" +
   f + " </th><td class='esri-feature__field-data'>" + object[f] + "</td> </tr>";
   });
   tableContent.innerHTML = infoTamplateData;
   return tableContent;
}

      const map: __esri.Map = new Map({
        layers: [baseLayer, layer]
      });

      this.mapView = new MapView({
        container: this.mapViewEl.nativeElement,
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

      this.mapView.ui.add(new Home({
        view: this.mapView
      }), "top-left");

      const legend = new Legend({
        view: this.mapView,
        container: "legendDiv"
      });

      const infoDiv = document.getElementById("infoDiv");
      this.mapView.ui.add(new Expand({
        view: this.mapView,
        content: infoDiv,
        expandIconClass: "esri-icon-layer-list",
        expanded: false
      }), "top-left");
    })


    .catch(err => {
      console.error(err);
    });


  }


  ngOnInit() {



  }

}
