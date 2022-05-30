import { Auth0Profile } from './auth0Profile';
import { FusebitProfileEx } from './auth0Token';
import { Company } from './company';

export interface User extends Auth0Profile, Company, FusebitProfileEx {
  firstName?: string;
  lastName?: string;
  subscriptionName?: string;
  company?: string;
  token?: string;
}
