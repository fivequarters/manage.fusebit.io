/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */

import { Tab } from '@interfaces/TabComponent';
import { Box } from '@material-ui/core';
import styled from 'styled-components';
import icon from '@assets/add.svg';

export const BACKEND_LIST_STORAGE_ID = 'fusebit/api-token-clients';

export const X_USER_AGENT = `fusebit-portal/${require('../../package.json').version} ${navigator.userAgent}`;

export const STATIC_TENANT_ID = 'user-1';

export const PRODUCTION_HOST = 'manage.fusebit.io';

export const INTEGRATION_PROCESSING_SUFFIX = '-pending-processing';

const StyledBeta = styled.img`
  position: absolute;
  right: -20px;
  top: -3px;
  height: 15px;
  width: 15px;
  object-fit: contain;
`;

export const INTEGRATION_DETAIL_TABNAMES: Tab[] = [
  'Develop',
  'Installs',
  <Box key="logging" position="relative">
    Logging
    <StyledBeta src={icon} alt="beta" height="15" width="15" />
  </Box>,
  'Health',
  'Reliability',
];
