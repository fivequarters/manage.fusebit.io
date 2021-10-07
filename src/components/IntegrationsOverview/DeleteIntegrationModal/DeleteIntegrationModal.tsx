import ConfirmationPrompt from '../../common/ConfirmationPrompt';
import { getPluralText } from '../../../utils/utils';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  selected: string[];
}

const DeleteIntegrationModal = ({ open, onConfirm, setOpen, selected }: Props) => {
  return (
    <ConfirmationPrompt
      open={open}
      setOpen={setOpen}
      handleConfirmation={onConfirm}
      title={`Are you sure you want to delete ${getPluralText(selected, 'integration')}?`}
      description="You cannot undo this action and any linked applications may not work as expected."
    />
  );
};

export default DeleteIntegrationModal;
