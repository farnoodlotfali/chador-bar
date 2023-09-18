import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useUser = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const users = useQuery({
    queryKey: ["user", filters],
    queryFn: () =>
      axiosApi({ url: `/user${queryParams}` }).then((res) => res.data.Data),
    ...options,
    keepPreviousData: true,
  });

  return { ...users };
};
