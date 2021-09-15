interface IdentityInstance {
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
  tags: {
    [key: string]: string | undefined;
    'session.master'?: string;
    'fusebit.tenantId'?: string;
  };
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

export interface Identity {
  items: IdentityInstance[];
  total: number;
  sucess: true;
  next?: string;
}
