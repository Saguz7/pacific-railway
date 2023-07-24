import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Auth } from 'aws-amplify';
import { Amplify } from 'aws-amplify'
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

let config = {
  Auth: {
    region: process.env.REGION_POOL,
    userPoolId: process.env.USER_POOL_ID,
    userPoolWebClientId: process.env.APP_POOL_ID,
    oauth: {
      domain: process.env.DOMAIN_SIGN,
      scope: ['email', 'openid'],
      redirectSignIn: process.env.REDIRECT_SIGNIN,
      redirectSignOut: process.env.REDIRECT_SIGNOUT,
      responseType: 'token',
      identityProvider: process.env.IDENTITY_PROVIDER,
      samlSignOut: true,
      attributesMapping: {
        email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
      }
    }
  }
}

Amplify.configure(config);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
