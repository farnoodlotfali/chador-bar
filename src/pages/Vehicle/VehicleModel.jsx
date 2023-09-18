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

import { enToFaNumber, removeInvalidValues, renderWeight } from "Utility/utils";
import { Helmet } from "react-helmet-async";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useForm } from "react-hook-form";
import { useVehicleModel } from "hook/useVehicleModel";
import { ChooseVBrand } from "Components/choosers/vehicle/brand/ChooseVBrand";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";

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
    id: "max_weight",
    label: "حداکثر وزن",
  },
  {
    id: "min_weight",
    label: "حداقل وزن",
  },
  {
    id: "vehicle_brand_id",
    label: "برند",
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

export default function VehicleModel() {
  const queryClient = useQueryClient();

  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();

  const [deleteModelId, setDeleteModelId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const {
    data: vehicleModel,
    isLoading,
    isFetching,
    isError,
  } = useVehicleModel(searchParamsFilter);

  const deleteModelMutation = useMutation(
    (id) => axiosApi({ url: `/vehicle-model/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["vehicleModel"]);
        toast.success("با موفقیت حذف شد");
      },
    }
  );
  const updateVehicleMutation = useMutation(
    (form) =>
      axiosApi({
        url: `/vehicle-model/${form.id}`,
        method: "put",
        data: form.data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["vehicleModel"]);
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

  const handleDeleteModel = (id) => {
    setShowConfirmModal(true);
    setDeleteModelId(id);
  };

  // handle delete Model
  const deleteModel = () => {
    deleteModelMutation.mutate(deleteModelId);
    setShowConfirmModal(false);
    setDeleteModelId(null);
  };

  // handle update Model
  const changeModelStatus = (vehicle) => {
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
      <Helmet title="پنل دراپ -  مدل خودروها" />

      <AddNewVehicleModel />
      <SearchBoxVehicleModel />

      <Table
        {...vehicleModel}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
      >
        <TableBody>
          {vehicleModel.data.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.title}
                </TableCell>
                <TableCell align="center" scope="row">
                  {renderWeight(row.max_weight)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {renderWeight(row.min_weight)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.vehicle_brand?.title ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  <Switch
                    checked={Boolean(row.status)}
                    onChange={() => {
                      changeModelStatus(row);
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
                        onClick: () => handleDeleteModel(row.id),
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
        onAccept={deleteModel}
        message="آیا از حذف نوع کامیون مطمئن هستید؟"
      />
    </>
  );
}

const SearchBoxVehicleModel = () => {
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

const AddNewVehicleModel = () => {
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

  useEffect(() => {
    if (watch("vehicle_type")) {
      handleChange("max_weight", watch("vehicle_type")?.max_weight);
    }
  }, [watch("vehicle_type")]);

  const AddModelMutation = useMutation(
    (data) => axiosApi({ url: "/vehicle-model", method: "post", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["vehicleModel"]);
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
      type: "custom",
      customView: (
        <ChooseVBrand
          control={control}
          name={"vehicle_brand"}
          rules={{
            required: "برند را وارد کنید",
          }}
          label="برند خودرو"
        />
      ),
    },
    {
      type: "text",
      name: "code",
      label: "کد",
      control: control,
      rules: { required: "کد را وارد کنید" },
    },
    {
      type: "number",
      name: "max_weight",
      splitter: true,
      label: "حداکثر وزن(کیلوگرم)",
      control: control,
      rules: { required: "حداکثر وزن را وارد کنید" },
    },
    {
      type: "number",
      name: "min_weight",
      label: "حداقل وزن(کیلوگرم)",
      splitter: true,
      control: control,
      rules: { required: "حداقل وزن را وارد کنید" },
    },
  ];
  // handle on submit new Model
  const onSubmit = (data) => {
    data = JSON.stringify({
      title: data.title,
      code: data.code,
      vehicle_brand_id: data.vehicle_brand.id,
      max_weight: data.max_weight,
      status: 1,
    });
    AddModelMutation.mutate(data);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };
  return (
    <CollapseForm
      onToggle={setOpenCollapse}
      open={openCollapse}
      title="افزودن مدل"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
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
