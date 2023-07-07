import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { environment } from '../environments/environment';
import { Auth } from 'aws-amplify';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pacific-railway';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  //  private sessionStorageService: SessionStorageService,
   private router?: Router,
   ) {
  }

    async ngOnInit() {
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
    }




}
