import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useBeneficiary = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const beneficiary = useQuery({
    queryKey: ["beneficiary", filters],
    queryFn: () =>
      axiosApi({ url: `/beneficiary${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    ...options,
  });

  return { ...beneficiary };
};
