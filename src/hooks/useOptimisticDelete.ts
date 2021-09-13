import { useQueryClient, QueryKey, UseMutationOptions } from 'react-query';
import { Params } from '../interfaces/api';

type Props = {
  queryKey: QueryKey;
};

const useOptimisticDelete = ({
  queryKey,
}: Props): Partial<UseMutationOptions<unknown, unknown, Params, () => void>> => {
  const queryClient = useQueryClient();

  return {
    onMutate: async ({ id }: Params) => {
      await queryClient.cancelQueries(queryKey);

      const previous = queryClient.getQueryData<any>(queryKey);

      const newItems = [...(previous?.data?.items || [])];

      const index = newItems.findIndex((item) => item.id === id);

      newItems.splice(index, 1);

      queryClient.setQueryData(queryKey, (old: any) => {
        const { total = null } = previous?.data || {};

        return {
          ...old,
          data: {
            items: newItems,
            total: total ? total - 1 : null,
          },
        };
      });

      return () => {
        queryClient.setQueryData(queryKey, previous);
      };
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
    onError: (_, __, rollback) => rollback?.(),
  };
};

export default useOptimisticDelete;
