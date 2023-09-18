import { useState, useEffect } from "react";
import { Typography, Grid, Button, Stack, Box } from "@mui/material";

import SearchInput from "Components/SearchInput";
import { enToFaNumber } from "Utility/utils";
import { useShippingCompany } from "hook/useShippingCompany";
import LoadingSpinner from "Components/versions/LoadingSpinner";

export default function SelectShippingCompany({ data, setData }) {
  const [filters, setFilters] = useState({});
  const [searchVal, setSearchVal] = useState("");
  const {
    data: allShippingCompanies,
    isLoading,
    isFetching,
    isError,
  } = useShippingCompany(filters);
  const getShippingCompanies = (value) => {
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
  const { data: ShippingCompanies } = allShippingCompanies;
  return (
    <>
      <Grid container>
        <Grid item xs={12} md={4}>
          <SearchInput
            sx={{ width: "100%" }}
            placeholder="جستجو شرکت حمل"
            onEnter={getShippingCompanies}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {ShippingCompanies.length > 0 ? (
            ShippingCompanies.map((ShippingCompany) => {
              return (
                <Grid item xs={12} md={4}>
                  <Button
                    sx={{
                      p: 3,
                      width: "100%",
                      boxShadow: 1,
                    }}
                    variant={
                      (data?.id ?? data) === ShippingCompany.id
                        ? "contained"
                        : "text"
                    }
                    color={
                      (data?.id ?? data) === ShippingCompany.id
                        ? "primary"
                        : "secondary"
                    }
                    onClick={() => setData(ShippingCompany)}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ width: "100%" }}
                    >
                      <Typography>{`کد: ${
                        ShippingCompany.code || ""
                      }`}</Typography>
                      <Typography>
                        {enToFaNumber(ShippingCompany.name)}
                      </Typography>
                    </Stack>
                  </Button>
                </Grid>
              );
            })
          ) : (
            <Typography pt={2} pl={2}>
              راننده یافت نشد
            </Typography>
          )}
        </Grid>
      </Box>
    </>
  );
}
