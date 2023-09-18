import { useEffect, useState } from "react";

import {
  Stack,
  Box,
  TableRow,
  TableCell,
  Typography,
  Button,
  IconButton,
  Grid,
  TextField,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";
import LoadingSpinner from "Components/versions/LoadingSpinner";

import TableActionCell from "Components/versions/TableActionCell";
import ActionConfirm from "Components/ActionConfirm";
import { FormContainer, FormInputs } from "Components/Form";

import {
  enToFaNumber,
  removeInvalidValues,
  renderSelectOptions,
} from "Utility/utils";
import { Helmet } from "react-helmet-async";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useForm } from "react-hook-form";
import { useSalon } from "hook/useSalon";
import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import MultiDrivers from "Components/multiSelects/MultiDrivers";
import MultiCustomers from "Components/multiSelects/MultiCustomers";
import Modal from "Components/versions/Modal";
import NormalTable from "Components/NormalTable";

import { SvgSPrite } from "Components/SvgSPrite";
const headCells = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "name",
    label: "نام سالن ",
  },

  {
    id: "actions",
    label: "عملیات",
  },
];

const driversHeadCells = [
  {
    id: "id",
    label: "شناسه",
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
    id: "license_card",
    label: "گواهینامه",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

export default function SuperAppList() {
  const queryClient = useQueryClient();
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();

  const [showModal, setShowModal] = useState(false);
  const [selectedSalon, setSelectedSalon] = useState(null);

  const {
    data: Salon,
    isLoading,
    isFetching,
    isError,
  } = useSalon(searchParamsFilter);

  const deleteSalonMutation = useMutation(
    (id) => axiosApi({ url: `/salon/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["salon"]);
        toast.success("با موفقیت حذف شد");
      },
    }
  );

  const deletePersonSalonMutation = useMutation(
    (data) => axiosApi({ url: "/person-salon", method: "delete", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["salon"]);

        toast.success("با موفقیت حذف شد");
      },
    }
  );

  const addPersonSalonMutation = useMutation(
    (data) => axiosApi({ url: "/person-salon", method: "post", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["salon"]);

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

  const deleteSalon = () => {
    deleteSalonMutation.mutate(selectedSalon?.id);
    handleCloseModal();
  };

  const handleDeleteSalon = (item) => {
    setShowModal("deleteSalon");
    setSelectedSalon(item);
  };
  const handleSalonDrivers = (item) => {
    setSelectedSalon(item);
    setShowModal("salonDrivers");
  };
  const handleSalonOwners = (item) => {
    setSelectedSalon(item);
    setShowModal("salonOwners");
  };

  const handleCloseModal = () => {
    setShowModal(null);
  };

  const handleDeletePersonSalon = async (data) => {
    try {
      const res = await deletePersonSalonMutation.mutateAsync(data);
      return res;
    } catch (error) {
      return error;
    }
  };

  const handleAddPersonSalon = async (data) => {
    try {
      const res = await addPersonSalonMutation.mutateAsync(data);
      return res;
    } catch (error) {
      return error;
    }
  };

  return (
    <>
      <Helmet title="پنل دراپ - مدیریت سوپر اپ" />
      <AddNewSalon />

      <ActionConfirm
        open={showModal === "deleteSalon"}
        onClose={handleCloseModal}
        onAccept={deleteSalon}
        message="آیا از حذف سالن مطمئن هستید؟"
      />
      {/* modals */}
      <SalonDriversModal
        show={showModal === "salonDrivers"}
        onClose={handleCloseModal}
        salon={selectedSalon}
        handleDelete={handleDeletePersonSalon}
        handleAdd={handleAddPersonSalon}
      />
      <SalonOwnerModal
        show={showModal === "salonOwners"}
        onClose={handleCloseModal}
        salon={selectedSalon}
        handleDelete={handleDeletePersonSalon}
        handleAdd={handleAddPersonSalon}
      />
    </>
  );
}

const SalonDriversModal = ({
  show,
  onClose,
  salon,
  handleDelete,
  handleAdd,
}) => {
  const {
    control,
    handleSubmit,

    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();

  const [showModal, setShowModal] = useState(false);
  const [SelectedDriver, setSelectedDriver] = useState(null);

  const Inputs = [
    {
      type: "custom",
      customView: (
        <MultiDrivers
          control={control}
          name={"drivers"}
          rules={{
            required: { message: "راننده را انتخاب کنید", value: true },
            minLength: { message: "حداقل یک راننده را انتخاب کنید", value: 1 },
          }}
          label="رانندگان"
          needMoreInfo={true}
        />
      ),
    },
  ];

  // handle on submit new Salon
  const onSubmit = (data) => {
    handleAdd({
      salon_id: salon.id,
      persons: data?.drivers.map((item) => item.person.id),
      role: "driver",
    });
    onClose();
  };
  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  const deleteDriver = (item) => {
    setSelectedDriver(item);
    setShowModal("confirmDelete");
  };

  const handleAcceptDelete = () => {
    handleDelete({
      salon_id: salon.id,
      person_id: SelectedDriver.person_id,
    });

    handleCloseModal();
    onClose();
  };

  const handleCloseModal = () => {
    setShowModal((prev) => !prev);
  };

  const showAddNewDriverSalon = () => {
    setShowModal("addNewDriverSalon");
  };

  return (
    <>
      {salon && (
        <Modal onClose={onClose} open={show} maxWidth={"lg"}>
          <Stack
            direction="row"
            justifyContent="space-between"
            mb={3}
            alignItems="center"
          >
            <Typography variant="h5">رانندگان {salon.name}</Typography>

            <Button onClick={showAddNewDriverSalon} variant="contained">
              افزودن راننده جدید
            </Button>
          </Stack>
          <NormalTable headCells={driversHeadCells}>
            {salon?.drivers.map((item, i) => {
              return (
                <TableRow hover tabIndex={-1} key={item.id}>
                  <TableCell scope="row">{enToFaNumber(i + 1)}</TableCell>
                  <TableCell scope="row">
                    {item?.person?.first_name
                      ? (item?.person?.first_name ?? "-") +
                        " " +
                        (item?.person?.last_name ?? "")
                      : "-"}
                  </TableCell>
                  <TableCell scope="row">
                    {enToFaNumber(item.person.mobile) ?? "-"}
                  </TableCell>
                  <TableCell scope="row">
                    {enToFaNumber(item.national_code) ?? "-"}
                  </TableCell>
                  <TableCell scope="row">
                    {enToFaNumber(item.license_card) ?? "-"}
                  </TableCell>
                  <TableCell>
                    <TableActionCell
                      buttons={[
                        {
                          tooltip: "حذف",
                          color: "error",
                          icon: "trash-xmark",
                          onClick: () => deleteDriver(item),
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </NormalTable>
        </Modal>
      )}
      <ActionConfirm
        open={showModal === "confirmDelete"}
        onClose={handleCloseModal}
        onAccept={handleAcceptDelete}
        message="آیا از حذف راننده از این سالن مطمئن هستید؟"
      />
      <Modal
        onClose={handleCloseModal}
        open={showModal === "addNewDriverSalon"}
        maxWidth={"sm"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h5" mb={2}>
            افزودن راننده به {salon?.name}
          </Typography>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 12 }} />

            <Stack mt={2} alignItems="flex-end">
              <LoadingButton
                variant="contained"
                type="submit"
                loading={isSubmitting}
              >
                افزودن
              </LoadingButton>
            </Stack>
          </FormContainer>
        </form>
      </Modal>
    </>
  );
};

const SalonOwnerModal = ({ show, onClose, salon, handleDelete, handleAdd }) => {
  const {
    control,
    handleSubmit,

    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();

  const [showModal, setShowModal] = useState(false);
  const [SelectedOwner, setSelectedOwner] = useState(null);

  const Inputs = [
    {
      type: "custom",
      customView: (
        <MultiCustomers
          control={control}
          name={"customers"}
          rules={{
            required: { message: "صاحب بار را انتخاب کنید", value: true },
            minLength: {
              message: "حداقل یک صاحب بار را انتخاب کنید",
              value: 1,
            },
          }}
          label="صاحبان بار"
          needMoreInfo={true}
        />
      ),
    },
  ];

  // handle on submit new Salon
  const onSubmit = (data) => {
    handleAdd({
      salon_id: salon.id,
      persons: data?.customers.map((item) => item.person.id),
      role: "owner",
    });
    onClose();
  };
  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  const deleteOwner = (item) => {
    setSelectedOwner(item);
    setShowModal("confirmDelete");
  };

  const handleAcceptDelete = () => {
    handleDelete({
      salon_id: salon.id,
      person_id: SelectedOwner.person_id,
    });
    handleCloseModal();
    onClose();
  };

  const handleCloseModal = () => {
    setShowModal((prev) => !prev);
  };

  const showAddNewOwnerSalon = () => {
    setShowModal("addNewOwnerSalon");
  };

  return (
    <>
      {salon && (
        <Modal onClose={onClose} open={show} maxWidth={"lg"}>
          <Stack
            direction="row"
            justifyContent="space-between"
            mb={3}
            alignItems="center"
          >
            <Typography variant="h5">صاحبان بار {salon.name}</Typography>

            <Button onClick={showAddNewOwnerSalon} variant="contained">
              افزودن صاحب بار جدید
            </Button>
          </Stack>

          <NormalTable headCells={driversHeadCells}>
            {salon?.owners.map((item, i) => {
              return (
                <TableRow hover tabIndex={-1} key={item.id}>
                  <TableCell scope="row">{enToFaNumber(i + 1)}</TableCell>
                  <TableCell scope="row">
                    {item?.person?.first_name
                      ? (item?.person?.first_name ?? "-") +
                        " " +
                        (item?.person?.last_name ?? "")
                      : "-"}
                  </TableCell>
                  <TableCell scope="row">
                    {enToFaNumber(item.person.mobile) ?? "-"}
                  </TableCell>
                  <TableCell scope="row">
                    {enToFaNumber(item.national_code) ?? "-"}
                  </TableCell>
                  <TableCell scope="row">
                    {enToFaNumber(item.license_card) ?? "-"}
                  </TableCell>
                  <TableCell>
                    <TableActionCell
                      buttons={[
                        {
                          tooltip: "حذف",
                          color: "error",
                          icon: "trash-xmark",
                          onClick: () => deleteOwner(item),
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </NormalTable>
        </Modal>
      )}
      <ActionConfirm
        open={showModal === "confirmDelete"}
        onClose={handleCloseModal}
        onAccept={handleAcceptDelete}
        message="آیا از حذف صاحب بار از این سالن مطمئن هستید؟"
      />

      <Modal
        onClose={handleCloseModal}
        open={showModal === "addNewOwnerSalon"}
        maxWidth={"sm"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h5" mb={2}>
            افزودن راننده به {salon?.name}
          </Typography>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 12 }} />

            <Stack mt={2} alignItems="flex-end">
              <LoadingButton
                variant="contained"
                type="submit"
                loading={isSubmitting}
              >
                افزودن
              </LoadingButton>
            </Stack>
          </FormContainer>
        </form>
      </Modal>
    </>
  );
};

const SearchBoxSalon = () => {
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const [openCollapse, setOpenCollapse] = useState(false);

  const {
    control,
    formState: { errors, isSubmitting },
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

            <Stack mt={10} alignItems="flex-end">
              <LoadingButton
                variant="contained"
                loading={isSubmitting}
                type="submit"
                color={Object.keys(errors).length !== 0 ? "error" : "primary"}
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

const AddNewSalon = () => {
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
  const [users, setUsers] = useState([]);
  const AddSalonMutation = useMutation(
    (data) => axiosApi({ url: "/salon", method: "post", data: data }),
    {
      onSuccess: () => {
        reset();
        queryClient.invalidateQueries(["salon"]);
        toast.success("با موفقیت اضافه شد");
      },
    }
  );

  const Inputs = [
    {
      type: "text",
      name: "name",
      label: "عنوان گروه",
      control: control,
      rules: {
        required: { value: true, message: "نام گروه را وارد کنید" },
      },
    },
    {
      type: "select",
      name: "type",
      label: "نوع",
      options: renderSelectOptions({ a: "پیشفرض", b: "عادی" }),
      valueKey: "id",
      labelKey: "title",
      control: control,
      rules: { required: "نوع را وارد کنید" },
    },
    {
      type: "select",
      name: "type",
      label: "وضعیت",
      options: renderSelectOptions({ a: "فعال", b: "غیرفعال" }),
      valueKey: "id",
      labelKey: "title",
      control: control,
      rules: { required: "وضعیت را وارد کنید" },
    },
    {
      type: "date",
      name: "start_date",
      label: "تاریخ شروع ",
      control: control,
      rules: {
        required: "تاریخ شروع را وارد کنید",
      },
      gridProps: { md: 6 },
    },
    {
      type: "date",
      name: "end_date",
      label: "تاریخ پایان ",
      control: control,
      rules: {
        required: "تاریخ پایان را وارد کنید",
      },
      gridProps: { md: 6 },
    },

    {
      type: "textarea",
      name: "name",
      label: "توضیحات",
      control: control,
      gridProps: { md: 12 },
    },
  ];

  // handle on submit new Salon
  const onSubmit = (data) => {
    data = {
      name: data?.name,
      drivers: data?.drivers.map((item) => item.person.id),
      Drivers: data?.customers.map((item) => item.person.id),
    };

    AddSalonMutation.mutate(data);
  };
  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  useEffect(() => {
    console.log("users", users);
  }, [users]);

  return (
    <CollapseForm
      title="افزودن گروه جدید"
      open={openCollapse}
      onToggle={setOpenCollapse}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 4 }} />
            <Stack direction={"row"} alignItems={"center"} mt={3}>
              <Typography variant="h5">لیست سفید / اضافه کردن کابر</Typography>
              <IconButton
                sx={{ ml: 2 }}
                onClick={() => {
                  setUsers((prev) => [
                    ...prev,
                    { id: users.length + 1, phone: "", show: true },
                  ]);
                }}
              >
                <SvgSPrite icon="plus" size="large" MUIColor="primary" />
              </IconButton>
            </Stack>
            <Grid container mt={3}>
              {users
                .filter((i) => i.show === true)
                .map((item, index) => {
                  return (
                    <Grid
                      key={index}
                      item
                      md={3}
                      xs={12}
                      display={"flex"}
                      justifyContent={"center"}
                    >
                      <TextField
                        label="شماره موبایل"
                        variant="outlined"
                        value={
                          item?.phone !== "" ? enToFaNumber(item.phone) : ""
                        }
                        inputProps={{ maxLength: 11 }}
                        onChange={(e) => {
                          setUsers((prev) =>
                            prev.map((i) =>
                              i.id === item.id
                                ? {
                                    ...i,
                                    phone: e.target.value,
                                  }
                                : i
                            )
                          );
                        }}
                      />
                      <IconButton
                        sx={{ ml: 2 }}
                        onClick={() => {
                          setUsers((prev) =>
                            prev.map((i) =>
                              i.id === item.id
                                ? {
                                    ...i,
                                    show: false,
                                  }
                                : i
                            )
                          );
                        }}
                      >
                        <SvgSPrite icon="xmark" size="large" MUIColor="error" />
                      </IconButton>
                    </Grid>
                  );
                })}
            </Grid>
            <Stack mt={10} alignItems="flex-end">
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
    </CollapseForm>
  );
};
