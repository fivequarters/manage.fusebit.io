import React from 'react';
import * as SC from './styles';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Checkbox,
  IconButton,
  Tooltip,
  Modal,
  Backdrop,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { useContext } from '../../../../hooks/useContext';
import { useLoader } from '../../../../hooks/useLoader';
import { useAccountConnectorsGetAll } from '../../../../hooks/api/v2/account/connector/useGetAll';
import { useAccountConnectorDeleteConnector } from '../../../../hooks/api/v2/account/connector/useDeleteOne';
import { Operation } from '../../../../interfaces/operation';
import { Connector } from '../../../../interfaces/connector';
import { useError } from '../../../../hooks/useError';
import arrowRight from '../../../../assets/arrow-right.svg';
import arrowLeft from '../../../../assets/arrow-left.svg';
import { Feed } from '../../../../interfaces/feed';
import { useQuery } from '../../../../hooks/useQuery';
import FeedPicker from '../../../FeedPicker';
import { connectorsFeed } from '../../../../static/feed';
import { cells, OverviewProps } from '../../../../interfaces/connectors';
import { Data } from '../../../../interfaces/feedPicker';
import { useCreateDataFromFeed } from '../../../../hooks/useCreateDataFromFeed';
import Row from './Row';

const Overview: React.FC<OverviewProps> = ({ headless, setHeadless }) => {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [rows, setRows] = React.useState<Connector[]>([]);
  const { userData } = useContext();
  const { data: connectors, refetch: reloadConnectors } = useAccountConnectorsGetAll<{ items: Connector[] }>({
    enabled: userData.token,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const deleteConnector = useAccountConnectorDeleteConnector<Operation>();
  const { waitForOperations, createLoader, removeLoader } = useLoader();
  const { createError } = useError();
  const [selectedCell, setSelectedCell] = React.useState<cells>(cells.TYPE);
  const [addConnectorOpen, setAddConnectorOpen] = React.useState(false);
  const query = useQuery();
  const { createDataFromFeed } = useCreateDataFromFeed();

  React.useEffect(() => {
    if (connectors && connectors.data.items) {
      if (connectors.data.items.length > 0) {
        const items = connectors.data.items;
        setRows(items);
        if (headless.current) {
          setHeadless(false); // so we only do this once.
          const key = query.get('key');
          if (key !== null && key !== undefined) {
            setAddConnectorOpen(true);
          }
        }
      } else if (headless.current) {
        setHeadless(false); // so we only do this once.
        const items = connectors.data.items;
        setRows(items); // otherwise if we delete and the connectors.data.items has 0 items the rows will display 1
        const key = query.get('key');
        let keyDoesntMatch = true;
        connectorsFeed().then((feed) => {
          for (let i = 0; i < feed.length; i++) {
            if (feed[i].id === key) {
              keyDoesntMatch = false;
              const dummyData = {
                dummyIntegration: 'randomIntegration',
                dummyConnector: 'randomConnector',
              };
              createDataFromFeed(feed[i], dummyData, true);
            }
          }
          setAddConnectorOpen(keyDoesntMatch);
        });
      } else {
        const items = connectors.data.items;
        setRows(items); // otherwise if we delete and the connectors.data.items has 0 items the rows will display 1
      }
    }
  }, [connectors, query, createDataFromFeed, headless, setHeadless]);

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
    try {
      createLoader();
      let operationIds: string[] = [];
      for (let i = 0; i < selected.length; i++) {
        const response = await deleteConnector.mutateAsync({
          id: selected[i],
          accountId: userData.accountId,
          subscriptionId: userData.subscriptionId,
        });
        operationIds.push(response.data.operationId);
      }
      await waitForOperations(operationIds);
      reloadConnectors();
      setSelected([]);
    } catch (e) {
      createError(e.message);
    } finally {
      removeLoader();
    }
  };

  const handleRowClick = (event: any, href: string) => {
    // TODO: check if the user has auth to edit this row before sending him there, and if not send this error
    // if (has auth) {
    //     if (!event.target.id) {
    //         window.location.href = href;
    //     }
    // } else {
    //     createError("You don't have sufficient permissions to edit connector {connector}.  Please contact an account administrator.");
    // }
    if (!event.target.id) {
      window.location.href = href;
    }
  };

  const handlePreviousCellSelect = () => {
    if (selectedCell === cells.TYPE) {
      setSelectedCell(cells.CREATED);
    } else if (selectedCell === cells.CREATED) {
      setSelectedCell(cells.IDENTITIES);
    } else {
      setSelectedCell(cells.TYPE);
    }
  };

  const handleNextCellSelect = () => {
    if (selectedCell === cells.TYPE) {
      setSelectedCell(cells.IDENTITIES);
    } else if (selectedCell === cells.IDENTITIES) {
      setSelectedCell(cells.CREATED);
    } else {
      setSelectedCell(cells.TYPE);
    }
  };

  const handleConnectorCreation = async (activeIntegration: Feed, data: Data, connector: boolean) => {
    const res = await createDataFromFeed(activeIntegration, data, connector);
    if (!res) {
      setAddConnectorOpen(false);
    }
  };

  return (
    <SC.Wrapper>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={addConnectorOpen}
        onClose={() => setAddConnectorOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
      >
        <FeedPicker
          onSubmit={(activeIntegration: Feed, data: Data) => handleConnectorCreation(activeIntegration, data, true)}
          open={addConnectorOpen}
          onClose={() => setAddConnectorOpen(false)}
        />
      </Modal>
      <SC.ButtonContainer>
        <SC.ButtonMargin>
          <Button
            onClick={() => setAddConnectorOpen(true)}
            startIcon={<AddIcon />}
            variant="outlined"
            color="primary"
            size="large"
          >
            New Connector
          </Button>
        </SC.ButtonMargin>
      </SC.ButtonContainer>
      <SC.DeleteWrapper active={selected.length > 0}>
        {selected.length > 0 && (
          <>
            {selected.length} selected
            <SC.DeleteIconWrapper>
              <Tooltip title="Delete">
                <IconButton onClick={handleRowDelete}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </SC.DeleteIconWrapper>
          </>
        )}
      </SC.DeleteWrapper>
      <SC.Table>
        <Table size="small" aria-label="Overview Table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={rows.length > 0 && selected.length === rows.length}
                  onChange={handleSelectAllCheck}
                  inputProps={{ 'aria-label': 'select all connectors' }}
                />
              </TableCell>
              <TableCell>
                <SC.Flex>
                  <SC.ArrowUp />
                  Name
                </SC.Flex>
              </TableCell>
              <TableCell align="left">Type</TableCell>
              <TableCell align="left">Identities</TableCell>
              <TableCell align="left">Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row
                key={row.id}
                row={row}
                handleCheck={handleCheck}
                handleRowClick={handleRowClick}
                isSelected={isSelected}
              />
            ))}
          </TableBody>
        </Table>
      </SC.Table>
      <SC.TableMobile>
        <Table size="small" aria-label="Overview Table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={rows.length > 0 && selected.length === rows.length}
                  onChange={handleSelectAllCheck}
                  inputProps={{ 'aria-label': 'select all connectors' }}
                />
              </TableCell>
              <TableCell>
                <SC.Flex>
                  <SC.ArrowUp />
                  Name
                </SC.Flex>
              </TableCell>
              <TableCell align="left">
                <SC.TableCellMobile>
                  <p>{selectedCell}</p>
                  <SC.LeftArrow
                    onClick={handlePreviousCellSelect}
                    src={arrowLeft}
                    alt="previous-cell"
                    height="16"
                    width="16"
                  />
                  <SC.RightArrow
                    onClick={handleNextCellSelect}
                    src={arrowRight}
                    alt="next-cell"
                    height="16"
                    width="16"
                  />
                </SC.TableCellMobile>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row
                key={row.id}
                row={row}
                handleCheck={handleCheck}
                handleRowClick={handleRowClick}
                isSelected={isSelected}
                mobile={true}
                selectedCell={selectedCell}
              />
            ))}
          </TableBody>
        </Table>
      </SC.TableMobile>
    </SC.Wrapper>
  );
};

export default Overview;
