/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from "@mui/lab";
import {
  Stack,
  Typography,
  Card,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormContainer, FormInputs } from "Components/Form";
import Map, { getPathCoordinates } from "Components/Map";
import { ChoosePerson } from "Components/choosers/ChoosePerson";
import { ChooseProject } from "Components/choosers/ChooseProject";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { axiosApi } from "api/axiosApi";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Marker, Polyline, Tooltip } from "react-leaflet";
import { BlueCircleMarker, greenIcon, MarkerIcon } from "Components/MarkerIcon";
import {
  addZeroForTime,
  enToFaNumber,
  zipCodeRegexPattern,
} from "Utility/utils";
import { reverseRoutes } from "Components/DrivingDirection";
import ChooseAddressModal from "Components/modals/ChooseAddressModal";
import { toast } from "react-toastify";
import FormTypography from "Components/FormTypography";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { ChooseVType } from "Components/choosers/vehicle/types/ChooseVType";
import { ChooseSalon } from "Components/choosers/ChooseSalon";

const limeOptions = { color: "lime" };

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

const SingleTune = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [addressType, setAddressType] = useState(ADDRESS_TYPES[0]);
  const [routeData, setRouteData] = useState({});
  const [addressModal, setAddressModal] = useState(false);

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm();

  const updateTuneMutation = useMutation(
    (data) =>
      axiosApi({ url: `/project-plan/${id}`, method: "put", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["projectTune"]);
        toast.success("با موفقیت ویرایش شد");
      },
    }
  );

  const { data, isLoading, isFetching, isError, isSuccess } = useQuery(
    ["projectTune", id],
    () => axiosApi({ url: `/project-plan/${id}` }).then((res) => res.data.Data),
    {
      enabled: !!id,
    }
  );

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
    if (isSuccess) {
      reset(data);
      setValue("source_lat", data.source_lat);
      setValue("source_lng", data.source_lng);
      setValue("destination_lat", data.destination_lat);
      setValue("destination_lng", data.destination_lng);
      calculateRoute();
    }
  }, [isSuccess]);

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

  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <div className="">isError</div>;
  }

  // inputs
  const DataInputs = [
    {
      type: "text",
      name: "title",
      label: "عنوان",
      control: control,
    },
    {
      type: "custom",
      customView: (
        <ChooseProject
          control={control}
          name={"project"}
          rules={{
            required: "پروژه را وارد کنید",
          }}
        />
      ),
    },
    {
      type: "number",
      name: "price",
      label: "قیمت",
      control: control,
      splitter: true,
      noInputArrow: true,
      rules: { required: "قیمت را وارد کنید" },
    },
    {
      type: "number",
      name: "weight",
      label: "وزن",
      control: control,
      splitter: true,
      noInputArrow: true,
      rules: { required: "وزن را وارد کنید" },
    },
    {
      type: "number",
      name: "daily_requests",
      label: "تعداد درخواست در روز",
      noInputArrow: true,
      splitter: true,
      control: control,
      rules: {
        required: "تعداد درخواست را وارد کنید",
      },
    },

    {
      type: "number",
      name: "load_concurrency_limit",
      label: "حد همزمانی بار",
      noInputArrow: true,
      control: control,
      rules: {
        required: "حد همزمانی بار را وارد کنید",
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
      type: "number",
      name: "count",
      label: "تعداد بارگیری هم‌زمان",
      splitter: true,
      control: control,
      rules: { required: "تعداد را وارد کنید" },
      noInputArrow: true,
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
      name: "discharge_concurrency_limit",
      label: "حد همزمانی تخلیه",
      noInputArrow: true,
      splitter: true,
      control: control,
      rules: {
        required: "حد همزمانی تخلیه را وارد کنید",
      },
    },
    {
      type: "time",
      name: "start_load_time",
      label: "ساعت شروع بارگیری",
      control: control,
      rules: { required: "ساعت بارگیری را وارد کنید" },
    },
    {
      type: "time",
      name: "dispatch_interval",
      label: "سرفاصله اعزام",
      control: control,
      rules: { required: "سرفاصله اعزام را وارد کنید" },
    },

    {
      type: "number",
      name: "shipping_duration",
      label: "مدت زمان حمل محموله(ساعت)",
      splitter: true,
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
      gridProps: { md: 12 },
    },
  ];
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
      type: "custom",
      customView: (
        <ChooseProject
          control={control}
          name={"project"}
          rules={{
            required: "پروژه را وارد کنید",
          }}
          readOnly
        />
      ),
    },
    {
      type: "number",
      name: "weight",
      label: "وزن درخواست (تن)",
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
      splitter: true,
      rules: { required: "قیمت را وارد کنید" },
    },
    {
      type: "custom",
      customView: (
        <ChooseVType
          control={control}
          name={"vehicleType"}
          weight={watch("weight") * 1000}
          rules={{
            required: "نوع بارگیر را وارد کنید",
          }}
        />
      ),
    },
    {
      type: "number",
      name: "daily_requests",
      label: "حداکثر درخواست در روز",
      noInputArrow: true,
      control: control,
      rules: {
        required: "حداکثر درخواست در روز",
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
      type: "custom",
      customView: <ChooseSalon control={control} name={"salon"} />,
    },
    {
      type: "weekdays",
      name: "working_days",
      label: "روز های انتخابی",
      control: control,
      rules: { required: "حداقل یک روز را وارد کنید" },
      gridProps: { md: 12 },
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
      rules: { required: "حداکثر تاخیر در بارگیری را وارد کنید" },
    },
    {
      type: "time",
      name: "dispatch_interval",
      label: "فواصل ورود به مبداء",
      control: control,
      rules: {
        required: "فواصل ورود به مبداء",
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
      rules: { required: "حداکثر تاخیر در ورود ناوگان به مقصد را وارد کنید" },
    },
  ];
  const SourceInputs = [
    {
      type: "custom",

      customView: (
        <ChoosePerson
          control={control}
          name={"sender"}
          rules={{
            required: "فرستنده را وارد کنید",
          }}
          readOnly
          label="فرستنده"
        />
      ),
    },
    {
      type: "text",
      name: "source_address",
      label: "آدرس مبداء",
      control: control,
      readOnly: true,
      rules: {
        required: { value: true, message: " آدرس مبداء را وارد کنید" },
      },
    },
    {
      type: "text",
      name: "source_zip_code",
      label: "کد پستی مبداء",
      readOnly: true,
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
    },
  ];

  const DestinationInputs = [
    {
      type: "custom",

      customView: (
        <ChoosePerson
          control={control}
          name={"receiver"}
          rules={{
            required: "گیرنده را وارد کنید",
          }}
          readOnly
          label="گیرنده"
        />
      ),
    },

    {
      type: "text",
      name: "destination_address",
      label: "آدرس مقصد",
      control: control,
      readOnly: true,
      rules: {
        required: { value: true, message: " آدرس مقصد را وارد کنید" },
      },
    },
    {
      type: "text",
      name: "destination_zip_code",
      label: "کدپستی مقصد",
      control: control,
      readOnly: true,
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

  // handle on submit
  const onSubmit = async (data) => {
    data.project_id = data.project.id;
    data.sender_id = data.sender.id;
    data.receiver_id = data.receiver.id;
    data.status = 1;
    data.path_id = 21;
    delete data.vehicle_type;
    delete data.sender;
    delete data.receiver;
    delete data.project;
    delete data.product;
    delete data.path;

    try {
      const res = await updateTuneMutation.mutateAsync(data);
      return res;
    } catch (error) {
      return error;
    }
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  const handleChooseAddress = (item) => {
    const type = addressType.id;
    handleChange(`${type}_address`, item.address);
    handleChange(`${type}_lat`, item.lat);
    handleChange(`${type}_lng`, item.lng);
  };

  const handleAddAddress = () => {
    handleChange(`${addressType.id}_address`, locationName);
    handleChange(`${addressType.id}_lat`, center[0]);
    handleChange(`${addressType.id}_lng`, center[1]);
  };

  return (
    <>
      <HelmetTitlePage title="ویرایش آهنگ پروژه" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <Card sx={{ p: 2, boxShadow: 1 }}>
            <FormTypography>اطلاعات کلی</FormTypography>
            {/* <FormInputs gridProps={{ md: 3 }} inputs={DataInputs} /> */}
            <FormInputs inputs={Inputs} gridProps={{ md: 4 }} />
            <Divider sx={{ my: 5 }} />
            <FormInputs inputs={Inputs1} gridProps={{ md: 4 }} />
            <Divider sx={{ my: 5 }} />
            <FormInputs inputs={Inputs2} gridProps={{ md: 4 }} />

            <Divider sx={{ my: 5 }} />
            <Grid container spacing={3}>
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
                <FormTypography>اطلاعات مبداء</FormTypography>
                <FormInputs gridProps={{ md: 12 }} inputs={SourceInputs} />

                <Divider sx={{ my: 3 }} />

                <FormTypography>اطلاعات مقصد</FormTypography>
                <FormInputs gridProps={{ md: 12 }} inputs={DestinationInputs} />
              </Grid>
            </Grid>

            <Stack mt={10} alignItems="flex-end">
              <LoadingButton
                variant="contained"
                loading={isSubmitting}
                type="submit"
                color={Object.keys(errors).length !== 0 ? "error" : "primary"}
              >
                ذخیره
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

export default SingleTune;
