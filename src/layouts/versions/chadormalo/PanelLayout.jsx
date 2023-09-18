import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
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

import { useQueryClient } from "@tanstack/react-query";

import { SvgSPrite } from "Components/SvgSPrite";
import AdminLogo from "Components/AdminLogo";
import BoxIconAction from "Components/BoxIconAction";
import { AppContext } from "context/appContext";
const HEADER_HEIGHT = 60;
const DRAWER_WIDTH = 250;
const MIN_DRAWER_WIDTH = 100;
const TOTAL_DRAWER_WIDTH = DRAWER_WIDTH + MIN_DRAWER_WIDTH;
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

          bgcolor: "background.default",
        }}
      >
        <Drawer
          showDrawer={showDrawer}
          menu={[]}
          toggleShowDrawer={toggleShowDrawer}
        />
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
          <Header
            toggleShowDrawer={toggleShowDrawer}
            showDrawer={showDrawer}
            userData={user}
          />

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

// header
const Header = ({ toggleShowDrawer, showDrawer }) => {
  const { appTheme, toggleTheme } = useContext(AppContext);
  const location = useLocation();

  return (
    <Card
      sx={{
        p: 2,
        position: "-webkit-sticky",
        position: "sticky",
        top: 0,
        zIndex: 501,
        borderRadius: 0,
        width: "100%",
        bgcolor: "background.default",
      }}
      elevation={0}
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
          <Box>
            <Typography variant="h5" component="h1" fontWeight={700}>
              {PAGE_TITLES[location.pathname]}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              color="grey.600"
              mt={1}
              alignItems="center"
            >
              <Link to="/">
                <Typography
                  sx={{
                    typography: "body2",
                    ":hover": {
                      color: "text.primary",
                      textDecoration: "underline",
                    },
                  }}
                >
                  خانه
                </Typography>
              </Link>
              <Typography>/</Typography>
              <Link to="/">
                <Typography typography="body2" color="text.primary">
                  {PAGE_TITLES[location.pathname]}
                </Typography>
              </Link>
            </Stack>
          </Box>
        </Stack>

        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={2}
        >
          <BoxIconAction
            icon={appTheme === "dark" ? "sun-bright" : "moon-stars"}
            onClick={toggleTheme}
            type="primary"
          />
          <BoxIconAction icon={"bars"} onClick={toggleShowDrawer} />
        </Stack>
      </Stack>
    </Card>
  );
};

