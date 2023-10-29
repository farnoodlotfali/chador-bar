import { useState } from "react";

import {
  Grid,
  Select,
  MenuItem,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Stack,
  Typography,
  Card,
  TextField,
  FormControl,
  InputLabel,
  Button,
  Box,
  Tab,
  Divider,
  Rating,
  Tooltip,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import Table from "Components/versions/Table";
import TableActionCell from "Components/versions/TableActionCell";
import Modal from "Components/versions/Modal";
import ActionConfirm from "Components/ActionConfirm";
import Timeline from "Components/versions/Timeline";
import {
  enToFaNumber,
  numberWithCommas,
  handleDate,
  renderPlaqueObjectToString,
  removeInvalidValues,
  renderWeight,
  renderSelectOptions,
  requestStatus,
  faToEnNumber,
} from "Utility/utils";
import DrivingDirection from "Components/DrivingDirection";
import { axiosApi, uncontrolledAxiosApi } from "api/axiosApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRequest } from "hook/useRequest";
import { toast } from "react-toastify";
import WayBillPaper from "Components/papers/WaybillPaper";
import DraftPaper from "Components/papers/DraftPaper";
import { useForm } from "react-hook-form";
import { FormContainer, FormInputs } from "Components/Form";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import OwnerDetailModal from "Components/modals/OwnerDetailModal";
import NewDraft from "pages/Waybill/NewDraft";
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
import MultiCustomers from "Components/multiSelects/MultiCustomers";
import RequestStepper from "Components/versions/RequestStepper";
import CreatorDetailModal from "Components/modals/CreatorDetailModal";
import SelectPriceDriver from "Components/selects/SelectPriceDriver";
import { SvgSPrite } from "Components/SvgSPrite";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import FormTypography from "Components/FormTypography";
import { ChooseFleet } from "Components/choosers/ChooseFleet";
import { ChooseDriver } from "Components/choosers/driver/ChooseDriver";
import { useLoadSearchParamsAndReset } from "hook/useLoadSearchParamsAndReset";
import HelmetTitlePage from "Components/HelmetTitlePage";
import ShowPersonScoreModal from "Components/modals/ShowPersonScoreModal";
import { RATE_TYPE } from "Constants";

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
    id: "actions",
    label: "عملیات",
  },
];
const statusesColor = {
  error: ["cancel", "rejected", "expired"],
  warning: ["load_permit", "issue_waybill"],
  info: ["wait_for_payment", "set", "submit", "load", "load_confirm", "edit"],
  success: ["delivered", "done", "enabled"],
};

