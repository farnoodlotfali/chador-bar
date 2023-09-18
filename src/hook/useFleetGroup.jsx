import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useFleetGroup = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const fleetGroup = useQuery({
    queryKey: ["fleet-group", filters],
    queryFn: () =>
      axiosApi({ url: `/fleet-group${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    ...options,
  });

  return { ...fleetGroup };
};
