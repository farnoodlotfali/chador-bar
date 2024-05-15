/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Collapse,
  Card,
  MenuItem,
  Divider,
  Slide,
  Popover,
  Drawer as MuiDrawer,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

import { SvgSPrite } from "Components/SvgSPrite";
import AdminLogo from "Components/AdminLogo";
import { AppContext } from "context/appContext";
import { deepCopy } from "Utility/utils";

import {
  DRAWER_BOTTOM_MENU_ITEMS,
  DRAWER_MENU_ITEMS,
  DRAWER_TRANSITION,
  MIN_DRAWER_WIDTH,
  TOTAL_DRAWER_WIDTH,
} from "./vars";

// copy middle links
let NEW_DRAWER_MENU_ITEMS;

const Drawer = ({ showDrawer, toggleShowDrawer }) => {
  const { logoutUser, user, role, userType } = useContext(AppContext);

  NEW_DRAWER_MENU_ITEMS = useMemo(
    () => FilterArrayOfRoutes(deepCopy(DRAWER_MENU_ITEMS)),
    [user]
  );

  const theme = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const matches = useMediaQuery("(max-width:400px)", { noSsr: true });
  const isTablet = useMediaQuery(theme.breakpoints.up("md"));

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [slideIn, setSlideIn] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(
    findActiveUrl(pathname) ?? NEW_DRAWER_MENU_ITEMS[0]
  );

  const toggleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setIsProfileMenuOpen((prev) => !prev);
  };

  const handleClickMenuItem = (val) => {
    if (!showDrawer) {
      toggleShowDrawer();
    }
    if (selectedMenu?.name === val) {
      return;
    }

    setSlideIn(false);
    setTimeout(() => {
      setSelectedMenu(NEW_DRAWER_MENU_ITEMS.find((item) => item.name === val));
      setSlideIn(true);
    }, 350);
  };

  const canBeOpen = true && Boolean(anchorEl);
  const roleName = localStorage.getItem("role");
  const id = canBeOpen ? "transition-popper" : undefined;

  const logout = () => {
    localStorage.removeItem("reload");
    logoutUser();
    navigate("/login");
  };

  const drawerComponent = (
    <Box
      sx={{
        transition: DRAWER_TRANSITION,
        width: {
          md: showDrawer ? TOTAL_DRAWER_WIDTH : MIN_DRAWER_WIDTH,
          xs: matches ? TOTAL_DRAWER_WIDTH - 80 : TOTAL_DRAWER_WIDTH,
        },
        left: 0,
        display: "flex",
        position: {
          md: "fixed",
          xs: "relative",
        },
        bottom: 0,
        top: 0,
        userSelect: "none",
        zIndex: 12,
        height: "100%",
      }}
    >
      {/* main menus section */}
      <Box
        sx={{
          transition: DRAWER_TRANSITION,
          bgcolor: "primary.900",
          display: "flex",
          flexDirection: "column",
          alignItems: { lg: "center" },
          minWidth: matches ? "auto" : MIN_DRAWER_WIDTH,
          width: matches ? "auto" : MIN_DRAWER_WIDTH,
          p: matches ? 1 : 2,
          overflowY: "auto",
        }}
      >
        <Stack
          height={"100%"}
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            sx={{
              // width: 45,
              height: 45,
            }}
          >
            <Link to="/desktop">
              <AdminLogo fill={"white"} />
            </Link>

            {roleName && (
              <Stack
                sx={{
                  width: "70px",
                  height: "25px",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 0.5,
                }}
              >
                <Stack sx={{ bgcolor: "#ffff", flex: 1, opacity: 0.1 }} />
                <Typography
                  variant="small"
                  sx={{
                    position: "absolute",
                    color: "#fff",
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

          <Stack spacing={1} my={{ md: 5, xs: 2 }}>
            {NEW_DRAWER_MENU_ITEMS.map((item) => {
              return (
                <IconDrawerMenuBox
                  key={item.name}
                  handleClick={handleClickMenuItem}
                  {...item}
                />
              );
            })}
          </Stack>

          <Stack spacing={1}>
            {FilterArrayOfRoutes(deepCopy(DRAWER_BOTTOM_MENU_ITEMS))
              .concat([
                {
                  title: "پروفایل",
                  icon: "user",
                  onClick: toggleProfileMenu,
                  name: "profile",
                },
              ])
              .filter((r) => !!r)
              .map((item, i) => {
                return (
                  <Box
                    key={i}
                    sx={{
                      color: (theme) => theme.palette.common.white,
                      p: 1,
                      width: "fit-content",
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      alignSelf: "center",
                      cursor: "pointer",
                      flexDirection: "column",
                      ":hover": {
                        bgcolor: "#cccccc20",
                      },
                    }}
                    component={item?.link ? Link : "div"}
                    title={item.title}
                    onClick={(e) => {
                      if (!item?.link) {
                        item.onClick(e);
                      }
                    }}
                    to={item?.link ?? "#"}
                  >
                    <SvgSPrite icon={item.icon} size="small" color="inherit" />
                  </Box>
                );
              })}

            <Popover
              id={id}
              open={isProfileMenuOpen}
              anchorEl={anchorEl}
              onClose={toggleProfileMenu}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <Card
                sx={{
                  boxShadow: 1,
                  py: 1,
                  minWidth: "200px",
                }}
              >
                <Stack px={2} py={0.5}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    {user?.name}
                  </Typography>
                  <Typography variant="caption">
                    {!!userType && !!role ? role + " | " + userType : "نامشخص"}
                  </Typography>
                </Stack>

                <Divider sx={{ my: 1 }} />

                <Link
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                  }}
                  to="/profile"
                >
                  <MenuItem>
                    <Stack
                      direction="row"
                      justifyContent="flex-start"
                      sx={{ minWidth: "100px" }}
                    >
                      <SvgSPrite icon="user" size="small" />
                      <Typography ml={1} variant="subtitle2">
                        پروفایل
                      </Typography>
                    </Stack>
                  </MenuItem>
                </Link>
                <Box onClick={logout}>
                  <MenuItem>
                    <Stack
                      direction="row"
                      justifyContent="flex-start"
                      sx={{ minWidth: "100px" }}
                    >
                      <SvgSPrite icon="arrow-right-from-bracket" size="small" />
                      <Typography ml={1} variant="subtitle2">
                        خروج
                      </Typography>
                    </Stack>
                  </MenuItem>
                </Box>
              </Card>
            </Popover>
          </Stack>
        </Stack>
      </Box>

      {/*sub menus section */}
      <Stack
        sx={{
          overflowY: "scroll",
          bgcolor: "secondary.900",
          width: "100%",
          color: "grey.400",
        }}
      >
        <Slide
          direction={slideIn ? "left" : "right"}
          in={slideIn}
          mountOnEnter
          unmountOnExit
          timeout={200}
        >
          <Stack spacing={0.5} p={2} whiteSpace="nowrap">
            <Box color="white" textAlign="center">
              <SvgSPrite
                icon={selectedMenu.icon}
                color={"inherit"}
                size="large"
              />
              <Box mb={8}>{selectedMenu.title}</Box>
            </Box>
            {selectedMenu.childrenLinks.map((item) => {
              if (item?.link) {
                return (
                  <Link key={item.link} to={item.link}>
                    <StyledBox isActive={pathname === item.link}>
                      <Typography variant="subtitle2">{item.title}</Typography>
                    </StyledBox>
                  </Link>
                );
              }

              return <RenderItems {...item} />;
            })}
          </Stack>
        </Slide>
      </Stack>

      {/*toggle Show Drawer section */}
      <OpenCloseSubMenusButton
        toggleShowDrawer={toggleShowDrawer}
        showDrawer={showDrawer}
      />
    </Box>
  );
  return isTablet ? (
    drawerComponent
  ) : (
    <MuiDrawer anchor={"left"} open={showDrawer} onClose={toggleShowDrawer}>
      {drawerComponent}
    </MuiDrawer>
  );
};

const OpenCloseSubMenusButton = ({ toggleShowDrawer, showDrawer }) => {
  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        position: "absolute",
        bottom: { md: 18 },
        top: { md: "unset", xs: 18 },
        right: { md: -15, xs: 10 },
        bgcolor: "primary.900",
        boxShadow: 2,
        transition: DRAWER_TRANSITION,
        color: (theme) => theme.palette.common.white,
        borderRadius: 1,
        cursor: "pointer",
        border: "1px solid #ffffff38",
        "& .drawer-arrow": {
          transform: showDrawer && "rotateY(180deg)",
        },
        ":hover": {
          bgcolor: "primary.800",
        },
      }}
      onClick={toggleShowDrawer}
    >
      <SvgSPrite
        icon={"arrow-left"}
        size="small"
        color="inherit"
        className="drawer-arrow"
      />
    </Box>
  );
};

