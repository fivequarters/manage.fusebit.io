import books from '@assets/library-books.svg';
import code from '@assets/code.svg';
import add from '@assets/add.svg';
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
  onSnippetsModalOpen: () => void;
}

interface ProcessedSnippet extends Snippet {
  icon: string;
  connectorName: string;
  feedId: string;
}

interface SdkDoc {
  url?: string;
  name?: string;
  icon?: string;
}

const Resources: React.FC<Props> = ({ integrationsFeed, connectorsFeed, integrationData, onSnippetsModalOpen }) => {
  const [integrationGuideUrl, setIntegrationGuideUrl] = useState('');
  const [snippets, setSnippets] = useState<ProcessedSnippet[]>([]);
  const [SdkDocs, setSdkDocs] = useState<SdkDoc[]>([]);

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
          const completeSnippet = {
            ...snippet,
            icon: matchingConnectorFeed.smallIcon,
            connectorName: matchingConnectorFeed.name,
            feedId: matchingConnectorFeed.id,
          };

          return completeSnippet;
        });
      });
      const processedSnippets = unprocessedSnippets.flat() as ProcessedSnippet[];
      setSnippets(processedSnippets);
      setIntegrationGuideUrl(integrationFeed?.resources?.configureAppDocUrl || '');
    }
  }, [integrationData, integrationsFeed, connectorsFeed, setSdkDocs, SdkDocs]);

  const compare = (a: SdkDoc, b: SdkDoc) => {
    if (a.name && b.name) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
    }

    return 0;
  };

  const handleSnippetClick = (snippet?: ProcessedSnippet) => {
    if (snippet) {
      window.location.hash = `${snippet.feedId}&${snippet.name}`;
    } else {
      window.location.hash = '&all';
    }

    onSnippetsModalOpen();
  };

  return (
    <CustomNavBase
      title="Resources"
      tooltipDescription="Resources to help you build your Fusebit Integration with target systems, more easily."
    >
      <Tree name="Documentation" icon={books} enableDropdownArrow>
        <Box display="flex" flexDirection="column">
          {integrationGuideUrl && (
            <CustomNavItem
              icon={fusebitMarkIcon}
              name="Integration Guide"
              onClick={() => {
                window.open(integrationGuideUrl, '_blank', 'noopener');
              }}
            />
          )}
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
          {SdkDocs.sort((a, b) => compare(a, b)).map((connector) => {
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
        </Box>
      </Tree>
      <Tree name="Snippets" icon={code} enableDropdownArrow>
        {snippets.map((snippet) => (
          <CustomNavItem
            key={snippet.id}
            icon={snippet.icon}
            name={snippet.name}
            onClick={() => handleSnippetClick(snippet)}
          />
        ))}
        <CustomNavItem icon={add} name="See All Snippets" onClick={() => handleSnippetClick(undefined)} />
      </Tree>
    </CustomNavBase>
  );
};

export default Resources;
