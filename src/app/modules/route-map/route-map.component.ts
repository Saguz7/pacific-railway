import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';
 import { MapStateService } from '../../core/services/map-state/map-state.service';

import { loadModules } from 'esri-loader';
 import { ActivatedRoute,Router } from '@angular/router';
 import { HttpClient, HttpHeaders } from '@angular/common/http';

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


  datefrom: Date;
  timefrom: Date;

  dateto: Date;
  timeto: Date;

  historicalpoints = [];
  validatedDates: boolean = true;

  //  map: Map;

  public mapView: __esri.MapView;
  private sub: Subscription = new Subscription();
  public href: string = "";
  public currentURL: string = "";
   // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(
    private router : Router,
    private activatedRoute: ActivatedRoute,
    private CFR?: ComponentFactoryResolver,
    private cdref?: ChangeDetectorRef,
    private msService?: MapStateService,
    private http?: HttpClient,

   ) { }


   ngOnInit() {

     this.historicalpoints= [];

             this.href = this.router.url;
            this.currentURL = window.location.href.replace(this.href,'');
             console.log(this.href);
             console.log(this.currentURL);


             let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");

/*
             this.datefrom = new Date();
             this.timefrom = new Date(this.datefrom.getFullYear(), this.datefrom.getMonth(), this.datefrom.getDate(), 0, 0, 0);

             this.dateto = new Date();
             this.timeto = new Date(this.dateto.getFullYear(), this.dateto.getMonth(), this.dateto.getDate(), 0, 0, 0);

             */

             this.datefrom = new Date(2022,1,1);
             this.timefrom = new Date(this.datefrom.getFullYear(), this.datefrom.getMonth(), this.datefrom.getDate(), 0, 0, 0);

             this.dateto = new Date(2022,1,28);
             this.timeto = new Date(this.dateto.getFullYear(), this.dateto.getMonth(), this.dateto.getDate(), 0, 0, 0);
             let dateToSend =  this.convertDatetoString(this.datefrom);
             let fromToSend =  this.convertDatetoString(this.dateto);
             let obj_send = {
               id: chasis,
               initial_date: dateToSend,
               final_date: fromToSend
             }
             console.log(dateToSend);
             console.log(fromToSend);

                          console.log();

                          this.http.post<any>('https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/chassis-history', {body:{data:obj_send}}).subscribe(data => {
                            let results = JSON.parse(data.body);
                            console.log(results);
                        })

             /*
             this.http.post<any>('https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/get-chassis', {body:{data:{id: chasis,initial_date: , final_date: }}}).subscribe(data => {
               let array = JSON.parse(data.body);
               if(array.length>0){
                 this.properties = array[0];
               }
           })

           */
             /*

             fetch("https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/chassis-history")
             .then(res => res.json())
             .then((out) => {

               console.log(out);
               if(out.errorMessage==undefined){
                 this.loading = false;
                 this.buildmap(out);
                 this.rehacerjson(out.features);
               }else{
                 setTimeout(() => {
                   this.counterror = this.counterror + 1;
                   if(this.counterror < 10){
                     this.getDatafromGeoJson();
                   }
                 }, 100);
               }
             }).catch(err => console.error(err));

             */

             /*


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
                   center: ["-112.794721","49.725848"], //Longitude, latitude
                   zoom: 13,
                 });


                 const graphicsLayer = new GraphicsLayer();
                  map.add(graphicsLayer);

                  this.historicalpoints = [
                  {num:1, lat: "49.725848", lon: "-112.794721"},
                   {num:2,lat: "49.7", lon: "-112.779"},
                   {num:3,lat: "49.756", lon: "-112.288"},
                   {num:4,lat: "49.873", lon: "-110.918"},
                   {num:5,lat: "50.036", lon: "-110.687"}
                  ]

                  for(var i = 0; i < this.historicalpoints.length;i++){
                    const point = { //Create a point
                       type: "point",
                       longitude: this.historicalpoints[i].lon,
                       latitude: this.historicalpoints[i].lat
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
                       attributes: {
                        // used to define the text string in the symbol
                         text: this.historicalpoints[i].num,
                       },
                       symbol: simpleMarkerSymbol
                    });
                    graphicsLayer.add(pointGraphic);
                  }
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
                       });
                    }

                 });



               })
               .catch(err => {
                 console.error(err);
               });


               */

     }

     searchForDates(){


       let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");


       let dateToSend =  this.convertDatetoString(this.datefrom) + 'T' + this.timefrom + '.000';
       let fromToSend =  this.convertDatetoString(this.dateto) + 'T' + this.timeto + '.000';
       let obj_send = {
         id: chasis,
         initial_date: dateToSend,
         final_date: fromToSend
       }
       console.log(dateToSend);
       console.log(fromToSend);

                    console.log();

                    this.http.post<any>('https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/chassis-history', {body:{data:obj_send}}).subscribe(data => {
                      let results = JSON.parse(data.body);
                      console.log(results);
                  })

                  this.buildmap();

     }

     buildmap(){

                    return loadModules([
                      "esri/layers/GeoJSONLayer",
                      "esri/widgets/Sketch",
                      'esri/Map',
                      "esri/layers/GraphicsLayer",
                      'esri/views/MapView',
                      'esri/Graphic',
                      'esri/symbols/TextSymbol'
                    ])
                      .then(([GeoJSONLayer,Sketch,Map,GraphicsLayer, MapView, Graphic,TextSymbol]) => {
                            //    esriConfig.apiKey = "50b,094799d25e425a0d8cab088adbe49960f20e1669d0f65f4366968aeee9bef";
                        const map: __esri.Map = new Map({
                          basemap: 'streets'
                        });



                        this.mapView = new MapView({
                          container: this.mapViewEl.nativeElement,
                          map: map,
                          center: ["-112.794721","49.725848"], //Longitude, latitude
                          zoom: 13,
                        });


                        const graphicsLayer = new GraphicsLayer();
                         map.add(graphicsLayer);

                         this.historicalpoints = [
                         {num:1, lat: "49.725848", lon: "-112.794721"},
                          {num:2,lat: "49.7", lon: "-112.779"},
                          {num:3,lat: "49.756", lon: "-112.288"},
                          {num:4,lat: "49.873", lon: "-110.918"},
                          {num:5,lat: "50.036", lon: "-110.687"}
                         ]

                         for(var i = 0; i < this.historicalpoints.length;i++){
                           const point = { //Create a point
                              type: "point",
                              longitude: this.historicalpoints[i].lon,
                              latitude: this.historicalpoints[i].lat
                           };
                           const simpleMarkerSymbol = {
                              type: "simple-marker",
                               size: "25px",
                                      text: this.historicalpoints[i].num,
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


                           var textSymbol = new TextSymbol({
                            color: "black",
                            haloColor: "black",
                            haloSize: "1px",
                            text: this.historicalpoints[i].num,
                            xoffset: 0,
                            yoffset: -5,
                            font: {  // autocast as esri/symbols/Font
                              size: 12,
                              family: "sans-serif"
                            }
                          });

                          const pointGraphicText = new Graphic({
                             geometry: point,
                             symbol: textSymbol
                          });


                           graphicsLayer.add(pointGraphic);
                           graphicsLayer.add(pointGraphicText);

                         }


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
                              });
                           }

                        });



                      })
                      .catch(err => {
                        console.error(err);
                      });
     }

     convertDatetoString(date: any) {

       console.log(date);

       let day= "";
       let year = date.getFullYear().toString();
       let month = "";

       if ((date.getMonth() + 1) < 10) {
         month = "0" + (date.getMonth() + 1).toString();
       } else {
         month = (date.getMonth() + 1).toString();
       }
       if ((date.getDate() + 1) <= 10) {
         day = "0" + (date.getDate()).toString();
       } else {
         day = (date.getDate()).toString();
       }

       return year + "-" + month + "-" + day;

     }

     validate(){
       console.log(this.datefrom);
       console.log(this.timefrom);
       console.log(this.dateto);
       console.log(this.timeto);

       //             let dateauxfrom = new Date(this.datefrom.getFullYear(), this.datefrom.getMonth(), this.datefrom.getDate(), 0, 0, 0);
     }



     ngAfterViewInit() {
     }

     centermap($event){
       document.getElementById("esri-view").focus();

        this.mapView.goTo({
        center: [parseInt($event.lon), parseInt($event.lat)],zoom:12
      })
      .catch(function(error) {
        if (error.name != "AbortError") {
           console.error(error);
        }
      });
       console.log($event);
     }

}
