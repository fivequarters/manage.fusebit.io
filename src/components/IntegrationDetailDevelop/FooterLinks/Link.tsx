import { Integration } from '@interfaces/integration';
import { trackEventMemoized } from '@utils/analytics';
import React from 'react';
import styled from 'styled-components';

export const StyledLink = styled.a`
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 16px;
  color: var(--black);
  text-decoration: underline;
  margin-bottom: 16px;
  margin-left: 5px;
  transition: all 0.25s linear;

  &:hover {
    color: var(--primary-color);

    > div {
      background-color: var(--primary-color);
    }
  }

  &:visited {
    color: #959595;

    > div {
      background-color: #959595;
    }
  }
`;

export const StyledBullet = styled.div`
  height: 4px;
  width: 4px;
  border-radius: 50%;
  background-color: var(--black);
  margin-right: 10px;
  transition: all 0.25s linear;
`;

interface Props {
  integration?: Integration;
  text: string;
  href: string;
}

const Link = ({ integration, text, href }: Props) => {
  return (
    <StyledLink
      target="_blank"
      rel="noopener_noreferrer"
      onClick={() =>
        trackEventMemoized(`${text} Model Link Clicked`, 'Integration', {
          Integration: integration?.tags['fusebit.feedId'],
        })
      }
      href={href}
    >
      <StyledBullet />
      {text}
    </StyledLink>
  );
};

export default Link;
