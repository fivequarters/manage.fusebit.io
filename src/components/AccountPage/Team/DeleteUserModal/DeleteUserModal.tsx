import ConfirmationPrompt from '../../../ConfirmationPrompt';
import { getPluralText } from '../../../../utils/utils';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  selected: string[];
}

const DeleteUserModal = ({ open, onConfirm, setOpen, selected }: Props) => {
  return (
    <ConfirmationPrompt
      open={open}
      setOpen={setOpen}
      handleConfirmation={onConfirm}
      title={`Are you sure you want to delete ${getPluralText(selected, 'user')}?`}
      description={`Deleting ${getPluralText(
        selected,
        'user'
      )} will remove all of their access to Fusebit. You will have to re-add them again.`}
    />
  );
};

export default DeleteUserModal;
