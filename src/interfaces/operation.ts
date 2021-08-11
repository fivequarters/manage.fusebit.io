type OperationLocation = {
  entityId: string;
  accountId: string;
  entityType: string;
  subscriptionId: string;
};

export type Operation = {
  statusCode: number;
  type: string;
  verb: string;
  location: OperationLocation;
  operationId: string;
  id?: string;
};
