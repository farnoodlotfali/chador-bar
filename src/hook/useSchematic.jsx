import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useSchematic = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const schematic = useQuery({
    queryKey: ["schematic", filters],
    queryFn: () =>
      axiosApi({ url: `/schematic${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    ...options,
  });

  return { ...schematic };
};
