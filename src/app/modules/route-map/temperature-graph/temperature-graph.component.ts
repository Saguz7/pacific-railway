import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-temperature-graph',
  templateUrl: './temperature-graph.component.html',
  styleUrls: ['./temperature-graph.component.css']
})
export class TemperatureGraphComponent implements OnInit {
  data: any[];
  basicData: any;
  basicOptions: any;
  constructor(
   ) { }


  ngOnInit() {
    this.basicData = {
         labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
         datasets: [
             {
                 label: 'First Dataset',
                 data: [65, 59, 80, 81, 56, 55, 40],
                 fill: false,
                 borderColor: '#42A5F5',
                 tension: .4
             },
             {
                 label: 'Second Dataset',
                 data: [28, 48, 40, 19, 86, 27, 90],
                 fill: false,
                 borderColor: '#FFA726',
                 tension: .4
             }
         ]
     };

     this.basicOptions = {
          plugins: {
              legend: {
                  labels: {
                      color: '#ebedef'
                  }
              }
          },
          scales: {
              x: {
                  ticks: {
                      color: '#ebedef'
                  },
                  grid: {
                      color: 'rgba(255,255,255,0.2)'
                  }
              },
              y: {
                  ticks: {
                      color: '#ebedef'
                  },
                  grid: {
                      color: 'rgba(255,255,255,0.2)'
                  }
              }
          }
      };


  }

  ngAfterViewInit() {
  }

}
