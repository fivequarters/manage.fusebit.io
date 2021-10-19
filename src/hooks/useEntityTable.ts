import { useState } from 'react';
import { useEntityApi } from './useEntityApi';
import { EntitiesType } from '../interfaces/entities';
import { useAuthContext } from './useAuthContext';

interface Props {
  rows: any[];
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
}

export const useEntityTable = ({ page, setPage, rowsPerPage, rows }: Props) => {
  const [selected, setSelected] = useState<string[]>([]);
  const { massiveDelete } = useEntityApi();
  const { userData } = useAuthContext();

  const handleSelectAllCheck = (event: any) => {
    if (event.target.checked) {
      const newSelecteds = rows
        .map((row) => {
          if (row.id !== userData.userId) {
            return row.id;
          }
          return null;
        })
        .filter((_selected) => _selected !== null);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleCheck = (_: any, id: string) => {
    if (id !== userData.userId) {
      const selectedIndex = selected.indexOf(id);
      let newSelected: string[] = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
      }

      setSelected(newSelected);
    }
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const handleRowDelete = async (type: EntitiesType, errorContainer?: string) => {
    massiveDelete(
      selected,
      type,
      () => {
        const computedPages = Math.ceil((rows.length - selected.length) / rowsPerPage) - 1;

        if (page > 0 && page > computedPages) {
          setPage(0);
        }

        setSelected([]);
      },
      errorContainer
    );
  };

  return {
    handleSelectAllCheck,
    handleCheck,
    isSelected,
    handleRowDelete,
    selected,
  };
};
