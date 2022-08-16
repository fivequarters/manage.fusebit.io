import useGrafanaLogs from '@hooks/useGrafanaLogs';
import * as CSC from '@components/globalStyle';

const DEFAULT_IFRAME_ID = 'logging';
const DEFAULT_HEIGHT = 350;

interface Props {
  iframeId?: string;
  integrationId?: string;
  height?: number;
  from?: number;
}

const GrafanaLogs = ({ from, height, iframeId, integrationId }: Props) => {
  const { url, iframeId: ID } = useGrafanaLogs({
    path: '/v2/grafana/d/HealthMonitor/health-monitoring',
    customIframeId: iframeId,
    defaultIframeId: DEFAULT_IFRAME_ID,
    integrationId,
    defaultHeight: height || DEFAULT_HEIGHT,
    from,
  });

  return <CSC.StyledLogs id={ID} title={ID} src={url} height="350px" width="100%" frameBorder="0" />;
};

export default GrafanaLogs;
