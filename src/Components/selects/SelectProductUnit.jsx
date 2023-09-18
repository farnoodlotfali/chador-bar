import { Typography, Grid, Button, Stack, Box } from "@mui/material";

import SearchInput from "Components/SearchInput";
import { enToFaNumber } from "Utility/utils";
import { useProductUnit } from "hook/useProductUnit";
import { useState } from "react";
import LoadingSpinner from "Components/versions/LoadingSpinner";

export default function SelectProductUnit({ data, setData }) {
  const [filters, setFilters] = useState({});
  const [searchVal, setSearchVal] = useState("");
  const {
    data: allProductUnits,
    isLoading,
    isFetching,
    isError,
  } = useProductUnit(filters);
  const getProductUnits = (value) => {
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
  const { data: ProductUnits } = allProductUnits;
  return (
    <>
      <Grid container>
        <Grid item xs={12} md={4}>
          <SearchInput
            sx={{ width: "100%" }}
            placeholder="جستجو نوع دسته‌بندی"
            onEnter={getProductUnits}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {ProductUnits.length > 0 ? (
            ProductUnits.map((productUnit) => {
              return (
                <Grid item xs={12} md={3}>
                  <Button
                    sx={{
                      p: 3,
                      width: "100%",
                      boxShadow: 1,
                    }}
                    variant={
                      (data?.productUnit ?? data) === productUnit.id
                        ? "contained"
                        : "text"
                    }
                    color={
                      (data?.productUnit ?? data) === productUnit.id
                        ? "primary"
                        : "secondary"
                    }
                    onClick={() => setData(productUnit)}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ width: "100%" }}
                    >
                      <Typography>{productUnit.title || "فاقد نام"}</Typography>
                    </Stack>
                  </Button>
                </Grid>
              );
            })
          ) : (
            <Typography pt={2} pl={2}>
              دسته‌بندی یافت نشد
            </Typography>
          )}
        </Grid>
      </Box>
    </>
  );
}
