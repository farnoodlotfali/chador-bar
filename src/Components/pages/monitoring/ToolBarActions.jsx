/* eslint-disable default-case */
import { Box, Button, Grid, Stack, Tooltip, Typography } from "@mui/material";
import { FormContainer, FormInputs } from "Components/Form";
import { SvgSPrite } from "Components/SvgSPrite";
import TimeInputWithControls from "Components/TimeInputWithControls";
import { Link } from "react-router-dom";
import { MonitoringContext } from "./monitoringContext";
import { useContext, useEffect, useState } from "react";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import { MAP_TYPES, TOOLBAR_INPUTS_NAME, VALID_REQUEST_STATUSES } from "./vars";
import { removeInvalidValues } from "Utility/utils";

const ToolBarActions = () => {
  const [show, setShow] = useState(true);

  const {
    showRoute,
    setShowRoute,
    showPointDetail,
    setShowPointDetail,
    setSelectedRequestFilter,
    setSelectedFleetHistoryFilter,
    toolbarMethods,
    selectedRequestFilter,
    sourceApp,
    setSourceApp,
    sourceDevice,
    setSourceDevice,
    mapType,
    selectedFleetHistory,
    selectedRequest,
    setSelectedFleetFilter,
  } = useContext(MonitoringContext);
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
    reset,
  } = toolbarMethods;

  const Inputs = [
    {
      type: "custom",
      sx: { minWidth: 300 },
      customView: (
        <TimeInputWithControls
          input={{
            type: "time",
            name: TOOLBAR_INPUTS_NAME.start_time,
            label: "از ساعت",
            control: control,
          }}
        />
      ),
    },
    {
      sx: { minWidth: 300 },
      type: "rangeDate",
      name: TOOLBAR_INPUTS_NAME.date,
      label: "بازه تاریخ",
      control: control,
    },
    {
      type: "custom",
      sx: { minWidth: 300 },
      customView: (
        <TimeInputWithControls
          input={{
            type: "time",
            name: TOOLBAR_INPUTS_NAME.end_time,
            label: "تا ساعت",
            control: control,
          }}
        />
      ),
    },
  ];

  const { resetValues } = useLoadSearchParamsAndReset(Inputs, reset, false);

  // reset toolbar when mapType and other related changes
  useEffect(() => {
    resetToolBar();
  }, [selectedRequest, selectedFleetHistory, mapType]);

  // reset toolbar
  const resetToolBar = () => {
    toolbarMethods.reset(resetValues);
  };

  // handle on submit
  const onSubmit = (data) => {
    let submitFilters = {
      start:
        data?.date?.date_from +
        `${data?.start_time ? ` ${data?.start_time + ":00"}` : ""}`,
      end:
        data?.date?.date_to +
        `${data?.end_time ? ` ${data?.end_time + ":00"}` : ""}`,
    };

    switch (mapType) {
      case MAP_TYPES.FLEET_HISTORY:
        setSelectedFleetHistoryFilter((prev) =>
          removeInvalidValues({
            ...prev,
            ...submitFilters,
          })
        );
        break;
      case MAP_TYPES.FLEET:
        setSelectedFleetFilter((prev) =>
          removeInvalidValues({
            ...prev,
            ...submitFilters,
          })
        );
        break;
      case MAP_TYPES.REQUEST:
        setSelectedRequestFilter((prev) =>
          removeInvalidValues({
            ...prev,
            ...submitFilters,
          })
        );
        break;
    }
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  const toggleShow = () => {
    setShow((prev) => !prev);
  };

  return (
    <Stack
      sx={{
        position: "absolute",
        top: show ? 10 : -84,
        right: 10,
        left: 10,
        zIndex: 501,
        transition: "all 0.6s",
        alignItems: "center",
      }}
      direction="row"
      spacing={2}
    >
      <Link to="/desktop">
        <Box
          sx={{
            minHeight: 51,
            maxHeight: 51,
            height: 51,
          }}
        >
          <Tooltip title="بازگشت به پنل">
            <img
              src={require(`Assets/images/${process.env.REACT_APP_VERSION_CODE}/logo.png`)}
              alt="logo"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </Tooltip>
        </Box>
      </Link>

      <Box
        sx={{
          bgcolor: "background.paper",
          boxShadow: 1,
          borderRadius: 1,
          transition: "all 0.6s",
          px: 2,
          width: "100%",
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            bottom: -23,
            right: 10,
            bgcolor: "background.paper",
            boxShadow: 1,
            borderRadius: "50%",
            p: 1,
            zIndex: 501,
            display: "flex",
            cursor: "pointer",
            transition: "all 0.6s",
            transform: !!show && "rotate(180deg)",
          }}
          onClick={toggleShow}
        >
          <SvgSPrite icon="chevron-down" size="small" />
        </Box>

        <form
          style={{
            overflowX: "auto",
            padding: "12px",
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs
              inputs={Inputs}
              gridProps={{ xs: 3 }}
              sx={{ flexWrap: "nowrap" }}
            >
              <Grid
                item
                xs="auto"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                lineHeight={1}
              >
                <Tooltip title="فیلتر" placement="right" arrow>
                  <Button
                    disableElevation
                    color="primary"
                    variant="outlined"
                    type="submit"
                  >
                    <SvgSPrite color="inherit" size="small" icon="filter" />
                  </Button>
                </Tooltip>
                <Tooltip title="حذف فیلتر" placement="right" arrow>
                  <Button
                    disableElevation
                    color="error"
                    variant="outlined"
                    type="submit"
                    onClick={() => {
                      reset(resetValues);
                    }}
                  >
                    <SvgSPrite
                      color="inherit"
                      size="small"
                      icon="filter-circle-xmark"
                    />
                  </Button>
                </Tooltip>
              </Grid>
              <Grid item xs={3} minWidth={350}>
                <Stack direction="row" spacing={2} justifyContent="end">
                  {[
                    {
                      icon: "info",
                      title: "نمایش جزئیات",
                      size: 24,
                      name: "info",
                      value: showPointDetail,
                      onClick: () => setShowPointDetail((prev) => !prev),
                    },
                    {
                      icon: "route",
                      title: "نمایش مسیر",
                      size: 24,
                      name: "route",
                      onClick: () => setShowRoute((prev) => !prev),
                      value: showRoute,
                    },
                    {
                      icon: "truck-container",
                      title: "داده های ماشین",
                      size: 32,
                      name: "device",
                      value: sourceDevice,
                      onClick: () => setSourceDevice((prev) => !prev),
                    },
                    {
                      icon: "mobile",
                      title: "داده های اپلیکیشن",
                      size: 24,
                      name: "app",
                      value: sourceApp,
                      onClick: () => setSourceApp((prev) => !prev),
                    },
                  ].map((item) => {
                    return (
                      <Tooltip key={item.name} title={item.title} arrow>
                        <Box
                          sx={{
                            minWidth: 56,
                            height: 56,
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: "grey.300",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: item.value
                              ? "primary.contrastText"
                              : "primary.main",
                            cursor: "pointer",
                            bgcolor: item.value
                              ? "primary.main"
                              : "background.paper",
                          }}
                          onClick={() => item.onClick()}
                        >
                          <SvgSPrite
                            color="inherit"
                            icon={item.icon}
                            size={item.size}
                          />
                        </Box>
                      </Tooltip>
                    );
                  })}
                </Stack>
              </Grid>
            </FormInputs>
          </FormContainer>
        </form>

        <RequestStatusFilter />
      </Box>
    </Stack>
  );
};

const RequestStatusFilter = () => {
  const { setRequestFilter, requestFilter, mapType } =
    useContext(MonitoringContext);

  const [showStatus, setShowStatus] = useState(true);

  const handleShowStatus = () => {
    setShowStatus((prev) => !prev);
  };

  const handleOnClick = (val) => {
    setRequestFilter((prev) => ({ ...prev, status: val }));
  };

  return (
    <Box
      sx={{
        position: "absolute",
        display: "flex",
        top: 90,
        left: mapType === MAP_TYPES.REQUEST ? (showStatus ? 10 : -910) : -1000,
        zIndex: 499,
        gap: 2,
        userSelect: "none",
        flexDirection: "row-reverse",
        transition: "all 0.6s ease-in-out",
      }}
    >
      <Box
        sx={{
          display: "flex",
          placeItems: "center",
          borderRadius: "50%",
          bgcolor: "background.paper",
          p: 1,
          boxShadow: 2,
          cursor: "pointer",
          transition: "inherit",
          color: "primary.main",
          height: "100%",
          transform: !showStatus && "rotate(180deg)",
          ":hover": {
            opacity: 0.8,
          },
        }}
        onClick={handleShowStatus}
      >
        <SvgSPrite icon="chevron-right" color="inherit" size="small" />
      </Box>
      {VALID_REQUEST_STATUSES.map((item) => {
        return (
          <Typography
            key={item.title}
            sx={{
              bgcolor:
                item.value === requestFilter?.status
                  ? "primary.900"
                  : "background.paper",
              color:
                item.value === requestFilter?.status
                  ? "primary.contrastText"
                  : "primary.main",
              px: 1,
              py: 1,
              borderRadius: 1,
              fontWeight: 800,
              minWidth: 85,
              textAlign: "center",
              fontSize: "13px !important",
              cursor: "pointer",
              boxShadow: 1,
              transition: "inherit",
            }}
            onClick={() => handleOnClick(item.value)}
          >
            {item.title}
          </Typography>
        );
      })}
    </Box>
  );
};

export default ToolBarActions;
