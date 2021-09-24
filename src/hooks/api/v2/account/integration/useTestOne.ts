import { useMutation } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';
import { useContext } from '../../../../useContext';

export const useAccountIntegrationTestIntegration = () => {
  const { axios } = useAxios();
  const { userData } = useContext();

  return useMutation((params: Params) => {
    const { id, tenantId } = params;

    return axios(
      `/v2/account/${userData.accountId}/subscription/${
        userData.subscriptionId
      }/integration/${id}/api/tenant/${encodeURIComponent(tenantId)}/test`,
      'post'
    );
  });
};
