import React from 'react';
import * as SC from './styles';

interface Props {
  description: string;
  highlightedDescription?: string;
  href: string;
  className?: string;
}

const InformationalBanner: React.FC<Props> = ({ description, highlightedDescription, href, className }) => {
  return (
    <SC.Banner className={className}>
      <SC.Description>
        {description + ' '}
        {highlightedDescription && (
          <strong>
            {highlightedDescription.split(' ').map((word: string, index, array) => {
              // we get the last higlighted word and use it as our link
              if (word === array[array.length - 1]) {
                return (
                  <a href={href} target="_blank" rel="noreferrer">
                    {word}
                  </a>
                );
              }
              return word + ' ';
            })}
          </strong>
        )}
      </SC.Description>
    </SC.Banner>
  );
};

export default InformationalBanner;
