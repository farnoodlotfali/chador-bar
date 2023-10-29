import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { ChooseDriver } from "Components/choosers/driver/ChooseDriver";
import { ChoosePerson } from "Components/choosers/ChoosePerson";
import { FormContainer, FormInputs } from "Components/Form";
import { useController, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useEffect, useReducer, useState } from "react";
import {
  CalenderToDate,
  enToFaNumber,
  renderChip,
  renderChipForInquiry,
  renderPlaqueObjectToString,
  renderSelectOptions2,
  zipCodeRegexPattern,
} from "Utility/utils";
import { Calendar } from "@amir04lm26/react-modern-calendar-date-picker";
import { useProject } from "hook/useProject";
import SearchInput from "Components/SearchInput";
import NormalTable from "Components/NormalTable";
import { useFleet } from "hook/useFleet";
import Map from "Components/Map";
import { Zones } from "@package/map";
import { Marker, Polyline, Tooltip } from "react-leaflet";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { FLEET_FREE_TYPE } from "Constants";
import { BlueCircleMarker, MarkerIcon } from "Components/MarkerIcon";
import ChooseAddressModal from "Components/modals/ChooseAddressModal";
import HelmetTitlePage from "Components/HelmetTitlePage";

const sColor = "red";
const dColor = "green";
const bColor = "blue";

const limeOptions = { color: "lime" };

