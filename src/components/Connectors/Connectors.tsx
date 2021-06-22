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

const Connectors: React.FC = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
      };
      
    return (
        <Container maxWidth="lg" >
            <SC.Content>
                <Tabs indicatorColor="primary" value={value} onChange={handleChange} aria-label="simple tabs example">
                    <Tab label="Overview" {...a11yProps(0)}/>
                    <Tab label="Health" {...a11yProps(1)}/>
                    <Tab label="Analytics" {...a11yProps(2)}/>
                </Tabs>
                <TabPanel value={value} index={0}>
                    Overview
                </TabPanel>
                <TabPanel value={value} index={1}>
                    Health
                </TabPanel>
                <TabPanel value={value} index={2}>
                    Analytics
                </TabPanel>
            </SC.Content>
        </Container>
    )
}

export default Connectors;