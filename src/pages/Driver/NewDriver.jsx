import { Card, Stack, Divider } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { FormContainer, FormInputs } from "Components/Form";
import { GENDER } from "Constants";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { toast } from "react-toastify";

import { ChooseVehicle } from "Components/choosers/vehicle/ChooseVehicle";
import FormTypography from "Components/FormTypography";
import HelmetTitlePage from "Components/HelmetTitlePage";

const NewDriver = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    control,
    formState: { errors, isSubmitting },
    setValue,
    handleSubmit,
    reset,
    watch,
  } = useForm();

  const addDriverMutation = useMutation(
    async (data) => {
      try {
        const res = await axiosApi({
          url: "/driver",
          method: "post",
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
        toast.success("با موفقیت اضافه شد");
        navigate("/driver");
      },
    }
  );

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
      // rules: { required: "نام پدر را وارد کنید" },
    },
    {
      type: "number",
      name: "mobile",
      label: "موبایل",
      noInputArrow: true,
      control: control,
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
      // rules: { required: "جنسیت را وارد کنید" },
    },
    {
      type: "date",
      name: "birth_date",
      label: "تاریخ تولد",
      control: control,
      // rules: { required: "تاریخ تولد را وارد کنید" },
    },
    {
      type: "number",
      name: "national_code",
      label: "کدملی",
      noInputArrow: true,
      control: control,
      // rules: {
      //   required: "کدملی را وارد کنید",
      //   maxLength: {value: 10, message: "کد ملی باید 10 رقم باشد"},
      //   minLength: {value: 10, message: "کد ملی باید 10 رقم باشد"}
      // },
    },
    // {
    //   type: "email",
    //   name: "email",
    //   label: "ایمیل",
    //   control: control,
    //   rules: { required: "ایمیل را وارد کنید"},
    // },
    // {
    //   type: "text",
    //   name: "national_card",
    //   label: "شماره کارت هوشمند",
    //   control: control,
    // },
    {
      type: "number",
      name: "license_no",
      label: "شماره گواهینامه",
      noInputArrow: true,
      control: control,
      // rules: {
      //   required: "شماره گواهینامه را وارد کنید",
      //   maxLength: {value: 10, message: "شماره گواهینامه باید 10 رقم باشد"},
      //   minLength: {value: 10, message: "شماره گواهینامه باید 10 رقم باشد"}
      // },
    },
    {
      type: "custom",
      customView: (
        <ChooseVehicle
          control={control}
          name={"vehicle"}
          // rules={{
          //   required: "خودرو را وارد کنید",
          // }}
          label="خودرو"
        />
      ),
      gridProps: { md: 4.8 },
    },
  ];

  // handle on submit
  const onSubmit = (data) => {
    data = JSON.stringify({
      vehicle_id: data?.vehicle?.id,
      mobile: data?.mobile,
      first_name: data?.first_name,
      last_name: data?.last_name,
      father_name: data?.father_name,
      national_code: data?.national_code,
      gender: data?.gender,
      birth_date: data?.birth_date?.birth_date,
      inquiry: null,
      avatar: data?.avatar,
      national_card: data?.national_card,
      license_no: data?.license_no,
    });
    addDriverMutation.mutate(data);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <>
      <HelmetTitlePage title="راننده جدید" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <Card sx={{ p: 2, boxShadow: 1 }}>
            <FormTypography>اطلاعات کلی</FormTypography>
            <FormInputs inputs={PersonalInputs} gridProps={{ md: 2.4 }} />

            <Divider sx={{ my: 5 }} />

            <Stack mt={10} alignItems="flex-end">
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
    </>
  );
};

export default NewDriver;
