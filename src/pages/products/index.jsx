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
import ActionConfirm from "Components/ActionConfirm";
import { FormContainer, FormInputs } from "Components/Form";

import {
  enToFaNumber,
  removeInvalidValues,
  renderSelectOptions1,
} from "Utility/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useForm } from "react-hook-form";
import { useProduct } from "hook/useProduct";
import { useProductGroup } from "hook/useProductGroup";
import { useProductUnit } from "hook/useProductUnit";
import Modal from "Components/versions/Modal";
import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { ChooseProductPacking } from "Components/choosers/ChooseProductPacking";

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
    id: "product_group",
    label: "گروه",
  },
  {
    id: "unit",
    label: "واحد",
  },
  {
    id: "packing",
    label: "نوع بسته‌بندی",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

export default function ProductList() {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const {
    data: products,
    isLoading,
    isFetching,
    isError,
  } = useProduct(searchParamsFilter);

  if (isError) {
    return <div className="">isError</div>;
  }

  const handleEditProduct = (value) => {
    setSelectedProduct(value);
    setShowEditProductModal(true);
  };

  return (
    <>
      <HelmetTitlePage title="محصولات" />
      <AddNewProduct />
      <SearchBoxProduct />
      <Table
        {...products?.items}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={isLoading || isFetching}
      >
        <TableBody>
          {products?.items?.data?.map((row) => {
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
                <TableCell align="center" scope="row">
                  {row.group?.title ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.unit?.title ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.packing?.title ?? "-"}
                </TableCell>
                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        onClick: () => handleEditProduct(row),
                        name: "product.update",
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <EditModal
        show={showEditProductModal}
        product={selectedProduct}
        onClose={() => setShowEditProductModal((prev) => !prev)}
      />
    </>
  );
}

const SearchBoxProduct = () => {
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

const AddNewProduct = () => {
  const [openCollapse, setOpenCollapse] = useState(false);
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();

  const AddProductMutation = useMutation(
    (data) => axiosApi({ url: "/product", method: "post", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["product"]);
        toast.success("با موفقیت اضافه شد");
        reset();
      },
    }
  );

  const { data: productsGroup } = useProductGroup(
    {},
    {
      enabled: openCollapse,
    }
  );
  const { data: productsUnit } = useProductUnit(
    {},
    {
      enabled: openCollapse,
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
    {
      type: "select",
      name: "product_group_id",
      valueKey: "id",
      labelKey: "title",
      label: "گروه",
      options: renderSelectOptions1(productsGroup),
      control: control,
      rules: { required: "گروه را وارد کنید" },
    },
    {
      type: "select",
      name: "unit_id",
      valueKey: "id",
      labelKey: "title",
      label: " واحد",
      options: renderSelectOptions1(productsUnit),
      control: control,
      rules: { required: "واحد را وارد کنید" },
    },
    {
      type: "custom",
      customView: (
        <ChooseProductPacking
          control={control}
          name={"packing"}
          rules={{
            required: "نوع بسته‌بندی را وارد کنید",
          }}
        />
      ),
    },
  ];

  // handle on submit new Product
  const onSubmit = async (data) => {
    try {
      const res = await AddProductMutation.mutateAsync({
        ...data,
        packing_id: data?.packing?.id,
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
    <CollapseForm
      onToggle={setOpenCollapse}
      open={openCollapse}
      title="افزودن محصول"
      name="product.store"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs}>
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

const EditModal = ({ product, show, onClose }) => {
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
    if (product) {
      reset(product);
    }
  }, [product]);

  const updateProductMutation = useMutation(
    (data) =>
      axiosApi({ url: "/product/" + product.id, method: "put", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["product"]);
        toast.success("با موفقیت آپدیت شد");
        onClose();
      },
    }
  );

  const { data: productsGroup } = useProductGroup(
    {},
    {
      enabled: show,
    }
  );
  const { data: productsUnit } = useProductUnit(
    {},
    {
      enabled: show,
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
      name: "product_group_id",
      valueKey: "id",
      labelKey: "title",
      label: "گروه",
      options: renderSelectOptions1(productsGroup),
      control: control,
      rules: { required: "گروه را وارد کنید" },
    },
    {
      type: "select",
      name: "unit_id",
      valueKey: "id",
      labelKey: "title",
      label: " واحد",
      options: renderSelectOptions1(productsUnit),
      control: control,
      rules: { required: "واحد را وارد کنید" },
    },
    {
      type: "custom",
      customView: (
        <ChooseProductPacking
          control={control}
          name={"packing"}
          rules={{
            required: "نوع بسته‌بندی را وارد کنید",
          }}
        />
      ),
    },
  ];

  // handle on submit
  const onSubmit = async (data) => {
    try {
      const res = await updateProductMutation.mutateAsync({
        ...data,
        packing_id: data?.packing.id,
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
    product && (
      <Modal open={show} onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2 }}>
            <FormContainer
              data={watch()}
              setData={handleChange}
              errors={errors}
            >
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
                    ذخیره
                  </LoadingButton>
                </Grid>
              </FormInputs>
            </FormContainer>
          </Box>
        </form>
      </Modal>
    )
  );
};
