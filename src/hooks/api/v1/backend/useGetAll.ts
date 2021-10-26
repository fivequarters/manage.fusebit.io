import { useQuery } from 'react-query';
import { AxiosInstance } from 'axios';
import { BackendClient } from '../../../../interfaces/backendClient';
import { Storage } from '../../../../interfaces/storage';
import { createAxiosClient } from '../../../../utils/utils';
import { useAuthContext } from '../../../useAuthContext';
import { BACKEND_LIST_STORAGE_ID } from '../../../../utils/constants';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

export const BACKEND_GET_ALL = 'backendGetAll';

export async function getBackendClients(
  axiosClient: AxiosInstance,
  accountId: string,
  subscriptionId: string
): Promise<BackendClient[]> {
  try {
    const clientsPaths = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/subscription/${subscriptionId}/storage/${BACKEND_LIST_STORAGE_ID}`;

    const clientsResponse = await axiosClient.get<Storage<BackendClient>>(clientsPaths);
    return clientsResponse.data.data;
  } catch (err) {
    if (err?.response?.status === 404) {
      return [];
    }
    throw err;
  }
}

export const useBackendGetAll = () => {
  const { userData } = useAuthContext();
  const axiosClient = createAxiosClient(userData.token);

  return useQuery(
    [BACKEND_GET_ALL, { accountId: userData.accountId }, { subscriptionId: userData.subscriptionId }],
    () => getBackendClients(axiosClient, userData.accountId || '', userData.subscriptionId || '')
  );
};
