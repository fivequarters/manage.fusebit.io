import React from 'react';
import * as SC from './styles';
import cross from '../../../../../assets/cross.svg';
import { Props } from '../../../../../interfaces/edit';
import { useContext } from '../../../../../hooks/useContext';

import FusebitEditor from './FusebitEditor';

const EditGui = React.forwardRef(({ open, onClose, integrationId }: Props) => {
  const { userData } = useContext();

  return (
    <SC.Card open={open}>
      <SC.CardClose onClick={() => onClose()}>
        <img src={cross} alt="close" height="10" width="10" />
      </SC.CardClose>
      <SC.Title>Edit {integrationId}</SC.Title>
      <FusebitEditor
        boundaryId={'integration'}
        functionId={integrationId}
        account={{
          accountId: userData.accountId,
          subscriptionId: userData.subscriptionId,
          baseUrl: process.env.REACT_APP_FUSEBIT_DEPLOYMENT,
          accessToken: userData.token,
        }}
        options={{ entityType: 'integration' }}
      />
    </SC.Card>
  );
});

export default EditGui;
