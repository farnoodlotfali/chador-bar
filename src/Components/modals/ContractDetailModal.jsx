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
import {enToFaNumber, handleDate, numberWithCommas, renderWeight} from "Utility/utils";

import { Link } from "react-router-dom";
import { SvgSPrite } from "Components/SvgSPrite";

const CardsStyle = {
  width: "100%",
  height: "100%",
  p: 2,
  boxShadow: 1,
};

const ContractDetailModal = ({ data, show, onClose }) => {
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
  return (
    show && (
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
                    to={`/contract/${data.id}`}
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
                  <SvgSPrite icon="qrcode" size="small" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "تاریخ شروع",
                  handleDate(data.start_date, "YYYY/MM/DD") ?? "-",
                  <SvgSPrite
                    icon="check-to-slot"
                    size="small"
                    MUIColor="success"
                  />
                )}
                {RowLabelAndData(
                  "تاریخ پایان",
                  handleDate(data.end_date, "YYYY/MM/DD") ?? "-",
                  <SvgSPrite
                    icon="calendar-xmark"
                    size="small"
                    MUIColor="error"
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
                  "حداکثر وزن قابل حمل در ماه",
                  enToFaNumber(numberWithCommas(data.monthly_limit)) ?? "-",
                  <SvgSPrite
                    icon="weight-scale"
                    size="small"
                    MUIColor="secondary"
                  />
                )}
                {RowLabelAndData(
                  "تعداد",
                  enToFaNumber(data.quantity) ?? "-",
                  <SvgSPrite icon="hashtag" size="small" MUIColor="info" />
                )}
                {RowLabelAndData(
                  "وزن",
                  renderWeight(data.weight),
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
        </Grid>
      </Modal>
    )
  );
};

export default ContractDetailModal;
