import MUIModal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import FeedPicker from '../FeedPicker';
import { Entity, Feed } from '../../../interfaces/feed';
import { Data } from '../../../interfaces/feedPicker';
import { useCreateDataFromFeed } from '../../../hooks/useCreateDataFromFeed';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';

interface Props {
  open: boolean;
  onClose: () => void;
  entityType: 'integration' | 'connector';
  action?: 'add' | 'create';
  integrationData?: any;
}

const Modal = styled(MUIModal)`
  & > div {
    &:focus-visible {
      outline: none;
    }
  }
`;

const NewFeedModal = ({ open, onClose, entityType, action = 'create', integrationData }: Props) => {
  const {
    createIntegrationFromFeed,
    createConnectorFromFeed,
    createAndAddConnectorToIntegration,
  } = useCreateDataFromFeed();
  const history = useHistory();
  const { getRedirectLink } = useGetRedirectLink();

  const handleCreate = async (feed: Feed, data: Data) => {
    let res;

    if (entityType === 'integration') {
      res = await createIntegrationFromFeed(feed, data);
    }

    if (entityType === 'connector') {
      if (action === 'create') {
        const connector = (await createConnectorFromFeed(feed, data)) as Entity;

        history.push(getRedirectLink(`/connector/${connector.id}/configure`));

        return;
      }

      if (action === 'add') {
        res = await createAndAddConnectorToIntegration(feed, data, integrationData);
      }
    }

    if (!res) {
      onClose();
    }
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      style={{
        outline: 'none',
      }}
    >
      <FeedPicker isIntegration={entityType === 'integration'} onSubmit={handleCreate} open={open} onClose={onClose} />
    </Modal>
  );
};

export default NewFeedModal;
