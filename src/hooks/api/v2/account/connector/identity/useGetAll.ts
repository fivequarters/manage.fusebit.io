import { useQuery } from 'react-query';
import { Params } from '../../../../../../interfaces/api';
import { useAxios } from '../../../../../useAxios';

export const useAccountConnectorIdentityGetAll = <T>(params: Params) => {
    const { axios } = useAxios();
    
    return useQuery(
        "accountConnectorIdentityGetAll", 
        () => axios<T>(`/v2/account/${params.accountId}/subscription/${params.subscriptionId}/connector/${params.id}/identity`, 'get', params), 
        { enabled: !!params.enabled }
    );
}