import React, { useEffect } from 'react';
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
import { useContext } from '../../../hooks/useContext';
import { useLoader } from '../../../hooks/useLoader';
import { useAccountIntegrationsGetAll } from '../../../hooks/api/v2/account/integration/useGetAll';
import { useAccountIntegrationCreateIntegration } from '../../../hooks/api/v2/account/integration/useCreateOne';
import { useAccountIntegrationDeleteIntegration } from '../../../hooks/api/v2/account/integration/useDeleteOne';
import { useAccountConnectorCreateConnector } from '../../../hooks/api/v2/account/connector/useCreateOne';
import { Integration } from '../../../interfaces/integration';
import { Operation } from '../../../interfaces/operation';
import { useError } from '../../../hooks/useError';
import arrowRight from '../../../assets/arrow-right.svg';
import arrowLeft from '../../../assets/arrow-left.svg';
import { Entity, Feed } from '../../../interfaces/feed';
import { useQuery } from '../../../hooks/useQuery';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import FeedPicker from '../../FeedPicker';
import { integrationsFeed } from '../../../static/feed';
import { OverviewProps } from '../../../interfaces/integrations';
import { Data } from '../../../interfaces/feedPicker';
import { useReplaceMustache } from '../../../hooks/useReplaceMustache';

enum cells {
  INSTANCES = 'Instances',
  CREATED = 'Created',
  DEPLOYED = 'Deployed',
}

