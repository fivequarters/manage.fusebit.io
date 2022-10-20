import { Box } from '@material-ui/core';
import { urlOrSvgToImage } from '@utils/utils';
import React, { useRef, useState } from 'react';
import deleteIcon from '@assets/delete.svg';
import * as CSC from '@components/globalStyle';
import styled from 'styled-components';
import useOnClickOutside from '@hooks/useOnClickOutside';

const StyledEditorNavText = styled.div`
  ${CSC.editorNavTextStyles}
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  transition: all 0.1s linear;
`;

export const StyledDeleteIcon = styled.img<{ active?: boolean }>`
  height: 15px;
  width: 15px;
  object-fit: contain;
  margin-left: auto;
  margin-right: 3px;
  opacity: ${(props) => (props.active ? 0.8 : 0)};
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

const StyledDeleteBackground = styled.div<{ active: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  visibility: ${(props) => (props.active ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.active ? 1 : 0)};
  cursor: default;
  transition: all 0.25s ease-in-out;
`;

const StyledDeleteModal = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: white;
  z-index: 9999;
  border-radius: 10px;
  outline: rgba(355, 355, 355, 0);
  cursor: default;
`;

const StyledModalTitle = styled.h2`
  text-align: center;
`;

const StyledButton = styled.button<{ outlined?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  border: ${(props) => (props.outlined ? '1px solid var(--primary-color)' : 'none')};
  margin-right: 12px;
  background: ${(props) => (props.outlined ? 'none' : 'var(--primary-color)')};
  border-radius: 4px;
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => (props.outlined ? 'var(--primary-color)' : 'white')};
  transition: all 0.25s linear;
`;

interface Props {
  id?: string;
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

  const ref = useRef(null);
  useOnClickOutside({ ref, callback: () => setDeleteModalActive(false) });

  return (
    <StyledWrapper
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      id={id}
      display="flex"
      alignItems="center"
      mb="6px"
      onClick={onClick}
      active={active}
    >
      <CSC.StyledEditorNavIcon data-parent-id={id} src={urlOrSvgToImage(icon)} />
      <StyledEditorNavText data-parent-id={id}>{name}</StyledEditorNavText>
      {enableDelete && (
        <>
          <StyledDeleteIcon
            data-parent-id={id}
            src={urlOrSvgToImage(deleteIcon)}
            active={isHovering}
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModalActive(true);
            }}
          />
          <StyledDeleteBackground active={deleteModalActive}>
            <StyledDeleteModal ref={ref}>
              <StyledModalTitle>Are you sure you want to delete {id}?</StyledModalTitle>
              <Box display="flex" alignItems="center" mt="16px">
                <StyledButton
                  type="button"
                  outlined
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteModalActive(false);
                  }}
                >
                  Cancel
                </StyledButton>
                <StyledButton
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.editor.deleteFile(id);
                    onDelete?.(id || '');
                    setDeleteModalActive(false);
                  }}
                >
                  Delete
                </StyledButton>
              </Box>
            </StyledDeleteModal>
          </StyledDeleteBackground>
        </>
      )}
    </StyledWrapper>
  );
};

export default CustomNavItem;
