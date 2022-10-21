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
  activeFile: string;
  setActiveFile: (file: string) => void;
  selectDefaultActiveFile: () => void;
}

const Code = ({ isEditorRunning, setActiveFile, activeFile, selectDefaultActiveFile }: Props) => {
  const [codeFiles, setCodeFiles] = useState<{ [key: string]: string }>({});
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

  const createStructure = useCallback((acc: any, fileName: string, fileKey: string, fileContent: string) => {
    const splittedFileName = fileName.split('/');
    const element = splittedFileName[0];

    if (splittedFileName.length === 1) {
      acc[fileKey] = fileContent;
      return acc;
    }

    acc[element] = acc[element] || {};
    acc[element] = createStructure(acc[element], splittedFileName.slice(1).join('/'), fileKey, fileContent);

    return acc;
  }, []);

  useEffect(() => {
    const newFileStructure = Object.keys(codeFiles)
      .sort()
      .reduce((acc: any, key) => {
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
    selectDefaultActiveFile();
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
      id="code"
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