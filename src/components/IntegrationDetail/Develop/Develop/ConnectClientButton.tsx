import React from 'react';
import { Button } from '@material-ui/core';

import { nanoid } from 'nanoid';

import { Operation } from '../../../../interfaces/operation';
import { useLoader } from '../../../../hooks/useLoader';
import { useError } from '../../../../hooks/useError';
import { generateKeyPair } from '../../../../utils/crypto';
import { useCreateIssuer } from '../../../../hooks/api/v1/account/issuer/useCreateIssuer';
import { useCreateClient } from '../../../../hooks/api/v1/account/client/useCreateClient';
import { usePatchClient } from '../../../../hooks/api/v1/account/client/usePatchClient';
import { useContext } from '../../../../hooks/useContext';

export default function ConnectClientButton() {
  const { userData } = useContext();
  const { createLoader, removeLoader } = useLoader();
  const { createError } = useError();
  const createIssuer = useCreateIssuer<Operation>();
  const createClient = useCreateClient<Operation>();
  const patchClient = usePatchClient<Operation>();

  const registerBackend = async () => {
    try {
      createLoader();
      const { accountId, subscriptionId } = userData as Required<typeof userData>;
      const client = await createNewClient(createClient, accountId, subscriptionId);
      const issuer = await createNewIssuer(createIssuer, accountId, client);
      await patchCreatedClient(patchClient, accountId, issuer, client);
    } catch (e) {
      createError(e.message);
    } finally {
      removeLoader();
    }
  };

  return (
    <Button
      onClick={() => registerBackend()}
      style={{ width: '160px', marginTop: '10px' }}
      size="large"
      variant="outlined"
      color="primary"
    >
      Add Backend
    </Button>
  );
}

const createNewClient = async (createClient: any, accountId: string, subscriptionId: string) => {
  const client = {
    displayName: 'My Backend',
    access: {
      allow: [
        {
          action: '*',
          resource: `/account/${accountId}/subscription/${subscriptionId}`,
        },
      ],
    },
  };
  const response = await createClient.mutateAsync({
    accountId: accountId,
    client,
  });
  const persistedClient = response.data;
  return persistedClient;
};

const createNewIssuer = async (createIssuer: any, accountId: string, client: any) => {
  const randomSuffix = nanoid();
  const issuerId = `iss-${randomSuffix}`;
  const keyId = `key-${randomSuffix}`;
  const keyPair = await generateKeyPair();
  const newIssuer = {
    id: issuerId,
    displayName: `Issuer for the ${client.id} client`,
    publicKeys: [
      {
        keyId,
        publicKey: keyPair.publicKeyPem,
      },
    ],
  };
  const response = await createIssuer.mutateAsync({
    accountId: accountId,
    issuer: newIssuer,
  });
  const persistedIssuer = response.data;
  return persistedIssuer;
};

const patchCreatedClient = async (patchClient: any, accountId: string, issuer: any, client: any) => {
  const clientChanges = {
    identities: [
      {
        issuerId: issuer.id,
        subject: client.id,
      },
    ],
  };
  const response = await patchClient.mutateAsync({
    accountId: accountId,
    clientId: client.id,
    clientChanges,
  });
  const patchedClient = response.data;
  return patchedClient;
};
