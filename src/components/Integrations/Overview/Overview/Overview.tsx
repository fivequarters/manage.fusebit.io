import React from 'react';
import * as SC from './styles';
import * as CSC from '../../../globalStyle';
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
import { useAccountIntegrationsGetAll } from '../../../../hooks/api/v2/account/integration/useGetAll';
import { Integration } from '../../../../interfaces/integration';
import arrowRight from '../../../../assets/arrow-right.svg';
import arrowLeft from '../../../../assets/arrow-left.svg';
import { Feed } from '../../../../interfaces/feed';
import FeedPicker from '../../../FeedPicker';
import { cells, OverviewProps } from '../../../../interfaces/integrations';
import { Data } from '../../../../interfaces/feedPicker';
import Row from './Row';
import { useTableLogic } from '../../../../hooks/useTableLogic';

const Overview: React.FC<OverviewProps> = ({ headless, setHeadless }) => {
  const { userData } = useContext();
  const { data: integrations, refetch: reloadIntegrations } = useAccountIntegrationsGetAll<{ items: Integration[] }>({
    enabled: userData.token,
    accountId: userData.accountId,
    subscriptionId: userData.subscriptionId,
  });
  const [selectedCell, setSelectedCell] = React.useState<cells>(cells.INSTALLS);
  const {
    handleSelectAllCheck,
    handleCheck,
    isSelected,
    handleRowDelete,
    handleRowClick,
    handleIntegrationCreation,
    loading,
    addIntegrationOpen,
    setAddIntegrationOpen,
    rows,
    selected,
  } = useTableLogic({ headless, setHeadless, reloadIntegrations, integrations });

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
      {!loading && (
        <>
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
        </>
      )}
      {loading && (
        <CSC.LoaderContainer>
          <CSC.Spinner />
        </CSC.LoaderContainer>
      )}
    </SC.Wrapper>
  );
};

export default Overview;
