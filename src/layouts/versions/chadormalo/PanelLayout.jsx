import { useState } from "react";
import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import Drawer from "./Drawer";
import { DRAWER_TRANSITION, DRAWER_WIDTH, MIN_DRAWER_WIDTH } from "./vars";
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
        <Drawer showDrawer={showDrawer} toggleShowDrawer={toggleShowDrawer} />
        <Box
          sx={{
            transition: DRAWER_TRANSITION,
            width: {
              md: showDrawer
                ? `calc(100% - ${DRAWER_WIDTH + MIN_DRAWER_WIDTH}px)`
                : `calc(100% - ${MIN_DRAWER_WIDTH}px)`,
              xs: "100%",
            },
          }}
        >
          <Header />

          <Box
            sx={{
              p: 3,
              minHeight: "100vh",
              mt: 3,
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default PanelLayout;
