export type SnackbarType = 'success' | 'warning' | 'error' | 'info';
export type SnackbarVertical = 'bottom' | 'top';
export type SnackbarHorizontal = 'center' | 'left' | 'right';

export interface Snackbar {
  open: boolean;
  message: string;
  type: SnackbarType;
  vertical: SnackbarVertical;
  horizontal: SnackbarHorizontal;
}
