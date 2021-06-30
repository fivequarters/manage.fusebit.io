import React from "react";
import * as SC from "./styles";
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Checkbox, IconButton, Tooltip } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { useContext } from "../../../hooks/useContext";
import { useLoader } from "../../../hooks/useLoader";
import { useAccountConnectorsGetAll} from "../../../hooks/api/v2/account/connector/useGetAll";
import { useAccountConnectorCreateConnector } from "../../../hooks/api/v2/account/connector/useCreateOne";
import { useAccountConnectorDeleteConnector } from "../../../hooks/api/v2/account/connector/useDeleteOne";
import { Operation } from "../../../interfaces/operation";
import {Connector} from "../../../interfaces/connector";

const Overview: React.FC = () => {
    const [selected, setSelected] = React.useState<string[]>([]);
    const [rows, setRows] = React.useState<Connector[]>([]);
    const { userData } = useContext();
    const { data: connectors, refetch: reloadConnectors } = useAccountConnectorsGetAll<{items: Connector[]}>({ enabled: userData.token, accountId: userData.accountId, subscriptionId: userData.subscriptionId });
    const createConnector = useAccountConnectorCreateConnector<Operation>();
    const deleteConnector = useAccountConnectorDeleteConnector<Operation>();
    const { waitForOperations, createLoader, removeLoader } = useLoader();

    React.useEffect(() => {
        if (connectors) {
            const items = connectors.data.items;
            setRows(items);
        }
    }, [connectors]);

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
          newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
          );
        }
    
        setSelected(newSelected);
      };


    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    const handleRowDelete = async () => {
        createLoader();
        let operationIds: string[] = [];
        for (let i = 0; i < selected.length; i++) {
            const response = await deleteConnector.mutateAsync({ id: selected[i], accountId: userData.accountId, subscriptionId: userData.subscriptionId });    
            operationIds.push(response.data.operationId);
        }
        await waitForOperations(operationIds);
        reloadConnectors();
        setSelected([]);
        removeLoader();
    }

    const handleRowClick = (event: any, href: string) => {
        if (!event.target.id) {
            window.location.href = href;
        }
    }

    const _createConnector = async () => {
        createLoader();
        const response = await createConnector.mutateAsync({ id: String(new Date().getTime()), accountId: userData.accountId, subscriptionId: userData.subscriptionId });
        await waitForOperations([response.data.operationId]);
        reloadConnectors();
        removeLoader();
    }

    return (
        <>
            <SC.ButtonContainer>
                <SC.ButtonMargin>
                    <Button onClick={_createConnector} startIcon={<AddIcon />} variant="outlined" color="primary" size="large">New Connector</Button>
                </SC.ButtonMargin>
            </SC.ButtonContainer>
            <SC.DeleteWrapper active={selected.length > 0}>
                {
                    selected.length > 0 && (
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
                    )
                }
            </SC.DeleteWrapper>
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
                        <TableCell align="left">ID</TableCell>
                        <TableCell align="left">Type</TableCell>
                        <TableCell align="left">Identities</TableCell>
                        <TableCell align="left">Created</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <SC.Row key={row.id} onClick={(e) => handleRowClick(e, "/connector/" + row.id)}>
                            <TableCell style={{cursor: "default"}} padding="checkbox" id={`enhanced-table-cell-checkbox-${row.id}`}>
                                <Checkbox
                                color="primary"
                                onClick={(event) => handleCheck(event, row.id)}
                                checked={isSelected(row.id)}
                                inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${row.id}` }}
                                id={`enhanced-table-checkbox-${row.id}`}
                                />
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <SC.CellName>
                                    Slack 1
                                    {// TODO: Replace placeholder with real data
                                    } 
                                </SC.CellName>
                            </TableCell>
                            <TableCell align="left">{row.id}</TableCell>
                            <TableCell align="left">    
                                Slack
                                {// TODO: Replace placeholder with real data
                                } 
                            </TableCell>
                            <TableCell align="left">
                                5
                                {// TODO: Replace placeholder with real data
                                }
                            </TableCell>
                            <TableCell align="left">
                                {new Date().toISOString().slice(0, 10)}
                                {// TODO: Replace placeholder with real data
                                } 
                            </TableCell>
                        </SC.Row>
                    ))}
                </TableBody>
            </Table>
            </>
    )
}

export default Overview;