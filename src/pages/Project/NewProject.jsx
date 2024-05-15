/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from "@mui/lab";
import { Card, Divider, Stack, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { FormContainer, FormInputs } from "Components/Form";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useDateStatuses } from "hook/useDateStatuses";
import { useTimePeriods } from "hook/useTimePeriods";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { generateRandomNum, renderSelectOptions2 } from "Utility/utils";
import { ChooseContract } from "Components/choosers/ChooseContract";
import FormTypography from "Components/FormTypography";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { useEffect } from "react";
import moment from "jalali-moment";
import { ChooseProduct } from "Components/choosers/ChooseProduct";

const NewProject = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: timePeriodsTypes,
    isError: timePeriodsIsError,
    isLoading: timePeriodsIsLoading,
    isFetching: timePeriodsIsFetching,
  } = useTimePeriods();
  const {
    data: dateStatuses,
    isError: dateStatusesIsError,
    isLoading: dateStatusesIsLoading,
    isFetching: dateStatusesIsFetching,
  } = useDateStatuses();

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm({
    defaultValues: {
      code: generateRandomNum(8),
    },
  });

  useEffect(() => {
    if (watch("contract")) {
      setValue("start_date", null);
      setValue("end_date", null);

      getDataProject.mutate(watch("contract")?.id);
    }
  }, [watch("contract")]);

  const getDataProject = useMutation(
    (id) => axiosApi({ url: `/contract/${id}`, method: "get" }),
    {
      onSuccess: (res) => {
        setValue(
          "sources",
          res?.data?.Data?.sources?.map((item) => {
            return {
              ...item.place,
            };
          })
        );
        setValue(
          "destinations",
          res?.data?.Data?.destinations?.map((item) => {
            return {
              ...item.place,
            };
          })
        );
        setValue(
          "senders",
          res?.data?.Data?.senders?.map((item) => {
            return {
              ...item?.person,
            };
          })
        );
        setValue(
          "receivers",
          res?.data?.Data?.receivers?.map((item) => {
            return {
              ...item?.person,
            };
          })
        );
      },
    }
  );

  const addNewProjectMutation = useMutation(
    (data) => axiosApi({ url: "/project", method: "post", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["project"]);
        toast.success("با موفقیت اضافه شد");
        reset();
        navigate("/project");
      },
    }
  );

  if (
    timePeriodsIsLoading ||
    timePeriodsIsFetching ||
    dateStatusesIsLoading ||
    dateStatusesIsFetching ||
    addNewProjectMutation.isLoading
  ) {
    return <LoadingSpinner />;
  }
  if (timePeriodsIsError || dateStatusesIsError) {
    return <div className="">isError</div>;
  }

  // inputs
  const DataInputs = [
    {
      type: "text",
      name: "code",
      label: "شماره پروژه",
      control: control,
      // rules: {
      //   required: "شماره پروژه را وارد کنید",
      // },
      readOnly: true,
    },
    {
      type: "text",
      name: "title",
      label: "عنوان پروژه",
      control: control,
      rules: {
        required: "عنوان پروژه را وارد کنید",
      },
    },
  ];
  const DataInputs1 = [
    {
      type: "custom",
      customView: <ChooseContract control={control} name={"contract"} />,
    },
    {
      type: "date",
      name: "start_date",
      minimumDate: {
        year: Number(
          moment
            .from(watch("contract")?.start_date, "YYYY-MM-DD")
            .format("jYYYY")
        ),
        month: Number(
          moment.from(watch("contract")?.start_date, "YYYY-MM-DD").format("jMM")
        ),
        day: Number(
          moment.from(watch("contract")?.start_date, "YYYY-MM-DD").format("jDD")
        ),
      },
      maximumDate: {
        year: Number(
          moment.from(watch("contract")?.end_date, "YYYY-MM-DD").format("jYYYY")
        ),
        month: Number(
          moment.from(watch("contract")?.end_date, "YYYY-MM-DD").format("jMM")
        ),
        day: Number(
          moment.from(watch("contract")?.end_date, "YYYY-MM-DD").format("jDD")
        ),
      },
      label: "تاریخ شروع ",
      control: control,
      rules: {
        required: "تاریخ شروع را وارد کنید",
      },
      hidden: watch("contract") ? false : true,
    },
    {
      type: "date",
      name: "end_date",
      label: "تاریخ پایان ",
      minimumDate: {
        year: Number(
          moment
            .from(watch("contract")?.start_date, "YYYY-MM-DD")
            .format("jYYYY")
        ),
        month: Number(
          moment.from(watch("contract")?.start_date, "YYYY-MM-DD").format("jMM")
        ),
        day: Number(
          moment.from(watch("contract")?.start_date, "YYYY-MM-DD").format("jDD")
        ),
      },
      maximumDate: {
        year: Number(
          moment.from(watch("contract")?.end_date, "YYYY-MM-DD").format("jYYYY")
        ),
        month: Number(
          moment.from(watch("contract")?.end_date, "YYYY-MM-DD").format("jMM")
        ),
        day: Number(
          moment.from(watch("contract")?.end_date, "YYYY-MM-DD").format("jDD")
        ),
      },
      control: control,
      rules: {
        required: "تاریخ پایان را وارد کنید",
      },
      hidden: watch("contract") ? false : true,
    },
    // {
    //   type: "custom",
    //   customView: (
    //     <Typography color="cornflowerblue">
    //       ابتدا قراداد را انتخاب کنید، سپس محصول را انتخاب کنید
    //     </Typography>
    //   ),
    //   gridProps: { md: 12 },
    // },
    {
      type: "select",
      name: "product_id",
      valueKey: "id",
      labelKey: "title",
      label: " محصول",
      options: renderSelectOptions2(watch("contract")?.products),
      control: control,
      rules: {
        required: " محصول را وارد کنید",
      },
      hidden: watch("contract") ? false : true,
    },
    {
      type: "number",
      name: "weight",
      splitter: true,
      label: "تناژ",
      control: control,
      rules: {
        required: "تناژ را وارد کنید",
      },
      hidden: watch("contract") ? false : true,
    },
    {
      type: "custom",
      customView: (
        <ChooseProduct
          control={control}
          name={"product"}
          // rules={{
          //   required: " لطفا محصول را انتخاب کنید",
          // }}
        />
      ),
      hidden: watch("contract") ? true : false,
    },
  ];

  const DataInputs2 = [
    {
      type: "select",
      name: "source_place_id",
      valueKey: "id",
      labelKey: "title",
      label: " مبداء",
      options: renderSelectOptions2(watch("sources"), "address"),
      control: control,
      rules: {
        required: " مبداء را وارد کنید",
      },
    },
    {
      type: "select",
      name: "destination_place_id",
      valueKey: "id",
      labelKey: "title",
      label: " مقصد",
      options: renderSelectOptions2(watch("destinations"), "address"),
      control: control,
      rules: {
        required: " مقصد را وارد کنید",
      },
    },
  ];
  const DataInputs3 = [
    {
      type: "select",
      name: "sender_id",
      valueKey: "id",
      labelKey: "title",
      label: "فرستنده",
      options: renderSelectOptions2(watch("senders"), "name"),
      control: control,
      rules: {
        required: " فرستنده را وارد کنید",
      },
    },
    {
      type: "select",
      name: "receiver_id",
      valueKey: "id",
      labelKey: "title",
      label: "گیرنده",
      options: renderSelectOptions2(watch("receivers"), "name"),
      control: control,
      rules: {
        required: " گیرنده را وارد کنید",
      },
    },
  ];

  // handle on submit
  const onSubmit = (data) => {
    let { contract, ...newData } = data;
    newData.contract_id = contract?.id;
    delete newData?.receivers;
    delete newData?.senders;
    delete newData?.sources;
    delete newData?.destinations;
    newData.start_date = data?.start_date?.start_date;
    newData.end_date = data?.end_date?.end_date;
    newData.product_id = data?.product_id
      ? data?.product_id
      : data?.product?.id;

    newData = JSON.stringify(newData);
    addNewProjectMutation.mutate(newData);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <>
      <HelmetTitlePage title="پروژه جدید" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <Card sx={{ p: 2, boxShadow: 1 }}>
            <FormTypography>اطلاعات کلی</FormTypography>

            <FormInputs gridProps={{ md: 4 }} inputs={DataInputs} />
            <FormInputs gridProps={{ md: 4, mt: 2 }} inputs={DataInputs1} />

            <Divider sx={{ my: 5 }} />

            <FormTypography>مبداء و مقصد</FormTypography>

            <FormInputs gridProps={{ md: 6 }} inputs={DataInputs2} />
            <Divider sx={{ my: 5 }} />

            <FormTypography>فرستنده و گیرنده</FormTypography>

            <FormInputs gridProps={{ md: 6 }} inputs={DataInputs3} />
            <Stack mt={10} alignItems="flex-end">
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

export default NewProject;
