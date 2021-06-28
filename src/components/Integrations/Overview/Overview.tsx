import React from "react";
import * as SC from "./styles";
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Checkbox, IconButton, Tooltip } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

const createOverviewData = (href: string, name: string, id: string, instances: number, created: string, deployed: string) => {
    return { href, name, id, instances, created, deployed };
  }
  
  const overviewRows = [
    createOverviewData("/integration-detail", "Slack Bot 1", "Int - 357892", 55, new Date().toISOString().slice(0, 10), new Date().toISOString().slice(0, 10)),
    createOverviewData("/integration-detail", "Jira Issue Sync 1", "Int - 123549", 3, new Date().toISOString().slice(0, 10), new Date().toISOString().slice(0, 10)),
  ];

const Overview: React.FC = () => {
    const [selected, setSelected] = React.useState<string[]>([]);
    const [rows, setRows] = React.useState(overviewRows);

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

    const handleRowDelete = () => {
        const newArray = rows.filter((row) => {
            let found = false; 
            selected.forEach((id) => {
                if (id === row.id) {
                    found = true;
                }
            });
            return !found;
        });
        setRows(newArray);

        const fakeEvent = {
            target: {
                checked: false,
            }
        }
       
       handleSelectAllCheck(fakeEvent);
    }

    const handleRowClick = (event: any, href: string) => {
        if (!event.target.id) {
            window.location.href = href;
        }
    }

    return (
        <>
            <SC.ButtonContainer>
                <SC.ButtonMargin>
                    <Button startIcon={<AddIcon />} variant="outlined" color="primary" size="large">New Integration</Button>
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
                        <TableCell align="left">ID</TableCell>
                        <TableCell align="left">Instances</TableCell>
                        <TableCell align="left">Created</TableCell>
                        <TableCell align="left">Deployed</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <SC.Row key={row.id} onClick={(e) => handleRowClick(e, row.href)}>
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
                                    {row.name}
                                </SC.CellName>
                            </TableCell>
                            <TableCell align="left">{row.id}</TableCell>
                            <TableCell align="left">{row.instances}</TableCell>
                            <TableCell align="left">{row.created}</TableCell>
                            <TableCell align="left">{row.deployed}</TableCell>
                        </SC.Row>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}

export default Overview;