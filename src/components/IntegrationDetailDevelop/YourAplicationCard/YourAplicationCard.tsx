import { Box, useMediaQuery } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useBackendCreateOne } from '@hooks/api/v1/backend/useCreateOne';
import { useBackendGetAll } from '@hooks/api/v1/backend/useGetAll';
import { useLoader } from '@hooks/useLoader';
import { useModal } from '@hooks/useModal';
import useUpdateLineConnectors from '@hooks/useUpdateLineConnectors';
import { BackendClient } from '@interfaces/backendClient';
import { trackEventMemoized } from '@utils/analytics';
import Button from '@components/common/Button/Button';
import LineConnector from '@components/common/LineConnector';
import BackendItem from '@components/IntegrationDetailDevelop/BackendItem';
import BaseCard from '@components/IntegrationDetailDevelop/BaseCard';
import { CARD_OVERLAPPING_MEDIA_QUERY } from '@components/IntegrationDetailDevelop/constants';
import EmptyBackendList from '@components/IntegrationDetailDevelop/EmptyBackendList';
import { INTEGRATION_CARD_ID } from '@components/IntegrationDetailDevelop/IntegrationCard/IntegrationCard';
import NewBackendModal from '@components/IntegrationDetailDevelop/NewBackendModal';
import useSampleApp from '@hooks/useSampleApp';
import { useGetIntegrationFromCache } from '@hooks/useGetIntegrationFromCache';

interface Props {
  className?: string;
}

const YourAplication: React.FC<Props> = ({ className }) => {
  const { url: sampleAppUrl } = useSampleApp();
  const integrationData = useGetIntegrationFromCache();
  const [newBackendOpen, setBackendOpen, toggleNewBackend] = useModal();
  const [createdBackend, setCreatedBackend] = useState<BackendClient>();
  const { data: backends = [], isLoading } = useBackendGetAll();
  const { mutateAsync } = useBackendCreateOne();
  const { createLoader, removeLoader } = useLoader();
  const matchesCardOverlapping = useMediaQuery(CARD_OVERLAPPING_MEDIA_QUERY);
  const updateLines = useUpdateLineConnectors();

  const handleConnect = async () => {
    trackEventMemoized('Develop Connect Button Clicked', 'Integration');
    createLoader();
    const newBackend = await mutateAsync();
    removeLoader();
    setCreatedBackend(newBackend);
    toggleNewBackend();
  };

  const openSampleApp = () => {
    trackEventMemoized('Sample App Clicked', 'My Application', {
      Integration: integrationData?.data?.tags['fusebit.feedId'],
    });

    const sampleAppTab = window.open() as Window;
    sampleAppTab.opener = null;
    sampleAppTab.location.href = sampleAppUrl;
    sampleAppTab.focus();
  };

  useEffect(() => {
    updateLines();
  }, [backends, updateLines]);

  return (
    <>
      <NewBackendModal backendClient={createdBackend} open={newBackendOpen} onClose={() => setBackendOpen(false)} />
      <BaseCard
        id="your-application"
        className={className}
        title="Your Applications"
        isLoading={isLoading}
        actions={
          <>
            <Button
              mode="add"
              size="large"
              style={{
                width: 200,
              }}
              onClick={handleConnect}
              disabled={backends.length >= 5} // TODO: Maybe backend validation?
            >
              Connect
            </Button>
            {sampleAppUrl && (
              <Button
                mode="search"
                size="large"
                style={{
                  width: 200,
                }}
                onClick={() => openSampleApp()}
              >
                Sample App
              </Button>
            )}
          </>
        }
      >
        <Box>
          {backends.length > 0 ? (
            backends.map((backend) => <BackendItem key={backend.id} backend={backend} />)
          ) : (
            <EmptyBackendList />
          )}
        </Box>
      </BaseCard>
      {matchesCardOverlapping && (
        <LineConnector start="your-application" startAnchor="bottom" end={INTEGRATION_CARD_ID} endAnchor="top" />
      )}
    </>
  );
};

export default YourAplication;
