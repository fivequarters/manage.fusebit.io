import { useSnackbar } from 'notistack';

export const useSuccess = () => {
  const { enqueueSnackbar } = useSnackbar();

  const createSuccess = (msg?: string) => {
    const message = msg || 'Operation successfuly completed';

    enqueueSnackbar(message, {
      variant: 'success',
      preventDuplicate: true,
    });
  };

  return {
    createSuccess,
  };
};
