import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { filteringMethod } from "Utility/utils";

export const useVehicleColor = (filters = {}, options = {}) => {
  const queryParams = filteringMethod(filters);
  const vehicleColor = useQuery({
    queryKey: ["vehicleColor", filters],
    queryFn: () =>
      axiosApi({ url: `/vehicle-colors${queryParams}` }).then(
        (res) => res.data.Data
      ),
    keepPreviousData: true,
    staleTime: Infinity,
    ...options,
  });

  return { ...vehicleColor };
};

// export const useInfiniteVehicleColor = (filters = {}, options = {}) => {
//   const infiniteVehicleColor = useInfiniteQuery(
//     ["vehicleColor", filters],
//     ({ pageParam = filters.page ?? 1 }) => {
//       const queryParams = filteringMethod({ page: pageParam, ...filters });

//       return axiosApi({ url: `/vehicle-colors${queryParams}` }).then(
//         (res) => res.data.Data
//       );
//     },
//     {
//       getNextPageParam: (lastPage, allPages) => {
//         return lastPage.items.current_page !== lastPage.items.last_page
//           ? lastPage.items.current_page + 1
//           : undefined;
//       },
//       staleTime: 1 * 60 * 1000,
//       keepPreviousData: true,
//     }
//   );

//   return { ...infiniteVehicleColor };
// };
