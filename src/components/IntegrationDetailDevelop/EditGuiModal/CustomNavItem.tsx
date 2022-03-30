import { Box } from '@material-ui/core';
import { urlOrSvgToImage } from '@utils/utils';
import React from 'react';
import * as SC from '@components/globalStyle';
import styled from 'styled-components';

const StyledEditorNavIcon = styled.img`
  height: 15px;
  width: 15px;
  object-fit: contain;
  margin-right: 10px;
`;

const StyledEditorNavText = styled.div`
  ${SC.editorNavTextStyles}
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  transition: all 0.1s linear;
`;

const StyledWrapper = styled(Box)`
  padding: 8px;
  border-radius: 4px;
  transition: all 0.25s linear;

  &:hover {
    background-color: var(--secondary-color);
    cursor: pointer;

    & > div {
      font-weight: 600;
    }
  }
`;

interface Props {
  icon: string;
  name: string;
}

const CustomNavItem: React.FC<Props> = ({ icon, name }) => {
  return (
    <StyledWrapper display="flex" alignItems="center" mb="6px">
      <StyledEditorNavIcon src={urlOrSvgToImage(icon)} />
      <StyledEditorNavText>{name}</StyledEditorNavText>
    </StyledWrapper>
  );
};

export default CustomNavItem;
