import { BackendClient } from '@interfaces/backendClient';
import { User } from '@interfaces/user';
import { Storage } from '@interfaces/storage';
import { createAxiosClient } from '@utils/utils';
import { BACKEND_LIST_STORAGE_ID } from '@utils/constants';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

// TODO: Move to react-query

export async function putBackendClients(user: User, backendClients: BackendClient[]): Promise<Storage<BackendClient>> {
  const { accountId, subscriptionId, token } = user;
  const axiosClient = createAxiosClient(token);
  const clientsPaths = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v1/account/${accountId}/subscription/${subscriptionId}/storage/${BACKEND_LIST_STORAGE_ID}`;
  const response = await axiosClient.put<Storage<BackendClient>>(clientsPaths, { data: backendClients });
  return response.data;
}
