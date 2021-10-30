import { Backdrop, Modal, Fade } from '@material-ui/core';
import Connect from '@components/IntegrationDetailDevelop/Connect';
import useDeleteBackend from '@components/IntegrationDetailDevelop/hooks/useDeleteBackend';

interface Props extends Omit<React.ComponentProps<typeof Connect>, 'onDelete'> {
  open: boolean;
  onClose: (force?: boolean) => void;
}

const BaseBackendModal = ({ open, onClose, id, ...props }: Props) => {
  const { handleDelete } = useDeleteBackend({ onClose: () => onClose(true), id });

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => onClose()}
      closeAfterTransition
      BackdropComponent={Backdrop}
    >
      <Fade in={open}>
        <Connect open={open} onClose={() => onClose()} onDelete={handleDelete} id={id} {...props} />
      </Fade>
    </Modal>
  );
};

export default BaseBackendModal;
