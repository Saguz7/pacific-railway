import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-pps-details',
  templateUrl: './pps-details.component.html',
  styleUrls: ['./pps-details.component.css']
})
export class PpsDetailsComponent implements OnInit {

  constructor(
   ) { }


  ngOnInit() {
    }

  ngAfterViewInit() {
  }

}
