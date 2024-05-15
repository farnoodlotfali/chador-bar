/* eslint-disable react-hooks/exhaustive-deps */
import { Typography, Grid, Button, Stack, Box, Tab } from "@mui/material";

import SearchInput from "Components/SearchInput";
import { enToFaNumber, handleDate, numberWithCommas } from "Utility/utils";
import { Fragment, useEffect, useState } from "react";
import LoadingSpinner from "Components/versions/LoadingSpinner";
import { useInView } from "react-intersection-observer";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useInfiniteContract } from "hook/useContract";
import { useInfiniteRequest } from "hook/useRequest";

export default function SelectItem({
  data,
  setData,
  itemType = 1,
  setItemType,
  labelName,
}) {
  const handleChange = (event, newValue) => {
    setItemType(newValue);
  };
  const ITEM_TYPES = [
    { title: "لیست قرارداد", id: 1 },
    { title: "لیست درخواست حمل", id: 2 },
  ];
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={itemType}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList variant="fullWidth" onChange={handleChange}>
            {ITEM_TYPES.map((item) => {
              return <Tab key={item.id} label={item.title} value={item.id} />;
            })}
          </TabList>
        </Box>
        <TabPanel value={1}>
          <ContractTab data={data} setData={setData} labelName={labelName} />
        </TabPanel>
        <TabPanel value={2}>
          <RequestTab data={data} setData={setData} labelName={labelName} />
        </TabPanel>
      </TabContext>
    </Box>
  );
}

const ContractTab = ({ data, setData, labelName }) => {
  const [filters, setFilters] = useState({});
  const { ref, inView } = useInView();
  const [searchVal, setSearchVal] = useState("");
  const {
    data: allCompanies,
    isLoading,
    isFetching,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteContract(filters);

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  const getCompanies = (value) => {
    setFilters({ q: value });
  };

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
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <SearchInput
            sx={{ width: "100%" }}
            placeholder={"جستجو قرارداد"}
            onEnter={getCompanies}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {allCompanies?.pages[0].items.data.length !== 0 ? (
            allCompanies?.pages.map((page, i) => (
              <Fragment key={i}>
                {page?.items.data.map((contract) => {
                  return (
                    <Grid item xs={12} md={12}>
                      <Button
                        sx={{
                          p: 3,
                          width: "100%",
                          boxShadow: 1,
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
              {labelName} یافت نشد
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
};

const RequestTab = ({ data, setData, labelName }) => {
  const [filters, setFilters] = useState({});
  const { ref, inView } = useInView();
  const [searchVal, setSearchVal] = useState("");
  const {
    data: allRequest,
    isLoading,
    isFetching,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteRequest(filters);

  // fetch next page when reaching to end of list
  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [inView]);

  const getPersons = (value) => {
    setFilters({ q: value });
  };

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
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <SearchInput
            sx={{ width: "100%" }}
            placeholder={`جستجو درخواست `}
            onEnter={getPersons}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Grid>
      </Grid>

      <Box sx={{ maxHeight: "300px", overflowY: "scroll", mt: 1, p: 3 }}>
        <Grid container spacing={2}>
          {allRequest?.pages[0]?.items?.data?.length !== 0 ? (
            allRequest?.pages?.map((page, i) => (
              <Fragment key={i}>
                {page?.items?.data?.map((request) => {
                  return (
                    <Grid item xs={12} md={12}>
                      <Button
                        sx={{
                          p: 3,
                          width: "100%",
                          boxShadow: 1,
                        }}
                        variant={
                          (data?.id ?? data) === request?.id
                            ? "contained"
                            : "text"
                        }
                        color={
                          (data?.id ?? data) === request?.id
                            ? "primary"
                            : "secondary"
                        }
                        onClick={() => setData(request)}
                      >
                        <Grid container spacing={2}>
                          {renderItem("کد", enToFaNumber(request?.code))}
                          {renderItem(
                            "صاحب بار",
                            `${
                              request?.owner?.first_name ??
                              request?.owner?.name ??
                              "فاقد نام"
                            } ${request?.owner?.last_name ?? ""}`
                          )}
                          {renderItem(
                            "زمان بارگیری",
                            handleDate(request?.load_time, "YYYY/MM/DD")
                          )}
                          {renderItem(
                            "زمان تخلیه",
                            handleDate(request?.discharge_time, "YYYY/MM/DD")
                          )}
                          {renderItem(
                            "شرکت حمل",
                            request?.shipping_company?.name ?? "-"
                          )}
                          {renderItem("راننده", request?.driver?.name ?? "-")}
                          {renderItem("محصول", request?.product?.title)}
                        </Grid>
                      </Button>
                    </Grid>
                  );
                })}
              </Fragment>
            ))
          ) : (
            <Typography pt={2} pl={2}>
              {labelName} یافت نشد
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
};
