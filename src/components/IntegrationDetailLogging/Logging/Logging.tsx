import { useAuthContext } from '@hooks/useAuthContext';
import { Box, Button } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { trackEventMemoized } from '@utils/analytics';
import styled from 'styled-components';
import IframeResizer from 'iframe-resizer-react';
import { useEffect } from 'react';

const StyledLogs = styled(IframeResizer)`
  position: relative;
  border-radius: 8px;
  box-shadow: 0px 1px 30px -1px rgb(52 72 123 / 10%);
`;

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

const FROM = Date.now() - WEEK_IN_MS;

const Logging = () => {
  const { userData } = useAuthContext();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const handleBlur = () => {
      if (document.activeElement === document.getElementById('logging')) {
        trackEventMemoized('Grafana Iframe Clicked', 'Logging');
      }
    };

    window.addEventListener('blur', handleBlur);

    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  const handleExplore = () => {
    trackEventMemoized('Explore Button Clicked', 'Logging');
    window.open(`${process.env.REACT_APP_FUSEBIT_DEPLOYMENT}/v2/grafana?theme=light`, '_blank');
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
      <StyledLogs
        log
        id="logging"
        title="logging"
        src={`${process.env.REACT_APP_FUSEBIT_DEPLOYMENT}/v2/grafana/bootstrap/d-solo/logging/basic?panelId=2?kiosk&theme=light&refresh=1s&fusebitAuthorization=${userData.token}&fusebitAccountId=${userData.accountId}&var-accountId=${userData.accountId}&var-subscriptionId=${userData.subscriptionId}&var-boundaryId=integration&var-functionId=${id}&from=${FROM}`}
        style={{ width: '1px', minWidth: '100%', minHeight: '350px' }}
        frameBorder="0"
      />
    </Box>
  );
};

export default Logging;
