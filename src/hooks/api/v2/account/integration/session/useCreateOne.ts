import { useMutation } from 'react-query';
import { Params } from '@interfaces/api';
import { CreateSessionPayload } from '@interfaces/createSessionPayload';
import { useAxios } from '@hooks/useAxios';
import { useAuthContext } from '@hooks/useAuthContext';

export const useAccountIntegrationCreateSession = () => {
  const { axios } = useAxios();
  const { userData } = useAuthContext();

  return useMutation((params: Params) => {
    const { id, tenantId } = params;
    return axios<CreateSessionPayload>(
      `/v2/account/${userData.accountId}/subscription/${userData.subscriptionId}/integration/${id}/session`,
      'post',
      {
        redirectUrl: `${window.location.origin}${window.location.pathname}`,
        tags: {
          'fusebit.tenantId': tenantId,
        },
      }
    );
  });
};
