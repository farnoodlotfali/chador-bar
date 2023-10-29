/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from "@mui/lab";
import { Card, Divider, Grid, Stack, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { ChooseDriver } from "Components/choosers/driver/ChooseDriver";
import { ChooseFleet } from "Components/choosers/ChooseFleet";
import { ChooseProduct } from "Components/choosers/ChooseProduct";
import { ChoosePerson } from "Components/choosers/ChoosePerson";
import { FormContainer, FormInputs } from "Components/Form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ChooseProject } from "Components/choosers/ChooseProject";
import { useEffect, useState } from "react";

import LoadingSpinner from "Components/versions/LoadingSpinner";
import { ChooseShippingCompany } from "Components/choosers/ChooseShippingCompany";
import { ChooseSalon } from "Components/choosers/ChooseSalon";
import { ChooseVType } from "Components/choosers/vehicle/types/ChooseVType";
import {
  compareTimes,
  numberWithCommas,
  zipCodeRegexPattern,
} from "Utility/utils";
import FormTypography from "Components/FormTypography";
import HelmetTitlePage from "Components/HelmetTitlePage";

const NewRequest = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState({
    high_price: null,
    low_price: null,
  });

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
    trigger,
  } = useForm();

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

  useEffect(() => {
    if (watch("fleet")) {
      setValue("driver", watch("fleet")?.drivers?.[0], {
        shouldValidate: true,
      });
      trigger("vehicle_type");
    }
  }, [watch("fleet")]);

  useEffect(() => {
    if (watch("project")) {
      setValue("product", watch("project")?.product, {
        shouldValidate: true,
      });
      setValue("owner", watch("project")?.contract?.owner, {
        shouldValidate: true,
      });
      setValue(
        "shipping_company",
        watch("project")?.contract?.shipping_company,
        {
          shouldValidate: true,
        }
      );
    }
  }, [watch("project")]);

  // discharge_time_upto is dependent on discharge_time_duration.
  // if discharge_time_duration is bigger than discharge_time_upto, then
  // discharge_time_upto value should same as discharge_time_duration value
  useEffect(() => {
    let tUpto = watch("discharge_time_upto");
    let tDuration = watch("discharge_time_duration");
    if (tUpto && tDuration && compareTimes(tUpto, tDuration)) {
      setValue("discharge_time_upto", tDuration);
    }
  }, [watch("discharge_time_duration")]);

  // discharge_time_duration is dependent on discharge_time_upto.
  // if discharge_time_upto is lower than discharge_time_duration, then
  // discharge_time_duration value should same as discharge_time_upto value
  useEffect(() => {
    let tUpto = watch("discharge_time_upto");
    let tDuration = watch("discharge_time_duration");
    if (tUpto && tDuration && !compareTimes(tDuration, tUpto)) {
      setValue("discharge_time_duration", tUpto);
    }
  }, [watch("discharge_time_upto")]);

  // load_time_upto is dependent on load_time_duration.
  // if load_time_duration is bigger than load_time_upto, then
  // load_time_upto value should same as load_time_duration value
  useEffect(() => {
    let tUpto = watch("load_time_upto");
    let tDuration = watch("load_time_duration");
    if (tUpto && tDuration && compareTimes(tUpto, tDuration)) {
      setValue("load_time_upto", tDuration);
    }
  }, [watch("load_time_duration")]);

  // load_time_duration is dependent on load_time_upto.
  // if load_time_upto is lower than load_time_duration, then
  // load_time_duration value should same as load_time_upto value
  useEffect(() => {
    let tUpto = watch("load_time_upto");
    let tDuration = watch("load_time_duration");
    if (tUpto && tDuration && !compareTimes(tDuration, tUpto)) {
      setValue("load_time_duration", tUpto);
    }
  }, [watch("load_time_upto")]);

  // inputs
  const SourceInputs = [
    {
      type: "number",
      name: "source_zip_code",
      label: "کد پستی مبدا",
      noInputArrow: true,
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
    {
      type: "address",
      label: "آدرس مبدا",
      addressKey: "source",
      latLngKey: "source",
      name: "source_address",
      control: control,
      rules: { required: "آدرس مبدا را وارد کنید" },
      gridProps: { md: 5 },
    },
  ];
  const DataInputs = [
    {
      type: "custom",
      customView: <ChooseProject control={control} name={"project"} />,
      gridProps: { md: 4 },
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
        <ChooseProduct
          control={control}
          name={"product"}
          rules={{
            required: " کد محصول را وارد کنید",
          }}
        />
      ),
      gridProps: { md: 4 },
    },

    {
      type: "custom",
      customView: (
        <ChooseSalon
          control={control}
          name={"salon"}
          rules={{
            required: "کد سالن را وارد کنید",
          }}
          defaultGlobalSalon={true}
        />
      ),
      gridProps: { md: 4 },
    },
    {
      type: "custom",
      customView: (
        <ChooseShippingCompany control={control} name={"shipping_company"} />
      ),
      gridProps: { md: 4 },
    },
    {
      type: "custom",
      customView: <></>,
      gridProps: { md: 12 },
    },
    {
      type: "number",
      name: "weight",
      label: "وزن",
      control: control,
      noInputArrow: true,
      splitter: true,
      rules: {
        required: { value: true, message: "وزن را وارد کنید" },
      },
    },
    {
      type: "number",
      name: "width",
      label: "عرض",
      splitter: true,
      noInputArrow: true,
      control: control,
    },
    {
      type: "number",
      name: "length",
      splitter: true,
      label: "طول",
      noInputArrow: true,
      control: control,
    },
    {
      type: "number",
      name: "height",
      noInputArrow: true,
      splitter: true,
      label: "ارتفاع",
      control: control,
    },
    {
      type: "textarea",
      name: "description",
      label: "توضیحات",
      control: control,
      gridProps: { md: 12 },
    },
  ];
  const VehicleTypeInputs = [
    {
      type: "custom",
      customView: (
        <ChooseVType
          control={control}
          name={"vehicle_type"}
          rules={{
            required: {
              value: !watch("fleet"),
              message: "نوع بارگیر را وارد کنید",
            },
          }}
          label="نوع بارگیر"
        />
      ),
      gridProps: { md: 4 },
    },
  ];
  const ReceiverAndSenderInputs = [
    {
      type: "custom",
      customView: (
        <ChoosePerson
          control={control}
          name={"sender"}
          rules={{
            required: " کد فرستنده را وارد کنید",
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
          name={"receiver"}
          rules={{
            required: " کد گیرنده را وارد کنید",
          }}
          label="گیرنده"
        />
      ),
      gridProps: { md: 4 },
    },
  ];
  const DriversInputs = [
    {
      type: "custom",
      customView: (
        <ChooseFleet
          control={control}
          name={"fleet"}
          rules={{
            required: " کد ناوگان را وارد کنید",
          }}
          filterData={{
            shipping_company: watch("shipping_company"),
          }}
        />
      ),
      gridProps: { md: 4 },
    },
    {
      type: "custom",
      customView: (
        <ChooseDriver
          control={control}
          name={"driver"}
          dataArray={watch("fleet")}
          isLoadFromApi={false}
          rules={{
            required: "راننده را وارد کنید",
          }}
          label="راننده اول"
        />
      ),
      gridProps: { md: 4 },
    },
    {
      type: "custom",
      customView: (
        <ChooseDriver
          control={control}
          name={"second_driver"}
          dataArray={watch("fleet")}
          isLoadFromApi={false}
          label="راننده دوم"
          notAllowedDriver={watch("driver")}
        />
      ),
      gridProps: { md: 4 },
    },
  ];
  const DateInputs = [
    {
      type: "date",
      name: "load_time",
      label: "تاریخ بارگیری",
      control: control,
      rules: {
        required: " تاریخ بارگیری را وارد کنید",
      },
    },
    {
      type: "time",
      name: "load_time_duration",
      label: "از",
      control: control,
      rules: { required: "ساعت بارگیری را وارد کنید" },
    },
    {
      type: "time",
      name: "load_time_upto",
      label: "تا",
      control: control,
      rules: { required: "حداکثر ساعت بارگیری را وارد کنید" },
    },
    {
      type: "date",
      name: "discharge_time",
      label: "تاریخ تخلیه",
      control: control,
      rules: {
        required: " تاریخ تخلیه را وارد کنید",
      },
    },
    {
      type: "time",
      name: "discharge_time_duration",
      label: "از",
      control: control,
      rules: { required: "ساعت تخلیه را وارد کنید" },
    },
    {
      type: "time",
      name: "discharge_time_upto",
      label: "تا",
      control: control,
      rules: { required: "حداکثر ساعت تخلیه را وارد کنید" },
    },
  ];
  const DestinationInputs = [
    {
      type: "number",
      name: "destination_zip_code",
      label: "کد پستی مقصد",
      noInputArrow: true,
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
    {
      type: "address",
      label: "آدرس مقصد",
      addressKey: "destination",
      latLngKey: "destination",
      name: "destination_address",
      control: control,
      rules: { required: "آدرس مقصد را وارد کنید" },
      gridProps: { md: 5 },
    },
  ];
  const PricesInputs = [
    {
      type: "number",
      name: "price",
      label: "مبلغ",
      splitter: true,
      control: control,
      noInputArrow: true,
      rules: {
        required: { value: true, message: "مبلغ را وارد کنید" },
      },
    },
  ];

  if (addMutation.isLoading || addMutation.isFetching) {
    return <LoadingSpinner />;
  }

  // api
  const calculatePrices = async () => {
    // required input for calculate prices
    const source_lat = watch("source_lat");
    const source_lng = watch("source_lng");
    const destination_lat = watch("destination_lat");
    const destination_lng = watch("destination_lng");
    const vehicle_type_id = watch("vehicle_type")?.id;
    if (
      !source_lat ||
      !source_lng ||
      !destination_lat ||
      !destination_lng ||
      !vehicle_type_id
    ) {
      toast.error("اطلاعات ناقص است");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosApi({
        url: `/get-price?source_lat=${source_lat}&source_lng=${source_lng}&destination_lat=${destination_lat}&destination_lng=${destination_lng}&container_type_id=${vehicle_type_id}`,
      });
      toast.success("عملیات با موفقیت انجام گردید.");

      if (res.data.Data) {
        setPrices({
          high_price: res.data.Data?.high_price,
          low_price: res.data.Data?.low_price,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // handle on submit
  const onSubmit = async (data) => {
    console.log(data);
    let {
      fleet,
      driver,
      owner,
      product,
      project,
      receiver,
      sender,
      salon,
      second_driver,
      load_time_duration,
      load_time,
      discharge_time_duration,
      discharge_time,
      ...newData
    } = data;

    newData.driver_id = driver.id;
    newData.second_driver_id = second_driver?.id;
    newData.fleet_id = fleet.id;
    newData.owner_id = owner.id;

    newData.product_id = product.id;
    newData.project_id = project?.id;
    newData.receiver_id = receiver.id;
    newData.sender_id = sender.id;
    newData.salon_id = salon.id === 0 ? null : salon.id;
    newData.high_price = prices.high_price;
    newData.low_price = prices.low_price;

    const loadTimeValue = load_time.load_time.replaceAll("/", "-");
    const dischargeTimeValue = discharge_time.discharge_time.replaceAll(
      "/",
      "-"
    );

    newData.load_time = loadTimeValue + " " + load_time_duration + ":00";
    newData.load_time_upto =
      loadTimeValue + " " + newData.load_time_upto + ":00";

    newData.discharge_time =
      dischargeTimeValue + " " + discharge_time_duration + ":00";
    newData.discharge_time_upto =
      dischargeTimeValue + " " + newData.discharge_time_upto + ":00";

    newData = JSON.stringify(newData);

    try {
      const res = await addMutation.mutateAsync(newData);

      return res;
    } catch (error) {
      return error;
    }
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <>
      <HelmetTitlePage title="درخواست‌ جدید" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <Card sx={{ p: 2, boxShadow: 1 }}>
            <FormTypography>اطلاعات کلی</FormTypography>

            <FormInputs gridProps={{ md: 3 }} inputs={DataInputs} />

            <Divider sx={{ my: 5 }} />

            <FormTypography>رانندگان</FormTypography>

            <FormInputs gridProps={{ md: 3 }} inputs={DriversInputs} />

            <Divider sx={{ my: 5 }} />

            <FormTypography>زمانبندی</FormTypography>

            <FormInputs gridProps={{ md: 4 }} inputs={DateInputs} />

            <Divider sx={{ my: 5 }} />

            <FormTypography>اطلاعات بارگیر</FormTypography>

            <FormInputs inputs={VehicleTypeInputs} />

            <Divider sx={{ my: 5 }} />

            <FormTypography>فرستنده و گیرنده</FormTypography>

            <FormInputs inputs={ReceiverAndSenderInputs} />

            <Divider sx={{ my: 5 }} />

            <FormTypography>اطلاعات مبدا</FormTypography>

            <FormInputs inputs={SourceInputs} />

            <Divider sx={{ my: 5 }} />

            <FormTypography>اطلاعات مقصد</FormTypography>

            <FormInputs inputs={DestinationInputs} />

            <Divider sx={{ my: 5 }} />

            <FormTypography>قیمت</FormTypography>

            <FormInputs inputs={PricesInputs}>
              <Grid item md={"auto"} xs={12}>
                <Typography variant="subtitle2" fontWeight={700}>
                  قیمت حد بالای سامانه
                </Typography>
                <Typography fontSize={14} mt={1}>
                  {prices.high_price
                    ? numberWithCommas(prices.high_price) + " تومان"
                    : "بدون قیمت"}
                </Typography>
              </Grid>

              <Grid item md={"auto"} xs={12}>
                <Typography variant="subtitle2" fontWeight={700}>
                  قیمت حد پایین سامانه
                </Typography>
                <Typography fontSize={14} mt={1}>
                  {prices.low_price
                    ? numberWithCommas(prices.high_price) + " تومان"
                    : "بدون قیمت"}
                </Typography>
              </Grid>
            </FormInputs>

            <Stack
              mt={10}
              direction="row"
              justifyContent="flex-end"
              spacing={2}
            >
              <LoadingButton
                variant="outlined"
                loading={loading}
                type="button"
                onClick={calculatePrices}
                color="secondary"
              >
                محاسبه قیمت
              </LoadingButton>

              <LoadingButton
                variant="contained"
                loading={isSubmitting}
                type="submit"
                color={Object.keys(errors).length !== 0 ? "error" : "primary"}
              >
                ثبت
              </LoadingButton>
            </Stack>
          </Card>
        </FormContainer>
      </form>
    </>
  );
};

export default NewRequest;
