import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Auth } from 'aws-amplify';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  async canActivate(): Promise<boolean> {
    const session = await Auth.currentSession();
    console.log(session);
    if (session) {
      const accessToken = session.getAccessToken().getJwtToken();
      const idToken = session.getIdToken().getJwtToken();
      const refreshToken = session.getRefreshToken().getToken();
      const decodedToken: any = jwt_decode(accessToken);
      const userPoolId = 'us-west-2_YKTiEMjtU';
      const userPoolWebClientId = 's7ch645u8voh00dridmn8kn19';
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
  }
}
