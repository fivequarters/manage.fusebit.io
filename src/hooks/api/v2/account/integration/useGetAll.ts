import { useQuery } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const useAccountIntegrationsGetAll = <T>(params: Params) => {
    const { axios } = useAxios();
    
    return useQuery(
        "accountIntegrationsGetAll", 
        () => axios<T>(`/v2/account/${params.accountId}/subscription/${params.subscriptionId}/integration`, 'get', params), 
        { enabled: !!params.enabled }
    );
}