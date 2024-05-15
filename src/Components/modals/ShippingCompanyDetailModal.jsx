import {
  Card,
  Grid,
  Typography,
  Stack,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
} from "@mui/material";

import Modal from "Components/versions/Modal";
import { enToFaNumber, renderChip, renderMobileFormat } from "Utility/utils";
import NormalTable from "Components/NormalTable";
import { Link } from "react-router-dom";
import FormTypography from "Components/FormTypography";
import { SvgSPrite } from "Components/SvgSPrite";

const CardsStyle = {
  width: "100%",
  height: "100%",
  p: 2,
  boxShadow: 1,
};

const beneficiaryHeadCells = [
  {
    id: "switch_percent",
    label: "سهم نرم‌افزار",
  },
  {
    id: "shipping_company_percent",
    label: "سهم شرکت حمل",
  },
  {
    id: "fleet_percent",
    label: "سهم ناوگان",
  },
  {
    id: "municipal_percent",
    label: "سهم وزارت",
  },
  {
    id: "agent_percent",
    label: "سهم نمایندگی",
  },
];

const ShippingCompanyDetailModal = ({ data, onClose, show }) => {
  const RowLabelAndData = (label, info, icon = "") => {
    return (
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
          {icon}
          {label}:
        </Typography>
        <Typography textAlign="justify">{info}</Typography>
      </Stack>
    );
  };
  return (
    data && (
      <Modal open={show} onClose={onClose}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
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
                    to={`/shipping-company/${data.id}`}
                    target="_blank"
                  >
                    <SvgSPrite icon="eye" MUIColor="primary" />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                mt={3}
                height="fit-content"
                justifyContent="space-between"
                alignItems="center"
              >
                {RowLabelAndData(
                  "نام",
                  data.name ?? "-",
                  <SvgSPrite icon="tag" MUIColor="primary" />
                )}
                {RowLabelAndData(
                  "کد",
                  data.code ?? "-",
                  <SvgSPrite icon="hashtag" MUIColor="warning" />
                )}
                {RowLabelAndData(
                  "شماره تماس",
                  renderMobileFormat(data.mobile) ?? "-",
                  <SvgSPrite icon="phone" MUIColor="success" />
                )}{" "}
                {RowLabelAndData(
                  "وضعیت",
                  renderChip(data.status) ?? "-",
                  <SvgSPrite icon="bullseye" MUIColor="error" />
                )}
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={12}>
            <Card sx={CardsStyle}>
              <FormTypography>اطلاعات ذی‌نفعان</FormTypography>

              <NormalTable headCells={beneficiaryHeadCells}>
                {data?.beneficiary.map((item) => {
                  return (
                    <TableRow hover tabIndex={-1} key={item.id}>
                      <TableCell scope="row">
                        {enToFaNumber(item.switch_percent)}
                      </TableCell>
                      <TableCell scope="row">
                        {enToFaNumber(item.shipping_company_percent)}
                      </TableCell>
                      <TableCell scope="row">
                        {enToFaNumber(item.fleet_percent)}
                      </TableCell>
                      <TableCell scope="row">
                        {enToFaNumber(item.municipal_percent)}
                      </TableCell>
                      <TableCell scope="row">
                        {enToFaNumber(item.agent_percent)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </NormalTable>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card sx={CardsStyle}>
              <Typography variant="h5">اطلاعات ناوگان</Typography>
            </Card>
          </Grid>
        </Grid>
      </Modal>
    )
  );
};

export default ShippingCompanyDetailModal;
