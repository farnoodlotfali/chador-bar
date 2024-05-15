import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";

export const useOwnerTypes = (filter, options = {}) => {
  const owners = useQuery(
    ["ownerTypes"],
    async () => {
      try {
        const res = await axiosApi({ url: "/owner-types" });
        return res.data.Data;
      } catch (error) {
        throw error;
      }
    },
    {
      staleTime: Infinity,

      ...options,
    }
  );

  return { ...owners };
};
