import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useRefueling = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const refueling = useQuery({
    queryKey: ["refueling", filters],
    queryFn: async () => {
      try {
        const res = await axiosApi({ url: `/refueling${queryParams}` });
        return res.data.Data;
      } catch (error) {}
    },
    keepPreviousData: true,
    ...options,
  });

  return { ...refueling };
};
