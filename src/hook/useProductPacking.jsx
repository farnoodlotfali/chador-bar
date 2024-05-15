import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useProductPacking = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const productPacking = useQuery({
    queryKey: ["productPacking", filters],
    queryFn: () =>
      axiosApi({ url: `/packing${queryParams}` }).then((res) => res.data.Data),
    keepPreviousData: true,
    staleTime: Infinity,
    ...options,
  });

  return { ...productPacking };
};

export const useInfinitePacking = (filters = {}, options = {}) => {
  const infinitePacking = useInfiniteQuery(
    ["productPacking", filters, { infinite: true }],
    ({ pageParam = filters.page ?? 1 }) => {
      const queryParams = filteringMethod({ page: pageParam, ...filters });

      return axiosApi({ url: `/packing${queryParams}` }).then(
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

  return { ...infinitePacking };
};
