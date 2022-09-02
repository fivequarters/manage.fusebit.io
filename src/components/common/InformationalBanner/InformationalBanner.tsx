import React from 'react';
import styled from 'styled-components';

const StyledBanner = styled.div`
  display: flex;
  align-items: center;
  border-radius: 8px;
  margin-bottom: 32px;
`;

const StyledDescription = styled.p`
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: var(--black);
  margin: 0;

  & > strong {
    font-weight: 500;
    line-height: 16px;
  }

  & > a,
  a:visited,
  a:link {
    color: inherit;
    font-weight: 500;
    text-decoration: underline;
    text-underline-offset: 1px;
  }
`;

interface Props {
  children: React.ReactNode;
  className?: string;
}

const InformationalBanner: React.FC<Props> = ({ children, className }) => {
  return (
    <StyledBanner className={className}>
      <StyledDescription>{children}</StyledDescription>
    </StyledBanner>
  );
};

export default InformationalBanner;
