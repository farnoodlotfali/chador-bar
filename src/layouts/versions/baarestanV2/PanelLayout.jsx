import { Fragment, useContext, useMemo, useState } from "react";
import Cookies from "js-cookie";
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Popper,
  Grow,
  Collapse,
  Card,
  MenuItem,
  Paper,
  Divider,
  Tooltip,
  Popover,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useQueryClient } from "@tanstack/react-query";

import { AppContext } from "context/appContext";
import { SvgSPrite } from "Components/SvgSPrite";
import { deepCopy } from "Utility/utils";
import { PAGE_TITLES } from "Constants";

const HEADER_HEIGHT = 60;
const DRAWER_WIDTH = 85;
const DRAWER_TRANSITION = "width 0.3s ease-in-out, left 0.3s ease-in-out";
//  links
const DRAWER_MENU_ITEMS = [
  {
    title: "قرارداد",
    name: "contract",
    icon: "handshake",
    childrenLinks: [
      {
        title: "قرارداد جدید",
        link: "/contract/new",
        name: "contract.store",
      },
      {
        title: "لیست قرارداد",
        link: "/contract",
        name: "contract.index",
      },

      {
        title: "پروژه",
        childrenLinks: [
          {
            title: "لیست پروژه",
            link: "/project",
            name: "project.index",
          },
          {
            title: "پروژه جدید",
            link: "/project/new",
            name: "project.store",
          },
        ],
      },
    ],
  },
  {
    title: "برنامه‌ریزی",
    icon: "calendar-clock",
    name: "request",
    childrenLinks: [
      {
        title: "درخواست حمل جدید",
        link: "/request/new",
        name: "request.store",
      },
      {
        title: "لیست برنامه‌ریزی حمل",
        link: "/request",
        name: "request.index",
      },
      {
        title: "برنامه‌ریزی پروژه",
        link: "/project/shipping-plan-new",
        name: "project.store",
      },
      {
        title: "لیست سالن بار",
        link: "/request/salon",
        name: "salon.index",
      },
      {
        title: "تخصیص ناوگان",
        link: "/request/fleet-allocation",
        name: "fleet.allocation",
      },
      {
        title: "ثبت آهنگ پروژه",
        link: "/request/new-tune",
        name: "project-plan.store",
      },
      {
        title: "آهنگ‌های پروژه",
        link: "/request/tune",
        name: "project-plan.index",
      },
      {
        title: "قیمت‌ها",
        link: "/prices",
        name: "price",
      },
      {
        title: "بارنامه و حواله‌",
        childrenLinks: [
          {
            title: "ثبت حواله جدید",
            link: "/waybill/NewDraft",
            name: "draft.store",
          },
          {
            title: "لیست حواله‌ها",
            link: "/waybill/Draft",
            name: "draft.index",
          },
          {
            title: "ثبت بارنامه جدید",
            link: "/waybill/newWaybill",
            name: "waybill.store",
          },
          {
            title: "لیست بارنامه‌ها",
            link: "/waybill",
            name: "waybill.index",
          },
        ],
      },
    ],
  },
  {
    title: "ناوگان",
    name: "fleet",
    icon: "car-bus",
    childrenLinks: [
      {
        title: "لیست شرکت حمل و نقل",
        link: "/shippingCompany",
        name: "shipping-company.index",
      },
      {
        title: "گروه ناوگان",
        link: "/fleet/group",
        name: "fleet-group.index",
      },
      {
        title: "لیست ناوگان",
        link: "/fleet",
        name: "fleet.index",
      },
      {
        title: "ناوگان جدید",
        link: "/fleet/new",
        name: "fleet.store",
      },
      {
        title: "لیست ناوگان آزاد",
        link: "/fleet/free",
        name: "fleet.index",
      },
      {
        title: "خودرو",
        childrenLinks: [
          {
            title: "لیست خودرو",
            link: "/vehicle",
            name: "vehicle.index",
          },
          {
            title: "نوع کامیون",
            link: "/vehicle/category",
            name: "vehicle-category.index",
          },
          {
            title: "برند",
            link: "/vehicle/brand",
            name: "vehicle-brand.index",
          },
          {
            title: "نوع بارگیر",
            link: "/vehicle/type",
            name: "vehicle-type.index",
          },
          {
            title: "مدل خودرو",
            link: "/vehicle/model",
            name: "vehicle-model.index",
          },
          {
            title: "سوخت‌گیری",
            link: "/vehicle/refueling",
            name: "refueling.index",
          },
        ],
      },
    ],
  },
  {
    title: "محصولات",
    name: "product",
    icon: "box",
    childrenLinks: [
      {
        title: "لیست محصولات",
        link: "/product",
        name: "product.index",
      },
      {
        title: "دسته‌بندی",
        link: "/product/group",
        name: "product-group.index",
      },
      {
        title: "واحد شمارشی",
        link: "/product/unit",
        name: "product-unit.index",
      },
    ],
  },
  {
    title: "افراد",
    name: "users",
    icon: "users",
    childrenLinks: [
      {
        title: "لیست رانندگان",
        link: "/driver",
        name: "driver.index",
      },
      {
        title: "ثبت راننده جدید",
        link: "/driver/new",
        name: "driver.store",
      },
      {
        title: "لیست صاحبان‌بار",
        link: "/customer",
        name: "customer.index",
      },
      {
        title: "ثبت صاحب‌بار جدید",
        link: "/customer/new",
        name: "customer.store",
      },
      {
        title: "ثبت فرستنده و گیرنده جدید",
        link: "/person/new",
        name: "person.store",
      },
      {
        title: "لیست فرستندگان و گیرندگان",
        link: "/person",
        name: "person.index",
      },
      {
        title: "کاربران",
        childrenLinks: [
          {
            title: "لیست کاربران",
            link: "/user",
            name: "user.index",
          },
          {
            title: "لیست نقش‌ها",
            link: "/role",
            name: "role.index",
          },
        ],
      },
    ],
  },
  {
    title: "سوپر اپ",
    icon: "mobile",
    link: "/super-app",
    name: "group.index",
  },
  {
    title: "رویداد‌ها",
    icon: "file-lines",
    link: "/event",
    name: "event.index",
  },
  {
    title: "تنظیمات",
    icon: "gear",
    link: "/settings",
    name: "setting.index",
  },
];

