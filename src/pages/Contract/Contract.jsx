/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from "@mui/lab";
import { Card, Divider, Stack, TableRow, TableCell } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";

import { FormContainer, FormInputs } from "Components/Form";
import NormalTable from "Components/NormalTable";
import { useOwnerTypes } from "hook/useOwnerTypes";
import { useTransportationTypes } from "hook/useTransportationTypes";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { toast } from "react-toastify";
import { enToFaNumber, renderDateToCalender } from "Utility/utils";
import TableActionCell from "Components/versions/TableActionCell";
import FormTypography from "Components/FormTypography";
import TableInput from "Components/TableInput";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { ChooseOwner } from "Components/choosers/ChooseOwner";
import { ChooseShippingCompany } from "Components/choosers/ChooseShippingCompany";
import { useContractTypes } from "hook/useContractTypes";
import MultiStorage from "Components/multiSelects/MultiStorage";
import MultiPersons from "Components/multiSelects/MultiPersons";

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
    label: "وزن قرارداد",
  },
  {
    id: "volume",
    label: "حجم قرارداد(متر مکعب)",
  },
  {
    id: "actions",
    label: "حذف",
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
    data: contractTypes,
    isError: contractIsError,
    isLoading: contractIsLoading,
    isFetching: contractIsFetching,
  } = useContractTypes();
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

      setValue(
        "sender",
        contract?.senders?.map((item) => {
          return {
            ...item.person,
          };
        })
      );
      setValue(
        "receiver",
        contract?.receivers?.map((item) => {
          return {
            ...item.person,
          };
        })
      );
      setValue(
        "source",
        contract?.sources?.map((item) => {
          return {
            ...item.place,
          };
        })
      );
      setValue(
        "destination",
        contract?.destinations?.map((item) => {
          return {
            ...item.place,
          };
        })
      );
      setValue("daily_max", contract?.daily_max / 1000);
      setValue("weekly_min", contract?.weekly_min / 1000);
      setValue("monthly_min", contract?.monthly_min / 1000);
      const allDates = ["end_date", "start_date"];
      allDates.forEach((i) => {
        if (i) {
          setValue(i, renderDateToCalender(contract[i], i));
        }
      });

      setValue(
        "products",
        contract?.products.map((item) => {
          return {
            ...item,
            weight: item?.weight / 1000,
          };
        })
      );
      setTimeout(() => {
        setIsDataLoaded(true);
      }, 20);
    }
  }, [isSuccess]);

  if (
    !isDataLoaded ||
    isLoading ||
    isFetching ||
    contractIsLoading ||
    contractIsFetching
  ) {
    return <LoadingSpinner />;
  }

  if (isError || contractIsError) {
    return <div className="">isError</div>;
  }

  // inputs
  const DataInputs = [
    {
      type: "text",
      name: "code",
      label: "شماره قرارداد",
      control: control,
      rules: {
        required: "کد را وارد کنید",
      },
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
      splitter: true,
      rules: {
        required: "درصد کمیسیون شرکت حمل را وارد کنید",
      },
    },
    {
      type: "text",
      name: "insurance_company",
      label: "شرکت بيمه گذار",
      control: control,
      rules: {
        required: "شرکت بيمه گذار را وارد کنید",
      },
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

      rules: {
        required: "حداکثر تناژ قابل حمل در روز را وارد کنید",
      },
    },
    {
      type: "number",
      name: "weekly_min",
      label: "حداقل تناژ حمل شده در هفته (تن)",
      control: control,

      rules: {
        required: "حداقل تناژ حمل شده در هفته را وارد کنید",
      },
    },
    {
      type: "number",
      name: "monthly_min",
      label: "حداقل تناژ حمل شده در ماه (تن)",
      control: control,

      rules: {
        required: "حداقل تناژ حمل شده در ماه را وارد کنید",
      },
    },
  ];
  const DataInputs3 = [
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
  const DataInputs4 = [
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
    let places = [];
    let persons = [];
    try {
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
        code: data.code,
        owner_id: data.owner.id,
        owner_type: data.owner_type,
        transportation_type: data.transportation_type,
        type: data.type,
        total_amount: data.total_amount,
        products: data?.products.map((item) => {
          return {
            ...item,
            weight: item?.weight * 1000,
          };
        }),
        places: places,
        persons: persons,
        start_date: data.start_dateEn,
        end_date: data.end_dateEn,
        daily_max: data.daily_max * 1000,
        weekly_min: data.weekly_min * 1000,
        monthly_min: data.monthly_min * 1000,
      });
      const res = await updateMutation.mutateAsync(data);
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
      <HelmetTitlePage title="ویرایش قرارداد" />

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
            <FormInputs gridProps={{ md: 4 }} inputs={DataInputs3} />
            <Divider sx={{ my: 5 }} />
            <FormTypography>نحوه ارسال</FormTypography>
            <FormInputs gridProps={{ md: 4 }} inputs={DataInputs4} />
            <Divider sx={{ my: 5 }} />

            <FormTypography>محصولات</FormTypography>

            <NormalTable headCells={headCells}>
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
