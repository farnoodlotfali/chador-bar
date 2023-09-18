import { Typography, Grid, Button, Stack, Box } from "@mui/material";

import SearchInput from "Components/SearchInput";
import { useState } from "react";
import { useVehicleColor } from "hook/useVehicleColor";
import LoadingSpinner from "Components/versions/LoadingSpinner";

export default function SelectVColor({ data, setData }) {
  const [filters, setFilters] = useState({});
  const [searchVal, setSearchVal] = useState("");
  const {
    data: closeableVColors,
    isLoading,
    isFetching,
    isError,
  } = useVehicleColor(filters);
  const getVColors = (value) => {
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
            placeholder="جستجو رنگ خودرو"
            onEnter={getVColors}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {Object.entries(closeableVColors).length > 0 ? (
            Object.entries(closeableVColors).map((item) => {
              const [enColor, faColor] = item;

              return (
                <Grid item xs={12} md={4}>
                  <Button
                    sx={{
                      p: 3,
                      width: "100%",
                      boxShadow: 1,
                    }}
                    variant={(data ?? data) === enColor ? "contained" : "text"}
                    color={(data ?? data) === enColor ? "primary" : "secondary"}
                    onClick={() => setData(item)}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ width: "100%" }}
                    >
                      <Typography>{`${faColor || ""}`}</Typography>
                      <Box
                        width={25}
                        height={25}
                        bgcolor={enColor}
                        border={"1px solid"}
                      />
                    </Stack>
                  </Button>
                </Grid>
              );
            })
          ) : (
            <Typography pt={2} pl={2}>
              رنگی یافت نشد
            </Typography>
          )}
        </Grid>
      </Box>
    </>
  );
}
