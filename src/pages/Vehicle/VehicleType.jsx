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
  Switch,
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
  renderWeight,
} from "Utility/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useForm } from "react-hook-form";
import { useVehicleType } from "hook/useVehicleType";
import { useVehicleCategory } from "hook/useVehicleCategory";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import Modal from "Components/versions/Modal";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import CollapseForm from "Components/CollapseForm";
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
    id: "code",
    label: "کد",
  },
  {
    id: "max_weight",
    label: "حداکثر وزن",
  },
  {
    id: "category",
    label: "نوع کامیون",
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

export default function VehicleType() {
  const queryClient = useQueryClient();
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();

  const [deleteTypeId, setDeleteTypeId] = useState(null);
  const [editType, setEditType] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const {
    data: vehicleType,
    isLoading,
    isFetching,
    isError,
  } = useVehicleType(searchParamsFilter);
  const { hasPermission } = useHasPermission("vehicle-type.update");

  const { data: vehicleCategory } = useVehicleCategory();

  const deleteTypeMutation = useMutation(
    (id) => axiosApi({ url: `/vehicle-type/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["vehicleType"]);
        toast.success("با موفقیت حذف شد");
      },
    }
  );
  const updateVehicleMutation = useMutation(
    (form) =>
      axiosApi({
        url: `/vehicle-type/${form.id}`,
        method: "put",
        data: form.data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["vehicleType"]);
        toast.success("با موفقیت آپدیت شد");
      },
    }
  );

  if (isError) {
    return <div className="">isError</div>;
  }

  const handleDeleteType = (id) => {
    setShowConfirmModal(true);
    setDeleteTypeId(id);
  };

  // handle delete Type
  const deleteType = () => {
    deleteTypeMutation.mutate(deleteTypeId);
    setShowConfirmModal(false);
    setDeleteTypeId(null);
  };

  // handle update Type
  const changeTypeStatus = (vehicle) => {
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

  const handleEditType = (obj) => {
    setEditType(obj);
    setShowEditModal(true);
  };

  return (
    <>
      <HelmetTitlePage title="نوع بارگیر‌ها" />

      <AddNewVehicleType vehicleCategory={vehicleCategory} />
      <SearchBoxVehicleType />

      <Table
        {...vehicleType}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={
          isLoading ||
          isFetching ||
          deleteTypeMutation.isLoading ||
          updateVehicleMutation.isLoading
        }
      >
        <TableBody>
          {vehicleType?.data?.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.title}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.code}
                </TableCell>
                <TableCell align="center" scope="row">
                  {renderWeight(row.max_weight)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row?.vehicle_category?.title ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  <Switch
                    checked={Boolean(row.status)}
                    onChange={() => {
                      changeTypeStatus(row);
                    }}
                    disabled={!hasPermission}
                  />
                </TableCell>
                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        onClick: () => handleEditType(row),
                        name: "vehicle-type.update",
                      },
                      {
                        tooltip: "حذف",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => handleDeleteType(row.id),
                        name: "vehicle-type.destroy",
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
        onAccept={deleteType}
        message="آیا از حذف نوع بارگیر مطمئن هستید؟"
      />
      <EditTypeModal
        vehicle={editType}
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
}

const SearchBoxVehicleType = () => {
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

const AddNewVehicleType = ({ vehicleCategory }) => {
  const queryClient = useQueryClient();
  const [openCollapse, setOpenCollapse] = useState(false);
  const AddTypeMutation = useMutation(
    (data) => axiosApi({ url: "/vehicle-type", method: "post", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["vehicleType"]);
        toast.success("با موفقیت اضافه شد");
        reset();
      },
    }
  );
  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm();

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
      name: "vehicle_category_id",
      valueKey: "id",
      labelKey: "title",
      label: "نوع کامیون",
      options: renderSelectOptions1(vehicleCategory),
      control: control,
      rules: { required: "نوع کامیون را وارد کنید" },
    },
    {
      type: "number",
      name: "max_weight",
      label: "حداکثر وزن",
      splitter: true,
      control: control,
      rules: { required: "حداکثر وزن را وارد کنید" },
    },
  ];
  // handle on submit new Type
  const onSubmit = (data) => {
    data = JSON.stringify({
      title: data.title,
      code: data.code,
      vehicle_category_id: data.vehicle_category_id,
      status: 1,
      max_weight: data.max_weight,
    });
    console.log("data = ", data);
    AddTypeMutation.mutate(data);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };
  return (
    <CollapseForm
      onToggle={setOpenCollapse}
      open={openCollapse}
      title="افزودن نوع بارگیر"
      name="vehicle-type.store"
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

const EditTypeModal = ({ vehicle, show, onClose }) => {
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm();

  const {
    data: vehicleCategory,
    isLoading,
    isFetching,
    isError,
  } = useVehicleCategory();

  useEffect(() => {
    reset(vehicle);
  }, [vehicle]);

  const updateVehicleMutation = useMutation(
    (form) =>
      axiosApi({
        url: `/vehicle-type/${form.id}`,
        method: "put",
        data: form.data,
      }),
    {
      onSuccess: () => {
        toast.success("با موفقیت آپدیت شد");
        onClose();
        reset();
        queryClient.invalidateQueries(["vehicleType"]);
      },
    }
  );

  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <div className="">isError</div>;
  }

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
      name: "vehicle_category_id",
      valueKey: "id",
      labelKey: "title",
      label: "نوع کامیون",
      options: renderSelectOptions1(vehicleCategory),
      control: control,
      rules: { required: "نوع کامیون را وارد کنید" },
    },
    {
      type: "number",
      name: "max_weight",
      label: "حداکثر وزن",
      splitter: true,
      control: control,
      rules: { required: "حداکثر وزن را وارد کنید" },
    },
  ];

  // handle on submit new Type
  const onSubmit = async (data) => {
    data = JSON.stringify({
      title: data.title,
      code: data.code,
      vehicle_category_id: data.vehicle_category_id,
      status: data.status,
      max_weight: data.max_weight,
    });
    let form = {
      id: vehicle.id,
      data: data,
    };
    try {
      const res = await updateVehicleMutation.mutateAsync(form);
      return res;
    } catch (error) {
      throw error;
    }
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <Modal open={show} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 4 }} />

            <Stack mt={5} alignItems="flex-end">
              <LoadingButton
                variant="contained"
                loading={isSubmitting}
                // loading={updateVehicleMutation.isLoading}
                type="submit"
                color={Object.keys(errors).length !== 0 ? "error" : "primary"}
              >
                ذخیره
              </LoadingButton>
            </Stack>
          </FormContainer>
        </Box>
      </form>
    </Modal>
  );
};
