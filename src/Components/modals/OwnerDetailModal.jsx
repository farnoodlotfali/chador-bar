import {Avatar, Box, Grid, Paper, Rating, Stack, Tooltip, Typography} from "@mui/material";
import Modal from "Components/versions/Modal";
import {enToFaNumber, genderType, renderChip, renderMobileFormat} from "Utility/utils";
import {SvgSPrite} from "../SvgSPrite";
import {useState} from "react";
import ShowPersonScoreModal from "./ShowPersonScoreModal";

const OwnerDetailModal = ({ open, onClose, owner }) => {
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
                  alt="owner Avatar"
                  src={owner?.avatar}
                  sx={{ width: 80, height: 80 }}
                />
                <Typography>
                  {(owner.first_name ?? "-") + " " + (owner.last_name ?? "")}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>تاریخ تولد:</Typography>
                <Typography>{enToFaNumber(owner.birth_date)}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>ایمیل:</Typography>
                <Typography>{owner.email ?? "-"}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>جنسیت:</Typography>
                <Typography>{genderType(owner.gender) ?? "-"}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>نام پدر:</Typography>
                <Typography>{owner.father_name ?? "-"}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>کد ملی:</Typography>
                <Typography>
                  {enToFaNumber(owner.national_code) ?? "-"}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>موبایل:</Typography>
                <Typography>{renderMobileFormat(owner.mobile) ?? "-"}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2} alignItems="baseline">
                <Typography fontWeight={700}>وضعیت:</Typography>
                <Typography>{renderChip(owner.status)}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2} alignItems="baseline">
                <Typography fontWeight={700}>استعلام:</Typography>
                <Typography>{renderChip(owner.inquiry)}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={1} alignItems="baseline">
                <Typography fontWeight={700}>امتیاز:</Typography>
                <Rating precision={0.2} value={owner?.rating} size="small" readOnly/>
                <Tooltip placement="top" title="مشاهده تاریخچه امتیازات">
                  <Box
                      sx={{cursor: "pointer"}}
                      onClick={toggleShowHistory}
                  >
                    <SvgSPrite
                        icon="rectangle-history-circle-user"
                        size={20}
                    />
                  </Box>
                </Tooltip>
              </Stack>
            </Grid>

            {/*<Grid item xs={12} md={6}>*/}
            {/*  <Stack direction={"row"} spacing={2}>*/}
            {/*    <Typography fontWeight={700}>license_card:</Typography>*/}
            {/*    <Typography>{owner.license_card ?? "-"}</Typography>*/}
            {/*  </Stack>*/}
            {/*</Grid>*/}
          </Grid>
        </Paper>
      </Modal>
          <ShowPersonScoreModal show={showHistory} onClose={toggleShowHistory}/>
        </>
    )
  );
};

export default OwnerDetailModal;
