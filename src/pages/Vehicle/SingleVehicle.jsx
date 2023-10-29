import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Stack,
  Typography,
  TableCell,
  TableRow,
} from "@mui/material";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { FormContainer, FormInputs } from "Components/Form";
import Modal from "Components/versions/Modal";
import NormalTable from "Components/NormalTable";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { toast } from "react-toastify";
import {
  checkPlaqueValidation,
  enToFaNumber,
  renderChip,
  renderSelectOptions,
  vehiclePhotoType,
} from "Utility/utils";
import { ChooseVColor } from "Components/choosers/vehicle/color/ChooseVColor";
import FormTypography from "Components/FormTypography";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { ChooseVModel } from "Components/choosers/vehicle/model/ChooseVModel";
import { ChooseVType } from "Components/choosers/vehicle/types/ChooseVType";
import { useHasPermission } from "hook/useHasPermission";

// fleet
const headCells1 = [
  {
    id: "id",
    label: "شناسه",
  },
  {
    id: "code",
    label: "کد",
  },
  {
    id: "status",
    label: "وضعیت",
  },
  {
    id: "inquiry",
    label: "استعلام",
  },
];

const SingleVehicle = () => {
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
    setError,
  } = useForm();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { hasPermission } = useHasPermission("vehicle-photos.store");

  const params = useParams();

  const {
    data: vehicle,
    isLoading,
    isFetching,
    isError,
    isSuccess,
  } = useQuery(
    ["vehicle", params.id],
    () =>
      axiosApi({ url: `/vehicle/${params.id}` }).then((res) => res.data.Data),
    {
      enabled: !!params.id,
      staleTime: 30 * 1000,
    }
  );

  const updateVehicleMutation = useMutation(
    (data) =>
      axiosApi({ url: `/vehicle/${params.id}`, method: "put", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["vehicle"]);
        toast.success("با موفقیت آپدیت شد");
      },
    }
  );

  const deleteVehiclePhotoMutation = useMutation(
    (id) => axiosApi({ url: `/photos/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        Promise.all([
          queryClient.invalidateQueries(["vehicle"]),
          queryClient.invalidateQueries(["vehiclePhoto"]),
        ]);
        toast.success("با موفقیت حذف شد");
      },
    }
  );

  // fill all inputs, if data is reached
  useEffect(() => {
    // setIsDataLoaded(true);
    if (isSuccess) {
      setIsDataLoaded(false);
      reset(vehicle);

      setTimeout(() => {
        setIsDataLoaded(true);
      }, 20);
    }
  }, [isSuccess]);

  const addPhotoBtn = useMemo(() => {
    if (!hasPermission) {
      return;
    }

    return (
      <Button
        onClick={() => setShowModal(true)}
        variant="contained"
        type="button"
        color={"primary"}
      >
        افزودن عکس جدید
      </Button>
    );
  }, [hasPermission]);

  if (
    !isDataLoaded ||
    isLoading ||
    isFetching ||
    updateVehicleMutation.isLoading
  ) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <div className="">isError</div>;
  }
  const DataInputs = [
    {
      type: "text",
      name: "id",
      label: "شناسه",
      control: control,
      readOnly: true,
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
        required: "سال را وارد کنید",
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
      gridProps: { md: 4 },
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
      gridProps: { md: 4 },
    },
    {
      type: "plaque",
      name: "plaque",
      label: "",
      gridProps: { md: 4 },
      control: control,
      rules: {
        required: "پلاک را وارد کنید",
      },
    },
    {
      type: "select",
      name: "status",
      valueKey: "id",
      labelKey: "title",
      label: " وضعیت",
      options: [
        { id: 1, title: "فعال" },
        { id: 0, title: "غیرفعال" },
      ],
      control: control,
      rules: {
        required: " وضعیت را وارد کنید",
      },
      gridProps: { md: 2 },
    },
    {
      type: "select",
      name: "inquiry",
      valueKey: "id",
      labelKey: "title",
      label: " استعلام",
      options: [
        { id: 1, title: "فعال" },
        { id: 0, title: "غیرفعال" },
      ],
      control: control,
      rules: {
        required: "استعلام را وارد کنید",
      },
      gridProps: { md: 2 },
    },
  ];

  // handle on submit
  const onSubmit = (data) => {
    if (!checkPlaqueValidation(data.plaque)) {
      setError("plaque", { type: "custom", message: "پلاک را وارد کنید" });
      return;
    }
    data = JSON.stringify({
      plaque: data.plaque,
      color: data.color,
      vin: data.vin,
      year: Number(data.year),
      vehicle_model_id: data.vehicle_model_id,
      inquiry: Number(data.inquiry),
      status: Number(data.status),
    });

    updateVehicleMutation.mutate(data);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  // handle delete photo of vehicle
  const deletePhoto = (id) => {
    deleteVehiclePhotoMutation.mutate(id);
  };

  return (
    <>
      <HelmetTitlePage title="ویرایش/مشاهده خودرو" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <Card sx={{ p: 2, boxShadow: 1 }}>
            <FormTypography>اطلاعات کلی</FormTypography>
            <FormInputs gridProps={{ md: 3 }} inputs={DataInputs} />
            <Stack mt={5} alignItems="flex-end">
              <LoadingButton
                variant="contained"
                loading={isSubmitting}
                type="submit"
                color={Object.keys(errors).length !== 0 ? "error" : "primary"}
              >
                ذخیره تغییرات
              </LoadingButton>
            </Stack>

            <Divider sx={{ my: 5 }} />
            <Typography variant="h5" mt={5} mb={3}>
              ناوگان
            </Typography>

            <NormalTable headCells={headCells1}>
              {vehicle.fleet && (
                <TableRow hover tabIndex={-1}>
                  <TableCell scope="row" align="center">
                    {enToFaNumber(vehicle.fleet.id)}
                  </TableCell>
                  <TableCell scope="row" align="center">
                    {enToFaNumber(vehicle.fleet.code)}
                  </TableCell>
                  <TableCell scope="row" align="center">
                    {renderChip(vehicle.fleet.status)}
                  </TableCell>
                  <TableCell scope="row" align="center">
                    {renderChip(vehicle.fleet.inquiry)}
                  </TableCell>
                </TableRow>
              )}
            </NormalTable>

            <Divider sx={{ my: 5 }} />
            <FormTypography>عکس ها</FormTypography>
            <Grid container spacing={3}>
              {vehicle.photos.map((photo) => {
                return (
                  <Grid key={photo.id} item sx={12} md={4}>
                    <Card>
                      <CardMedia
                        sx={{ height: 250 }}
                        image={photo.link}
                        title="img of car"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {vehiclePhotoType[photo.type]}
                        </Typography>
                        <Typography variant="body2">
                          {photo.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          onClick={() => deletePhoto(photo.id)}
                          size="small"
                          variant="outlined"
                          color="error"
                        >
                          حذف
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
            <Stack mt={5} alignItems="flex-end">
              {addPhotoBtn}
            </Stack>
          </Card>
        </FormContainer>
      </form>

      <AddPhotoModal onClose={() => setShowModal(false)} show={showModal} />
    </>
  );
};

// add new photo modal
const AddPhotoModal = ({ show, onClose }) => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm();

  const AddPhotoMutation = useMutation(
    (data) => axiosApi({ url: "/vehicle-photos", method: "post", data: data }),
    {
      onSuccess: () => {
        Promise.all([
          queryClient.invalidateQueries(["vehicle"]),
          queryClient.invalidateQueries(["vehiclePhoto"]),
        ]);
        onClose();
        toast.success("با موفقیت اضافه شد");
      },
    }
  );

  const DataInputs = [
    {
      type: "select",
      name: "type",
      valueKey: "id",
      labelKey: "title",
      label: " زاویه دید",
      options: renderSelectOptions(vehiclePhotoType),
      control: control,
      rules: { required: "زاویه دید را وارد کنید" },
    },
    {
      type: "text",
      name: "link",
      label: "آدرس عکس",
      control: control,
      rules: { required: "آدرس عکس را وارد کنید" },
      gridProps: { md: 9 },
    },
    {
      type: "textarea",
      name: "description",
      label: "توضیحات",
      control: control,
      rules: { required: "توضیحات را وارد کنید" },
      gridProps: { md: 12 },
    },
  ];
  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };
  const onSubmit = (data) => {
    data = JSON.stringify({ ...data, vehicle_id: id });
    AddPhotoMutation.mutate(data);
  };
  return (
    <Modal open={show} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <FormInputs gridProps={{ md: 3 }} inputs={DataInputs} />
          <Stack justifyContent="end" direction="row" spacing={3} mt={3}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              ثبت
            </LoadingButton>
            <Button
              type="button"
              variant="contained"
              color="error"
              onClick={onClose}
            >
              لغو
            </Button>
          </Stack>
        </FormContainer>
      </form>
    </Modal>
  );
};

export default SingleVehicle;
