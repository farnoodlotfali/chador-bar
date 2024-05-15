import {
  Avatar,
  Button,
  Card,
  Divider,
  Grow,
  MenuItem,
  Popper,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import { StyledBadge } from "Components/StyledBadge";
import { SvgSPrite } from "Components/SvgSPrite";
import { AppContext } from "context/appContext";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ProfilePopper = () => {
  const navigate = useNavigate();
  const { logoutUser, user, userType, role } = useContext(AppContext);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setIsProfileMenuOpen((prev) => !prev);
  };

  const canBeOpen = true && Boolean(anchorEl);

  const id = canBeOpen ? "transition-popper" : undefined;

  const logout = () => {
    logoutUser();
    navigate("/login");
  };
  return (
    <>
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

      {/* Popper */}
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
    </>
  );
};

export default ProfilePopper;
