import books from '@assets/library-books.svg';
import code from '@assets/code.svg';
import add from '@assets/add.svg';
import docsDefaultIcon from '@assets/docs-default.svg';
import fusebitMarkIcon from '@assets/fusebit-mark.svg';
import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import { Integration } from '@interfaces/integration';
import { Feed, Snippet } from '@interfaces/feed';
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
  const [SdkDocs, setSdkDocs] = useState<{ url?: string; name?: string; icon?: string }[]>([]);

  useEffect(() => {
    if (integrationsFeed && integrationData && connectorsFeed && SdkDocs.length === 0) {
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
            {
              url: matchingConnectorFeed?.resources.connectorSDKDocUrl,
              name: matchingConnectorFeed?.name,
              icon: matchingConnectorFeed?.smallIcon,
            },
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
  }, [integrationData, integrationsFeed, connectorsFeed, setSdkDocs, SdkDocs]);

  return (
    <CustomNavBase title="Resources">
      <Tree name="Documentation" icon={books} enableDropdownArrow>
        <Box display="flex" flexDirection="column">
          {SdkDocs.map((connector) => {
            return (
              <CustomNavItem
                key={connector?.name}
                icon={connector.icon || ''}
                name={connector.name || ''}
                onClick={() => {
                  window.open(connector.url, '_blank', 'noopener');
                }}
              />
            );
          })}
          <CustomNavItem
            icon={fusebitMarkIcon}
            name="Fusebit SDK"
            onClick={() => {
              window.open(
                'https://developer.fusebit.io/reference/fusebit-int-framework-integration',
                '_blank',
                'noopener'
              );
            }}
          />
          {integrationGuideUrl && (
            <CustomNavItem
              icon={docsDefaultIcon}
              name="Integration Guide"
              onClick={() => {
                window.open(integrationGuideUrl, '_blank', 'noopener');
              }}
            />
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
