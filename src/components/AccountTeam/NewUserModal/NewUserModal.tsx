import { Backdrop } from '@mui/material';
import Modal from '@components/common/Modal';
import { useEntityApi } from '@hooks/useEntityApi';
import CreateUserForm from '@components/AccountTeam/NewUserForm';

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateUserModal = ({ onClose, open }: Props) => {
  const { _createUser } = useEntityApi();

  return (
    <Modal disableActions open={open} onClose={onClose} closeAfterTransition BackdropComponent={Backdrop}>
      <CreateUserForm createUser={_createUser} onClose={onClose} />
    </Modal>
  );
};

export default CreateUserModal;
