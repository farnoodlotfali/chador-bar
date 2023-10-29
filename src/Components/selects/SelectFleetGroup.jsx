import { useState } from "react";
import { Typography, Grid, Button, Stack, Box } from "@mui/material";

import SearchInput from "Components/SearchInput";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useFleetGroup } from "hook/useFleetGroup";

export default function SelectFleetGroup({ data, setData }) {
  const [filters, setFilters] = useState({});
  const [searchVal, setSearchVal] = useState("");
  const {
    data: allFleetGroups,
    isLoading,
    isFetching,
    isError,
  } = useFleetGroup(filters);
  const getFleetGroups = (value) => {
    setFilters({ q: value });
  };

  // if data is loading or fetching
  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }

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
            placeholder="جستجو گروه ناوگان"
            onEnter={getFleetGroups}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {allFleetGroups?.items?.data?.length > 0 ? (
            allFleetGroups?.items?.data?.map((fleetGroup) => {
              return (
                <Grid item xs={12} md={6}>
                  <Button
                    sx={{
                      p: 3,
                      width: "100%",
                      boxShadow: 1,
                    }}
                    variant={
                      (data?.id ?? data) === fleetGroup.id
                        ? "contained"
                        : "text"
                    }
                    color={
                      (data?.id ?? data) === fleetGroup.id
                        ? "primary"
                        : "secondary"
                    }
                    onClick={() => setData(fleetGroup)}
                  >
                    <Stack sx={{ width: "100%" }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{ width: "100%" }}
                      >
                        <Typography sx={{ fontWeight: "bold" }}>
                          نام گروه
                        </Typography>
                        <Typography>{fleetGroup?.name}</Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{ width: "100%", mt: 1 }}
                      >
                        <Typography sx={{ fontWeight: "bold" }}>
                          گروه ناوگان
                        </Typography>
                        <Typography>
                          {fleetGroup?.shipping_company?.name ?? "-"}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Button>
                </Grid>
              );
            })
          ) : (
            <Typography pt={2} pl={2}>
              گروه ناوگانی یافت نشد
            </Typography>
          )}
        </Grid>
      </Box>
    </>
  );
}
