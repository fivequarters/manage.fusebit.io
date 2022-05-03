/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */

import { Tab } from '@interfaces/TabComponent';
import { Box } from '@material-ui/core';
import styled from 'styled-components';

export const BACKEND_LIST_STORAGE_ID = 'fusebit/api-token-clients';

export const X_USER_AGENT = `fusebit-portal/${require('../../package.json').version} ${navigator.userAgent}`;

export const STATIC_TENANT_ID = 'user-1';

export const PRODUCTION_HOST = 'manage.fusebit.io';

export const INTEGRATION_PROCESSING_SUFFIX = '-pending-processing';

const StyledBeta = styled.div`
  font-size: 10px;
  line-height: 14px;
  font-weight: 500;
  color: var(--black);
  text-align: center;
  padding: 2px 6px;
  background-color: var(--yellow);
  box-shadow: 0px 8px 8px rgba(52, 72, 123, 0.1);
  border-radius: 4px;
  margin-left: 6px;
`;

export const INTEGRATION_DETAIL_TABNAMES: Tab[] = [
  'Develop',
  'Installs',
  <Box key="logging" display="flex" alignItems="center" position="relative">
    Logging
    <StyledBeta>Beta</StyledBeta>
  </Box>,
  'Health',
  'Reliability',
];
