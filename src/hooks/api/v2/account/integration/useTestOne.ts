import { useMutation } from 'react-query';
import { Params } from '@interfaces/api';
import { useAxios } from '@hooks/useAxios';
import { useAuthContext } from '@hooks/useAuthContext';
import { getIntegrationConfig } from '@utils/localStorage';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

export const useAccountIntegrationTestIntegration = () => {
  const { axios } = useAxios({ ignoreInterceptors: true });
  const { userData } = useAuthContext();

  const integrationUrl = `/v2/account/${userData.accountId}/subscription/${userData.subscriptionId}/integration`;

  return useMutation(
    (params: Params) => {
      const { id, tenantId } = params;
      const {
        method = 'post',
        payload,
        url = `/api/tenant/${encodeURIComponent(tenantId)}/test`,
      } = getIntegrationConfig(id).runner;
      return axios(`${integrationUrl}/${id}${url}`, method, payload, {
        'Content-Type': 'application/json',
      });
    },
    {
      onMutate: (params: Params) => {
        const { method, url } = getIntegrationConfig(params.id).runner;

        window.editor?.serverLogsEntry(
          JSON.stringify({
            msg: `Sending ${method.toUpperCase()} request to ${REACT_APP_FUSEBIT_DEPLOYMENT}${integrationUrl}/${
              params.id
            }${url}`,
            level: 30,
          })
        );
      },
      onError: (err) => {
        window.editor?.finishRun(JSON.stringify((err as any).response.data));
      },
      onSuccess: (res) => {
        const data = res.data ? ` \n${JSON.stringify(res.data, null, ' ')}` : '';

        window.editor?.serverLogsEntry(
          JSON.stringify({
            msg: `Received response status ${res?.fullResponse.status}${data}`,
            level: 30,
          })
        );
      },
    }
  );
};
