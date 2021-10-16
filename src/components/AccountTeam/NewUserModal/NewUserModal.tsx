import { Backdrop } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { useEntityApi } from '../../../hooks/useEntityApi';
import NewUserForm from '../NewUserForm';

interface Props {
  open: boolean;
  onClose: () => void;
}

const NewUserModal = ({ onClose, open }: Props) => {
  const { _createUser } = useEntityApi();

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
    >
      <NewUserForm createUser={_createUser} open={open} onClose={onClose} />
    </Modal>
  );
};

export default NewUserModal;
