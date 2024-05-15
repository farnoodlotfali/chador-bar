import { Box } from "@mui/material";
import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

const BlankLayoutWithAuth = () => {
  if (!Cookies.get("token")) {
    return <Navigate to="/login" replace />;
  }
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

export default BlankLayoutWithAuth;
