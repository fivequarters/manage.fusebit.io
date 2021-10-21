import { useMutation } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { useAuthContext } from '../../../../useAuthContext';
import { useAxios } from '../../../../useAxios';

export const useAccountUpdateOne = <T>() => {
  const { axios } = useAxios();
  const { userData, setUserData } = useAuthContext();

  return useMutation(
    (params: Params) => {
      const { accountId, ...data } = params;
      return axios<T>(`/v1/account/${accountId}`, 'patch', data);
    },
    {
      onMutate: ({ displayName }: Params) => {
        const newUserData = {
          ...userData,
          company: displayName,
        };

        setUserData(newUserData);

        return () => {
          setUserData(userData);
        };
      },
      onError: (_, __, rollback) => rollback?.(),
    }
  );
};
