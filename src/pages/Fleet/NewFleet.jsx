import { useState } from "react";
import { GENDER } from "Constants";

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
  TextField,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Container,
  StepIcon,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";

import LoadingSpinner from "Components/versions/LoadingSpinner";

import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import ActionConfirm from "Components/ActionConfirm";
import SearchInput from "Components/SearchInput";
import { FormContainer, FormInputs } from "Components/Form";

import {
  addZeroForTime,
  enToFaNumber,
  renderChip,
  renderChipForInquiry,
  renderMobileFormat,
  renderPlaqueObjectToString,
} from "Utility/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useFieldArray, useForm } from "react-hook-form";
import { ChooseVModel } from "Components/choosers/vehicle/model/ChooseVModel";
import { ChooseVColor } from "Components/choosers/vehicle/color/ChooseVColor";

import { useVehicle } from "hook/useVehicle";
import Modal from "Components/versions/Modal";
import { useDriver } from "hook/useDriver";

import { useNavigate } from "react-router-dom";

import NormalTable from "Components/NormalTable";
import { ChoosePerson } from "Components/choosers/ChoosePerson";
import { ChooseVType } from "Components/choosers/vehicle/types/ChooseVType";
import FormTypography from "Components/FormTypography";
import { SvgSPrite } from "Components/SvgSPrite";
import HelmetTitlePage from "Components/HelmetTitlePage";

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
    id: "color",
    label: "رنگ",
  },
  {
    id: "year",
    label: "سال ",
  },
  {
    id: "status",
    label: "وضعیت",
  },
  {
    id: "inquiry",
    label: "استعلام",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];
