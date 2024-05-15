import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";

export const useProfilePlaces = (filters = {}, options = {}) => {
  const places = useQuery({
    queryKey: ["places", filters],
    queryFn: () =>
      axiosApi({ url: "/profile/places" }).then(
        (res) => res?.data?.Data?.items?.data
      ),
    ...options,
    keepPreviousData: true,
  });

  return { ...places };
};
