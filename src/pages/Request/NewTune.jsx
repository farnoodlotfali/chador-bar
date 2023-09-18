/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import {
  Button,
  Card,
  Stack,
  Typography,
  Grid,
  Box,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { FormContainer, FormInputs } from "Components/Form";

import { addZeroForTime, enToFaNumber } from "Utility/utils";
import { Helmet } from "react-helmet-async";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useForm } from "react-hook-form";

import { ChoosePerson } from "Components/choosers/ChoosePerson";
import Map, { getPathCoordinates } from "Components/Map";

import { Marker, Polyline, Tooltip } from "react-leaflet";
import { BlueCircleMarker, MarkerIcon } from "Components/MarkerIcon";
import { reverseRoutes } from "Components/DrivingDirection";
import { ChooseProject } from "Components/choosers/ChooseProject";
import { ChooseVType } from "Components/choosers/vehicle/types/ChooseVType";
import Modal from "Components/versions/Modal";
import ChooseAddressModal from "Components/modals/ChooseAddressModal";

import { toast } from "react-toastify";
import { axiosApi } from "api/axiosApi";
import { useNavigate } from "react-router-dom";
import FormTypography from "Components/FormTypography";

const stepsLabels = ["انتخاب مسیر", "تکمیل اطلاعات", "ثبت نهایی"];
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
const limeOptions = { color: "lime" };

