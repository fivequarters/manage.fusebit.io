import { useHistory } from 'react-router-dom';
import { useMediaQuery } from '@material-ui/core';
import { Feed } from '../../../interfaces/feed';
import { Data } from '../../../interfaces/feedPicker';
import { useCreateDataFromFeed } from '../../../hooks/useCreateDataFromFeed';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import FeedPickerModal from '../../common/FeedPickerModal';
import { useLoader } from '../../../hooks/useLoader';
import FeedPickerMobile from '../../common/FeedPickerMobile/FeedPickerMobile';

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateIntegrationModal = ({ open, onClose }: Props) => {
  const { createLoader, removeLoader } = useLoader();
  const { createIntegrationAndConnector } = useCreateDataFromFeed();
  const history = useHistory();
  const { getRedirectLink } = useGetRedirectLink();
  const isMobile = useMediaQuery('(max-width:880px)');

  const handleCreate = async (feed: Feed, data: Data) => {
    try {
      createLoader();
      const { integration } = (await createIntegrationAndConnector(feed, data)) || {};

      history.push(getRedirectLink(`/integration/${integration?.id || ''}/develop`));
    } finally {
      removeLoader();
    }
  };

  return (
    <>
      {isMobile ? (
        <FeedPickerMobile
          onClose={onClose}
          type="integration"
          title="Integration"
          onSubmit={handleCreate}
          open={open}
        />
      ) : (
        <FeedPickerModal onClose={onClose} onSubmit={handleCreate} open={open} isIntegration />
      )}
    </>
  );
};

export default CreateIntegrationModal;
