import React from "react";
import * as SC from "./styles";
import PropTypes from 'prop-types';
import { Container, Tabs, Tab, Button } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import arrow from "../../assets/arrow-right-black.svg";
import arrowDown from "../../assets/arrow-down-black.svg";
import slack from "../../assets/slack.svg";
import cross from "../../assets/cross.svg";

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
    const [connectorsExpanded, setConnectorsExpanded] = React.useState(false);

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
                <SC.Background>
                    <SC.Flex>
                        <SC.CardSeparator />
                        <SC.FlexDown>
                            <SC.Card>
                                <SC.CardTitle>Your Application</SC.CardTitle>
                                <SC.CardButtonWrapper>
                                    <Button startIcon={<AddIcon />} style={{width: "200px"}} size="large" variant="outlined" color="primary" >Connect</Button>
                                </SC.CardButtonWrapper>
                            </SC.Card>
                            <SC.Link href="/test">
                                <SC.Bullet />
                                Provision integration from your application
                            </SC.Link>
                            <SC.Link href="/test2">
                                <SC.Bullet />
                                Invoke application from your backend
                            </SC.Link>
                        </SC.FlexDown>
                        <SC.FlexDown>
                            <SC.Card>
                                <SC.CardTitle>Fusebit</SC.CardTitle>
                                <SC.CardIntegration>
                                    <img src={arrow} alt="arrow" />
                                    Slack Bot 1
                                </SC.CardIntegration>
                                <SC.CardButtonWrapper>
                                    <Button style={{width: "200px"}} size="large" variant="contained" color="primary" >Connect</Button>
                                </SC.CardButtonWrapper>
                            </SC.Card>
                            <SC.Link href="/test3">
                                <SC.Bullet />
                                Edit and publish your integration
                            </SC.Link>
                            <SC.Link href="/test4">
                                <SC.Bullet />
                                Test your integration
                            </SC.Link>
                            <SC.Link href="/test5">
                                <SC.Bullet />
                                Debug with real-time logs
                            </SC.Link>
                            <SC.Link href="/test6">
                                <SC.Bullet />
                                Slack SDK reference
                            </SC.Link>
                        </SC.FlexDown>
                        <SC.FlexDown>
                            <SC.Card>
                                <SC.CardTitle>Connectors</SC.CardTitle>
                                <SC.CardConnectorWrapper expanded={connectorsExpanded}>
                                    <SC.CardConnector>
                                        <SC.CardConnectorImage src={slack} alt="slack" height="20" width="20" />
                                        <SC.CardConnectorText>Slack 1 Connector</SC.CardConnectorText>
                                        <SC.CardConnectorCross src={cross} alt="close" height="8" width="8" />
                                    </SC.CardConnector>
                                    <SC.CardConnector>
                                        <SC.CardConnectorImage src={slack} alt="slack" height="20" width="20" />
                                        <SC.CardConnectorText>Slack 2 Connector</SC.CardConnectorText>
                                        <SC.CardConnectorCross src={cross} alt="close" height="8" width="8" />
                                    </SC.CardConnector>
                                    <SC.CardConnector>
                                        <SC.CardConnectorImage src={slack} alt="slack" height="20" width="20" />
                                        <SC.CardConnectorText>Slack 3 Connector</SC.CardConnectorText>
                                        <SC.CardConnectorCross src={cross} alt="close" height="8" width="8" />
                                    </SC.CardConnector>
                                    <SC.CardConnector>
                                        <SC.CardConnectorImage src={slack} alt="slack" height="20" width="20" />
                                        <SC.CardConnectorText>Slack 4 Connector</SC.CardConnectorText>
                                        <SC.CardConnectorCross src={cross} alt="close" height="8" width="8" />
                                    </SC.CardConnector>
                                    <SC.CardConnector>
                                        <SC.CardConnectorImage src={slack} alt="slack" height="20" width="20" />
                                        <SC.CardConnectorText>Slack 5 Connector</SC.CardConnectorText>
                                        <SC.CardConnectorCross src={cross} alt="close" height="8" width="8" />
                                    </SC.CardConnector>
                                </SC.CardConnectorWrapper>
                                <SC.CardConnectorSeeMore expanded={connectorsExpanded} onClick={() => setConnectorsExpanded(!connectorsExpanded)}> 
                                {// Reminder: This should NOT display when there are 3 or less connectors.
                                }
                                    {connectorsExpanded ? "See Less" : "See More"}
                                    <img src={arrowDown} alt="see more" height="10" width="10" />
                                </SC.CardConnectorSeeMore>
                                <SC.CardConnectorButtonsWrapper>
                                    <Button startIcon={<AddIcon />} style={{width: "160px"}} size="large" variant="outlined" color="primary" >Add New</Button>
                                    <Button startIcon={<AddIcon />} style={{width: "160px"}} size="large" variant="outlined" color="primary" >Link Existing</Button>
                                </SC.CardConnectorButtonsWrapper>
                            </SC.Card>
                            <SC.Link href="/test7">
                                <SC.Bullet />
                                Improve your own backend API
                            </SC.Link>
                            <SC.Link href="/test8">
                                <SC.Bullet />
                                Switch to your own Slack App
                            </SC.Link>
                        </SC.FlexDown>
                    </SC.Flex>
                </SC.Background>
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