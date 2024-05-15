import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useTransaction = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const transaction = useQuery({
    queryKey: ["transaction", filters],
    queryFn: () =>
      axiosApi({ url: `/transaction${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    ...options,
  });

  return { ...transaction };
};
