/* eslint-disable react-hooks/exhaustive-deps */
import { Typography, Grid, Button, Stack, Box } from "@mui/material";

import SearchInput from "Components/SearchInput";
import { enToFaNumber } from "Utility/utils";
import { useInfiniteSalon } from "hook/useSalon";
import { Fragment, useEffect, useState } from "react";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useInView } from "react-intersection-observer";
import { GLOBAL_SALON } from "Components/choosers/ChooseSalon";

export default function SelectSalon({ data, setData }) {
  const [filters, setFilters] = useState({});
  const { ref, inView } = useInView();
  const [searchVal, setSearchVal] = useState("");
  const {
    data: allSalons,
    isLoading,
    isFetching,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSalon(filters);

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  const getSalons = (value) => {
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
            placeholder="جستجو سالن"
            onEnter={getSalons}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Button
              sx={{
                p: 3,
                width: "100%",
                boxShadow: 1,
              }}
              variant={
                (data?.id ?? data) === GLOBAL_SALON.id ||
                (data?.id ?? data) === null
                  ? "contained"
                  : "text"
              }
              color={
                (data?.id ?? data) === GLOBAL_SALON.id ||
                (data?.id ?? data) === null
                  ? "primary"
                  : "secondary"
              }
              onClick={() => setData(GLOBAL_SALON)}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ width: "100%" }}
              >
                <Typography>کد: {GLOBAL_SALON.id}</Typography>
                <Typography>سراسری</Typography>
              </Stack>
            </Button>
          </Grid>
          {allSalons?.pages?.[0]?.items.data.length !== 0 ? (
            allSalons?.pages.map((page, i) => (
              <Fragment key={i}>
                {page?.items.data.map((salon) => {
                  return (
                    <Grid item xs={12} md={4}>
                      <Button
                        sx={{
                          p: 3,
                          width: "100%",
                          boxShadow: 1,
                        }}
                        variant={
                          (data?.id ?? data) === salon.id ? "contained" : "text"
                        }
                        color={
                          (data?.id ?? data) === salon.id
                            ? "primary"
                            : "secondary"
                        }
                        onClick={() => setData(salon)}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ width: "100%" }}
                        >
                          <Typography>{`کد: ${
                            enToFaNumber(salon.id) || ""
                          }`}</Typography>
                          <Typography>{salon.name}</Typography>
                        </Stack>
                      </Button>
                    </Grid>
                  );
                })}
              </Fragment>
            ))
          ) : (
            <Typography pt={2} pl={2}>
              سالن یافت نشد
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
