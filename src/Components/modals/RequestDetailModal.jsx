import {
  Box,
  Card,
  Grid,
  Rating,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Modal from "Components/versions/Modal";
import {
  enToFaNumber,
  handleDate,
  numberWithCommas,
  renderMobileFormat,
  renderPlaqueObjectToString,
  renderWeight,
} from "Utility/utils";

import Timeline from "Components/versions/Timeline";

import DrivingDirection from "Components/DrivingDirection";
import { SvgSPrite } from "Components/SvgSPrite";
import { useState } from "react";
import ShowPersonScoreModal from "./ShowPersonScoreModal";
import RequestStepper from "Components/versions/RequestStepper";

const CardsStyle = {
  width: "100%",
  height: "100%",
  p: 2,
  boxShadow: 1,
};
const historyStatusesColor = {
  error: ["disabled", "reject"],
  info: ["set", "add", "load"],
  success: ["done", "enabled", "deliver"],
};
const RequestDetailModal = ({ open, onClose, data = {}, historyActions }) => {
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

  const [showScoredHistory, setShowScoredHistory] = useState(false);

  const toggleShowScoredHistory = () => {
    setShowScoredHistory((prev) => !prev);
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Grid container spacing={2}>
          <Grid item xs={12} mt={2}>
            <RequestStepper status={data?.status} size={30} sx={{ mb: 0 }} />
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
                  data?.code ?? "-",
                  <SvgSPrite icon="spell-check" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "قیمت پیشنهادی",
                  `${enToFaNumber(
                    numberWithCommas(data?.proposed_price) ?? "-"
                  )} ریال`,
                  <SvgSPrite icon="money-bill-wave" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "حداقل قیمت سامانه",
                  `${enToFaNumber(
                    numberWithCommas(data?.low_price) ?? "-"
                  )} ریال`,
                  <SvgSPrite icon="scanner-keyboard" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "حداکثر قیمت سامانه",
                  `${enToFaNumber(
                    numberWithCommas(data?.high_price) ?? "-"
                  )} ریال`,
                  <SvgSPrite icon="scanner-gun" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "قیمت نهایی",
                  `${enToFaNumber(numberWithCommas(data?.price) ?? "-")} ریال`,
                  <SvgSPrite icon="money-bill" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "تعداد",
                  numberWithCommas(data?.quantity),
                  <SvgSPrite icon="tally-4" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "شرکت حمل",
                  enToFaNumber(data?.shipping_company?.name) ?? "-",
                  <SvgSPrite icon="truck-tow" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "نام فرستنده",
                  data?.sender?.first_name
                    ? data?.sender?.first_name + " " + data?.sender?.last_name
                    : "",
                  <SvgSPrite icon="person" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "شماره موبایل فرستنده",
                  data?.sender?.mobile
                    ? renderMobileFormat(data?.sender?.mobile)
                    : "",
                  <SvgSPrite icon="mobile" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "کد پستی مبداء",
                  enToFaNumber(data?.source_zip_code) ?? "-",
                  <SvgSPrite icon="hashtag" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "مبدا",
                  data?.source_address ?? "-",
                  <SvgSPrite icon="location-dot" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "نام گیرنده",
                  data?.receiver?.first_name
                    ? data?.receiver?.first_name +
                        " " +
                        data?.receiver?.last_name
                    : "",
                  <SvgSPrite icon="person-simple" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "شماره موبایل گیرنده",
                  data?.receiver?.mobile
                    ? renderMobileFormat(data?.receiver?.mobile)
                    : "",
                  <SvgSPrite icon="mobile" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "کد پستی مقصد",
                  enToFaNumber(data?.destination_zip_code) ?? "-",
                  <SvgSPrite icon="hashtag" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "مقصد",
                  data?.destination_address ?? "-",
                  <SvgSPrite icon="location-check" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "کد ناوگان",
                  data?.fleet?.code ?? "-",
                  <SvgSPrite icon="hashtag" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "نوع بارگیر",
                  data?.vehicle_type?.title ?? "-",
                  <SvgSPrite icon="truck-ramp" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "نام محصول",
                  data?.product?.title ?? "-",
                  <SvgSPrite icon="box" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "سریال بارنامه",
                  data?.waybill_serial ?? "-",
                  <SvgSPrite icon="hashtag" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "شماره بارنامه",
                  data?.waybill_number ?? "-",
                  <SvgSPrite icon="hashtag" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "زمان بارگیری",
                  enToFaNumber(data?.load_time_fa) ?? "-",
                  <SvgSPrite icon="clock-three" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "زمان تخلیه",
                  enToFaNumber(data?.discharge_time_fa) ?? "-",
                  <SvgSPrite icon="clock-one" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "زمان ثبت",
                  `${
                    handleDate(data?.created_at, "YYYY/MM/DD") +
                    "  " +
                    handleDate(data?.created_at, "HH:MM")
                  }`,
                  <SvgSPrite icon="clock-two" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "وزن",
                  `${renderWeight(data?.weight)}`,
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
                  data?.description ?? "-",
                  <SvgSPrite icon="file" MUIColor="primary" />
                )}
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={CardsStyle}>
              <DrivingDirection rowData={data} />
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

                  <SvgSPrite icon="user-simple" MUIColor="warning" />
                </Stack>
                <Stack spacing={1} mt={3}>
                  {data?.owner ? (
                    <>
                      {RowLabelAndData(
                        "نام",
                        `${
                          data?.owner.first_name
                            ? data?.owner.first_name +
                              " " +
                              data?.owner.last_name
                            : ""
                        }`,
                        <SvgSPrite icon="user" MUIColor="primary" />
                      )}
                      {RowLabelAndData(
                        "شماره موبایل",
                        renderMobileFormat(data?.owner.mobile),

                        <SvgSPrite icon="mobile" MUIColor="primary" />
                      )}
                      {RowLabelAndData(
                        "کد ملی",
                        enToFaNumber(data?.owner?.national_code) ?? "-",

                        <SvgSPrite icon="hashtag" MUIColor="primary" />
                      )}
                      {RowLabelAndData(
                        "امتیاز",
                        <Stack direction="row" spacing={1}>
                          <Rating
                            precision={0.2}
                            value={data?.owner?.rating}
                            size="small"
                            readOnly
                            color="inherit"
                          />
                          <Tooltip
                            placement="top"
                            title="مشاهده تاریخچه امتیازات"
                          >
                            <Box
                              sx={{ cursor: "pointer" }}
                              onClick={toggleShowScoredHistory}
                            >
                              <SvgSPrite
                                icon="rectangle-history-circle-user"
                                color="inherit"
                                size={20}
                              />
                            </Box>
                          </Tooltip>
                        </Stack>,

                        <SvgSPrite icon="hashtag" MUIColor="primary" />
                      )}
                    </>
                  ) : (
                    <Typography>صاحب باری تخصیص داده نشده است</Typography>
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
                  {data?.driver ? (
                    <>
                      {RowLabelAndData(
                        "نام",
                        `${
                          data?.driver.first_name
                            ? data?.driver.first_name +
                              " " +
                              data?.driver.last_name
                            : ""
                        }`,
                        <SvgSPrite icon="person" MUIColor="primary" />
                      )}
                      {RowLabelAndData(
                        "شماره موبایل",
                        renderMobileFormat(data?.driver.mobile),
                        <SvgSPrite icon="mobile" MUIColor="primary" />
                      )}

                      {RowLabelAndData(
                        "نوع کامیون",
                        data?.vehicle?.category?.title ?? "-",
                        <SvgSPrite icon="truck" MUIColor="primary" />
                      )}
                      {RowLabelAndData(
                        "نام خودرو",
                        data?.vehicle?.title ?? "-",
                        <SvgSPrite icon="car" MUIColor="primary" />
                      )}
                      {RowLabelAndData(
                        "پلاک خودرو",
                        renderPlaqueObjectToString(data?.vehicle?.plaque),
                        <SvgSPrite icon="input-numeric" MUIColor="primary" />
                      )}
                      {RowLabelAndData(
                        "امتیاز",
                        <Stack direction="row" spacing={1}>
                          <Rating
                            precision={0.2}
                            value={data?.driver?.rating}
                            size="small"
                            readOnly
                            color="inherit"
                          />
                          <Tooltip
                            placement="top"
                            title="مشاهده تاریخچه امتیازات"
                          >
                            <Box
                              sx={{ cursor: "pointer" }}
                              onClick={toggleShowScoredHistory}
                            >
                              <SvgSPrite
                                icon="rectangle-history-circle-user"
                                color="inherit"
                                size={20}
                              />
                            </Box>
                          </Tooltip>
                        </Stack>,

                        <SvgSPrite icon="hashtag" MUIColor="primary" />
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
                <SvgSPrite icon="clock" size="large" MUIColor="success" />
              </Stack>

              <Timeline
                data={data?.histories}
                colors={historyStatusesColor}
                historyActions={historyActions}
              />
            </Card>
          </Grid>
        </Grid>
      </Modal>

      <ShowPersonScoreModal
        show={showScoredHistory}
        onClose={toggleShowScoredHistory}
      />
    </>
  );
};

export default RequestDetailModal;
