import { Environment } from './environment';
import { readFileSync } from 'fs';

const envFile = readFileSync('.env.production', 'utf-8');
const envLines = envFile.split('\n');

const environment: Environment = {
  production: true,
  API_URL_BASE: envLines.find(line => line.startsWith('API_URL_BASE='))?.split('=')[1] || 'https://vuycilier4.execute-api.us-west-2.amazonaws.com/dev/',
  REGION_POOL: envLines.find(line => line.startsWith('REGION_POOL='))?.split('=')[1] || 'us-west-2',
  USER_POOL_ID: envLines.find(line => line.startsWith('USER_POOL_ID='))?.split('=')[1] || 'us-west-2_YKTiEMjtU',
  APP_POOL_ID: envLines.find(line => line.startsWith('APP_POOL_ID='))?.split('=')[1] || 's7ch645u8voh00dridmn8kn19',
  DOMAIN_SIGN: envLines.find(line => line.startsWith('DOMAIN_SIGN='))?.split('=')[1] || 'cpkc-chassis-management-dev.auth.us-west-2.amazoncognito.com',
  REDIRECT_SIGNIN: envLines.find(line => line.startsWith('REDIRECT_SIGNIN='))?.split('=')[1] || 'https://dev.d1klk34joigd80.amplifyapp.com/current-chassis-location',
  REDIRECT_SIGNOUT: envLines.find(line => line.startsWith('REDIRECT_SIGNOUT='))?.split('=')[1] || 'https://dev.d1klk34joigd80.amplifyapp.com/current-chassis-location',
  IDENTITY_PROVIDER: envLines.find(line => line.startsWith('IDENTITY_PROVIDER='))?.split('=')[1] || 'CognitoF5',
};

export { environment };
