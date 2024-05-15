/* eslint-disable react-hooks/exhaustive-deps */
import { Typography, Grid, Button, Stack, Box } from "@mui/material";

import SearchInput from "Components/SearchInput";
import { renderMobileFormat } from "Utility/utils";
import { Fragment, useEffect, useState } from "react";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useInView } from "react-intersection-observer";
import { useInfiniteAccount } from "hook/useAccount";

export default function SelectAccount({
  data,
  setData,
  label,
  person_type,
  person_id,
}) {
  const [filters, setFilters] = useState({});
  const { ref, inView } = useInView();
  const [searchVal, setSearchVal] = useState("");
  const {
    data: allPersons,
    isLoading,
    isFetching,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteAccount({ ...filters, person_type, person_id });

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  const getPersons = (value) => {
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
            placeholder={` جستجو ${label}`}
            onEnter={getPersons}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {allPersons?.pages[0].items.data.length !== 0 ? (
            allPersons?.pages.map((page, i) => (
              <Fragment key={i}>
                {page?.items.data.map((person) => {
                  return (
                    <Grid item xs={12} md={4}>
                      <Button
                        sx={{
                          p: 3,
                          width: "100%",
                          boxShadow: 1,
                        }}
                        variant={
                          (data?.id ?? data) === person.id
                            ? "contained"
                            : "text"
                        }
                        color={
                          (data?.id ?? data) === person.id
                            ? "primary"
                            : "secondary"
                        }
                        onClick={() => setData(person)}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ width: "100%" }}
                        >
                          <Typography>{`${
                            person?.person?.name || ""
                          }`}</Typography>
                          <Typography>
                            {renderMobileFormat(person?.person?.mobile)}
                          </Typography>
                        </Stack>
                      </Button>
                    </Grid>
                  );
                })}
              </Fragment>
            ))
          ) : (
            <Typography pt={2} pl={2}>
              {label} یافت نشد
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
