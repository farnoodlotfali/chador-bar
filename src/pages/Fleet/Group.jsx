import { useEffect, useState } from "react";

import {
  Grid,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Card,
  Button,
  Stack,
  Box,
} from "@mui/material";

import LoadingSpinner from "Components/versions/LoadingSpinner";

import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import ActionConfirm from "Components/ActionConfirm";
import {
  enToFaNumber,
  renderSelectOptions1,
  removeInvalidValues,
  renderSelectOptions,
  renderPlaqueObjectToString,
} from "Utility/utils";
import { Helmet } from "react-helmet-async";
import { axiosApi } from "api/axiosApi";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useVehicleType } from "hook/useVehicleType";
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
  const [showDetails, setShowDetails] = useState(false);
  const [acceptRemoveModal, setAcceptRemoveModal] = useState(false);
  const [fleetItem, setFleetItem] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState();

  const {
    data: allFleetGroup,
    isLoading,
    isFetching,
    isError,
  } = useFleetGroup(searchParamsFilter);

  console.log("allFleetGroup", allFleetGroup);

  const {
    data: shippingCompanies,
    isLoading: ShCIsLoading,
    isFetching: ShCIsFetching,
  } = useShippingCompany();
  const {
    data: vehicleTypes,
    isLoading: vTypeIsLoading,
    isFetching: vTypeIsFetching,
  } = useVehicleType();

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

  useEffect(() => {
    console.log("showDetails", showDetails);
  }, [showDetails]);

  if (
    isLoading ||
    isFetching ||
    vTypeIsLoading ||
    vTypeIsFetching ||
    ShCIsLoading ||
    ShCIsFetching ||
    deleteMutation.isLoading
  ) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <div className="">isError</div>;
  }
  // UI functions

  const showModalToRemove = (row) => {
    setFleetItem(row?.id);
    setAcceptRemoveModal(true);
  };

  // Remove Beneficiary
  const handleRemoveGroup = () => {
    deleteMutation.mutate(fleetItem);
    setAcceptRemoveModal(false);
    setFleetItem(null);
  };

  return (
    <>
      <Helmet title="پنل دراپ - گروه ناوگان " />

      <AddNewGroup shippingCompanies={shippingCompanies} />
      <DetailsModal
        open={showDetails}
        shippingCompanies={shippingCompanies}
        onClose={() => {
          setShowDetails(false);
        }}
        data={selectedRowData}
      />
      {/* <SearchBoxBeneficiary /> */}

      <Table
        {...allFleetGroup}
        headCells={headCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
      >
        <TableBody>
          {allFleetGroup?.items?.data?.map((row) => {
            const vType = vehicleTypes.data.find(
              (item) => item.vehicle_category_id === row.fleets[0]?.id
            );
            const shippingCompany = shippingCompanies.data.find(
              (item) => item.id === row.shipping_company_id
            );
            return (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell align="center" scope="row">
                  {enToFaNumber(row.id)}
                </TableCell>
                <TableCell align="center">{row?.name ?? "-"}</TableCell>
                {/* <TableCell align="center">{vType?.title ?? "-"}</TableCell> */}
                <TableCell align="center">
                  {shippingCompany.name ?? "-"}
                </TableCell>

                <TableCell>
                  <TableActionCell
                    buttons={[
                      {
                        tooltip: "مشاهده",
                        color: "secondary",
                        icon: "eye",
                        onClick: () => {
                          setSelectedRowData(row);

                          setShowDetails(!showDetails);
                        },
                      },
                      {
                        tooltip: "حذف کردن",
                        color: "error",
                        icon: "trash-xmark",
                        onClick: () => showModalToRemove(row),
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
        onAccept={handleRemoveGroup}
      />
    </>
  );
};

const SearchBoxBeneficiary = () => {
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
    {
      type: "select",
      name: "transportation_type",
      label: "نوع بارگیر",
      options: renderSelectOptions({ all: "همه" }),
      valueKey: "id",
      labelKey: "title",
      control: control,
      defaultValue: "all",
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

const AddNewGroup = ({ shippingCompanies }) => {
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
        toast.success("درخواست شما با اضافه شد");
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
      rules: { required: "نام ناوگان را وارد کنید" },
      gridProps: { md: 3.5 },
    },
    {
      type: "custom",
      customView: (
        <MultiFleets
          control={control}
          name={"fleets"}
          label="ناوگان"
          needMoreInfo={true}
        />
      ),

      gridProps: { md: 5 },
    },

    {
      type: "select",
      name: "shipping_company_id",
      valueKey: "id",
      labelKey: "title",
      label: "شرکت حمل و نقل",
      options: renderSelectOptions1(shippingCompanies, "name"),
      control: control,
      rules: { required: "شرکت حمل و نقل را وارد کنید" },
      gridProps: { md: 3.5 },
    },
  ];
  // handle on submit new Beneficiary
  const onSubmit = (data) => {
    data.fleets = data.fleets.map((i) => i.id);
    if (data?.fleets?.length === 0) {
      toast.error("لطفا ناوگان را انتخاب کنید");
    }
    data = JSON.stringify(data);

    AddGroupMutation.mutate(data);
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
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 2 }}>
          <FormContainer data={watch()} setData={handleChange} errors={errors}>
            <FormInputs inputs={Inputs} gridProps={{ md: 2.5 }}>
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
const DetailsModal = ({ open, onClose, data, shippingCompanies }) => {
  const shippingCompany = shippingCompanies?.data.find(
    (item) => item.id === data?.shipping_company_id
  );
  return (
    <Modal open={open} onClose={onClose}>
      <FormTypography>اطلاعات گروه</FormTypography>
      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
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
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" mt={2}>
              ناوگان ها
            </Typography>
          </Grid>

          {data ? (
            data.fleets?.map((fleet) => {
              return (
                <Grid item xs={12} md={4}>
                  <Card sx={{ padding: 2 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ width: "100%" }}
                    >
                      <Typography>کد </Typography>
                      <Typography fontSize={14}>{fleet.code}</Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ width: "100%", mt: 2 }}
                    >
                      <Typography>پلاک</Typography>
                      <Typography>
                        {renderPlaqueObjectToString(fleet?.vehicle?.plaque)}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ width: "100%", mt: 2 }}
                    >
                      <Typography>نوع خودرو</Typography>
                      <Typography>
                        {fleet.vehicle?.container_type?.vehicle_category?.title}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ width: "100%", mt: 2 }}
                    >
                      <Typography>نوع بارگیر</Typography>
                      <Typography>
                        {fleet.vehicle?.container_type?.title}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ width: "100%", mt: 2 }}
                    >
                      <Typography>مدل خودرو</Typography>
                      <Typography>
                        {fleet.vehicle?.vehicle_model?.title}
                      </Typography>
                    </Stack>
                  </Card>
                </Grid>
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
export default Group;
