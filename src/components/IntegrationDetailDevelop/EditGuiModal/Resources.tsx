import books from '@assets/library-books.svg';
import code from '@assets/code.svg';
import add from '@assets/add.svg';
import fusebitMarkIcon from '@assets/fusebit-mark.svg';
import React, { useMemo } from 'react';
import { Box } from '@material-ui/core';
import { Integration } from '@interfaces/integration';
import { Feed, ParsedSnippet } from '@interfaces/feed';
import { trackEventUnmemoized } from '@utils/analytics';
import { getConnectorFeedByComponent, getFeedByIntegration } from '@utils/entities';
import Tree from './Tree';
import CustomNavBase from './CustomNavBase';
import CustomNavItem from './CustomNavItem';

interface Props {
  integrationsFeed: Feed[] | undefined;
  connectorsFeed: Feed[] | undefined;
  integrationData: Integration | undefined;
  onSnippetsModalOpen: (snippet?: ParsedSnippet) => void;
}

interface SDKDoc {
  url?: string;
  name?: string;
  icon?: string;
}

const orderByName = (a: SDKDoc, b: SDKDoc) => ((a?.name || '') > (b?.name || '') ? 1 : -1);

const Resources: React.FC<Props> = ({ integrationsFeed, connectorsFeed, integrationData, onSnippetsModalOpen }) => {
  const integrationFeed = getFeedByIntegration(integrationsFeed, integrationData);
  const integrationGuideUrl = integrationFeed?.resources?.configureAppDocUrl;

  const { docs, snippets } = useMemo(() => {
    return (integrationData?.data?.components || []).reduce(
      (acc, component) => {
        const connectorFeed = getConnectorFeedByComponent(connectorsFeed, component);

        acc.docs = [
          ...acc.docs,
          {
            url: connectorFeed?.resources.connectorSDKDocUrl,
            name: connectorFeed?.name,
            icon: connectorFeed?.smallIcon,
          },
        ];

        acc.snippets = [
          ...acc.snippets,
          ...(connectorFeed?.snippets?.map((snippet) => ({
            ...snippet,
            icon: connectorFeed.smallIcon,
            connectorName: connectorFeed.name,
            feedId: connectorFeed.id,
          })) || []),
        ];

        return acc;
      },
      { docs: [] as SDKDoc[], snippets: [] as ParsedSnippet[] }
    );
  }, [connectorsFeed, integrationData]);

  const handleSnippetClick = (snippet?: ParsedSnippet) => {
    if (snippet) {
      trackEventUnmemoized('Snippets Menu Item Clicked', 'Web Editor', {
        clickedOn: `${snippet?.connectorName} - ${snippet?.name}`,
      });
    } else {
      trackEventUnmemoized('Snippets Menu Item Clicked', 'Web Editor', {
        clickedOn: `See All`,
      });
    }

    onSnippetsModalOpen(snippet);
  };

  return (
    <CustomNavBase
      id="resources"
      title="Resources"
      tooltipDescription="Resources to help you build your Fusebit Integration with target systems, more easily."
    >
      <Tree
        name="Documentation"
        icon={books}
        enableDropdownArrow
        onClick={(isOpen) => {
          if (!isOpen) {
            trackEventUnmemoized('Documentation Menu Item Expanded', 'Web Editor');
          }
        }}
      >
        <Box display="flex" flexDirection="column">
          {integrationGuideUrl && (
            <CustomNavItem
              id="integrationGuide"
              icon={fusebitMarkIcon}
              name="Integration Guide"
              onClick={() => {
                trackEventUnmemoized('Documentation Menu Item Clicked', 'Web Editor', {
                  clickedOn: integrationGuideUrl,
                });

                window.open(integrationGuideUrl, '_blank', 'noopener');
              }}
            />
          )}
          <CustomNavItem
            icon={fusebitMarkIcon}
            id="fusebitSdk"
            name="Fusebit SDK"
            onClick={() => {
              trackEventUnmemoized('Documentation Menu Item Clicked', 'Web Editor', {
                clickedOn: 'https://developer.fusebit.io/reference/fusebit-int-framework-integration',
              });

              window.open(
                'https://developer.fusebit.io/reference/fusebit-int-framework-integration',
                '_blank',
                'noopener'
              );
            }}
          />
          {[...docs].sort(orderByName).map((connector) => {
            return (
              <CustomNavItem
                id={connector?.name || ''}
                key={connector?.name}
                icon={connector.icon || ''}
                name={`${connector.name} SDK` || ''}
                onClick={() => {
                  trackEventUnmemoized('Documentation Menu Item Clicked', 'Web Editor', {
                    clickedOn: connector?.url,
                  });

                  window.open(connector.url, '_blank', 'noopener');
                }}
              />
            );
          })}
        </Box>
      </Tree>
      <Tree
        name="Snippets"
        icon={code}
        enableDropdownArrow
        onClick={(isOpen) => {
          if (!isOpen) {
            trackEventUnmemoized('Snippets Menu Item Expanded', 'Web Editor');
          }
        }}
      >
        {snippets.map((snippet) => (
          <CustomNavItem
            id={snippet.id}
            key={snippet.id}
            icon={snippet.icon}
            name={snippet.name}
            onClick={() => handleSnippetClick(snippet)}
          />
        ))}
        <CustomNavItem id="seeAllSnippets" icon={add} name="See All Snippets" onClick={() => handleSnippetClick()} />
      </Tree>
    </CustomNavBase>
  );
};

export default Resources;
