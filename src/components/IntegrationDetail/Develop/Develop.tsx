import React from "react";
import { useHistory, useParams } from "react-router-dom";
import * as SC from "./styles";
import { Button, Modal, Backdrop, Fade } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import arrow from "../../../assets/arrow-right-black.svg";
import slack from "../../../assets/slack.svg";
import cross from "../../../assets/cross.svg";
import Connect from "./Connect";
import { useLoader } from "../../../hooks/useLoader";
import { useError } from "../../../hooks/useError";
import { useContext } from "../../../hooks/useContext";
import { useAccountUserCreateToken } from "../../../hooks/api/v1/account/user/useCreateToken";
import { useAccountIntegrationUpdateIntegration } from "../../../hooks/api/v2/account/integration/useUpdateOne";
import { useAccountIntegrationsGetOne } from "../../../hooks/api/v2/account/integration/useGetOne";
import { useAccountConnectorsGetAll} from "../../../hooks/api/v2/account/connector/useGetAll";
import { useAccountConnectorCreateConnector } from "../../../hooks/api/v2/account/connector/useCreateOne";
import { Operation } from "../../../interfaces/operation";
import {Connector} from "../../../interfaces/connector";
import { Integration, InnerConnector } from "../../../interfaces/integration";
import Edit from "./Edit";
import {FuseInitToken} from "../../../interfaces/fuseInitToken";

