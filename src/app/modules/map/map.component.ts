import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription ,Observable } from 'rxjs';
import { MapDivComponent } from './mapdiv/mapdiv.component';
import { MapStateService } from '../../core/services/map-state/map-state.service';
import {from} from 'rxjs';
import { loadModules } from 'esri-loader';
import { Router } from '@angular/router';
import { GEOJsonService } from '../../core/services/map/geojson.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2'
import {MessageService} from 'primeng/api';
import { Location } from '@angular/common';
import { Auth } from 'aws-amplify';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [MessageService]

})



export class MapComponent implements OnInit {
  @ViewChild('viewContainerRef', { read: ViewContainerRef, static: false }) VCR: ViewContainerRef;
  index: number = 0;
  componentsReferences = [];
  events = [];
  georeferences = [];
  puntosarray = [];
  checked: boolean;
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
  reload: boolean = false;
  filterspoints = [];
  contador2: any;
  minutos: any;
  segundos: any;
  jsongeneral: any;
  timestring: any;

  layer: any;


  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(
    private messageService: MessageService,
    private router : Router,
    private cdRef : ChangeDetectorRef,
    private location: Location,
    private CFR?: ComponentFactoryResolver,
    private cdref?: ChangeDetectorRef,
    private msService?: MapStateService,
    private http?: HttpClient
    //private geojsonService?: GEOJsonService,


   ) { }

   @Output()

    ocultarFiltro:boolean;
    ocultarTabla:boolean;

