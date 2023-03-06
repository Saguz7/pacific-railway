import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-table-route-map',
  templateUrl: './table-route-map.component.html',
  styleUrls: ['./table-route-map.component.css']
})
export class TableRouteMapComponent implements OnInit {
  data: any[];
  cols: any[];
  @Input() Data: any;
  @Output() SendCenter = new EventEmitter<any>();

  constructor(private router: Router) { }


  ngOnInit() {

    this.cols = [
        { width: '4',field: 'num', header: 'N°' },
        { width: '48',field: 'lat', header: 'Latitude' },
        { width: '48',field: 'lon', header: 'Longitude' },

    ];
  }

  ngAfterViewInit() {
  }

  gotomapcenter(value){
    this.SendCenter.emit(value);

    console.log(value);
  }


}
