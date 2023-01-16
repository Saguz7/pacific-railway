import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';

declare var L: any;

@Component({
  selector: 'app-chasis',
  templateUrl: './chasis.component.html',
  styleUrls: ['./chasis.component.css']
})
export class ChasisComponent implements OnInit {
  @Input() Train: any;

  constructor(
    ) { }


  ngOnInit() {
  }

}
