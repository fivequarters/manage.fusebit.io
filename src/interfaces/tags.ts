export interface Tags {
  [key: string]: string | undefined;
  'session.master'?: string;
  'fusebit.tenantId'?: string;
  'fusebit.parentEntityId'?: string;
  'fusebit.feedId'?: string;
  'fusebit.feedType'?: string;
  'fusebit.service'?: string;
}
