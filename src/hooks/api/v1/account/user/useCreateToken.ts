import { useMutation } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const useAccountUserCreateToken = <T>() => {
    const { axios } = useAxios();
    
    return useMutation((params: Params) => {
        const { accountId, userId, ...data } = params;
        return axios<T>(`/v1/account/${accountId}/user/${userId}/init`, 'post', data);
    }, {
        onMutate: (_: Params) => () => {},
        onError: (_, __, rollback) => rollback?.(),
        onSettled: () => {},
    });
}