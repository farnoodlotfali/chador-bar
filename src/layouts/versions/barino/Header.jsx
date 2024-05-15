import { useContext, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Typography,
  Stack,
  Card,
  useMediaQuery,
  Box,
  MenuItem,
  Divider,
  Popover,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { AppContext } from "context/appContext";
import { SvgSPrite } from "Components/SvgSPrite";
import { PAGE_TITLES } from "Constants";
import MessagesPopover from "./MessagesPopover";
import BoxHeader from "./BoxHeader";
import { HEADER_HEIGHT } from "./vars";
import { enToFaNumber, numberWithCommas, pathnameParam } from "Utility/utils";
import { useQuery } from "@tanstack/react-query";
import { axiosApi } from "api/axiosApi";

const Header = ({ toggleShowDrawer }) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const params = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
  const canBeOpen = true && Boolean(anchorEl);
  const id = canBeOpen ? "simple-popover" : undefined;
  const { appTheme, toggleTheme, user } = useContext(AppContext);
  const location = useLocation();
  console.log("user", user);
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
        flexWrap="wrap"
        sx={{
          width: "100%",
          height: HEADER_HEIGHT,
        }}
        px={1}
      >
        <Stack direction={"row"} alignItems={"center"}>
          <Typography variant="h6">
            {PAGE_TITLES[location.pathname] ||
              PAGE_TITLES[pathnameParam(params, location)]}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={1}
        >
          {wallet?.hasError === false && (
            <BoxHeader onClick={toggleWalletMenu} wallet>
              <Stack direction={"row"} alignItems="center">
                <Typography fontSize={20}>
                  {enToFaNumber(numberWithCommas(wallet?.result?.amount))}
                </Typography>
                <Typography fontSize={10} mr={"7px"}>
                  {wallet?.result?.currencySrv?.name}
                </Typography>

                <SvgSPrite color="inherit" icon={"wallet"} />
              </Stack>
            </BoxHeader>
          )}
          {isTablet && (
            <BoxHeader onClick={toggleShowDrawer}>
              <SvgSPrite color="inherit" icon="bars" />
            </BoxHeader>
          )}

          <MessagesPopover />

          <BoxHeader onClick={() => toggleTheme()}>
            {appTheme === "dark" ? (
              <SvgSPrite color="inherit" icon="sun-bright" />
            ) : (
              <SvgSPrite color="inherit" icon="moon" />
            )}
          </BoxHeader>
        </Stack>
      </Stack>
    </Card>
  );
};

export default Header;
