/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Marker, Polyline, Tooltip } from "react-leaflet";
import { toast } from "react-toastify";
import Map, { getPathCoordinates } from "Components/Map";
import Modal from "Components/versions/Modal";
import MarkerImg from "Assets/images/marker.png";
import L from "leaflet";
import { useInView } from "react-intersection-observer";

const MarkerIcon = new L.Icon({
  iconUrl: MarkerImg,
  iconRetinaUrl: MarkerImg,
  shadowUrl: null,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

const limeOptions = { color: "lime" };

const DrivingDirection = ({
  showModal,
  toggleShowModal,
  rowData,
  useModal = false,
  height = "100vh",
}) => {
  const [directions, setDirections] = useState([]);
  const { renderMap, setCenter, setZoom } = Map({});

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && rowData && Object.keys(rowData).length) {
      const locationsData = [
        [rowData.source_lat, rowData.source_lng],
        [rowData.destination_lat, rowData.destination_lng],
      ];

      getPathCoordinates(locationsData)
        .then((res) => {
          setCenter([
            (locationsData[0][0] + locationsData[1][0]) / 2,
            (locationsData[0][1] + locationsData[1][1]) / 2,
          ]);

          setZoom(calculateZoom(res.distance));
          return reverseRoutes(res.coordinates);
        })
        .then((routes) => setDirections(routes))
        .catch((e) => {
          console.log(e);

          setCenter([
            (locationsData[0][0] + locationsData[1][0]) / 2,
            (locationsData[0][1] + locationsData[1][1]) / 2,
          ]);

          setZoom(calculateZoom(10000));
          setDirections(locationsData);
          toast.error("خطا در نقشه");
        });
    }
  }, [rowData, inView]);

  const DataInMap = (
    <>
      <div ref={ref} />{" "}
      <Stack spacing={1}>
        <Stack direction={"row"} spacing={1}>
          <Typography fontWeight={"600"}>مبدا:</Typography>
          <Typography>{rowData?.source_address}</Typography>
        </Stack>
        <Stack direction={"row"} spacing={1}>
          <Typography fontWeight={"600"}>مقصد:</Typography>
          <Typography>{rowData?.destination_address}</Typography>
        </Stack>
      </Stack>
      {directions.length === 0 ? (
        <Box
          sx={{
            fontSize: 26,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "lightgoldenrodyellow",
            height: "500px",
          }}
        >
          در حال بارگذاری نقشه...
        </Box>
      ) : (
        <Box sx={{ height: height, mt: 3 }}>
          {renderMap(
            <>
              <Polyline pathOptions={limeOptions} positions={directions} />
              <Marker icon={MarkerIcon} position={directions[0]}>
                <Tooltip
                  direction="top"
                  offset={[-15, 0]}
                  opacity={1}
                  permanent
                >
                  <Typography variant="small">محل بارگیری</Typography>
                </Tooltip>
              </Marker>
              <Marker
                icon={MarkerIcon}
                position={directions[directions.length - 1]}
              >
                <Tooltip
                  direction="top"
                  offset={[-15, 0]}
                  opacity={1}
                  permanent
                >
                  <Typography variant="small">محل تخلیه بار</Typography>
                </Tooltip>
              </Marker>
            </>
          )}
        </Box>
      )}
    </>
  );
  return (
    <>
      {useModal ? (
        <Modal open={showModal} onClose={() => toggleShowModal()}>
          {DataInMap}
        </Modal>
      ) : (
        DataInMap
      )}
    </>
  );
};

export default DrivingDirection;

// cedarmaps api give lng first and lat second.
// leaflet api works with lat first and lng second.
// so we need to reverse Routes.
export const reverseRoutes = (coordinates) => {
  let reversed = [];

  coordinates.forEach((arr) => {
    reversed.push(arr.reverse());
  });

  return reversed;
};

// calculate zoom
export const calculateZoom = (distance) => {
  const ratios = [1, 10, 50, 80, 180, 210, 250, 500, 1000, 1000000];
  let zoom = 14;

  const val = ratios.findIndex((ratio) => ratio > Math.floor(distance));

  return zoom - val;
};
