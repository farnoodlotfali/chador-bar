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
  Rating,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";

import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import ActionConfirm from "Components/ActionConfirm";
import { FormContainer, FormInputs } from "Components/Form";

import {
  enToFaNumber,
  removeInvalidValues,
  renderSelectOptions,
} from "Utility/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useForm } from "react-hook-form";
import { useShippingCompany } from "hook/useShippingCompany";
import { ChoosePerson } from "Components/choosers/ChoosePerson";
import { useCompanyTypes } from "hook/useCompanyTypes";
import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import HelmetTitlePage from "Components/HelmetTitlePage";
import ShowPersonScoreModal from "Components/modals/ShowPersonScoreModal";
import ShippingCompanyReportModal from "Components/modals/ShippingCompanyReportModal";

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
    id: "rating",
    label: "امتیاز",
    sortable: true,
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
  const [selectedShippingCompany, setSelectedShippingCompany] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [openModal, setOpenModal] = useState(null);

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

  if (isError || isErrorCT) {
    return <div className="">error</div>;
  }

  const handleDeleteShippingCompany = (val) => {
    setShowConfirmModal(true);
    setSelectedShippingCompany(val);
  };
  // handle delete ShippingCompany
  const deleteShippingCompany = () => {
    deleteShippingCompanyMutation.mutate(selectedShippingCompany?.id);
    setShowConfirmModal(false);
    setSelectedShippingCompany(null);
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

  const toggleShowScores = (rowData) => {
    setOpenModal("personScore");
    if (rowData) setSelectedShippingCompany(rowData);
  };
  const handleShowShippingCompanyReportModal = (rowData) => {
    setOpenModal("shippingCompanyReport");
    if (rowData) setSelectedShippingCompany(rowData);
  };

  const toggleOpenModal = () => {
    setOpenModal(null);
  };
  return (
    <>
      <HelmetTitlePage title="شرکت حمل" />

      <AddNewShippingSection companyTypes={companyTypes} />

      <SearchBoxShipping />

      <Table
        {...shippingCompany}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={
          isLoading ||
          isFetching ||
          isFetchingCT ||
          isLoadingCT ||
          deleteShippingCompanyMutation.isLoading ||
          updateShippingCompanyMutation.isLoading
        }
      >
        <TableBody>
          {shippingCompany?.data?.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.code)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="center" scope="row">
                  <Rating
                    precision={0.2}
                    sx={{
                      width: "fit-content",
                    }}
                    value={row?.rating}
                    size="small"
                    readOnly
                  />
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
                        icon: "trash-xmark",
                        onClick: () => handleDeleteShippingCompany(row),
                        name: "shipping-company.destroy",
                      },
                      {
                        tooltip: "تاریخچه امتیازات",
                        color: "secondary",
                        icon: "rectangle-history-circle-user",
                        onClick: () => toggleShowScores(row),
                      },
                      {
                        tooltip: "گزارش",
                        color: "info",
                        icon: "memo-pad",
                        onClick: () =>
                          handleShowShippingCompanyReportModal(row),
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
        message="آیا از حذف شرکت حمل و نقل مطمئن هستید؟"
      />

      <ShippingCompanyReportModal
        open={openModal === "shippingCompanyReport"}
        onClose={toggleOpenModal}
        data={selectedShippingCompany}
      />

      <ShowPersonScoreModal
        show={openModal === "personScore"}
        data={selectedShippingCompany}
        onClose={toggleOpenModal}
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
    reset,
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
  const { resetValues } = useLoadSearchParamsAndReset(Inputs, reset);

  // handle on submit new vehicle
  const onSubmit = (data) => {
    setSearchParamsFilter(
      removeInvalidValues({
        ...searchParamsFilter,
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
                variant="outlined"
                color="error"
                type="submit"
                onClick={() => {
                  reset(resetValues);
                }}
              >
                حذف فیلتر
              </Button>
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
      name="shipping-company.store"
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
