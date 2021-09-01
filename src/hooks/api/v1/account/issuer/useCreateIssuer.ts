import { useMutation } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const useAccountUserCreateIssuer = <T>() => {
  const { axios } = useAxios();

  return useMutation(
    (params: Params) => {
      const { accountId, issuer } = params;
      const issuerId = issuer.id;
      delete issuer.id;
      return axios<T>(`/v1/account/${accountId}/issuer/${issuerId}`, 'post', issuer);
    },
    {
      onMutate: (_: Params) => () => {},
      onError: (_, __, rollback) => rollback?.(),
      onSettled: () => {},
    }
  );
};
