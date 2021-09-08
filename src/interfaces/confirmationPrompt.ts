export interface Props {
  open: boolean;
  setOpen: Function;
  handleConfirmation: Function;
  title: string;
  description: string;
  confirmationButtonText?: string;
}
