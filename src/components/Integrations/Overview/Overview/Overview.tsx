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
import { useContext } from '../../../../hooks/useContext';
import { useLoader } from '../../../../hooks/useLoader';
import { useAccountIntegrationsGetAll } from '../../../../hooks/api/v2/account/integration/useGetAll';
import { useAccountIntegrationDeleteIntegration } from '../../../../hooks/api/v2/account/integration/useDeleteOne';
import { Integration } from '../../../../interfaces/integration';
import { Operation } from '../../../../interfaces/operation';
import { useError } from '../../../../hooks/useError';
import arrowRight from '../../../../assets/arrow-right.svg';
import arrowLeft from '../../../../assets/arrow-left.svg';
import { Feed } from '../../../../interfaces/feed';
import { useQuery } from '../../../../hooks/useQuery';
import FeedPicker from '../../../FeedPicker';
import { integrationsFeed } from '../../../../static/feed';
import { cells, OverviewProps } from '../../../../interfaces/integrations';
import { Data } from '../../../../interfaces/feedPicker';
import { useCreateDataFromFeed } from '../../../../hooks/useCreateDataFromFeed';
import Row from './Row';
import { useHistory } from 'react-router-dom';

const Overview: React.FC<OverviewProps> = ({ headless, setHeadless }) => {
  const history = useHistory();
  const [selected, setSelected] = React.useState<string[]>([]);
  const [rows, setRows] = React.useState<Integration[]>([]);
  const { userData } = useContext();
  const { data: integrations, refetch: reloadIntegrations } = useAccountIntegrationsGetAll<{ items: Integration[] }>({
    enabled: userData.token,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const deleteIntegration = useAccountIntegrationDeleteIntegration<Operation>();
  const { waitForOperations, createLoader, removeLoader } = useLoader();
  const { createError } = useError();
  const [selectedCell, setSelectedCell] = React.useState<cells>(cells.INSTALLS);
  const [addIntegrationOpen, setAddIntegrationOpen] = React.useState(false);
  const query = useQuery();
  const { createDataFromFeed } = useCreateDataFromFeed();

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
        integrationsFeed().then((feed) => {
          for (let i = 0; i < feed.length; i++) {
            if (feed[i].id === key) {
              keyDoesntMatch = false;
              const dummyData = {
                dummyIntegration: 'randomIntegration',
                dummyConnector: 'randomConnector',
              };
              localStorage.setItem('showSettingUp', 'true');
              createDataFromFeed(feed[i], dummyData);
            }
          }
          setAddIntegrationOpen(keyDoesntMatch);
        });
      } else {
        const items = integrations.data.items;
        setRows(items);
      }
    }
  }, [integrations, query, createDataFromFeed, headless, setHeadless]);

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
      history.push(href);
      // window.location.href = href;
    }
  };

  const handlePreviousCellSelect = () => {
    if (selectedCell === cells.INSTALLS) {
      // setSelectedCell(cells.DEPLOYED);
    } else if (selectedCell === cells.CREATED) {
      setSelectedCell(cells.INSTALLS); //uncommented to not leave the variable unused
    } else {
      // setSelectedCell(cells.CREATED);
    }
  };

  const handleNextCellSelect = () => {
    if (selectedCell === cells.INSTALLS) {
      // setSelectedCell(cells.CREATED);
    } else if (selectedCell === cells.CREATED) {
      // setSelectedCell(cells.DEPLOYED);
    } else {
      // setSelectedCell(cells.INSTALLS);
    }
  };

  const handleIntegrationCreation = async (activeIntegration: Feed, data: Data) => {
    const res = await createDataFromFeed(activeIntegration, data);
    if (!res) {
      setAddIntegrationOpen(false);
    }
  };

  return (
    <SC.Wrapper>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={addIntegrationOpen}
        onClose={() => setAddIntegrationOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
      >
        <FeedPicker
          isIntegration={true}
          onSubmit={(activeIntegration: Feed, data: Data) => handleIntegrationCreation(activeIntegration, data)}
          open={addIntegrationOpen}
          onClose={() => setAddIntegrationOpen(false)}
        />
      </Modal>
      <SC.ButtonContainer>
        <SC.ButtonMargin>
          <Button
            onClick={() => setAddIntegrationOpen(true)}
            startIcon={<AddIcon />}
            variant="outlined"
            color="primary"
            size="large"
          >
            New Integration
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
                  inputProps={{ 'aria-label': 'select all integrations' }}
                />
              </TableCell>
              <TableCell>
                <SC.Flex>
                  <SC.ArrowUp />
                  Name
                </SC.Flex>
              </TableCell>
              <TableCell align="left">Installs</TableCell>
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
                  inputProps={{ 'aria-label': 'select all integrations' }}
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
