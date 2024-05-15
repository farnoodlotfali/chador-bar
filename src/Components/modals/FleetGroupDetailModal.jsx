import { Box, Card, Grid, Stack, Typography } from "@mui/material";
import FormTypography from "Components/FormTypography";
import Modal from "Components/versions/Modal";
import { renderPlaqueObjectToString } from "Utility/utils";

const FleetGroupDetailModal = ({ open, onClose, data }) => {
    return (
        <Modal open={open} onClose={onClose}>
          <FormTypography>اطلاعات گروه</FormTypography>
          <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <Stack
                    direction={"row"}
                    sx={{ justifyContent: "space-between", padding: 2 }}
                  >
                    <Typography>نام گروه</Typography>
                    <Typography>{data?.name}</Typography>
                  </Stack>
                  <Stack
                    direction={"row"}
                    sx={{ justifyContent: "space-between", padding: 2 }}
                  >
                    <Typography>نام شرکت حمل</Typography>
                    <Typography> {data?.shipping_company?.name ?? "-"}</Typography>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5" mt={2}>
                  ناوگان ها
                </Typography>
              </Grid>
    
              {data ? (
                data.fleets?.map((fleet) => {
                  return (
                    <Grid item xs={12} md={4}>
                      <Card sx={{ padding: 2 }}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ width: "100%" }}
                        >
                          <Typography>کد </Typography>
                          <Typography fontSize={14}>{fleet.code}</Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ width: "100%", mt: 2 }}
                        >
                          <Typography>پلاک</Typography>
                          <Typography>
                            {renderPlaqueObjectToString(fleet?.vehicle?.plaque)}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ width: "100%", mt: 2 }}
                        >
                          <Typography>نوع خودرو</Typography>
                          <Typography>
                            {fleet.vehicle?.container_type?.vehicle_category?.title}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ width: "100%", mt: 2 }}
                        >
                          <Typography>نوع بارگیر</Typography>
                          <Typography>
                            {fleet.vehicle?.container_type?.title}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ width: "100%", mt: 2 }}
                        >
                          <Typography>مدل خودرو</Typography>
                          <Typography>
                            {fleet.vehicle?.vehicle_model?.title}
                          </Typography>
                        </Stack>
                      </Card>
                    </Grid>
                  );
                })
              ) : (
                <Typography pt={2} pl={2}>
                  ناوگانی یافت نشد
                </Typography>
              )}
            </Grid>
          </Box>
        </Modal>
      );
}

export default FleetGroupDetailModal