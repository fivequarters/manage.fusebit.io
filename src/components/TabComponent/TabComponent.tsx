import React from 'react';
import * as SC from './styles';
import { Container, Tabs, Tab } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Props } from '../../interfaces/TabComponent';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

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
      {value === index && children}
    </div>
  );
};

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
};

const TabComponent: React.FC<Props> = ({ tabNames, tabObjects }) => {
  const history = useHistory();
  const [activeTab, setActiveTab] = React.useState(0);

  useEffect(() => {
    tabObjects.forEach((obj, index) => {
      if (typeof obj !== 'string') {
        setActiveTab(index);
      }
    });
  }, [tabObjects]);

  const handleChange = (event: any, newValue: number) => {
    if (newValue !== activeTab) {
      history.push(tabObjects[newValue]);
      // window.location.href = tabObjects[newValue];
    }
  };

  return (
    <>
      <SC.ContentMobile>
        <SC.Fade />
        <Tabs
          indicatorColor="primary"
          value={activeTab}
          onChange={handleChange}
          aria-label="Tab Selector"
          scrollButtons="auto"
        >
          {tabNames.map((name, index) => (
            <Tab
              key={index}
              label={<SC.TabLabel active={activeTab === index}>{name}</SC.TabLabel>}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </SC.ContentMobile>
      <Container maxWidth="lg">
        <SC.Content>
          <Tabs
            indicatorColor="primary"
            value={activeTab}
            onChange={handleChange}
            aria-label="Tab Selector"
            scrollButtons="auto"
          >
            {tabNames.map((name, index) => (
              <Tab
                key={index}
                label={<SC.TabLabel active={activeTab === index}>{name}</SC.TabLabel>}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
        </SC.Content>
        {tabObjects.map((obj, index) => (
          <TabPanel key={index} value={activeTab} index={index}>
            {obj}
          </TabPanel>
        ))}
      </Container>
    </>
  );
};

export default TabComponent;