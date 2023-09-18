import { Typography, Grid, Button, Stack, Box } from "@mui/material";
import LoadingSpinner from "Components/versions/LoadingSpinner";

import SearchInput from "Components/SearchInput";
import { enToFaNumber, renderPlaqueObjectToString } from "Utility/utils";
import { Fragment, useEffect, useState } from "react";
import { useInfiniteVehicle, useVehicle } from "hook/useVehicle";
import { useInView } from "react-intersection-observer";

export default function SelectVehicle({ data, setData, outFilters = {} }) {
  const [filters, setFilters] = useState(outFilters);
  const { ref, inView } = useInView();
  const [searchVal, setSearchVal] = useState("");
  const {
    data: allVehicle,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteVehicle(filters);

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  const getVehicle = (value) => {
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
            placeholder="جستجو خودرو"
            onEnter={getVehicle}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {allVehicle?.pages[0].data.length !== 0 ? (
            allVehicle?.pages.map((page, i) => (
              <Fragment key={i}>
                {page?.data.map((vehicle) => {
                  return (
                    <Grid item xs={12}>
                      <Button
                        sx={{
                          p: 3,
                          width: "100%",
                          boxShadow: 1,
                        }}
                        variant={
                          (data?.id ?? data) === vehicle.id
                            ? "contained"
                            : "text"
                        }
                        color={
                          (data?.id ?? data) === vehicle.id
                            ? "primary"
                            : "secondary"
                        }
                        onClick={() => setData(vehicle)}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ width: "100%" }}
                        >
                          <Typography>{`${
                            renderPlaqueObjectToString(vehicle.plaque) || ""
                          }`}</Typography>
                          <Typography>{vehicle.vehicle_model.title}</Typography>
                          <Typography>
                            {vehicle.fleet?.code ?? "بدون ناوگان"}
                          </Typography>
                        </Stack>
                      </Button>
                    </Grid>
                  );
                })}
              </Fragment>
            ))
          ) : (
            // closeableVehicle.length > 0 ? (
            //   closeableVehicle.map((vehicle) => {
            //     return (
            //       <Grid item xs={12}>
            //         <Button
            //           sx={{
            //             p: 3,
            //             width: "100%",
            //             boxShadow: 1,
            //           }}
            //           variant={
            //             (data?.id ?? data) === vehicle.id ? "contained" : "text"
            //           }
            //           color={
            //             (data?.id ?? data) === vehicle.id
            //               ? "primary"
            //               : "secondary"
            //           }
            //           onClick={() => setData(vehicle)}
            //         >
            //           <Stack
            //             direction="row"
            //             justifyContent="space-between"
            //             sx={{ width: "100%" }}
            //           >
            //             <Typography>{`${
            //               renderPlaqueObjectToString(vehicle.plaque) || ""
            //             }`}</Typography>
            //             <Typography>{vehicle.vehicle_model.title}</Typography>
            //             <Typography>
            //               {vehicle.fleet?.code ?? "بدون ناوگان"}
            //             </Typography>
            //           </Stack>
            //         </Button>
            //       </Grid>
            //     );
            //   })

            <Typography pt={2} pl={2}>
              ی یافت نشد
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
