import { AxiosInstance } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { BackendClient } from '../../../../interfaces/backendClient';
import { User } from '../../../../interfaces/user';
import { Storage } from '../../../../interfaces/storage';
import { patchClient } from '../../../../utils/clients';
import { createAxiosClient } from '../../../../utils/utils';
import { useAuthContext } from '../../../useAuthContext';
import { BACKEND_GET_ALL, getBackendClients } from './useGetAll';
import { BACKEND_LIST_STORAGE_ID } from '../../../../utils/constants';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

export async function patchBackendClients(
  axiosClient: AxiosInstance,
  id: string,
  user: User,
  backendClient: Partial<BackendClient>
): Promise<Storage<BackendClient>> {
  const { accountId = '', subscriptionId = '' } = user;

  const backendClients: any[] = await getBackendClients(axiosClient, accountId, subscriptionId);
  const index = backendClients.findIndex((client) => client.id === id);
  backendClients[index] = {
    ...backendClients[index],
    ...backendClient,
  };
  const clientsPaths = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/subscription/${subscriptionId}/storage/${BACKEND_LIST_STORAGE_ID}`;
  await patchClient(user, { id, displayName: backendClient.name });
  const response = await axiosClient.put<Storage<BackendClient>>(clientsPaths, { data: backendClients });
  return response.data;
}

export const useBackendUpdateOne = () => {
  const { userData } = useAuthContext();
  const axiosClient = createAxiosClient(userData.token);
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, updatedBackend }: { id: string; updatedBackend: Partial<BackendClient> }) =>
      patchBackendClients(axiosClient, id, userData, updatedBackend),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([BACKEND_GET_ALL]);
      },
    }
  );
};
