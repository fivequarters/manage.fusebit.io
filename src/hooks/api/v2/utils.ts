import { ApiResponse } from '../../useAxios';

export const entityLoopThrough = async <T = any>(
  get: (next?: string) => Promise<ApiResponse<{ next: string; items: T[] }>>
) => {
  let next: string | undefined;
  const pages: T[][] = [];

  do {
    const { data } = await get(next);

    next = data.next;
    pages.push(data.items);
  } while (next);

  return pages.flat();
};
