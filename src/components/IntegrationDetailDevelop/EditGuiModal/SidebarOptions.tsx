import { Feed, ParsedSnippet } from '@interfaces/feed';
import { Integration } from '@interfaces/integration';
import React from 'react';
import Code from './Code';
import Resources from './Resources';
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
  return (
    <>
      <Code isEditorRunning={isEditorRunning} />
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
