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

// si es string mostrar archivos, si es obj mostrar carpetas

const item = ['folder', 'anotherFile.js'];

const arbol = [
  ['folder', 'anotherFile.js'],
  ['folder', 'test.js'],
  ['folder', 'folder1', 'a.js'],
  ['folder', 'folder2', 'b.js'],
];

const structure = {
  folder: {
    folder1: {
      'folder/folder1/anotherFile.js': 'module.exports = () => {};',
    },
    folder2: {
      'b.js': 'module.exports = () => {};',
    },
    folder3: {
      folder4: {
        'c.js': 'module.exports = () => {};',
      },
    },
  },
  archivo: 'module.exports = () => {};',
};

// const arr = [
//   {
//     type: 'folder',
//     id: 'asd',
//     files: [
//       { type: 'file', id: 'file.js' },
//       {
//         type: 'folder',
//         id: 'moreFolders',
//         files: [
//           { type: 'file', id: 'asd.js' },
//           { type: 'file', id: 'asdasd.js' },
//           { type: 'folder', id: 'lastFolder', files: [{ type: 'file', id: 'lastFile.js' }] },
//         ],
//       },
//     ],
//   },
//   {
//     type: 'file',
//     id: 'randomFile.js',
//   },
// ];

const Code = ({ isEditorRunning }: Props) => {
  const [activeFile, setActiveFile] = useState('integration.js');
  const [files, setFiles] = useState<string[]>([]);
  const [showInput, setShowInput] = useState(false);

  // const structure = {
  //   folder: {
  //     folder1: {
  //       'folder/folder1/anotherFile.js': 'module.exports = () => {};',
  //     },
  //     folder2: {
  //       'b.js': 'module.exports = () => {};',
  //     },
  //     folder3: {
  //       folder4: {
  //         'c.js': 'module.exports = () => {};',
  //       },
  //     },
  //   },
  //   archivo: 'module.exports = () => {};',
  // };

  const createStructure = useCallback((acc: any, fileName: string, fullName: string) => {
    const splittedFile = fileName.split('/');
    const file = splittedFile[0];

    if (splittedFile.length === 1) {
      acc[`${fullName}`] = `${fullName}`;
      return acc;
    }

    acc[file] = { ...acc[file] };
    acc[file] = createStructure(acc[file], splittedFile.slice(1).join('/'), fullName);

    return acc;
  }, []);

  useEffect(() => {
    if (isEditorRunning) {
      const filesKeys = Object.keys(window.editor?.getFiles() || {}).reverse();
      const newFileStructure = filesKeys.reduce((acc: any, file) => {
        acc = createStructure(acc, file, file);

        return acc;
      }, {});

      console.log(newFileStructure);

      setFiles(newFileStructure);
    }
  }, [isEditorRunning, createStructure]);

  const handleClick = (file: string) => {
    window.editor.selectFile(file);
    setActiveFile(file);
  };

  const handleDelete = (deletedFile: string) => {
    const filteredFiles = files.filter((file) => file !== deletedFile);
    setFiles(filteredFiles);
  };

  const handleOnSubmit = (newFile: string) => {
    if (newFile !== '') {
      window.editor?.addFile(newFile);
      setFiles([...files, newFile]);
      setActiveFile(newFile);
    }

    setShowInput(false);
  };

  // const renderFiles = (array: any) => {
  //   return array.map((item: any) => {
  //     if (item.type === 'file') {
  //       return (
  //         <CustomNavItem
  //           key={item.id}
  //           id={item.id}
  //           icon={fileIcon}
  //           name={item.id}
  //           onClick={() => handleClick(item.id)}
  //           onDelete={(deletedItem) => handleDelete(deletedItem)}
  //           active={item.id === activeFile}
  //           enableDelete
  //         />
  //       );
  //     }

  //     return (
  //       <Tree key={item.id} name={item.id} icon={codeIcon} enableDropdownArrow>
  //         {renderFiles(item.files)}
  //       </Tree>
  //     );
  //   });
  // };

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
      {/* {files?.map((file) => {
        return (
          <CustomNavItem
            key={file}
            id={file}
            icon={fileIcon}
            name={file}
            onClick={() => handleClick(file)}
            onDelete={(deletedFile) => handleDelete(deletedFile)}
            active={file === activeFile}
            enableDelete
          />
        );
      })} */}
      {showInput && (
        <CustomInputItem
          icon={fileIcon}
          onSubmit={(newFile) => {
            handleOnSubmit(newFile);
          }}
        />
      )}
      {mapFolders(files)}
      <CustomNavItem id="addNewFile" icon={addIcon} name="New File" onClick={() => setShowInput(true)} />
    </CustomNavBase>
  );
};

export default Code;