const NewShippingPlanning = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [submitType, setSubmitType] = useState(0);
  const [addressModal, setAddressModal] = useState(false);
  const [filters, dispatch] = useReducer(filterReducer, initialState);
  const { renderMap, locationName, center } = Map({
    showCenterMarker: true,
    zooms: 10,
  });
  const [addressType, setAddressType] = useState(ADDRESS_TYPES[0]);
  const [addresses, setAddresses] = useState(null);
  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
    setError,
    setFocus,
  } = useForm();

  useEffect(() => {
    setError("source_address", { message: "آدرس مبدا را از نقشه انتخاب کنید" });
    setError("destination_address", {
      message: "آدرس مقصد را از نقشه انتخاب کنید",
    });
  }, []);

  const addMutation = useMutation(
    (data) => axiosApi({ url: "/request", method: "post", data: data }),
    {
      onSuccess() {
        reset();
        queryClient.invalidateQueries(["request"]);
        toast.success("درخواست  با موفقیت ثبت شد");
        navigate("/request");
      },
    }
  );

  // inputs
  const DataInputs = [
    {
      type: "number",
      name: "price",
      label: "هزینه",
      splitter: true,
      control: control,
      rules: {
        required: { value: true, message: "هزینه را وارد کنید" },
      },
    },
    {
      type: "number",
      name: "weight",
      label: "وزن",
      splitter: true,
      control: control,
      rules: {
        required: { value: true, message: "وزن را وارد کنید" },
      },
    },
    {
      type: "number",
      name: "width",
      splitter: true,
      label: "عرض(اختیاری)",
      control: control,
    },
    {
      type: "number",
      name: "length",
      splitter: true,
      label: "طول(اختیاری)",
      control: control,
    },
    {
      type: "number",
      name: "height",
      label: "ارتفاع(اختیاری)",
      splitter: true,
      control: control,
    },
    {
      type: "custom",
      customView: <></>,
      gridProps: { md: 12 },
    },
    {
      type: "custom",
      customView: (
        <ChoosePerson
          control={control}
          name={"owner"}
          rules={{
            required: " صاحب بار را وارد کنید",
          }}
          label="صاحب بار"
        />
      ),
      gridProps: { md: 4 },
    },

    {
      type: "custom",
      customView: (
        <ChoosePerson
          control={control}
          name={"receiver"}
          rules={{
            required: "فرستنده را وارد کنید",
          }}
          label="فرستنده"
        />
      ),
      gridProps: { md: 4 },
    },
    {
      type: "custom",
      customView: (
        <ChoosePerson
          control={control}
          name={"sender"}
          rules={{
            required: "گیرنده را وارد کنید",
          }}
          label="گیرنده"
        />
      ),
      gridProps: { md: 4 },
    },
    {
      type: "textarea",
      name: "description",
      label: "توضیحات",
      control: control,
      gridProps: { md: 12 },
    },
  ];

  const DataInputs1 = [
    {
      type: "custom",
      customView: (
        <ChooseDriver
          control={control}
          name={"driver"}
          dataArray={watch("fleet")?.drivers}
          isLoadFromApi={false}
        />
      ),
    },
  ];

  const DataInputs2 = [
    {
      type: "textarea",
      name: "source_address",
      label: "آدرس",
      control: control,
      readOnly: true,
      rules: {
        required: "آدرس مبدا را از نقشه انتخاب کنید",
      },
    },
    {
      type: "number",
      name: "source_zip_code",
      label: "کد پستی ",
      control: control,
      rules: {
        required: " کد پستی مبدا را وارد کنید",
        maxLength: {
          value: 10,
          message: "کد پستی باید 10 رقمی باشد",
        },
        minLength: {
          value: 10,
          message: "کد پستی باید 10 رقمی باشد",
        },
        pattern: {
          value: zipCodeRegexPattern,
          message: "فرمت کد پستی معتبر نیست",
        },
      },
    },
  ];

  const DataInputs3 = [
    {
      type: "textarea",
      name: "destination_address",
      label: "آدرس",
      control: control,
      readOnly: true,
      rules: {
        required: "آدرس مقصد را از نقشه انتخاب کنید",
      },
    },
    {
      type: "number",
      name: "destination_zip_code",
      label: "کد پستی ",
      control: control,
      rules: {
        required: " کد پستی مقصد را وارد کنید",
        maxLength: {
          value: 10,
          message: "کد پستی باید 10 رقمی باشد",
        },
        minLength: {
          value: 10,
          message: "کد پستی باید 10 رقمی باشد",
        },
        pattern: {
          value: zipCodeRegexPattern,
          message: "فرمت کد پستی معتبر نیست",
        },
      },
    },
  ];

  const DataInputs4 = [
    {
      type: "text",
      name: "project_code",
      label: "پروژه",
      control: control,
      rules: {
        required: "پروژه را از جدول انتخاب کنید",
      },
      readOnly: true,
    },
  ];
  const DataInputs5 = [
    {
      type: "text",
      name: "fleet_code",
      label: "ناوگان",
      control: control,
      rules: {},
      readOnly: true,
    },
  ];

  // handle on submit
  const onSubmit = (data) => {
    // ثبت
    if (!submitType && !data.driver && !data.fleet_code) {
      setError("driver", { message: "راننده را وارد کنید" });
      setError("fleet_code", { message: "ناوگان را از جدول انتخاب کنید" });
      setFocus("fleet_code");
      setFocus("driver");

      return;
    }
    if (!data.driver) {
      toast.error("ناوگان در حال حاضر راننده ندارد");
      return;
    }
    let { project, driver, fleet, receiver, sender, owner, ...newData } = data;

    newData.driver_id = driver.id;
    newData.project_id = project.id;
    newData.fleet_id = fleet.id;
    newData.receiver_id = receiver.id;
    newData.sender_id = sender.id;
    newData.owner_id = owner.id;
    newData.product_id = project.product_id;
    // ایجاد آگهی
    if (submitType) {
      newData.fleet_id = null;
      newData.driver_id = null;
    }

    delete newData.fleet_code;
    delete newData.project_code;

    newData = JSON.stringify(newData);
    addMutation.mutate(newData);
  };

  const renderSelectedZones = (project) => {
    let dIds = [];
    let sIds = [];
    let bothIds = [];

    if (!project) {
      return [];
    }

    project.destination_zones.forEach((item) => dIds.push(item.zone_id));
    project.source_zones.forEach((item) => {
      sIds.push(item.zone_id);
      if (dIds.includes(item.zone_id)) {
        bothIds.push(item.zone_id);
      }
    });

    setAddresses([
      {
        color: sColor,
        ids: sIds,
      },
      {
        color: dColor,
        ids: dIds,
      },
      {
        color: bColor,
        ids: bothIds,
      },
    ]);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value, { shouldValidate: true });
  };
  const {
    data: allProjects,
    isLoading: isLoadingProject,
    isFetching: isFetchingProject,
    isError: isErrorProject,
  } = useProject(filters.project);

  const {
    data: allFleets,
    isLoading: isLoadingFleet,
    isFetching: isFetchingFleet,
    isError: isErrorFleet,
  } = useFleet(filters.fleet);

  if (addMutation.isLoading || addMutation.isFetching) {
    return <LoadingSpinner />;
  }

  if (isErrorProject || isErrorFleet) {
    return <div className="">error</div>;
  }

  const getFilterProjects = (value) => {
    dispatch({ type: PROJECT, payload: { q: value } });
  };
  const getFilterFleets = (value, type = "q") => {
    dispatch({ type: FLEET, payload: { [type]: value } });
  };
  const getFilterFleetsByDate = (value) => {
    dispatch({ type: FLEET, payload: { start_date: value, end_date: value } });
  };

  const RenderItem = ({ title, value, link }) => {
    return (
      <Stack spacing={1} direction="row" sx={{ width: "100%" }}>
        <Typography variant="body2" fontWeight={"700"}>
          {title}:
        </Typography>
        <Typography variant="body2">
          <>
            {value}
            {link && (
              <Typography
                variant="caption"
                marginLeft={2}
                color="blue"
                sx={{
                  "& :hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                <Link to={link} target="_blank" rel="noopener noreferrer">
                  مشاهده{" "}
                </Link>
              </Typography>
            )}
          </>
        </Typography>
      </Stack>
    );
  };

  const handleAddAddress = () => {
    const type = addressType.id;

    handleChange(`${type}_address`, locationName);
    handleChange(`${type}_lat`, center[0]);
    handleChange(`${type}_lng`, center[1]);
  };

  const handleAddFleet = (fleet) => {
    handleChange("fleet", fleet);
    handleChange("fleet_code", fleet.code);
    setValue("driver", fleet?.drivers?.[0]);
  };
  const handleAddProject = (project) => {
    renderSelectedZones(project);
    handleChange("project", project);
    handleChange("project_code", project.code);
  };

  const handleChooseAddress = (item) => {
    const type = addressType.id;
    handleChange(`${type}_address`, item.address);
    handleChange(`${type}_lat`, item.lat);
    handleChange(`${type}_lng`, item.lng);
  };

  return (
    <>
      <HelmetTitlePage title="شرکت حمل جدید" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <Card sx={{ p: 2, boxShadow: 1 }}>
            <Grid container rowSpacing={4} columnSpacing={3}>
              <Grid item md={12} xs={12}>
                <Typography variant="h5">پروژه و تقویم </Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Card sx={{ p: 3, boxShadow: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <SearchInput
                        fullWidth
                        placeholder="جستجو پروژه"
                        onEnter={getFilterProjects}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormInputs inputs={DataInputs4} gridProps={{ md: 12 }} />
                      <Typography variant="caption" color="blue">
                        برای انتخاب پروژه، لطفا روی یکی از سطر جدول کلیک کنید
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      {(!isLoadingProject || !isFetchingProject) &&
                      allProjects.items.data?.length > 0 ? (
                        <Stack
                          spacing={2}
                          sx={{
                            maxHeight: "365px",
                            height: "365px",
                            overflowY: "scroll",
                          }}
                        >
                          <NormalTable headCells={headCells}>
                            {allProjects.items.data.map((row) => {
                              return (
                                <TableRow
                                  hover
                                  tabIndex={-1}
                                  key={row.id}
                                  sx={{
                                    "& :hover": {
                                      cursor: "pointer",
                                    },
                                  }}
                                  selected={watch("project")?.id === row.id}
                                  onClick={() => handleAddProject(row)}
                                >
                                  <TableCell scope="row">{row.code}</TableCell>
                                  <TableCell scope="row">
                                    {row.contract.code}
                                  </TableCell>
                                  <TableCell scope="row">
                                    {enToFaNumber(row.requests_count)}
                                  </TableCell>
                                  <TableCell scope="row">
                                    {enToFaNumber(row.active_requests.length)}
                                  </TableCell>
                                  <TableCell scope="row">
                                    {row.product.title}
                                    <br />
                                    {row.product.unit.title}
                                    <br />
                                    {row.product.group.title}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </NormalTable>
                        </Stack>
                      ) : (
                        <Typography pt={2} pl={2}>
                          {isLoadingProject || isFetchingProject
                            ? "در حال فراخوانی اطلاعات..."
                            : "لیست پروژه‌ها خالی است"}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <ChooseWorkingDaysForRequest
                  project={watch("project")}
                  control={control}
                  name="load_time"
                  rules={{
                    required: "لطفا تاریخ را انتخاب کنید",
                  }}
                  filterBy={getFilterFleetsByDate}
                />
              </Grid>

              <Grid xs={12}>
                <Divider sx={{ my: 3 }} />
              </Grid>

              <Grid item md={12} xs={12}>
                <Typography variant="h5">ناوگان و راننده </Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Card sx={{ p: 3, boxShadow: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <SearchInput
                        fullWidth
                        placeholder="جستجو ناوگان"
                        onEnter={getFilterFleets}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Select
                        sx={{ width: "100%" }}
                        defaultValue={"false"}
                        onChange={(e) =>
                          getFilterFleets(e.target.value, "free")
                        }
                      >
                        {renderSelectOptions2(FLEET_FREE_TYPE).map((item) => {
                          return (
                            <MenuItem value={item.id} key={item.id}>
                              {item.title}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormInputs inputs={DataInputs5} gridProps={{ md: 12 }} />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      {(!isLoadingFleet || !isFetchingFleet) &&
                      allFleets?.items?.data?.length > 0 ? (
                        <Stack
                          spacing={2}
                          sx={{
                            maxHeight: "365px",
                            height: "365px",
                            overflowY: "scroll",
                          }}
                        >
                          <NormalTable headCells={headCells1}>
                            {allFleets?.items?.data.map((row) => {
                              return (
                                <TableRow
                                  hover
                                  tabIndex={-1}
                                  key={row.id}
                                  sx={{
                                    "& :hover": {
                                      cursor: "pointer",
                                    },
                                  }}
                                  selected={watch("fleet")?.id === row.id}
                                  onClick={() => handleAddFleet(row)}
                                >
                                  <TableCell scope="row">
                                    <Typography
                                      variant="body2"
                                      color="blue"
                                      sx={{
                                        "& :hover": {
                                          textDecoration: "underline",
                                        },
                                      }}
                                    >
                                      <Link
                                        to={`/fleet/${row.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {row.code}
                                      </Link>
                                    </Typography>
                                  </TableCell>
                                  <TableCell scope="row">
                                    {enToFaNumber(row.active_requests_count)}
                                  </TableCell>
                                  <TableCell scope="row">
                                    {renderChip(row.status)}
                                  </TableCell>
                                  <TableCell scope="row">
                                    {renderChipForInquiry(row.inquiry)}
                                  </TableCell>
                                  <TableCell scope="row">
                                    {enToFaNumber(row.drivers.length)}
                                  </TableCell>
                                  <TableCell scope="row">
                                    {renderPlaqueObjectToString(
                                      row.vehicle?.plaque
                                    )}
                                    <Typography
                                      variant="caption"
                                      marginLeft={2}
                                      color="blue"
                                      sx={{
                                        "& :hover": {
                                          textDecoration: "underline",
                                        },
                                      }}
                                    >
                                      <Link
                                        to={`/vehicle/${row.vehicle_id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        مشاهده خودرو
                                      </Link>
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </NormalTable>
                        </Stack>
                      ) : (
                        <Typography pt={2} pl={2}>
                          {isLoadingFleet || isFetchingFleet
                            ? "در حال فراخوانی اطلاعات..."
                            : "لیست پروژه‌ها خالی است"}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2, boxShadow: 1, height: "100%" }}>
                  <Stack justifyContent="space-between" height={"100%"}>
                    <Box>
                      <Typography variant="h6" mb={3}>
                        اطلاعات ناوگان انتخابی
                      </Typography>
                      {watch("fleet") ? (
                        <Box display={"flex"} flexWrap="wrap" gap={2}>
                          <RenderItem
                            title={"کد"}
                            value={watch("fleet").code}
                            link={`/fleet/${watch("fleet").id}`}
                          />
                          <RenderItem
                            title={"خودرو"}
                            value={renderPlaqueObjectToString(
                              watch("fleet").vehicle?.plaque
                            )}
                            link={`/vehicle/${watch("fleet").vehicle_id}`}
                          />
                          {watch("driver") && (
                            <>
                              <RenderItem
                                title={"راننده"}
                                link={`/driver/${watch("driver").id}`}
                                value={
                                  (watch("driver").first_name ?? "فاقد نام") +
                                  " " +
                                  (watch("driver").last_name ?? "-")
                                }
                              />
                              <RenderItem
                                title={"موبایل راننده"}
                                value={enToFaNumber(watch("driver").mobile)}
                              />
                            </>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="caption" color="blue">
                          برای انتخاب ناوگان، لطفا روی یکی از سطر جدول کلیک کنید
                        </Typography>
                      )}
                    </Box>
                    <FormInputs gridProps={{ md: 12 }} inputs={DataInputs1} />
                  </Stack>
                </Card>
              </Grid>

              <Grid xs={12}>
                <Divider sx={{ my: 3 }} />
              </Grid>

              <Grid item md={12} xs={12}>
                <Typography variant="h5">آدرس</Typography>
                <Stack direction="row">
                  <Typography variant="caption">
                    لطفا برای انتخاب <strong>مبدا</strong> از ناحیه‌هایی که با
                    رنگ
                  </Typography>
                  <Box width={15} height={15} bgcolor={sColor} mx={0.5} />
                  <Typography variant="caption">
                    مشخص شده‌اند، از روی نقشه انتخاب کنید
                  </Typography>
                </Stack>
                <Stack direction="row" my={2}>
                  <Typography variant="caption">
                    لطفا برای انتخاب <strong>مقصد</strong> از ناحیه‌هایی که با
                    رنگ
                  </Typography>
                  <Box width={15} height={15} bgcolor={dColor} mx={0.5} />
                  <Typography variant="caption">
                    مشخص شده‌اند، از روی نقشه انتخاب کنید
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography variant="caption">
                    ناحیه‌هایی که با رنگ
                  </Typography>
                  <Box width={15} height={15} bgcolor={bColor} mx={0.5} />
                  <Typography variant="caption">
                    مشخص شده‌اند، هم در مبدا و هم در مقصد <strong>مشترک</strong>{" "}
                    هستند و قابل انتخاب هستند
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={8}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} md={9}>
                    <ButtonGroup fullWidth>
                      {ADDRESS_TYPES.map((item) => {
                        return (
                          <Button
                            variant={
                              addressType.id === item.id
                                ? "contained"
                                : "outlined"
                            }
                            key={item.id}
                            onClick={() => setAddressType(item)}
                          >
                            {item.name}
                          </Button>
                        );
                      })}
                    </ButtonGroup>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      fullWidth
                      variant={"contained"}
                      color="success"
                      onClick={handleAddAddress}
                    >
                      تایید {addressType.name}
                    </Button>
                  </Grid>
                </Grid>
                <Box sx={{ height: "450px" }}>
                  {renderMap(
                    <>
                      <Box
                        display="flex"
                        gap={2}
                        position="absolute"
                        top={10}
                        right={10}
                        zIndex={499}
                      >
                        <Button
                          color="tertiary"
                          variant={"contained"}
                          onClick={() => setAddressModal(true)}
                        >
                          مکان های منتخب
                        </Button>
                        <Button color="tertiary" variant={"contained"}>
                          درخواست های دیگر
                        </Button>
                      </Box>

                      <Box
                        display="flex"
                        gap={2}
                        position="absolute"
                        bottom={0}
                        right={0}
                        left={0}
                        zIndex={499}
                        bgcolor="#00000080"
                        p={1}
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Button
                          variant={"contained"}
                          onClick={handleAddAddress}
                          sx={{ px: 3 }}
                        >
                          تایید {addressType.name}
                        </Button>
                        <Typography sx={{ color: "white" }} variant="caption">
                          شما در حال تعیین {addressType.name} هستید
                        </Typography>
                        <Typography sx={{ color: "white" }} variant="caption">
                          {locationName}
                        </Typography>
                      </Box>
                      {watch("source_address") &&
                        watch("destination_address") && (
                          <Polyline
                            pathOptions={limeOptions}
                            positions={[
                              [watch("source_lat"), watch("source_lng")],
                              [
                                watch("destination_lat"),
                                watch("destination_lng"),
                              ],
                            ]}
                          />
                        )}
                      {watch("source_address") && (
                        <Marker
                          icon={MarkerIcon}
                          position={[watch("source_lat"), watch("source_lng")]}
                        >
                          <Tooltip
                            direction="top"
                            offset={[-15, 0]}
                            opacity={1}
                            permanent
                          >
                            <Typography variant="small">مبدا </Typography>
                          </Tooltip>
                        </Marker>
                      )}
                      {watch("destination_address") && (
                        <Marker
                          icon={MarkerIcon}
                          position={[
                            watch("destination_lat"),
                            watch("destination_lng"),
                          ]}
                        >
                          <Tooltip
                            direction="top"
                            offset={[-15, 0]}
                            opacity={1}
                            permanent
                          >
                            <Typography variant="small">مقصد </Typography>
                          </Tooltip>
                        </Marker>
                      )}

                      {watch("project") && (
                        <>
                          <Zones
                            zone={29}
                            level={5}
                            selectedZones={addresses}
                            visibleZones={[
                              ...addresses[0].ids,
                              ...addresses[1].ids,
                              ...addresses[2].ids,
                            ]}
                          />

                          {watch("project").places?.map((place, i) => {
                            return (
                              <Marker
                                key={i}
                                icon={BlueCircleMarker}
                                position={[place.lat, place.lng]}
                                eventHandlers={{
                                  click: (e) => {
                                    console.log("marker clicked", place);
                                  },
                                }}
                              />
                            );
                          })}
                        </>
                      )}
                    </>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ p: 2, boxShadow: 1 }}>
                  <Grid container spacing={3}>
                    <Grid item md={12}>
                      <Typography variant="h6" mb={1}>
                        اطلاعات مبدا
                      </Typography>
                      <FormInputs
                        gridProps={{ xs: 12, md: 12 }}
                        inputs={DataInputs2}
                      />
                    </Grid>

                    <Grid item md={12}>
                      <Typography variant="h6" mb={1}>
                        اطلاعات مقصد
                      </Typography>
                      <FormInputs
                        gridProps={{ xs: 12, md: 12 }}
                        inputs={DataInputs3}
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              <Grid xs={12}>
                <Divider sx={{ my: 3 }} />
              </Grid>

              <Grid item md={12} xs={12}>
                <Typography variant="h5">اطلاعات تکمیلی</Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <FormInputs inputs={DataInputs} />
              </Grid>
            </Grid>
            <Stack
              mt={10}
              justifyContent="flex-end"
              spacing={2}
              direction="row"
              fontSize={14}
            >
              <LoadingButton
                variant="contained"
                // loading={isSubmitting}
                type="submit"
                color={Object.keys(errors).length !== 0 ? "error" : "primary"}
                onClick={() => setSubmitType(0)}
              >
                ثبت
              </LoadingButton>
              <LoadingButton
                variant="contained"
                // loading={isSubmitting}
                type="submit"
                color={Object.keys(errors).length !== 0 ? "error" : "primary"}
                onClick={() => {
                  setSubmitType(1);
                }}
              >
                ایجاد آگهی
              </LoadingButton>
            </Stack>
          </Card>
        </FormContainer>
      </form>

      <ChooseAddressModal
        show={addressModal}
        onClose={() => setAddressModal(false)}
        handleAdd={handleChooseAddress}
        addresses={watch("project")?.places}
      />
    </>
  );
};

const headCells1 = [
  {
    id: "code",
    label: "کد",
  },
  {
    id: "active_requests_count",
    label: "درخواست فعال",
  },
  {
    id: "status",
    label: "وضعیت",
  },
  {
    id: "inquiry",
    label: "استعلام",
  },
  {
    id: "drivers",
    label: "تعداد رانندگان",
  },
  {
    id: "vehicle",
    label: "پلاک خودرو",
  },
];

const headCells = [
  {
    id: "code",
    label: "کد",
  },
  {
    id: "contract",
    label: "قرارداد",
  },

  {
    id: "requests_count",
    label: "تعداد درخواست‌ها",
  },
  {
    id: "active_requests",
    label: "درخواست‌ها فعال",
  },
  {
    id: "product",
    label: "محصول",
  },
];

export default NewShippingPlanning;

const ChooseWorkingDaysForRequest = ({ name, rules, control }) => {
  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name,
    control,
    rules,
  });
  const [selectedDay, setSelectedDay] = useState(null);

  const handleOnChange = (value) => {
    setSelectedDay(value);

    field.onChange(CalenderToDate(value));
  };

  return (
    <Stack alignItems="center" spacing={3}>
      <FormControl variant="outlined">
        <InputLabel>{"تاریخ بارگیری"}</InputLabel>

        <OutlinedInput
          variant="outlined"
          inputRef={field.ref}
          value={
            selectedDay
              ? enToFaNumber(
                  selectedDay.year +
                    "/" +
                    selectedDay.month +
                    "/" +
                    selectedDay.day
                )
              : ""
          }
          label="تاریخ بارگیری"
          error={!!error}
          type="text"
          readOnly
        />

        <FormHelperText error variant="outlined">
          {error?.message}
        </FormHelperText>
      </FormControl>

      <Box>
        <Calendar
          locale="fa"
          value={selectedDay}
          onChange={handleOnChange}
          shouldHighlightWeekends
        />
      </Box>
    </Stack>
  );
};
const initialState = { fleet: { active: true }, project: {} };

const filterReducer = (state, action) => {
  switch (action.type) {
    case FLEET:
      return { ...state, fleet: { ...state.fleet, ...action.payload } };
    case PROJECT:
      return { ...state, project: action.payload };
    default:
      return state;
  }
};

const FLEET = "FLEET";
const PROJECT = "PROJECT";
const ADDRESS_TYPES = [
  {
    name: "مبدا",
    id: "source",
  },
  {
    name: "مقصد",
    id: "destination",
  },
];
