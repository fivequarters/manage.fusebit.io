import { InstalledConnectorType } from '@interfaces/integration';
import { useMemo } from 'react';
import { useAccountConnectorsGetAll } from './api/v2/account/connector/useGetAll';
import { useAuthContext } from './useAuthContext';
import { useGetIntegrationFromCache } from './useGetIntegrationFromCache';

const useGetInstalledConnectors = () => {
  const { userData } = useAuthContext();
  const { data: connectors, isLoading } = useAccountConnectorsGetAll({
    enabled: userData.token,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const integrationData = useGetIntegrationFromCache();

  const installedConnectors = useMemo(() => {
    return (integrationData?.data.data.components || [])
      .map((component) => {
        const matchingConnector = connectors?.data.items.find(
          (c) => c.id === component.entityId && component.entityType === 'connector'
        );
        const connectorWithComponentData = {
          ...component,
          ...matchingConnector,
        };

        return (
          connectorWithComponentData || {
            ...component,
            missing: true,
            id: component.entityId,
          }
        );
      })
      .filter((c) => c.entityType === 'connector');
  }, [connectors, integrationData]);

  return {
    connectors,
    installedConnectors: installedConnectors as InstalledConnectorType[],
    isLoading,
  };
};

export default useGetInstalledConnectors;
