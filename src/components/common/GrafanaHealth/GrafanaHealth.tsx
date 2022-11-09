import * as CSC from '@components/globalStyle';
import useGrafana from '@hooks/useGrafana';
import { Boundary } from '@interfaces/grafana';

const DEFAULT_IFRAME_ID = 'health-monitoring';

interface Props {
  iframeId?: string;
  functionId?: string;
  from?: number;
  boundaryId: Boundary;
}

const GrafanaHealth = ({ from, iframeId, functionId, boundaryId }: Props) => {
  const { url, iframeId: ID } = useGrafana({
    path: '/v2/grafana/bootstrap/d/HealthMonitor/health-monitoring?kiosk=tv&hideUi=breadcrumbs,tvButton&',
    defaultIframeId: DEFAULT_IFRAME_ID,
    customIframeId: iframeId,
    functionId,
    boundaryId,
    from: from || 'now-3d',
  });

  return <CSC.StyledLogs id={ID} title={ID} src={url} height="100%" width="100%" frameBorder="0" />;
};

export default GrafanaHealth;
