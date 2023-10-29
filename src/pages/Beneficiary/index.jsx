import { useState } from "react";

import {
  Grid,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Stack,
  Box,
} from "@mui/material";
import LoadingSpinner from "Components/versions/LoadingSpinner";

import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import ActionConfirm from "Components/ActionConfirm";
import {
  enToFaNumber,
  numberWithCommas,
  renderSelectOptions1,
  removeInvalidValues,
  renderSelectOptions,
} from "Utility/utils";
import { axiosApi } from "api/axiosApi";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useBeneficiary } from "hook/useBeneficiary";
import { useVehicleType } from "hook/useVehicleType";
import { useShippingCompany } from "hook/useShippingCompany";
import { FormContainer, FormInputs } from "Components/Form";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import HelmetTitlePage from "Components/HelmetTitlePage";

const headCells = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "vehicle_type_id",
    label: "نوع بارگیر",
  },
  {
    id: "shipping_company_id",
    label: "شرکت حمل و نقل",
  },
  {
    id: "switch_percent",
    label: "سهم نرم‌افزار",
    sortable: true,
  },
  {
    id: "shipping_company_percent",
    label: "سهم شرکت حمل",
    sortable: true,
  },
  {
    id: "fleet_percent",
    label: "سهم ناوگان",
    sortable: true,
  },
  {
    id: "municipal_percent",
    label: "سهم وزارت",
    sortable: true,
  },
  {
    id: "agent_percent",
    label: "سهم نمایندگی",
    sortable: true,
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

const BeneficiaryList = () => {
  const queryClient = useQueryClient();
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();

  const [acceptRemoveModal, setAcceptRemoveModal] = useState(false);
  const [beneficiaryItem, setBeneficiaryItem] = useState(null);

  const {
    data: allBeneficiaries,
    isLoading,
    isFetching,
    isError,
  } = useBeneficiary(searchParamsFilter);

  const {
    data: vehicleTypes,
    isLoading: vTypeIsLoading,
    isFetching: vTypeIsFetching,
  } = useVehicleType();
  const {
    data: shippingCompanies,
    isLoading: ShCIsLoading,
    isFetching: ShCIsFetching,
  } = useShippingCompany();

  // Mutations
  const deleteMutation = useMutation(
    (id) => axiosApi({ url: `/beneficiary/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["beneficiary"]);
        toast.success("درخواست شما با موفقیت پاک شد");
      },
      onError: () => {
        toast.error("خطا  ");
      },
    }
  );

  if (
    isLoading ||
    isFetching ||
    vTypeIsLoading ||
    vTypeIsFetching ||
    ShCIsLoading ||
    ShCIsFetching ||
    deleteMutation.isLoading
  ) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <div className="">isError</div>;
  }
  // UI functions

  const showModalToRemove = (beneficiary) => {
    setBeneficiaryItem(beneficiary);
    setAcceptRemoveModal(true);
  };

  // Remove Beneficiary
  const handleRemoveBeneficiary = () => {
    deleteMutation.mutate(beneficiaryItem.id);
    setAcceptRemoveModal(false);
    setBeneficiaryItem(null);
  };

  return (
    <>
      <HelmetTitlePage title="ذینفعان" />
      <AddNewBeneficiary
        shippingCompanies={shippingCompanies}
        vehicleTypes={vehicleTypes}
      />

      <SearchBoxBeneficiary />

      <Table
        {...allBeneficiaries}
        headCells={headCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
      >
        <TableBody>
          {allBeneficiaries.data.map((row) => {
            const vType = vehicleTypes.data.find(
              (item) => item.vehicle_category_id === row.vehicle_type_id
            );
            const shippingCompany = shippingCompanies.data.find(
              (item) => item.id === row.shipping_company_id
            );
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center">{vType?.title ?? "-"}</TableCell>
                <TableCell align="center">
                  {shippingCompany.name ?? "-"}
                </TableCell>
                <TableCell align="center">
                  {numberWithCommas(row.switch_percent) + " درصد" || "-"}
                </TableCell>
                <TableCell align="center">
                  {numberWithCommas(row.shipping_company_percent) + " درصد" ||
                    "-"}
                </TableCell>
                <TableCell align="center">
                  {numberWithCommas(row.fleet_percent) + " درصد" || "-"}
                </TableCell>
                <TableCell align="center">
                  {numberWithCommas(row.municipal_percent) + " درصد" || "-"}
                </TableCell>
                <TableCell align="center">
                  {numberWithCommas(row.agent_percent) + " درصد" || "-"}
                </TableCell>
                <TableCell>
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        link: `/contract/${row.id}`,
                        name: "beneficiary.update",
                      },
                      {
                        tooltip: "حذف کردن",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => showModalToRemove(row),
                        name: "beneficiary.destroy",
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <ActionConfirm
        message="ایا مطمئن هستید؟"
        open={acceptRemoveModal}
        onClose={() => setAcceptRemoveModal(false)}
        onAccept={handleRemoveBeneficiary}
      />
    </>
  );
};

const SearchBoxBeneficiary = () => {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const [openCollapse, setOpenCollapse] = useState(false);

  const {
    control,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
  } = useForm({
    defaultValues: searchParamsFilter,
  });

  const Inputs = [
    {
      type: "text",
      name: "q",
      label: "جستجو",
      placeholder: "جستجو",
      control: control,
    },
    {
      type: "select",
      name: "transportation_type",
      label: "نوع بارگیر",
      options: renderSelectOptions({ all: "همه" }),
      valueKey: "id",
      labelKey: "title",
      control: control,
      defaultValue: "all",
    },
  ];
  // handle on submit new vehicle
  const onSubmit = (data) => {
    setSearchParamsFilter((prev) =>
      removeInvalidValues({
        ...prev,
        ...data,
      })
    );
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <CollapseForm onToggle={setOpenCollapse} open={openCollapse}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 4 }} />
            <Stack
              mt={4}
              justifyContent="flex-end"
              spacing={2}
              direction="row"
              fontSize={14}
            >
              <Button
                variant="contained"
                // loading={isSubmitting}
                type="submit"
              >
                اعمال فیلتر
              </Button>
            </Stack>
          </FormContainer>
        </Box>
      </form>
    </CollapseForm>
  );
};

const AddNewBeneficiary = ({ vehicleTypes, shippingCompanies }) => {
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

  const AddBeneficiaryMutation = useMutation(
    (data) => axiosApi({ url: "/beneficiary", method: "post", data: data }),
    {
      onSuccess: () => {
        reset();
        queryClient.invalidateQueries(["beneficiary"]);
        toast.success("درخواست شما با اضافه شد");
      },
      onError: () => {
        toast.error("خطا  ");
      },
    }
  );

  const Inputs = [
    {
      type: "number",
      name: "switch_percent",
      label: "درصد سهم نرم‌افزار",
      control: control,
      rules: { required: "درصد سهم نرم‌افزار را وارد کنید" },
      gridProps: { md: 3 },
    },
    {
      type: "number",
      name: "shipping_company_percent",
      label: "درصد سهم شرکت حمل و نقل",
      control: control,
      rules: { required: "درصد سهم شرکت حمل و نقل را وارد کنید" },
      gridProps: { md: 3 },
    },
    {
      type: "number",
      name: "fleet_percent",
      label: "درصد سهم ناوگان",
      control: control,
      rules: { required: "درصد سهم ناوگان را وارد کنید" },
      gridProps: { md: 3 },
    },
    {
      type: "number",
      name: "municipal_percent",
      label: "درصد سهم وزارت",
      control: control,
      rules: { required: "درصد سهم وزارت را وارد کنید" },
      gridProps: { md: 3 },
    },
    {
      type: "number",
      name: "agent_percent",
      label: "درصد سهم نمایندگی",
      control: control,
      rules: { required: "درصد سهم نمایندگی را وارد کنید" },
      gridProps: { md: 3 },
    },
    {
      type: "select",
      name: "shipping_company_id",
      valueKey: "id",
      labelKey: "title",
      label: "شرکت حمل و نقل",
      options: renderSelectOptions1(shippingCompanies, "name"),
      control: control,
      rules: { required: "شرکت حمل و نقل را وارد کنید" },
      gridProps: { md: 3 },
    },
    {
      type: "select",
      name: "vehicle_type_id",
      valueKey: "id",
      labelKey: "title",
      label: "نوع بارگیر",
      options: renderSelectOptions1(vehicleTypes),
      control: control,
      rules: { required: "نوع بارگیر را وارد کنید" },
      gridProps: { md: 3 },
    },
  ];
  // handle on submit new Beneficiary
  const onSubmit = (data) => {
    data = JSON.stringify(data);
    AddBeneficiaryMutation.mutate(data);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };
  return (
    <CollapseForm
      onToggle={setOpenCollapse}
      title="افزودن ذینفعان"
      open={openCollapse}
      name="beneficiary.store"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 2.5 }}>
              <Grid item xs={12} md={2}>
                <LoadingButton
                  sx={{
                    width: "100%",
                    height: "56px",
                  }}
                  variant="contained"
                  loading={isSubmitting}
                  type="submit"
                >
                  افزودن
                </LoadingButton>
              </Grid>
            </FormInputs>
          </FormContainer>
        </Box>
      </form>
    </CollapseForm>
  );
};

export default BeneficiaryList;
