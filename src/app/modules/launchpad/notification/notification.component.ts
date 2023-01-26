
import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css']
  })

  export class NotificationComponent implements OnInit{
    @Input() IModel: any;
    @Input() Delete: any;
    @Input() Index: any;
    @Input() NameComponet: any;

    @Output() Ostatus = new EventEmitter<any>();

    ngOnInit() {

    }

    removeComponent(){
      this.Ostatus.emit({index: this.Index, nameComponet: this.NameComponet});

    }
  }
