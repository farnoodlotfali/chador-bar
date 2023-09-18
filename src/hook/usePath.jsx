import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const usePath = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const path = useQuery({
    queryKey: ["path", filters],
    queryFn: () =>
      axiosApi({ url: `/path${queryParams}` }).then((res) => res.data.Data),
    keepPreviousData: true,
    ...options,
  });

  return { ...path };
};
