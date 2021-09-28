import { useMutation } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';
import { useContext } from '../../../../useContext';
import { getIntegrationConfig } from '../../../../../utils/localStorage';

export const useAccountIntegrationTestIntegration = () => {
  const { axios } = useAxios({ ignoreInterceptors: true });
  const { userData } = useContext();

  return useMutation(
    (params: Params) => {
      const { id, tenantId } = params;
      const {
        method = 'post',
        payload,
        url = `/api/tenant/${encodeURIComponent(tenantId)}/test`,
      } = getIntegrationConfig(id).runner;

      return axios(
        `/v2/account/${userData.accountId}/subscription/${userData.subscriptionId}/integration/${id}${url}`,
        method,
        payload,
        {
          'Content-Type': 'application/json',
        }
      );
    },
    {
      onMutate: (params: Params) => {
        window.editor.startRun(`${params.method || 'post'}`.toUpperCase());
      },
      onError: (err) => {
        window.editor.finishRun(JSON.stringify(err));
      },
      onSuccess: (res) => {
        window.editor.finishRun(undefined, { ...(res?.fullResponse || {}), text: JSON.stringify(res.data) });
      },
    }
  );
};
