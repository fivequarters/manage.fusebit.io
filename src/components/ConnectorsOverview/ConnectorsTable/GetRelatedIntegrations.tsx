import React from 'react';
import { useAccountIntegrationsGetAll } from '@hooks/api/v2/account/integration/useGetAll';
import { Integration } from '@interfaces/integration';
import { useAuthContext } from '@hooks/useAuthContext';
import { Chip } from '@material-ui/core';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';

interface Props {
  name: string;
}

const GetRelatedIntegrations: React.FC<Props> = ({ name }) => {
  const { userData } = useAuthContext();
  const { data: integrations } = useAccountIntegrationsGetAll<{ items: Integration[] }>({
    enabled: userData.token,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });

  const matchedIntegrations = integrations?.data?.items?.filter(
    (integration) => integration.data.components.find((component) => component.entityId === name) !== undefined
  );

  const { getRedirectLink } = useGetRedirectLink();

  const onClick = () => {
    window.location.href = getRedirectLink('/integrations/overview');
  };

  return (
    <>
      {matchedIntegrations?.map((integration) => {
        return (
          <Chip
            key={integration.id}
            onClick={onClick}
            variant="outlined"
            label={integration.id}
            style={{ background: '#fff' }}
          />
        );
      })}
    </>
  );
};

export default GetRelatedIntegrations;
