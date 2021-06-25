import React from "react";
import * as SC from "./styles";
import { Button } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import arrow from "../../../assets/arrow-right-black.svg";
import slack from "../../../assets/slack.svg";
import cross from "../../../assets/cross.svg";

const connectorsList =  [ 
    {
        icon: slack,
        alt: "Slack",
        name: "Slack 1 Connector"
    },
    {
        icon: slack,
        alt: "Slack",
        name: "Slack 2 Connector"
    },
    {
        icon: slack,
        alt: "Slack",
        name: "Slack 3 Connector"
    }
]

const Develop: React.FC = () => {
    const [connectors, setConnectors] = React.useState(connectorsList);

    const handleConnectorDelete = (name: string) => {
        setConnectors(connectors.filter(connector => connector.name !== name))
    }

    const handleCardConnectorClick = (e: any) => {
        if (!e.target.id) {
            window.location.href = "/connector-detail";
        }
    }
    
    return (
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
                        <SC.CardConnectorWrapper>
                            {
                                connectors.map((connector, index) => {
                                    if (index < 5) {
                                        return (
                                            <SC.CardConnector onClick={(e) => handleCardConnectorClick(e)}>
                                                <SC.CardConnectorImage src={connector.icon} alt={connector.alt} height="20" width="20" />
                                                <SC.CardConnectorText>{connector.name}</SC.CardConnectorText>
                                                <SC.CardConnectorCross id="close" src={cross} alt="close" height="8" width="8" onClick={() => handleConnectorDelete(connector.name)} />
                                            </SC.CardConnector>
                                        )
                                    }
                                    return null;
                                })
                            }
                        </SC.CardConnectorWrapper>
                        {
                            connectors.length >= 5 && (
                                <SC.CardConnectorSeeMore href="/connectors"> 
                                    See all
                                    <img src={arrow} alt="see more" height="10" width="10" />
                                </SC.CardConnectorSeeMore>
                            )
                        }
                        
                        <SC.CardConnectorButtonsWrapper>
                            <Button startIcon={<AddIcon />} style={{width: "160px", marginTop: "24px"}} size="large" variant="outlined" color="primary" >Add New</Button>
                            <Button startIcon={<AddIcon />} style={{width: "160px", marginTop: "24px"}} size="large" variant="outlined" color="primary" >Link Existing</Button>
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
    )
}

export default Develop;