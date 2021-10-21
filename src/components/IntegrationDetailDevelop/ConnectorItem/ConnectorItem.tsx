import React from 'react';
import { useHistory } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import ListItem from '../ListItem';
import { useModal } from '../../../hooks/useModal';
import ConfirmationPrompt from '../../common/ConfirmationPrompt';
import { Connector } from '../../../interfaces/connector';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import { useGetMatchingConnectorFeed } from '../../../hooks/api/useGetMatchingConnectorFeed';

interface Props {
  className?: string;
  connector: Connector;
}

const ConnectorItem: React.FC<Props> = ({ className, connector }) => {
  const [deleteConnectorModalOpen, setDeleteConnectorModal, toggleDeleteConnectorModal] = useModal();
  const { data: connectorFeed, isLoading } = useGetMatchingConnectorFeed({ connector });
  const { getRedirectLink } = useGetRedirectLink();
  const history = useHistory();
  const handleClick = () => history.push(getRedirectLink(`/connector/${connector.id}/configure`));

  return (
    <>
      <ConfirmationPrompt
        open={deleteConnectorModalOpen}
        setOpen={setDeleteConnectorModal}
        handleConfirmation={() => {}}
        title="Are you sure want to remove this Connector from the Integration?"
        description="This will break the integration for your application and it will not work until you re-link this connector back"
        confirmationButtonText="Remove"
      />
      <ListItem
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
    </>
  );
};

export default ConnectorItem;
