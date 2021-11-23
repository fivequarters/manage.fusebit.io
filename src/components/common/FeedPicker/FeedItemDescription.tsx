import React, { useEffect } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { trackEvent } from '@utils/analytics';

const StyledConnectorDescription = styled(ReactMarkdown)`
  font-size: 14px;
  line-height: 20px;
  color: var(--black);
  max-width: 300px;

  p {
    margin: 0;
    margin-top: 16px;
  }

  a {
    color: var(--black);
    text-decoration: underline;
    transition: all 0.25s linear;

    &:hover {
      color: var(--primary-color);
    }
  }
  @media only screen and (max-width: 1100px) {
    max-width: none;
  }
`;

interface Props {
  description: string;
  templateId: string;
  isIntegration: boolean | undefined;
}

const FeedItemDescription = ({ description, templateId, isIntegration }: Props) => {
  useEffect(() => {
    const linkClickListener = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement && event.target.nodeName.toLowerCase() === 'a') {
        let parent = event.target.parentElement;
        while (parent !== null) {
          if (parent.attributes.getNamedItem('data-segment')?.value === 'track') {
            trackEvent(
              `New ${isIntegration ? 'Integration' : 'Connector'} Docs Learn More Link Clicked`,
              isIntegration ? 'Integration' : 'Connector',
              { [isIntegration ? 'Integration' : 'Connector']: templateId }
            );
          }
          parent = parent.parentElement;
        }
      }
    };
    document.addEventListener('click', linkClickListener);
    return () => {
      document.removeEventListener('click', linkClickListener);
    };
  }, [isIntegration, templateId]);
  return (
    <div data-segment="track">
      <StyledConnectorDescription linkTarget="_blank">{description}</StyledConnectorDescription>
    </div>
  );
};

export default FeedItemDescription;
