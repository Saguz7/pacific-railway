import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';
 import { MapStateService } from '../../core/services/map-state/map-state.service';
 import { environment } from '../../../environments/environment';

import { loadModules } from 'esri-loader';
 import { ActivatedRoute,Router } from '@angular/router';
 import { HttpClient, HttpHeaders } from '@angular/common/http';
 import Swal from 'sweetalert2'

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

     this.loading = true;

     this.events= [
       {name: "No Filter", value: "No Filter"}
     ]
     this.historicalpoints= [];
             this.href = this.router.url;
            this.currentURL = window.location.href.replace(this.href,'');

             let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");
             this.chasis = this.activatedRoute.snapshot.paramMap.get("chasis");

          //   this.datefrom = new Date();
          //   this.timefrom = new Date(this.datefrom.getFullYear(), this.datefrom.getMonth(), this.datefrom.getDate(), 0, 0, 0);

             let dateactual =  new Date()
             this.datefrom = new Date();
             this.datefrom.setDate(dateactual.getDate() - 7);
             //this.datefrom.setDate(this.datefrom.getDate() - 7);
             this.timefrom = new Date(this.datefrom.getFullYear(), this.datefrom.getMonth(), this.datefrom.getDate(), 0, 0, 0);

             this.dateto = new Date();
          //   this.dateto.setDate(this.datefrom.getDate() - 7);
             this.timeto = new Date(this.dateto.getFullYear(), this.dateto.getMonth(), this.dateto.getDate(), 0, 0, 0);
             let dateToSend =  this.convertDatetoString(this.datefrom);
             let fromToSend =  this.convertDatetoString(this.dateto);
             let obj_send = {
               id: chasis,
               initial_date: dateToSend,
               final_date: fromToSend
             }
             this.loading = true;

             this.http.post<any>(environment.API_URL_BASE +'chassis-history', {body:{data:obj_send}}).subscribe(data => {
            // this.http.post<any>('https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/chassis-history', {body:{data:obj_send}}).subscribe(data => {


                              let responseBody;
                                 try {
                                   responseBody = JSON.parse(data.body);
                                 } catch (error) {
                                   responseBody = {};
                                 }

                                 if (responseBody.message === "No data history for id") {
                                   this.buildmap([]);
                                 } else {
                                   this.buildmap(data.body.features);
                                 }


                        })


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
                    this.http.post<any>(environment.API_URL_BASE + 'chassis-history', {body:{data:obj_send}}).subscribe(data => {
                  //  this.http.post<any>('https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/chassis-history', {body:{data:obj_send}}).subscribe(data => {
                      let responseBody;
                         try {
                           responseBody = JSON.parse(data.body);
                         } catch (error) {
                           responseBody = {};
                         }

                         if (responseBody.message === "No data history for id") {
                           Swal.fire('No results found');
                           this.buildmap([]);
                         } else {
                           this.buildmap(data.body.features);
                         }
                   })
     }

     buildmap(features){
       if(features!=undefined){
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
           }
           let total_distance;
           let traveled_distance;
           let total_distance_km;
           if(features[i].properties.total_distance!='nan'){
             if(features[i].properties.total_distance!=null){
               total_distance = parseFloat(features[i].properties.total_distance) * 0.621371;
               total_distance_km = this.convertkm(total_distance);
             }
            }
           if(features[i].properties.move_type == 'move_stop' && reference_move_stop==undefined){
             reference_move_stop = total_distance;
           }
           if(features[i].properties.move_type == 'move_stop' && reference_move_stop!=undefined){
             if(total_distance!=null){
               traveled_distance =  (total_distance - reference_move_stop)* 0.621371;
               traveled_distance = this.convertkm(traveled_distance);
             }
           }
           let geofences_array = [];
           let georences_string = '';
           if(typeof features[i].properties.geofences == 'string'){
            let featurestring = features[i].properties.geofences;
            featurestring = this.replaceAll(featurestring,"'", '');
            let arrayaux = [];
            let sentencias = featurestring.split(/[{}]/);
            const resultado = sentencias.filter(sentence => sentence.length>2);

             for(var r = 0; r < resultado.length;r++){
               let objaux = {id: '', name: ''}
               if(resultado[r].length>2){
                  var arraysplitcoma = resultado[r].split(',');
                 for(var v = 0; v < arraysplitcoma.length;v++){
                   var arraysplitdospuntos = arraysplitcoma[v].split(':');
                   if(arraysplitdospuntos[1]!=undefined){
                     objaux[arraysplitdospuntos[0].trim()] = arraysplitdospuntos[1].trim();

                     if(!this.isEmpty(arraysplitdospuntos[1].trim())){
                       const found = geofences_array.find(element => element.name == arraysplitdospuntos[1].trim());
                       if(!found){
                         geofences_array.push(objaux);
                         }
                      }
                   }
                 }
               }
             }
           }


           for(var e = 0; e < geofences_array.length; e++){
             if(e == geofences_array.length - 1){
               georences_string = georences_string + this.getGeofencesPrimor(geofences_array[e]);

              }else{
                georences_string = georences_string + this.getGeofencesPrimor(geofences_array[e]) + ',';
             }
           }
           this.historicalpoints.push(
             {
               num:(i+1),
               lat: features[i].geometry.coordinates[1],
               lon: features[i].geometry.coordinates[0],
               coordinates: this.trunc(features[i].geometry.coordinates[0],3)  + ' , ' + this.trunc(features[i].geometry.coordinates[1],3) ,
               date: this.formatdate(features[i].properties.recorded_on),
               //id_geofence:  features[i].properties.move_type,
               move_type:  features[i].properties.move_type,
               move_type_format: this.formatstring(features[i].properties.move_type),
               total_distance:  ''+total_distance_km,
               traveled_distance: traveled_distance,
               geofences: geofences_array ,
               georeference: georences_string
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
                             let equalspoint = this.historicalpoints.filter(element => element.lon == this.historicalpoints[i].lon && element.lat == this.historicalpoints[i].lat);
                             let pointtext = '';

                             if(equalspoint.length>1){
                               for(var a = 0; a < equalspoint.length;a++){
                                 if(a != equalspoint.length-1){
                                   pointtext = pointtext + equalspoint[a].num
                                 }else{
                                   pointtext = pointtext + equalspoint[a].num + ',';
                                 }
                               }
                             }else{
                               pointtext = this.historicalpoints[i].num

                             }
                             const point = { //Create a point
                                type: "point",
                                longitude: this.historicalpoints[i].lon,
                                latitude: this.historicalpoints[i].lat
                             };
                             const simpleMarkerSymbol = {
                                type: "simple-marker",
                                 size: "25px",
                                 text: pointtext,
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
                                size: 8
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
                                             title: found.num,
                                             content: getContent(found),
                                             location: results[0].mapPoint
                                         });
                                       }
                                     }


                                  }
                                });
                             }

                          });


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
                          }



                        })
                        .catch(err => {
                          console.error(err);
                        });
       }else{
         this.loading = false;

       }

     }

     convertkm(meters){
       let convertmeters = meters / 1000
       let result = new Intl.NumberFormat("en-US").format(convertmeters);
       return result
     }

     formatdate(date){


       var MyTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
       var LocaleZone = Intl.DateTimeFormat().resolvedOptions().locale;

        let usDate = date.toLocaleString(LocaleZone, {timeZone: MyTimeZone});
       let dateformat = usDate.split(' ');
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
       if(this.timefrom==undefined || this.timeto==undefined || this.datefrom==undefined || this.dateto==undefined){
         return this.validatedDates = false;

       }
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
        center: [$event.lon, $event.lat],zoom:10
      })
      .catch(function(error) {
        if (error.name != "AbortError") {
           console.error(error);
        }
      });
     }

     getGeofencesPrimor(geofence){
       let name_geofence = geofence.name;
        const found = this.georeferences.find(element => element.value == geofence.id);
       if(found){
         name_geofence = found.name;
        }
       return name_geofence;

     }

     replaceAll(string, search, replace) {
      return string.split(search).join(replace);
    }

     downloadcsv(){
       let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");
       let title_csv = ''

       if(this.datefrom!=undefined && this.dateto!=undefined){
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
         title_csv = chasis+ '_' + dateToSend + '_'+ fromToSend + '_'+ 'Historical.csv';
       }else{
         title_csv = chasis+ '_'+ 'Historical.csv';
       }
       let arraytable = [];
       for(var i = 0; i < this.historicalpoints.length;i++){
         let total_distance = '';
         if(this.historicalpoints[i].total_distance!='undefined'){
           total_distance = '' + this.historicalpoints[i].total_distance + ' mi';
         }
         let traveled_distance = '';
         if(!this.isEmpty(this.historicalpoints[i].traveled_distance)){
           traveled_distance = '' + this.historicalpoints[i].traveled_distance+ ' mi';
         }
         arraytable.push(
           {
             Order: this.historicalpoints[i].num,
            // Latitude: this.historicalpoints[i].lat,
            // Longitude: this.historicalpoints[i].lon ,
            Coordinates: this.historicalpoints[i].coordinates,
             Move_Type: this.historicalpoints[i].move_type_format,
             Date: this.historicalpoints[i].date,
             Total_Distance: total_distance,
             Traveled_Distance: traveled_distance,
             Geofences: this.historicalpoints[i].georeference,

           }
         );
       }


       let data = arraytable;
      const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
      const header = ['Order','Coordinates','Move_Type','Date','Total_Distance','Traveled_Distance','Geofences']; //Object.keys(data[0]);
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
      a.download = title_csv;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
     }

     isEmpty(str) {
       return (!str || 0 === str.length);
     }

     trunc(x, posiciones) {
      var s = x.toString()
      var l = s.length
      var decimalLength = s.indexOf('.') + 1
      var numStr = s.substr(0, decimalLength + posiciones)
      return Number(numStr)
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

          this.loading = true;


        setTimeout(() => {
          this.rebuildmap($event);
        }, 100);




     }

     rebuildmap($event){



       let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");
       let obj_send = {
         id: chasis
       }
       if(this.datefrom!= undefined && this.dateto!=undefined){
         let timefromstring = '00:00:00'
         let timetostring = '00:00:00'
         if(typeof this.timefrom != 'object'){
           timefromstring = this.timefrom + ':00'
         }
         if(typeof this.timeto != 'object'){
           timetostring = this.timeto+ ':00'

         }
         obj_send['initial_date'] = this.convertDatetoString(this.datefrom) + 'T' + timefromstring;
         obj_send['final_date'] =  this.convertDatetoString(this.dateto) + 'T' + timetostring;

       }




                    this.http.post<any>(environment.API_URL_BASE + 'chassis-history', {body:{data:obj_send}}).subscribe(data => {
                  //  this.http.post<any>('https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/chassis-history', {body:{data:obj_send}}).subscribe(data => {
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

         this.convertfeactures(json,arrayfeacturesfilter,$event.georeference.value);

       }else{
          setTimeout(() => {
           this.loading = false;

           this.buildmap(arrayfeacturesfilter);
         }, 100);
       }





      }


      convertfeactures(json,arrayfeacturesfilter,value){
        let geofences_array = [];
        for(var i = 0; i < arrayfeacturesfilter.length;i++){
          if(typeof arrayfeacturesfilter[i].properties.geofences  == 'string'){

             let featurestring = arrayfeacturesfilter[i].properties.geofences ;
           featurestring = this.replaceAll(featurestring,"'", '');
            let sentencias = featurestring.split(/[{}]/);
            const resultado = sentencias.filter(sentence => sentence.length>2);

            for(var r = 0; r < resultado.length;r++){
              let objaux = {id: '', name: ''}
              if(resultado[r].length>2){
                 var arraysplitcoma = resultado[r].split(',');
                for(var v = 0; v < arraysplitcoma.length;v++){
                  var arraysplitdospuntos = arraysplitcoma[v].split(':');

                  if(arraysplitdospuntos.length>1){
                    if(!this.isEmpty(arraysplitdospuntos[1].trim())){
                      objaux[arraysplitdospuntos[0].trim()] = arraysplitdospuntos[1].trim();
                      if(arraysplitdospuntos[1].trim() == value){
                        geofences_array.push(arrayfeacturesfilter[i]);
                      }
                     }
                  }


                }
              }
            }
          }
          }
           setTimeout(() => {
            this.loading = false;

             this.buildmap(geofences_array);
          }, 100);
      }

      gotomap(){
        this.router.navigate([`map`]);
      }

      gotoppsdetails(){
        let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");

        this.router.navigate([`chassis-details`,  chasis ]);
      }
}
