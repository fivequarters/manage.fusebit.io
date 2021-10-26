import ConfirmationPrompt from '../../common/ConfirmationPrompt';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
}

const DeleteBackendModal = ({ open, setOpen, onConfirm }: Props) => {
  return (
    <ConfirmationPrompt
      open={open}
      setOpen={setOpen}
      handleConfirmation={onConfirm}
      title="Are you sure you want to delete this application?"
      description="All calls from your application to Fusebit that use this key will fail. Before deleting this key, make sure your application is no longer using this key."
      confirmationButtonText="Delete"
    />
  );
};

export default DeleteBackendModal;
