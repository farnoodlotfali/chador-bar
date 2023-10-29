import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  Stack,
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
import { enToFaNumber, renderSelectOptions } from "Utility/utils";
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
    id: "id",
    label: "شناسه",
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
    id: "order",
    label: "ترتیب",
    sortable: true,
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
  return (
    <>
      <HelmetTitlePage title="مدیریت سوپراپ" />

      <AddNewItem itemTypes={allSuperAppItems?.item_types ?? {}} />

      <Table
        {...allSuperAppItems?.items}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={isLoading || isFetching || deleteItemMutation.isLoading}
      >
        <TableBody>
          {allSuperAppItems?.items?.data?.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
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
                  {Boolean(row?.web_view) ? (
                    <SvgSPrite icon="check" MUIColor="success" />
                  ) : (
                    <SvgSPrite icon="xmark" MUIColor="error" />
                  )}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row?.order) ?? "-"}
                </TableCell>
                <TableCell align="center">{row?.status ?? "-"}</TableCell>
                <TableCell>
                  <TableActionCell
                    buttons={[
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

  const [openCollapse, setOpenCollapse] = useState(false);

  const addNewSuperItemMutation = useMutation(
    (data) => axiosApi({ url: "/super-app/item", method: "post", data: data }),
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
          name="title_status"
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
      rules: {
        required: "رنگ کامنت را وارد کنید",
      },
    },

    {
      type: "color",
      name: "background_color",
      label: "رنگ پس‌زمینه",
      noInputArrow: true,
      control: control,
      rules: {
        required: "رنگ پس‌زمینه را وارد کنید",
      },
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
      type: "select",
      name: "extension",
      label: "افزونه",
      options: renderSelectOptions({
        png: "png",
        svg: "svg",
        jpg: "jpg",
      }),
      valueKey: "id",
      labelKey: "title",
      control: control,
      defaultValue: "png",
      rules: { required: "افزونه را وارد کنید" },
    },
    {
      type: "number",
      name: "size",
      label: "سایز",
      control: control,
      splitter: true,
      rules: { required: "سایز را وارد کنید" },
    },
    {
      type: "number",
      name: "height",
      label: "ارتفاع",
      control: control,
      splitter: true,
      rules: { required: "ارتفاع را وارد کنید" },
    },
    {
      type: "number",
      name: "width",
      label: "عرض",
      control: control,
      splitter: true,
      rules: { required: "عرض را وارد کنید" },
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
      type: "text",
      name: "image_url",
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
    };

    try {
      const res = await addNewSuperItemMutation.mutateAsync(data);
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
  }, [item]);

  const updateSuperItemMutation = useMutation(
    (data) =>
      axiosApi({
        url: `/super-app/item/${item.id}`,
        method: "put",
        data: data,
      }),
    {
      onSuccess: () => {
        reset();
        queryClient.invalidateQueries(["superApp"]);
        toast.success("با موفقیت اضافه شد");
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
          name="title_status"
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
      rules: {
        required: "رنگ کامنت را وارد کنید",
      },
    },

    {
      type: "color",
      name: "background_color",
      label: "رنگ پس‌زمینه",
      noInputArrow: true,
      control: control,
      rules: {
        required: "رنگ پس‌زمینه را وارد کنید",
      },
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
      type: "select",
      name: "extension",
      label: "افزونه",
      options: renderSelectOptions({
        png: "png",
        svg: "svg",
        jpg: "jpg",
      }),
      valueKey: "id",
      labelKey: "title",
      control: control,
      defaultValue: "png",
      rules: { required: "افزونه را وارد کنید" },
    },
    {
      type: "number",
      name: "size",
      label: "سایز",
      control: control,
      splitter: true,
      rules: { required: "سایز را وارد کنید" },
    },
    {
      type: "number",
      name: "height",
      label: "ارتفاع",
      control: control,
      splitter: true,
      rules: { required: "ارتفاع را وارد کنید" },
    },
    {
      type: "number",
      name: "width",
      label: "عرض",
      control: control,
      splitter: true,
      rules: { required: "عرض را وارد کنید" },
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
      type: "text",
      name: "image_url",
      label: "عکس",
      control: control,
      rules: { required: "عکس را وارد کنید" },
      gridProps: { md: 6 },
      isLtr: true,
    },
  ];

  // handle on submit
  const onSubmit = async (data) => {
    data = {
      ...data,
      section_id: data?.section?.id,
    };

    try {
      const res = await updateSuperItemMutation.mutateAsync(data);
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
