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
  Rating,
} from "@mui/material";

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
import { useDriver } from "hook/useDriver";

import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { FormContainer, FormInputs } from "Components/Form";
import CollapseForm from "Components/CollapseForm";
import { useForm } from "react-hook-form";
import { ChooseSalon } from "Components/choosers/ChooseSalon";
import VehicleDetailModal from "Components/modals/VehicleDetailModal";
import { axiosApi } from "api/axiosApi";
import { toast } from "react-toastify";
import { SvgSPrite } from "Components/SvgSPrite";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import HelmetTitlePage from "Components/HelmetTitlePage";
import ShowPersonScoreModal from "Components/modals/ShowPersonScoreModal";
import { useHasPermission } from "hook/useHasPermission";
import DriverReportModal from "Components/modals/DriverReportModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    id: "rating",
    label: "امتیاز",
    sortable: true,
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
  const {
    data: allDrivers,
    isLoading,
    isFetching,
    isError,
  } = useDriver(searchParamsFilter);
  const { hasPermission } = useHasPermission("driver.inquiry");

  const [openModal, setOpenModal] = useState(null);
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
    setOpenModal("detail");
    if (rowData) setSelectedRowData(rowData);
  };

  const toggleShowScores = (rowData) => {
    setOpenModal("personScore");
    if (rowData) setSelectedRowData(rowData);
  };

  const handleShowVehicleModal = (rowData) => {
    setOpenModal("vehicleDetail");
    if (rowData) setSelectedRowData(rowData);
  };
  const handleShowDriverReportModal = (rowData) => {
    setOpenModal("driverReport");
    if (rowData) setSelectedRowData(rowData);
  };
  const toggleOpenModal = () => {
    setOpenModal(null);
  };

  return (
    <>
      <HelmetTitlePage title="رانندگان" />

      <SearchBoxDriver />

      <Table
        headCells={headCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={isLoading || isFetching || inquiryMutation.isLoading}
      >
        <TableBody>
          {allDrivers?.items?.data?.map((row) => {
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
                  <Rating
                    precision={0.2}
                    sx={{
                      width: "fit-content",
                    }}
                    value={row?.rating}
                    size="small"
                    readOnly
                  />
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
                  <IconButton
                    onClick={() => changeDriverInquiry(row.id)}
                    disabled={!hasPermission}
                  >
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
                        name: "driver.show",
                      },
                      {
                        tooltip: "ویرایش",
                        color: "warning",
                        icon: "pencil",
                        link: `/driver/${row.id}`,
                        name: "driver.update",
                      },

                      {
                        tooltip: "درخواست‌ها",
                        color: "secondary",
                        icon: "list-check",
                        link: `/request?driver=${row.id}`,
                        name: "request.index",
                      },
                      {
                        tooltip: "بارنامه‌ها",
                        color: "secondary",
                        icon: "scroll-old",
                        link: `/waybill?driver=${row.id}`,
                        name: "waybill.index",
                      },
                      {
                        tooltip: "مشاهده تاریخچه امتیازات",
                        color: "secondary",
                        icon: "rectangle-history-circle-user",
                        onClick: () => toggleShowScores(row),
                      },
                      {
                        tooltip: "گزارش",
                        color: "info",
                        icon: "memo-pad",
                        onClick: () => handleShowDriverReportModal(row),
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <DetailsModal
        open={openModal === "detail"}
        onClose={toggleOpenModal}
        data={selectedRowData}
      />
      <DriverReportModal
        open={openModal === "driverReport"}
        onClose={toggleOpenModal}
        data={selectedRowData}
      />
      <ShowPersonScoreModal
        show={openModal === "personScore"}
        data={selectedRowData}
        onClose={toggleOpenModal}
      />
      <VehicleDetailModal
        show={openModal === "vehicleDetail"}
        onClose={toggleOpenModal}
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
      type: "custom",
      customView: <ChooseSalon control={control} name={"salon"} />,
    },
  ];
  const { resetValues } = useLoadSearchParamsAndReset(Inputs, reset);

  // handle on submit new vehicle
  const onSubmit = (data) => {
    setSearchParamsFilter(
      removeInvalidValues({
        ...searchParamsFilter,
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
