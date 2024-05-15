import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useRequest = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const request = useQuery({
    queryKey: ["request", filters],
    queryFn: () =>
      axiosApi({ url: `/request${queryParams}` }).then((res) => res.data.Data),
    keepPreviousData: true,
    ...options,
  });

  return { ...request };
};

export const useRequestFree = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const request = useQuery({
    queryKey: ["requestFree", filters],
    queryFn: () =>
      axiosApi({ url: `/free-requests-info${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    ...options,
  });

  return { ...request };
};
export const useRequestFreeProducts = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const request = useQuery({
    queryKey: ["requestFreeProducts", filters],
    queryFn: () =>
      axiosApi({ url: `/free-requests-products${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    ...options,
  });

  return { ...request };
};

export const useRequestFreeCitiesSource = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const request = useQuery({
    queryKey: ["requestFreeCities", filters],
    queryFn: () =>
      axiosApi({
        url: `/free-requests-cities${queryParams}`,
      }).then((res) => res.data.Data),
    keepPreviousData: true,
    ...options,
  });

  return { ...request };
};
export const useRequestFreeCitiesDestination = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const request = useQuery({
    queryKey: ["requestFreeCities", filters],
    queryFn: () =>
      axiosApi({
        url: `/free-requests-cities${queryParams}`,
      }).then((res) => res.data.Data),
    keepPreviousData: true,
    ...options,
  });

  return { ...request };
};
export const useInfiniteRequest = (filters = {}, options = {}) => {
  const infiniteRequest = useInfiniteQuery(
    ["requestFree", filters, { infinite: true }],
    ({ pageParam = filters.page ?? 1 }) => {
      const queryParams = filteringMethod({ page: pageParam, ...filters });

      return axiosApi({ url: `/request${queryParams}` }).then(
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

  return { ...infiniteRequest };
};
