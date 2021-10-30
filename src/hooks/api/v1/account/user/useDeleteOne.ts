import { useMutation } from 'react-query';
import { Params } from '@interfaces/api';
import { useAxios } from '@hooks/useAxios';
import useOptimisticDelete from '@hooks/useOptimisticDelete';
import { useAuthContext } from '@hooks/useAuthContext';
import { ACCOUNT_USER_GET_ALL } from './useGetAll';

export const useAccountUserDeleteOne = <T>() => {
  const { axios } = useAxios();
  const { userData } = useAuthContext();
  const optimisticDelete = useOptimisticDelete({ queryKey: [ACCOUNT_USER_GET_ALL, { accountId: userData.accountId }] });

  return useMutation((params: Params) => {
    const { accountId, userId } = params;
    return axios<T>(`/v1/account/${accountId}/user/${userId}`, 'delete');
  }, optimisticDelete);
};
