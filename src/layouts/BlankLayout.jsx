import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const BlankLayout = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Outlet/>
    </Box>
  );
};

export default BlankLayout;
