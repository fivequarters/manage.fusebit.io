import React from 'react';
import * as SC from './styles';
import { Button } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useAccountIntegrationInstanceGetAll } from '../../../../hooks/api/v2/account/integration/instance/useGetAll';
import { useAccountIntegrationInstanceDeleteOne } from '../../../../hooks/api/v2/account/integration/instance/useDeleteOne';
import { useContext } from '../../../../hooks/useContext';
import { Install } from '../../../../interfaces/install';
import { useLoader } from '../../../../hooks/useLoader';
import { useError } from '../../../../hooks/useError';
import { Operation } from '../../../../interfaces/operation';

const Installs: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useContext();
  const { data: installsData, refetch: reloadInstalls } = useAccountIntegrationInstanceGetAll<Install>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const deleteInstance = useAccountIntegrationInstanceDeleteOne<Operation>();
  const { waitForOperations, createLoader, removeLoader } = useLoader();
  const { createError } = useError();

  React.useEffect(() => {
    if (!installsData) {
      reloadInstalls();
    }
  }, [installsData, reloadInstalls]);

  const handleDelete = async () => {
    try {
      createLoader();
      const data = JSON.parse(JSON.stringify(installsData?.data)) as Install;
      let operationIds: string[] = [];
      for (let i = 0; i < data.items?.length; i++) {
        const response = await deleteInstance.mutateAsync({
          data: data.items[i],
          id: id,
          accountId: userData.accountId,
          subscriptionId: userData.subscriptionId,
        });
        operationIds.push(response.data.operationId);
      }
      await waitForOperations(operationIds);
      reloadInstalls();
    } catch (e) {
      createError(e.message);
    } finally {
      removeLoader();
    }
  };

  return (
    <SC.Wrapper>
      <SC.Header>Total Installs: {installsData ? installsData?.data.total : 'Loading...'}</SC.Header>
      <Button onClick={handleDelete} style={{ width: '200px' }} variant="contained" color="primary" size="large">
        Delete all installs
      </Button>
    </SC.Wrapper>
  );
};

export default Installs;
