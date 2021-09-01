import { useMutation } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const useAccountUserCreateIssuer = <T>() => {
  const { axios } = useAxios();

  return useMutation(
    (params: Params) => {
      const { accountId, issuerId, data } = params;
      return axios<T>(`/v1/account/${accountId}/issuer/${issuerId}`, 'post', data);
    },
    {
      onMutate: (_: Params) => () => {},
      onError: (_, __, rollback) => rollback?.(),
      onSettled: () => {},
    }
  );
};
