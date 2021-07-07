import { useQuery } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const useAccountConnectorsGetAll = <T>(params: Params) => {
    const { axios } = useAxios();
    
    return useQuery(
        "accountConnectorsGetAll", 
        () => axios<T>(`/v2/account/${params.accountId}/subscription/${params.subscriptionId}/connector`, 'get', params), 
        { enabled: !!params.enabled }
    );
}