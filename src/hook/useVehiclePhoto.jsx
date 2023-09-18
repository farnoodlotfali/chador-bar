import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useVehiclePhoto = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const vehiclePhoto = useQuery({
    queryKey: ["vehiclePhoto", filters],
    queryFn: () =>
      axiosApi({ url: `/vehicle-photos${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    ...options,
  });

  return { ...vehiclePhoto };
};
