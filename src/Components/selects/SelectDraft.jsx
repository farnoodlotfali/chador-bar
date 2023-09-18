import { Typography, Grid, Button, Stack, Box } from "@mui/material";

import SearchInput from "Components/SearchInput";
import { enToFaNumber } from "Utility/utils";
import { useInfiniteDraft } from "hook/useDraft";
import { Fragment, useEffect, useState } from "react";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useInView } from "react-intersection-observer";

export default function SelectDraft({ data, setData }) {
  const [filters, setFilters] = useState({});
  const { ref, inView } = useInView();
  const [searchVal, setSearchVal] = useState("");
  const {
    data: allDrafts,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteDraft(filters);

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  const getDrafts = (value) => {
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
            placeholder="جستجو حواله"
            onEnter={getDrafts}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {allDrafts?.pages[0].items.data.length !== 0 ? (
            allDrafts?.pages.map((page, i) => (
              <Fragment key={i}>
                {page?.items.data.map((draft) => {
                  return (
                    <Grid item xs={12} md={12}>
                      <Button
                        sx={{
                          p: 3,
                          width: "100%",
                          boxShadow: 1,
                        }}
                        variant={
                          (data?.DraftNumber ?? data) === draft.DraftNumber
                            ? "contained"
                            : "text"
                        }
                        color={
                          (data?.DraftNumber ?? data) === draft.DraftNumber
                            ? "primary"
                            : "secondary"
                        }
                        onClick={() => setData(draft)}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ width: "100%" }}
                        >
                          <Typography>{`شماره حواله: ${
                            enToFaNumber(draft.DraftNumber) || "فاقد شماره"
                          }`}</Typography>{" "}
                          <Typography>{` کد رهگیری: ${
                            enToFaNumber(draft.TrackingCodeNumber) || "فاقد کد"
                          }`}</Typography>{" "}
                          <Typography>{` صاحب کالا: ${
                            draft.LoadOwnerName || "-"
                          }`}</Typography>
                        </Stack>
                      </Button>
                    </Grid>
                  );
                })}
              </Fragment>
            ))
          ) : (
            <Typography pt={2} pl={2}>
              حواله یافت نشد
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
