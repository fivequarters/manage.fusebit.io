import { Backdrop, Modal } from '@mui/material';
import EditGui from './EditGui';

interface Props {
  open: boolean;
  onClose: () => void;
  integrationId: string;
}

const EditGuiModal = ({ onClose, open, integrationId }: Props) => {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      disableEscapeKeyDown
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
    >
      <EditGui onClose={onClose} integrationId={integrationId} />
    </Modal>
  );
};

export default EditGuiModal;
