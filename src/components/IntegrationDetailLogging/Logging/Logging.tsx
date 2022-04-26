import { useAuthContext } from '@hooks/useAuthContext';
import { Box } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const StyledLogs = styled.iframe`
  > #document > html > body .panel-container {
    background: red;
  }
`;

const Logging = () => {
  const { userData } = useAuthContext();
  const { id } = useParams<{ id: string }>();

  return (
    <Box display="flex" alignItems="center" justifyContent="center" pb="140px" position="relative">
      <StyledLogs
        title="iframe"
        id="iframe"
        src={`https://api.us-west-1.on.fusebit.io/v2/grafana/bootstrap/d-solo/logging/basic?panelId=2&kiosk=&refresh=1s&fusebitAuthorization=${userData.token}&fusebitAccountId=${userData.accountId}&var-accountId=${userData.accountId}&var-subscriptionId=${userData.subscriptionId}&var-boundaryId=integration&var-functionId=${id}`}
        width="100%"
        height="350"
        frameBorder="0"
      />
    </Box>
  );
};

export default Logging;
