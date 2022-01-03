import Modal from '@components/common/Modal';
import { Box } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
}

const NoSampleAppModal = ({ open, onClose }: Props) => {
  return (
    <Modal title="Coming Soon!" open={open} onClose={onClose} disableActions>
      <Box maxWidth="360px" textAlign="center">
        We're currently putting the finishing touches on the sample app for this integration. We'll notify you when it's
        available!
      </Box>
    </Modal>
  );
};

export default NoSampleAppModal;
