import { useMutation, useQueryClient } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';

export const useAccountConnectorDeleteConnector = <T>() => {
    const { axios } = useAxios();
    const queryClient = useQueryClient();

    return useMutation((params: Params) => {
        const { accountId, subscriptionId, ...data } = params;
        return axios<T>(`/v2/account/${accountId}/subscription/${subscriptionId}/connector/${data.id}`, 'delete');
    }, {
        onMutate: (_: Params) => () => {},
        onError: (_, __, rollback) => rollback?.(),
        onSuccess: () => queryClient.removeQueries('accountConnectorsGetAll'),
    });
}