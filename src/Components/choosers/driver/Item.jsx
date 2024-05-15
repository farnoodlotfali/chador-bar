import {
  Typography,
  Stack,
  Box,
  IconButton,
  Collapse,
  Tooltip,
  Rating,
} from "@mui/material";
import {
  enToFaNumber,
  renderMobileFormat,
  renderTimeCalender,
  stopPropagate,
} from "Utility/utils";
import { useMemo, useState } from "react";
import { SvgSPrite } from "Components/SvgSPrite";
import ShowPersonScoreModal from "Components/modals/ShowPersonScoreModal";
import DriverReportModal from "Components/modals/DriverReportModal";
import { axiosApi } from "api/axiosApi";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "Components/versions/LoadingSpinner";

const DriverItem = ({ driver, data, setData, fleet, timeLine }) => {
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
          bgcolor:
            data?.id === driver?.account_id
              ? "primary.main"
              : "background.paper",
          color: (theme) =>
            data?.id === driver?.account_id
              ? theme.palette.common.white
              : "inherit",
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
              {driver?.person ? driver?.person?.first_name : driver?.first_name}{" "}
              {driver?.person ? driver?.person?.last_name : driver?.last_name}
            </Typography>
            <Typography>{renderMobileFormat(driver?.mobile)}</Typography>
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
                      data?.id === driver?.account_id ||
                      theme.palette.mode === "dark"
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
            <DriverTimeMonth key={driver?.account_id} data={data} row={fleet} />
          </>
        )}
      </Box>
      <ShowPersonScoreModal
        show={openModal === "personScore"}
        onClose={toggleOpenModal}
        dataId={driver?.account_id}
      />

      <DriverReportModal
        open={openModal === "driverReport"}
        onClose={toggleOpenModal}
        data={driver}
      />
    </>
  );
};

const DriverTimeMonth = ({ row, data }) => {
  const [openDriverTime, setOpenDriverTime] = useState(false);

  const {
    data: driverTimeline,
    isSuccess,
    isLoading,
    isFetching,
  } = useQuery(
    ["driver", "driver-timeline", row?.account_id],
    () =>
      axiosApi({ url: `/driver-timeline/${row.account_id}` }).then(
        (res) => res.data.Data.timeline
      ),
    {
      enabled: !!row?.account_id && openDriverTime,
    }
  );
  const calender = useMemo(() => {
    if (isSuccess) {
      return Object.entries(driverTimeline).map((item) => {
        const [day, requests] = item;

        return renderTimeCalender(day, requests);
      });
    }
  }, [isSuccess]);
  return (
    <>
      <Tooltip title="مشاهده تقویم کاری راننده" placement="left" arrow>
        <IconButton
          size="small"
          onClick={() => {
            setOpenDriverTime((prev) => !prev);
          }}
          sx={{
            color: (theme) =>
              (data?.id ?? data) === row.id
                ? theme.palette.common.white
                : "inherit",
          }}
        >
          {openDriverTime ? (
            <SvgSPrite icon="chevron-up" size="small" color="inherit" />
          ) : (
            <SvgSPrite icon="chevron-down" size="small" color="inherit" />
          )}
        </IconButton>
      </Tooltip>

      <Collapse
        in={openDriverTime}
        unmountOnExit
        sx={{ overflowX: "auto", cursor: "default" }}
      >
        <Box sx={{ margin: 1 }}>
          <Typography my={2} gutterBottom>
            تقویم راننده (ماه)
          </Typography>

          {isLoading || isFetching ? (
            <LoadingSpinner />
          ) : (
            <Stack direction="row" justifyContent="space-between">
              {calender}
            </Stack>
          )}
        </Box>
      </Collapse>
    </>
  );
};

export default DriverItem;
