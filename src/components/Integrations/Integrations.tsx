import React from "react";
import * as SC from "./styles";
import PropTypes from 'prop-types';
import { Container, Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow, Button } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';


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

  const createOverviewData = (href: string, name: string, id: string, instances: number, created: string, deployed: string) => {
    return { href, name, id, instances, created, deployed };
  }
  
  const overviewRows = [
    createOverviewData("/integration-detail", "Slack Bot 1", "Int - 357892", 55, new Date().toISOString().slice(0, 10), new Date().toISOString().slice(0, 10)),
    createOverviewData("/integration-detail", "Jira Issue Sync 1", "Int - 123549", 3, new Date().toISOString().slice(0, 10), new Date().toISOString().slice(0, 10)),
  ];

const Integrations: React.FC = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
      };
      
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
                    <Table size="small" aria-label="Overview Table">
                        <TableHead>
                            <TableRow>
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
                            {overviewRows.map((row) => (
                                <SC.Row key={row.id} href={row.href}>
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
                    <SC.ButtonContainer>
                        <SC.ButtonMargin>
                            <Button startIcon={<AddIcon />} variant="outlined" color="primary" size="large">New Integration</Button>
                        </SC.ButtonMargin>
                    </SC.ButtonContainer>
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

export default Integrations;