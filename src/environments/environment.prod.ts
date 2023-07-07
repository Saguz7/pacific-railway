export const environment = {
  production: true,
  API_URL_BASE: 'https://zt1nm5f67j.execute-api.us-west-2.amazonaws.com/dev/',
 region_pool: 'us-west-2_YKTiEMjtU',
 id_app: 's7ch645u8voh00dridmn8kn19',
 loginURL: 'https://cpkc-chassis-management-dev.auth.us-west-2.amazoncognito.com/oauth2/authorize?client_id=s7ch645u8voh00dridmn8kn19&response_type=token&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fdev.d1klk34joigd80.amplifyapp.com%2Fcurrent-chassis-location',

 redirectURL: 'https://dev.d1klk34joigd80.amplifyapp.com/current-chassis-location',

 cognitoTokenURL: 'https://cpkc-chassis-management-dev.auth.us-west-2.amazoncognito.com/oauth2/token',

 logout: 'https://cpkc-chassis-management-dev.auth.us-west-2.amazoncognito.com/logout?' +
         'client_id=s7ch645u8voh00dridmn8kn19&' +
         'logout_uri=https://dev.d1klk34joigd80.amplifyapp.com/current-chassis-location'
};
