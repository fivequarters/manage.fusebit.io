import { useQuery } from 'react-query';
import { Params } from '../../../../../../interfaces/api';
import { FusebitAxios, useAxios } from '../../../../../useAxios';

export const getAllInstances = <T>(axiosInstance: FusebitAxios, params: Params) => {
  return axiosInstance<T>(
    `/v2/account/${params.accountId}/subscription/${params.subscriptionId}/integration/${params.id}/instance`,
    'get',
    params
  );
};

export const useAccountIntegrationInstanceGetAll = <T>(params: Params) => {
  const { axios } = useAxios();

  const { enabled, ...queryParams } = params;

  return useQuery(['accountIntegrationInstanceGetAll', queryParams], () => getAllInstances<T>(axios, queryParams), {
    enabled: !!enabled,
  });
};
