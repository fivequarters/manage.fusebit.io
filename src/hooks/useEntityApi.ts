import { Entity } from '../interfaces/feed';
import { useLoader } from './useLoader';
import { Operation } from '../interfaces/operation';
import { useAccountConnectorCreateConnector } from './api/v2/account/connector/useCreateOne';
import { useAccountIntegrationCreateIntegration } from './api/v2/account/integration/useCreateOne';
import { useContext } from './useContext';
import { useError } from './useError';
import { Connector } from '../interfaces/connector';
import { ApiResponse } from './useAxios';
import { useAccountConnectorUpdateConnector } from './api/v2/account/connector/useUpdateOne';
import { Identity } from '../interfaces/identities';
import { useAccountConnectorIdentityDeleteOne } from './api/v2/account/connector/identity/useDeleteOne';
import { useAccountIntegrationInstanceDeleteOne } from './api/v2/account/integration/instance/useDeleteOne';
import { Install } from '../interfaces/install';
import { InnerConnector, Integration } from '../interfaces/integration';
import { useAccountIntegrationUpdateIntegration } from './api/v2/account/integration/useUpdateOne';
import { useAccountIntegrationDeleteIntegration } from './api/v2/account/integration/useDeleteOne';
import { useAccountConnectorDeleteConnector } from './api/v2/account/connector/useDeleteOne';
import { useAccountUserDeleteOne } from './api/v1/account/user/useDeleteOne';

export const useEntityApi = (preventLoader?: boolean) => {
  const { userData } = useContext();
  const { waitForOperations, createLoader, removeLoader } = useLoader();
  const { createError } = useError();

  // creates
  const createConnector = useAccountConnectorCreateConnector<Operation>();
  const createIntegration = useAccountIntegrationCreateIntegration<Operation>();

  // updates
  const updateConnector = useAccountConnectorUpdateConnector<Operation>();
  const updateIntegration = useAccountIntegrationUpdateIntegration<Operation>();

  // deletes
  const deleteIndentity = useAccountConnectorIdentityDeleteOne<Operation>();
  const deleteInstall = useAccountIntegrationInstanceDeleteOne<Operation>();
  const deleteIntegration = useAccountIntegrationDeleteIntegration<Operation>();
  const deleteConnector = useAccountConnectorDeleteConnector<Operation>();
  const deleteAccount = useAccountUserDeleteOne<Operation>();

  const createEntity = async (entity: Entity, commonTags: { [key: string]: string }) => {
    const obj = {
      data: entity.data,
      id: entity.id,
      tags: { ...commonTags, ...entity.tags },
      accountId: userData.accountId,
      subscriptionId: userData.subscriptionId,
    };
    const response =
      entity.entityType === 'connector'
        ? await createConnector.mutateAsync(obj)
        : await createIntegration.mutateAsync(obj);
    await waitForOperations([response.data.operationId]);
  };

  const updateEntity = async (data: ApiResponse<Connector> | undefined, formData: any) => {
    try {
      if (!preventLoader) createLoader();
      const newData = data;
      if (newData) {
        newData.data.data.configuration = formData;
        const response = await updateConnector.mutateAsync({
          subscriptionId: userData.subscriptionId,
          accountId: userData.accountId,
          id: newData?.data.id,
          data: newData.data,
        });
        await waitForOperations([response.data.operationId]);
      }
    } catch (e) {
      createError(e.message);
    } finally {
      if (!preventLoader) removeLoader();
    }
  };

  const toggleConnector = async (
    isAdding: boolean,
    connectorId: string,
    integrationData: ApiResponse<Integration> | undefined,
    callback?: Function
  ) => {
    try {
      if (!preventLoader) createLoader();
      const data = JSON.parse(JSON.stringify(integrationData?.data)) as Integration;
      if (isAdding) {
        const newConnector: InnerConnector = {
          name: connectorId,
          entityType: 'connector',
          entityId: connectorId,
          skip: false,
          provider: '@fusebit-int/slack-provider',
          dependsOn: [],
        };
        data.data.components.push(newConnector);
      } else {
        const filteredComponents = data.data.components.filter((connector: InnerConnector) => {
          let returnConnector = true;
          if (connector.entityId === connectorId) {
            returnConnector = false;
          }
          return returnConnector;
        });
        data.data.components = filteredComponents;
      }
      const response2 = await updateIntegration.mutateAsync({
        accountId: userData.accountId,
        subscriptionId: userData.subscriptionId,
        integrationId: integrationData?.data.id,
        data: data,
      });
      await waitForOperations([response2.data.operationId]);
      if (callback) callback();
    } catch (e) {
      createError(e.message);
    } finally {
      if (!preventLoader) removeLoader();
    }
  };

  const deleteEntity = async (
    id: string,
    identitiesData: ApiResponse<Identity | Install> | undefined,
    isIdentity: boolean,
    callback?: Function
  ) => {
    try {
      if (!preventLoader) createLoader();
      const data = JSON.parse(JSON.stringify(identitiesData?.data)) as Identity;
      await Promise.all(
        (data.items || []).map(async (item) => {
          const params = {
            data: item,
            id: id,
            accountId: userData.accountId,
            subscriptionId: userData.subscriptionId,
          };
          const response = isIdentity
            ? await deleteIndentity.mutateAsync(params)
            : await deleteInstall.mutateAsync(params);
          return waitForOperations([response.data.operationId]);
        })
      );
      if (callback) callback();
    } catch (e) {
      createError(e.message);
    } finally {
      if (!preventLoader) removeLoader();
    }
  };

  const massiveDelete = async (ids: string[], type: 'I' | 'C' | 'A', callback?: Function) => {
    try {
      createLoader();
      let operationIds: string[] = [];
      for (let i = 0; i < ids.length; i++) {
        if (type === 'I') {
          const response = await deleteIntegration.mutateAsync({
            id: ids[i],
            accountId: userData.accountId,
            subscriptionId: userData.subscriptionId,
          });
          operationIds.push(response.data.operationId);
        } else if (type === 'C') {
          const response = await deleteConnector.mutateAsync({
            id: ids[i],
            accountId: userData.accountId,
            subscriptionId: userData.subscriptionId,
          });
          operationIds.push(response.data.operationId);
        } else if (type === 'A') {
          const response = await deleteAccount.mutateAsync({ userId: ids[i], accountId: userData.accountId });
          operationIds.push(response.data.operationId);
        }
      }
      await waitForOperations(operationIds);
      if (callback) callback();
    } catch (e) {
      createError(e.message);
    } finally {
      removeLoader();
    }
  };

  return {
    createEntity,
    updateEntity,
    deleteEntity,
    toggleConnector,
    massiveDelete,
  };
};
