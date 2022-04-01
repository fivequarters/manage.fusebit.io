import { Feed, Snippet, ConnectorEntity } from '@interfaces/feed';
import { Data } from '@interfaces/feedPicker';
import { useCreateDataFromFeed } from '@hooks/useCreateDataFromFeed';
import FeedPickerModal from '@components/common/FeedPickerModal';
import { ApiResponse } from '@hooks/useAxios';
import { Integration, InnerConnector } from '@interfaces/integration';
import { useLoader } from '@hooks/useLoader';
// import { useMediaQuery } from '@material-ui/core';
// import FeedPickerMobile from '@components/common/FeedPickerMobile/FeedPickerMobile';

interface Props {
  open: boolean;
  onClose: (newConnector?: ConnectorEntity, existingConnector?: InnerConnector, feed?: Feed, snippet?: Snippet) => void;
  integrationData?: ApiResponse<Integration>;
}

const AddSnippetToIntegrationModal = ({ open, onClose, integrationData }: Props) => {
  const { createConnector } = useCreateDataFromFeed();
  const { createLoader, removeLoader } = useLoader();
  // const isMobile = useMediaQuery('(max-width:880px)');

  const getConnectorDependency = (feed: Feed) => {
    // Check if the connector is already associated with the integration, using
    // the provider name as a correlation mechanism.
    const requiredProvider =
      feed.configuration.components &&
      feed.configuration.components.length === 1 &&
      feed.configuration.components[0].provider;
    const result = integrationData?.data.data.components.find((c) => c.provider === requiredProvider);
    return result;
  };

  const handleCreate = async (feed: Feed, data: Data, snippet?: Snippet) => {
    const existingConnector = getConnectorDependency(feed);
    let onCloseCalled = false;
    try {
      let newConnector: ConnectorEntity | undefined;
      if (!existingConnector) {
        createLoader();
        newConnector = (await createConnector(feed, data)) as ConnectorEntity;
        console.log('new connector:', newConnector);
      }
      onCloseCalled = true;
      onClose(newConnector, existingConnector, feed, snippet);
    } finally {
      if (!existingConnector) {
        removeLoader();
      }
      if (!onCloseCalled) {
        onClose();
      }
    }
  };

  return (
    <>
      {/* TODO: mobile snippet picker */}
      {/* {isMobile ? (
        <FeedPickerMobile
          onClose={onClose}
          isIntegration={false}
          isSnippet={true}
          onSubmit={handleCreate}
          open={open}
        />
      ) : ( */}
      <FeedPickerModal
        onClose={onClose}
        onSubmit={handleCreate}
        hasConnectorDependency={(feed) => !!getConnectorDependency(feed)}
        open={open}
        isIntegration={false}
        isSnippet={true}
      />
      {/* )} */}
    </>
  );
};

export default AddSnippetToIntegrationModal;
