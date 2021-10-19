import { Modal, Fade, Backdrop } from '@material-ui/core';
import EditCli from '../EditCli';

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
        <EditCli open={open} onClose={onClose} integrationId={integrationId} />
      </Fade>
    </Modal>
  );
};

export default EditCliModal;
