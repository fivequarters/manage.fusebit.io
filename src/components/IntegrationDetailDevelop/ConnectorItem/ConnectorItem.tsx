import React from 'react';
import { useHistory } from 'react-router-dom';
import { CircularProgress, useMediaQuery } from '@material-ui/core';
import ListItem from '../ListItem';
import { useModal } from '../../../hooks/useModal';
import ConfirmationPrompt from '../../common/ConfirmationPrompt';
import { Connector } from '../../../interfaces/connector';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import { useGetMatchingConnectorFeed } from '../../../hooks/api/useGetMatchingConnectorFeed';
import { useEntityApi } from '../../../hooks/useEntityApi';
import { Integration } from '../../../interfaces/integration';
import { ApiResponse } from '../../../hooks/useAxios';
import { useLoader } from '../../../hooks/useLoader';
import LineConnector from '../../common/LineConnector';
import { INTEGRATION_CARD_ID } from '../IntegrationCard/IntegrationCard';
import { CARD_OVERLAPPING_MEDIA_QUERY } from '../constants';

interface Props {
  className?: string;
  connector: Connector;
  integrationData?: ApiResponse<Integration>;
}

const ConnectorItem: React.FC<Props> = ({ className, connector, integrationData }) => {
  const [deleteConnectorModalOpen, setDeleteConnectorModal, toggleDeleteConnectorModal] = useModal();
  const { data: connectorFeed, isLoading } = useGetMatchingConnectorFeed({ connector });
  const { getRedirectLink } = useGetRedirectLink();
  const history = useHistory();
  const handleClick = () => history.push(getRedirectLink(`/connector/${connector.id}/configure`));
  const { removeConnectorFromIntegration } = useEntityApi();
  const { createLoader, removeLoader } = useLoader();
  const matchesCardOverlapping = useMediaQuery(CARD_OVERLAPPING_MEDIA_QUERY);

  const handleDelete = async () => {
    try {
      createLoader();

      await removeConnectorFromIntegration(connector, integrationData);
    } finally {
      removeLoader();
    }
  };

  return (
    <>
      <ConfirmationPrompt
        open={deleteConnectorModalOpen}
        setOpen={setDeleteConnectorModal}
        handleConfirmation={handleDelete}
        title="Are you sure want to remove this Connector from the Integration?"
        description="This will break the integration for your application and it will not work until you re-link this connector back"
        confirmationButtonText="Remove"
      />
      <ListItem
        id={connector.id}
        onClick={handleClick}
        className={className}
        icon={
          isLoading ? (
            <CircularProgress size={20} />
          ) : (
            <img src={connectorFeed?.smallIcon} alt="connector" height={20} width={20} />
          )
        }
        name={connector.id}
        onDelete={toggleDeleteConnectorModal}
      />
      {!matchesCardOverlapping && (
        <LineConnector start={INTEGRATION_CARD_ID} startAnchor="right" end={connector.id} endAnchor="left" />
      )}
    </>
  );
};

export default ConnectorItem;
