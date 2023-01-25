
import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-launchpad',
    templateUrl: './launchpad.component.html',
    styleUrls: ['./launchpad.component.css']
  })

  export class LaunchpadComponent implements OnInit{

    ngOnInit() {

    }
  }