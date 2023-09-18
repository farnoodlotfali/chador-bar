import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useProductUnit = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const productUnit = useQuery({
    queryKey: ["productUnit", filters],
    queryFn: () =>
      axiosApi({ url: `/product-unit${queryParams}` }).then(
        (res) => res.data.Data
      ),

    ...options,
    staleTime: Infinity,
  });

  return { ...productUnit };
};
