
import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-navlaunch',
    templateUrl: './navlaunch.component.html',
    styleUrls: ['./navlaunch.component.css']
  })

  export class NavlaunchComponent implements OnInit{
    
    ngOnInit() {
      
    }
  }