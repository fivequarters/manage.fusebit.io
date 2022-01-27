import React, { useEffect } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { trackEvent } from '@utils/analytics';

export const StyledConnectorDescription = styled(ReactMarkdown)`
  font-size: 14px;
  line-height: 20px;
  color: var(--black);
  max-width: 600px;

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
}

const ForkItemDescription = ({ description, templateId }: Props) => {
  useEffect(() => {
    const linkClickListener = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement && event.target.nodeName.toLowerCase() === 'a') {
        let parent = event.target.parentElement;
        while (parent !== null) {
          if (parent.attributes.getNamedItem('data-segment')?.value === 'track') {
            trackEvent(`Fork Integration Docs Learn More Link Clicked`, `Integrations`, { Integration: templateId });
          }
          parent = parent.parentElement;
        }
      }
    };
    document.addEventListener('click', linkClickListener);
    return () => {
      document.removeEventListener('click', linkClickListener);
    };
  }, [templateId]);
  return (
    <div data-segment="track">
      <StyledConnectorDescription linkTarget="_blank">{description}</StyledConnectorDescription>
    </div>
  );
};

export default ForkItemDescription;
