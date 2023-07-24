import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Auth } from 'aws-amplify';
import { Amplify } from 'aws-amplify';
import { AppModule } from './app/app.module';

import { environment } from './environments/environment';
Amplify.configure({
  Auth: {
    region: environment.REGION_POOL,
    userPoolId: environment.USER_POOL_ID,
    userPoolWebClientId: environment.APP_POOL_ID,
    oauth: {
      domain: environment.DOMAIN_SIGN,
      scope: ['email', 'openid'],
      redirectSignIn: environment.REDIRECT_SIGNIN,
      redirectSignOut: environment.REDIRECT_SIGNOUT,
      responseType: 'token',
      identityProvider: environment.IDENTITY_PROVIDER,
      samlSignOut: true,
      attributesMapping: {
        email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
      },
    },
  },
});


if (process.env.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
/*
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Auth } from 'aws-amplify';
import { Amplify } from 'aws-amplify'
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

let config = {
  Auth: {
    region: environment.REGION_POOL,
    userPoolId: environment.USER_POOL_ID,
    userPoolWebClientId: environment.APP_POOL_ID,
    oauth: {
      domain: environment.DOMAIN_SIGN,
      scope: ['email', 'openid'],
      redirectSignIn: environment.REDIRECT_SIGNIN,
      redirectSignOut: environment.REDIRECT_SIGNOUT,
      responseType: 'token',
      identityProvider: environment.IDENTITY_PROVIDER,
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

  */
