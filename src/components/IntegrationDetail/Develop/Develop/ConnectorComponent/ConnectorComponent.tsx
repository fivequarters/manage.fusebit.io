import React, { useEffect, useRef, useState } from 'react';
import * as SC from './styles';
import * as CSC from '../../../../globalStyle';
import { ConnectorComponentProps } from '../../../../../interfaces/integrationDetailDevelop';
import cross from '../../../../../assets/cross.svg';
import { useHistory } from 'react-router-dom';
import { useGetRedirectLink } from '../../../../../hooks/useGetRedirectLink';
import { findMatchingConnectorFeed } from '../../../../../utils/utils';
import ConfirmationPrompt from '../../../../ConfirmationPrompt/ConfirmationPrompt';

const NOT_FOUND_ICON = '/images/warning-red.svg';
const ConnectorComponent: React.FC<ConnectorComponentProps> = ({
  connector,
  onConnectorDelete,
  onLinkConnectorClick,
  linkConnector,
}) => {
  const history = useHistory();
  const { getRedirectLink } = useGetRedirectLink();
  const [icon, setIcon] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const connectorRef = useRef(connector);

  useEffect(() => {
    connectorRef.current = connector;
  }, [connector]);

  useEffect(() => {
    findMatchingConnectorFeed(connector)
      .then((item) => {
        setIcon(item.smallIcon);
      })
      .catch(() => {
        if (connector.missing) {
          setTimeout(() => {
            if (connectorRef.current.missing) {
              setIcon(NOT_FOUND_ICON);
            }
          }, 1000);
        }
      });
  }, [connector]);

  const handleConnectorDelete = () => {
    onConnectorDelete(connector);
    setDeleteModalOpen(false);
  };

  return (
    <SC.CardConnector
      onClick={(e: any) => {
        if (linkConnector) {
          onLinkConnectorClick && onLinkConnectorClick(connector);
        } else if (!e.target.id && !deleteModalOpen) {
          history.push(getRedirectLink(`/connector/${connector.id}/configure`));
        }
      }}
    >
      <ConfirmationPrompt
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        handleConfirmation={handleConnectorDelete}
        title={'Are you sure want to remove this Connector from the Integration?'}
        description={
          'This will break the integration for your application and it will not work until you re-link this connector back'
        }
        confirmationButtonText={'Remove'}
      />
      {icon === '' ? (
        <CSC.Spinner margin="0 16px 0 0" />
      ) : (
        <SC.CardConnectorImage src={icon} alt={'connector image'} height="20" width="20" />
      )}
      <SC.CardConnectorText>
        {connector.id} {icon === NOT_FOUND_ICON && 'is not found'}
      </SC.CardConnectorText>
      {!linkConnector && (
        <SC.CardConnectorCrossContainer id="closeWrapper" onClick={() => setDeleteModalOpen(true)}>
          <SC.CardConnectorCross id="close" src={cross} alt="close" height="8" width="8" />
        </SC.CardConnectorCrossContainer>
      )}
    </SC.CardConnector>
  );
};

export default ConnectorComponent;
