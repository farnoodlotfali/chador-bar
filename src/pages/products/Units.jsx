/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import {
  Button,
  Stack,
  Grid,
  Box,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";

import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";

import { FormContainer, FormInputs } from "Components/Form";

import {
  enToFaNumber,
  removeInvalidValues,
  renderSelectOptions,
} from "Utility/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useForm } from "react-hook-form";
import { useProductUnit } from "hook/useProductUnit";
import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import HelmetTitlePage from "Components/HelmetTitlePage";
import Modal from "Components/versions/Modal";
import FormTypography from "Components/FormTypography";

const HeadCells = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "title",
    label: "عنوان",
  },
  {
    id: "type",
    label: "نوع",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

export default function ProductUnits() {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const [showModal, setShowModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const {
    data: productUnit,
    isLoading,
    isFetching,
    isError,
  } = useProductUnit(searchParamsFilter);

  if (isError) {
    return <div className="">isError</div>;
  }

  const handleUpdateUnit = (item) => {
    setSelectedUnit(item);
    toggleModal();
  };
  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };
  return (
    <>
      <HelmetTitlePage title="واحد محصولات" />

      <AddNewUnitProduct />

      <SearchBoxUnitProduct />

      <Table
        {...productUnit}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={isLoading || isFetching}
      >
        <TableBody>
          {productUnit?.data.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.title}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.type}
                </TableCell>
                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        onClick: () => handleUpdateUnit(row),
                        name: "product-unit.update",
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <EditUnitProduct
        onClose={toggleModal}
        open={showModal}
        unitProduct={selectedUnit}
      />
    </>
  );
}

const SearchBoxUnitProduct = () => {
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

const AddNewUnitProduct = () => {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      type: "عددی",
    },
  });
  const [openCollapse, setOpenCollapse] = useState(false);

  const AddUnitMutation = useMutation(
    (data) => axiosApi({ url: "/product-unit", method: "post", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["productUnit"]);
        toast.success("با موفقیت اضافه شد");
        reset();
      },
    }
  );

  const Inputs = [
    {
      type: "text",
      name: "title",
      label: "عنوان",
      control: control,
      rules: { required: "عنوان را وارد کنید" },
    },
    {
      type: "select",
      name: "type",
      label: "نوع",
      options: renderSelectOptions({
        عددی: "عددی",
        وزنی: "وزنی",
        طولی: "طولی",
        حجمی: "حجمی",
      }),
      valueKey: "id",
      labelKey: "title",
      control: control,
    },
  ];
  // handle on submit new Unit
  const onSubmit = async (data) => {
    data = JSON.stringify({
      title: data.title,
      type: data.type,
      status: 1,
    });
    try {
      const res = await AddUnitMutation.mutateAsync(data);

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
      title="افزودن واحد محصول"
      name="product-unit.store"
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

const EditUnitProduct = ({ open, onClose, unitProduct }) => {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();

  useEffect(() => {
    reset(unitProduct);
  }, [unitProduct]);

  const updateUnitMutation = useMutation(
    (formaData) =>
      axiosApi({
        url: `/product-unit/${formaData.id}`,
        method: "put",
        data: formaData.data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["productUnit"]);
        toast.success("با موفقیت ویرایش شد");
        onClose();
      },
    }
  );

  const Inputs = [
    {
      type: "text",
      name: "title",
      label: "عنوان",
      control: control,
      rules: { required: "عنوان را وارد کنید" },
    },
    {
      type: "select",
      name: "type",
      label: "نوع",
      options: renderSelectOptions({
        عددی: "عددی",
        وزنی: "وزنی",
        طولی: "طولی",
        حجمی: "حجمی",
      }),
      valueKey: "id",
      labelKey: "title",
      control: control,
    },
  ];

  // handle on submit
  const onSubmit = async (data) => {
    try {
      const res = await updateUnitMutation.mutateAsync({
        id: unitProduct.id,
        data: data,
      });
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
    <Modal onClose={onClose} open={open} maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormTypography>ویرایش واحد شمارشی</FormTypography>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <FormInputs inputs={Inputs} gridProps={{ md: 4 }}>
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
                ویرایش
              </LoadingButton>
            </Grid>
          </FormInputs>
        </FormContainer>
      </form>
    </Modal>
  );
};
