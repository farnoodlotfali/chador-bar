import { Fragment, useEffect, useState } from "react";
import { Typography, Grid, Button, Stack, Box } from "@mui/material";

import SearchInput from "Components/SearchInput";
import { enToFaNumber } from "Utility/utils";
import { useCustomer } from "hook/useCustomer";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useInfinitePerson } from "hook/usePerson";
import { useInView } from "react-intersection-observer";

export default function SelectCustomer({ data, setData }) {
  const [filters, setFilters] = useState({});
  const { ref, inView } = useInView();
  const [searchVal, setSearchVal] = useState("");
  const {
    data: allCustomers,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePerson(filters);

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  const getCustomers = (value) => {
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
            placeholder="جستجو صاحب بار"
            onEnter={getCustomers}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {allCustomers?.pages[0].items.data.length !== 0 ? (
            allCustomers?.pages.map((page, i) => (
              <Fragment key={i}>
                {page?.items.data.map((customer) => {
                  return (
                    <Grid item xs={12} md={4} key={customer.id}>
                      <Button
                        sx={{
                          p: 3,
                          width: "100%",
                          boxShadow: 1,
                        }}
                        variant={
                          (data?.id ?? data) === customer.id
                            ? "contained"
                            : "text"
                        }
                        color={
                          (data?.id ?? data) === customer.id
                            ? "primary"
                            : "secondary"
                        }
                        onClick={() => setData(customer)}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ width: "100%" }}
                        >
                          <Typography>{`${
                            (customer.first_name || "-") +
                            " " +
                            (customer.last_name || "")
                          }`}</Typography>
                          <Typography>
                            {enToFaNumber(customer.national_code) ?? "-"}
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
              صاحب باری یافت نشد
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
