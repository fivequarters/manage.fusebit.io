import { Feed } from '@interfaces/feed';
import { Integration } from '@interfaces/integration';
import React from 'react';
import Resources from './Resources';
import Tools from './Tools';

interface Props {
  integrationData: Integration | undefined;
  sampleAppUrl: string | undefined;
  integrationsFeed: Feed[] | undefined;
  connectorsFeed: Feed[] | undefined;
  onSnippetsModalOpen: () => void;
}

const SidebarOptions: React.FC<Props> = ({
  connectorsFeed,
  integrationData,
  integrationsFeed,
  onSnippetsModalOpen,
  sampleAppUrl,
}) => {
  return (
    <>
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
