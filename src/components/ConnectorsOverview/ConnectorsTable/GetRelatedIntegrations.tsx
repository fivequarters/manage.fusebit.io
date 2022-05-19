import React from 'react';
import { useAccountIntegrationsGetAll } from '@hooks/api/v2/account/integration/useGetAll';
import { Integration } from '@interfaces/integration';
import { useAuthContext } from '@hooks/useAuthContext';
import { Button } from '@material-ui/core';
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
    (integration) => integration.data.components.filter((component) => component.entityId === name).length !== 0
  );

  const { getRedirectLink } = useGetRedirectLink();

  const onClick = () => {
    window.location.href = getRedirectLink('/integrations/overview');
  };

  return (
    <>
      {matchedIntegrations?.map((integration) => {
        return (
          <>
            <Button key="" onClick={onClick} variant="outlined">
              {integration.id}
            </Button>
            <br />
          </>
        );
      })}
    </>
  );
};

export default GetRelatedIntegrations;
