// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_URL_BASE: 'https://49xa6kx3g6.execute-api.us-west-2.amazonaws.com/dev/',
  region: 'YOUR_REGION_ID',
 userPoolId: 'YOUR_USER_POOL_ID',
 clientId: 'YOUR_CLIENT_ID',
 sso_api_username: 'us-west-2_YKTiEMjtU',
 sso_api_pwd: 's7ch645u8voh00dridmn8kn19',
 loginURL: 'https://cpkc-chassis-management-dev.auth.us-west-2.amazoncognito.com/oauth2/authorize?client_id=s7ch645u8voh00dridmn8kn19&response_type=token&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fdev.d1klk34joigd80.amplifyapp.com%2Fcurrent-chassis-location',

 redirectURL: 'https://dev.d1klk34joigd80.amplifyapp.com/current-chassis-location',

 cognitoTokenURL: 'https://cpkc-chassis-management-dev.auth.us-west-2.amazoncognito.com/oauth2/token',

 logout: 'https://cpkc-chassis-management-dev.auth.us-west-2.amazoncognito.com/logout?' +
         'client_id=s7ch645u8voh00dridmn8kn19&' +
         'logout_uri=https://dev.d1klk34joigd80.amplifyapp.com/current-chassis-location'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
