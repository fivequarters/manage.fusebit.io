import { Box } from '@material-ui/core';
import { urlOrSvgToImage } from '@utils/utils';
import React, { useState } from 'react';
import deleteIcon from '@assets/delete.svg';
import * as CSC from '@components/globalStyle';
import styled from 'styled-components';
import ConfirmationPrompt from '@components/common/ConfirmationPrompt';

const StyledEditorNavText = styled.div`
  ${CSC.editorNavTextStyles}
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  transition: all 0.1s linear;
`;

export const StyledDeleteIcon = styled.img<{ active?: boolean }>`
  position: relative;
  height: 15px;
  width: 15px;
  object-fit: contain;
  margin-left: auto;
  margin-right: 3px;
  opacity: ${(props) => (props.active ? 0.8 : 0)};
  z-index: 10;
  transition: all 0.1s linear;

  &:hover {
    opacity: 1;
  }
`;

const StyledWrapper = styled(Box)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;

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
  id: string;
  icon: string;
  name: string;
  active?: boolean;
  enableDelete?: boolean;
  onDelete?: (id: string) => void;
  onClick?: () => void;
}

const CustomNavItem: React.FC<Props> = ({ id, icon, name, onClick, active, enableDelete, onDelete }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [deleteModalActive, setDeleteModalActive] = useState(false);

  return (
    <StyledWrapper
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      id={id}
      display="flex"
      alignItems="center"
      mb="6px"
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.getAttribute('id') === id || target.getAttribute('data-parent-id') === id) {
          onClick?.();
        }
      }}
      active={active}
    >
      <CSC.StyledEditorNavIcon data-parent-id={id} src={urlOrSvgToImage(icon)} />
      <StyledEditorNavText data-parent-id={id}>{name}</StyledEditorNavText>
      {enableDelete && (
        <>
          <StyledDeleteIcon
            id="deleteIcon"
            data-parent-id={id}
            src={urlOrSvgToImage(deleteIcon)}
            active={isHovering}
            onClick={(e) => {
              e.stopPropagation();
              setIsHovering(false);
              setDeleteModalActive(true);
            }}
          />
          <ConfirmationPrompt
            open={deleteModalActive}
            setOpen={setDeleteModalActive}
            handleConfirmation={() => {
              onDelete?.(id || '');
            }}
            title={`Are you sure you want to delete ${name}?`}
            description="You cannot undo this action."
            disableClose
          />
        </>
      )}
    </StyledWrapper>
  );
};

export default CustomNavItem;
