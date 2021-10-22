import { AxiosInstance } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { BackendClient } from '../../../../interfaces/backendClient';
import { User } from '../../../../interfaces/user';
import { putBackendClients } from './utils/putBackendClients';
import { addClientIdentity, createClient } from '../../../../utils/clients';
import { generateKeyPair } from '../../../../utils/crypto';
import { createIssuer } from '../../../../utils/issuer';
import { generateNonExpiringToken } from '../../../../utils/jwt';
import { createAxiosClient } from '../../../../utils/utils';
import { useAuthContext } from '../../../useAuthContext';
import { BACKEND_GET_ALL, getBackendClients } from './useGetAll';

export async function createBackendClient(axiosClient: AxiosInstance, user: User): Promise<BackendClient> {
  const backendClients = await getBackendClients(axiosClient, user.accountId || '', user.subscriptionId || '');

  if (backendClients.length >= 5) {
    throw new Error('You have reached the limit of 5 backend clients registered at Fusebit.');
  }

  const client = await createClient(user);
  const ketPair = await generateKeyPair();
  const issuer = await createIssuer(user, client, ketPair);
  await addClientIdentity(user, client.id, issuer);

  const nonExpiringToken = await generateNonExpiringToken(ketPair, client, issuer);
  const tokenSignature = nonExpiringToken.split('.')[2];

  const backendClient = {
    id: client.id,
    name: client.displayName,
    issuer: issuer.id,
    tokenSignature,
  };

  const backends = [...backendClients, backendClient];
  await putBackendClients(user, backends);

  return {
    ...backendClient,
    token: nonExpiringToken,
  };
}

export const useBackendCreateOne = () => {
  const { userData } = useAuthContext();
  const axiosClient = createAxiosClient(userData.token);
  const queryClient = useQueryClient();

  return useMutation(() => createBackendClient(axiosClient, userData), {
    onSuccess: () => {
      queryClient.invalidateQueries([BACKEND_GET_ALL]);
    },
  });
};
