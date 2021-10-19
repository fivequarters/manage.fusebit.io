export interface Auth0Token {
  'https://fusebit.io/profile': { accountId: string; subscriptionId: string; userId: string };
  'https://fusebit.io/new-user'?: boolean;
}
