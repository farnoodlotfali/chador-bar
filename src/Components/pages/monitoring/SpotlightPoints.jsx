import { Stack, Typography, useTheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { calculateZoom } from "Components/DrivingDirection";
import {
  MarkerArrowBlueIcon,
  MarkerArrowGreenIcon,
  MarkerGaugeSimpleHighIcon,
  MarkerPowerOffIcon,
  MarkerStopIcon,
} from "Components/MarkerIcon";
import {
  convertToRangeDate,
  convertToTime,
  enToFaNumber,
  filteringMethod,
  findDistanceBetweenPoints,
  requestStatus,
} from "Utility/utils";
import { axiosApi } from "api/axiosApi";
import { useContext } from "react";
import { useEffect, useMemo, useState } from "react";
import { Marker, Polyline, Tooltip as LeafletTooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import {
  EVENT_POINT_ICONS,
  MAP_TYPES,
  TOOLBAR_INPUTS_NAME,
} from "Components/pages/monitoring/vars";
import { MonitoringContext } from "./monitoringContext";

const SpotlightPoints = () => {
  const polylineOptionsDevice = { color: "lime", dashArray: "5,10" };
  const polylineOptionsApp = { color: "blue", dashArray: "5,10" };
  const theme = useTheme();
  const {
    selectedRequest,
    showPointDetail,
    selectedRequestFilter,
    toolbarMethods,
    selectedFleetHistoryFilter,
    selectedFleetHistory,
    handleOnChangeCenterFly,
    setPageLoading,
    mapType,
    setSelectedFleetHistory,
    setSelectedRequest,
    sourceApp,
    sourceDevice,
  } = useContext(MonitoringContext);
  const [dotsArrayDevice, setDotsArrayDevice] = useState([]);
  const [dotsArrayApp, setDotsArrayApp] = useState([]);
  const [pointsDevice, setPointsDevice] = useState([]);
  const [pointsApp, setPointsApp] = useState([]);
  // api request
  const {
    data: requestMonitoring,
    isSuccess,
    isLoading,
    isFetching,
    isError,
  } = useQuery(
    ["monitoring", "request", selectedRequestFilter, selectedRequest?.id],
    () =>
      axiosApi({
        url: `/request-monitoring/${selectedRequest?.id}${filteringMethod(
          selectedRequestFilter
        )}`,
      }).then((res) => res.data.Data),

    {
      enabled: !!selectedRequest?.id,
      onSuccess: () => {
        const { source_lat, source_lng, destination_lat, destination_lng } =
          selectedRequest;
        const zoom = calculateZoom(
          findDistanceBetweenPoints(
            source_lat,
            source_lng,
            destination_lat,
            destination_lng,
            true
          )
        );

        handleOnChangeCenterFly(
          [
            (source_lat + destination_lat) / 2,
            (source_lng + destination_lng) / 2,
          ],
          zoom - 2
        );
      },
    }
  );

  // api fleet
  const {
    data: fleetMonitoring,
    isSuccess: isSuccessFleet,
    isLoading: isLoadingFleet,
    isFetching: isFetchingFleet,
    isError: isErrorFleet,
  } = useQuery(
    [
      "monitoring",
      "fleet",
      selectedFleetHistoryFilter,
      selectedFleetHistory?.id,
    ],
    () =>
      axiosApi({
        url: `/fleet-monitoring/${selectedFleetHistory?.id}${filteringMethod(
          selectedFleetHistoryFilter
        )}`,
      }).then((res) => res.data.Data),

    {
      enabled: !!selectedFleetHistory?.id,
      onSuccess: (data) => {
        loadToolBarFilters(data);
      },
    }
  );

  // set setPageLoading true until api reach
  useEffect(() => {
    if (isFetching || isFetchingFleet) {
      setPageLoading(true);
    } else if (isSuccessFleet || isSuccess || isErrorFleet || isError) {
      setPageLoading(false);
    }
  }, [
    isFetching,
    isFetchingFleet,
    isSuccessFleet,
    isSuccess,
    isErrorFleet,
    isError,
  ]);

  // reset
  useEffect(() => {
    if (
      !selectedFleetHistory ||
      isErrorFleet ||
      mapType !== MAP_TYPES.FLEET_HISTORY
    ) {
      resetAll();
      setSelectedFleetHistory(null);
    }
  }, [selectedFleetHistory, isErrorFleet, mapType]);
  useEffect(() => {
    if (!selectedRequest || isError || mapType !== MAP_TYPES.REQUEST) {
      resetAll();
      setSelectedRequest(null);
    }
  }, [selectedRequest, isError, mapType]);

  // load toolbar for request
  useEffect(() => {
    if (!(isLoading || isFetching) && !!requestMonitoring) {
      loadToolBarFilters(requestMonitoring);
    }
  }, [isLoading, isFetching, requestMonitoring]);

  // load toolbar for fleet
  useEffect(() => {
    if (!(isFetchingFleet || isLoadingFleet) && !!fleetMonitoring) {
      loadToolBarFilters(fleetMonitoring);
    }
  }, [isFetchingFleet, isLoadingFleet, fleetMonitoring]);

  // it is just a guess number (2 km)
  const allow_Max_Distance_KM_For_Stop_Off = 2;
  // it is just a guess number (10 minute)
  const allow_Minutes_For_Stop_Off = 10;
  // it is just a guess number (80 km/h)
  const allow_Max_Speed = 80;

  // request loading data
  useEffect(() => {
    if (isSuccess) {
      const appSpots = requestMonitoring?.items?.filter(
        (item) => item.source === "app"
      );

      const deviceSpots = requestMonitoring?.items?.filter(
        (item) => item.source === "device"
      );

      setDotsArrayDevice(
        deviceSpots?.map((item) => {
          return item.location.coordinates.reverse();
        })
      );
      setDotsArrayApp(
        appSpots?.map((item) => {
          return item.location.coordinates.reverse();
        })
      );

      setPointsApp(renderItemPoints(appSpots, MarkerArrowBlueIcon));
      setPointsDevice(renderItemPoints(deviceSpots, MarkerArrowGreenIcon));
    }
  }, [isSuccess, requestMonitoring, sourceApp, sourceDevice]);

  // fleet loading data
  useEffect(() => {
    if (isSuccessFleet) {
      const appSpots = fleetMonitoring?.items?.filter(
        (item) => item.source === "app"
      );

      const deviceSpots = fleetMonitoring?.items?.filter(
        (item) => item.source === "device"
      );

      setDotsArrayDevice(
        deviceSpots?.map((item) => {
          return item.location.coordinates.reverse();
        })
      );
      setDotsArrayApp(
        appSpots?.map((item) => {
          return item.location.coordinates.reverse();
        })
      );

      setPointsApp(renderItemPoints(appSpots, MarkerArrowBlueIcon));
      setPointsDevice(renderItemPoints(deviceSpots, MarkerArrowGreenIcon));
    }
  }, [isSuccessFleet, fleetMonitoring, sourceApp, sourceDevice]);

  const loadToolBarFilters = (data) => {
    toolbarMethods.reset({
      [TOOLBAR_INPUTS_NAME.date]: convertToRangeDate(
        TOOLBAR_INPUTS_NAME.date,
        data.filters?.start,
        data.filters?.end
      ),
      [TOOLBAR_INPUTS_NAME.end_time]: convertToTime(data.filters?.end),
      [TOOLBAR_INPUTS_NAME.start_time]: convertToTime(data.filters?.start),
    });
  };

  const resetAll = () => {
    setDotsArrayDevice([]);
    setDotsArrayApp([]);
    setPointsDevice([]);
    setPointsApp([]);
  };

  const CustomMarker = ({ item, index }) => {
    return (
      <Marker
        position={item.location.coordinates}
        icon={item.icon}
        rotationAngle={item.bearing}
        // title={`${enToFaNumber(i)}`}
      >
        {showPointDetail && (
          <LeafletTooltip
            direction="top"
            opacity={1}
            offset={[143.5, 15]}
            permanent
          >
            <Stack
              direction="row"
              sx={{
                direction: "rtl",
                columnGap: 2,
                rowGap: 1,
                width: 150,
                flexWrap: "wrap",
              }}
            >
              <Typography variant="small">({enToFaNumber(index)})</Typography>
              <Typography variant="small">
                {enToFaNumber(item.time_fa)}
              </Typography>
              <Typography variant="small">
                {enToFaNumber(Math.round(item.speed * 3.6))} km/h
              </Typography>
              <Typography
                color={`${requestStatus[item?.event]?.color ?? "primary"}.main`}
                variant="small"
                fontWeight={700}
              >
                {requestStatus[item?.event]?.title ?? "-"}
              </Typography>
            </Stack>
          </LeafletTooltip>
        )}
      </Marker>
    );
  };

  const renderItemPoints = (pointsArr, icon) => {
    const arrOfPoints = [];

    for (let i = 0; i < pointsArr?.length - 1; i++) {
      const el = pointsArr?.[i];
      const nextEl = pointsArr?.[i + 1];

      const elCoordinates = el?.location.coordinates;
      const nextElCoordinates = nextEl?.location.coordinates;

      let status = "moving";
      let statusIcon = icon;
      if (
        Math.floor(Math.abs((-el.timestamp + nextEl.timestamp) / 60)) >=
        allow_Minutes_For_Stop_Off
      ) {
        const distance = findDistanceBetweenPoints(
          elCoordinates[0],
          elCoordinates[1],
          nextElCoordinates[0],
          nextElCoordinates[1],
          true
        ).toFixed(3);

        if (distance < allow_Max_Distance_KM_For_Stop_Off) {
          status = "stop";
          statusIcon = MarkerStopIcon;
        } else {
          statusIcon = MarkerPowerOffIcon;
          status = "power-off";
        }
      } else if (!!el.event) {
        status = el.event;
        statusIcon = EVENT_POINT_ICONS[el.event] ?? icon;
      } else if (el.speed * 3.6 > allow_Max_Speed) {
        status = "high-speed";
        statusIcon = MarkerGaugeSimpleHighIcon;
      }

      arrOfPoints.push({
        ...el,
        icon: statusIcon,
        status,
      });
    }

    return arrOfPoints;
  };

  const linesBetweenIconsDevice = useMemo(() => {
    return (
      <Polyline
        pathOptions={polylineOptionsDevice}
        positions={dotsArrayDevice}
      />
    );
  }, [dotsArrayDevice]);

  const linesBetweenIconsApp = useMemo(() => {
    return (
      <Polyline pathOptions={polylineOptionsApp} positions={dotsArrayApp} />
    );
  }, [dotsArrayApp]);

  const MarkerIconsDevice = useMemo(() => {
    return pointsDevice.map((item, i) => {
      return <CustomMarker key={i} item={item} index={i} />;
    });
  }, [pointsDevice, showPointDetail]);

  const MarkerIconsApp = useMemo(() => {
    return pointsApp.map((item, i) => {
      return <CustomMarker key={i} item={item} index={i} />;
    });
  }, [pointsApp, showPointDetail]);

  return (
    <>
      {linesBetweenIconsDevice}
      {linesBetweenIconsApp}

      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={40}
        // spiderfyOnMaxZoom={true}
        polygonOptions={{
          fillColor: "#ffffff",
          color: theme.palette.primary.main,
          weight: 5,
          opacity: 1,
          fillOpacity: 0.8,
        }}
        showCoverageOnHover={true}
      >
        {MarkerIconsDevice}
        {MarkerIconsApp}
      </MarkerClusterGroup>
    </>
  );
};

export default SpotlightPoints;
