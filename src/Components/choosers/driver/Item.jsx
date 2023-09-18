import {
  Typography,
  Stack,
  Box,
  IconButton,
  Collapse,
  Tooltip,
} from "@mui/material";
import { enToFaNumber, renderTimeCalender } from "Utility/utils";
import { useMemo, useState } from "react";
import { SvgSPrite } from "Components/SvgSPrite";

const DriverItem = ({ driver, data, setData, fleet, timeLine }) => {
  const [openDriverTime, setOpenDriverTime] = useState(false);

  return (
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
                    : "inherit",
              }}
            >
              {openDriverTime ? (
                <SvgSPrite icon="chevron-up" size="small" />
              ) : (
                <SvgSPrite icon="chevron-down" size="small" />
              )}
            </IconButton>
          </Tooltip>

          <DriverTimeMonth key={driver.id} row={fleet} open={openDriverTime} />
        </>
      )}
    </Box>
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
