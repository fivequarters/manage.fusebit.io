import { Feed, Snippet } from '@interfaces/feed';
import { Data } from '@interfaces/feedPicker';
import { useFeedQuery } from '@hooks/useFeedQuery';
import Modal from '@components/common/Modal';
import { useQueryClient } from 'react-query';
import ForkPickerModal from '@components/common/ForkPickerModal';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (feed: Feed, data: Data, snippet?: Snippet) => void;
  isSnippet?: boolean;
  hasConnectorDependency?: (feed: Feed) => boolean;
}

const FeedForkModal = ({ open, onClose, onSubmit, isSnippet, hasConnectorDependency }: Props) => {
  const queryClient = useQueryClient();
  const { integrationsFeedQueryKey } = useFeedQuery();

  const handleClose = () => {
    queryClient.invalidateQueries(integrationsFeedQueryKey);
    onClose();
  };

  return (
    <Modal disableActions open={open} onClose={handleClose}>
      <ForkPickerModal
        isSnippet={isSnippet}
        hasConnectorDependency={hasConnectorDependency}
        onSubmit={onSubmit}
        open={open}
        onClose={handleClose}
      />
    </Modal>
  );
};

export default FeedForkModal;
