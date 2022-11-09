import useGrafanaLogs from '@hooks/useGrafanaLogs';
import * as CSC from '@components/globalStyle';

const DEFAULT_IFRAME_ID = 'logging';
const DEFAULT_HEIGHT = 350;

interface Props {
  iframeId?: string;
  functionId?: string;
  height?: number;
  from?: number;
  boundaryId: 'integration' | 'connector';
}

const GrafanaLogs = ({ from, height, iframeId, functionId, boundaryId }: Props) => {
  const { url, iframeId: ID } = useGrafanaLogs({
    customIframeId: iframeId,
    defaultIframeId: DEFAULT_IFRAME_ID,
    functionId,
    boundaryId,
    defaultHeight: height || DEFAULT_HEIGHT,
    from,
  });

  return <CSC.StyledLogs id={ID} title={ID} src={url} height="350px" width="100%" frameBorder="0" />;
};

export default GrafanaLogs;
