import { Feed } from '../../../interfaces/feed';
import { Data } from '../../../interfaces/feedPicker';
import { useCreateDataFromFeed } from '../../../hooks/useCreateDataFromFeed';
import FeedPickerModal from '../FeedPickerModal';
import { ApiResponse } from '../../../hooks/useAxios';
import { Integration } from '../../../interfaces/integration';
import { useLoader } from '../../../hooks/useLoader';

interface Props {
  open: boolean;
  onClose: () => void;
  integrationData?: ApiResponse<Integration>;
}

const AddConnectorToIntegrationModal = ({ open, onClose, integrationData }: Props) => {
  const { createAndAddConnectorToIntegration } = useCreateDataFromFeed();
  const { createLoader, removeLoader } = useLoader();

  const handleCreate = async (feed: Feed, data: Data) => {
    try {
      createLoader();
      await createAndAddConnectorToIntegration(feed, data, integrationData);
    } finally {
      removeLoader();
      onClose();
    }
  };

  return <FeedPickerModal onClose={onClose} onSubmit={handleCreate} open={open} isIntegration={false} />;
};

export default AddConnectorToIntegrationModal;
