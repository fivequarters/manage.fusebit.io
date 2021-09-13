import { useQuery } from 'react-query';
import { Params } from '../../../../../../interfaces/api';
import { useAxios } from '../../../../../useAxios';

export const useAccountConnectorIdentityGetAll = <T>(params: Params) => {
  const { axios } = useAxios();

  const { enabled, ...queryParams } = params

  return useQuery(
    ['accountConnectorIdentityGetAll', queryParams],
    () =>
      axios<T>(
        `/v2/account/${queryParams.accountId}/subscription/${queryParams.subscriptionId}/connector/${queryParams.id}/identity`,
        'get',
        params
      ),
    { enabled: !!enabled }
  );
};
