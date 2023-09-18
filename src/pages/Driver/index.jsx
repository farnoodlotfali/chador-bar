/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";

import {
  Grid,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Switch,
  Card,
  Stack,
  Box,
  Button,
  IconButton,
} from "@mui/material";

import LoadingSpinner from "Components/versions/LoadingSpinner";

import Table from "Components/versions/Table";
import Modal from "Components/versions/Modal";
import TableActionCell from "Components/versions/TableActionCell";
import {
  enToFaNumber,
  handleDate,
  removeInvalidValues,
  renderChipForInquiry,
  renderPlaqueObjectToString,
} from "Utility/utils";
import { Helmet } from "react-helmet-async";
import { useDriver } from "hook/useDriver";

import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { FormContainer, FormInputs } from "Components/Form";
import CollapseForm from "Components/CollapseForm";
import { useForm } from "react-hook-form";
import { ChooseSalon } from "Components/choosers/ChooseSalon";
import VehicleDetailModal from "Components/modals/VehicleDetailModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { toast } from "react-toastify";
import { SvgSPrite } from "Components/SvgSPrite";

const headCells = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
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
    id: "car",
    label: "خودرو",
  },
  {
    id: "created_at",
    label: "زمان ثبت",
  },
  {
    id: "status",
    label: "وضعیت",
  },
  {
    id: "inquiry",
    label: "وضعیت فعالیت",
  },
  {
    id: "actions",
    label: "عملیات",
  },
];

