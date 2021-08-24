import React from 'react';
import * as SC from './styles';
import { Props } from '../../../../../interfaces/cliAccess';
import cross from '../../../../../assets/cross.svg';
import { Button } from '@material-ui/core';
import CopyLine from '../../../../CopyLine';

const CliAccess = React.forwardRef(({ open, onClose, token }: Props, ref) => {
  return (
    <SC.Card open={open}>
      <SC.Close onClick={() => onClose()} src={cross} alt="cross" height="12" width="12" />
      <SC.Title>Grant CLI Access</SC.Title>

      <SC.Flex>
        <SC.LineTitle>1. Install the Fusebit CLI</SC.LineTitle>
      </SC.Flex>
      <CopyLine text={'npm install @fusebit/cli -g'} highlightedText="install -g" />

      <SC.Flex>
        <SC.LineTitle margin="10px">2. Run the following initialization command</SC.LineTitle>
      </SC.Flex>
      <SC.Description>The one-time token in the command is valid for eight hours.</SC.Description>
      <CopyLine text={'fuse init ' + token} highlightedText="init" />

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
