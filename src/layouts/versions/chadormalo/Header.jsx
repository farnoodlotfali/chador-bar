import { Fragment, useContext, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Card,
  MenuItem,
  Popover,
  Divider,
} from "@mui/material";

import BoxIconAction from "Components/BoxIconAction";
import { AppContext } from "context/appContext";
import { PAGE_TITLES } from "Constants";

import MessagesPopover from "./MessagesPopover";
import { HEADER_HEIGHT } from "./vars";
import { enToFaNumber, numberWithCommas, pathnameParam } from "Utility/utils";
import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";
import { SvgSPrite } from "Components/SvgSPrite";

const Header = () => {
  const { appTheme, toggleTheme, user } = useContext(AppContext);
  const location = useLocation();
  const params = useParams();
  let urls = "";
  const [anchorEl, setAnchorEl] = useState(null);
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
  const canBeOpen = true && Boolean(anchorEl);
  const id = canBeOpen ? "simple-popover" : undefined;
  const { data: wallet } = useQuery(["wallet", user?.mobile], () =>
    axiosApi({
      url: "wallet/get-balance",
      params: {
        mobile: user?.mobile,
      },
    }).then((res) => res.data.Data)
  );
  const toggleWalletMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setIsWalletMenuOpen((prev) => !prev);
  };
  return (
    <Card
      sx={{
        p: 2,
        // position: "-webkit-sticky",
        position: "sticky",
        top: 0,
        zIndex: 501,
        borderRadius: 0,
        width: "100%",
        bgcolor: "background.default",
      }}
      elevation={0}
    >
      <Popover
        id={id}
        open={isWalletMenuOpen}
        anchorEl={anchorEl}
        onClose={toggleWalletMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{ mt: 0.5 }}
      >
        <Card
          sx={{
            boxShadow: 1,
            py: 1,
            minWidth: "200px",
          }}
        >
          <Box onClick={() => {}} sx={{ mb: "2px" }}>
            <MenuItem>
              <Stack
                direction="row"
                justifyContent="flex-start"
                sx={{ minWidth: "100px" }}
              >
                <SvgSPrite icon="octagon-plus" size="small" />
                <Typography ml={1} variant="subtitle2">
                  افزایش اعتبار
                </Typography>
              </Stack>
            </MenuItem>
          </Box>

          <Box onClick={() => {}} sx={{ mb: "2px" }}>
            <MenuItem>
              <Stack
                direction="row"
                justifyContent="flex-start"
                sx={{ minWidth: "100px" }}
              >
                <SvgSPrite icon="octagon-minus" size="small" />
                <Typography ml={1} variant="subtitle2">
                  برداشت اعتبار
                </Typography>
              </Stack>
            </MenuItem>
          </Box>

          <Box onClick={() => {}} sx={{ mb: "2px" }}>
            <MenuItem>
              <Stack
                direction="row"
                justifyContent="flex-start"
                sx={{ minWidth: "100px" }}
              >
                <SvgSPrite icon="money-bill-transfer" size="small" />
                <Typography ml={1} variant="subtitle2">
                  کیف به کیف
                </Typography>
              </Stack>
            </MenuItem>
          </Box>
          <Divider />
          <Box onClick={() => {}} sx={{ mt: "2px", mb: "2px" }}>
            <MenuItem>
              <Stack
                direction="row"
                justifyContent="flex-start"
                sx={{ minWidth: "100px" }}
              >
                <SvgSPrite icon="receipt" size="small" />
                <Typography ml={1} variant="subtitle2">
                  تراکنش‌ها
                </Typography>
              </Stack>
            </MenuItem>
          </Box>

          <Box onClick={() => {}}>
            <MenuItem>
              <Stack
                direction="row"
                justifyContent="flex-start"
                sx={{ minWidth: "100px" }}
              >
                <SvgSPrite icon="gear-complex" size="small" />
                <Typography ml={1} variant="subtitle2">
                  تنظیمات کیف پول
                </Typography>
              </Stack>
            </MenuItem>
          </Box>
        </Card>
      </Popover>
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
              {PAGE_TITLES[location.pathname] ||
                PAGE_TITLES[pathnameParam(params, location)]}
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
          {wallet?.hasError === false && (
            <Stack
              direction={"row"}
              onClick={toggleWalletMenu}
              sx={{ cursor: "pointer", boxShadow: 1 }}
              alignItems="center"
              borderRadius={1}
              bgcolor={appTheme === "light" ? "white" : "background.default"}
              pl={1}
              pt={"0.8px"}
              pb={"0.8px"}
            >
              <Typography fontSize={20}>
                {enToFaNumber(numberWithCommas(wallet?.result?.amount))}
              </Typography>
              <Typography fontSize={10} ml={"2px"}>
                {wallet?.result?.currencySrv?.name}
              </Typography>
              <BoxIconAction icon={"wallet"} elevation={0} />
            </Stack>
          )}

          <BoxIconAction
            icon={appTheme === "dark" ? "sun-bright" : "moon-stars"}
            onClick={toggleTheme}
            type="primary"
          />

          <MessagesPopover />
        </Stack>
      </Stack>
    </Card>
  );
};

export default Header;
