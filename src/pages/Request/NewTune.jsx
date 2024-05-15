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
  Divider,
  StepIcon,
  Chip,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { FormContainer, FormInputs } from "Components/Form";

import {
  enToFaNumber,
  generateRandomNum,
  renderWeight,
  zipCodeRegexPattern,
} from "Utility/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useForm } from "react-hook-form";

import { ChoosePerson } from "Components/choosers/ChoosePerson";
import Map, { getPathCoordinates } from "Components/Map";

import { Marker, Polyline, Tooltip } from "react-leaflet";
import { MarkerIcon } from "Components/MarkerIcon";
import { reverseRoutes } from "Components/DrivingDirection";
import { ChooseProject } from "Components/choosers/ChooseProject";
import { ChooseVType } from "Components/choosers/vehicle/types/ChooseVType";
import Modal from "Components/versions/Modal";

import { toast } from "react-toastify";
import { axiosApi } from "api/axiosApi";
import { useNavigate } from "react-router-dom";
import FormTypography from "Components/FormTypography";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { ChooseSalon } from "Components/choosers/ChooseSalon";

const stepsLabels = ["انتخاب مسیر", "تکمیل اطلاعات", "ثبت نهایی"];

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
      <HelmetTitlePage title="ثبت آهنگ پروژه" />
      <Card sx={{ mt: 3, mb: 5, p: 2 }}>
        <Stepper activeStep={step} alternativeLabel>
          {stepsLabels.map((label) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={(props) => {
                  return (
                    <StepIcon {...props} icon={enToFaNumber(props.icon)} />
                  );
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Card>

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
    clearErrors,
  } = useForm({
    defaultValues: props.dataTune,
  });
  const [mapBounds, setMapBounds] = useState([]);
  const [routeData, setRouteData] = useState({});
  const { renderMap, locationName } = Map({
    zooms: 10,
    bounds: mapBounds,
  });

  useQuery({
    queryKey: ["project", watch("project")?.id],
    queryFn: () =>
      axiosApi({ url: `/project/${watch("project")?.id}` }).then(
        (res) => res.data.Data
      ),
    enabled: !!watch("project")?.id,
    onSuccess: (data) => {
      setValue("source_address", data?.source?.address);
      setValue("source_zip_code", data?.source?.zip_code);
      setValue("destination_address", data?.destination?.address);
      setValue("destination_zip_code", data?.destination?.zip_code);
      setValue("source_lat", data?.source?.lat);
      setValue("source_lng", data?.source?.lng);
      setValue("destination_lat", data?.destination?.lat);
      setValue("destination_lng", data?.destination?.lng);
      setValue("sender", data?.sender);
      setValue("receiver", data?.receiver);
      clearErrors();
    },
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

        setMapBounds([
          [watch("source_lat"), watch("source_lng")],
          [watch("destination_lat"), watch("destination_lng")],
        ]);
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
      setRouteData({});
      calculateRoute();
    }
  }, [watch("source_lat"), watch("destination_lat")]);

  const Inputs = [
    {
      type: "custom",
      customView: (
        <ChooseProject
          control={control}
          name={"project"}
          filters={{ valid: 1 }}
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
      readOnly: true,
    },
    {
      type: "number",
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
        pattern: {
          value: zipCodeRegexPattern,
          message: "فرمت کد پستی معتبر نیست",
        },
      },
      readOnly: true,
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
          readOnly={true}
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
      readOnly: true,
    },
    {
      type: "number",
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
        pattern: {
          value: zipCodeRegexPattern,
          message: "فرمت کد پستی معتبر نیست",
        },
      },
      readOnly: true,
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
          readOnly={true}
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

  return (
    <>
      <Card sx={{ p: 2, overflow: "hidden" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <Grid container columnSpacing={3}>
              <Grid item xs={12} md={8}>
                {renderMap(
                  <>
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
                      {/* <Button variant={"contained"} onClick={handleAddAddress}>
                        تایید {addressType.name}
                      </Button> */}
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
    </>
  );
};

const TuneCalculator = ({ watch }) => {
  // تعداد قابل بارگیری در روز
  const [finalDailyRequests, setFinalDailyRequests] = useState(
    watch("daily_requests")
  );

  // تعداد قابل بارگیری در روز
  //((«ساعت شروع فعالیت مبدا» - «ساعت پایان فعالیت مبدا») /  "فواصل ورود به مبداء") *  "تعداد صف موازی بارگیری"
  // value =  ((start_load_time -  end_load_time) / dispatch_interval) * load_concurrency_limit
  //final =  تعداد قابل بارگیری در روز =  min(value, daily_requests)
  useEffect(() => {
    const dailyRequestsNum = Number(watch("daily_requests"));
    if (
      watch("start_load_time") &&
      watch("end_load_time") &&
      watch("dispatch_interval") &&
      watch("load_concurrency_limit") &&
      dailyRequestsNum
    ) {
      const start = watch("start_load_time")
        ?.split(":")
        .map((n) => Number(n));
      const end = watch("end_load_time")
        ?.split(":")
        .map((n) => Number(n));
      const interval = watch("dispatch_interval")
        ?.split(":")
        .map((n) => Number(n));

      const loadConcurrencyNum = Number(watch("load_concurrency_limit"));

      const endHourNum = end[0] + end[1] / 60;
      const startHourNum = start[0] + start[1] / 60;
      const intervalNum = interval[0] + interval[1] / 60;

      const value =
        ((endHourNum - startHourNum) * loadConcurrencyNum) / intervalNum;

      const final = Math.min(dailyRequestsNum, value);
      setFinalDailyRequests(final);
    } else if (dailyRequestsNum) {
      setFinalDailyRequests(dailyRequestsNum);
    }
  }, [
    watch("start_load_time"),
    watch("end_load_time"),
    watch("dispatch_interval"),
    watch("load_concurrency_limit"),
    watch("daily_requests"),
  ]);

  const rowItem = (title, value) => {
    return (
      <Stack spacing={1} direction="row">
        <Typography variant="body2" fontWeight={"700"}>
          {title}:
        </Typography>
        <Typography variant="body2">{value}</Typography>
      </Stack>
    );
  };

  return (
    <Card sx={{ p: 2, boxShadow: 1, mb: 2 }}>
      <FormTypography>ماشین حساب آهنگ حمل </FormTypography>

      <Stack direction="row" gap={3} flexWrap="wrap">
        {rowItem(
          "وزن حمل شده در روز",
          `${enToFaNumber(finalDailyRequests ?? 1 * watch("weight") ?? 1)} (تن)`
        )}{" "}
        {rowItem(
          "ارزش بار حمل شده در روز",
          `${enToFaNumber(
            finalDailyRequests ?? 1 * watch("price") ?? 1
          )} (تومان)`
        )}
      </Stack>

      <Typography variant="body2" mt={2} fontWeight={600} color="error.light">
        محاسبات فعلی به صورت تقریبی می باشد، و متغیر های پروژه و زمانهای ثبت شده
        در اینجا در نتیجه نهایی تاثیر گذار خواهد بود.
      </Typography>
    </Card>
  );
};

const StepTwo = (props) => {
  const [working_days, setWorking_days] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      ...props.dataTune,
      title: props?.dataTune?.project?.title + generateRandomNum(5),
    },
  });

  const simulateMutation = useMutation((data) =>
    axiosApi({ url: "/simulate-requests", method: "post", data: data })
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

  const Inputs = [
    {
      type: "text",
      name: "title",
      label: "عنوان",
      control: control,
      noInputArrow: true,
      rules: { required: "عنوان را وارد کنید" },
    },
    {
      type: "number",
      name: "weight",
      label: "وزن درخواست (تن)",
      control: control,
      noInputArrow: true,
      // rules: { required: "وزن را وارد کنید" },
    },
    {
      type: "number",
      name: "price",
      label: "قیمت",
      control: control,
      noInputArrow: true,
      splitter: true,
      // rules: { required: "قیمت را وارد کنید" },
    },
    {
      type: "custom",
      customView: (
        <ChooseVType
          control={control}
          name={"vehicleType"}
          weight={watch("weight") * 1000}
          // rules={{
          //   required: "نوع بارگیر را وارد کنید",
          // }}
        />
      ),
    },
    {
      type: "number",
      name: "daily_requests",
      label: "حداکثر درخواست در روز",
      noInputArrow: true,
      control: control,
      // rules: {
      //   required: "حداکثر درخواست در روز",
      //   validate: (value) =>
      //     Number(value) >= watch("load_concurrency_limit") ||
      //     "باید از مقدار تعداد بارگیری، بزرگتر یا مساوی باشد ",
      // },
    },
    {
      type: "number",
      name: "shipping_duration",
      label: "مدت زمان حمل محموله(ساعت)",
      noInputArrow: true,
      control: control,
      // rules: {
      //   required: "مدت زمان را وارد کنید",
      // },
    },
    {
      type: "custom",
      customView: <ChooseSalon control={control} name={"salon"} />,
    },
  ];
  const Inputs1 = [
    {
      type: "time",
      name: "start_load_time",
      label: "ساعت شروع فعالیت مبداء",
      control: control,
      rules: { required: "ساعت بارگیری را وارد کنید" },
    },
    {
      type: "time",
      name: "end_load_time",
      label: "ساعت پایان فعالیت مبداء",
      control: control,
      rules: { required: "ساعت پایان را وارد کنید" },
    },
    {
      type: "number",
      name: "load_concurrency_limit",
      label: "تعداد صف موازی بارگیری",
      control: control,
      rules: { required: "تعداد را وارد کنید" },
      noInputArrow: true,
    },
    {
      type: "time",
      name: "load_tolerance",
      label: "حداکثر تاخیر در ورود به مبداء",
      tooltip: "حداکثر زمان تاخیر مجاز در ورود به مبداء",
      control: control,
      // rules: { required: "حداکثر تاخیر در بارگیری را وارد کنید" },
    },
    {
      type: "time",
      name: "dispatch_interval",
      label: "فواصل ورود به مبداء",
      control: control,
      rules: {
        required: "فواصل ورود به مبداء را وارد کنید",
      },
    },
  ];
  const Inputs2 = [
    {
      type: "time",
      name: "start_discharge_time",
      label: "ساعت شروع فعالیت مقصد",
      control: control,
      rules: { required: "ساعت شروع تخلیه را وارد کنید" },
    },
    {
      type: "time",
      name: "end_discharge_time",
      label: "ساعت پایان فعالیت مقصد",
      control: control,
      rules: { required: "ساعت پایان  تخلیه را وارد کنید" },
    },
    {
      type: "number",
      name: "discharge_concurrency_limit",
      label: "تعداد صف موازی تخلیه",
      noInputArrow: true,
      control: control,
      rules: {
        required: "تعداد صفهای موازی تخلیه را وارد کنید",
      },
    },

    {
      type: "time",
      name: "discharge_interval",
      label: "فواصل ورود ناوگان به مقصد",
      control: control,
      rules: { required: "فواصل ورود ناوگان به مقصد را وارد کنید" },
    },

    {
      type: "time",
      name: "discharge_tolerance",
      label: "حداکثر تاخیر در ورود ناوگان به مقصد",
      control: control,
      tooltip: "حداکثر زمان تاخیر مجاز در ورود ناوگان به مقصد",
      // rules: { required: "حداکثر تاخیر در ورود ناوگان به مقصد را وارد کنید" },
    },
  ];
  // handle on submit
  const onSubmit = async (data) => {
    data.vehicle_type_id = data?.vehicleType?.id;

    data.weight = data?.weight * 1000;
    data.salon_id = data?.salon?.id;
    const newData = { ...data, ...props.dataTune, working_days: working_days };
    try {
      const res = await simulateMutation.mutateAsync(newData);
      props.setDataTune({ ...res?.data?.Data, ...newData });
      props.setStep((prev) => prev + 1);
      return res;
    } catch (error) {
      return error;
    }
  };
  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value, { shouldValidate: true });
  };
  const renderItem = (title, value) => {
    return (
      <Grid item xs={12} sm={6} md={3}>
        <Stack spacing={1} direction="row">
          <Typography variant="caption" fontWeight={"700"}>
            {title}:
          </Typography>
          <Typography variant="caption">{value}</Typography>
        </Stack>
      </Grid>
    );
  };

  return (
    <>
      <Card sx={{ p: 2, boxShadow: 1, mb: 2 }}>
        <FormTypography>اطلاعات پروژه</FormTypography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Grid container spacing={2}>
              {renderItem("کد", enToFaNumber(props?.dataTune?.project.code))}
              {renderItem(
                "عنوان پروژه",
                enToFaNumber(props?.dataTune?.project?.title)
              )}

              {props?.dataTune?.project?.product ? (
                <>
                  {renderItem(
                    "نام محصول",
                    enToFaNumber(props?.dataTune?.project?.product?.title)
                  )}

                  {renderItem(
                    "واحد محصول",
                    enToFaNumber(props?.dataTune?.project?.product?.unit?.title)
                  )}
                  {renderItem(
                    "گروه محصول",
                    enToFaNumber(
                      props?.dataTune?.project?.product?.group?.title
                    )
                  )}
                </>
              ) : (
                renderItem("محصول", "فاقد محصول")
              )}

              {renderItem(
                " تعداد درخواست‌ها",
                enToFaNumber(props?.dataTune?.project?.requests_count)
              )}
              {renderItem(
                "تعداد درخواست های فعال",
                enToFaNumber(props?.dataTune?.project?.active_requests_count)
              )}
              {renderItem(
                " تناژ کل",
                renderWeight(props?.dataTune?.project?.weight)
              )}
              {renderItem(
                " تناژ باقیمانده",
                renderWeight(props?.dataTune?.project?.remaining_weight)
              )}
              {renderItem(
                " تناژ حمل شده",
                renderWeight(props?.dataTune?.project?.requests_total_weight)
              )}
            </Grid>
          </Grid>
        </Grid>
      </Card>

      <TuneCalculator watch={watch} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <Card sx={{ p: 2, boxShadow: 1 }}>
            <FormTypography>اطلاعات تکمیلی</FormTypography>
            <FormInputs inputs={Inputs} gridProps={{ md: 4 }} />
            <Divider sx={{ my: 5 }} />
            <FormInputs inputs={Inputs1} gridProps={{ md: 4 }} />
            <Divider sx={{ my: 5 }} />
            <FormInputs inputs={Inputs2} gridProps={{ md: 4 }} />
            <Divider sx={{ my: 5 }} />
            <Stack direction={"row"} spacing={2} mt={2} alignItems={"center"}>
              <Typography>روز های هفته</Typography>
              <Chip
                label="شنبه"
                size="medium"
                color="primary"
                variant={working_days.includes(1) ? "filled" : "outlined"}
                onClick={() => {
                  if (working_days.includes(1)) {
                    setWorking_days((prev) => prev.filter((a) => a !== 1));
                  } else {
                    setWorking_days((prev) => [...prev, 1]);
                  }
                }}
              />
              <Chip
                label="یکشنبه"
                size="medium"
                color="primary"
                variant={working_days.includes(2) ? "filled" : "outlined"}
                onClick={() => {
                  if (working_days.includes(2)) {
                    setWorking_days((prev) => prev.filter((a) => a !== 2));
                  } else {
                    setWorking_days((prev) => [...prev, 2]);
                  }
                }}
              />
              <Chip
                label="دوشنبه"
                size="medium"
                color="primary"
                variant={working_days.includes(3) ? "filled" : "outlined"}
                onClick={() => {
                  if (working_days.includes(3)) {
                    setWorking_days((prev) => prev.filter((a) => a !== 3));
                  } else {
                    setWorking_days((prev) => [...prev, 3]);
                  }
                }}
              />
              <Chip
                label="سه شنبه"
                size="medium"
                color="primary"
                variant={working_days.includes(4) ? "filled" : "outlined"}
                onClick={() => {
                  if (working_days.includes(4)) {
                    setWorking_days((prev) => prev.filter((a) => a !== 4));
                  } else {
                    setWorking_days((prev) => [...prev, 4]);
                  }
                }}
              />
              <Chip
                label="چهارشنبه"
                size="medium"
                color="primary"
                variant={working_days.includes(5) ? "filled" : "outlined"}
                onClick={() => {
                  if (working_days.includes(5)) {
                    setWorking_days((prev) => prev.filter((a) => a !== 5));
                  } else {
                    setWorking_days((prev) => [...prev, 5]);
                  }
                }}
              />
              <Chip
                label="پنج شنبه"
                size="medium"
                color="primary"
                variant={working_days.includes(6) ? "filled" : "outlined"}
                onClick={() => {
                  if (working_days.includes(6)) {
                    setWorking_days((prev) => prev.filter((a) => a !== 6));
                  } else {
                    setWorking_days((prev) => [...prev, 6]);
                  }
                }}
              />
              <Chip
                label="جمعه"
                size="medium"
                color="primary"
                variant={working_days.includes(7) ? "filled" : "outlined"}
                onClick={() => {
                  if (working_days.includes(7)) {
                    setWorking_days((prev) => prev.filter((a) => a !== 7));
                  } else {
                    setWorking_days((prev) => [...prev, 7]);
                  }
                }}
              />
            </Stack>

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
  const addProjectTuneMutation = useMutation(
    (data) => axiosApi({ url: "/project-plan", method: "post", data: data }),
    {
      onSuccess: (res) => {
        props.setDataTune((prev) => ({
          ...prev,
          project_plan_id: res.data.Data.id,
        }));
        toast.success("با موفقیت ثبت شد");
        setShowModal(false);
        queryClient.invalidateQueries(["projectTune"]);
        navigate("/request/tune");
      },
    }
  );
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
      // data.project_plan_id = props.dataTune.project_plan_id;
      // data.start_date = data.start_date.start_date;
      // data.end_date = data.end_date.end_date;
      const res = await addProjectTuneMutation.mutateAsync(props?.dataTune);
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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
    >
      <Card sx={{ p: 2, boxShadow: 1, minWidth: "300px" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <Stack spacing={4} direction={"row"}>
              <Stack sx={{ p: 4 }}>
                <FormTypography>تخمین هفتگی</FormTypography>
                <Typography>
                  مجموع تناژ :{" "}
                  {enToFaNumber(props?.dataTune?.requests_per_week?.weight)}
                </Typography>
                <Typography>
                  تعداد درخواست :{" "}
                  {enToFaNumber(props?.dataTune?.requests_per_week?.requests)}
                </Typography>
              </Stack>
              <Stack sx={{ p: 4 }}>
                <FormTypography>تخمین ماهانه</FormTypography>
                <Typography>
                  مجموع تناژ :{" "}
                  {enToFaNumber(props?.dataTune?.requests_per_month?.weight)}
                </Typography>
                <Typography>
                  تعداد درخواست :{" "}
                  {enToFaNumber(props?.dataTune?.requests_per_month?.requests)}
                </Typography>
              </Stack>
              <Stack sx={{ p: 4 }}>
                <FormTypography>تخمین سالانه</FormTypography>
                <Typography>
                  مجموع تناژ :{" "}
                  {enToFaNumber(props?.dataTune?.requests_per_year?.weight)}
                </Typography>
                <Typography>
                  تعداد درخواست :{" "}
                  {enToFaNumber(props?.dataTune?.requests_per_year?.requests)}
                </Typography>
              </Stack>
            </Stack>
            <Stack direction={"row"} justifyContent={"flex-end"} mt={4}>
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
                sx={{ width: "120px", ml: 3 }}
              >
                ثبت نهایی
              </LoadingButton>
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
