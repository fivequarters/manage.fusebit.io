import { Box } from '@material-ui/core';
import { useState } from 'react';
import { useBackendGetAll } from '../../../hooks/api/v1/backends/useGetAll';
import { useBackendClient } from '../../../hooks/useBackendClient';
import { useModal } from '../../../hooks/useModal';
import { BackendClient } from '../../../interfaces/backendClient';
import { trackEvent } from '../../../utils/analytics';
import Button from '../../common/Button/Button';
import Loader from '../../common/Loader';
import AddBackendModal from '../AddBackendModal';
import BackendItem from '../BackendItem';
import BaseCard from '../BaseCard';

interface Props {
  className?: string;
}

const YourAplication: React.FC<Props> = ({ className }) => {
  const [newBackendOpen, , toggleNewBackend] = useModal();
  const [createdBackend, setCreatedBackend] = useState<BackendClient>();
  const { registerBackend } = useBackendClient();
  const { data: backends = [], isLoading } = useBackendGetAll();

  const handleConnect = async () => {
    trackEvent('Develop Connect Button Clicked', 'Integration');
    const newBackend = await registerBackend();
    setCreatedBackend(newBackend);
    toggleNewBackend();
  };

  return (
    <>
      <AddBackendModal backendClient={createdBackend} open={newBackendOpen} onClose={toggleNewBackend} />
      <BaseCard
        className={className}
        title="Your Application"
        actions={
          <Button
            mode="add"
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
        {isLoading ? (
          <Loader />
        ) : (
          <Box>
            {backends.map((backend) => (
              <BackendItem key={backend.id} name={backend.name || backend.issuer} />
            ))}
          </Box>
        )}
      </BaseCard>
    </>
  );
};

export default YourAplication;
