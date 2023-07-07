import { Injectable } from '@angular/core';
import { CognitoConfig } from './cognito-config';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userPool: AmazonCognitoIdentity.CognitoUserPool;

  constructor() {
    this.userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: CognitoConfig.userPoolId,
      ClientId: CognitoConfig.clientId
    });
  }

  login(email: string, password: string): Promise<any> {
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: email,
      Password: password
    });

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username: email,
      Pool: this.userPool
    });

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          console.log(result);
          const accessToken = result.getAccessToken().getJwtToken();
          localStorage.setItem('accessToken', accessToken);
          resolve(result);
        },
        onFailure: (error) => {
          reject(error);
        }
      });
    });
  }


  changePassword(email: string, oldPassword: string, newPassword: string): Promise<any> {
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
    Username: email,
    Pool: this.userPool
  });

  return new Promise((resolve, reject) => {
    cognitoUser.changePassword(oldPassword, newPassword, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

  logout() {
    localStorage.removeItem('accessToken');
  }
}
