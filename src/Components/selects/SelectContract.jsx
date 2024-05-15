/* eslint-disable react-hooks/exhaustive-deps */
import { Typography, Grid, Button, Stack, Box, Divider } from "@mui/material";

import SearchInput from "Components/SearchInput";
import { enToFaNumber, handleDate, numberWithCommas } from "Utility/utils";
import { useInfiniteContract } from "hook/useContract";
import { Fragment, useEffect, useState } from "react";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useInView } from "react-intersection-observer";
import { FormContainer, FormInputs } from "Components/Form";
import { ChooseOwner } from "Components/choosers/ChooseOwner";
import { useForm } from "react-hook-form";

export default function SelectContract({ data, setData }) {
  const [filters, setFilters] = useState({});
  const { ref, inView } = useInView();
  const [searchVal, setSearchVal] = useState("");
  const {
    data: allContracts,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteContract(filters);
  const { watch, control } = useForm();
  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  const getContracts = (value) => {
    setFilters({ q: value });
  };
  useEffect(() => {
    if (watch("owner")) {
      setFilters((prev) => ({ ...prev, owner_id: watch("owner")?.id }));
    }
  }, [watch("owner")]);
  // if api has got error
  if (isError) {
    return <div className="">error</div>;
  }

  const renderItem = (title, value, md = 3, xs = 6) => {
    return (
      <Grid item display="flex" gap={1} md={md} xs={xs}>
        <Typography fontWeight="bold" variant="subtitle2">
          {title}:
        </Typography>
        <Typography fontWeight="normal" variant="subtitle2">
          {value}
        </Typography>
      </Grid>
    );
  };
  const DataInputs = [
    {
      type: "custom",
      customView: <ChooseOwner control={control} name={"owner"} />,
    },
  ];
  return (
    <>
      <Grid container>
        <Grid item xs={12} md={4}>
          <SearchInput
            placeholder="جستجو قرارداد"
            onEnter={getContracts}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
        <Grid item xs={12} md={7} sx={{ mt: { xs: 2, md: 0 } }}>
          <FormContainer data={watch()}>
            <FormInputs gridProps={{ md: 6 }} inputs={DataInputs} />
          </FormContainer>
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "400px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {allContracts?.pages[0].items.data.length !== 0 ? (
            allContracts?.pages.map((page, i) => (
              <Fragment key={i}>
                {page?.items.data.map((contract) => {
                  return (
                    <Grid item xs={12} md={12}>
                      <Button
                        sx={{
                          p: 2,
                          width: "100%",
                          boxShadow: 1,
                          justifyContent: "start",
                        }}
                        variant={
                          (data?.id ?? data) === contract.id
                            ? "contained"
                            : "text"
                        }
                        color={
                          (data?.id ?? data) === contract.id
                            ? "primary"
                            : "secondary"
                        }
                        onClick={() => setData(contract)}
                      >
                        <Grid container spacing={2}>
                          {renderItem("کد", enToFaNumber(contract.code))}
                          {renderItem(
                            "صاحب بار",
                            `${
                              contract?.owner?.first_name ??
                              contract?.owner?.name ??
                              "فاقد نام"
                            } ${contract?.owner?.last_name ?? ""}`
                          )}
                          {renderItem(
                            "تاریخ شروع",
                            handleDate(contract.start_date, "YYYY/MM/DD")
                          )}
                          {renderItem(
                            "تاریخ پایان",
                            handleDate(contract.end_date, "YYYY/MM/DD")
                          )}
                          {renderItem(
                            "شرکت حمل",
                            contract.shipping_company?.name ?? "-"
                          )}
                          {renderItem(
                            "ارزش کل",
                            numberWithCommas(contract.total_amount) + " ریال"
                          )}
                          {renderItem(
                            "محصولات",
                            contract?.products
                              .map((product) => product.title)
                              .join(", "),
                            12,
                            12
                          )}
                        </Grid>
                      </Button>
                    </Grid>
                  );
                })}
              </Fragment>
            ))
          ) : (
            <Typography pt={2} pl={2}>
              قرارداد یافت نشد
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
