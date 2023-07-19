// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_URL_BASE: process.env.API_URL_BASE,
  REGION_POOL: process.env.REGION_POOL,
  USER_POOL_ID: process.env.USER_POOL_ID,
  APP_POOL_ID: process.env.APP_POOL_ID,
  DOMAIN_SIGN: process.env.DOMAIN_SIGN,
  REDIRECT_SIGNIN: process.env.REDIRECT_SIGNIN,
  REDIRECT_SIGNOUT: process.env.REDIRECT_SIGNOUT,
  IDENTITY_PROVIDER: process.env.IDENTITY_PROVIDER
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
