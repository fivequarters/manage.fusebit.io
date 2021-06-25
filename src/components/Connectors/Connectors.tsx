import React from "react";
import * as SC from "./styles";
import PropTypes from 'prop-types';
import { Container, Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow, Button, Checkbox, IconButton, Tooltip } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

const TabPanel = (props: any) => {
    const { children, value, index, ...other } = props;
    
    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
        {value === index && (
            children
        )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const createOverviewData = (href: string, name: string, id: string, type: string, identities: number, created: string) => {
    return { href, name, id, type, identities, created };
  }
  
  const overviewRows = [
    createOverviewData("/integration-detail", "Slack 1", "Conn - 123579", "Slack", 4, new Date().toISOString().slice(0, 10)),
    createOverviewData("/integration-detail", "Jira 1", "Conn - 23789", "Jira", 23, new Date().toISOString().slice(0, 10)),
  ];

const Connectors: React.FC = () => {
    const [value, setValue] = React.useState(0);
    const [selected, setSelected] = React.useState<string[]>([]);
    const [rows, setRows] = React.useState(overviewRows);

    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
      };

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
       setRows(rows.filter((row, index) => row.id !== selected[index]));
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
        <Container maxWidth="lg" >
            <SC.Content>
                <Tabs indicatorColor="primary" value={value} onChange={handleChange} aria-label="Tab Selector">
                    <Tab label={<SC.TabLabel active={value === 0}>Overview</SC.TabLabel>} {...a11yProps(0)}/>
                    <Tab label={<SC.TabLabel active={value === 1}>Health</SC.TabLabel>} {...a11yProps(1)}/>
                    <Tab label={<SC.TabLabel active={value === 2}>Analytics</SC.TabLabel>} {...a11yProps(2)}/>
                </Tabs>
            </SC.Content>
                <TabPanel value={value} index={0}>
                    <SC.ButtonContainer>
                        <SC.ButtonMargin>
                            <Button startIcon={<AddIcon />} variant="outlined" color="primary" size="large">New Connector</Button>
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
                                    <TableCell align="left">{row.type}</TableCell>
                                    <TableCell align="left">{row.identities}</TableCell>
                                    <TableCell align="left">{row.created}</TableCell>
                                </SC.Row>
                            ))}
                        </TableBody>
                    </Table>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    Health
                </TabPanel>
                <TabPanel value={value} index={2}>
                    Analytics
                </TabPanel>
        </Container>
    )
}

export default Connectors;