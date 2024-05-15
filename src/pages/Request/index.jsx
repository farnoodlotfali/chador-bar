/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-pascal-case */
import { useState } from "react";

import {
  Grid,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Stack,
  Typography,
  TextField,
  Button,
  Box,
  Badge,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import Modal from "Components/versions/Modal";
import ActionConfirm from "Components/ActionConfirm";
import {
  enToFaNumber,
  numberWithCommas,
  renderPlaqueObjectToString,
  removeInvalidValues,
  renderWeight,
  requestStatus,
  renderMobileFormat,
  renderSelectOptions,
} from "Utility/utils";
import DrivingDirection from "Components/DrivingDirection";
import { axiosApi, uncontrolledAxiosApi } from "api/axiosApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRequest } from "hook/useRequest";
import { toast } from "react-toastify";
import WayBillPaper from "Components/papers/WaybillPaper";
import { useForm } from "react-hook-form";
import { FormContainer, FormInputs } from "Components/Form";
import OwnerDetailModal from "Components/modals/OwnerDetailModal";
import CollapseForm from "Components/CollapseForm";
import { useSearchParamsFilter } from "hook/useSearchParamsFilter";
import { ChooseSalon } from "Components/choosers/ChooseSalon";
import ProjectDetailModal from "Components/modals/ProjectDetailModal";
import DriverDetailModal from "Components/modals/DriverDetailModal";
import VehicleTypeDetailModal from "Components/modals/VehicleTypeDetailModal";
import VehicleDetailModal from "Components/modals/VehicleDetailModal";
import MultiProjects from "Components/multiSelects/MultiProjects";
import MultiContracts from "Components/multiSelects/MultiContracts";
import MultiDrivers from "Components/multiSelects/MultiDrivers";
import MultiFleets from "Components/multiSelects/MultiFleets";
import MultiProducts from "Components/multiSelects/MultiProducts";
import MultiPersons from "Components/multiSelects/MultiPersons";
import MultiVTypes from "Components/multiSelects/MultiVTypes";
import MultiShippingCompanies from "Components/multiSelects/MultiShippingCompany";
import CreatorDetailModal from "Components/modals/CreatorDetailModal";
import HelmetTitlePage from "Components/HelmetTitlePage";
import RequestDetailModal from "Components/modals/RequestDetailModal";

import { ChooseOwner } from "Components/choosers/ChooseOwner";
import Icon_Zarinpal from "Assets/images/zarinpal.svg";
import Icon_Set from "Assets/images/set.svg";
import Icon_Pasargad from "Assets/images/pasargad.svg";
import { ReactComponent as Icon_Commission_paid } from "Assets/images/commission_paid.svg";
import { ReactComponent as Icon_Factor } from "Assets/images/factor.svg";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import RequestNeedsModal from "Components/pages/requestList/requestNeeds";
import AllScoresModal from "Components/pages/requestList/personsScores";
import DraftDetailsModal from "Components/modals/DraftDetailsModal";
import WaybillDetailsModal from "Components/modals/WaybillDetailsModal";
const headCells = [
  {
    id: "id",
    label: "شناسه",
    sortable: true,
  },
  {
    id: "project",
    label: "پروژه",
  },
  {
    id: "driver",
    label: "راننده",
  },
  {
    id: "product",
    label: "محصول",
  },
  {
    id: "owner",
    label: "صاحب بار",
  },
  {
    id: "weight",
    label: "وزن",
    sortable: true,
  },
  {
    id: "vehicle",
    label: "خودرو",
  },
  {
    id: "vehicle_type",
    label: "بارگیر درخواستی",
  },
  {
    id: "creator",
    label: "فرد ثبت کننده",
  },
  {
    id: "register_type",
    label: "نوع ثبت",
  },
  {
    id: "proposed_price",
    label: "مبلغ پیشنهادی",
    sortable: true,
  },
  {
    id: "load_time",
    label: "زمان بارگیری",
    sortable: true,
  },
  {
    id: "actions_",
    label: "تغییر وضعیت",
  },
  {
    id: "status",
    label: "وضعیت",
  },
  {
    id: "invoice_status",
    label: "وضعیت صورتحساب",
  },

  {
    id: "actions",
    label: "عملیات",
  },
];
const statusesColor = {
  error: ["cancel", "rejected", "expired"],
  warning: [
    "driver_accept",
    "on_the_way",
    "load",
    "load_confirm",
    "commission_paid",
  ],
  info: [
    "wait_for_payment",
    "set",
    "submit",
    "edit",
    "at_source",
    "at_destination",
  ],
  success: [
    "delivered",
    "done",
    "enabled",
    "paid",
    "issue_waybill",
    "load_permit",
  ],
};

const invoiceStatusesColor = {
  error: ["not_issued"],
  warning: ["prepaid", "pre_invoice_issued"],
  info: ["calculated", "invoice_issued"],
  success: ["paid", "cleared"],
};

const styButton = {
  borderRadius: 0.8,
  borderWidth: "1px",
  borderStyle: "solid",
  width: "31%",
  padding: 0,
};
const canSetRate = ["delivered", "done"];

export default function RequestList() {
  const queryClient = useQueryClient();
  const userType = localStorage.getItem("userType");
  const { searchParamsFilter, setSearchParamsFilter } = useSearchParamsFilter();
  const [showMap, setShowMap] = useState(false);
  const [changeStatusModal, setChangeStatusModal] = useState();
  const [changeStatusData, setChangeStatusData] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [showWayBillDetails, setShowWayBillDetails] = useState(false);
  const [showDraftDetails, setShowDraftDetails] = useState(false);
  const [draftDoc, setDraftDoc] = useState({});
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [showDriverDetail, setShowDriverDetail] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showOwnerDetail, setShowOwnerDetail] = useState(false);
  const [showCreatorDetail, setShowCreatorDetail] = useState(false);
  const [showAllScores, setShowAllScores] = useState(false);
  const [showVehicleTypeDetail, setShowVehicleTypeDetail] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [openRequestNeeds, setOpenRequestNeeds] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("zarinpal");
  const {
    data: allRequest,
    isError,
    isFetching,
    isLoading,
  } = useRequest(searchParamsFilter);

  const deleteMutation = useMutation(
    (id) => axiosApi({ url: `/request/${id}`, method: "delete" }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["request"]);
        toast.success("درخواست شما با موفقیت پاک شد");
      },
      onError: () => {
        toast.error("خطا  ");
      },
    }
  );

  const changeStatusMutation = useMutation(
    (data) =>
      axiosApi({ url: "/request-change-status", method: "post", data: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["request"]);
        toast.success("درخواست شما با موفقیت انجام شد");
      },
    }
  );
  const changeSetStatusMutation = useMutation(
    (data) =>
      axiosApi({
        url: `/set-status/${selectedRowData?.id}`,
        method: "post",
        data: data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["request"]);
        toast.success("درخواست شما با موفقیت انجام شد");
        setStatusLoading(false);
      },
      onError: () => {
        setStatusLoading(false);
      },
    }
  );
  const requestAcceptPriceMutation = useMutation(
    () =>
      axiosApi({
        url: `/request-accept-price/${selectedRowData?.id}`,
        method: "post",
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["request"]);
        toast.success("درخواست شما با موفقیت انجام شد");
      },
    }
  );
  if (isError) {
    return <div className="">isError</div>;
  }

  const handleRequestStatus = (status) => {
    let result = "نا مشخص";
    Object.keys(allRequest?.statuses).forEach((key) => {
      if (key === status) result = allRequest?.statuses[key];
    });
    return result;
  };

  const handleRequestInvoiceStatus = (status) => {
    let result = "نا مشخص";
    Object.keys(allRequest?.invoice_statuses).forEach((key) => {
      if (key === status) result = allRequest?.invoice_statuses[key];
    });
    return result;
  };

  const handleRequestStatusColor = (status) => {
    let color;
    Object.keys(statusesColor).forEach((key) => {
      if (statusesColor[key].includes(status)) color = key;
    });
    return color;
  };

  const handleRequestInvoiceStatusColor = (status) => {
    let color;
    Object.keys(invoiceStatusesColor).forEach((key) => {
      if (invoiceStatusesColor[key].includes(status)) color = key;
    });
    return color;
  };

  // Logic functions

  const toggleShowMap = (rowData) => {
    setSelectedRowData(rowData);
    setShowMap((prev) => !prev);
  };
  const toggleShowDetails = (rowData) => {
    setShowDetails((prev) => !prev);
    if (rowData) setSelectedRowData(rowData);
  };

  const toggleShowOwnerDetails = (rowData) => {
    setShowOwnerDetail((prev) => !prev);
    if (rowData) setSelectedRowData(rowData);
  };
  const toggleShowCreatorDetails = (rowData) => {
    setShowCreatorDetail((prev) => !prev);
    if (rowData) setSelectedRowData(rowData);
  };
  const toggleShowProjectDetails = (rowData) => {
    setShowProjectDetail((prev) => !prev);
    if (rowData) setSelectedRowData(rowData);
  };
  const toggleShowDriverDetails = (rowData) => {
    setShowDriverDetail((prev) => !prev);
    if (rowData) setSelectedRowData(rowData);
  };
  const toggleShowVehicleTypeDetails = (rowData) => {
    setShowVehicleTypeDetail((prev) => !prev);
    if (rowData) setSelectedRowData(rowData);
  };
  const toggleShowVehicleDetails = (rowData) => {
    if (rowData) setSelectedRowData(rowData);
    setShowVehicleModal((prev) => !prev);
  };

  // Change request status
  const handleRejectRequest = (request) => {
    setChangeStatusData({ id: request.id });
    setChangeStatusModal("reject");
  };
  const handleAcceptRequest = (request) => {
    if (userType?.includes("owner")) {
      setSelectedRowData(request);
      if (request?.next_status === "commission_paid") {
        setChangeStatusModal("commission_paid");
      } else if (request?.next_status === "paid") {
        setChangeStatusModal("done");
      }
      return;
    }

    setOpenRequestNeeds(true);
    setSelectedRowData(request);
  };

  const changeRequestStatus = (action) => {
    let data = JSON.stringify({
      action: action,
      ...changeStatusData,
    });
    changeStatusMutation.mutate(data);
    setChangeStatusModal(null);
  };

  const setRequestStatus = (status) => {
    let data = JSON.stringify({
      status,
    });

    changeSetStatusMutation.mutate(data);
    setChangeStatusModal(null);
  };

  const toggleShowWayBillDetails = (rowData) => {
    setShowWayBillDetails((prev) => !prev);
    if (rowData) setSelectedRowData(rowData);
  };
  const toggleShowDraftDetails = (draft) => {
    setShowDraftDetails((prev) => !prev);
    if (draft) setDraftDoc(draft);
  };
  const toggleShowAllScores = (rowData) => {
    setShowAllScores((prev) => !prev);
    if (rowData) setSelectedRowData(rowData);
  };

  // get draft detail
  const getDraftDetail = async (draftId) => {
    try {
      const res = await uncontrolledAxiosApi({
        url: `/draft/${draftId}`,
      });

      toggleShowDraftDetails(res.data.Data);
      return res.data.Data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <HelmetTitlePage title="درخواست‌ ها" />
      <SearchBox statuses={allRequest?.statuses} />

      <Table
        {...allRequest?.items}
        headCells={headCells}
        filters={searchParamsFilter}
        setFilters={setSearchParamsFilter}
        loading={
          isLoading ||
          isFetching ||
          deleteMutation.isLoading ||
          changeStatusMutation.isLoading
        }
      >
        <TableBody>
          {allRequest?.items.data.map((row) => {
            const canSetDriver = allRequest?.can_set_driver.includes(
              row.status
            );
            let buttons_1 = [
              {
                tooltip: row?.prev_action_fa ?? "رد کردن",
                color: "error",
                icon: "xmark",
                name: "request.change-status",
                disabled: !row?.rejectable,
                onClick: () => handleRejectRequest(row),
              },
            ];

            const status = requestStatus[row.next_status];

            // next_status
            !canSetDriver
              ? buttons_1.unshift({
                  tooltip: row?.next_action_fa ?? "پذیرفتن",
                  color: status?.color ?? "success",
                  icon: status?.icon ?? "check",
                  name: "request.change-status",
                  disabled: !row?.acceptable,
                  onClick: () => handleAcceptRequest(row),
                })
              : buttons_1.unshift({
                  tooltip: "انتخاب راننده",
                  color: "info",
                  icon: "user-nurse",
                  name: "request.change-status",
                  disabled: !row?.acceptable,
                  onClick: () => handleAcceptRequest(row),
                });

            let buttons = [
              {
                tooltip: "نمایش جزئیات",
                color: "secondary",
                icon: "eye",
                name: "request.show",
                onClick: () => toggleShowDetails(row),
              },
              {
                tooltip: "ویرایش",
                color: "warning",
                icon: "pencil",
                link: `/request/${row.id}`,
                name: "request.update",
              },
              {
                tooltip: "آدرس",
                color: "success",
                icon: "map",
                onClick: () => toggleShowMap(row),
              },
              {
                tooltip: "نمایش بارنامه",
                color: "secondary",
                icon: "receipt",
                onClick: () => toggleShowWayBillDetails(row),
                disabled: !row.waybill,
              },
              {
                tooltip: "نمایش حواله",
                color: "secondary",
                icon: "scroll-old",
                onClick: () => getDraftDetail(row.draft_number),
                disabled: !row.draft_number,
              },
            ];

            if (canSetRate.includes(row.status)) {
              buttons.push({
                tooltip: "امتیازات",
                color: "secondary",
                icon: "stars",
                onClick: () => toggleShowAllScores(row),
              });
            }
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
                  {row.project?.code ? (
                    <Typography
                      variant="clickable"
                      onClick={() => toggleShowProjectDetails(row)}
                    >
                      {enToFaNumber(row.project.code)}
                    </Typography>
                  ) : (
                    "آگهی"
                  )}
                </TableCell>
                <TableCell align="center" scope="row">
                  {row.driver ? (
                    <Typography
                      variant="clickable"
                      onClick={() => toggleShowDriverDetails(row)}
                    >
                      {`${row.driver?.first_name ?? "فاقد نام"} ${
                        row.driver?.last_name ?? "-"
                      } (${renderMobileFormat(row.driver?.mobile) ?? ""})`}
                    </Typography>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell align="center">
                  {row.product?.title ?? "-"}
                </TableCell>
                <TableCell align="center">
                  <Typography
                    variant="clickable"
                    onClick={() => toggleShowOwnerDetails(row)}
                  >
                    {row?.owner_type === "natural"
                      ? `${row.owner?.first_name || ""} ${
                          row.owner?.last_name || ""
                        }`
                      : row?.owner?.name || ""}
                  </Typography>
                </TableCell>
                <TableCell align="center">{renderWeight(row.weight)}</TableCell>
                <TableCell align="center">
                  {row.fleet ? (
                    <Typography
                      variant="clickable"
                      onClick={() => toggleShowVehicleDetails(row?.fleet)}
                    >
                      {renderPlaqueObjectToString(row.fleet?.vehicle?.plaque)}
                    </Typography>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell align="center">
                  {row.vehicle_type ? (
                    <Typography
                      variant="clickable"
                      onClick={() => toggleShowVehicleTypeDetails(row)}
                    >
                      {row.vehicle_type?.title}
                    </Typography>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell align="center">
                  <Typography
                    variant="clickable"
                    onClick={() => toggleShowCreatorDetails(row)}
                  >
                    {`${row.creator?.first_name || ""} ${
                      row.creator?.last_name || ""
                    }`}
                  </Typography>
                </TableCell>
                <TableCell align="center">{row.register_type ?? "-"}</TableCell>
                <TableCell align="center">
                  {row?.price
                    ? enToFaNumber(numberWithCommas(row.price)) + " ریال"
                    : row.biddable
                    ? "مناقصه"
                    : "قیمت توافقی"}
                </TableCell>
                <TableCell align="center">
                  {row.load_time_fa ? (
                    <Typography variant="subtitle2">
                      {enToFaNumber(row.load_time_fa)}
                    </Typography>
                  ) : (
                    "-"
                  )}
                </TableCell>

                <TableCell>
                  {row?.status === "enabled" && row?.drivers?.length > 0 ? (
                    <Badge
                      badgeContent={row?.drivers?.length}
                      color="success"
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                    >
                      <TableActionCell buttons={buttons_1} />
                    </Badge>
                  ) : row?.status === "delivered" &&
                    userType?.includes("owner") ? (
                    <TableActionCell
                      buttons={[
                        {
                          tooltip: "بار را تحویل گرفتم",
                          color: "secondary",
                          icon: "truck-arrow-right",
                          name: "request.change-status",
                          disabled: !row?.acceptable,
                          onClick: () => {
                            setSelectedRowData(row);
                            setChangeStatusModal("paid");
                          },
                        },
                      ]}
                    />
                  ) : row?.status === "wait_for_price_approve" &&
                    userType?.includes("owner") ? (
                    <TableActionCell
                      buttons={[
                        {
                          tooltip: "موافقت با قیمت اعلامی",
                          color: "secondary",
                          icon: "check",
                          name: "request.change-status",
                          disabled: !row?.acceptable,
                          onClick: () => {
                            setSelectedRowData(row);
                            setChangeStatusModal("acceptPrice");
                          },
                        },
                        {
                          tooltip: "رد کردن",
                          color: "error",
                          icon: "xmark",
                          disabled: !row?.rejectable,
                          name: "customer.change-status",
                          onClick: () => {
                            setSelectedRowData(row);
                            setChangeStatusModal("enabled");
                          },
                        },
                      ]}
                    />
                  ) : row?.status === "driver_accept" &&
                    userType?.includes("owner") ? (
                    <TableActionCell
                      buttons={[
                        {
                          tooltip: "پرداخت کمیسیون",
                          color: "success",
                          icon: "coins",
                          name: "request.change-status",
                          disabled: !row?.acceptable,
                          onClick: () => handleAcceptRequest(row),
                        },
                      ]}
                    />
                  ) : row?.status === "done" && userType?.includes("owner") ? (
                    <TableActionCell
                      buttons={[
                        {
                          tooltip: "تسویه",
                          color: "success",
                          icon: "memo-circle-check",
                          name: "request.change-status",
                          disabled: !row?.acceptable,
                          onClick: () => handleAcceptRequest(row),
                        },
                      ]}
                    />
                  ) : (
                    <TableActionCell buttons={buttons_1} />
                  )}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={handleRequestStatus(row.status)}
                    color={handleRequestStatusColor(row.status)}
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={handleRequestInvoiceStatus(row.invoice_status)}
                    color={handleRequestInvoiceStatusColor(row.invoice_status)}
                  />
                </TableCell>
                <TableCell>
                  <TableActionCell buttons={buttons} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {/* show owner */}
      <OwnerDetailModal
        owner={selectedRowData?.owner}
        open={showOwnerDetail}
        onClose={() => setShowOwnerDetail(false)}
      />
      {/* show creator */}
      <CreatorDetailModal
        creator={selectedRowData?.creator}
        open={showCreatorDetail}
        onClose={() => setShowCreatorDetail(false)}
      />
      {/* show project */}
      <ProjectDetailModal
        show={showProjectDetail}
        onClose={() => setShowProjectDetail(false)}
        data={selectedRowData?.project}
      />
      <DriverDetailModal
        show={showDriverDetail}
        onClose={() => setShowDriverDetail(false)}
        data={selectedRowData?.driver}
      />
      <VehicleTypeDetailModal
        show={showVehicleTypeDetail}
        onClose={() => setShowVehicleTypeDetail(false)}
        data={selectedRowData?.vehicle_type}
      />
      <VehicleDetailModal
        show={showVehicleModal}
        onClose={() => setShowVehicleModal((prev) => !prev)}
        data={selectedRowData?.vehicle}
      />
      {/* show driving routes */}
      <DrivingDirection
        showModal={showMap}
        toggleShowModal={() => toggleShowMap()}
        rowData={selectedRowData}
        useModal={true}
        height="500px"
      />
      {/* Reject request modal */}
      <Modal
        open={changeStatusModal === "reject"}
        onClose={() => setChangeStatusModal(null)}
        maxWidth="md"
      >
        <TextField
          multiline
          rows={5}
          placeholder="دلیل رد کردن"
          sx={{ width: "100%" }}
          value={changeStatusData.cause || ""}
          onChange={(e) =>
            setChangeStatusData((prev) => ({
              ...prev,
              cause: e.target.value,
            }))
          }
        />

        <Stack alignItems="flex-end" mt={3}>
          <LoadingButton
            variant="contained"
            onClick={() => changeRequestStatus("reject")}
          >
            رد کردن
          </LoadingButton>
        </Stack>
      </Modal>
      {/* Commission_paid modal */}
      <Modal
        open={changeStatusModal === "commission_paid"}
        onClose={() => setChangeStatusModal(null)}
        maxWidth="md"
      >
        <Stack alignItems="center" mt={3}>
          <Icon_Commission_paid />
          <Typography variant="h6" mt={1} color="#000">
            {enToFaNumber(numberWithCommas(changeStatusData?.request?.price)) +
              " تومان"}
          </Typography>
          <Typography variant="subtitle1">پیش پرداخت</Typography>
          <Grid container spacing={6} mt={1} width={"90%"}>
            <Grid item xs={12} md={6}>
              <Stack
                alignItems={"center"}
                flexDirection={"row"}
                justifyContent={"space-between"}
              >
                <Typography variant="caption">پیش پرداخت</Typography>
                <Typography variant="button" color="#000">
                  {enToFaNumber(
                    numberWithCommas(changeStatusData?.request?.price)
                  ) + " تومان"}
                </Typography>
              </Stack>
              <Stack
                alignItems={"center"}
                flexDirection={"row"}
                justifyContent={"space-between"}
              >
                <Typography variant="caption">پیش پرداخت</Typography>
                <Typography variant="button" color="#000">
                  {enToFaNumber(
                    numberWithCommas(changeStatusData?.request?.price)
                  ) + " تومان"}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack
                alignItems={"center"}
                flexDirection={"row"}
                justifyContent={"space-between"}
              >
                <Typography variant="caption">پیش پرداخت</Typography>
                <Typography variant="button" color="#000">
                  {enToFaNumber(
                    numberWithCommas(changeStatusData?.request?.price)
                  ) + " تومان"}
                </Typography>
              </Stack>
              <Stack
                alignItems={"center"}
                flexDirection={"row"}
                justifyContent={"space-between"}
              >
                <Typography variant="caption">پیش پرداخت</Typography>
                <Typography variant="button" color="#000">
                  {enToFaNumber(
                    numberWithCommas(changeStatusData?.request?.price)
                  ) + " تومان"}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          <Stack
            bgcolor={"#FAFAFA"}
            flexDirection={"row"}
            alignItems={"center"}
            width={"84%"}
            padding={1}
            borderRadius={1}
            mt={1}
          >
            <Icon_Factor />
            <Typography variant="caption" ml={1}>
              احتمال تغییر مبلغ کل فاکتور وجود دارد.
            </Typography>
          </Stack>
          <Typography variant="h6" mt={3} color="#000">
            درگاه پرداخت
          </Typography>
          <Stack
            alignItems={"center"}
            justifyContent={"space-between"}
            flexDirection={"row"}
            width={"85%"}
            mt={2}
          >
            <Button
              sx={{
                ...styButton,
                borderColor:
                  selectedWallet === "zarinpal" ? "primary.900" : "#202C430D",
              }}
              onClick={() => setSelectedWallet("zarinpal")}
            >
              <Box sx={{ flex: 1 }}>
                <Stack flexDirection={"row"} alignItems={"center"} padding={1}>
                  <img src={Icon_Zarinpal} />
                  <Typography
                    variant="button"
                    fontWeight={"bold"}
                    color="#000"
                    ml={1}
                  >
                    زرین‌پال
                  </Typography>
                </Stack>
                <Stack
                  sx={{
                    bgcolor:
                      selectedWallet === "zarinpal"
                        ? "primary.900"
                        : "#202C430D",
                    flex: 1,
                    height: "15px",
                  }}
                />
              </Box>
            </Button>
            <Button
              sx={{
                ...styButton,
                borderColor:
                  selectedWallet === "set" ? "primary.900" : "#202C430D",
              }}
              onClick={() => setSelectedWallet("set")}
            >
              <Box sx={{ flex: 1 }}>
                <Stack flexDirection={"row"} alignItems={"center"} padding={1}>
                  <img src={Icon_Set} />
                  <Typography
                    variant="button"
                    fontWeight={"bold"}
                    color="#000"
                    ml={1}
                  >
                    ست
                  </Typography>
                </Stack>
                <Stack
                  sx={{
                    bgcolor:
                      selectedWallet === "set" ? "primary.900" : "#202C430D",
                    flex: 1,
                    height: "15px",
                  }}
                />
              </Box>
            </Button>
            <Button
              sx={{
                ...styButton,
                borderColor:
                  selectedWallet === "pasargad" ? "primary.900" : "#202C430D",
              }}
              onClick={() => setSelectedWallet("pasargad")}
            >
              <Box sx={{ flex: 1 }}>
                <Stack flexDirection={"row"} alignItems={"center"} padding={1}>
                  <img src={Icon_Pasargad} />
                  <Typography
                    variant="button"
                    fontWeight={"bold"}
                    color="#000"
                    ml={1}
                  >
                    پاسارگاد
                  </Typography>
                </Stack>
                <Stack
                  sx={{
                    bgcolor:
                      selectedWallet === "pasargad"
                        ? "primary.900"
                        : "#202C430D",
                    flex: 1,
                    height: "15px",
                  }}
                />
              </Box>
            </Button>
          </Stack>
          <LoadingButton
            variant="contained"
            loading={statusLoading}
            sx={{ width: "85%", height: "60px", mt: 5, mb: 3 }}
            onClick={() => {
              setStatusLoading(true);
              setRequestStatus(selectedRowData?.next_status);
            }}
          >
            پرداخت
          </LoadingButton>
        </Stack>
      </Modal>
      {/* paid modal */}
      <Modal
        open={changeStatusModal === "paid"}
        onClose={() => setChangeStatusModal(null)}
        maxWidth="xs"
      >
        <Stack alignItems="center" mt={3}>
          <Typography variant="h6" mt={1} color="#000">
            هنگام تحویل بار این کد را برای راننده ارسال کنید.
          </Typography>
          <Typography variant="h3" mt={1} color="#000">
            {enToFaNumber(selectedRowData?.delivery_code)}
          </Typography>
        </Stack>
      </Modal>
      {/* done modal */}
      <Modal
        open={changeStatusModal === "done"}
        onClose={() => setChangeStatusModal(null)}
        maxWidth="md"
      >
        <Stack alignItems="center" mt={3}>
          <Icon_Commission_paid />
          <Typography variant="h6" mt={1} color="#000">
            {enToFaNumber(numberWithCommas(changeStatusData?.request?.price)) +
              " تومان"}
          </Typography>
          <Typography variant="subtitle1">مبلغ باقی‌مانده</Typography>

          <Typography variant="h6" mt={5} color="#000">
            درگاه پرداخت
          </Typography>
          <Stack
            alignItems={"center"}
            justifyContent={"space-between"}
            flexDirection={"row"}
            width={"85%"}
            mt={2}
          >
            <Button
              sx={{
                ...styButton,
                borderColor:
                  selectedWallet === "zarinpal" ? "primary.900" : "#202C430D",
              }}
              onClick={() => setSelectedWallet("zarinpal")}
            >
              <Box sx={{ flex: 1 }}>
                <Stack flexDirection={"row"} alignItems={"center"} padding={1}>
                  <img src={Icon_Zarinpal} />
                  <Typography
                    variant="button"
                    fontWeight={"bold"}
                    color="#000"
                    ml={1}
                  >
                    زرین‌پال
                  </Typography>
                </Stack>
                <Stack
                  sx={{
                    bgcolor:
                      selectedWallet === "zarinpal"
                        ? "primary.900"
                        : "#202C430D",
                    flex: 1,
                    height: "15px",
                  }}
                />
              </Box>
            </Button>
            <Button
              sx={{
                ...styButton,
                borderColor:
                  selectedWallet === "set" ? "primary.900" : "#202C430D",
              }}
              onClick={() => setSelectedWallet("set")}
            >
              <Box sx={{ flex: 1 }}>
                <Stack flexDirection={"row"} alignItems={"center"} padding={1}>
                  <img src={Icon_Set} />
                  <Typography
                    variant="button"
                    fontWeight={"bold"}
                    color="#000"
                    ml={1}
                  >
                    ست
                  </Typography>
                </Stack>
                <Stack
                  sx={{
                    bgcolor:
                      selectedWallet === "set" ? "primary.900" : "#202C430D",
                    flex: 1,
                    height: "15px",
                  }}
                />
              </Box>
            </Button>
            <Button
              sx={{
                ...styButton,
                borderColor:
                  selectedWallet === "pasargad" ? "primary.900" : "#202C430D",
              }}
              onClick={() => setSelectedWallet("pasargad")}
            >
              <Box sx={{ flex: 1 }}>
                <Stack flexDirection={"row"} alignItems={"center"} padding={1}>
                  <img src={Icon_Pasargad} />
                  <Typography
                    variant="button"
                    fontWeight={"bold"}
                    color="#000"
                    ml={1}
                  >
                    پاسارگاد
                  </Typography>
                </Stack>
                <Stack
                  sx={{
                    bgcolor:
                      selectedWallet === "pasargad"
                        ? "primary.900"
                        : "#202C430D",
                    flex: 1,
                    height: "15px",
                  }}
                />
              </Box>
            </Button>
          </Stack>
          <LoadingButton
            variant="contained"
            loading={statusLoading}
            sx={{ width: "85%", height: "60px", mt: 5, mb: 3 }}
            onClick={() => {
              setStatusLoading(true);
              setRequestStatus("paid");
            }}
          >
            پرداخت
          </LoadingButton>
        </Stack>
      </Modal>

      <ActionConfirm
        message="ایا مطمئن هستید؟"
        open={changeStatusModal === "acceptSet"}
        onClose={() => setChangeStatusModal(null)}
        onAccept={() => changeRequestStatus("accept")}
      />
      <ActionConfirm
        message="ایا مطمئن هستید؟"
        open={changeStatusModal === "acceptPrice"}
        onClose={() => setChangeStatusModal(null)}
        onAccept={() => requestAcceptPriceMutation.mutate()}
      />
      <ActionConfirm
        message="ایا مطمئن هستید؟"
        open={changeStatusModal === "delivered"}
        onClose={() => setChangeStatusModal(null)}
        onAccept={() => setRequestStatus("done")}
      />
      <ActionConfirm
        message="ایا مطمئن هستید؟"
        open={changeStatusModal === "enabled"}
        onClose={() => setChangeStatusModal(null)}
        onAccept={() => setRequestStatus("enabled")}
      />
      <RequestDetailModal
        open={showDetails}
        onClose={() => toggleShowDetails()}
        data={selectedRowData}
        historyActions={allRequest?.history_actions}
      />

      {/* waybill details Modal */}
      <WaybillDetailsModal
        open={showWayBillDetails}
        onClose={() => toggleShowWayBillDetails()}
        data={selectedRowData?.waybill ?? {}}
      />

      {/* all persons scores Modal */}
      <AllScoresModal
        open={showAllScores}
        onClose={() => toggleShowAllScores()}
        data={selectedRowData}
      />

      {/* draft detail Modal */}
      <DraftDetailsModal
        open={showDraftDetails}
        onClose={() => toggleShowDraftDetails()}
        data={draftDoc ?? {}}
      />

      {/* request Needs Modal */}
      <RequestNeedsModal
        onClose={() => setOpenRequestNeeds(false)}
        open={openRequestNeeds}
        request={selectedRowData}
      />
    </>
  );
}

const SearchBox = ({ statuses }) => {
  const { searchParamsFilter, setSearchParamsFilter, hasData } =
    useSearchParamsFilter();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
    reset,
  } = useForm({
    defaultValues: searchParamsFilter,
  });

  const [openCollapse, setOpenCollapse] = useState(hasData);

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
      customView: <MultiProjects control={control} name={"project_id"} />,
    },
    {
      type: "custom",
      customView: <MultiContracts control={control} name={"contract_id"} />,
    },
    {
      type: "custom",
      customView: <MultiDrivers control={control} name={"driver_id"} />,
    },
    {
      type: "custom",
      customView: <MultiFleets control={control} name={"fleet_id"} />,
    },
    {
      type: "custom",
      customView: <MultiProducts control={control} name={"product_id"} />,
    },
    {
      type: "custom",
      customView: (
        <MultiPersons control={control} name={"receiver_id"} label="گیرنده" />
      ),
    },
    {
      type: "custom",
      customView: (
        <MultiPersons control={control} name={"sender_id"} label="فرستنده" />
      ),
    },
    {
      type: "custom",
      customView: <MultiVTypes control={control} name={"vehicle_type_id"} />,
    },
    {
      type: "custom",
      customView: <ChooseOwner control={control} name={"owner_id"} />,
    },
    {
      type: "custom",
      customView: (
        <MultiShippingCompanies
          control={control}
          name={"shipping_company_id"}
        />
      ),
    },
    {
      type: "select",
      name: "status",
      valueKey: "id",
      labelKey: "title",
      defaultValue: "all",
      label: "وضعیت",
      options: renderSelectOptions({ all: "همه", ...statuses }),
      control: control,
    },
    {
      type: "custom",
      customView: <ChooseSalon control={control} name={"salon"} />,
    },
    {
      type: "number",
      name: "weight_min",
      label: "حداقل وزن",
      splitter: true,
      control: control,
      noInputArrow: true,
    },
    {
      type: "number",
      name: "weight_max",
      label: "حداکثر وزن",
      control: control,
      splitter: true,
      noInputArrow: true,
    },
    {
      type: "date",
      name: "load_date_min",
      label: "تاریخ بارگیری از",
      control: control,
    },
    {
      type: "date",
      name: "load_date_max",
      label: "تاریخ بارگیری تا",
      control: control,
    },
    {
      type: "date",
      name: "discharge_date_min",
      label: "تاریخ تخلیه از",
      control: control,
    },
    {
      type: "date",
      name: "discharge_date_max",
      label: "تاریخ تخلیه تا",
      control: control,
    },
    {
      type: "date",
      name: "from",
      label: "تاریخ ثبت از",
      control: control,
    },
    {
      type: "date",
      name: "to",
      label: "تاریخ ثبت تا",
      control: control,
    },
    {
      type: "checkbox",
      name: "with_expired",
      label: "نمایش درخواست های منقضی شده",
      control: control,
    },
    {
      type: "zone",
      name: "zones",
      control: control,
      gridProps: { md: 12 },
      height: "400px",
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
        load_date_max: data?.load_date_max?.load_date_max,
        load_date_min: data?.load_date_min?.load_date_min,
        to: data?.to?.to,
        from: data?.from?.from,
        source_zone_id: data?.zones?.source_zones,
        destination_zone_id: data?.zones?.destination_zones,
        discharge_date_max: data?.discharge_date_max?.discharge_date_max,
        discharge_date_min: data?.discharge_date_min?.discharge_date_min,
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
