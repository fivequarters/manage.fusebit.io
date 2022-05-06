import { useAuthContext } from '@hooks/useAuthContext';
import { Box, Button } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { trackEventMemoized } from '@utils/analytics';
import styled from 'styled-components';

const StyledLogs = styled.iframe`
  position: relative;
  height: 100%;
  border-radius: 8px;
  box-shadow: 0px 1px 30px -1px rgb(52 72 123 / 10%);
`;

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

const FROM = Date.now() - WEEK_IN_MS;

const Logging = () => {
  const { userData } = useAuthContext();
  const { id } = useParams<{ id: string }>();

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
      height="450px"
      pb="40px"
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
        title="logging"
        src={`${process.env.REACT_APP_FUSEBIT_DEPLOYMENT}/v2/grafana/bootstrap/d-solo/logging/basic?panelId=2?kiosk=tv&theme=light&refresh=1s&fusebitAuthorization=${userData.token}&fusebitAccountId=${userData.accountId}&var-accountId=${userData.accountId}&var-subscriptionId=${userData.subscriptionId}&var-boundaryId=integration&var-functionId=${id}&from=${FROM}}`}
        width="100%"
        height="100%"
        frameBorder="0"
      />
    </Box>
  );
};

export default Logging;
