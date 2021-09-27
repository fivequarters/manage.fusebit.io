import { useMutation } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';
import { useContext } from '../../../../useContext';

export const useAccountIntegrationTestIntegration = () => {
  const { axios } = useAxios();
  const { userData } = useContext();

  return useMutation((params: Params) => {
    const { id, tenantId, method = 'post', url = `api/tenant/${encodeURIComponent(tenantId)}/test` } = params;

    return axios(
      `/v2/account/${userData.accountId}/subscription/${userData.subscriptionId
      }/integration/${id}/${url}`,
      method,
    );
  }, {
    onMutate: (params: Params) => {
      //@ts-ignore
      window.test.startRun(`${params.method || 'post'}`.toUpperCase())
    },
    onError: (err) => {
      //@ts-ignore
      window.test.finishRun(JSON.stringify(err))
    },
    onSuccess: (res) => {
      //@ts-ignore
      window.test.finishRun(null, { ...(res?.fullResponse || {}), text: JSON.stringify(res.data) })
    }
  })
};
