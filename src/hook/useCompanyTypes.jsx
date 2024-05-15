import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useCompanyTypes = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const companyTypes = useQuery({
    queryKey: ["companyTypes", filters],
    queryFn: () =>
      axiosApi({ url: `/company-types${queryParams}` }).then(
        (res) => res?.data?.Data
      ),
    keepPreviousData: true,
    staleTime: Infinity,
    ...options,
  });

  return { ...companyTypes };
};
