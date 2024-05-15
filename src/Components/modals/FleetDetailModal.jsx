import { Card, Grid, Stack, Typography } from "@mui/material";
import FormTypography from "Components/FormTypography";
import { SvgSPrite } from "Components/SvgSPrite";
import Modal from "Components/versions/Modal";
import { enToFaNumber, renderChip, renderChipForInquiry, renderPlaqueObjectToString } from "Utility/utils";

const FleetDetailModal = ({ open, onClose, data }) => {
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
        <Grid item md={6} xs={12}>
          <Card sx={{ p: 2 }}>
            <FormTypography>اطلاعات کلی</FormTypography>
            <Stack spacing={2}>
              {RowLabelAndData(
                "کد ناوگان",
                data?.code ?? "-",
                <SvgSPrite icon="spell-check" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "تعداد درخواست های فعال",
                enToFaNumber(data?.active_requests_count) ?? "-",
                <SvgSPrite icon="memo" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "تعداد رانندگان",
                enToFaNumber(data?.drivers?.length) ?? "-",
                <SvgSPrite icon="user-vneck-hair" MUIColor="primary" />
              )}

              {RowLabelAndData(
                "سهم راننده",
                enToFaNumber(data?.driver_percent) ?? "-",
                <SvgSPrite icon="percent" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "وضعیت",
                renderChip(data?.status) ?? "-",
                <SvgSPrite icon="tower-broadcast" MUIColor="primary" />
              )}
              {RowLabelAndData(
                "استعلام",
                renderChipForInquiry(data?.inquiry) ?? "-",
                <SvgSPrite icon="info" MUIColor="primary" />
              )}
            </Stack>
          </Card>
        </Grid>
        <Grid item md={6} xs={12}>
          <Card sx={{ p: 2, height: "100%" }}>
            <FormTypography>گروه و شرکت حمل</FormTypography>
            <Stack spacing={2}>
              {RowLabelAndData(
                "گروه ناوگان",
                data?.group?.name ?? "-",
                <SvgSPrite icon="layer-group" MUIColor="primary" />
              )}
              {data?.shipping_company ? (
                <>
                  {RowLabelAndData(
                    "نام شرکت حمل",
                    enToFaNumber(data?.shipping_company.name) ?? "-",
                    <SvgSPrite icon="tag" MUIColor="primary" />
                  )}
                  {RowLabelAndData(
                    "کد شرکت حمل",
                    enToFaNumber(data?.shipping_company.code) ?? "-",
                    <SvgSPrite icon="spell-check" MUIColor="primary" />
                  )}
                  {RowLabelAndData(
                    " شماره تماس",
                    enToFaNumber(data?.shipping_company.mobile) ?? "-",
                    <SvgSPrite icon="phone" MUIColor="primary" />
                  )}
                </>
              ) : (
                RowLabelAndData(
                  "شرکت حمل",
                  "فاقد شرکت حمل",
                  <SvgSPrite icon="tag" MUIColor="primary" />
                )
              )}
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ p: 2, height: "100%" }}>
            <FormTypography>اطلاعات خودرو</FormTypography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  {RowLabelAndData(
                    "پلاک",
                    renderPlaqueObjectToString(data?.vehicle?.plaque) ?? "-",
                    <SvgSPrite icon="input-numeric" MUIColor="primary" />
                  )}
                  {RowLabelAndData(
                    "imei",
                    enToFaNumber(data?.vehicle?.imei) ?? "-",
                    <SvgSPrite icon="hashtag" MUIColor="primary" />
                  )}
                  {RowLabelAndData(
                    "vin",
                    enToFaNumber(data?.vehicle?.vin) ?? "-",
                    <SvgSPrite icon="hashtag" MUIColor="primary" />
                  )}
                  {RowLabelAndData(
                    "سال خودرو",
                    enToFaNumber(data?.vehicle?.year) ?? "-",
                    <SvgSPrite icon="calendar" MUIColor="primary" />
                  )}
                  {RowLabelAndData(
                    "رنگ خودرو",
                    enToFaNumber(data?.vehicle?.color) ?? "-",
                    <SvgSPrite icon="paint-roller" MUIColor="primary" />
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  {RowLabelAndData(
                    "نوع بارگیر",
                    data?.vehicle?.container_type?.title ?? "-",
                    <SvgSPrite icon="truck-ramp" MUIColor="primary" />
                  )}
                  {RowLabelAndData(
                    "نوع کامیون",
                    data?.vehicle?.container_type?.vehicle_category?.title ??
                      "-",
                    <SvgSPrite
                      icon="truck-container-empty"
                      MUIColor="primary"
                    />
                  )}
                  {RowLabelAndData(
                    "مدل خودرو",
                    data?.vehicle?.vehicle_model?.title ?? "-",
                    <SvgSPrite icon="truck" MUIColor="primary" />
                  )}
                  {RowLabelAndData(
                    "وضعیت",
                    renderChip(data?.vehicle?.status) ?? "-",
                    <SvgSPrite icon="bullseye" MUIColor="primary" />
                  )}
                  {RowLabelAndData(
                    "استعلام",
                    renderChipForInquiry(data?.vehicle?.inquiry) ?? "-",
                    <SvgSPrite icon="radar" MUIColor="primary" />
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Modal>
  );
};
export default FleetDetailModal;
