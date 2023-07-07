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

    tokenDetails: any;
    token: any;
  constructor(
     private router?: Router,

  ) {


  }

  ngOnInit() {



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

  logout(){
      localStorage.removeItem('amplify-redirected-from-hosted-ui');
  }




}
