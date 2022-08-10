import * as CSC from '@components/globalStyle';
import useGrafana from '@hooks/useGrafana';

const DEFAULT_IFRAME_ID = 'health-monitoring';

interface Props {
  iframeId?: string;
  integrationId?: string;
  from?: number;
}

const GrafanaHealth = ({ from, iframeId, integrationId }: Props) => {
  const { url, iframeId: ID } = useGrafana({
    path: '/v2/grafana/bootstrap/d/HealthMonitor/health-monitoring?kiosk=tv&',
    defaultIframeId: DEFAULT_IFRAME_ID,
    customIframeId: iframeId,
    integrationId,
    from: from || 'now-3d',
  });

  return <CSC.StyledLogs id={ID} title={ID} src={url} height="100%" width="100%" frameBorder="0" />;
};

export default GrafanaHealth;
