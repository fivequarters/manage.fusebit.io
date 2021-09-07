import React, { useState } from 'react';
import * as SC from './styles';
import * as CSC from '../../../globalStyle';
import { Button } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useAccountConnectorIdentityGetAll } from '../../../../hooks/api/v2/account/connector/identity/useGetAll';
import { useContext } from '../../../../hooks/useContext';
import { Identity } from '../../../../interfaces/identities';
import { useEntityApi } from '../../../../hooks/useEntityApi';
import ConfirmationPrompt from '../../../ConfirmationPrompt/ConfirmationPrompt';

const Identities: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { userData } = useContext();
  const { data: identitiesData, refetch: reloadInstalls } = useAccountConnectorIdentityGetAll<Identity>({
    enabled: userData.token,
    id,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const { deleteEntity } = useEntityApi();
  const [deleteOpen, setDeleteOpen] = useState(false);

  React.useEffect(() => {
    if (!identitiesData) {
      reloadInstalls();
    }
  }, [identitiesData, reloadInstalls]);

  const handleDelete = async () => {
    deleteEntity(id, identitiesData, true, () => reloadInstalls());
  };

  return (
    <SC.Wrapper>
      <ConfirmationPrompt
        open={deleteOpen}
        setOpen={setDeleteOpen}
        handleConfirmation={handleDelete}
        title={`Are you sure you want to delete ${
          identitiesData ? (identitiesData?.data.total > 1 ? 'these Identities?' : 'this Identity?') : ''
        }`}
        description={`Your tenants will have to re-authenticate themselves in their account.`}
      />
      <SC.Header>
        Total Identities: {identitiesData ? identitiesData?.data.total : <CSC.Spinner margin="0 0 0 5px" />}
      </SC.Header>
      <Button
        onClick={() => setDeleteOpen(true)}
        disabled={!identitiesData || identitiesData?.data.total === 0}
        style={{ width: '200px' }}
        variant="contained"
        color="primary"
        size="large"
      >
        Delete all Identities
      </Button>
    </SC.Wrapper>
  );
};

export default Identities;
