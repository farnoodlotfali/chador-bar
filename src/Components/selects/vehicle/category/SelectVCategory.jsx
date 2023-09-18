import { Typography, Grid, Button, Stack, Box } from "@mui/material";

import SearchInput from "Components/SearchInput";
import { enToFaNumber } from "Utility/utils";
import { useState } from "react";
import { useVehicleCategory } from "hook/useVehicleCategory";
import LoadingSpinner from "Components/versions/LoadingSpinner";

export default function SelectVCategory({ data, setData }) {
  const [filters, setFilters] = useState({});
  const [searchVal, setSearchVal] = useState("");
  const {
    data: allVCategories,
    isLoading,
    isFetching,
    isError,
  } = useVehicleCategory(filters);
  const getVCategories = (value) => {
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

  const { data: closeableVCategories } = allVCategories;
  return (
    <>
      <Grid container>
        <Grid item xs={12} md={4}>
          <SearchInput
            sx={{ width: "100%" }}
            placeholder="جستجو دسته خودرو"
            onEnter={getVCategories}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {closeableVCategories.length > 0 ? (
            closeableVCategories.map((vCategory) => {
              return (
                <Grid item xs={12} md={4}>
                  <Button
                    sx={{
                      p: 3,
                      width: "100%",
                      boxShadow: 1,
                    }}
                    variant={
                      (data?.id ?? data) === vCategory.id ? "contained" : "text"
                    }
                    color={
                      (data?.id ?? data) === vCategory.id ? "primary" : "secondary"
                    }
                    onClick={() => setData(vCategory)}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ width: "100%" }}
                    >
                      <Typography>{`${vCategory.title || ""}`}</Typography>
                    </Stack>
                  </Button>
                </Grid>
              );
            })
          ) : (
            <Typography pt={2} pl={2}>
              نوع کامیون یافت نشد
            </Typography>
          )}
        </Grid>
      </Box>
    </>
  );
}
