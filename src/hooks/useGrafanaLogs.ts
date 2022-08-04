import { GrafanaProps } from '@interfaces/grafana';
import { useEffect } from 'react';
import useGrafana from './useGrafana';

interface Props extends GrafanaProps {
  defaultHeight?: number;
  onBlur?: () => void;
}

const useGrafanaLogs = ({ customIframeId, defaultIframeId, defaultHeight, integrationId, from, onBlur }: Props) => {
  const { url, exploreUrl, iframeId } = useGrafana({
    path: '/v2/grafana/bootstrap/d-solo/logging/basic?panelId=2&kiosk=tv&disablePanelTitle=true&refresh=1s&',
    defaultIframeId,
    customIframeId,
    integrationId,
    from,
  });

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
    url,
    exploreUrl,
    iframeId,
  };
};

export default useGrafanaLogs;
