import useGrafanaLogs from '@hooks/useGrafanaLogs';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const StyledLogs = styled.iframe`
  position: relative;
  border-radius: 8px;
  box-shadow: 0px 1px 30px -1px rgb(52 72 123 / 10%);
`;

const DEFAULT_IFRAME_ID = 'logging';
const DEFAULT_HEIGHT = 350;
const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
const DEFAULT_FROM = Date.now() - WEEK_IN_MS;

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
    from: from || DEFAULT_FROM,
  });

  return <StyledLogs id={ID} title={ID} src={url} height="100%" width="100%" frameBorder="0" />;
};

export default GrafanaLogs;
