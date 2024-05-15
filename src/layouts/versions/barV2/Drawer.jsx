/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useContext, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Collapse,
  Paper,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { AppContext } from "context/appContext";
import { SvgSPrite } from "Components/SvgSPrite";
import { deepCopy } from "Utility/utils";
import {
  DRAWER_MENU_ITEMS_BOTTOM,
  DRAWER_MENU_ITEMS_TOP,
  DRAWER_TRANSITION,
  DRAWER_WIDTH,
} from "./vars";
import ProfilePopover from "./ProfilePopover";
import MenuItemBox from "./MenuItemBox";

const Drawer = ({ showDrawer }) => {
  const { appTheme, user } = useContext(AppContext);
  const roleName = localStorage.getItem("role");
  const menuTop = useMemo(
    () => FilterArrayOfRoutes(deepCopy(DRAWER_MENU_ITEMS_TOP)),
    [user]
  );

  const menuBottom = useMemo(
    () => FilterArrayOfRoutes(deepCopy(DRAWER_MENU_ITEMS_BOTTOM)),
    [user]
  );

  const renderItems = (menu) => {
    return menu?.map((item, index) => {
      if (!item) {
        return true;
      }
      if (item?.childrenLinks) {
        return <MenuChildrenLinksItem key={index} item={item} />;
      }

      return <NormalMenuItem key={index} item={item} />;
    });
  };

  return (
    <Paper
      sx={{
        width: DRAWER_WIDTH,
        left: { md: 0, xs: showDrawer ? 0 : `-${DRAWER_WIDTH}px` },
        height: "100vh",
        transition: DRAWER_TRANSITION,
        position: "fixed",
        boxShadow: 1,
        borderRadius: "0",
        overflowY: "auto",
        zIndex: (theme) => theme.zIndex.drawer,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Link to="/desktop">
          <img
            style={{
              width: "100%",
              height: "100%",
            }}
            src={require(`Assets/images/${
              process.env.REACT_APP_VERSION_CODE
            }/truck_${appTheme === "dark" ? "light" : "dark"}.png`)}
            alt="logo"
            loading="eager"
          />
        </Link>
        {roleName && (
          <Stack
            sx={{
              height: "25px",
              overflow: "hidden",
              borderRadius: 0.5,
            }}
          >
            <Stack
              sx={{
                bgcolor: "#000",
                flex: 1,
                opacity: 0.05,
              }}
            />
            <Typography
              variant="small"
              sx={{
                position: "absolute",
                color: "#000",
                alignSelf: "center",
                mt: "4px",
              }}
            >
              {roleName?.includes("legal-owner")
                ? "صاحب کالا"
                : roleName?.includes("shipping-manager")
                ? "شرکت حمل"
                : "ادمین"}
            </Typography>
          </Stack>
        )}
      </Box>

      <Stack justifyContent="space-between" flexGrow={1}>
        <Stack p={2} spacing={2} justifyContent="center" alignItems="center">
          {renderItems(menuTop)}
        </Stack>
        <Stack p={2} spacing={2} justifyContent="center" alignItems="center">
          {renderItems(menuBottom)}
          <ProfilePopover />
        </Stack>
      </Stack>
    </Paper>
  );
};

const NormalMenuItem = ({ item }) => {
  const theme = useTheme();
  return (
    <Link to={item.link}>
      <Tooltip
        componentsProps={{
          tooltip: {
            sx: {
              background: theme.palette.background.paper,
              color: theme.palette.text.primary,
              boxShadow: 2,
            },
          },
          arrow: {
            sx: {
              color: theme.palette.background.paper,
            },
          },
        }}
        title={item.title}
        placement="left"
        arrow
      >
        <span>
          <MenuItemBox
            size="small"
            sx={{ width: 32, height: 32, bgcolor: "none" }}
            item={item}
          />
        </span>
      </Tooltip>
    </Link>
  );
};

const MenuChildrenLinksItem = ({ item }) => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const [isHover, setIsHover] = useState(false);
  const [openedItems, setOpenedItems] = useState([]);

  const handleToggleCollapse = (index) => {
    if (openedItems.includes(index)) {
      setOpenedItems((prev) => prev.filter((item) => item !== index));
    } else {
      setOpenedItems((prev) => [...prev, index]);
    }
  };

  const HoverStyle = {
    transition: "all 0.3s",
    cursor: "pointer",
    ":hover": {
      color: "primary.main",
    },
  };

  return (
    <Box
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Tooltip
        title={
          <Box>
            <Typography fontWeight={700} component="h3" mb={1} pt={2} px={2}>
              {item.title}
            </Typography>

            <Stack
              spacing={2}
              component="ul"
              sx={{
                listStyle: "none",
                p: 2,
              }}
            >
              {item?.childrenLinks?.map((li) => {
                const isOpen = openedItems.includes(li.title);
                const hasChildren = !!li.childrenLinks?.length;

                const text = (
                  <Typography fontSize="inherit">
                    <Box component="span" mr={1}>
                      •
                    </Box>
                    {li.title}
                  </Typography>
                );

                return (
                  <Fragment key={li.link}>
                    <Typography
                      component="li"
                      sx={{
                        fontSize: "14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        userSelect: "none",
                        color:
                          (isOpen || pathname === li?.link) && "primary.main",
                        ...HoverStyle,
                      }}
                      onClick={() => {
                        if (hasChildren) {
                          handleToggleCollapse(li.title);
                        }
                      }}
                    >
                      {hasChildren ? text : <Link to={li.link}>{text}</Link>}
                      {hasChildren && (
                        <>
                          {isOpen ? (
                            <SvgSPrite
                              color="inherit"
                              icon="chevron-up"
                              size="10px"
                            />
                          ) : (
                            <SvgSPrite
                              color="inherit"
                              icon="chevron-down"
                              size="10px"
                            />
                          )}
                        </>
                      )}
                    </Typography>

                    {hasChildren && (
                      <Collapse in={isOpen} sx={{ mt: 0 }}>
                        <Stack spacing={1}>
                          {li.childrenLinks?.map((child) => {
                            return (
                              <Link key={child.link} to={child.link}>
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  sx={{
                                    width: "100%",
                                    fontWeight: 400,
                                    alignItems: "center",
                                    userSelect: "none",
                                    ml: 1,
                                    color:
                                      pathname === child?.link &&
                                      "primary.main",
                                    ...HoverStyle,
                                  }}
                                >
                                  <Typography mr={1}>·</Typography>

                                  {child.title}
                                </Stack>
                              </Link>
                            );
                          })}
                        </Stack>
                      </Collapse>
                    )}
                  </Fragment>
                );
              })}
            </Stack>
          </Box>
        }
        placement="left-start"
        componentsProps={{
          tooltip: {
            sx: {
              background: theme.palette.background.paper,
              color: theme.palette.text.primary,
              boxShadow: 2,
              p: 0,
              minWidth: 150,
            },
          },
          arrow: {
            sx: {
              color: theme.palette.background.paper,
            },
          },
        }}
        arrow
        open={isHover}
      >
        <span>
          <MenuItemBox item={item} />
        </span>
      </Tooltip>
    </Box>
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
