import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-table-map',
  templateUrl: './table-map.component.html',
  styleUrls: ['./table-map.component.css']
})
export class TableMapComponent implements OnInit {
  data: any[];
  constructor(
   ) { }


  ngOnInit() {
    this.data = [
      {
        Load: "-",
        Equipment: "-",
        Equipment_Type: "-",
        Load_Empty: "-",
        Billed_Set_Temp: "-",
        PPS_Details: "-",
        Origin:  "-",
        Destination: "-",
        Last_Reported_Station: "-",
        Holds: "-",
        Equipment_Status: "-",
        Load_Status: "-",
        Grounded: "-",
        Eta: "-"
      },
      {
        Load: "-",
        Equipment: "-",
        Equipment_Type: "-",
        Load_Empty: "-",
        Billed_Set_Temp: "-",
        PPS_Details: "-",
        Origin:  "-",
        Destination: "-",
        Last_Reported_Station: "-",
        Holds: "-",
        Equipment_Status: "-",
        Load_Status: "-",
        Grounded: "-",
        Eta: "-"
      },
      {
        Load: "-",
        Equipment: "-",
        Equipment_Type: "-",
        Load_Empty: "-",
        Billed_Set_Temp: "-",
        PPS_Details: "-",
        Origin:  "-",
        Destination: "-",
        Last_Reported_Station: "-",
        Holds: "-",
        Equipment_Status: "-",
        Load_Status: "-",
        Grounded: "-",
        Eta: "-"
      },
      {
        Load: "-",
        Equipment: "-",
        Equipment_Type: "-",
        Load_Empty: "-",
        Billed_Set_Temp: "-",
        PPS_Details: "-",
        Origin:  "-",
        Destination: "-",
        Last_Reported_Station: "-",
        Holds: "-",
        Equipment_Status: "-",
        Load_Status: "-",
        Grounded: "-",
        Eta: "-"
      },
      {
        Load: "-",
        Equipment: "-",
        Equipment_Type: "-",
        Load_Empty: "-",
        Billed_Set_Temp: "-",
        PPS_Details: "-",
        Origin:  "-",
        Destination: "-",
        Last_Reported_Station: "-",
        Holds: "-",
        Equipment_Status: "-",
        Load_Status: "-",
        Grounded: "-",
        Eta: "-"
      },
      {
        Load: "-",
        Equipment: "-",
        Equipment_Type: "-",
        Load_Empty: "-",
        Billed_Set_Temp: "-",
        PPS_Details: "-",
        Origin:  "-",
        Destination: "-",
        Last_Reported_Station: "-",
        Holds: "-",
        Equipment_Status: "-",
        Load_Status: "-",
        Grounded: "-",
        Eta: "-"
      },
      {
        Load: "-",
        Equipment: "-",
        Equipment_Type: "-",
        Load_Empty: "-",
        Billed_Set_Temp: "-",
        PPS_Details: "-",
        Origin:  "-",
        Destination: "-",
        Last_Reported_Station: "-",
        Holds: "-",
        Equipment_Status: "-",
        Load_Status: "-",
        Grounded: "-",
        Eta: "-"
      }, 
    ];
  }

  ngAfterViewInit() {
  }

}