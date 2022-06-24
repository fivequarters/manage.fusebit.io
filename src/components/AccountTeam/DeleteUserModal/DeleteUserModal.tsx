import ConfirmationPrompt from '@components/common/ConfirmationPrompt';
import { useAuthContext } from '@hooks/useAuthContext';
import { getPluralText } from '@utils/utils';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  selected: string[];
}

const DeleteUserModal = ({ open, onConfirm, setOpen, selected }: Props) => {
  const { userData } = useAuthContext();
  return (
    <ConfirmationPrompt
      open={open}
      setOpen={setOpen}
      handleConfirmation={onConfirm}
      confirmationButtonText="Remove"
      title={`Are you sure you want to remove ${getPluralText(selected, 'team member')}?`}
      description={`This will remove all their to access to ${userData.company}. You will have to invite them to join your team again.`}
    />
  );
};

export default DeleteUserModal;
