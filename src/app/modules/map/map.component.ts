import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription ,Observable } from 'rxjs';
import { MapDivComponent } from './mapdiv/mapdiv.component';
import { MapStateService } from '../../core/services/map-state/map-state.service';
import {from} from 'rxjs';
import { loadModules } from 'esri-loader';
import { Router } from '@angular/router';
import { GEOJsonService } from '../../core/services/map/geojson.service';



import { saveAs } from 'file-saver';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})



export class MapComponent implements OnInit {
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
    private router : Router,
    private cdRef : ChangeDetectorRef,
    private CFR?: ComponentFactoryResolver,
    private cdref?: ChangeDetectorRef,
    private msService?: MapStateService,
    //private geojsonService?: GEOJsonService,


   ) { }

   @Output()

    ocultarFiltro:boolean;
    ocultarTabla:boolean;

    ngOnInit() {

      this.events = [];
      this.counterror = 0;

      this.data = [];
      this.dataGeneral = [];
      this.filterspoints = [];
      this.href = this.router.url;
      this.currentURL = window.location.href.replace(this.href,'');
    }

    ngAfterViewInit() {
      this.loading = true;
      this.getDatafromGeoJson();
      this.cdRef.detectChanges();
    }

    getDatafromGeoJson(){

      fetch("https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/get-cpr-geojson")
      .then(res => res.json())
      .then((out) => {
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


    }

    getData(): Observable<any> {
    return from(
      fetch(
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
        const map: __esri.Map = new Map({
          basemap: 'streets'
        });
        let urldirect = window.location.href.replace('/map','')
        const layer = new GeoJSONLayer({
          title: "Chasis",
          url: urljson,
          outFields: ["*"],
          popupTemplate: {
            title: 'Chasis <a href="https://saguz7.github.io/pacific-railway/ppsdetails/{id}" title="{id}">{id}</a>',
            content: "{id} - {move_type}",
          }
        });
        this.mapView = new MapView({
          container: this.mapViewEl.nativeElement,
          center: [-114.8574, 54.6542],
          zoom: 4,
          map: map,
          constraints: {
            minZoom : 3,
          },
        });
        map.add(layer);
        this.mapView.popup.viewModel.includeDefaultActions = false;
        let that = this;
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



                          //document.getElementById('vScale').innerHTML = '1:' + evt.toFixed(2);
                        });

                      // this.mapView.whenLayerView(layer).then(lv => {
                       this.mapView.whenLayerView(layer).then(lv => {
                           const layerView = lv;
                           const clusterConfig = {
                               type: "cluster",
                               clusterRadius: "100px",
                               popupTemplate: {
                                 title: "Cluster summary",
                                 content: "This cluster represents {cluster_count} chasis.",
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
                                               family: "Noto Sans",
                                               size: "12px"
                                           }
                                       },
                                       labelPlacement: "center-center"
                                   }
                               ]
                           };

                           layer.featureReduction = clusterConfig;

                           const toggleButton = document.getElementById("cluster");

                           toggleButton.addEventListener("click", () => {
                               let fr = layer.featureReduction;
                               layer.featureReduction =
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
                         const query = layer.createQuery();
                         query.aggregateIds = [geometry.graphic.getObjectId()];
                         layer.queryFeatures(query).then(result => {
                            const contentDiv = document.createElement("div");
                            return contentDiv
                        });
                       }

                       this.mapView.on("pointer-move",async (event) => {
                         //console.log(event);
                         this.mapView.popup.close();
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
                                 let title = 'Chasis <a href="https://saguz7.github.io/pacific-railway/ppsdetails/'+result['graphic'].attributes.id+'" title="'+result['graphic'].attributes.id+'">'+result['graphic'].attributes.id+'</a>';
                                 that.mapView.popup.open({
                                     // Set the popup's title to the coordinates of the clicked location
                                     title: title,
                                     content: result['graphic'].attributes.id + " - " + result['graphic'].attributes.move_type,
                                     location: result.mapPoint // Set the location of the popup to the clicked location
                                 });
                               }
                             }









                           }

                         });
                         /*

                         const response = await this.mapView.hitTest(event);
                         if(response.results.length>0){
                           const result = response.results[0];

                           //console.log(result);
                         //  console.log(result.type);
                         }
                         */
                       });

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
               {name: "Bensenville Intermodal Terminal", value: "Bensenville Intermodal Terminal"},
               {name: "Calgary Intermodal Terminal", value: "Calgary Intermodal Terminal"},
               {name: "Edmonton Intermodal Terminal", value: "Edmonton Intermodal Terminal"},
               {name: "Lachine Intermodal Terminal", value: "Lachine Intermodal Terminal"},
               {name: "Regina Intermodal Terminal", value: "Regina Intermodal Terminal"},
               {name: "Schiller Park Intermodal Terminal", value: "Schiller Park Intermodal Terminal"},
               {name: "Saint John Intermodal Terminal", value: "Saint John Intermodal Terminal"},
               {name: "Vaughan Intermodal Terminal", value: "Vaughan Intermodal Terminal"},
               {name: "Vancouver Intermodal Terminal", value: "Vancouver Intermodal Terminal"},
               {name: "Winnipeg Intermodal Terminal", value: "Winnipeg Intermodal Terminal"},
               {name: "Big Calgary Circle", value: "Big Calgary Circle"}

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
               for(var a = 0; a < features[i].geofences.length;a++){
                 geofences_array.push(
                   {
                     name: features[i].geofences[a].name
                   }
                 );
               }

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
                 }
               );
             }

           }

           formatdate(date){
             let dateformat = date.split(' ');
             return dateformat[0];
           }

  ocultar(){

    const map = document.querySelector('.esri-view');
    map.setAttribute('style', 'height: 600px');
    return (this.ocultarFiltro = true);
  }

  mostrar(){
    const map = document.querySelector('.esri-view');
    map.setAttribute('style', 'height: 300px');
    return(this.ocultarFiltro = false);
  }

  ocultarTab(){
    const map = document.querySelector('.esri-view');
    map.setAttribute('style', 'height: 600px');
    return (this.ocultarTabla = true);
  }

  mostrarTabla(){
    const map = document.querySelector('.esri-view');
    map.setAttribute('style', 'height: 300px');
    return(this.ocultarTabla = false);
  }

  getFilters($event){
    this.loading = true;
     this.data = this.dataGeneral;



     if($event.chasis!=null){
       this.data = this.data.filter(element => element.reference == $event.chasis);
     }else{
       if($event.event!=null){

         this.data = this.data.filter(element => element.move_type == $event.event.value);
       }
       if($event.georeference!=null){
          this.data = this.data.filter(element => element.geofences.find(geofence => geofence.name == $event.georeference.value) !=undefined );
       }
     }

     if(Object.entries($event).length === 0){
       this.filtersactive = false;

     }else{
       this.filtersactive = true;
       this.filterspoints = this.data;

     }

     setTimeout(() => {
       this.rebuildmap($event);
     }, 100);




  }

  rebuildmap($event){
    fetch("https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/get-cpr-geojson")
        .then(res => res.json())
        .then((out) => {
          this.makefromjson(out,$event);
    }).catch(err => console.error(err));
  }

  makefromjson(json,$event){
    let arrayfeacturesfilter = json.features;
    if($event.event!=null && ($event.event!=null && $event.event.value != 'No Filter')){
       arrayfeacturesfilter = arrayfeacturesfilter.filter(element => element.properties.move_type == $event.event.value);

    }

    if($event.chasis!=null){
      arrayfeacturesfilter = arrayfeacturesfilter.filter(element => element.id == $event.chasis);
    }

    if($event.georeference!=null && ($event.georeference!=null && $event.georeference.value != 'No Filter')){
      arrayfeacturesfilter = arrayfeacturesfilter.filter(element => element.geofences.find(geofence => geofence.name == $event.georeference.value) !=undefined);
      //          this.data = this.data.filter(element => element.geofences.find(geofence => geofence.name == $event.georeference.value) !=undefined );

    }



    json.features = arrayfeacturesfilter;
    setTimeout(() => {
      this.loading = false;

      this.buildmap(json);
    }, 100);

   }

   getCenter(event){
     let coordinates = event.coordinates.split(',');
     document.getElementById("esri-view").focus();
     this.mapView.goTo({
      center: [parseInt(coordinates[0]), parseInt(coordinates[1])]
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

   downloadFile(//data: any
   ) {
     let arraytable = [];
     for(var i = 0; i < this.data.length;i++){
       arraytable.push(
         {
           Reference: this.data[i].reference,
           Date: this.data[i].date,
           Move_Type: this.data[i].move_type,
           Coordinates: this.data[i].coordinates
         }
       );
     }


     let data = arraytable;
    const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
    const header = ['Reference','Date','Move_Type','Coordinates']; //Object.keys(data[0]);
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

}
