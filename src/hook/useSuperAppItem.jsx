import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useSuperAppItem = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const superAppItem = useQuery({
    queryKey: ["superApp", "item", filters],
    queryFn: () =>
      axiosApi({ url: `/super-app/item${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    ...options,
  });

  return { ...superAppItem };
};

export const useInfiniteSuperAppItem = (filters = {}, options = {}) => {
  const infiniteSuperAppItem = useInfiniteQuery(
    ["superApp", "item", filters, { infinite: true }],
    ({ pageParam = filters.page ?? 1 }) => {
      const queryParams = filteringMethod({ page: pageParam, ...filters });

      return axiosApi({ url: `/super-app/item${queryParams}` }).then(
        (res) => res.data.Data
      );
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.items.current_page !== lastPage.items.last_page
          ? lastPage.items.current_page + 1
          : undefined;
      },
      staleTime: 1 * 60 * 1000,
      keepPreviousData: true,
      ...options,
    }
  );

  return { ...infiniteSuperAppItem };
};
