import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
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

const HEADER_HEIGHT = 60;
const DRAWER_WIDTH = 250;
const DRAWER_TRANSITION = "width 0.3s ease-in-out, left 0.3s ease-in-out";

const PanelLayout = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  useEffect(() => {
    if (!Cookies.get("token")) {
      navigate("/login");
    }
  }, []);

  const [showDrawer, setShowDrawer] = useState(true);

  const toggleShowDrawer = () => setShowDrawer((prev) => !prev);

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
        <Drawer
          showDrawer={showDrawer}
          menu={[
            {
              id: 0,
              text: "میزکار",
              icon: "objects-column",
              routeName: "/desktop",
            },
            {
              id: 35,
              text: "عملیات",
              icon: "hand-pointer",
              routeName: "null",
              children: [
                {
                  text: "لیست حواله",
                  icon: null,
                  routeName: "/waybill/Draft",
                },
                {
                  text: "لیست بارنامه",
                  icon: null,
                  routeName: "/waybill",
                },
                {
                  text: "درخواست حمل جدید",
                  icon: null,
                  routeName: "/request/new",
                },
              ],
            },
            {
              id: 2,
              text: "بارنامه ها",
              icon: "receipt",
              routeName: "null",
              children: [
                {
                  text: "ثبت حواله",
                  icon: null,
                  routeName: "/waybill/NewDraft",
                },
                {
                  text: "لیست حواله",
                  icon: null,
                  routeName: "/waybill/Draft",
                },

                {
                  text: "ثبت بارنامه",
                  icon: null,
                  routeName: "/waybill/newWaybill",
                },
                {
                  text: "لیست بارنامه",
                  icon: null,
                  routeName: "/waybill",
                },
              ],
            },
            {
              id: 10,
              text: "قرارداد ها",
              routeName: null,
              icon: "handshake",
              children: [
                {
                  text: "قرارداد جدید",
                  icon: null,
                  routeName: "/contract/new",
                },
                {
                  text: "لیست",
                  icon: null,
                  routeName: "/contract",
                },
              ],
            },
            {
              id: 311,
              text: "پروژه‌ها",
              routeName: null,
              icon: "briefcase-blank",
              children: [
                {
                  text: "ثبت پروژه",
                  icon: null,
                  routeName: "/project/new",
                },
                {
                  text: "لیست پروژه",
                  icon: null,
                  routeName: "/project",
                },
              ],
            },
            {
              id: 56,
              text: "برنامه‌ریزی حمل",
              routeName: null,
              icon: "handshake-angle",
              children: [
                {
                  text: "درخواست حمل جدید",
                  icon: null,
                  routeName: "/request/new",
                },
                {
                  text: "درخواست‌های حمل",
                  icon: null,
                  routeName: "/request",
                },
                {
                  text: "برنامه‌ریزی پروژه",
                  icon: null,
                  routeName: "/project/shipping-plan-new",
                },
                {
                  text: "لیست سالن بار",
                  icon: null,
                  routeName: "/request/salon",
                },
                {
                  text: "تخصیص ناوگان",
                  icon: null,
                  routeName: "/request/fleet-allocation",
                },
                {
                  text: "ثبت آهنگ پروژه",
                  icon: null,
                  routeName: "/request/new-tune",
                },
                {
                  text: "آهنگ های پروژه",
                  icon: null,
                  routeName: "/request/tune",
                },
              ],
            },
            {
              id: 11,
              text: "ناوگان",
              routeName: null,
              icon: "car-bus",
              children: [
                {
                  text: " شرکت حمل و نقل",
                  icon: null,
                  routeName: "/shippingCompany",
                },
                {
                  text: "گروه ناوگان",
                  icon: null,
                  routeName: "/fleet/group",
                },
                {
                  text: "ناوگان",
                  icon: null,
                  routeName: "/fleet",
                },
                {
                  text: "ناوگان جدید",
                  icon: null,
                  routeName: "/fleet/new",
                },
                {
                  text: "ذی‌نفعان",
                  icon: null,
                  routeName: "/beneficiary",
                },
                {
                  text: "گزارش ناوگان آزاد",
                  icon: null,
                  routeName: "/fleet/free",
                },
              ],
            },
            {
              id: 5,
              text: "خودروها",
              routeName: null,
              icon: "cars",
              children: [
                {
                  text: "لیست خودروها",
                  icon: null,
                  routeName: "/vehicle",
                },
                {
                  text: "نوع کامیون",
                  icon: null,
                  routeName: "/vehicle/category",
                },
                {
                  text: "برند (مارک) ",
                  icon: null,
                  routeName: "/vehicle/brand",
                },
                {
                  text: "نوع بارگیر",
                  icon: null,
                  routeName: "/vehicle/type",
                },
                {
                  text: "مدل",
                  icon: null,
                  routeName: "/vehicle/model",
                },
                // {
                //   text: "شماتیک",
                //   icon: null,
                //   routeName: "/vehicle/schematic",
                // },
                // {
                //   text: "عکس خودرو",
                //   icon: null,
                //   routeName: "/vehicle/photo",
                // },
                {
                  text: "سوخت گیری",
                  icon: null,
                  routeName: "/vehicle/refueling",
                },
              ],
            },
            {
              id: 105,
              text: " محصولات",
              routeName: null,
              icon: "box",
              children: [
                {
                  text: "لیست محصولات",
                  icon: null,
                  routeName: "/product",
                },
                {
                  text: "دسته‌بندی ",
                  icon: null,
                  routeName: "/product/group",
                },
                {
                  text: "واحد شمارشی",
                  icon: null,
                  routeName: "/product/unit",
                },
              ],
            },
            {
              id: 42,
              text: "افراد",
              routeName: null,
              icon: "users",
              children: [
                {
                  text: "لیست رانندگان",
                  icon: null,
                  routeName: "/driver",
                },
                {
                  text: "راننده جدید",
                  icon: null,
                  routeName: "/driver/new",
                },
                {
                  text: "لیست صاحبان بار",
                  icon: null,
                  routeName: "/customer",
                },
                {
                  text: "صاحب‌بار جدید",
                  icon: null,
                  routeName: "/customer/new",
                },
                {
                  text: "ثبت فرستنده و گیرنده",
                  icon: null,
                  routeName: "/person/new",
                },
                {
                  text: "فرستندگان و گیرندگان",
                  icon: null,
                  routeName: "/person",
                },
              ],
            },
            {
              id: 6,
              text: "کاربران",
              routeName: null,
              icon: "user-group",
              children: [
                {
                  text: "لیست",
                  icon: null,
                  routeName: "/user",
                },
                {
                  text: "نقش ها",
                  icon: null,
                  routeName: "/role",
                },
              ],
            },
            {
              id: 7,
              text: "مدیریت سوپر اپ",
              routeName: null,
              icon: "mobile",
              children: [
                {
                  text: "اضافه کردن گروه",
                  icon: null,
                  routeName: "/superApp",
                },
              ],
            },
            {
              id: 8,
              text: "رویداد ها",
              icon: "calendar-check",
              routeName: "/event",
            },
            {
              id: 118,
              text: "قیمت ها",
              icon: "circle-dollar",
              routeName: "/prices",
            },
            {
              id: 128,
              text: "تنظیمات",
              icon: "gear",
              routeName: "/settings",
            },
          ]}
        />
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
  const { appTheme, toggleTheme, setUser } = useContext(AppContext);
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
    setUser(null);
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
const Drawer = ({ showDrawer, menu }) => {
  const { setDrawer, drawer, appTheme } = useContext(AppContext);
  const { pathname } = useLocation();

  const [openedItems, setOpenedItems] = useState(drawer || []);

  const handleToggleCollapse = (index) => {
    if (openedItems.includes(index)) {
      setOpenedItems((prev) => prev.filter((item) => item !== index));
    } else {
      setOpenedItems((prev) => [...prev, index]);
    }
  };

  const renderItems = () => {
    return menu.map((item, index) => {
      const isActive = pathname.startsWith(item.routeName);
      const isOpen = openedItems.includes(index);

      const button = (
        <Button
          color={appTheme === "dark" && isActive ? "primary" : "secondary"}
          variant={isActive ? "contained" : "text"}
          size="large"
          sx={{ width: "100%", px: 1 }}
          onClick={() => item.children && handleToggleCollapse(index)}
        >
          <SvgSPrite icon={item.icon} color="inherit" />
          <Typography
            variant="button"
            sx={{ flexGrow: 1, textAlign: "left", ml: 1 }}
            fontWeight={500}
          >
            {item.text}
          </Typography>
          {item.children && (
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

      return (
        <div key={item.id}>
          {!item.children ? <Link to={item.routeName}>{button}</Link> : button}

          {item.children && (
            <Collapse in={isOpen} sx={{ mt: 0 }}>
              <Stack spacing={1} mt={1}>
                {item.children?.map((child) => {
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
          src={require(`Assets/images/barestan/truck_text_${
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
const PAGE_TITLES = {
  "/desktop": "میزکار",
  "/waybill/newWaybill": "ثبت بارنامه جدید",
  "/waybill/NewDraft": "ثبت حواله جدید",
  "/waybill/Draft": "لیست حواله‌ها",
  "/waybill": "لیست بارنامه‌ها",
  "/contract": "لیست قراردادها",
  "/contract/new": "ثبت قرارداد جدید",
  "/project/new": "ثبت پروژه جدید",
  "/project": "لیست پروژه‌ها",
  "/project/tune": "لیست آهنگ پروژه‌ها",
  "/project/new-tune": "ثبت آهنگ پروژه",
  "/request/new": "ثبت درخواست حمل",
  "/request": "لیست درخواست حمل",
  "/project/shipping-plan-new": "برنامه‌ریزی پروژه",
  "/shippingCompany": "لیست شرکت حمل و نقل",
  "/fleet": "لیست ناوگان",
  "/fleet/free": "لیست ناوگان آزاد",
  "/fleet/new": "ثبت ناوگان پروژه",
  "/beneficiary": "ذی‌نفعان",
  "/project/fleet-allocation": "تخصیص ناوگان",
  "/product": "لیست محصولات",
  "/product/group": "دسته‌بندی",
  "/product/unit": "واحد شمارشی",
  "/customer": "لیست صاحبان‌یار",
  "/customer/new": "ثبت صاحب یار جدید",
  "/driver": "لیست رانندگان",
  "/driver/new": "ثبت راننده جدید",
  "/person": "لیست فرستندگان و گیرندگان",
  "/person/new": "ثبت فرستنده و گیرنده جدید",
  "/vehicle": "لیست خودرو‌ها",
  "/vehicle/category": "نوع کامیون",
  "/vehicle/brand": "برند",
  "/vehicle/type": "نوع بارگیر",
  "/vehicle/model": "مدل خودرو",
  "/vehicle/refueling": "سوخت‌گیری",
  "/user": "لیست کاربران",
  "/superApp": "مدیریت سوپر اپ",
  "/role": "لیست نقش‌ها",
  "/event": "رویداد‌ها",
  "/prices": "قیمت‌ها",
  "/settings": "تنظیمات",
};
