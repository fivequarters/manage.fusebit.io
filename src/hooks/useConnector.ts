import { useQueryClient } from 'react-query';
import { Entity, Feed } from '@interfaces/feed';
import { InnerConnector, Integration } from '@interfaces/integration';
import { Operation } from '@interfaces/operation';
import { findMatchingConnectorFeed, getAllDependenciesFromFeed, linkPackageJson } from '@utils/utils';
import { Connector } from '@interfaces/connector';
import { FinalConnector } from '@interfaces/integrationDetailDevelop';
import { useAccountIntegrationUpdateIntegration } from './api/v2/account/integration/useUpdateOne';
import { ApiResponse } from './useAxios';
import { useAuthContext } from './useAuthContext';
import { useError } from './useError';
import { useLoader } from './useLoader';
import { ACCOUNT_INTEGRATIONS_GET_ONE } from './api/v2/account/integration/useGetOne';
import { ACCOUNT_CONNECTORS_GET_ALL } from './api/v2/account/connector/useGetAll';

const useConnector = () => {
  const updateIntegration = useAccountIntegrationUpdateIntegration<Operation>();
  const { userData } = useAuthContext();
  const { waitForEntityStateChange } = useLoader();
  const { createError } = useError();
  const queryClient = useQueryClient();

  const runAndWait = async (data: Integration, integrationId = '') => {
    await updateIntegration.mutateAsync({
      accountId: userData.accountId,
      subscriptionId: userData.subscriptionId,
      integrationId,
      data,
    });
    await waitForEntityStateChange('integration', [integrationId]);
    queryClient.invalidateQueries(ACCOUNT_INTEGRATIONS_GET_ONE, { active: true });
    queryClient.invalidateQueries(ACCOUNT_CONNECTORS_GET_ALL, { active: true });
  };

  const addConnectorToIntegration = async (
    connector: Entity,
    integrationData: ApiResponse<Integration> | undefined
  ) => {
    try {
      const newData = JSON.parse(JSON.stringify(integrationData?.data)) as Integration;

      const feedtype = connector.tags['fusebit.feedType'];
      const item: Feed = await findMatchingConnectorFeed(connector);
      const dependencies = getAllDependenciesFromFeed(item);

      if (feedtype === 'connector') {
        item.configuration.components?.forEach((component) => {
          component.name = connector.id;
          component.entityId = connector.id;

          const existingComponent = newData.data.components?.findIndex((c) => c.entityId === component.entityId);

          if (existingComponent !== -1) {
            newData.data.components?.splice(existingComponent, 1);
          }

          newData.data.components.push(component);

          const newPackageJson = linkPackageJson(
            JSON.parse(newData.data.files['package.json']),
            dependencies,
            component
          );

          newData.data.files['package.json'] = JSON.stringify(newPackageJson);
        });
      } else {
        Object.entries(item.configuration.entities).forEach((entity) => {
          if (entity[1].entityType === 'integration') {
            entity[1].data.components?.forEach((component) => {
              component.name = connector.id;
              component.entityId = connector.id;
              newData.data.components.push(component);
            });
          }
        });
      }

      await runAndWait(newData, integrationData?.data.id);
    } catch (e) {
      createError(e);
    }
  };

  const removeConnectorFromIntegration = async (
    connector: Connector | Entity | FinalConnector,
    integrationData: ApiResponse<Integration> | undefined
  ) => {
    try {
      const data = JSON.parse(JSON.stringify(integrationData?.data)) as Integration;
      const newData = data;

      const filteredComponents = newData.data.components.filter((innerConnector: InnerConnector) => {
        let returnConnector = true;
        if (innerConnector.entityId === connector.id) {
          returnConnector = false;
        }
        return returnConnector;
      });
      newData.data.components = filteredComponents;

      await runAndWait(newData, integrationData?.data.id);
    } catch (e) {
      createError(e);
    }
  };

  return {
    addConnectorToIntegration,
    removeConnectorFromIntegration,
  };
};

export default useConnector;
