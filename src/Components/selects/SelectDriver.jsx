/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, Fragment } from "react";
import { Typography, Grid, Box } from "@mui/material";

import SearchInput from "Components/SearchInput";
import { useInfiniteDriver } from "hook/useDriver";
import DriverItem from "Components/choosers/driver/Item";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useInView } from "react-intersection-observer";

export default function SelectDriver({
  data,
  setData,
  outFilters = {},
  timeLine,
}) {
  const [filters, setFilters] = useState(outFilters);
  const { ref, inView } = useInView();
  const [searchVal, setSearchVal] = useState("");

  const {
    data: allDrivers,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteDriver(filters);

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
      <Grid container>
        <Grid item xs={12} md={4}>
          <SearchInput
            sx={{ width: "100%" }}
            placeholder="جستجو راننده"
            onEnter={getDrivers}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container rowSpacing={3}>
          {allDrivers?.pages[0].items.data.length !== 0 ? (
            allDrivers?.pages.map((page, i) => (
              <Fragment key={i}>
                {page?.items.data.map((driver) => {
                  return (
                    <Grid item xs={12} key={driver.id}>
                      <DriverItem
                        driver={driver}
                        data={data}
                        setData={setData}
                        timeLine={timeLine}
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
      </Box>
    </>
  );
}
