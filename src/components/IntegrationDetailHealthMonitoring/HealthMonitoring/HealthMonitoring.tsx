import { Box } from '@material-ui/core';
import GrafanaHealth from '@components/common/GrafanaHealth';

const HealthMonitoring = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="170vh" pb="140px" position="relative">
      <GrafanaHealth />
    </Box>
  );
};

export default HealthMonitoring;
