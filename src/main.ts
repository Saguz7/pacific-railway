import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Auth } from 'aws-amplify';
import { Amplify } from 'aws-amplify'
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

 Amplify.configure({
 API_URL_BASE: process.env.API_URL_BASE,
 REGION_POOL: process.env.REGION_POOL,
 USER_POOL_ID: process.env.USER_POOL_ID,
 APP_POOL_ID: process.env.APP_POOL_ID,
 DOMAIN_SIGN: process.env.DOMAIN_SIGN,
 REDIRECT_SIGNIN: process.env.REDIRECT_SIGNIN,
 REDIRECT_SIGNOUT: process.env.REDIRECT_SIGNOUT,
 IDENTITY_PROVIDER: process.env.IDENTITY_PROVIDER,
});

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
