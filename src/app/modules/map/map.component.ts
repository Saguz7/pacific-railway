import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { MapDivComponent } from './mapdiv/mapdiv.component';

declare var L: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  lat = 54.6542;
  lng = -114.8574;
  viewmap = true;
  markerpoints = [];

  @ViewChild('viewContainerRef', { read: ViewContainerRef, static: false }) VCR: ViewContainerRef;
  index: number = 0;
  componentsReferences = [];

  constructor(
    private CFR?: ComponentFactoryResolver,
    private cdref?: ChangeDetectorRef,
  ) { }


  ngOnInit() {

/*
    window.onload = function() {
       L.mapquest.key = 'FM9hgjXyKly2nJK9eagKmGG6DqGAZrqq';

       var map = L.mapquest.map('map', {
         center: [54.6542, -114.8574],
         layers: L.mapquest.tileLayer('map'),
         zoom: 12
       });

       L.marker([54.6542, -114.8574], {
          icon: L.mapquest.icons.marker(),
          draggable: false
        }).bindPopup('Point 1').addTo(map).on('click', function(e) {
           console.log(e.latlng);
       });

       L.mapquest.control().addTo(map);
       L.mapquest.geocodingControl().addTo(map);
     }

     */




  }

  ngAfterViewInit() {

  //  this.cdref.detectChanges();

  }

  buildMap(){

    L.mapquest.key = 'FM9hgjXyKly2nJK9eagKmGG6DqGAZrqq';

      var map = L.mapquest.map('map', {
        center: [39.7392, -104.9903],
        layers: L.mapquest.tileLayer('map'),
        zoom: 6
      });

      L.marker([39.7392, -104.9903], {
        icon: L.mapquest.icons.marker(),
        draggable: false
      }).bindPopup('Denver, CO').addTo(map);

      L.circle([38.8339, -104.8214], { radius: 20000 }).addTo(map);

      var denverLatLngs = [
        [36.99, -102.05],
        [37, -109.05],
        [41, -109.05],
        [41, -102.05]
      ];

      L.polygon(denverLatLngs, {color: 'red'}).addTo(map);


    /*

    L.mapquest.key = 'FM9hgjXyKly2nJK9eagKmGG6DqGAZrqq';

    var map = L.mapquest.map('map', {
      center: [54.6542, -114.8574],
      layers: L.mapquest.tileLayer('map'),
      zoom: 8
    });

    this.markerpoints = [
      {
        coords: [54.6542, -114.8574],
        train: {
          name: 'Train 1'
        }
      },
      {
        coords: [54.9542, -115.8574],
        train: {
          name: 'Train 2'
        }
      }
     ]
    let that = this;


    for(var i =0; i < this.markerpoints.length;i++){
      let indice = i;
      L.marker(this.markerpoints[i].coords, {
         icon: L.mapquest.icons.marker(),
         draggable: false
       }).bindPopup(this.markerpoints[i].train.name).addTo(map).on('click', function(e) {
        //  console.log(e.latlng);
        that.searchInfoTrain(indice);
      });

    }



    L.mapquest.control().addTo(map);
    L.mapquest.geocodingControl().addTo(map);

    */

    /*
    let componentFactory = this.CFR.resolveComponentFactory(MapDivComponent);
    let componentRef: ComponentRef<any> = this.VCR.createComponent(componentFactory);
    let currentComponent = componentRef.instance;
    currentComponent.selfRef = currentComponent;
    componentRef.instance.IModel = [];
    componentRef.instance.NameComponet = 'Map';
    currentComponent.index = 0;
    currentComponent.compInteraction = this;
    this.componentsReferences.push(componentRef);

    */

  }

  searchInfoTrain(indice){
    console.log(indice);
  }

}
