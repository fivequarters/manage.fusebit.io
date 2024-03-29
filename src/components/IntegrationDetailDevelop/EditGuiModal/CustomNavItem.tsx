import { Box } from '@material-ui/core';
import { urlOrSvgToImage } from '@utils/utils';
import React, { useState } from 'react';
import fileIcon from '@assets/file.svg';
import deleteIcon from '@assets/delete.svg';
import pencilIcon from '@assets/pencil.svg';
import * as CSC from '@components/globalStyle';
import styled, { css } from 'styled-components';
import ConfirmationPrompt from '@components/common/ConfirmationPrompt';
import CustomInputItem from './CustomInputItem';

const StyledEditorNavText = styled.div`
  ${CSC.editorNavTextStyles}
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-right: 10px;
  transition: all 0.1s linear;
`;

const StyledIconsWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const StyledIcon = css<{ active?: boolean }>`
  position: relative;
  height: 15px;
  width: 15px;
  object-fit: contain;
  margin-right: 3px;
  opacity: ${(props) => (props.active ? 0.8 : 0)};
  z-index: 10;
  transition: all 0.1s linear;

  &:hover {
    opacity: 1;
  }
`;

export const StyledDeleteIcon = styled.img<{ active?: boolean }>`
  ${StyledIcon}
`;

const StyledRenameIcon = styled.img<{ active?: boolean }>`
  ${StyledIcon}
  margin-right: 10px;
`;

const StyledWrapper = styled(Box)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  height: 36px;
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
  enableRename?: boolean;
  onDelete?: (id: string) => void;
  onClick?: () => void;
  onRename?: (newFileName: string) => void;
}

const CustomNavItem: React.FC<Props> = ({
  id,
  icon,
  name,
  onClick,
  onRename,
  active,
  enableDelete,
  enableRename,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [deleteModalActive, setDeleteModalActive] = useState(false);

  return (
    <>
      {isEditing ? (
        <CustomInputItem
          icon={fileIcon}
          initialValue={id}
          onSubmit={(newFileName) => {
            setIsHovering(false);
            setIsEditing(false);
            onRename?.(newFileName);
          }}
        />
      ) : (
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
          <StyledIconsWrapper>
            {enableRename && (
              <StyledRenameIcon
                id="pencilIcon"
                data-parent-id={id}
                src={urlOrSvgToImage(pencilIcon)}
                active={isHovering}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsHovering(false);
                  setIsEditing(true);
                }}
              />
            )}

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
          </StyledIconsWrapper>
        </StyledWrapper>
      )}
    </>
  );
};

export default CustomNavItem;
