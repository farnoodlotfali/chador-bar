import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useFleet = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const fleet = useQuery({
    queryKey: ["fleet", filters],
    queryFn: () =>
      axiosApi({ url: `/fleet${queryParams}` }).then((res) => res.data.Data),
    keepPreviousData: true,
    ...options,
  });

  return { ...fleet };
};

export const useInfiniteFleet = (filters = {}, options = {}) => {
  const infiniteFleet = useInfiniteQuery(
    ["fleet", filters, { infinite: true }],
    ({ pageParam = filters.page ?? 1 }) => {
      const queryParams = filteringMethod({ page: pageParam, ...filters });

      return axiosApi({ url: `/fleet${queryParams}` }).then(
        (res) => res.data.Data
      );
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.current_page !== lastPage.last_page
          ? lastPage.current_page + 1
          : undefined;
      },
      staleTime: 1 * 60 * 1000,
      keepPreviousData: true,
      ...options,
    }
  );

  return { ...infiniteFleet };
};
