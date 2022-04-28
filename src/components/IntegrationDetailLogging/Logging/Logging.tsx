import { useAuthContext } from '@hooks/useAuthContext';
import { Box } from '@material-ui/core';
import { useParams } from 'react-router-dom';

const Logging = () => {
  const { userData } = useAuthContext();
  const { id } = useParams<{ id: string }>();

  return (
    <Box display="flex" alignItems="center" justifyContent="center" pb="140px" position="relative">
      <iframe
        title="iframe"
        id="iframe"
        src={`${process.env.REACT_APP_FUSEBIT_DEPLOYMENT}/v2/grafana/bootstrap/d-solo/logging/basic?panelId=2&kiosk=&refresh=1s&fusebitAuthorization=${userData.token}&fusebitAccountId=${userData.accountId}&var-accountId=${userData.accountId}&var-subscriptionId=${userData.subscriptionId}&var-boundaryId=integration&var-functionId=${id}`}
        width="100%"
        height="350"
        frameBorder="0"
      />
    </Box>
  );
};

export default Logging;
