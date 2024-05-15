import { Box, Chip, Stack, Typography } from "@mui/material";
import { handleDate } from "Utility/utils";

const CIRCLE_SIZE = 15;

export default function BarV2Timeline({
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
            width: "1px",
            height: "93%",
            bgcolor: "#9e9e9e",
            position: "absolute",
            left: `${CIRCLE_SIZE / 2}px`,
          }}
        />

        <Stack
          spacing={4}
          sx={{ height: "330px", width: "100%", overflowY: "scroll" }}
        >
          {data.reverse().map((i) => {
            const status = handleStatus(i.action);
            const color = status?.color;
            const Icon = status?.icon;

            return (
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ zIndex: "1", pr: 2 }}
              >
                <Box
                  sx={{
                    width: `${CIRCLE_SIZE}px`,
                    height: `${CIRCLE_SIZE}px`,
                    bgcolor: `${color}.light`,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: `${CIRCLE_SIZE - 2}px`,
                      height: `${CIRCLE_SIZE - 2}px`,
                      bgcolor: `background.paper`,
                      borderRadius: "50%",
                    }}
                  />
                </Box>

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
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </Box>
    )
  );
}