const RenderItems = ({ title, childrenLinks }) => {
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <Box>
      <StyledBox onClick={() => setOpenMenu((prev) => !prev)}>
        <Typography>{title}</Typography>
        <Typography
          variant="small"
          sx={{
            transition: "all 0.3s",
            transform: openMenu && "rotateZ(-450deg)",
          }}
        >
          ❯
        </Typography>
      </StyledBox>

      <Collapse in={openMenu} sx={{ mt: 0 }}>
        <Stack py={1} ml={2} spacing={1}>
          {childrenLinks.map((item) => {
            return (
              <Link key={item.link} to={item.link}>
                <StyledBox isActive={pathname === item.link}>
                  <Typography variant="subtitle2">{item.title}</Typography>
                </StyledBox>
              </Link>
            );
          })}
        </Stack>
      </Collapse>
    </Box>
  );
};
const IconDrawerMenuBox = ({
  icon,
  title,
  name,
  childrenLinks,
  handleClick,
}) => {
  const { pathname } = useLocation();

  const isActive = isActiveUrl(childrenLinks, pathname);

  const button = (
    <Box
      sx={{
        bgcolor: isActive && "#cccccc20",
        p: 1,
        width: "100%",
        borderRadius: 1,
        display: "flex",
        alignItems: "center",
        color: "white",
        alignSelf: "center",
        cursor: "pointer",
        flexDirection: "column",
        ":hover": {
          bgcolor: "#cccccc20",
        },
      }}
      onClick={() => {
        if (name) {
          handleClick(name);
        }
      }}
    >
      <SvgSPrite icon={icon} size={"medium"} color={"inherit"} />

      <Typography
        variant="small"
        mt={0.3}
        className="menu-name"
        textAlign="center"
      >
        {title}
      </Typography>
    </Box>
  );

  return button;
};

