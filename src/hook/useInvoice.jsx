import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useInvoice = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const invoice = useQuery({
    queryKey: ["invoice", filters],
    queryFn: () =>
      axiosApi({ url: `/invoice${queryParams}` }).then((res) => res.data.Data),
    keepPreviousData: true,
    ...options,
  });

  return { ...invoice };
};
