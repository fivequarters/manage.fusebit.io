import React from "react";
import * as SC from "./styles";
import { Container, Button, Menu } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import client from "../../assets/client.jpg";
import {Props} from "../../interfaces/Navbar";
import arrow from "../../assets/down-arrow-white.svg";
import rightArrow from "../../assets/arrow-right-black.svg";
import check from "../../assets/check.svg";

const Navbar: React.FC<Props> = ({sectionName, dropdown}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleSectionDropdownClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSectionDropdownClose = () => {
        setAnchorEl(null);
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
                                <SC.SectionDropdown aria-controls="simple-menu" aria-haspopup="true" onClick={handleSectionDropdownClick}>
                                    <SC.SectionName>{sectionName}</SC.SectionName>
                                    <img src={arrow} alt="arrow" />
                                </SC.SectionDropdown>
                                <SC.SectionDropdown>
                                    <Menu
                                    style={{top: "90px"}}
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
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
                                </SC.SectionDropdown>
                          </>
                        ) : (
                            <SC.SectionName>{sectionName}</SC.SectionName>
                        )
                    }
                    <SC.LinksContainer>
                        <SC.Link href="/support">Support</SC.Link>
                        <SC.Link href="/docs">Docs</SC.Link>
                    </SC.LinksContainer>
                    <SC.ButtonWrapper>
                        <Button size="large" startIcon={<SC.User src={client} />} endIcon={<ExpandMoreIcon />} variant="text" color="inherit">
                            Stage
                        </Button>
                    </SC.ButtonWrapper>
                </SC.Nav>
            </Container>
        </SC.Background>
    )
}

export default Navbar;