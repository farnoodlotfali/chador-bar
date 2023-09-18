import { Card, Divider, Grid, Typography } from "@mui/material";
import Modal from "Components/versions/Modal";
import { SvgSPrite } from "Components/SvgSPrite";
import { enToFaNumber, numberWithCommas, renderChip } from "Utility/utils";

const CardsStyle = {
  width: "100%",
  height: "100%",
  p: 2,
  boxShadow: 1,
};

const VehicleTypeDetailModal = ({ data, show, onClose }) => {
  const RowLabelAndData = (label, info, icon = "") => {
    return (
      <Grid item xs={12} md={6}>
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

  return (
    show && (
      <Modal maxWidth="md" onClose={onClose} open={show}>
        <Card sx={CardsStyle}>
          <Grid container rowSpacing={2} columnSpacing={4}>
            {RowLabelAndData(
              "عنوان",
              data?.title ?? "-",
              <SvgSPrite icon="car" size="small" MUIColor="primary" />
            )}
            {RowLabelAndData(
              "کد",
              enToFaNumber(data?.code) ?? "-",
              <SvgSPrite icon="qrcode" size="small" MUIColor="primary" />
            )}
            {RowLabelAndData(
              "حداکثر وزن",
              enToFaNumber(numberWithCommas(data?.max_weight)) ?? "-",

              <SvgSPrite icon="weight-scale" size="small" MUIColor="error" />
            )}
            {RowLabelAndData(
              "دسته‌بندی",
              data?.vehicle_category?.title ?? "-",

              <SvgSPrite icon="shapes" size="small" MUIColor="error" />
            )}

            {RowLabelAndData(
              "وضعیت",
              renderChip(data?.status) ?? "-",
              <SvgSPrite icon="bullseye" size="small" MUIColor="primary" />
            )}
          </Grid>
        </Card>
      </Modal>
    )
  );
};

export default VehicleTypeDetailModal;
