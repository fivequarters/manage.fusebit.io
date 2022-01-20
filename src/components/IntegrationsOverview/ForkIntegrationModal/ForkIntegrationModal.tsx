import { useHistory } from 'react-router-dom';
import { Feed } from '@interfaces/feed';
import { Data } from '@interfaces/feedPicker';
import { useCreateDataFromFeed } from '@hooks/useCreateDataFromFeed';
import { useGetRedirectLink } from '@hooks/useGetRedirectLink';
import { useLoader } from '@hooks/useLoader';
import { useMediaQuery } from '@material-ui/core';
import FeedForkModal from '@components/common/FeedForkModal/FeedForkModal';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ForkIntegrationModal = ({ open, onClose }: Props) => {
  const { createLoader, removeLoader } = useLoader();
  const { createIntegrationAndConnector } = useCreateDataFromFeed();
  const history = useHistory();
  const { getRedirectLink } = useGetRedirectLink();
  const isMobile = useMediaQuery('(max-width:880px)');

  const handleCreate = async (feed: Feed, data: Data) => {
    try {
      createLoader();
      const integration = await createIntegrationAndConnector(feed, data);

      history.push(getRedirectLink(`/integration/${integration?.id || ''}/develop`));
    } finally {
      removeLoader();
    }
  };

  return <>{isMobile ? <FeedForkMobile /> : <FeedForkModal onClose={onClose} onSubmit={handleCreate} open={open} />}</>;
};

// TODO
const FeedForkMobile = () => <></>;

export default ForkIntegrationModal;
