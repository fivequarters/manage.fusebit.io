import books from '@assets/library-books.svg';
import code from '@assets/code.svg';
import add from '@assets/add.svg';
import styled, { css } from 'styled-components';
import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import { Integration } from '@interfaces/integration';
import { Feed, Snippet } from '@interfaces/feed';
import { urlOrSvgToImage } from '@utils/utils';
import Tree from './Tree';

const textStyles = css`
  font-family: 'Poppins';
  font-size: 14px;
  line-height: 20px;
  font-weight: inherit;
`;

const StyledLink = styled.a`
  ${textStyles}
  text-decoration: underline;
  color: var(--black);
  width: fit-content;
  margin-bottom: 12px;
`;

const StyledSnippetWrapper = styled(Box)`
  padding: 8px;
  border-radius: 4px;
  transition: all 0.25s linear;

  &:hover {
    background-color: var(--secondary-color);
    cursor: pointer;

    & > div {
      font-weight: 600;
    }
  }
`;

const StyledText = styled.div`
  ${textStyles}
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  transition: all 0.1s linear;
`;

const StyledIcon = styled.img`
  height: 15px;
  width: 15px;
  object-fit: contain;
  margin-right: 10px;
`;

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
      // returns an array that contains an array of snippet objects for each connector
      // and sets the SDK docs for each connector
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
    <div>
      <div>&nbsp;</div>
      <div className="fusebit-nav-category">Resources</div>
      <Tree name="Documentation" icon={books} enableDropdownArrow>
        <Box display="flex" flexDirection="column">
          {SdkDocs.map((connector) => {
            return (
              <StyledLink key={connector?.name} href={connector?.url} target="_blank" rel="noreferrer">
                {connector?.name} SDK
              </StyledLink>
            );
          })}
          <StyledLink
            href="https://developer.fusebit.io/reference/fusebit-int-framework-integration"
            target="_blank"
            rel="noreferrer"
          >
            Fusebit SDK
          </StyledLink>
          {integrationGuideUrl && (
            <StyledLink href={integrationGuideUrl} target="_blank" rel="noreferrer">
              Integration Guide
            </StyledLink>
          )}
        </Box>
      </Tree>
      <Tree name="Snippets" icon={code} enableDropdownArrow>
        {snippets.map((snippet) => {
          return (
            <StyledSnippetWrapper display="flex" alignItems="center" mb="6px" key={snippet.id}>
              <StyledIcon src={urlOrSvgToImage(snippet.icon)} />
              <StyledText>{snippet.name}</StyledText>
            </StyledSnippetWrapper>
          );
        })}
        <StyledSnippetWrapper display="flex" alignItems="center" mb="6px">
          <StyledIcon src={add} />
          <StyledText>See All Snippets</StyledText>
        </StyledSnippetWrapper>
      </Tree>
    </div>
  );
};

export default Resources;
