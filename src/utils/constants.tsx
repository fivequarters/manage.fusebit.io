/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */

import { Tab } from '@interfaces/TabComponent';
import { Box } from '@material-ui/core';

export const BACKEND_LIST_STORAGE_ID = 'fusebit/api-token-clients';

export const X_USER_AGENT = `fusebit-portal/${require('../../package.json').version} ${navigator.userAgent}`;

export const STATIC_TENANT_ID = 'user-1';

export const PRODUCTION_HOST = 'manage.fusebit.io';

export const INTEGRATION_PROCESSING_SUFFIX = '-pending-processing';

export const INVITED_TO_FUSEBIT_KEY = 'invitedToFusebitAccount';

export const IS_EDITOR_SAVING_KEY = 'isEditorSaving';

export const INTEGRATION_DETAIL_TABNAMES: Tab[] = [
  'Develop',
  'Installs',
  <Box key="logging" display="flex" alignItems="center" position="relative">
    Logging
  </Box>,
  'Health',
  'Reliability',
];
