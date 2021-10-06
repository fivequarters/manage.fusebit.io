import { useMutation } from 'react-query';
import { Params } from '../../../../../../interfaces/api';
import { useAxios } from '../../../../../useAxios';
import { useContext } from '../../../../../useContext';

export const useAccountIntegrationCommitSession = () => {
  const { axios } = useAxios({ ignoreInterceptors: true });
  const { userData } = useContext();

  return useMutation((params: Params) => {
    const { id, sessionId } = params;
    return axios<any>(
      `/v2/account/${userData.accountId}/subscription/${userData.subscriptionId}/integration/${id}/session/${sessionId}/commit`,
      'post'
    );
  });
};
