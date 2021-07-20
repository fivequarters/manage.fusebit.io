import React from "react";
import * as SC from "./styles";
import { Container, Tabs, Tab } from "@material-ui/core";
import PropTypes from 'prop-types';
import {Props} from "../../interfaces/TabComponent";

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

const TabComponent: React.FC<Props> = ({tabNames, tabObjects}) => {
    const [value, setValue] = React.useState(0);
    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
      };

    return (
        <>
        <SC.ContentMobile>
            <SC.Fade />
                <Tabs indicatorColor="primary" value={value} onChange={handleChange} aria-label="Tab Selector" scrollButtons="auto">
                    {
                        tabNames.map((name, index) => (
                            <Tab key={index} label={<SC.TabLabel active={value === index}>{name}</SC.TabLabel>} {...a11yProps(index)}/>
                        ))
                    }
                </Tabs>
        </SC.ContentMobile>
        <Container maxWidth="lg">
            <SC.Content>
                <Tabs indicatorColor="primary" value={value} onChange={handleChange} aria-label="Tab Selector" scrollButtons="auto">
                    {
                        tabNames.map((name, index) => (
                            <Tab key={index} label={<SC.TabLabel active={value === index}>{name}</SC.TabLabel>} {...a11yProps(index)}/>
                        ))
                    }
                </Tabs>
            </SC.Content>
            {
                tabObjects.map((obj, index) => (
                    <TabPanel key={index} value={value} index={index}>
                        {obj}
                    </TabPanel>
                ))
            }
        </Container>
        </>
    )
}

export default TabComponent;