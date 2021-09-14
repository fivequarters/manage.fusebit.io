import { useMutation } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';
import { ACCOUNT_USER_GET_ALL } from './useGetAll';
import useOptimisticDelete from '../../../../useOptimisticDelete';
import { useContext } from '../../../../useContext';

export const useAccountUserDeleteOne = <T>() => {
  const { axios } = useAxios();
  const { userData } = useContext();
  const optimisticDelete = useOptimisticDelete({ queryKey: [ACCOUNT_USER_GET_ALL, { accountId: userData.accountId }] });

  return useMutation((params: Params) => {
    const { accountId, userId } = params;
    return axios<T>(`/v1/account/${accountId}/user/${userId}`, 'delete');
  }, optimisticDelete);
};
