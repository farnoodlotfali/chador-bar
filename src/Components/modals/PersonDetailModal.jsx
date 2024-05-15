import { Grid, Paper, Stack, Typography, Avatar } from "@mui/material";
import Modal from "Components/versions/Modal";
import { enToFaNumber, genderType, renderMobileFormat } from "Utility/utils";

const PersonDetailModal = ({ open, onClose, person }) => {
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
                  alt="person Avatar"
                  src={person?.avatar}
                  sx={{ width: 80, height: 80 }}
                />
                <Typography>
                  {(person.first_name ?? "-") + " " + (person.last_name ?? "")}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>تاریخ تولد:</Typography>
                <Typography>{enToFaNumber(person.birth_date)}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>ایمیل:</Typography>
                <Typography>{person.email ?? "-"}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>جنسیت:</Typography>
                <Typography>{genderType(person.gender) ?? "-"}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>نام پدر:</Typography>
                <Typography>{person.father_name ?? "-"}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>کد ملی:</Typography>
                <Typography>
                  {enToFaNumber(person.national_code) ?? "-"}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>موبایل:</Typography>
                <Typography>
                  {renderMobileFormat(person.mobile) ?? "-"}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>وضعیت:</Typography>
                <Typography>{person.status ?? "-"}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>استعلام:</Typography>
                <Typography>{person.inquiry ?? "-"}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction={"row"} spacing={2}>
                <Typography fontWeight={700}>license_card:</Typography>
                <Typography>{person.license_card ?? "-"}</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    )
  );
};

export default PersonDetailModal;
