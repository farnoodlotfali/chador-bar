import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useRole = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const role = useQuery({
    queryKey: ["role", filters],
    queryFn: () =>
      axiosApi({ url: `/role${queryParams}` }).then((res) => res.data.Data),
    keepPreviousData: true,
    ...options,
  });

  return { ...role };
};
