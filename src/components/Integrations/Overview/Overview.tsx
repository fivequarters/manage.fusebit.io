import React, { useEffect } from "react";
import * as SC from "./styles";
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Checkbox, IconButton, Tooltip } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { useContext } from "../../../hooks/useContext";
import { useLoader } from "../../../hooks/useLoader";
import { useAccountIntegrationsGetAll } from "../../../hooks/api/v2/account/integration/useGetAll";
import { useAccountIntegrationCreateIntegration } from "../../../hooks/api/v2/account/integration/useCreateOne";
import { useAccountIntegrationDeleteIntegration } from "../../../hooks/api/v2/account/integration/useDeleteOne";
import { Integration } from "../../../interfaces/integration";
import { Operation } from "../../../interfaces/operation";

const Overview: React.FC = () => {
    const [selected, setSelected] = React.useState<string[]>([]);
    const [rows, setRows] = React.useState<Integration[]>([]);
    const { userData } = useContext();
    const { data: integrations, refetch: reloadIntegrations } = useAccountIntegrationsGetAll<{ items: Integration[] }>({ enabled: userData.token, accountId: userData.accountId, subscriptionId: userData.subscriptionId });
    const createIntegration = useAccountIntegrationCreateIntegration<Operation>();
    const deleteIntegration = useAccountIntegrationDeleteIntegration<Operation>();
    const { waitForOperations, createLoader, removeLoader } = useLoader();

    useEffect(() => {
        if (integrations) {
            const items = integrations.data.items;
            setRows(items);
        }
    }, [integrations]);

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
        try {
            createLoader();
            let operationIds: string[] = [];
            for (let i = 0; i < selected.length; i++) {
                const response = await deleteIntegration.mutateAsync({ id: selected[i], accountId: userData.accountId, subscriptionId: userData.subscriptionId });    
                operationIds.push(response.data.operationId);
            }
            await waitForOperations(operationIds);
            reloadIntegrations();
            setSelected([]);
        } catch (e) {
            console.log(e);
        } finally {
            removeLoader();
        }
    }

    const handleRowClick = (event: any, href: string) => {
        if (!event.target.id) {
            window.location.href = href;
        }
    }

    const _createIntegration = async () => {
        try {
            createLoader();
            const response = await createIntegration.mutateAsync({ id: String(new Date().getTime()), accountId: userData.accountId, subscriptionId: userData.subscriptionId });
            await waitForOperations([response.data.operationId]);
            reloadIntegrations();
        } catch (e) {
            console.log(e);
        } finally {
            removeLoader();
        }
    }

    return (
        <>
            <SC.ButtonContainer>
                <SC.ButtonMargin>
                    <Button onClick={_createIntegration} startIcon={<AddIcon />} variant="outlined" color="primary" size="large">New Integration</Button>
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
                                inputProps={{ 'aria-label': 'select all integrations' }}
                            />
                        </TableCell>
                        <TableCell>
                            <SC.Flex>
                                <SC.ArrowUp />
                                Name
                            </SC.Flex>
                        </TableCell>
                        <TableCell align="left">Instances</TableCell>
                        <TableCell align="left">Created</TableCell>
                        <TableCell align="left">Deployed</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <SC.Row key={row.id} onClick={(e) => handleRowClick(e, "/integration/" + row.id)}>
                            <TableCell style={{ cursor: "default" }} padding="checkbox" id={`enhanced-table-cell-checkbox-${row.id}`}>
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
                                    {row.id}
                                </SC.CellName>
                            </TableCell>
                            <TableCell align="left">
                                10
                                {// TODO: Replace placeholder with real data
                                }
                            </TableCell>
                            <TableCell align="left">
                                {new Date().toISOString().slice(0, 10)}
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