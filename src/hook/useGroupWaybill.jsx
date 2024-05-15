import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useGroupWaybill = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const waybillGroup = useQuery({
    queryKey: ["waybillGroup", filters],
    queryFn: () =>
      axiosApi({ url: `/waybill-number${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    ...options,
  });

  return { ...waybillGroup };
};
