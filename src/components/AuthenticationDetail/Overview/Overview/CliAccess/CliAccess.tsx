import React from 'react';
import * as SC from './styles';
import { Props } from '../../../../../interfaces/cliAccess';
import cross from '../../../../../assets/cross.svg';
import copyIcon from '../../../../../assets/copy.svg';
import { Button } from '@material-ui/core';

const CliAccess = React.forwardRef(({ open, onClose, token }: Props, ref) => {
  const [copiedLine, setCopiedLine] = React.useState(0);
  const [fadeChange, setFadeChange] = React.useState(false);
  let timeout: NodeJS.Timeout;

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
  };

  return (
    <SC.Card open={open}>
      <SC.Close onClick={() => onClose()} src={cross} alt="cross" height="12" width="12" />
      <SC.Title>Grant CLI Access</SC.Title>

      <SC.Flex>
        <SC.LineTitle>1. Install the Fusebit CLI</SC.LineTitle>
        <SC.CopyMobile
          onClick={() => handleCopy(`npm install @fusebit/cli -g`, 1)}
          src={copyIcon}
          alt="copy"
          height="16"
          width="16"
        />
      </SC.Flex>
      <SC.LineInstructionWrapper onClick={() => handleCopy(`npm install @fusebit/cli -g`, 1)}>
        <SC.LineInstructionCopy>
          <img src={copyIcon} alt="copy" height="16" width="16" />
        </SC.LineInstructionCopy>
        <SC.LineInstruction>
          <span className="unselectable">$</span> npm <strong>install</strong> @fusebit/cli <span>-g</span>
        </SC.LineInstruction>
        <SC.CopySuccess copy={copiedLine === 1}>Copied to clipboard!</SC.CopySuccess>
      </SC.LineInstructionWrapper>

      <SC.Flex>
        <SC.LineTitle margin="10px">2. Run the following initialization command</SC.LineTitle>
        <SC.CopyMobile
          onClick={() => handleCopy(`fuse init ${token}`, 2)}
          src={copyIcon}
          alt="copy"
          height="16"
          width="16"
        />
      </SC.Flex>
      <SC.Description>The one-time token in the command is valid for eight hours.</SC.Description>
      <SC.LineInstructionWrapper
        onMouseLeave={() => setFadeChange(false)}
        onMouseEnter={() => setFadeChange(true)}
        onClick={() => handleCopy(`fuse init ${token}`, 2)}
      >
        <SC.LineInstructionCopy>
          <img src={copyIcon} alt="copy" height="16" width="16" />
        </SC.LineInstructionCopy>
        <SC.LineInstructionFade onlyMobileVisible={false} change={fadeChange} />
        <SC.LineInstruction>
          <span className="unselectable">$</span> fuse <strong>init</strong> {token}
        </SC.LineInstruction>
        <SC.CopySuccess copy={copiedLine === 2}>Copied to clipboard!</SC.CopySuccess>
      </SC.LineInstructionWrapper>

      <SC.ButtonsWrapper>
        <SC.OutlinedButtonWrapper>
          <Button onClick={() => onClose()} variant="outlined" color="primary">
            Done
          </Button>
        </SC.OutlinedButtonWrapper>
      </SC.ButtonsWrapper>
    </SC.Card>
  );
});

export default CliAccess;
