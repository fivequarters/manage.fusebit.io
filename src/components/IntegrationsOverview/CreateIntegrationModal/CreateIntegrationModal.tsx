import { useHistory } from 'react-router-dom';
import { Feed } from '../../../interfaces/feed';
import { Data } from '../../../interfaces/feedPicker';
import { useCreateDataFromFeed } from '../../../hooks/useCreateDataFromFeed';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import FeedPickerModal from '../../common/FeedPickerModal';
import { useLoader } from '../../../hooks/useLoader';

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateIntegrationModal = ({ open, onClose }: Props) => {
  const { createLoader, removeLoader } = useLoader();
  const { createIntegrationAndConnector } = useCreateDataFromFeed();
  const history = useHistory();
  const { getRedirectLink } = useGetRedirectLink();

  const handleCreate = async (feed: Feed, data: Data) => {
    try {
      createLoader();
      const { integration } = (await createIntegrationAndConnector(feed, data)) || {};

      history.push(getRedirectLink(`/integration/${integration?.id || ''}/develop`));
    } finally {
      removeLoader();
    }
  };

  return <FeedPickerModal onClose={onClose} onSubmit={handleCreate} open={open} isIntegration />;
};

export default CreateIntegrationModal;
