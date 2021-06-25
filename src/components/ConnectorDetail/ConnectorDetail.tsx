import React from "react";
import * as SC from "./styles";
import { Container, Tabs, Tab } from "@material-ui/core";
import PropTypes from 'prop-types';
import Configure from "./Configure";

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

const ConnectorDetail: React.FC = () => {
    const [value, setValue] = React.useState(0);
    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
      };

    return (
        <Container maxWidth="lg">
            <SC.Content>
                <Tabs indicatorColor="primary" value={value} onChange={handleChange} aria-label="Tab Selector">
                    <Tab label={<SC.TabLabel active={value === 0}>Configure</SC.TabLabel>} {...a11yProps(0)}/>
                    <Tab label={<SC.TabLabel active={value === 1}>Identities</SC.TabLabel>} {...a11yProps(1)}/>
                    <Tab label={<SC.TabLabel active={value === 2}>Analytics</SC.TabLabel>} {...a11yProps(2)}/>
                    <Tab label={<SC.TabLabel active={value === 3}>Deployments</SC.TabLabel>} {...a11yProps(3)}/>
                </Tabs>
            </SC.Content>
            <TabPanel value={value} index={0}>
                <Configure />
            </TabPanel>
            <TabPanel value={value} index={1}>
                Health
            </TabPanel>
            <TabPanel value={value} index={2}>
                Analytics
            </TabPanel>
            <TabPanel value={value} index={3}>
                Analytics
            </TabPanel>
        </Container>
    )
}

export default ConnectorDetail;