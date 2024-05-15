import { AppContext } from "context/appContext";
import { useContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import { DRAWER_TRANSITION, DRAWER_WIDTH, HEADER_HEIGHT } from "./vars";
import { Card, IconButton, Stack, Typography } from "@mui/material";
import { SvgSPrite } from "Components/SvgSPrite";
import { PAGE_TITLES } from "Constants";
import MessagesPopover from "./MessagesPopover";
import ProfilePopper from "./ProfilePopper";
import { pathnameParam } from "Utility/utils";

const Header = ({ toggleShowDrawer, showDrawer }) => {
  const { appTheme, toggleTheme } = useContext(AppContext);
  const location = useLocation();
  const params = useParams();

  return (
    <Card
      sx={{
        boxShadow: 2,
        px: 1,
        transition: DRAWER_TRANSITION,
        left: showDrawer ? `calc(0% + ${DRAWER_WIDTH}px + 24px)` : "24px",
        position: "-webkit-sticky",
        position: "sticky",
        top: 0,
        zIndex: 501,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{
          width: "100%",
          height: HEADER_HEIGHT,
        }}
      >
        <Stack direction={"row"} alignItems={"center"}>
          <IconButton size="large" aria-label="menu" onClick={toggleShowDrawer}>
            <SvgSPrite color="inherit" icon="bars" />
          </IconButton>
          <Typography variant="h6" ml={2}>
            {PAGE_TITLES[location.pathname] ||
              PAGE_TITLES[pathnameParam(params, location)]}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={2}
        >
          <IconButton size="large" onClick={() => toggleTheme()}>
            {appTheme === "dark" ? (
              <SvgSPrite color="inherit" icon="sun-bright" />
            ) : (
              <SvgSPrite color="inherit" icon="moon" />
            )}
          </IconButton>

          <MessagesPopover />

          <ProfilePopper />
        </Stack>
      </Stack>
    </Card>
  );
};

export default Header;
