import React from "react";
import * as SC from "./styles";
import { Container, Button, Menu } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import client from "../../assets/client.jpg";
import {Props} from "../../interfaces/Navbar";
import arrow from "../../assets/down-arrow-white.svg";
import rightArrow from "../../assets/arrow-right-black.svg";
import check from "../../assets/check.svg";
import { useContext } from "../../hooks/useContext";
import { useAccountIntegrationsGetAll } from "../../hooks/api/v2/account/integration/useGetAll";
import { useAccountConnectorsGetAll } from "../../hooks/api/v2/account/connector/useGetAll";
import { Integration } from "../../interfaces/integration";
import { Connector } from "../../interfaces/connector";
import { useState } from "react";
import { useEffect } from "react";

const Navbar: React.FC<Props> = ({sectionName, dropdown, integration, connector}) => {
    const [anchorSectionDropdown, setAnchorSectionDropdown] = React.useState(null);
    const [anchorUserDropdown, setAnchorUserDropdown] = React.useState(null);
    const { userData, logout } = useContext();
    const [loginUrl, setLoginUrl] = useState("");

    const { data: integrations } = useAccountIntegrationsGetAll<{ items: Integration[] }>({ enabled: userData.token, accountId: userData.accountId, subscriptionId: userData.subscriptionId });
    const { data: connectors } = useAccountConnectorsGetAll<{ items: Connector[] }>({ enabled: userData.token, accountId: userData.accountId, subscriptionId: userData.subscriptionId });

    useEffect(() => {
        setLoginUrl(`https://fusebit.auth0.com/authorize?response_type=token&client_id=hSgWIXmbluQMADuWhDnRTpWyKptJe6LB&audience=https://stage.us-west-2.fusebit.io&redirect_uri=${window.location.origin}/callback&scope=openid profile email`);
    }, [])

    return (
        <SC.Background>
            <Container maxWidth="lg" >
                <SC.Nav>
                    <SC.CompanyImg />
                    <SC.CompanyName>ACME CORP</SC.CompanyName>
                    <SC.Arrow />
                    {
                        dropdown ? (
                            <>
                                <SC.SectionDropdown active={Boolean(anchorSectionDropdown)} aria-controls="simple-menu" aria-haspopup="true" onClick={(event: any) => setAnchorSectionDropdown(event.currentTarget)}>
                                    <SC.SectionName>{integration ? sectionName + " Integration" : connector ? sectionName + " Connector" : sectionName}</SC.SectionName>
                                    <img src={arrow} alt="arrow" />
                                </SC.SectionDropdown>
                                <Menu
                                style={{top: "90px"}}
                                id="simple-menu"
                                anchorEl={anchorSectionDropdown}
                                keepMounted
                                open={Boolean(anchorSectionDropdown)}
                                onClose={() => setAnchorSectionDropdown(null)}
                                >
                                    <SC.SectionDropdownMenu>
                                        <SC.Flex>
                                            <SC.SectionDropdownTitle>Integrations</SC.SectionDropdownTitle>
                                            <SC.SectionDropdownSeeMore href="/integrations">
                                                See all
                                                <img src={rightArrow} alt="See all" height="8" width="8" />
                                            </SC.SectionDropdownSeeMore>
                                        </SC.Flex>
                                        {
                                            integrations?.data.items.map((integration, index) => (
                                                <SC.SectionDropdownIntegration key={index} active={sectionName === integration.id} href={"/integration/" + integration.id}>
                                                    {integration.id}
                                                    <img src={check} alt="check" height="16" width="16" />
                                                </SC.SectionDropdownIntegration>
                                            ))
                                        }
                                        <SC.Flex>
                                            <SC.SectionDropdownTitle>Connectors</SC.SectionDropdownTitle>
                                            <SC.SectionDropdownSeeMore href="/">
                                                See all
                                                <img src={rightArrow} alt="See all" height="8" width="8" />
                                            </SC.SectionDropdownSeeMore>
                                        </SC.Flex>
                                        {
                                            connectors?.data.items.map((connector, index) => (
                                                <SC.SectionDropdownIntegration key={index} active={sectionName === connector.id} href={"/connector/" + connector.id}>
                                                    {connector.id}
                                                    <img src={check} alt="check" height="16" width="16" />
                                                </SC.SectionDropdownIntegration>
                                            ))
                                        }
                                    </SC.SectionDropdownMenu>
                                </Menu>
                          </>
                        ) : (
                            <SC.SectionName>{sectionName}</SC.SectionName>
                        )
                    }
                    <SC.LinksContainer>
                        <SC.Link href="/support">Support</SC.Link>
                        <SC.Link href="/docs">Docs</SC.Link>
                    </SC.LinksContainer>
                    <SC.ButtonWrapper active={Boolean(anchorUserDropdown)}>
                        <Button style={{backgroundColor: Boolean(anchorUserDropdown) ? "#D7E5FF66" : ""}} aria-controls="simple-menu" aria-haspopup="true" onClick={(event: any) => setAnchorUserDropdown(event.currentTarget)} size="large" startIcon={<SC.User src={client} />} endIcon={Boolean(anchorUserDropdown) ? <ExpandLessIcon /> : <ExpandMoreIcon />} variant="text" color="inherit">
                            Stage
                        </Button>
                        <Menu
                        style={{top: "100px", margin: "0 0 0 -88px"}}
                        id="simple-menu"
                        anchorEl={anchorUserDropdown}
                        keepMounted
                        open={Boolean(anchorUserDropdown)}
                        onClose={() => setAnchorUserDropdown(null)}
                        >
                            <SC.UserDropdown>
                                <SC.UserDropdownCompany>ACME CORP</SC.UserDropdownCompany>
                                <SC.UserDropdownInfo>
                                    <SC.UserDropdownInfoImage src={client} alt="user" height="38" width="38" />
                                    <SC.UserDropdownPersonalInfo>
                                        <SC.UserDropdownInfoName>{userData.firstName} {userData.lastName}</SC.UserDropdownInfoName>
                                        <SC.UserDropdownInfoEmail>{userData.primaryEmail}</SC.UserDropdownInfoEmail>
                                    </SC.UserDropdownPersonalInfo>
                                </SC.UserDropdownInfo>
                                <SC.UserDropdownStatus href="/">
                                    <div>
                                        <SC.UserDropdownStatusTitle>Stage</SC.UserDropdownStatusTitle>
                                        <SC.UserDropdownStatusId>{userData.subscriptionId}</SC.UserDropdownStatusId>
                                    </div>
                                    <SC.UserDropdownStatusArrow src={rightArrow} alt="right arrow" height="12" width="12" />
                                </SC.UserDropdownStatus>
                                <SC.UserDropdownLinksWrapper>
                                    <SC.UserDropdownLink href="/authentication">Authentication</SC.UserDropdownLink>
                                    <SC.UserDropdownLink href="/billing">Billing</SC.UserDropdownLink>
                                    <SC.UserDropdownLink href="/settings">Settings</SC.UserDropdownLink>
                                </SC.UserDropdownLinksWrapper>
                                <SC.UserButtonWrapper>
                                    <Button onClick={logout} style={{marginLeft: "auto"}} variant="outlined" size="medium" color="primary">Log Out</Button>
                                </SC.UserButtonWrapper>
                            </SC.UserDropdown>
                        </Menu>
                    </SC.ButtonWrapper>
                </SC.Nav>
                {!userData.id && <SC.FloatingLogin href={loginUrl}>Temp Login</SC.FloatingLogin>}
            </Container>
        </SC.Background>
    )
}

export default Navbar;