const PanelLayout = () => {
  const { user } = useContext(AppContext);

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
        <Header
          toggleShowDrawer={toggleShowDrawer}
          showDrawer={showDrawer}
          userData={user}
        />
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

// header

const Header = ({ toggleShowDrawer, showDrawer, userData }) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { appTheme, toggleTheme, setUser, setPermissions } =
    useContext(AppContext);
  const location = useLocation();

  const toggleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setIsProfileMenuOpen((prev) => !prev);
  };

  const canBeOpen = true && Boolean(anchorEl);

  const id = canBeOpen ? "transition-popper" : undefined;

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    localStorage.removeItem("not_permitted");
    setUser(null);
    setPermissions([]);
    queryClient.clear();
    navigate("/login");
  };
  const BoxHeader = (props) => {
    return (
      <Box
        sx={{
          bgcolor: "secondary.800",
          p: 1,
          display: "flex",
          borderRadius: 2,
          cursor: "pointer",
          color: "secondary.100",
          ...props.sx,
        }}
        {...props}
      >
        {props.children}
      </Box>
    );
  };

  return (
    <Card
      sx={{
        boxShadow: 2,
        px: 1,
        bgcolor: "secondary.900",
        p: 3,
        borderRadius: 0,
        color: "white",
        minHeight: 150,
      }}
      elevation={0}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        flexWrap="wrap"
        sx={{
          width: "100%",
          height: HEADER_HEIGHT,
        }}
        px={1}
      >
        <Stack direction={"row"} alignItems={"center"}>
          <Typography variant="h6">{PAGE_TITLES[location.pathname]}</Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={1}
        >
          {isTablet && (
            <BoxHeader onClick={toggleShowDrawer}>
              <SvgSPrite color="inherit" icon="bars" />
            </BoxHeader>
          )}

          <BoxHeader onClick={() => toggleTheme()}>
            {appTheme === "dark" ? (
              <SvgSPrite color="inherit" icon="sun-bright" />
            ) : (
              <SvgSPrite color="inherit" icon="moon" />
            )}
          </BoxHeader>

          <Box onClick={toggleProfileMenu}>
            <BoxHeader>
              <SvgSPrite color="inherit" icon="user" />
            </BoxHeader>
          </Box>

          <Popper
            id={id}
            open={isProfileMenuOpen}
            anchorEl={anchorEl}
            placement="bottom-end"
            transition
            sx={{
              zIndex: 100,
            }}
          >
            {({ TransitionProps }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: "center top",
                }}
              >
                <Card
                  sx={{
                    boxShadow: 1,
                    mt: 1,
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
                      {userData.name}
                    </Typography>
                    <Typography variant="caption">
                      {userData.roles?.[0]?.slug ?? "نامشخص"}
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
                        <SvgSPrite color="inherit" icon="user" size="small" />
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
                        <SvgSPrite
                          color="inherit"
                          icon="arrow-right-from-bracket"
                          size="small"
                        />

                        <Typography ml={1} variant="subtitle2">
                          خروج
                        </Typography>
                      </Stack>
                    </MenuItem>
                  </Box>
                </Card>
              </Grow>
            )}
          </Popper>
        </Stack>
      </Stack>
    </Card>
  );
};

