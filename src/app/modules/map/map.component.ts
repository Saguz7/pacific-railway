import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { MapDivComponent } from './mapdiv/mapdiv.component';

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

  constructor(
    private CFR?: ComponentFactoryResolver,
    private cdref?: ChangeDetectorRef,
   ) { }


  ngOnInit() {
    }

  ngAfterViewInit() {
  }

}
