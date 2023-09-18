/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Typography, Stack, Grid } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import LoadingSpinner from "Components/versions/LoadingSpinner";

import { FormContainer, FormInputs } from "Components/Form";
import { GENDER } from "Constants";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { toast } from "react-toastify";
import { enToFaNumber, renderPlaqueObjectToString } from "Utility/utils";
import { useVehicleColor } from "hook/useVehicleColor";
import { ChooseVehicle } from "Components/choosers/vehicle/ChooseVehicle";
import moment from "jalali-moment";
import FormTypography from "Components/FormTypography";

export default function Customer() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const {
    control,
    formState: { errors, isSubmitting },
    setValue,
    handleSubmit,
    reset,
    watch,
  } = useForm();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const {
    data: customerData,
    isLoading,
    isFetching,
    isError,
    isSuccess,
  } = useQuery(
    ["customer", id],
    () => axiosApi({ url: `/customer/${id}` }).then((res) => res.data.Data),
    {
      enabled: !!id,
    }
  );

  const updateCustomerMutation = useMutation(
    async (data) => {
      try {
        const res = await axiosApi({
          url: `/customer/${id}`,
          method: "put",
          data: data,
        });
        return res.data;
      } catch (error) {
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["customer"]);
        toast.success("با موفقیت آپدیت شد");
      },
    }
  );

  useEffect(() => {
    if (isSuccess) {
      setIsDataLoaded(false);
      reset(customerData?.person);
      const EnDate = moment
        .from(customerData?.person?.birth_date, "fa", "YYYY-MM-DD")
        .format("YYYY-MM-DD");
      const FnDate = moment
        .from(customerData?.person?.birth_date, "fa", "YYYY-MM-DD")
        .format("jYYYY/jMM/jDD");
      setValue("birth_date", {
        birth_date: EnDate.replaceAll("-", "/"),
        birth_date_fa: FnDate,
        birth_date_text: enToFaNumber(FnDate),
      });
      setTimeout(() => {
        setIsDataLoaded(true);
      }, 20);
    }
  }, [isSuccess]);

  if (!isDataLoaded || isLoading || isFetching) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <div className="">isError</div>;
  }

  const PersonalInputs = [
    {
      type: "text",
      name: "first_name",
      label: "نام",
      control: control,
      rules: { required: "نام را وارد کنید" },
    },
    {
      type: "text",
      name: "last_name",
      label: "نام‌خانوادگی",
      control: control,
      rules: { required: "نام‌خانوادگی را وارد کنید" },
    },
    {
      type: "text",
      name: "father_name",
      label: "نام پدر",
      control: control,
    },
    {
      type: "number",
      name: "mobile",
      label: "موبایل",
      noInputArrow: true,
      control: control,
      readOnly: true,
    },
    {
      type: "select",
      name: "gender",
      label: "جنسیت",
      options: GENDER,
      labelKey: "name",
      valueKey: "value",
      control: control,
    },
    {
      type: "date",
      name: "birth_date",
      label: "تاریخ تولد",
      control: control,
    },
    {
      type: "number",
      name: "national_code",
      label: "کدملی",
      noInputArrow: true,
      control: control,
      rules: { required: "کدملی را وارد کنید" },
    },
    {
      type: "email",
      name: "email",
      label: "ایمیل",
      control: control,
    },
  ];

  // handle on submit
  const onSubmit = (data) => {
    data = JSON.stringify({
      mobile: data.mobile,
      first_name: data.first_name,
      last_name: data.last_name,
      father_name: data.father_name,
      national_code: data.national_code,
      gender: data.gender,
      email: data.email,
      birth_date: data.birth_date?.birth_date_fa,
    });

    updateCustomerMutation.mutate(data);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  const renderItem = (title, value) => {
    return (
      <Grid item xs={12} sm={6} md={3}>
        <Stack spacing={1} direction="row">
          <Typography variant="caption" alignSelf={"center"} fontWeight={"700"}>
            {title}:
          </Typography>
          <Typography variant="caption">{value}</Typography>
        </Stack>
      </Grid>
    );
  };

  return (
    <>
      <Helmet title="پنل دراپ - ویرایش مشتری" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <Card sx={{ p: 2, boxShadow: 1 }}>
            <FormTypography>ویرایش صاحب بار</FormTypography>
            <FormInputs inputs={PersonalInputs} gridProps={{ md: 2.4 }} />

            <Stack mt={10} alignItems="flex-end">
              <LoadingButton
                variant="contained"
                loading={isSubmitting}
                type="submit"
              >
                ذخیره تغییرات
              </LoadingButton>
            </Stack>
          </Card>
        </FormContainer>
      </form>
    </>
  );
}