const shiftHeadCells = [
  {
    id: "date",
    label: "تاریخ",
  },
  {
    id: "start_time",
    label: "از ساعت",
  },
  {
    id: "end_time",
    label: "تا ساعت",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

const headCellsDriver = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "first_name",
    label: "نام",
  },
  {
    id: "mobile",
    label: "موبایل",
  },
  {
    id: "national_code",
    label: "کد ملی",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

const ownerCellsDriver = [
  {
    id: "first_name",
    label: "نام",
  },
  {
    id: "mobile",
    label: "موبایل",
  },
  {
    id: "national_code",
    label: "کد ملی",
  },
  {
    id: "percent",
    label: "درصد",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

const stepsLabels = [
  "انتخاب خودرو",
  "انتخاب رانندگان",
  "شیفت زمانی رانندگان",
  "انتخاب صاحبان خودرو",
  "پایان!",
];

export default function NewFleet() {
  const [step, setStep] = useState(0);
  const [dataFleet, setDataFleet] = useState({});
  const allSteps = [StepOne, StepTwo, StepThree, StepFour, StepFive];

  const stepProps = {
    setDataFleet,
    setStep,
    dataFleet,
  };

  const CurrentStep = allSteps[step];

  return (
    <>
      <HelmetTitlePage title="ثبت ناوگان" />

      <Card sx={{ mt: 3, mb: 5, p: 2 }}>
        <Stepper activeStep={step} alternativeLabel>
          {stepsLabels.map((label) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={(props) => {
                  return (
                    <StepIcon {...props} icon={enToFaNumber(props.icon)} />
                  );
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Card>

      <CurrentStep {...stepProps} />
    </>
  );
}

const StepOne = (props) => {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();
  const [filters, setFilters] = useState({ no_fleet: true });
  const [openCollapse, setOpenCollapse] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedV, setSelectedV] = useState(null);

  const {
    data: vehicles,
    isLoading,
    isFetching,
    isError,
  } = useVehicle(filters);

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

  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <div className="">isError</div>;
  }

  const handleSearchInput = (value) => {
    if (value.length === 0) {
      const newFilters = filters;
      delete newFilters.q;
      setFilters({ ...newFilters });
    } else {
      setFilters((prev) => ({ ...prev, q: value }));
    }
  };

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
      label: "کد Gps",
      control: control,
      noInputArrow: true,
      rules: {
        required: "gps_code را وارد کنید",
      },
    },
    {
      type: "text",
      name: "شماره کارت هوشمند",
      label: "شماره کارت هوشمند",
      control: control,
      // rules: {
      //   required: "شماره کارت هوشمند را وارد کنید",
      //   minLength: {
      //     value: 17,
      //     message: "شماره کارت هوشمند  باید 17 حرفی باشد",
      //   },
      // },
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
  const onSubmit = (data) => {
    data = JSON.stringify({
      plaque: data?.plaque,
      vehicle_model_id: data?.vehicle_model?.id,
      color: data?.color?.length > 0 ? data?.color[0] : null,
      container_type_id: data?.container_type?.id,
      vin: data?.vin?.toUpperCase(),
      imei: data?.imei,
      gps_code: data?.gps_code,
      year: data?.year,
      status: 1,
      inquiry: 0,
    });
    AddVehicleMutation.mutate(data);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  const confirmVehicle = (vehicle) => {
    setSelectedV(vehicle);
    setShowModal(true);
  };

  const renderItem = (title, value, icon) => {
    return (
      <Grid item xs={12} sm={6} md={3}>
        <Stack spacing={1} direction="row" alignItems="center">
          <Stack spacing={0.5} direction="row">
            {icon}{" "}
            <Typography
              variant="caption"
              alignSelf={"center"}
              fontWeight={"700"}
            >
              {title}:
            </Typography>
          </Stack>
          <Typography variant="caption">{value}</Typography>
        </Stack>
      </Grid>
    );
  };
  return (
    <>
      <Card sx={{ overflow: "hidden", mb: 2 }}>
        <Button
          color="secondary"
          sx={{ width: "100%", px: 2, borderRadius: 0 }}
          onClick={() => setOpenCollapse((prev) => !prev)}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: "100%", height: "50px" }}
          >
            <Typography>افزودن خودرو</Typography>

            {openCollapse ? (
              <SvgSPrite icon="chevron-up" size="small" />
            ) : (
              <SvgSPrite icon="chevron-down" size="small" />
            )}
          </Stack>
        </Button>

        <Collapse in={openCollapse}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ p: 2 }}>
              <FormContainer
                data={watch()}
                setData={handleChange}
                errors={errors}
              >
                <FormInputs inputs={Inputs} gridProps={{ md: 4 }} />
                <Stack direction="row" justifyContent="end" mt={2}>
                  <LoadingButton
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
        </Collapse>
      </Card>

      <Grid container mb={2}>
        <Grid item xs={12} md={3}>
          <SearchInput
            sx={{ width: "100%" }}
            placeholder="جستجو"
            defaultValue={filters.q}
            onEnter={handleSearchInput}
          />
        </Grid>
      </Grid>

      <Table
        {...vehicles}
        headCells={headCells}
        filters={filters}
        setFilters={setFilters}
      >
        <TableBody>
          {vehicles.data.map((row) => {
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
                  {row.color}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.year)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {renderChip(row.status)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {renderChipForInquiry(row.inquiry)}
                </TableCell>

                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "اضافه",
                        color: "info",
                        icon: "plus",
                        onClick: () => confirmVehicle(row),
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <FormTypography>تایید خودرو انتخابی</FormTypography>

        {selectedV && (
          <Card sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              {renderItem(
                "پلاک",
                renderPlaqueObjectToString(selectedV.plaque),
                <SvgSPrite icon="thumbtack" MUIColor="primary" />
              )}
              {renderItem(
                "رنگ ",
                selectedV.color,
                <SvgSPrite icon="brush" MUIColor="error" />
              )}
              {renderItem(
                "سال",
                enToFaNumber(selectedV.year),
                <SvgSPrite icon="calendar-days" MUIColor="info" />
              )}
              {renderItem("vin", enToFaNumber(selectedV.vin))}
              {renderItem(
                "مدل",
                enToFaNumber(selectedV.vehicle_model.title),
                <SvgSPrite icon="tag" color="deeppink" />
              )}
              {renderItem(
                "برند",
                enToFaNumber(selectedV.vehicle_model.vehicle_brand.title),
                <SvgSPrite icon="seal" color="orangered" />
              )}
              {renderItem(
                "نوع بارگیر",
                enToFaNumber(selectedV.container_type.title),
                <SvgSPrite icon="truck-ramp" color="limegreen" />
              )}
            </Grid>
          </Card>
        )}

        <Stack mt={4} alignItems="flex-end">
          <LoadingButton
            variant="contained"
            type="button"
            onClick={() => {
              props.setDataFleet((prev) => ({
                ...prev,
                vehicle_id: selectedV.id,
              }));
              props.setStep((prev) => prev + 1);
            }}
          >
            تایید
          </LoadingButton>
        </Stack>
      </Modal>
    </>
  );
};

const StepTwo = (props) => {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();
  const [filters, setFilters] = useState({ no_fleet: true });
  const [openCollapse, setOpenCollapse] = useState(false);
  const [errorPercent, setErrorPercent] = useState(false);
  const [selectedDr, setSelectedDr] = useState([]);

  const {
    data: allDrivers,
    isLoading,
    isFetching,
    isError,
  } = useDriver(filters);

  const addDriverMutation = useMutation(
    (data) =>
      axiosApi({
        url: "/driver",
        method: "post",
        data: data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["driver"]);
        toast.success("با موفقیت اضافه شد");
      },
    }
  );

  const addFleetMutation = useMutation(
    (data) =>
      axiosApi({
        url: "/fleet",
        method: "post",
        data: data,
      }),
    {
      onSuccess: (data) => {
        props.setDataFleet(data.data.Data);
        toast.success("با موفقیت ثبت شد");
        props.setStep((prev) => prev + 1);
        reset();
      },
    }
  );

  const PercentInput = [
    {
      type: "number",
      name: "driver_percent",
      label: "سهم راننده",
      control: control,
      noInputArrow: true,
      rules: {
        required: "سهم راننده را وارد کنید",
      },
      gridProps: { m: 1 },
    },
  ];

  const Inputs = [
    {
      type: "text",
      name: "first_name",
      label: "نام",
      control: control,
      rules: { required: "نام را وارد کنید" },
    },
    {
      type: "text",
      name: "last_name",
      label: "نام‌خانوادگی",
      control: control,
      rules: { required: "نام‌خانوادگی را وارد کنید" },
    },
    {
      type: "text",
      name: "father_name",
      label: "نام پدر",
      control: control,
      rules: { required: "نام پدر را وارد کنید" },
    },
    {
      type: "number",
      name: "mobile",
      label: "موبایل",
      noInputArrow: true,
      control: control,
      rules: { required: "موبایل را وارد کنید" },
    },
    {
      type: "select",
      name: "gender",
      label: "جنسیت",
      options: GENDER,
      labelKey: "name",
      valueKey: "value",
      control: control,
      rules: { required: "جنسیت را وارد کنید" },
    },
    {
      type: "date",
      name: "birth_date",
      label: "تاریخ تولد",
      control: control,
      rules: { required: "تاریخ تولد را وارد کنید" },
    },
    {
      type: "number",
      name: "national_code",
      label: "کدملی",
      noInputArrow: true,
      control: control,
      rules: { required: "کدملی را وارد کنید" },
    },
    {
      type: "email",
      name: "email",
      label: "ایمیل",
      control: control,
    },
    {
      type: "text",
      name: "national_card",
      label: "کارت هوشمند",
      control: control,
    },
    {
      type: "number",
      name: "license_card",
      label: "گواهینامه",
      noInputArrow: true,
      control: control,
    },
  ];

  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <div className="">isError</div>;
  }
  const { items } = allDrivers;

  const handleSearchInput = (value) => {
    if (value.length === 0) {
      const newFilters = filters;
      delete newFilters.q;
      setFilters({ ...newFilters });
    } else {
      setFilters((prev) => ({ ...prev, q: value }));
    }
  };

  const handleAdd = (id) => {
    setSelectedDr((prev) => prev.concat([id]));
  };
  const handleDelete = (id) => {
    setSelectedDr((prev) => prev.filter((item) => item !== id));
  };

  // handle on submit
  const onSubmit = async (data) => {
    data = JSON.stringify({
      // vehicle_id: data.vehicle.id,
      mobile: data.mobile,
      first_name: data.first_name,
      last_name: data.last_name,
      father_name: data.father_name,
      national_code: data.national_code,
      gender: data.gender,
      email: data.email,
      birth_date: data.birth_date.birth_date,
      inquiry: null,
      avatar: data.avatar,
      national_card: data.national_card,
      license_card: data.license_card,
    });
    try {
      const res = await addDriverMutation.mutateAsync(data);
      return res;
    } catch (error) {
      return error;
    }
  };

  const onSubmit1 = async (data) => {};

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  const AddToFleet = async () => {
    if (props.dataFleet?.driver_percent) {
      try {
        let data = {
          ...props.dataFleet,
          status: 1,
          drivers: selectedDr,
        };

        const res = await addFleetMutation.mutateAsync(JSON.stringify(data));

        return res;
      } catch (error) {
        return error;
      }
    } else {
      setErrorPercent(true);
      toast.error("لطفا سهم راننده را وارد نمایید");
    }
  };

  return (
    <>
      <Card sx={{ overflow: "hidden", mb: 2 }}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <Button
            color="secondary"
            sx={{ width: "100%", px: 2, borderRadius: 0 }}
            onClick={() => setOpenCollapse((prev) => !prev)}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ width: "100%", height: "50px" }}
            >
              <Typography>افزودن راننده</Typography>

              {openCollapse ? (
                <SvgSPrite icon="chevron-up" size="small" />
              ) : (
                <SvgSPrite icon="chevron-down" size="small" />
              )}
            </Stack>
          </Button>

          <Collapse in={openCollapse}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ p: 2 }}>
                <FormInputs inputs={Inputs} gridProps={{ md: 4 }} />
                <Stack direction="row" justifyContent="end" mt={2}>
                  <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={isSubmitting}
                  >
                    افزودن
                  </LoadingButton>
                </Stack>
              </Box>
            </form>
          </Collapse>
        </FormContainer>
      </Card>

      <Grid container mb={2} spacing={2}>
        <Grid item xs={12} md={3}>
          <SearchInput
            sx={{ width: "100%" }}
            placeholder="جستجو"
            defaultValue={filters.q}
            onEnter={handleSearchInput}
          />
        </Grid>
      </Grid>

      <Table
        {...items}
        headCells={headCellsDriver}
        filters={filters}
        setFilters={setFilters}
      >
        <TableBody>
          {items.data.map((row) => {
            const is_select = selectedDr.includes(row?.person?.id);

            let buttons = [];

            if (is_select) {
              buttons = [
                {
                  tooltip: "حذف از لیست",
                  color: "error",
                  icon: "trash-xmark",
                  onClick: () => handleDelete(row.person.id),
                },
              ];
            } else {
              buttons = [
                {
                  tooltip: "اضافه به لیست",
                  color: "info",
                  icon: "plus",
                  onClick: () => handleAdd(row.person.id),
                },
              ];
            }

            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {is_select ? (
                    <Chip label={enToFaNumber(row.id)} color="success" />
                  ) : (
                    enToFaNumber(row.id)
                  )}
                </TableCell>
                <TableCell align="center" scope="row">
                  {(row.person.first_name || "فاقد نام") +
                    " " +
                    (row.person.last_name || " ")}
                </TableCell>
                <TableCell align="center" scope="row">
                  {renderMobileFormat(row.mobile)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.person.national_code ?? "-")}
                </TableCell>

                <TableCell>
                  <TableActionCell buttons={buttons} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Stack mt={4} direction="row" justifyContent="space-between" spacing={3}>
        <TextField
          label="سهم راننده"
          variant="outlined"
          error={errorPercent}
          onChange={(e) => {
            if (e.target.value.length > 0) {
              setErrorPercent(false);
            }
            props.setDataFleet((prev) => ({
              ...prev,
              driver_percent: Number(e.target.value),
            }));
          }}
        />
        <LoadingButton variant="contained" type="button" onClick={AddToFleet}>
          ثبت رانندگان
        </LoadingButton>
      </Stack>
    </>
  );
};

const StepThree = (props) => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [driver, setDriver] = useState(null);
  const [shift, setShift] = useState(null);

  const deleteShiftMutation = useMutation(
    (id) => axiosApi({ url: `/fleet-owner/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fleet", props.dataFleet.id]);
        toast.success("با موفقیت حذف شد");
      },
    }
  );

  const handleAddShift = (driver) => {
    setDriver(driver);
    setShowModal("add");
  };

  const { isError, isLoading, isFetching } = useQuery(
    ["fleet", props.dataFleet.id],
    () =>
      axiosApi({ url: `/fleet/${props.dataFleet.id}` }).then(
        (res) => res.data.Data
      ),
    {
      enabled: !!props.dataFleet.id,
      onSuccess: (data) => {
        props.setDataFleet(data);
      },
    }
  );

  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <div className="">isError</div>;
  }

  const handleToRemove = async (obj) => {
    setShift(obj);
    setShowModal("delete");
  };
  const acceptRemoveShift = async () => {
    try {
      const res = await deleteShiftMutation.mutateAsync(shift?.id);
      return res;
    } catch (error) {
      return error;
    }
  };

  return (
    <>
      <Stack spacing={4}>
        {props?.dataFleet?.drivers?.map((item) => {
          return (
            <Card sx={{ p: 3 }} key={item.id}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography
                  fontWeight={700}
                  sx={{ fontSize: { md: 20, xs: 15 } }}
                >
                  {item.first_name
                    ? `شیفت زمانی ${
                        item.first_name + " " + (item.last_name ?? " ")
                      }`
                    : "شیفت جدید"}
                </Typography>
                <Button
                  onClick={() => handleAddShift(item)}
                  variant="contained"
                  type="button"
                >
                  افزودن شیفت
                </Button>
              </Stack>

              <NormalTable headCells={shiftHeadCells}>
                {props.dataFleet?.shifts?.[item.id]?.map((shift, i) => {
                  return (
                    <TableRow hover tabIndex={-1} key={i}>
                      <TableCell scope="row">
                        {enToFaNumber(shift.date)}
                      </TableCell>
                      <TableCell scope="row">
                        {enToFaNumber(shift.start)}
                      </TableCell>
                      <TableCell scope="row">
                        {enToFaNumber(shift.end)}
                      </TableCell>

                      <TableCell>
                        <TableActionCell
                          buttons={[
                            {
                              tooltip: "ویرایش",
                              color: "warning",
                              icon: "pencil",
                              // onClick: () => showModalToRemove(shift),
                            },
                            {
                              tooltip: "حذف",
                              color: "error",
                              icon: "trash-xmark",
                              onClick: () => handleToRemove(shift),
                            },
                          ]}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </NormalTable>
            </Card>
          );
        })}
      </Stack>

      <Stack mt={4} direction="row" justifyContent="flex-end" spacing={3}>
        <LoadingButton
          variant="contained"
          type="button"
          onClick={() => props.setStep((prev) => prev + 1)}
        >
          بعدی
        </LoadingButton>
      </Stack>

      <AddShiftForDriver
        driver={driver}
        open={showModal === "add"}
        onClose={() => setShowModal(null)}
        {...props}
      />

      <ActionConfirm
        message="ایا مطمئن هستید؟"
        open={showModal === "delete"}
        onClose={() => setShowModal(null)}
        onAccept={acceptRemoveShift}
      />
    </>
  );
};

const AddShiftForDriver = (props) => {
  const queryClient = useQueryClient();
  const {
    control,
    formState: { errors, isSubmitting, isDirty },
    setValue,
    handleSubmit,
    reset,
    watch,
  } = useForm();

  const addShiftMutation = useMutation(
    (data) =>
      axiosApi({
        url: "/driver-shift",
        method: "post",
        data: data,
      }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["fleet", props.dataFleet.id]);
        toast.success("با موفقیت ثبت شد");
        props.onClose();
        reset();
      },
    }
  );

  const Input = [
    {
      type: "date",
      name: "start_date",
      label: "تاریخ شروع ",
      control: control,
      rules: { required: "تاریخ شروع را وارد کنید" },
    },
    {
      type: "date",
      name: "end_date",
      label: "تاریخ پایان ",
      control: control,
      rules: { required: "تاریخ پایان را وارد کنید" },
    },

    {
      type: "time",
      name: "start_time",
      label: "ساعت شروع",
      control: control,
      rules: { required: "ساعت شروع را وارد کنید" },
    },
    {
      type: "time",
      name: "end_time",
      label: "ساعت پایان",
      control: control,
      rules: { required: "ساعت پایان را وارد کنید" },
    },
    {
      type: "weekdays",
      name: "week_days",
      label: "روز های کاری",
      control: control,
      rules: { required: "حداقل یک روز را وارد کنید" },
      gridProps: { md: 12 },
    },
  ];

  // handle on submit
  const onSubmit = async (data) => {
    data = {
      person_id: props.driver.id,
      start_date: data.start_date.start_date,
      fleet_id: props.dataFleet.id,
      start_time: addZeroForTime(data.start_time),
      end_time: addZeroForTime(data.end_time),
      end_date: data.end_date.end_date,
      week_days: data.week_days,
    };

    try {
      const res = await addShiftMutation.mutateAsync(JSON.stringify(data));
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
    props.driver && (
      <Modal onClose={props.onClose} open={props.open}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormTypography>
              {props.driver.first_name
                ? ` ثبت شیفت برای  ${
                    props.driver.first_name +
                    " " +
                    (props.driver.last_name ?? " ")
                  }`
                : "شیفت جدید"}
            </FormTypography>

            <FormInputs inputs={Input} />

            <Stack mt={2} alignItems="flex-end">
              <LoadingButton
                variant="contained"
                loading={isSubmitting}
                type="submit"
                disabled={!isDirty}
              >
                ثبت
              </LoadingButton>
            </Stack>
          </FormContainer>
        </form>
      </Modal>
    )
  );
};

const StepFour = (props) => {
  const queryClient = useQueryClient();
  const [openCollapse, setOpenCollapse] = useState(false);
  const [totalPercents, setTotalPercents] = useState(0);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "owners",
    keyName: "customId",
    rules: props.rules,
  });

  const AddFleetOwnerMutation = useMutation(
    (data) =>
      axiosApi({
        url: "/fleet-owner",
        method: "post",
        data: data,
      }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["/fleet-owner"]);
        queryClient.invalidateQueries(["/fleet"]);
        toast.success("با موفقیت اضافه شد");
        append({ percent: watch("percent"), person: watch("person") });
        reset();
      },
    }
  );

  const deleteFleetOwnerMutation = useMutation(
    (data) =>
      axiosApi({
        url: "/fleet-owner/" + selectedOwner?.id,
        method: "delete",
        data: data,
      }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["/fleet-owner"]);
        queryClient.invalidateQueries(["/fleet"]);
        toast.success("با موفقیت حذف شد");
        remove(fields.findIndex((item) => item.id === selectedOwner?.id));
        reset();
      },
    }
  );

  const Inputs = [
    {
      type: "number",
      name: "percent",
      label: "درصد سهم",
      control: control,
      noInputArrow: true,
      rules: {
        required: "درصد سهم را وارد کنید",
        max: {
          value: 100 - totalPercents,
          message: `درصد تولید باید از ${100 - totalPercents} کوچکتر باشد`,
        },
        minLength: {
          value: 1,
          message: "درصد باید 3-1 رقمی باشد",
        },
        maxLength: {
          value: 3,
          message: "درصد باید 3-1 رقمی باشد",
        },
      },
    },
    {
      type: "custom",
      customView: (
        <ChoosePerson
          control={control}
          name={"person"}
          rules={{
            required: "صاحب را وارد کنید",
          }}
          label="صاحب"
        />
      ),
      gridProps: { md: 4 },
    },
  ];

  // handle on submit new vehicle
  const onSubmit = (data) => {
    append({ percent: data.percent, person: data.person });
    const total = Number(data.percent) + totalPercents;
    setTotalPercents(total);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  const handleEdit = (obj) => {
    setSelectedOwner(obj);
    setShowModal(true);
  };
  const handleDelete = (obj) => {
    setSelectedOwner(obj);
    setShowModal(true);
  };

  const handleSaveAndNextStep = async () => {
    if (totalPercents !== 100) {
      toast.error("مجموع درصد ها باید 100 باشد");
      return;
    }

    let data = JSON.stringify({
      fleet_id: props.dataFleet.id,
      persons: fields.map((item) => ({
        id: item.person.id,
        percent: Number(item.percent),
      })),
    });

    try {
      const res = await AddFleetOwnerMutation.mutateAsync(data);
      props.setStep((prev) => prev + 1);
      return res;
    } catch (error) {
      return error;
    }
  };

  return (
    <>
      <Card sx={{ overflow: "hidden", mb: 2 }}>
        <Button
          color="secondary"
          sx={{ width: "100%", px: 2, borderRadius: 0 }}
          onClick={() => setOpenCollapse((prev) => !prev)}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: "100%", height: "50px" }}
          >
            <Typography>افزودن صاحب</Typography>

            {openCollapse ? (
              <SvgSPrite icon="chevron-up" size="small" />
            ) : (
              <SvgSPrite icon="chevron-down" size="small" />
            )}
          </Stack>
        </Button>

        <Collapse in={openCollapse}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ p: 2 }}>
              <FormContainer
                data={watch()}
                setData={handleChange}
                errors={errors}
              >
                <FormInputs inputs={Inputs} gridProps={{ md: 4 }}>
                  <Grid item xs={12} md={2}>
                    <LoadingButton
                      sx={{
                        width: "100%",
                        height: "56px",
                      }}
                      variant="contained"
                      type="submit"
                      loading={isSubmitting}
                    >
                      افزودن
                    </LoadingButton>
                  </Grid>
                </FormInputs>
              </FormContainer>
            </Box>
          </form>
        </Collapse>
      </Card>

      <Card sx={{ overflow: "hidden", mb: 2, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Stack direction="row" spacing={1}>
              <Typography fontWeight={600}>مجموع درصدها:</Typography>
              <Typography>{enToFaNumber(totalPercents)} درصد</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack direction="row" spacing={1}>
              <Typography fontWeight={600}> تعداد افراد:</Typography>
              <Typography>{enToFaNumber(fields.length)} </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack direction="row" spacing={1}>
              <Typography fontWeight={600}> حداقل درصد واردی:</Typography>
              <Typography>{enToFaNumber(100 - totalPercents)} درصد</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Card>

      <NormalTable headCells={ownerCellsDriver}>
        {fields.map((item, i) => {
          return (
            <TableRow hover tabIndex={-1} key={i}>
              <TableCell align="center" scope="row">
                {(item.person.first_name ?? "فاقد نام") +
                  " " +
                  (item.person.last_name ?? "")}
              </TableCell>
              <TableCell align="center" scope="row">
                {renderMobileFormat(item.person.mobile) ?? "-"}
              </TableCell>
              <TableCell align="center" scope="row">
                {enToFaNumber(item.person.national_card) ?? "-"}
              </TableCell>
              <TableCell align="center" scope="row">
                {enToFaNumber(item.percent) ?? "-"} درصد
              </TableCell>
              <TableCell>
                <TableActionCell
                  buttons={[
                    {
                      tooltip: "ویرایش",
                      color: "warning",
                      icon: "pencil",
                      onClick: () => handleEdit(item.person),
                    },
                    {
                      tooltip: "حذف کردن",
                      color: "error",
                      icon: "trash-xmark",
                      onClick: () => handleDelete(item.person),
                    },
                  ]}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </NormalTable>

      <Stack mt={4} direction="row" justifyContent="flex-end" spacing={3}>
        <LoadingButton
          variant="contained"
          type="button"
          onClick={handleSaveAndNextStep}
          loading={isSubmitting}
        >
          پایان
        </LoadingButton>
      </Stack>

      <ActionConfirm
        message="ایا مطمئن هستید؟"
        open={showModal}
        onClose={() => setShowModal(false)}
        onAccept={async () => {
          try {
            const res = await deleteFleetOwnerMutation.mutateAsync();

            return res;
          } catch (error) {
            return error;
          }
        }}
      />
    </>
  );
};

const StepFive = (props) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: "100%",
      }}
    >
      <Container maxWidth="xs" sx={{ pt: 10 }}>
        <Card sx={{ p: 3, mb: 2, boxShadow: 1, overflow: "visible" }}>
          <Stack spacing={2} alignItems={"center"}>
            <SvgSPrite icon="party-horn" MUIColor="primary" size={65} />

            <Typography>با موفقیت اطلاعات ناوگان ثبت شد.</Typography>
          </Stack>

          <Button
            variant="contained"
            size="large"
            sx={{ width: "100%", mt: 3 }}
            onClick={() => navigate(`/fleet/${props.dataFleet.id}`)}
          >
            مشاهده اطلاعات ناوگان
          </Button>
        </Card>
      </Container>
    </Box>
  );
};
