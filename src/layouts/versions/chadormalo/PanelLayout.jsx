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
import { deepCopy } from "Utility/utils";
import { PAGE_TITLES } from "Constants";
const HEADER_HEIGHT = 60;
const DRAWER_WIDTH = 250;
const MIN_DRAWER_WIDTH = 100;
const TOTAL_DRAWER_WIDTH = DRAWER_WIDTH + MIN_DRAWER_WIDTH;
const DRAWER_TRANSITION = "width 0.3s ease-in-out, left 0.3s ease-in-out";

// middle links
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
];
// copy middle links
let NEW_DRAWER_MENU_ITEMS;

// bottom links
const DRAWER_BOTTOM_MENU_ITEMS = [
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
  const [showDrawer, setShowDrawer] = useState(true);
  NEW_DRAWER_MENU_ITEMS = useMemo(
    () => FilterArrayOfRoutes(deepCopy(DRAWER_MENU_ITEMS)),
    [user]
  );
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
  let urls = "";

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

              {location.pathname
                .split("/")
                .filter((item) => Boolean(item))
                .map((item) => {
                  urls += "/" + item;

                  return (
                    <Fragment>
                      <Typography>/</Typography>
                      <Link to={`${urls}`}>
                        <Typography typography="body2" color="text.primary">
                          {PAGE_TITLES[urls]}
                        </Typography>
                      </Link>
                    </Fragment>
                  );
                })}
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
    findActiveUrl(pathname) ?? NEW_DRAWER_MENU_ITEMS[0]
  );
  const { setUser, user, setPermissions } = useContext(AppContext);

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
              width: 45,
              height: 45,
            }}
          >
            <Link to="/desktop">
              <AdminLogo fill={"white"} />
            </Link>
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
