import React from "react";
import * as SC from "./styles";
import cross from "../../../../assets/cross.svg";
import { Button } from "@material-ui/core";
import CheckIcon from '@material-ui/icons/Check';
import {Props} from "../../../../interfaces/edit";

const Edit: React.FC<Props> = ({open, onClose, integration}) => {
    const [copy, setCopy] = React.useState(false);
    let timeout: NodeJS.Timeout;

    const handleCopy = (text: string) => {
        clearTimeout(timeout);
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopy(true);
        timeout = setTimeout(() => {
            setCopy(false);
        }, 3000);
    }

    return (
        <SC.Card open={open}>
            <SC.CardClose onClick={() => onClose()}>
                <img src={cross} alt="close" height="10" width="10" />
            </SC.CardClose>
            <SC.Title>Edit {integration}</SC.Title>

            <SC.LineTitle>1. Install the Fusebit CLI</SC.LineTitle>
            <SC.LineInstructionWrapper onClick={() => handleCopy(`npm install @fusebit/cli -g`)}>
                <SC.LineInstructionCopy>Copy</SC.LineInstructionCopy>
                <SC.LineInstruction><span className="unselectable">$</span> npm <strong>install</strong> @fusebit/cli <span>-g</span></SC.LineInstruction>
            </SC.LineInstructionWrapper>

            <SC.LineTitle>2. Initialize the CLI by running</SC.LineTitle>
            <SC.LineInstructionWrapper onClick={() => handleCopy(`fuse init eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm90b2NvbCI6InBraSIsImFnZW50SWQiOiJ1c3ItOWViNDUzMGNkMWViNGNlZiIsInByb2ZpbGUi`)}>
            <SC.LineInstructionCopy>Copy</SC.LineInstructionCopy>
                <SC.LineInstructionFade />
                <SC.LineInstruction><span className="unselectable">$</span> fuse <strong>init</strong> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm90b2NvbCI6InBraSIsImFnZW50SWQiOiJ1c3ItOWViNDUzMGNkMWViNGNlZiIsInByb2ZpbGUi</SC.LineInstruction>
            </SC.LineInstructionWrapper>

            <SC.LineTitle>3. Download the integration code</SC.LineTitle>
            <SC.LineInstructionWrapper onClick={() => handleCopy(`fuse integration get ${integration} -d`)}>
                <SC.LineInstructionCopy>Copy</SC.LineInstructionCopy>
                <SC.LineInstruction><span className="unselectable">$</span> fuse integration <strong>get</strong> {integration} <span>-d</span></SC.LineInstruction>
            </SC.LineInstructionWrapper>

            <SC.LineTitle>4. After making your code changes run</SC.LineTitle>
            <SC.LineInstructionWrapper onClick={() => handleCopy(`fuse integration deploy ${integration} -d`)}>
                <SC.LineInstructionCopy>Copy</SC.LineInstructionCopy>
                <SC.LineInstruction><span className="unselectable">$</span> fuse integration <strong>deploy</strong> {integration} <span>-d</span></SC.LineInstruction>
            </SC.LineInstructionWrapper>

            <SC.ButtonsWrapper>
                <SC.ContainerButtonWrapper active={copy}>
                    <Button onClick={() => setCopy(false)} endIcon={<CheckIcon />} size="large" style={{boxShadow: "0px 6px 23px rgba(224, 70, 4, 0.3)"}} variant="contained" color="primary">Copied to clipboard</Button>
                </SC.ContainerButtonWrapper>
                <SC.OutlinedButtonWrapper>
                    <Button onClick={() => onClose()} variant="outlined" color="primary">OK</Button>
                </SC.OutlinedButtonWrapper>
            </SC.ButtonsWrapper>
        </SC.Card>
    )
}

export default Edit;