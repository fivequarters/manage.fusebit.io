import { Entity, Feed } from '../interfaces/feed';
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
import { findMatchingConnectorFeed } from '../utils/utils';
import { useAccountUserCreateUser } from './api/v1/account/user/useCreateUser';
import { Account } from '../interfaces/account';
import { useCreateToken } from './useCreateToken';

export const useEntityApi = (preventLoader?: boolean) => {
  const { userData } = useContext();
  const { waitForEntityStateChange, createLoader, removeLoader } = useLoader();
  const { createError } = useError();
  const { _createToken } = useCreateToken();

  // creates
  const createConnector = useAccountConnectorCreateConnector<Operation>();
  const createIntegration = useAccountIntegrationCreateIntegration<Operation>();
  const createUser = useAccountUserCreateUser<Operation>();

  // updates
  const updateConnector = useAccountConnectorUpdateConnector<Operation>();
  const updateIntegration = useAccountIntegrationUpdateIntegration<Operation>();

  // deletes
  const deleteIndentity = useAccountConnectorIdentityDeleteOne<Operation>();
  const deleteInstall = useAccountIntegrationInstanceDeleteOne<Operation>();
  const deleteIntegration = useAccountIntegrationDeleteIntegration<Operation>();
  const deleteConnector = useAccountConnectorDeleteConnector<Operation>();
  const deleteAccount = useAccountUserDeleteOne<Operation>();

  const createEntity = async (entity: Entity, commonTags?: { [key: string]: string }) => {
    const obj = {
      data: entity.data,
      id: entity.id,
      tags: { ...(commonTags || {}), ...entity.tags },
      accountId: userData.accountId,
      subscriptionId: userData.subscriptionId,
    };
    entity.entityType === 'connector'
      ? await createConnector.mutateAsync(obj)
      : await createIntegration.mutateAsync(obj);
    await waitForEntityStateChange(entity.entityType, [entity.id]);
  };

  const _createUser = async (data: Account, reloadUsers?: Function) => {
    try {
      createLoader();
      const response = await createUser.mutateAsync({ ...data, accountId: userData.accountId });
      if (reloadUsers) reloadUsers();
      if (response.data.id) {
        const token = await _createToken(response.data.id);
        return token;
      }
    } catch (e) {
      createError(e.message);
      removeLoader();
    } finally {
      removeLoader();
    }
  };

  const updateEntity = async (data: ApiResponse<Connector> | undefined, formData: any) => {
    try {
      if (!preventLoader) createLoader();
      const newData = data;
      if (newData) {
        newData.data.data.configuration = formData;
        await updateConnector.mutateAsync({
          subscriptionId: userData.subscriptionId,
          accountId: userData.accountId,
          id: newData?.data.id,
          data: newData.data,
        });
        await waitForEntityStateChange('connector', [newData?.data.id]);
      }
    } catch (e) {
      createError(e.message);
    } finally {
      if (!preventLoader) removeLoader();
    }
  };

  const toggleConnector = async (
    isAdding: boolean,
    connector: Entity,
    integrationData: ApiResponse<Integration> | undefined,
    callback?: Function
  ) => {
    try {
      if (!preventLoader) createLoader();
      const data = JSON.parse(JSON.stringify(integrationData?.data)) as Integration;
      let newData = data;
      if (isAdding) {
        const feedtype = connector.tags['fusebit.feedType'];
        const item: Feed = await findMatchingConnectorFeed(connector);
        if (feedtype === 'connector') {
          item.configuration.components?.forEach((component) => {
            component.name = connector.id;
            component.entityId = connector.id;
            newData.data.components.push(component);
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
      } else {
        const filteredComponents = newData.data.components.filter((innerConnector: InnerConnector) => {
          let returnConnector = true;
          if (innerConnector.entityId === connector.id) {
            returnConnector = false;
          }
          return returnConnector;
        });
        newData.data.components = filteredComponents;
      }
      await updateIntegration.mutateAsync({
        accountId: userData.accountId,
        subscriptionId: userData.subscriptionId,
        integrationId: integrationData?.data.id,
        data: newData,
      });
      await waitForEntityStateChange('integration', [integrationData?.data.id || '']);
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
          isIdentity ? await deleteIndentity.mutateAsync(params) : await deleteInstall.mutateAsync(params);
          // return waitForEntityStateChange(isIdentity ? `integration/${id}/instance` : `connector/${id}/identity`, [
          //   item.id,
          // ]);
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
      for (let i = 0; i < ids.length; i++) {
        if (type === 'I') {
          await deleteIntegration.mutateAsync({
            id: ids[i],
            accountId: userData.accountId,
            subscriptionId: userData.subscriptionId,
          });
        } else if (type === 'C') {
          await deleteConnector.mutateAsync({
            id: ids[i],
            accountId: userData.accountId,
            subscriptionId: userData.subscriptionId,
          });
        } else if (type === 'A') {
          await deleteAccount.mutateAsync({ userId: ids[i], accountId: userData.accountId });
        }
      }
      // if (type !== 'A') {
      //   await waitForEntityStateChange(type === 'I' ? 'integration' : 'connector', ids);
      // }
      if (callback) callback();
    } catch (e) {
      createError(e.message);
    } finally {
      removeLoader();
    }
  };

  return {
    createEntity,
    _createUser,
    updateEntity,
    deleteEntity,
    toggleConnector,
    massiveDelete,
  };
};
