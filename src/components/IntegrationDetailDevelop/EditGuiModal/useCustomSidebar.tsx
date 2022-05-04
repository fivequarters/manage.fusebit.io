import { useGetConnectorsFeed } from '@hooks/useGetConnectorsFeed';
import { useGetIntegrationFromCache } from '@hooks/useGetIntegrationFromCache';
import { useGetIntegrationsFeed } from '@hooks/useGetIntegrationsFeed';
import { ParsedSnippet } from '@interfaces/feed';
import { ReactElement, useEffect } from 'react';
import ReactDOM from 'react-dom';
import NavCategoryTooltip from './NavCategoryTooltip';
import SidebarOptions from './SidebarOptions';

const appendCategoryTooltip = (
  category: Element | null,
  element: {
    id: string;
    jsx: ReactElement;
  }
) => {
  const tooltipId = `${element.id}-tooltip`;
  if (category && !document.getElementById(tooltipId)) {
    category.id = element.id;
    const div = document.createElement('div');
    div.setAttribute('id', tooltipId);
    div.style.display = 'flex';
    category.appendChild(div);
    ReactDOM.render(element.jsx, document.getElementById(tooltipId));
  }
};

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
      const codeCategory = document.querySelectorAll('.fusebit-nav-category')?.[0];
      const settingsCategory = document.querySelectorAll('.fusebit-nav-category')?.[1];

      appendCategoryTooltip(codeCategory, {
        id: 'code',
        jsx: (
          <NavCategoryTooltip
            title="Code"
            description="All the files needed to run your Fusebit Integration as a microservice on our platform."
          />
        ),
      });

      appendCategoryTooltip(settingsCategory, {
        id: 'settings',
        jsx: (
          <NavCategoryTooltip
            title="Settings"
            description="Configuration logic, such as CRON scheduling, for your Integration."
          />
        ),
      });

      if (!document.getElementById('sidebar-options')) {
        const nav = document.querySelector('.fusebit-nav');
        const div = document.createElement('div');
        div.setAttribute('id', 'sidebar-options');
        nav?.appendChild(div);
        ReactDOM.render(
          <SidebarOptions
            integrationData={integrationData?.data}
            sampleAppUrl={sampleAppUrl}
            integrationsFeed={integrationsFeed.data}
            connectorsFeed={connectorsFeed.data}
            onSnippetsModalOpen={onSnippetsModalOpen}
          />,
          document.getElementById('sidebar-options')
        );
      }
    }
  }, [connectorsFeed, integrationData, integrationsFeed, isEditorRunning, onSnippetsModalOpen, sampleAppUrl]);
};

export default useCustomSidebar;
