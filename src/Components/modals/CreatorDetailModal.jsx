import { Grid, Paper, Stack, Typography, Avatar } from "@mui/material";
import Modal from "Components/versions/Modal";
import { enToFaNumber, genderType } from "Utility/utils";

const CreatorDetailModal = ({ open, onClose, creator }) => {
  return (
    open && (
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
                  {(creator.first_name ?? "-") + " " + (creator.last_name ?? "")}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>تاریخ تولد:</Typography>
                <Typography>{enToFaNumber(creator.birth_date)}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>ایمیل:</Typography>
                <Typography>{creator.email ?? "-"}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>جنسیت:</Typography>
                <Typography>{genderType(creator.gender) ?? "-"}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>نام پدر:</Typography>
                <Typography>{creator.father_name ?? "-"}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>کد ملی:</Typography>
                <Typography>
                  {enToFaNumber(creator.national_code) ?? "-"}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>موبایل:</Typography>
                <Typography>{enToFaNumber(creator.mobile) ?? "-"}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>وضعیت:</Typography>
                <Typography>{creator.status ?? "-"}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>استعلام:</Typography>
                <Typography>{creator.inquiry ?? "-"}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>license_card:</Typography>
                <Typography>{creator.license_card ?? "-"}</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    )
  );
};

export default CreatorDetailModal;
