import { useState, useEffect } from "react";

import {
  Button,
  Stack,
  Typography,
  Grid,
  Box,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";

import Table from "Components/versions/Table";
import Modal from "Components/versions/Modal";
import TableActionCell from "Components/versions/TableActionCell";
import ActionConfirm from "Components/ActionConfirm";
import SearchInput from "Components/SearchInput";
import { FormContainer, FormInputs } from "Components/Form";

import { enToFaNumber, removeInvalidValues } from "Utility/utils";
import { usePermission } from "hook/usePermission";
import { useRole } from "hook/useRole";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import FormTypography from "Components/FormTypography";
import { SvgSPrite } from "Components/SvgSPrite";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import HelmetTitlePage from "Components/HelmetTitlePage";

const TABLE_HEAD_CELLS = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "name",
    label: "نام",
  },
  {
    id: "slug",
    label: "عنوان",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

const SelectPermissions = ({ data = [], setData, name }) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [searchVal, setSearchVal] = useState("");
  const {
    data: allPermissions,
    isError,
    isLoading,
    isFetching,
  } = usePermission(filters);

  const toggleShowModal = () => setOpen((prev) => !prev);

  const handleClick = (valName) => {
    let newData;
    if (data.includes(valName)) {
      newData = data.filter((id) => id !== valName);
    } else {
      newData = [...data, valName];
    }
    setData(name, newData);
  };
  const handleSearch = (value) => {
    setFilters({ q: value });
  };

  return (
    <>
      <Modal open={open} onClose={toggleShowModal}>
        <Stack direction="row" alignItems="center" spacing={1} mb={5}>
          <SvgSPrite icon="lock-open" MUIColor="primary" s />
          <Typography>مدیریت دسترسی ها</Typography>
        </Stack>

        <SearchInput
          sx={{ width: "100%" }}
          placeholder="جستجو"
          onEnter={handleSearch}
          searchVal={searchVal}
          setSearchVal={setSearchVal}
        />
        {isLoading || isFetching ? (
          <Box sx={{ paddingY: 3 }}>در حال فراخوانی اطلاعات...</Box>
        ) : !isError ? (
          <Grid
            container
            sx={{ maxHeight: "300px", overflowY: "scroll", mt: 2 }}
          >
            {allPermissions.items.data.map((row) => {
              const isSelected = data.includes(row.id);

              return (
                <Grid item sx={12} md={4} key={row.id}>
                  <Button
                    color="secondary"
                    onClick={() => handleClick(row.id)}
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      borderRadius: "0",
                    }}
                  >
                    <Typography>{row.slug}</Typography>
                    <Checkbox checked={isSelected} />
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        ) : null}
      </Modal>

      <Button
        sx={{ width: "100%", height: "56px" }}
        variant="outlined"
        color="secondary"
        onClick={toggleShowModal}
      >
        انتخاب دسترسی ها
      </Button>
    </>
  );
};

export default function Role() {
  const queryClient = useQueryClient();

  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [role, setRole] = useState(null);

  const {
    data: allRoles,
    isFetching,
    isLoading,
    isError,
  } = useRole(searchParamsFilter);

  const deleteRoleMutation = useMutation(
    (id) => axiosApi({ url: `/role/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["role"]);
        toast.success("با موفقیت حذف شد");
      },
    }
  );

  const editRoleMutation = useMutation((data) =>
    axiosApi({ url: `/role/${role.id}`, method: "put", data: data })
  );

  if (isError) {
    return <div className="">isError</div>;
  }

  // Delete role
  const handleDeleteRole = (role) => {
    setShowConfirmModal(true);
    setRole(role);
  };
  const deleteRole = () => {
    deleteRoleMutation.mutate(role.id);
    setShowConfirmModal(false);
  };

  // Edit role
  const handleEditRole = (role) => {
    setShowEditModal(true);
    setRole(role);
  };

  return (
    <>
      <HelmetTitlePage title="نقش ها" />

      <AddNewRole />
      <SearchBoxRole />

      <Table
        {...allRoles?.items}
        headCells={TABLE_HEAD_CELLS}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={
          isLoading ||
          isFetching ||
          deleteRoleMutation.isLoading ||
          editRoleMutation.isLoading
        }
      >
        <TableBody>
          {allRoles?.items?.data?.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.slug}
                </TableCell>
                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        onClick: () => handleEditRole(row),
                        name: "role.update",
                      },
                      {
                        tooltip: "حذف",
                        color: "error",
                        icon: "trash-xmark",
                        name: "role.destroy",
                        onClick: () => handleDeleteRole(row),
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
        onAccept={deleteRole}
        message="آیا مطمئن هستید؟"
      />

      <EditRoleModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        role={role}
        editRoleMutation={editRoleMutation}
      />
    </>
  );
}

const SearchBoxRole = () => {
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

const AddNewRole = () => {
  const queryClient = useQueryClient();
  const [openCollapse, setOpenCollapse] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();

  const addRoleMutation = useMutation(
    (data) => axiosApi({ url: "/role", method: "post", data: data }),
    {
      onSuccess: () => {
        reset("");
        queryClient.invalidateQueries(["role"]);
        toast.success("با موفقیت ثبت شد");
      },
    }
  );

  // handle on submit new role
  const onSubmit = (data) => {
    data = JSON.stringify(data);
    addRoleMutation.mutate(data);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  const Inputs = [
    {
      type: "text",
      name: "name",
      label: "نام",
      control: control,
      rules: { required: "نام را وارد کنید" },
    },
    {
      type: "text",
      name: "slug",
      label: "عنوان",
      control: control,
      rules: { required: "عنوان را وارد کنید" },
    },
    {
      type: "custom",
      name: "permissions",
      customView: (
        <SelectPermissions
          data={watch("permissions") ?? []}
          setData={handleChange}
          name={"permissions"}
        />
      ),
      gridProps: { md: 2 },
    },
  ];

  return (
    <CollapseForm
      onToggle={setOpenCollapse}
      open={openCollapse}
      title="افزودن نقش"
      name="role.store"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs}>
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
    </CollapseForm>
  );
};

const EditRoleModal = ({ role, open, onClose, editRoleMutation }) => {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    getValues,
  } = useForm();

  useEffect(() => {
    if (role && !!role.permissions) {
      let newPermissions = [];
      role?.permissions?.forEach((item) => {
        newPermissions.push(item.id);
      });

      role.permissions = newPermissions;
      reset(role);
    }
  }, [role]);

  // handle on submit new role
  const onSubmit = async (data) => {
    data = JSON.stringify(data);
    try {
      const res = await editRoleMutation.mutateAsync(data);
      reset();
      queryClient.invalidateQueries(["role"]);
      toast.success("با موفقیت تغییر یافت");
      onClose();

      return res;
    } catch (error) {
      console.log(error);
    }
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  const Inputs = [
    {
      type: "text",
      name: "name",
      label: "نام",
      control: control,
      rules: { required: "نام را وارد کنید" },
    },
    {
      type: "text",
      name: "slug",
      label: "عنوان",
      control: control,
      rules: { required: "عنوان را وارد کنید" },
    },
    {
      type: "custom",
      name: "permissions",
      customView: (
        <SelectPermissions
          data={watch("permissions") ?? []}
          setData={handleChange}
          name={"permissions"}
        />
      ),
      gridProps: { md: 2 },
    },
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <FormTypography>ویرایش نقش</FormTypography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer
            data={getValues()}
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
                  loading={isSubmitting}
                  type="submit"
                >
                  ویرایش
                </LoadingButton>
              </Grid>
            </FormInputs>
          </FormContainer>
        </Box>
      </form>
    </Modal>
  );
};
