import useGrafanaLogs from '@hooks/useGrafanaLogs';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const StyledLogs = styled.iframe`
  position: relative;
  border-radius: 8px;
  box-shadow: 0px 1px 30px -1px rgb(52 72 123 / 10%);
  .panel-title {
    display: none;
  }
`;

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

  useEffect(() => {
    const interval = setInterval(() => {
      const iframe = document.getElementById(ID) as HTMLIFrameElement;
      if (iframe.contentWindow && window.location.host.includes('fusebit-io')) {
        const panel = iframe.contentWindow.document?.querySelector('.panel-title') as HTMLElement;
        if (panel) {
          panel.style.display = 'none';
          clearInterval(interval);
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [ID]);

  return <StyledLogs id={ID} name={ID} title={ID} src={url} height="100%" width="100%" frameBorder="0" />;
};

export default GrafanaLogs;
