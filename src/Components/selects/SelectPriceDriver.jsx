import { useState, useEffect, Fragment } from "react";
import {
  Typography,
  Grid,
  Box,
  Switch,
  FormControlLabel,
  Card,
  Stack,
} from "@mui/material";
import SearchInput from "Components/SearchInput";
import { useInfiniteDriver } from "hook/useDriver";
import DriverItem from "Components/choosers/driver/Item";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useInView } from "react-intersection-observer";
import { IOSSwitch } from "Components/switchField/IOSSwitch";
import SwitchWithLabel from "Components/switchField/SwitchWithLabel";
import { enToFaNumber, numberWithCommas } from "Utility/utils";

export default function SelectPriceDriver({
  data,
  setData,
  outFilters = {},
  timeLine,
  listDrivers = [],
}) {
  const [filters, setFilters] = useState(outFilters);
  const { ref, inView } = useInView();
  const [searchVal, setSearchVal] = useState("");
  const [showAllDrivers, setShowAllDrivers] = useState(false);

  const {
    data: allDrivers,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteDriver(filters, { enabled: showAllDrivers });

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  const getDrivers = (value) => {
    setFilters({ q: value });
  };

  // if api has got error
  if (isError) {
    return <div className="">error</div>;
  }

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <SearchInput
            sx={{ width: "100%" }}
            placeholder="جستجو راننده"
            onEnter={getDrivers}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
        <Grid item xs={true} />
        <Grid item xs={"auto"}>
          <SwitchWithLabel
            labelPlacement="start"
            label={"نمایش همه راننده‌ها"}
            labelSpacing={2}
            onChange={(e) => setShowAllDrivers(e.target.checked)}
            value={showAllDrivers}
          />
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        {showAllDrivers ? (
          <>
            <Grid container spacing={3}>
              {allDrivers?.pages[0].items.data.length !== 0 ? (
                allDrivers?.pages.map((page, i) => (
                  <Fragment key={i}>
                    {page?.items.data.map((driver) => {
                      return (
                        <Grid item xs={12} sm={6} md={4} key={driver.id}>
                          <DriverPriceItem
                            driver={driver}
                            data={data}
                            setData={setData}
                            showPrice={false}
                          />
                        </Grid>
                      );
                    })}
                  </Fragment>
                ))
              ) : (
                <Typography pt={2} pl={2}>
                  راننده ای یافت نشد
                </Typography>
              )}
            </Grid>
            {isFetchingNextPage || isLoading || isFetching ? (
              <LoadingSpinner />
            ) : (
              <div ref={ref} />
            )}
          </>
        ) : (
          <Grid container spacing={3}>
            {listDrivers.length ? (
              listDrivers.map((item) => {
                return (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <DriverPriceItem
                      driver={item}
                      data={data}
                      setData={setData}
                    />
                  </Grid>
                );
              })
            ) : (
              <Typography pt={2} pl={2}>
                راننده‌ای پیشنهاد نداده است
              </Typography>
            )}
          </Grid>
        )}
      </Box>
    </>
  );
}

const DriverPriceItem = ({ data, setData, driver, showPrice = true }) => {
  return (
    <Card
      onClick={() => setData(driver)}
      sx={{
        border: (theme) =>
          driver.id === data?.id && `2px solid ${theme.palette.primary.main}`,

        boxShadow: 2,
        borderRadius: 2,
        pt: 2,
        transition: "transform 0.3s",
        cursor: "pointer",
        ":hover": {
          transform: "scale(1.01)",
        },
      }}
    >
      <Stack spacing={1.5} textAlign="center">
        <Typography fontSize={18} fontWeight={600}>
          {(driver?.person?.first_name ?? "-") +
            " " +
            (driver?.person?.last_name ?? "")}
        </Typography>
        <Typography color="grey.600" variant="body2" letterSpacing={1}>
          {enToFaNumber(driver?.person?.mobile)}
        </Typography>
        {driver?.price ? (
          <Stack
            direction="row"
            justifyContent={"space-around"}
            bgcolor={"primary.main"}
            py={0.75}
            fontSize={12}
            color={(theme) => theme.palette.common.white}
            flexWrap="wrap"
            textAlign="center"
          >
            <Typography fontSize="inherit" variant="subtitle2">
              قیمت پیشنهادی
            </Typography>
            <Typography fontSize="inherit" variant="subtitle2">
              {numberWithCommas(driver?.price)} تومان
            </Typography>
          </Stack>
        ) : (
          <Typography
            py={0.75}
            fontSize={12}
            variant="subtitle2"
            textAlign="center"
            bgcolor={(theme) =>
              showPrice &&
              (theme.palette.mode === "light" ? "grey.300" : "grey.700")
            }
            fontWeight={500}
          >
            {showPrice && "بدون قیمت پیشنهادی"}
          </Typography>
        )}
      </Stack>
    </Card>
  );
};
