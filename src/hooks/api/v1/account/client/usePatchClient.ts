import { useMutation } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const usePatchClient = <T>() => {
  const { axios } = useAxios();

  return useMutation(
    (params: Params) => {
      const { accountId, clientId, clientChanges } = params;
      return axios<T>(`/v1/account/${accountId}/client/${clientId}`, 'patch', clientChanges);
    },
    {
      onMutate: (_: Params) => () => {},
      onError: (_, __, rollback) => rollback?.(),
      onSettled: () => {},
    }
  );
};
