import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useProjectTune = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const projectTune = useQuery({
    queryKey: ["projectTune", filters],
    queryFn: () =>
      axiosApi({ url: `/project-plan${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    ...options,
  });

  return { ...projectTune };
};

export const useInfiniteProjectTune = (filters = {}, options = {}) => {
  const infiniteProject = useInfiniteQuery(
    ["projectTune", filters, { infinite: true }],
    ({ pageParam = filters.page ?? 1 }) => {
      const queryParams = filteringMethod({ page: pageParam, ...filters });

      return axiosApi({ url: `/project-plan${queryParams}` }).then(
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

  return { ...infiniteProject };
};
