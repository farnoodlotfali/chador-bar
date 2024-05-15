import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const BlankLayout = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Outlet />
    </Box>
  );
};

export default BlankLayout;
