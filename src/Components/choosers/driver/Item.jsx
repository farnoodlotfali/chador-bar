import {
  Typography,
  Stack,
  Box,
  IconButton,
  Collapse,
  Tooltip,
  Rating,
} from "@mui/material";
import { enToFaNumber, renderTimeCalender, stopPropagate } from "Utility/utils";
import { useMemo, useState } from "react";
import { SvgSPrite } from "Components/SvgSPrite";
import ShowPersonScoreModal from "Components/modals/ShowPersonScoreModal";
import DriverReportModal from "Components/modals/DriverReportModal";

const DriverItem = ({ driver, data, setData, fleet, timeLine }) => {
  const [openDriverTime, setOpenDriverTime] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const toggleShowScores = () => {
    setOpenModal("personScore");
  };
  const handleShowDriverReportModal = () => {
    setOpenModal("driverReport");
  };
  const toggleOpenModal = () => {
    setOpenModal(null);
  };

  return (
    <>
      <Box
        sx={{
          boxShadow: 1,
          cursor: "pointer",
          bgcolor: data?.id === driver.id ? "primary.main" : "background.paper",
          color: (theme) =>
            data?.id === driver.id ? theme.palette.common.white : "inherit",
          borderRadius: 1,
          p: 1,
        }}
      >
        <Box
          sx={{
            width: "100%",
            p: timeLine ? 1 : 2,
          }}
          onClick={() => {
            setData(driver);
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <Typography>
              {timeLine ? driver?.first_name : driver?.person?.first_name}{" "}
              {timeLine ? driver?.last_name : driver?.person?.last_name}
            </Typography>
            <Typography>{enToFaNumber(driver?.mobile)}</Typography>
            <Stack direction="row" spacing={1}>
              <Rating
                precision={0.2}
                value={driver?.rating}
                size="small"
                readOnly
                color="inherit"
                sx={{
                  "& .MuiSvgIcon-root": {
                    fill: (theme) =>
                      data?.id === driver.id || theme.palette.mode === "dark"
                        ? theme.palette.common.white
                        : "inherit",
                  },
                }}
              />
              <Tooltip placement="top" title="مشاهده تاریخچه امتیازات">
                <Box
                  sx={{ cursor: "pointer" }}
                  onClick={stopPropagate(toggleShowScores)}
                >
                  <SvgSPrite
                    icon="rectangle-history-circle-user"
                    color="inherit"
                    size={20}
                  />
                </Box>
              </Tooltip>
            </Stack>

            <Tooltip placement="top" title="گزارش">
              <Box
                sx={{ cursor: "pointer" }}
                onClick={stopPropagate(handleShowDriverReportModal)}
              >
                <SvgSPrite icon="memo-pad" color="inherit" size={20} />
              </Box>
            </Tooltip>
          </Stack>
        </Box>
        {timeLine && (
          <>
            <Tooltip title="مشاهده تقویم کاری راننده" placement="left" arrow>
              <IconButton
                size="small"
                onClick={() => {
                  setOpenDriverTime((prev) => !prev);
                }}
                sx={{
                  color: (theme) =>
                    data?.id === driver.id
                      ? theme.palette.common.white
                      : "grey",
                }}
              >
                {openDriverTime ? (
                  <SvgSPrite icon="chevron-up" size="small" />
                ) : (
                  <SvgSPrite icon="chevron-down" size="small" />
                )}
              </IconButton>
            </Tooltip>

            <DriverTimeMonth
              key={driver.id}
              selected={data?.id === driver.id}
              row={fleet}
              open={openDriverTime}
            />
          </>
        )}
      </Box>
      <ShowPersonScoreModal
        show={openModal === "personScore"}
        onClose={toggleOpenModal}
      />

      <DriverReportModal
        open={openModal === "driverReport"}
        onClose={toggleOpenModal}
        data={driver}
      />
    </>
  );
};

const DriverTimeMonth = ({ row, open }) => {
  const calender = useMemo(() => {
    return Object.entries(row.timeline).map((item) => {
      const [day, requests] = item;

      return renderTimeCalender(day, requests);
    });
  }, []);

  return (
    <Collapse
      in={open}
      unmountOnExit
      sx={{ overflowX: "auto", cursor: "default" }}
    >
      <Box sx={{ margin: 1 }}>
        <Typography my={2} gutterBottom>
          تقویم راننده (ماه)
        </Typography>
        <Stack direction="row" justifyContent="space-between">
          {calender}
        </Stack>
      </Box>
    </Collapse>
  );
};

export default DriverItem;
