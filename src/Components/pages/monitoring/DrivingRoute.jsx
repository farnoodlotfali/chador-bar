import { Typography } from "@mui/material";
import { calculateZoom, reverseRoutes } from "Components/DrivingDirection";

import { getPathCoordinates } from "Components/Map";
import { MarkerIcon } from "Components/MarkerIcon";

import { useContext } from "react";
import { useEffect, useState } from "react";

import { Marker, Polyline, Tooltip as LeafletTooltip } from "react-leaflet";

import { toast } from "react-toastify";

import { MonitoringContext } from "./monitoringContext";

const DrivingRoute = () => {
  const { selectedRequest, setZoom, handleOnChangeCenterFly, showRoute } =
    useContext(MonitoringContext);
  const [directions, setDirections] = useState([]);
  const [loading, setLoading] = useState(true);

  const limeOptions = { color: "lime" };

  useEffect(() => {
    if (selectedRequest && showRoute) {
      setLoading(true);
      const locationsData = [
        [selectedRequest.source_lat, selectedRequest.source_lng],
        [selectedRequest.destination_lat, selectedRequest.destination_lng],
      ];

      getPathCoordinates(locationsData)
        .then((res) => {
          const zoom = calculateZoom(res.distance);

          handleOnChangeCenterFly(
            [
              (locationsData[0][0] + locationsData[1][0]) / 2,
              (locationsData[0][1] + locationsData[1][1]) / 2,
            ],
            zoom - 1
          );

          return reverseRoutes(res.coordinates);
        })
        .then((routes) => setDirections(routes))
        .catch((e) => {
          console.log(e);

          handleOnChangeCenterFly([
            (locationsData[0][0] + locationsData[1][0]) / 2,
            (locationsData[0][1] + locationsData[1][1]) / 2,
          ]);

          setZoom(calculateZoom(10000));
          setDirections(locationsData);
          toast.error("خطا در نقشه");
        })
        .finally(() => setLoading(false));
    }
  }, [selectedRequest, showRoute]);

  return (
    selectedRequest &&
    showRoute &&
    !loading && (
      <>
        <Polyline pathOptions={limeOptions} positions={directions} />
        <Marker icon={MarkerIcon} position={directions[0]}>
          <LeafletTooltip
            direction="top"
            offset={[60, 0]}
            opacity={1}
            permanent
          >
            <Typography variant="small">محل بارگیری</Typography>
          </LeafletTooltip>
        </Marker>
        <Marker icon={MarkerIcon} position={directions[directions.length - 1]}>
          <LeafletTooltip
            direction="top"
            offset={[-15, 0]}
            opacity={1}
            permanent
          >
            <Typography variant="small">محل تخلیه بار</Typography>
          </LeafletTooltip>
        </Marker>
      </>
    )
  );
};

export default DrivingRoute;