    ngOnInit() {

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
              const map: __esri.Map = new Map({
                basemap: 'streets'
              });
              let that = this;

              this.mapView = new MapView({
                container: this.mapViewEl.nativeElement,
                center: [-114.8574, 54.6542],
                zoom: 4,
                map: map,
                constraints: {
                  minZoom : 3,
                },
              });
            })


                      .catch(err => {
                        console.error(err);
                      });




      this.contador_regresivo();


      this.events = [];
      this.counterror = 0;

      this.data = [];
      this.dataGeneral = [];
      this.filterspoints = [];
      this.href = this.router.url;
      this.currentURL = window.location.href.replace(this.href,'');

    }

    contador_regresivo() {

      let actual = new Date();
      let minactual = actual.getMinutes()
      let segundoactual = actual.getSeconds()

      let intervalo = 0;
      let intervalosegundos = 0;

      for(var i = 0; i < 60;i++){
        if(minactual < ((i+1) * 10)){
          if(intervalo == 0){
            intervalo = (i+1) * 10;
          }
        }
      }
      if(intervalo-minactual>1){
        this.minutos = (intervalo-minactual)-1;

      }else{
        this.minutos = (intervalo-minactual);

      }

       this.segundos = 60-segundoactual;


      if(this.contador2 == undefined) {
        this.contador2 = setInterval(()=> {
          this.timestring = this.minutos;
          if(this.segundos<10){
            this.timestring = this.timestring + ':0' + this.segundos
          }else{
            this.timestring = this.timestring + ':' + this.segundos
          }
          if(this.minutos == 0 && this.segundos == 0){
            this.contador_regresivo();

            if(this.reload){
              this.refreshdata();
              this.contador2  = undefined;
             //  Swal.fire('Updating information!')
              this.messageService.add({severity:'success', summary: 'Success', detail: 'Updating information!'});
            }else{
              this.messageService.add({severity:'info', summary: 'Info', detail: 'New data available!'});
            //  Swal.fire('New information available!')
            }
              clearInterval(this.contador2);
          }else{
            if(this.minutos == 1 && this.segundos == 0){
              if(this.reload){
                this.messageService.add({severity:'warn', summary: 'Warn', detail: 'New data will be available in a minute!'});
              }


            }
            if (this.segundos > 0 && this.segundos <= 60) {
             this.segundos--;

           } else {
             if (this.minutos > 0 && this.minutos <= 60) {
                this.minutos--;
               this.segundos = 59;

              }
           }
          }



        }, 1000);
      }
    }

    refreshdata(){
      this.loading = true;

  //    fetch(environment.API_URL_BASE + "get-cpr-geojson")
      fetch("https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/get-cpr-geojson")
      .then(res => res.json())
      .then((out) => {
        // this.getHistorico(out.features);

        this.jsongeneral = out;


         if(out.errorMessage==undefined){
          this.loading = false;
          this.buildmap(out,null);
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

    }



    ngAfterViewInit() {
      this.loading = true;
      this.getDatafromGeoJson();
      this.cdRef.detectChanges();
    }

    getDatafromGeoJson(){

    //  fetch(environment.API_URL_BASE + "get-cpr-geojson")
      fetch("https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/get-cpr-geojson")
      .then(res => res.json())
      .then((out) => {
        // this.getHistorico(out.features);

        this.jsongeneral = out;

         if(out.errorMessage==undefined){
          this.loading = false;
          this.buildmap(out,null);
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


    }

    getHistorico(features){
      for(var i = 0; i < features.length;i++){
        let indice = i;
        let datefrom = new Date(2022,0,1);

        let dateto = new Date(2022,1,28);
         let dateToSend =  this.convertDatetoString(datefrom);
        let fromToSend =  this.convertDatetoString(dateto);
        let obj_send = {
          id: features[indice]['id'],
        //  initial_date: dateToSend,
        //  final_date: fromToSend
        }

                  //   this.http.post<any>(environment.API_URL_BASE + 'chassis-history', {body:{data:obj_send}}).subscribe(data => {
                     this.http.post<any>('https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/chassis-history', {body:{data:obj_send}}).subscribe(data => {
                       let results = JSON.parse(data.body);



                   })
      }

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

    getData(): Observable<any> {
    return from(
      fetch(
        //environment.API_URL_BASE + 'get-cpr-geojson', // the url you are trying to access
        'https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/get-cpr-geojson', // the url you are trying to access
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET', // GET, POST, PUT, DELETE
          mode: 'no-cors' // the most important option
        }
      ));
  }

    buildmap(json,coords){

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
        const map: __esri.Map = new Map({
          basemap: 'streets'
        });
        let that = this;

        let urldirect = window.location.href.replace('/map','')
        this.layer = new GeoJSONLayer({
          title: "Chassis",
          url: urljson,
          outFields: ["*"],
          popupTemplate: {
            title: 'Chassis  {id} ',
            content: [
							{
								type: "custom",
								creator: (graphic) => {
                  let divcontent = document.createElement("div");
                  let btn = document.createElement("button");
                  btn.innerText = "Chassis Details";

                  btn.addEventListener("click", function(event){
                    btnClick(graphic)
                  });

                  divcontent.appendChild(btn);

                  let btnroute = document.createElement("button");
                  btnroute.innerText = "Chassis History";

                  btnroute.addEventListener("click", function(event){
                    btnClickRoute(graphic)
                  });

                  divcontent.appendChild(btnroute);


									return divcontent;
								}
							}
            ],
          }
        });




        function btnClick(reference) {
          const url = that.router.createUrlTree([`chassis-details`, reference.graphic.attributes.id]).toString();
          window.open(url, '_blank');

				}

        function btnClickRoute(reference) {
          const url = that.router.createUrlTree([`chassis-history`, reference.graphic.attributes.id]).toString();
          window.open(url, '_blank');
				}

/*
        this.mapView = new MapView({
          container: this.mapViewEl.nativeElement,
          center: [-114.8574, 54.6542],
          zoom: 4,
          map: map,
          constraints: {
            minZoom : 3,
          },
        });
        */
        this.mapView.container = this.mapViewEl.nativeElement;
        this.mapView.map = map;
        map.add(this.layer);
        this.mapView.popup.viewModel.includeDefaultActions = false;
         this.mapView.on("drag", function(evt) {
          var initialExtent = that.mapView.extent;
          const p1 = webMercatorUtils.xyToLngLat(initialExtent.xmin,initialExtent.ymin);
          const p2 = webMercatorUtils.xyToLngLat(initialExtent.xmax,initialExtent.ymax);
          if(that.mapView.zoom>6){
            that.filtersfromzoommap(p1[0],p2[0],p1[1],p2[1]);
          }else{
            that.getAllTable();
          }
        });
        this.mapView.watch('scale', function(evt){
                         var initialExtent = that.mapView.extent;
                         const p1 = webMercatorUtils.xyToLngLat(initialExtent.xmin,initialExtent.ymin);
                         const p2 = webMercatorUtils.xyToLngLat(initialExtent.xmax,initialExtent.ymax);
                         if(that.mapView.zoom>6){
                           that.filtersfromzoommap(p1[0].toFixed(2),p2[0].toFixed(2),p1[1].toFixed(2),p2[1].toFixed(2));

                         }else{
                           that.getAllTable();
                         }
                        });
                       this.mapView.whenLayerView(this.layer).then(lv => {
                           const layerView = lv;
                           const customContentPromise = new CustomContent({
                             outFields: ["*"],
                             creator: (event) => {
                               const query = this.layer.createQuery();
                               query.aggregateIds = [event.graphic.getObjectId()];
                                return this.layer.queryFeatures(query).then(result => {
                                   const contentDiv = document.createElement("div");
                                   const tbl = document.createElement("table");
                                   let headers = ['Chassis ID','Events' ,'PPS Details'];
                                   let headerslabel = ['id','move_type','url'];

                                   const tblHeader = document.createElement("thead");
                                   const rowheaders = document.createElement("tr");

                                     for (let i = 0; i < headers.length; i++) {
                                       const cellheader = document.createElement("th");
                                       const cellTextHeader = document.createTextNode(headers[i]);
                                       cellheader.appendChild(cellTextHeader);
                                       rowheaders.appendChild(cellheader);
                                     }
                                     tblHeader.appendChild(rowheaders);
                                    const tblBody = document.createElement("tbody");
                                    for (const feature of result.features) {
                                      const row = document.createElement("tr");
                                      for (let j = 0; j < headerslabel.length; j++) {
                                         let data = "";
                                         const cell = document.createElement("td");

                                        if(headerslabel[j]=='id' || headerslabel[j]=='move_type' || headerslabel[j]=='date'){
                                          data = feature.attributes[headerslabel[j]];
                                          const cellText = document.createTextNode(data);
                                          cell.appendChild(cellText);

                                        }
                                        if(headerslabel[j]=='url'){
                                          var createA = document.createElement('a');
                                          var createAText = document.createTextNode(`Chassis Details`);
                                          createA.setAttribute('href', this.href +  "/chassis-details/" + feature.attributes['id']);
                                          createA.appendChild(createAText);
                                          cell.appendChild(createA);
                                        }
                                         row.appendChild(cell);
                                      }
                                      tblBody.appendChild(row);
                                    }
                                    tbl.appendChild(tblHeader);
                                    tbl.appendChild(tblBody);
                                    document.body.appendChild(tbl);
                                   contentDiv.appendChild(tbl);

                                   return contentDiv
                               });
                             }
                         });
                           const clusterConfig = {
                               type: "cluster",
                               clusterRadius: "100px",
                               popupTemplate: {
                                 title: "Cluster summary",
                                // content: [customContentPromise],
                                content: "This cluster represents {cluster_count} chassis.",
                                 outFields: ["*"],
                                 fieldInfos: [{
                                   fieldName: "cluster_count",
                                   format: {
                                     places: 0,
                                     digitSeparator: true
                                   }
                                 }]
                               },
                               clusterMinSize: "14px",
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
                                               size: "12px"
                                           }
                                       },
                                       labelPlacement: "center-center"
                                   }
                               ]
                           };

                           this.layer.featureReduction = clusterConfig;

                           const toggleButton = document.getElementById("cluster");

                           toggleButton.addEventListener("click", () => {
                               let fr = this.layer.featureReduction;
                               this.layer.featureReduction =
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
                             const p1rect = webMercatorUtils.xyToLngLat(graphic.geometry.extent.xmin,graphic.geometry.extent.ymin);
                             const p2rect = webMercatorUtils.xyToLngLat(graphic.geometry.extent.xmax,graphic.geometry.extent.ymax);
                              setTimeout(() => {
                                that.filtersfromzoommap(p1rect[0],p2rect[0],p1rect[1],p2rect[1]);

                             }, 500);
                             return graphic.geometry
                           });
                         }
                       });

                       function selectFeatures(geometry) {
                         const query = this.layer.createQuery();
                         query.aggregateIds = [geometry.graphic.getObjectId()];
                         this.layer.queryFeatures(query).then(result => {
                            const contentDiv = document.createElement("div");
                            return contentDiv
                        });
                       }

                       this.mapView.on("pointer-move",async (event) => {
                         //console.log(event);
                          event.stopPropagation();
                         var screenPoint = {
                           x: event.x,
                           y: event.y
                         };
                         this.mapView.hitTest(screenPoint)
                         .then(function (response) {
                           if(response.results.length>0){
                             const result = response.results[0];
                             if(result['graphic']!=undefined){


                               if(result['graphic'].attributes['clusterId']==undefined){
                                 that.mapView.popup.close();

                                let title = 'Chassis ' +result['graphic'].attributes.id+ '';
                                let idChasis = result['graphic'].attributes.id;
                                 that.mapView.popup.open({
                                     // Set the popup's title to the coordinates of the clicked location
                                     title: title,
                                     content: getButton(idChasis),
                                     location: result.mapPoint // Set the location of the popup to the clicked location
                                 });
                               }
                               if(result['graphic'].attributes['clusterId']!=undefined){
                               }
                             }
                           }

                         });
                       });

                       function getButton(reference) {
                         let divcontent = document.createElement("div");

                         let btn = document.createElement("button");
                         btn.innerText = "Chassis Details";

                         btn.addEventListener("click", function(event){
                            btnClickMouvePointer(reference)
                         });

                        divcontent.appendChild(btn);



                        let btnroute = document.createElement("button");
                        btnroute.innerText = "Chassis History";

                        btnroute.addEventListener("click", function(event){
                           btnClickMouvePointerRoute(reference)
                        });

                       divcontent.appendChild(btnroute);

                         return divcontent;
                        }


                       function btnClickMouvePointer(reference) {
                           that.router.navigate([`chassis-details`,  reference ]);
               				}

                      function btnClickMouvePointerRoute(reference) {
                          that.router.navigate([`chassis-history`,  reference ]);
                     }

                     setTimeout(() => {
                       if(coords!=null){
                         this.mapView.goTo({
                          center: [coords[1], coords[0]],zoom:9
                        })
                        .catch(function(error) {
                          if (error.name != "AbortError") {
                             console.error(error);
                          }
                        });
                       }
                     }, 100);

                })


                .catch(err => {
                  console.error(err);
                });



              }






           rehacerjson(features){
             this.data = []
             this.dataGeneral = []

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
             for(var i = 0; i < features.length;i++){
               let arr = features[i].properties.move_type.replace('_',' ').split(" ");
               for (var a = 0; a < arr.length; a++) {
                   arr[a] = arr[a].charAt(0).toUpperCase() + arr[a].slice(1);
               }
               const str2 = arr.join(" ");
               const found = this.events.find(element => element.name == str2);
               if(!found){
                 this.events.push({name: str2, value: features[i].properties.move_type});
                // this.georeferences.push({name: str2, value: features[i].properties.move_type});
               }

               let geofences_array = [];
               let georences_string = '';
               if(typeof features[i].geofences[0] == 'string'){
                 let featurestring = features[i].geofences[0];
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
/*
                             const foundinteres = this.georeferences.find(element => element.value == arraysplitdospuntos[1].trim());
                            if(foundinteres){
                              geofences_array.push(objaux);
                             }
                             */

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

               /*
               if(features[i].geofences!=undefined){
                 for(var a = 0; a < features[i].geofences.length;a++){

                   let results = JSON.parse(features[i].geofences);

                   if(a == features[i].geofences.length - 1){
                     georences_string = georences_string + features[i].geofences[a].name;

                    }else{
                      georences_string = georences_string + features[i].geofences[a].name + ',';
                   }
                   geofences_array.push(
                     {
                       name: features[i].geofences[a].name
                     }
                   );

                 }
               }
               */

               var createAText = document.createTextNode(`Chassis Details`);
                this.data.push(
                 {
                   reference: features[i].id,
                    device_id:  features[i].properties.device_id,
                     date: this.formatdate(features[i].properties.recorded_on),
                     move_type: features[i].properties.move_type,
                     geofences: geofences_array ,
                     coordinates: features[i].geometry.coordinates[0] + ',' + features[i].geometry.coordinates[1] ,
                     lat: features[i].geometry.coordinates[0],
                     lon: features[i].geometry.coordinates[1],
                     georeference: georences_string,
                     routemap: this.href +   features[i].id,
                     move_Type_format: this.formatstring(features[i].properties.move_type),


                 }
               );

               this.dataGeneral.push(
                 {
                   reference: features[i].id,
                    device_id:  features[i].properties.device_id,
                     date: this.formatdate(features[i].properties.recorded_on),
                     move_type: features[i].properties.move_type,
                     geofences: geofences_array ,
                     coordinates: features[i].geometry.coordinates[0] + ',' + features[i].geometry.coordinates[1] ,
                     lat: features[i].geometry.coordinates[0],
                     lon: features[i].geometry.coordinates[1],
                     georeference: georences_string,
                     routemap: this.href + features[i].id,
                     move_Type_format: this.formatstring(features[i].properties.move_type),

                 }
               );
             }

           }

           replaceAll(string, search, replace) {
            return string.split(search).join(replace);
          }

          getGeofencesPrimor(geofence){
            let name_geofence = geofence.name;
             const found = this.georeferences.find(element => element.value == geofence.id);
            if(found){
              name_geofence = found.name;
             }
            return name_geofence;

          }

           formatdate(date){
             let dateformat = date.split(' ');
             return dateformat[0];
           }

  ocultar(){

    const map = document.querySelector('.esri-view');
    map.setAttribute('style', 'height: 800px');
    return (this.ocultarFiltro = true);
  }

  mostrar(){
    const map = document.querySelector('.esri-view');
    map.setAttribute('style', 'height: 500px');
    return(this.ocultarFiltro = false);
  }

  ocultarTab(){
    const map = document.querySelector('.esri-view');
    map.setAttribute('style', 'height: 800px');
    return (this.ocultarTabla = true);
  }

  mostrarTabla(){
    const map = document.querySelector('.esri-view');
    map.setAttribute('style', 'height: 500px');
    return(this.ocultarTabla = false);
  }

  getFilters($event){
    let coords = null;
    this.loading = true;
     this.data = this.dataGeneral;
     if($event.chasis!=null){

       this.data = this.data.filter(element => String(element.reference) == String($event.chasis.trim().toUpperCase()));
       if(this.data.length>0){
         coords = [this.data[0].lon,this.data[0].lat]
       }
     }else{
       if($event.event!=null){

         this.data = this.data.filter(element => element.move_type == $event.event.value);
       }
       if($event.georeference!=null){
          this.data = this.data.filter(element => element.geofences.find(geofence => geofence.id == $event.georeference.value) !=undefined );
          if(this.data.length>0){
            coords = [this.data[0].lon,this.data[0].lat]
          }
       }
     }

     if(Object.entries($event).length === 0){
       this.filtersactive = false;

     }else{
       this.filtersactive = true;
       this.filterspoints = this.data;

     }

     setTimeout(() => {
       this.rebuildmap($event,coords);
     }, 100);




  }

  rebuildmap($event, coords){

    //fetch(environment.API_URL_BASE + "get-cpr-geojson")
    fetch("https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/get-cpr-geojson")
        .then(res => res.json())
        .then((out) => {
          this.makefromjson(out,$event,coords);
    }).catch(err => console.error(err));


  }

  makefromjson(json,$event, coords){
    let arrayfeacturesfilter = json.features;

    if($event.event!=null && ($event.event!=null && $event.event.value != 'No Filter')){
       arrayfeacturesfilter = arrayfeacturesfilter.filter(element => element.properties.move_type == $event.event.value);

    }

    if($event.chasis!=null){
      arrayfeacturesfilter = arrayfeacturesfilter.filter(element => element.id == $event.chasis);

    }

    if($event.georeference!=null && ($event.georeference!=null && $event.georeference.value != 'No Filter')){

      this.convertfeactures(json,arrayfeacturesfilter,$event.georeference.value,coords);
      //arrayfeacturesfilter = arrayfeacturesfilter.filter(element => element.geofences.find(geofence => geofence.name == $event.georeference.value) !=undefined);
      //          this.data = this.data.filter(element => element.geofences.find(geofence => geofence.name == $event.georeference.value) !=undefined );

    }else{
      json.features = arrayfeacturesfilter;
      setTimeout(() => {
        this.loading = false;
        this.buildmap(json,coords);
      }, 100);
    }





   }

   convertfeactures(json,arrayfeacturesfilter,value,coords){
     let geofences_array = [];
     for(var i = 0; i < arrayfeacturesfilter.length;i++){
       if(typeof arrayfeacturesfilter[i].geofences[0] == 'string'){

          let featurestring = arrayfeacturesfilter[i].geofences[0];
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
       json.features = geofences_array;
       setTimeout(() => {
         this.loading = false;
          this.buildmap(json,coords);
       }, 100);
   }

   getCenter(event){

     let coordinates = event.coordinates.split(',');
     const longitude = parseFloat(coordinates[0]);
    const latitude = parseFloat(coordinates[1]);


     this.mapView.goTo({
        center: [longitude, latitude],zoom:9
    })
    .catch(function(error) {
      if (error.name != "AbortError") {
         console.error(error);
      }
    });

   }


  getAllTable(){
    if(!this.filtersactive){
      this.data = this.dataGeneral;

    }else{
      this.data = this.filterspoints;
     }


  }




   filtersfromzoommap(x1,x2,y1,y2){

     setTimeout(() => {
       let datafilter = [];

       if(!this.filtersactive){
        // this.data = this.dataGeneral;
         for(var i = 0; i < this.dataGeneral.length;i++){
           if(x1 < this.dataGeneral[i].lat && x2 > this.dataGeneral[i].lat && y1 < this.dataGeneral[i].lon && y2 > this.dataGeneral[i].lon){
             datafilter.push(this.dataGeneral[i]);
           }

         }
         setTimeout(() => {

         this.data = datafilter;
       }, 100);
       }else{
         for(var a = 0; a < this.filterspoints.length;a++){
           if(x1 < this.filterspoints[a].lat && x2 > this.filterspoints[a].lat && y1 < this.filterspoints[a].lon && y2 > this.filterspoints[a].lon){
             datafilter.push(this.filterspoints[a]);
           }

         }

          setTimeout(() => {

         this.data = datafilter;
       }, 100);


       }




      }, 100);


     //this.data = this.data.filter(element => x1 < element.lon && x2 > element.lon &&   y1 < element.lat && y2 > element.lat);

  //   console.log(this.data);
   }


   filtersfrompointermove(x1,x2,y1,y2){
     let datafilter = [];
     for(var i = 0; i < this.dataGeneral.length;i++){
       if(x1 < this.dataGeneral[i].lat && x2 > this.dataGeneral[i].lat && y1 < this.dataGeneral[i].lon && y2 > this.dataGeneral[i].lon){
         datafilter.push(this.dataGeneral[i]);
       }
     }
   }

   formatstring(content){
     return content.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
   }

   downloadFile(//data: any
   ) {
     let arraytable = [];
     for(var i = 0; i < this.data.length;i++){
       arraytable.push(
         {
           Reference: this.data[i].reference,
           Date: this.data[i].date,
           Move_Type: this.formatstring(this.data[i].move_type),
           Geofences: this.data[i].georeference,
           Coordinates: this.data[i].coordinates
         }
       );
     }


     let data = arraytable;
    const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
    const header = ['Reference','Date','Move_Type','Geofences','Coordinates']; //Object.keys(data[0]);
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
    a.download = 'Information.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  isEmpty(str) {
    return (!str || 0 === str.length);
  }

  gotoroutemap(indice){
    console.log(indice);
  }

  getChecked($event){
    this.reload = $event;
   }

}