export default function RequestList() {
  const queryClient = useQueryClient();
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
  const [showNewDraftModal, setShowNewDraftModal] = useState(false);
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

  const handleRequestStatusColor = (status) => {
    let color;
    Object.keys(statusesColor).forEach((key) => {
      if (statusesColor[key].includes(status)) color = key;
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
    setShowVehicleModal((prev) => !prev);
    if (rowData) setSelectedRowData(rowData);
  };

  // Change request status
  const handleRejectRequest = (request) => {
    setChangeStatusData({ id: request.id });
    setChangeStatusModal("reject");
  };
  const handleAcceptRequest = (request) => {
    setChangeStatusData({ id: request.id, request: request });

    const status = request.status;

    if (allRequest?.need_payment_modal.includes(status)) {
      setChangeStatusModal("payment");
    } else if (allRequest?.need_waybill_modal.includes(status)) {
      setChangeStatusModal("waybill");
    } else if (allRequest?.can_set_driver.includes(status)) {
      setChangeStatusModal("driver");
    } else {
      setChangeStatusModal("accept");
    }
  };

  const changeRequestStatus = (action) => {
    let data = JSON.stringify({
      action: action,
      ...changeStatusData,
    });
    changeStatusMutation.mutate(data);
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

  // check if written draft number is valid or not
  const checkDraftNumber = async () => {
    if (!changeStatusData.draft_number) {
      toast.error("شماره حواله نامعتبر است");
      setChangeStatusData((prev) => ({ ...prev, draft_valid: false }));
      return;
    }
    try {
      const res = await getDraftDetail(changeStatusData.draft_number);
      setChangeStatusData((prev) => ({ ...prev, draft_valid: true }));

      toast.success("شماره حواله معتبر است");
    } catch (error) {
      setChangeStatusData((prev) => ({ ...prev, draft_valid: false }));
      toast.error("شماره حواله نامعتبر است");
    }
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
      <SearchBox
        statuses={allRequest?.statuses}
        registerTypes={allRequest?.register_types}
      />

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
                tooltip: "رد کردن",
                color: "error",
                icon: "xmark",
                name: "customer.change-status",
                disabled: !allRequest?.rejectable.includes(row.status),
                onClick: () => handleRejectRequest(row),
              },
            ];

            const status = requestStatus[row.next_status];

            // next_status
            !canSetDriver
              ? buttons_1.unshift({
                  tooltip: status?.title ?? "پذیرفتن",
                  color: status?.color ?? "success",
                  icon: status?.icon ?? "check",
                  name: "customer.change-status",
                  disabled: !allRequest?.acceptable.includes(row.status),
                  onClick: () => handleAcceptRequest(row),
                })
              : buttons_1.unshift({
                  tooltip: "انتخاب راننده",
                  color: "info",
                  icon: "user-nurse",
                  name: "request.set-driver",
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

            if (row.status === "done") {
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
                      } (${enToFaNumber(row.driver?.mobile) ?? ""})`}
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
                    {`${row.owner?.first_name || ""} ${
                      row.owner?.last_name || ""
                    }`}
                  </Typography>
                </TableCell>
                <TableCell align="center">{renderWeight(row.weight)}</TableCell>
                <TableCell align="center">
                  {row.vehicle ? (
                    <Typography
                      variant="clickable"
                      onClick={() => toggleShowVehicleDetails(row)}
                    >
                      {renderPlaqueObjectToString(row.vehicle?.plaque)}
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
                  {row?.proposed_price
                    ? enToFaNumber(numberWithCommas(row.proposed_price)) +
                      " ریال"
                    : "قیمت توافقی"}
                </TableCell>
                <TableCell align="center">
                  {row.load_time ? (
                    <Typography variant="subtitle2">
                      {handleDate(row.load_time, "YYYY/MM/DD")}
                      {" - "}
                      {handleDate(row.load_time, "HH:MM")}
                    </Typography>
                  ) : (
                    "-"
                  )}
                </TableCell>

                <TableCell>
                  <TableActionCell buttons={buttons_1} />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={handleRequestStatus(row.status)}
                    color={handleRequestStatusColor(row.status)}
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
      {selectedRowData && (
        <DrivingDirection
          showMap={showMap}
          toggleShowMap={() => toggleShowMap()}
          rowData={selectedRowData}
        />
      )}
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
      {/* Accept request with payment modal */}
      <Modal
        open={changeStatusModal === "payment"}
        onClose={() => setChangeStatusModal(null)}
        maxWidth="md"
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" sx={{ width: "100%" }}>
              <InputLabel>روش پرداخت</InputLabel>

              <Select
                label="روش پرداخت"
                sx={{ width: "100%" }}
                onChange={(e) =>
                  setChangeStatusData((prev) => ({
                    ...prev,
                    payment_method: e.target.value,
                  }))
                }
              >
                {allRequest?.payment_methods &&
                  Object.keys(allRequest.payment_methods).map((key) => (
                    <MenuItem key={key} value={key}>
                      {allRequest.payment_methods[key]}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="شماره حواله"
              variant="outlined"
              sx={{ width: "100%" }}
              onChange={(e) => {
                setChangeStatusData((prev) => ({
                  ...prev,
                  draft_number: faToEnNumber(e.target.value),
                }));
              }}
              value={enToFaNumber(changeStatusData?.draft_number)}
            />
          </Grid>

          <Grid item xs={0} md={6}>
            <Stack
              direction={"row"}
              alignItems="end"
              justifyContent="space-between"
            >
              <Typography>آیا میخواهید حواله جدید ثبت نمایید ؟</Typography>
              <Button
                variant="contained"
                sx={{ ml: 2, paddingInline: 3 }}
                onClick={() => {
                  setShowNewDraftModal(!showNewDraftModal);
                }}
              >
                بله
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction={"row"}>
              <Button variant="outlined" onClick={checkDraftNumber} fullWidth>
                چک کردن شماره حواله
              </Button>
            </Stack>
            {changeStatusData.draft_valid !== undefined && (
              <Typography
                color={
                  changeStatusData.draft_valid ? "success.main" : "error.main"
                }
                mt={1}
                variant="subtitle2"
              >
                شماره حواله وارد شده،{" "}
                {changeStatusData.draft_valid ? "معتبر" : "نامعتبر"} است
              </Typography>
            )}
          </Grid>
        </Grid>

        <Stack alignItems="flex-end" mt={3}>
          <LoadingButton
            variant="contained"
            // loading={changeStatusLoading}
            onClick={() => changeRequestStatus("accept")}
          >
            تایید
          </LoadingButton>
        </Stack>
      </Modal>
      {/* Accept request with waybill modal */}
      <Modal
        open={["waybill", "load", "load_permit", "load_confirm"].includes(
          changeStatusModal
        )}
        onClose={() => setChangeStatusModal(null)}
        maxWidth="md"
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              sx={{ width: "100%" }}
              placeholder="شماره بارنامه"
              value={changeStatusData.waybill_number || ""}
              onChange={(e) =>
                setChangeStatusData((prev) => ({
                  ...prev,
                  waybill_number: e.target.value,
                }))
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              sx={{ width: "100%" }}
              placeholder="xx/xxxx"
              value={changeStatusData.waybill_serial || ""}
              onChange={(e) =>
                setChangeStatusData((prev) => ({
                  ...prev,
                  waybill_serial: e.target.value,
                }))
              }
            />
          </Grid>
        </Grid>

        <Stack alignItems="flex-end" mt={3}>
          <LoadingButton
            variant="contained"
            // loading={changeStatusLoading}
            onClick={() => changeRequestStatus("accept")}
          >
            تایید
          </LoadingButton>
        </Stack>
      </Modal>
      {/* Set request driver and fleet modal */}
      <ChooseDriverAndFleetModal
        open={changeStatusModal === "driver"}
        changeStatusData={changeStatusData}
        setChangeStatusData={setChangeStatusData}
        onClose={() => setChangeStatusModal(null)}
      />
      <Modal
        open={showNewDraftModal}
        onClose={() => {
          setShowNewDraftModal(false);
        }}
      >
        <NewDraft />
      </Modal>
      <ActionConfirm
        message="ایا مطمئن هستید؟"
        open={changeStatusModal === "accept"}
        onClose={() => setChangeStatusModal(null)}
        onAccept={() => changeRequestStatus("accept")}
      />
      <DetailsModal
        open={showDetails}
        onClose={() => toggleShowDetails()}
        data={selectedRowData}
        historyActions={allRequest?.history_actions}
      />
      <WayBillDetailsModal
        open={showWayBillDetails}
        onClose={() => toggleShowWayBillDetails()}
        data={selectedRowData?.waybill ?? {}}
      />
      <AllScoresModal
        open={showAllScores}
        onClose={() => toggleShowAllScores()}
        data={selectedRowData}
      />
      <DraftDetailsModal
        open={showDraftDetails}
        onClose={() => toggleShowDraftDetails()}
        data={draftDoc ?? {}}
      />
    </>
  );
}

const AllScoresModal = ({ open, onClose, data = {} }) => {
  const [showScoredHistory, setShowScoredHistory] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const {
    data: ratings,
    isLoading,
    isFetching,
  } = useQuery(
    ["rating", "ratable_id", data?.id],
    () =>
      axiosApi({ url: `rating?ratable_id=${data?.id}` }).then(
        (res) => res.data.Data?.items?.data
      ),
    {
      enabled: open && !!data?.id,
      staleTime: 24 * 60 * 60 * 100,
    }
  );

  const toggleShowScoredHistory = () => {
    setShowScoredHistory((prev) => !prev);
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Typography variant="h5" mb={5}>
          امتیازات کسب شده در این آگهی
        </Typography>

        {isLoading || isFetching ? (
          <LoadingSpinner />
        ) : (
          <Grid container spacing={2}>
            {ratings.map((item) => {
              return (
                <Grid key={item.id} item xs={12} md={4}>
                  <Card
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Typography variant="subtitle2">
                      {RATE_TYPE[item.rated_type]}
                    </Typography>

                    <Stack direction="row" spacing={1}>
                      <Rating
                        precision={0.2}
                        value={item?.score}
                        size="small"
                        readOnly
                        color="inherit"
                      />

                      <Tooltip placement="top" title="مشاهده تاریخچه امتیازات">
                        <Box
                          sx={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedId(item.rated_id);
                            toggleShowScoredHistory();
                          }}
                        >
                          <SvgSPrite
                            icon="rectangle-history-circle-user"
                            color="inherit"
                            size={20}
                          />
                        </Box>
                      </Tooltip>
                    </Stack>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Modal>

      <ShowPersonScoreModal
        show={showScoredHistory}
        onClose={toggleShowScoredHistory}
        dataId={selectedId}
      />
    </>
  );
};

const ChooseDriverAndFleetModal = ({
  open,
  onClose,
  changeStatusData,
  setChangeStatusData,
}) => {
  const queryClient = useQueryClient();
  const {
    control,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm();

  const [tab, setTab] = useState(1);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const setDriverMutation = useMutation(
    (form) =>
      axiosApi({
        url: `/set-driver/${form.id}`,
        method: "post",
        data: form.data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["request"]);
        onClose();
        toast.success("درخواست شما با موفقیت انجام شد");
      },
    }
  );
  const setFleetAndDriverMutation = useMutation(
    (form) =>
      axiosApi({
        url: `/set-fleet/${form.id}`,
        method: "post",
        data: form.data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["request"]);
        onClose();
        toast.success("درخواست شما با موفقیت انجام شد");
      },
    }
  );

  // Set driver for enabled requests
  const setDriver = () => {
    let form = {
      id: changeStatusData.id,
      data: {
        driver_id: changeStatusData.driver.account_id,
      },
    };

    setDriverMutation.mutate(form);
  };

  const Inputs = [
    {
      type: "custom",
      customView: (
        <ChooseFleet
          control={control}
          name={"fleet"}
          rules={{
            required: "ناوگان را وارد کنید",
          }}
        />
      ),
    },
  ];
  const FirstDriverInputs = [
    {
      type: "custom",
      customView: (
        <ChooseDriver
          control={control}
          isLoadFromApi={false}
          dataArray={watch("fleet")}
          name={"driver"}
          rules={{
            required: "راننده را وارد کنید",
          }}
        />
      ),
    },
  ];

  const SecondDriverInputs = [
    {
      type: "custom",
      customView: (
        <ChooseDriver
          control={control}
          dataArray={watch("fleet")}
          isLoadFromApi={false}
          name={"second_driver"}
          notAllowedDriver={watch("driver")}
        />
      ),
    },
  ];

  // handle on submit
  // Set fleet for enabled requests
  const onSubmit = (data) => {
    let form = {
      id: changeStatusData.id,
      data: removeInvalidValues({
        driver_id: data.driver.account_id,
        second_driver_id: data.second_driver.account_id,
        fleet_id: data.fleet.id,
      }),
    };

    setFleetAndDriverMutation.mutate(form);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} variant="fullWidth">
            <Tab label="انتخاب راننده" value={1} />
            <Tab label="انتخاب ناوگان" value={2} />
          </TabList>
        </Box>
        <TabPanel value={1}>
          <>
            <SelectPriceDriver
              data={changeStatusData.driver}
              setData={(driver) => {
                setChangeStatusData((prev) => ({
                  ...prev,
                  driver: driver,
                }));
              }}
              listDrivers={changeStatusData?.request?.drivers}
            />
            <Stack alignItems="flex-end" mt={3}>
              <LoadingButton
                variant="contained"
                // loading={changeStatusLoading}
                onClick={setDriver}
              >
                تایید
              </LoadingButton>
            </Stack>
          </>
        </TabPanel>
        <TabPanel value={2}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormContainer
              data={watch()}
              setData={handleChange}
              errors={errors}
            >
              <FormTypography>ناوگان</FormTypography>
              <FormInputs inputs={Inputs} gridProps={{ md: 12 }} />
              <Divider sx={{ my: 2 }} />

              <Stack direction="row" spacing={2}>
                <Box sx={{ width: "100%" }}>
                  <FormTypography>راننده اول</FormTypography>
                  <FormInputs
                    inputs={FirstDriverInputs}
                    gridProps={{ md: 12 }}
                  />
                </Box>

                <Box sx={{ width: "100%" }}>
                  <FormTypography>راننده دوم(اختیاری)</FormTypography>
                  <FormInputs
                    inputs={SecondDriverInputs}
                    gridProps={{ md: 12 }}
                  />
                </Box>
              </Stack>

              <Stack direction="row" justifyContent="flex-end" mt={4}>
                <Button variant="contained" type="submit">
                  ذخیره
                </Button>
              </Stack>
            </FormContainer>
          </form>
        </TabPanel>
      </TabContext>
    </Modal>
  );
};

const SearchBox = ({ statuses, registerTypes }) => {
  const { searchParamsFilter, setSearchParamsFilter, hasData } =
    useSearchParamsFilter();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
    reset,
  } = useForm({ defaultValues: searchParamsFilter });

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
      customView: <MultiCustomers control={control} name={"owner_id"} />,
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
      type: "select",
      name: "register_type",
      valueKey: "id",
      labelKey: "title",
      label: "نوع ثبت",
      defaultValue: "all",
      options: renderSelectOptions({ all: "همه", ...registerTypes }),
      control: control,
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
    // {
    //   type: "zone",
    //   name: "zones",
    //   control: control,
    //   rules: {
    //     required: "zones را وارد کنید",
    //   },
    //   gridProps: { md: 12 },
    //   height: "400px",
    // },
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

const WayBillDetailsModal = ({ open, onClose, data = {} }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <WayBillPaper data={data} />
    </Modal>
  );
};

const DraftDetailsModal = ({ open, onClose, data = {} }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <DraftPaper data={data} />
    </Modal>
  );
};

const CardsStyle = {
  width: "100%",
  height: "100%",
  p: 2,
  boxShadow: 1,
};

const DetailsModal = ({ open, onClose, data = {}, historyActions }) => {
  const RowLabelAndData = (label, info, icon = "") => {
    return (
      <Stack direction={"row"} justifyContent="space-between">
        <Typography
          sx={{
            fontWeight: "600",
            display: "flex",
            alignItems: "flex-start",
            gap: 0.5,
            mr: 1,
          }}
        >
          {icon}
          {label}:
        </Typography>
        <Typography textAlign="justify">{info}</Typography>
      </Stack>
    );
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <RequestStepper status={data?.status} size={30} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={CardsStyle}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h5">اطلاعات کلی</Typography>

              <SvgSPrite icon="file-lines" size="large" MUIColor="info" />
            </Stack>

            <Stack spacing={1} mt={3}>
              {RowLabelAndData(
                "کد آگهی",
                data.code ?? "-",
                <SvgSPrite icon="spell-check" MUIColor="primary" />
              )}

              {RowLabelAndData(
                "قیمت پیشنهادی",
                data?.proposed_price
                  ? `${enToFaNumber(
                      numberWithCommas(data.proposed_price)
                    )} ریال`
                  : "-",
                <SvgSPrite icon="circle-dollar" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "حداقل قیمت سامانه",
                data.low_price
                  ? `${enToFaNumber(numberWithCommas(data.low_price))} ریال`
                  : "-",
                <SvgSPrite icon="circle-dollar" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "حداکثر قیمت سامانه",
                data.high_price
                  ? `${enToFaNumber(numberWithCommas(data.high_price))} ریال`
                  : "-",
                <SvgSPrite icon="circle-dollar" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "قیمت نهایی",
                data.price
                  ? `${enToFaNumber(numberWithCommas(data.price))} ریال`
                  : "-",
                <SvgSPrite icon="circle-dollar" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "نام فرستنده",
                (data?.sender?.first_name ?? "-") +
                  " " +
                  (data?.sender?.last_name ?? ""),
                <SvgSPrite icon="user" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "شماره موبایل فرستنده",
                data?.sender?.mobile ? "0" + data?.sender?.mobile : "",
                <SvgSPrite icon="phone" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "کد پستی مبداء",
                data.source_zip_code ?? "-",
                <SvgSPrite icon="message-code" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "مبدا",
                data.source_address ?? "-",
                <SvgSPrite icon="location-dot" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "نام گیرنده",

                (data?.receiver?.first_name ?? "-") +
                  " " +
                  (data?.receiver?.last_name ?? ""),
                <SvgSPrite icon="user" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "شماره موبایل گیرنده",
                data?.receiver?.mobile ? "0" + data?.receiver?.mobile : "",
                <SvgSPrite icon="phone" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "کد پستی مقصد",
                data.destination_zip_code ?? "-",
                <SvgSPrite icon="message-code" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "مقصد",
                data.destination_address ?? "-",
                <SvgSPrite icon="location-plus" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "کد ناوگان",
                data.fleet?.code ?? "-",
                <SvgSPrite icon="truck-front" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "نوع بارگیر",
                data.vehicle_type?.title ?? "-",
                <SvgSPrite icon="truck-front" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "نام محصول",
                data.product?.title ?? "-",
                <SvgSPrite icon="input-text" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "سریال بارنامه",
                data.waybill_serial ?? "-",
                <SvgSPrite icon="message-code" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "شماره بارنامه",
                data.waybill_number ?? "-",
                <SvgSPrite icon="message-code" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "زمان بارگیری",
                data.load_time_fa ?? "-",
                <SvgSPrite icon="clock-ten" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "زمان تخلیه",
                data.discharge_time_fa ?? "-",
                <SvgSPrite icon="clock-three" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "زمان ثبت",
                `${
                  handleDate(data.created_at, "YYYY/MM/DD") +
                  "  " +
                  handleDate(data.created_at, "HH:MM")
                }`,
                <SvgSPrite icon="clock-ten" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "وزن",
                `${
                  data.weight
                    ? enToFaNumber(numberWithCommas(data.weight)) + " کیلوگرم"
                    : "-"
                }`,
                <SvgSPrite icon="weight-scale" MUIColor="primary" />
              )}

              <Stack direction={"row"} justifyContent="space-between">
                <Typography
                  sx={{
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mr: 1,
                  }}
                >
                  <SvgSPrite icon="store" MUIColor="primary" />
                  سالن بار
                </Typography>
                {data?.salons?.map((item, index) => {
                  return (
                    <Typography key={index++} textAlign="justify">
                      {item?.name}
                    </Typography>
                  );
                })}
              </Stack>

              {RowLabelAndData(
                "توضیحات",
                data.description ?? "-",
                <SvgSPrite icon="file" MUIColor="primary" />
              )}
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={CardsStyle}>
            <DrivingDirection showModal={false} rowData={data} />
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Stack direction={"row"} sx={{ width: "100%" }} spacing={2}>
            <Card sx={{ width: "50%", padding: 2 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h5">اطلاعات صاحب بار</Typography>

                <SvgSPrite icon="user" MUIColor="warning" size="large" />
              </Stack>
              <Stack spacing={1} mt={3}>
                {data.driver ? (
                  <>
                    {RowLabelAndData(
                      "نام",
                      `${
                        data.owner.first_name
                          ? data.owner.first_name + " " + data.owner.last_name
                          : ""
                      }`,
                      <SvgSPrite icon="user" MUIColor="primary" />
                    )}
                    {RowLabelAndData(
                      "شماره موبایل",
                      enToFaNumber("0" + data.owner.mobile),
                      <SvgSPrite icon="mobile" MUIColor="primary" />
                    )}

                    {RowLabelAndData(
                      "کد ملی",
                      enToFaNumber(data.owner?.national_code) ?? "-",
                      <SvgSPrite icon="message-code" MUIColor="primary" />
                    )}
                  </>
                ) : (
                  <Typography>راننده‌ای تخصیص داده نشده است</Typography>
                )}
              </Stack>
            </Card>
            <Card sx={{ width: "50%", padding: 2 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h5">اطلاعات راننده</Typography>

                <SvgSPrite icon="car" size="large" MUIColor="warning" />
              </Stack>
              <Stack spacing={1} mt={3}>
                {data.driver ? (
                  <>
                    {RowLabelAndData(
                      "نام",
                      `${
                        data.driver.first_name ??
                        "-" + " " + data.driver.last_name ??
                        ""
                      }`,
                      <SvgSPrite icon="user" MUIColor="primary" />
                    )}
                    {RowLabelAndData(
                      "شماره موبایل",
                      enToFaNumber(data.driver.mobile),
                      <SvgSPrite icon="mobile" MUIColor="primary" />
                    )}

                    {RowLabelAndData(
                      "نوع کامیون",
                      data.vehicle?.category?.title ?? "-",
                      <SvgSPrite icon="truck" MUIColor="primary" />
                    )}
                    {RowLabelAndData(
                      "نام خودرو",
                      data.vehicle?.title ?? "-",
                      <SvgSPrite icon="truck-front" MUIColor="primary" />
                    )}
                    {RowLabelAndData(
                      "پلاک خودرو",
                      renderPlaqueObjectToString(data?.vehicle?.plaque),
                      <SvgSPrite icon="thumbtack" MUIColor="primary" />
                    )}
                  </>
                ) : (
                  <Typography>راننده‌ای تخصیص داده نشده است</Typography>
                )}
              </Stack>
            </Card>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Card sx={CardsStyle}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={3}
            >
              <Typography variant="h5">تاریخچه</Typography>

              <SvgSPrite icon="clock-one" size="large" MUIColor="success" />
            </Stack>

            <Timeline data={data.histories} historyActions={historyActions} />
          </Card>
        </Grid>
      </Grid>
    </Modal>
  );
};
