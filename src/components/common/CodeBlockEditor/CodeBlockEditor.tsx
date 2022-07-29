import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import styled from 'styled-components';

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

interface Props {
  defaultValue: string;
  onChange: (val: string) => void;
}

const CodeBlockEditor = ({ defaultValue, onChange }: Props) => {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
  }

  return (
    <StyledEditor
      defaultLanguage="javascript"
      theme="fusebit"
      defaultValue={defaultValue}
      onMount={handleEditorDidMount}
      onChange={(val) => {
        onChange(val || '');
      }}
    />
  );
};

export default CodeBlockEditor;
