import FeedPicker from '@components/common/FeedPicker';
import { Feed, Snippet } from '@interfaces/feed';
import { Data } from '@interfaces/feedPicker';
import Modal from '@components/common/Modal';
import { useQueryClient } from 'react-query';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (feed: Feed, data: Data, snippet?: Snippet) => void;
  isIntegration: boolean;
  isSnippet?: boolean;
  hasConnectorDependency?: (feed: Feed) => boolean;
}

const FeedPickerModal = ({ open, onClose, onSubmit, isIntegration, isSnippet, hasConnectorDependency }: Props) => {
  const queryClient = useQueryClient();

  const handleClose = () => {
    queryClient.invalidateQueries('getIntegrationsFeed');
    queryClient.invalidateQueries('getConnectorsFeed');
    onClose();
  };

  return (
    <Modal disableActions open={open} onClose={handleClose}>
      <FeedPicker
        isIntegration={isIntegration}
        isSnippet={isSnippet}
        hasConnectorDependency={hasConnectorDependency}
        onSubmit={onSubmit}
        open={open}
        onClose={handleClose}
      />
    </Modal>
  );
};

export default FeedPickerModal;
