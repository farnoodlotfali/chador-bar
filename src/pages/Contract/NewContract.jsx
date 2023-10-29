/* eslint-disable react-hooks/exhaustive-deps */

import { LoadingButton } from "@mui/lab";
import {
  Card,
  Divider,
  OutlinedInput,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { ChoosePerson } from "Components/choosers/ChoosePerson";
import { FormContainer, FormInputs } from "Components/Form";
import { useContractTypes } from "hook/useContractTypes";
import { useOwnerTypes } from "hook/useOwnerTypes";
import { useTransportationTypes } from "hook/useTransportationTypes";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "Components/versions/LoadingSpinner";

import { toast } from "react-toastify";
import {
  enToFaNumber,
  generateRandomNum,
  numberWithCommasEn,
  renderSelectOptions,
  renderSelectOptionsWithInfo,
  validateNumberInput,
} from "Utility/utils";
import NormalTable from "Components/NormalTable";

import MultiProducts from "Components/multiSelects/MultiProducts";
import TableActionCell from "Components/versions/TableActionCell";

import { ChooseShippingCompany } from "Components/choosers/ChooseShippingCompany";
import FormTypography from "Components/FormTypography";
import TableInput from "Components/TableInput";
import HelmetTitlePage from "Components/HelmetTitlePage";

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
    id: "weight",
    label: "وزن قرارداد(کیلوگرم)",
  },
  {
    id: "volume",
    label: "حجم قرارداد(متر مکعب)",
  },
  {
    id: "quantity",
    label: "تعداد",
    info: "تعداد",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];
const inputStyle = {
  inputProps: {
    style: {
      padding: "5px",
    },
  },
};
const NewContract = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: ownerTypes,
    isError: ownerIsError,
    isLoading: ownerIsLoading,
    isFetching: ownerIsFetching,
  } = useOwnerTypes();
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

  const updateMutation = useMutation(
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
    ownerIsLoading ||
    ownerIsFetching ||
    transportationIsLoading ||
    transportationIsFetching ||
    contractIsLoading ||
    contractIsFetching ||
    updateMutation.isLoading
  ) {
    return <LoadingSpinner />;
  }
  if (ownerIsError || transportationIsError || contractIsError) {
    return <div className="">isError</div>;
  }

  // inputs
  const DataInputs = [
    {
      type: "text",
      name: "code",
      label: "کد",
      control: control,
      rules: {
        required: "کد را وارد کنید",
      },
    },
    {
      type: "select",
      name: "owner_type",
      label: "نوع صاحب کالا",
      options: renderSelectOptions(ownerTypes),
      valueKey: "id",
      labelKey: "title",
      control: control,
      rules: {
        required: "نوع صاحب کالا را وارد کنید",
      },
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
      gridProps: { md: 6 },
    },
    {
      type: "number",
      name: "total_amount",
      label: "مبلغ قرارداد(تومان)",
      control: control,
      splitter: true,

      rules: {
        required: "مبلغ قرارداد را وارد کنید",
      },
    },
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
    {
      type: "number",
      name: "weekly_limit",
      label: "حداکثر وزن قابل حمل در هفته(کیلوگرم)",
      splitter: true,
      control: control,
      rules: {
        required: "حداکثر هفتگی را وارد کنید",
      },
    },
    {
      type: "number",
      name: "monthly_limit",
      label: "حداکثر وزن قابل حمل در ماه(کیلوگرم)",
      control: control,
      splitter: true,
      rules: {
        required: "حداکثر ماهانه را وارد کنید",
      },
    },
    {
      type: "select",
      name: "type",
      label: "نوع قرارداد",
      options: renderSelectOptionsWithInfo(contractTypes),
      valueKey: "id",
      labelKey: "title",
      control: control,
      rules: {
        required: "نوع قرارداد را وارد کنید",
      },
    },
    {
      type: "select",
      name: "transportation_type",
      label: "واحد حمل",
      options: renderSelectOptions(transportationTypes),
      valueKey: "id",
      labelKey: "title",
      control: control,
      rules: {
        required: "واحد حمل را وارد کنید",
      },
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
      gridProps: { md: 6 },
    },
  ];

  // handle on submit
  const onSubmit = (data) => {
    let products = [];
    if (data.products) {
      data.products.forEach((item) => {
        products.push({
          product_id: item.id,
          weight: item.weight,
          volume: item.volume,
          count: item.quantity,
        });
      });
    }

    data = JSON.stringify({
      code: data.code,
      owner_id: data.owner.id,
      owner_type: data.owner_type,
      transportation_type: data.transportation_type,
      type: data.type,
      total_amount: data.total_amount.replace(/,/g, ""),
      start_date: data.start_date.start_date,
      end_date: data.end_date.end_date,
      monthly_limit: data.monthly_limit,
      weekly_limit: data.weekly_limit,
      products: products,
      shipping_company_id: data.shipping_company.id,
    });
    updateMutation.mutate(data);
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

  const DataInputs1 = [
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

  const handleAddInfo = (obj, e, index) => {
    if (!validateNumberInput(e.target.value)) {
      return;
    }
    let newObj = {
      ...obj,
      [e.target.name]: e.target.value.replaceAll(",", ""),
    };
    let newArr = watch("products");
    newArr[index] = newObj;
    handleChange("products", newArr);
  };

  return (
    <>
      <HelmetTitlePage title="قرارداد جدید" />


      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <Card sx={{ p: 2, boxShadow: 1 }}>
            <FormTypography>اطلاعات کلی</FormTypography>

            <FormInputs gridProps={{ md: 3 }} inputs={DataInputs} />

            <Divider sx={{ my: 5 }} />

            <FormTypography>محصولات</FormTypography>

            <FormInputs gridProps={{ md: 4 }} inputs={DataInputs1} />

            <NormalTable headCells={headCells} sx={{ mt: 3 }}>
              {watch("products")?.map((item, i) => {
                return (
                  <TableRow hover tabIndex={-1} key={item.id}>
                    <TableCell scope="row">{enToFaNumber(item.code)}</TableCell>
                    <TableCell scope="row">{item.title}</TableCell>
                    <TableCell scope="row">
                      {enToFaNumber(item.group.title)}
                    </TableCell>
                    <TableCell scope="row">
                      {enToFaNumber(item.unit.title)}
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
                      <TableInput
                        input={{
                          control: control,
                          name: `products.${i}.count`,
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
