import { useEffect, useRef, useState } from 'react';
import { Integration } from '../interfaces/integration';
import { Connector } from '../interfaces/connector';
import { useQuery } from './useQuery';
import { useEntityApi } from './useEntityApi';
import { Account } from '../interfaces/account';
import { EntitiesType } from '../interfaces/entities';
import { useContext } from './useContext';

interface Props {
  integrations?: {
    data: {
      items: Integration[];
    };
  };
  connectors?: {
    data: {
      items: Connector[];
    };
  };
  users?: {
    data: {
      items: Account[];
    };
  };
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
}

export const useEntityTable = ({ integrations, connectors, users, page, setPage, rowsPerPage }: Props) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [rows, setRows] = useState<Integration[] | Connector[] | Account[]>([]);
  const [addIntegrationOpen, setAddIntegrationOpen] = useState(false);
  const [addConnectorOpen, setAddConnectorOpen] = useState(false);
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const query = useQuery();
  const isIntegration = useRef(false);
  const { massiveDelete } = useEntityApi();
  const { userData } = useContext();

  useEffect(() => {
    isIntegration.current = window.location.href.indexOf('integration') >= 0;
    if (integrations && integrations.data.items) {
      setLoading(false);
    } else if (connectors && connectors.data.items) {
      setLoading(false);
    } else if (users && users.data.items) {
      setLoading(false);

      if (users.data.items.length > 0) {
        setRows(users?.data.items);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [integrations, connectors, users, query]);

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
      // @ts-ignore the computer thinks this is a null[]
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleCheck = (event: any, id: string) => {
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

  const handleRowDelete = async (type?: EntitiesType, errorContainer?: string) => {
    massiveDelete(
      selected,
      // TODO: Remove the location validation when the tables migration is done
      type ||
        // eslint-disable-next-line no-nested-ternary
        (isIntegration.current
          ? 'Integration'
          : window.location.href.indexOf('connector') >= 0
          ? 'Connector'
          : 'Account'),
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
    rows,
    handleSelectAllCheck,
    handleCheck,
    isSelected,
    handleRowDelete,
    setAddIntegrationOpen,
    setAddConnectorOpen,
    setNewUserOpen,
    addIntegrationOpen,
    addConnectorOpen,
    newUserOpen,
    loading,
    selected,
    deleteModalOpen,
    setDeleteModalOpen,
    setRows,
  };
};
