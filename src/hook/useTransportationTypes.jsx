import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { memo } from "react";

const defaultValues = {
  fixed: "fixed",
  percent: "percent",
  dynamic: "dynamic",
};

export const useTransportationTypes = () => {
  const transportation = useQuery(
    ["transportationTypes"],
    async () => {
      try {
        const res = await axiosApi({ url: "/transportation-types" });
        return res.data.Data;
      } catch (error) {
        throw error;
      }
    },
    {
      staleTime: Infinity,
    }
  );

  if (transportation.isSuccess) {
    return { ...transportation };
  }
  return { data: defaultValues };
};
