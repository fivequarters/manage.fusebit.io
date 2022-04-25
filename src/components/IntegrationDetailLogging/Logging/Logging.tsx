import { Box } from '@material-ui/core';
import styled from 'styled-components';

const StyledLogs = styled.iframe`
  > #document > html > body .panel-container {
    background: red;
  }
`;

const Logging = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" pb="140px" position="relative">
      <StyledLogs
        title="iframe"
        id="iframe"
        src="https://api.us-west-1.on.fusebit.io/v2/grafana/bootstrap/d-solo/logging/basic?panelId=2&kiosk=&refresh=1s&fusebitAuthorization=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UQkZRemxDTURWR1EwSTBNRGc1UmpOQ1JqSkNRVGczTmpZNFJqRXlNRVUyTTBSRE9ETTROdyJ9.eyJodHRwczovL2Z1c2ViaXQuaW8vcHJvZmlsZSI6eyJhY2NvdW50SWQiOiJhY2MtMzExMzA2NmIzNzFjNDhiNCIsInN1YnNjcmlwdGlvbklkIjoic3ViLWUwZDk4Y2I4NWFkNjRmMjQiLCJ1c2VySWQiOiJ1c3ItMDQ3NjlmYjdjOTA0NGYzNSJ9LCJpc3MiOiJodHRwczovL2F1dGguZnVzZWJpdC5pby8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDEwMzExMTA3ODgxMjU3NzUxNTkyMSIsImF1ZCI6WyJodHRwczovL2FwaS51cy13ZXN0LTEub24uZnVzZWJpdC5pbyIsImh0dHBzOi8vZnVzZWJpdC5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjUwNjQ1MTk0LCJleHAiOjE2NTA3MzE1OTQsImF6cCI6Ik5JZnFFNGhwUE9YdUlobGxreG5kbGFmU0tjS2VzRWZjIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCJ9.PBj99LPKhDdHmzvSATzT-wXMwTlO8IM_nzfb87idX2-cdo7WnmJr7gFSNA1m7V5NxxO7dHhDW3p1lWq0Ft6BnQFD6bJMgzMuytQX8cFQC_7fQb_LxTQ2xkNVs85PjzChZ-mJqT2gVeCkuzhA9MoH5FHAmf7_238KES_QVvcWjMysQzbv5Vvm099GF9zgb8lYaGRIo8pxIzTGD9pWfXY8WFF5096RnlbZiXiN-1Xb19SgCqCdXNgPbiO-oqDsamJzGYlhtaA3D-auu2kTwfeAdc9IADpMQwznP4RfKdsK4d5StsK5vVM5p7nQtRXHSxlCN7sK3Wfx3zm3tt-XZPbPUg&fusebitAccountId=acc-3113066b371c48b4&var-accountId=acc-3113066b371c48b4&var-subscriptionId=sub-e0d98cb85ad64f24&var-boundaryId=integration&var-functionId=slack"
        width="450"
        height="200"
        frameBorder="0"
      />
    </Box>
  );
};

export default Logging;
