import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { ActivatedRoute,Router } from '@angular/router';
import { loadModules } from 'esri-loader';
import { MapStateService } from '../../../core/services/map-state/map-state.service';

@Component({
  selector: 'app-pps-details',
  templateUrl: './pps-details.component.html',
  styleUrls: ['./pps-details.component.css']
})
export class PpsDetailsComponent implements OnInit {
  public mapView: __esri.MapView;
  private sub: Subscription = new Subscription();

  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,

   ) { }


  ngOnInit() {
    let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");

    console.log(chasis);
 
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
          center: [-97.157, 49.912], // Longitude, latitude
          zoom: 13, // Zoom level
          map: map
        });

      })
      .catch(err => {
        console.error(err);
      });
  }

  ngAfterViewInit() {
  }

}
