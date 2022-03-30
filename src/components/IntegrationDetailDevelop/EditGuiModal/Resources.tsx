import books from '@assets/library-books.svg';
import code from '@assets/code.svg';
import add from '@assets/add.svg';
import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import { Integration } from '@interfaces/integration';
import { Feed, Snippet } from '@interfaces/feed';
import * as SC from '@components/globalStyle';
import Tree from './Tree';
import CustomNavBase from './CustomNavBase';
import CustomNavItem from './CustomNavItem';

interface Props {
  integrationsFeed: Feed[] | undefined;
  connectorsFeed: Feed[] | undefined;
  integrationData: Integration | undefined;
}

export interface ProcessedSnippet extends Snippet {
  icon: string;
}

const Resources: React.FC<Props> = ({ integrationsFeed, connectorsFeed, integrationData }) => {
  const [integrationGuideUrl, setIntegrationGuideUrl] = useState('');
  const [snippets, setSnippets] = useState<ProcessedSnippet[]>([]);
  const [SdkDocs, setSdkDocs] = useState<{ url?: string; name?: string }[]>([]);

  useEffect(() => {
    if (integrationsFeed && integrationData && connectorsFeed) {
      const integrationFeed = integrationsFeed.find(
        (integration) => integration.id === integrationData.tags['fusebit.feedId']
      );

      // The following code loops trough the connectors connected to this integration
      // returns an array that contains an array of snippet objects and sets the SDK
      // docs for each connector
      const unprocessedSnippets = integrationData.data.components.map((component) => {
        const matchingConnectorFeed = connectorsFeed.find((item) => {
          return item?.configuration?.components?.some(
            (feedComponent) => feedComponent.provider === component.provider
          );
        });

        setSdkDocs((prev) => {
          return [
            ...prev,
            { url: matchingConnectorFeed?.resources.connectorSDKDocUrl, name: matchingConnectorFeed?.name },
          ];
        });

        return matchingConnectorFeed?.snippets?.map((snippet) => {
          const snippetWithIcon = {
            ...snippet,
            icon: matchingConnectorFeed.smallIcon,
          };

          return snippetWithIcon;
        });
      });

      const processedSnippets: ProcessedSnippet[] = Array.prototype.concat.apply([], [...unprocessedSnippets]);
      setSnippets(processedSnippets);
      setIntegrationGuideUrl(integrationFeed?.resources?.configureAppDocUrl || '');
    }
  }, [integrationData, integrationsFeed, connectorsFeed, setSdkDocs]);

  return (
    <CustomNavBase title="Resources">
      <Tree name="Documentation" icon={books} enableDropdownArrow>
        <Box display="flex" flexDirection="column">
          {SdkDocs.map((connector) => {
            return (
              <SC.StyleEditorNavLink key={connector?.name} href={connector?.url} target="_blank" rel="noreferrer">
                {connector?.name} SDK
              </SC.StyleEditorNavLink>
            );
          })}
          <SC.StyleEditorNavLink
            href="https://developer.fusebit.io/reference/fusebit-int-framework-integration"
            target="_blank"
            rel="noreferrer"
          >
            Fusebit SDK
          </SC.StyleEditorNavLink>
          {integrationGuideUrl && (
            <SC.StyleEditorNavLink href={integrationGuideUrl} target="_blank" rel="noreferrer">
              Integration Guide
            </SC.StyleEditorNavLink>
          )}
        </Box>
      </Tree>
      <Tree name="Snippets" icon={code} enableDropdownArrow>
        {snippets.map((snippet) => (
          <CustomNavItem key={snippet.id} icon={snippet.icon} name={snippet.name} />
        ))}
        <CustomNavItem icon={add} name="See All Snippets" />
      </Tree>
    </CustomNavBase>
  );
};

export default Resources;
