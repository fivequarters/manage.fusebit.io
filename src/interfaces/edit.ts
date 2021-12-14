export interface Props {
  open?: boolean;
  onClose: () => void;
  integrationId: string;
  isLoading?: boolean;
}

export interface SaveStatus {
  boundaryId: string;
  buildId: string;
  functionId: string;
  location: string;
  progress: number;
  status: 'completed' | string;
  subscriptionId: string;
}
