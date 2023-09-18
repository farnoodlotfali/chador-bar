/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, Fragment, useMemo } from "react";
import {
  Typography,
  Grid,
  Stack,
  Box,
  Collapse,
  IconButton,
  Tooltip,
} from "@mui/material";

import {
  enToFaNumber,
  renderChip,
  renderPlaqueObjectToString,
  renderTimeCalender,
} from "Utility/utils";
import { useInfiniteFleet } from "hook/useFleet";
import { useVehicleColor } from "hook/useVehicleColor";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useInView } from "react-intersection-observer";
import { SvgSPrite } from "Components/SvgSPrite";
export default function SelectFleet({ data, setData, searchFilter }) {
  const [filters, setFilters] = useState({});
  const { ref, inView } = useInView();
  const [openFleetTime, setOpenFleetTime] = useState(false);
  const {
    data: allFleets,
    isLoading,
    isFetching,
    isError,

    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteFleet({
    active: true,
    timeline: true,
    ...searchFilter,
  });

  const { data: colors } = useVehicleColor();

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  // if api has got error
  if (isError) {
    return <div className="">error</div>;
  }

  const renderItem = (title, value) => {
    return (
      <Grid item xs={12} sm={6} md={3}>
        <Stack spacing={1} direction="row">
          <Typography variant="caption" alignSelf={"center"} fontWeight={"700"}>
            {title}:
          </Typography>
          <Typography variant="caption">{value}</Typography>
        </Stack>
      </Grid>
    );
  };

  return (
    <>
      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container rowSpacing={3}>
          {allFleets?.pages[0].items?.data.length !== 0 ? (
            allFleets?.pages.map((page, i) => (
              <Fragment key={i}>
                {page?.items?.data.map((fleet) => {
                  return (
                    <Grid item xs={12} key={fleet.id}>
                      <Box
                        sx={{
                          boxShadow: 1,
                          cursor: "pointer",
                          bgcolor:
                            (data?.id ?? data) === fleet.id
                              ? "primary.main"
                              : "background.paper",
                          color: (theme) =>
                            (data?.id ?? data) === fleet.id
                              ? theme.palette.common.white
                              : "inherit",
                          borderRadius: 1,
                          p: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            p: 1,
                          }}
                          onClick={() => setData(fleet)}
                        >
                          <Grid container spacing={2} alignItems="center">
                            {renderItem("کد", enToFaNumber(fleet.code))}
                            {renderItem(
                              "تعداد رانندگان",
                              enToFaNumber(fleet.drivers.length)
                            )}
                            {renderItem("وضعیت", renderChip(fleet.status))}
                            {renderItem("استعلام", renderChip(fleet.inquiry))}

                            {renderItem(
                              "پلاک خودرو",
                              renderPlaqueObjectToString(fleet.vehicle?.plaque)
                            )}
                            {renderItem(
                              "رنگ خودرو",
                              colors[fleet?.vehicle?.color] &&
                                colors[fleet?.vehicle?.color]
                            )}
                          </Grid>
                        </Box>
                        <>
                          <Tooltip
                            title="مشاهده تقویم کاری ناوگان"
                            placement="left"
                            arrow
                          >
                            <IconButton
                              size="small"
                              onClick={() => {
                                setOpenFleetTime((prev) => !prev);
                              }}
                              sx={{
                                color: (theme) =>
                                  (data?.id ?? data) === fleet.id
                                    ? theme.palette.common.white
                                    : "inherit",
                              }}
                            >
                              {openFleetTime ? (
                                <SvgSPrite icon="chevron-up" size="small" />
                              ) : (
                                <SvgSPrite icon="chevron-down" size="small" />
                              )}
                            </IconButton>
                          </Tooltip>

                          <FleetTimeMonth
                            key={fleet.id}
                            row={fleet}
                            open={openFleetTime}
                          />
                        </>
                      </Box>
                    </Grid>
                  );
                })}
              </Fragment>
            ))
          ) : (
            <Typography pt={2} pl={2}>
              ناوگان یافت نشد
            </Typography>
          )}
        </Grid>

        {isFetchingNextPage || isLoading || isFetching ? (
          <LoadingSpinner />
        ) : (
          <div ref={ref} />
        )}
      </Box>
    </>
  );
}

const FleetTimeMonth = ({ row, open }) => {
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
          تقویم ناوگان (ماه)
        </Typography>
        <Stack direction="row" justifyContent="space-between">
          {calender}
        </Stack>
      </Box>
    </Collapse>
  );
};
