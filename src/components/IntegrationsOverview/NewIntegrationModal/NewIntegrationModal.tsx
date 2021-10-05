import FeedPicker from '../../FeedPicker';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { Feed } from '../../../interfaces/feed';
import { Data } from '../../../interfaces/feedPicker';
import { useCreateDataFromFeed } from '../../../hooks/useCreateDataFromFeed';

interface Props {
  open: boolean;
  onClose: () => void;
}

const NewIntegrationModal = ({ open, onClose }: Props) => {
  const { createDataFromFeed } = useCreateDataFromFeed();

  const handleCreate = async (activeIntegration: Feed, data: Data) => {
    const res = await createDataFromFeed(activeIntegration, data);

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
    >
      <FeedPicker isIntegration onSubmit={handleCreate} open={open} onClose={onClose} />
    </Modal>
  );
};

export default NewIntegrationModal;
