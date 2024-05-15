import { useState } from "react";
import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import { DRAWER_TRANSITION, DRAWER_WIDTH } from "./vars";
import Drawer from "./Drawer";
import Header from "./Header";

const PanelLayout = () => {
  const [showDrawer, setShowDrawer] = useState(true);

  const toggleShowDrawer = () => setShowDrawer((prev) => !prev);
  if (!Cookies.get("token")) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          bgcolor: "background.default",
        }}
      >
        <Box
          sx={{
            p: 3,
            pt: 2,
            transition: DRAWER_TRANSITION,
            width: showDrawer ? `calc(100% - ${DRAWER_WIDTH}px)` : "100%",
          }}
        >
          <Header toggleShowDrawer={toggleShowDrawer} showDrawer={showDrawer} />

          <Box mt={3} sx={{ minHeight: "100vh" }}>
            <Outlet />
          </Box>
        </Box>
        <Drawer showDrawer={showDrawer} />
      </Box>
    </>
  );
};
export default PanelLayout;
