import React, { useState, useEffect } from 'react';
import * as SC from './styles';
import { Props } from '../../../../../interfaces/edit';
import { useContext } from '../../../../../hooks/useContext';

import FusebitEditor from './FusebitEditor';
import { useLoader } from '../../../../../hooks/useLoader';

const EditGui = React.forwardRef(({ onClose, integrationId }: Props) => {
  const { userData } = useContext();
  const [isMounted, setIsMounted] = useState(false);
  const { createLoader, removeLoader } = useLoader();

  useEffect(() => {
    if (isMounted) {
      removeLoader();
    } else {
      createLoader();
    }
  }, [isMounted, createLoader, removeLoader]);

  return (
    <>
      <SC.EditorContainer>
        {isMounted && (
          <SC.CloseHeader>
            <SC.Close onClick={onClose} />
          </SC.CloseHeader>
        )}
        <SC.FusebitEditorContainer>
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
            onLoaded={() => setIsMounted(true)}
          />
        </SC.FusebitEditorContainer>
      </SC.EditorContainer>
    </>
  );
});

export default EditGui;
