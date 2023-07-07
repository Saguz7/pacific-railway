import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Auth } from 'aws-amplify';
import { Amplify } from 'aws-amplify'
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

let config = {
  Auth: {
    region: 'us-west-2',
    userPoolId: 'us-west-2_YKTiEMjtU',
    userPoolWebClientId: 's7ch645u8voh00dridmn8kn19',
    oauth: {
        domain: 'cpkc-chassis-management-dev.auth.us-west-2.amazoncognito.com',
        scope: ['email', 'openid','phone'],
        redirectSignIn: 'https://dev.d1klk34joigd80.amplifyapp.com/current-chassis-location',
        redirectSignOut: 'https://dev.d1klk34joigd80.amplifyapp.com/current-chassis-location',
        responseType: 'code'
    }
  }
}

Amplify.configure(config);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
