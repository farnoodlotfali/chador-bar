/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Typography, Stack, Grid } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import LoadingSpinner from "Components/versions/LoadingSpinner";

import { FormContainer, FormInputs } from "Components/Form";
import { GENDER } from "Constants";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { toast } from "react-toastify";

import { ChooseVehicle } from "Components/choosers/vehicle/ChooseVehicle";
import moment from "jalali-moment";
import { enToFaNumber, renderSelectOptions } from "Utility/utils";
import FormTypography from "Components/FormTypography";
import HelmetTitlePage from "Components/HelmetTitlePage";

export default function Driver() {
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
    data: driverData,
    isLoading,
    isFetching,
    isError,
    isSuccess,
  } = useQuery(
    ["driver", id],
    () => axiosApi({ url: `/driver/${id}` }).then((res) => res.data.Data),
    {
      enabled: !!id,
    }
  );

  const updateDriverMutation = useMutation(
    async (data) => {
      try {
        const res = await axiosApi({
          url: `/driver/${id}`,
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
        queryClient.invalidateQueries(["driver"]);
        toast.success("با موفقیت آپدیت شد");
      },
    }
  );

  useEffect(() => {
    if (isSuccess) {
      setIsDataLoaded(false);
      reset(driverData?.person);

      setValue("vehicle", driverData?.vehicle);
      setValue("inquiry", driverData?.inquiry === 1 ? "valid" : "inValid");
      if (driverData?.birth_date) {
        const EnDate = moment
          .from(driverData?.person?.birth_date, "fa", "YYYY-MM-DD")
          .format("YYYY-MM-DD");
        const FnDate = moment
          .from(driverData?.person?.birth_date, "fa", "YYYY-MM-DD")
          .format("jYYYY/jMM/jDD");
        setValue("birth_date", {
          birth_date: EnDate.replaceAll("-", "/"),
          birth_date_fa: FnDate,
          birth_date_text: enToFaNumber(FnDate),
        });
      }

      setTimeout(() => {
        setIsDataLoaded(true);
      }, 20);

      setValue("mobile", "0" + parseInt(driverData.mobile));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      rules: {
        required: "موبایل را وارد کنید",
        maxLength: { value: 11, message: "موبایل باید 11 رقم باشد" },
        minLength: { value: 11, message: "موبایل باید 11 رقم باشد" },
      },
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
      type: "number",
      name: "license_no",
      label: "شماره گواهینامه",
      noInputArrow: true,
      control: control,
      rules: {
        required: "شماره گواهینامه را وارد کنید",
        maxLength: { value: 10, message: "شماره گواهینامه باید 10 رقم باشد" },
        minLength: { value: 10, message: "شماره گواهینامه باید 10 رقم باشد" },
      },
    },
    {
      type: "custom",
      customView: (
        <ChooseVehicle
          control={control}
          name={"vehicle"}
          rules={{
            required: "خودرو را وارد کنید",
          }}
          label="خودرو"
        />
      ),
      gridProps: { md: 4.8 },
    },
    // {
    //   type: "select",
    //   name: "inquiry_national_code",
    //   label: "وضعیت کدملی",
    //   options: renderSelectOptions({
    //     valid: "معتبر",
    //     inValid: "نامعتبر",
    //   }),
    //   valueKey: "id",
    //   labelKey: "title",
    //   control: control,
    //   defaultValue: "all",
    //   gridProps: { md: 4 },
    // },
    // {
    //   type: "select",
    //   name: "inquiry_vehicle",
    //   label: "وضعیت خودرو",
    //   options: renderSelectOptions({
    //     valid: "معتبر",
    //     inValid: "نامعتبر",
    //   }),
    //   valueKey: "id",
    //   labelKey: "title",
    //   control: control,
    //   defaultValue: "all",
    //   gridProps: { md: 4 },
    // },
    {
      type: "select",
      name: "inquiry",
      label: "وضعیت فعالیت",
      options: renderSelectOptions({
        valid: "معتبر",
        inValid: "نامعتبر",
      }),
      valueKey: "id",
      labelKey: "title",
      control: control,
      defaultValue: "all",
      gridProps: { md: 4 },
    },
  ];

  // handle on submit
  const onSubmit = (data) => {
    data = JSON.stringify({
      vehicle_id: data.vehicle.id,
      first_name: data.first_name,
      last_name: data.last_name,
      father_name: data.father_name,
      national_code: data.national_code,
      gender: data.gender,
      birth_date: data.birth_date?.birth_date,
      license_no: data.license_no,
      inquiry: data?.inquiry === "valid" ? 1 : 0,
    });

    updateDriverMutation.mutate(data);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <>
      <HelmetTitlePage title="ویرایش راننده" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <Card sx={{ p: 2, boxShadow: 1 }}>
            <FormTypography>ویرایش راننده</FormTypography>
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
