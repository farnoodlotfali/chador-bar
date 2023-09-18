import { Box, Chip, Grid, Stack, Typography } from "@mui/material";
import { handleDate } from "Utility/utils";

const CIRCLE_SIZE = 18;

export default function ChadormaloTimeline({
  data,
  colors,
  historyActions,
  handleStatus,
}) {
  return (
    data && (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: 3,
            height: "100%",
            bgcolor: "#cccccc50",
            position: "absolute",
            left: 137.5,
          }}
        />

        <Grid
          container
          spacing={4}
          sx={{
            width: "100%",
            overflowY: "auto",
            height: "fit-content",
          }}
        >
          {data.reverse().map((i) => {
            const status = handleStatus(i.action);
            const color = status?.color;
            const Icon = status?.icon;

            return (
              <Grid
                item
                xs={12}
                sx={{ zIndex: "1", pr: 2, height: "fit-content" }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={1.5}>
                    {i.created_at ? (
                      <Typography
                        variant="subtitle2"
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        {handleDate(i.created_at, "YYYY/MM/DD")}
                        {" - "}
                        {handleDate(i.created_at, "HH:MM")}
                      </Typography>
                    ) : (
                      "-"
                    )}
                  </Grid>

                  <Grid item>
                    <Box
                      sx={{
                        minWidth: `${CIRCLE_SIZE}px`,
                        height: `${CIRCLE_SIZE}px`,
                        bgcolor: `${color}.light`,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: `${CIRCLE_SIZE - 8}px`,
                          height: `${CIRCLE_SIZE - 8}px`,
                          bgcolor: `background.paper`,
                          borderRadius: "50%",
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ width: "100%" }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip
                          label={historyActions[i.action]}
                          variant="outlined"
                          color={color}
                          sx={{ minWidth: "80px" }}
                          icon={<Icon />}
                          size="small"
                        />

                        <Typography>توسط</Typography>
                        <Typography sx={{ fontWeight: "bold" }}>
                          {i.user?.first_name || "-"}
                          {" " + (i.user?.last_name || "-")}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    )
  );
}
