import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const usePermission = (filters = {}) => {
  const queryParams = filteringMethod(filters);
  const permission = useQuery({
    queryKey: ["permission", filters],
    queryFn: () =>
      axiosApi({ url: `/permission${queryParams}` }).then((res) => res.data.Data),
    keepPreviousData: true,
  });

  return { ...permission };
};
