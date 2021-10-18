import MUIModal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import styled from 'styled-components';
import FeedPicker from '../FeedPicker';
import { Feed } from '../../../interfaces/feed';
import { Data } from '../../../interfaces/feedPicker';
import { useCreateDataFromFeed } from '../../../hooks/useCreateDataFromFeed';

interface Props {
  open: boolean;
  onClose: () => void;
  entityType: 'integration' | 'connector';
}

const Modal = styled(MUIModal)`
  & > div {
    &:focus-visible {
      outline: none;
    }
  }
`;

const NewFeedModal = ({ open, onClose, entityType }: Props) => {
  const { createIntegrationFromFeed, createConnectorFromFeed } = useCreateDataFromFeed();

  const handleCreate = async (feed: Feed, data: Data) => {
    let res;

    if (entityType === 'integration') {
      res = await createIntegrationFromFeed(feed, data);
    }

    if (entityType === 'connector') {
      res = await createConnectorFromFeed(feed, data);
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
