import { useSnackbar } from 'notistack';

export const useError = () => {
  const { enqueueSnackbar } = useSnackbar();

  const createError = (err: any) => {
    // the element 0 shows the key, the 1 show the value, i only want the value so i get the element 1
    const message = err?.response?.data?.message?.split(':')?.[1] || 'There was an error';
    enqueueSnackbar(message, {
      variant: 'error',
      preventDuplicate: true,
    });
  };

  return {
    createError,
  };
};
