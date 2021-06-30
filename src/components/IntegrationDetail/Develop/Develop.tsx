import React from "react";
import { useParams } from "react-router-dom";
import * as SC from "./styles";
import { Button, Modal, Backdrop, Fade } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { useAccountIntegrationsGetOne } from "../../../hooks/api/v2/account/integration/useGetOne";
import { useContext } from "../../../hooks/useContext";
import { Integration, InnerConnector } from "../../../interfaces/integration";
import arrow from "../../../assets/arrow-right-black.svg";
import slack from "../../../assets/slack.svg";
import cross from "../../../assets/cross.svg";
import Connect from "./Connect";

const Develop: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { userData } = useContext();
    const { data: integrationData } = useAccountIntegrationsGetOne<Integration>({ enabled: userData.token, id, accountId: userData.accountId, subscriptionId: userData.subscriptionId });

    const [connectOpen, setConnectOpen] = React.useState(false);

    const handleConnectOpen = () => {
        setConnectOpen(true);
    };

    const handleConnectClose = () => {
        setConnectOpen(false);
    };

    const handleConnectorDelete = (key: string) => {
        console.log(key);
    }

    const handleCardConnectorClick = (e: any) => {
        if (!e.target.id) {
            window.location.href = "/connector-detail";
        }
    }
    
    return (
        <SC.Background>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={connectOpen}
                onClose={handleConnectClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
            >
                <Fade in={connectOpen}>
                    <Connect open={connectOpen} onClose={handleConnectClose} />
                </Fade>
            </Modal>
            <SC.Flex>
                <SC.CardSeparator />
                <SC.FlexDown>
                    <SC.Card>
                        <SC.CardTitle>Your Application</SC.CardTitle>
                        <SC.CardButtonWrapper>
                            <Button onClick={handleConnectOpen} startIcon={<AddIcon />} style={{width: "200px"}} size="large" variant="outlined" color="primary" >Connect</Button>
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
                            {integrationData?.data.id}
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
                                Object.keys(integrationData?.data.data.configuration.connectors ?? {}).map((key: string, index) => {
                                    const connector = (integrationData?.data.data.configuration.connectors ?? {} as InnerConnector)[key];
                                    if (index < 5) {
                                        return (
                                            <SC.CardConnector key={index} onClick={(e) => handleCardConnectorClick(e)}>
                                                {// TODO: Replace placeholder with real data 
                                                } 
                                                <SC.CardConnectorImage src={slack} alt={key} height="20" width="20" />
                                                <SC.CardConnectorText>{connector.connector}</SC.CardConnectorText>
                                                <SC.CardConnectorCrossContainer id="closeWrapper" onClick={() => handleConnectorDelete(key)}>
                                                    <SC.CardConnectorCross id="close" src={cross} alt="close" height="8" width="8" />
                                                </SC.CardConnectorCrossContainer>
                                            </SC.CardConnector>
                                        )
                                    }
                                    return null;
                                })
                            }
                        </SC.CardConnectorWrapper>
                        {
                            Object.keys(integrationData?.data.data.configuration.connectors ?? {}).length >= 5 && (
                                <SC.CardConnectorSeeMore href="/"> 
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