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
        { width: '10',field: 'num', header: 'N°' },
        { width: '12',field: 'lat', header: 'Latitude' },
        { width: '12',field: 'lon', header: 'Longitude' },
        { width: '12',field: 'move_type_format', header: 'Move Type' },
        { width: '12',field: 'date', header: 'Date' },
        { width: '10',field: 'total_distance', header: 'Total Distance' },
        { width: '10',field: 'traveled_distance', header: 'Traveled Distance' },
        { width: '16',field: 'georeference', header: 'Geofence' }

    ];
  }

  ngAfterViewInit() {
  }

  isEmpty(str) {
    return (!str || 0 === str.length);
  }

  gotomapcenter(value){
    this.SendCenter.emit(value);

  }


}
