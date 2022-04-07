import { useGetConnectorsFeed } from '@hooks/useGetConnectorsFeed';
import { useGetIntegrationFromCache } from '@hooks/useGetIntegrationFromCache';
import { useGetIntegrationsFeed } from '@hooks/useGetIntegrationsFeed';
import { ReactElement } from 'react';
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
  if (category && !document.getElementById(element.id)) {
    const div = document.createElement('div');
    div.setAttribute('id', element.id);
    div.style.display = 'flex';
    category.appendChild(div);
    ReactDOM.render(element.jsx, document.getElementById(element.id));
  }
};

type Props = {
  isEditorRunning: boolean;
  sampleAppUrl: string;
  onSnippetsModalOpen: () => Promise<void>;
};

const useCustomSidebar = ({ isEditorRunning, sampleAppUrl, onSnippetsModalOpen }: Props) => {
  const integrationData = useGetIntegrationFromCache();
  const integrationsFeed = useGetIntegrationsFeed();
  const connectorsFeed = useGetConnectorsFeed();

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
};

export default useCustomSidebar;
