
import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { NotificationComponent } from './notification/notification.component';



@Component({
    selector: 'app-launchpad',
    templateUrl: './launchpad.component.html',
    styleUrls: ['./launchpad.component.css']
  })

  export class LaunchpadComponent implements OnInit{

      @ViewChild('viewContainerRef', { read: ViewContainerRef, static: false }) VCR: ViewContainerRef;
      index: number = 0;
      componentsReferences = [];
      indexoption: number = 0;

      constructor(
        private CFR?: ComponentFactoryResolver,
        private cdref?: ChangeDetectorRef
      ) {
      }
    ngOnInit() {


    }

    addNotification(){
      let componentFactory = this.CFR.resolveComponentFactory(NotificationComponent);
      let componentRef: ComponentRef<any> = this.VCR.createComponent(componentFactory);
      let currentComponent = componentRef.instance;
      currentComponent.selfRef = currentComponent;
      componentRef.instance.IModel = {};
      componentRef.instance.NameComponet = 'Notification'+this.componentsReferences.length;

      componentRef.instance.Delete = false;
      componentRef.instance.Index = this.componentsReferences.length;
      componentRef.instance.Ostatus.subscribe(val => this.remove(val['index'],val['nameComponet']));
      currentComponent.index = this.componentsReferences.length;
      currentComponent.compInteraction = this;
      this.componentsReferences.push(componentRef); 

    }

    addNotificationCancel(){
      let componentFactory = this.CFR.resolveComponentFactory(NotificationComponent);
      let componentRef: ComponentRef<any> = this.VCR.createComponent(componentFactory);
      let currentComponent = componentRef.instance;
      currentComponent.selfRef = currentComponent;
      componentRef.instance.IModel = {};
      componentRef.instance.NameComponet = 'Notification'+this.componentsReferences.length;
      componentRef.instance.Delete = true;
      componentRef.instance.Index = this.componentsReferences.length;
      componentRef.instance.Ostatus.subscribe(val => this.remove(val['index'],val['nameComponet']));
      currentComponent.index = this.componentsReferences.length;
      currentComponent.compInteraction = this;
      this.componentsReferences.push(componentRef);
     }


    remove(index: number, nameComponet: any) {
      if (this.VCR.length < 1)
        return;
      let componentRef = this.componentsReferences.filter(x => x.instance.NameComponet == nameComponet)[0];
      let vcrIndex: number = this.componentsReferences.indexOf(componentRef);
      this.VCR.remove(vcrIndex);
      this.componentsReferences = this.componentsReferences.filter(x => x.instance.NameComponet !== nameComponet);
    }

    changeOption($event){
      this.indexoption = $event;
    }
  }
