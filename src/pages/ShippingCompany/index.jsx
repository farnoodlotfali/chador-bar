import { useState } from "react";

import {
  Button,
  Stack,
  Grid,
  Box,
  TableBody,
  TableRow,
  TableCell,
  Switch,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";
import LoadingSpinner from "Components/versions/LoadingSpinner";

import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import ActionConfirm from "Components/ActionConfirm";
import { FormContainer, FormInputs } from "Components/Form";

import {
  enToFaNumber,
  removeInvalidValues,
  renderSelectOptions,
} from "Utility/utils";
import { Helmet } from "react-helmet-async";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useForm } from "react-hook-form";
import { useShippingCompany } from "hook/useShippingCompany";
import { ChoosePerson } from "Components/choosers/ChoosePerson";
import { useCompanyTypes } from "hook/useCompanyTypes";
import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";

const HeadCells = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "code",
    label: "کد",
  },
  {
    id: "name",
    label: "نام",
  },
  {
    id: "mobile",
    label: "موبایل رابط",
  },
  {
    id: "status",
    label: "وضعیت",
  },
  {
    id: "company_id",
    label: "شناسه شرکت",
  },

  {
    id: "actions",
    label: "عملیات",
  },
];

const ShippingCompanyList = () => {
  const queryClient = useQueryClient();
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const [deleteShippingCompanyId, setDeleteShippingCompanyId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const {
    data: shippingCompany,
    isLoading,
    isFetching,
    isError,
  } = useShippingCompany(searchParamsFilter);
  const {
    data: companyTypes,
    isLoading: isLoadingCT,
    isFetching: isFetchingCT,
    isError: isErrorCT,
  } = useCompanyTypes();

  const updateShippingCompanyMutation = useMutation(
    (form) =>
      axiosApi({
        url: `/shipping-company/${form.id}`,
        method: "put",
        data: form.data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["shippingCompany"]);
        toast.success("با موفقیت آپدیت شد");
      },
    }
  );

  const deleteShippingCompanyMutation = useMutation(
    (id) => axiosApi({ url: `shipping-company/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["shippingCompany"]);
        toast.success("با موفقیت حذف شد");
      },
    }
  );

  if (isLoading || isFetching || isFetchingCT || isLoadingCT) {
    return <LoadingSpinner />;
  }
  if (isError || isErrorCT) {
    return <div className="">error</div>;
  }

  const handleDeleteShippingCompany = (id) => {
    setShowConfirmModal(true);
    setDeleteShippingCompanyId(id);
  };
  // handle delete ShippingCompany
  const deleteShippingCompany = () => {
    deleteShippingCompanyMutation.mutate(deleteShippingCompanyId);
    setShowConfirmModal(false);
    setDeleteShippingCompanyId(null);
  };

  // handle update ShippingCompany
  const changeShippingCompanyStatus = (item) => {
    let data = JSON.stringify({
      status: item.status === 1 ? 0 : 1,
    });
    let form = {
      id: item.id,
      data: data,
    };
    updateShippingCompanyMutation.mutate(form);
  };

  return (
    <>
      <Helmet title="پنل دراپ -   شرکت حمل" />

      <AddNewShippingSection companyTypes={companyTypes} />

      <SearchBoxShipping />

      <Table
        {...shippingCompany}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
      >
        <TableBody>
          {shippingCompany.data.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.code}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.mobile)}
                </TableCell>
                <TableCell align="center" scope="row">
                  <Switch
                    checked={Boolean(row.status)}
                    onChange={() => {
                      changeShippingCompanyStatus(row);
                    }}
                  />
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.company_id}
                </TableCell>

                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "حذف",
                        color: "error",
                        icon: "trash-xmarks",
                        onClick: () => handleDeleteShippingCompany(row.id),
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
        open={showConfirmModal}
        onClose={() => setShowConfirmModal((prev) => !prev)}
        onAccept={deleteShippingCompany}
        message="آیا از حذف شماتیک  مطمئن هستید؟"
      />
    </>
  );
};

const SearchBoxShipping = () => {
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

const AddNewShippingSection = ({ companyTypes }) => {
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

  const Inputs = [
    {
      type: "text",
      name: "code",
      label: "کد",
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
      rules: { required: "کد اقتصادی را وارد کنید" },
    },
    {
      type: "number",
      name: "mobile",
      label: "شماره تماس رابط",
      noInputArrow: true,
      control: control,
      rules: { required: "موبایل را وارد کنید" },
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
      name: "registration_code",
      label: "کد ثبت",
      control: control,
      noInputArrow: true,
      rules: { required: "کد ثبت را وارد کنید" },
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
        <ChoosePerson
          control={control}
          name={"ceo"}
          rules={{
            required: "مدیرعامل را وارد کنید",
          }}
          label="مدیرعامل"
        />
      ),
      gridProps: { md: 4 },
    },
  ];

  // handle on submit new ShippingCompany
  const onSubmit = async (data) => {
    data = JSON.stringify({
      code: data.code,
      name: data.name,
      ceo_id: data.ceo.id,
      mobile: data.mobile,
      email: data.email,
      economic_code: data.economic_code,
      registration_date: data.registration_date.registration_date,
      registration_code: data.registration_code,
      type: data.type,
      status: 1,
    });
    try {
      const res = await AddShippingCompanyMutation.mutateAsync(data);
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
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 3 }}>
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

export default ShippingCompanyList;
