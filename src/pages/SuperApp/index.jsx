import { useState } from "react";

import {
  Stack,
  Box,
  Typography,
  IconButton,
  Grid,
  TextField,
  Tooltip,
  TableCell,
  TableBody,
  TableRow,
  Button,
  FormControlLabel,
  Checkbox,
  Switch,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";

import { FormContainer, FormInputs } from "Components/Form";

import {
  enToFaNumber,
  faToEnNumber,
  handleDate,
  renderChip,
  renderSelectOptions,
  validateNumberInput,
} from "Utility/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import CollapseForm from "Components/CollapseForm";
import ActionConfirm from "Components/ActionConfirm";

import { SvgSPrite } from "Components/SvgSPrite";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { useSuperAppGroup } from "hook/useSuperAppGroup";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import Table from "Components/versions/Table";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import TableActionCell from "Components/versions/TableActionCell";
import InputCheckBoxEndAdornment from "Components/InputCheckBoxEndAdornment";
import MultiSuperAppClient from "Components/multiSelects/MultiSuperAppClient";

const HeadCells = [
  {
    id: "title",
    label: "عنوان",
  },
  {
    id: "status",
    label: "وضعیت",
  },
  {
    id: "default",
    label: "پیش‌فرض",
  },
  {
    id: "start_date",
    label: "تاریخ شروع",
  },
  {
    id: "end_date",
    label: "تاریخ پایان",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

export default function SuperAppList() {
  const queryClient = useQueryClient();
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const {
    data: allSuperAppGroup,
    isLoading,
    isFetching,
  } = useSuperAppGroup(searchParamsFilter);
  const [superAppGroup, setSuperAppGroup] = useState(null);
  const [acceptRemoveModal, setAcceptRemoveModal] = useState(false);

  // Mutations
  const deleteMutation = useMutation(
    (id) => axiosApi({ url: `/super-app/group/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["superApp"]);
        toast.success("درخواست شما با موفقیت انجام شد");
      },
      onError: () => {
        toast.error("خطا  ");
      },
    }
  );

  // set default
  const setDefaultMutation = useMutation(
    (id) => axiosApi({ url: `/super-app/default-group/${id}`, method: "put" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["superApp"]);
        toast.success("درخواست شما با موفقیت انجام شد");
      },
      onError: () => {
        toast.error("خطا  ");
      },
    }
  );

  // change status
  const changeStatusMutation = useMutation(
    (formData) =>
      axiosApi({
        url: `/super-app/group/${formData.id}`,
        method: "put",
        data: formData.data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["superApp"]);
        toast.success("با موفقیت تغییرات اعمال شد");
      },
    }
  );

  const showModalToRemove = (superAppGroup) => {
    setSuperAppGroup(superAppGroup);
    setAcceptRemoveModal(true);
  };

  // Remove superAppGroup
  const handleRemoveBeneficiary = () => {
    deleteMutation.mutate(superAppGroup.id);
    setAcceptRemoveModal(false);
    setSuperAppGroup(null);
  };

  // change status group
  const handleChangeStatus = async (id, value) => {
    try {
      const res = await changeStatusMutation.mutateAsync({
        id: id,
        data: {
          status: value,
        },
      });

      return res;
    } catch (error) {
      return error;
    }
  };

  return (
    <>
      <HelmetTitlePage title="مدیریت سوپراپ" />

      <AddNewSuperGroup />

      <Table
        {...allSuperAppGroup?.items}
        headCells={HeadCells}
        filters={searchParamsFilter}
        loading={
          isLoading ||
          isFetching ||
          deleteMutation.isLoading ||
          changeStatusMutation.isLoading ||
          setDefaultMutation.isLoading
        }
        setFilters={setSearchParamsFilter}
      >
        <TableBody>
          {allSuperAppGroup?.items?.data?.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.title) ?? "-"}
                </TableCell>
                <TableCell align="center">
                  <Switch
                    defaultChecked
                    color="info"
                    checked={row?.status}
                    onChange={(e) => {
                      handleChangeStatus(row.id, e.target.checked);
                    }}
                  />
                </TableCell>

                {row?.default ? (
                  <TableCell align="center">
                    <SvgSPrite icon="check" MUIColor="success" />
                  </TableCell>
                ) : (
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TableActionCell
                        buttons={[
                          {
                            tooltip: "پیش‌فرض",
                            color: "primary",
                            icon: "check",
                            onClick: () => setDefaultMutation.mutate(row.id),
                          },
                        ]}
                      />
                    </Box>
                  </TableCell>
                )}

                <TableCell align="center">
                  {row.start_date ? (
                    <Typography variant="subtitle2">
                      {handleDate(row.start_date, "YYYY/MM/DD")}
                    </Typography>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell align="center">
                  {row.end_date ? (
                    <Typography variant="subtitle2">
                      {handleDate(row.end_date, "YYYY/MM/DD")}
                    </Typography>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "بخش‌ها",
                        color: "primary",
                        icon: "puzzle",
                        link: `/super-app/section?group_id=${row.id}`,
                        name: "section.index",
                      },
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        link: `/super-app/${row.id}`,
                        name: "group.update",
                      },
                      {
                        tooltip: "حذف کردن",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => showModalToRemove(row),
                        name: "group.destroy",
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
        message="ایا مطمئن هستید؟"
        open={acceptRemoveModal}
        onClose={() => setAcceptRemoveModal(false)}
        onAccept={handleRemoveBeneficiary}
      />
    </>
  );
}

const AddNewSuperGroup = () => {
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

  const addNewSuperGroupMutation = useMutation(
    (data) => axiosApi({ url: "/super-app/group", method: "post", data: data }),
    {
      onSuccess: () => {
        reset();
        queryClient.invalidateQueries(["superApp"]);
        toast.success("با موفقیت اضافه شد");
      },
    }
  );

  const Inputs = [
    {
      type: "text",
      name: "title",
      label: "عنوان گروه",
      control: control,
      rules: {
        required: "عنوان گروه را وارد کنید",
      },
    },
    {
      type: "select",
      name: "default",
      label: "نوع",
      options: renderSelectOptions({ 1: "پیشفرض", 0: "عادی" }),
      valueKey: "id",
      labelKey: "title",
      control: control,
    },
    {
      type: "select",
      name: "status",
      label: "وضعیت",
      options: renderSelectOptions({ 1: "فعال", 0: "غیرفعال" }),
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
    },
    {
      type: "date",
      name: "end_date",
      label: "تاریخ پایان ",
      control: control,
    },
    {
      type: "custom",
      customView: <MultiSuperAppClient control={control} name={"clients"} />,
    },
    {
      type: "textarea",
      name: "description",
      label: "توضیحات",
      control: control,
      gridProps: { md: 12 },
    },
  ];

  // handle on submit new super group
  const onSubmit = async (data) => {
    data = {
      ...data,
      end_date: data?.end_date?.end_date,
      start_date: data?.start_date?.start_date,
      default: Number(data?.default),
      status: Number(data?.status),
      clients: data?.clients.map((item) => item.serial),
    };

    try {
      const res = await addNewSuperGroupMutation.mutateAsync(data);
      return res;
    } catch (error) {
      return error;
    }
  };
  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "white_lists",
  });
  return (
    <CollapseForm
      title="افزودن گروه جدید"
      open={openCollapse}
      onToggle={setOpenCollapse}
      name="group.store"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 4 }}>
              <Grid item xs={12} display="flex" alignItems="center" mt={3}>
                <Typography variant="h5" fontWeight={600}>
                  لیست سفید
                </Typography>

                <Tooltip title="اضافه" placement="left" arrow>
                  <IconButton
                    sx={{ ml: 2 }}
                    onClick={() => {
                      append("09");
                    }}
                  >
                    <SvgSPrite icon="plus" size="large" MUIColor="primary" />
                  </IconButton>
                </Tooltip>
              </Grid>
              {fields.map((item, index) => {
                return (
                  <Grid
                    key={item.id}
                    item
                    md={3}
                    xs={12}
                    display="flex"
                    justifyContent="center"
                  >
                    <Controller
                      name={`white_lists.${index}`}
                      control={control}
                      rules={{
                        required: "شماره موبایل را وارد کنید",
                        maxLength: {
                          value: 11,
                          message: "شماره موبایل باید 11 رقمی باشد",
                        },
                        minLength: {
                          value: 11,
                          message: "شماره موبایل باید 11 رقمی باشد",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          label="موبایل"
                          variant="outlined"
                          error={!!error}
                          helperText={error?.message ?? ""}
                          InputProps={{
                            endAdornment: (
                              <Tooltip title="حذف" arrow placement="top">
                                <IconButton
                                  size="small"
                                  onClick={() => remove(index)}
                                >
                                  <SvgSPrite
                                    icon="xmark"
                                    size="small"
                                    MUIColor="error"
                                  />
                                </IconButton>
                              </Tooltip>
                            ),
                          }}
                          onChange={(e) => {
                            if (!validateNumberInput(e.target.value)) {
                              return;
                            }

                            if (11 >= e.target.value.length) {
                              field.onChange(
                                faToEnNumber(e.target.value.replaceAll(",", ""))
                              );
                            }
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          value={enToFaNumber(field.value)}
                          inputRef={field.ref}
                          autoFocus={true}
                        />
                      )}
                    />
                  </Grid>
                );
              })}
            </FormInputs>
            <Stack mt={5} alignItems="flex-end">
              <LoadingButton
                variant="contained"
                type="submit"
                loading={isSubmitting}
                color={Object.keys(errors).length ? "error" : "primary"}
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
