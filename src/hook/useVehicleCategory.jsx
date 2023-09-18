import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useVehicleCategory = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const vehicleCategory = useQuery({
    queryKey: ["vehicleCategory", filters],
    queryFn: () =>
      axiosApi({ url: `/vehicle-category${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    ...options,
  });

  return { ...vehicleCategory };
};
