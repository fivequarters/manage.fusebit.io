import { useHistory } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { Entity, Feed } from '../../../interfaces/feed';
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

const CreateConnectorModal = ({ open, onClose }: Props) => {
  const { createLoader, removeLoader } = useLoader();
  const { createConnector } = useCreateDataFromFeed();
  const history = useHistory();
  const { getRedirectLink } = useGetRedirectLink();
  const isMobile = useMediaQuery('(max-width:880px)');

  const handleCreate = async (feed: Feed, data: Data) => {
    try {
      createLoader();
      const connector = await createConnector(feed, data);

      history.push(getRedirectLink(`/connector/${(connector as Entity).id}/configure`));
    } finally {
      removeLoader();
    }
  };

  return (
    <>
      {isMobile ? (
        <FeedPickerMobile onClose={onClose} isIntegration={false} onSubmit={handleCreate} open={open} />
      ) : (
        <FeedPickerModal onClose={onClose} onSubmit={handleCreate} open={open} isIntegration={false} />
      )}
    </>
  );
};

export default CreateConnectorModal;
