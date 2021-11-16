import React from 'react';
import { Props } from '@interfaces/cliAccess';
import CopyLine from '@components/common/CopyLine';
import * as CSC from '@components/globalStyle';
import Modal from '@components/common/Modal';
import styled from 'styled-components';
import { Box } from '@material-ui/core';

const StyledWrapper = styled.div`
  width: 650px;
  padding: 0 40px;
  padding-bottom: 20px;

  @media only screen and (max-width: 880px) {
    width: 100%;
  }
`;

const CliAccessModal = React.forwardRef<HTMLDivElement, Props>(({ open, onClose }, ref) => {
  return (
    <Modal title="Grant CLI Access" open={open} onAccept={onClose} onClose={onClose}>
      <StyledWrapper ref={ref}>
        <Box display="flex">
          <CSC.LineTitle>1. Install the Fusebit CLI</CSC.LineTitle>
        </Box>
        <CopyLine text="npm install @fusebit/cli -g">
          <strong>$</strong> npm <strong>install</strong> @fusebit/cli <strong>-g</strong>
        </CopyLine>

        <Box display="flex">
          <CSC.LineTitle>2. Run the following initialization command</CSC.LineTitle>
        </Box>
        <CopyLine text="fuse init">
          <strong>$</strong> fuse <strong>init</strong>
        </CopyLine>
      </StyledWrapper>
    </Modal>
  );
});

export default CliAccessModal;
