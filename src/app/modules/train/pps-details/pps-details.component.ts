import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { ActivatedRoute,Router } from '@angular/router';
import { loadModules } from 'esri-loader';
import { MapStateService } from '../../../core/services/map-state/map-state.service';
import { PDFService } from '../../../core/services/pdfmake/pdf.service';
import { environment } from '../../../../environments/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
type AOA = any[][];
declare var saveAs: any;
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import html2canvas from 'html2canvas';


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
  properties: any;
  georeferences = [];
  geofences_array = [];

  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(
    private router : Router,
    private cdRef : ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private pdfService: PDFService,



   ) { }


  ngOnInit() {
    this.counterror = 0;
    let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");
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


                //fetch(environment.API_URL_BASE + "get-cpr-geojson")
                fetch("https://1jz8l0lbc6.execute-api.us-west-2.amazonaws.com/dev/get-cpr-geojson")
                    .then(res => res.json())
                    .then((out) => {
                      if(out.errorMessage==undefined){
                        this.loading = false;
                        this.makefromjson(out);

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

  makefromjson(json){
    let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");
    let arrayfeacturesfilter = json.features;
    arrayfeacturesfilter = arrayfeacturesfilter.filter(element => element.id == chasis);
    json.features = arrayfeacturesfilter;
    setTimeout(() => {
      this.getInfoChasis();
      this.buildmap(json);
    }, 100);

  }

  getInfoChasis(){
    let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");

      //   this.http.post<any>(environment.API_URL_BASE +'get-chassis', {body:{data:{id: chasis}}}).subscribe(data => {
         this.http.post<any>('https://1jz8l0lbc6.execute-api.us-west-2.amazonaws.com/dev/get-chassis', {body:{data:{id: chasis}}}).subscribe(data => {
           let array = JSON.parse(data.body);
           if(array.length>0){
             this.properties = array[0];
           }
       })
  }

  buildmap(json){
    this.chasis = this.activatedRoute.snapshot.paramMap.get("chasis");
    if(json!=undefined){
      this.loading = false;


      if(json.features!=undefined && (json.features!=undefined && json.features.length>0)){
        this.lon = json.features[0].geometry.coordinates[1];
        this.lat = json.features[0].geometry.coordinates[0];
        let lat = json.features[0].geometry.coordinates[0];
        let lon = json.features[0].geometry.coordinates[1];
        this.date = this.formatdatehours(json.features[0].properties.recorded_on);
        this.event = json.features[0].properties.move_type;

        let geofences_array = [];
        let georences_string = '';
        if(typeof json.features[0].geofences[0] == 'string'){
          let featurestring = json.features[0].geofences[0];
         // featurestring = this.replaceAll(featurestring,"'", '"');
         // featurestring = this.replaceAll(featurestring,"'", '"');
        //   featurestring = this.replaceAll(featurestring," ", '');
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
        this.geofences_array = geofences_array;

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
    return dateformat[0] + ' ' + hourformat[0];

  }

  formatstring(content){
    return content.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  downloadFile(){

     let that = this;

    this.mapView.takeScreenshot({
                           format: 'png',
                           quality: 100,
                           width: 220,
                           height: 160
                       }).then(function(screenshot) {

                         setTimeout(() => {
                           const docDefinition = {
                             pageSize: 'LETTER',
                             pageMargins: [30, 30, 30, 60],
                             header: {
                               margin: 10,
                               columns: [
                               ]
                             },
                             content: [
                               that.pdfService.getTitle(that.chasis),
                               that.pdfService.getPPSDetails(that.lat,that.lon),
                                {
                                 image: screenshot.dataUrl,alignment: 'center'
                               },
                               that.pdfService.getPPSDetailsAtributtes(that.date,that.event,that.properties,that.geofences_array),

                             ]
                           };
                           pdfMake.createPdf(docDefinition).download(that.chasis + '.pdf');
                         }, 500);
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

  isEmpty(str) {
    return (!str || 0 === str.length);
  }

  replaceAll(string, search, replace) {
   return string.split(search).join(replace);
 }


  gotomap(){
    this.router.navigate([`map`]);
  }

  gotoroutemap(){
    let chasis = this.activatedRoute.snapshot.paramMap.get("chasis");

    this.router.navigate(['chassis-history',  chasis ]);
  }



}
