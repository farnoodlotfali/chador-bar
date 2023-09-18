import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";

export const useContractTypes = () => {
  const contractTypes = useQuery(
    ["contractTypes"],
    () => axiosApi({ url: "/contract-types" }).then((res) => res.data.Data),
    {
      staleTime: Infinity,
    }
  );

  return { ...contractTypes };
};
