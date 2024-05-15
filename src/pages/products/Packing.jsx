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

import { enToFaNumber, removeInvalidValues } from "Utility/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useForm } from "react-hook-form";
import { useProductPacking } from "hook/useProductPacking";
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
    id: "code",
    label: "کد",
  },
  {
    id: "title",
    label: "عنوان",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

export default function ProductPacking() {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const [selectedPacking, setSelectedPacking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const {
    data: productPacking,
    isLoading,
    isFetching,
    isError,
  } = useProductPacking(searchParamsFilter);

  if (isError) {
    return <div className="">isError</div>;
  }

  const handleUpdatePacking = (item) => {
    setSelectedPacking(item);
    toggleModal();
  };

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  return (
    <>
      <HelmetTitlePage title="نوع بسته‌بندی محصولات" />

      <AddNewPackingProduct />

      <SearchBoxPackingProduct />

      <Table
        {...productPacking?.items}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={isLoading || isFetching}
      >
        <TableBody>
          {productPacking?.items?.data?.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.code)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.title}
                </TableCell>
                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        onClick: () => handleUpdatePacking(row),
                        name: "product-packing.update",
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <EditPackingProduct
        onClose={toggleModal}
        open={showModal}
        packingProduct={selectedPacking}
      />
    </>
  );
}

const SearchBoxPackingProduct = () => {
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

const AddNewPackingProduct = () => {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();
  const [openCollapse, setOpenCollapse] = useState(false);

  const AddPackingMutation = useMutation(
    (data) => axiosApi({ url: "/packing", method: "post", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["productPacking"]);
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
      type: "text",
      name: "code",
      label: "کد",
      control: control,
      rules: { required: "کد را وارد کنید" },
    },
  ];

  // handle on submit new Packing
  const onSubmit = (data) => {
    data = JSON.stringify({
      title: data.title,
      code: data.code,
      max_weight: data.max_weight,
      status: 1,
    });
    AddPackingMutation.mutate(data);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };
  return (
    <CollapseForm
      onToggle={setOpenCollapse}
      open={openCollapse}
      title="افزودن نوع بسته‌بندی"
      name="product-packing.store"
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

const EditPackingProduct = ({ open, onClose, packingProduct }) => {
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
    reset(packingProduct);
  }, [packingProduct]);

  const updatePackingMutation = useMutation(
    (formData) =>
      axiosApi({
        url: `/packing/${formData.id}`,
        method: "put",
        data: formData.data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["productPacking"]);
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
      type: "text",
      name: "code",
      label: "کد",
      control: control,
      rules: { required: "کد را وارد کنید" },
    },
  ];

  // handle on submit
  const onSubmit = async (data) => {
    try {
      const res = await updatePackingMutation.mutateAsync({
        id: packingProduct.id,
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
        <FormTypography>ویرایش بسته‌بندی</FormTypography>
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
