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
  chasis: any;
  lon: any;
  lat: any;
  date: any;
  event: any;
  loading: boolean = false;
  counterror: any;

  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(
    private cdRef : ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,

   ) { }


  ngOnInit() {
    this.counterror = 0;
    let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");

    console.log(chasis);


  }

  ngAfterViewInit() {

    this.loading = true;
    this.getDatafromGeoJson();

/*
    fetch("https://d2gv90pkqj.execute-api.us-west-2.amazonaws.com/dev/get-locations")
        .then(res => res.json())
        .then((out) => {
          this.makefromjson(out);
    }).catch(err => console.error(err));

    */

    this.cdRef.detectChanges();

   }

   getDatafromGeoJson(){

                fetch("https://d2gv90pkqj.execute-api.us-west-2.amazonaws.com/dev/get-locations")
                    .then(res => res.json())
                    .then((out) => {
                      if(out.errorMessage==undefined){
                        this.loading = false;
                        this.makefromjson(out);

                      }else{
                        setTimeout(() => {
                           this.counterror = this.counterror + 1;
                           console.log(this.counterror);

                          if(this.counterror < 10){
                            this.getDatafromGeoJson();
                          }else{
                            console.log('Entra aqui');

                          }

                         }, 100);
                      }
                     // this.data = out.features;


                }).catch(err => console.error(err));


   }

  makefromjson(json){
    console.log(json);
    let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");
    let arrayfeacturesfilter = json.features;
    arrayfeacturesfilter = arrayfeacturesfilter.filter(element => element.id == chasis);
    json.features = arrayfeacturesfilter;
    setTimeout(() => {
      this.buildmap(json);
    }, 100);

  }

  buildmap(json){
    console.log(json);
    this.chasis = this.activatedRoute.snapshot.paramMap.get("chasis");
    if(json!=undefined){
      console.log(json.features);
      this.loading = false;

      if(json.features!=undefined && (json.features!=undefined && json.features.length>0)){
        this.lon = json.features[0].geometry.coordinates[1];
        this.lat = json.features[0].geometry.coordinates[0];
        let lat = json.features[0].geometry.coordinates[0];
        let lon = json.features[0].geometry.coordinates[1];
        this.date = this.formatdatehours(json.features[0].properties.date);
        this.event = json.features[0].properties.move_type;

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
              map: map,
              center: [this.lat,this.lon], //Longitude, latitude
              zoom: 13,
            });


            const graphicsLayer = new GraphicsLayer();
             map.add(graphicsLayer);

             const point = { //Create a point
                type: "point",
                longitude: this.lat,
                latitude: this.lon
             };
             const simpleMarkerSymbol = {
                type: "simple-marker",
                color: [226, 119, 40],  // Orange
                outline: {
                    color: [255, 255, 255], // White
                    width: 1
                }
             };

             const pointGraphic = new Graphic({
                geometry: point,
                symbol: simpleMarkerSymbol
             });
             graphicsLayer.add(pointGraphic);


          })
          .catch(err => {
            console.error(err);
          });
      }
    }


  }

  formatdatehours(date){
    let dateformat = date.split(' ');
    let hourformat = dateformat[1].split('.');
    console.log(hourformat);

    console.log(dateformat);
    return dateformat[0] + ' ' + hourformat[0];

  }


}
