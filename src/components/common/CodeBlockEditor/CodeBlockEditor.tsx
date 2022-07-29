import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import styled from 'styled-components';
import { Box } from '@material-ui/core';

const StyledEditor = styled(Editor)`
  background-color: white;
  box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
  padding: 32px 0;
  border-radius: 8px;
  height: 300px;

  .monaco-editor {
    .scroll-decoration {
      box-shadow: none;
    }

    .view-overlays .current-line {
      background: #f7f9f9;
      border: none;
    }
  }
`;

const StyledLabel = styled.div`
  font-size: 12px;
  line-height: 16px;
  font-weight: 300;
  color: var(--grey);
  margin-bottom: 8px;
`;

interface Props {
  defaultValue: string;
  onChange: (val: string) => void;
  label?: string;
}

const CodeBlockEditor = ({ defaultValue, onChange, label }: Props) => {
  const editorRef = useRef(null);

  const handleOnMount = (editor: any) => {
    editorRef.current = editor;
  };

  return (
    <Box>
      {label && <StyledLabel>{label}</StyledLabel>}
      <StyledEditor
        defaultLanguage="javascript"
        theme="fusebit"
        defaultValue={defaultValue}
        onMount={handleOnMount}
        onChange={(val) => {
          onChange(val || '');
        }}
      />
    </Box>
  );
};

export default CodeBlockEditor;
