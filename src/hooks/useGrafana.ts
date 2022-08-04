import { GrafanaProps } from '@interfaces/grafana';
import { useParams } from 'react-router-dom';
import { useAuthContext } from './useAuthContext';

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
const DEFAULT_FROM = Date.now() - WEEK_IN_MS;

const useGrafana = ({ path, integrationId, from, defaultIframeId, customIframeId }: GrafanaProps) => {
  const { userData } = useAuthContext();
  const { id: DEFAULT_INTEGRATION_ID } = useParams<{ id: string }>();
  integrationId = integrationId || DEFAULT_INTEGRATION_ID;

  return {
    url: `${
      process.env.REACT_APP_FUSEBIT_DEPLOYMENT
    }${path}theme=fusebit&kiosk=tv&disablePanelTitle=true&refresh=1s&fusebitAuthorization=${
      userData.token
    }&fusebitAccountId=${userData.accountId}&var-accountId=${userData.accountId}&var-subscriptionId=${
      userData.subscriptionId
    }&var-boundaryId=integration&var-functionId=${integrationId}&from=${from || DEFAULT_FROM}`,
    exploreUrl: `${
      process.env.REACT_APP_FUSEBIT_DEPLOYMENT
    }/v2/grafana/d/logging/basic?theme=fusebit&fusebitAuthorization=${userData.token}&fusebitAccountId=${
      userData.accountId
    }&var-accountId=${userData.accountId}&var-subscriptionId=${
      userData.subscriptionId
    }&var-boundaryId=integration&var-functionId=${integrationId}&from=${from || DEFAULT_FROM}`,
    iframeId: customIframeId || defaultIframeId,
  };
};

export default useGrafana;
