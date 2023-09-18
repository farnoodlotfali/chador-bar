import { useState } from "react";

import {
  Button,
  Card,
  Collapse,
  Stack,
  Typography,
  Grid,
  Box,
  TableBody,
  TableRow,
  TableCell,
  Switch,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";

import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import ActionConfirm from "Components/ActionConfirm";
import SearchInput from "Components/SearchInput";
import { FormContainer, FormInputs } from "Components/Form";
import LoadingSpinner from "Components/versions/LoadingSpinner";

import { enToFaNumber, removeInvalidValues } from "Utility/utils";
import { Helmet } from "react-helmet-async";
import { useVehicleCategory } from "hook/useVehicleCategory";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useForm } from "react-hook-form";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import CollapseForm from "Components/CollapseForm";

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
    id: "status",
    label: "وضعیت",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

export default function VehicleCategory() {
  const queryClient = useQueryClient();

  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();

  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const {
    data: vehicleCategory,
    isLoading,
    isFetching,
    isError,
  } = useVehicleCategory(searchParamsFilter);

  const deleteCategoryMutation = useMutation(
    (id) => axiosApi({ url: `/vehicle-category/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["vehicleCategory"]);
        toast.success("با موفقیت حذف شد");
      },
    }
  );
  const updateVehicleMutation = useMutation(
    (form) =>
      axiosApi({
        url: `/vehicle-category/${form.id}`,
        method: "put",
        data: form.data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["vehicleCategory"]);
        toast.success("با موفقیت آپدیت شد");
      },
    }
  );

  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <div className="">isError</div>;
  }

  const handleDeleteCategory = (id) => {
    setShowConfirmModal(true);
    setDeleteCategoryId(id);
  };

  // handle delete Category
  const deleteCategory = () => {
    deleteCategoryMutation.mutate(deleteCategoryId);
    setShowConfirmModal(false);
    setDeleteCategoryId(null);
  };

  // handle update Category
  const changeCategoryStatus = (vehicle) => {
    let data = JSON.stringify({
      title: vehicle.title,
      code: vehicle.code,
      status: vehicle.status === 1 ? 0 : 1,
    });
    let form = {
      id: vehicle.id,
      data: data,
    };
    updateVehicleMutation.mutate(form);
  };

  return (
    <>
      <Helmet title="پنل دراپ - نوع کامیون " />

      <AddNewVehicleCategory />
      <SearchBoxVehicleCategory />

      <Table
        {...vehicleCategory}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
      >
        <TableBody>
          {vehicleCategory.data.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.title}
                </TableCell>
                <TableCell align="center" scope="row">
                  <Switch
                    checked={Boolean(row.status)}
                    onChange={() => {
                      changeCategoryStatus(row);
                    }}
                  />
                </TableCell>
                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "حذف",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => handleDeleteCategory(row.id),
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
        onAccept={deleteCategory}
        message="آیا از حذف نوع کامیون مطمئن هستید؟"
      />
    </>
  );
}

const SearchBoxVehicleCategory = () => {
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

const AddNewVehicleCategory = () => {
  const queryClient = useQueryClient();
  const [openCollapse, setOpenCollapse] = useState(false);
  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm();

  const AddCategoryMutation = useMutation(
    (data) =>
      axiosApi({ url: "/vehicle-category", method: "post", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["vehicleCategory"]);
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
  // handle on submit new Category
  const onSubmit = (data) => {
    data = JSON.stringify({
      title: data.title,
      code: data.code,
      status: 1,
    });
    AddCategoryMutation.mutate(data);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };
  return (
    <CollapseForm
      onToggle={setOpenCollapse}
      open={openCollapse}
      title="افزودن نوع کامیون"
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
