import { Feed, ParsedSnippet } from '@interfaces/feed';
import { Integration } from '@interfaces/integration';
import React, { useEffect, useState } from 'react';
import Code from './Code';
import Resources from './Resources';
import Settings, { CONFIGURATION_FILE_ID } from './Settings';
import Tools from './Tools';

interface Props {
  integrationData: Integration | undefined;
  sampleAppUrl: string | undefined;
  integrationsFeed: Feed[] | undefined;
  connectorsFeed: Feed[] | undefined;
  onSnippetsModalOpen: (snippet?: ParsedSnippet) => void;
  isEditorRunning: boolean;
}

const SidebarOptions: React.FC<Props> = ({
  connectorsFeed,
  integrationData,
  integrationsFeed,
  onSnippetsModalOpen,
  sampleAppUrl,
  isEditorRunning,
}) => {
  const [activeFile, setActiveFile] = useState('integration.js');

  const selectDefaultActiveFile = () => {
    const fileExists = window.editor.fileExistsInSpecification('integration.js');
    const firstFileKey = Object.keys(window.editor.getFiles())[0];

    if (fileExists) {
      window.editor?.selectFile('integration.js');
      setActiveFile('integration.js');
    } else if (firstFileKey) {
      window.editor.selectFile(firstFileKey);
      setActiveFile(firstFileKey);
    } else {
      window.editor.selectSettingsConfiguration();
      setActiveFile(CONFIGURATION_FILE_ID);
    }
  };

  useEffect(() => {
    selectDefaultActiveFile();
  }, []);

  return (
    <>
      <Code
        isEditorRunning={isEditorRunning}
        setActiveFile={setActiveFile}
        activeFile={activeFile}
        selectDefaultActiveFile={selectDefaultActiveFile}
      />
      <Settings setActiveFile={setActiveFile} activeFile={activeFile} />
      <Tools sampleAppUrl={sampleAppUrl} />
      <Resources
        integrationsFeed={integrationsFeed}
        connectorsFeed={connectorsFeed}
        integrationData={integrationData}
        onSnippetsModalOpen={onSnippetsModalOpen}
      />
    </>
  );
};

export default SidebarOptions;
