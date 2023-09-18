/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";

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
  Switch,
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
  enToFaNumber,
  removeInvalidValues,
  renderSelectOptions,
  renderSelectOptions1,
} from "Utility/utils";
import { Helmet } from "react-helmet-async";
import { useUser } from "hook/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { axiosApi } from "api/axiosApi";
import Modal from "Components/versions/Modal";
import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import MultiFleets from "Components/multiSelects/MultiFleets";
import { useShippingCompany } from "hook/useShippingCompany";
import { useFleetGroup } from "hook/useFleetGroup";
import MultiGroup from "Components/multiSelects/MultiGroup";
import { useRole } from "hook/useRole";
import MultiShippingCompany from "Components/multiSelects/MultiShippingCompany";
import FormTypography from "Components/FormTypography";

const TABLE_HEAD_CELLS = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "name",
    label: "نام و نام خانوادگی",
  },
  {
    id: "email",
    label: "ایمیل",
  },
  {
    id: "role",
    label: "نقش",
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

export default function UserList() {
  const queryClient = useQueryClient();
  const [showDetails, setShowDetails] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();

  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();

  const {
    data: allUsers,
    isLoading,
    isFetching,
    isError,
  } = useUser(searchParamsFilter);

  const {
    data: allFleetGroup,
    isLoading: isLoadingGroup,
    isError: isErrorGroup,
  } = useFleetGroup(searchParamsFilter);
  const { data: shippingCompanies, isLoading: ShCIsLoading } =
    useShippingCompany();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [user, setUser] = useState({});
  const [userToDelete, setUserToDelete] = useState(null);

  const deleteUserMutation = useMutation(
    (id) => axiosApi({ url: `/user/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        reset();
        queryClient.invalidateQueries(["user"]);
        toast.success("با موفقیت حذف شد");
      },
    }
  );

  if (
    isLoading ||
    isFetching ||
    isLoadingGroup ||
    ShCIsLoading ||
    deleteUserMutation.isLoading
  ) {
    return <LoadingSpinner />;
  }
  if (isError || isErrorGroup || deleteUserMutation.isError) {
    return <div className="">isError</div>;
  }

  const { items, roles } = allUsers;

  const changeUserStatus = (id) => {
    // Inertia.visit(`user-change-status/${id}`, {
    //     method: "post",
    //     preserveScroll: true,
    //     preserveState: true,
    // });
  };

  // Delete user
  const handleDeleteUser = (id) => {
    setShowConfirmModal(true);
    setUserToDelete(id);
  };
  const deleteUser = () => {
    deleteUserMutation.mutate(userToDelete);
    setShowConfirmModal(false);
  };

  // Edit user
  const handleEditUser = (user) => {
    setShowEditModal(true);
    setUser(user);
  };

  return (
    <>
      <Helmet title="پنل دراپ - کاربران" />

      <AddNewUser />
      <SearchBoxUser />
      <GroupModal
        open={showDetails}
        shippingCompanies={shippingCompanies}
        onClose={() => {
          setShowDetails(false);
        }}
        groupData={allFleetGroup}
      />
      <Table
        {...items}
        headCells={TABLE_HEAD_CELLS}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
      >
        <TableBody>
          {items.data.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.first_name + " " + row.last_name ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.email}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.roles[0]?.slug || "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  <Switch
                    checked={Boolean(row.status)}
                    onChange={() => {
                      changeUserStatus(row.id);
                    }}
                  />
                </TableCell>
                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        onClick: () => handleEditUser(row),
                      },
                      {
                        tooltip: "حذف",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => handleDeleteUser(row.id),
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
        onAccept={deleteUser}
        message="آیا از حذف کاربر مطمئن هستید؟"
      />

      <EditUserModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
      />
    </>
  );
}

const SearchBoxUser = () => {
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
              <Button variant="contained" type="submit">
                اعمال فیلتر
              </Button>
            </Stack>
          </FormContainer>
        </Box>
      </form>
    </CollapseForm>
  );
};

const GroupModal = ({ open, onClose, data, shippingCompanies }) => {
  const shippingCompany = shippingCompanies?.data.find(
    (item) => item.id === data?.shipping_company_id
  );
  return (
    <Modal open={open} onClose={onClose}>
      <FormTypography>گروه ناوگان</FormTypography>
      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {data ? (
            data?.items?.data?.map((fleet) => {
              return (
                <Stack direction={"row"} sx={{ justifyContent: "flex-end" }}>
                  <Button
                    sx={{
                      width: "150px",
                      height: "56px",
                    }}
                    variant="contained"
                    type="submit"
                  >
                    <Stack
                      direction={"row"}
                      sx={{ justifyContent: "space-between", padding: 2 }}
                    >
                      <Typography>نام گروه</Typography>
                      <Typography>{data?.name}</Typography>
                    </Stack>
                    <Stack
                      direction={"row"}
                      sx={{ justifyContent: "space-between", padding: 2 }}
                    >
                      <Typography>نام شرکت حمل</Typography>
                      <Typography> {shippingCompany?.name ?? "-"}</Typography>
                    </Stack>
                  </Button>
                </Stack>
              );
            })
          ) : (
            <Typography pt={2} pl={2}>
              ناوگانی یافت نشد
            </Typography>
          )}
        </Grid>
      </Box>
    </Modal>
  );
};
const AddNewUser = () => {
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

  const { data: allRoles } = useRole();
  const AddUserMutation = useMutation(
    (data) => axiosApi({ url: "/user", method: "post", data: data }),
    {
      onSuccess: () => {
        reset();
        queryClient.invalidateQueries(["user"]);
        toast.success("با موفقیت اضافه شد");
      },
    }
  );

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
      label: "نام خانوادگی",
      control: control,
      rules: { required: "نام خانوادگی را وارد کنید" },
    },
    {
      type: "number",
      name: "mobile",
      label: "شماره موبایل",
      control: control,
      rules: { required: "شماره موبایل را وارد کنید" },
    },
    {
      type: "email",
      name: "email",
      label: "ایمیل",
      control: control,
      rules: { required: "ایمیل را وارد کنید" },
    },
    {
      type: "select",
      name: "roles",
      valueKey: "id",
      labelKey: "title",
      label: "نقش",
      options: renderSelectOptions1(allRoles?.items, "slug"),
      control: control,
      rules: { required: "نقش را وارد کنید" },
      gridProps: { md: 4 },
    },
    {
      type: "custom",
      customView: (
        <MultiShippingCompany
          control={control}
          name={"shipping_company"}
          label="شرکت حمل و نقل"
          needMoreInfo={true}
        />
      ),

      gridProps: { md: 4 },
    },
    {
      type: "custom",
      customView: (
        <MultiGroup
          control={control}
          name={"fleet_group"}
          label="گروه ناوگان"
          needMoreInfo={true}
        />
      ),
      gridProps: { md: 4 },
    },

    {
      type: "password",
      name: "password",
      label: "رمز",
      control: control,
      rules: { required: " رمز را وارد کنید" },
    },
    {
      type: "password",
      name: "password_confirmation",
      label: "تایید رمز",
      control: control,
      rules: { required: "تایید رمز را وارد کنید" },
    },
  ];

  // handle on submit new user
  const onSubmit = (data) => {
    console.log("data222", data);
    data = {
      ...data,
      fleet_group_id: data?.fleet_group?.id,
      shipping_company_id: data?.shipping_company?.id,
      role: data?.roles,
    };
    console.log("data222", data);
    if (data.password_confirmation !== data.password) {
      toast.error("عدم تطابق رمز با تایید رمز");
      return;
    }
    data.status = "1";
    data = JSON.stringify(data);
    AddUserMutation.mutate(data);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <CollapseForm
      onToggle={setOpenCollapse}
      open={openCollapse}
      title="افزودن کاربر "
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

const EditUserModal = ({ user, open, onClose }) => {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();
  const { data: allRoles } = useRole();
  useEffect(() => {
    console.log("user", user);
    reset(user);
    setValue("roles", user?.roles?.length > 0 ? user?.roles[0]?.id : 0);
  }, [user]);

  const editUserMutation = useMutation(
    (data) => axiosApi({ url: `/user/${user.id}`, method: "put", data: data }),
    {
      onSuccess: () => {
        reset();
        queryClient.invalidateQueries(["user"]);
        toast.success("با موفقیت اضافه شد");
        onClose();
      },
    }
  );

  const Inputs = [
    {
      type: "text",
      name: "first_name",
      label: "نام",
      control: control,
      rules: {},
    },
    {
      type: "text",
      name: "last_name",
      label: "نام خانوادگی",
      control: control,
      rules: {},
    },
    {
      type: "number",
      name: "mobile",
      label: "شماره موبایل",
      control: control,
      rules: {},
    },
    {
      type: "email",
      name: "email",
      label: "ایمیل",
      control: control,
      rules: {},
    },
    {
      type: "select",
      name: "roles",
      valueKey: "id",
      labelKey: "title",
      label: "نقش",
      options: renderSelectOptions1(allRoles?.items, "slug"),
      control: control,
      rules: { required: "نقش را وارد کنید" },
      gridProps: { md: 4 },
    },
    {
      type: "custom",
      customView: (
        <MultiShippingCompany
          control={control}
          name={"shipping_company"}
          label="شرکت حمل و نقل"
          needMoreInfo={true}
        />
      ),

      gridProps: { md: 4 },
    },
    {
      type: "custom",
      customView: (
        <MultiGroup
          control={control}
          name={"fleet_group"}
          label="گروه ناوگان"
          needMoreInfo={true}
        />
      ),
      gridProps: { md: 4 },
    },

    {
      type: "password",
      name: "password",
      label: "رمز",
      control: control,
      rules: { required: " رمز را وارد کنید" },
    },
    {
      type: "password",
      name: "password_confirmation",
      label: "تایید رمز",
      control: control,
      rules: { required: "تایید رمز را وارد کنید" },
    },
  ];
  // const Inputs = [
  //   {
  //     type: "text",
  //     name: "first_name",
  //     label: "نام",
  //     control: control,
  //     rules: {},
  //   },
  //   {
  //     type: "text",
  //     name: "last_name",
  //     label: "نام خانوادگی",
  //     control: control,
  //     rules: {},
  //   },
  //   {
  //     type: "number",
  //     name: "mobile",
  //     label: "شماره موبایل",
  //     control: control,
  //     rules: {},
  //   },
  //   {
  //     type: "password",
  //     name: "password",
  //     label: "رمز",
  //     control: control,
  //     rules: {},
  //   },
  //   {
  //     type: "password",
  //     name: "password_confirmation",
  //     label: "تایید رمز",
  //     control: control,
  //     rules: {},
  //   },
  //   {
  //     type: "email",
  //     name: "email",
  //     label: "ایمیل",
  //     control: control,
  //     rules: {},
  //   },
  // ];

  // handle on submit new user
  const onSubmit = (data) => {
    data = {
      ...data,
      fleet_group_id: data?.fleet_group?.id,
      shipping_company_id: data?.shipping_company?.id,
      role: data?.roles,
    };
    if (data.password_confirmation !== data.password) {
      toast.error("عدم تطابق رمز با تایید رمز");
      return;
    }
    data.status = "1";
    data = JSON.stringify(data);
    editUserMutation.mutate(data);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <FormTypography>ویرایش کاربر</FormTypography>

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
