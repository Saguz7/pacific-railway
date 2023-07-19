import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { environment } from '../environments/environment';
import { Auth } from 'aws-amplify';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { Amplify } from 'aws-amplify'

import { CognitoService } from './core/services/cognito.service'; 
import { AuthService } from './auth.service';

import { CognitoUserPool, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pacific-railway';
  selectedProfile : any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private authService: AuthService,
  //  private sessionStorageService: SessionStorageService,
   private router?: Router,
   private cognitoService?: CognitoService,
   ) {
       }

    async ngOnInit() {
      console.log('v 1.0.1');



    }


}
