import React from "react";
import * as SC from "./styles";
import cross from "../../../../assets/cross.svg";
import { Button } from "@material-ui/core";
import {Props} from "../../../../interfaces/edit";
import copyIcon from "../../../../assets/copy.svg";

const Edit: React.FC<Props> = ({open, onClose, integration, token}) => {
    const [copy, setCopy] = React.useState(false);
    const [fadeChange, setFadeChange] = React.useState(false);
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
            <SC.Flex>
                <SC.LineTitle>1. Install the Fusebit CLI</SC.LineTitle>
                <SC.CopySuccess copy={copy}>Copied to clipboard!</SC.CopySuccess>
            </SC.Flex>
            <SC.LineInstructionWrapper onClick={() => handleCopy(`npm install @fusebit/cli -g`)}>
                <SC.LineInstructionCopy>
                    <img src={copyIcon} alt="copy" height="16" width="16" />
                </SC.LineInstructionCopy>
                <SC.LineInstruction><span className="unselectable">$</span> npm <strong>install</strong> @fusebit/cli <span>-g</span></SC.LineInstruction>
            </SC.LineInstructionWrapper>

            <SC.LineTitle>2. Initialize the CLI by running</SC.LineTitle>
            <SC.LineInstructionWrapper onMouseLeave={() => setFadeChange(false)} onMouseEnter={() => setFadeChange(true)} onClick={() => handleCopy(`fuse init ${token}`)}>
                <SC.LineInstructionCopy>
                    <img src={copyIcon} alt="copy" height="16" width="16" />
                </SC.LineInstructionCopy>
                <SC.LineInstructionFade change={fadeChange} />
                <SC.LineInstruction><span className="unselectable">$</span> fuse <strong>init</strong> {token}</SC.LineInstruction>
            </SC.LineInstructionWrapper>

            <SC.LineTitle>3. Download the integration code</SC.LineTitle>
            <SC.LineInstructionWrapper onClick={() => handleCopy(`fuse integration get -d ${integration}`)}>
                <SC.LineInstructionCopy>
                    <img src={copyIcon} alt="copy" height="16" width="16" />
                </SC.LineInstructionCopy>
                <SC.LineInstruction><span className="unselectable">$</span> fuse integration <strong>get -d</strong> {integration}</SC.LineInstruction>
            </SC.LineInstructionWrapper>

            <SC.LineTitle>4. After making your code changes run</SC.LineTitle>
            <SC.LineInstructionWrapper onClick={() => handleCopy(`fuse integration deploy -d ${integration}`)}>
                <SC.LineInstructionCopy>
                    <img src={copyIcon} alt="copy" height="16" width="16" />
                </SC.LineInstructionCopy>
                <SC.LineInstruction><span className="unselectable">$</span> fuse integration <strong>deploy -d</strong> {integration}</SC.LineInstruction>
            </SC.LineInstructionWrapper>

            <SC.ButtonsWrapper>
                <SC.OutlinedButtonWrapper>
                    <Button onClick={() => onClose()} variant="outlined" color="primary">OK</Button>
                </SC.OutlinedButtonWrapper>
            </SC.ButtonsWrapper>
        </SC.Card>
    )
}

export default Edit;