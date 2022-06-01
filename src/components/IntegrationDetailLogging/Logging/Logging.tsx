import { Box, Button } from '@material-ui/core';
import { trackEventMemoized } from '@utils/analytics';
import GrafanaLogs from '@components/common/GrafanaLogs';
import useGrafanaLogs from '@hooks/useGrafanaLogs';
import { useParams } from 'react-router-dom';

const Logging = () => {
  const { id } = useParams<{ id: string }>();
  const { exploreUrl } = useGrafanaLogs({
    integrationId: id,
    onBlur: () => {
      trackEventMemoized('Grafana Iframe Clicked', 'Logging');
    },
  });

  const handleExplore = () => {
    trackEventMemoized('Explore Button Clicked', 'Logging');
    window.open(exploreUrl, '_blank');
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      pb="60px"
      position="relative"
    >
      <Button
        onClick={handleExplore}
        variant="outlined"
        color="primary"
        size="large"
        style={{ marginLeft: 'auto', marginBottom: '24px' }}
      >
        Explore
      </Button>
      <GrafanaLogs />
    </Box>
  );
};

export default Logging;
