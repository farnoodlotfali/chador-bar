import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import Modal from "Components/versions/Modal";
import { enToFaNumber, genderType, handleDate } from "Utility/utils";

const DriverDetailModal = ({ data, secondDriver, show, onClose }) => {
  return (
    show && (
      <Modal onClose={onClose} open={show} maxWidth="md">
        <Card sx={{ p: 2 }}>
          <CardHeader
            title={<Typography variant="h5">اطلاعات راننده اول</Typography>}
          />
          <CardContent>
            <Grid container spacing={2}>
              <DriverDetailItem value={data.first_name} title={"نام"} />
              <DriverDetailItem value={data.last_name} title={"نام‌خانوادگی"} />
              <DriverDetailItem
                value={enToFaNumber(data.mobile)}
                title={"شماره موبایل"}
              />
              <DriverDetailItem
                value={enToFaNumber(data.national_code)}
                title={"کد ملی"}
              />
              <DriverDetailItem
                value={genderType(data.gender)}
                title={"جنسیت"}
              />
              <DriverDetailItem value={data.father_name} title={"نام پدر"} />
              <DriverDetailItem value={data.email} title={"ایمیل"} />
              <DriverDetailItem
                value={handleDate(data.birth_date, "YYYY/MM/DD")}
                title={"تاریخ تولد"}
              />
            </Grid>
          </CardContent>
        </Card>
        {secondDriver !== null && secondDriver !== undefined && (
          <Card sx={{ p: 2, mt: 2 }}>
            <CardHeader
              title={<Typography variant="h5">اطلاعات راننده دوم</Typography>}
            />

            <CardContent>
              <Grid container spacing={2}>
                <DriverDetailItem
                  value={secondDriver?.first_name}
                  title={"نام"}
                />
                <DriverDetailItem
                  value={secondDriver?.last_name}
                  title={"نام‌خانوادگی"}
                />
                <DriverDetailItem
                  value={enToFaNumber(secondDriver?.mobile)}
                  title={"شماره موبایل"}
                />
                <DriverDetailItem
                  value={enToFaNumber(secondDriver?.national_code)}
                  title={"کد ملی"}
                />
                <DriverDetailItem
                  value={genderType(secondDriver?.gender)}
                  title={"جنسیت"}
                />
                <DriverDetailItem
                  value={secondDriver?.father_name}
                  title={"نام پدر"}
                />
                <DriverDetailItem value={secondDriver?.email} title={"ایمیل"} />
                <DriverDetailItem
                  value={handleDate(secondDriver?.birth_date, "YYYY/MM/DD")}
                  title={"تاریخ تولد"}
                />
              </Grid>
            </CardContent>
          </Card>
        )}
      </Modal>
    )
  );
};

const DriverDetailItem = ({ title, value }) => {
  return (
    <Grid item xs={12} md={6}>
      <Stack spacing={1} direction="row">
        <Typography fontWeight={600} variant="subtitle2">
          {title}:
        </Typography>
        <Typography variant="subtitle2">{value ?? "-"}</Typography>
      </Stack>
    </Grid>
  );
};

export default DriverDetailModal;
