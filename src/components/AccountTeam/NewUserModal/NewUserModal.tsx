import { Backdrop } from '@material-ui/core';
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
    <Modal
      content={<CreateUserForm createUser={_createUser} onClose={onClose} />}
      disableActions
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
    />
  );
};

export default CreateUserModal;
