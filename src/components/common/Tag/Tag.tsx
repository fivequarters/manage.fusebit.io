import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';

const StyledWrapper = styled.div<{ cursorPointer: boolean }>`
  padding: 6.5px 12px;
  background-color: rgba(33, 33, 33, 0.08);
  border-radius: 16px;
  display: inline-block;
  white-space: nowrap;

  &:hover {
    ${(props) =>
      props.cursorPointer &&
      css`
        cursor: pointer;
      `}
  }
`;

const StyledTag = styled.div`
  display: flex;
  align-items: center;
  font-family: 'Nunito Sans';
  font-size: 14px;
  line-height: 19px;
  color: var(--black);
  letter-spacing: 0.0025em;
`;

interface Props {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Tag: React.FC<Props> = ({ children, onClick }) => {
  return (
    <StyledWrapper cursorPointer={!!onClick} onClick={(e) => onClick?.(e)}>
      <StyledTag>{children}</StyledTag>
    </StyledWrapper>
  );
};

export default Tag;
