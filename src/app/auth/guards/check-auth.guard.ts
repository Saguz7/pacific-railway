import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Auth } from 'aws-amplify';
import jwt_decode from 'jwt-decode';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const session = user.getSignInUserSession();
      if (session) {
        const accessToken = session.getAccessToken().getJwtToken();
         const idToken = session.getIdToken().getJwtToken();
        const refreshToken = session.getRefreshToken().getToken();
        const decodedToken: any = jwt_decode(accessToken);
        const userPoolId = environment.USER_POOL_ID;
        const userPoolWebClientId = environment.APP_POOL_ID;
        const iss = decodedToken.iss;
        const parts = iss.split('/');
        const lastPart = parts.pop();
        if (lastPart == userPoolId && decodedToken.client_id == userPoolWebClientId) {
          return true;
        } else {
          this.router.navigate(['access-denied']);
          return false;
        }
      } else {
        this.router.navigate(['access-denied']);
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
      this.router.navigate(['access-denied']);
      return false;
    }
  }
}
