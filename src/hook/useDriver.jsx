import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useDriver = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const driver = useQuery({
    queryKey: ["driver", filters],
    queryFn: () =>
      axiosApi({
        url: `/driver${queryParams}`,
      }).then((res) => res.data.Data),
    keepPreviousData: true,
    ...options,
  });

  return { ...driver };
};

export const useInfiniteDriver = (filters = {}, options = {}) => {
  const infiniteDriver = useInfiniteQuery(
    ["driver", filters, { infinite: true }],
    ({ pageParam = filters.page ?? 1 }) => {
      const queryParams = filteringMethod({ ...filters, page: pageParam });

      return axiosApi({ url: `/driver${queryParams}` }).then(
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

  return { ...infiniteDriver };
};
