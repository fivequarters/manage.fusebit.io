import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import { Params } from '../../../../../interfaces/api';
import { useAxios } from '../../../../useAxios';
import { useContext } from '../../../../useContext';
import { getIntegrationConfig } from '../../../../../utils/localStorage';
import { useGetRedirectLink } from '../../../../useGetRedirectLink';

export const useAccountIntegrationTestIntegration = () => {
  const { id: integrationId } = useParams<{ id: string }>();
  const { axios } = useAxios({ ignoreInterceptors: true });
  const { userData } = useContext();
  const { REACT_APP_FUSEBIT_DEPLOYMENT } = process.env;
  const { getRedirectLink } = useGetRedirectLink();
  const integrationBaseUrl = `${REACT_APP_FUSEBIT_DEPLOYMENT}/v2${getRedirectLink(`/integration/${integrationId}`)}`;

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
        const { method, url } = getIntegrationConfig(params.id).runner;

        window.editor?.serverLogsEntry(
          JSON.stringify({
            msg: `Sending ${method.toUpperCase()} request to ${integrationBaseUrl}${url}`,
            level: 30,
          })
        );
      },
      onError: (err) => {
        window.editor?.finishRun(JSON.stringify(err));
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
