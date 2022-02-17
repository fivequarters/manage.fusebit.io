import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Container, Tabs, Tab } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Props } from '@interfaces/TabComponent';

const StyledContent = styled.div`
  border-radius: 8px;
  margin-top: -30px;
  background-color: white;
  padding: 0 76px;
  box-shadow: 0px 1px 30px -1px rgba(52, 72, 123, 0.1);
  margin-bottom: 72px;

  @media only screen and (max-width: 880px) {
    padding: 0;
    display: none;
  }
`;

const StyledContentMobile = styled.div`
  position: relative;
  display: none;
  border-radius: 8px;
  margin-top: -30px;
  background-color: white;
  padding: 0;
  box-shadow: 0px 1px 30px -1px rgba(52, 72, 123, 0.1);
  margin-bottom: 72px;

  @media only screen and (max-width: 880px) {
    display: block;
  }
`;

const StyledTabLabel = styled.div<{ active: boolean }>`
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  font-weight: ${(props) => props.active && 700};
  margin-bottom: 18px;
  margin-top: 30px;

  @media only screen and (max-width: 600px) {
    padding: 0px;
  }

  @media only screen and (max-width: 330px) {
    padding: 0;
  }
`;

const StyledFade = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 20px;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0), white 80%);
  border-radius: 8px 8px 0 0;
  z-index: 1;

  @media only screen and (max-width: 330px) {
    width: 10px;
  }
`;

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
      <StyledContentMobile>
        <StyledFade />
        <Tabs
          indicatorColor="primary"
          value={activeTab}
          onChange={handleChange}
          aria-label="Tab Selector"
          scrollButtons="auto"
          variant="scrollable"
          TabIndicatorProps={{
            style: { transition: 'none' },
          }}
        >
          {tabNames.map((name, index) => (
            <Tab
              key={name}
              label={<StyledTabLabel active={activeTab === index}>{name}</StyledTabLabel>}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </StyledContentMobile>
      <Container maxWidth="lg">
        <StyledContent>
          <Tabs
            indicatorColor="primary"
            value={activeTab}
            onChange={handleChange}
            aria-label="Tab Selector"
            scrollButtons="auto"
            TabIndicatorProps={{
              style: { transition: 'none' },
            }}
          >
            {tabNames.map((name, index) => (
              <Tab
                key={name}
                label={<StyledTabLabel active={activeTab === index}>{name}</StyledTabLabel>}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
        </StyledContent>
        {tabObjects.map((obj, index) => (
          <TabPanel key={obj} value={activeTab} index={index}>
            {obj}
          </TabPanel>
        ))}
      </Container>
    </>
  );
};

export default TabComponent;
