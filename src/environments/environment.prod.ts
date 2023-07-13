export const environment = {
  production: true,
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
export const environment = {
  production: true,
  API_URL_BASE: process.env.API_URL_BASE,
  REGION_POOL: 'us-west-2',
  USER_POOL_ID: 'us-west-2_YKTiEMjtU',
  APP_POOL_ID: 's7ch645u8voh00dridmn8kn19',
  DOMAIN_SIGN: 'cpkc-chassis-management-dev.auth.us-west-2.amazoncognito.com',
  REDIRECT_SIGNIN: 'https://dev.d1klk34joigd80.amplifyapp.com/current-chassis-location',
  REDIRECT_SIGNOUT: 'https://dev.d1klk34joigd80.amplifyapp.com/current-chassis-location',
  IDENTITY_PROVIDER: 'CognitoF5'
};

*/
