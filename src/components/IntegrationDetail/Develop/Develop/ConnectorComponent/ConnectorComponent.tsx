import React, { useEffect, useRef, useState } from 'react';
import * as SC from './styles';
import * as CSC from '../../../../globalStyle';
import { ConnectorComponentProps } from '../../../../../interfaces/integrationDetailDevelop';
import cross from '../../../../../assets/cross.svg';
import { useHistory } from 'react-router-dom';
import { useGetRedirectLink } from '../../../../../hooks/useGetRedirectLink';
import { integrationsFeed, connectorsFeed } from '../../../../../static/feed';
import { Button, Modal, Backdrop } from '@material-ui/core';

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
    if (connector.tags) {
      const feedtype = connector.tags['fusebit.feedType'];
      const feedId = connector.tags['fusebit.feedId'];

      if (feedtype === 'integration') {
        integrationsFeed().then((feed) => {
          feed.forEach((item) => {
            if (item.id === feedId) {
              setIcon(item.smallIcon);
            }
          });
        });
      } else {
        connectorsFeed().then((feed) => {
          feed.forEach((item) => {
            if (item.id === feedId) {
              setIcon(item.smallIcon);
            }
          });
        });
      }
    } else if (connector.missing) {
      setTimeout(() => {
        if (connectorRef.current.missing) {
          setIcon(NOT_FOUND_ICON);
        }
      }, 1000);
    }
  }, [connector]);

  const handleConnectorDelete = () => {
    onConnectorDelete(connector.id);
    setDeleteModalOpen(false);
  };

  return (
    <SC.CardConnector
      onClick={(e: any) => {
        if (linkConnector) {
          onLinkConnectorClick && onLinkConnectorClick(connector.id);
        } else if (!e.target.id && !deleteModalOpen) {
          history.push(getRedirectLink(`/connector/${connector.id}/configure`));
        }
      }}
    >
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
      >
        <SC.Card open={deleteModalOpen}>
          <SC.Close onClick={() => setDeleteModalOpen(false)} src={cross} alt="cross" height="12" width="12" />
          <SC.Title>Are you sure you want to delete this connector?</SC.Title>
          <SC.Description>You cannot undo this action.</SC.Description>
          <SC.ButtonsWrapper>
            <Button
              onClick={() => setDeleteModalOpen(false)}
              style={{ width: '77px', marginRight: '16px' }}
              size="medium"
              variant="outlined"
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConnectorDelete}
              style={{ width: '77px' }}
              size="medium"
              variant="contained"
              color="primary"
            >
              Delete
            </Button>
          </SC.ButtonsWrapper>
        </SC.Card>
      </Modal>
      {icon === '' ? (
        <CSC.Spinner loading={true} margin="0 16px 0 0" />
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
