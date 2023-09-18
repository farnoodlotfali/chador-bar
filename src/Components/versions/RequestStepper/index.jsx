import { Skeleton } from "@mui/material";
import { useVersionENV } from "hook/useVersionENV";
import { Suspense } from "react";

const STEPS = [
  {
    name: "set",
    title: "ثبت شده",
    icon: "shield-check",
  },
  {
    name: "enabled",
    title: "آگهی شده",
    icon: "billboard",
  },
  {
    name: "submit",
    title: "انتخاب راننده",
    icon: "user-magnifying-glass",
  },
  {
    name: "wait_for_payment",
    icon: "money-bill-1-wave",
    title: "در انتظار پرداخت",
  },
  {
    name: "load_permit",
    icon: "truck-ramp",
    title: "اجازه بارگیری",
  },
  {
    name: "load",
    icon: "truck-ramp-box",
    title: "بارگیری",
  },
  {
    name: "load_confirm",
    icon: "truck-arrow-right",
    title: "تایید بارگیری",
  },
  {
    name: "issue_waybill",
    icon: "receipt",
    title: "صدور بارنامه",
  },
  {
    name: "delivered",
    icon: "boxes-stacked",
    title: "تحویل",
  },
  {
    name: "done",
    icon: "memo-circle-check",
    title: "انجام شده",
  },
];

const RequestStepper = ({ status, size = 30 }) => {
  const { LazyComponent } = useVersionENV("RequestStepper");

  return (
    <>
      <Suspense
        fallback={
          <Skeleton variant="rectangular" sx={{ width: "100%", height: 100 }} />
        }
      >
        <LazyComponent STEPS={STEPS} status={status} size={size} />
      </Suspense>
    </>
  );
};

export default RequestStepper;
