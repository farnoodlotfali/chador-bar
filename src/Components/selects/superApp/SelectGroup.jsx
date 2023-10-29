import { Typography, Grid, Button, Stack, Box } from "@mui/material";

import SearchInput from "Components/SearchInput";
import { enToFaNumber, renderChip } from "Utility/utils";

import { Fragment, useEffect, useState } from "react";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useInView } from "react-intersection-observer";
import { useInfiniteSuperAppGroup } from "hook/useSuperAppGroup";

export default function SelectSuperAppGroup({ data, setData }) {
  const [filters, setFilters] = useState({});
  const { ref, inView } = useInView();
  const [searchVal, setSearchVal] = useState("");
  const {
    data: allSuperAppGroups,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSuperAppGroup(filters);

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  const getSuperAppGroups = (value) => {
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
            placeholder="جستجو گروه"
            onEnter={getSuperAppGroups}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {allSuperAppGroups?.pages[0].items.data.length !== 0 ? (
            allSuperAppGroups?.pages.map((page, i) => (
              <Fragment key={i}>
                {page?.items.data.map((group) => {
                  return (
                    <Grid item xs={12} md={4}>
                      <Button
                        sx={{
                          p: 3,
                          width: "100%",
                          boxShadow: 1,
                        }}
                        variant={
                          (data?.id ?? data) === group.id ? "contained" : "text"
                        }
                        color={
                          (data?.id ?? data) === group.id
                            ? "primary"
                            : "secondary"
                        }
                        onClick={() => setData(group)}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ width: "100%" }}
                          alignItems="center"
                        >
                          <Typography>{`${group.title || ""}`}</Typography>
                          <Typography>{renderChip(group.status)}</Typography>
                        </Stack>
                      </Button>
                    </Grid>
                  );
                })}
              </Fragment>
            ))
          ) : (
            <Typography pt={2} pl={2}>
              گروه یافت نشد
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
