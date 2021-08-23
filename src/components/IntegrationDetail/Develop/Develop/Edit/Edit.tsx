import React from 'react';
import * as SC from './styles';
import cross from '../../../../../assets/cross.svg';
import { Button } from '@material-ui/core';
import { Props } from '../../../../../interfaces/edit';
import CopyLine from '../../../../CopyLine';

const Edit = React.forwardRef(({ open, onClose, integration }: Props) => {
  return (
    <SC.Card open={open}>
      <SC.CardClose onClick={() => onClose()}>
        <img src={cross} alt="close" height="10" width="10" />
      </SC.CardClose>
      <SC.Title>Edit {integration}</SC.Title>

      <SC.Flex>
        <SC.LineTitle>1. Install the Fusebit CLI</SC.LineTitle>
      </SC.Flex>
      <CopyLine text={'npm install @fusebit/cli -g'} highlightedText="install -g" />

      <SC.Flex>
        <SC.LineTitle>2. Download the integration code</SC.LineTitle>
      </SC.Flex>
      <CopyLine
        text={'fuse integration get ' + integration + ' --dir ' + integration}
        highlightedText="get --dir"
        horizontalScrollbar={true}
      />

      <SC.Flex>
        <SC.LineTitle>3. After making your code changes run</SC.LineTitle>
      </SC.Flex>
      <CopyLine
        text={'fuse integration deploy ' + integration + ' -d ' + integration}
        highlightedText="deploy -d"
        horizontalScrollbar={true}
      />

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
