export interface CreateSessionPayload {
  id: string;
  data: {
    mode: string;
    components: {
      name: string;
      path: string;
      skip: false;
      entityId: string;
      provider: string;
      dependsOn: [];
      entityType: string;
    }[];
    redirectUrl: string;
  };
  tags: {
    'fusebit.tenantId': string;
  };
  expires: string;
  version: string;
  state: string;
  operationState: {
    message: string;
    statusCode: number;
  };
  dateAdded: string;
  dateModified: string;
  targetUrl: string;
}
