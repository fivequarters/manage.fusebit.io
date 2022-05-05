import { useAuthContext } from '@hooks/useAuthContext';
import { Box } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const StyledLogs = styled.iframe`
  position: relative;
  height: 100%;
  border-radius: 8px;
  box-shadow: 0px 1px 30px -1px rgb(52 72 123 / 10%);
`;

const Logging = () => {
  const { userData } = useAuthContext();
  const { id } = useParams<{ id: string }>();

  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="450px" pb="40px" position="relative">
      <StyledLogs
        title="logging"
        src={`${process.env.REACT_APP_FUSEBIT_DEPLOYMENT}/v2/grafana/explore/?kiosk=tv&refresh=1s&fusebitAuthorization=${userData.token}&fusebitAccountId=${userData.accountId}&var-accountId=${userData.accountId}&var-subscriptionId=${userData.subscriptionId}&var-boundaryId=integration&var-functionId=${id}`}
        width="100%"
        height="100%"
        frameBorder="0"
      />
    </Box>
  );
};

export default Logging;
