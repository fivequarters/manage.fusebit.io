import { useMutation } from 'react-query';
import { Params } from '@interfaces/api';
import { useAxios } from '@hooks/useAxios';
import { useAuthContext } from '@hooks/useAuthContext';

export const useAccountIntegrationCommitSession = () => {
  const { axios } = useAxios({ ignoreInterceptors: true });
  const { userData } = useAuthContext();

  return useMutation((params: Params) => {
    const { id, sessionId } = params;
    return axios<any>(
      `/v2/account/${userData.accountId}/subscription/${userData.subscriptionId}/integration/${id}/session/${sessionId}/commit`,
      'post'
    );
  });
};
