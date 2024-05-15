/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  Divider,
  Grid,
  Stack,
  Switch,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { FormContainer, FormInputs } from "Components/Form";
import FormTypography from "Components/FormTypography";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { ISLANDS, PROVINCES, SEAS } from "Components/IranProvinces";
import NormalTable from "Components/NormalTable";
import PieChart from "Components/charts/PieChart";
import { TOOLBAR_INPUTS_NAME } from "Components/pages/monitoring/vars";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import {
  enToFaNumber,
  filteringMethod,
  numberWithCommas,
  renderSelectOptions,
  renderWeight,
} from "Utility/utils";
import { axiosApi } from "api/axiosApi";
import { useEffect } from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const fillCOlors = [
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
];

const RequestsByProvincesPage = () => {
  const [bound, setBound] = useState([]);
  const [position, setPosition] = useState("destination");
  const [provinceId, setProvinceId] = useState(null);
  const [provinceTitle, setProvinceTitle] = useState(null);
  const theme = useTheme();

  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const queryParams = filteringMethod({
    min_date: watch("date")?.date_from,
    max_date: watch("date")?.date_to,
    province_id: provinceId,
  });
  const {
    data: allProvincesData,
    isError,
    isFetching,
    isLoading,
    isSuccess,
  } = useQuery(
    ["requestsByProvinces", position],
    () =>
      axiosApi({
        url: `/requests-by-provinces?position=${position}`,
      }).then((res) => res.data.Data),
    {
      staleTime: 10 * 60 * 1000,
    }
  );
  const {
    data: allRequestsDataByCities,
    isFetching: isFetchingRequestsDataByCities,
    isSuccess: isSuccessRequestsDataByCities,
  } = useQuery(
    ["RequestsDataByCities", position, provinceId, queryParams],
    () =>
      axiosApi({
        url: `/requests-data-by-cities?position=${position}${queryParams?.replace(
          "?",
          ""
        )}`,
      }).then((res) => res.data.Data),
    {
      staleTime: 10 * 60 * 1000,
      enabled: !!provinceId,
    }
  );
  const {
    data: allRequestsDataByProducts,
    isFetching: isFetchingRequestsDataByProducts,
    isSuccess: isSuccessRequestsDataByProducts,
  } = useQuery(
    ["RequestsDataByProducts", position, queryParams],
    () =>
      axiosApi({
        url: `/requests-by-products?position=${position}${queryParams?.replace(
          "?",
          ""
        )}`,
      }).then((res) => res.data.Data),
    {
      staleTime: 10 * 60 * 1000,
    }
  );

  useMemo(() => {
    if (isSuccess) {
      let min = Infinity;
      let max = -Infinity;
      allProvincesData.forEach((item) => {
        if (item.count < min) {
          min = item.count;
        }

        if (item.count > max) {
          max = item.count;
        }
      });

      const intervalNum = Math.ceil(
        (max - min - fillCOlors.length) / (fillCOlors.length - 1)
      );

      let bound = [];

      let num = min;
      while (num <= max) {
        num += intervalNum + 1;
        bound.push(num);
      }

      setBound(bound);
    }
  }, [isSuccess]);

  const headCells = [
    {
      id: "name",
      label: "نام",
    },
    {
      id: "amount",
      label: "تعداد",
      // sortable: true,
    },
    {
      id: "weight",
      label: "وزن",
    },
    {
      id: "price",
      label: "قیمت (ریال)",
    },
  ];
  // if api has got error
  if (isError) {
    return <div className="">error</div>;
  }

  const informProvince = (id) => {
    return allProvincesData.find((item) => item.id === id);
  };

  const renderFillColor = (count) => {
    return bound.indexOf(bound.find((item) => item >= count));
  };
  const Inputs = [
    {
      sx: { minWidth: 300 },
      type: "rangeDate",
      name: TOOLBAR_INPUTS_NAME.date,
      label: "بازه تاریخ",
      control: control,
    },
  ];
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <>
      <HelmetTitlePage title="گزارش جامع کشوری" />

      <Card sx={{ p: 2 }}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <Stack flexDirection={"row"} width={"max-content"}>
            <FormInputs inputs={Inputs} />
            <Stack
              flexDirection={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              ml={2}
            >
              <Typography>مبداء</Typography>

              <Switch
                defaultChecked
                onChange={(event) => {
                  if (event.target.checked) {
                    setPosition("destination");
                  } else {
                    setPosition("source");
                  }
                }}
              />

              <Typography>مقصد</Typography>
            </Stack>
          </Stack>
        </FormContainer>
        <Divider sx={{ mt: 1, mb: 2 }} />
        <Grid container spacing={7}>
          <Grid item md={5.5} xs={12}>
            <Box width="100%">
              {isFetching || isLoading ? (
                <LoadingSpinner />
              ) : (
                <svg
                  viewBox="0 0 1200 1070.6"
                  width={"100%"}
                  height={"100%"}
                  style={{ marginTop: 20 }}
                >
                  <g>
                    {PROVINCES.map((province) => {
                      const info = informProvince(province.id);
                      return (
                        <Tooltip
                          title={
                            <Stack>
                              <Typography fontWeight={700}>
                                {province.title}
                              </Typography>
                              <Typography>
                                {enToFaNumber(info?.count)} بار
                              </Typography>
                              <Typography>
                                {renderWeight(info?.weight)}
                              </Typography>
                              <Typography>
                                {numberWithCommas(info?.price) + " تومان"}
                              </Typography>
                            </Stack>
                          }
                          placement="bottom"
                          arrow
                        >
                          <Box
                            component="path"
                            fill={
                              theme.palette.primary[
                                fillCOlors[renderFillColor(info.count)]
                              ]
                            }
                            sx={{
                              stroke: "white",
                              transition: "all 0.3s",
                              cursor: "pointer",
                              ":hover": {
                                fill: theme.palette.primary.main,
                                transform: "scale(1.005)",
                              },
                              fill:
                                provinceId === province?.id
                                  ? theme.palette.primary.main
                                  : null,
                            }}
                            onClick={() => {
                              setProvinceId(province?.id);
                              setProvinceTitle(province?.title);
                            }}
                            key={province.id}
                            {...province}
                          ></Box>
                        </Tooltip>
                      );
                    })}
                  </g>

                  <g>
                    {SEAS.Khazr}
                    {SEAS.Khalij}
                  </g>
                  <g>{ISLANDS}</g>
                </svg>
              )}
              {provinceTitle && (
                <Stack mt={4}>
                  <Typography margin={"auto"}>
                    نام استان : {provinceTitle}
                  </Typography>
                </Stack>
              )}
            </Box>
          </Grid>
          <Grid item md={1} xs={12}>
            <Divider orientation="vertical" />
          </Grid>

          <Grid item md={5.5} xs={12}>
            {isFetchingRequestsDataByCities ||
            isFetchingRequestsDataByProducts ? (
              <Stack mt={6}>
                <LoadingSpinner />
              </Stack>
            ) : (
              <>
                <Box
                  sx={{
                    height: 270,

                    margin: "auto",
                    width: "max-content",
                  }}
                >
                  {isSuccessRequestsDataByCities && provinceId ? (
                    <PieChart
                      labels={allRequestsDataByCities?.map((item) => {
                        return item?.name;
                      })}
                      dataValues={allRequestsDataByCities?.map((item) => {
                        return item?.count;
                      })}
                      height={50}
                    />
                  ) : (
                    isSuccess && (
                      <PieChart
                        labels={allProvincesData?.map((item) => {
                          return item?.name;
                        })}
                        dataValues={allProvincesData?.map((item) => {
                          return item?.count;
                        })}
                        height={50}
                      />
                    )
                  )}
                </Box>

                {isSuccessRequestsDataByProducts && (
                  <Box
                    sx={{ height: 270, margin: "auto", width: "max-content" }}
                  >
                    <PieChart
                      labels={Object.keys(allRequestsDataByProducts)}
                      dataValues={Object.values(allRequestsDataByProducts)}
                      height={50}
                    />
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Card>

      <NormalTable
        headCells={headCells}
        sx={{ maxHeight: "calc(70vh - 132px)", mt: 3 }}
      >
        <TableBody>
          {(isSuccessRequestsDataByCities
            ? allRequestsDataByCities
            : allProvincesData
          )
            ?.sort((a, b) => {
              return b?.price - a?.price;
            })
            ?.map((item, i) => {
              return (
                <TableRow key={i} hover tabIndex={-1}>
                  <TableCell align="center" scope="row">
                    {item?.name ?? "-"}
                  </TableCell>
                  <TableCell align="center" scope="row">
                    {enToFaNumber(item?.count)}
                  </TableCell>
                  <TableCell align="center" scope="row">
                    {renderWeight(item?.weight)}
                  </TableCell>
                  <TableCell align="center" scope="row">
                    {numberWithCommas(item?.price)}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </NormalTable>
    </>
  );
};

export default RequestsByProvincesPage;
