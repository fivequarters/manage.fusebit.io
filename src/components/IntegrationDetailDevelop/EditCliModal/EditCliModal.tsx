import { Modal, Fade, Backdrop, Button, Box } from '@material-ui/core';
import * as CSC from '@components/globalStyle';
import CopyLine from '@components/common/CopyLine';
import * as SC from './styles';

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
        <SC.Card open={!!open} tabIndex={-1}>
          <CSC.Close onClick={() => onClose()} />
          <CSC.ModalTitle>Edit {integrationId}</CSC.ModalTitle>

          <Box display="flex">
            <CSC.LineTitle>1. Install the Fusebit CLI</CSC.LineTitle>
          </Box>
          <CopyLine text="npm install @fusebit/cli -g" highlightedText="install -g" />

          <Box display="flex">
            <CSC.LineTitle>2. Download the integration code</CSC.LineTitle>
          </Box>
          <CopyLine
            text={`fuse integration get ${integrationId} --dir ${integrationId}`}
            highlightedText="get --dir"
            horizontalScrollbar
          />

          <Box display="flex">
            <CSC.LineTitle>
              3. Explore the code on disk and check out README.md for instructions on how to run your integration
            </CSC.LineTitle>
          </Box>

          <Box display="flex">
            <CSC.LineTitle>3. After making your code changes run</CSC.LineTitle>
          </Box>
          <CopyLine
            text={`fuse integration deploy ${integrationId} -d ${integrationId}`}
            highlightedText="deploy -d"
            horizontalScrollbar
          />

          <SC.ButtonsWrapper>
            <SC.OutlinedButtonWrapper>
              <Button onClick={() => onClose()} variant="outlined" color="primary">
                OK
              </Button>
            </SC.OutlinedButtonWrapper>
          </SC.ButtonsWrapper>
        </SC.Card>
      </Fade>
    </Modal>
  );
};

export default EditCliModal;
