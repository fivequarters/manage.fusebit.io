export interface GrafanaProps {
  path?: string;
  defaultIframeId?: string;
  from?: number | string;
  functionId?: string;
  customIframeId?: string;
  boundaryId: 'integration' | 'connector';
}
