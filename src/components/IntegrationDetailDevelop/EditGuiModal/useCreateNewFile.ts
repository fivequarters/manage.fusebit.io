import { useEffect } from 'react';
import add from '@assets/add.svg';

const addNewStyles = `
  position: relative;
  font-family: 'Poppins';
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  padding: 8px;
  color: #333333;
  cursor: pointer;
  transition: all 0.25s linear, font-weight 0.1s linear;
`;

const addNewIcon = `
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    height: 16px;
    width: 16px;
    background-image: url(${add});
    background-size: contain;
    background-repeat: no-repeat;
`;

type Props = {
  isEditorRunning: boolean;
};

const useCreateNewFile = ({ isEditorRunning }: Props) => {
  useEffect(() => {
    const createAddNewItemElement = (lastItem: Element) => {
      const addNew = document.createElement('div');
      addNew.setAttribute('id', 'addNewItem');
      addNew.setAttribute('style', addNewStyles);
      addNew.onmouseenter = () => {
        addNew.style.background = 'rgba(215, 229, 255, 0.4)';
        addNew.style.fontWeight = '600';
      };
      addNew.onmouseleave = () => {
        addNew.style.background = 'none';
        addNew.style.fontWeight = '500';
      };
      addNew.onclick = (e) => {
        e.stopPropagation();
        const el = document.querySelector('.fusebit-code-action-add-btn');
        if (el instanceof HTMLElement) {
          el?.click();
          document.getElementById('addNewItem')?.remove();
          const input = document.querySelector('.fusebit-nav-new-file');

          if (input) {
            createAddNewItemElement(input);
          }
        }
      };

      const p = document.createElement('p');
      p.setAttribute('style', 'margin: 0; margin-left: 25px;');
      p.innerText = 'New File';
      addNew.appendChild(p);

      const icon = document.createElement('div');
      icon.setAttribute('style', addNewIcon);
      addNew.appendChild(icon);

      lastItem.parentNode?.insertBefore(addNew, lastItem.nextSibling);
    };

    if (isEditorRunning) {
      const items = document.getElementsByClassName('fusebit-nav-file');
      const lastItem = items?.[items.length - 1];
      if (!document.getElementById('addNewItem')) {
        createAddNewItemElement(lastItem);
      }
    }
  }, [isEditorRunning]);
};

export default useCreateNewFile;
