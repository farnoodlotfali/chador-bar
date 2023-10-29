import { useContext, useEffect, useMemo, useState } from "react";
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
  IconButton,
  Typography,
  Button,
  Stack,
  Avatar,
  Popper,
  Grow,
  Collapse,
  Card,
  MenuItem,
  Paper,
  Divider,
  Badge,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useQueryClient } from "@tanstack/react-query";

import { AppContext } from "context/appContext";
import { SvgSPrite } from "Components/SvgSPrite";
import { deepCopy } from "Utility/utils";
import { PAGE_TITLES } from "Constants";

const HEADER_HEIGHT = 60;
const DRAWER_WIDTH = 250;
const DRAWER_TRANSITION = "width 0.3s ease-in-out, left 0.3s ease-in-out";
//  links
const DRAWER_MENU_ITEMS = [
  {
    id: 0,
    text: "میزکار",
    icon: "objects-column",
    routeName: "/desktop",
    name: "desktop",
  },
  {
    id: 2,
    text: "بارنامه ها",
    icon: "receipt",
    routeName: "null",
    childrenLinks: [
      {
        text: "ثبت حواله",
        icon: null,
        routeName: "/waybill/NewDraft",
        name: "draft.store",
      },
      {
        text: "لیست حواله",
        icon: null,
        routeName: "/waybill/Draft",
        name: "draft.index",
      },
      {
        text: "ثبت بارنامه",
        icon: null,
        routeName: "/waybill/newWaybill",
        name: "waybill.store",
      },
      {
        text: "لیست بارنامه",
        icon: null,
        routeName: "/waybill",
        name: "waybill.index",
      },
    ],
  },
  {
    id: 10,
    text: "قرارداد ها",
    routeName: null,
    icon: "handshake",
    childrenLinks: [
      {
        text: "قرارداد جدید",
        icon: null,
        routeName: "/contract/new",
        name: "contract.store",
      },
      {
        text: "لیست",
        icon: null,
        routeName: "/contract",
        name: "contract.index",
      },
    ],
  },
  {
    id: 311,
    text: "پروژه‌ها",
    routeName: null,
    icon: "briefcase-blank",
    childrenLinks: [
      {
        text: "ثبت پروژه",
        icon: null,
        routeName: "/project/new",
        name: "project.store",
      },
      {
        text: "لیست پروژه",
        icon: null,
        routeName: "/project",
        name: "project.index",
      },
    ],
  },
  {
    id: 56,
    text: "برنامه‌ریزی حمل",
    routeName: null,
    icon: "handshake-angle",
    childrenLinks: [
      {
        text: "درخواست حمل جدید",
        icon: null,
        routeName: "/request/new",
        name: "request.store",
      },
      {
        text: "درخواست‌های حمل",
        icon: null,
        routeName: "/request",
        name: "request.index",
      },
      {
        text: "برنامه‌ریزی پروژه",
        icon: null,
        routeName: "/project/shipping-plan-new",
        name: "request.store",
      },
      {
        text: "لیست سالن بار",
        icon: null,
        routeName: "/request/salon",
        name: "salon.store",
      },
      {
        text: "تخصیص ناوگان",
        icon: null,
        routeName: "/request/fleet-allocation",
        name: "fleet.allocation",
      },
      {
        text: "ثبت آهنگ پروژه",
        icon: null,
        routeName: "/request/new-tune",
        name: "project-plan.store",
      },
      {
        text: "آهنگ های پروژه",
        icon: null,
        routeName: "/request/tune",
        name: "project-plan.index",
      },
    ],
  },
  {
    id: 11,
    text: "ناوگان",
    routeName: null,
    icon: "car-bus",
    childrenLinks: [
      {
        text: " شرکت حمل و نقل",
        icon: null,
        routeName: "/shippingCompany",
        name: "shipping-company.index",
      },
      {
        text: "گروه ناوگان",
        icon: null,
        routeName: "/fleet/group",
        name: "fleet-group.index",
      },
      {
        text: "ناوگان",
        icon: null,
        routeName: "/fleet",
        name: "fleet.index",
      },
      {
        text: "ناوگان جدید",
        icon: null,
        routeName: "/fleet/new",
        name: "fleet.store",
      },
      {
        text: "ذی‌نفعان",
        icon: null,
        routeName: "/beneficiary",
        name: "beneficiary.index",
      },
      {
        text: "گزارش ناوگان آزاد",
        icon: null,
        routeName: "/fleet/free",
        name: "fleet.index",
      },
    ],
  },
  {
    id: 5,
    text: "خودروها",
    routeName: null,
    icon: "cars",
    childrenLinks: [
      {
        text: "لیست خودروها",
        icon: null,
        routeName: "/vehicle",
        name: "vehicle.index",
      },
      {
        text: "نوع کامیون",
        icon: null,
        routeName: "/vehicle/category",
        name: "vehicle-category.index",
      },
      {
        text: "برند (مارک) ",
        icon: null,
        routeName: "/vehicle/brand",
        name: "vehicle-brand.index",
      },
      {
        text: "نوع بارگیر",
        icon: null,
        routeName: "/vehicle/type",
        name: "vehicle-type.index",
      },
      {
        text: "مدل",
        icon: null,
        routeName: "/vehicle/model",
        name: "vehicle-model.index",
      },
      {
        text: "سوخت گیری",
        icon: null,
        routeName: "/vehicle/refueling",
        name: "refueling.index",
      },
    ],
  },
  {
    id: 105,
    text: " محصولات",
    routeName: null,
    icon: "box",
    childrenLinks: [
      {
        text: "لیست محصولات",
        icon: null,
        routeName: "/product",
        name: "product.index",
      },
      {
        text: "دسته‌بندی ",
        icon: null,
        routeName: "/product/group",
        name: "product-group.index",
      },
      {
        text: "واحد شمارشی",
        icon: null,
        routeName: "/product/unit",
        name: "product-unit.index",
      },
    ],
  },
  {
    id: 42,
    text: "افراد",
    routeName: null,
    icon: "users",
    childrenLinks: [
      {
        text: "لیست رانندگان",
        icon: null,
        routeName: "/driver",
        name: "driver.index",
      },
      {
        text: "راننده جدید",
        icon: null,
        routeName: "/driver/new",
        name: "driver.store",
      },
      {
        text: "لیست صاحبان بار",
        icon: null,
        routeName: "/customer",
        name: "customer.index",
      },
      {
        text: "صاحب‌بار جدید",
        icon: null,
        routeName: "/customer/new",
        name: "customer.store",
      },
      {
        text: "ثبت فرستنده و گیرنده",
        icon: null,
        routeName: "/person/new",
        name: "person.store",
      },
      {
        text: "فرستندگان و گیرندگان",
        icon: null,
        routeName: "/person",
        name: "person.index",
      },
    ],
  },
  {
    id: 6,
    text: "کاربران",
    routeName: null,
    icon: "user-group",
    childrenLinks: [
      {
        text: "لیست",
        icon: null,
        routeName: "/user",
        name: "user.index",
      },
      {
        text: "نقش ها",
        icon: null,
        routeName: "/role",
        name: "role.index",
      },
    ],
  },
  {
    id: 7,
    text: "مدیریت سوپر اپ",
    routeName: null,
    icon: "mobile",
    childrenLinks: [
      {
        text: "اضافه کردن گروه",
        icon: null,
        routeName: "/super-app",
        name: "group.index",
      },
    ],
  },
  {
    id: 8,
    text: "رویداد ها",
    icon: "calendar-check",
    routeName: "/event",
    name: "event.index",
  },
  {
    id: 118,
    text: "قیمت ها",
    icon: "circle-dollar",
    routeName: "/prices",
    name: "price",
  },
  {
    id: 128,
    text: "تنظیمات",
    icon: "gear",
    routeName: "/settings",
    name: "setting.index",
  },
];

const PanelLayout = () => {
  const { user } = useContext(AppContext);

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
          // overflow: "hidden",
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
          <Header
            toggleShowDrawer={toggleShowDrawer}
            showDrawer={showDrawer}
            userData={user}
          />

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

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: "-1px",
      left: "-1px",
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2)",
      opacity: 0,
    },
  },
}));

// header
const Header = ({ toggleShowDrawer, showDrawer, userData }) => {
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
            {PAGE_TITLES[location.pathname]}
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

          <Button onClick={toggleProfileMenu} color="secondary">
            <StyledBadge
              overlap="circular"
              variant="dot"
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Avatar alt="" sx={{ width: "40px", height: "40px" }} />
            </StyledBadge>
          </Button>

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
// Drawer
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
          src={require(`Assets/images/${process.env.REACT_APP_VERSION_CODE}/truck_text_${
            appTheme === "dark" ? "light" : "dark"
          }.png`)}
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
