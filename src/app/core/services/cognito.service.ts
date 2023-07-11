import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoAuth } from 'amazon-cognito-auth-js';

@Injectable(
  {
  providedIn: 'root'
  }
)
export class CognitoService {

  authData: any;
  auth: any;
  session: any;

  constructor(private router : Router//, public authConfiguration: any
  ) {
    //this.getAuthInstance();
  }
  getAuthInstance(authConfiguration) {
    /*
    this.authData = {
      UserPoolId: 'us-east-2_C9pPbW4cf',
      ClientId: '4mlir4v2on4jjbeg79de6vasbf',
      AppWebDomain: 'demo-saguz.auth.us-east-2.amazoncognito.com',
      TokenScopesArray: [  'email','openid'],
      RedirectUriSignIn: 'http://localhost:4400/current-chassis-location',
       RedirectUriSignOut: 'https://localhost:4400',
      AdvancedSecurityDataCollectionFlag: false

    }
    */

    this.authData = authConfiguration

    this.auth = new CognitoAuth(this.authData);

    this.auth.userhandler = {
      onSuccess: session => {
        console.log('Signin success');
        this.signedIn(session);
      },
      onFailure: error => {
        console.log('Error: ' + error);
        this.onFailureMethod();
      }
    }

    //alert(this.router.url);
    //this.auth.useCodeGrantFlow();
    this.auth.parseCognitoWebResponse(this.router.url);
  }

  signedIn(session) {
    this.session = session;
  }

  onFailureMethod() {
    this.session = undefined;
  }

  get accessToken() {
    return this.session && this.session.getAccessToken().getJwtToken();
  }

  get isAuthenticated() {
    return this.auth.isUserSignedIn();
  }

  login() {
    this.auth.getSession();
    this.auth.parseCognitoWebResponse(this.router.url);
    console.log(this.router.url);
  }

  signOut() {
    this.auth.signOut();
  }
}
