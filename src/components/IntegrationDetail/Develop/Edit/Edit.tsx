import React from 'react';
import * as SC from './styles';
import cross from '../../../../assets/cross.svg';
import { Button } from '@material-ui/core';
import { Props } from '../../../../interfaces/edit';
import copyIcon from '../../../../assets/copy.svg';

const Edit = React.forwardRef(({ open, onClose, integration, token }: Props, ref) => {
  const [copy, setCopy] = React.useState(false);
  const [fadeChange, setFadeChange] = React.useState(false);
  const [copiedLine, setCopiedLine] = React.useState(0);
  let timeout: NodeJS.Timeout;

  const handleCopy = (text: string, lineNumber: number) => {
    clearTimeout(timeout);
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    setCopy(true);
    setCopiedLine(lineNumber);
    timeout = setTimeout(() => {
      setCopy(false);
      setCopiedLine(0);
    }, 3000);
  };

  return (
    <SC.Card open={open}>
      <SC.CardClose onClick={() => onClose()}>
        <img src={cross} alt="close" height="10" width="10" />
      </SC.CardClose>
      <SC.Title>Edit {integration}</SC.Title>

      <SC.Flex>
        <SC.LineTitle>1. Install the Fusebit CLI</SC.LineTitle>
        <SC.CopySuccess copy={copy}>Copied to clipboard!</SC.CopySuccess>
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
        <SC.CopySuccessMobile copy={copiedLine === 1}>Copied to clipboard!</SC.CopySuccessMobile>
      </SC.LineInstructionWrapper>

      <SC.Flex>
        <SC.LineTitle>2. Initialize the CLI by running</SC.LineTitle>
        <SC.CopyMobile
          onClick={() => handleCopy(`fuse init ${token}`, 2)}
          src={copyIcon}
          alt="copy"
          height="16"
          width="16"
        />
      </SC.Flex>
      <SC.LineInstructionWrapper
        onMouseLeave={() => setFadeChange(false)}
        onMouseEnter={() => setFadeChange(true)}
        onClick={() => handleCopy(`fuse init ${token}`, 2)}
      >
        <SC.LineInstructionCopy>
          <img src={copyIcon} alt="copy" height="16" width="16" />
        </SC.LineInstructionCopy>
        <SC.LineInstructionFade change={fadeChange} />
        <SC.LineInstruction>
          <span className="unselectable">$</span> fuse <strong>init</strong> {token}
        </SC.LineInstruction>
        <SC.CopySuccessMobile copy={copiedLine === 2}>Copied to clipboard!</SC.CopySuccessMobile>
      </SC.LineInstructionWrapper>

      <SC.Flex>
        <SC.LineTitle>3. Download the integration code</SC.LineTitle>
        <SC.CopyMobile
          onClick={() => handleCopy(`fuse integration get ${integration} -d ${integration}`, 3)}
          src={copyIcon}
          alt="copy"
          height="16"
          width="16"
        />
      </SC.Flex>
      <SC.LineInstructionWrapper onClick={() => handleCopy(`fuse integration get ${integration} -d ${integration}`, 3)}>
        <SC.LineInstructionCopy>
          <img src={copyIcon} alt="copy" height="16" width="16" />
        </SC.LineInstructionCopy>
        <SC.LineInstructionFade onlyMobileVisible={true} change={false} />
        <SC.LineInstruction>
          <span className="unselectable">$</span> fuse integration <strong>get</strong> {integration}{' '}
          <strong>-d</strong> {integration}
        </SC.LineInstruction>
        <SC.CopySuccessMobile copy={copiedLine === 3}>Copied to clipboard!</SC.CopySuccessMobile>
      </SC.LineInstructionWrapper>

      <SC.Flex>
        <SC.LineTitle>4. After making your code changes run</SC.LineTitle>
        <SC.CopyMobile
          onClick={() => handleCopy(`fuse integration deploy ${integration} -d ${integration}`, 4)}
          src={copyIcon}
          alt="copy"
          height="16"
          width="16"
        />
      </SC.Flex>
      <SC.LineInstructionWrapper
        onClick={() => handleCopy(`fuse integration deploy ${integration} -d ${integration}`, 4)}
      >
        <SC.LineInstructionCopy>
          <img src={copyIcon} alt="copy" height="16" width="16" />
        </SC.LineInstructionCopy>
        <SC.LineInstructionFade onlyMobileVisible={true} change={false} />
        <SC.LineInstruction>
          <span className="unselectable">$</span> fuse integration <strong>deploy</strong> {integration}{' '}
          <strong>-d</strong> {integration}
        </SC.LineInstruction>
        <SC.CopySuccessMobile copy={copiedLine === 4}>Copied to clipboard!</SC.CopySuccessMobile>
      </SC.LineInstructionWrapper>

      <SC.ButtonsWrapper>
        <SC.OutlinedButtonWrapper>
          <Button onClick={() => onClose()} variant="outlined" color="primary">
            OK
          </Button>
        </SC.OutlinedButtonWrapper>
      </SC.ButtonsWrapper>
    </SC.Card>
  );
});

export default Edit;
