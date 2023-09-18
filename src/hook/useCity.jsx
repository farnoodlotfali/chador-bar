import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useCity = (filters = {}, options = {}) => {
  filters = Object.keys(filters).length === 0 ? { province_id: 1 } : filters;
  const queryParams = filteringMethod(filters);
  const city = useQuery({
    queryKey: ["city", filters],
    queryFn: () =>
      axiosApi({ url: `/city${queryParams}` }).then((res) => res.data.Data),
    keepPreviousData: true,
    ...options,
  });

  return { ...city };
};
