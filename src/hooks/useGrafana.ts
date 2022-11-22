import { GrafanaProps } from '@interfaces/grafana';
import { useParams } from 'react-router-dom';
import { useAuthContext } from './useAuthContext';

const DEFAULT_FROM = 'now-7d';

const useGrafana = ({ path, functionId, from, defaultIframeId, customIframeId, boundaryId }: GrafanaProps) => {
  const { userData } = useAuthContext();
  const { id: DEFAULT_FUNCTION_ID } = useParams<{ id: string }>();
  functionId = functionId || DEFAULT_FUNCTION_ID;

  return {
    url: `${process.env.REACT_APP_FUSEBIT_DEPLOYMENT}${path}theme=fusebit&fusebitAuthorization=${
      userData.token
    }&fusebitAccountId=${userData.accountId}&var-accountId=${userData.accountId}&var-subscriptionId=${
      userData.subscriptionId
    }&var-boundaryId=${boundaryId}&var-functionId=${functionId}&from=${from || DEFAULT_FROM}`,
    exploreUrl: `${
      process.env.REACT_APP_FUSEBIT_DEPLOYMENT
    }/v2/grafana/d/logging/basic?theme=fusebit&fusebitAuthorization=${userData.token}&fusebitAccountId=${
      userData.accountId
    }&var-accountId=${userData.accountId}&var-subscriptionId=${
      userData.subscriptionId
    }&var-boundaryId=${boundaryId}&var-functionId=${functionId}&from=${from || DEFAULT_FROM}`,
    iframeId: customIframeId || defaultIframeId,
  };
};

export default useGrafana;
