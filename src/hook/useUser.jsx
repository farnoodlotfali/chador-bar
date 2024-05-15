import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useUser = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const users = useQuery({
    queryKey: ["user", filters],
    queryFn: () =>
      axiosApi({ url: `/user${queryParams}` }).then((res) => res.data.Data),
    ...options,
    keepPreviousData: true,
  });

  return { ...users };
};

export const useInfiniteUser = (filters = {}, options = {}) => {
  const infiniteUser = useInfiniteQuery(
    ["user", filters, { infinite: true }],
    ({ pageParam = filters.page ?? 1 }) => {
      const queryParams = filteringMethod({ page: pageParam, ...filters });

      return axiosApi({ url: `/user${queryParams}` }).then(
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

  return { ...infiniteUser };
};
