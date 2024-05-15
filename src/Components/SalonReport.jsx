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
import { filteringMethod, numberWithCommas, renderWeight } from "Utility/utils";
import { axiosApi } from "api/axiosApi";
import { useState } from "react";
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

const SalonReport = ({ salon, start, end }) => {
  const [category, setCategory] = useState("products");
  const [showFade, setShowFade] = useState(true);
  const [dataWaybill, setDataWaybill] = useState(null);
  const [dataDraft, setDataDraft] = useState(null);
  const [showModal, setShowModal] = useState(null);

  const OWNER_REPORT_INFOS = {
    products: {
      name: "بیشترین بار حمل شده (محصول پرتکرار)",
      icon: "box",
      isTable: true,
    },
    shipping_companies: {
      name: "لیست شرکتهای حمل همکار",
      icon: "truck-fast",
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
    ["salon-report", salon?.id, queryParams],
    () =>
      axiosApi({
        url: `salon-report/${salon?.id}${queryParams}`,
      }).then((res) => res.data.Data),
    {
      staleTime: 24 * 60 * 60 * 1000,
      enabled: !!salon?.id,
    }
  );

  const renderInfo = (title, value) => {
    return (
      <Stack direction="row" spacing={1}>
        <Typography fontWeight={700}>{title}:</Typography>
        <Typography>{value}</Typography>
      </Stack>
    );
  };

  const closeModal = () => {
    setShowModal(null);
  };

  const handleChangeCategory = (val) => {
    setShowFade(false);
    setTimeout(() => {
      setCategory(val);
      setShowFade(true);
    }, 350);
  };

  const handleShowDraft = (draft) => {
    setDataDraft(draft);
    setShowModal("draftDetail");
  };

  const handleShowWaybill = (waybill) => {
    setDataWaybill(waybill);
    setShowModal("waybillDetail");
  };

  return (
    <>
      {isLoading || isFetching ? (
        <LoadingSpinner />
      ) : (
        <Box>
          {salon && (
            <Typography mt={2} variant="h5" fontWeight={700} mb={2}>
              گزارش سالن بار - {salon?.name ?? ""}
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
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Stack
                direction="row"
                spacing={2.5}
                sx={{ height: "90px", alignContent: "space-between" }}
                flexWrap="wrap"
              >
                {Object.entries(OWNER_REPORT_INFOS).map(([key, values]) => {
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
              <Divider />
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
                    {OWNER_REPORT_INFOS[category].name}
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
                  ) : (
                    OWNER_REPORT_INFOS[category].isTable && (
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
                    )
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

export default SalonReport;
