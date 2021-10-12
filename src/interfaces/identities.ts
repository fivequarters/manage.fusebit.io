import { Tags } from './tags';

export interface Identity {
  id: string;
  data: {
    token: {
      ok: true;
      team: {
        id: string;
        name: string;
      };
      scope: string;
      app_id: string;
      status: string;
      timestamp: number;
      enterprise: null;
      token_type: string;
      authed_user: {
        id: string;
      };
      bot_user_id: string;
      access_token: string;
      is_enterprise_install: boolean;
    };
  };
  tags: Tags;
  version: string;
  state: string;
  operationState: {
    message: string;
    statusCode: number;
  };
  dateAdded: string;
  dateModified: string;
  expires?: string;
}

export interface IdentityList {
  items: Identity[];
  total: number;
  success: boolean;
  next?: string;
}
