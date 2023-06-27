import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Auth } from 'aws-amplify';
import { Amplify } from 'aws-amplify'
import amplify from './aws-exports';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

Amplify.configure(amplify);

const oauth = {
  // Domain name
  domain: 'cpkc-chassis-management-dev.auth.us-west-2.amazoncognito.com',

  // Authorized scopes
  scope: ['email'],

  // Callback URL
  redirectSignIn: 'https://dev.d1klk34joigd80.amplifyapp.com/current-chassis-location',

  // Sign out URL
  redirectSignOut: 'https://cpkc-chassis-management-dev.auth.us-west-2.amazoncognito.com/oauth2/authorize?client_id=78fqe248a2ghet7oi0v94hbtnp&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fdev.d1klk34joigd80.amplifyapp.com%2Fcurrent-chassis-location',

  // 'code' for Authorization code grant,
  // 'token' for Implicit grant
  responseType: 'code',

  // optional, for Cognito hosted ui specified options
  options: {
    // Indicates if the data collection is enabled to support Cognito advanced security features. By default, this flag is set to true.
    AdvancedSecurityDataCollectionFlag: false,
  },
};

Auth.configure({
  oauth,
});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
