import { useGetConnectorsFeed } from '@hooks/useGetConnectorsFeed';
import { useGetIntegrationFromCache } from '@hooks/useGetIntegrationFromCache';
import { useGetIntegrationsFeed } from '@hooks/useGetIntegrationsFeed';
import { ParsedSnippet } from '@interfaces/feed';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import SidebarOptions from './SidebarOptions';
import { lightTheme } from '~/theme/appTheme';

type Props = {
  isEditorRunning: boolean;
  sampleAppUrl: string;
  onSnippetsModalOpen: (snippet?: ParsedSnippet) => Promise<void>;
};

const useCustomSidebar = ({ isEditorRunning, sampleAppUrl, onSnippetsModalOpen }: Props) => {
  const integrationData = useGetIntegrationFromCache();
  const integrationsFeed = useGetIntegrationsFeed();
  const connectorsFeed = useGetConnectorsFeed();

  useEffect(() => {
    if (isEditorRunning) {
      if (!document.getElementById('sidebar-options')) {
        document.querySelectorAll('.fusebit-nav-category').forEach((category) => category.remove());
        const newNavFile = document.querySelector('.fusebit-nav-new-file');
        newNavFile?.nextElementSibling?.remove();
        newNavFile?.remove();

        const nav = document.querySelector('.fusebit-nav');
        const div = document.createElement('div');
        div.setAttribute('id', 'sidebar-options');
        nav?.appendChild(div);
        ReactDOM.render(
          <ThemeProvider theme={responsiveFontSizes(createMuiTheme(lightTheme))}>
            <SidebarOptions
              isEditorRunning={isEditorRunning}
              integrationData={integrationData?.data}
              sampleAppUrl={sampleAppUrl}
              integrationsFeed={integrationsFeed.data}
              connectorsFeed={connectorsFeed.data}
              onSnippetsModalOpen={onSnippetsModalOpen}
            />
          </ThemeProvider>,
          document.getElementById('sidebar-options')
        );
      }
    }
  }, [connectorsFeed, integrationData, integrationsFeed, isEditorRunning, onSnippetsModalOpen, sampleAppUrl]);
};

export default useCustomSidebar;
