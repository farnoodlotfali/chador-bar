/* eslint-disable react-hooks/exhaustive-deps */

import { LoadingButton } from "@mui/lab";
import { Card, Divider, Stack, TableCell, TableRow } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { FormContainer, FormInputs } from "Components/Form";
import { useContractTypes } from "hook/useContractTypes";
import { useTransportationTypes } from "hook/useTransportationTypes";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "Components/versions/LoadingSpinner";

import { toast } from "react-toastify";
import { enToFaNumber, generateRandomNum } from "Utility/utils";
import NormalTable from "Components/NormalTable";

import MultiProducts from "Components/multiSelects/MultiProducts";
import TableActionCell from "Components/versions/TableActionCell";

import { ChooseShippingCompany } from "Components/choosers/ChooseShippingCompany";
import FormTypography from "Components/FormTypography";
import TableInput from "Components/TableInput";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { ChooseOwner } from "Components/choosers/ChooseOwner";
import MultiStorage from "Components/multiSelects/MultiStorage";
import MultiPersons from "Components/multiSelects/MultiPersons";
import { useEffect } from "react";

const headCells = [
  {
    id: "code",
    label: "کد",
  },
  {
    id: "title",
    label: "عنوان",
  },
  {
    id: "group",
    label: "دسته‌بندی",
  },
  {
    id: "unit",
    label: "واحد شمارشی",
  },
  {
    id: "count",
    label: "مقدار",
  },
  {
    id: "weight",
    label: "وزن قرارداد(تن)",
  },
  {
    id: "volume",
    label: "حجم قرارداد(متر مکعب)",
  },

  {
    id: "actions",
    label: "عملیات",
  },
];

