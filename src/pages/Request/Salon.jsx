import { useEffect, useState } from "react";

import {
  Stack,
  Box,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Button,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";
import LoadingSpinner from "Components/versions/LoadingSpinner";

import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import ActionConfirm from "Components/ActionConfirm";
import { FormContainer, FormInputs } from "Components/Form";
import { enToFaNumber, removeInvalidValues } from "Utility/utils";
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
import FormTypography from "Components/FormTypography";

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

export default function SalonList() {
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
  const handleEditSalon = (item) => {
    setSelectedSalon(item);
    setShowModal("editSalon");
  };

  const handleCloseModal = () => {
    setShowModal(null);
  };

  const handleDeletePersonSalon = async (data, type = "drivers") => {
    try {
      const res = await deletePersonSalonMutation.mutateAsync(data);
      setSelectedSalon((prev) => ({
        ...prev,
        [type]: prev?.[type]?.filter(
          (item) => item.person_id !== data.person_id
        ),
      }));
      return res;
    } catch (error) {
      return error;
    }
  };

  const handleAddPersonSalon = async (data, type = "drivers", persons) => {
    try {
      const res = await addPersonSalonMutation.mutateAsync(data);
      setSelectedSalon((prev) => ({
        ...prev,
        [type]: [...prev?.[type], ...persons],
      }));
      return res;
    } catch (error) {
      return error;
    }
  };

  return (
    <>
      <Helmet title="پنل دراپ - لیست سالن بار" />
      <AddNewSalon />
      <SearchBoxSalon />
      <Table
        {...Salon}
        headCells={headCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
      >
        <TableBody>
          {Salon?.items?.data?.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>

                <TableCell align="center" scope="row">
                  {row?.name}
                </TableCell>

                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        onClick: () => handleEditSalon(row),
                      },
                      {
                        tooltip: "رانندگان",
                        color: "info",
                        icon: "people-group",
                        onClick: () => handleSalonDrivers(row),
                      },

                      {
                        tooltip: "صاحبان بار",
                        color: "secondary",
                        icon: "family-pants",
                        onClick: () => handleSalonOwners(row),
                      },
                      {
                        tooltip: "درخواست ها",
                        color: "success",
                        icon: "list-check",
                        link: `/request?salon=${row.id}`,
                      },
                      {
                        tooltip: "حذف",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => handleDeleteSalon(row),
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
      <EditSalonModal
        show={showModal === "editSalon"}
        onClose={handleCloseModal}
        salon={selectedSalon}
      />
    </>
  );
}

const EditSalonModal = ({ show, onClose, salon }) => {
  const queryClient = useQueryClient();
  const {
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    handleSubmit,
    reset,
  } = useForm();

  useEffect(() => {
    reset(salon);
  }, [salon]);

  const updateSalonMutation = useMutation(
    (data) => axiosApi({ url: `salon/${salon.id}`, method: "put", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["salon"]);

        toast.success("با موفقیت آپدیت شد");
      },
    }
  );

  const Inputs = [
    {
      type: "text",
      name: "name",
      label: "نام سالن",
      control: control,
      rules: {
        required: { value: true, message: "نام سالن را وارد کنید" },
      },
    },
  ];

  // handle on submit new vehicle
  const onSubmit = async (data) => {
    try {
      const res = await updateSalonMutation.mutateAsync(data);
      onClose();
      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <Modal onClose={onClose} open={show} maxWidth={"sm"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormTypography>ویرایش {salon?.name}</FormTypography>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <FormInputs inputs={Inputs} gridProps={{ md: 12 }} />

          <Stack mt={2} alignItems="flex-end">
            <LoadingButton
              variant="contained"
              type="submit"
              loading={isSubmitting}
            >
              ذخیره
            </LoadingButton>
          </Stack>
        </FormContainer>
      </form>
    </Modal>
  );
};

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

  useEffect(() => {
    if (salon?.drivers) {
      handleChange("drivers", salon?.drivers);
    }
  }, [salon]);

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

  // handle on submit new driver to Salon
  const onSubmit = (data) => {
    const distinctDrivers = data?.drivers.filter((obj) => {
      return !salon?.drivers.find((item) => {
        return item.person_id === obj.person_id;
      });
    });

    handleAdd(
      {
        salon_id: salon.id,
        persons: distinctDrivers.map((person) => person.person.id),
        role: "driver",
      },
      "drivers",
      distinctDrivers
    );
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
    handleDelete(
      {
        salon_id: salon.id,
        person_id: SelectedDriver.person_id,
      },
      "drivers"
    );
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

      {showModal && (
        <Modal
          onClose={handleCloseModal}
          open={showModal === "addNewDriverSalon"}
          maxWidth={"sm"}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h5" mb={2}>
              افزودن راننده به {salon?.name}
            </Typography>
            <FormContainer
              data={watch()}
              setData={handleChange}
              errors={errors}
            >
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
      )}
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
  useEffect(() => {
    if (salon?.owners) {
      setValue("owners", salon?.owners);
    }
  }, [salon]);
  const Inputs = [
    {
      type: "custom",
      customView: (
        <MultiCustomers
          control={control}
          name={"owners"}
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
    const distinctOwners = data?.owners.filter((obj) => {
      return !salon?.owners.find((item) => {
        return item.person_id === obj.person_id;
      });
    });

    handleAdd(
      {
        salon_id: salon.id,
        persons: distinctOwners.map((person) => person.person.id),
        role: "owner",
      },
      "owners",
      distinctOwners
    );
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
    handleDelete(
      {
        salon_id: salon.id,
        person_id: SelectedOwner.person_id,
      },
      "owners"
    );
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
                          icon:  "trash-xmark",
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
            افزودن صاحب بار به {salon?.name}
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
      label: "نام سالن",
      control: control,
      rules: {
        required: { value: true, message: "نام سالن را وارد کنید" },
      },
    },
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

  return (
    <CollapseForm
      title="افزودن سالن"
      open={openCollapse}
      onToggle={setOpenCollapse}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 4 }} />

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