const Overview: React.FC<OverviewProps> = ({ headless, setHeadless }) => {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [rows, setRows] = React.useState<Integration[]>([]);
  const { userData } = useContext();
  const { data: integrations, refetch: reloadIntegrations } = useAccountIntegrationsGetAll<{ items: Integration[] }>({
    enabled: userData.token,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const createIntegration = useAccountIntegrationCreateIntegration<Operation>();
  const deleteIntegration = useAccountIntegrationDeleteIntegration<Operation>();
  const createConnector = useAccountConnectorCreateConnector<Operation>();
  const { waitForOperations, createLoader, removeLoader } = useLoader();
  const { createError } = useError();
  const [selectedCell, setSelectedCell] = React.useState<cells>(cells.INSTANCES);
  const [addIntegrationOpen, setAddIntegrationOpen] = React.useState(false);
  const query = useQuery();
  const { getRedirectLink } = useGetRedirectLink();
  const { replaceMustache } = useReplaceMustache();

  const _createIntegration = React.useCallback(
    async (activeFeed: Feed, data: Data) => {
      try {
        createLoader();
        let currentIntegrationData: Entity | undefined;
        let connectors: Entity[] = [];
        const parsedFeed = await replaceMustache(data, activeFeed);
        for (let i = 0; i < parsedFeed.configuration.entities.length; i++) {
          const entity: Entity = parsedFeed.configuration.entities[i];
          if (entity.entityType === 'connector') {
            connectors.push(entity);
          } else {
            currentIntegrationData = entity;
          }
        }
        const response = await createIntegration.mutateAsync({
          ...currentIntegrationData?.data,
          accountId: userData.accountId,
          subscriptionId: userData.subscriptionId,
        });
        await waitForOperations([response.data.operationId]);
        for (let i = 0; i < connectors.length; i++) {
          const response = await createConnector.mutateAsync({
            data: connectors[i].data,
            id: connectors[i].id,
            tags: connectors[i].tags,
            accountId: userData.accountId,
            subscriptionId: userData.subscriptionId,
          });
          await waitForOperations([response.data.operationId]);
        }
        window.location.href = getRedirectLink('/integration/' + currentIntegrationData?.id);
      } catch (e) {
        createError(e.message);
      }
    },
    [
      createConnector,
      createError,
      createIntegration,
      createLoader,
      userData,
      waitForOperations,
      replaceMustache,
      getRedirectLink,
    ]
  );

  useEffect(() => {
    if (integrations && integrations.data.items) {
      if (integrations.data.items.length > 0) {
        const items = integrations.data.items;
        setRows(items);
        if (headless.current) {
          setHeadless(false); // so we only do this once.
          const key = query.get('key');
          if (key !== null && key !== undefined) {
            setAddIntegrationOpen(true);
          }
        }
      } else if (headless.current) {
        setHeadless(false); // so we only do this once.
        const items = integrations.data.items;
        setRows(items); // otherwise if we delete and the integration.data.items has 0 items the rows will display 1
        const key = query.get('key');
        let keyDoesntMatch = true;
        integrationsFeed().then(feed => {
          for (let i = 0; i < feed.length; i++) {
            if (feed[i].id === key) {
              keyDoesntMatch = false;
              const dummyData = {
                dummyIntegration: 'randomIntegration',
                dummyConnector: 'randomConnector',
              };
              _createIntegration(feed[i], dummyData);
            }
          }
        });
        setAddIntegrationOpen(keyDoesntMatch);
      } else {
        const items = integrations.data.items;
        setRows(items);
      }
    }
  }, [integrations, query, _createIntegration, headless, setHeadless]);

  const handleSelectAllCheck = (event: any) => {
    if (event.target.checked) {
      const newSelecteds = rows.map(row => row.id);
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
        const response = await deleteIntegration.mutateAsync({
          id: selected[i],
          accountId: userData.accountId,
          subscriptionId: userData.subscriptionId,
        });
        operationIds.push(response.data.operationId);
      }
      await waitForOperations(operationIds);
      reloadIntegrations();
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
    //     createError("You don't have sufficient permissions to edit integration {integration}.  Please contact an account administrator.");
    // }
    if (!event.target.id) {
      window.location.href = href;
    }
  };

  const handlePreviousCellSelect = () => {
    if (selectedCell === cells.INSTANCES) {
      setSelectedCell(cells.DEPLOYED);
    } else if (selectedCell === cells.CREATED) {
      setSelectedCell(cells.INSTANCES);
    } else {
      setSelectedCell(cells.CREATED);
    }
  };

  const handleNextCellSelect = () => {
    if (selectedCell === cells.INSTANCES) {
      setSelectedCell(cells.CREATED);
    } else if (selectedCell === cells.CREATED) {
      setSelectedCell(cells.DEPLOYED);
    } else {
      setSelectedCell(cells.INSTANCES);
    }
  };

  return (
    <SC.Wrapper>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={addIntegrationOpen}
        onClose={() => setAddIntegrationOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}>
        <FeedPicker
          isIntegration={true}
          onSubmit={(activeIntegration: Feed, data: Data) => _createIntegration(activeIntegration, data)}
          open={addIntegrationOpen}
          onClose={() => setAddIntegrationOpen(false)}
        />
      </Modal>
      <SC.ButtonContainer>
        <SC.ButtonMargin>
          <Button
            onClick={() => setAddIntegrationOpen(true)}
            startIcon={<AddIcon />}
            variant='outlined'
            color='primary'
            size='large'>
            New Integration
          </Button>
        </SC.ButtonMargin>
      </SC.ButtonContainer>

      <SC.DeleteWrapper active={selected.length > 0}>
        {selected.length > 0 && (
          <>
            {selected.length} selected
            <SC.DeleteIconWrapper>
              <Tooltip title='Delete'>
                <IconButton onClick={handleRowDelete}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </SC.DeleteIconWrapper>
          </>
        )}
      </SC.DeleteWrapper>
      <SC.Table>
        <Table size='small' aria-label='Overview Table'>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox'>
                <Checkbox
                  color='primary'
                  checked={rows.length > 0 && selected.length === rows.length}
                  onChange={handleSelectAllCheck}
                  inputProps={{ 'aria-label': 'select all integrations' }}
                />
              </TableCell>
              <TableCell>
                <SC.Flex>
                  <SC.ArrowUp />
                  Name
                </SC.Flex>
              </TableCell>
              <TableCell align='left'>Instances</TableCell>
              <TableCell align='left'>Created</TableCell>
              <TableCell align='left'>Deployed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <SC.Row key={row.id} onClick={e => handleRowClick(e, getRedirectLink('/integration/' + row.id))}>
                <TableCell
                  style={{ cursor: 'default' }}
                  padding='checkbox'
                  id={`enhanced-table-cell-checkbox-${row.id}`}>
                  <Checkbox
                    color='primary'
                    onClick={event => handleCheck(event, row.id)}
                    checked={isSelected(row.id)}
                    inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${row.id}` }}
                    id={`enhanced-table-checkbox-${row.id}`}
                  />
                </TableCell>
                <TableCell component='th' scope='row'>
                  <SC.CellName>{row.id}</SC.CellName>
                </TableCell>
                <TableCell align='left'>
                  10
                  {
                    // TODO: Replace placeholder with real data
                  }
                </TableCell>
                <TableCell align='left'>
                  {new Date().toISOString().slice(0, 10)}
                  {
                    // TODO: Replace placeholder with real data
                  }
                </TableCell>
                <TableCell align='left'>
                  {new Date().toISOString().slice(0, 10)}
                  {
                    // TODO: Replace placeholder with real data
                  }
                </TableCell>
              </SC.Row>
            ))}
          </TableBody>
        </Table>
      </SC.Table>
      <SC.TableMobile>
        <Table size='small' aria-label='Overview Table'>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox'>
                <Checkbox
                  color='primary'
                  checked={rows.length > 0 && selected.length === rows.length}
                  onChange={handleSelectAllCheck}
                  inputProps={{ 'aria-label': 'select all integrations' }}
                />
              </TableCell>
              <TableCell>
                <SC.Flex>
                  <SC.ArrowUp />
                  Name
                </SC.Flex>
              </TableCell>
              <TableCell align='left'>
                <SC.TableCellMobile>
                  <p>{selectedCell}</p>
                  <SC.LeftArrow
                    onClick={handlePreviousCellSelect}
                    src={arrowLeft}
                    alt='previous-cell'
                    height='16'
                    width='16'
                  />

                  <SC.RightArrow
                    onClick={handleNextCellSelect}
                    src={arrowRight}
                    alt='next-cell'
                    height='16'
                    width='16'
                  />
                </SC.TableCellMobile>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <SC.Row key={row.id} onClick={e => handleRowClick(e, getRedirectLink('/integration/' + row.id))}>
                <TableCell
                  style={{ cursor: 'default' }}
                  padding='checkbox'
                  id={`enhanced-table-cell-checkbox-${row.id}`}>
                  <Checkbox
                    color='primary'
                    onClick={event => handleCheck(event, row.id)}
                    checked={isSelected(row.id)}
                    inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${row.id}` }}
                    id={`enhanced-table-checkbox-${row.id}`}
                  />
                </TableCell>
                <TableCell component='th' scope='row'>
                  <SC.CellName>{row.id}</SC.CellName>
                </TableCell>
                <TableCell align='left'>
                  {selectedCell === cells.INSTANCES
                    ? 10
                    : selectedCell === cells.DEPLOYED
                    ? new Date().toISOString().slice(0, 10)
                    : new Date().toISOString().slice(0, 10)}
                  {
                    // TODO: Replace placeholder with real data
                  }
                </TableCell>
              </SC.Row>
            ))}
          </TableBody>
        </Table>
      </SC.TableMobile>
    </SC.Wrapper>
  );
};

export default Overview;
