import {
  Grid,
  Paper,
  Stack,
  Typography,
  Avatar,
  Rating,
  Tooltip,
  Box,
} from "@mui/material";
import { SvgSPrite } from "Components/SvgSPrite";
import Modal from "Components/versions/Modal";
import { enToFaNumber, genderType } from "Utility/utils";
import { useState } from "react";
import ShowPersonScoreModal from "./ShowPersonScoreModal";

const CreatorDetailModal = ({ open, onClose, creator }) => {
  const [showHistory, setShowHistory] = useState(false);

  const toggleShowHistory = () => {
    setShowHistory((prev) => !prev);
  };

  return (
    open && (
      <>
        <Modal maxWidth={"sm"} open={open} onClose={onClose}>
          <Paper elevation={3} sx={{ marginTop: 4, padding: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Stack
                  marginTop={"-60px"}
                  spacing={1}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Avatar
                    alt="creator Avatar"
                    src={creator?.avatar}
                    sx={{ width: 80, height: 80 }}
                  />
                  <Typography>
                    {(creator.first_name ?? "-") +
                      " " +
                      (creator.last_name ?? "")}
                  </Typography>
                </Stack>
              </Grid>
              <CreatorDetailItem
                title="تاریخ تولد"
                value={enToFaNumber(creator.birth_date)}
              />
              <CreatorDetailItem title="ایمیل" value={creator.email ?? "-"} />
              <CreatorDetailItem
                title="جنسیت"
                value={genderType(creator.gender) ?? "-"}
              />
              <CreatorDetailItem
                title="نام پدر"
                value={creator.father_name ?? "-"}
              />
              <CreatorDetailItem
                title="کد ملی"
                value={enToFaNumber(creator.national_code) ?? "-"}
              />
              <CreatorDetailItem
                title="موبایل"
                value={enToFaNumber(creator.mobile) ?? "-"}
              />
              <CreatorDetailItem title="وضعیت" value={creator.status ?? "-"} />
              <CreatorDetailItem
                title="استعلام"
                value={creator.inquiry ?? "-"}
              />
              <CreatorDetailItem
                title="license_card"
                value={creator.license_card ?? "-"}
              />
              <CreatorDetailItem
                value={
                  <Stack direction="row" spacing={1}>
                    <Rating precision={0.2} value={creator?.rating} size="small" readOnly />
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
          </Paper>
        </Modal>
        <ShowPersonScoreModal show={showHistory} onClose={toggleShowHistory} />
      </>
    )
  );
};

const CreatorDetailItem = ({ title, value }) => {
  return (
    <Grid item xs={12} md={6}>
      <Stack spacing={1} direction="row">
        <Typography fontWeight={700} variant="subtitle2">
          {title}:
        </Typography>
        <Typography variant="subtitle2">{value ?? "-"}</Typography>
      </Stack>
    </Grid>
  );
};

export default CreatorDetailModal;
