export enum Boundary {
  INTEGRATION = 'integration',
  CONNECTOR = 'connector',
}

export interface GrafanaProps {
  path?: string;
  defaultIframeId?: string;
  from?: number | string;
  functionId?: string;
  customIframeId?: string;
  boundaryId: Boundary;
}