const DRAWER_MENU_ITEMS = [
  {
    title: "قرارداد",
    name: "contract",
    icon: "handshake",
    childrenLinks: [
      {
        title: "لیست قرارداد",
        link: "/contract",
      },
      {
        title: "قرارداد جدید",
        link: "/contract/new",
      },
      {
        title: "پروژه",
        children: [
          {
            title: "لیست پروژه",
            link: "/project",
          },
          {
            title: "پروژه جدید",
            link: "/project/new",
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
      },
      {
        title: "لیست برنامه‌ریزی حمل",
        link: "/request",
      },
      {
        title: "برنامه‌ریزی پروژه",
        link: "/project/shipping-plan-new",
      },
      {
        title: "لیست سالن بار",
        link: "/request/salon",
      },
      {
        title: "تخصیص ناوگان",
        link: "/request/fleet-allocation",
      },
      {
        title: "ثبت آهنگ پروژه",
        link: "/request/new-tune",
      },
      {
        title: "آهنگ‌های پروژه",
        link: "/request/tune",
      },
      {
        title: "بارنامه و حواله‌",
        children: [
          {
            title: "ثبت حواله جدید",
            link: "/waybill/NewDraft",
          },
          {
            title: "لیست حواله‌ها",
            link: "/waybill/Draft",
          },
          {
            title: "ثبت بارنامه جدید",
            link: "/waybill/newWaybill",
          },
          {
            title: "لیست بارنامه‌ها",
            link: "/waybill",
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
      },
      {
        title: "گروه ناوگان",
        link: "/fleet/group",
      },
      {
        title: "لیست ناوگان",
        link: "/fleet",
      },
      {
        title: "ناوگان جدید",
        link: "/fleet/new",
      },
      {
        title: "لیست ناوگان آزاد",
        link: "/fleet/free",
      },
      {
        title: "خودرو",
        children: [
          {
            title: "لیست خودرو",
            link: "/vehicle",
          },
          {
            title: "نوع کامیون",
            link: "/vehicle/category",
          },
          {
            title: "برند",
            link: "/vehicle/brand",
          },
          {
            title: "نوع بارگیر",
            link: "/vehicle/type",
          },
          {
            title: "مدل خودرو",
            link: "/vehicle/model",
          },
          {
            title: "سوخت‌گیری",
            link: "/vehicle/refueling",
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
      },
      {
        title: "دسته‌بندی",
        link: "/product/group",
      },
      {
        title: "واحد شمارشی",
        link: "/product/unit",
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
      },
      {
        title: "ثبت راننده جدید",
        link: "/driver/new",
      },
      {
        title: "لیست صاحبان‌یار",
        link: "/customer",
      },
      {
        title: "ثبت صاحب بار جدید",
        link: "/customer/new",
      },
      {
        title: "ثبت فرستنده و گیرنده جدید",
        link: "/person/new",
      },
      {
        title: "لیست فرستندگان و گیرندگان",
        link: "/person",
      },
      {
        title: "کاربران",
        children: [
          {
            title: "لیست کاربران",
            link: "/user",
          },
          {
            title: "لیست نقش‌ها",
            link: "/role",
          },
        ],
      },
    ],
  },
];
// Drawer
const Drawer = ({ showDrawer, toggleShowDrawer }) => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const matches = useMediaQuery("(max-width:400px)", { noSsr: true });
  const isTablet = useMediaQuery(theme.breakpoints.up("md"));

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [slideIn, setSlideIn] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(
    findActiveUrl(pathname) ?? DRAWER_MENU_ITEMS[0]
  );
  const { setUser, user } = useContext(AppContext);

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
      setSelectedMenu(DRAWER_MENU_ITEMS.find((item) => item.name === val));
      setSlideIn(true);
    }, 350);
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
          bgcolor: "primary.main",
          display: "flex",
          flexDirection: "column",
          alignItems: { lg: "center" },
          minWidth: matches ? "auto" : MIN_DRAWER_WIDTH,
          width: matches ? "auto" : MIN_DRAWER_WIDTH,
          p: matches ? 1 : 2,
        }}
      >
        <Stack
          height={"100%"}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Box
            sx={{
              width: 45,
              height: 45,
            }}
          >
            <Link to="/desktop">
              <AdminLogo fill={"white"} />
            </Link>
          </Box>

          <Stack
            spacing={1}
            sx={{
              overflowY: "auto",
            }}
          >
            {DRAWER_MENU_ITEMS.map((item) => {
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
            {[
              {
                title: "سوپر اپ",
                icon: "mobile",
                link: "/superApp",
              },
              {
                title: "رویداد‌ها",
                icon: "file-lines",
                link: "/event",
              },
              {
                title: "تنظیمات",
                icon: "gear",
                link: "/settings",
              },
              {
                title: "پروفایل",
                icon: "user",
                onClick: toggleProfileMenu,
              },
            ].map((item, i) => {
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
                  component={"div"}
                  title={item.title}
                  onClick={(e) => {
                    if (item?.link) {
                      navigate(item?.link);
                    } else item.onClick(e);
                  }}
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
                    {user.roles?.[0]?.slug ?? "نامشخص"}
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
          overflow: "hidden",
          bgcolor: "secondary.main",
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
              if (item.link) {
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

const RenderItems = ({ title, children }) => {
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
          {children.map((item) => {
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
    } else if (li?.children) {
      li.children.forEach((item) => {
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
  outerLoop: for (const url of DRAWER_MENU_ITEMS) {
    for (const li of url?.childrenLinks || []) {
      if (li?.link && pathname === li?.link) {
        activeLink = url;
        break outerLoop;
      } else if (li?.children) {
        for (const item of li.children) {
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
  "/request/tune": "لیست آهنگ پروژه‌ها",
  "/request/new-tune": "ثبت آهنگ پروژه",
  "/request/new": "ثبت درخواست حمل",
  "/request": "لیست درخواست حمل",
  "/project/shipping-plan-new": "برنامه‌ریزی پروژه",
  "/shippingCompany": "لیست شرکت حمل و نقل",
  "/fleet": "لیست ناوگان",
  "/fleet/free": "لیست ناوگان آزاد",
  "/fleet/new": "ثبت ناوگان پروژه",
  "/beneficiary": "ذی‌نفعان",
  "/request/fleet-allocation": "تخصیص ناوگان",
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
  "/settings": "تنظیمات",
  "/request/salon": "لیست سالن بار",
  "/fleet/group": "گروه ناوگان",
};
