export interface Auth0Profile {
  sub?: string;
  picture?: string;
  nickname?: string;
  name?: string;
  locale?: string;
  given_name?: string;
  family_name?: string;
  email_verified?: boolean;
  email?: string;
}

export interface Auth0InviteProfile {
  id: string;
  subscription: string;
  account: string;
}
