import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useDraft = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const draft = useQuery({
    queryKey: ["draft", filters],
    queryFn: () =>
      axiosApi({ url: `/draft${queryParams}` }).then((res) => res.data.Data),
    keepPreviousData: true,
    ...options,
  });

  return { ...draft };
};

export const useInfiniteDraft = (filters = {}, options = {}) => {
  const infiniteDraft = useInfiniteQuery(
    ["draft", filters, { infinite: true }],
    ({ pageParam = filters.page ?? 1 }) => {
      const queryParams = filteringMethod({ page: pageParam, ...filters });

      return axiosApi({ url: `/draft${queryParams}` }).then(
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

  return { ...infiniteDraft };
};
