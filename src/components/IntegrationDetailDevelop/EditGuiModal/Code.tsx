import React, { useCallback, useEffect, useState } from 'react';
import fileIcon from '@assets/file.svg';
import addIcon from '@assets/add.svg';
import codeIcon from '@assets/code.svg';
import CustomNavBase from './CustomNavBase';
import CustomNavItem from './CustomNavItem';
import CustomInputItem from './CustomInputItem';
import Tree from './Tree';

interface Props {
  isEditorRunning: boolean;
}

const Code = ({ isEditorRunning }: Props) => {
  const [codeFiles, setCodeFiles] = useState<{ [key: string]: string }>({});
  const [activeFile, setActiveFile] = useState('integration.js');
  const [files, setFiles] = useState<string[]>([]);
  const [showInput, setShowInput] = useState(false);

  const loadEditorCodeFiles = () => {
    const editorFiles = window.editor.getFiles();
    setCodeFiles({ ...editorFiles });
  };

  useEffect(() => {
    if (isEditorRunning) {
      loadEditorCodeFiles();
    }
  }, [isEditorRunning]);

  const createStructure = useCallback((acc: any, fileName: string, fullName: string, fileContent: string) => {
    const splittedFile = fileName.split('/');
    const element = splittedFile[0];

    if (splittedFile.length === 1) {
      acc[fullName] = fileContent;
      return acc;
    }

    acc[element] = acc[element] || {};
    acc[element] = createStructure(acc[element], splittedFile.slice(1).join('/'), fullName, fileContent);

    return acc;
  }, []);

  useEffect(() => {
    const newFileStructure = Object.keys(codeFiles).reduce((acc: any, key) => {
      const fileContent = codeFiles[key];
      acc = createStructure(acc, key, key, fileContent);

      return acc;
    }, {});

    setFiles(newFileStructure);
  }, [codeFiles, createStructure]);

  const handleClick = (file: string) => {
    const fileExists = window.editor.fileExistsInSpecification(file);

    if (fileExists) {
      window.editor?.selectFile(file);
      setActiveFile(file);
    }
  };

  const handleDelete = (deletedFile: string) => {
    window.editor.deleteFile(deletedFile);
    loadEditorCodeFiles();
  };

  const handleOnSubmit = (newFile: string) => {
    if (newFile !== '') {
      window.editor?.addFile(newFile);
      loadEditorCodeFiles();
      setActiveFile(newFile);
    }

    setShowInput(false);
  };

  const mapFolders = (fileStructure: { [key: string]: any }) => {
    return Object.keys(fileStructure).map((key) => {
      const file = fileStructure[key];
      if (typeof file === 'string') {
        const splittedKey = key.split('/');
        const fileName = splittedKey[splittedKey.length - 1];

        return (
          <CustomNavItem
            key={key}
            id={key}
            icon={fileIcon}
            name={fileName}
            onClick={() => handleClick(key)}
            onDelete={(deletedItem) => handleDelete(deletedItem)}
            active={key === activeFile}
            enableDelete
          />
        );
      }

      return (
        <Tree key={key} name={key} icon={codeIcon} enableDropdownArrow>
          {mapFolders(file)}
        </Tree>
      );
    });
  };

  return (
    <CustomNavBase
      id="code-custom"
      title="Code"
      tooltipDescription="All the files needed to run your Fusebit Integration as a microservice on our platform."
    >
      {mapFolders(files)}
      {showInput && (
        <CustomInputItem
          icon={fileIcon}
          onSubmit={(newFile) => {
            handleOnSubmit(newFile);
          }}
        />
      )}
      <CustomNavItem id="addNewFile" icon={addIcon} name="New File" onClick={() => setShowInput(true)} />
    </CustomNavBase>
  );
};

export default Code;
