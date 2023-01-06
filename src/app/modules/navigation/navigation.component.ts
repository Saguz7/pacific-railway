import { Component,OnInit,HostListener } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit{

  loged: boolean = false;
  display: boolean = false;
  mostramenu: boolean = false;
  user: any;
  items: MenuItem[];
  items2: MenuItem[];

  constructor(
     private router?: Router,

  ) {


  }

  ngOnInit() {

    this.loged= true;

    this.user = {
      name: 'name',
      lastname: 'lastname'
    }
      this.items = [
            {label: 'Map',icon: 'pi pi-fw pi-home',command: (event: any) => {
              this.router.navigateByUrl('/map');
             }},


        ];


        this.items2 =  [
            {
            icon:'pi pi-fw pi-home',
            items:[
                {
                    label:'Map',command: (event: any) => {
                      this.router.navigateByUrl('/home');
                    }
                }
            ]
          }

        ];



        setTimeout(() => {

           (<any>$(".dropdown-trigger")).dropdown('');

            $(document).ready(function(){
               (<any>$(".sidenav")).sidenav();

            });
       }, 100);

  }


  mostrarmenuusuario(){
    let menu = (<HTMLInputElement>document.getElementById("menuresponsivo"));

  }

  goHome(){
    this.router.navigateByUrl('/map');
    $(document).ready(function(){
       (<any>$(".sidenav")).printArea('close');
     });
  }

  logout(){}




}
