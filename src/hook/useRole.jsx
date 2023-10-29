import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useRole = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const role = useQuery({
    queryKey: ["role", filters],
    queryFn: () =>
      axiosApi({ url: `/role${queryParams}` }).then((res) => res.data.Data),
    keepPreviousData: true,
    ...options,
  });

  return { ...role };
};


export const useInfiniteRole = (filters = {}, options = {}) => {
  const infiniteRole = useInfiniteQuery(
    ["role", filters, { infinite: true }],
    ({ pageParam = filters.page ?? 1 }) => {
      const queryParams = filteringMethod({ page: pageParam, ...filters });

      return axiosApi({ url: `/role${queryParams}` }).then(
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

  return { ...infiniteRole };
};
