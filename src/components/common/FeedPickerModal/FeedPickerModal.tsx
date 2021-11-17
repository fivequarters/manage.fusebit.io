import FeedPicker from '@components/common/FeedPicker';
import { Feed } from '@interfaces/feed';
import { Data } from '@interfaces/feedPicker';
import Modal from '@components/common/Modal';
import { useQueryClient } from 'react-query';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (feed: Feed, data: Data) => void;
  isIntegration: boolean;
}

const FeedPickerModal = ({ open, onClose, onSubmit, isIntegration }: Props) => {
  const queryClient = useQueryClient();

  const handleClose = () => {
    queryClient.invalidateQueries(['getIntegrationsFeed', 'getConnectorsFeed']);
    onClose();
  };

  return (
    <Modal disableActions open={open} onClose={handleClose}>
      <FeedPicker isIntegration={isIntegration} onSubmit={onSubmit} open={open} onClose={handleClose} />
    </Modal>
  );
};

export default FeedPickerModal;
