/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Modal,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CollapseForm from "Components/CollapseForm";
import { FormContainer, FormInputs } from "Components/Form";
import FormTypography from "Components/FormTypography";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { SvgSPrite } from "Components/SvgSPrite";
import LineChart from "Components/charts/LineChart";
import MultiPieChart from "Components/charts/MultiPieChart";
import PieChart from "Components/charts/PieChart";
import { ChooseProject } from "Components/choosers/ChooseProject";
import AddressDetailModal from "Components/modals/AddressDetailModal";
import ContractDetailModal from "Components/modals/ContractDetailModal";
import DraftDetailsModal from "Components/modals/DraftDetailsModal";
import ProjectDetailModal from "Components/modals/ProjectDetailModal";
import RequestDetailModal from "Components/modals/RequestDetailModal";
import ShowDriverFleet from "Components/modals/ShowDriverFleet";
import ShowVehiclesFleet from "Components/modals/ShowVehiclesFleet";
import VehicleDetailModal from "Components/modals/VehicleDetailModal";
import WaybillDetailsModal from "Components/modals/WaybillDetailsModal";
import DraftPaper from "Components/papers/DraftPaper";
import WayBillPaper from "Components/papers/WaybillPaper";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import {
  enToFaNumber,
  handleDate,
  numberWithCommas,
  renderMobileFormat,
  renderPlaqueObjectToString,
  renderWeight,
} from "Utility/utils";
import { axiosApi } from "api/axiosApi";
import { useEffect } from "react";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";

const CardsStyle = {
  width: "100%",
  height: "100%",
  p: 2,
  boxShadow: 1,
};

