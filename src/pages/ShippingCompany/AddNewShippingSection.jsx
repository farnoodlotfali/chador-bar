/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Grid, Box, Divider, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";
import { FormContainer, FormInputs } from "Components/Form";
import { enToFaNumber, renderSelectOptions } from "Utility/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useForm } from "react-hook-form";
import CollapseForm from "Components/CollapseForm";
import FormTypography from "Components/FormTypography";
import { GENDER, SENDER_RECEIVER } from "Constants";

import MultiActivity from "Components/multiSelects/MultiActivity";
import MultiPermit from "Components/multiSelects/MultiPermit";
import moment from "jalali-moment";
export const AddNewShippingSection = ({ companyTypes, editData = null }) => {
  const queryClient = useQueryClient();
  const [openCollapse, setOpenCollapse] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();

  const AddShippingCompanyMutation = useMutation(
    (data) => axiosApi({ url: "shipping-company", method: "post", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["shippingCompany"]);
        toast.success("با موفقیت اضافه شد");
        reset();
      },
    }
  );
  const UpdateShippingCompanyMutation = useMutation(
    (data) =>
      axiosApi({
        url: `shipping-company/${editData?.id}`,
        method: "put",
        data: data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["shippingCompany"]);
        toast.success("آپدیت با موفقیت انجام شد");
        reset();
        setOpenCollapse(false);
      },
    }
  );
  const Inputs = [
    {
      type: "text",
      name: "code",
      label: "شناسه فعالیت",
      control: control,
      rules: { required: "کد را وارد کنید" },
    },
    {
      type: "text",
      name: "name",
      label: "نام",
      control: control,
      rules: { required: "نام را وارد کنید" },
    },
    {
      type: "number",
      name: "economic_code",
      label: "کد اقتصادی",
      noInputArrow: true,
      control: control,
      //   rules: {
      //     // required: "کد اقتصادی را وارد کنید"
      //     maxLength: {
      //       value: 12,
      //       message: "کد اقتصادی باید 12 رقمی باشد",
      //     },
      //     minLength: {
      //       value: 12,
      //       message: "کد اقتصادی باید 12 رقمی باشد",
      //     },
      //   },
    },
    {
      type: "number",
      name: "mobile",
      label: "شماره تماس رابط",
      noInputArrow: true,
      control: control,
      rules: {
        required: "موبایل را وارد کنید",
        maxLength: {
          value: 11,
          message: "موبایل باید 11 رقمی باشد",
        },
        minLength: {
          value: 11,
          message: "موبایل باید 11 رقمی باشد",
        },
      },
    },
    {
      type: "number",
      name: "phone",
      label: "تلفن ثابت",
      noInputArrow: true,
      control: control,
      rules: {
        required: "تلفن ثابت را وارد کنید",
        maxLength: {
          value: 11,
          message: "تلفن باید 11 رقمی باشد",
        },
        minLength: {
          value: 11,
          message: "تلفن باید 11 رقمی باشد",
        },
      },
    },
    {
      type: "number",
      name: "zip_code",
      label: "کد پستی پایانه",
      noInputArrow: true,
      control: control,
      // rules: {
      //   required: "کد پستی پایانه را وارد کنید",
      //   minLength: {
      //     value: 10,
      //     message: "کد پستی باید 10 رقمی باشد",
      //   },
      //   maxLength: {
      //     value: 10,
      //     message: "کد پستی باید 10 رقمی باشد",
      //   },
      // },
    },
    {
      type: "text",
      name: "address",
      label: "آدرس پایانه",
      noInputArrow: true,
      control: control,
      // rules: {
      //   required: "آدرس پایانه را وارد کنید",
      //   maxLength: {
      //     value: 255,
      //     message: "آدرس باید حداکثر 255 کاراکتر باشد",
      //   },
      // },
    },
    {
      type: "email",
      name: "email",
      label: "ایمیل",
      control: control,
      rules: { required: "ایمیل را وارد کنید" },
    },
    {
      type: "number",
      name: "national_code",
      label: "شناسه ملی",
      control: control,
      noInputArrow: true,
      rules: {
        required: "شناسه ملی را وارد کنید",
        maxLength: {
          value: 11,
          message: "شناسه ملی باید 11 رقمی باشد",
        },
        minLength: {
          value: 11,
          message: "شناسه ملی باید 11 رقمی باشد",
        },
      },
    },
    {
      type: "number",
      name: "registration_code",
      label: "کد ثبت",
      control: control,
      noInputArrow: true,
      rules: { required: "کد ثبت را وارد کنید" },
    },
    {
      type: "text",
      name: "registration_place",
      label: "محل ثبت",
      control: control,
      rules: { required: "محل ثبت را وارد کنید" },
    },
    {
      type: "date",
      name: "registration_date",
      label: "تاریخ ثبت ",
      control: control,
      rules: {
        required: "تاریخ ثبت را وارد کنید",
      },
    },
    {
      type: "select",
      name: "type",
      label: "نوع",
      options: renderSelectOptions(companyTypes),
      valueKey: "id",
      labelKey: "title",
      control: control,
      rules: { required: "نوع را وارد کنید" },
    },
    {
      type: "custom",
      customView: (
        <MultiActivity
          control={control}
          name={"activity_zone"}
          label="حوزه فعالیت شرکت حمل"
          rules={{ required: "حوزه فعالیت شرکت حمل را وارد کنید" }}
        />
      ),
    },
    {
      type: "custom",
      customView: (
        <MultiPermit control={control} name={"permit_type"} label="نوع مجوز" />
      ),
    },
  ];
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
      rules: { required: "نام پدر را وارد کنید" },
    },
    {
      type: "number",
      name: "mobile1",
      label: "موبایل",
      noInputArrow: true,
      control: control,
      rules: { required: "موبایل را وارد کنید" },
    },
    {
      type: "select",
      name: "gender",
      label: "جنسیت",
      options: GENDER,
      labelKey: "name",
      valueKey: "value",
      control: control,
      rules: { required: "جنسیت را وارد کنید" },
    },
    {
      type: "date",
      name: "birth_date",
      label: "تاریخ تولد",
      control: control,
      rules: { required: "تاریخ تولد را وارد کنید" },
    },
    {
      type: "number",
      name: "national_code1",
      label: "کدملی",
      noInputArrow: true,
      control: control,
      rules: {
        required: "کدملی را وارد کنید",
        maxLength: {
          value: 10,
          message: "کد ملی باید 10 رقمی باشد",
        },
        minLength: {
          value: 10,
          message: "کد ملی باید 10 رقمی باشد",
        },
      },
    },
    {
      type: "email",
      name: "email1",
      label: "ایمیل",
      control: control,
      rules: { required: "ایمیل را وارد کنید" },
    },
  ];

  useEffect(() => {
    if (editData) {
      delete editData?.activity_zone;
      delete editData?.permit_type;
      reset({ ...editData, ...editData?.company, ...editData?.company?.ceo });
      const EnDate = moment
        .from(editData?.company?.registration_date, "fa", "YYYY-MM-DD")
        .format("YYYY-MM-DD");
      const FnDate = moment
        .from(editData?.company?.registration_date, "fa", "YYYY-MM-DD")
        .format("jYYYY/jMM/jDD");
      setValue("registration_date", {
        registration_date: EnDate.replaceAll("-", "/"),
        registration_date_fa: FnDate,
        registration_date_text: enToFaNumber(FnDate),
      });
      setValue("email1", editData?.company?.ceo?.email);
      setValue("mobile1", editData?.company?.ceo?.mobile);
      setValue("mobile", editData?.mobile);
      setValue("national_code1", editData?.company?.ceo?.national_code);
      setValue("national_code", editData?.company?.national_code);
      const EnDate1 = moment
        .from(editData?.company?.ceo?.birth_date, "fa", "YYYY-MM-DD")
        .format("YYYY-MM-DD");
      const FnDate1 = moment
        .from(editData?.company?.ceo?.birth_date, "fa", "YYYY-MM-DD")
        .format("jYYYY/jMM/jDD");
      setValue("birth_date", {
        birth_date: EnDate1.replaceAll("-", "/"),
        birth_date_fa: FnDate1,
        birth_date_text: enToFaNumber(FnDate1),
      });
      setOpenCollapse(false);
      setOpenCollapse(true);
    }
  }, [editData]);

  // handle on submit new ShippingCompany
  const onSubmit = async (data) => {
    data = JSON.stringify({
      ceo: {
        first_name: data?.first_name,
        last_name: data?.last_name,
        father_name: data?.father_name,
        mobile: data?.mobile1,
        gender: data?.gender,
        birth_date: data?.birth_date?.birth_date_fa,
        national_code: data?.national_code1,
        email: data?.email1,
      },
      code: data?.code,
      name: data?.name,
      economic_code: data?.economic_code,
      email: data?.email,
      first_name: data?.first_name,
      last_name: data?.last_name,
      father_name: data?.father_name,
      mobile: data?.mobile,
      gender: data?.gender,
      national_code: data?.national_code,
      phone: data?.phone,
      zip_code: data?.zip_code,
      address: data?.address,
      registration_code: data?.registration_code,
      registration_place: data?.registration_place,
      type: data?.type,
      status: 1,
      registration_date: data?.registration_date?.registration_date_fa,
      activity_zone: data?.activity_zone?.map((item) => {
        return item?.name;
      }),
      permit_type: data?.permit_type?.map((item) => {
        return item?.name;
      }),
    });
    delete data?.mobile1;
    delete data?.mobile1;
    try {
      if (editData) {
        var res;
        res = await UpdateShippingCompanyMutation.mutateAsync(data);
      } else {
        res = await AddShippingCompanyMutation.mutateAsync(data);
      }

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
    <CollapseForm
      onToggle={setOpenCollapse}
      open={openCollapse}
      title="افزودن شرکت حمل و نقل"
      name="shipping-company.store"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 3 }} />
            <Divider sx={{ my: 2 }} />

            <FormTypography>اطلاعات مدیرعامل</FormTypography>
            <FormInputs inputs={PersonalInputs} gridProps={{ md: 3 }} />
            <Stack alignItems="flex-end">
              <LoadingButton
                sx={{
                  width: "150px",
                  height: "56px",
                  mt: 3,
                }}
                variant="contained"
                loading={isSubmitting}
                type="submit"
              >
                {editData ? "ویرایش" : "افزودن"}
              </LoadingButton>
            </Stack>
          </FormContainer>
        </Box>
      </form>
    </CollapseForm>
  );
};
