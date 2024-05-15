/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from "@mui/lab";
import {
  Card,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormContainer, FormInputs } from "Components/Form";
import FormTypography from "Components/FormTypography";
import HelmetTitlePage from "Components/HelmetTitlePage";
import NormalTable from "Components/NormalTable";
import { SvgSPrite } from "Components/SvgSPrite";
import LineChart from "Components/charts/LineChart";
import MultiPieChart from "Components/charts/MultiPieChart";
import PieChart from "Components/charts/PieChart";
import { ChooseContract } from "Components/choosers/ChooseContract";
import TableActionCell from "Components/versions/TableActionCell";
import { enToFaNumber, handleDate, numberWithCommas } from "Utility/utils";
import { axiosApi } from "api/axiosApi";
import { useEffect } from "react";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";

const headCells1 = [
  {
    id: "code",
    label: "کد",
  },
  {
    id: "name",
    label: "نام",
  },
  {
    id: "created_at",
    label: "تاریخ ثبت",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];
const headCells2 = [
  {
    id: "name",
    label: "نام",
  },
  {
    id: "mobile",
    label: "موبایل",
  },
  // {
  //   id: "actions",
  //   label: "عملیات",
  // },
];
const headCells3 = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },

  {
    id: "title",
    label: "عنوان",
  },
  {
    id: "address",
    label: "آدرس",
  },
  {
    id: "zip_code",
    label: "کد پستی",
  },
];
const ReportContract = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    handleSubmit,
    reset,
  } = useForm();
  const [selectedContract, setSelectedContract] = useState(null);
  const [labelDate, setLabelDate] = useState([]);
  const [actualData, setActualData] = useState([]);
  const [planData, setPlanData] = useState([]);
  useEffect(() => {
    if (!Object.keys(params).length) {
      queryClient.invalidateQueries([
        "contract",
        params?.id ?? selectedContract?.id,
      ]);
      setSelectedContract(null);
      reset();
    }
  }, [params]);

  const Inputs = [
    {
      type: "custom",
      customView: (
        <ChooseContract
          control={control}
          name={"contract"}
          rules={{
            required: "قرارداد را انتخاب کنید",
          }}
        />
      ),
      gridProps: { md: 4 },
    },
  ];
  const {
    data: contract,
    isFetching,
    isSuccess,
  } = useQuery(
    ["contract", params?.id ?? selectedContract?.id],
    () =>
      axiosApi({ url: `/contract/${params?.id ?? selectedContract?.id}` }).then(
        (res) => res.data.Data
      ),
    {
      enabled: !!selectedContract?.id || !!params?.id,
      onSuccess: (data) => {
        setValue("contract", data);
        setSelectedContract(data);
      },
    }
  );
  const { data: actualPlan } = useQuery(
    ["actualPlan", params?.id ?? selectedContract?.id],
    () =>
      axiosApi({
        url: `/contract-actual-plan/${params?.id ?? selectedContract?.id}`,
      }).then((res) => res.data.Data),
    {
      enabled: !!selectedContract?.id || !!params?.id,
      onSuccess: (data) => {
        let actual = [];
        let plan = [];
        let date = [];
        if (data?.length > 0) {
          data[0]?.plan?.map((item) => {
            plan.push(Object.values(item)[0]);
            date.push(enToFaNumber(Object.keys(item)[0]));
          });
          data[0]?.actual?.map((item) => {
            actual.push(Object.values(item)[0]);
          });
          setLabelDate(date);
          setPlanData(plan);
          setActualData(actual);
        }
      },
    }
  );
  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  // handle on submit new vehicle
  const onSubmit = (data) => {
    navigate(`/contract/report/${data?.contract?.id}`);
    setSelectedContract(data?.contract);
  };
  const RowLabelAndData = (label, info, icon = "") => {
    return (
      <Grid item xs={12}>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <Typography
              sx={{
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mr: 1,
              }}
            >
              {icon}
              {label}:
            </Typography>
          </Grid>
          <Grid item xs={true}>
            <Divider
              sx={{
                borderBottomWidth: "medium",
                borderBottomStyle: "dashed",
                px: 1,
                width: "100%",
              }}
            />
          </Grid>
          <Grid item>
            <Typography textAlign="justify">{info}</Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  };
  const CardsStyle = {
    width: "100%",
    height: "100%",
    p: 2,
    boxShadow: 1,
  };
  const chartValues = {
    "مجموع وزن پروژه ها": contract?.projects_weight,
    "مجموع وزن درخواست ها": contract?.requests_weight,
    "مجموع وزن درخواست های در مسیر": contract?.active_weight,
    "مجموع وزن حمل شده": contract?.done_weight,
    "مجموع وزن باقی مانده": contract?.remaining_weight,
  };

  return (
    <>
      <HelmetTitlePage title="گزارش قرارداد" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <Card sx={{ p: 2, boxShadow: 1 }}>
            <FormTypography> انتخاب قرارداد </FormTypography>
            <FormInputs inputs={Inputs}>
              <Grid item xs={true} />
              <Grid item md="auto" xs={12}>
                <LoadingButton
                  variant="contained"
                  loading={isSubmitting || isFetching}
                  type="submit"
                  sx={{ height: 56 }}
                >
                  نمایش گزارش
                </LoadingButton>
              </Grid>
            </FormInputs>
          </Card>
        </FormContainer>
      </form>

      {!!selectedContract && (
        <>
          {isSuccess && (
            <Grid mt={2} container spacing={2}>
              <Grid item xs={12} md={5}>
                <Stack sx={{ height: "100%" }} justifyContent={"space-between"}>
                  <Card sx={{ p: 2, boxShadow: 1, height: "100%" }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="h5">اطلاعات کلی</Typography>

                      <Tooltip title="مشاهده کامل اطلاعات" placement="right">
                        <IconButton
                          component={Link}
                          to={`/contract/${contract?.id}`}
                          target="_blank"
                        >
                          <SvgSPrite
                            icon="pencil"
                            size="small"
                            color="inherit"
                          />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Grid container spacing={2} mt={2}>
                      {RowLabelAndData(
                        "کد",
                        enToFaNumber(contract?.code) ?? "-",
                        <SvgSPrite
                          icon="qrcode"
                          MUIColor="primary"
                          size="small"
                        />
                      )}
                      {RowLabelAndData(
                        "صاحب بار",
                        contract?.owner?.name ?? "-",
                        <SvgSPrite
                          icon="hashtag"
                          size="small"
                          MUIColor="primary"
                        />
                      )}
                      {RowLabelAndData(
                        "شرکت حمل",
                        contract?.shipping_company?.name ?? "-",
                        <SvgSPrite
                          icon="hashtag"
                          size="small"
                          MUIColor="primary"
                        />
                      )}
                      {RowLabelAndData(
                        "مبلغ قراداد",
                        numberWithCommas(contract?.total_amount) ?? "-",
                        <SvgSPrite
                          icon="hashtag"
                          size="small"
                          MUIColor="primary"
                        />
                      )}
                      {RowLabelAndData(
                        "درصد کمیسیون شرکت حمل",
                        enToFaNumber(contract?.commission_percent) ?? "-",
                        <SvgSPrite
                          icon="hashtag"
                          size="small"
                          MUIColor="primary"
                        />
                      )}
                      {RowLabelAndData(
                        "تاریخ شروع",
                        handleDate(contract?.start_date, "YYYY/MM/DD"),
                        <SvgSPrite
                          icon="hashtag"
                          size="small"
                          MUIColor="primary"
                        />
                      )}
                      {RowLabelAndData(
                        "تاریخ پایان",
                        handleDate(contract?.end_date, "YYYY/MM/DD"),
                        <SvgSPrite
                          icon="hashtag"
                          size="small"
                          MUIColor="primary"
                        />
                      )}
                      {RowLabelAndData(
                        "حداکثر تناژ قابل حمل در روز (تن)",
                        enToFaNumber(contract?.daily_max / 1000) ?? "-",
                        <SvgSPrite
                          icon="hashtag"
                          size="small"
                          MUIColor="primary"
                        />
                      )}
                      {RowLabelAndData(
                        "حداقل تناژ حمل شده در هفته (تن)",
                        enToFaNumber(contract?.weekly_min / 1000) ?? "-",
                        <SvgSPrite
                          icon="hashtag"
                          size="small"
                          MUIColor="primary"
                        />
                      )}
                      {RowLabelAndData(
                        "حداقل تناژ حمل شده در ماه (تن)",
                        enToFaNumber(contract?.monthly_min / 1000) ?? "-",
                        <SvgSPrite
                          icon="hashtag"
                          size="small"
                          MUIColor="primary"
                        />
                      )}
                      {RowLabelAndData(
                        "محصولات",
                        contract?.products
                          .map((product) => product.title)
                          .join(", ")
                      )}
                    </Grid>
                  </Card>
                  <Card sx={{ p: 2, boxShadow: 1, mt: 3, height: "100%" }}>
                    <Grid container spacing={2} mt={2}>
                      <Typography variant="h5" ml={3}>
                        اطلاعات درخواست
                      </Typography>
                      {RowLabelAndData(
                        "کد",
                        enToFaNumber(contract?.code) ?? "-",
                        <SvgSPrite
                          icon="qrcode"
                          MUIColor="primary"
                          size="small"
                        />
                      )}
                      {RowLabelAndData(
                        "مجموع مدت زمان سیر",
                        enToFaNumber(contract?.total_shipping_time) ?? "-",
                        <SvgSPrite
                          icon="hashtag"
                          size="small"
                          MUIColor="primary"
                        />
                      )}
                      {RowLabelAndData(
                        "تعداد درخواست های فعال",
                        enToFaNumber(contract?.active_requests_count) ?? "-",
                        <SvgSPrite
                          icon="hashtag"
                          size="small"
                          MUIColor="primary"
                        />
                      )}
                      {RowLabelAndData(
                        "تعداد درخواست های ثبت شده",
                        enToFaNumber(contract?.set_requests_count) ?? "-",
                        <SvgSPrite
                          icon="hashtag"
                          size="small"
                          MUIColor="primary"
                        />
                      )}
                      {RowLabelAndData(
                        "تعداد درخواست های پذیرفته شده",
                        enToFaNumber(contract?.submit_requests_count) ?? "-",
                        <SvgSPrite
                          icon="hashtag"
                          size="small"
                          MUIColor="primary"
                        />
                      )}
                      {RowLabelAndData(
                        "تعداد درخواست های حمل شده",
                        enToFaNumber(contract?.done_requests_count) ?? "-",
                        <SvgSPrite
                          icon="hashtag"
                          size="small"
                          MUIColor="primary"
                        />
                      )}
                      {RowLabelAndData(
                        "تعداد درخواست های منقضی شده",
                        enToFaNumber(contract?.expired_requests_count) ?? "-",
                        <SvgSPrite
                          icon="hashtag"
                          size="small"
                          MUIColor="primary"
                        />
                      )}
                    </Grid>
                  </Card>
                </Stack>
              </Grid>

              <Grid
                item
                xs={12}
                md={7}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Card sx={CardsStyle}>
                  <FormTypography> وضعیت قراداد </FormTypography>
                  <Stack sx={{ width: "500px", margin: "auto" }}>
                    <MultiPieChart
                      labels={contract?.products.map((product) =>
                        [
                          "مجموع وزن باقی مانده",
                          "مجموع وزن پروژه ها",
                          "مجموع وزن درخواست ها",
                          "مجموع وزن درخواست های در مسیر",
                          "مجموع وزن حمل شده",
                        ].map((title) => `${title} ${product.title}`)
                      )}
                      dataValues={contract?.products.map((product) =>
                        (({
                          remaining_weight,
                          projects_weight,
                          requests_weight,
                          active_weight,
                          done_weight,
                          title,
                        }) => ({
                          remaining_weight,
                          projects_weight,
                          requests_weight,
                          active_weight,
                          done_weight,
                          title,
                        }))(product)
                      )}
                    />
                  </Stack>
                  <Divider sx={{ mt: 1 }} />
                  <Stack sx={{ width: "500px", margin: "auto" }}>
                    <PieChart
                      labels={Object.keys(
                        Object.fromEntries(
                          Object.entries(chartValues).filter(([k, v]) => v > 0)
                        )
                      )}
                      dataValues={Object.values(
                        Object.fromEntries(
                          Object.entries(chartValues).filter(([k, v]) => v > 0)
                        )
                      )}
                    />
                  </Stack>
                  <Divider sx={{ mt: 1 }} />
                  <Stack sx={{ width: "500px", margin: "auto" }}>
                    <LineChart
                      labels={labelDate}
                      actual={actualData}
                      plan={planData}
                    />
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          )}

          <Card sx={{ p: 2, boxShadow: 1, mt: 2 }}>
            <FormTypography> پروژه‌ها </FormTypography>

            <NormalTable
              headCells={headCells1}
              sx={{ maxHeight: "calc(70vh - 132px)" }}
            >
              <TableBody>
                {selectedContract.projects?.map((item) => {
                  return (
                    <TableRow key={item.id} tabIndex={-1}>
                      <TableCell align="center" scope="row">
                        {enToFaNumber(item?.code)}
                      </TableCell>
                      <TableCell align="center" scope="row">
                        {item?.title}
                      </TableCell>

                      <TableCell align="center" scope="row">
                        {handleDate(item.created_at, "YYYY/MM/DD")}
                        {" - "}
                        {handleDate(item.created_at, "HH:MM")}
                      </TableCell>
                      <TableCell>
                        <TableActionCell
                          buttons={[
                            {
                              tooltip: "مشاهده درخواست‌ها",
                              color: "primary",
                              icon: "calendar-clock",
                              link: `/project/report/${item.id}`,
                              name: "request.index",
                              target: "_blank",
                            },
                          ]}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </NormalTable>
          </Card>
          <Card sx={{ p: 2, boxShadow: 1, mt: 2 }}>
            <FormTypography> فرستنده </FormTypography>

            <NormalTable
              headCells={headCells2}
              sx={{ maxHeight: "calc(70vh - 132px)" }}
            >
              <TableBody>
                {selectedContract.senders?.map((item) => {
                  return (
                    <TableRow key={item.id} tabIndex={-1}>
                      <TableCell align="center" scope="row">
                        {item?.person?.name}
                      </TableCell>

                      <TableCell align="center" scope="row">
                        {enToFaNumber(item?.person?.mobile)}
                      </TableCell>
                      {/* <TableCell>
                        <TableActionCell
                          buttons={[
                            {
                              tooltip: "مشاهده اطلاعات",
                              color: "primary",
                              icon: "calendar-clock",
                              link: `/project/report/${item.id}`,
                              name: "request.index",
                              target: "_blank",
                            },
                          ]}
                        />
                      </TableCell> */}
                    </TableRow>
                  );
                })}
              </TableBody>
            </NormalTable>
          </Card>
          <Card sx={{ p: 2, boxShadow: 1, mt: 2 }}>
            <FormTypography> گیرنده </FormTypography>

            <NormalTable
              headCells={headCells2}
              sx={{ maxHeight: "calc(70vh - 132px)" }}
            >
              <TableBody>
                {selectedContract.receivers?.map((item) => {
                  return (
                    <TableRow key={item.id} tabIndex={-1}>
                      <TableCell align="center" scope="row">
                        {item?.person?.name}
                      </TableCell>

                      <TableCell align="center" scope="row">
                        {enToFaNumber(item?.person?.mobile)}
                      </TableCell>
                      {/* <TableCell>
                        <TableActionCell
                          buttons={[
                            {
                              tooltip: "مشاهده اطلاعات",
                              color: "primary",
                              icon: "calendar-clock",
                              link: `/project/report/${item.id}`,
                              name: "request.index",
                              target: "_blank",
                            },
                          ]}
                        />
                      </TableCell> */}
                    </TableRow>
                  );
                })}
              </TableBody>
            </NormalTable>
          </Card>
          <Card sx={{ p: 2, boxShadow: 1, mt: 2 }}>
            <FormTypography> مبداء </FormTypography>

            <NormalTable
              headCells={headCells3}
              sx={{ maxHeight: "calc(70vh - 132px)" }}
            >
              <TableBody>
                {selectedContract?.sources?.map((item) => {
                  return (
                    <TableRow key={item.id} tabIndex={-1}>
                      <TableCell align="center" scope="row">
                        {enToFaNumber(item?.place?.id)}
                      </TableCell>
                      <TableCell align="center" scope="row">
                        {item?.place?.title}
                      </TableCell>
                      <TableCell align="center" scope="row">
                        {item?.place?.address}
                      </TableCell>
                      <TableCell align="center" scope="row">
                        {item?.place?.zip_code}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </NormalTable>
          </Card>
          <Card sx={{ p: 2, boxShadow: 1, mt: 2 }}>
            <FormTypography> مقصد </FormTypography>

            <NormalTable
              headCells={headCells3}
              sx={{ maxHeight: "calc(70vh - 132px)" }}
            >
              <TableBody>
                {selectedContract?.destinations?.map((item) => {
                  return (
                    <TableRow key={item.id} tabIndex={-1}>
                      <TableCell align="center" scope="row">
                        {enToFaNumber(item?.place?.id)}
                      </TableCell>
                      <TableCell align="center" scope="row">
                        {item?.place?.title}
                      </TableCell>
                      <TableCell align="center" scope="row">
                        {item?.place?.address}
                      </TableCell>
                      <TableCell align="center" scope="row">
                        {item?.place?.zip_code}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </NormalTable>
          </Card>
        </>
      )}
    </>
  );
};

export default ReportContract;