const ReportRemainProject = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(null);
  const [fleets, setFleets] = useState([]);
  const [fVehicle, setFVehicle] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [dataWaybill, setDataWaybill] = useState(null);
  const [dataDraft, setDataDraft] = useState(null);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [labelDate, setLabelDate] = useState([]);
  const [actualData, setActualData] = useState([]);
  const [planData, setPlanData] = useState([]);
  const {
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    handleSubmit,
    reset,
  } = useForm();

  // if there is no param, so reset all
  useEffect(() => {
    if (!Object.keys(params).length) {
      queryClient.invalidateQueries([
        "project",
        params?.id ?? selectedProject?.id,
      ]);
      setSelectedProject(null);
      reset();
    }
  }, [params]);

  // get project
  const {
    data: projectData,
    isFetching,
    isLoading,
    isSuccess,
  } = useQuery(
    ["project", params?.id ?? selectedProject?.id],
    () =>
      axiosApi({ url: `project/${params?.id ?? selectedProject?.id}` }).then(
        (res) => res.data.Data
      ),
    {
      enabled: !!selectedProject?.id || !!params?.id,
      onSuccess: (data) => {
        setValue("project", data);
        setSelectedProject(data);
      },
    }
  );

  const chartValues = {
    "درخواست شده": projectData?.set_weight,
    "پذیرفته شده توسط راننده": projectData?.submit_weight,
    "برنامه‌ریزی نشده(باقیمانده)": projectData?.remaining_weight,
    "بارگیری شده": projectData?.load_weight,
    "حمل شده": projectData?.done_weight,
  };

  // get requests according to project
  const {
    data: requestsData,
    isFetching: isFetchingRequests,
    isLoading: isLoadingRequests,
  } = useQuery(
    ["request", { project_id: selectedProject?.id, all: 1 }],
    () =>
      axiosApi({ url: `request?project_id=${selectedProject?.id}&all=1` }).then(
        (res) => res.data.Data
      ),
    {
      enabled: !!selectedProject?.id && isSuccess,
    }
  );

  const { data: actualPlan } = useQuery(
    ["actualPlan", params?.id ?? selectedProject?.id],
    () =>
      axiosApi({
        url: `/project-actual-plan/${params?.id ?? selectedProject?.id}`,
      }).then((res) => res.data.Data),
    {
      enabled: !!selectedProject?.id || !!params?.id,
      onSuccess: (data) => {
        let actual = [];
        let plan = [];
        let date = [];
        if (data?.plan) {
          data?.plan?.map((item) => {
            plan.push(Object.values(item)[0]);
            date.push(enToFaNumber(Object.keys(item)[0]));
          });
          data?.actual?.map((item) => {
            actual.push(Object.values(item)[0]);
          });
          setLabelDate(date);
          setPlanData(plan);
          setActualData(actual);
        }
      },
    }
  );
  const Inputs = [
    {
      type: "custom",
      customView: (
        <ChooseProject
          control={control}
          name={"project"}
          rules={{
            required: "پروژه را انتخاب کنید",
          }}
        />
      ),
      gridProps: { md: 4 },
    },
  ];

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  // handle on submit
  const onSubmit = (data) => {
    navigate(`/project/report/${data?.project?.id}`);
    setSelectedProject(data?.project);
  };

  // ui functions
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

  const handleShowDrivers = (data) => {
    setShowModal("fleet");
    setFleets(data);
  };

  const handleShowFleetDrivers = (vehicle) => {
    setShowModal("driverFleet");
    setFVehicle(vehicle);
  };

  const handleShowVehicleModal = (vehicle) => {
    setShowModal("vehicle");
    setFVehicle(vehicle);
  };

  const handleShowDraft = (draft) => {
    setDataDraft(draft);
    setShowModal("draftDetail");
  };
  const handleShowWaybill = (waybill) => {
    setDataWaybill(waybill);
    setShowModal("waybillDetail");
  };

  const toggleShowModal = () => {
    setShowModal(null);
  };
  const renderItem = (title, value, md = 3, xs = 6) => {
    return (
      <Grid item display="flex" gap={1} md={md} xs={xs}>
        <Typography fontWeight="bold" variant="subtitle2">
          {title}:
        </Typography>
        <Typography fontWeight="normal" variant="subtitle2">
          {value}
        </Typography>
      </Grid>
    );
  };
  return (
    <>
      <HelmetTitlePage title="گزارش مانده پروژه" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <Card sx={{ p: 2, boxShadow: 1 }}>
            <FormTypography> انتخاب پروژه </FormTypography>
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

      {!!projectData && !(isFetching || isLoading) && (
        <>
          <Card sx={{ p: 2, boxShadow: 1, mt: 2 }}>
            <FormTypography>اطلاعات قراداد</FormTypography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Grid container spacing={2}>
                  {renderItem("کد", enToFaNumber(projectData?.contract?.code))}
                  {renderItem(
                    "صاحب بار",
                    `${
                      projectData?.contract?.owner?.first_name ??
                      projectData?.contract?.owner?.name ??
                      "فاقد نام"
                    } ${projectData?.contract?.owner?.last_name ?? ""}`
                  )}
                  {renderItem(
                    "تاریخ شروع",
                    handleDate(projectData?.contract?.start_date, "YYYY/MM/DD")
                  )}
                  {renderItem(
                    "تاریخ پایان",
                    handleDate(projectData?.contract?.end_date, "YYYY/MM/DD")
                  )}
                  {renderItem(
                    "شرکت حمل",
                    projectData?.contract?.shipping_company?.name ?? "-"
                  )}
                  {renderItem(
                    "ارزش کل",
                    numberWithCommas(projectData?.contract?.total_amount) +
                      " ریال"
                  )}
                  {renderItem(
                    "محصولات",
                    projectData?.contract?.products
                      .map((product) => product.title)
                      .join(", "),
                    12,
                    12
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Card>
          <Grid mt={2} container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={CardsStyle}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="h5">اطلاعات کلی</Typography>

                  <Tooltip title="مشاهده کامل اطلاعات" placement="right">
                    <IconButton
                      component={Link}
                      to={`/project/${projectData?.id}`}
                      target="_blank"
                    >
                      <SvgSPrite icon="pencil" size="small" color="inherit" />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <Grid container spacing={2} mt={2}>
                  {RowLabelAndData(
                    "کد",
                    enToFaNumber(projectData?.code) ?? "-",
                    <SvgSPrite icon="qrcode" MUIColor="primary" size="small" />
                  )}
                  {RowLabelAndData(
                    "تاریخ ثبت",
                    handleDate(projectData?.created_at, "YYYY/MM/DD") ?? "-",
                    <SvgSPrite
                      icon="check-to-slot"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "تاریخ شروع",
                    handleDate(projectData?.start_date, "YYYY/MM/DD") ?? "-",
                    <SvgSPrite
                      icon="check-to-slot"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "تاریخ پایان",
                    handleDate(projectData?.end_date, "YYYY/MM/DD") ?? "-",
                    <SvgSPrite
                      icon="check-to-slot"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "تعداد درخواست ‌ها",
                    enToFaNumber(projectData?.requests_count) ?? "-",
                    <SvgSPrite icon="hashtag" size="small" MUIColor="primary" />
                  )}
                  {RowLabelAndData(
                    "نام محصول",
                    projectData?.product?.title ?? "-",
                    <SvgSPrite icon="hashtag" size="small" MUIColor="primary" />
                  )}
                  {RowLabelAndData(
                    "وزن کل درخواست‌ها",
                    projectData?.requests_total_weight
                      ? renderWeight(projectData?.requests_total_weight)
                      : "-",
                    <SvgSPrite
                      icon="weight-scale"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "وزن درخواست‌ شده",
                    projectData?.set_weight
                      ? renderWeight(projectData?.set_weight)
                      : "-",
                    <SvgSPrite
                      icon="weight-scale"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "وزن پذیرفته شده",
                    projectData?.submit_weight
                      ? renderWeight(projectData?.submit_weight)
                      : "-",
                    <SvgSPrite
                      icon="weight-scale"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "وزن بارگیری شده",
                    projectData?.load_weight
                      ? renderWeight(projectData?.load_weight)
                      : "-",
                    <SvgSPrite
                      icon="weight-scale"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "وزن حمل شده",
                    projectData?.done_weight
                      ? renderWeight(projectData?.done_weight)
                      : "-",
                    <SvgSPrite
                      icon="weight-scale"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "وزن باقیمانده",
                    projectData?.remaining_weight
                      ? renderWeight(projectData?.remaining_weight)
                      : "-",
                    <SvgSPrite
                      icon="weight-scale"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "وزن قراداد",
                    projectData?.contract_weight
                      ? renderWeight(projectData?.contract_weight)
                      : "-",
                    <SvgSPrite
                      icon="weight-scale"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "وزن پروژه",
                    projectData?.weight
                      ? renderWeight(projectData?.weight)
                      : "-",
                    <SvgSPrite
                      icon="weight-scale"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "میانگین زمان حمل پروژه",
                    enToFaNumber(projectData?.average_shipping_time) ?? "-",
                    <SvgSPrite
                      icon="alarm-clock"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "زمان اتمام پروژه",
                    projectData?.remaining_time ?? "-",
                    <SvgSPrite
                      icon="rectangle-history"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                </Grid>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={CardsStyle}>
                <Typography variant="h5">وضعیت پروژه</Typography>

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
                  height={500}
                />
                <Divider sx={{ mt: 1 }} />

                <LineChart
                  labels={labelDate}
                  actual={actualData}
                  plan={planData}
                />
              </Card>
            </Grid>

            <Grid item md={6} xs={12}>
              <Card
                sx={{
                  height: "100%",
                }}
              >
                <FormTypography variant="h5" m={2}>
                  لیست راننده‌ها در درخواست های پروژه
                </FormTypography>
                <Box sx={{ p: 2, maxHeight: "500px", overflowY: "auto" }}>
                  {projectData?.drivers?.map((item) => {
                    return (
                      <Card key={item.id} sx={{ p: 2, mt: 2 }}>
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
                              {(item?.first_name ?? "-") +
                                " " +
                                (item?.last_name ?? "")}
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
                              {renderMobileFormat(item?.mobile ?? "-")}
                            </Typography>
                          </Stack>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => handleShowDrivers(item?.fleets)}
                          >
                            نمایش خودروها
                          </Button>
                        </Stack>
                      </Card>
                    );
                  })}
                </Box>
              </Card>
            </Grid>

            <Grid item md={6} xs={12}>
              <Card
                sx={{
                  height: "100%",
                }}
              >
                <FormTypography variant="h5" m={2}>
                  لیست خودرو ها روی درخواست های پروژه
                </FormTypography>

                <Box
                  sx={{
                    p: 2,
                    maxHeight: "500px",
                    overflowY: "auto",
                  }}
                >
                  {projectData?.fleets?.map((item) => {
                    return (
                      <Card key={item.id} sx={{ p: 2, mt: 2 }}>
                        <Stack justifyContent="center" spacing={2}>
                          <Typography
                            variant="clickable"
                            onClick={() => handleShowVehicleModal(item)}
                            width={"100%"}
                          >
                            {renderPlaqueObjectToString(item.vehicle?.plaque)}
                          </Typography>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleShowFleetDrivers(item)}
                          >
                            نمایش رانندگان
                          </Button>
                        </Stack>
                      </Card>
                    );
                  })}
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card
                sx={{
                  height: "100%",
                }}
              >
                <FormTypography variant="h5" m={2}>
                  لیست بارنامه های پروژه
                </FormTypography>
                <Grid container spacing={2} p={2}>
                  {projectData?.waybills?.map((item) => {
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
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card
                sx={{
                  height: "100%",
                }}
              >
                <FormTypography variant="h5" m={2}>
                  لیست حواله های پروژه
                </FormTypography>

                <Grid container spacing={2} p={2}>
                  {projectData?.drafts?.map((item) => {
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
              </Card>
            </Grid>
            <Grid item xs={12}>
              {/* <FormTypography variant="h5"> درخواست‌های پروژه</FormTypography> */}

              {isFetchingRequests || isLoadingRequests ? (
                <LoadingSpinner />
              ) : (
                <CollapseForm
                  onToggle={setOpenCollapse}
                  open={openCollapse}
                  title="درخواست های پروژه"
                  report
                >
                  <Grid container spacing={2} flexWrap="wrap" p={2}>
                    {requestsData?.items?.map((item) => {
                      return (
                        <RequestItem
                          historyActions={requestsData?.history_actions}
                          row={item}
                          key={item.id}
                        />
                      );
                    })}
                  </Grid>
                </CollapseForm>
              )}
            </Grid>
          </Grid>
        </>
      )}

      {/* modals */}
      <ShowDriverFleet
        show={showModal === "driverFleet"}
        data={fVehicle?.drivers}
        onClose={toggleShowModal}
      />

      <VehicleDetailModal
        show={showModal === "vehicle"}
        onClose={toggleShowModal}
        data={fVehicle?.vehicle}
      />

      <ShowVehiclesFleet
        show={showModal === "fleet"}
        data={fleets}
        onClose={toggleShowModal}
      />

      {/* modals */}

      {/* waybill details Modal */}
      <WaybillDetailsModal
        open={showModal === "waybillDetail"}
        onClose={toggleShowModal}
        data={dataWaybill}
      />

      {/* draft details Modal */}
      <DraftDetailsModal
        open={showModal === "draftDetail"}
        onClose={toggleShowModal}
        data={dataDraft}
      />
    </>
  );
};

const RequestItem = ({ row, historyActions }) => {
  const [showModal, setShowModal] = useState(null);

  const handleCloseModal = () => {
    setShowModal(null);
  };

  return (
    <Grid item lg={3} md={4} sm={6} xs={12}>
      <Card sx={{ p: 2 }}>
        <Stack gap={2}>
          <Item
            title="شماره پروژه"
            value={enToFaNumber(row?.code)}
            tooltipName={"مشاهده جزئیات"}
            tooltipIcon={<SvgSPrite icon="qrcode" MUIColor="primary" />}
            tooltipAction={() => setShowModal("request")}
          />
          <Item
            title="مبدا"
            value={row.source_city}
            tooltipName={"مشاهده آدرس"}
            tooltipIcon={<SvgSPrite icon="location-plus" MUIColor="primary" />}
            tooltipAction={() => setShowModal("source")}
          />
          <Item
            title="مقصد"
            value={row.destination_city}
            tooltipName={"مشاهده آدرس"}
            tooltipIcon={<SvgSPrite icon="location-check" MUIColor="success" />}
            tooltipAction={() => setShowModal("destination")}
          />
          {/* <Item
            title="قرارداد"
            value={enToFaNumber(row.project?.contract?.code)}
            tooltipName={"مشاهده قرارداد"}
            tooltipIcon={<SvgSPrite icon="handshake" MUIColor="warning" />}
            tooltipAction={() => setShowModal("contract")}
          />
          <Item
            title="پروژه"
            value={enToFaNumber(row.project?.code)}
            tooltipName={"مشاهده پروژه"}
            tooltipIcon={<SvgSPrite icon="briefcase" MUIColor="error" />}
            tooltipAction={() => setShowModal("project")}
          /> */}

          <Item
            title="محصول"
            value={row.product.title ?? "بدون نام"}
            tooltipIcon={<SvgSPrite icon="shapes" MUIColor="info" />}
            xs={12}
          />
          <Item
            title="زمان حمل"
            value={enToFaNumber(row?.load_time_fa)}
            tooltipIcon={<SvgSPrite icon="clock" MUIColor="disabled" />}
            xs={12}
          />
        </Stack>
      </Card>
      {/* modals */}
      <RequestDetailModal
        open={showModal === "request"}
        onClose={handleCloseModal}
        data={row}
        historyActions={historyActions}
      />
      <ContractDetailModal
        show={showModal === "contract"}
        onClose={handleCloseModal}
        data={row.project?.contract}
      />
      <ProjectDetailModal
        show={showModal === "project"}
        onClose={handleCloseModal}
        data={row.project}
      />
      <AddressDetailModal
        show={showModal === "source"}
        onClose={handleCloseModal}
        data={{
          address: row.source_address,
          lat: row.source_lat,
          lng: row.source_lng,
        }}
        title={"مبدا"}
      />
      <AddressDetailModal
        show={showModal === "destination"}
        onClose={handleCloseModal}
        data={{
          address: row.destination_address,
          lat: row.destination_lat,
          lng: row.destination_lng,
        }}
        title={"مقصد"}
      />
    </Grid>
  );
};

const Item = ({ title, value, tooltipName, tooltipAction, tooltipIcon }) => {
  return (
    <Grid container spacing={0.2} flexWrap="nowrap" whiteSpace="nowrap">
      <Grid item>
        <Typography variant="caption" fontWeight={600}>
          {title}
        </Typography>
      </Grid>

      <Grid item xs={true} marginY="auto" mx={0.6}>
        <Divider
          sx={{
            borderBottomWidth: "medium",
            borderBottomStyle: "dashed",
            px: 1,
          }}
        />
      </Grid>

      <Grid item textOverflow="ellipsis" overflow="hidden">
        <Typography variant="caption">{value ?? "---"}</Typography>
      </Grid>

      {tooltipIcon && (
        <>
          <Grid item xs={true} marginY="auto" mx={0.6}>
            <Divider
              sx={{
                borderBottomWidth: "medium",
                borderBottomStyle: "dashed",
                px: 1,
              }}
            />
          </Grid>
          <Grid item>
            {tooltipAction && !!value ? (
              <Tooltip title={tooltipName} placement="left" arrow>
                <IconButton size="small" onClick={tooltipAction}>
                  {tooltipIcon}
                </IconButton>
              </Tooltip>
            ) : (
              <IconButton size="small" disabled>
                {tooltipIcon}
              </IconButton>
            )}
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default ReportRemainProject;
