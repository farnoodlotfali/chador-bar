import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useTimePeriods = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);

  const timePeriods = useQuery({
    queryKey: ["timePeriods", filters],
    queryFn: async () => {
      try {
        const res = await axiosApi({ url: `/time-periods${queryParams}` });
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
  return { ...timePeriods };
};
