import {
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Rating,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Modal from "Components/versions/Modal";
import {
  enToFaNumber,
  handleDate,
  renderMobileFormat,
  renderPlaqueObjectToString,
  renderWeight,
} from "Utility/utils";

import { Link } from "react-router-dom";
import { memo, useState } from "react";

import ShowDriverFleet from "./ShowDriverFleet";
import ShowVehiclesFleet from "./ShowVehiclesFleet";
import VehicleDetailModal from "./VehicleDetailModal";
import { SvgSPrite } from "Components/SvgSPrite";
import { toast } from "react-toastify";

import PieChart from "Components/charts/PieChart";
import DraftDetailsModal from "./DraftDetailsModal";
import WaybillDetailsModal from "./WaybillDetailsModal";

const CardsStyle = {
  width: "100%",
  height: "100%",
  p: 2,
  boxShadow: 1,
};

const ProjectDetailModal = ({ data, show, onClose }) => {
  const [showModal, setShowModal] = useState(null);
  const chartValues = {
    "درخواست شده": data?.set_weight,
    "پذیرفته شده توسط راننده": data?.submit_weight,
    "برنامه‌ریزی نشده(باقیمانده)": data?.remaining_weight,
    "بارگیری شده": data?.load_weight,
    "حمل شده": data?.done_weight,
  };
  const closeModal = () => {
    setShowModal(null);
  };

  const RowLabelAndData = (label, info, icon = "") => {
    return (
      <Grid item xs={12}>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <Typography
              sx={{
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mr: 1,
              }}
            >
              {icon}
              {label}:
            </Typography>
          </Grid>
          <Grid item xs={true}>
            <Divider
              sx={{
                borderBottomWidth: "medium",
                borderBottomStyle: "dashed",
                px: 1,
                width: "100%",
              }}
            />
          </Grid>
          <Grid item>
            <Typography textAlign="justify">{info}</Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const handleShowFleetVehicles = () => {
    setShowModal("fleetVehicles");
  };
  const handleShowDrivers = () => {
    setShowModal("drivers");
  };

  return (
    show && (
      <>
        <Modal onClose={onClose} open={show}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={CardsStyle}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="h5">اطلاعات کلی</Typography>

                  <Tooltip title="مشاهده کامل اطلاعات" placement="right">
                    <IconButton
                      component={Link}
                      to={`/project/${data.id}`}
                      target="_blank"
                    >
                      <SvgSPrite icon="eye" MUIColor="info" />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <Grid container spacing={2} mt={2}>
                  {RowLabelAndData(
                    "کد",
                    enToFaNumber(data.code) ?? "-",
                    <SvgSPrite icon="qrcode" MUIColor="primary" size="small" />
                  )}
                  {RowLabelAndData(
                    "تاریخ ثبت",
                    handleDate(data.created_at, "YYYY/MM/DD") ?? "-",
                    <SvgSPrite
                      icon="check-to-slot"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "تاریخ شروع",
                    handleDate(data?.start_date, "YYYY/MM/DD") ?? "-",
                    <SvgSPrite
                      icon="check-to-slot"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "تاریخ پایان",
                    handleDate(data?.end_date, "YYYY/MM/DD") ?? "-",
                    <SvgSPrite
                      icon="check-to-slot"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "تعداد درخواست ‌ها",
                    enToFaNumber(data.requests_count) ?? "-",
                    <SvgSPrite icon="hashtag" size="small" MUIColor="primary" />
                  )}

                  {RowLabelAndData(
                    "وزن کل درخواست‌ها",
                    data.requests_total_weight
                      ? renderWeight(data.requests_total_weight)
                      : "-",
                    <SvgSPrite
                      icon="weight-scale"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "وزن درخواست‌ شده",
                    data?.set_weight ? renderWeight(data?.set_weight) : "-",
                    <SvgSPrite
                      icon="weight-scale"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "وزن پذیرفته شده",
                    data?.submit_weight
                      ? renderWeight(data?.submit_weight)
                      : "-",
                    <SvgSPrite
                      icon="weight-scale"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "وزن بارگیری شده",
                    data?.load_weight ? renderWeight(data?.load_weight) : "-",
                    <SvgSPrite
                      icon="weight-scale"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "وزن حمل شده",
                    data?.done_weight ? renderWeight(data?.done_weight) : "-",
                    <SvgSPrite
                      icon="weight-scale"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "وزن باقیمانده",
                    data?.remaining_weight
                      ? renderWeight(data?.remaining_weight)
                      : "-",
                    <SvgSPrite
                      icon="weight-scale"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "وزن قراداد",
                    data?.contract_weight
                      ? renderWeight(data?.contract_weight)
                      : "-",
                    <SvgSPrite
                      icon="weight-scale"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "وزن پروژه",
                    data?.weight ? renderWeight(data?.weight) : "-",
                    <SvgSPrite
                      icon="weight-scale"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "میانگین زمان حمل پروژه",
                    enToFaNumber(data.average_shipping_time) ?? "-",
                    <SvgSPrite
                      icon="alarm-clock"
                      size="small"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "میانگین امتیاز رانندگان",
                    <Rating
                      precision={0.2}
                      sx={{
                        width: "fit-content",
                      }}
                      value={data?.driver_ratings}
                      size="small"
                      readOnly
                    />,
                    <SvgSPrite
                      icon="star-half-stroke"
                      MUIColor="primary"
                      sxStyles={{ ml: -0.5 }}
                    />
                  )}
                  {RowLabelAndData(
                    "میانگین امتیاز صاحبان‌بار",
                    <Rating
                      precision={0.2}
                      sx={{
                        width: "fit-content",
                      }}
                      value={data?.owner_ratings}
                      size="small"
                      readOnly
                    />,
                    <SvgSPrite
                      icon="star-half-stroke"
                      MUIColor="primary"
                      sxStyles={{ ml: -0.5 }}
                    />
                  )}
                  {RowLabelAndData(
                    "میانگین امتیاز شرکت های حمل",
                    <Rating
                      precision={0.2}
                      sx={{
                        width: "fit-content",
                      }}
                      value={data?.shipping_company_ratings}
                      size="small"
                      readOnly
                    />,
                    <SvgSPrite
                      icon="star-half-stroke"
                      MUIColor="primary"
                      sxStyles={{ ml: -0.5 }}
                    />
                  )}
                </Grid>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={CardsStyle}>
                <Typography variant="h5">وضعیت پروژه</Typography>

                <PieChart
                  labels={Object.keys(
                    Object.fromEntries(
                      Object.entries(chartValues).filter(([k, v]) => v > 0)
                    )
                  )}
                  dataValues={Object.values(
                    Object.fromEntries(
                      Object.entries(chartValues).filter(([k, v]) => v > 0)
                    )
                  )}
                  height={500}
                />
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={CardsStyle}>
                <Stack direction="row" alignItems="center" spacing={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<SvgSPrite icon="people-group" color="inherit" />}
                    onClick={handleShowDrivers}
                  >
                    لیست رانندگان پروژه
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<SvgSPrite icon="truck" color="inherit" />}
                    onClick={handleShowFleetVehicles}
                  >
                    لیست ناوگان های پروژه
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<SvgSPrite icon="receipt" color="inherit" />}
                    onClick={() => {
                      if (data?.waybills?.length > 0) {
                        setShowModal("waybill");
                      } else {
                        toast.error("بارنامه ای یافت نشد");
                      }
                    }}
                  >
                    بارنامه ها
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<SvgSPrite icon="scroll-old" color="inherit" />}
                    onClick={() => {
                      if (data?.drafts?.length > 0) {
                        setShowModal("draft");
                      } else {
                        toast.error("حواله ای یافت نشد");
                      }
                    }}
                  >
                    حواله ها
                  </Button>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Modal>

        {/* modals */}

        <FleetVehiclesPerDriverModal
          show={showModal === "fleetVehicles"}
          onClose={closeModal}
          fleetVehicle={data?.fleets}
        />
        <WaybillModal
          show={showModal === "waybill"}
          onClose={closeModal}
          waybills={data?.waybills}
        />
        <DraftModal
          show={showModal === "draft"}
          onClose={closeModal}
          drafts={data?.drafts}
        />
        <DriversPerFleetVehicleModal
          show={showModal === "drivers"}
          onClose={closeModal}
          drivers={data?.drivers}
        />
      </>
    )
  );
};

