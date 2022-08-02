import useGrafanaLogs from '@hooks/useGrafanaLogs';
import { useParams } from 'react-router-dom';
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
  const { id: DEFAULT_INTEGRATION_ID } = useParams<{ id: string }>();
  const ID = iframeId || DEFAULT_IFRAME_ID;
  const { url } = useGrafanaLogs({
    iframeId: ID,
    integrationId: integrationId || DEFAULT_INTEGRATION_ID,
    defaultHeight: height || DEFAULT_HEIGHT,
    from,
  });

  return <CSC.StyledLogs id={ID} title={ID} src={url} height="100%" width="100%" frameBorder="0" />;
};

export default GrafanaLogs;
