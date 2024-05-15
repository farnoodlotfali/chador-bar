import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useMyMessage = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const myMessage = useQuery({
    queryKey: ["myMessage", filters],
    queryFn: () =>
      axiosApi({ url: `/my-messages${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    ...options,
  });

  return { ...myMessage };
};

export const useMyMessageCount = (filters = {}, options = {}) => {
  const myMessageCount = useQuery({
    queryKey: ["myMessageCount", filters],
    queryFn: () =>
      axiosApi({ url: "/my-messages/count" }).then((res) => res.data.Data),
    keepPreviousData: true,
    ...options,
  });

  return { ...myMessageCount };
};
export const useInfiniteMyMessage = (filters = {}, options = {}) => {
  const infiniteMyMessage = useInfiniteQuery(
    ["myMessage", filters, { infinite: true }],
    ({ pageParam = filters.page ?? 1 }) => {
      const queryParams = filteringMethod({ page: pageParam, ...filters });

      return axiosApi({ url: `/my-messages${queryParams}` }).then(
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

  return { ...infiniteMyMessage };
};
