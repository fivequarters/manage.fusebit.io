import { Entity, Feed } from '@interfaces/feed';
import { Operation } from '@interfaces/operation';
import { Connector } from '@interfaces/connector';
import { IdentityList } from '@interfaces/identities';
import { InstallList } from '@interfaces/install';
import { InnerConnector, Integration } from '@interfaces/integration';
import { findMatchingConnectorFeed, getAllDependenciesFromFeed, linkPackageJson } from '@utils/utils';
import { EntitiesType } from '@interfaces/entities';
import { Account } from '@interfaces/account';
import { INTEGRATION_PROCESSING_SUFFIX } from '@utils/constants';
import { useLoader } from './useLoader';
import { useAccountConnectorCreateConnector } from './api/v2/account/connector/useCreateOne';
import { useAccountIntegrationCreateIntegration } from './api/v2/account/integration/useCreateOne';
import { useAuthContext } from './useAuthContext';
import { useError } from './useError';
import { ApiResponse } from './useAxios';
import { useAccountConnectorUpdateConnector } from './api/v2/account/connector/useUpdateOne';
import { useAccountConnectorIdentityDeleteOne } from './api/v2/account/connector/identity/useDeleteOne';
import { useAccountIntegrationInstallDeleteOne } from './api/v2/account/integration/install/useDeleteOne';
import { useAccountIntegrationUpdateIntegration } from './api/v2/account/integration/useUpdateOne';
import { useAccountIntegrationDeleteIntegration } from './api/v2/account/integration/useDeleteOne';
import { useAccountConnectorDeleteConnector } from './api/v2/account/connector/useDeleteOne';
import { useAccountUserDeleteOne } from './api/v1/account/user/useDeleteOne';
import { useAccountUserCreateUser } from './api/v1/account/user/useCreateUser';
import { useCreateToken } from './useCreateToken';
import useConnector from './useConnector';

export const useEntityApi = (preventLoader?: boolean) => {
  const { userData } = useAuthContext();
  const { waitForEntityStateChange, createLoader, removeLoader } = useLoader();
  const { createError } = useError();
  const { _createToken } = useCreateToken();

  // creates
  const createConnector = useAccountConnectorCreateConnector<Entity>();
  const createIntegration = useAccountIntegrationCreateIntegration<Entity>();
  const createUser = useAccountUserCreateUser<Operation>();

  // updates
  const updateConnector = useAccountConnectorUpdateConnector<Operation>();
  const updateIntegration = useAccountIntegrationUpdateIntegration<Operation>();

  // deletes
  const deleteIndentity = useAccountConnectorIdentityDeleteOne<Operation>();
  const deleteInstall = useAccountIntegrationInstallDeleteOne<Operation>();
  const deleteIntegration = useAccountIntegrationDeleteIntegration<Operation>();
  const deleteConnector = useAccountConnectorDeleteConnector<Operation>();
  const deleteAccount = useAccountUserDeleteOne<Operation>();

  const createEntity = async (
    entity: Entity,
    commonTags?: { [key: string]: string },
    disableWaitforOperations?: boolean
  ) => {
    const obj = {
      data: entity.data,
      id: entity.id,
      tags: { ...(commonTags || {}), ...entity.tags },
      accountId: userData.accountId,
      subscriptionId: userData.subscriptionId,
    };

    let newEntity;

    if (entity.entityType === 'connector') {
      newEntity = await createConnector.mutateAsync(obj);
      newEntity.data.entityType = 'connector';
    } else {
      newEntity = await createIntegration.mutateAsync(obj);
      newEntity.data.entityType = 'integration';
      localStorage.setItem(`${entity.id}${INTEGRATION_PROCESSING_SUFFIX}`, 'true');
    }

    if (!disableWaitforOperations) {
      await waitForEntityStateChange(entity.entityType, [entity.id]);
    }

    return newEntity;
  };

  const _createUser = async (data: Account) => {
    try {
      createLoader();
      const response = await createUser.mutateAsync({
        ...data,
        accountId: userData.accountId,
        access: {
          allow: [{ action: '*', resource: `/account/${userData.accountId}/` }],
        },
      });
      if (response.data.id) {
        const token = await _createToken(response.data.id, 'oauth');
        return token;
      }
    } catch (e) {
      createError(e);
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
      createError(e);
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
      const newData = data;
      if (isAdding) {
        const feedtype = connector.tags['fusebit.feedType'];
        const item: Feed = await findMatchingConnectorFeed(connector);
        const dependencies = getAllDependenciesFromFeed(item);

        if (feedtype === 'connector') {
          item.configuration.components?.forEach((component) => {
            component.name = connector.id;
            component.entityId = connector.id;
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
      createError(e);
    } finally {
      if (!preventLoader) removeLoader();
    }
  };

  const deleteEntity = async (
    id: string,
    identitiesData: ApiResponse<IdentityList | InstallList> | undefined,
    isIdentity: boolean,
    callback?: Function
  ) => {
    try {
      if (!preventLoader) createLoader();
      const data = JSON.parse(JSON.stringify(identitiesData?.data)) as IdentityList;
      await Promise.all(
        (data.items || []).map(async (item) => {
          const params = {
            id: item.id,
          };
          if (isIdentity) {
            await deleteIndentity.mutateAsync(params);
          } else {
            await deleteInstall.mutateAsync(params);
          }
        })
      );
      if (callback) callback();
    } catch (e) {
      createError(e);
    } finally {
      if (!preventLoader) removeLoader();
    }
  };

  const massiveDelete = async (ids: string[], type: EntitiesType, callback?: Function) => {
    try {
      createLoader();
      for (let i = 0; i < ids.length; i++) {
        if (type === 'Integration') {
          await deleteIntegration.mutateAsync({
            id: ids[i],
            accountId: userData.accountId,
            subscriptionId: userData.subscriptionId,
          });
        } else if (type === 'Connector') {
          await deleteConnector.mutateAsync({
            id: ids[i],
            accountId: userData.accountId,
            subscriptionId: userData.subscriptionId,
          });
        } else if (type === 'Account') {
          await deleteAccount.mutateAsync({ userId: ids[i], accountId: userData.accountId });
        } else if (type === 'Identity') {
          await deleteIndentity.mutateAsync({
            id: ids[i],
          });
        } else if (type === 'Install') {
          await deleteInstall.mutateAsync({
            id: ids[i],
          });
        }
      }
      if (callback) callback();
    } catch (e) {
      createError(e);
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
    ...useConnector(),
  };
};
