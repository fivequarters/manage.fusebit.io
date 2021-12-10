import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { CircularProgress, useMediaQuery } from '@material-ui/core';
import ListItem from '@components/IntegrationDetailDevelop/ListItem';
import { useModal } from '@hooks/useModal';
import ConfirmationPrompt from '@components/common/ConfirmationPrompt';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import { useGetMatchingConnectorFeed } from '@hooks/api/useGetMatchingConnectorFeed';
import { useEntityApi } from '@hooks/useEntityApi';
import { Integration } from '@interfaces/integration';
import { ApiResponse } from '@hooks/useAxios';
import { useLoader } from '@hooks/useLoader';
import LineConnector from '@components/common/LineConnector';
import { INTEGRATION_CARD_ID } from '@components/IntegrationDetailDevelop/IntegrationCard/IntegrationCard';
import { CARD_OVERLAPPING_MEDIA_QUERY } from '@components/IntegrationDetailDevelop/constants';
import { FinalConnector } from '@interfaces/integrationDetailDevelop';
import notFoundIcon from '@assets/warning-red.svg';
import { urlOrSvgToImage } from '@utils/utils';
import { useQueryClient } from 'react-query';
import { Feed } from '@interfaces/feed';

interface Props {
  className?: string;
  connector: FinalConnector;
  integrationData?: ApiResponse<Integration>;
}

const ConnectorItem: React.FC<Props> = ({ className, connector, integrationData }) => {
  const queryClient = useQueryClient();
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
  const name = useMemo(() => {
    if (connector.missing && integrationData?.data.id !== connector.id) {
      return `${connector.id} is not found`;
    }
    return connector.id;
  }, [connector, integrationData]);

  const icon = useMemo(() => {
    if (connector.missing && integrationData?.data.id === connector.id) {
      const feedId = integrationData.data.tags['fusebit.feedId'];
      const feed = queryClient.getQueryData<Feed[]>('getIntegrationsFeed');
      const integrationFeed = (feed || []).find((i) => i.id === feedId);
      return integrationFeed?.smallIcon;
    }
    return connectorFeed?.smallIcon ? urlOrSvgToImage(connectorFeed?.smallIcon) : notFoundIcon;
  }, [connectorFeed, connector, integrationData, queryClient]);

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
        icon={isLoading ? <CircularProgress size={20} /> : <img src={icon} alt="connector" height={20} width={20} />}
        name={name}
        onDelete={toggleDeleteConnectorModal}
      />
      {!matchesCardOverlapping && (
        <LineConnector start={INTEGRATION_CARD_ID} startAnchor="right" end={connector.id} endAnchor="left" />
      )}
    </>
  );
};

export default ConnectorItem;
