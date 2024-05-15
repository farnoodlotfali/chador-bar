import {
  Grid,
  TableRow,
  TableCell,
  Typography,
  Box,
  Table as MuiTable,
  Paper,
  Stack,
  TableContainer,
  TableHead,
  Button,
} from "@mui/material";
import {
  enToFaNumber,
  numberWithCommas,
  renderMobileFormat,
  renderWeight,
} from "Utility/utils";
import { styled } from "@mui/material/styles";
import Barcode from "react-barcode";
import { useRef } from "react";
import ReactToPrint from "react-to-print";
import { SvgSPrite } from "Components/SvgSPrite";

const StyledTypography = styled(Typography)(({ theme }) => ({
  "&": {
    backgroundColor: theme.palette.mode === "dark" ? "#323639" : "white",
    position: "absolute",
    top: "-15px",
  },
}));

const ToTalPriceBox = styled(Box)(({ theme }) => ({
  "&": {
    backgroundColor: theme.palette.mode === "dark" ? "white" : "#323639",
    color: theme.palette.mode === "dark" ? "#323639" : "white",
    display: "flex",
    justifyContent: "end",
  },
}));
const DraftPaper = ({ data }) => {
  const compoRef = useRef();

  return (
    <>
      <ReactToPrint
        trigger={() => {
          return (
            <Button
              sx={{
                display: "flex",
                gap: 1,
              }}
              variant="contained"
            >
              <Typography>پرینت</Typography>
              <SvgSPrite icon="print" color="inherit" />
            </Button>
          );
        }}
        content={() => {
          return compoRef.current;
        }}
      />

      <Paper
        ref={compoRef}
        elevation={3}
        sx={{
          marginTop: 4,
          paddingX: 8,
          paddingTop: 8,
          paddingBottom: 4,
          direction: "ltr",
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          marginBottom={4}
          paddingBottom={2}
          borderBottom="2px solid "
        >
          حواله
        </Typography>
        <Stack spacing={5}>
          <Sec1 data={data} />
          <Sec2 data={data} />
          <Sec3 data={data} />
          <Sec4 data={data} />
          <Sec6 data={data} />
          <Sec7 data={data} />
          <Sec8 data={data} />
        </Stack>
      </Paper>
    </>
  );
};
const headCells1 = [
  {
    id: "cargo",
    label: "عنوان",
  },
  {
    id: "weight",
    label: "وزن/حجم",
  },
  {
    id: "category",
    label: " بسته‌بندی ",
  },
  {
    id: "quantity",
    label: "تعداد بسته",
  },
  {
    id: "source",
    label: "مبدا بارگیری",
  },

  {
    id: "destination",
    label: " مقصد تخلیه",
  },
];
const TitleBox = ({ title, children }) => {
  return (
    <Box
      sx={{
        border: "2px solid",
        paddingX: 2,
        paddingY: 2,
        position: "relative",
      }}
    >
      <StyledTypography
        sx={{
          position: "absolute",
          top: -15,
          paddingX: 3,
          fontWeight: "bold",
        }}
        variant="body1"
      >
        {title}
      </StyledTypography>

      {children}
    </Box>
  );
};

const Sec1 = ({ data }) => {
  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                تاریخ صدور:
              </Typography>
              <Typography variant="subtitle2">
                {enToFaNumber(data?.DraftIssueDateTime) ?? "-"}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                شماره حواله:
              </Typography>
              <Typography variant="subtitle2">
                {enToFaNumber(data?.DraftNumber) ?? "-"}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                شماره بیمه:
              </Typography>
              <Typography variant="subtitle2">
                {enToFaNumber(data?.CivilInsuranceNo ?? "-")}
              </Typography>
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12} md={8}>
          <Barcode height={50} value={data?.TrackingCodeNumber} width={2} />
        </Grid>
      </Grid>
    </Box>
  );
};
const Sec2 = ({ data }) => {
  return (
    <TitleBox title={"فرستنده"}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle2" fontWeight="bold">
                  نام/عنوان:
                </Typography>
                <Typography variant="subtitle2">{data?.SenderName}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle2" fontWeight="bold">
                  کد ملی/شناسه ملی:
                </Typography>
                <Typography variant="subtitle2">
                  {enToFaNumber(data?.SenderNationalId)}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                آدرس :
              </Typography>
              <Typography variant="subtitle2">
                {data?.SourceDepotAddress}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle2" fontWeight="bold">
                  کد پستی:
                </Typography>
                <Typography variant="subtitle2">
                  {enToFaNumber(data?.DestDepotPostalCode)}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle2" fontWeight="bold">
                  تلفن :
                </Typography>
                <Typography variant="subtitle2">
                  {enToFaNumber(data?.SourceDepotTelephone) ?? "-"}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </TitleBox>
  );
};
const Sec3 = ({ data }) => {
  return (
    <TitleBox title={"گیرنده"}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle2" fontWeight="bold">
                  نام/عنوان:
                </Typography>
                <Typography variant="subtitle2">
                  {data?.ReceiverName}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle2" fontWeight="bold">
                  کد ملی/شناسه ملی:
                </Typography>
                <Typography variant="subtitle2">
                  {enToFaNumber(data?.ReceiverNationalId)}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                آدرس:
              </Typography>
              <Typography variant="subtitle2">
                {data?.DestDepotAddress}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle2" fontWeight="bold">
                  کد پستی:
                </Typography>
                <Typography variant="subtitle2">
                  {enToFaNumber(data?.DestDepotPostalCode)}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle2" fontWeight="bold">
                  تلفن:
                </Typography>
                <Typography variant="subtitle2">
                  {enToFaNumber(data?.DestDepotTelephone) ?? "-"}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </TitleBox>
  );
};
const Sec4 = ({ data }) => {
  return (
    <TitleBox title={"راننده اول"}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                نام/عنوان:
              </Typography>
              <Typography variant="subtitle2">
                {data?.DriverFullName}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                شماره گواهینامه :
              </Typography>
              <Typography variant="subtitle2">
                {enToFaNumber(data?.DriverCertificateNumber)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                شماره تلفن همراه:
              </Typography>
              <Typography variant="subtitle2">
                {renderMobileFormat(data?.DriverMobile)}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                کد ملی/شناسه ملی:
              </Typography>
              <Typography variant="subtitle2">
                {enToFaNumber(data?.DriverNationalCode)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                محل صدور:
              </Typography>
              <Typography variant="subtitle2">
                {data?.DriverCertificateNumberIssueDate ?? "-"}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                شهر سکونت:
              </Typography>
              <Typography variant="subtitle2">{data?.DriverAddress}</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                کارت هوشمند:
              </Typography>
              <Typography variant="subtitle2">
                {enToFaNumber(data?.DriverSmartCardNo)}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </TitleBox>
  );
};
const Sec6 = ({ data }) => {
  return (
    <TitleBox title={"وسیله نقلیه"}>
      <Grid container columnSpacing={4} rowSpacing={2}>
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                پلاک:
              </Typography>
              <Typography variant="subtitle2">
                {enToFaNumber(data?.VehiclePlaqueNo)}
                ایران
                {enToFaNumber(data?.VehiclePlaqueSerial)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                کارخانه ساخت:
              </Typography>
              <Typography variant="subtitle2">-</Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                محل شماره گذاری:
              </Typography>
              <Typography variant="subtitle2">-</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                کارت هوشمند:
              </Typography>
              <Typography variant="subtitle2">
                {enToFaNumber(data?.VehicleSmartCardNo)}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                نوع بارگیر:
              </Typography>
              <Typography variant="subtitle2">
                {data?.TrailerTypeName}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                بیمه شخص ثالث:
              </Typography>
              <Typography variant="subtitle2">{"-"}</Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                تاریخ بیمه شخص ثالث:
              </Typography>
              <Typography variant="subtitle2">{"-"}</Typography>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </TitleBox>
  );
};
const Sec7 = ({ data }) => {
  return (
    <TitleBox title={"محموله‌ها"}>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ maxHeight: "calc(100vh - 132px)" }}
      >
        <MuiTable sx={{ minWidth: 650 }} stickyHeader>
          <TableHead>
            <TableRow>
              {headCells1.map((cell) => (
                <TableCell
                  key={cell.id}
                  sx={{
                    fontWeight: "bold",
                    bgcolor: "background.paper",
                    textAlign: "center",
                  }}
                >
                  {cell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableRow tabIndex={-1}>
            <TableCell
              sx={{
                borderRight: "2px solid",
                borderLeft: "2px solid",
                textAlign: "center",
              }}
              scope="row"
            >
              {data?.GoodsName}
            </TableCell>
            <TableCell
              sx={{
                borderRight: "2px solid",
                textAlign: "center",
              }}
              scope="row"
            >
              {numberWithCommas(enToFaNumber(renderWeight(data?.LoadWeight)))}
            </TableCell>
            <TableCell
              sx={{
                borderRight: "2px solid",
                textAlign: "center",
              }}
              scope="row"
            >
              {data?.PackName}
            </TableCell>
            <TableCell
              sx={{
                borderRight: "2px solid",
                textAlign: "center",
              }}
              scope="row"
            >
              {data?.LoadPacket}
            </TableCell>
            <TableCell
              sx={{
                borderRight: "2px solid",
                textAlign: "center",
              }}
              scope="row"
            >
              {data?.SourceDepotName}
            </TableCell>
            <TableCell
              sx={{
                borderRight: "2px solid",
                textAlign: "center",
              }}
              scope="row"
            >
              {data?.DestDepotName}
            </TableCell>
          </TableRow>
        </MuiTable>
      </TableContainer>
    </TitleBox>
  );
};
const Sec8 = ({ data }) => {
  return (
    <TitleBox title={"شرکت حمل و نقل"}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                نام :
              </Typography>
              <Typography variant="subtitle2">{data?.BranchName}</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                نشانی :
              </Typography>
              <Typography variant="subtitle2">-</Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                تلفن :
              </Typography>
              <Typography variant="subtitle2">
                {enToFaNumber(data?.BranchTel)}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                کد شرکت :
              </Typography>
              <Typography variant="subtitle2">
                {enToFaNumber(data?.BranchCode)}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </TitleBox>
  );
};

const renderPrice = (price) => {
  return price ? enToFaNumber(numberWithCommas(price)) + " ریال" : "-";
};

export default DraftPaper;
