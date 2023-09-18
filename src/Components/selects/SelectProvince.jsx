import { useState } from "react";
import { Typography, Grid, Button, Stack, Box } from "@mui/material";

import SearchInput from "Components/SearchInput";
import { useProvince } from "hook/useProvince";
import LoadingSpinner from "Components/versions/LoadingSpinner";

export default function SelectProvince({ data, setData }) {
  const [filters, setFilters] = useState({});
  const [searchVal, setSearchVal] = useState("");
  const {
    data: allProvinces,
    isLoading,
    isFetching,
    isError,
  } = useProvince(filters);
  const getProvinces = (value) => {
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
            placeholder="جستجو استان"
            onEnter={getProvinces}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {allProvinces.length > 0 ? (
            allProvinces.map((province) => {
              return (
                <Grid item xs={12} md={4}>
                  <Button
                    sx={{
                      p: 3,
                      width: "100%",
                      boxShadow: 1,
                    }}
                    variant={
                      (data?.id ?? data) === province.id ? "contained" : "text"
                    }
                    color={
                      (data?.id ?? data) === province.id
                        ? "primary"
                        : "secondary"
                    }
                    onClick={() => setData(province)}
                  >
                    <Grid container spacing={2}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{ width: "100%" }}
                      >
                        <Typography>{province.name}</Typography>
                      </Stack>
                    </Grid>
                  </Button>
                </Grid>
              );
            })
          ) : (
            <Typography pt={2} pl={2}>
              استان یافت نشد
            </Typography>
          )}
        </Grid>
      </Box>
    </>
  );
}
