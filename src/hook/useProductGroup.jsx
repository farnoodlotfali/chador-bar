import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useProductGroup = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const productGroup = useQuery({
    queryKey: ["productGroup", filters],
    queryFn: () =>
      axiosApi({ url: `/product-group${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    staleTime: Infinity,
    ...options,
  });

  return { ...productGroup };
};
