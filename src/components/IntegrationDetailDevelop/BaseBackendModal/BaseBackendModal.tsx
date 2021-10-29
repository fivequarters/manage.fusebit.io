import { Backdrop, Modal, Fade } from '@material-ui/core';
import { useState } from 'react';
import Connect from '../Connect';
import DeleteBackendModal from '../DeleteBackendModal';
import useDeleteBackend from '../hooks/useDeleteBackend';

interface Props extends Omit<React.ComponentProps<typeof Connect>, 'onDelete'> {
  open: boolean;
  onClose: (force?: boolean) => void;
}

const BaseBackendModal = ({ open, onClose, id, ...props }: Props) => {
  const { handleDelete } = useDeleteBackend({ onClose: () => onClose(true), id });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <>
      {deleteModalOpen ? (
        <DeleteBackendModal open={deleteModalOpen} setOpen={setDeleteModalOpen} onConfirm={() => handleDelete()} />
      ) : (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={() => onClose()}
          closeAfterTransition
          BackdropComponent={Backdrop}
        >
          <Fade in={open}>
            <Connect
              open={open}
              onClose={() => onClose()}
              onDelete={() => setDeleteModalOpen(true)}
              id={id}
              {...props}
            />
          </Fade>
        </Modal>
      )}
    </>
  );
};

export default BaseBackendModal;
