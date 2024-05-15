import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  Stack,
  Switch,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CollapseForm from "Components/CollapseForm";
import { FormContainer, FormInputs } from "Components/Form";
import HelmetTitlePage from "Components/HelmetTitlePage";

import LoadingSpinner from "Components/versions/LoadingSpinner";
import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import {
  enToFaNumber,
  removeInvalidValues,
  renderSelectOptions,
} from "Utility/utils";
import { axiosApi } from "api/axiosApi";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ActionConfirm from "Components/ActionConfirm";
import Modal from "Components/versions/Modal";
import FormTypography from "Components/FormTypography";
import { useSuperAppItem } from "hook/useSuperAppItem";
import { ChooseSuperAppSection } from "Components/choosers/superApp/ChooseSection";
import InputCheckBoxEndAdornment from "Components/InputCheckBoxEndAdornment";
import { SvgSPrite } from "Components/SvgSPrite";

const HeadCells = [
  {
    id: "order",
    label: "ترتیب",
    sortable: true,
  },
  {
    id: "title",
    label: "عنوان",
    sortable: true,
  },
  {
    id: "section_id",
    label: "بخش",
    sortable: true,
  },
  {
    id: "image_url",
    label: "عکس",
  },
  {
    id: "slug",
    label: "اسلاگ",
    sortable: true,
  },
  {
    id: "web_view",
    label: "نمای وب",
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

const ItemsList = () => {
  const queryClient = useQueryClient();

  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const {
    data: allSuperAppItems,
    isLoading,
    isFetching,
  } = useSuperAppItem(searchParamsFilter);

  const [acceptRemoveModal, setAcceptRemoveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [item, setItem] = useState(null);

  // Mutations
  const deleteItemMutation = useMutation(
    (id) => axiosApi({ url: `/super-app/item/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["superApp"]);
        toast.success("درخواست شما با موفقیت پاک شد");
      },
      onError: () => {
        toast.error("خطا  ");
      },
    }
  );

  // change web view
  const changeWebViewMutation = useMutation(
    (formData) =>
      axiosApi({
        url: `/super-app/item/${formData.id}`,
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

  // change item order
  const changeItemOrderMutation = useMutation(
    (formData) =>
      axiosApi({
        url: `/super-app/item-change-position/${formData.id}`,
        method: "post",
        data: formData.data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["superApp"]);
        toast.success("با موفقیت تغییرات اعمال شد");
      },
    }
  );

  // duplicate an item
  const duplicateItemMutation = useMutation(
    (id) =>
      axiosApi({
        url: `/super-app/item-duplicate/${id}`,
        method: "post",
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["superApp"]);
        toast.success("با موفقیت تغییرات اعمال شد");
      },
    }
  );

  const showModalToRemove = (item) => {
    setItem(item);
    setAcceptRemoveModal(true);
  };

  // Remove Item
  const handleRemoveItem = () => {
    deleteItemMutation.mutate(item.id);
    setAcceptRemoveModal(false);
    setItem(null);
  };

  const handleEditModal = (item) => {
    setItem(item);
    setShowEditModal(true);
  };

  // change web view item
  const handleChangeStatus = async (id, value) => {
    try {
      const res = await changeWebViewMutation.mutateAsync({
        id: id,
        data: {
          web_view: value,
        },
      });

      return res;
    } catch (error) {
      return error;
    }
  };

  // handle change item order
  const handleItemOrderChange = async (id, data) => {
    const formData = {
      data: data,
      id: id,
    };

    try {
      const res = await changeItemOrderMutation.mutateAsync(formData);

      return res;
    } catch (error) {
      return error;
    }
  };

  // handle duplicate item
  const handleDuplicateItemChange = async (id) => {
    try {
      const res = await duplicateItemMutation.mutateAsync(id);

      return res;
    } catch (error) {
      return error;
    }
  };

  return (
    <>
      <HelmetTitlePage title="مدیریت سوپراپ" />

      <AddNewItem itemTypes={allSuperAppItems?.item_types ?? {}} />

      <Table
        {...allSuperAppItems?.items}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={
          isLoading ||
          isFetching ||
          deleteItemMutation.isLoading ||
          changeItemOrderMutation.isLoading ||
          duplicateItemMutation.isLoading ||
          changeWebViewMutation.isLoading
        }
      >
        <TableBody>
          {allSuperAppItems?.items?.data?.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  <>
                    <Stack direction="row" justifyContent="center" gap={2}>
                      <SvgSPrite
                        icon="up"
                        MUIColor="success.main"
                        size="small"
                        sxStyles={{
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handleItemOrderChange(row.id, {
                            action: "up",
                            section_id: row.section_id,
                          })
                        }
                      />
                      {enToFaNumber(row?.order) ?? "-"}
                      <SvgSPrite
                        icon="down"
                        MUIColor="error.main"
                        size="small"
                        sxStyles={{
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handleItemOrderChange(row.id, {
                            action: "down",
                            section_id: row.section_id,
                          })
                        }
                      />
                    </Stack>
                  </>
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.title) ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row?.section?.title) ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row?.image_url ? (
                    <a href={row?.image_url} target="_blank">
                      <Avatar
                        src={row?.image_url}
                        variant="rounded"
                        sx={{ width: 60, height: 60, m: "auto" }}
                      />
                    </a>
                  ) : (
                    "فاقد عکس"
                  )}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row?.slug ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  <Switch
                    defaultChecked
                    color="info"
                    checked={Boolean(row?.web_view)}
                    onChange={(e) => {
                      handleChangeStatus(row.id, e.target.checked);
                    }}
                  />
                </TableCell>

                <TableCell align="center">{row?.status ?? "-"}</TableCell>
                <TableCell>
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "تکثیر",
                        color: "warning",
                        icon: "copy",
                        onClick: () => handleDuplicateItemChange(row.id),
                        name: "item.duplicate",
                      },
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        onClick: () => handleEditModal(row),
                        name: "item.update",
                      },
                      {
                        tooltip: "حذف کردن",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => showModalToRemove(row),
                        name: "item.destroy",
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
        onAccept={handleRemoveItem}
      />

      <EditItemModal
        item={item}
        show={showEditModal}
        itemTypes={allSuperAppItems?.item_types ?? {}}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
};

const AddNewItem = ({ itemTypes }) => {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();

  const [openCollapse, setOpenCollapse] = useState(true);

  const addNewSuperItemMutation = useMutation(
    (data) =>
      axiosApi({
        url: "/super-app/item",
        method: "post",
        data: data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
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
      label: "عنوان",
      control: control,
      rules: {
        required: "عنوان را وارد کنید",
      },
      endAdornment: (
        <InputCheckBoxEndAdornment
          name="title_status"
          control={control}
          label="وضعیت"
          defaultValue={true}
        />
      ),
    },
    {
      type: "select",
      name: "web_view",
      label: "نمای وب",
      options: renderSelectOptions({ 1: "فعال", 0: "غیرفعال" }),
      valueKey: "id",
      labelKey: "title",
      control: control,
      defaultValue: 1,
      rules: { required: "نمای وب را وارد کنید" },
    },
    {
      type: "text",
      name: "comment",
      label: "کامنت",
      control: control,
      rules: {
        required: "کامنت را وارد کنید",
      },
      endAdornment: (
        <InputCheckBoxEndAdornment
          name="comment_status"
          control={control}
          label="وضعیت"
          defaultValue={true}
        />
      ),
    },
    {
      type: "color",
      name: "comment_color",
      label: "رنگ کامنت",
      noInputArrow: true,
      control: control,
    },
    {
      type: "color",
      name: "background_color",
      label: "رنگ پس‌زمینه",
      noInputArrow: true,
      control: control,
    },
    {
      type: "select",
      name: "type",
      valueKey: "id",
      labelKey: "title",
      defaultValue: "simple",
      label: "نوع",
      options: renderSelectOptions(itemTypes),
      control: control,
    },
    {
      type: "text",
      name: "slug",
      label: "اسلاگ",
      control: control,
      rules: {
        required: "اسلاگ را وارد کنید",
      },
    },
    {
      type: "number",
      name: "order",
      label: "ترتیب",
      noInputArrow: true,
      control: control,
      rules: {
        required: "ترتیب را وارد کنید",
      },
    },
    {
      type: "custom",
      customView: (
        <ChooseSuperAppSection
          control={control}
          name={"section"}
          rules={{
            required: "بخش را انتخاب کنید",
          }}
        />
      ),
    },
    {
      type: "select",
      name: "status",
      label: "وضعیت آیتم",
      options: renderSelectOptions({
        فعال: "فعال",
        غیرفعال: "غیرفعال",
        "موقتا غیرفعال": "موقتا غیرفعال",
      }),
      valueKey: "id",
      labelKey: "title",
      control: control,
      defaultValue: "فعال",
      rules: { required: "وضعیت آیتم را وارد کنید" },
    },
    {
      type: "number",
      name: "height",
      label: "ارتفاع",
      control: control,
      splitter: true,
    },
    {
      type: "number",
      name: "width",
      label: "عرض",
      control: control,
      splitter: true,
    },
    {
      type: "text",
      name: "url",
      label: "آدرس",
      control: control,
      rules: { required: "آدرس را وارد کنید" },
      gridProps: { md: 6 },
      isLtr: true,
    },
    {
      type: "file",
      name: "image",
      label: "عکس",
      control: control,
      isLtr: true,
      rules: { required: "عکس را وارد کنید" },
      gridProps: { md: 6 },
    },
  ];

  // handle on submit new super section
  const onSubmit = async (data) => {
    data = {
      ...data,
      section_id: data?.section?.id,
      title_status: Number(data?.title_status),
      comment_status: Number(data?.comment_status),
    };

    delete data.section;

    var data1 = new FormData();

    Object.entries(data).forEach(([key, val]) => {
      data1.append(key, val);
    });

    try {
      const res = await addNewSuperItemMutation.mutateAsync(data1);
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
      title="افزودن آیتم جدید"
      open={openCollapse}
      onToggle={setOpenCollapse}
      name="item.store"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 3 }} />

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

const EditItemModal = ({ show, onClose, item, itemTypes }) => {
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
    reset(item);
    setValue("image", {
      name: item?.image_url,
    });
  }, [item]);

  const updateSuperItemMutation = useMutation(
    (data) =>
      axiosApi({
        url: `/super-app/item/${item.id}`,
        method: "put",
        data: data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    {
      onSuccess: () => {
        reset();
        queryClient.invalidateQueries(["superApp"]);
        toast.success("با موفقیت تغییر یافت");
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
      rules: {
        required: "عنوان را وارد کنید",
      },
      endAdornment: (
        <InputCheckBoxEndAdornment
          name="title_status"
          control={control}
          label="وضعیت"
          defaultValue={true}
        />
      ),
    },
    {
      type: "select",
      name: "web_view",
      label: "نمای وب",
      options: renderSelectOptions({ 1: "فعال", 0: "غیرفعال" }),
      valueKey: "id",
      labelKey: "title",
      control: control,
      defaultValue: 1,
      rules: { required: "نمای وب را وارد کنید" },
    },
    {
      type: "text",
      name: "comment",
      label: "کامنت",
      control: control,
      rules: {
        required: "کامنت را وارد کنید",
      },
      endAdornment: (
        <InputCheckBoxEndAdornment
          name="comment_status"
          control={control}
          label="وضعیت"
          defaultValue={true}
        />
      ),
    },
    {
      type: "color",
      name: "comment_color",
      label: "رنگ کامنت",
      noInputArrow: true,
      control: control,
    },
    {
      type: "color",
      name: "background_color",
      label: "رنگ پس‌زمینه",
      noInputArrow: true,
      control: control,
    },
    {
      type: "select",
      name: "type",
      valueKey: "id",
      labelKey: "title",
      defaultValue: "simple",
      label: "نوع",
      options: renderSelectOptions(itemTypes),
      control: control,
    },
    {
      type: "text",
      name: "slug",
      label: "اسلاگ",
      control: control,
      rules: {
        required: "اسلاگ را وارد کنید",
      },
    },
    {
      type: "number",
      name: "order",
      label: "ترتیب",
      noInputArrow: true,
      control: control,
      rules: {
        required: "ترتیب را وارد کنید",
      },
    },
    {
      type: "custom",
      customView: (
        <ChooseSuperAppSection
          control={control}
          name={"section"}
          rules={{
            required: "بخش را انتخاب کنید",
          }}
        />
      ),
    },
    {
      type: "select",
      name: "status",
      label: "وضعیت آیتم",
      options: renderSelectOptions({
        فعال: "فعال",
        غیرفعال: "غیرفعال",
        "موقتا غیرفعال": "موقتا غیرفعال",
      }),
      valueKey: "id",
      labelKey: "title",
      control: control,
      defaultValue: "فعال",
      rules: { required: "وضعیت آیتم را وارد کنید" },
    },
    {
      type: "number",
      name: "height",
      label: "ارتفاع",
      control: control,
      splitter: true,
    },
    {
      type: "number",
      name: "width",
      label: "عرض",
      control: control,
      splitter: true,
    },
    {
      type: "text",
      name: "url",
      label: "آدرس",
      control: control,
      rules: { required: "آدرس را وارد کنید" },
      gridProps: { md: 6 },
      isLtr: true,
    },
    {
      type: "file",
      name: "image",
      label: "عکس",
      control: control,
      rules: { required: "عکس را وارد کنید" },
      gridProps: { md: 6 },
    },
  ];

  // handle on submit
  const onSubmit = async (data) => {
    data = removeInvalidValues({
      ...data,
      section_id: data?.section?.id,
      title_status: Number(data?.title_status),
      comment_status: Number(data?.comment_status),
    });

    delete data.section;
    delete data.image_url;
    delete data.size;
    delete data.extension;
    if (!(data.image instanceof File)) {
      delete data.image;
    }

    var data1 = new FormData();

    Object.entries(data).forEach(([key, val]) => {
      data1.append(key, val);
    });

    try {
      const res = await updateSuperItemMutation.mutateAsync(data1);
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
    <Modal open={show} onClose={onClose}>
      <FormTypography>ویرایش آیتم</FormTypography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 3 }} />

            <Stack mt={5} alignItems="flex-end">
              <LoadingButton
                variant="contained"
                type="submit"
                loading={isSubmitting}
                color={Object.keys(errors).length ? "error" : "primary"}
              >
                ذخیره
              </LoadingButton>
            </Stack>
          </FormContainer>
        </Box>
      </form>
    </Modal>
  );
};

export default ItemsList;
