import { useState } from "react";
import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";
import { Box, Paper } from "@mui/material";
import { DRAWER_TRANSITION, DRAWER_WIDTH } from "./vars";
import Header from "./Header";
import Drawer from "./Drawer";

const PanelLayout = () => {
  const [showDrawer, setShowDrawer] = useState(false);

  const toggleShowDrawer = () => setShowDrawer((prev) => !prev);

  if (!Cookies.get("token")) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Box
        sx={{
          transition: DRAWER_TRANSITION,
          width: {
            md: `calc(100% - ${DRAWER_WIDTH}px)`,
            xs: "100%",
          },
          position: "relative",
          minHeight: "100vh",
          bgcolor: "background.paper",
          height: "100%",
          overflowY: "auto",
        }}
      >
        <Header toggleShowDrawer={toggleShowDrawer} showDrawer={showDrawer} />
        <Paper
          sx={{
            bgcolor: "transparent",
            m: 1,
            mt: 3,
            p: 3,
            pb: 4,
            position: "absolute",
            top: 60,
            right: 0,
            left: 0,
          }}
          elevation={0}
        >
          <Outlet />
        </Paper>
      </Box>
      <Drawer showDrawer={showDrawer} />
    </Box>
  );
};
export default PanelLayout;
