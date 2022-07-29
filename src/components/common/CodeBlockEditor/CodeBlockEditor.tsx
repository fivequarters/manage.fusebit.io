import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import styled from 'styled-components';
import { Box } from '@material-ui/core';

const StyledEditor = styled(Editor)`
  background-color: white;
  box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
  border-radius: 8px;

  .monaco-editor {
    padding: 32px 0;

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
  font-weight: 400;
  color: rgba(0, 0, 0, 0.54);
  margin-bottom: 8px;
`;

interface Props {
  defaultValue: string;
  onChange: (val: string) => void;
  label?: string;
  isExpandable?: boolean;
}

const LINE_HEIGHT = 20;
const DEFAULT_EDITOR_HEIGHT = 300;

const CodeBlockEditor = ({ defaultValue, onChange, label, isExpandable }: Props) => {
  const editorRef = useRef<any>(null);
  const [editorHeight, setEditorHeight] = useState(DEFAULT_EDITOR_HEIGHT);

  const handleOnMount = (editor: any) => {
    editorRef.current = editor;
  };

  return (
    <Box mb="24px">
      {label && <StyledLabel>{label}</StyledLabel>}
      <StyledEditor
        height={editorHeight}
        options={{
          minimap: {
            enabled: false,
          },
          scrollBeyondLastLine: false,
          scrollbar: {
            vertical: isExpandable ? 'hidden' : 'auto',
          },
        }}
        defaultLanguage="javascript"
        theme="fusebit"
        defaultValue={defaultValue}
        onMount={handleOnMount}
        onChange={(val) => {
          onChange(val || '');

          if (!isExpandable) {
            return;
          }

          const linesOfCode = editorRef.current.getModel().getLineCount();
          const height = linesOfCode * LINE_HEIGHT;
          if (height > DEFAULT_EDITOR_HEIGHT) {
            setEditorHeight(height);
          }
        }}
      />
    </Box>
  );
};

export default CodeBlockEditor;
