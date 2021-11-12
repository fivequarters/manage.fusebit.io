import { useSnackbar } from 'notistack';

export const useError = () => {
  const { enqueueSnackbar } = useSnackbar();

  const createError = (err: any) => {
    const defaultErrorMessage = 'There was an error';
    const possibleMessageOne = err?.response?.data?.message?.split(':')?.[1]; // the element 0 shows the key, the 1 show the value, i only want the value so i get the element 1
    const possibleMessageTwo = err?.message;
    const message = possibleMessageOne || possibleMessageTwo || defaultErrorMessage;

    enqueueSnackbar(message, {
      variant: 'error',
      preventDuplicate: true,
    });
  };

  return {
    createError,
  };
};
