import {
  MarkerBanRedIcon,
  MarkerDeliveredGreenIcon,
  MarkerDoneGreenIcon,
  MarkerEditYellowIcon,
  MarkerEnabledYellowIcon,
  MarkerIssueWaybillYellowIcon,
  MarkerLoadBlueIcon,
  MarkerLoadConfirmYellowIcon,
  MarkerLoadPermitBlueIcon,
  MarkerSubmitBlueIcon,
  MarkerWaitForPaymentImgYellowIcon,
} from "Components/MarkerIcon";

export const MAP_TYPES = {
  REQUEST: "REQUEST",
  FLEET: "FLEET",
  FLEET_HISTORY: "FLEET_HISTORY",
};
export const MAP_TYPE_VIEW = [
  { title: "درخواست‌ها", value: MAP_TYPES.REQUEST, icon: "grid-2" },
  { title: "سوابق ناوگان", value: MAP_TYPES.FLEET_HISTORY, icon: "route" },
  { title: "ناوگان", value: MAP_TYPES.FLEET, icon: "car-bus" },
];

export const VALID_REQUEST_STATUSES = [
  { title: "پایان یافته", value: "done" },
  { title: "تحویل شده", value: "delivered" },
  { title: "صدور بارنامه", value: "issue_waybill" },
  { title: "تایید بارگیری", value: "load_confirm" },
  { title: "اجازه بارگیری", value: "load_permit" },
  { title: "بارگیری شده", value: "load" },
  { title: "منتظر پرداخت", value: "wait_for_payment" },
  { title: "انتخاب راننده", value: "submit" },
  { title: "همه", value: undefined },
];

export const TOOLBAR_INPUTS_NAME = {
  date: "date",
  start_time: "start_time",
  end_time: "end_time",
};

export const EVENT_POINT_ICONS = {
  delivered: MarkerDeliveredGreenIcon,
  done: MarkerDoneGreenIcon,
  enabled: MarkerEnabledYellowIcon,
  issue_waybill: MarkerIssueWaybillYellowIcon,
  load: MarkerLoadBlueIcon,
  load_confirm: MarkerLoadConfirmYellowIcon,
  load_permit: MarkerLoadPermitBlueIcon,
  submit: MarkerSubmitBlueIcon,
  wait_for_payment: MarkerWaitForPaymentImgYellowIcon,
  edit: MarkerEditYellowIcon,
  cancel: MarkerBanRedIcon,
};
