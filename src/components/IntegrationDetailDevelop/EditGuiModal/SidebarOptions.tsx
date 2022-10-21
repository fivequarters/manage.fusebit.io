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
  const [activeFile, setActiveFile] = useState('');

  const setDefaultActiveFile = () => {
    const selectedFileContent = window.editor.getSelectedFileContent();
    const editorFiles = window.editor.getFiles();
    const selectedFileName = Object.keys(editorFiles).find((fileKey) => editorFiles[fileKey] === selectedFileContent);

    if (selectedFileName) {
      setActiveFile(selectedFileName);
    } else {
      window.editor.selectSettingsConfiguration();
      setActiveFile(CONFIGURATION_FILE_ID);
    }
  };

  useEffect(() => {
    setDefaultActiveFile();
  }, []);

  return (
    <>
      <Code
        isEditorRunning={isEditorRunning}
        setActiveFile={setActiveFile}
        activeFile={activeFile}
        setDefaultActiveFile={setDefaultActiveFile}
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