const DriversPerFleetVehicleModal = memo(({ drivers, show, onClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [fleets, setFleets] = useState([]);

  const handleShowDrivers = (data) => {
    setShowModal(true);
    setFleets(data);
  };

  return (
    show && (
      <>
        <Modal onClose={onClose} open={show}>
          <Typography
            variant="h5"
            mb={3}
            typography={{ md: "h5", xs: "body2" }}
          >
            لیست راننده‌ها در درخواست های پروژه
          </Typography>

          <Grid container spacing={2}>
            {drivers?.map((item) => {
              return (
                <Grid key={item.id} item xs={12} md={4}>
                  <Card sx={{ p: 2 }}>
                    <Stack justifyContent="center" spacing={3}>
                      <Stack direction="row" alignItems="center" lineHeight={1}>
                        <Typography variant="subtitle1" lineHeight="inherit">
                          {(item?.first_name ?? "-") +
                            " " +
                            (item?.last_name ?? "")}
                        </Typography>
                        <Divider
                          sx={{
                            borderBottomWidth: "medium",
                            borderBottomStyle: "dashed",
                            mx: 1,
                            flex: 1,
                          }}
                        />
                        <Typography variant="subtitle2" lineHeight="inherit">
                          {renderMobileFormat(item?.mobile ?? "-")}
                        </Typography>
                      </Stack>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleShowDrivers(item?.fleets)}
                      >
                        نمایش خودروها
                      </Button>
                    </Stack>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Modal>

        <ShowVehiclesFleet
          show={showModal}
          data={fleets}
          onClose={() => setShowModal(false)}
        />
      </>
    )
  );
});
const WaybillModal = memo(({ waybills, show, onClose }) => {
  const [showDetailsWaybill, setShowDetailsWaybill] = useState(false);
  const [dataWaybill, setDataWaybill] = useState(null);

  return (
    show && (
      <>
        <Modal onClose={onClose} open={show}>
          <Typography
            variant="h5"
            mb={3}
            typography={{ md: "h5", xs: "body2" }}
          >
            لیست بارنامه در درخواست های پروژه
          </Typography>

          <Grid container spacing={2}>
            {waybills?.map((item) => {
              return (
                <Grid key={item.id} item xs={12} md={4}>
                  <Card sx={{ p: 2 }}>
                    <Stack justifyContent="center" spacing={3}>
                      <Stack direction="row" alignItems="center" lineHeight={1}>
                        <Typography variant="subtitle1" lineHeight="inherit">
                          شماره
                        </Typography>
                        <Divider
                          sx={{
                            borderBottomWidth: "medium",
                            borderBottomStyle: "dashed",
                            mx: 1,
                            flex: 1,
                          }}
                        />
                        <Typography variant="subtitle2" lineHeight="inherit">
                          {item?.WayBillNumber ?? "-"}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" lineHeight={1}>
                        <Typography variant="subtitle1" lineHeight="inherit">
                          سریال
                        </Typography>
                        <Divider
                          sx={{
                            borderBottomWidth: "medium",
                            borderBottomStyle: "dashed",
                            mx: 1,
                            flex: 1,
                          }}
                        />
                        <Typography variant="subtitle2" lineHeight="inherit">
                          {item?.WayBillSerial ?? "-"}
                        </Typography>
                      </Stack>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                          setDataWaybill(item);
                          setTimeout(() => {
                            setShowDetailsWaybill(!showDetailsWaybill);
                          }, 100);
                        }}
                      >
                        نمایش
                      </Button>
                    </Stack>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Modal>

        {/* modals */}

        {/* waybill details Modal */}
        <WaybillDetailsModal
          open={showDetailsWaybill}
          onClose={() => {
            setShowDetailsWaybill(false);
          }}
          data={dataWaybill}
        />
      </>
    )
  );
});
const DraftModal = memo(({ drafts, show, onClose }) => {
  const [dataDraft, setDataDraft] = useState(null);
  const [showModal, setShowModal] = useState(null);

  const closeModal = () => {
    setShowModal(null);
  };

  const handleShowDraft = (draft) => {
    setDataDraft(draft);
    setShowModal("draftDetail");
  };
  return (
    show && (
      <>
        <Modal onClose={onClose} open={show}>
          <Typography
            variant="h5"
            mb={3}
            typography={{ md: "h5", xs: "body2" }}
          >
            لیست حواله ها در درخواست های پروژه
          </Typography>

          <Grid container spacing={2}>
            {drafts?.map((item) => {
              return (
                <Grid key={item.id} item xs={12} md={4}>
                  <Card sx={{ p: 2 }}>
                    <Stack justifyContent="center" spacing={3}>
                      <Stack direction="row" alignItems="center" lineHeight={1}>
                        <Typography variant="subtitle1" lineHeight="inherit">
                          شماره
                        </Typography>
                        <Divider
                          sx={{
                            borderBottomWidth: "medium",
                            borderBottomStyle: "dashed",
                            mx: 1,
                            flex: 1,
                          }}
                        />
                        <Typography variant="subtitle2" lineHeight="inherit">
                          {item?.DraftNumber ?? "-"}
                        </Typography>
                      </Stack>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                          handleShowDraft(item);
                        }}
                      >
                        نمایش
                      </Button>
                    </Stack>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Modal>
        <DraftDetailsModal
          open={showModal === "draftDetail"}
          onClose={closeModal}
          data={dataDraft}
        />
      </>
    )
  );
});
const FleetVehiclesPerDriverModal = memo(({ fleetVehicle, show, onClose }) => {
  const [showModal, setShowModal] = useState(null);
  const [fVehicle, setFVehicle] = useState(null);

  const closeModal = () => {
    setShowModal(false);
  };

  const handleShowDrivers = (vehicle) => {
    setShowModal("driverFleet");
    setFVehicle(vehicle);
  };

  const handleShowVehicleModal = (vehicle) => {
    setShowModal("vehicle");
    setFVehicle(vehicle);
  };

  return (
    show && (
      <>
        <Modal onClose={onClose} open={show}>
          <Typography
            variant="h5"
            mb={3}
            typography={{ md: "h5", xs: "body2" }}
          >
            لیست خودرو ها روی درخواست های پروژه
          </Typography>

          <Grid container spacing={2}>
            {fleetVehicle?.map((item) => {
              return (
                <Grid key={item.id} item xs={12} sm={6} md={4}>
                  <Card sx={{ p: 2 }}>
                    <Stack justifyContent="center" spacing={2}>
                      <Typography
                        variant="clickable"
                        onClick={() => handleShowVehicleModal(item)}
                        width={"100%"}
                      >
                        {renderPlaqueObjectToString(item.vehicle?.plaque)}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleShowDrivers(item)}
                      >
                        نمایش رانندگان
                      </Button>
                    </Stack>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Modal>

        {/* modals */}
        <ShowDriverFleet
          show={showModal === "driverFleet"}
          data={fVehicle?.drivers}
          onClose={closeModal}
        />

        <VehicleDetailModal
          show={showModal === "vehicle"}
          onClose={closeModal}
          data={fVehicle?.vehicle}
        />
      </>
    )
  );
});

export default memo(ProjectDetailModal);
