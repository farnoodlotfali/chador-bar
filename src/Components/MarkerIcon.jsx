import MarkerImg from "Assets/images/marker.png";
import MarkerImg1 from "Assets/images/blue-circle.png";
import MarkerImg2 from "Assets/images/green-circle.png";
import triangleMarker from "Assets/images/triangle.png";
import circleGreenArrowUpImg from "Assets/images/circle_arrow_up_green.svg";
import circleBlueArrowUpImg from "Assets/images/circle_arrow_up_blue.svg";
import stopImg from "Assets/images/stop.png";
import powerOff from "Assets/images/power-off.png";
import cancelImg from "Assets/images/cancel-ban_red.png";
import deliveredImg from "Assets/images/delivered-boxes_stacked_green.png";
import doneImg from "Assets/images/done-memo_circle_check_green.png";
import editImg from "Assets/images/edit-pen_yellow.png";
import enabledImg from "Assets/images/enabled-billboard_green.png";
import issueWaybillImg from "Assets/images/issue_waybill-receipt_yellow.png";
import loadConfirmImg from "Assets/images/load_confirm-truck_arrow_right_green.png";
import loadPermitImg from "Assets/images/load_permit-truck-ramp_blue.png";
import loadImg from "Assets/images/load-truck_ramp_box_blue.png";
import submitImg from "Assets/images/submit-user_magnifying_glass_blue.png";
import waitForPaymentImg from "Assets/images/wait_for_payment-money_bill_1_wave_yellow.png";
import gaugeSimpleHigh from "Assets/images/gauge-simple-high.png";
import L from "leaflet";

var LeafIcon = L.Icon.extend({
  options: {
    shadowUrl: null,
    iconRetinaUrl: MarkerImg,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
  },
});

// you change position in Marker component in react-leaflet with using offset prop

// blue location dot..... Do NOT change
export const MarkerIcon = new LeafIcon({
  iconUrl: MarkerImg,
  iconRetinaUrl: MarkerImg,
});

// loadPermit blue circle.... Do NOT change
export const MarkerLoadPermitBlueIcon = new LeafIcon({
  iconUrl: loadPermitImg,
  iconRetinaUrl: loadPermitImg,

  iconSize: [20, 21],
  iconAnchor: [12, 10],
  tooltipAnchor: [18, -18],
});

// submit blue circle.... Do NOT change
export const MarkerSubmitBlueIcon = new LeafIcon({
  iconUrl: submitImg,
  iconRetinaUrl: submitImg,

  iconSize: [20, 21],
  iconAnchor: [12, 10],
  tooltipAnchor: [18, -18],
});

// load blue circle.... Do NOT change
export const MarkerLoadBlueIcon = new LeafIcon({
  iconUrl: loadImg,
  iconRetinaUrl: loadImg,

  iconSize: [20, 21],
  iconAnchor: [12, 10],
  tooltipAnchor: [18, -18],
});

// enabled green circle.... Do NOT change
export const MarkerEnabledYellowIcon = new LeafIcon({
  iconUrl: enabledImg,
  iconRetinaUrl: enabledImg,

  iconSize: [20, 21],
  iconAnchor: [12, 10],
  tooltipAnchor: [18, -18],
});

// loadConfirm green circle.... Do NOT change
export const MarkerLoadConfirmYellowIcon = new LeafIcon({
  iconUrl: loadConfirmImg,
  iconRetinaUrl: loadConfirmImg,
  iconSize: [20, 21],
  iconAnchor: [12, 10],
  tooltipAnchor: [18, -18],
});

// edit yellow circle.... Do NOT change
export const MarkerEditYellowIcon = new LeafIcon({
  iconUrl: editImg,
  iconRetinaUrl: editImg,

  iconSize: [20, 21],
  iconAnchor: [12, 10],
  tooltipAnchor: [18, -18],
});

// issueWaybill yellow circle.... Do NOT change
export const MarkerIssueWaybillYellowIcon = new LeafIcon({
  iconUrl: issueWaybillImg,
  iconRetinaUrl: issueWaybillImg,
  iconSize: [20, 21],
  iconAnchor: [12, 10],
  tooltipAnchor: [18, -18],
});