const NewContract = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: contractTypes,
    isError: contractIsError,
    isLoading: contractIsLoading,
    isFetching: contractIsFetching,
  } = useContractTypes();
  const {
    data: transportationTypes,
    isError: transportationIsError,
    isLoading: transportationIsLoading,
    isFetching: transportationIsFetching,
  } = useTransportationTypes();
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

  const addNeContractMutation = useMutation(
    (data) => axiosApi({ url: "/contract", method: "post", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["contracts"]);
        toast.success("با موفقیت اضافه شد");
        reset();
        navigate("/contract");
      },
    }
  );

  if (
    transportationIsLoading ||
    transportationIsFetching ||
    contractIsLoading ||
    contractIsFetching
  ) {
    return <LoadingSpinner />;
  }
  if (transportationIsError || contractIsError) {
    return <div className="">isError</div>;
  }
  const roleName = localStorage.getItem("role");
  const user = localStorage.getItem("user");
  // inputs
  const DataInputs = [
    {
      type: "text",
      name: "code",
      label: "شماره قرارداد",
      control: control,
      // rules: {
      //   required: "کد را وارد کنید",
      // },
    },
    {
      type: "custom",
      customView: (
        <ChooseOwner
          control={control}
          name={"owner"}
          rules={{
            required: " صاحب بار را وارد کنید",
          }}
        />
      ),
      hidden: roleName && roleName?.includes("legal-owner") ? true : false,
    },

    {
      type: "custom",
      customView: (
        <ChooseShippingCompany
          control={control}
          name={"shipping_company"}
          rules={{
            required: " کد شرکت حمل را وارد کنید",
          }}
        />
      ),
    },
    {
      type: "number",
      name: "total_amount",
      label: "مبلغ قرارداد (ریال)",
      control: control,
      splitter: true,

      rules: {
        required: "مبلغ قرارداد را وارد کنید",
      },
    },
    {
      type: "number",
      name: "commission_percent",
      label: "درصد کمیسیون شرکت حمل",
      control: control,
      rules: {
        required: "درصد کمیسیون شرکت حمل را وارد کنید",
      },
    },
    {
      type: "text",
      name: "insurance_company",
      label: "شرکت بيمه گذار",
      control: control,
      // rules: {
      //   required: "شرکت بيمه گذار را وارد کنید",
      // },
    },
    {
      type: "number",
      name: "insurance_no",
      label: "شماره بيمه نامه",
      control: control,
      rules: {
        required: "شماره بيمه نامه را وارد کنید",
      },
    },
    {
      type: "number",
      name: "insurance_amount",
      label: "مبلغ بيمه نامه",
      control: control,
      splitter: true,
      rules: {
        required: "مبلغ بيمه نامه را وارد کنید",
      },
    },
    {
      type: "number",
      name: "terminal_percent",
      label: "حق پايانه",
      control: control,
      rules: {
        required: "حق پايانه را وارد کنید",
      },
    },
    {
      type: "number",
      name: "load_cost",
      label: "هزينه بارگیری",
      control: control,
      splitter: true,
      rules: {
        required: "هزينه بارگیری را وارد کنید",
      },
    },
    {
      type: "number",
      name: "discharge_cost",
      label: "هزينه تخليه بار",
      control: control,
      splitter: true,
      rules: {
        required: "هزينه تخليه بار را وارد کنید",
      },
    },
    {
      type: "number",
      name: "scale_cost",
      label: "هزينه باسكول",
      control: control,
      splitter: true,
      rules: {
        required: "هزينه باسكول را وارد کنید",
      },
    },
  ];
  const DataInputs1 = [
    {
      type: "date",
      name: "start_date",
      label: "تاریخ شروع ",
      control: control,
      rules: {
        required: "تاریخ شروع را وارد کنید",
      },
    },
    {
      type: "date",
      name: "end_date",
      label: "تاریخ پایان ",
      control: control,
      rules: {
        required: "تاریخ پایان را وارد کنید",
      },
    },
  ];
  const DataInputs2 = [
    {
      type: "number",
      name: "daily_max",
      label: "حداکثر تناژ قابل حمل در روز (تن)",
      control: control,

      // rules: {
      //   required: "حداکثر تناژ قابل حمل در روز را وارد کنید",
      // },
    },
    {
      type: "number",
      name: "weekly_min",
      label: "حداقل تناژ حمل شده در هفته (تن)",
      control: control,

      // rules: {
      //   required: "حداقل تناژ حمل شده در هفته را وارد کنید",
      // },
    },
    {
      type: "number",
      name: "monthly_min",
      label: "حداقل تناژ حمل شده در ماه (تن)",
      control: control,

      // rules: {
      //   required: "حداقل تناژ حمل شده در ماه را وارد کنید",
      // },
    },
  ];
  const DataInputs3 = [
    {
      type: "custom",
      customView: (
        <MultiProducts
          control={control}
          name={"products"}
          rules={{
            required: { message: "محصول را انتخاب کنید", value: true },
            minLength: { message: "حداقل یک محصول را انتخاب کنید", value: 1 },
          }}
          label="محصولات"
          needMoreInfo={true}
        />
      ),
    },
  ];
  const DataInputs4 = [
    {
      type: "custom",
      customView: (
        <MultiStorage control={control} name={"source"} label={"مبداء"} />
      ),
      gridProps: { md: 6 },
    },
    {
      type: "custom",
      customView: (
        <MultiStorage control={control} name={"destination"} label={"مقصد"} />
      ),
      gridProps: { md: 6 },
    },
  ];
  const DataInputs5 = [
    {
      type: "custom",
      customView: (
        <MultiPersons control={control} name={"sender"} label="فرستنده" />
      ),
      gridProps: { md: 6 },
    },
    {
      type: "custom",
      customView: (
        <MultiPersons control={control} name={"receiver"} label={"گیرنده"} />
      ),
      gridProps: { md: 6 },
    },
  ];
  // handle on submit
  const onSubmit = async (data) => {
    let products = [];
    let places = [];
    let persons = [];

    if (data?.products) {
      data?.products?.forEach((item) => {
        products.push({
          product_id: item?.id,
          weight: item?.weight * 1000,
          volume: item?.volume,
          count: item?.count,
        });
      });
    }
    if (data?.source) {
      data?.source?.forEach((item) => {
        places.push({
          place_id: item?.id,
          type: "source",
        });
      });
    }
    if (data?.destination) {
      data?.destination?.forEach((item) => {
        places.push({
          place_id: item?.id,
          type: "destination",
        });
      });
    }
    if (data?.sender) {
      data?.sender?.forEach((item) => {
        persons.push({
          person_id: item?.id,
          role: "sender",
        });
      });
    }
    if (data?.receiver) {
      data?.receiver?.forEach((item) => {
        persons.push({
          person_id: item?.id,
          role: "receiver",
        });
      });
    }

    data = JSON.stringify({
      ...data,
      owner_id:
        roleName && roleName?.includes("legal-owner")
          ? JSON.parse(user)?.id
          : data?.owner?.id,
      // owner_type: "legal",
      transportation_type: data?.transportation_type,
      start_date: data?.start_date?.start_date,
      end_date: data?.end_date?.end_date,
      products: products,
      places: places,
      persons: persons,
      shipping_company_id: data?.shipping_company?.id,
      daily_max: data?.daily_max * 1000,
      weekly_min: data?.weekly_min * 1000,
      monthly_min: data?.monthly_min * 1000,
    });
    try {
      const res = await addNeContractMutation.mutateAsync(data);
      return res;
    } catch (error) {
      return error;
    }
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  const handleRemoveProduct = (obj) => {
    handleChange(
      "products",
      watch("products")?.filter((item) => item.id !== obj.id)
    );
  };

  return (
    <>
      <HelmetTitlePage title="قرارداد جدید" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <Card sx={{ p: 2, boxShadow: 1 }}>
            <FormTypography>اطلاعات کلی</FormTypography>

            <FormInputs gridProps={{ md: 4 }} inputs={DataInputs} />

            <Divider sx={{ my: 5 }} />
            <FormInputs gridProps={{ md: 4 }} inputs={DataInputs1} />
            <Divider sx={{ my: 5 }} />
            <FormInputs gridProps={{ md: 4 }} inputs={DataInputs2} />
            <Divider sx={{ my: 5 }} />
            <FormTypography>انتخاب انبار</FormTypography>
            <FormInputs gridProps={{ md: 4 }} inputs={DataInputs4} />
            <Divider sx={{ my: 5 }} />
            <FormTypography>نحوه ارسال</FormTypography>
            <FormInputs gridProps={{ md: 4 }} inputs={DataInputs5} />
            <Divider sx={{ my: 5 }} />
            <FormTypography>محصولات</FormTypography>

            <FormInputs gridProps={{ md: 4 }} inputs={DataInputs3} />

            <NormalTable headCells={headCells} sx={{ mt: 3 }}>
              {watch("products")?.map((item, i) => {
                return (
                  <TableRow hover tabIndex={-1} key={item.id}>
                    <TableCell scope="row">{enToFaNumber(item.code)}</TableCell>
                    <TableCell scope="row">{item.title}</TableCell>
                    <TableCell scope="row">{item?.group?.title}</TableCell>
                    <TableCell scope="row">{item?.unit?.title}</TableCell>
                    <TableCell scope="row">
                      <TableInput
                        input={{
                          control: control,
                          name: `products.${i}.count`,
                        }}
                      />
                    </TableCell>
                    <TableCell scope="row">
                      <TableInput
                        input={{
                          control: control,
                          name: `products.${i}.weight`,
                          rules: {
                            required: "وزن را وارد کنید",
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell scope="row">
                      <TableInput
                        input={{
                          control: control,
                          name: `products.${i}.volume`,
                        }}
                      />
                    </TableCell>
                    <TableCell scope="row">
                      <TableActionCell
                        buttons={[
                          {
                            tooltip: "حذف کردن",
                            color: "error",
                            icon: "trash-xmark",
                            onClick: () => handleRemoveProduct(item),
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </NormalTable>

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

export default NewContract;
