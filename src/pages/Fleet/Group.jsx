import { useEffect, useState } from "react";

import {
  Grid,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Card,
  Stack,
  Box,
} from "@mui/material";

import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import ActionConfirm from "Components/ActionConfirm";
import {
  enToFaNumber,
  removeInvalidValues,
  renderPlaqueObjectToString,
} from "Utility/utils";
import { axiosApi } from "api/axiosApi";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useShippingCompany } from "hook/useShippingCompany";
import { FormContainer, FormInputs } from "Components/Form";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import MultiFleets from "Components/multiSelects/MultiFleets";
import { useFleetGroup } from "hook/useFleetGroup";
import Modal from "Components/versions/Modal";
import FormTypography from "Components/FormTypography";
import HelmetTitlePage from "Components/HelmetTitlePage";
import { ChooseShippingCompany } from "Components/choosers/ChooseShippingCompany";
import FleetGroupDetailModal from "Components/modals/FleetGroupDetailModal";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
const headCells = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "vehicle_type_id",
    label: "نام گروه",
  },

  {
    id: "shipping_company_id",
    label: "شرکت حمل و نقل",
  },

  {
    id: "actions",
    label: "عملیات",
  },
];

const Group = () => {
  const queryClient = useQueryClient();
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const [showModal, setShowModal] = useState(false);
  const [acceptRemoveModal, setAcceptRemoveModal] = useState(false);
  const [selectedFleetGroup, setSelectedFleetGroup] = useState();

  const {
    data: allFleetGroup,
    isLoading,
    isFetching,
    isError,
  } = useFleetGroup(searchParamsFilter);

  // Mutations
  const deleteMutation = useMutation(
    (id) => axiosApi({ url: `/fleet-group/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fleet-group"]);
        toast.success("درخواست شما با موفقیت پاک شد");
      },
      onError: () => {
        toast.error("خطا  ");
      },
    }
  );

  if (isError) {
    return <div className="">isError</div>;
  }
  // UI functions

  const showModalToRemove = (row) => {
    setSelectedFleetGroup(row);
    setAcceptRemoveModal(true);
  };

  // Remove
  const handleRemoveGroup = () => {
    deleteMutation.mutate(selectedFleetGroup?.id);
    setAcceptRemoveModal(false);
    setSelectedFleetGroup(null);
  };

  const handleShowDetail = (item) => {
    setSelectedFleetGroup(item);
    setShowModal("detail");
  };

  const handleShowEditModal = (item) => {
    setSelectedFleetGroup(item);
    setShowModal("edit");
  };

  const toggleModal = () => {
    setShowModal(null);
  };

  return (
    <>
      <HelmetTitlePage title="گروه ناوگان" />

      <AddNewGroup />

      <Table
        {...allFleetGroup}
        headCells={headCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={isLoading || isFetching || deleteMutation.isLoading}
      >
        <TableBody>
          {allFleetGroup?.items?.data?.map((row) => {
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center">{row?.name ?? "-"}</TableCell>
                <TableCell align="center">
                  {row?.shipping_company?.name ?? "-"}
                </TableCell>

                <TableCell>
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "مشاهده",
                        color: "secondary",
                        icon: "eye",
                        onClick: () => handleShowDetail(row),
                        name: "fleet-group.show",
                      },
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        onClick: () => handleShowEditModal(row),
                        name: "fleet-group.update",
                      },
                      {
                        tooltip: "حذف کردن",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => showModalToRemove(row),
                        name: "fleet-group.destroy",
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <FleetGroupDetailModal
        open={showModal === "detail"}
        onClose={toggleModal}
        data={selectedFleetGroup}
      />

      <EditFleetGroup
        onClose={toggleModal}
        open={showModal === "edit"}
        fleetGroup={selectedFleetGroup}
      />

      <ActionConfirm
        message="ایا مطمئن هستید؟"
        open={acceptRemoveModal}
        onClose={() => setAcceptRemoveModal(false)}
        onAccept={handleRemoveGroup}
      />
    </>
  );
};

const AddNewGroup = () => {
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

  const AddGroupMutation = useMutation(
    (data) => axiosApi({ url: "/fleet-group", method: "post", data: data }),
    {
      onSuccess: () => {
        reset();
        queryClient.invalidateQueries(["fleet-group"]);
        toast.success("  با موفقیت اضافه شد");
      },
      onError: () => {
        toast.error("خطا  ");
      },
    }
  );

  const Inputs = [
    {
      type: "text",
      name: "name",
      label: "نام",
      control: control,
      rules: { required: "نام گروه را وارد کنید" },
    },
    {
      type: "custom",
      customView: (
        <MultiFleets
          control={control}
          name={"fleets"}
          label="ناوگان"
          needMoreInfo={true}
          rules={{ required: " ناوگان را انتخاب کنید" }}
        />
      ),
    },
    {
      type: "custom",
      customView: (
        <ChooseShippingCompany
          control={control}
          name={"shipping_company"}
          rules={{ required: " شرکت حمل را انتخاب کنید" }}
        />
      ),
      gridProps: { md: 4 },
    },
  ];

  // handle on submit new
  const onSubmit = async (data) => {
    if (!data?.fleets?.length) {
      toast.error("لطفا ناوگان را انتخاب کنید");
      return;
    }
    data.fleets = data?.fleets?.map((i) => i?.id);

    data = {
      ...data,
      shipping_company_id: data?.shipping_company?.id,
    };
    data = JSON.stringify(data);

    try {
      const res = await AddGroupMutation.mutateAsync(data);
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
      title="افزودن گروه جدید"
      open={openCollapse}
      name="fleet-group.store"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 4 }}>
              <Grid item xs={12} md={12}>
                <Stack direction={"row"} sx={{ justifyContent: "flex-end" }}>
                  <LoadingButton
                    sx={{
                      width: "150px",
                      height: "56px",
                    }}
                    variant="contained"
                    loading={isSubmitting}
                    type="submit"
                  >
                    افزودن
                  </LoadingButton>
                </Stack>
              </Grid>
            </FormInputs>
          </FormContainer>
        </Box>
      </form>
    </CollapseForm>
  );
};

const EditFleetGroup = ({ open, onClose, fleetGroup }) => {
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
    reset(fleetGroup);
  }, [fleetGroup]);

  const updateFleetGroupMutation = useMutation(
    (data) =>
      axiosApi({
        url: `/fleet-group/${fleetGroup.id}`,
        method: "put",
        data: data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fleet-group"]);
        toast.success(" با موفقیت ویرایش شد");
      },
      onError: () => {
        toast.error("خطا  ");
      },
    }
  );

  const Inputs = [
    {
      type: "text",
      name: "name",
      label: "نام",
      control: control,
      rules: { required: "نام گروه را وارد کنید" },
    },
    {
      type: "custom",
      customView: (
        <MultiFleets
          control={control}
          name={"fleets"}
          label="ناوگان"
          needMoreInfo={true}
          rules={{ required: " ناوگان را انتخاب کنید" }}
        />
      ),
    },
    {
      type: "custom",
      customView: (
        <ChooseShippingCompany
          control={control}
          name={"shipping_company"}
          rules={{ required: " شرکت حمل را انتخاب کنید" }}
        />
      ),
      gridProps: { md: 4 },
    },
  ];
  // handle on submit
  const onSubmit = async (data) => {
    if (data?.fleets?.length === 0) {
      toast.error("لطفا ناوگان را انتخاب کنید");
      return;
    }
    data.fleets = data.fleets.map((i) => i.id);

    data = {
      ...data,
      shipping_company_id: data?.shipping_company?.id,
    };

    try {
      const res = await updateFleetGroupMutation.mutateAsync(
        removeInvalidValues(data)
      );
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
    <Modal onClose={onClose} open={open}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormTypography>ویرایش گروه ناوگان</FormTypography>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <FormInputs inputs={Inputs} gridProps={{ md: 4 }} />
          <Stack mt={2} alignItems="flex-end">
            <LoadingButton
              variant="contained"
              loading={isSubmitting}
              type="submit"
            >
              ویرایش
            </LoadingButton>
          </Stack>
        </FormContainer>
      </form>
    </Modal>
  );
};

export default Group;
