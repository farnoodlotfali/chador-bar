import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useFleetGroup = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const fleetGroup = useQuery({
    queryKey: ["fleet-group", filters],
    queryFn: () =>
      axiosApi({ url: `/fleet-group${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    ...options,
  });

  return { ...fleetGroup };
};

export const useInfiniteFleetGroup = (filters = {}, options = {}) => {
  const infiniteFleetGroup = useInfiniteQuery(
    ["fleet-group", filters, { infinite: true }],
    ({ pageParam = filters.page ?? 1 }) => {
      const queryParams = filteringMethod({ page: pageParam, ...filters });

      return axiosApi({ url: `/fleet-group${queryParams}` }).then(
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

  return { ...infiniteFleetGroup };
};
