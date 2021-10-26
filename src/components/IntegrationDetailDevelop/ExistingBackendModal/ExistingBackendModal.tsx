import { useGetIntegrationFromCache } from '../../../hooks/useGetIntegrationFromCache';
import { BackendClient } from '../../../interfaces/backendClient';
import BaseBackendModal from '../BaseBackendModal';

interface Props {
  open: boolean;
  onClose: () => void;
  backendClient: BackendClient;
}

const ExistingBackendModal = ({ open, onClose, backendClient }: Props) => {
  const integrationData = useGetIntegrationFromCache();

  return (
    <BaseBackendModal
      token={`*************${backendClient.tokenSignature?.slice(-4)}`}
      name={backendClient.name || ''}
      id={backendClient.id || ''}
      disableCopy
      open={open}
      onClose={onClose}
      integration={integrationData?.data}
    />
  );
};

export default ExistingBackendModal;
