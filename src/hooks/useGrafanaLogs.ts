import { useEffect } from 'react';
import { useAuthContext } from './useAuthContext';

interface Props {
  iframeId?: string;
  defaultHeight?: number;
  from?: number;
  integrationId?: string;
  onBlur?: () => void;
}

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
const DEFAULT_FROM = Date.now() - WEEK_IN_MS;

const useGrafanaLogs = ({ iframeId, defaultHeight, integrationId, from, onBlur }: Props) => {
  const { userData } = useAuthContext();

  useEffect(() => {
    if (iframeId && defaultHeight) {
      const handleMessage = (e: MessageEvent) => {
        // new height in px
        const newHeightMessage = e.data;
        if (typeof newHeightMessage === 'string') {
          const newHeight = Number(newHeightMessage?.replace('px', ''));
          const height = newHeight > defaultHeight ? newHeightMessage : `${defaultHeight}px`;
          const iframe = document.getElementById(iframeId);
          if (iframe) {
            iframe.style.height = height;
          }
        }
      };

      const handleBlur = () => {
        if (document.activeElement === document.getElementById(iframeId)) {
          onBlur?.();
        }
      };

      window.addEventListener('message', handleMessage);
      window.addEventListener('blur', handleBlur);

      return () => {
        window.removeEventListener('blur', handleBlur);
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [iframeId, onBlur, defaultHeight]);

  return {
    url: `${
      process.env.REACT_APP_FUSEBIT_DEPLOYMENT
    }/v2/grafana/bootstrap/d-solo/logging/basic?panelId=2?kiosk&theme=fusebit&disablePanelTitle=true&refresh=1s&fusebitAuthorization=${
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
  };
};

export default useGrafanaLogs;
