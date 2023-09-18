import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  TableContainer,
  Typography,
  Table as MuiTable,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import ActionConfirm from "Components/ActionConfirm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { FormContainer, FormInputs } from "Components/Form";
import Modal from "Components/versions/Modal";
import NormalTable from "Components/NormalTable";
import TableActionCell from "Components/versions/TableActionCell";
import { useVehicleModel } from "hook/useVehicleModel";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { toast } from "react-toastify";
import {
  checkPlaqueValidation,
  enToFaNumber,
  numberWithCommas,
  renderChip,
  renderSelectOptions,
  renderSelectOptions1,
  vehiclePhotoType,
} from "Utility/utils";
import { ChooseVColor } from "Components/choosers/vehicle/color/ChooseVColor";
import FormTypography from "Components/FormTypography";
// refueling
const headCells = [
  {
    id: "id",
    label: "شناسه",
  },
  {
    id: "amount",
    label: "مقدار",
  },
  {
    id: "kilometer",
    label: "کیلومتر",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

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
// schematic
const headCells2 = [
  {
    id: "id",
    label: "شناسه",
  },
  {
    id: "title",
    label: "عنوان",
  },
  {
    id: "rows",
    label: "سطر",
  },
  {
    id: "columns",
    label: "ستون",
  },
  {
    id: "seat_count",
    label: "تعداد صندلی ",
  },
  {
    id: "valid_seat_count",
    label: "تعداد صندلی مجاز",
  },
  {
    id: "invalid_seat_count",
    label: "تعداد صندلی غیرمجاز",
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
  const [showRefuelingModal, setShowRefuelingModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteRefuelingId, setDeleteRefuelingId] = useState(null);

  const params = useParams();
  const {
    data: vehicleModel,
    isLoading: vModelIsLoading,
    isFetching: vModelIsFetching,
    isError: vModelIsError,
  } = useVehicleModel();
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
  const deleteRefuelingMutation = useMutation(
    (id) => axiosApi({ url: `/refueling/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        Promise.all([
          queryClient.invalidateQueries(["refueling"]),
          queryClient.invalidateQueries(["vehicle"]),
        ]);

        toast.success("با موفقیت حذف شد");
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
      // const allDates = [
      //   "created_at",
      //   "deleted_at",
      //   "end_date",
      //   "updated_at",
      //   "start_date",
      // ];
      // allDates.forEach((i) => {
      //   if (i) {
      //     setValue(
      //       i,
      //       new Date(contract[i]).toLocaleDateString("fa-IR-u-nu-latn")
      //     );
      //     setValue(i + "En", new Date(contract[i]).toLocaleDateString("en-US"));
      //   }
      // });
      setTimeout(() => {
        setIsDataLoaded(true);
      }, 20);
    }
  }, [isSuccess]);

  if (
    !isDataLoaded ||
    isLoading ||
    isFetching ||
    vModelIsLoading ||
    vModelIsFetching ||
    updateVehicleMutation.isLoading ||
    deleteRefuelingMutation.isLoading
  ) {
    return <LoadingSpinner />;
  }
  if (isError || vModelIsError) {
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
      },
    },
    {
      type: "number",
      name: "year",
      label: "سال",
      control: control,
      rules: {
        required: "سال را وارد کنید",
      },
    },
    {
      type: "select",
      name: "vehicle_model_id",
      valueKey: "id",
      labelKey: "title",
      label: "مدل",
      options: renderSelectOptions1(vehicleModel),
      control: control,
      rules: {
        required: "مدل را وارد کنید",
      },
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

  // vehicle_model
  const DataInputs1 = [
    {
      type: "text",
      name: "vehicle_model.title",
      label: "عنوان",
      readOnly: true,
      control: control,
    },

    {
      type: "number",
      name: "vehicle_model.max_weight",
      splitter: true,
      label: "حداکثر وزن",
      readOnly: true,
      control: control,
    },
    {
      type: "select",
      name: "vehicle_model.status",
      valueKey: "id",
      labelKey: "title",
      label: " وضعیت",
      options: [
        { id: 1, title: "فعال" },
        { id: 0, title: "غیرفعال" },
      ],
      control: control,
      gridProps: { md: 2 },
      readOnly: true,
    },
  ];

  // vehicle_type
  const DataInputs2 = [
    {
      type: "text",
      name: "vehicle_model.vehicle_type.title",
      label: "عنوان",
      readOnly: true,
      control: control,
    },
    {
      type: "number",
      name: "vehicle_model.vehicle_type.code",
      label: "کد",
      readOnly: true,
      control: control,
    },
    {
      type: "select",
      name: "vehicle_model.vehicle_type.status",
      valueKey: "id",
      labelKey: "title",
      label: " وضعیت",
      options: [
        { id: 1, title: "فعال" },
        { id: 0, title: "غیرفعال" },
      ],
      control: control,
      gridProps: { md: 2 },
      readOnly: true,
    },
  ];

  // vehicle_brand
  const DataInputs4 = [
    {
      type: "text",
      name: "vehicle_model.vehicle_brand.title",
      label: "عنوان",
      readOnly: true,
      control: control,
    },
    {
      type: "number",
      name: "vehicle_model.vehicle_brand.code",
      label: "کد",
      readOnly: true,
      control: control,
    },
    {
      type: "number",
      name: "vehicle_model.vehicle_brand.max_weight",
      splitter: true,
      label: "وزن حداکثر",
      readOnly: true,
      control: control,
    },
    {
      type: "select",
      name: "vehicle_model.vehicle_brand.status",
      valueKey: "id",
      labelKey: "title",
      label: " وضعیت",
      options: [
        { id: 1, title: "فعال" },
        { id: 0, title: "غیرفعال" },
      ],
      control: control,
      gridProps: { md: 2 },
      readOnly: true,
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

  const handleDeleteRefueling = (id) => {
    setShowConfirmModal(true);
    setDeleteRefuelingId(id);
  };

  // handle delete Refueling
  const deleteRefueling = () => {
    deleteRefuelingMutation.mutate(deleteRefuelingId);
    setShowConfirmModal(false);
    setDeleteRefuelingId(null);
  };

  return (
    <>
      <Helmet title="پنل دراپ -  ویرایش/مشاهده خودرو" />
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
            <FormTypography>مدل</FormTypography>
            <FormInputs gridProps={{ md: 3 }} inputs={DataInputs1} />
            <Divider sx={{ my: 5 }} />
            <FormTypography>نوع بارگیر</FormTypography>
            <FormInputs gridProps={{ md: 3 }} inputs={DataInputs2} />
            <Divider sx={{ my: 5 }} />
            <Typography variant="h5" mt={5} mb={3}>
              شماتیک
            </Typography>
            <NormalTable headCells={headCells2}>
              {vehicle.vehicle_model.vehicle_type.schematic.map((item) => {
                return (
                  <TableRow hover tabIndex={-1} key={item.id}>
                    <TableCell scope="row">{enToFaNumber(item.id)}</TableCell>
                    <TableCell scope="row">
                      {enToFaNumber(item.title)}
                    </TableCell>
                    <TableCell scope="row">{enToFaNumber(item.rows)}</TableCell>
                    <TableCell scope="row">
                      {enToFaNumber(item.columns)}
                    </TableCell>
                    <TableCell scope="row">
                      {enToFaNumber(item.seat_count)}
                    </TableCell>
                    <TableCell scope="row">
                      {enToFaNumber(item.valid_seat_count)}
                    </TableCell>
                    <TableCell scope="row">
                      {enToFaNumber(item.invalid_seat_count)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </NormalTable>

            <Divider sx={{ my: 5 }} />
            <Typography variant="h5" mt={5} mb={3}>
              ناوگان
            </Typography>

            <NormalTable headCells={headCells1}>
              {vehicle.fleet && (
                <TableRow hover tabIndex={-1}>
                  <TableCell scope="row">
                    {enToFaNumber(vehicle.fleet.id)}
                  </TableCell>
                  <TableCell scope="row">
                    {enToFaNumber(vehicle.fleet.code)}
                  </TableCell>
                  <TableCell scope="row">
                    {renderChip(vehicle.fleet.status)}
                  </TableCell>
                  <TableCell scope="row">
                    {renderChip(vehicle.fleet.inquiry)}
                  </TableCell>
                </TableRow>
              )}
            </NormalTable>

            <Divider sx={{ my: 5 }} />
            <Typography variant="h5" mt={5} mb={3}>
              سوخت‌گیری
            </Typography>

            <Button
              onClick={() => setShowRefuelingModal(true)}
              variant="contained"
              type="button"
              color={"primary"}
              sx={{
                marginBottom: 3,
              }}
            >
              افزودن سوخت‌گیری جدید
            </Button>

            <NormalTable headCells={headCells}>
              {vehicle.refueling.map((item) => {
                return (
                  <TableRow hover tabIndex={-1} key={item.id}>
                    <TableCell scope="row">{enToFaNumber(item.id)}</TableCell>
                    <TableCell scope="row">
                      {enToFaNumber(item.amount)}
                    </TableCell>
                    <TableCell scope="row">
                      {enToFaNumber(numberWithCommas(item.kilometer))} کیلومتر
                    </TableCell>
                    <TableCell scope="row">
                      <TableActionCell
                        buttons={[
                          {
                            tooltip: "حذف",
                            color: "error",
                            icon: "trash-xmark",
                            onClick: () => handleDeleteRefueling(item.id),
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </NormalTable>

            <Divider sx={{ my: 5 }} />
            <FormTypography>برند</FormTypography>
            <FormInputs gridProps={{ md: 3 }} inputs={DataInputs4} />
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
              <Button
                onClick={() => setShowModal(true)}
                variant="contained"
                type="button"
                color={"primary"}
              >
                افزودن عکس جدید
              </Button>
            </Stack>
          </Card>
        </FormContainer>
      </form>

      <AddPhotoModal onClose={() => setShowModal(false)} show={showModal} />
      <AddRefuelingModal
        onClose={() => setShowRefuelingModal(false)}
        show={showRefuelingModal}
      />

      <ActionConfirm
        open={showConfirmModal}
        onClose={() => setShowConfirmModal((prev) => !prev)}
        onAccept={deleteRefueling}
        message="آیا از حذف مطمئن هستید؟"
      />
    </>
    // /* add new photo modal */
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

// add new photo modal
const AddRefuelingModal = ({ show, onClose }) => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();

  const AddRefuelingMutation = useMutation(
    (data) => axiosApi({ url: "/refueling", method: "post", data: data }),
    {
      onSuccess: () => {
        Promise.all([
          queryClient.invalidateQueries(["vehicle"]),
          queryClient.invalidateQueries(["refueling"]),
        ]);
        onClose();
        toast.success("با موفقیت اضافه شد");
      },
    }
  );

  const DataInputs = [
    {
      type: "number",
      name: "vehicle_id",
      label: "شناسه خودرو",
      control: control,
      rules: { required: "شناسه خودرو را وارد کنید" },
    },
    {
      type: "number",
      name: "amount",
      splitter: true,
      label: "مقدار",
      control: control,
      rules: { required: "مقدار را وارد کنید" },
    },
    {
      type: "number",
      name: "kilometer",
      label: "کیلومتر",
      splitter: true,
      control: control,
      rules: { required: "کیلومتر را وارد کنید" },
    },
  ];
  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };
  const onSubmit = (data) => {
    data = JSON.stringify({ ...data, vehicle_id: id });
    AddRefuelingMutation.mutate(data);
  };
  return (
    <Modal maxWidth="md" open={show} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <FormInputs gridProps={{ md: 4 }} inputs={DataInputs} />
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
