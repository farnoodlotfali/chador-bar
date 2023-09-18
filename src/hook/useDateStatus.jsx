import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useDateStatus = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const dateStatus = useQuery({
    queryKey: ["dateStatus", filters],
    queryFn: () =>
      axiosApi({ url: `/dateStatus${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    ...options,
  });

  return { ...dateStatus };
};
