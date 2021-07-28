import React from "react";
import * as SC from "./styles";
import { Button } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import LinkIcon from '@material-ui/icons/Link';
import cross from "../../../../assets/cross.svg";
import copyIcon from "../../../../assets/copy.svg";
import {Props} from "../../../../interfaces/connect";
import {Decoded} from "../../../../interfaces/decoded";
import { useContext } from "../../../../hooks/useContext";
import jwt_decode from "jwt-decode";

const Connect: React.FC<Props> = ({onClose, open}) => {
    const [copiedLine, setCopiedLine] = React.useState(0);
    const [fadeChange, setFadeChange] = React.useState(false);
    const { userData } = useContext();
    const [expDate, setExpDate] = React.useState("");
    let timeout: NodeJS.Timeout;

    React.useEffect(() => {
        if (userData) {
            const token = userData.token;
            if (token !== undefined) {
                const decoded: Decoded = jwt_decode(token);
                const exp = decoded.exp;
                const expInmilliseconds = exp * 1000;
                const dateObject = new Date(expInmilliseconds);
                const localExpDate = dateObject.toLocaleString();
                setExpDate(localExpDate);
            } 
        }
    }, [userData]);

    const handleCopy = (text: string, lineNumber: number) => {
        clearTimeout(timeout);
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopiedLine(lineNumber);
        timeout = setTimeout(() => {
            setCopiedLine(0);
        }, 3000);
    }

    return (
        <SC.Card open={open}>
            <SC.CardClose onClick={() => onClose()}>
                <img src={cross} alt="close" height="10" width="10" />
            </SC.CardClose>
            <SC.CardTitle>Connect your application</SC.CardTitle>
            <SC.Flex>
                <SC.LineTitle margin="10px">Current JWT</SC.LineTitle>
                <SC.CopyMobile onClick={() => handleCopy(userData.token || "", 1)} src={copyIcon} alt="copy" height="16" width="16" />
            </SC.Flex>
                <SC.LineDescription>expires on {expDate}</SC.LineDescription>
            <SC.LineInstructionWrapper onMouseLeave={() => setFadeChange(false)} onMouseEnter={() => setFadeChange(true)} onClick={() => handleCopy(userData.token || "", 1)}>
                <SC.LineInstructionCopy>
                    <img src={copyIcon} alt="copy" height="16" width="16" />
                </SC.LineInstructionCopy>
                <SC.LineInstructionFade change={fadeChange} />
                <SC.LineInstruction>{userData.token}</SC.LineInstruction>
                <SC.CopySuccess copy={copiedLine === 1}>Copied to clipboard!</SC.CopySuccess>
            </SC.LineInstructionWrapper>
            <SC.ButtonWrapper>
                <Button style={{width: "200px"}} size="large" variant="contained" color="primary">Refresh Your Token</Button>
            </SC.ButtonWrapper>
            {
                false && (
                <>
                <SC.CardSubtitle>Development</SC.CardSubtitle>
                <SC.CardButtonsContainer>
                    <Button startIcon={<AddIcon />} style={{marginBottom: "16px"}} size="large" variant="outlined" color="primary">Generate API Key</Button>
                    <Button startIcon={<AddIcon />} size="large" variant="outlined" color="primary">Refresh Your Token</Button>
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
                </>
                )
            }
        </SC.Card>
    )
}

export default Connect;