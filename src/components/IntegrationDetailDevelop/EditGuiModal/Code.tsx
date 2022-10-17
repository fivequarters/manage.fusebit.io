import React, { useEffect, useState } from 'react';
import fileIcon from '@assets/file.svg';
import add from '@assets/add.svg';
import CustomNavBase from './CustomNavBase';
import CustomNavItem from './CustomNavItem';
import CustomInputItem from './CustomInputItem';

interface Props {
  isEditorRunning: boolean;
}

const Code = ({ isEditorRunning }: Props) => {
  const [activeFile, setActiveFile] = useState('integration.js');
  const [files, setFiles] = useState<string[]>([]);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    if (isEditorRunning) {
      setFiles(Object.keys(window.editor?.getFiles() || {}).reverse());
    }
  }, [isEditorRunning]);

  const handleClick = (file: string) => {
    window.editor.selectFile(file);
    setActiveFile(file);
  };

  const handleOnSubmit = (newFile: string) => {
    if (newFile !== '') {
      window.editor?.addFile(newFile);
      setFiles([...files, newFile]);
      setActiveFile(newFile);
    }

    setShowInput(false);
  };

  return (
    <CustomNavBase
      id="code-custom"
      title="Code"
      tooltipDescription="All the files needed to run your Fusebit Integration as a microservice on our platform."
    >
      {files?.map((file) => {
        return (
          <CustomNavItem
            key={file}
            id={file}
            icon={fileIcon}
            name={file}
            onClick={() => handleClick(file)}
            active={file === activeFile}
          />
        );
      })}
      {showInput && (
        <CustomInputItem
          icon={fileIcon}
          onSubmit={(newFile) => {
            handleOnSubmit(newFile);
          }}
        />
      )}
      <CustomNavItem id="addNewFile" icon={add} name="New File" onClick={() => setShowInput(true)} />
    </CustomNavBase>
  );
};

export default Code;