export default function DriverList() {
  const queryClient = useQueryClient();
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const {
    data: allDrivers,
    isLoading,
    isFetching,
    isError,
  } = useDriver(searchParamsFilter);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState();
  const inquiryMutation = useMutation(
    (id) => axiosApi({ url: `/inquiry/${id}`, method: "post" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["driver"]);
        toast.success("با موفقیت اعمال شد");
      },
    }
  );
  if (isError) {
    return <div className="">isError</div>;
  }

  const changeDriverStatus = (id) => {
    // Inertia.visit(`customer-change-status/${id}`, {
    //   method: "post",
    //   preserveScroll: true,
    // });
  };

  const changeDriverInquiry = (id) => {
    inquiryMutation.mutate(id);
  };

  const toggleShowDetails = (rowData) => {
    setShowDetails((prev) => !prev);
    if (rowData) setSelectedRowData(rowData);
  };

  const handleShowVehicleModal = (rowData) => {
    setShowVehicleModal((prev) => !prev);
    if (rowData) setSelectedRowData(rowData);
  };

  return (
    <>
      <Helmet title="پنل دراپ - رانندگان" />
      <SearchBoxDriver />

      {isLoading || isFetching ? (
        <LoadingSpinner />
      ) : (
        <Table
          {...allDrivers.items}
          headCells={headCells}
          filters={searchParamsFilter}
          setFilters={setSearchParamsFilter}
        >
          <TableBody>
            {allDrivers.items?.data?.map((row) => {
              return (
                <TableRow
                  hover
                  tabIndex={-1}
                  key={row.id}
                  onDoubleClick={() => toggleShowDetails(row)}
                >
                  <TableCell align="center" scope="row">
                    {enToFaNumber(row.id)}
                  </TableCell>
                  <TableCell align="center" scope="row">
                    {(row.person.first_name || "فاقد نام") +
                      " " +
                      (row.person.last_name || " ")}
                  </TableCell>
                  <TableCell align="center" scope="row">
                    {enToFaNumber(row.mobile)}
                  </TableCell>
                  <TableCell align="center" scope="row">
                    {row.vehicle?.plaque ? (
                      <Typography
                        variant="clickable"
                        onClick={() => handleShowVehicleModal(row)}
                      >
                        {renderPlaqueObjectToString(row.vehicle?.plaque)}
                      </Typography>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell align="center" scope="row">
                    {row.created_at ? (
                      <Typography variant="subtitle2">
                        {handleDate(row.created_at, "YYYY/MM/DD")}
                        {" - "}
                        {handleDate(row.created_at, "HH:MM")}
                      </Typography>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell align="center" scope="row">
                    <Switch
                      checked={Boolean(row.status)}
                      onChange={() => {
                        changeDriverStatus(row.id);
                      }}
                    />
                  </TableCell>
                  <TableCell align="center" scope="row">
                    {renderChipForInquiry(row.person?.inquiry)}
                    <IconButton onClick={() => changeDriverInquiry(row.id)}>
                      <SvgSPrite
                        icon="rotate-right"
                        MUIColor="primary"
                        size="small"
                      />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <TableActionCell
                      buttons={[
                        {
                          tooltip: "نمایش جزئیات",
                          color: "secondary",
                          icon: "eye",
                          onClick: () => toggleShowDetails(row),
                        },
                        {
                          tooltip: "ویرایش",
                          color: "warning",
                          icon: "pencil",
                          link: `/driver/${row.id}`,
                        },

                        {
                          tooltip: "درخواست‌ها",
                          color: "secondary",
                          icon: "list-check",
                          link: `/request?driver=${row.id}`,
                        },
                        {
                          tooltip: "بارنامه‌ها",
                          color: "secondary",
                          icon: "scroll-old",
                          link: `/waybill?driver=${row.id}`,
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <DetailsModal
        open={showDetails}
        onClose={() => toggleShowDetails()}
        data={selectedRowData}
      />

      <VehicleDetailModal
        show={showVehicleModal}
        onClose={() => setShowVehicleModal((prev) => !prev)}
        data={selectedRowData?.vehicle}
      />
    </>
  );
}

const SearchBoxDriver = () => {
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
      type: "custom",
      customView: <ChooseSalon control={control} name={"salon"} />,
    },
  ];

  // handle on submit new vehicle
  const onSubmit = (data) => {
    setSearchParamsFilter((prev) =>
      removeInvalidValues({
        ...prev,
        ...data,
        salon: data?.salon?.id,
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

const DetailsModal = ({ open, onClose, data }) => {
  const handleGenderText = (gender) => {
    switch (gender) {
      case "man":
        return "مرد";
      case "woman":
        return "زن";

      default:
        return "نا‌مشخص";
    }
  };

  if (!data) return <></>;
  return (
    <Modal open={open} onClose={onClose}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", p: 2 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h5">اطلاعات کلی</Typography>

              <SvgSPrite icon="file-lines" size="large" MUIColor="info" />
            </Stack>

            <Stack spacing={1} mt={3}>
              <Typography>
                نام و نام‌ خانوادگی:{" "}
                {`${data.first_name || ""} ${data.last_name || ""}`}
              </Typography>
              <Typography>موبایل: {enToFaNumber(data.mobile)}</Typography>
              <Typography>جنسیت: {handleGenderText(data.gender)}</Typography>
              <Typography>
                کد ملی: {enToFaNumber(data.national_code) || "-"}
              </Typography>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", p: 2 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h5">آدرس</Typography>

              <SvgSPrite icon="house" size="large" MUIColor="warning" />
            </Stack>

            <Stack spacing={1} mt={3}>
              <Typography>
                استان: {data.default_city?.province.title || "-"}
              </Typography>
              <Typography>شهر: {data.default_city?.title || "-"}</Typography>
              <Typography>آدرس: {data.profile?.address || "-"}</Typography>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", p: 2 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h5">معرف</Typography>

              <SvgSPrite icon={"user-plus"} size="large" MUIColor="primary" />
            </Stack>

            <Stack spacing={1} mt={3}>
              <Typography>عنوان: {data.referrer || "-"}</Typography>
              <Typography>کد معرف: {data.referring_code || "-"}</Typography>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", p: 2 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h5">خودرو</Typography>

              <SvgSPrite icon="truck" size="large" MUIColor="success" />
            </Stack>

            <Stack spacing={1} mt={3}>
              <Typography>
                مدل خودرو: {data?.vehicle?.vehicle_model?.title || "-"}
              </Typography>
              <Typography>
                پلاک: {renderPlaqueObjectToString(data?.vehicle?.plaque) || "-"}
              </Typography>
              <Typography>
                نوع بارگیر: {data?.vehicle?.container_type?.title || "-"}
              </Typography>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Modal>
  );
};
