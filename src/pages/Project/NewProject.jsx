/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from "@mui/lab";
import {
  Card,
  Divider,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { FormContainer, FormInputs } from "Components/Form";
import NormalTable from "Components/NormalTable";
import LoadingSpinner from "Components/versions/LoadingSpinner";

import { useDateStatuses } from "hook/useDateStatuses";

import { useTimePeriods } from "hook/useTimePeriods";

import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  generateRandomNum,
  renderSelectOptions,
  renderSelectOptions2,
} from "Utility/utils";
import TableActionCell from "Components/versions/TableActionCell";
import { ChooseContract } from "Components/choosers/ChooseContract";

import MultiAddresses from "Components/multiSelects/MultiAddresses";
import FormTypography from "Components/FormTypography";

const headCells = [
  {
    id: "address",
    label: "آدرس",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

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
      label: "کد پروژه",
      control: control,
      rules: {
        required: "کد پروژه را وارد کنید",
      },
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
    {
      type: "number",
      name: "weight",
      splitter: true,
      label: "تناژ",
      control: control,
      rules: {
        required: "تناژ را وارد کنید",
      },
    },
    {
      type: "select",
      name: "time_period",
      label: "دوره زمانی",
      options: renderSelectOptions(timePeriodsTypes),
      valueKey: "id",
      labelKey: "title",
      control: control,
      rules: {
        required: "دوره زمانی را وارد کنید",
      },
    },

    {
      type: "custom",
      customView: (
        <ChooseContract
          control={control}
          name={"contract"}
          rules={{
            required: "کد قرارداد را وارد کنید",
          }}
        />
      ),
      gridProps: { md: 12 },
    },

    {
      type: "custom",
      customView: (
        <Typography color="cornflowerblue">
          ابتدا قراداد را انتخاب کنید، سپس محصول را انتخاب کنید
        </Typography>
      ),
      gridProps: { md: 12 },
    },
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
    },
  ];

  const DataInputs1 = [
    {
      type: "custom",
      customView: (
        <MultiAddresses control={control} name={"places"} label="آدرس" />
      ),
      gridProps: { md: 6 },
    },
  ];

  const zonesPlaces = [
    {
      type: "zone",
      name: "zones",
      control: control,
      rules: {
        required: "zones را وارد کنید",
      },
      gridProps: { md: 12 },
    },
  ];

  // handle on submit
  const onSubmit = (data) => {
    if (
      watch("zones") === null ||
      watch("zones").source_zones.length === 0 ||
      watch("zones").destination_zones.length === 0
    ) {
      toast.error("لطفا مبدا و مقصد را روی نقشه مشخص کنید");
      return;
    }

    data.source_zones = watch("zones").source_zones;
    data.destination_zones = watch("zones").destination_zones;

    let { contract, ...newData } = data;
    newData.contract_id = contract.id;
    newData.places = newData.places.map(({ id, ...keepAttrs }) => keepAttrs);
    newData = JSON.stringify(newData);
    addNewProjectMutation.mutate(newData);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  const handleRemoveAddress = (obj) => {
    handleChange(
      "places",
      watch("places")?.filter((item) => item.id !== obj.id)
    );
  };

  return (
    <>
      <Helmet title="پنل دراپ -  پروژه جدید" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <Card sx={{ p: 2, boxShadow: 1 }}>
            <FormTypography>اطلاعات کلی</FormTypography>

            <FormInputs gridProps={{ md: 4 }} inputs={DataInputs} />

            <Divider sx={{ my: 5 }} />

            <FormTypography>آدرس های منتخب</FormTypography>

            <FormInputs gridProps={{ md: 4 }} inputs={DataInputs1} />

            <NormalTable headCells={headCells} sx={{ mt: 3 }}>
              {watch("places")?.map((item) => {
                return (
                  <TableRow hover tabIndex={-1} key={item.id}>
                    <TableCell scope="row">{item.address}</TableCell>
                    <TableCell>
                      <TableActionCell
                        buttons={[
                          {
                            tooltip: "حذف کردن",
                            color: "error",
                            icon: "trash-xmark",
                            onClick: () => handleRemoveAddress(item),
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </NormalTable>

            <Divider sx={{ my: 5 }} />
            <FormTypography>محدوده مناطق کشوری و شهری</FormTypography>

            <FormInputs inputs={zonesPlaces} />

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
