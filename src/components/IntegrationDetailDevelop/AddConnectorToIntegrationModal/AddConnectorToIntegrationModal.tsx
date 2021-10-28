import { useMediaQuery } from '@material-ui/core';
import { Feed } from '../../../interfaces/feed';
import { Data } from '../../../interfaces/feedPicker';
import { useCreateDataFromFeed } from '../../../hooks/useCreateDataFromFeed';
import FeedPickerModal from '../../common/FeedPickerModal';
import { ApiResponse } from '../../../hooks/useAxios';
import { Integration } from '../../../interfaces/integration';
import { useLoader } from '../../../hooks/useLoader';
import FeedPickerMobile from '../../common/FeedPickerMobile/FeedPickerMobile';

interface Props {
  open: boolean;
  onClose: () => void;
  integrationData?: ApiResponse<Integration>;
}

const AddConnectorToIntegrationModal = ({ open, onClose, integrationData }: Props) => {
  const { createAndAddConnectorToIntegration } = useCreateDataFromFeed();
  const { createLoader, removeLoader } = useLoader();
  const isMobile = useMediaQuery('(max-width:880px)');

  const handleCreate = async (feed: Feed, data: Data) => {
    try {
      createLoader();
      await createAndAddConnectorToIntegration(feed, data, integrationData);
    } finally {
      removeLoader();
      onClose();
    }
  };

  return (
    <>
      {isMobile ? (
        <FeedPickerMobile onClose={onClose} type="connector" title="Connector" onSubmit={handleCreate} open={open} />
      ) : (
        <FeedPickerModal onClose={onClose} onSubmit={handleCreate} open={open} isIntegration={false} />
      )}
    </>
  );
};

export default AddConnectorToIntegrationModal;
