import { useState } from 'react';
import { ConnectorEntity, EntityComponent, Feed, ParsedSnippet, Snippet } from '@interfaces/feed';
import { InnerConnector, IntegrationData } from '@interfaces/integration';

interface Props {
  getProviderVersion: (feed: Feed) => string;
  formatSnippet: (
    feed: Feed,
    snippet: Snippet,
    integrationId: string,
    connectorId: string,
    connectorName: string
  ) => string;
  integrationId: string;
  setDirtyState: (state: boolean) => void;
}

const useSnippetsModal = ({ getProviderVersion, formatSnippet, integrationId, setDirtyState }: Props) => {
  const [snippetsModal, setSnippetsModal] = useState({
    isOpen: false,
    snippet: undefined as ParsedSnippet | undefined,
  });

  const onSnippetsModalOpen = async (snippet?: ParsedSnippet) => {
    setSnippetsModal({
      isOpen: true,
      snippet,
    });
  };

  const onSnippetsModalClose = (
    newConnector?: ConnectorEntity,
    existingConnector?: InnerConnector,
    feed?: Feed,
    snippet?: Snippet
  ) => {
    if (window.editor && feed && snippet) {
      const addConnectorToConfig = (connector: ConnectorEntity) => {
        const connectorTemplate = (feed.configuration.components as EntityComponent[])[0];
        // Add newly created connector to integration's configuration
        const configuration = JSON.parse(window.editor.getConfigurationSettings()) as IntegrationData;
        configuration.components.push({
          ...connectorTemplate,
          name: connector.id,
          entityId: connector.id,
        });
        window.editor.setSettingsConfiguration(JSON.stringify(configuration));

        // Add provider dependency to package.json of the integration
        const providerVersion = getProviderVersion(feed);
        window.editor.selectFile('package.json');
        const content = JSON.parse(window.editor.getSelectedFileContent());
        content.dependencies[connectorTemplate.provider] = providerVersion;
        window.editor.setSelectedFileContent(JSON.stringify(content, null, 2));
      };

      const addSnippetCode = () => {
        // Add snippets at the end of integration.js
        window.editor.selectFile('integration.js');
        const newContent = formatSnippet(
          feed,
          snippet,
          integrationId,
          newConnector?.id || (existingConnector?.entityId as string),
          newConnector?.id || (existingConnector?.name as string)
        );
        const content = window.editor.getSelectedFileContent();
        window.editor.setSelectedFileContent(content + newContent);

        // Make sure the editor reloads the updated integration.js
        window.editor.selectedFileName = '';
        window.editor.selectFile('integration.js');

        // Scroll to the beginning of the snippet within integration.js in the editor
        const lineCountInNewContent = (newContent.match(/\n/g) || []).length;
        window.editor._monaco.revealLineNearTop(
          window.editor._monaco.getModel().getLineCount() - lineCountInNewContent
        );
        setDirtyState(true);
      };

      if (newConnector) {
        addConnectorToConfig(newConnector);
      }
      addSnippetCode();
    }
    setSnippetsModal({
      isOpen: false,
      snippet: undefined,
    });
  };

  return {
    snippetsModal,
    onSnippetsModalOpen,
    onSnippetsModalClose,
  };
};

export default useSnippetsModal;
