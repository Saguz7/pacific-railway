import { ComponentRef, ComponentFactoryResolver, ChangeDetectorRef, HostListener, ViewContainerRef, ViewChild, Component, OnInit, Input, Output, EventEmitter,ElementRef,AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-filter-map',
  templateUrl: './filter-map.component.html',
  styleUrls: ['./filter-map.component.css']
})
export class FilterMapComponent implements OnInit {
   form: FormGroup;
   companies: any[];
   load_emptys: any[];
   equipment_status: any[];
   equipment_types: any[];
   load_status: any[];

  constructor(
    private formBuilder: FormBuilder,
   ) { }


  ngOnInit() {
    this.form = this.formBuilder.group({
      search: this.formBuilder.control('',  []),
      selectedOption: this.formBuilder.control('',  []),
      company: this.formBuilder.control('',  []),
      load_empty: this.formBuilder.control('',  []),
      origin: this.formBuilder.control('',  []),
      stripper: this.formBuilder.control('',  []),
      destination: this.formBuilder.control('',  []),
      consignee: this.formBuilder.control('',  []),
      last_report_station: this.formBuilder.control('',  []),
      equipment_status: this.formBuilder.control('',  []),
      equipment_type: this.formBuilder.control('',  []),
      load_status: this.formBuilder.control('',  []),
      storage_guarantee: this.formBuilder.control('',  []),
      pickup_number: this.formBuilder.control('',  []),
    });

    this.companies= [
      {name: 'A', value: 1},
      {name: 'B', value: 2}
    ]

    this.load_emptys = [
      {name: 'Load', value: 1},
      {name: 'Empty', value: 2},
    ]

    this.equipment_status = [
      {name: 'A', value: 1},
      {name: 'B', value: 2},
      {name: 'C', value: 2},
    ]

    this.equipment_types= [
      {name: 'A', value: 1},
      {name: 'B', value: 2},
      {name: 'C', value: 2},
    ]

    this.load_status = [
      {name: 'A', value: 1},
      {name: 'B', value: 2},
      {name: 'C', value: 2},
    ];
  }

  ngAfterViewInit() {
  }

  submit(event){
    console.log(event);
  }

}
