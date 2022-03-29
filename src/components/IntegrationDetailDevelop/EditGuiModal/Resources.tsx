import books from '@assets/library-books.svg';
import code from '@assets/code.svg';
import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import { Integration } from '@interfaces/integration';
import { Feed } from '@interfaces/feed';
import Tree from './Tree';

const StyledLink = styled.a`
  font-family: 'Poppins';
  font-size: 14px;
  line-height: 20px;
  text-decoration: underline;
  color: var(--black);
  width: fit-content;
  margin-bottom: 10px;
`;

interface Props {
  integrationsFeed: Feed[] | undefined;
  integrationData: Integration | undefined;
}

const Resources: React.FC<Props> = ({ integrationsFeed, integrationData }) => {
  const [integrationGuideUrl, setIntegrationGuideUrl] = useState('');

  useEffect(() => {
    if (integrationsFeed && integrationData) {
      const integrationFeed = integrationsFeed.find(
        (integration) => integration.id === integrationData.tags['fusebit.feedId']
      );
      setIntegrationGuideUrl(integrationFeed?.resources.configureAppDocUrl || '');
    }
  }, [integrationData, integrationsFeed]);

  return (
    <div>
      <div>&nbsp;</div>
      <div className="fusebit-nav-category">Resources</div>
      <Tree name="Documentation" icon={books} enableDropdownArrow>
        <Box display="flex" flexDirection="column">
          <StyledLink
            href="https://developer.fusebit.io/reference/fusebit-int-framework-integration"
            target="_blank"
            rel="noreferrer"
          >
            Fusebit SDK
          </StyledLink>
          <StyledLink href={integrationGuideUrl} target="_blank" rel="noreferrer">
            Integration Guide
          </StyledLink>
        </Box>
      </Tree>
      <Tree name="Snippets" icon={code} enableDropdownArrow>
        <Tree name="page 1" />
        <Tree name="page 2" />
      </Tree>
    </div>
  );
};

export default Resources;
