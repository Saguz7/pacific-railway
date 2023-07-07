

import { Injectable } from '@angular/core';
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import * as AWS from 'aws-sdk';

const poolData = {
  UserPoolId: 's7ch645u8voh00dridmn8kn19',
  ClientId: 'us-west-2_YKTiEMjtU'
};

@Injectable()
export class AuthService {
  federateSignIn(provider: string): Promise<any> {
    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = userPool.getCurrentUser();

    return new Promise((resolve, reject) => {
      if (cognitoUser) {
        cognitoUser.getSession((err, session) => {
          if (err) {
            reject(err);
          } else {
            const authenticationProvider = `cognito-idp.${poolData.UserPoolId.split('_')[0]}.amazonaws.com/${poolData.UserPoolId}`;
            const token = session.getIdToken().getJwtToken();
            const logins = {
              [authenticationProvider]: token
            };

            const params = {
              IdentityPoolId: 's7ch645u8voh00dridmn8kn19',
              Logins: logins
            };

            const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
            cognitoIdentityServiceProvider.getCredentialsForIdentity(params, (err, data) => {
              if (err) {
                reject(err);
              } else {
                AWS.config.credentials = data.Credentials;
                resolve(AWS.config.credentials);
              }
            });
          }
        });
      } else {
        reject('No se encontró un usuario de Cognito');
      }
    });
  }
}
