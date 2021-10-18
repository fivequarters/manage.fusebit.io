import MUIModal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import styled from 'styled-components';
import FeedPicker from '../../FeedPicker';
import { Feed } from '../../../interfaces/feed';
import { Data } from '../../../interfaces/feedPicker';
import { useCreateDataFromFeed } from '../../../hooks/useCreateDataFromFeed';

interface Props {
  open: boolean;
  onClose: () => void;
  isIntegration: boolean;
}

const Modal = styled(MUIModal)`
  & > div {
    &:focus-visible {
      outline: none;
    }
  }
`;

const NewFeedModal = ({ open, onClose, isIntegration }: Props) => {
  const { createDataFromFeed } = useCreateDataFromFeed();

  const handleCreate = async (feed: Feed, data: Data) => {
    const res = await createDataFromFeed(feed, data, !isIntegration);

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
      <FeedPicker isIntegration={isIntegration} onSubmit={handleCreate} open={open} onClose={onClose} />
    </Modal>
  );
};

export default NewFeedModal;
