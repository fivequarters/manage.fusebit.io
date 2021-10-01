import React from 'react';
import { Button } from '@material-ui/core';
import * as SC from './styles';
import * as CSC from '../../../../globalStyle';
import { Props } from '../../../../../interfaces/edit';
import CopyLine from '../../../../CopyLine';

const Edit = React.forwardRef(({ open, onClose, integrationId }: Props, ref) => {
  return (
    <SC.Card open={!!open}>
      <CSC.Close onClick={() => onClose()} />
      <CSC.ModalTitle>Edit {integrationId}</CSC.ModalTitle>

      <CSC.Flex>
        <CSC.LineTitle>1. Install the Fusebit CLI</CSC.LineTitle>
      </CSC.Flex>
      <CopyLine text="npm install @fusebit/cli -g" highlightedText="install -g" />

      <CSC.Flex>
        <CSC.LineTitle>2. Download the integration code</CSC.LineTitle>
      </CSC.Flex>
      <CopyLine
        text={`fuse integration get ${integrationId} --dir ${integrationId}`}
        highlightedText="get --dir"
        horizontalScrollbar={true}
      />

      <CSC.Flex>
        <CSC.LineTitle>
          3. Explore the code on disk and check out README.md for instructions on how to run your integration
        </CSC.LineTitle>
      </CSC.Flex>

      <CSC.Flex>
        <CSC.LineTitle>3. After making your code changes run</CSC.LineTitle>
      </CSC.Flex>
      <CopyLine
        text={`fuse integration deploy ${integrationId} -d ${integrationId}`}
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
