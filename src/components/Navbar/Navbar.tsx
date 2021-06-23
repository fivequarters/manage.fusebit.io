import React from "react";
import * as SC from "./styles";
import { Container, Button } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import client from "../../assets/client.jpg";
import {Props} from "../../interfaces/Navbar";
import arrow from "../../assets/down-arrow-white.svg";

const Navbar: React.FC<Props> = ({sectionName, dropdown}) => {
    return (
        <SC.Background>
            <Container maxWidth="lg" >
                <SC.Nav>
                    <SC.CompanyImg />
                    <SC.CompanyName>ACME CORP</SC.CompanyName>
                    <SC.Arrow />
                    <SC.SectionName>{sectionName}</SC.SectionName>
                    {
                        dropdown && <img src={arrow} alt="arrow" />
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