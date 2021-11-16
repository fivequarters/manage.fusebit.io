import { Modal, Fade, Backdrop, Button } from '@material-ui/core';
import * as CSC from '@components/globalStyle';
import CopyLine from '@components/common/CopyLine';
import styled from 'styled-components';

const StyledCard = styled.div<{ open: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  background-color: white;
  opacity: ${(props) => (props.open ? 1 : 0)};
  padding: 32px 120px;
  border-radius: 8px;
  width: 907px;
  box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
  transition: all 1s linear;

  @media only screen and (max-width: 1250px) {
    width: 100%;
    left: 0;
    top: auto;
    bottom: 0;
    transform: translate(0, 0);
    overflow: auto;
    padding: 32px 24px;
  }
`;

const StyledButtonsWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 16px;
`;

const StyledOutlinedButtonWrapper = styled.div`
  margin-left: auto;

  @media only screen and (max-width: 1250px) {
    margin: 0 auto;
  }
`;

interface Props {
  open: boolean;
  onClose: () => void;
  integrationId: string;
}

const EditCliModal = ({ open, onClose, integrationId }: Props) => {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
    >
      <Fade in={open}>
        <StyledCard open={!!open} tabIndex={-1}>
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
            horizontalScrollbar
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
            horizontalScrollbar
          />

          <StyledButtonsWrapper>
            <StyledOutlinedButtonWrapper>
              <Button onClick={() => onClose()} variant="outlined" color="primary">
                OK
              </Button>
            </StyledOutlinedButtonWrapper>
          </StyledButtonsWrapper>
        </StyledCard>
      </Fade>
    </Modal>
  );
};

export default EditCliModal;
