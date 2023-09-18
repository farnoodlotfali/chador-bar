import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useProjectTune = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const projectTune = useQuery({
    queryKey: ["projectTune", filters],
    queryFn: () =>
      axiosApi({ url: `/project-plan${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    ...options,
  });

  return { ...projectTune };
};
