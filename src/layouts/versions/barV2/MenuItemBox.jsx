import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import { SvgSPrite } from "Components/SvgSPrite";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

const commonStyle = {
  borderRadius: 4,
  height: 45,
  width: 45,
  display: "flex",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.3s",
};

const MenuItemBox = ({ item, sx = {}, size = "medium" }) => {
  const theme = useTheme();

  const COLOR = useMemo(
    () => (theme.palette.mode === "dark" ? "primary.main" : "secondary.main"),
    [theme.palette.mode]
  );
  const { pathname } = useLocation();
  const isActive = useMemo(() => isActiveUrl(item, pathname), [pathname]);

  return (
    <Box
      sx={
        isActive
          ? {
              ...commonStyle,
              bgcolor: COLOR,
              color: "white",
              ...sx,
            }
          : {
              ...commonStyle,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "background.default"
                  : "#F6F8FA",
              ...sx,
              color: "#99A1B7",
              ":hover": {
                color: COLOR,
              },
            }
      }
    >
      <SvgSPrite icon={item.icon} color="inherit" size={size} />
    </Box>
  );
};

const isActiveUrl = (item, pathname) => {
  let isActiveLink = false;

  if (item?.childrenLinks) {
    item?.childrenLinks?.forEach((li) => {
      if (li?.link && pathname === li?.link) {
        isActiveLink = true;
      } else if (li?.childrenLinks) {
        li.childrenLinks.forEach((item) => {
          if (pathname === item?.link) {
            isActiveLink = true;
          }
        });
      }
    });
  } else {
    isActiveLink = pathname === item?.link;
  }

  return isActiveLink;
};

export default MenuItemBox;
