import React from 'react';
import { useAccountIntegrationsGetAll } from '@hooks/api/v2/account/integration/useGetAll';
import { Integration } from '@interfaces/integration';
import { useAuthContext } from '@hooks/useAuthContext';
import { Chip } from '@material-ui/core';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import { useHistory } from 'react-router-dom';

interface Props {
  name: string;
}

const GetRelatedIntegrations: React.FC<Props> = ({ name }) => {
  const history = useHistory();
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

  const onClick = (integrationId: string) => {
    history.push(getRedirectLink(`/integration/${integrationId}/develop`));
  };

  return (
    <>
      {matchedIntegrations?.map((integration) => {
        return (
          <Chip
            key={integration.id}
            onClick={(e) => {
              e.stopPropagation();
              onClick(integration.id);
            }}
            style={{ backgroundColor: '#E0E0E0' }}
            variant="outlined"
            label={integration.id}
          />
        );
      })}
    </>
  );
};

export default GetRelatedIntegrations;
