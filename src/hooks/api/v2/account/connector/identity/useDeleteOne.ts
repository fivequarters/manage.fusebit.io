import { useMutation, useQueryClient } from 'react-query';
import { useParams } from 'react-router';
import { Params } from '../../../../../../interfaces/api';
import { useAxios } from '../../../../../useAxios';
import { useContext } from '../../../../../useContext';

export const useAccountConnectorIdentityDeleteOne = <T>() => {
  const { axios } = useAxios();
  const queryClient = useQueryClient();
  const { userData } = useContext()
  const { id: connectorId } = useParams<{ id: string }>()

  return useMutation(
    (params: Params) => {
      return axios<T>(
        `/v2/account/${userData.accountId}/subscription/${userData.subscriptionId}/connector/${connectorId}/identity/${params.id}`,
        'delete'
      );
    },
    {
      onMutate: (_: Params) => () => { },
      onError: (_, __, rollback) => rollback?.(),
      onSuccess: () => queryClient.removeQueries('accountConnectorIdentityGetAll'),
    }
  );
};
