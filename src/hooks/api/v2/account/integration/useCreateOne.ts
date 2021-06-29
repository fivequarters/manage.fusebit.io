import { useMutation } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const useAccountIntegrationCreateIntegration = <T>(params: Params) => {
    const { axios } = useAxios();
    
    return useMutation(
        ["accountIntegrationCreateIntegration", params], 
        () => axios<T>(`/v2/account/${params.accountId}/subscription/${params.subscriptionId}/integration`, 'post', params)
    );
}