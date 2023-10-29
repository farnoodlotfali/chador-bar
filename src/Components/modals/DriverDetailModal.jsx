import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Rating,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { SvgSPrite } from "Components/SvgSPrite";
import Modal from "Components/versions/Modal";
import { enToFaNumber, genderType, handleDate } from "Utility/utils";
import ShowPersonScoreModal from "./ShowPersonScoreModal";
import { useState } from "react";

const DriverDetailModal = ({ data, secondDriver, show, onClose }) => {
  const [showHistory, setShowHistory] = useState(false);

  const toggleShowHistory = () => {
    setShowHistory((prev) => !prev);
  };

  return (
    show && (
      <>
        <Modal onClose={onClose} open={show} maxWidth="md">
          <Card sx={{ p: 2 }}>
            <CardHeader
              title={<Typography variant="h5">اطلاعات راننده اول</Typography>}
            />
            <CardContent>
              <Grid container spacing={2}>
                <DriverDetailItem value={data.first_name} title={"نام"} />
                <DriverDetailItem
                  value={data.last_name}
                  title={"نام‌خانوادگی"}
                />
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
                <DriverDetailItem
                  value={
                    <Stack direction="row" spacing={1}>
                      <Rating
                        precision={0.2}
                        value={data?.rating}
                        size="small"
                        readOnly
                      />
                      <Tooltip placement="top" title="مشاهده تاریخچه امتیازات">
                        <Box
                          sx={{ cursor: "pointer" }}
                          onClick={toggleShowHistory}
                        >
                          <SvgSPrite
                            icon="rectangle-history-circle-user"
                            size={20}
                          />
                        </Box>
                      </Tooltip>
                    </Stack>
                  }
                  title={"امتیاز فیک"}
                />
              </Grid>
            </CardContent>
          </Card>
          {secondDriver && (
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
                  <DriverDetailItem
                    value={secondDriver?.email}
                    title={"ایمیل"}
                  />
                  <DriverDetailItem
                    value={handleDate(secondDriver?.birth_date, "YYYY/MM/DD")}
                    title={"تاریخ تولد"}
                  />
                  <DriverDetailItem
                    value={
                      <Stack direction="row" spacing={1}>
                        <Rating
                          precision={0.2}
                          value={secondDriver?.rating}
                          size="small"
                          readOnly
                        />
                        <Tooltip
                          placement="top"
                          title="مشاهده تاریخچه امتیازات"
                        >
                          <Box
                            sx={{ cursor: "pointer" }}
                            onClick={toggleShowHistory}
                          >
                            <SvgSPrite
                              icon="rectangle-history-circle-user"
                              size={20}
                            />
                          </Box>
                        </Tooltip>
                      </Stack>
                    }
                    title={"امتیاز فیک"}
                  />
                </Grid>
              </CardContent>
            </Card>
          )}
        </Modal>

        <ShowPersonScoreModal show={showHistory} onClose={toggleShowHistory} />
      </>
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
