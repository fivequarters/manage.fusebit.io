export interface FusebitProfile {
  accountId?: string;
  subscriptionId?: string;
  userId?: string;
  email?: string;
}

export interface Auth0Token {
  iss: string;
  'https://fusebit.io/profile': FusebitProfile;
  'https://fusebit.io/new-user'?: boolean;
}
