import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useFleetOwner = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const fleetOwner = useQuery({
    queryKey: ["fleetOwner", filters],
    queryFn: () =>
      axiosApi({ url: `/fleet-owner${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    ...options,
  });

  return { ...fleetOwner };
};
