import { Box } from '@material-ui/core';
import { urlOrSvgToImage } from '@utils/utils';
import React, { useRef, useState } from 'react';
import * as CSC from '@components/globalStyle';
import styled from 'styled-components';
import useOnClickOutside from '@hooks/useOnClickOutside';

const StyledEditorNavText = styled.input`
  ${CSC.editorNavTextStyles}
  width: 100%;
  border: none;
  outline: rgba(355, 355, 355, 0);
  background: rgba(355, 355, 355, 0);
  border-bottom: 1px solid black;
  transition: all 0.1s linear;
`;

const StyledWrapper = styled(Box)<{ active?: boolean }>`
  position: relative;
  height: 36px;
  padding: 8px;
  transition: all 0.25s linear;
`;

interface Props {
  id?: string;
  initialValue?: string;
  onSubmit: (value: string) => void;
  icon: string;
}

const CustomInputItem: React.FC<Props> = ({ id, initialValue, onSubmit, icon }) => {
  const [value, setValue] = useState(initialValue || '');
  const ref = useRef(null);

  useOnClickOutside({
    ref,
    callback: (e) => {
      if (e.target.id !== 'addNewFile' && e.target.getAttribute('data-parent-id') !== 'addNewFile') {
        onSubmit(value);
      }
    },
  });

  return (
    <StyledWrapper id={id} display="flex" alignItems="center" mb="6px">
      <CSC.StyledEditorNavIcon src={urlOrSvgToImage(icon)} />
      <StyledEditorNavText
        autoFocus
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSubmit(value);
          }
        }}
      />
    </StyledWrapper>
  );
};

export default CustomInputItem;
