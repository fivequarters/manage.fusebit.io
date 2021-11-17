import { useSnackbar } from 'notistack';

export const useError = () => {
  const { enqueueSnackbar } = useSnackbar();

  const createError = (err: any) => {
    const message = err?.response?.data?.message?.split(':')?.[1] || err?.message || 'There was an error';

    enqueueSnackbar(message, {
      variant: 'error',
      preventDuplicate: true,
    });
  };

  return {
    createError,
  };
};
