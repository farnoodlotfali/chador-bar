import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useDateStatuses = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const dateStatuses = useQuery({
    queryKey: ["dateStatuses", filters],
    queryFn: async () => {
      try {
        const res = await axiosApi({ url: `/date-statuses${queryParams}` });
        return res.data.Data;
      } catch (error) {
        throw error;
      }
    },
    keepPreviousData: true,
    staleTime: Infinity,
    ...options,
  });
  //
  return { ...dateStatuses };
};
