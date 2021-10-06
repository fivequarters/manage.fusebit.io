import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Integration } from '../interfaces/integration';
import { Connector } from '../interfaces/connector';
import { Feed } from '../interfaces/feed';
import { Data } from '../interfaces/feedPicker';
import { useCreateDataFromFeed } from './useCreateDataFromFeed';
import { useQuery } from './useQuery';
import { useEntityApi } from './useEntityApi';
import { Account } from '../interfaces/account';
import { EntitiesType } from '../interfaces/entities';
import { useContext } from './useContext';

interface Props {
  headless?: any;
  setHeadless?: Function;
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

export const useEntityTable = ({
  headless,
  setHeadless,
  integrations,
  connectors,
  users,
  page,
  setPage,
  rowsPerPage,
}: Props) => {
  const history = useHistory();
  const [selected, setSelected] = useState<string[]>([]);
  const [rows, setRows] = useState<Integration[] | Connector[] | Account[]>([]);
  const { createDataFromFeed } = useCreateDataFromFeed();
  const [addIntegrationOpen, setAddIntegrationOpen] = useState(false);
  const [addConnectorOpen, setAddConnectorOpen] = useState(false);
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const query = useQuery();
  const isIntegration = useRef(false);
  const { massiveDelete } = useEntityApi();
  const { userData } = useContext();

  const setItems = () => {
    const items = isIntegration.current ? integrations?.data.items : connectors?.data.items;
    if (items) {
      setRows(items);
    }
    localStorage.removeItem('firstTimeVisitor'); // we delete this key, to, in case the user logs in to an account that has items and creates a new one, we now that we dont have to show them the modal
  };

  const checkQuery = () => {
    if (setHeadless) {
      setHeadless(false);
    }
    const key = query.get('key');
    if (key !== null && key !== undefined) {
      if (isIntegration.current) {
        setAddIntegrationOpen(true);
      } else {
        setAddConnectorOpen(true);
      }
    }
  };

  useEffect(() => {
    isIntegration.current = window.location.href.indexOf('integration') >= 0;
    if (integrations && integrations.data.items) {
      setLoading(false);

      // If there are no Integrations when we first visit the integrations tab we open the integrations modal
      if (integrations.data.items.length === 0 && localStorage.getItem('firstTimeVisitor')) {
        setAddIntegrationOpen(true);
        localStorage.removeItem('firstTimeVisitor');
      }

      // If there are integrations to show or if all of the integrations where deleted we call the setItems function
      if (integrations.data.items.length > 0 || !headless.current) {
        setItems();
      }

      // If we have just navigated to the integrations list we check if there is a query param
      if (headless.current) {
        checkQuery();
      }
    } else if (connectors && connectors.data.items) {
      setLoading(false);

      // If there are no connectors when we first visit the connectors tab we open the connectors modal
      if (connectors.data.items.length === 0 && localStorage.getItem('firstTimeVisitor')) {
        setAddConnectorOpen(true);
        localStorage.removeItem('firstTimeVisitor');
      }

      // If there are connectors to show or if all of the connectors where deleted we call the setItems function
      if (connectors.data.items.length > 0 || !headless.current) {
        setItems();
      }

      // If we have just navigated to the connectors list we check if there is a query param
      if (headless.current) {
        checkQuery();
      }
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
      // eslint-disable-next-line no-nested-ternary
      type || (isIntegration.current ? 'I' : window.location.href.indexOf('connector') >= 0 ? 'C' : 'A'),
      () => {
        const computedPages = Math.ceil((rows.length - selected.length) / rowsPerPage) - 1;

        if (page > 0 && page > computedPages) {
          setPage(0);
        }

        setSelected([]);
      },
      errorContainer
    );
    localStorage.removeItem('firstTimeVisitor'); // so we dont show the user the modal when he had some integrations or connector already
  };

  const handleRowClick = (event: any, href: string) => {
    if (!event.target.id) {
      history.push(href);
    }
  };

  const handleIntegrationCreation = async (activeIntegration: Feed, data: Data) => {
    const res = await createDataFromFeed(activeIntegration, data);
    if (!res) {
      setAddIntegrationOpen(false);
    }
  };

  const handleConnectorCreation = async (activeIntegration: Feed, data: Data) => {
    const res = await createDataFromFeed(activeIntegration, data, true);
    if (!res) {
      setAddConnectorOpen(false);
    }
  };

  return {
    rows,
    handleSelectAllCheck,
    handleCheck,
    isSelected,
    handleRowDelete,
    handleRowClick,
    handleIntegrationCreation,
    handleConnectorCreation,
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
