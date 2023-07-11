const awsConfig = {
    Auth: {
      region: 'us-west-2',
      userPoolId: 'us-west-2_YKTiEMjtU',
      userPoolWebClientId: 's7ch645u8voh00dridmn8kn19',
      oauth: {
        domain: 'cpkc-chassis-management-dev.auth.us-west-2.amazoncognito.com',
        scope: ['email', 'openid', 'phone'],
        redirectSignIn: 'https://dev.d1klk34joigd80.amplifyapp.com/current-chassis-location',
        redirectSignOut: 'https://dev.d1klk34joigd80.amplifyapp.com/current-chassis-location',
        responseType: 'token'
      }
    }
  };

export default awsConfig;
