import { useHistory } from 'react-router-dom';
import { Entity, Feed } from '../../../interfaces/feed';
import { Data } from '../../../interfaces/feedPicker';
import { useCreateDataFromFeed } from '../../../hooks/useCreateDataFromFeed';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import FeedPickerModal from '../FeedPickerModal';
import { useLoader } from '../../../hooks/useLoader';

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateConnectorModal = ({ open, onClose }: Props) => {
  const { createLoader, removeLoader } = useLoader();
  const { createConnector } = useCreateDataFromFeed();
  const history = useHistory();
  const { getRedirectLink } = useGetRedirectLink();

  const handleCreate = async (feed: Feed, data: Data) => {
    try {
      createLoader();
      const connector = await createConnector(feed, data);

      history.push(getRedirectLink(`/connector/${(connector as Entity).id}/configure`));
    } finally {
      removeLoader();
    }
  };

  return <FeedPickerModal onClose={onClose} onSubmit={handleCreate} open={open} isIntegration={false} />;
};

export default CreateConnectorModal;
