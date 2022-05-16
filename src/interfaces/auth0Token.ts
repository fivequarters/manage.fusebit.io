export interface FusebitProfile {
  accountId?: string;
  subscriptionId?: string;
  userId?: string;
  email?: string;
  subscriptionName?: string;
}

export interface FusebitProfileEx extends FusebitProfile {
  accounts?: FusebitProfile[];
  fusebitProvisionUrl?: string;
}

export interface Auth0Token {
  iss: string;
  'https://fusebit.io/profile': FusebitProfileEx;
  'https://fusebit.io/new-user'?: boolean;
}
