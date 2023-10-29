import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useSuperAppGroup = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const superAppGroup = useQuery({
    queryKey: ["superApp", "group", filters],
    queryFn: () =>
      axiosApi({ url: `/super-app/group${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    ...options,
  });

  return { ...superAppGroup };
};

export const useInfiniteSuperAppGroup = (filters = {}, options = {}) => {
  const infiniteSuperAppGroup = useInfiniteQuery(
    ["superApp", "group", filters, { infinite: true }],
    ({ pageParam = filters.page ?? 1 }) => {
      const queryParams = filteringMethod({ page: pageParam, ...filters });

      return axiosApi({ url: `/super-app/group${queryParams}` }).then(
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

  return { ...infiniteSuperAppGroup };
};
