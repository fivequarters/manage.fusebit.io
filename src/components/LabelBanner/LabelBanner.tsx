import React from 'react';
import * as SC from './styles';

interface Props {
  description: string;
  highlightedDescription?: string;
  href: string;
  linkedWords?: number;
  className?: string;
}

const LabelBanner: React.FC<Props> = ({ description, highlightedDescription, href, className, linkedWords }) => {
  linkedWords = linkedWords || 1;
  let highlight = (highlightedDescription || '').split(' ');
  let highlightText = highlight.slice(0, highlight.length - linkedWords).join(' ');
  let linkedText = highlight.slice(highlight.length - linkedWords).join(' ');

  return (
    <SC.Banner className={className}>
      <SC.Description>
        {description + ' '}
        {highlightedDescription && (
          <strong>
            {highlightText + ' '}
            <a href={href} target="_blank" rel="noreferrer">
              {linkedText}
            </a>
          </strong>
        )}
      </SC.Description>
    </SC.Banner>
  );
};

export default LabelBanner;
