import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useProvince = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const province = useQuery({
    queryKey: ["province", filters],
    queryFn: () =>
      axiosApi({ url: `/province${queryParams}` }).then((res) => res.data.Data),
    keepPreviousData: true,
    ...options,
  });

  return { ...province };
};
