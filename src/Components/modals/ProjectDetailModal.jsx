import {
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Modal from "Components/versions/Modal";
import {
  enToFaNumber,
  handleDate,
  numberWithCommas,
  renderPlaqueObjectToString,
} from "Utility/utils";

import { Link } from "react-router-dom";
import { memo, useState } from "react";

import ShowDriverFleet from "./ShowDriverFleet";
import ShowVehiclesFleet from "./ShowVehiclesFleet";
import VehicleDetailModal from "./VehicleDetailModal";
import { SvgSPrite } from "Components/SvgSPrite";

const CardsStyle = {
  width: "100%",
  height: "100%",
  p: 2,
  boxShadow: 1,
};

const ProjectDetailModal = ({ data, show, onClose }) => {
  const [showModal, setShowModal] = useState(null);

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
                      MUIColor="success"
                    />
                  )}
                  {RowLabelAndData(
                    "تعداد درخواست ‌ها",
                    enToFaNumber(data.requests_count) ?? "-",
                    <SvgSPrite icon="hashtag" size="small" MUIColor="info" />
                  )}
                  {RowLabelAndData(
                    "تناژ باقیمانده",
                    data.remaining_weight
                      ? enToFaNumber(numberWithCommas(data.remaining_weight)) +
                          " کیلوگرم"
                      : "-",
                    <SvgSPrite
                      icon="weight-scale"
                      size="small"
                      MUIColor="secondary"
                    />
                  )}
                  {RowLabelAndData(
                    "وزن کل درخواست‌ها",
                    data.requests_total_weight
                      ? enToFaNumber(
                          numberWithCommas(data.requests_total_weight)
                        ) + " کیلوگرم"
                      : "-",
                    <SvgSPrite
                      icon="weight-scale"
                      size="small"
                      MUIColor="warning"
                    />
                  )}
                  {RowLabelAndData(
                    "میانگین زمان حمل پروژه",
                    enToFaNumber(data.average_shipping_time) ?? "-",
                    <SvgSPrite
                      icon="alarm-clock"
                      size="small"
                      MUIColor="success"
                    />
                  )}
                  {RowLabelAndData(
                    "زمان اتمام پروژه",
                    data.remaining_time ?? "-",
                    <SvgSPrite
                      icon="rectangle-history"
                      size="small"
                      MUIColor="info"
                    />
                  )}
                </Grid>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={CardsStyle}>
                <Typography variant="h5">اطلاعات بار</Typography>
                <Grid container spacing={2} mt={2}>
                  {RowLabelAndData(
                    "تعداد",
                    enToFaNumber(data.count) ?? "-",
                    <SvgSPrite icon="hashtag" size="small" MUIColor="info" />
                  )}
                  {RowLabelAndData(
                    "وزن",
                    data.weight
                      ? enToFaNumber(numberWithCommas(data.weight)) + " کیلوگرم"
                      : "-",
                    <SvgSPrite
                      icon="weight-scale"
                      size="small"
                      MUIColor="warning"
                    />
                  )}
                  {RowLabelAndData(
                    "حجم",
                    enToFaNumber(data.volume) ?? "-",
                    <SvgSPrite icon="square" size="small" MUIColor="success" />
                  )}
                </Grid>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={CardsStyle}>
                <Stack direction="row" alignItems="center" spacing={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<SvgSPrite icon="people-group" />}
                    onClick={handleShowDrivers}
                  >
                    لیست رانندگان پروژه
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    endIcon={<SvgSPrite icon="cars" />}
                    onClick={handleShowFleetVehicles}
                  >
                    لیست خودروهای پروژه
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
            لیست راننده ها در درخواست های پروژه
          </Typography>

          <Grid container spacing={2}>
            {drivers.map((item) => {
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
                          {enToFaNumber(item?.mobile ?? "-")}
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
            {fleetVehicle.map((item) => {
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
                        color="info"
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
