import MarkerImg from "Assets/images/marker.png";
import MarkerImg1 from "Assets/images/blue-circle.png";
import MarkerImg2 from "Assets/images/green-circle.png";
import MarkerImg3 from "Assets/images/triangle.png";
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

export const MarkerIcon = new LeafIcon({
  iconUrl: MarkerImg,
  iconRetinaUrl: MarkerImg,
});
export const BlueCircleMarker = new LeafIcon({
  iconUrl: MarkerImg1,
  iconRetinaUrl: MarkerImg1,
  iconSize: [25, 25],
  iconAnchor: [15, 12],
  popupAnchor: [1, -34],
  tooltipAnchor: [0, 0],
  shadowSize: [25, 25],
});
export const TriangleMarker = new LeafIcon({
  iconUrl: MarkerImg3,
  iconRetinaUrl: MarkerImg3,
  iconSize: [20, 20],
  iconAnchor: [15, 12],
  popupAnchor: [1, -34],
  tooltipAnchor: [0, 0],
  shadowSize: [20, 20],
});
export const GreenCircleMarker = new LeafIcon({
  iconUrl: MarkerImg2,
  iconRetinaUrl: MarkerImg2,
  iconSize: [25, 25],
  iconAnchor: [15, 12],
  popupAnchor: [1, -34],
  tooltipAnchor: [0, 0],
  shadowSize: [25, 25],
});

// export const BlueCircleMarker = new LeafIcon({
//   iconUrl: MarkerImg1,
//   iconRetinaUrl: MarkerImg1,
//   iconSize: [25, 25],
//   iconAnchor: [15, 12],
//   popupAnchor: [1, -34],
//   tooltipAnchor: [16, -28],
//   shadowSize: [25, 25],
// });

// export const GreenCircleMarker = new LeafIcon({
//   iconUrl: MarkerImg2,
//   iconRetinaUrl: MarkerImg2,
//   iconSize: [25, 25],
//   iconAnchor: [15, 12],
//   popupAnchor: [1, -34],
//   tooltipAnchor: [16, -28],
//   shadowSize: [25, 25],
// });
