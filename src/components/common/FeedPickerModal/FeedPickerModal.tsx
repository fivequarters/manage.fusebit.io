import FeedPicker from '@components/common/FeedPicker';
import { Feed } from '@interfaces/feed';
import { Data } from '@interfaces/feedPicker';
import Modal from '@components/common/Modal';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (feed: Feed, data: Data) => void;
  isIntegration: boolean;
}

const FeedPickerModal = ({ open, onClose, onSubmit, isIntegration }: Props) => {
  return (
    <Modal disableActions open={open} onClose={onClose}>
      <FeedPicker isIntegration={isIntegration} onSubmit={onSubmit} open={open} onClose={onClose} />
    </Modal>
  );
};

export default FeedPickerModal;
