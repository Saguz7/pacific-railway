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
   companies_options: any[];
   load_emptys_options: any[];
   equipment_status_options: any[];
   equipment_types_options: any[];
   load_status_options: any[];
   selectedOption: any;
   search: any;
   event_select: any;
   georeference_select: any;
   chasis: any;

   @Input() Events: any;
   @Input() Georeferences: any;

  constructor(
    private formBuilder: FormBuilder,
   ) { }

   @Output() ocultarBarra:boolean;
   @Output() SendFilters = new EventEmitter<any>();

  ngOnInit() {

    /*
    this.form = this.formBuilder.group({
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

    */

    this.companies_options= [
      {name: 'A', value: 1},
      {name: 'B', value: 2}
    ]

    this.load_emptys_options = [
      {name: 'Load', value: 1},
      {name: 'Empty', value: 2},
    ]

    this.equipment_status_options = [
      {name: 'A', value: 1},
      {name: 'B', value: 2},
      {name: 'C', value: 2},
    ]

    this.equipment_types_options= [
      {name: 'A', value: 1},
      {name: 'B', value: 2},
      {name: 'C', value: 2},
    ]

    this.load_status_options = [
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

  verForms(){
    let keys_form = Object.keys(this.form['value']);
    let count = 0;
    for(var i = 0; i < keys_form.length;i++){
      if(!this.isEmpty(this.form['value'][keys_form[i]])){
        count++;
      }
    }
    return count;

  }

  getFormsInitialized(){
    let keys_form = Object.keys(this.form['value']);
    let count = 0;
    for(var i = 0; i < keys_form.length;i++){
      if(!this.isEmpty(this.form['value'][keys_form[i]])){
        count++;
      }
    }
    return count;

  }


     isEmpty(str) {
       return (!str || 0 === str.length);
     }

     ocultar(){
      return (this.ocultarBarra = true);
    }

    mostrar(){
      return(this.ocultarBarra = false);
    }


    send_filter(){
       let objsend = {};
       console.log(this.event_select);
       console.log(this.georeference_select);
       console.log(this.chasis);

      if(this.event_select!=null){
        objsend['event'] =  this.event_select;
      }
      if(this.georeference_select!=null){
        objsend['georeference'] =  this.georeference_select;
      }
      if(this.chasis!=null && !this.isEmpty(this.chasis)){
        objsend['chasis'] = this.chasis
      }
      console.log(objsend);

      this.SendFilters.emit(objsend);

    }

    deleteoptions(){
      this.event_select = null;
      this.georeference_select = null;
    }

    deletechasis(){
      this.chasis = null;
    }

    resetFilters(){
      this.event_select = null;
      this.georeference_select = null;
      this.chasis = null;
    }

}
