import React, { useState } from 'react';
import * as SC from './styles';
import * as CSC from '../../../globalStyle';
import { Button } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useAccountIntegrationInstanceGetAll } from '../../../../hooks/api/v2/account/integration/instance/useGetAll';
import { useContext } from '../../../../hooks/useContext';
import { Install } from '../../../../interfaces/install';
import { useEntityApi } from '../../../../hooks/useEntityApi';
import ConfirmationPrompt from '../../../ConfirmationPrompt/ConfirmationPrompt';

const Installs: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useContext();
  const { data: installsData, refetch: reloadInstalls } = useAccountIntegrationInstanceGetAll<Install>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const { deleteEntity } = useEntityApi();
  const [deleteOpen, setDeleteOpen] = useState(false);

  React.useEffect(() => {
    if (!installsData) {
      reloadInstalls();
    }
  }, [installsData, reloadInstalls]);

  const handleDelete = async () => {
    deleteEntity(id, installsData, false, () => reloadInstalls());
  };

  return (
    <SC.Wrapper>
      <ConfirmationPrompt
        open={deleteOpen}
        setOpen={setDeleteOpen}
        handleConfirmation={handleDelete}
        title={`Are you sure you want to delete ${
          installsData ? (installsData?.data.total > 1 ? 'these Installs?' : 'this Install?') : ''
        }`}
        description={`Your tenants will have to re-install this integration in their account.`}
      />
      <SC.Header>
        Total Installs: {installsData ? installsData?.data.total : <CSC.Spinner margin="0 0 0 5px" />}
      </SC.Header>
      <Button
        onClick={() => setDeleteOpen(true)}
        disabled={!installsData || installsData?.data.total === 0}
        style={{ width: '200px' }}
        variant="contained"
        color="primary"
        size="large"
      >
        Delete all installs
      </Button>
    </SC.Wrapper>
  );
};

export default Installs;
