import React from 'react';
import * as SC from './styles';

interface Props {
  active: boolean;
  description: string;
  highlightedDescription: string;
  href: string;
}

const InformationalBanner: React.FC<Props> = ({ active, description, highlightedDescription, href }) => {
  if (active) {
    return (
      <SC.Banner>
        <SC.InfoIcon />
        <SC.Description>
          {description + ' '}
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
        </SC.Description>
      </SC.Banner>
    );
  }

  return null;
};

export default InformationalBanner;
