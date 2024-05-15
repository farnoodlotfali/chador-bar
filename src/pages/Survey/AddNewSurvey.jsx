/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Box, Divider, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";
import { FormContainer, FormInputs } from "Components/Form";
import { enToFaNumber, renderSelectOptions } from "Utility/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useForm } from "react-hook-form";
import CollapseForm from "Components/CollapseForm";

import moment from "jalali-moment";
export const AddNewSurvey = ({ editData = null }) => {
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

  const AddReasonMutation = useMutation(
    (data) => axiosApi({ url: "reason", method: "post", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["reason"]);
        toast.success("با موفقیت اضافه شد");
        reset();
      },
    }
  );
  const UpdateReasonMutation = useMutation(
    (data) =>
      axiosApi({
        url: `reason/${editData?.id}`,
        method: "put",
        data: data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["reason"]);
        toast.success("آپدیت با موفقیت انجام شد");
        reset();
        setOpenCollapse(false);
      },
    }
  );
  const Inputs = [
    {
      type: "text",
      name: "name",
      label: "عنوان دلیل",
      control: control,
      rules: { required: "عنوان دلیل را وارد کنید" },
    },
    {
      type: "select",
      name: "effect",
      label: "تاثیر",
      options: [
        { name: "مثبت", value: "negative" },
        { name: "منفی", value: "positive" },
        { name: "بی اثر", value: "none" },
      ],
      labelKey: "name",
      valueKey: "value",
      control: control,
      rules: { required: "تاثیر را وارد کنید" },
    },
    {
      type: "number",
      name: "weight",
      label: "وزن",
      noInputArrow: true,
      control: control,
      rules: {
        required: "وزن را وارد کنید",
      },
    },
    {
      type: "text",
      name: "description",
      label: "توضیحات",
      control: control,
    },
  ];

  useEffect(() => {
    if (editData) {
      delete editData?.activity_zone;
      delete editData?.permit_type;
      reset({ ...editData, ...editData?.ceo });
      if (editData?.registration_date) {
        const EnDate = moment
          .from(editData?.registration_date, "fa", "YYYY-MM-DD")
          .format("YYYY-MM-DD");
        const FnDate = moment
          .from(editData?.registration_date, "fa", "YYYY-MM-DD")
          .format("jYYYY/jMM/jDD");
        setValue("registration_date", {
          registration_date: EnDate.replaceAll("-", "/"),
          registration_date_fa: FnDate,
          registration_date_text: enToFaNumber(FnDate),
        });
      }
      setValue("status", editData?.status);
      setValue("companyName", editData?.name);
      setValue("email1", editData?.ceo?.email);
      setValue("mobile1", editData?.ceo?.mobile);
      setValue("mobile", editData?.mobile);
      setValue("national_code1", editData?.ceo?.national_code);
      setValue("national_code", editData?.national_code);
      if (editData?.ceo?.birth_date) {
        const EnDate1 = moment
          .from(editData?.ceo?.birth_date, "fa", "YYYY-MM-DD")
          .format("YYYY-MM-DD");
        const FnDate1 = moment
          .from(editData?.ceo?.birth_date, "fa", "YYYY-MM-DD")
          .format("jYYYY/jMM/jDD");
        setValue("birth_date", {
          birth_date: EnDate1.replaceAll("-", "/"),
          birth_date_fa: FnDate1,
          birth_date_text: enToFaNumber(FnDate1),
        });
      }
      setOpenCollapse(false);
      setOpenCollapse(true);
    }
  }, [editData]);

  useEffect(() => {
    if (watch("weight") > 9.9) {
      toast.error("وزن نباید بیشتر از 9.9 باشد");
      setValue("weight", null);
    }
  }, [watch("weight")]);

  // handle on submit new ShippingCompany
  const onSubmit = async (data) => {
    data = JSON.stringify({
      name: data?.name,
      effect: data?.effect,
      weight: data?.weight,
      description: data?.description,
    });
    try {
      if (editData) {
        var res;
        res = await UpdateReasonMutation.mutateAsync(data);
      } else {
        res = await AddReasonMutation.mutateAsync(data);
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
      title="افزودن نظرسنجی"
      name="shipping-company.store"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 3 }} />
            <Divider sx={{ my: 2 }} />

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
