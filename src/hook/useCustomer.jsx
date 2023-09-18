import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useCustomer = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const customer = useQuery({
    queryKey: ["customer", filters],
    queryFn: () =>
      axiosApi({ url: `/customer${queryParams}` }).then((res) => res.data.Data),
    keepPreviousData: true,
    ...options,
  });

  return { ...customer };
};

export const useInfiniteCustomer = (filters = {}, options = {}) => {
  const infiniteProduct = useInfiniteQuery(
    ["customer", filters, { infinite: true }],
    ({ pageParam = filters.page ?? 1 }) => {
      const queryParams = filteringMethod({ page: pageParam, ...filters });

      return axiosApi({ url: `/customer${queryParams}` }).then(
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

  return { ...infiniteProduct };
};
