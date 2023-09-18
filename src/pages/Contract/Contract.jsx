/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from "@mui/lab";
import {
  Card,
  Divider,
  Stack,
  TableRow,
  TableCell,
  OutlinedInput,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { ChoosePerson } from "Components/choosers/ChoosePerson";

import { FormContainer, FormInputs } from "Components/Form";
import NormalTable from "Components/NormalTable";
import { useOwnerTypes } from "hook/useOwnerTypes";
import { useTransportationTypes } from "hook/useTransportationTypes";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { toast } from "react-toastify";
import {
  enToFaNumber,
  numberWithCommasEn,
  removeComma,
  renderDateToCalender,
  renderSelectOptions,
} from "Utility/utils";
import TableActionCell from "Components/versions/TableActionCell";
import FormTypography from "Components/FormTypography";

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
    label: "وزن",
  },
  {
    id: "volume",
    label: "حجم",
  },
  {
    id: "quantity",
    label: "تعداد",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

const Contract = () => {
  const queryClient = useQueryClient();
  const { data: ownerTypes } = useOwnerTypes();
  const { data: transportationTypes } = useTransportationTypes();

  const params = useParams();
  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const {
    data: contract,
    isError,
    isLoading,
    isFetching,
    isSuccess,
  } = useQuery(
    ["contracts", params.id],
    () =>
      axiosApi({ url: `/contract/${params.id}` }).then((res) => res.data.Data),
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  const updateMutation = useMutation(
    (data) =>
      axiosApi({ url: `/contract/${params.id}`, method: "put", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["contracts"]);
        toast.success("با موفقیت تغییرات اعمال شد");
      },
    }
  );

  // fill all inputs, if data is reached
  useEffect(() => {
    if (isSuccess) {
      setIsDataLoaded(false);
      reset(contract);
      const allDates = ["end_date", "start_date"];
      allDates.forEach((i) => {
        if (i) {
          setValue(i, renderDateToCalender(contract[i], i));
        }
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

  // inputs
  const DataInputs = [
    {
      type: "text",
      name: "code",
      label: "کد قرارداد",
      control: control,
      rules: { required: "کد قرارداد را وارد کنید" },
    },
    {
      type: "number",
      name: "total_amount",
      label: "هزینه",
      control: control,
      splitter: true,
      rules: { required: "هزینه را وارد کنید" },
    },
    {
      type: "number",
      name: "weekly_limit",
      label: "حداکثر وزن قابل حمل در هفته",
      splitter: true,
      control: control,
      rules: { required: "حداکثر وزن را وارد کنید" },
    },
    {
      type: "number",
      name: "monthly_limit",
      label: "حداکثر وزن قابل حمل در ماه",
      splitter: true,
      control: control,
      rules: { required: "مقدار ماهانه را وارد کنید" },
    },
    {
      type: "date",
      name: "end_date",
      label: "تاریخ پایان ",
      control: control,
      rules: { required: "تاریخ پایان را وارد کنید" },
    },
    {
      type: "date",
      name: "start_date",
      label: "تاریخ شروع ",
      control: control,
      rules: { required: "تاریخ شروع را وارد کنید" },
    },
    {
      type: "select",
      name: "owner_type",
      label: "نوع مالک",
      options: renderSelectOptions(ownerTypes),
      valueKey: "id",
      labelKey: "title",
      control: control,
      rules: { required: "نوع مالک را وارد کنید" },
    },
    {
      type: "select",
      name: "transportation_type",
      label: "نوع حمل و نقل",
      options: renderSelectOptions(transportationTypes),
      valueKey: "id",
      labelKey: "title",
      control: control,
      rules: { required: "نوع حمل و نقل را وارد کنید" },
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
  ];

  // handle on submit
  const onSubmit = (data) => {
    data = JSON.stringify({
      code: data.code,
      owner_id: data.owner.id,
      owner_type: data.owner_type,
      transportation_type: data.transportation_type,
      type: data.type,
      total_amount: data.total_amount,
      products: data?.products,
      start_date: data.start_dateEn,
      end_date: data.end_dateEn,
      monthly_limit: data.monthly_limit,
      weekly_limit: data.weekly_limit,
    });
    updateMutation.mutate(data);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };
  const handleAddInfo = (obj, e, index) => {
    let newProducts = watch("products");
    newProducts[index][e.target.name] = removeComma(e.target.value);
    handleChange("products", newProducts);
  };

  const handleRemoveProduct = (obj) => {
    handleChange(
      "products",
      watch("products")?.filter((item) => item.id !== obj.id)
    );
  };

  const inputStyle = {
    inputProps: {
      style: {
        padding: "5px",
      },
    },
  };
 
  return (
    <>
      <Helmet title="پنل دراپ - ویرایش قرارداد" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <Card sx={{ p: 2, boxShadow: 1 }}>
            <FormTypography>اطلاعات کلی</FormTypography>

            <FormInputs gridProps={{ md: 3 }} inputs={DataInputs} />

            <Divider sx={{ my: 5 }} />

            <FormTypography>محصولات</FormTypography>

            <NormalTable headCells={headCells}>
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
                      <OutlinedInput
                        name="weight"
                        {...inputStyle}
                        value={numberWithCommasEn(item.weight)}
                        onChange={(e) => handleAddInfo(item, e, i)}
                      />
                    </TableCell>
                    <TableCell scope="row">
                      <OutlinedInput
                        {...inputStyle}
                        name="volume"
                        value={numberWithCommasEn(item?.volume)}
                        onChange={(e) => handleAddInfo(item, e, i)}
                      />
                    </TableCell>
                    <TableCell scope="row">
                      <OutlinedInput
                        {...inputStyle}
                        name="count"
                        value={numberWithCommasEn(item?.count)}
                        onChange={(e) => handleAddInfo(item, e, i)}
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
                ذخیره تغییرات
              </LoadingButton>
            </Stack>
          </Card>
        </FormContainer>
      </form>
    </>
  );
};

export default Contract;
