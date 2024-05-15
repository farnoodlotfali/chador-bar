/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, Typography, Button, Stack, Collapse, Paper } from "@mui/material";

import { AppContext } from "context/appContext";
import { SvgSPrite } from "Components/SvgSPrite";
import { deepCopy } from "Utility/utils";
import { DRAWER_MENU_ITEMS, DRAWER_TRANSITION, DRAWER_WIDTH } from "./vars";

const Drawer = ({ showDrawer }) => {
  const { setDrawer, drawer, appTheme, user } = useContext(AppContext);
  const { pathname } = useLocation();
  const menu = useMemo(
    () => FilterArrayOfRoutes(deepCopy(DRAWER_MENU_ITEMS)),
    [user]
  );

  const [openedItems, setOpenedItems] = useState(drawer || []);

  const handleToggleCollapse = (index) => {
    if (openedItems.includes(index)) {
      setOpenedItems((prev) => prev.filter((item) => item !== index));
    } else {
      setOpenedItems((prev) => [...prev, index]);
    }
  };

  const renderItems = () => {
    return menu?.map((item, index) => {
      if (!item) {
        return;
      }
      const isActive = pathname.startsWith(item?.routeName);
      const isOpen = openedItems.includes(index);

      const button = (
        <Button
          color={appTheme === "dark" && isActive ? "primary" : "secondary"}
          variant={isActive ? "contained" : "text"}
          size="large"
          sx={{ width: "100%", px: 1 }}
          onClick={() => {
            if (item.childrenLinks) {
              handleToggleCollapse(index);
            }
          }}
        >
          <SvgSPrite icon={item.icon} color="inherit" />
          <Typography
            variant="button"
            sx={{ flexGrow: 1, textAlign: "left", ml: 1 }}
            fontWeight={500}
          >
            {item.text}
          </Typography>
          {item.childrenLinks?.length && (
            <>
              {isOpen ? (
                <SvgSPrite color="inherit" icon="chevron-down" size="10px" />
              ) : (
                <SvgSPrite color="inherit" icon="chevron-left" size="10px" />
              )}
            </>
          )}
        </Button>
      );

      return !item.childrenLinks ? (
        <div key={item.id}>
          <Link to={item.routeName}>{button}</Link>
        </div>
      ) : (
        item.childrenLinks?.length !== 0 && (
          <div key={item.id}>
            {button}
            {item.childrenLinks?.length !== 0 && (
              <Collapse in={isOpen} sx={{ mt: 0 }}>
                <Stack spacing={1} mt={1}>
                  {item.childrenLinks?.map((child) => {
                    const isActive = pathname === child.routeName;
                    return (
                      <Link key={child.routeName} to={child.routeName}>
                        <Button
                          color={
                            appTheme === "dark" && isActive
                              ? "primary"
                              : "secondary"
                          }
                          variant={isActive ? "contained" : "text"}
                          sx={{
                            width: "100%",
                            pr: 1,
                            pl: 3,
                          }}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            sx={{ width: "100%" }}
                            fontWeight={400}
                          >
                            <Typography mr={1}>
                              <SvgSPrite
                                icon="circle"
                                color="inherit"
                                size={"10px"}
                              />
                            </Typography>

                            {child.text}
                          </Stack>
                        </Button>
                      </Link>
                    );
                  })}
                </Stack>
              </Collapse>
            )}
          </div>
        )
      );
    });
  };

  useEffect(() => {
    setDrawer(openedItems);
  }, [openedItems]);

  return (
    <Paper
      sx={{
        width: DRAWER_WIDTH,
        left: showDrawer ? 0 : `-${DRAWER_WIDTH}px`,
        height: "100vh",
        transition: DRAWER_TRANSITION,
        position: "fixed",
        boxShadow: 1,
        borderRadius: "0",
        overflowY: "auto",
      }}
    >
      <Box sx={{ p: 2 }}>
        <img
          style={{
            width: "100%",
            height: "100%",
          }}
          src={require(`Assets/images/${
            process.env.REACT_APP_VERSION_CODE
          }/truck_text_${appTheme === "dark" ? "light" : "dark"}.png`)}
          alt="logo"
          loading="eager"
        />
      </Box>

      <Stack p={2} spacing={1}>
        {renderItems()}
      </Stack>
    </Paper>
  );
};

const FilterArrayOfRoutes = (menuItems) => {
  const { notPermissions } = useContext(AppContext);
  filterLinks(menuItems, notPermissions);
  menuItems = menuItems.filter((r) => !!r);

  return menuItems;
};

function filterLinks(menuItems, notPermissions) {
  menuItems.forEach((item, i) => {
    if (notPermissions.includes(item?.name)) {
      const index = menuItems.findIndex((r) => r?.name === item?.name);
      if (index > -1) {
        menuItems[index] = null;
      }
    }

    if (item?.childrenLinks) {
      filterLinks(item.childrenLinks, notPermissions);
      item.childrenLinks = item.childrenLinks.filter((r) => !!r);
      if (item.childrenLinks.length === 0) {
        menuItems[i] = null;
      }
    }
  });
}

export default Drawer;