const NewTune = () => {
  const [step, setStep] = useState(0);
  const [dataTune, setDataTune] = useState({});
  const allSteps = [StepOne, StepTwo, StepThree];
  const handleOnPrevious = () => {
    setStep((prev) => prev - 1);
  };
  const stepProps = {
    setDataTune,
    setStep,
    dataTune,
    handleOnPrevious,
  };

  const CurrentStep = allSteps[step];

  return (
    <>
      <Helmet title="پنل دراپ - ثبت آهنگ پروژه" />

      <Stepper activeStep={step} alternativeLabel sx={{ mt: 3, mb: 5 }}>
        {stepsLabels.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <CurrentStep {...stepProps} />
    </>
  );
};

const StepOne = (props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: props.dataTune,
  });
  const [addressType, setAddressType] = useState(ADDRESS_TYPES[0]);
  const [routeData, setRouteData] = useState({});
  const [addressModal, setAddressModal] = useState(false);
  const { renderMap, locationName, center } = Map({
    showCenterMarker: true,
    zooms: 10,
  });

  const calculateRoute = () => {
    getPathCoordinates([
      [watch("source_lat"), watch("source_lng")],
      [watch("destination_lat"), watch("destination_lng")],
    ])
      .then((res) => {
        setRouteData((prev) => ({
          ...prev,
          directions: reverseRoutes(res.coordinates),
          time: res.time,
          distance: res.distance,
        }));
      })

      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    if (
      watch("source_lat") &&
      watch("source_lng") &&
      watch("destination_lat") &&
      watch("destination_lng")
    ) {
      calculateRoute();
    }
  }, [watch("source_lat"), watch("destination_lat")]);

  const handleAddAddress = () => {
    handleChange(`${addressType.id}_address`, locationName);
    handleChange(`${addressType.id}_lat`, center[0]);
    handleChange(`${addressType.id}_lng`, center[1]);
  };

  const Inputs = [
    {
      type: "custom",
      customView: (
        <ChooseProject
          control={control}
          name={"project"}
          rules={{
            required: " پروژه را وارد کنید",
          }}
        />
      ),
    },
    {
      type: "text",
      name: "source_address",
      label: "آدرس مبداء",
      control: control,
      rules: {
        required: { value: true, message: " آدرس مبداء را وارد کنید" },
      },
    },
    {
      type: "text",
      name: "source_zip_code",
      label: "کد پستی مبداء",
      control: control,
      rules: {
        required: " کد پستی مبداء را وارد کنید",
        maxLength: {
          value: 10,
          message: "کد پستی باید 10 رقمی باشد",
        },
        minLength: {
          value: 10,
          message: "کد پستی باید 10 رقمی باشد",
        },
      },
    },
    {
      type: "custom",
      customView: (
        <ChoosePerson
          control={control}
          name={"sender"}
          rules={{
            required: "فرستنده را وارد کنید",
          }}
          label="فرستنده"
        />
      ),
    },
    {
      type: "text",
      name: "destination_address",
      label: "آدرس مقصد",
      control: control,
      rules: {
        required: { value: true, message: " آدرس مقصد را وارد کنید" },
      },
    },
    {
      type: "text",
      name: "destination_zip_code",
      label: "کدپستی مقصد",
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
      },
    },
    {
      type: "custom",
      customView: (
        <ChoosePerson
          control={control}
          name={"receiver"}
          rules={{
            required: "گیرنده را وارد کنید",
          }}
          label="گیرنده"
        />
      ),
    },
  ];

  // handle on submit
  const onSubmit = (data) => {
    data.project_id = data.project.id;
    data.sender_id = data.sender.id;
    data.receiver_id = data.receiver.id;
    data.status = 1;
    data.path_id = 21;
    data.shipping_duration =
      routeData?.time <= 60 ? 1 : Math.round(routeData?.time / 60);
    props.setDataTune(data);
    props.setStep((prev) => prev + 1);
  };
  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value, { shouldValidate: true });
  };

  const handleChooseAddress = (item) => {
    const type = addressType.id;
    handleChange(`${type}_address`, item.address);
    handleChange(`${type}_lat`, item.lat);
    handleChange(`${type}_lng`, item.lng);
  };

  return (
    <>
      <Card sx={{ p: 2, overflow: "hidden" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <Grid container columnSpacing={3}>
              <Grid item xs={12} md={8}>
                {renderMap(
                  <>
                    <Stack
                      position={"absolute"}
                      textAlign="center"
                      spacing={1}
                      zIndex={499}
                      left={10}
                      top={10}
                      bgcolor="background.default"
                      color="text.primary"
                      minWidth={200}
                      pt={1}
                    >
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>نوع آدرس</InputLabel>
                        <Select
                          value={addressType.id}
                          label="نوع آدرس"
                          onChange={(e) =>
                            setAddressType(
                              ADDRESS_TYPES.find(
                                (item) => item.id === e.target.value
                              )
                            )
                          }
                        >
                          {ADDRESS_TYPES.map((item) => {
                            return (
                              <MenuItem key={item.id} value={item.id}>
                                {item.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Stack>
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
                      <Button variant={"contained"} onClick={handleAddAddress}>
                        تایید {addressType.name}
                      </Button>
                      <Typography sx={{ color: "white" }} variant="caption">
                        طول مسیر:{" "}
                        {enToFaNumber(routeData?.distance?.toFixed(2) ?? 0) +
                          " کیلومتر"}
                      </Typography>
                      <Typography sx={{ color: "white" }} variant="caption">
                        زمان مسیر:{" "}
                        {enToFaNumber(Math.round(routeData?.time ?? 0)) +
                          " دقیقه"}
                      </Typography>
                      <Typography sx={{ color: "white" }} variant="caption">
                        {locationName}
                      </Typography>
                    </Box>
                    {routeData?.directions && (
                      <Polyline
                        pathOptions={limeOptions}
                        positions={routeData?.directions}
                      />
                    )}

                    {watch("source_lat") && (
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
                    {watch("destination_lat") && (
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
                    {watch("project")?.places?.map((place, i) => {
                      return (
                        <Marker
                          key={i}
                          icon={BlueCircleMarker}
                          position={[place.lat, place.lng]}
                          eventHandlers={{
                            click: (e) => {
                              handleChooseAddress(place);
                            },
                          }}
                        />
                      );
                    })}
                  </>
                )}
              </Grid>
              <Grid item xs={12} md={4}>
                <FormInputs inputs={Inputs} gridProps={{ md: 12 }}></FormInputs>
              </Grid>
            </Grid>

            <Stack mt={4} alignItems="flex-end">
              <Button variant="contained" type="submit">
                بعدی
              </Button>
            </Stack>
          </FormContainer>
        </form>
      </Card>

      <ChooseAddressModal
        show={addressModal}
        onClose={() => setAddressModal(false)}
        handleAdd={handleChooseAddress}
        addresses={watch("project")?.places}
      />
    </>
  );
};

const StepTwo = (props) => {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      ...props.dataTune,
      price: 0,
      load_concurrency_limit: 1,
      discharge_concurrency_limit: 1,
      daily_requests: 1,
      discharge_duration: "00:00",
      load_duration: "00:00",
      dispatch_interval: "00:00",
      load_tolerance: "01:00",
      discharge_tolerance: "01:00",
    },
  });

  const addProjectTuneMutation = useMutation(
    (data) => axiosApi({ url: "/project-plan", method: "post", data: data }),
    {
      onSuccess: (res) => {
        props.setDataTune((prev) => ({
          ...prev,
          project_plan_id: res.data.Data.id,
        }));
        toast.success("با موفقیت ثبت شد");
        queryClient.invalidateQueries(["projectTune"]);
        props.setStep((prev) => prev + 1);
      },
    }
  );

  useEffect(() => {
    if (watch("load_concurrency_limit") > watch("daily_requests")) {
      setValue("daily_requests", watch("load_concurrency_limit"));
    }
  }, [watch("load_concurrency_limit")]);

  useEffect(() => {
    if (watch("daily_requests") < watch("load_concurrency_limit")) {
      setValue("load_concurrency_limit", watch("daily_requests"));
    }
  }, [watch("daily_requests")]);

  useEffect(() => {
    if (watch("load_duration")) {
      setValue("dispatch_interval", watch("load_duration"), {
        shouldValidate: true,
      });
    }
  }, [watch("load_duration")]);

  useEffect(() => {
    if (watch("dispatch_interval") < watch("load_duration")) {
      setValue("load_duration", watch("dispatch_interval"));
    }
  }, [watch("dispatch_interval")]);

  const Inputs = [
    {
      type: "custom",
      customView: (
        <ChooseVType
          control={control}
          name={"vehicleType"}
          rules={{
            required: "نوع بارگیر را وارد کنید",
          }}
        />
      ),
    },
    {
      type: "number",
      name: "weight",
      label: "وزن",
      control: control,
      noInputArrow: true,
      rules: { required: "وزن را وارد کنید" },
    },
    {
      type: "number",
      name: "price",
      label: "قیمت",
      control: control,
      noInputArrow: true,
      rules: { required: "قیمت را وارد کنید" },
    },
    {
      type: "time",
      name: "start_load_time",
      label: "ساعت شروع بارگیری",
      control: control,
      rules: { required: "ساعت بارگیری را وارد کنید" },
    },
    {
      type: "number",
      name: "load_concurrency_limit",
      label: "تعداد بارگیری هم‌زمان",
      control: control,
      rules: { required: "تعداد را وارد کنید" },
      noInputArrow: true,
    },
    {
      type: "number",
      name: "discharge_concurrency_limit",
      label: "تعداد تخلیه هم‌زمان",
      noInputArrow: true,
      control: control,
      rules: {
        required: "تعداد تخلیه را وارد کنید",
      },
    },
    {
      type: "time",
      name: "load_duration",
      label: "مدت بارگیری",
      control: control,
      rules: { required: "مدت بارگیری را وارد کنید" },
    },
    {
      type: "time",
      name: "load_tolerance",
      label: "حداکثر تاخیر در بارگیری",
      tooltip: "حداکثر زمان تاخیر مجاز در بارگیری",
      control: control,
      rules: { required: "حداکثر تاخیر در بارگیری را وارد کنید" },
    },
    {
      type: "time",
      name: "dispatch_interval",
      label: "سرفاصله اعزام",
      control: control,
      rules: {
        required: "سرفاصله اعزام را وارد کنید",
        validate: (value) => {
          let load_duration_time = watch("load_duration")
            .split(":")
            .map((item) => Number(item));
          let value_time = value.split(":").map((item) => Number(item));

          let validate =
            value_time[0] >= load_duration_time[0] &&
            value_time[1] >= load_duration_time[1];

          return validate || "باید از زمان مدت بارگیری، بزرگتر یا مساوی باشد ";
        },
      },
    },
    {
      type: "time",
      name: "discharge_duration",
      label: "مدت تخلیه",
      control: control,
      rules: { required: "مدت تخلیه را وارد کنید" },
    },
    {
      type: "time",
      name: "discharge_tolerance",
      label: "حداکثر تاخیر در تخلیه",
      control: control,
      tooltip: "حداکثر زمان تاخیر مجاز در تخلیه",
      rules: { required: "حداکثر تاخیر در تخلیه را وارد کنید" },
    },
    {
      type: "number",
      name: "daily_requests",
      label: "تعداد درخواست در روز",
      noInputArrow: true,
      control: control,
      rules: {
        required: "تعداد درخواست را وارد کنید",
        validate: (value) =>
          Number(value) >= watch("load_concurrency_limit") ||
          "باید از مقدار تعداد بارگیری، بزرگتر یا مساوی باشد ",
      },
    },
    {
      type: "number",
      name: "shipping_duration",
      label: "مدت زمان حمل محموله(ساعت)",
      noInputArrow: true,
      control: control,
      rules: {
        required: "مدت زمان را وارد کنید",
      },
    },
    {
      type: "weekdays",
      name: "working_days",
      label: "روز های انتخابی",
      control: control,
      rules: { required: "حداقل یک روز را وارد کنید" },
    },
  ];

  // handle on submit
  const onSubmit = async (data) => {
    data.vehicle_type_id = data.vehicleType.id;
    data.load_duration = addZeroForTime(data.load_duration);
    data.discharge_duration = addZeroForTime(data.discharge_duration);

    const newData = { ...data, ...props.dataTune };
    props.setDataTune(newData);

    try {
      const res = await addProjectTuneMutation.mutateAsync(newData);

      return res;
    } catch (error) {
      return error;
    }
  };
  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value, { shouldValidate: true });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <Card sx={{ p: 2, boxShadow: 1 }}>
            <FormTypography>اطلاعات تکمیلی</FormTypography>
            <FormInputs inputs={Inputs} gridProps={{ md: 4 }} />

            <Divider sx={{ my: 5 }} />

            <Stack
              mt={10}
              spacing={2}
              justifyContent="flex-end"
              direction="row"
            >
              <LoadingButton
                variant="outlined"
                type="button"
                color="error"
                onClick={props.handleOnPrevious}
              >
                قبلی
              </LoadingButton>
              <LoadingButton
                variant="contained"
                loading={isSubmitting}
                type="submit"
              >
                ثبت و ادامه
              </LoadingButton>
            </Stack>
          </Card>
        </FormContainer>
      </form>
    </>
  );
};

const StepThree = (props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    defaultValues: props.dataTune,
  });

  const generateRequestMutation = useMutation((data) =>
    axiosApi({ url: "/generate-requests", method: "post", data: data })
  );

  const Inputs = [
    {
      type: "date",
      name: "start_date",
      label: "از تاریخ",
      control: control,
      rules: {
        required: "تاریخ را وارد کنید",
      },
    },
    {
      type: "date",
      name: "end_date",
      label: "تا تاریخ",
      control: control,
      rules: {
        required: "تاریخ را وارد کنید",
      },
    },
  ];

  // handle on submit
  const onSubmit = async (data) => {
    try {
      data.project_plan_id = props.dataTune.project_plan_id;
      data.start_date = data.start_date.start_date;
      data.end_date = data.end_date.end_date;
      const res = await generateRequestMutation.mutateAsync(data);
      showMessage();
      return res;
    } catch (error) {
      return error;
    }
  };
  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value, { shouldValidate: true });
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const showMessage = () => {
    queryClient.invalidateQueries(["projectTune"]);
    navigate("/project/tune");
    // data.data.Message
    setShowModal(false);
    toast.success("با موفقیت ثبت شد");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
    >
      <Card sx={{ p: 5, boxShadow: 1, minWidth: "300px" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormTypography>تولید درخواست</FormTypography>

            <Stack mt={5} spacing={2}>
              <Button
                variant="contained"
                type="button"
                color="info"
                onClick={handleShowModal}
              >
                تولید درخواست
              </Button>{" "}
              <Button
                variant="outlined"
                type="button"
                color="error"
                onClick={props.handleOnPrevious}
              >
                قبلی
              </Button>
            </Stack>
          </FormContainer>
        </form>
      </Card>

      <Modal maxWidth="sm" open={showModal} onClose={() => setShowModal(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <Card sx={{ p: 2, boxShadow: 1 }}>
              <FormTypography>تولید درخواست</FormTypography>
              <FormInputs inputs={Inputs} gridProps={{ md: 6 }} />

              <Stack mt={4} alignItems="flex-end">
                <LoadingButton
                  variant="contained"
                  loading={isSubmitting}
                  type="submit"
                >
                  ثبت
                </LoadingButton>
              </Stack>
            </Card>
          </FormContainer>
        </form>
      </Modal>
    </Box>
  );
};

export default NewTune;
