import { useMutation } from 'react-query';
import { Params } from '../../../../../interfaces/api';
import { LS_KEY } from '../../../../../utils/utils';
import { useAxios } from '../../../../useAxios';
import { useContext } from '../../../../useContext';

export const useAccountUpdateOne = <T>() => {
  const { axios } = useAxios();
  const { userData, setUserData } = useContext();

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

        localStorage.setItem(LS_KEY, JSON.stringify(newUserData));
        setUserData(newUserData);

        return () => {
          localStorage.setItem(LS_KEY, JSON.stringify(userData));
          setUserData(userData);
        };
      },
      onError: (_, __, rollback) => rollback?.(),
    }
  );
};
