import { useEffect, useState } from "react";

import {
  Button,
  Stack,
  Typography,
  Box,
  TableBody,
  TableRow,
  TableCell,
  Switch,
  IconButton,
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
  renderChipForInquiry,
  renderDataFormat,
  renderPlaqueObjectToString,
} from "Utility/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useForm } from "react-hook-form";
import { ChooseVModel } from "Components/choosers/vehicle/model/ChooseVModel";
import { ChooseVColor } from "Components/choosers/vehicle/color/ChooseVColor";
import { useVehicle } from "hook/useVehicle";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import CollapseForm from "Components/CollapseForm";
import VehicleTypeDetailModal from "Components/modals/VehicleTypeDetailModal";
import { ChooseVType } from "Components/choosers/vehicle/types/ChooseVType";
import VehicleDetailModal from "Components/modals/VehicleDetailModal";
import { SvgSPrite } from "Components/SvgSPrite";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { useHasPermission } from "hook/useHasPermission";
import Modal from "Components/versions/Modal";

const headCells = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "vin",
    label: "vin ",
  },
  {
    id: "vehicle_model_id",
    label: "مدل خودرو",
  },
  {
    id: "plaque",
    label: "پلاک",
  },
  {
    id: "container_type",
    label: "نوع بارگیر",
  },
  {
    id: "color",
    label: "رنگ",
  },
  {
    id: "year",
    label: "سال ",
  },
  {
    id: "gps_code",
    label: "کد GPS",
  },
  {
    id: "smart_card_no",
    label: "کارت هوشمند",
  },
  {
    id: "status",
    label: "وضعیت",
  },
  {
    id: "inquiry",
    label: "وضعیت کارت هوشمند",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

export default function VehicleList() {
  const queryClient = useQueryClient();
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const {
    data: vehicles,
    isLoading,
    isFetching,
    isError,
  } = useVehicle(searchParamsFilter);
  const { hasPermission } = useHasPermission("vehicle.change-status");

  const updateVehicleMutation = useMutation(
    (form) =>
      axiosApi({ url: `/vehicle/${form.id}`, method: "put", data: form.data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["vehicle"]);
        toast.success("با موفقیت آپدیت شد");
      },
    }
  );

  const deleteVehicleMutation = useMutation(
    (id) => axiosApi({ url: `/vehicle/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["vehicle"]);
        toast.success("با موفقیت حذف شد");
      },
    }
  );

  if (isError) {
    return <div className="">isError</div>;
  }

  const handleDeleteVehicle = (vehicle) => {
    setShowConfirmModal(true);
    setSelectedVehicle(vehicle);
  };
  const deleteVehicle = () => {
    deleteVehicleMutation.mutate(selectedVehicle?.id);
    setShowConfirmModal(false);
  };
  const changeVehicleStatus = (data) => {
    let form = {
      data: JSON.stringify({
        status: Boolean(data.status) === true ? 0 : 1,
      }),
      id: data.id,
    };
    updateVehicleMutation.mutate(form);
  };

  const handleClose = () => {
    setShowModal(null);
  };

  const showVehicleTypeModal = (vehicle) => {
    setShowModal("containerType");
    setSelectedVehicle(vehicle);
  };
  const showVehicleModal = (vehicle) => {
    setShowModal("vehicle");
    setSelectedVehicle(vehicle);
  };

  const handleEditVehicle = (vehicle) => {
    setShowModal("editVehicle");
    setSelectedVehicle(vehicle);
  };

  return (
    <>
      <HelmetTitlePage title="خودروها" />
      <AddNewVehicle />
      <SearchBoxVehicle />
      <Table
        {...vehicles}
        headCells={headCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={
          isLoading ||
          isFetching ||
          deleteVehicleMutation.isLoading ||
          updateVehicleMutation.isLoading
        }
      >
        <TableBody>
          {vehicles?.data.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.vin.toUpperCase())}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.vehicle_model?.title}
                </TableCell>
                <TableCell align="center" scope="row">
                  {renderPlaqueObjectToString(row.plaque)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.container_type ? (
                    <Typography
                      variant="clickable"
                      onClick={() => showVehicleTypeModal(row)}
                    >
                      {enToFaNumber(row.container_type?.title)}
                    </Typography>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.color ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.year)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.gps_code) ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.smart_card_no) ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  <Switch
                    checked={Boolean(row.status)}
                    onChange={() => {
                      changeVehicleStatus(row);
                    }}
                    disabled={!hasPermission}
                  />
                </TableCell>
                <TableCell align="center" scope="row">
                  <Stack direction="row" alignItems="center">
                    {renderChipForInquiry(row.inquiry)}
                    <IconButton>
                      <SvgSPrite
                        icon="rotate-right"
                        MUIColor="primary"
                        size="small"
                      />
                    </IconButton>
                  </Stack>
                </TableCell>
                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "مشاهده جزئیات",
                        color: "secondary",
                        icon: "eye",
                        onClick: () => showVehicleModal(row),
                        name: "vehicle.show",
                      },
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        onClick: () => handleEditVehicle(row),
                        name: "vehicle.update",
                      },
                      {
                        tooltip: "حذف",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => handleDeleteVehicle(row),
                        name: "vehicle.destroy",
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
        onAccept={deleteVehicle}
        message="آیا از حذف خودرو مطمئن هستید؟"
      />
      <VehicleDetailModal
        show={showModal === "vehicle"}
        onClose={handleClose}
        data={selectedVehicle}
      />
      <VehicleTypeDetailModal
        show={showModal === "containerType"}
        onClose={handleClose}
        data={selectedVehicle?.container_type}
      />
      <EditVehicleModal
        open={showModal === "editVehicle"}
        onClose={handleClose}
        data={selectedVehicle}
      />
    </>
  );
}

const SearchBoxVehicle = () => {
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

const AddNewVehicle = () => {
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
  const AddVehicleMutation = useMutation(
    (data) => axiosApi({ url: "/vehicle", method: "post", data: data }),
    {
      onSuccess: () => {
        reset();
        queryClient.invalidateQueries(["vehicle"]);
        toast.success("با موفقیت اضافه شد");
      },
    }
  );

  const Inputs = [
    {
      type: "number",
      name: "year",
      label: "سال تولید",
      control: control,
      noInputArrow: true,
      rules: {
        required: "سال تولید را وارد کنید",
        min: {
          value: 1350,
          message: "سال تولید باید از 1350 بزرگتر باشد",
        },
        minLength: {
          value: 4,
          message: "سال باید 4 رقمی باشد",
        },
        maxLength: {
          value: 4,
          message: "سال باید 4 رقمی باشد",
        },
      },
    },
    {
      type: "text",
      name: "vin",
      label: "vin",
      control: control,
      rules: {
        required: "vin را وارد کنید",
        minLength: {
          value: 17,
          message: "vin  باید 17 حرفی باشد",
        },
        maxLength: {
          value: 17,
          message: "vin  باید 17 حرفی باشد",
        },
        pattern: {
          value: /^[A-Za-z\d]+$/i,
          message: "vin فقط شامل عدد و حروف انگلیسی می‌باشد",
        },
      },
    },
    {
      type: "number",
      name: "gps_code",
      label: "کد GPS",
      control: control,
      noInputArrow: true,
      rules: {
        required: "کد GPS را وارد کنید",
      },
    },
    {
      type: "text",
      name: "smart_card_no",
      label: "شماره کارت هوشمند",
      control: control,
      rules: {
        required: "شماره کارت هوشمند را وارد کنید",
      },
    },
    {
      type: "number",
      name: "insurance_no",
      label: "شماره بیمه شخص ثالث",
      control: control,
      noInputArrow: true,
      rules: {
        required: "شماره بیمه شخص ثالث را وارد کنید",
      },
    },
    {
      type: "date",
      name: "insurance_expire_date",
      label: "تاریخ انقضا بیمه شخص ثالث",
      control: control,
      rules: {
        required: "تاریخ انقضا بیمه شخص ثالث را وارد کنید",
      },
    },
    {
      type: "plaque",
      name: "plaque",
      label: "",
      gridProps: { md: 4 },
      control: control,
      rules: { required: "پلاک را وارد کنید" },
    },

    {
      type: "custom",
      customView: (
        <ChooseVColor
          control={control}
          name={"color"}
          rules={{
            required: "رنگ را وارد کنید",
          }}
          label="رنگ خودرو"
        />
      ),
    },
    {
      type: "custom",
      customView: (
        <ChooseVModel
          control={control}
          name={"vehicle_model"}
          rules={{
            required: "مدل را وارد کنید",
          }}
          label="مدل خودرو"
        />
      ),
    },
    {
      type: "custom",
      customView: (
        <ChooseVType
          control={control}
          name={"container_type"}
          rules={{
            required: "نوع بارگیر را وارد کنید",
          }}
          label="نوع بارگیر"
        />
      ),
    },
  ];

  // handle on submit new vehicle
  const onSubmit = async (data) => {
    data = JSON.stringify({
      ...data,
      plaque: data.plaque,
      vehicle_model_id: data.vehicle_model.id,
      container_type_id: data.container_type.id,
      insurance_expire_date:
        data.insurance_expire_date.insurance_expire_date_fa,
      color: data.color[0],
      vin: data.vin.toUpperCase(),
      year: data.year,
      gps_code: data.gps_code,
      status: 1,
      inquiry: 0,
    });
    try {
      const res = await AddVehicleMutation.mutateAsync(data);
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
      title="افزودن خودرو"
      name="vehicle.store"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 4 }} />

            <Stack direction="row" justifyContent="end" mt={3}>
              <LoadingButton
                sx={{
                  px: 6,
                  py: 1,
                }}
                variant="contained"
                type="submit"
                loading={isSubmitting}
              >
                افزودن
              </LoadingButton>
            </Stack>
          </FormContainer>
        </Box>
      </form>
    </CollapseForm>
  );
};

const EditVehicleModal = ({ onClose, open, data }) => {
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
    reset(data);
    setValue(
      "insurance_expire_date",
      renderDataFormat(
        "insurance_expire_date",
        data?.insurance_expire_date,
        "fa"
      )
    );
  }, [data]);

  const updateVehicleMutation = useMutation(
    (formData) =>
      axiosApi({ url: `/vehicle/${data.id}`, method: "put", data: formData }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["vehicle"]);
        toast.success("با موفقیت اضافه شد");
      },
    }
  );

  const Inputs = [
    {
      type: "number",
      name: "year",
      label: "سال تولید",
      control: control,
      noInputArrow: true,
      rules: {
        required: "سال تولید را وارد کنید",
        min: {
          value: 1350,
          message: "سال تولید باید از 1350 بزرگتر باشد",
        },
        minLength: {
          value: 4,
          message: "سال باید 4 رقمی باشد",
        },
        maxLength: {
          value: 4,
          message: "سال باید 4 رقمی باشد",
        },
      },
    },
    {
      type: "text",
      name: "vin",
      label: "vin",
      control: control,
      rules: {
        required: "vin را وارد کنید",
        minLength: {
          value: 17,
          message: "vin  باید 17 حرفی باشد",
        },
        maxLength: {
          value: 17,
          message: "vin  باید 17 حرفی باشد",
        },
        pattern: {
          value: /^[A-Za-z\d]+$/i,
          message: "vin فقط شامل عدد و حروف انگلیسی می‌باشد",
        },
      },
    },
    {
      type: "number",
      name: "gps_code",
      label: "کد GPS",
      control: control,
      noInputArrow: true,
      rules: {
        required: "کد GPS را وارد کنید",
      },
    },
    {
      type: "text",
      name: "smart_card_no",
      label: "شماره کارت هوشمند",
      control: control,
      rules: {
        required: "شماره کارت هوشمند را وارد کنید",
      },
    },
    {
      type: "number",
      name: "insurance_no",
      label: "شماره بیمه شخص ثالث",
      control: control,
      noInputArrow: true,
      rules: {
        required: "شماره بیمه شخص ثالث را وارد کنید",
      },
    },
    {
      type: "date",
      name: "insurance_expire_date",
      label: "تاریخ انقضا بیمه شخص ثالث",
      control: control,
      rules: {
        required: "تاریخ انقضا بیمه شخص ثالث را وارد کنید",
      },
    },
    {
      type: "plaque",
      name: "plaque",
      label: "",
      gridProps: { md: 4 },
      control: control,
      rules: { required: "پلاک را وارد کنید" },
    },

    {
      type: "custom",
      customView: (
        <ChooseVColor
          control={control}
          name={"color"}
          rules={{
            required: "رنگ را وارد کنید",
          }}
          label="رنگ خودرو"
        />
      ),
    },
    {
      type: "custom",
      customView: (
        <ChooseVModel
          control={control}
          name={"vehicle_model"}
          rules={{
            required: "مدل را وارد کنید",
          }}
          label="مدل خودرو"
        />
      ),
    },
    {
      type: "custom",
      customView: (
        <ChooseVType
          control={control}
          name={"container_type"}
          rules={{
            required: "نوع بارگیر را وارد کنید",
          }}
          label="نوع بارگیر"
        />
      ),
    },
  ];

  // handle on submit  vehicle
  const onSubmit = async (data) => {
    data = JSON.stringify({
      ...data,
      plaque: data.plaque,
      vehicle_model_id: data.vehicle_model.id,
      container_type_id: data.container_type.id,
      insurance_expire_date:
        data.insurance_expire_date.insurance_expire_date_fa,
      color: data.color[0],
      vin: data.vin.toUpperCase(),
      year: data.year,
      gps_code: data.gps_code,
      status: 1,
      inquiry: 0,
    });
    try {
      const res = await updateVehicleMutation.mutateAsync(data);
      return res;
    } catch (error) {
      return;
    }
  };
  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 4 }} />

            <Stack direction="row" justifyContent="end" mt={3}>
              <LoadingButton
                sx={{
                  px: 6,
                  py: 1,
                }}
                variant="contained"
                type="submit"
                loading={isSubmitting}
              >
                ویرایش
              </LoadingButton>
            </Stack>
          </FormContainer>
        </Box>
      </form>
    </Modal>
  );
};
