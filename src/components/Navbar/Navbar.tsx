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

const Navbar: React.FC<Props> = ({sectionName, dropdown}) => {
    const [anchorSectionDropdown, setAnchorSectionDropdown] = React.useState(null);
    const [anchorUserDropdown, setAnchorUserDropdown] = React.useState(null);

    const handleSectionDropdownClick = (event: any) => {
        setAnchorSectionDropdown(event.currentTarget);
    };

    const handleSectionDropdownClose = () => {
        setAnchorSectionDropdown(null);
    };

    const handleUserDropdownClick = (event: any) => {
        setAnchorUserDropdown(event.currentTarget);
    };

    const handleUserDropdownClose = () => {
        setAnchorUserDropdown(null);
    };

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
                                <SC.SectionDropdown active={Boolean(anchorSectionDropdown)} aria-controls="simple-menu" aria-haspopup="true" onClick={handleSectionDropdownClick}>
                                    <SC.SectionName>{sectionName}</SC.SectionName>
                                    <img src={arrow} alt="arrow" />
                                </SC.SectionDropdown>
                                <Menu
                                style={{top: "90px"}}
                                id="simple-menu"
                                anchorEl={anchorSectionDropdown}
                                keepMounted
                                open={Boolean(anchorSectionDropdown)}
                                onClose={handleSectionDropdownClose}
                                >
                                    <SC.SectionDropdownMenu>
                                        <SC.Flex>
                                            <SC.SectionDropdownTitle>Integrations</SC.SectionDropdownTitle>
                                            <SC.SectionDropdownSeeMore href="/integrations">
                                                See all
                                                <img src={rightArrow} alt="See all" height="8" width="8" />
                                            </SC.SectionDropdownSeeMore>
                                        </SC.Flex>
                                        <SC.SectionDropdownIntegration active={true} href="/integration-detail">
                                            Slack Bot 1
                                            <img src={check} alt="check" height="16" width="16" />
                                        </SC.SectionDropdownIntegration>
                                        <SC.SectionDropdownIntegration active={false} href="/integration-detail">
                                            Slack Bot 2
                                            <img src={check} alt="check" height="16" width="16" />
                                        </SC.SectionDropdownIntegration>
                                        <SC.SectionDropdownIntegration active={false} href="/integration-detail">
                                            Slack Bot 3
                                            <img src={check} alt="check" height="16" width="16" />
                                        </SC.SectionDropdownIntegration>
                                        <SC.Flex>
                                            <SC.SectionDropdownTitle>Connectors</SC.SectionDropdownTitle>
                                            <SC.SectionDropdownSeeMore href="/">
                                                See all
                                                <img src={rightArrow} alt="See all" height="8" width="8" />
                                            </SC.SectionDropdownSeeMore>
                                        </SC.Flex>
                                        <SC.SectionDropdownIntegration active={false} href="/integration-detail">
                                            Slack 1
                                            <img src={check} alt="check" height="16" width="16" />
                                        </SC.SectionDropdownIntegration>
                                        <SC.SectionDropdownIntegration active={false} href="/integration-detail">
                                            Quickbooks 1
                                            <img src={check} alt="check" height="16" width="16" />
                                        </SC.SectionDropdownIntegration>
                                        <SC.SectionDropdownIntegration active={false} href="/integration-detail">
                                            Salesforce 1
                                            <img src={check} alt="check" height="16" width="16" />
                                        </SC.SectionDropdownIntegration>
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
                        <Button style={{backgroundColor: Boolean(anchorUserDropdown) ? "#D7E5FF66" : ""}} aria-controls="simple-menu" aria-haspopup="true" onClick={handleUserDropdownClick} size="large" startIcon={<SC.User src={client} />} endIcon={Boolean(anchorUserDropdown) ? <ExpandLessIcon /> : <ExpandMoreIcon />} variant="text" color="inherit">
                            Stage
                        </Button>
                        <Menu
                        style={{top: "100px", margin: "0 0 0 -88px"}}
                        id="simple-menu"
                        anchorEl={anchorUserDropdown}
                        keepMounted
                        open={Boolean(anchorUserDropdown)}
                        onClose={handleUserDropdownClose}
                        >
                            <SC.UserDropdown>
                                <SC.UserDropdownCompany>ACME CORP</SC.UserDropdownCompany>
                                <SC.UserDropdownInfo>
                                    <SC.UserDropdownInfoImage src={client} alt="user" height="38" width="38" />
                                    <SC.UserDropdownPersonalInfo>
                                        <SC.UserDropdownInfoName>Susan Doe</SC.UserDropdownInfoName>
                                        <SC.UserDropdownInfoEmail>sdoe@acme.com</SC.UserDropdownInfoEmail>
                                    </SC.UserDropdownPersonalInfo>
                                </SC.UserDropdownInfo>
                                <SC.UserDropdownStatus href="/">
                                    <div>
                                        <SC.UserDropdownStatusTitle>Stage</SC.UserDropdownStatusTitle>
                                        <SC.UserDropdownStatusId>Sub - 12345678</SC.UserDropdownStatusId>
                                    </div>
                                    <SC.UserDropdownStatusArrow src={rightArrow} alt="right arrow" height="12" width="12" />
                                </SC.UserDropdownStatus>
                                <SC.UserDropdownLinksWrapper>
                                    <SC.UserDropdownLink href="/authentication">Authentication</SC.UserDropdownLink>
                                    <SC.UserDropdownLink href="/billing">Billing</SC.UserDropdownLink>
                                    <SC.UserDropdownLink href="/settings">Settings</SC.UserDropdownLink>
                                </SC.UserDropdownLinksWrapper>
                                <SC.UserButtonWrapper>
                                    <Button style={{marginLeft: "auto"}} variant="outlined" size="medium" color="primary">Log Out</Button>
                                </SC.UserButtonWrapper>
                            </SC.UserDropdown>
                        </Menu>
                    </SC.ButtonWrapper>
                </SC.Nav>
            </Container>
        </SC.Background>
    )
}

export default Navbar;