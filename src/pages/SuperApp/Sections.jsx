import { LoadingButton } from "@mui/lab";
import {
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
import { ChooseSuperAppGroup } from "Components/choosers/superApp/ChooseGroup";

import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import { enToFaNumber, renderChip, renderSelectOptions } from "Utility/utils";
import { axiosApi } from "api/axiosApi";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { useSuperAppSection } from "hook/useSuperAppSection";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ActionConfirm from "Components/ActionConfirm";
import Modal from "Components/versions/Modal";
import FormTypography from "Components/FormTypography";
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
    id: "group_id",
    label: "گروه",
    sortable: true,
  },
  {
    id: "slug",
    label: "اسلاگ",
    sortable: true,
  },
  {
    id: "view_type",
    label: "نوع نمایش",
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

const SuperAppSections = () => {
  const queryClient = useQueryClient();

  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const {
    data: allSuperAppSections,
    isLoading,
    isFetching,
  } = useSuperAppSection(searchParamsFilter);

  const [acceptRemoveModal, setAcceptRemoveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sectionItem, setSectionItem] = useState(null);

  // Mutations
  const deleteSectionMutation = useMutation(
    (id) => axiosApi({ url: `/super-app/section/${id}`, method: "delete" }),
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

  // change status
  const changeStatusMutation = useMutation(
    (formData) =>
      axiosApi({
        url: `/super-app/section/${formData.id}`,
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

  // change section order
  const changeSectionOrderMutation = useMutation(
    (formData) =>
      axiosApi({
        url: `/super-app/section-change-position/${formData.id}`,
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

  const showModalToRemove = (sectionItem) => {
    setSectionItem(sectionItem);
    setAcceptRemoveModal(true);
  };

  // Remove sectionItem
  const handleRemoveSectionItem = () => {
    deleteSectionMutation.mutate(sectionItem.id);
    setAcceptRemoveModal(false);
    setSectionItem(null);
  };

  const handleEditModal = (item) => {
    setSectionItem(item);
    setShowEditModal(true);
  };

  // change status section
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

  // handle change section order
  const handleSectionOrderChange = async (id, data) => {
    const formData = {
      data: data,
      id: id,
    };

    try {
      const res = await changeSectionOrderMutation.mutateAsync(formData);

      return res;
    } catch (error) {
      return error;
    }
  };

  return (
    <>
      <HelmetTitlePage title="مدیریت سوپراپ" />

      <AddNewSection viewTypes={allSuperAppSections?.view_types ?? {}} />

      <Table
        {...allSuperAppSections?.items}
        headCells={HeadCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={
          isLoading ||
          isFetching ||
          changeStatusMutation.isLoading ||
          changeSectionOrderMutation.isLoading ||
          deleteSectionMutation.isLoading
        }
      >
        <TableBody>
          {allSuperAppSections?.items?.data?.map((row) => {
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
                          handleSectionOrderChange(row.id, {
                            action: "up",
                            group_id: row.group_id,
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
                          handleSectionOrderChange(row.id, {
                            action: "down",
                            group_id: row.group_id,
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
                  {enToFaNumber(row?.group?.title) ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row?.slug) ?? "-"}
                </TableCell>
                <TableCell align="center" scope="row">
                  {allSuperAppSections?.view_types?.[row?.view_type] ?? "-"}
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
                <TableCell>
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "آیتم‌ها",
                        color: "primary",
                        icon: "puzzle-piece",
                        link: `/super-app/section/item?section_id=${row.id}`,
                        name: "item.index",
                      },
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        onClick: () => handleEditModal(row),
                        name: "section.update",
                      },
                      {
                        tooltip: "حذف کردن",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => showModalToRemove(row),
                        name: "section.destroy",
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
        onAccept={handleRemoveSectionItem}
      />
      <EditSectionModal
        section={sectionItem}
        show={showEditModal}
        viewTypes={allSuperAppSections?.view_types ?? {}}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
};

const AddNewSection = ({ viewTypes }) => {
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

  const addNewSuperSectionMutation = useMutation(
    (data) =>
      axiosApi({ url: "/super-app/section", method: "post", data: data }),
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
      type: "select",
      name: "view_type",
      valueKey: "id",
      labelKey: "title",
      defaultValue: "mediumCard",
      label: "نوع نمایش",
      options: renderSelectOptions(viewTypes),
      control: control,
    },
    {
      type: "custom",
      customView: (
        <ChooseSuperAppGroup
          control={control}
          name={"group"}
          rules={{
            required: "گروه را انتخاب کنید",
          }}
        />
      ),
    },
    {
      type: "select",
      name: "status",
      label: "وضعیت بخش",
      options: renderSelectOptions({ 1: "فعال", 0: "غیرفعال" }),
      valueKey: "id",
      labelKey: "title",
      control: control,
      defaultValue: 1,
      rules: { required: "وضعیت بخش را وارد کنید" },
    },
  ];

  // handle on submit new super group
  const onSubmit = async (data) => {
    data = {
      ...data,
      group_id: data?.group?.id,
    };

    try {
      const res = await addNewSuperSectionMutation.mutateAsync(data);
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
      title="افزودن بخش جدید"
      open={openCollapse}
      onToggle={setOpenCollapse}
      name="section.store"
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

const EditSectionModal = ({ show, onClose, section, viewTypes }) => {
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
    reset(section);
  }, [section]);

  const updateSuperSectionMutation = useMutation(
    (data) =>
      axiosApi({
        url: `/super-app/section/${section?.id}`,
        method: "put",
        data: data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["superApp"]);
        toast.success("با موفقیت تغییر یافت");
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
      type: "select",
      name: "view_type",
      valueKey: "id",
      labelKey: "title",
      defaultValue: "mediumCard",
      label: "نوع نمایش",
      options: renderSelectOptions(viewTypes),
      control: control,
    },
    {
      type: "custom",
      customView: (
        <ChooseSuperAppGroup
          control={control}
          name={"group"}
          rules={{
            required: "نوع نمایش را انتخاب کنید",
          }}
        />
      ),
    },
    {
      type: "select",
      name: "status",
      label: "وضعیت بخش",
      options: renderSelectOptions({ 1: "فعال", 0: "غیرفعال" }),
      valueKey: "id",
      labelKey: "title",
      control: control,
      defaultValue: 1,
      rules: { required: "وضعیت بخش را وارد کنید" },
    },
  ];

  // handle on submit new super group
  const onSubmit = async (data) => {
    data = {
      ...data,
      group_id: data?.group?.id,
    };

    try {
      const res = await updateSuperSectionMutation.mutateAsync(data);
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
      <FormTypography>ویرایش بخش</FormTypography>

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
                ویرایش
              </LoadingButton>
            </Stack>
          </FormContainer>
        </Box>
      </form>
    </Modal>
  );
};

export default SuperAppSections;
