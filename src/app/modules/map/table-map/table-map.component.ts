import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-table-map',
  templateUrl: './table-map.component.html',
  styleUrls: ['./table-map.component.css']
})
export class TableMapComponent implements OnInit {
  data: any[];
  cols: any[];
  @Input() Data: any;
  @Output() SendCenter = new EventEmitter<any>();

  constructor(private router: Router) { }


  ngOnInit() {

    this.cols = [
        { field: 'reference', header: 'Reference' },
        { field: 'date', header: 'Date' },
        { field: 'move_type', header: 'Move Type' },
        { field: 'georeference', header: 'Geofences' },

        { field: 'coordinates', header: 'Coordinates' },
        { field: 'routemap', header: 'Route Map' },


    ];


/*
        this.cols = [
            { field: 'load', header: 'Load' },
            { field: 'equipment', header: 'Equipment' },
            { field: 'equipment_type', header: 'Equipment_Type' },
            { field: 'load_empty', header: 'Load_Empty' },
            { field: 'billed_set_temp', header: 'Billed_Set_Temp' },
            { field: 'pps_details', header: 'PPS_Details' },
            { field: 'origin', header: 'Origin' },
            { field: 'destination', header: 'Destination' },
            { field: 'last_reported_station', header: 'Last_Reported_Station' },
            { field: 'holds', header: 'Holds' },
            { field: 'equipment_status', header: 'Equipment_Status' },
            { field: 'load_status', header: 'Load_Status' },
            { field: 'grounded', header: 'Grounded' },
            { field: 'eta', header: 'Eta' }

        ];

        */


/*
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

    */
  }

  ngAfterViewInit() {
  }

  formatstring(content){
    return content.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  formatdate(date){
    let dateformat = date.split(' ');
    return dateformat[0];
  }

  gotoppsdetails(reference){
    this.router.navigate([`ppsdetails`,  reference ]);

  }

  gotoroutemap(reference){
    this.router.navigate([`routemap`,  reference ]);
  }

  gotocentermap(object){
    console.log(object);
    this.SendCenter.emit(object);

  }

}
