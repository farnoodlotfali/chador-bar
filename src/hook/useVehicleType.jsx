import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useVehicleType = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const vehicleType = useQuery({
    queryKey: ["vehicleType", filters],
    queryFn: () =>
      axiosApi({ url: `/vehicle-type${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    ...options,
  });

  return { ...vehicleType };
};

export const useInfiniteVehicleType = (filters = {}, options = {}) => {
  const infiniteVehicle = useInfiniteQuery(
    ["vehicleType", filters, { infinite: true }],
    ({ pageParam = filters.page ?? 1 }) => {
      const queryParams = filteringMethod({ page: pageParam, ...filters });

      return axiosApi({ url: `/vehicle-type${queryParams}` }).then(
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

  return { ...infiniteVehicle };
};
