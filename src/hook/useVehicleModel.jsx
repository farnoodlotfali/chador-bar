import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useVehicleModel = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const vehicleModel = useQuery({
    queryKey: ["vehicleModel", filters],
    queryFn: () =>
      axiosApi({ url: `/vehicle-model${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    ...options,
  });

  return { ...vehicleModel };
};

export const useInfiniteVehicleModel = (filters = {}, options = {}) => {
  const infiniteVehicleModel = useInfiniteQuery(
    ["vehicleModel", filters, { infinite: true }],
    ({ pageParam = filters.page ?? 1 }) => {
      const queryParams = filteringMethod({ page: pageParam, ...filters });

      return axiosApi({ url: `/vehicle-model${queryParams}` }).then(
        (res) => res.data.Data
      );
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.current_page !== lastPage.last_page
          ? lastPage.current_page + 1
          : undefined;
      },
      staleTime: 1 * 60 * 1000,
      keepPreviousData: true,
      ...options,
    }
  );

  return { ...infiniteVehicleModel };
};
