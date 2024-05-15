import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useSuperAppClient = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const superAppClient = useQuery({
    queryKey: ["superApp", "client", filters],
    queryFn: () =>
      axiosApi({ url: `/super-app/client${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    ...options,
  });

  return { ...superAppClient };
};

export const useInfiniteSuperAppClient = (filters = {}, options = {}) => {
  const infiniteSuperAppClient = useInfiniteQuery(
    ["superApp", "client", filters, { infinite: true }],
    ({ pageParam = filters.page ?? 1 }) => {
      const queryParams = filteringMethod({ page: pageParam, ...filters });

      return axiosApi({ url: `/super-app/client${queryParams}` }).then(
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

  return { ...infiniteSuperAppClient };
};
