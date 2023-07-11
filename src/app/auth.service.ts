
import { Injectable } from '@angular/core';
import { CognitoUserPool, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import * as jwtDecode from 'jwt-decode';

@Injectable({
 providedIn: 'root'
})
export class AuthService {
 private userPool: CognitoUserPool;

 constructor() {
   const poolData = {
     UserPoolId: 'us-west-2_YKTiEMjtU',
     ClientId: 's7ch645u8voh00dridmn8kn19'
   };
   this.userPool = new CognitoUserPool(poolData);
 }

 authenticate(): Promise<CognitoUserSession> {
   return new Promise((resolve, reject) => {
     const cognitoUser = this.userPool.getCurrentUser();
     if (cognitoUser) {
       cognitoUser.getSession((err: Error, session: CognitoUserSession) => {
         if (err) {
           reject(err);
         } else if (!session.isValid()) {
           reject(new Error('Invalid session'));
         } else {
           resolve(session);
         }
       });
     } else {
       reject(new Error('No user found'));
     }
   });
 }

}
