import { Backdrop, useMediaQuery } from '@material-ui/core';
import Modal from '@components/common/Modal';
import { useEntityApi } from '@hooks/useEntityApi';
import InviteUserForm from '@components/AccountTeam/InviteUserForm';

interface Props {
  open: boolean;
  onClose: () => void;
}

const InviteUserModal = ({ onClose, open }: Props) => {
  const { _createUser } = useEntityApi();
  const isMobile = useMediaQuery('(max-width: 550px)');

  return (
    <Modal
      disableActions
      open={open}
      onClose={onClose}
      closeAfterTransition
      fullScreen={isMobile}
      BackdropComponent={Backdrop}
    >
      <InviteUserForm createUser={_createUser} onClose={onClose} />
    </Modal>
  );
};

export default InviteUserModal;
