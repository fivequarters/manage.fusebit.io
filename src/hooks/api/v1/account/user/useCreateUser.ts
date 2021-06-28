import { useMutation } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const useAccountCreateUser = <T>(params: Params) => {
    const { axios } = useAxios();
    
    return useMutation(
        ["useAccountCreateUser", params], 
        () => axios<T>(`/v1/account/${params.accountId}/user`, 'post', params)
    );
}