const StyledBox = styled(Typography)(({ theme, isActive }) => ({
  "&": {
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    justifyContent: "space-between",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    backgroundColor: isActive && "#cccccc20",
    color: isActive ? "white" : "inherit",
    ":hover": {
      backgroundColor: "#cccccc20",
      color: "white",
    },
  },
}));

const isActiveUrl = (childrenLinks, pathname) => {
  let isActiveLink = false;

  childrenLinks?.forEach((li) => {
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

  return isActiveLink;
};
// will find active url else return null
const findActiveUrl = (pathname) => {
  let activeLink = null;
  outerLoop: for (const url of NEW_DRAWER_MENU_ITEMS) {
    for (const li of url?.childrenLinks || []) {
      if (li?.link && pathname === li?.link) {
        activeLink = url;
        break outerLoop;
      } else if (li?.childrenLinks) {
        for (const item of li.childrenLinks) {
          if (pathname === item?.link) {
            activeLink = url;
            break outerLoop;
          }
        }
      }
    }
  }
  return activeLink;
};

const FilterArrayOfRoutes = (menuItems) => {
  const { notPermissions } = useContext(AppContext);

  filterLinks(menuItems, notPermissions);

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
        menuItems.splice(i, 1);
      }
    }
  });
}

export default Drawer;
