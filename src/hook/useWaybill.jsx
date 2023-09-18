import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useWaybill = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const waybill = useQuery({
    queryKey: ["waybill", filters],
    queryFn: () =>
      axiosApi({ url: `/waybill${queryParams}` }).then((res) => res.data.Data),
    keepPreviousData: true,
    ...options,
  });

  return { ...waybill };
};
