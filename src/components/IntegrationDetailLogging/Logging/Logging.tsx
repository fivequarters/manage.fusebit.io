import { useAuthContext } from '@hooks/useAuthContext';
import { Box, Button } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { trackEventMemoized } from '@utils/analytics';
import styled from 'styled-components';
import { useEffect } from 'react';

const StyledLogs = styled.iframe`
  position: relative;
  border-radius: 8px;
  box-shadow: 0px 1px 30px -1px rgb(52 72 123 / 10%);
`;

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
const FROM = Date.now() - WEEK_IN_MS;
const DEFAULT_HEIGHT = 350;

const Logging = () => {
  const { userData } = useAuthContext();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      // new height in px
      const newHeightMessage = e.data;
      if (typeof newHeightMessage === 'string') {
        const newHeight = Number(newHeightMessage?.replace('px', ''));
        const height = newHeight > DEFAULT_HEIGHT ? newHeightMessage : `${DEFAULT_HEIGHT}px`;
        const iframe = document.getElementById('logging');
        if (iframe) {
          iframe.style.height = height;
        }
      }
    };

    const handleBlur = () => {
      if (document.activeElement === document.getElementById('logging')) {
        trackEventMemoized('Grafana Iframe Clicked', 'Logging');
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleExplore = () => {
    trackEventMemoized('Explore Button Clicked', 'Logging');
    // window.open(`${process.env.REACT_APP_FUSEBIT_DEPLOYMENT}/v2/grafana?theme=fusebit`, '_blank');
    window.open(`http://localhost:8080?theme=fusebit`, '_blank');
  };

  const testClick = () => {
    // @ts-ignore
    document.getElementById('logging')?.contentWindow?.postMessage?.(`Hello!`, '*');
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
        id="logging"
        title="logging"
        src="http://localhost:8080/d-solo/kxPybdl7k/test?orgId=1&from=1652950821225&to=1652972421225&panelId=2&theme=fusebit"
        height={DEFAULT_HEIGHT}
        width="100%"
        frameBorder="0"
      />
      <Button onClick={testClick} variant="outlined" color="primary" size="large" style={{ marginTop: '24px' }}>
        Send Test Message
      </Button>
    </Box>
  );
};

export default Logging;
