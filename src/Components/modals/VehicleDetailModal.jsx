import {
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
  numberWithCommas,
  renderChip,
  renderChipForInquiry,
  renderPlaqueObjectToString,
} from "Utility/utils";
import { Link } from "react-router-dom";
import { SvgSPrite } from "Components/SvgSPrite";
const CardsStyle = {
  width: "100%",
  height: "100%",
  p: 2,
  boxShadow: 1,
};

const VehicleDetailModal = ({ data, show, onClose }) => {
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
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">اطلاعات خودرو</Typography>

            <Tooltip title="مشاهده کامل اطلاعات" placement="right">
              <IconButton
                component={Link}
                to={`/vehicle/${data.id}`}
                target="_blank"
              >
                <SvgSPrite icon="eye" MUIColor="info" />
              </IconButton>
            </Tooltip>
          </Stack>
          <Grid container rowSpacing={2} columnSpacing={4} mt={2}>
            {RowLabelAndData(
              "کد",
              enToFaNumber(data.code) ?? "-",
              <SvgSPrite icon="qrcode" size="small" MUIColor="primary" />
            )}
            {RowLabelAndData(
              "پلاک",
              renderPlaqueObjectToString(data.plaque) ?? "-",
              <SvgSPrite
                icon="input-numeric"
                size="small"
                MUIColor="secondary"
              />
            )}
            {RowLabelAndData(
              "رنگ",
              data.color ?? "-",
              <SvgSPrite icon="brush" size="small" MUIColor="warning" />
            )}
            {data.vehicle_model && (
              <>
                {RowLabelAndData(
                  "مدل",
                  data?.vehicle_model?.title ?? "-",
                  <SvgSPrite icon="tag" size="small" MUIColor="info" />
                )}
                {RowLabelAndData(
                  "حداکثر وزن",
                  enToFaNumber(
                    numberWithCommas(data.vehicle_model.max_weight)
                  ) ?? "-",
                  <SvgSPrite
                    icon="weight-scale"
                    size="small"
                    MUIColor="error"
                  />
                )}
              </>
            )}

            {RowLabelAndData(
              "بارگیر",
              data?.container_type?.title ?? "-",
              <SvgSPrite icon="truck-ramp" size="small" MUIColor="primary" />
            )}

            {RowLabelAndData(
              "وضعیت",
              renderChip(data.status) ?? "-",
              <SvgSPrite icon="bullseye" size="small" MUIColor="secondary" />
            )}
            {RowLabelAndData(
              "استعلام",
              renderChipForInquiry(data.inquiry) ?? "-",
              <SvgSPrite icon="radar" size="small" MUIColor="warning" />
            )}
          </Grid>
        </Card>
      </Modal>
    )
  );
};

export default VehicleDetailModal;
