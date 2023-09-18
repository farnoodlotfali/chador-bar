import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useVehicleBrand = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const vehicleBrand = useQuery({
    queryKey: ["vehicleBrand", filters],
    queryFn: () =>
      axiosApi({ url: `/vehicle-brand${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    ...options,
  });

  return { ...vehicleBrand };
};
