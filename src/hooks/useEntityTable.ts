import { useEffect, useRef, useState } from 'react';
import { Integration } from '../interfaces/integration';
import { Connector } from '../interfaces/connector';
import { useHistory } from 'react-router';
import { Feed } from '../interfaces/feed';
import { Data } from '../interfaces/feedPicker';
import { useCreateDataFromFeed } from './useCreateDataFromFeed';
import { useQuery } from './useQuery';
import { useEntityApi } from './useEntityApi';

interface Props {
  headless?: any;
  setHeadless?: Function;
  reloadIntegrations?: Function;
  reloadConnectors?: Function;
  reloadUsers?: Function;
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
}

export const useEntityTable = ({
  headless,
  setHeadless,
  reloadIntegrations,
  reloadConnectors,
  reloadUsers,
  integrations,
  connectors,
}: Props) => {
  const history = useHistory();
  const [selected, setSelected] = useState<string[]>([]);
  const [rows, setRows] = useState<Integration[] | Connector[]>([]);
  const { createDataFromFeed } = useCreateDataFromFeed();
  const [addIntegrationOpen, setAddIntegrationOpen] = useState(false);
  const [addConnectorOpen, setAddConnectorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const query = useQuery();
  const isIntegration = useRef(false);
  const { massiveDelete } = useEntityApi();

  const setItems = () => {
    const items = isIntegration.current ? integrations?.data.items : connectors?.data.items;
    items && setRows(items);
  };

  const checkQuery = () => {
    setHeadless && setHeadless(false); // so we only do this once.
    const key = query.get('key');
    if (key !== null && key !== undefined) {
      isIntegration.current ? setAddIntegrationOpen(true) : setAddConnectorOpen(true);
    }
  };

  useEffect(() => {
    isIntegration.current = window.location.href.indexOf('integration') >= 0;
    if (integrations && integrations.data.items) {
      setLoading(false);
      // If there are integrations to show or if all of the integrations where deleted we call the setItems function
      (integrations.data.items.length > 0 || !headless.current) && setItems();

      // If we have just navigated to the integrations list we check if there is a query param
      headless.current && checkQuery();
    } else if (connectors && connectors.data.items) {
      setLoading(false);
      // If there are connectors to show or if all of the connectors where deleted we call the setItems function
      (connectors.data.items.length > 0 || !headless.current) && setItems();

      // If we have just navigated to the connectors list we check if there is a query param
      headless.current && checkQuery();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [integrations, connectors, query]);

  const handleSelectAllCheck = (event: any) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((row) => row.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleCheck = (event: any, id: string) => {
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
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const handleRowDelete = async () => {
    massiveDelete(
      selected,
      isIntegration.current ? 'I' : window.location.href.indexOf('connector') >= 0 ? 'C' : 'A',
      () => {
        isIntegration.current
          ? reloadIntegrations && reloadIntegrations()
          : reloadConnectors
          ? reloadConnectors()
          : reloadUsers && reloadUsers();
        setSelected([]);
      }
    );
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
    addIntegrationOpen,
    addConnectorOpen,
    loading,
    selected,
  };
};
