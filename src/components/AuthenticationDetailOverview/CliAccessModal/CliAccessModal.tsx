import React from 'react';
import { Backdrop, Button, Modal } from '@material-ui/core';
import { Props } from '@interfaces/cliAccess';
import CopyLine from '@components/common/CopyLine';
import * as CSC from '@components/globalStyle';
import styled from 'styled-components';

const StyledCard = styled.div<{ open: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  opacity: ${(props) => (props.open ? 1 : 0)};
  padding: 64px;
  width: 859px;
  border-radius: 8px;
  box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
  transition: all 1s linear;

  @media only screen and (max-width: 850px) {
    width: 100%;
    height: 100%;
    border-radius: 0;
    padding: 32px;
    left: 0;
    top: auto;
    bottom: 0;
    transform: translate(0, 0);
  }
`;

const StyledButtonsWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 48px;
`;

const StyledOutlinedButtonWrapper = styled.div`
  margin-left: auto;

  @media only screen and (max-width: 1250px) {
    margin: 0 auto;
  }
`;

const CliAccessModal = React.forwardRef<HTMLDivElement, Props>(({ open, onClose }, ref) => {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => onClose()}
      closeAfterTransition
      BackdropComponent={Backdrop}
    >
      <StyledCard open={open} ref={ref} tabIndex={-1}>
        <CSC.Close onClick={() => onClose()} />
        <CSC.ModalTitle>Grant CLI Access</CSC.ModalTitle>

        <CSC.Flex>
          <CSC.LineTitle>1. Install the Fusebit CLI</CSC.LineTitle>
        </CSC.Flex>
        <CopyLine text="npm install @fusebit/cli -g" highlightedText="install -g" />

        <CSC.Flex>
          <CSC.LineTitle>2. Run the following initialization command</CSC.LineTitle>
        </CSC.Flex>
        <CopyLine text="fuse init" highlightedText="init" />

        <StyledButtonsWrapper>
          <StyledOutlinedButtonWrapper>
            <Button onClick={() => onClose()} variant="outlined" color="primary">
              Done
            </Button>
          </StyledOutlinedButtonWrapper>
        </StyledButtonsWrapper>
      </StyledCard>
    </Modal>
  );
});

export default CliAccessModal;
