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

import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import ActionConfirm from "Components/ActionConfirm";
import { FormContainer, FormInputs } from "Components/Form";

import { enToFaNumber, removeInvalidValues } from "Utility/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useForm } from "react-hook-form";
import { useVehicleBrand } from "hook/useVehicleBrand";
import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { useHasPermission } from "hook/useHasPermission";

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

export default function VehicleBrand() {
  const queryClient = useQueryClient();
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();

  const [deleteBrandId, setDeleteBrandId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const {
    data: vehicleBrand,
    isLoading,
    isFetching,
    isError,
  } = useVehicleBrand(searchParamsFilter);
  const { hasPermission } = useHasPermission("vehicle-brand.update");

  const deleteBrandMutation = useMutation(
    (id) => axiosApi({ url: `/vehicle-brand/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["vehicleBrand"]);
        toast.success("با موفقیت حذف شد");
      },
    }
  );
  const updateVehicleMutation = useMutation(
    (form) =>
      axiosApi({
        url: `/vehicle-brand/${form.id}`,
        method: "put",
        data: form.data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["vehicleBrand"]);
        toast.success("با موفقیت آپدیت شد");
      },
    }
  );

  if (isError) {
    return <div className="">isError</div>;
  }

  const handleDeleteBrand = (id) => {
    setShowConfirmModal(true);
    setDeleteBrandId(id);
  };

  // handle delete Brand
  const deleteBrand = () => {
    deleteBrandMutation.mutate(deleteBrandId);
    setShowConfirmModal(false);
    setDeleteBrandId(null);
  };

  // handle update Brand
  const changeBrandStatus = (vehicle) => {
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
      <HelmetTitlePage title="برند خودرو" />

      <AddNewVehicleBrand />
      <SearchBoxVehicleBrand />

      <Table
        {...vehicleBrand}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={
          isLoading ||
          isFetching ||
          updateVehicleMutation.isLoading ||
          deleteBrandMutation.isLoading
        }
      >
        <TableBody>
          {vehicleBrand?.data?.map((row) => {
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
                      changeBrandStatus(row);
                    }}
                    disabled={!hasPermission}
                  />
                </TableCell>
                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "حذف",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => handleDeleteBrand(row.id),
                        name: "vehicle-brand.destroy",
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
        onAccept={deleteBrand}
        message="آیا از حذف برند مطمئن هستید؟"
      />
    </>
  );
}

const SearchBoxVehicleBrand = () => {
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

const AddNewVehicleBrand = () => {
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

  const AddBrandMutation = useMutation(
    (data) => axiosApi({ url: "/vehicle-brand", method: "post", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["vehicleBrand"]);
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
  // handle on submit new Brand
  const onSubmit = (data) => {
    data = JSON.stringify({
      title: data.title,
      code: data.code,
      max_weight: data.max_weight,
      status: 1,
    });
    AddBrandMutation.mutate(data);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };
  return (
    <CollapseForm
      onToggle={setOpenCollapse}
      open={openCollapse}
      title="افزودن برند "
      name="vehicle-brand.store"
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