const commonStyle = {
  borderRadius: 4,
  height: 45,
  width: 45,
  display: "flex",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.3s",
};

let COLOR = "primary.main";
// Drawer
const Drawer = ({ showDrawer }) => {
  const { appTheme, user } = useContext(AppContext);
  const theme = useTheme();
  const menu = useMemo(
    () => FilterArrayOfRoutes(deepCopy(DRAWER_MENU_ITEMS)),
    [user]
  );
  COLOR = useMemo(
    () => (theme.palette.mode === "dark" ? "primary.main" : "secondary.main"),
    [theme.palette.mode]
  );

  const renderItems = () => {
    return menu?.map((item, index) => {
      if (!item) {
        return;
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
        minHeight: "100vh",
        transition: DRAWER_TRANSITION,
        position: "fixed",
        boxShadow: 1,
        borderRadius: "0",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        zIndex: (theme) => theme.zIndex.drawer,
      }}
    >
      <Box sx={{ p: 2 }}>
        <img
          style={{
            width: "100%",
            height: "100%",
          }}
          src={require(`Assets/images/${process.env.REACT_APP_VERSION_CODE}/truck_text_${
            appTheme === "dark" ? "light" : "dark"
          }.png`)}
          alt="logo"
          loading="eager"
        />
      </Box>

      <Stack justifyContent="space-between" flexGrow={1}>
        <Stack p={2} spacing={2} justifyContent="center" alignItems="center">
          {renderItems()}
        </Stack>
        <Stack p={2} spacing={2} justifyContent="center" alignItems="center">
          <ProfileMenuItem />
        </Stack>
      </Stack>
    </Paper>
  );
};

const ProfileMenuItem = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setUser, setPermissions, user } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    localStorage.removeItem("not_permitted");
    setUser(null);
    setPermissions([]);
    queryClient.clear();
    navigate("/login");
  };

  const toggleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Box onClick={toggleProfileMenu}>
        <MenuItemBox item={{ icon: "user" }} />
      </Box>

      {/* popover */}
      <Popover
        id={!!anchorEl ? "simple-popover" : undefined}
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
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
              {user.roles?.[0]?.slug ?? "نامشخص"}
            </Typography>
          </Stack>

          <Divider sx={{ my: 1 }} />

          <Link onClick={handleClose} to="/profile">
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
    </>
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
        <MenuItemBox item={item} />
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
                              icon="chevron-down"
                              size="10px"
                            />
                          ) : (
                            <SvgSPrite
                              color="inherit"
                              icon="chevron-left"
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

const MenuItemBox = ({ item }) => {
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
            }
          : {
              ...commonStyle,
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "background.default"
                  : "grey.300",
              color: "grey.700",
              ":hover": {
                color: COLOR,
              },
            }
      }
    >
      <SvgSPrite icon={item.icon} color="inherit" />
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
