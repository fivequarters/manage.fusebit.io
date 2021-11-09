import { Modal, Fade, Backdrop, Button } from '@material-ui/core';
import * as CSC from '@components/globalStyle';
import CopyLine from '@components/common/CopyLine';
import HighlightedCommand from '@components/common/HighlightedCommand';
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

          <CSC.Flex>
            <CSC.LineTitle>1. Install the Fusebit CLI</CSC.LineTitle>
          </CSC.Flex>
          <CopyLine text="npm install @fusebit/cli -g">
            <HighlightedCommand command="npm install @fusebit/cli -g" keyWords="install -g" />
          </CopyLine>

          <CSC.Flex>
            <CSC.LineTitle>2. Download the integration code</CSC.LineTitle>
          </CSC.Flex>
          <CopyLine text={`fuse integration get ${integrationId} --dir ${integrationId}`} horizontalScrollbar>
            <HighlightedCommand
              command={`fuse integration get ${integrationId} --dir ${integrationId}`}
              keyWords="get --dir"
            />
          </CopyLine>

          <CSC.Flex>
            <CSC.LineTitle>
              3. Explore the code on disk and check out README.md for instructions on how to run your integration
            </CSC.LineTitle>
          </CSC.Flex>

          <CSC.Flex>
            <CSC.LineTitle>3. After making your code changes run</CSC.LineTitle>
          </CSC.Flex>
          <CopyLine text={`fuse integration deploy ${integrationId} -d ${integrationId}`} horizontalScrollbar>
            <HighlightedCommand
              command={`fuse integration deploy ${integrationId} -d ${integrationId}`}
              keyWords="deploy -d"
            />
          </CopyLine>

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
