import { useMutation } from 'react-query';
import { Params } from '../../../../../../interfaces/api';
import { useAxios } from '../../../../../useAxios';
import { useContext } from '../../../../../useContext';

interface Props {
  skipRun: boolean;
}

export const useAccountIntegrationCommitSession = ({ skipRun } = {} as Props) => {
  const { axios } = useAxios();
  const { userData } = useContext();

  return useMutation(
    (params: Params) => {
      const { id, sessionId } = params;
      return axios<any>(
        `/v2/account/${userData.accountId}/subscription/${userData.subscriptionId}/integration/${id}/session/${sessionId}/commit`,
        'post'
      );
    },
  );
};
