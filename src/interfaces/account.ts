export interface Account {
  id: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  primaryEmail?: string;
}

interface AccountSubscription {
  displayName: string;
  id: string;
}

export interface AccountSubscriptions {
  items: AccountSubscription[];
}

export interface AccountList {
  subscriptions: AccountSubscription[];
  accountId?: string;
  subscriptionId?: string;
  userId?: string;
}