// waitForPaymentImg yellow circle.... Do NOT change
export const MarkerWaitForPaymentImgYellowIcon = new LeafIcon({
  iconUrl: waitForPaymentImg,
  iconRetinaUrl: waitForPaymentImg,

  iconSize: [20, 21],
  iconAnchor: [12, 10],
  tooltipAnchor: [18, -18],
});

// done green circle.... Do NOT change
export const MarkerDoneGreenIcon = new LeafIcon({
  iconUrl: doneImg,
  iconRetinaUrl: doneImg,

  iconSize: [20, 21],
  iconAnchor: [12, 10],
  tooltipAnchor: [18, -18],
});

// delivered green circle.... Do NOT change
export const MarkerDeliveredGreenIcon = new LeafIcon({
  iconUrl: deliveredImg,
  iconRetinaUrl: deliveredImg,
  iconSize: [20, 21],
  iconAnchor: [12, 10],
  tooltipAnchor: [18, -18],
});

// ban red circle.... Do NOT change
export const MarkerBanRedIcon = new LeafIcon({
  iconUrl: cancelImg,
  iconRetinaUrl: cancelImg,

  iconSize: [20, 21],
  iconAnchor: [12, 10],
  tooltipAnchor: [18, -18],
});

// arrow green circle.... Do NOT change
export const MarkerArrowGreenIcon = new LeafIcon({
  iconUrl: circleGreenArrowUpImg,
  iconRetinaUrl: circleGreenArrowUpImg,

  iconSize: [20, 21],
  iconAnchor: [12, 0],
  tooltipAnchor: [30, -25],
});

// arrow blue circle.... Do NOT change
export const MarkerArrowBlueIcon = new LeafIcon({
  iconUrl: circleBlueArrowUpImg,
  iconRetinaUrl: circleBlueArrowUpImg,

  iconSize: [20, 21],
  iconAnchor: [12, 0],
  tooltipAnchor: [30, -25],
});

// red stop 6.... Do NOT change
export const MarkerStopIcon = new LeafIcon({
  iconUrl: stopImg,
  iconRetinaUrl: stopImg,

  iconSize: [20, 21],
  iconAnchor: [12, 0],
  tooltipAnchor: [18, -18],
});

// red power-off 6.... Do NOT change
export const MarkerPowerOffIcon = new LeafIcon({
  iconUrl: powerOff,
  iconRetinaUrl: powerOff,

  iconSize: [30, 31],
  iconAnchor: [12, 21],
  tooltipAnchor: [4, -18],
});

// black gauge-simple-high 6.... Do NOT change
export const MarkerGaugeSimpleHighIcon = new LeafIcon({
  iconUrl: gaugeSimpleHigh,
  iconRetinaUrl: gaugeSimpleHigh,

  iconSize: [30, 31],
  iconAnchor: [12, 21],
  tooltipAnchor: [4, -18],
});

// blue circle.... Do NOT change
export const BlueCircleMarker = new LeafIcon({
  iconUrl: MarkerImg1,
  iconRetinaUrl: MarkerImg1,
  iconSize: [25, 25],
  iconAnchor: [15, 12],
  popupAnchor: [1, -34],
  tooltipAnchor: [0, 0],
  shadowSize: [25, 25],
});
// green Triangle .... Do NOT change
export const TriangleMarker = new LeafIcon({
  iconUrl: triangleMarker,
  iconRetinaUrl: triangleMarker,
  iconSize: [20, 20],
  iconAnchor: [15, 12],
  popupAnchor: [1, -34],
  tooltipAnchor: [0, 0],
  shadowSize: [20, 20],
});

// green circle.... Do NOT change
export const GreenCircleMarker = new LeafIcon({
  iconUrl: MarkerImg2,
  iconRetinaUrl: MarkerImg2,
  iconSize: [25, 25],
  iconAnchor: [15, 12],
  popupAnchor: [1, -34],
  tooltipAnchor: [0, 0],
  shadowSize: [25, 25],
});
