import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Card,
  MenuItem,
  Divider,
  Popover,
} from "@mui/material";

import { AppContext } from "context/appContext";
import { SvgSPrite } from "Components/SvgSPrite";

import MenuItemBox from "./MenuItemBox";

const ProfilePopover = () => {
  const navigate = useNavigate();
  const { logoutUser, user, userType, role } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const logout = () => {
    logoutUser();
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
        <MenuItemBox
          item={{ icon: "user" }}
          size="small"
          sx={{ width: 32, height: 32, bgcolor: "none" }}
        />
      </Box>

      {/* Popover */}
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
              {!!userType && !!role ? role + " | " + userType : "نامشخص"}
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

export default ProfilePopover;
