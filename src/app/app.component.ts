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
import awsConfigProfile1 from './aws-exports-profile1';
import awsConfigProfile2 from './aws-exports-profile2';
import awsConfigProfile3 from './aws-exports-profile3';
import awsConfigProfile4 from './aws-exports-profile4';
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

     /*
     this.authService.authenticate().then(session => {
        alert(session.getIdToken().getJwtToken());
         }).catch(err => {
           console.error(err);
         });

         */
       }

    async ngOnInit() {

      /*
      try {
             const session = await Auth.currentSession();
             if(session){
               const accessToken = session.getAccessToken().getJwtToken();
               const idToken = session.getIdToken().getJwtToken();
               const refreshToken = session.getRefreshToken().getToken();
               const decodedToken: any = jwt_decode(accessToken);
               const userPoolId = 'us-west-2_YKTiEMjtU';
               const userPoolWebClientId = 's7ch645u8voh00dridmn8kn19';
               const iss = decodedToken.iss;
               const parts = iss.split('/');
               const lastPart = parts.pop();

               console.log(accessToken);
               console.log(lastPart);
               console.log(userPoolId);
               console.log(decodedToken.client_id);
               console.log(userPoolWebClientId);


               if (
                 lastPart ==  userPoolId &&
                 decodedToken.client_id == userPoolWebClientId
               ) {
                 console.log('Access.');
               } else {
                 console.log('Denied.');
               }
             }

           } catch (error) {
             this.router.navigate(['access-denied']); // Redirigir a la página de inicio de sesión

             console.error('Error al obtener los datos de sesión:', error);
           }
      */
    }






    async optionOne(){
        this.selectedProfile = 'profile1';
        this.updateAmplifyConfig();

    }

    async optionTwo(){

        this.selectedProfile = 'profile2';
        this.updateAmplifyConfig();
    }

    async optionThree(){
      this.selectedProfile = 'profile3';
      this.updateAmplifyConfig();
    }

    async optionFour(){
      this.selectedProfile = 'profile4';
      this.updateAmplifyConfig();
    }

     async updateAmplifyConfig() {
       let selectedConfig;

      if(this.selectedProfile == 'profile1'){
        selectedConfig = awsConfigProfile1;

      }

      if(this.selectedProfile == 'profile2'){
        selectedConfig = awsConfigProfile2;

      }

      if(this.selectedProfile == 'profile3'){
        selectedConfig = awsConfigProfile3;

      }

      if(this.selectedProfile == 'profile4'){
        selectedConfig = awsConfigProfile4;

      }

      console.log(selectedConfig);

      Amplify.configure(selectedConfig);

      try {
       await Auth.federatedSignIn();
       console.log('Sucess');
      } catch (error) {
       console.error('Error', error);
      }

    }

}
