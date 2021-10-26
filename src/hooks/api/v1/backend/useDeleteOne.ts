import { AxiosInstance } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { User } from '../../../../interfaces/user';
import { putBackendClients } from './utils/putBackendClients';
import { removeClient } from '../../../../utils/clients';
import { removeIssuer } from '../../../../utils/issuer';
import { createAxiosClient } from '../../../../utils/utils';
import { useAuthContext } from '../../../useAuthContext';
import { BACKEND_GET_ALL, getBackendClients } from './useGetAll';

export async function removeBackendClient(axiosClient: AxiosInstance, user: User, clientId: string): Promise<void> {
  const clients = await getBackendClients(axiosClient, user.accountId || '', user.subscriptionId || '');
  const filteredClients = clients.filter((c) => c.id !== clientId);

  await removeIssuer(user, clientId);
  await removeClient(user, clientId);
  await putBackendClients(user, filteredClients);
}

export const useBackendDeleteOne = () => {
  const { userData } = useAuthContext();
  const axiosClient = createAxiosClient(userData.token);
  const queryClient = useQueryClient();

  return useMutation((clientId: string) => removeBackendClient(axiosClient, userData, clientId), {
    onSuccess: () => {
      queryClient.invalidateQueries([BACKEND_GET_ALL]);
    },
  });
};
