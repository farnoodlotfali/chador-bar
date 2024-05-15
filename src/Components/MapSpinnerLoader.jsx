import { Box, CircularProgress, Typography } from "@mui/material";

const MapSpinnerLoader = () => {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(0,0,40,0.6)",
        userSelect: "none",
        zIndex: 500,
        inset: 0,
        position: "absolute",
        color: "common.white",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: 2,
        pt: 5,
        textAlign: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress color="inherit" size={45} />
      <Typography>در حال بارگذاری نقشه...</Typography>
    </Box>
  );
};

export default MapSpinnerLoader;
