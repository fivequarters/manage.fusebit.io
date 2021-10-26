import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Backdrop, Fade, Modal } from '@material-ui/core';
import * as SC from './styles';
import * as CSC from '../../globalStyle';
import cross from '../../../assets/cross.svg';
import server from '../../../assets/server.svg';
import Connect from '../Connect';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import { ListComponentProps } from '../../../interfaces/integrationDetailDevelop';
import ConfirmationPrompt from '../../common/ConfirmationPrompt';
import { findMatchingConnectorFeed } from '../../../utils/utils';

const NOT_FOUND_ICON = '/images/warning-red.svg';
const CLOSE_ICON_CLASS = 'close';

const urlOrSvgToImage = (img: string) =>
  img.match('^<svg') ? `data:image/svg+xml;utf8,${encodeURIComponent(img)}` : img;

const ListComponent: React.FC<ListComponentProps> = ({
  connector,
  onChange,
  onConnectorDelete,
  onLinkConnectorClick,
  linkConnector,
  id,
  integration,
}) => {
  const history = useHistory();
  const { getRedirectLink } = useGetRedirectLink();
  const [icon, setIcon] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [connectOpen, setConnectOpen] = React.useState(false);
  const connectorRef = useRef(connector);

  useEffect(() => {
    connectorRef.current = connector;
  }, [connector]);

  useEffect(() => {
    if (!connector.isApplication) {
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
    } else {
      setIcon(server);
    }
  }, [connector]);

  const handleConnectorDelete = () => {
    onConnectorDelete(connector);
    setDeleteModalOpen(false);
    setConnectOpen(false);
  };
  return (
    <SC.CardConnector
      id={id}
      onClick={(e: any) => {
        if (connector.isApplication) {
          if (!e.target.className.includes(CLOSE_ICON_CLASS) && !connectOpen && !deleteModalOpen) {
            setConnectOpen(true);
          }
        } else if (linkConnector) {
          if (onLinkConnectorClick) {
            onLinkConnectorClick(connector);
          }
        } else if (!e.target.className.includes(CLOSE_ICON_CLASS) && !deleteModalOpen) {
          history.push(getRedirectLink(`/connector/${connector.id}/configure`));
        }
      }}
    >
      <ConfirmationPrompt
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        handleConfirmation={handleConnectorDelete}
        title={
          connector.isApplication
            ? 'Are you sure you want to delete this application?'
            : 'Are you sure want to remove this Connector from the Integration?'
        }
        description={
          connector.isApplication
            ? 'All calls from your application to Fusebit that use this key will fail. Before deleting this key, make sure your application is no longer using this key.'
            : 'This will break the integration for your application and it will not work until you re-link this connector back'
        }
        confirmationButtonText={connector.isApplication ? 'Delete' : 'Remove'}
      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={connectOpen}
        onClose={() => setConnectOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
      >
        <Fade in={connectOpen}>
          <Connect
            onDelete={handleConnectorDelete}
            token={`*************${connector.tokenSignature?.slice(-4)}`}
            name={connector.name || ''}
            onChange={onChange}
            id={connector.id || ''}
            disableCopy
            open={connectOpen}
            onClose={() => setConnectOpen(false)}
            integration={integration}
          />
        </Fade>
      </Modal>
      {icon === '' ? (
        <CSC.Spinner margin="0 16px 0 0" />
      ) : (
        <SC.CardConnectorImage src={urlOrSvgToImage(icon)} alt="connector image" height="20" width="20" />
      )}
      <SC.CardConnectorText>
        {connector?.name ? connector?.name : connector.id} {icon === NOT_FOUND_ICON && 'is not found'}
      </SC.CardConnectorText>
      {!linkConnector && (
        <SC.CardConnectorCrossContainer
          className={CLOSE_ICON_CLASS}
          id="closeWrapper"
          onClick={() => setDeleteModalOpen(true)}
        >
          <SC.CardConnectorCross className={CLOSE_ICON_CLASS} src={cross} alt="Close" height="8" width="8" />
        </SC.CardConnectorCrossContainer>
      )}
    </SC.CardConnector>
  );
};

export default ListComponent;
