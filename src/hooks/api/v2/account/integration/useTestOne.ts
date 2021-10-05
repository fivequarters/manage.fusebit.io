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
        
        if (window.editor) {
          const { method, url } = getIntegrationConfig(params.id).runner;

          window.editor.serverLogsEntry(
            JSON.stringify({ msg: `Sending ${method.toUpperCase()} request to ${url}`, level: 30 })
          );
        }

      },
      onError: (err) => {
        if (window.editor) {
          window.editor.finishRun(JSON.stringify(err));
        }
      },
      onSuccess: (res) => {
        if (window.editor) {
          const data = res.data ? ` \n${JSON.stringify(res.data, null, ' ')}` : '';

          window.editor.serverLogsEntry(
            JSON.stringify({
              msg: `Received response status ${res?.fullResponse.status}${data}`,
              level: 30,
            })
          );
        }

      },
    }
  );
};
