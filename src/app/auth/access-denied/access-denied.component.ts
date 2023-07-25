import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
//import { SessionStorageService } from '../../core/services/sessionstorage.service';
declare var M: any;
import { AuthService } from '../services/auth.service';
import AWS from 'aws-sdk';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import jwt_decode from 'jwt-decode';
import { Amplify } from 'aws-amplify'
import process from 'process';
import { environment } from '../../../environments/environment';
 import { API } from 'aws-amplify';
@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css'],
})
export class AccessDeniedComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  selectedProfile : any;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private route: ActivatedRoute,
  //  private sessionStorageService: SessionStorageService,
   private router?: Router,
   ) {
  }

  async ngOnInit() {
    console.log(environment.API_URL_BASE);
    console.log(environment.REGION_POOL);
    console.log(environment.USER_POOL_ID);
    console.log(environment.APP_POOL_ID);
    console.log(environment.DOMAIN_SIGN);
    console.log(environment.REDIRECT_SIGNIN);
    console.log(environment.REDIRECT_SIGNOUT);
    console.log(environment.IDENTITY_PROVIDER); 

      if (!environment.API_URL_BASE) {
        console.log(environment.API_URL_BASE);

         console.log("environment.API_URL_BASE void");
       }
       if (!environment.REGION_POOL) {
         console.log(environment.REGION_POOL);

         console.log("environment.REGION_POOL void");
       }
       if (!environment.USER_POOL_ID) {
         console.log(environment.USER_POOL_ID);

         console.log("environment.USER_POOL_ID void");
       }
       if (!environment.APP_POOL_ID) {
         console.log(environment.APP_POOL_ID);

         console.log("environment.APP_POOL_ID void");
       }
       if (!environment.DOMAIN_SIGN) {
         console.log(environment.DOMAIN_SIGN);

         console.log("environment.DOMAIN_SIGN void");
       }
       if (!environment.REDIRECT_SIGNIN) {
         console.log(environment.REDIRECT_SIGNIN);

         console.log("environment.REDIRECT_SIGNIN void");
       }
       if (!environment.REDIRECT_SIGNOUT) {
         console.log(environment.REDIRECT_SIGNOUT);

         console.log("environment.REDIRECT_SIGNOUT void");
       }
       if (!environment.IDENTITY_PROVIDER) {
         console.log(environment.IDENTITY_PROVIDER);

         console.log("environment.IDENTITY_PROVIDER void");
       } else {

         /*
         try {
           await Auth.federatedSignIn();
           console.log('Sucess');


         } catch (error) {
          console.error('Error', error);
         }

         */
       }

  }



  gotoLogin(){
    const externalUrl = 'https://cpkc-chassis-management-dev.auth.us-west-2.amazoncognito.com/oauth2/authorize?client_id=78fqe248a2ghet7oi0v94hbtnp&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fdev.d1klk34joigd80.amplifyapp.com%2Fcurrent-chassis-location';
    window.location.href = externalUrl;
  }



}
