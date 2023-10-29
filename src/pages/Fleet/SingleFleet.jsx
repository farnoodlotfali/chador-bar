import { LoadingButton } from "@mui/lab";
import {
  Card,
  Divider,
  Stack,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Box,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { ChooseVehicle } from "Components/choosers/vehicle/ChooseVehicle";
import { FormContainer, FormInputs } from "Components/Form";
import NormalTable from "Components/NormalTable";
import TableActionCell from "Components/versions/TableActionCell";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import { enToFaNumber, handleDate } from "Utility/utils";
import Modal from "Components/versions/Modal";
import { toast } from "react-toastify";
import LoadingSpinner from "Components/versions/LoadingSpinner";

import DriverDetailModal from "Components/modals/DriverDetailModal";
import ActionConfirm from "Components/ActionConfirm";
import CollapseForm from "Components/CollapseForm";
import Table from "Components/versions/Table";
import { useDriver } from "hook/useDriver";

import FormTypography from "Components/FormTypography";
import HelmetTitlePage from "Components/HelmetTitlePage";

const headCells = [
  {
    id: "name",
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
const headCellsDriverShifts = [
  {
    id: "index",
    label: "شناسه",
  },
  {
    id: "date",
    label: "تاریخ",
  },
  {
    id: "start",
    label: "ساعت شروع",
  },
  {
    id: "end",
    label: "ساعت پایان",
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

const SingleFleet = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const {
    control,
    formState: { errors, isSubmitting, isDirty, isValid },
    setValue,
    handleSubmit,
    reset,
    watch,
  } = useForm();
  const [showModal, setShowModal] = useState(null);
  const [driver, setDriver] = useState(null);
  const {
    data: fleetData,
    isLoading,
    isFetching,
    isError,
    isSuccess,
  } = useQuery(
    ["fleet", id],
    () => axiosApi({ url: `/fleet/${id}` }).then((res) => res.data.Data),
    {
      enabled: !!id,
    }
  );

  // Mutations
  const deleteDriverMutation = useMutation(
    (id) => axiosApi({ url: `/driver-fleet/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fleet"]);
        toast.success("درخواست شما با موفقیت پاک شد");
      },
      onError: () => {
        toast.error("خطا  ");
      },
    }
  );

  useEffect(() => {
    if (isSuccess) {
      reset(fleetData);
    }
  }, [isSuccess]);

  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <div className="">isError</div>;
  }

  const Input = [
    {
      type: "custom",
      customView: (
        <ChooseVehicle
          control={control}
          outFilters={{
            no_fleet: true,
          }}
          name={"vehicle"}
          rules={{
            required: "خودرو را وارد کنید",
          }}
          label="خودرو"
        />
      ),
      gridProps: { md: 4 },
    },
  ];

  // handle on submit
  const onSubmit = (data) => {};

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  const handleAddShift = (driver) => {
    setDriver(driver);
    setShowModal("addDriver");
  };
  const handleShowDriver = (driver) => {
    setDriver(driver);
    setShowModal("driver");
  };
  const handleShowDriverShifts = (driver) => {
    setDriver(driver);
    setShowModal("shifts");
  };

  const showModalToRemoveDriverFleet = (driver) => {
    setDriver(driver);
    setShowModal("removeDriverFleet");
  };

  // Remove DriverFleet
  const handleRemoveRequest = () => {
    deleteDriverMutation.mutate(driver.pivot_id);
    setShowModal(null);
    setDriver(null);
  };

  const handleCloseModal = () => {
    setShowModal(null);
  };

  return (
    <>
      <HelmetTitlePage title="ناوگان" />

      <AddNewFreeDriver />

      <Card sx={{ p: 2, boxShadow: 1 }}>
        <Stack spacing={3}>
          <Typography variant="h5">رانندگان</Typography>

          <NormalTable headCells={headCells}>
            {fleetData?.drivers.map((item) => {
              return (
                <TableRow hover tabIndex={-1} key={item.id}>
                  <TableCell align="center" scope="row">
                    {(item.first_name ?? "فاقد نام") +
                      " " +
                      (item.last_name ?? " ")}
                  </TableCell>
                  <TableCell align="center" scope="row">
                    {enToFaNumber(item.mobile)}{" "}
                  </TableCell>
                  <TableCell align="center" scope="row">
                    {enToFaNumber(item.national_code) ?? "-"}
                  </TableCell>
                  <TableCell scope="row">
                    <TableActionCell
                      buttons={[
                        {
                          tooltip: "ثبت شیفت",
                          color: "info",
                          icon: "alarm-plus",
                          onClick: () => handleAddShift(item),
                          name: "driver-shift.store",
                        },
                        {
                          tooltip: "مشاهده شیفت",
                          color: "success",
                          icon: "eye",
                          onClick: () => handleShowDriverShifts(item),
                          name: "driver-shift.index",
                        },
                        {
                          tooltip: "جزییات راننده",
                          color: "warning",
                          icon: "id-card-clip",
                          onClick: () => handleShowDriver(item),
                        },
                        {
                          tooltip: "حذف راننده",
                          color: "error",
                          icon: "trash-xmark",
                          onClick: () => showModalToRemoveDriverFleet(item),
                          name: "driver-fleet.destroy",
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </NormalTable>

          <Divider sx={{ my: 5 }} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormContainer
              data={watch()}
              setData={handleChange}
              errors={errors}
            >
              <FormTypography>اطلاعات</FormTypography>
              <FormInputs inputs={Input} />

              <Stack mt={2} alignItems="flex-end">
                <LoadingButton
                  variant="contained"
                  loading={isSubmitting}
                  type="submit"
                  disabled={!isDirty}
                >
                  ذخیره
                </LoadingButton>
              </Stack>
            </FormContainer>
          </form>
        </Stack>
      </Card>

      {/* modals */}

      <ActionConfirm
        message="ایا مطمئن هستید؟"
        open={showModal === "removeDriverFleet"}
        onClose={handleCloseModal}
        onAccept={handleRemoveRequest}
      />

      <DriverDetailModal
        show={showModal === "driver"}
        onClose={handleCloseModal}
        data={driver}
      />
      <ShowDriverShifts
        show={showModal === "shifts"}
        onClose={handleCloseModal}
        shifts={fleetData?.shifts?.[driver?.id]}
      />
      <AddShiftForDriver
        driver={driver}
        open={showModal === "addDriver"}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default SingleFleet;

const AddNewFreeDriver = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [filters, setFilters] = useState({ no_fleet: true });
  const [openCollapse, setOpenCollapse] = useState(false);

  const {
    data: allDrivers,
    isLoading,
    isFetching,
    isError,
  } = useDriver(filters, { enabled: openCollapse });

  const addDriverMutation = useMutation(
    (data) =>
      axiosApi({
        url: "/driver-fleet",
        method: "post",
        data: data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fleet"]);
        toast.success("با موفقیت اضافه شد");
      },
    }
  );

  const handleAddNewDriverToFleet = async (driverId) => {
    let data = {
      person_id: driverId,
      fleet_id: id,
    };
    try {
      const res = await addDriverMutation.mutateAsync(JSON.stringify(data));
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CollapseForm
      onToggle={setOpenCollapse}
      open={openCollapse}
      title="افزودن راننده به ناوگان"
      name="driver-fleet.store"
    >
      <Box sx={{ p: 2 }}>
        {isLoading || isFetching ? (
          <LoadingSpinner />
        ) : (
          <Table
            {...allDrivers?.items}
            headCells={headCellsDriver}
            filters={filters}
            setFilters={setFilters}
          >
            <TableBody>
              {allDrivers?.items.data.map((row) => {
                return (
                  <TableRow hover tabIndex={-1} key={row.id}>
                    <TableCell align="center" scope="row">
                      {enToFaNumber(row.id)}
                    </TableCell>
                    <TableCell align="center" scope="row">
                      {(row.person.first_name || "فاقد نام") +
                        " " +
                        (row.person.last_name || " ")}
                    </TableCell>
                    <TableCell align="center" scope="row">
                      {enToFaNumber(row.mobile)}
                    </TableCell>
                    <TableCell align="center" scope="row">
                      {enToFaNumber(row.person.national_code ?? "-")}
                    </TableCell>

                    <TableCell>
                      <TableActionCell
                        buttons={[
                          {
                            tooltip: "اضافه به لیست",
                            color: "info",
                            icon: "plus",
                            onClick: () =>
                              handleAddNewDriverToFleet(row.person.id),
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Box>
    </CollapseForm>
  );
};

const ShowDriverShifts = ({ shifts = [], show, onClose }) => {
  const queryClient = useQueryClient();

  const [showShiftRemoveModal, setShowShiftRemoveModal] = useState(false);
  const [shift, setShift] = useState(null);

  const deleteShiftMutation = useMutation(
    (id) => axiosApi({ url: `/driver-shift/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fleet"]);
        toast.success("درخواست شما با موفقیت پاک شد");
      },
      onError: () => {
        toast.error("خطا  ");
      },
    }
  );

  const showModalToRemoveShift = (shift) => {
    setShift(shift);
    setShowShiftRemoveModal(true);
  };

  // Remove shift
  const handleRemoveRequest = () => {
    deleteShiftMutation.mutate(shift.id);
    setShowShiftRemoveModal(false);
    setShift(null);
  };

  return (
    <>
      <Modal onClose={onClose} open={show} maxWidth="md">
        <FormTypography fontWeight={600}>
          {(shifts?.[0]?.person.first_name ?? "-") +
            " " +
            (shifts?.[0]?.person.last_name ?? "")}
        </FormTypography>

        <NormalTable headCells={headCellsDriverShifts}>
          <TableBody>
            {shifts.map((row) => {
              return (
                <TableRow hover tabIndex={-1} key={row.id}>
                  <TableCell align="center" scope="row">
                    {enToFaNumber(row.id)}
                  </TableCell>
                  <TableCell align="center" scope="row">
                    {handleDate(row.date, "YYYY-MM-DD")}
                  </TableCell>
                  <TableCell align="center" scope="row">
                    {enToFaNumber(row.start)}
                  </TableCell>
                  <TableCell align="center" scope="row">
                    {enToFaNumber(row.end)}
                  </TableCell>
                  <TableCell scope="row">
                    <TableActionCell
                      buttons={[
                        {
                          tooltip: "حذف شیفت",
                          color: "error",
                          icon: "trash-xmark",
                          onClick: () => showModalToRemoveShift(row),
                          name: "driver-shift.destroy",
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </NormalTable>
      </Modal>

      <ActionConfirm
        message="ایا مطمئن هستید؟"
        open={showShiftRemoveModal}
        onClose={() => setShowShiftRemoveModal(false)}
        onAccept={handleRemoveRequest}
      />
    </>
  );
};

const AddShiftForDriver = ({ open, onClose, driver }) => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const {
    control,
    formState: { errors, isSubmitting, isDirty },
    setValue,
    handleSubmit,
    reset,
    watch,
  } = useForm();

  const addShiftMutation = useMutation(
    async (data) => {
      try {
        const res = await axiosApi({
          url: "/driver-shift",
          method: "post",
          data: data,
        });
        return res.data;
      } catch (error) {
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fleet"]);
        toast.success("با موفقیت ثبت شد");
        onClose();
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
  const onSubmit = (data) => {
    data = {
      person_id: driver.id,
      start_date: data.start_date.start_date,
      fleet_id: id,
      start_time: data.start_time,
      end_time: data.end_time,
      end_date: data.end_date.end_date,
      week_days: data.week_days,
    };

    addShiftMutation.mutate(JSON.stringify(data));
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    driver && (
      <Modal onClose={onClose} open={open}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormTypography>
              {driver.first_name
                ? ` ثبت شیفت برای  ${
                    driver.first_name + " " + (driver.last_name ?? " ")
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
