import { useMutation } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';
import { ACCOUNT_USER_GET_ALL } from './useGetAll';
import useOptimisticDelete from '../../../../useOptimisticDelete';

export const useAccountUserDeleteOne = <T>() => {
  const { axios } = useAxios();
  const optimisticDelete = useOptimisticDelete({ queryKey: ACCOUNT_USER_GET_ALL });

  return useMutation((params: Params) => {
    const { accountId, userId } = params;
    return axios<T>(`/v1/account/${accountId}/user/${userId}`, 'delete');
  }, optimisticDelete);
};
