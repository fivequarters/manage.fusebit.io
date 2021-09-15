import { useMutation, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { Params } from '../../../../../../interfaces/api';
import { useAxios } from '../../../../../useAxios';
import { useContext } from '../../../../../useContext';

export const useAccountIntegrationInstanceDeleteOne = <T>() => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();
  const { userData } = useContext();
  const { id: integrationId } = useParams<{ id: string }>();

  return useMutation(
    (params: Params) => {
      return axios<T>(
        `/v2/account/${userData.accountId}/subscription/${userData.subscriptionId}/integration/${integrationId}/instance/${params.id}`,
        'delete'
      );
    },
    {
      onMutate: (_: Params) => () => {},
      onError: (_, __, rollback) => rollback?.(),
      onSuccess: () => queryClient.removeQueries('accountIntegrationInstanceGetAll'),
    }
  );
};
