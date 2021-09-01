import { useMutation } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const usePutStorage = <T>() => {
  const { axios } = useAxios();

  return useMutation(
    (params: Params) => {
      const { accountId, subscriptionId, storageId, data } = params;
      return axios<T>(`/v1/account/${accountId}/subscription/${subscriptionId}/storage/${storageId}`, 'put', { data });
    },
    {
      onMutate: (_: Params) => () => {},
      onError: (_, __, rollback) => rollback?.(),
      onSettled: () => {},
    }
  );
};
