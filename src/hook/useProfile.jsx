import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useProfile = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const profile = useQuery({
    queryKey: ["profile", filters],
    queryFn: () => axiosApi({ url: "/profile" }).then((res) => res.data.Data),
    ...options,
    keepPreviousData: true,
  });

  return { ...profile };
};
