import React from "react";
import * as SC from "./styles";
import { Button } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import LinkIcon from '@material-ui/icons/Link';
import cross from "../../../../assets/cross.svg";
import {Props} from "../../../../interfaces/connect";

const Connect: React.FC<Props> = ({onClose, open}) => {
    return (
        <SC.Card open={open}>
            <SC.CardClose onClick={() => onClose()}>
                <img src={cross} alt="close" height="10" width="10" />
            </SC.CardClose>
            <SC.CardTitle>Connect your application</SC.CardTitle>
            <SC.CardSubtitle>Development</SC.CardSubtitle>
            <SC.CardButtonsContainer>
                <Button startIcon={<AddIcon />} size="large" variant="outlined" color="primary">Generate API Key</Button>
            </SC.CardButtonsContainer>
            <SC.CardSubtitle>Production</SC.CardSubtitle>
            <SC.CardButtonsContainer>
                <Button startIcon={<AddIcon />} style={{marginBottom: "16px"}} size="large" variant="outlined" color="primary">Create Client</Button>
                <Button startIcon={<LinkIcon />} size="large" variant="outlined" color="primary">Link existing client</Button>
            </SC.CardButtonsContainer>
            <SC.CardActionButtons>
                <Button style={{marginRight: "16px"}} size="medium" variant="outlined" color="primary">Reset</Button>
                <Button size="medium" variant="contained" color="primary">Save</Button>
            </SC.CardActionButtons>
        </SC.Card>
    )
}

export default Connect;