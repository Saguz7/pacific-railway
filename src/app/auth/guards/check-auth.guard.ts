import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const redirectedFromHostedUI = localStorage.getItem('amplify-redirected-from-hosted-ui');

    if (redirectedFromHostedUI) {
       return true;
    } else {
       this.router.navigate([`access-denied`]);
       return false;

      /*
       const externalUrl = 'https://cpkc-chassis-management-dev.auth.us-west-2.amazoncognito.com/oauth2/authorize?client_id=78fqe248a2ghet7oi0v94hbtnp&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fdev.d1klk34joigd80.amplifyapp.com%2Fcurrent-chassis-location';
       window.location.href = externalUrl;
      return false;

      */
    }
  }
}
