import { Typography, Grid, Button, Stack, Box } from "@mui/material";

import SearchInput from "Components/SearchInput";
import { enToFaNumber } from "Utility/utils";
import { useState } from "react";
import { useVehicleBrand } from "hook/useVehicleBrand";
import LoadingSpinner from "Components/versions/LoadingSpinner";

export default function SelectVBrand({ data, setData }) {
  const [filters, setFilters] = useState({});
  const [searchVal, setSearchVal] = useState("");
  const {
    data: allVBrands,
    isLoading,
    isFetching,
    isError,
  } = useVehicleBrand(filters);
  const getVBrands = (value) => {
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

  const { data: closeableVBrands } = allVBrands;
  return (
    <>
      <Grid container>
        <Grid item xs={12} md={4}>
          <SearchInput
            sx={{ width: "100%" }}
            placeholder="جستجو برند خودرو"
            onEnter={getVBrands}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {closeableVBrands.length > 0 ? (
            closeableVBrands.map((vBrand) => {
              return (
                <Grid item xs={12} md={4}>
                  <Button
                    sx={{
                      p: 3,
                      width: "100%",
                      boxShadow: 1,
                    }}
                    variant={
                      (data?.id ?? data) === vBrand.id ? "contained" : "text"
                    }
                    color={
                      (data?.id ?? data) === vBrand.id ? "primary" : "secondary"
                    }
                    onClick={() => setData(vBrand)}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ width: "100%" }}
                    >
                      <Typography>{`${vBrand.title || ""}`}</Typography>
                      <Typography>{enToFaNumber(vBrand.code)}</Typography>
                    </Stack>
                  </Button>
                </Grid>
              );
            })
          ) : (
            <Typography pt={2} pl={2}>
              برندی یافت نشد
            </Typography>
          )}
        </Grid>
      </Box>
    </>
  );
}
