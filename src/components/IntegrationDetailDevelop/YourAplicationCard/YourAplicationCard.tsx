import { Box, useMediaQuery, useTheme } from '@material-ui/core';
import { useState } from 'react';
import { useBackendCreateOne } from '../../../hooks/api/v1/backend/useCreateOne';
import { useBackendGetAll } from '../../../hooks/api/v1/backend/useGetAll';
import { useLoader } from '../../../hooks/useLoader';
import { useModal } from '../../../hooks/useModal';
import { BackendClient } from '../../../interfaces/backendClient';
import { trackEvent } from '../../../utils/analytics';
import Button from '../../common/Button/Button';
import LineConnector from '../../common/LineConnector';
import BackendItem from '../BackendItem';
import BaseCard from '../BaseCard';
import { CARD_OVERLAPPING_MEDIA_QUERY } from '../constants';
import { INTEGRATION_CARD_ID } from '../IntegrationCard/IntegrationCard';
import NewBackendModal from '../NewBackendModal';

interface Props {
  className?: string;
}

const YourAplication: React.FC<Props> = ({ className }) => {
  const [newBackendOpen, setBackendOpen, toggleNewBackend] = useModal();
  const [createdBackend, setCreatedBackend] = useState<BackendClient>();
  const { data: backends = [], isLoading } = useBackendGetAll();
  const { mutateAsync } = useBackendCreateOne();
  const { createLoader, removeLoader } = useLoader();
  const theme = useTheme();
  const matchesMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const matchesCardOverlapping = useMediaQuery(CARD_OVERLAPPING_MEDIA_QUERY);

  const handleConnect = async () => {
    trackEvent('Develop Connect Button Clicked', 'Integration');
    createLoader();
    const newBackend = await mutateAsync();
    removeLoader();
    setCreatedBackend(newBackend);
    toggleNewBackend();
  };

  return (
    <>
      <NewBackendModal backendClient={createdBackend} open={newBackendOpen} onClose={() => setBackendOpen(false)} />
      <BaseCard
        id="your-application"
        className={className}
        title="Your Application"
        isLoading={isLoading}
        actions={
          <Button
            mode="add"
            size={matchesMobile ? 'small' : 'large'}
            style={{
              width: 200,
            }}
            onClick={handleConnect}
            disabled={backends.length >= 5} // TODO: Maybe backend validation?
          >
            Connect
          </Button>
        }
      >
        <Box>
          {backends.map((backend) => (
            <BackendItem key={backend.id} backend={backend} />
          ))}
        </Box>
      </BaseCard>
      {matchesCardOverlapping && (
        <LineConnector start="your-application" startAnchor="bottom" end={INTEGRATION_CARD_ID} endAnchor="top" />
      )}
    </>
  );
};

export default YourAplication;
