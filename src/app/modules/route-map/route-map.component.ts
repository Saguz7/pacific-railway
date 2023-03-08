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
  events = [];
  georeferences = [];


  datefrom: Date;
  timefrom: Date;

  dateto: Date = new Date();
  timeto: Date = new Date();

  historicalpoints = [];
  validatedDates: boolean = true;
  loading: boolean = false;
  chasis: any;

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

             let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");
             this.chasis = this.activatedRoute.snapshot.paramMap.get("chasis");

/*
             this.datefrom = new Date();
             this.timefrom = new Date(this.datefrom.getFullYear(), this.datefrom.getMonth(), this.datefrom.getDate(), 0, 0, 0);

             this.dateto = new Date();
             this.timeto = new Date(this.dateto.getFullYear(), this.dateto.getMonth(), this.dateto.getDate(), 0, 0, 0);

             */

             this.datefrom = new Date(2023,1,6);
             this.timefrom = new Date(this.datefrom.getFullYear(), this.datefrom.getMonth(), this.datefrom.getDate(), 0, 0, 0);

             this.dateto = new Date(2023,1,10);
             this.timeto = new Date(this.dateto.getFullYear(), this.dateto.getMonth(), this.dateto.getDate(), 0, 0, 0);
             let dateToSend =  this.convertDatetoString(this.datefrom);
             let fromToSend =  this.convertDatetoString(this.dateto);
             let obj_send = {
               id: chasis,
              // initial_date: dateToSend,
              // final_date: fromToSend
             }
                          this.http.post<any>('https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/chassis-history', {body:{data:obj_send}}).subscribe(data => {


                            /*
                            console.log(typeof data);
                            console.log(data.body);
                            let results = JSON.parse(data.body);
                            console.log(results);
                            console.log(typeof results);

                            */

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

       this.loading = true;

       let timefromstring = '00:00:00'
       let timetostring = '00:00:00'
       if(typeof this.timefrom != 'object'){
         timefromstring = this.timefrom + ':00'
       }
       if(typeof this.timeto != 'object'){
         timetostring = this.timeto+ ':00'

       }


       let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");


       let dateToSend =  this.convertDatetoString(this.datefrom) + 'T' + timefromstring ;
       let fromToSend =  this.convertDatetoString(this.dateto) + 'T' + timetostring ;
       let obj_send = {
         id: chasis,
         initial_date: dateToSend,
         final_date: fromToSend
       }
                    this.http.post<any>('https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/chassis-history', {body:{data:obj_send}}).subscribe(data => {
                      this.buildmap(data.body.features);
                  })

              //    this.buildmap();

     }

     buildmap(features){

       this.events= [
         {name: "No Filter", value: "No Filter"}
       ]
       this.georeferences = [
         {name: "No Filter", value: "No Filter"},
         {name: "Bensenville Intermodal Terminal", value: "e6468692-50cf-46a1-bac7-5c1baeb4749d"},
         {name: "Calgary Intermodal Terminal", value: "7f8d3475-8f79-4936-b4e3-efe71913d254"},
         {name: "Edmonton Intermodal Terminal", value: "3346e7dc-0e31-4d17-9805-380baf1d9772"},
         {name: "Lachine Intermodal Terminal", value: "9d23cf32-2fb1-4e39-a326-9c332fc12c58"},
         {name: "Regina Intermodal Terminal", value: "0a369dbc-d048-4bf8-91dd-92cd5a47e00b"},
         {name: "Schiller Park Intermodal Terminal", value: "87ca9217-cb63-410c-bd04-62318cdd56cf"},
         {name: "Saint John Intermodal Terminal", value: "0dafa1ee-b472-4cb0-a615-70dbcb9ded1c"},
         {name: "Vaughan Intermodal Terminal", value: "744883a4-2e52-4f7a-95e5-4f76bed45f2d"},
         {name: "Vancouver Intermodal Terminal", value: "445f7608-2c14-41e8-be80-0c4ad6dadffb"},
         {name: "Winnipeg Intermodal Terminal", value: "156c6c75-fdb1-45d2-94c0-8c0791bd2da6"},
         //{name: "Big Calgary Circle", value: "Big Calgary Circle"}

       ];

       this.historicalpoints = [];
       let reference_move_stop;

       for(var i = 0; i < features.length;i++){

         let arr = features[i].properties.move_type.replace('_',' ').split(" ");
         for (var a = 0; a < arr.length; a++) {
             arr[a] = arr[a].charAt(0).toUpperCase() + arr[a].slice(1);
         }
         const str2 = arr.join(" ");
         const found = this.events.find(element => element.name == str2);
         if(!found){
           if(!this.isEmpty(str2)){
             this.events.push({name: str2, value: features[i].properties.move_type});

           }

           // this.georeferences.push({name: str2, value: features[i].properties.move_type});
         }

         let total_distance;
         let traveled_distance;

         if(features[i].properties.total_distance!='nan'){
           if(features[i].properties.total_distance!=null){
             total_distance = parseFloat(features[i].properties.total_distance);

           }
          }
         if(features[i].properties.move_type == 'move_stop' && reference_move_stop==undefined){
           reference_move_stop = total_distance;
         }
         if(features[i].properties.move_type == 'move_stop' && reference_move_stop!=undefined){
           traveled_distance = total_distance - reference_move_stop;
         }

         this.historicalpoints.push(
           {
             num:(i+1),
             lat: features[i].geometry.coordinates[1],
             lon: features[i].geometry.coordinates[0],
             date: this.formatdate(features[i].properties.recorded_on),
             //id_geofence:  features[i].properties.move_type,
             move_type:  features[i].properties.move_type,
             move_type_format: this.formatstring(features[i].properties.move_type),
             total_distance:  ''+total_distance,
             traveled_distance: traveled_distance
           },

         );
       }


       this.loading = false;

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
                          center: [-114.8574, 54.6542],
                          zoom: 4,
                        });


                        const graphicsLayer = new GraphicsLayer();
                         map.add(graphicsLayer);

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
                            text: this.historicalpoints[i].num,
                            xoffset: 0,
                            yoffset: -4,
                            font: {  // autocast as esri/symbols/Font
                              size: 8,
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
                           if(this.mapView.zoom>8){
                             event.stopPropagation();
                              this.mapView.hitTest(event).then(({ results }) => {
                              //  var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
                                //var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
                                 if(results.length>0){
                                   let result = results[0];
                                   if(result['graphic']){
                                     const found = this.historicalpoints.find(element => element.lon == result['graphic'].geometry.x && element.lat == result['graphic'].geometry.y);
                                     if(found){

                                       that.mapView.popup.close();



                                       that.mapView.popup.open({
                                           // Set the popup's title to the coordinates of the clicked location
                                           content: getContent(found),
                                           location: results[0].mapPoint // Set the location of the popup to the clicked location
                                       });

                                       // this.georeferences.push({name: str2, value: features[i].properties.move_type});
                                     }
                                   }


                                }
                              });
                           }

                        });

                        /*

                        date: this.formatdate(features[i].properties.recorded_on),
                        move_type: this.formatstring(features[i].properties.move_type),
                        total_distance:  ''+total_distance,
                        traveled_distance: traveled_distance
                        */

                        function getContent(found) {
                          let divcontent = document.createElement("div");
                          let divdate = document.createElement("div");
                          let labeldate = document.createElement("label");
                          labeldate.innerText = "Date:";
                          labeldate.className = 'title_popup';

                          let labeldatevalue = document.createElement("label");
                          labeldatevalue.innerText = found.date;
                          labeldatevalue.className = 'value_popup';

                          divdate.appendChild(labeldate);
                          divdate.appendChild(labeldatevalue);

                          divcontent.appendChild(divdate);


                          if(!that.isEmpty(found.move_type)){
                            let divmove_type = document.createElement("div");
                            let labelmove_type = document.createElement("label");
                            labelmove_type.innerText = "Move Type:";
                            labelmove_type.className = 'title_popup';

                            let labelmove_typevalue = document.createElement("label");
                            labelmove_typevalue.innerText = found.move_type_format;
                            labelmove_typevalue.className = 'value_popup';

                            divmove_type.appendChild(labelmove_type);
                            divmove_type.appendChild(labelmove_typevalue);

                            divcontent.appendChild(divmove_type);
                          }

                          if( found.total_distance != 'undefined'){
                            let divtotal_distance = document.createElement("div");
                            let labeltotal_distance = document.createElement("label");
                            labeltotal_distance.innerText = "Total Distance:";
                            labeltotal_distance.className = 'title_popup';

                            let labeltotal_distancevalue = document.createElement("label");
                            labeltotal_distancevalue.innerText = found.total_distance;
                            labeltotal_distancevalue.className = 'value_popup';

                            divtotal_distance.appendChild(labeltotal_distance);
                            divtotal_distance.appendChild(labeltotal_distancevalue);

                            divcontent.appendChild(divtotal_distance);
                          }

                          if( found.traveled_distance != undefined){
                            let divtraveled_distance = document.createElement("div");
                            let labeltraveled_distance = document.createElement("label");
                            labeltraveled_distance.innerText = "Traveled Distance:";
                            labeltraveled_distance.className = 'title_popup';
                            let labeltraveled_distancevalue = document.createElement("label");
                            labeltraveled_distancevalue.innerText = found.traveled_distance;
                            labeltraveled_distancevalue.className = 'value_popup';

                            divtraveled_distance.appendChild(labeltraveled_distance);
                            divtraveled_distance.appendChild(labeltraveled_distancevalue);

                            divcontent.appendChild(divtraveled_distance);
                          }
                          return divcontent;
                         // that.router.navigate([`ppsdetails`,  reference.graphic.attributes.id ]);
                        }



                      })
                      .catch(err => {
                        console.error(err);
                      });
     }

     formatdate(date){
       let dateformat = date.split(' ');
       let hourformat = dateformat[1].split('.');

       return dateformat[0] + ' ' + hourformat[0];
     }

     convertDatetoString(date: any) {


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

     formatstring(content){
       return content.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
     }

     validate(){
       let hourfrom = 0;
       let minutefrom = 0;
       let hourto = 0;
       let minuteto = 0;

          if(typeof this.timefrom == 'string'){
           let datefromstring = '';
           datefromstring = this.timefrom;
         var arraystring = datefromstring.split(':');
         hourfrom = parseInt(arraystring[0]);
         minutefrom = parseInt(arraystring[1]);
         }else{
         hourfrom = this.timefrom.getHours();
         minutefrom = this.timefrom.getMinutes();
       }
         if(typeof this.timeto == 'string'){
           let datetostring = '';
           datetostring = this.timeto;
         var arraystringto = datetostring.split(':');
         hourto = parseInt(arraystringto[0]);
         minuteto = parseInt(arraystringto[1]);

         }else{
         hourto = this.timeto.getHours();
         minuteto = this.timeto.getMinutes();
       }





       let dateauxfrom = new Date(this.datefrom.getFullYear(), this.datefrom.getMonth(), this.datefrom.getDate(), hourfrom, minutefrom, 0);
       let dateauxto = new Date(this.dateto.getFullYear(), this.dateto.getMonth(), this.dateto.getDate(), hourto, minuteto, 0);
      if (dateauxfrom.getTime() < dateauxto.getTime()) {
        return this.validatedDates = true;
      }
      return this.validatedDates = false;
     }



     ngAfterViewInit() {
     }

     centermap($event){
       document.getElementById("esri-view").focus();

        this.mapView.goTo({
        center: [$event.lon, $event.lat],zoom:12
      })
      .catch(function(error) {
        if (error.name != "AbortError") {
           console.error(error);
        }
      });
     }

     downloadcsv(){
       let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");
       let timefromstring = '00:00:00'
       let timetostring = '00:00:00'
       if(typeof this.timefrom != 'object'){
         timefromstring = this.timefrom + ':00'
       }
       if(typeof this.timeto != 'object'){
         timetostring = this.timeto+ ':00'

       }

       let dateToSend =  this.convertDatetoString(this.datefrom) + ' ' + timefromstring ;
       let fromToSend =  this.convertDatetoString(this.dateto) + ' ' + timetostring ;
       let arraytable = [];
       for(var i = 0; i < this.historicalpoints.length;i++){
         let total_distance = '';
         if(this.historicalpoints[i].total_distance!='undefined'){
           total_distance = '' + this.historicalpoints[i].total_distance;
         }
         arraytable.push(
           {
             Order: this.historicalpoints[i].num,
             Latitude: this.historicalpoints[i].lat,
             Longitude: this.historicalpoints[i].lon ,
             Move_Type: this.historicalpoints[i].move_type_format,
             Date: this.historicalpoints[i].date,
             Total_Distance: total_distance,
             Traveled_Distance: this.historicalpoints[i].traveled_distance,

           }
         );
       }


       let data = arraytable;
      const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
      const header = ['Order','Latitude','Longitude','Move_Type','Date','Total_Distance','Traveled_Distance']; //Object.keys(data[0]);
      const csv = data.map((row) =>
        header
          .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(',')
      );
      csv.unshift(header.join(','));
      const csvArray = csv.join('\r\n');
      const a = document.createElement('a');
      const blob = new Blob([csvArray], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      a.href = url;
      a.download = chasis+ '_' + dateToSend + '_'+ fromToSend + '_'+ 'Historical.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
     }

     isEmpty(str) {
       return (!str || 0 === str.length);
     }

     getFilters($event){
       //this.loading = true;

       /*
          if($event.event!=null){

            this.historicalpoints = this.historicalpoints.filter(element => element.move_type == $event.event.value);
          }
          if($event.georeference!=null){
            // this.data = this.data.filter(element => element.geofences.find(geofence => geofence.name == $event.georeference.value) !=undefined );
          }

          */



        setTimeout(() => {
          this.rebuildmap($event);
        }, 100);




     }

     rebuildmap($event){
       let timefromstring = '00:00:00'
       let timetostring = '00:00:00'
       if(typeof this.timefrom != 'object'){
         timefromstring = this.timefrom + ':00'
       }
       if(typeof this.timeto != 'object'){
         timetostring = this.timeto+ ':00'

       }


       let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");


       let dateToSend =  this.convertDatetoString(this.datefrom) + 'T' + timefromstring ;
       let fromToSend =  this.convertDatetoString(this.dateto) + 'T' + timetostring ;
       let obj_send = {
         id: chasis,
         initial_date: dateToSend,
         final_date: fromToSend
       }
                    this.http.post<any>('https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/chassis-history', {body:{data:obj_send}}).subscribe(data => {
                      //this.buildmap(data.body.features);
                      this.makefromjson(data.body,$event);
                  })

     }

     makefromjson(json,$event){
       let arrayfeacturesfilter = json.features;

       if($event.event!=null && ($event.event!=null && $event.event.value != 'No Filter')){
          arrayfeacturesfilter = arrayfeacturesfilter.filter(element => element.properties.move_type == $event.event.value);

       }


       if($event.georeference!=null && ($event.georeference!=null && $event.georeference.value != 'No Filter')){

      //   this.convertfeactures(json,arrayfeacturesfilter,$event.georeference.value);

       }else{
          setTimeout(() => {
           this.loading = false;

           this.buildmap(arrayfeacturesfilter);
         }, 100);
       }





      }

      gotomap(){
        this.router.navigate([`map`]);
      }

      gotoppsdetails(){
        let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");

        this.router.navigate([`ppsdetails`,  chasis ]);
      }
}
