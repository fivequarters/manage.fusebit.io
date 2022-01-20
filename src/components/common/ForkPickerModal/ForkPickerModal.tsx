import { Feed, Snippet } from '@interfaces/feed';
import { Data } from '@interfaces/feedPicker';
import Modal from '@components/common/Modal';
import { useQueryClient } from 'react-query';
import ForkPicker from '@components/common/ForkPicker';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (feed: Feed, data: Data, snippet?: Snippet) => void;
  isSnippet?: boolean;
  hasConnectorDependency?: (feed: Feed) => boolean;
}

const ForkPickerModal = ({ open, onClose, onSubmit, isSnippet, hasConnectorDependency }: Props) => {
  const queryClient = useQueryClient();

  const handleClose = () => {
    queryClient.invalidateQueries('getIntegrationsFeed');
    queryClient.invalidateQueries('getConnectorsFeed');
    onClose();
  };

  return (
    <Modal disableActions open={open} onClose={handleClose}>
      <ForkPicker
        isSnippet={isSnippet}
        hasConnectorDependency={hasConnectorDependency}
        onSubmit={onSubmit}
        open={open}
        onClose={handleClose}
      />
    </Modal>
  );
};

export default ForkPickerModal;
