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

export enum OperationType {
  creating = 'creating',
  updating = 'updating',
  deleting = 'deleting',
}

export enum OperationState {
  active = 'active',
  processing = 'processing',
  invalid = 'invalid',
}

export enum OperationStatus {
  success = 'success',
  failed = 'failed',
  processing = 'processing',
  creating = 'creating',
}

export enum OperationErrorCode {
  OK = 'OK',
  InvalidParameterValue = 'InvalidParameterValue',
  UnauthorizedOperation = 'UnauthorizedOperation',
  VersionConflict = 'VersionConflict',
  InternalError = 'InternalError',
  RequestLimitExceeded = 'RequestLimitExceeded',
}

export interface IOperationState {
  operation: OperationType;
  status: OperationStatus;
  message?: string;
  errorCode?: OperationErrorCode;
  errorDetails?: any;
}

export interface EntityState {
  state: string;
  operationState: IOperationState;
}
