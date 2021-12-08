import { useMutation } from 'react-query';
import { Params } from '@interfaces/api';
import { useAxios } from '@hooks/useAxios';
import { useAuthContext } from '@hooks/useAuthContext';
import { getIntegrationConfig } from '@utils/localStorage';

const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;

export const useAccountIntegrationTestIntegration = (integrationId: string) => {
  const { axios } = useAxios({ ignoreInterceptors: true });
  const { userData, getTenantId } = useAuthContext();
  const integrationConfig = getIntegrationConfig(integrationId, getTenantId());

  const integrationUrl = `/v2/account/${userData.accountId}/subscription/${userData.subscriptionId}/integration`;

  return useMutation(
    (params: Params) => {
      const { tenantId } = params;
      const {
        method = 'post',
        payload,
        url = `/api/tenant/${encodeURIComponent(tenantId)}/test`,
      } = integrationConfig.runner;
      return axios(`${integrationUrl}/${integrationId}${url}`, method, payload, {
        'Content-Type': 'application/json',
      });
    },
    {
      onMutate: () => {
        const { method, url } = integrationConfig.runner;

        window.editor?.serverLogsEntry(
          JSON.stringify({
            msg: `Sending ${method.toUpperCase()} request to ${REACT_APP_FUSEBIT_DEPLOYMENT}${integrationUrl}/${integrationId}${url}`,
            level: 30,
          })
        );
      },
      onError: (err) => {
        const error = err as any;
        if (error.response) {
          // HTTP error
          return window.editor?.finishRun(JSON.stringify(error.response.data, null, 2));
        }

        if (error.status) {
          // Misc. network or CORS error
          return window.editor?.finishRun(`${error.status}`);
        }

        // Fall through to the default handler
        if (error.isAxiosError && error.config.headers.Authorization) {
          // Strip out sensitive headers
          error.config.headers.Authorization = '... present ...';
        }

        // The stack is usually some internal part of the website; not useful for the end user.
        delete error.stack;

        return window.editor?.finishRun(`${JSON.stringify(error, null, 2)}`);
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
