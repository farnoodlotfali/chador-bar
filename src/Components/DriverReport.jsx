/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Card,
  Divider,
  Fade,
  Grid,
  Stack,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import NormalTable from "Components/NormalTable";
import { SvgSPrite } from "Components/SvgSPrite";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import {
  filteringMethod,
  numberWithCommas,
  renderTimeCalender,
  renderWeight,
} from "Utility/utils";
import { axiosApi } from "api/axiosApi";
import { useMemo, useState } from "react";
import DraftDetailsModal from "./modals/DraftDetailsModal";
import WaybillDetailsModal from "./modals/WaybillDetailsModal";

const headCells = [
  {
    id: "name",
    label: "نام",
  },
  {
    id: "amount",
    label: "تعداد",
  },
  {
    id: "weight",
    label: "وزن",
  },
];

const ReportDataTable = ({ data }) => {
  return (
    <NormalTable headCells={headCells} sx={{ maxHeight: "calc(70vh - 132px)" }}>
      <TableBody>
        {Object.entries(data).map(([name, value], i) => {
          return (
            <TableRow key={i} hover tabIndex={-1}>
              <TableCell align="center" scope="row">
                {name ?? "-"}
              </TableCell>
              <TableCell align="center" scope="row">
                {numberWithCommas(value?.count)}
              </TableCell>
              <TableCell align="center" scope="row">
                {renderWeight(value?.weight)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </NormalTable>
  );
};

const DRIVER_REPORT_INFOS = {
  products: {
    name: "بیشترین بار حمل شده (محصول پرتکرار)",
    icon: "box",
    isTable: true,
    Component: ReportDataTable,
  },
  shipping_companies: {
    name: "لیست شرکتهای حمل همکار",
    icon: "truck-fast",
    isTable: true,
    Component: <></>,
    Component: <>112</>,
  },
  most_visited_sources: {
    name: "مبدا پرتکرار",
    icon: "location-dot",
    isTable: true,
    Component: <></>,
  },
  most_visited_destinations: {
    name: "مقصد پرتکرار",
    icon: "location-check",
    isTable: true,
    Component: <></>,
  },
  waybills: {
    name: "بارنامه",
    icon: "receipt",
    isTable: true,
    Component: <></>,
  },
  drafts: {
    name: "حواله",
    icon: "scroll-old",
    isTable: true,
    Component: <></>,
  },
  timeline: {
    name: "تقویم راننده",
    icon: "calendar-days",
    isTable: false,
    Component: <></>,
  },
};

const renderInfo = (title, value) => {
  return (
    <Stack direction="row" spacing={1}>
      <Typography fontWeight={700}>{title}:</Typography>
      <Typography>{value}</Typography>
    </Stack>
  );
};

const DriverReport = ({ driver, fleet, start, end }) => {
  const [category, setCategory] = useState("products");
  const [showFade, setShowFade] = useState(true);
  const [dataWaybill, setDataWaybill] = useState(null);
  const [dataDraft, setDataDraft] = useState(null);
  const [showModal, setShowModal] = useState(null);

  const FLEET_REPORT_INFOS = {
    products: {
      name: "بیشترین بار حمل شده (محصول پرتکرار)",
      icon: "box",
      isTable: true,
    },

    most_visited_sources: {
      name: "مبدا پرتکرار",
      icon: "location-dot",
      isTable: true,
    },
    most_visited_destinations: {
      name: "مقصد پرتکرار",
      icon: "location-check",
      isTable: true,
    },
    waybills: {
      name: "بارنامه",
      icon: "receipt",
      isTable: true,
    },
    drafts: {
      name: "حواله",
      icon: "scroll-old",
      isTable: true,
    },
    timeline: {
      name: "تقویم راننده",
      icon: "calendar-days",
      isTable: false,
    },
  };
  const queryParams = filteringMethod({
    start,
    end,
  });
  const {
    data: report,
    isLoading,
    isFetching,
  } = useQuery(
    [
      fleet ? "fleet-report" : "driver-report",
      fleet ? fleet?.id : driver?.account_id,
      start,
      end,
    ],
    () =>
      axiosApi({
        url: fleet
          ? `fleet-report/${fleet?.id}${queryParams}`
          : `driver-report/${driver?.account_id}${queryParams}`,
      }).then((res) => res.data.Data),
    {
      staleTime: 24 * 60 * 60 * 1000,
      enabled: fleet ? !!fleet?.id : !!driver?.account_id,
    }
  );

  const handleChangeCategory = (val) => {
    setShowFade(false);
    setTimeout(() => {
      setCategory(val);
      setShowFade(true);
    }, 350);
  };

  const Components = {
    timeline: (
      <DriverTimeMonth driver={driver} fleet={fleet} start={start} end={end} />
    ),
  };

  const closeModal = () => {
    setShowModal(null);
  };

  const handleShowDraft = (draft) => {
    setDataDraft(draft);
    setShowModal("draftDetail");
  };
  const handleShowWaybill = (waybill) => {
    setDataWaybill(waybill);
    setShowModal("waybillDetail");
  };

  const DynamicComponent = DRIVER_REPORT_INFOS[category].Component;
  return (
    <>
      {isLoading || isFetching ? (
        <LoadingSpinner />
      ) : (
        <Box>
          {driver && (
            <Typography mt={2} variant="h5" fontWeight={700} mb={2}>
              گزارش راننده - {driver?.person?.first_name ?? ""}{" "}
              {driver?.person?.last_name ?? ""}
            </Typography>
          )}

          <Grid container spacing={2} mt={1}>
            <Grid item md={4} xs={12}>
              {renderInfo(
                "مجموع تناژ حمل شده",
                renderWeight(report?.total_weight)
              )}
            </Grid>
            <Grid item md={4} xs={12}>
              {renderInfo(
                "جمع ریالی بارنامه",
                numberWithCommas(report?.total_amount) + " ریال"
              )}
            </Grid>
            <Grid item md={4} xs={12}>
              {renderInfo(
                "مجموع مدت زمان سیر",
                numberWithCommas(report?.average_shipping_time) + " ساعت"
              )}
            </Grid>

            <Grid item xs={12}>
              <Stack
                direction="row"
                spacing={2.5}
                flexWrap="wrap"
                sx={{
                  borderWidth: "1px 0px",
                  borderStyle: "solid",
                  borderColor: "divider",
                  py: 3,
                }}
              >
                {Object.entries(
                  fleet ? FLEET_REPORT_INFOS : DRIVER_REPORT_INFOS
                ).map(([key, values]) => {
                  return (
                    <Button
                      endIcon={<SvgSPrite icon={values.icon} color="inherit" />}
                      key={key}
                      variant={category === key ? "contained" : "outlined"}
                      onClick={() => handleChangeCategory(key)}
                      color="secondary"
                    >
                      {values.name}
                    </Button>
                  );
                })}
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Fade timeout={300} in={showFade}>
                <Box sx={{ px: 5, pb: 5 }}>
                  <Typography
                    mb={4}
                    mt={2}
                    variant="h6"
                    fontWeight={700}
                    textAlign="center"
                  >
                    {DRIVER_REPORT_INFOS[category].name}
                  </Typography>

                  
                  {category === "drafts" ? (
                    <Grid container spacing={2} p={2}>
                      {report?.drafts?.map((item) => {
                        return (
                          <Grid key={item.id} item xs={12} md={4}>
                            <Card sx={{ p: 2 }}>
                              <Stack justifyContent="center" spacing={3}>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  lineHeight={1}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    lineHeight="inherit"
                                  >
                                    شماره
                                  </Typography>
                                  <Divider
                                    sx={{
                                      borderBottomWidth: "medium",
                                      borderBottomStyle: "dashed",
                                      mx: 1,
                                      flex: 1,
                                    }}
                                  />
                                  <Typography
                                    variant="subtitle2"
                                    lineHeight="inherit"
                                  >
                                    {item?.DraftNumber ?? "-"}
                                  </Typography>
                                </Stack>
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  onClick={() => {
                                    handleShowDraft(item);
                                  }}
                                >
                                  نمایش
                                </Button>
                              </Stack>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  ) : category === "waybills" ? (
                    <Grid container spacing={2} p={2}>
                      {report?.waybills?.map((item) => {
                        return (
                          <Grid key={item.id} item xs={12} md={4}>
                            <Card sx={{ p: 2 }}>
                              <Stack justifyContent="center" spacing={3}>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  lineHeight={1}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    lineHeight="inherit"
                                  >
                                    شماره
                                  </Typography>
                                  <Divider
                                    sx={{
                                      borderBottomWidth: "medium",
                                      borderBottomStyle: "dashed",
                                      mx: 1,
                                      flex: 1,
                                    }}
                                  />
                                  <Typography
                                    variant="subtitle2"
                                    lineHeight="inherit"
                                  >
                                    {item?.WayBillNumber ?? "-"}
                                  </Typography>
                                </Stack>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  lineHeight={1}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    lineHeight="inherit"
                                  >
                                    سریال
                                  </Typography>
                                  <Divider
                                    sx={{
                                      borderBottomWidth: "medium",
                                      borderBottomStyle: "dashed",
                                      mx: 1,
                                      flex: 1,
                                    }}
                                  />
                                  <Typography
                                    variant="subtitle2"
                                    lineHeight="inherit"
                                  >
                                    {item?.WayBillSerial ?? "-"}
                                  </Typography>
                                </Stack>
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  onClick={() => {
                                    handleShowWaybill(item);
                                  }}
                                >
                                  نمایش
                                </Button>
                              </Stack>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  ) : DRIVER_REPORT_INFOS[category].isTable ? (
                    <NormalTable
                      headCells={headCells}
                      sx={{ maxHeight: "calc(70vh - 132px)" }}
                    >
                      <TableBody>
                        {Object.entries(report?.[category]).map(
                          ([name, value], i) => {
                            return (
                              <TableRow key={i} hover tabIndex={-1}>
                                <TableCell align="center" scope="row">
                                  {name ?? "-"}
                                </TableCell>
                                <TableCell align="center" scope="row">
                                  {numberWithCommas(value?.count)}
                                </TableCell>
                                <TableCell align="center" scope="row">
                                  {renderWeight(value?.weight)}
                                </TableCell>
                              </TableRow>
                            );
                          }
                        )}
                      </TableBody>
                    </NormalTable>
                  ) : (
                    Components[category]
                  )}
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* modals */}

      {/* waybill details Modal */}
      <WaybillDetailsModal
        open={showModal === "waybillDetail"}
        onClose={closeModal}
        data={dataWaybill}
      />

      {/* draft details Modal */}
      <DraftDetailsModal
        open={showModal === "draftDetail"}
        onClose={closeModal}
        data={dataDraft}
      />
    </>
  );
};

const DriverTimeMonth = ({ driver, fleet, start, end }) => {
  const queryParams = filteringMethod({ start, end });
  const {
    data: driverTimeline,
    isSuccess,
    isLoading,
    isFetching,
  } = useQuery(
    ["driver", "driver-timeline", fleet, driver?.account_id, start, end],
    () =>
      axiosApi({
        url: `/driver-timeline/${
          driver ? driver.account_id : fleet?.id
        }${queryParams}`,
      }).then((res) => res.data.Data.timeline),

    {
      enabled: driver ? !!driver?.account_id : !!fleet?.id,
    }
  );
  const calender = useMemo(() => {
    if (isSuccess) {
      return Object.entries(driverTimeline).map((item) => {
        const [day, requests] = item;

        return renderTimeCalender(day, requests);
      });
    }
  }, [isSuccess, driverTimeline]);
  return (
    <>
      <Box sx={{ margin: 1 }}>
        {isLoading || isFetching ? (
          <LoadingSpinner />
        ) : (
          <Stack direction="row" justifyContent="space-between">
            {calender}
          </Stack>
        )}
      </Box>
    </>
  );
};

export default DriverReport;
