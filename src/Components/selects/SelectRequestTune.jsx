/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";

import SearchInput from "Components/SearchInput";
import { enToFaNumber, renderWeight, numberWithCommas } from "Utility/utils";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useInView } from "react-intersection-observer";
import { useInfiniteProjectTune } from "hook/useProjectTune";

export default function SelectRequestTune({ data, setData, outFilters }) {
  const [filters, setFilters] = useState(outFilters);
  const { ref, inView } = useInView();
  const [searchVal, setSearchVal] = useState("");
  const {
    data: allProjects,
    isLoading,
    isFetching,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProjectTune(filters);

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  const getProjects = (value) => {
    setFilters((prev) => ({ ...prev, q: value }));
  };

  // if api has got error
  if (isError) {
    return <div className="">error</div>;
  }

  const renderItem = (title, value) => {
    return (
      <Grid item xs={12} sm={6} md={3}>
        <Stack spacing={1} direction="row">
          <Typography variant="caption" fontWeight={"700"}>
            {title}:
          </Typography>
          <Typography variant="caption">{value}</Typography>
        </Stack>
      </Grid>
    );
  };
  return (
    <>
      <Grid container>
        <Grid item xs={12} md={4}>
          <SearchInput
            sx={{ width: "100%" }}
            placeholder="جستجو پروژه"
            onEnter={getProjects}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {allProjects?.pages?.[0]?.items.data.length !== 0 ? (
            allProjects?.pages.map((page, i) => (
              <Fragment key={i}>
                {page?.items.data.map((row) => {
                  return (
                    <Grid item xs={12} md={12}>
                      <Button
                        sx={{
                          p: 3,
                          width: "100%",
                          boxShadow: 1,
                        }}
                        variant={
                          (data?.id ?? data) === row.id ? "contained" : "text"
                        }
                        color={
                          (data?.id ?? data) === row.id
                            ? "primary"
                            : "secondary"
                        }
                        onClick={() => setData(row)}
                      >
                        <Grid container spacing={2}>
                          {renderItem("مبداء", row?.source_address)}
                          {renderItem("مقصد", row?.destination_address)}
                          {renderItem(
                            "قیمت",
                            enToFaNumber(numberWithCommas(row?.price)) + " ریال"
                          )}
                          {renderItem(
                            "نوع بارگیر",
                            row?.vehicle_type?.title ?? "-"
                          )}
                          {renderItem(
                            " تناژ باقیمانده",
                            renderWeight(row?.remaining_weight)
                          )}
                        </Grid>
                      </Button>
                    </Grid>
                  );
                })}
              </Fragment>
            ))
          ) : (
            <Typography pt={2} pl={2}>
              پروژه یافت نشد
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
