import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { MapDivComponent } from './mapdiv/mapdiv.component';
import { MapStateService } from '../../core/services/map-state/map-state.service';

import { loadModules } from 'esri-loader';


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
        const graphicsLayer = new GraphicsLayer();
        this.mapView.when(() => {
        const sketch = new Sketch({
          layer: graphicsLayer,
          view: this.mapView,
          // graphic will be selected as soon as it is created
          creationMode: "update"
        });

        this.mapView.ui.add(sketch, "top-right");
      });

        this.mapView.when(
          () => {
            const points = this.msService.getPoints();
            console.log('first load', points);
            this.sub = points.subscribe(value => {
              if(value.length) {
                this.mapView.graphics.addMany(value);
                this.sub.unsubscribe(); // we only want this once
              }
            })
          },
          (err) => {
            console.error(err);
          }
        );

        let that = this;

        this.mapView.on("click", function (evt) {
        // Create a graphic and add the geometry and symbol to it
        var graphic = new Graphic({
          geometry: {
            type: "point",
            latitude: evt.mapPoint.latitude,
            longitude: evt.mapPoint.longitude,
            spatialReference: that.mapView.spatialReference,
          },
          symbol: {
            type: "simple-marker", // autocasts as new SimpleFillSymbol
            color: [255, 10, 10],
            outline: {
              // autocasts as new SimpleLineSymbol()
              color: [255, 255, 255],
              width: 2,
            },
          },
        });
        that.mapView.graphics.removeAll();
        that.mapView.graphics.add(graphic);
        });
        /*

        this.mapView.on('click', (event: __esri.MapViewClickEvent) => {
          const pointGraphic: that.__esri.Graphic = new Graphic({
            attributes: {
              time: new Date().getTime()
            },
            geometry: {
              type: 'point',
              longitude: event.mapPoint.longitude,
              latitude: event.mapPoint.latitude,
              spatialReference: event.mapPoint.spatialReference
            },
            symbol: {
              type: 'simple-marker',
              color: [119, 40, 119],
              outline: {
                color: [255, 255, 255],
                width: 1
              }
            }
          });

          this.mapView.graphics.add(pointGraphic);
          this.msService.addPoint(pointGraphic);
        });

        */

      })
      .catch(err => {
        console.error(err);
      });
    }

  ngAfterViewInit() {
  }

}
