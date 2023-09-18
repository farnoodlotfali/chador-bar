import { Typography, Grid, Button, Stack, Box } from "@mui/material";

import SearchInput from "Components/SearchInput";
import { enToFaNumber } from "Utility/utils";
import { usePath } from "hook/usePath";
import { useState } from "react";
import LoadingSpinner from "Components/versions/LoadingSpinner";

export default function SelectPath({ data, setData }) {
  const [filters, setFilters] = useState({});
  const [searchVal, setSearchVal] = useState("");
  const { data: allPaths, isLoading, isFetching, isError } = usePath(filters);
  const getPaths = (value) => {
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

  const {
    paths: { data: closeablePaths },
  } = allPaths;
  return (
    <>
      <Grid container>
        <Grid item xs={12} md={4}>
          <SearchInput
            sx={{ width: "100%" }}
            placeholder="جستجو مسیر"
            onEnter={getPaths}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {closeablePaths.length > 0 ? (
            closeablePaths.map((path) => {
              return (
                <Grid item xs={12} md={4}>
                  <Button
                    sx={{
                      p: 3,
                      width: "100%",
                      boxShadow: 1,
                    }}
                    variant={
                      (data?.id ?? data) === path.id ? "contained" : "text"
                    }
                    color={
                      (data?.id ?? data) === path.id ? "primary" : "secondary"
                    }
                    onClick={() => setData(path)}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ width: "100%" }}
                    >
                      <Typography>{`${path.name || ""}`}</Typography>
                      <Typography>{enToFaNumber(path.code)}</Typography>
                    </Stack>
                  </Button>
                </Grid>
              );
            })
          ) : (
            <Typography pt={2} pl={2}>
              مسیری یافت نشد
            </Typography>
          )}
        </Grid>
      </Box>
    </>
  );
}
