import { Box } from '@material-ui/core';
import GrafanaHealth from '@components/common/GrafanaHealth';
import { Boundary } from '@interfaces/grafana';

const HealthMonitoring = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="170vh" pb="140px" position="relative">
      <GrafanaHealth boundaryId={Boundary.INTEGRATION} />
    </Box>
  );
};

export default HealthMonitoring;
