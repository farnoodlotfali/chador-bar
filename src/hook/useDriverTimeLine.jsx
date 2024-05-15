import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useDriverTimeLine = (id, filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  
  const driverTimeline = useQuery({
    queryKey: ["driver", "driver-timeline", id, filters],
    queryFn: () =>
      axiosApi({ url: `/driver-timeline/${id}${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    ...options,
  });

  return driverTimeline;
};