const Develop: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const { userData } = useContext();
    const { data: connectors, refetch: reloadConnectors } = useAccountConnectorsGetAll<{items: Connector[]}>({ enabled: userData.token, accountId: userData.accountId, subscriptionId: userData.subscriptionId });
    const { data: integrationData, refetch: reloadIntegration } = useAccountIntegrationsGetOne<Integration>({ enabled: userData.token, id, accountId: userData.accountId, subscriptionId: userData.subscriptionId });
    const createConnector = useAccountConnectorCreateConnector<Operation>();
    const updateIntegration = useAccountIntegrationUpdateIntegration<Operation>();
    const { waitForOperations, createLoader, removeLoader } = useLoader();
    const {createError} = useError();
    const createToken = useAccountUserCreateToken<FuseInitToken>();

    const [editOpen, setEditOpen] = React.useState(false);
    const [editToken, setEditToken] = React.useState<string | FuseInitToken>();
    const [connectOpen, setConnectOpen] = React.useState(false);
    const [connectorListOpen, setConnectorListOpen] = React.useState(false);

    const handleConnectorDelete = async (connectorId: string) => {
        try {
            createLoader();
            const data = { ...integrationData?.data } as Integration;
            delete data.data.configuration.connectors[connectorId];
             const response2 = await updateIntegration.mutateAsync({ 
                accountId: userData.accountId, 
                subscriptionId: userData.subscriptionId,
                ...data
            });
            await waitForOperations([response2.data.operationId]);
            reloadIntegration();
            reloadConnectors();
        } catch (e) {
            createError(e.message);
        } finally {
            removeLoader();
            setConnectorListOpen(false);
        }
    }

    const addConnector = async (connectorId: string) => {
        try {
            createLoader();
            const data = { ...integrationData?.data } as Integration;
            data.data.configuration.connectors[connectorId] = {
                connector: connectorId,
                package: "@fusebit-int/pkg-oauth-integration"
            }
            const response2 = await updateIntegration.mutateAsync({ 
                accountId: userData.accountId, 
                subscriptionId: userData.subscriptionId,
                ...data
            });
            await waitForOperations([response2.data.operationId]);
            reloadIntegration();
            reloadConnectors();
        } catch (e) {
            createError(e.message);
        } finally {
            removeLoader();
            setConnectorListOpen(false);
        }
    }

    const addNewConnector = async () => {
        try {
            createLoader();
            const connectorId = String(new Date().getTime());
            const response = await createConnector.mutateAsync({ id: connectorId, accountId: userData.accountId, subscriptionId: userData.subscriptionId });
            await waitForOperations([response.data.operationId]);
            const data = { ...integrationData?.data } as Integration;
            data.data.configuration.connectors[connectorId] = {
                connector: connectorId,
                package: "@fusebit-int/pkg-oauth-integration"
            }
            const response2 = await updateIntegration.mutateAsync({ 
                accountId: userData.accountId, 
                subscriptionId: userData.subscriptionId,
                ...data
            });
            await waitForOperations([response2.data.operationId]);
            reloadIntegration();
            reloadConnectors();
        } catch (e) {
            createError(e.message);
        } finally {
            removeLoader();
        }
    }

    const handleEditOpen = async () => {
        if (!editToken) {
            try {
                createLoader();
                const data = {
                    "protocol": "pki",
                    "profile": {
                        "subscription": userData.subscriptionId,
                    }
                }
                const response = await createToken.mutateAsync({ accountId: userData.accountId, userId: userData.userId, data: data });                
                setEditToken(response.data);
                setEditOpen(true);
                removeLoader();
            } catch(e) {
                createError(e.message);
            }
        } else {
            setEditOpen(true);
        }
    }
    
    return (
        <SC.Background>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={connectOpen}
                onClose={() => setConnectOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
            >
                <Fade in={connectOpen}>
                    <Connect open={connectOpen} onClose={() => setConnectOpen(false)} />
                </Fade>
            </Modal>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={connectorListOpen}
                onClose={() => setConnectorListOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
            >
                <Fade in={connectorListOpen}>
                    <SC.ConnectorList>
                        <SC.CardTitle>Connectors</SC.CardTitle>
                        <div>
                            {connectors?.data.items
                                .filter((item: Connector) => !Object.keys(integrationData?.data.data.configuration.connectors ?? {}).some((key: string) => (integrationData?.data.data.configuration.connectors ?? {} as InnerConnector)[key].connector === item.id))
                                .map((item: Connector, index: number) => {
                                return <SC.CardConnector key={index} onClick={(e) => addConnector(item.id)}>
                                    {// TODO: Replace placeholder with real data 
                                    } 
                                    <SC.CardConnectorImage src={slack} alt={item.id} height="20" width="20" />
                                    <SC.CardConnectorText>{item.id}</SC.CardConnectorText>
                                </SC.CardConnector>
                            })}
                        </div>
                    </SC.ConnectorList>
                </Fade>
            </Modal>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={editOpen}
                onClose={() => setEditOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
            >
                <Fade in={editOpen}>
                    <Edit open={editOpen} onClose={() => setEditOpen(false)} integration={integrationData?.data.id || ""} token={editToken || ""} />
                </Fade>
            </Modal>
            <SC.Flex>
                <SC.CardSeparator />
                <SC.FlexDown>
                    <SC.Card>
                        <SC.CardTitle>Your Application</SC.CardTitle>
                        <SC.CardButtonWrapper>
                            <Button onClick={() => setConnectOpen(true)} startIcon={<AddIcon />} style={{width: "200px"}} size="large" variant="outlined" color="primary" >Connect</Button>
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
                            <Button onClick={handleEditOpen} style={{width: "200px"}} size="large" variant="contained" color="primary" >Edit</Button>
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
                                            <SC.CardConnector key={index} onClick={(e: any) => {
                                                if (!e.target.id) history.push(`/connector/${connector.connector}`);
                                                }}>
                                                {// TODO: Replace placeholder with real data 
                                                } 
                                                <SC.CardConnectorImage src={slack} alt={key} height="20" width="20" />
                                                <SC.CardConnectorText>{connector.connector}</SC.CardConnectorText>
                                                <SC.CardConnectorCrossContainer id="closeWrapper" onClick={() => handleConnectorDelete(connector.connector)}>
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
                            <Button onClick={addNewConnector} startIcon={<AddIcon />} style={{width: "160px", marginTop: "24px"}} size="large" variant="outlined" color="primary" >Add New</Button>
                            <Button onClick={() => setConnectorListOpen(true)} startIcon={<AddIcon />} style={{width: "160px", marginTop: "24px"}} size="large" variant="outlined" color="primary" >Link Existing</Button>
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