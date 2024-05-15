import { Box, Slide, Stack } from "@mui/material";
import Map from "Components/Map";
import { SvgSPrite } from "Components/SvgSPrite";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MAP_TYPES, MAP_TYPE_VIEW } from "Components/pages/monitoring/vars";
import { MonitoringContext } from "./monitoringContext";
import DrivingRoute from "./DrivingRoute";
import SpotlightPoints from "./SpotlightPoints";
import ToolBarActions from "./ToolBarActions";
import RequestMonitor from "./RequestMonitor";
import FleetHistoryMonitor from "./FleetHistoryMonitor";
import FleetMonitor from "./FleetMonitor";

const MainMonitoring = () => {
  const mapControl = Map({ cedarmapsFile: false });
  const { renderMap } = mapControl;
  const [mapType, setMapType] = useState("");
  const [showSlide, setShowSlide] = useState(false);

  // loading
  const [pageLoading, setPageLoading] = useState(false);

  // request controls
  const [requestFilter, setRequestFilter] = useState({ pageLength: 10 });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedRequestFilter, setSelectedRequestFilter] = useState({});

  // fleet history controls
  const [fleetHistoryFilter, setFleetHistoryFilter] = useState({
    pageLength: 10,
  });
  const [selectedFleetHistory, setSelectedFleetHistory] = useState(null);
  const [selectedFleetHistoryFilter, setSelectedFleetHistoryFilter] = useState(
    {}
  );

  // fleet controls
  const [fleetFilter, setFleetFilter] = useState({ pageLength: 10 });
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [selectedFleetFilter, setSelectedFleetFilter] = useState({});

  // toolbar buttons
  const [showRoute, setShowRoute] = useState(false);
  const [showPointDetail, setShowPointDetail] = useState(true);
  const [sourceApp, setSourceApp] = useState(true);
  const [sourceDevice, setSourceDevice] = useState(true);

  const handleMapTypeChange = (val) => {
    if (mapType === "") {
      setMapType(val);
      setShowSlide(true);
    } else if (val === mapType) {
      setShowSlide(false);
      setTimeout(() => {
        setMapType("");
      }, 300);
    }
  };

  useEffect(() => {
    let newFilter = {};
    let setNewFilter = () => {};

    switch (mapType) {
      case MAP_TYPES.FLEET_HISTORY:
        newFilter = { ...selectedFleetHistoryFilter };
        setNewFilter = setSelectedFleetHistoryFilter;
        break;
      case MAP_TYPES.FLEET:
        newFilter = { ...selectedFleetFilter };
        setNewFilter = setSelectedFleetFilter;
        break;
      case MAP_TYPES.REQUEST:
        newFilter = { ...selectedRequestFilter };
        setNewFilter = setSelectedRequestFilter;
        break;
    }
    if (sourceApp && sourceDevice) {
      delete newFilter?.source;
    } else if (sourceApp) {
      newFilter.source = "app";
    } else if (sourceDevice) {
      newFilter.source = "device";
    } else if (!sourceDevice || !sourceApp) {
      delete newFilter?.source;
    }
    setNewFilter(newFilter);
  }, [sourceApp, sourceDevice]);

  const requestMethods = useForm();
  const fleetHistoryMethods = useForm();
  const fleetMethods = useForm();
  const toolbarMethods = useForm();

  const ItemRowShow = {
    [MAP_TYPES.FLEET_HISTORY]: (
      <FormProvider {...fleetHistoryMethods}>
        <FleetHistoryMonitor />
      </FormProvider>
    ),
    [MAP_TYPES.REQUEST]: (
      <FormProvider {...requestMethods}>
        <RequestMonitor />
      </FormProvider>
    ),
    [MAP_TYPES.FLEET]: (
      <FormProvider {...fleetMethods}>
        <FleetMonitor />
      </FormProvider>
    ),
  };

  return (
    <MonitoringContext.Provider
      value={{
        requestFilter,
        setRequestFilter,
        selectedRequest,
        setSelectedRequest,
        mapType,
        setMapType,
        handleMapTypeChange,
        fleetHistoryFilter,
        setFleetHistoryFilter,
        showRoute,
        setShowRoute,
        showPointDetail,
        setShowPointDetail,
        selectedRequestFilter,
        setSelectedRequestFilter,
        sourceApp,
        setSourceApp,
        sourceDevice,
        setSourceDevice,
        selectedFleetHistoryFilter,
        setSelectedFleetHistoryFilter,
        selectedFleetHistory,
        setSelectedFleetHistory,
        pageLoading,
        setPageLoading,
        fleetFilter,
        setFleetFilter,
        selectedFleet,
        setSelectedFleet,
        selectedFleetFilter,
        setSelectedFleetFilter,
        // forms
        toolbarMethods,

        // map functions and utils
        ...mapControl,
      }}
    >
      <Box sx={{ height: "100vh", position: "relative", overflow: "hidden" }}>
        <ToolBarActions />

        {pageLoading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 999,
              bgcolor: (theme) => `${theme.palette.primary.extraLight}20`,
              backdropFilter: "blur(4px)",
            }}
          >
            <LoadingSpinner />
          </Box>
        )}

        {renderMap(
          <>
            <DrivingRoute />
            <SpotlightPoints />
          </>
        )}
        <Box
          sx={{
            position: "sticky",
            bottom: 10,
            left: 0,
            zIndex: 501,
            gap: 2,
            userSelect: "none",
            transition: "all 1s",
          }}
        >
          <Slide
            direction="left"
            timeout={!showSlide ? 900 : 0}
            in={!showSlide}
            mountOnEnter
            unmountOnExit
          >
            <Stack direction="row" spacing={2} mx={2}>
              {MAP_TYPE_VIEW.map((item) => {
                return (
                  <Box
                    key={item.value}
                    onClick={() => handleMapTypeChange(item.value)}
                    sx={{
                      bgcolor:
                        item.value === mapType
                          ? "primary.900"
                          : "background.paper",
                      color:
                        item.value === mapType
                          ? "primary.contrastText"
                          : "primary.main",
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 0.5,
                      fontWeight: 700,
                      px: 1,
                      py: 1,
                      boxShadow: 1,
                      cursor: "pointer",
                    }}
                  >
                    <SvgSPrite color="inherit" icon={item.icon} />
                    {item.title}
                  </Box>
                );
              })}
            </Stack>
          </Slide>

          <Slide direction="up" in={showSlide} mountOnEnter unmountOnExit>
            <Box>{ItemRowShow?.[mapType]}</Box>
          </Slide>
        </Box>
      </Box>
    </MonitoringContext.Provider>
  );
};

export default MainMonitoring;
