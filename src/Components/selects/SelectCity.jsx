import { useState } from "react";
import { Typography, Grid, Button, Stack, Box } from "@mui/material";

import SearchInput from "Components/SearchInput";
import { useCity } from "hook/useCity";
import LoadingSpinner from "Components/versions/LoadingSpinner";

export default function SelectCity({ data, setData, provinceId }) {
  const [filters, setFilters] = useState({ province_id: provinceId });
  const [searchVal, setSearchVal] = useState("");
  const { data: allCities, isLoading, isFetching, isError } = useCity(filters);
  const getCities = (value) => {
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
            placeholder="جستجو شهر"
            onEnter={getCities}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {allCities.length > 0 ? (
            allCities.map((city) => {
              return (
                <Grid item xs={12} md={4}>
                  <Button
                    sx={{
                      p: 3,
                      width: "100%",
                      boxShadow: 1,
                    }}
                    variant={
                      (data?.id ?? data) === city.id ? "contained" : "text"
                    }
                    color={
                      (data?.id ?? data) === city.id ? "primary" : "secondary"
                    }
                    onClick={() => setData(city)}
                  >
                    <Grid container spacing={2}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{ width: "100%" }}
                      >
                        <Typography>{city.name}</Typography>
                      </Stack>
                    </Grid>
                  </Button>
                </Grid>
              );
            })
          ) : (
            <Typography pt={2} pl={2}>
              شهر یافت نشد
            </Typography>
          )}
        </Grid>
      </Box>
    </>
  );
}
