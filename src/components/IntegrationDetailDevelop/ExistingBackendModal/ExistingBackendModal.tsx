import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { ACCOUNT_INTEGRATIONS_GET_ONE } from '../../../hooks/api/v2/account/integration/useGetOne';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { ApiResponse } from '../../../hooks/useAxios';
import { BackendClient } from '../../../interfaces/backendClient';
import { Integration } from '../../../interfaces/integration';
import BaseBackendModal from '../BaseBackendModal';

interface Props {
  open: boolean;
  onClose: () => void;
  backendClient: BackendClient;
}

const ExistingBackendModal = ({ open, onClose, backendClient }: Props) => {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const { userData } = useAuthContext();

  const integrationData = queryClient.getQueryData<ApiResponse<Integration>>([
    ACCOUNT_INTEGRATIONS_GET_ONE,
    { id, accountId: userData.accountId, subscriptionId: userData.subscriptionId },
  ]);

  return (
    <BaseBackendModal
      token={`*************${backendClient.tokenSignature?.slice(-4)}`}
      name={backendClient.name || ''}
      // onChange={onChange}
      onChange={() => {}}
      id={backendClient.id || ''}
      disableCopy
      open={open}
      onClose={onClose}
      integration={integrationData?.data}
    />
  );
};

export default ExistingBackendModal;
