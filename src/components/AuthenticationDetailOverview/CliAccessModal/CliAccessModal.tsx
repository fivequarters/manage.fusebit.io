import React from 'react';
import { Props } from '@interfaces/cliAccess';
import CopyLine from '@components/common/CopyLine';
import * as CSC from '@components/globalStyle';
import Modal from '@components/common/Modal';
import styled from 'styled-components';

const Wrapper = styled.div`
  min-width: 600px;
`;

const CliAccessModal = React.forwardRef<HTMLDivElement, Props>(({ open, onClose }, ref) => {
  return (
    <Modal title="Grant CLI Access" open={open} onAccept={() => onClose()} onClose={() => onClose()}>
      <Wrapper ref={ref}>
        <CSC.Flex>
          <CSC.LineTitle>1. Install the Fusebit CLI</CSC.LineTitle>
        </CSC.Flex>
        <CopyLine text="npm install @fusebit/cli -g" highlightedText="install -g" />

        <CSC.Flex>
          <CSC.LineTitle>2. Run the following initialization command</CSC.LineTitle>
        </CSC.Flex>
        <CopyLine text="fuse init" highlightedText="init" />
      </Wrapper>
    </Modal>
  );
});

export default CliAccessModal;
