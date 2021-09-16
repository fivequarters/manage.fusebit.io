interface Tags {
  [key: string]: string | undefined;
  'session.master'?: string;
  'fusebit.tenantId'?: string;
}

interface InstallInstance {
  id: string;
  data: {
    [key: string]: {
      tags: Tags;
      entityId: string;
      accountId: string;
      entityType: string;
      parentEntityId: string;
      subscriptionId: string;
      parentEntityType: string;
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
}

export interface Install {
  items: InstallInstance[];
  total: number;
  next: string;
}
