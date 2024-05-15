import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Card,
  MenuItem,
  Divider,
  Popover,
  BottomNavigationAction,
  BottomNavigation,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  CircularProgress,
} from "@mui/material";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { SvgSPrite } from "Components/SvgSPrite";
import { handleDate, truncateString } from "Utility/utils";

import { useMyMessage } from "hook/useMyMessage";
import ShowMessageModal from "Components/modals/ShowMessageModal";
import { axiosApi } from "api/axiosApi";
import { StyledBadge } from "Components/StyledBadge";
import BoxHeader from "./BoxHeader";

const MessagesPopover = () => {
  const queryClient = useQueryClient();

  const [anchorEl, setAnchorEl] = useState(null);
  const [seen, setSeen] = useState("unseen");
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const {
    data: unseenMsgs,
    isLoading,
    isFetching,
  } = useMyMessage(
    { seen: seen === "unseen" ? "0" : "1" },
    { enabled: !!anchorEl, staleTime: 60 * 1000 }
  );

  const userSeenMsgMutation = useMutation((id) =>
    axiosApi({ url: `/seen/${id}`, method: "post" })
  );

  const handleChange = (event, newValue) => {
    setSeen(newValue);
  };

  const toggleMessageMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShowMsgModal = (item) => {
    setSelectedMsg(item);
    if (seen === "unseen") {
      handleSeenMsg(item?.id);
    }
    setShowModal(true);
  };

  const handleSeenMsg = async (id) => {
    try {
      const res = await userSeenMsgMutation.mutateAsync(id);
      queryClient.invalidateQueries(["myMessage"]);
      return res;
    } catch (error) {
      return error;
    }
  };

  return (
    <>
      <Box onClick={toggleMessageMenu}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          variant="dot"
          sx={{
            "& .MuiBadge-badge": {
              boxShadow: 0,
            },
          }}
        >
          <BoxHeader>
            <SvgSPrite color="inherit" icon="bell" />
          </BoxHeader>
        </StyledBadge>
      </Box>

      {/* popover */}
      <Popover
        id={!!anchorEl ? "simple-popover" : undefined}
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Card
          sx={{
            boxShadow: 5,
            py: 1,
            minWidth: { md: "350px", xs: "200px" },
          }}
          elevation={5}
        >
          <Typography fontWeight={700} px={2} mb={0.5}>
            پیام‌ها
          </Typography>

          <BottomNavigation
            sx={{ width: "100%", pt: 1 }}
            value={seen}
            onChange={handleChange}
            showLabels
          >
            <BottomNavigationAction
              label="خوانده نشده"
              value="unseen"
              icon={<SvgSPrite icon="envelope" color="inherit" size="small" />}
            />
            <BottomNavigationAction
              label="خوانده شده"
              value="seen"
              icon={
                <SvgSPrite icon="envelope-open" color="inherit" size="small" />
              }
            />
          </BottomNavigation>

          <Divider sx={{ mb: 1 }} />

          {isLoading || isFetching ? (
            <Box sx={{ justifyContent: "center", display: "flex", py: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Stack>
              {unseenMsgs?.items.data.length !== 0 ? (
                <>
                  {unseenMsgs?.items.data.slice(0, 5).map((msg) => {
                    return (
                      <MenuItem
                        key={msg.id}
                        sx={{
                          p: 0,
                          borderBottom: "1px solid",
                          borderBottomColor: "grey.200",
                        }}
                        onClick={() => handleShowMsgModal(msg)}
                      >
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar sx={{ mt: 0, minWidth: 48 }}>
                            <Avatar
                              sx={{ width: 32, height: 32 }}
                              alt="Avatar"
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              msg.person
                                ? (msg.person?.first_name ?? "فاقد نام") +
                                  " " +
                                  (msg.person?.last_name ?? " ")
                                : "سیستم"
                            }
                            secondary={
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                              >
                                {truncateString(msg.body)}
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {handleDate(msg.timestamp, "YYYY/MM/DD") +
                                    " - " +
                                    handleDate(msg.timestamp, "HH:MM")}
                                </Typography>
                              </Stack>
                            }
                          />
                        </ListItem>
                      </MenuItem>
                    );
                  })}
                  <Link to={`/messages/my?seen=${seen === "seen"}`}>
                    <Button fullWidth>نمایش همه</Button>
                  </Link>
                </>
              ) : (
                <Typography textAlign="center" variant="caption">
                  پیام جدیدی ندارید
                </Typography>
              )}
            </Stack>
          )}
        </Card>
      </Popover>

      <ShowMessageModal
        open={showModal}
        onClose={() => setShowModal(false)}
        item={selectedMsg}
      />
    </>
  );
};

export default MessagesPopover;
