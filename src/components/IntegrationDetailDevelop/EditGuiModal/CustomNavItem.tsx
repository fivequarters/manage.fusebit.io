import { Box } from '@material-ui/core';
import { urlOrSvgToImage } from '@utils/utils';
import React from 'react';
import * as CSC from '@components/globalStyle';
import styled from 'styled-components';

const StyledEditorNavText = styled.div`
  ${CSC.editorNavTextStyles}
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  transition: all 0.1s linear;
`;

const StyledWrapper = styled(Box)<{ active?: boolean }>`
  padding: 8px;
  border-radius: 4px;
  transition: all 0.25s linear;

  background-color: ${(props) => props.active && 'var(--secondary-color)'};
  & > div {
    font-weight: ${(props) => props.active && 600};
  }

  &:hover {
    background-color: var(--secondary-color);
    cursor: pointer;

    & > div {
      font-weight: 600;
    }
  }
`;

interface Props {
  id?: string;
  icon: string;
  name: string;
  active?: boolean;
  onClick?: () => void;
}

const CustomNavItem: React.FC<Props> = ({ id, icon, name, onClick, active }) => {
  return (
    <StyledWrapper id={id} display="flex" alignItems="center" mb="6px" onClick={onClick} active={active}>
      <CSC.StyledEditorNavIcon data-parent-id={id} src={urlOrSvgToImage(icon)} />
      <StyledEditorNavText data-parent-id={id}>{name}</StyledEditorNavText>
    </StyledWrapper>
  );
};

export default CustomNavItem;
