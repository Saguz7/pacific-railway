import { Component, OnInit } from '@angular/core';


import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pacific-railway';

  ngOnInit() {
    console.log(environment.API_URL);
    }

}
