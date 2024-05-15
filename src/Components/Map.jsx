/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  useMap,
  ZoomControl,
} from "react-leaflet";
import axios from "axios";

// we can rotate icon or marker with this package
import "leaflet-rotatedmarker";

import Marker from "Assets/images/marker.png";

// this loads css and img from leaflet
import "leaflet/dist/leaflet.css";
import { Helmet } from "react-helmet-async";
import { Box, Button } from "@mui/material";

const CedarmapToken = "c7c5dc6a741da52a0857f023224b989a41140cd1";
const defaultCenter = [35.6993744, 51.3816063];

const Map = (props) => {
  const {
    bounds,
    shouldGetLocationName = true,
    showCenterMarker,
    zooms,
    disableScroll_controlButton = false,
    zoomPosition = {
      left: null,
      right: null,
      top: null,
      bottom: null,
      zIndex: 499,
    },
    cedarmapsFile = true,
  } = props;
  const [leafMap, setLeafMap] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(zooms ?? 13);

  const [locationName, setLocationName] = useState();
  const [flyTo, setFlyTo] = useState(false);
  const [isSetCenter, setIsSetCenter] = useState(false);

  const handleOnChange = (e, z) => {
    // e === coordinates
    // z === zoom
    setCenter(e);
    leafMap.flyTo(e, z);
    setZoom(z);
  };
  const renderMap = (children) => {
    return (
      <>
        {cedarmapsFile && (
          <Helmet>
            <script src="https://api.cedarmaps.com/cedarmaps.js/v1.8.0/cedarmaps.js"></script>
            <link
              href="https://api.cedarmaps.com/cedarmaps.js/v1.8.0/cedarmaps.css"
              rel="stylesheet"
            />
          </Helmet>
        )}
        <MapContainer
          style={{ width: "100%", height: "100%" }}
          center={center}
          zoom={zoom}
          scrollWheelZoom={disableScroll_controlButton ? false : "center"}
          zoomControl={false}
          doubleClickZoom={!disableScroll_controlButton}
          ref={setLeafMap}
          attributionControl={false}
        >
          <TileLayer
            url={`https://api.cedarmaps.com/v1/tiles/cedarmaps.streets/{z}/{x}/{y}.png?access_token=${CedarmapToken}`}
          />

          {disableScroll_controlButton && (
            <CustomZoomControl {...zoomPosition} />
          )}

          <MapHandler
            center={center}
            bounds={bounds}
            setFlyTo={setFlyTo}
            flyTo={flyTo}
            onMoveEnd={(value) => {
              setCenter([value.lat, value.lng]);
              setIsSetCenter(false);
            }}
          />
          {children}
          {props.children}

          {showCenterMarker && (
            <img
              src={Marker}
              alt="marker"
              height="40"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                marginTop: "-30px",
                zIndex: 999,
              }}
            />
          )}
        </MapContainer>
      </>
    );
  };

  const handleSetCenter = (center) => {
    setIsSetCenter(true);
    setCenter(validateCenterMap(center));
  };

  useEffect(() => {
    if (shouldGetLocationName && !isSetCenter) {
      getLocationName(center).then((res) => setLocationName(res));
    }
  }, [center]);

  return {
    renderMap,
    center,
    setCenter: handleSetCenter,
    handleOnChangeCenterFly: handleOnChange,
    setZoom: setZoom,
    locationName,
    setFlyTo,
    flyTo,
  };
};

const CustomZoomControl = ({ top, left, bottom, right, zIndex = 499 }) => {
  const map = useMap();
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: bottom,
        top: top,
        left: left,
        right: right,
        zIndex: zIndex,
        display: "flex",
        flexDirection: "column",
        gap: 0.3,
      }}
      className="custom-zoom-control"
    >
      {[
        {
          title: "+",
          onClick: () => map.zoomIn(),
        },
        {
          title: "-",
          onClick: () => map.zoomOut(),
        },
      ].map((item, i) => {
        return (
          <Button
            key={i}
            variant="contained"
            color="inherit"
            sx={{
              bgcolor: "background.paper",
              color: "text.primary",
              fontWeight: 600,
            }}
            onClick={item.onClick}
          >
            {item.title}
          </Button>
        );
      })}
    </Box>
  );
};

const MapHandler = ({ bounds, onMoveEnd, flyTo, setFlyTo, center }) => {
  const map = useMap();

  const mapEvents = useMapEvents({
    moveend(e) {
      onMoveEnd(mapEvents.getCenter());
    },
  });

  useEffect(() => {
    if (bounds && bounds?.length > 0) {
      map?.fitBounds(bounds, { padding: [70, 70] });
    }
  }, [bounds]);

  useEffect(() => {
    if (flyTo) {
      const newLocations = [center[0], center[1]];
      map.flyTo(newLocations);
      setFlyTo(false);
    }
  }, [flyTo]);

  return <></>;
};

const getLocationName = async (center, returnAllData = false) => {
  let name;
  const requestUrl =
    "https://api.cedarmaps.com/v1/geocode/cedarmaps.streets/" +
    center[0] +
    "," +
    center[1] +
    ".json?access_token=" +
    CedarmapToken;

  await axios.get(requestUrl).then((res) => {
    const result = res.data.result;
    if (returnAllData) {
      name = result;
    } else {
      name = `${result.city} - ${result.address}`;
    }
  });

  return name;
};
const getPathCoordinates = async (path) => {
  let coordinates = [];
  let bbox = [];
  let distance = 0;
  let time = 0;
  const url = `https://api.cedarmaps.com/v1/direction/cedarmaps.driving/${path[0][0]},${path[0][1]};${path[1][0]},${path[1][1]}?access_token=${CedarmapToken}`;
  await axios.get(url).then((res) => {
    coordinates = res.data.result.routes[0].geometry.coordinates;
    bbox = res?.data?.result?.routes[0]?.bbox;
    distance = res.data.result.routes[0].distance / 1000;
    time = res.data.result.routes[0].time / 1000 / 60;
  });

  return { coordinates, distance, time, bbox };
};

const validateCenterMap = (center) => {
  if (
    center?.length === 2 &&
    !center?.includes(undefined) &&
    !center?.includes(null)
  ) {
    return center;
  }
  return defaultCenter;
};

export default Map;
export { getLocationName, getPathCoordinates };
