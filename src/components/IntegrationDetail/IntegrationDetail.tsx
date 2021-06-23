import React from "react";
import * as SC from "./styles";
import PropTypes from 'prop-types';
import { Container, Tabs, Tab } from "@material-ui/core";


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


const IntegrationDetail: React.FC = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
      };
      
    return (
        <Container maxWidth="lg" >
            <SC.Content>
                <Tabs indicatorColor="primary" value={value} onChange={handleChange} aria-label="Tab Selector">
                    <Tab label={<SC.TabLabel active={value === 0}>Develop</SC.TabLabel>} {...a11yProps(0)}/>
                    <Tab label={<SC.TabLabel active={value === 1}>Installs</SC.TabLabel>} {...a11yProps(1)}/>
                    <Tab label={<SC.TabLabel active={value === 2}>Configuration</SC.TabLabel>} {...a11yProps(2)}/>
                    <Tab label={<SC.TabLabel active={value === 3}>Health</SC.TabLabel>} {...a11yProps(3)}/>
                    <Tab label={<SC.TabLabel active={value === 4}>Analytics</SC.TabLabel>} {...a11yProps(4)}/>
                    <Tab label={<SC.TabLabel active={value === 5}>Deployments</SC.TabLabel>} {...a11yProps(5)}/>
                </Tabs>
            </SC.Content>
            <TabPanel value={value} index={0}>
                Overview
            </TabPanel>
            <TabPanel value={value} index={1}>
                Installs
            </TabPanel>
            <TabPanel value={value} index={2}>
                Configuration
            </TabPanel>
            <TabPanel value={value} index={3}>
                Health
            </TabPanel>
            <TabPanel value={value} index={4}>
                Analytics
            </TabPanel>
            <TabPanel value={value} index={5}>
                Deployments
            </TabPanel>
        </Container>
    )
}

export default IntegrationDetail;