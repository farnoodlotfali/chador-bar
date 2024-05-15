import { useEffect, useState } from "react";

import {
  Button,
  Stack,
  Grid,
  Box,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Switch,
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
  renderMessageTemplateType,
  renderSelectOptions1,
  truncateString,
} from "Utility/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { useForm } from "react-hook-form";

import Modal from "Components/versions/Modal";
import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { useMessageTemplate } from "hook/useMessageTemplate";
import { MESSAGE_TEMPLATE_TYPE } from "Constants";
import ShowMessageTemplateModal from "Components/modals/ShowMessageTemplateModal";
import { useHasPermission } from "hook/useHasPermission";

const HeadCells = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "key",
    label: "کلید ‌واژه",
  },
  {
    id: "title",
    label: "عنوان",
  },
  {
    id: "body",
    label: "محتوا",
  },
  {
    id: "status",
    label: "وضعیت",
  },
  {
    id: "type",
    label: "نوع",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

export default function MessageTemplates() {
  const queryClient = useQueryClient();
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const { hasPermission } = useHasPermission("message-template.update");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMsgTemplate, setSelectedMsgTemplate] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const {
    data: messageTemplate,
    isLoading,
    isFetching,
    isError,
  } = useMessageTemplate(searchParamsFilter);

  const deleteMsgTemplateMutation = useMutation(
    (id) => axiosApi({ url: `/message-template/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["messageTemplate"]);
        toast.success("با موفقیت حذف شد");
      },
    }
  );

  const changeStatusMsgTemplateMutation = useMutation(
    (formData) =>
      axiosApi({
        url: `/message-template/${formData?.id}`,
        method: "put",
        data: formData?.data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["messageTemplate"]);
        toast.success("با موفقیت آپدیت شد");
      },
    }
  );
  if (isError) {
    return <div className="">isError</div>;
  }

  const handleDeleteMsgTemplate = (value) => {
    setShowConfirmModal(true);
    setSelectedMsgTemplate(value);
  };

  // handle delete Msg Template
  const deleteMsgTemplate = async () => {
    try {
      const res = await deleteMsgTemplateMutation.mutateAsync(
        selectedMsgTemplate?.id
      );
      setShowConfirmModal(false);
      return res;
    } catch (error) {
      return error;
    }
  };

  const handleEditMsgTemplate = (value) => {
    setSelectedMsgTemplate(value);
    setShowModal("edit");
  };

  const handleShowMsgTemplate = (value) => {
    setSelectedMsgTemplate(value);
    setShowModal("detail");
  };

  const handleCloseModal = () => {
    setShowModal(null);
  };

  const handleChangeMsgStatus = async (item) => {
    try {
      const res = await changeStatusMsgTemplateMutation.mutateAsync({
        data: { status: !item?.status },
        id: item?.id,
      });
      return res;
    } catch (error) {
      return error;
    }
  };

  return (
    <>
      <HelmetTitlePage title="الگو‌های پیام" />
      <AddNewMessageTemplate />
      <SearchBoxMessageTemplate />
      <Table
        {...messageTemplate?.items}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={
          isLoading ||
          isFetching ||
          deleteMsgTemplateMutation.isLoading ||
          changeStatusMsgTemplateMutation.isLoading
        }
      >
        <TableBody>
          {messageTemplate?.items?.data?.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.key)}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.title)}
                </TableCell>
                <TableCell align="center" scope="row">
                  <Typography
                    variant="clickable"
                    fontSize="inherit"
                    onClick={() => handleShowMsgTemplate(row)}
                  >
                    {truncateString(row.body, 25)}
                  </Typography>
                </TableCell>
                <TableCell align="center" scope="row">
                  <Switch
                    checked={Boolean(row.status)}
                    onChange={() => {
                      handleChangeMsgStatus(row);
                    }}
                    disabled={!hasPermission}
                  />
                </TableCell>
                <TableCell align="center" scope="row">
                  {renderMessageTemplateType(row.type)}
                </TableCell>
                <TableCell scope="row">
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        onClick: () => handleEditMsgTemplate(row),
                        name: "message-template.update",
                      },
                      {
                        tooltip: "حذف",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => handleDeleteMsgTemplate(row),
                        name: "message-template.destroy",
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
        onAccept={deleteMsgTemplate}
        message="آیا از حذف محصول مطمئن هستید؟"
      />
      <EditModal
        show={showModal === "edit"}
        msgTemplate={selectedMsgTemplate}
        onClose={handleCloseModal}
      />

      <ShowMessageTemplateModal
        open={showModal === "detail"}
        item={selectedMsgTemplate}
        onClose={handleCloseModal}
      />
    </>
  );
}

const SearchBoxMessageTemplate = () => {
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
    {
      type: "select",
      name: "type",
      label: "نوع",
      options: MESSAGE_TEMPLATE_TYPE,
      labelKey: "name",
      valueKey: "value",
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
            <FormInputs inputs={Inputs} gridProps={{ md: 3 }} />
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

const AddNewMessageTemplate = () => {
  const [openCollapse, setOpenCollapse] = useState(false);
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();

  const AddMsgTemplateMutation = useMutation(
    (data) =>
      axiosApi({ url: "/message-template", method: "post", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["messageTemplate"]);
        toast.success("با موفقیت اضافه شد");
        reset();
      },
    }
  );
  const Inputs = [
    {
      type: "text",
      name: "title",
      label: "عنوان",
      control: control,
      rules: { required: "عنوان را وارد کنید" },
    },
    {
      type: "text",
      name: "key",
      label: "کلید واژه",
      control: control,
      rules: { required: "کلید واژه را وارد کنید" },
    },

    {
      type: "select",
      name: "type",
      label: "نوع",
      options: MESSAGE_TEMPLATE_TYPE,
      labelKey: "name",
      valueKey: "value",
      control: control,
      rules: { required: "نوع را وارد کنید" },
    },
    {
      type: "checkbox",
      name: "status",
      label: "فعال",
      control: control,
    },
    {
      type: "textarea",
      name: "body",
      label: "محتوا",
      control: control,
      rules: { required: "محتوا را وارد کنید" },
      gridProps: { md: 12 },
    },
  ];

  // handle on submit new msg template
  const onSubmit = async (data) => {
    try {
      const res = await AddMsgTemplateMutation.mutateAsync(data);
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
      title="افزودن الگوی پیام"
      name="message-template.store"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 3 }} />
            <Stack mt={5} alignItems="flex-end">
              <LoadingButton
                sx={{
                  height: "56px",
                  px: 4,
                }}
                variant="contained"
                loading={isSubmitting}
                type="submit"
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

const EditModal = ({ msgTemplate, show, onClose }) => {
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
    if (msgTemplate) {
      reset(msgTemplate);
    }
  }, [msgTemplate]);

  const updateMsgTemplateMutation = useMutation(
    (data) =>
      axiosApi({
        url: `/message-template/${msgTemplate.id}`,
        method: "put",
        data: data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["messageTemplate"]);
        toast.success("با موفقیت آپدیت شد");
        onClose();
      },
    }
  );

  const Inputs = [
    {
      type: "text",
      name: "title",
      label: "عنوان",
      control: control,
      rules: { required: "عنوان را وارد کنید" },
    },
    {
      type: "text",
      name: "key",
      label: "کلید واژه",
      control: control,
      rules: { required: "کلید واژه را وارد کنید" },
    },

    {
      type: "select",
      name: "type",
      label: "نوع",
      options: MESSAGE_TEMPLATE_TYPE,
      labelKey: "name",
      valueKey: "value",
      control: control,
      rules: { required: "نوع را وارد کنید" },
    },
    {
      type: "checkbox",
      name: "status",
      label: "فعال",
      control: control,
    },
    {
      type: "textarea",
      name: "body",
      label: "محتوا",
      control: control,
      rules: { required: "محتوا را وارد کنید" },
      gridProps: { md: 12 },
    },
  ];

  // handle on submit
  const onSubmit = async (data) => {
    try {
      const res = await updateMsgTemplateMutation.mutateAsync(data);
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
    msgTemplate && (
      <Modal open={show} onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2 }}>
            <FormContainer
              data={watch()}
              setData={handleChange}
              errors={errors}
            >
              <FormInputs inputs={Inputs} gridProps={{ md: 2.5 }}>
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
                    ذخیره
                  </LoadingButton>
                </Grid>
              </FormInputs>
            </FormContainer>
          </Box>
        </form>
      </Modal>
    )
  );
};
